# Gathered Grace - Thoughtfully Curated Care

A modern e-commerce website for Gathered Grace, offering thoughtfully curated gift boxes and care products.

## Live Site

**Production URL**: https://gatheredgrace.us
**Vercel URL**: https://momgatheredgrace.vercel.app
**Admin Dashboard**: https://gatheredgrace.us/admin

## Tech Stack

### Frontend
- **Vite** - Build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library (Radix UI primitives)
- **TanStack React Query** - Data fetching and caching
- **Recharts** - Dashboard charts
- **Lucide React** - Icons

### Backend & Infrastructure
- **Vercel** - Hosting and serverless functions (10 API routes)
- **Firebase / Firestore** - Database for leads, orders, and contacts
- **Firebase Authentication** - Admin login (email/password)
- **Stripe** - Payments, invoices, and checkout sessions
- **Resend** - Transactional emails (order confirmations, notifications)

## Project Structure

```
momgatheredgrace/
├── api/                              # Vercel serverless functions (10)
│   ├── _lib/
│   │   ├── firebase-admin.ts         # Firebase Admin SDK init
│   │   └── verify-auth.ts           # Auth token verification
│   ├── admin/
│   │   ├── actions.ts               # Update status/tracking/notes, delete leads
│   │   ├── create-invoice.ts        # Create Stripe invoices for leads
│   │   ├── leads.ts                 # List/filter/search leads with pagination
│   │   ├── stats.ts                 # Dashboard stats (orders, contacts, charts)
│   │   └── stripe-stats.ts          # Revenue KPIs from Stripe (invoices, balance)
│   ├── create-checkout-session.ts   # Dynamic Stripe checkout for custom kits
│   ├── download-csv.ts              # CSV export for order data
│   ├── send-discount-email.ts      # Welcome discount emails
│   ├── stripe-webhook.ts           # Stripe webhook → order confirmation emails
│   └── submit-form.ts              # Form submission → Firestore + email
├── src/
│   ├── admin/                       # Admin dashboard
│   │   ├── components/
│   │   │   ├── AdminLayout.tsx      # Sidebar layout with navigation
│   │   │   ├── AdminSidebar.tsx     # Dashboard/Orders/Contacts/Sign Out
│   │   │   ├── ContactsTable.tsx    # Contacts list with filtering
│   │   │   ├── OrderDetailPanel.tsx # Slide-out order detail with editing
│   │   │   ├── OrdersTable.tsx      # Sortable/filterable orders table
│   │   │   ├── RecentOrdersChart.tsx # Bar chart (last 14 days)
│   │   │   ├── RevenueKPIs.tsx      # Revenue cards with date range picker
│   │   │   ├── StatsCards.tsx       # Top-level stat cards
│   │   │   └── StatusBadge.tsx      # Colored status badges
│   │   ├── context/AuthContext.tsx   # Firebase Auth state management
│   │   ├── hooks/
│   │   │   ├── useAdminStats.ts     # Dashboard stats hook
│   │   │   ├── useAuth.ts          # Auth context consumer
│   │   │   ├── useLeads.ts         # Leads CRUD hooks
│   │   │   └── useStripeStats.ts   # Stripe revenue hook
│   │   ├── lib/
│   │   │   ├── adminApi.ts         # Authenticated fetch wrapper
│   │   │   └── auth.ts            # Firebase Auth helpers
│   │   ├── pages/
│   │   │   ├── AdminContacts.tsx   # Tabbed contacts view
│   │   │   ├── AdminDashboard.tsx  # Stats + KPIs + chart + recent orders
│   │   │   ├── AdminLogin.tsx      # Login form
│   │   │   └── AdminOrders.tsx     # Full orders table + detail panel
│   │   └── types/admin.ts         # TypeScript types
│   ├── components/                  # Customer-facing components
│   │   ├── StandardKitForm.tsx     # Rest & Reflect kit forms
│   │   ├── CustomCareForm.tsx      # Restore kit form
│   │   ├── BuildCustomKitForm.tsx  # Build your own kit form
│   │   ├── DiscountPopup.tsx       # Welcome discount popup
│   │   ├── EmailCaptureSection.tsx # Newsletter signup
│   │   └── ui/                    # shadcn/ui components
│   ├── config/stripe.ts           # Stripe payment links
│   ├── lib/
│   │   ├── firebase.ts            # Firebase client config
│   │   └── utils.ts               # Utility functions
│   ├── pages/                     # Product and info pages
│   ├── App.tsx                    # Routes (public + admin)
│   └── main.tsx                   # Entry point
├── vercel.json                    # Vercel config + rewrites
└── package.json
```

