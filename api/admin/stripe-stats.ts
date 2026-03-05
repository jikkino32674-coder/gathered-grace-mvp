import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { verifyAdminAuth } from '../_lib/verify-auth.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { typescript: true });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await verifyAdminAuth(req);
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const sevenDaysAgo = now - 7 * 24 * 60 * 60;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60;

    // Custom date range from query params
    const { start, end } = req.query as Record<string, string>;
    const customStart = start ? Math.floor(new Date(start).getTime() / 1000) : null;
    const customEnd = end ? Math.floor(new Date(end).getTime() / 1000) : null;

    // Fetch recent payments (using PaymentIntents — covers Checkout Sessions + invoices)
    const [balance, payments7d, payments30d, paymentsCustom] = await Promise.all([
      stripe.balance.retrieve(),
      fetchPayments(sevenDaysAgo, now),
      fetchPayments(thirtyDaysAgo, now),
      customStart && customEnd ? fetchPayments(customStart, customEnd) : Promise.resolve(null),
    ]);

    // Calculate revenue
    const revenue7d = sumPayments(payments7d);
    const revenue30d = sumPayments(payments30d);
    const revenueCustom = paymentsCustom ? sumPayments(paymentsCustom) : null;

    // Calculate AOV
    const aov7d = payments7d.length > 0 ? revenue7d / payments7d.length : 0;
    const aov30d = payments30d.length > 0 ? revenue30d / payments30d.length : 0;

    // Stripe balance (available + pending)
    const availableBalance = balance.available.reduce((sum, b) => sum + b.amount, 0);
    const pendingBalance = balance.pending.reduce((sum, b) => sum + b.amount, 0);

    return res.status(200).json({
      revenue7d: revenue7d / 100,
      revenue30d: revenue30d / 100,
      revenueCustom: revenueCustom !== null ? revenueCustom / 100 : null,
      orders7d: payments7d.length,
      orders30d: payments30d.length,
      aov7d: Math.round(aov7d) / 100,
      aov30d: Math.round(aov30d) / 100,
      availableBalance: availableBalance / 100,
      pendingBalance: pendingBalance / 100,
      totalBalance: (availableBalance + pendingBalance) / 100,
      currency: 'usd',
    });
  } catch (error: any) {
    console.error('Error fetching Stripe stats:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}

async function fetchPayments(startTs: number, endTs: number): Promise<Stripe.PaymentIntent[]> {
  const payments: Stripe.PaymentIntent[] = [];
  let hasMore = true;
  let startingAfter: string | undefined;

  while (hasMore) {
    const list = await stripe.paymentIntents.list({
      created: { gte: startTs, lte: endTs },
      limit: 100,
      ...(startingAfter && { starting_after: startingAfter }),
    });

    const succeeded = list.data.filter(p => p.status === 'succeeded');
    payments.push(...succeeded);

    hasMore = list.has_more;
    if (list.data.length > 0) {
      startingAfter = list.data[list.data.length - 1].id;
    } else {
      hasMore = false;
    }
  }

  return payments;
}

function sumPayments(payments: Stripe.PaymentIntent[]): number {
  return payments.reduce((sum, p) => sum + (p.amount_received || p.amount), 0);
}
