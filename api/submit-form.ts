import { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface FormData {
  recipient_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  recipient_email?: string;
  occasion?: string;
  season?: string;
  comforts?: string;
  card_message?: string;
  name_on_card: string;
  budget: string;
  sender_name: string;
  sender_email: string;
  website?: string;
  source_page?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const formData: FormData = req.body;

    // Honeypot check
    if (formData.website) {
      return res.status(200).json({ ok: true, message: 'Spam detected' });
    }

    // Validate required fields
    if (!formData.sender_email || !formData.sender_name || !formData.recipient_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get the recipient email (default to your business email)
    const recipientEmail = process.env.FORM_RECIPIENT_EMAIL || 'gatheredgrace.giving@gmail.com';

    // Format the email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .section { margin-bottom: 25px; padding: 15px; background-color: #fafafa; border-radius: 5px; }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #2c3e50; }
            .field { margin-bottom: 12px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 4px; color: #333; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎁 New Gathered Grace Gift Order</h1>
              <p>You have received a new custom care gift form submission.</p>
            </div>

            <div class="section">
              <div class="section-title">👤 Sender Information</div>
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${formData.sender_name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${formData.sender_email}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">📍 Recipient Details</div>
              <div class="field">
                <div class="label">Recipient Name:</div>
                <div class="value">${formData.recipient_name}</div>
              </div>
              <div class="field">
                <div class="label">Shipping Address:</div>
                <div class="value">
                  ${formData.address}<br>
                  ${formData.city}, ${formData.state} ${formData.zip}
                </div>
              </div>
              ${formData.recipient_email ? `
              <div class="field">
                <div class="label">Recipient Email:</div>
                <div class="value">${formData.recipient_email}</div>
              </div>
              ` : ''}
            </div>

            <div class="section">
              <div class="section-title">💝 Gift Details</div>
              ${formData.occasion ? `
              <div class="field">
                <div class="label">Occasion:</div>
                <div class="value">${formData.occasion}</div>
              </div>
              ` : ''}
              ${formData.season ? `
              <div class="field">
                <div class="label">Current Season/Situation:</div>
                <div class="value">${formData.season}</div>
              </div>
              ` : ''}
              ${formData.comforts ? `
              <div class="field">
                <div class="label">Comforts/Preferences:</div>
                <div class="value">${formData.comforts}</div>
              </div>
              ` : ''}
              <div class="field">
                <div class="label">Budget for Custom Gift:</div>
                <div class="value">${formData.budget}</div>
              </div>
            </div>

            ${formData.card_message ? `
            <div class="section">
              <div class="section-title">💌 Card Message</div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${formData.card_message}</div>
              </div>
              <div class="field">
                <div class="label">Name on Card:</div>
                <div class="value">${formData.name_on_card}</div>
              </div>
            </div>
            ` : ''}

            ${formData.source_page ? `
            <div class="footer">
              <p><strong>Source Page:</strong> ${formData.source_page}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            ` : ''}
          </div>
        </body>
      </html>
    `;

    const emailText = `
New Gathered Grace Gift Order

SENDER INFORMATION
Name: ${formData.sender_name}
Email: ${formData.sender_email}

RECIPIENT DETAILS
Name: ${formData.recipient_name}
Address: ${formData.address}
${formData.city}, ${formData.state} ${formData.zip}
${formData.recipient_email ? `Email: ${formData.recipient_email}` : ''}

GIFT DETAILS
${formData.occasion ? `Occasion: ${formData.occasion}` : ''}
${formData.season ? `Season/Situation: ${formData.season}` : ''}
${formData.comforts ? `Comforts: ${formData.comforts}` : ''}
Budget: ${formData.budget}

${formData.card_message ? `
CARD MESSAGE
Message: ${formData.card_message}
Name on Card: ${formData.name_on_card}
` : ''}

${formData.source_page ? `Source: ${formData.source_page}` : ''}
Submitted: ${new Date().toLocaleString()}
    `.trim();

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Gathered Grace <onboarding@resend.dev>',
      to: recipientEmail,
      replyTo: formData.sender_email,
      subject: `🎁 New Gift Order from ${formData.sender_name} - ${formData.recipient_name}`,
      html: emailHtml,
      text: emailText,
    });

    // If email fails, still return success but log the error
    if (emailResult.error) {
      console.error('Error sending email:', emailResult.error);
      // Don't fail the request - email service might be down
    }

    // Return success response
    return res.status(200).json({
      ok: true,
      message: 'Form submitted successfully',
      emailId: emailResult.data?.id,
    });
  } catch (error: any) {
    console.error('Error processing form submission:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