## Products

| Product | Price | Payment Method |
|---------|-------|---------------|
| Rest Kit | $39 ($44 custom fabric) | Stripe Payment Link |
| Reflect Kit | $49 ($54 custom fabric) | Stripe Payment Link |
| Restore Kit | $69+ ($74+ custom fabric) | Dynamic Checkout Session |
| Build Your Own Kit | Custom | Quote-based (invoice) |
| Lavender Eye Pillow | $22 | Stripe Payment Link |
| Handmade Balm | $15 | Stripe Payment Link |
| Journal & Pen Set | $18 | Stripe Payment Link |
| Gathered Grace Gift Box | $68 | Stripe Payment Link |

## Admin Dashboard

Accessible at `/admin` with Firebase Authentication.

### Features
- **Dashboard** — Order stats, revenue KPIs (from Stripe), orders chart (last 14 days)
- **Orders** — Sortable/filterable table, status updates, tracking numbers, notes, delete
- **Contacts** — Tabbed view (All, Orders, Email Signups, Discount Popup)
- **Invoices** — Create and send Stripe invoices directly from order detail panel

### Order Statuses
- `new` → `processing` → `shipped` → `delivered`

### Revenue KPIs (from Stripe)
- Total revenue (all time)
- Last 30 days revenue + 7-day breakdown
- Average order value
- Stripe account balance
- Custom date range picker

## Automated Emails

| Trigger | Email | Recipients |
|---------|-------|-----------|
| Form submission | Order details + CSV | Admin (gatheredgrace.giving@gmail.com) |
| Stripe checkout complete | Order confirmation | Customer + Admin (BCC) |
| Discount popup signup | Welcome + discount code | Customer |
| Invoice sent | Payment request | Customer (via Stripe) |

## Environment Variables (Vercel)

```
STRIPE_SECRET_KEY          # Stripe secret key
STRIPE_WEBHOOK_SECRET      # Stripe webhook signing secret
RESEND_API_KEY             # Resend API key
RESEND_FROM_EMAIL          # Gathered Grace <noreply@gatheredgrace.us>
FORM_RECIPIENT_EMAIL       # gatheredgrace.giving@gmail.com
ADMIN_NOTIFICATION_EMAIL   # gatheredgrace.giving@gmail.com (BCC on order emails)
FIREBASE_SERVICE_ACCOUNT_KEY # Firebase Admin SDK service account JSON
```

## Database (Firestore)

**Collection**: `b2c_leads`

| Field | Type | Description |
|-------|------|-------------|
| `email` | string | Customer email |
| `full_name` | string | Customer name |
| `lead_type` | string | Form type (see below) |
| `source_page` | string | URL of submission |
| `metadata` | map | All form data (shipping, preferences, etc.) |
| `status` | string | `new` / `processing` / `shipped` / `delivered` |
| `tracking_number` | string | Shipping tracking number |
| `notes` | string | Admin notes |
| `created_at` | timestamp | Submission time |
| `updated_at` | timestamp | Last update time |

### Lead Types
- **Orders**: `rest_kit_form`, `reflect_kit_form`, `restore_kit_form`, `custom_care_form`, `build_custom_kit`, `gathered_grace_gift_box_form`, `lavender_eye_pillow_form`, `handmade_balm_form`, `journal_pen_form`
- **Contacts**: `email_signup`, `discount_popup`

## Development

```bash
npm install
npm run dev          # Vite dev server (localhost:5173)
vercel dev           # Full dev server with API routes
npm run build        # Production build
npx vercel --prod    # Deploy to production
```

## Deployment

Pushes to `main` trigger automatic Vercel deployment. Manual deploy:

```bash
git push origin main
# or
npx vercel --prod
```

**Vercel Hobby plan**: 12 serverless function limit (currently using 10).

---

**Last Updated**: March 2026
**Domain**: https://gatheredgrace.us
