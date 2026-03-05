import { VercelRequest, VercelResponse } from '@vercel/node';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '../_lib/firebase-admin.js';
import { verifyAdminAuth } from '../_lib/verify-auth.js';

const VALID_STATUSES = ['new', 'processing', 'shipped', 'delivered'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await verifyAdminAuth(req);
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { action, id, ...data } = req.body;

    if (!action || !id) {
      return res.status(400).json({ message: 'Missing action or id' });
    }

    switch (action) {
      case 'update-status': {
        const { status } = data;
        if (!status || !VALID_STATUSES.includes(status)) {
          return res.status(400).json({ message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
        }
        await adminDb.collection('b2c_leads').doc(id).update({
          status,
          updated_at: FieldValue.serverTimestamp(),
        });
        return res.status(200).json({ ok: true, message: 'Status updated' });
      }

      case 'update-tracking': {
        const { tracking_number } = data;
        await adminDb.collection('b2c_leads').doc(id).update({
          tracking_number: tracking_number || null,
          updated_at: FieldValue.serverTimestamp(),
        });
        return res.status(200).json({ ok: true, message: 'Tracking number updated' });
      }

      case 'update-notes': {
        const { notes } = data;
        await adminDb.collection('b2c_leads').doc(id).update({
          notes: notes || null,
          updated_at: FieldValue.serverTimestamp(),
        });
        return res.status(200).json({ ok: true, message: 'Notes updated' });
      }

      case 'delete': {
        const doc = await adminDb.collection('b2c_leads').doc(id).get();
        if (!doc.exists) {
          return res.status(404).json({ message: 'Lead not found' });
        }
        await adminDb.collection('b2c_leads').doc(id).delete();
        return res.status(200).json({ ok: true, message: 'Lead deleted' });
      }

      default:
        return res.status(400).json({ message: `Unknown action: ${action}` });
    }
  } catch (error: any) {
    console.error('Error in admin action:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
