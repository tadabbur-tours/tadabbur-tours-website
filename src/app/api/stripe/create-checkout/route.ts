import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Only initialize Stripe if we have the secret key (not during build time)
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is properly configured
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
      paymentMethod
    } = body;

    // Debug logging
    console.log('Received booking data:', {
      packageName,
      buyerInfo,
      totalAmount,
      participantCount
    });

    // Validate email
    if (!buyerInfo.email || typeof buyerInfo.email !== 'string' || !buyerInfo.email.includes('@')) {
      console.error('Invalid email:', buyerInfo.email);
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Calculate payment schedule
    const now = new Date();
    const isBeforeDec1 = now < new Date(now.getFullYear(), 11, 1); // December 1st
    
    let installmentDates: Date[] = [];
    
    if (isBeforeDec1) {
      // Before Dec 1st: Jan 1st, Feb 1st, Mar 1st
      const nextYear = now.getFullYear() + 1;
      installmentDates = [
        new Date(nextYear, 0, 1), // Jan 1st
        new Date(nextYear, 1, 1), // Feb 1st
        new Date(nextYear, 2, 1)  // Mar 1st
      ];
    } else {
      // After Dec 1st: Monthly on signup date
      const signupDay = now.getDate();
      installmentDates = [
        new Date(now.getFullYear() + 1, 0, signupDay), // Next month
        new Date(now.getFullYear() + 1, 1, signupDay), // Month after
        new Date(now.getFullYear() + 1, 2, signupDay)  // Month after that
      ];
    }

    // Calculate Stripe processing fees
    // Stripe fees: 2.9% + $0.30 for cards, 0.8% for ACH (capped at $5)
    const baseAmount = 75000; // $750 in cents
    const cardFeeRate = 0.029; // 2.9%
    const cardFixedFee = 30; // $0.30 in cents
    const achFeeRate = 0.008; // 0.8%
    const achMaxFee = 500; // $5.00 in cents
    
    // Calculate fees based on payment method
    let processingFee = 0;
    if (paymentMethod === 'bank_transfer') {
      // For bank transfers, use ACH fee rate
      processingFee = Math.min(Math.round(baseAmount * achFeeRate), achMaxFee);
    } else {
      // For cards, use card fee rate + fixed fee
      processingFee = Math.round(baseAmount * cardFeeRate) + cardFixedFee;
    }
    
    const totalChargeAmount = baseAmount + processingFee;

    // Create line items for the checkout session - DEPOSIT + PROCESSING FEE
    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${packageName} - Deposit`,
            description: `Deposit for ${participantCount} ${participantCount === 1 ? 'person' : 'people'}. Installments will be sent separately.`,
          },
          unit_amount: baseAmount, // $750 in cents
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Processing Fee',
            description: `Stripe processing fee for ${paymentMethod === 'bank_transfer' ? 'bank transfer' : 'card payment'}`,
          },
          unit_amount: processingFee, // Processing fee in cents
        },
        quantity: 1,
      }
    ];

    // Note: We're NOT adding installment line items here
    // Installments will be handled separately via payment links or future checkout sessions

    // Configure payment method types based on selection
    const paymentMethodTypes: ('card' | 'us_bank_account' | 'link')[] = paymentMethod === 'bank_transfer' 
      ? ['card', 'us_bank_account', 'link'] // ACH, wire transfer, and other bank methods
      : ['card', 'link']; // Card and Link payments

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      customer_email: buyerInfo.email,
      metadata: {
        packageName,
        packageId,
        dualSpots: spots.dual.toString(),
        tripleSpots: spots.triple.toString(),
        quadSpots: spots.quad.toString(),
        totalSpots: (spots.dual + spots.triple + spots.quad).toString(),
        participantCount: participantCount.toString(),
        participantNames: participants.map((p: { firstName: string; lastName: string }) => `${p.firstName} ${p.lastName}`).join(', '),
        buyerName: `${buyerInfo.firstName} ${buyerInfo.lastName}`,
        buyerEmail: buyerInfo.email,
        buyerPhone: buyerInfo.phone,
        installmentDates: installmentDates.map(date => date.toISOString()).join(','),
        totalAmount: totalChargeAmount.toString(),
        depositAmount: baseAmount.toString(), // $750 in cents
        processingFee: processingFee.toString(),
        remainingAmount: (totalChargeAmount - baseAmount).toString(),
        paymentType: 'deposit_only',
        paymentMethod: paymentMethod
      },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'LU', 'MT', 'CY', 'EE', 'LV', 'LT', 'SI', 'SK', 'CZ', 'HU', 'PL', 'RO', 'BG', 'HR', 'GR'],
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
