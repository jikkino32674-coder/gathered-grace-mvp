# Gathered Grace - Thoughtfully Curated Care

A modern e-commerce website for Gathered Grace, offering thoughtfully curated gift boxes and care products.

## 🌐 Live Site

**Production URL**: https://momgatheredgrace.vercel.app

## 🛠️ Tech Stack

### Frontend
- **Vite** - Build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn-ui** - High-quality React component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Backend & Infrastructure
- **Vercel** - Hosting and serverless functions
  - Serverless API routes (`/api/*`)
  - Automatic deployments
  - Edge network distribution
- **Vercel Serverless Functions** - Backend API endpoints
  - Form submission handling
  - Email sending via Resend
  - CSV generation

### Database & Storage
- **Supabase** - PostgreSQL database
  - `b2c_leads` table for form submissions
  - Email signups storage
  - Audience/lead management
  - Project: `vyoxzaztjutzsnzajdvr`

### Email Service
- **Resend** - Transactional email service
  - Form submission notifications
  - HTML email templates
  - CSV download links in emails
  - Account: `gatheredgrace.giving@gmail.com`

### Form Submissions
- **Custom Care Gift Form** - Main product form
  - Saves to Supabase (`b2c_leads` table)
  - Sends email notification via Resend
  - Includes CSV download button
  - Stores full form data in metadata JSON
- **Email Signup Form** - Newsletter subscription
  - Saves to Supabase
  - Lead type: `email_signup`
- **Discount Popup** - Welcome discount code
  - Saves to Supabase
  - Lead type: `discount_popup`

### Google Sheets Integration
- **Status**: Not currently active
- **Previous Setup**: Google Apps Script endpoint was previously configured
- **Current Approach**: Form data is stored in Supabase database and can be exported via CSV downloads from emails
- **Future**: Can be re-enabled if needed for direct Google Sheets integration

## 📋 Project Structure

```
momgatheredgrace/
├── api/                    # Vercel serverless functions
│   ├── submit-form.ts     # Form submission API (sends emails)
│   └── download-csv.ts    # CSV download endpoint
├── src/
│   ├── components/        # React components
│   │   ├── CustomCareForm.tsx    # Main gift form
│   │   ├── EmailCaptureSection.tsx  # Newsletter signup
│   │   ├── DiscountPopup.tsx       # Discount code popup
│   │   └── ui/            # shadcn-ui components
│   ├── pages/             # Page components
│   ├── lib/
│   │   ├── supabase.ts    # Supabase client
│   │   └── utils.ts       # Utility functions
│   └── main.tsx           # App entry point
├── public/                # Static assets
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (install with [nvm](https://github.com/nvm-sh/nvm))
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd momgatheredgrace

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Resend API Key (for email notifications)
RESEND_API_KEY=re_your_api_key_here

# Email address to receive form submissions
FORM_RECIPIENT_EMAIL=gatheredgrace.giving@gmail.com

# Email address to send from (must be verified in Resend)
RESEND_FROM_EMAIL=Gathered Grace <onboarding@resend.dev>

# Supabase is configured in src/lib/supabase.ts
# No environment variables needed (uses public anon key)
```

### Local Development with API Routes

To test API routes locally:

```bash
# Install Vercel CLI
npm install -g vercel

# Run Vercel dev server (includes API routes)
vercel dev
```

## 📧 Form Submission System

### How It Works

When a user submits the Custom Care Gift Form:

1. **Frontend** (`CustomCareForm.tsx`)
   - Validates form data
   - Saves to Supabase database (`b2c_leads` table)
   - Submits to Vercel API endpoint

2. **Backend API** (`/api/submit-form.ts`)
   - Receives form data
   - Sends HTML email via Resend
   - Includes CSV download link
   - Returns success/error response

3. **Database** (Supabase)
   - Stores all form submissions
   - Stores email signups
   - Stores discount popup leads
   - All data in `b2c_leads` table

4. **Email** (Resend)
   - Sends notification to `gatheredgrace.giving@gmail.com`
   - Beautifully formatted HTML email
   - Includes CSV download button
   - Plain text fallback

### Database Schema

**Table**: `b2c_leads`

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Primary key |
| `email` | text | Sender email |
| `full_name` | text | Sender name |
| `lead_type` | text | `custom_care_form`, `email_signup`, or `discount_popup` |
| `source_page` | text | URL where form was submitted |
| `website_type` | text | `b2c` |
| `metadata` | jsonb | Form data (address, recipient info, preferences, etc.) |
| `created_at` | timestamp | Submission timestamp |

### Email Features

- ✅ Beautiful HTML formatting
- ✅ CSV download button (for Google Sheets import)
- ✅ All form data included
- ✅ Source page tracking
- ✅ Timestamp
- ✅ Plain text fallback

## 🔧 Configuration

### Vercel Environment Variables

Set these in your Vercel project dashboard (Settings → Environment Variables):

