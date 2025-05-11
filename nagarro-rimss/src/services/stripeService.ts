import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';

// Get Stripe publishable key from environment variables
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Initialize Stripe
let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Mock implementation of payment intent creation
export const createPaymentIntent = async (amount: number) => {
  // Mock response for demo purposes
  return {
    clientSecret: 'mock_client_secret',
    amount,
    currency: 'usd'
  };
};

// Mock implementation of payment success handler
export const handlePaymentSuccess = async () => {
  return {
    success: true,
    orderId: 'mock_order_' + Date.now()
  };
};
