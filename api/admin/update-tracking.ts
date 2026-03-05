import { VercelRequest, VercelResponse } from '@vercel/node';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '../_lib/firebase-admin.js';
import { verifyAdminAuth } from '../_lib/verify-auth.js';

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
    const { id, tracking_number } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Missing id' });
    }

    await adminDb.collection('b2c_leads').doc(id).update({
      tracking_number: tracking_number || null,
      updated_at: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ ok: true, message: 'Tracking number updated' });
  } catch (error: any) {
    console.error('Error updating tracking:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