```
RESEND_API_KEY=re_your_api_key_here
FORM_RECIPIENT_EMAIL=gatheredgrace.giving@gmail.com
RESEND_FROM_EMAIL=Gathered Grace <onboarding@resend.dev>
```

### Supabase Configuration

Supabase is configured in `src/lib/supabase.ts`:
- Project URL: `https://vyoxzaztjutzsnzajdvr.supabase.co`
- Uses public anon key (safe for client-side)
- Database: PostgreSQL
- Table: `b2c_leads`

View your data at: https://supabase.com/dashboard/project/vyoxzaztjutzsnzajdvr

## 📦 Deployment

### Vercel Deployment

The site is deployed on Vercel and automatically deploys when code is pushed to the repository.

**Manual Deployment**:
```bash
npx vercel --prod
```

**Deployment URL**: https://momgatheredgrace.vercel.app

### Build Commands

```bash
# Development build
npm run build:dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 📊 Database & Analytics

### Supabase Dashboard

- **URL**: https://supabase.com/dashboard/project/vyoxzaztjutzsnzajdvr
- **Table Editor**: View all form submissions
- **Authentication**: Configured with anon key
- **Storage**: All form data stored in `b2c_leads` table

### Viewing Form Submissions

1. Go to Supabase Dashboard
2. Navigate to **Table Editor** → `b2c_leads`
3. Filter by `lead_type`:
   - `custom_care_form` - Gift form submissions
   - `email_signup` - Newsletter signups
   - `discount_popup` - Discount code leads

### Exporting Data

- **CSV Download**: Click the CSV button in email notifications
- **Supabase Export**: Use Supabase dashboard to export data
- **Google Sheets**: Import CSV files downloaded from emails

## 🔌 Google Sheets Integration

### Status: Not Active

Google Sheets integration via Google Apps Script is **not currently active**. The previous setup included a Google Apps Script endpoint, but the current implementation uses:

1. **Supabase Database** - Primary storage for all form submissions
2. **Email Notifications** - Resend emails with CSV download links
3. **CSV Export** - Download form data as CSV from emails

### Previous Setup (Inactive)

- Google Apps Script endpoint was previously configured
- Endpoint URL was: `https://script.google.com/macros/s/AKfycby2zEiokF8aNFXZSOVaXNJFUEhUjqGHo-PEPgR-_ttQflwgwMiNeH86afPWhe13EuE1/exec`
- Code references may still exist in the codebase but are not actively used

### Current Workflow

1. Form submitted → Saved to Supabase
2. Email sent → Contains CSV download link
3. CSV downloaded → Imported to Google Sheets manually (if needed)

### Future Integration

If you want to re-enable Google Sheets integration:
- Update the form submission handler to include Google Apps Script endpoint
- Or integrate Google Sheets API directly in Vercel serverless function
- Contact developer for implementation

## 🧪 Testing

### Test Form Submission

```bash
# Test API endpoint
curl -X POST https://momgatheredgrace.vercel.app/api/submit-form \
  -H "Content-Type: application/json" \
  -d '{
    "sender_name": "Test User",
    "sender_email": "test@example.com",
    "recipient_name": "Test Recipient",
    "address": "123 Test St",
    "city": "Test City",
    "state": "CA",
    "zip": "12345",
    "budget": "$50",
    "name_on_card": "Include my name"
  }'
```

### Test CSV Download

Visit: `https://momgatheredgrace.vercel.app/api/download-csv?data=<base64_encoded_data>`

## 📝 Scripts

```bash
# Development
npm run dev          # Start Vercel dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Deployment
npx vercel           # Deploy to Vercel (preview)
npx vercel --prod    # Deploy to production
```

## 🔍 Troubleshooting

### Form Submissions Not Saving

- Check browser console for Supabase errors
- Verify Supabase connection in `src/lib/supabase.ts`
- Check Supabase dashboard for new records

### Emails Not Sending

- Verify `RESEND_API_KEY` is set in Vercel environment variables
- Check Resend dashboard for sent emails
- Verify `FORM_RECIPIENT_EMAIL` is correct
- Check Vercel function logs for errors

### CSV Download Not Working

- Verify API endpoint is deployed: `/api/download-csv`
- Check that form data is properly encoded in email link
- Test CSV endpoint directly with sample data

### Database Issues

- Check Supabase dashboard for connection status
- Verify table structure matches code expectations
- Check browser console for Supabase errors
- Ensure Supabase project is active

## 📚 Documentation

- [Form Setup Guide](./FORM_SETUP.md) - Detailed form submission setup
- [Resend Setup Guide](./RESEND_SETUP.md) - Email service configuration
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Resend Documentation](https://resend.com/docs)

## 🤝 Contributing

1. Clone the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

Private project - All rights reserved

## 🆘 Support

For issues or questions:
- Check the troubleshooting section above
- Review the documentation files
- Check Vercel/Supabase/Resend dashboards
- Contact the development team

---

**Last Updated**: November 2025
**Version**: 1.0.0
