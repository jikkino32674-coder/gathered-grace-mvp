import { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// Initialize Resend with API key validation
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.warn('⚠️ WARNING: RESEND_API_KEY is not set in environment variables');
}
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { email, name } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Check if Resend is configured
    if (!resend) {
      console.error('❌ RESEND_API_KEY is not configured. Cannot send email.');
      return res.status(500).json({
        ok: false,
        error: 'Email service not configured',
        message: 'RESEND_API_KEY environment variable is missing',
      });
    }

    // Get the from email
    let fromEmail = process.env.RESEND_FROM_EMAIL;
    if (!fromEmail || fromEmail.trim() === '') {
      fromEmail = 'onboarding@resend.dev';
    }
    fromEmail = fromEmail.trim();

    if (!fromEmail.includes('<') && !fromEmail.includes('>') && fromEmail.includes('@')) {
      fromEmail = `Gathered Grace <${fromEmail}>`;
    }

    console.log('📧 Sending discount email to:', email);

    // Create personalized greeting
    const greeting = name ? `Hi ${name}` : 'Hello';

    // Email HTML content
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
              background: linear-gradient(135deg, #8b5a5a 0%, #6a0505 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0 0 10px 0;
              font-size: 28px;
              font-weight: normal;
            }
            .header p {
              margin: 0;
              font-size: 16px;
              opacity: 0.95;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 18px;
              margin-bottom: 20px;
              color: #6a0505;
            }
            .message {
              margin-bottom: 25px;
              line-height: 1.8;
            }
            .discount-box {
              background: linear-gradient(135deg, #f5e6e6 0%, #fef3f3 100%);
              border-left: 4px solid #6a0505;
              padding: 25px;
              margin: 30px 0;
              text-align: center;
              border-radius: 4px;
            }
            .discount-label {
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #666;
              margin-bottom: 10px;
            }
            .discount-code {
              font-size: 32px;
              font-weight: bold;
              color: #6a0505;
              letter-spacing: 2px;
              margin: 10px 0;
              font-family: 'Courier New', monospace;
            }
            .discount-description {
              font-size: 14px;
              color: #666;
              margin-top: 10px;
            }
            .cta {
              text-align: center;
              margin: 30px 0;
            }
            .cta-button {
              display: inline-block;
              padding: 15px 40px;
              background-color: #6a0505;
              color: white !important;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
              font-weight: 500;
              transition: background-color 0.3s;
            }
            .cta-button:hover {
              background-color: #8b0a0a;
            }
            .footer {
              background-color: #f9f9f9;
              padding: 30px;
              text-align: center;
              font-size: 13px;
              color: #666;
              border-top: 1px solid #e0e0e0;
            }
            .footer p {
              margin: 5px 0;
            }
            .footer a {
              color: #6a0505;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Gathered Grace 🎁</h1>
              <p>Your 10% discount is ready!</p>
            </div>

            <div class="content">
              <div class="greeting">${greeting},</div>

              <div class="message">
                <p>Thank you for joining our community! We're delighted to welcome you.</p>
                <p>At Gathered Grace, we believe in the power of thoughtful care and meaningful connection. Each gift we create is designed to bring comfort, rest, and encouragement to those you care about.</p>
              </div>

              <div class="discount-box">
                <div class="discount-label">Your Exclusive Discount Code</div>
                <div class="discount-code">WELCOME10</div>
                <div class="discount-description">Save 10% on your first order</div>
              </div>

              <div class="message">
                <p>Use this code at checkout to receive 10% off your first purchase. Whether you're choosing a curated care kit or building a custom gift, we're here to help you create something truly special.</p>
              </div>

              <div class="cta">
                <a href="https://gatheredgrace.us/shop" class="cta-button">Start Shopping</a>
              </div>

              <div class="message" style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e0e0e0;">
                <p style="font-size: 14px; color: #666;">Questions or need help choosing the perfect gift? We're here for you. Simply reply to this email.</p>
              </div>
            </div>

            <div class="footer">
              <p><strong>Gathered Grace</strong></p>
              <p>Thoughtful gifts for meaningful connection</p>
              <p style="margin-top: 15px;">
                <a href="https://gatheredgrace.us">Visit our website</a>
              </p>
              <p style="margin-top: 20px; font-size: 11px; color: #999;">
                You're receiving this email because you signed up for our newsletter.
                If you'd like to unsubscribe, please reply to this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Plain text version
    const emailText = `
${greeting},

Thank you for joining our community! We're delighted to welcome you to Gathered Grace.

YOUR EXCLUSIVE DISCOUNT CODE: WELCOME10
Save 10% on your first order!

At Gathered Grace, we believe in the power of thoughtful care and meaningful connection. Each gift we create is designed to bring comfort, rest, and encouragement to those you care about.

Use code WELCOME10 at checkout to receive 10% off your first purchase. Whether you're choosing a curated care kit or building a custom gift, we're here to help you create something truly special.

Start shopping: https://gatheredgrace.us/shop

Questions or need help choosing the perfect gift? We're here for you. Simply reply to this email.

---
Gathered Grace
Thoughtful gifts for meaningful connection
https://gatheredgrace.us
    `.trim();

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: '🎁 Welcome to Gathered Grace - Your 10% Discount Inside!',
      html: emailHtml,
      text: emailText,
    });

    // Check for errors
    if (emailResult.error) {
      console.error('❌ Error sending discount email:', JSON.stringify(emailResult.error, null, 2));
      return res.status(500).json({
        ok: false,
        error: 'Failed to send email',
        message: emailResult.error.message || 'Unknown error',
        details: emailResult.error,
      });
    }

    // Return success response
    console.log('✅ Discount email sent successfully:', emailResult.data?.id);
    return res.status(200).json({
      ok: true,
      message: 'Email sent successfully',
      emailId: emailResult.data?.id,
    });
  } catch (error: any) {
    console.error('Error sending discount email:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
