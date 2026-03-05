import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { adminDb } from './_lib/firebase-admin.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { typescript: true });
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Disable body parsing so we get the raw body for signature verification
export const config = {
  api: { bodyParser: false },
};

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await getRawBody(req);
    const sig = req.headers['stripe-signature'] as string;

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not set');
      return res.status(500).json({ message: 'Webhook secret not configured' });
    }

    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutCompleted(session);
  }

  return res.status(200).json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerEmail = session.customer_email || session.customer_details?.email;
  if (!customerEmail) {
    console.log('No customer email found on session, skipping email');
    return;
  }

  // Try to find the matching lead in Firestore
  let lead: any = null;
  let leadId: string | null = null;

  // First try matching by metadata (checkout sessions created by our API have form_data)
  const formDataStr = session.metadata?.form_data;
  let formData: any = null;
  if (formDataStr) {
    try {
      formData = JSON.parse(formDataStr);
    } catch {}
  }

  // Try to find the lead by email + recent creation time
  try {
    const snapshot = await adminDb.collection('b2c_leads')
      .where('email', '==', customerEmail)
      .orderBy('created_at', 'desc')
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      lead = doc.data();
      leadId = doc.id;
    }
  } catch (err) {
    console.error('Error querying Firestore for lead:', err);
  }

  // Update the lead status to "processing" if found
  if (leadId) {
    try {
      await adminDb.collection('b2c_leads').doc(leadId).update({
        status: 'processing',
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent,
        updated_at: new Date(),
      });
    } catch (err) {
      console.error('Error updating lead status:', err);
    }
  }

  // Determine what was ordered
  const kitType = session.metadata?.kit_type || '';
  const recipientName = formData?.recipient_name || lead?.metadata?.recipient_name || '';
  const senderName = formData?.sender_name || lead?.full_name || '';
  const senderFirstName = senderName.split(' ')[0] || 'there';

  // Get the kit display name
  const kitNames: Record<string, string> = {
    rest: 'Rest Kit',
    reflect: 'Reflect Kit',
    restore: 'Restore Kit',
    build_custom: 'Custom Kit',
  };
  const kitDisplayName = kitNames[kitType] || 'Gathered Grace gift kit';

  // Get amount paid
  const amountPaid = session.amount_total
    ? `$${(session.amount_total / 100).toFixed(2)}`
    : '';

  // Send the thank you email
  await sendThankYouEmail({
    to: customerEmail,
    senderFirstName,
    recipientName,
    kitDisplayName,
    amountPaid,
  });
}

