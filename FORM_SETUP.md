# Form Submission Setup Guide

This guide explains how to set up form submissions for the Gathered Grace Custom Care Gift form.

## How It Works

The form now uses a Vercel Serverless Function API route (`/api/submit-form.ts`) that:
1. Receives form submissions
2. Sends email notifications via Resend
3. Optionally saves to Supabase (if configured)
4. Returns success/error responses

## Quick Setup (5 minutes)

### Step 1: Get a Resend API Key

1. Go to [resend.com](https://resend.com) and sign up (free tier: 3,000 emails/month, 100/day)
2. Navigate to **API Keys** in the dashboard
3. Click **Create API Key**
4. Name it (e.g., "Gathered Grace Forms")
5. Copy the API key (starts with `re_`)

### Step 2: Set Up Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

   ```
   RESEND_API_KEY=re_your_api_key_here
   FORM_RECIPIENT_EMAIL=gatheredgrace.giving@gmail.com
   RESEND_FROM_EMAIL=Gathered Grace <onboarding@resend.dev>
   ```

   **Note:** For `RESEND_FROM_EMAIL`, you can use `onboarding@resend.dev` for testing, but for production you should:
   - Verify your domain in Resend
   - Use an email from your verified domain (e.g., `noreply@yourdomain.com`)

### Step 3: Deploy to Vercel

1. Push your code to GitHub (if not already)
2. Vercel will automatically deploy
3. The API route will be available at: `https://your-domain.vercel.app/api/submit-form`

### Step 4: Test the Form

1. Fill out the form on your website
2. Submit it
3. Check your email inbox (the email specified in `FORM_RECIPIENT_EMAIL`)
4. You should receive a beautifully formatted email with all form details

## Local Development

For local testing, you can use Vercel CLI:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Create a `.env.local` file in the project root:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   FORM_RECIPIENT_EMAIL=gatheredgrace.giving@gmail.com
   RESEND_FROM_EMAIL=Gathered Grace <onboarding@resend.dev>
   ```

3. Run the development server:
   ```bash
   vercel dev
   ```

   This will start both your Vite dev server and the API routes.

## Email Format

The email notification includes:
- ✅ Sender information (name, email)
- ✅ Recipient details (name, shipping address, optional email)
- ✅ Gift details (occasion, season, comforts, budget)
- ✅ Card message (if provided)
- ✅ Source page URL
- ✅ Timestamp

The email is sent as both HTML (beautifully formatted) and plain text.

## Alternative: Google Sheets Integration

If you prefer Google Sheets over email, you can:

1. Keep the existing Google Apps Script endpoint
2. Or, create a new Vercel API route that writes to Google Sheets using the Google Sheets API

Let me know if you'd like to set up Google Sheets integration instead!

## Troubleshooting

### Emails not sending?
- Check that `RESEND_API_KEY` is set correctly in Vercel
- Verify your email domain in Resend (or use `onboarding@resend.dev` for testing)
- Check the Vercel function logs in the Vercel dashboard

### Form submission fails?
- Check browser console for errors
- Check Vercel function logs
- Ensure all required fields are filled
- Verify CORS settings if testing locally

### Want to add more features?
- Multiple recipient emails: Update the API route to send to multiple addresses
- Auto-reply to sender: Add a confirmation email in the API route
- Google Sheets sync: Integrate Google Sheets API in the API route
- Slack notifications: Add Slack webhook integration

## Support

If you need help, check:
- [Resend Documentation](https://resend.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

