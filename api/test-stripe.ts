import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const hasKey = !!process.env.STRIPE_SECRET_KEY;
  const keyPrefix = process.env.STRIPE_SECRET_KEY?.substring(0, 7) || 'none';

  let stripeTest = null;
  let stripeError = null;

  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-06-20',
        timeout: 30000,
        maxNetworkRetries: 3,
      });

      // Try to retrieve account info (simple API call)
      const account = await stripe.accounts.retrieve();
      stripeTest = {
        success: true,
        accountId: account.id,
        country: account.country,
      };
    } catch (error: any) {
      stripeError = {
        type: error.type,
        code: error.code,
        message: error.message,
      };
    }
  }

  return res.status(200).json({
    hasStripeKey: hasKey,
    keyPrefix: keyPrefix,
    nodeVersion: process.version,
    env: process.env.NODE_ENV,
    stripeTest,
    stripeError,
  });
}
