import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  FINAL_TRIP_BALANCE_DUE_DATE,
  FINAL_TRIP_BALANCE_DUE_LABEL,
  SECOND_TRIP_INSTALLMENT_DUE_DATE,
  SECOND_TRIP_INSTALLMENT_DUE_LABEL,
} from '@/config/site';
import { resolveCheckoutInstallmentPlan } from '@/booking/installment-plan';
import {
  computeCheckoutAmounts,
  normalizeRoomSpots,
  spotCountTotal,
  type CheckoutPaymentMethod,
  type InstallmentPlan,
} from '@/booking/pricing';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not properly configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      packageName,
      packageId,
      spots,
      buyerInfo,
      participants,
      totalAmount,
      participantCount,
      paymentMethod,
      installmentPlanCoupon,
    } = body;

    if (!buyerInfo.email || typeof buyerInfo.email !== 'string' || !buyerInfo.email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    if (!spots || typeof spots !== 'object') {
      return NextResponse.json({ error: 'Room selection is required' }, { status: 400 });
    }

    const paymentMethodNorm: CheckoutPaymentMethod =
      paymentMethod === 'bank_transfer' ? 'bank_transfer' : 'stripe';

    const installmentPlan: InstallmentPlan = resolveCheckoutInstallmentPlan(
      packageId,
      installmentPlanCoupon
    );

    const amounts = computeCheckoutAmounts(spots, paymentMethodNorm, { installmentPlan });

    if (amounts.totalPackageCents <= 0) {
      return NextResponse.json({ error: 'Select at least one spot' }, { status: 400 });
    }

    const expectedHeadcount = spotCountTotal(amounts.spots);
    const participantCountNum =
      typeof participantCount === 'number' && Number.isFinite(participantCount)
        ? Math.floor(participantCount)
        : Number(participantCount);

    if (
      !Number.isFinite(participantCountNum) ||
      participantCountNum < 1 ||
      participantCountNum !== expectedHeadcount
    ) {
      return NextResponse.json(
        { error: 'Participant count must match the number of spots selected' },
        { status: 400 }
      );
    }

    if (
      typeof totalAmount !== 'number' ||
      !Number.isFinite(totalAmount) ||
      totalAmount !== amounts.totalPackageCents
    ) {
      return NextResponse.json(
        { error: 'Package total is out of date. Please refresh the page and try again.' },
        { status: 400 }
      );
    }

    const installmentDates: Date[] =
      installmentPlan === 'three'
        ? [SECOND_TRIP_INSTALLMENT_DUE_DATE, FINAL_TRIP_BALANCE_DUE_DATE]
        : [FINAL_TRIP_BALANCE_DUE_DATE];

    const baseAmount = amounts.depositCents;
    const processingFee = amounts.processingFeeCents;
    const totalChargeAmount = amounts.totalChargeCents;

    const depositTitle =
      installmentPlan === 'three'
        ? `${packageName} — 1st installment (⅓)`
        : `${packageName} — 50% deposit`;
    const depositDescription =
      installmentPlan === 'three'
        ? `First of three equal installments for ${participantCountNum} ${participantCountNum === 1 ? 'person' : 'people'}. Next: ${SECOND_TRIP_INSTALLMENT_DUE_LABEL}; then ${FINAL_TRIP_BALANCE_DUE_LABEL}.`
        : `50% deposit for ${participantCountNum} ${participantCountNum === 1 ? 'person' : 'people'}. Remaining balance due ${FINAL_TRIP_BALANCE_DUE_LABEL}.`;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: depositTitle,
            description: depositDescription,
          },
          unit_amount: baseAmount,
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Processing Fee',
            description: `Stripe processing fee for ${paymentMethodNorm === 'bank_transfer' ? 'bank transfer' : 'card payment'}`,
          },
          unit_amount: processingFee,
        },
        quantity: 1,
      },
    ];

    const successEnv = process.env.STRIPE_SUCCESS_URL;
    const cancelEnv = process.env.STRIPE_CANCEL_URL;
    const isAbsolute = (u: string | undefined) => !!u && (u.startsWith('http://') || u.startsWith('https://'));

    let successUrl: string;
    let cancelUrl: string;
    if (isAbsolute(successEnv) && isAbsolute(cancelEnv)) {
      successUrl = successEnv!;
      cancelUrl = cancelEnv!;
    } else {
      const host = request.headers.get('host') || 'localhost:3000';
      const proto = request.headers.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
      const base = `${proto}://${host}`;
      successUrl = isAbsolute(successEnv) ? successEnv! : `${base}/booking-success`;
      cancelUrl = isAbsolute(cancelEnv) ? cancelEnv! : base;
    }
    const successUrlWithSession = successUrl.includes('?')
      ? `${successUrl}&session_id={CHECKOUT_SESSION_ID}`
      : `${successUrl}?session_id={CHECKOUT_SESSION_ID}`;

    const paymentMethodTypes: ('card' | 'us_bank_account' | 'link')[] =
      paymentMethodNorm === 'bank_transfer' ? ['card', 'us_bank_account', 'link'] : ['card', 'link'];

    const spotsNorm = normalizeRoomSpots(spots);

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: paymentMethodTypes,
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrlWithSession,
      cancel_url: cancelUrl,
      customer_email: buyerInfo.email,
      metadata: {
        packageName,
        packageId,
        dualSpots: spotsNorm.dual.toString(),
        tripleSpots: spotsNorm.triple.toString(),
        quadSpots: spotsNorm.quad.toString(),
        totalSpots: expectedHeadcount.toString(),
        participantCount: participantCountNum.toString(),
        participantNames: Array.isArray(participants)
          ? participants
              .map((p: { firstName: string; lastName: string }) => `${p.firstName} ${p.lastName}`)
              .join(', ')
          : '',
        buyerName: `${buyerInfo.firstName} ${buyerInfo.lastName}`,
        buyerEmail: buyerInfo.email,
        buyerPhone: buyerInfo.phone,
        installmentDates: installmentDates.map((date) => date.toISOString()).join(','),
        futureInstallmentAmountsCents: amounts.futureInstallmentAmountsCents.join(','),
        paymentInstallmentPlan: installmentPlan,
        totalPackagePrice: amounts.totalPackageCents.toString(),
        totalAmount: totalChargeAmount.toString(),
        depositAmount: baseAmount.toString(),
        processingFee: processingFee.toString(),
        remainingAmount: amounts.balanceCents.toString(),
        paymentType: 'deposit_only',
        paymentMethod: paymentMethodNorm,
      },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: [
          'US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'IE',
          'PT', 'LU', 'MT', 'CY', 'EE', 'LV', 'LT', 'SI', 'SK', 'CZ', 'HU', 'PL', 'RO', 'BG', 'HR', 'GR',
        ],
      },
      allow_promotion_codes: true,
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
