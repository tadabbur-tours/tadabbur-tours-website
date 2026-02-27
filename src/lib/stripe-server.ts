import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const STRIPE_API_VERSION = '2025-09-30.clover' as const;

let stripeInstance: Stripe | null = null;

/**
 * Server-side Stripe instance. Use in API routes only.
 * Returns null if STRIPE_SECRET_KEY is not set (e.g. build time).
 */
export function getStripe(): Stripe | null {
  if (typeof process.env.STRIPE_SECRET_KEY !== 'string' || !process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: STRIPE_API_VERSION,
    });
  }
  return stripeInstance;
}

export function getStripeWebhookSecret(): string | null {
  return process.env.STRIPE_WEBHOOK_SECRET ?? null;
}

/**
 * Use in API routes when Stripe is required. Returns a 500 JSON response if not configured.
 */
export function requireStripe(): { stripe: Stripe } | { error: NextResponse } {
  const stripe = getStripe();
  if (!stripe) {
    return {
      error: NextResponse.json(
        { error: 'Stripe is not properly configured' },
        { status: 500 }
      ),
    };
  }
  return { stripe };
}

/**
 * Use in webhook route when both Stripe and webhook secret are required.
 */
export function requireStripeAndWebhook(): { stripe: Stripe; webhookSecret: string } | { error: NextResponse } {
  const stripe = getStripe();
  const webhookSecret = getStripeWebhookSecret();
  if (!stripe || !webhookSecret) {
    return {
      error: NextResponse.json(
        { error: 'Stripe is not properly configured' },
        { status: 500 }
      ),
    };
  }
  return { stripe, webhookSecret };
}
