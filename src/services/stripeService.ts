import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export const createPaymentIntent = async (amount: number) => {
  return { clientSecret: 'mock_client_secret', amount, currency: 'usd' };
};

export const handlePaymentSuccess = async () => {
  return { success: true, orderId: 'mock_order_' + Date.now() };
};
