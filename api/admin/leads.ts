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
    const {
      lead_type,
      status,
      search,
      page = '1',
      limit = '25',
      sort_by = 'created_at',
      sort_dir = 'desc',
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    // Fetch all docs and filter in-memory to avoid Firestore composite index requirements
    const snapshot = await adminDb.collection('b2c_leads').get();

    let leads = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email || '',
        full_name: data.full_name || null,
        lead_type: data.lead_type || '',
        source_page: data.source_page || '',
        website_type: data.website_type || '',
        metadata: data.metadata || {},
        status: data.status || 'new',
        tracking_number: data.tracking_number || null,
        notes: data.notes || null,
        created_at: data.created_at?.toDate?.()?.toISOString() || null,
        updated_at: data.updated_at?.toDate?.()?.toISOString() || null,
      };
    });

    // Filter by lead_type
    if (lead_type) {
      leads = leads.filter(l => l.lead_type === lead_type);
    }

    // Filter by status
    if (status) {
      leads = leads.filter(l => l.status === status);
    }

    // Sort in-memory
    leads.sort((a, b) => {
      const aVal = (a as any)[sort_by] || '';
      const bVal = (b as any)[sort_by] || '';
      if (sort_dir === 'asc') return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    });

    // Client-side search (Firestore doesn't support full-text search)
    if (search) {
      const searchLower = search.toLowerCase();
      leads = leads.filter(l =>
        (l.email && l.email.toLowerCase().includes(searchLower)) ||
        (l.full_name && l.full_name.toLowerCase().includes(searchLower)) ||
        (l.metadata?.recipient_name && l.metadata.recipient_name.toLowerCase().includes(searchLower))
      );
    }

    const total = leads.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedLeads = leads.slice(startIndex, startIndex + limitNum);

    return res.status(200).json({
      leads: paginatedLeads,
      total,
      page: pageNum,
      limit: limitNum,
      hasMore: startIndex + limitNum < total,
    });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
