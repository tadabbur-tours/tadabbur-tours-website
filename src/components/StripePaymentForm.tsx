'use client';

import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

interface PaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

// Payment Form Component
function CheckoutForm({ onSuccess, onError }: Omit<PaymentFormProps, 'clientSecret'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking-success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message || 'An unexpected error occurred.');
      onError(error.message || 'Payment failed');
      setIsProcessing(false);
    } else {
      setMessage('Payment successful!');
      onSuccess();
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element */}
      <div className="bg-white rounded-lg">
        <PaymentElement 
          options={{
            layout: {
              type: 'accordion',
              defaultCollapsed: false,
              radios: false,
              spacedAccordionItems: true
            },
            wallets: {
              applePay: 'auto',
              googlePay: 'auto'
            },
            fields: {
              billingDetails: {
                name: 'auto',
                email: 'auto',
                phone: 'auto',
                address: {
                  country: 'auto',
                  postalCode: 'auto'
                }
              }
            }
          }}
        />
      </div>

      {/* Error Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successful') 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Processing Payment...
          </span>
        ) : (
          'Pay Now'
        )}
      </button>
    </form>
  );
}

// Main Stripe Payment Form Component with Elements Provider
export default function StripePaymentForm({ clientSecret, onSuccess, onError }: PaymentFormProps) {
  if (!stripePromise) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-semibold text-red-800 mb-2">Payment Configuration Error</h3>
        <p className="text-red-700 text-sm">
          Stripe is not properly configured. Please contact support to complete your booking.
        </p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Appearance customization for Stripe Elements
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#10b981',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'var(--font-neue-plak), system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
      fontSizeBase: '14px'
    },
    rules: {
      '.Input': {
        border: '1px solid #d1d5db',
        boxShadow: 'none',
        padding: '10px 12px'
      },
      '.Input:focus': {
        border: '1px solid #10b981',
        boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)'
      },
      '.Label': {
        fontWeight: '500',
        fontSize: '14px',
        marginBottom: '6px'
      }
    }
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="w-full">
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm onSuccess={onSuccess} onError={onError} />
      </Elements>
    </div>
  );
}

