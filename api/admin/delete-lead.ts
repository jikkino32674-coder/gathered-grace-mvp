import { VercelRequest, VercelResponse } from '@vercel/node';
import { adminDb } from '../_lib/firebase-admin.js';
import { verifyAdminAuth } from '../_lib/verify-auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await verifyAdminAuth(req);
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Missing id' });
    }

    const doc = await adminDb.collection('b2c_leads').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await adminDb.collection('b2c_leads').doc(id).delete();

    return res.status(200).json({ ok: true, message: 'Lead deleted' });
  } catch (error: any) {
    console.error('Error deleting lead:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
