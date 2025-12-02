import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const hasKey = !!process.env.STRIPE_SECRET_KEY;
  const keyPrefix = process.env.STRIPE_SECRET_KEY?.substring(0, 7) || 'none';

  return res.status(200).json({
    hasStripeKey: hasKey,
    keyPrefix: keyPrefix,
    nodeVersion: process.version,
    env: process.env.NODE_ENV,
  });
}
