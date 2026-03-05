import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { adminDb } from '../_lib/firebase-admin';
import { verifyAdminAuth } from '../_lib/verify-auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { typescript: true });

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
    const { lead_id, line_items, send_immediately = false } = req.body;

    if (!lead_id) {
      return res.status(400).json({ message: 'Missing lead_id' });
    }

    // Fetch the lead from Firestore
    const doc = await adminDb.collection('b2c_leads').doc(lead_id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const lead = doc.data()!;
    const meta = lead.metadata || {};
    const customerEmail = lead.email;

    if (!customerEmail) {
      return res.status(400).json({ message: 'Lead has no email address' });
    }

    // Find or create the Stripe customer
    const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
    let customer: Stripe.Customer;

    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: customerEmail,
        name: lead.full_name || meta.recipient_name || undefined,
        metadata: {
          firestore_lead_id: lead_id,
        },
      });
    }

    // Create the invoice
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      collection_method: 'send_invoice',
      days_until_due: 7,
      metadata: {
        firestore_lead_id: lead_id,
        kit_type: meta.kit_type || lead.lead_type || '',
        recipient_name: meta.recipient_name || '',
      },
    });

    // Determine line items
    // If custom line_items are provided from the dashboard, use those
    // Otherwise, auto-generate from the lead data
    const itemsToAdd: Array<{ description: string; amount: number }> = [];

    if (line_items && Array.isArray(line_items) && line_items.length > 0) {
      // Use the custom line items from the admin
      for (const item of line_items) {
        if (item.description && item.amount > 0) {
          itemsToAdd.push({
            description: item.description,
            amount: Math.round(item.amount * 100), // convert dollars to cents
          });
        }
      }
    } else {
      // Auto-generate from lead data
      const kitPrices: Record<string, { name: string; price: number }> = {
        rest_kit_form: { name: 'Rest Kit', price: 3900 },
        reflect_kit_form: { name: 'Reflect Kit', price: 4900 },
        restore_kit_form: { name: 'Restore Kit', price: 6900 },
        custom_care_form: { name: 'Restore Kit', price: 6900 },
        gathered_grace_gift_box_form: { name: 'Gathered Grace Gift Box', price: 6800 },
        lavender_eye_pillow_form: { name: 'Lavender Eye Pillow', price: 2200 },
        handmade_balm_form: { name: 'Handmade Balm', price: 1500 },
        journal_pen_form: { name: 'Journal & Pen Set', price: 1800 },
      };

      const kit = kitPrices[lead.lead_type];
      if (kit) {
        let price = kit.price;
        let name = kit.name;

        // Custom fabric upcharge
        if (meta.custom_fabric === 'yes') {
          price += 500;
          name += ' + Custom Fabric';
        }

        itemsToAdd.push({ description: name, amount: price });
      }

      // Custom gift budget for restore/custom care kits
      if (meta.budget) {
        const budgetMap: Record<string, number> = {
          '$10': 1000, '$20': 2000, '$40': 4000,
          '$50': 5000, '$75': 7500, '$100+': 10000,
        };
        const budgetAmount = budgetMap[meta.budget];
        if (budgetAmount) {
          itemsToAdd.push({
            description: `Custom Gift Budget (${meta.budget})`,
            amount: budgetAmount,
          });
        }
      }

      // Build custom kit items
      if (lead.lead_type === 'build_custom_kit' && meta.selected_items) {
        if (meta.selected_items.eye_pillow) {
          const eyePillowPrice = meta.custom_fabric === 'yes' ? 2700 : 2200;
          itemsToAdd.push({ description: meta.custom_fabric === 'yes' ? 'Lavender Eye Pillow + Custom Fabric' : 'Lavender Eye Pillow', amount: eyePillowPrice });
        }
        if (meta.selected_items.balm) {
          itemsToAdd.push({ description: 'Handmade Balm', amount: 1500 });
        }
        if (meta.selected_items.journal) {
          itemsToAdd.push({ description: 'Journal & Pen Set', amount: 1800 });
        }
        if (meta.selected_items.custom_gift && meta.custom_gift_budget) {
          const customBudgetMap: Record<string, number> = {
            '$10-$20': 1500, '$20-$30': 2500,
            '$30-$50': 4000, '$50+': 5000,
          };
          const amt = customBudgetMap[meta.custom_gift_budget] || 2000;
          itemsToAdd.push({
            description: `Custom Gift (${meta.custom_gift_budget})`,
            amount: amt,
          });
        }
      }
    }

    // Add line items to the invoice
    for (const item of itemsToAdd) {
      await stripe.invoiceItems.create({
        customer: customer.id,
        invoice: invoice.id,
        description: item.description,
        amount: item.amount,
        currency: 'usd',
      });
    }

    // Optionally send immediately
    if (send_immediately) {
      await stripe.invoices.sendInvoice(invoice.id);
    }

    // Update the lead in Firestore with the invoice ID
    await adminDb.collection('b2c_leads').doc(lead_id).update({
      stripe_invoice_id: invoice.id,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      invoice_id: invoice.id,
      invoice_url: invoice.hosted_invoice_url,
      status: send_immediately ? 'sent' : 'draft',
      message: send_immediately
        ? 'Invoice created and sent to customer'
        : 'Invoice created as draft. Review and send from Stripe Dashboard.',
    });
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
