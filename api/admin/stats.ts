import { VercelRequest, VercelResponse } from '@vercel/node';
import { adminDb } from '../_lib/firebase-admin.js';
import { verifyAdminAuth } from '../_lib/verify-auth.js';

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
    const snapshot = await adminDb.collection('b2c_leads').get();

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const ORDER_TYPES = [
      'rest_kit_form', 'reflect_kit_form', 'restore_kit_form',
      'custom_care_form', 'build_custom_kit',
      'gathered_grace_gift_box_form', 'lavender_eye_pillow_form',
      'handmade_balm_form', 'journal_pen_form',
    ];

    const EXCLUDED_TYPES = ['test_firebase_connection'];

    const CONTACT_TYPES = ['email_signup', 'discount_popup'];

    const byType: Record<string, number> = {};
    // byStatus only counts ORDER types
    const byStatus: Record<string, number> = { new: 0, processing: 0, shipped: 0, delivered: 0 };
    let last7Days = 0;
    let last30Days = 0;
    let totalOrders = 0;
    let totalContacts = 0;

    // Daily counts for chart (last 14 days) — orders only
    const dailyCounts: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      dailyCounts[d.toISOString().split('T')[0]] = 0;
    }

    const recentLeads: any[] = [];

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const leadType = data.lead_type || 'unknown';
      const status = data.status || 'new';
      const createdAt = data.created_at?.toDate?.();

      // Skip test/excluded entries entirely
      if (EXCLUDED_TYPES.includes(leadType)) return;

      byType[leadType] = (byType[leadType] || 0) + 1;

      if (CONTACT_TYPES.includes(leadType)) {
        totalContacts++;
      }

      if (ORDER_TYPES.includes(leadType)) {
        totalOrders++;
        byStatus[status] = (byStatus[status] || 0) + 1;

        if (createdAt) {
          if (createdAt >= sevenDaysAgo) last7Days++;
          if (createdAt >= thirtyDaysAgo) last30Days++;

          const dateKey = createdAt.toISOString().split('T')[0];
          if (dateKey in dailyCounts) {
            dailyCounts[dateKey]++;
          }
        }

        recentLeads.push({
          id: doc.id,
          email: data.email || '',
          full_name: data.full_name || null,
          lead_type: leadType,
          status,
          metadata: data.metadata || {},
          created_at: createdAt?.toISOString() || null,
        });
      }
    });

    // Sort recent leads by date and take top 5
    recentLeads.sort((a, b) => {
      const aDate = a.created_at || '';
      const bDate = b.created_at || '';
      return bDate > aDate ? 1 : bDate < aDate ? -1 : 0;
    });
    const topRecentLeads = recentLeads.slice(0, 5);

    const totalLeads = Object.values(byType).reduce((sum, count) => sum + count, 0);

    return res.status(200).json({
      totalLeads,
      totalOrders,
      totalContacts,
      byType,
      byStatus,
      last7Days,
      last30Days,
      dailyCounts,
      recentLeads: topRecentLeads,
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
