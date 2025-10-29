import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);
  
  // Save booking to database
  const bookingData = {
    sessionId: session.id,
    packageName: session.metadata?.packageName,
    packageId: session.metadata?.packageId,
    spots: {
      dual: parseInt(session.metadata?.dualSpots || '0'),
      triple: parseInt(session.metadata?.tripleSpots || '0'),
      quad: parseInt(session.metadata?.quadSpots || '0')
    },
    buyerInfo: {
      firstName: session.metadata?.buyerName?.split(' ')[0] || '',
      lastName: session.metadata?.buyerName?.split(' ').slice(1).join(' ') || '',
      email: session.customer_email || session.metadata?.buyerEmail || '',
      phone: session.metadata?.buyerPhone || ''
    },
    participants: session.metadata?.participantNames?.split(', ') || [],
    paymentStatus: 'deposit_paid',
    paymentType: 'deposit_only',
    totalAmount: parseInt(session.metadata?.totalAmount || '0'),
    installmentDates: session.metadata?.installmentDates?.split(',') || [],
    createdAt: new Date().toISOString(),
    stripeSessionId: session.id
  };

  // Here you would save to your database
  // For now, we'll just log it
  console.log('Booking data to save:', bookingData);
  
  // TODO: Save to database
  // await saveBooking(bookingData);
  
  // TODO: Send confirmation email
  // await sendBookingConfirmationEmail(bookingData);
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);
  
  // TODO: Update booking status if this is an installment payment
  // await updateBookingPaymentStatus(paymentIntent.metadata?.bookingId, 'installment_paid');
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id);
  
  // TODO: Handle failed payment
  // await handleFailedPayment(paymentIntent.metadata?.bookingId);
}
