import { VercelRequest, VercelResponse } from '@vercel/node';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '../_lib/firebase-admin.js';
import { verifyAdminAuth } from '../_lib/verify-auth.js';

const VALID_STATUSES = ['new', 'processing', 'shipped', 'delivered'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await verifyAdminAuth(req);
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ message: 'Missing id or status' });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    await adminDb.collection('b2c_leads').doc(id).update({
      status,
      updated_at: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ ok: true, message: 'Status updated' });
  } catch (error: any) {
    console.error('Error updating status:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