async function sendThankYouEmail({
  to,
  senderFirstName,
  recipientName,
  kitDisplayName,
  amountPaid,
}: {
  to: string;
  senderFirstName: string;
  recipientName: string;
  kitDisplayName: string;
  amountPaid: string;
}) {
  if (!resend) {
    console.error('Resend not configured, cannot send thank you email');
    return;
  }

  let fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || 'onboarding@resend.dev';
  if (!fromEmail.includes('<') && !fromEmail.includes('>') && fromEmail.includes('@')) {
    fromEmail = `Gathered Grace <${fromEmail}>`;
  }

  const subject = recipientName
    ? `Your Gathered Grace gift for ${recipientName} is confirmed!`
    : `Your Gathered Grace order is confirmed!`;

  const recipientLine = recipientName
    ? `<p>We're now preparing a beautiful <strong>${kitDisplayName}</strong> for <strong>${recipientName}</strong>. What a thoughtful gesture to reach out and support someone you care about.</p>`
    : `<p>We're now preparing your <strong>${kitDisplayName}</strong> with care.</p>`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Georgia, serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #8b7355 0%, #6a5444 100%);
            color: white;
            padding: 50px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 300;
            letter-spacing: 1px;
          }
          .header p {
            margin: 0;
            font-size: 16px;
            opacity: 0.95;
            font-weight: 300;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 20px;
            margin-bottom: 25px;
            color: #6a5444;
            font-weight: 500;
          }
          .message {
            margin-bottom: 20px;
            line-height: 1.8;
          }
          .order-box {
            background: #faf7f5;
            border: 1px solid #e8e0d8;
            padding: 25px;
            margin: 25px 0;
            border-radius: 8px;
          }
          .order-box h3 {
            margin: 0 0 15px 0;
            color: #6a5444;
            font-size: 16px;
          }
          .order-detail {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #ede7e0;
          }
          .order-detail:last-child {
            border-bottom: none;
          }
          .order-label {
            color: #888;
            font-size: 14px;
          }
          .order-value {
            font-weight: 600;
            color: #333;
            font-size: 14px;
          }
          .next-steps {
            background: #f0f7f0;
            border-left: 4px solid #7a9e7a;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
          }
          .next-steps h3 {
            margin: 0 0 10px 0;
            color: #5a7e5a;
            font-size: 15px;
          }
          .next-steps ol {
            margin: 0;
            padding-left: 20px;
          }
          .next-steps li {
            margin-bottom: 8px;
            font-size: 14px;
          }
          .footer {
            background-color: #f9f9f9;
            padding: 30px;
            text-align: center;
            font-size: 13px;
            color: #666;
            border-top: 1px solid #e0e0e0;
          }
          .footer p { margin: 5px 0; }
          .footer a { color: #8b7355; text-decoration: none; font-weight: 500; }
          @media only screen and (max-width: 600px) {
            .container { margin: 20px auto; }
            .header h1 { font-size: 22px; }
            .content { padding: 25px 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed!</h1>
            <p>Thank you for choosing Gathered Grace</p>
          </div>

          <div class="content">
            <div class="greeting">Hi ${senderFirstName},</div>

            <div class="message">
              <p>Thank you so much for your order! It's such a thoughtful gesture to spread a little more kindness in the world, and we are honored to be a part of it.</p>
              ${recipientLine}
            </div>

            <div class="order-box">
              <h3>Order Summary</h3>
              <div class="order-detail">
                <span class="order-label">Item</span>
                <span class="order-value">${kitDisplayName}</span>
              </div>
              ${recipientName ? `
              <div class="order-detail">
                <span class="order-label">For</span>
                <span class="order-value">${recipientName}</span>
              </div>` : ''}
              ${amountPaid ? `
              <div class="order-detail">
                <span class="order-label">Total</span>
                <span class="order-value">${amountPaid}</span>
              </div>` : ''}
            </div>

            <div class="next-steps">
              <h3>What happens next?</h3>
              <ol>
                <li>We'll carefully prepare your gift with love and attention to detail</li>
                <li>Once shipped, you'll receive an email with your tracking number</li>
                <li>Your gift will be on its way to bring comfort and joy!</li>
              </ol>
            </div>

            <div class="message" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p style="font-size: 14px; color: #666;">Questions about your order? Just reply to this email &mdash; we're always happy to help.</p>
            </div>
          </div>

          <div class="footer">
            <p><strong>Gathered Grace</strong></p>
            <p>Thoughtful gifts for meaningful connection</p>
            <p style="margin-top: 15px;">
              <a href="https://gatheredgrace.us">Visit our website</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  const emailText = `
Hi ${senderFirstName},

Thank you so much for your order! It's such a thoughtful gesture to spread a little more kindness in the world, and we are honored to be a part of it.

${recipientName ? `We're now preparing a beautiful ${kitDisplayName} for ${recipientName}.` : `We're now preparing your ${kitDisplayName} with care.`}

ORDER SUMMARY
- Item: ${kitDisplayName}
${recipientName ? `- For: ${recipientName}` : ''}
${amountPaid ? `- Total: ${amountPaid}` : ''}

WHAT HAPPENS NEXT:
1. We'll carefully prepare your gift with love and attention to detail
2. Once shipped, you'll receive an email with your tracking number
3. Your gift will be on its way to bring comfort and joy!

Questions about your order? Just reply to this email.

---
Gathered Grace
Thoughtful gifts for meaningful connection
https://gatheredgrace.us
  `.trim();

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html: emailHtml,
      text: emailText,
    });

    if (result.error) {
      console.error('Failed to send thank you email:', result.error);
    } else {
      console.log('Thank you email sent:', result.data?.id);
    }
  } catch (err) {
    console.error('Error sending thank you email:', err);
  }
}
