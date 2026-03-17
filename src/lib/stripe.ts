import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('ERR_STRIPE_KEY_MISSING: STRIPE_SECRET_KEY environment variable is not set');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-02-25.clover',
    });
  }
  return stripeInstance;
}
