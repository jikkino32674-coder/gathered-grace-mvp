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

    // Fetch all paid invoices and balance in parallel
    const [balance, allPaidInvoices] = await Promise.all([
      stripe.balance.retrieve(),
      fetchPaidInvoices(),
    ]);

    // Filter by time periods
    const invoices7d = allPaidInvoices.filter(inv => (inv.status_transitions?.paid_at || 0) >= sevenDaysAgo);
    const invoices30d = allPaidInvoices.filter(inv => (inv.status_transitions?.paid_at || 0) >= thirtyDaysAgo);
    const invoicesCustom = customStart && customEnd
      ? allPaidInvoices.filter(inv => {
          const paidAt = inv.status_transitions?.paid_at || 0;
          return paidAt >= customStart && paidAt <= customEnd;
        })
      : null;

    // Calculate revenue (amount_paid is already in cents)
    const revenue7d = sumInvoices(invoices7d);
    const revenue30d = sumInvoices(invoices30d);
    const revenueAllTime = sumInvoices(allPaidInvoices);
    const revenueCustom = invoicesCustom ? sumInvoices(invoicesCustom) : null;

    // Calculate AOV
    const aov7d = invoices7d.length > 0 ? revenue7d / invoices7d.length : 0;
    const aov30d = invoices30d.length > 0 ? revenue30d / invoices30d.length : 0;
    const aovAllTime = allPaidInvoices.length > 0 ? revenueAllTime / allPaidInvoices.length : 0;

    // Stripe balance (available + pending)
    const availableBalance = balance.available.reduce((sum, b) => sum + b.amount, 0);
    const pendingBalance = balance.pending.reduce((sum, b) => sum + b.amount, 0);

    return res.status(200).json({
      revenue7d: revenue7d / 100,
      revenue30d: revenue30d / 100,
      revenueAllTime: revenueAllTime / 100,
      revenueCustom: revenueCustom !== null ? revenueCustom / 100 : null,
      orders7d: invoices7d.length,
      orders30d: invoices30d.length,
      ordersAllTime: allPaidInvoices.length,
      aov7d: Math.round(aov7d) / 100,
      aov30d: Math.round(aov30d) / 100,
      aovAllTime: Math.round(aovAllTime) / 100,
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

async function fetchPaidInvoices(): Promise<Stripe.Invoice[]> {
  const invoices: Stripe.Invoice[] = [];
  let hasMore = true;
  let startingAfter: string | undefined;

  while (hasMore) {
    const list = await stripe.invoices.list({
      status: 'paid',
      limit: 100,
      ...(startingAfter && { starting_after: startingAfter }),
    });

    invoices.push(...list.data);

    hasMore = list.has_more;
    if (list.data.length > 0) {
      startingAfter = list.data[list.data.length - 1].id;
    } else {
      hasMore = false;
    }
  }

  return invoices;
}

function sumInvoices(invoices: Stripe.Invoice[]): number {
  return invoices.reduce((sum, inv) => sum + (inv.amount_paid || 0), 0);
}
