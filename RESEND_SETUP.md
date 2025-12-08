# Resend Email Setup - How to Send to gatheredgrace.giving@gmail.com

## Current Issue
Your Resend account is in **test/free mode**, which only allows sending emails to the account owner's email (`indieplantmarketing@gmail.com`). 

To send emails to `gatheredgrace.giving@gmail.com`, you need to do one of the following:

## Option 1: Upgrade Resend Account (Easiest) ⭐ RECOMMENDED

1. Go to https://resend.com/pricing
2. Upgrade to a paid plan (starts at $20/month)
3. This will immediately allow you to send to any email address
4. Update the `FORM_RECIPIENT_EMAIL` environment variable in Vercel to `gatheredgrace.giving@gmail.com`

## Option 2: Verify Your Own Domain (Free but requires domain)

If you have a domain (like `gatheredgrace.com` or any domain you own):

1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter your domain (e.g., `gatheredgrace.com`)
4. Add the DNS records Resend provides to your domain's DNS settings
5. Wait for verification (usually a few minutes)
6. Once verified, update `RESEND_FROM_EMAIL` in Vercel to use your domain:
   - Example: `Gathered Grace <noreply@gatheredgrace.com>`
7. This allows sending to any recipient email address

## Option 3: Email Forwarding (Temporary Workaround)

Set up email forwarding in Gmail:

1. Log into `indieplantmarketing@gmail.com`
2. Go to Settings → Forwarding and POP/IMAP
3. Add `gatheredgrace.giving@gmail.com` as a forwarding address
4. Emails sent to `indieplantmarketing@gmail.com` will automatically forward to `gatheredgrace.giving@gmail.com`

## Current Configuration ✅

- **API Key**: Set ✅
- **Domain Verified**: `gatheredgrace.us` is verified in Resend ✅
- **From Email**: `Gathered Grace <noreply@gatheredgrace.us>` ✅
- **Recipient Email**: `gatheredgrace.giving@gmail.com` ✅

**All emails now come from your verified domain, which significantly improves deliverability and reduces spam issues!**

## After Upgrading/Verifying Domain

Once you've completed Option 1 or 2, update the Vercel environment variable:

```bash
npx vercel env rm FORM_RECIPIENT_EMAIL production --yes
echo "gatheredgrace.giving@gmail.com" | npx vercel env add FORM_RECIPIENT_EMAIL production
```

Then redeploy:
```bash
npx vercel --prod
```

## Testing

Test the API after making changes:
```bash
node test-api-simple.mjs
```

