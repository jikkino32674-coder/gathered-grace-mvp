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
              background: linear-gradient(135deg, #8b7355 0%, #6a5444 100%);
              color: white;
              padding: 50px 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0 0 10px 0;
              font-size: 32px;
              font-weight: 300;
              letter-spacing: 1px;
            }
            .header p {
              margin: 0;
              font-size: 18px;
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
              margin-bottom: 25px;
              line-height: 1.8;
            }
            .discount-box {
              background: linear-gradient(135deg, #faf7f5 0%, #f5efe8 100%);
              border: 2px dashed #8b7355;
              padding: 35px 25px;
              margin: 35px 0;
              text-align: center;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            .discount-label {
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 2px;
              color: #8b7355;
              margin-bottom: 15px;
              font-weight: 600;
            }
            .discount-code {
              font-size: 40px;
              font-weight: 700;
              color: #6a5444;
              letter-spacing: 3px;
              margin: 15px 0;
              font-family: 'Courier New', monospace;
              background: white;
              padding: 15px 25px;
              border-radius: 8px;
              display: inline-block;
              box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            }
            .discount-description {
              font-size: 16px;
              color: #666;
              margin-top: 15px;
              font-weight: 500;
            }
            .cta {
              text-align: center;
              margin: 30px 0;
            }
            .cta-button {
              display: inline-block;
              padding: 18px 50px;
              background: linear-gradient(135deg, #8b7355 0%, #6a5444 100%);
              color: white !important;
              text-decoration: none;
              border-radius: 50px;
              font-size: 18px;
              font-weight: 600;
              letter-spacing: 0.5px;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(106, 84, 68, 0.3);
            }
            .cta-button:hover {
              background: linear-gradient(135deg, #9d8464 0%, #7a6454 100%);
              box-shadow: 0 6px 20px rgba(106, 84, 68, 0.4);
              transform: translateY(-2px);
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
              color: #8b7355;
              text-decoration: none;
              font-weight: 500;
            }
            .footer a:hover {
              color: #6a5444;
              text-decoration: underline;
            }
            /* Mobile responsive */
            @media only screen and (max-width: 600px) {
              .container {
                margin: 20px auto;
              }
              .header h1 {
                font-size: 24px;
              }
              .discount-code {
                font-size: 32px;
                padding: 12px 20px;
              }
              .cta-button {
                padding: 16px 40px;
                font-size: 16px;
              }
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
                <p>Thank you for joining our community! We're thrilled to welcome you to Gathered Grace.</p>
                <p>We believe in the power of thoughtful care and meaningful connection. Each gift we create is designed to bring comfort, rest, and encouragement—whether for someone you love or for yourself.</p>
              </div>

              <div class="discount-box">
                <div class="discount-label">Your Exclusive Discount Code</div>
                <div class="discount-code">WELCOME10</div>
                <div class="discount-description">Save 10% on your first order</div>
              </div>

              <div class="message">
                <p><strong>Ready to shop?</strong> Choose from our curated care kits—Rest, Reflect, or Restore—or explore individual items like our handmade lavender eye pillows, healing balm, and thoughtful journals.</p>
                <p>Simply enter <strong>WELCOME10</strong> at checkout to save 10% on your first order.</p>
              </div>

              <div class="cta">
                <a href="https://gatheredgrace.us?discount=WELCOME10" class="cta-button">Shop Now & Save 10%</a>
              </div>

              <div class="message" style="text-align: center; font-size: 14px; color: #999; margin-top: 15px;">
                <p>Or copy code: <strong style="color: #6a0505;">WELCOME10</strong> to use later</p>
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
