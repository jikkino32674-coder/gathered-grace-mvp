# Stripe Integration Setup - Gathered Grace

This document outlines the Stripe integration for Gathered Grace, including products, payment links, and implementation details.

## Products Created

All products have been created in your **live** Stripe account using your live API key.

### 1. Gathered Grace Gift Box
- **Product ID:** `prod_TO8ehbWbpIi9Ta`
- **Price ID:** `price_1SRMNWHB58d6ZKt6daFowSKq`
- **Price:** $68.00 USD
- **Payment Link:** https://buy.stripe.com/4gMfZhgSl6xIeji1vu1RC00
- **Description:** A meaningful way to mark any moment — joyful, healing, or simply in need of a little care. Includes lavender eye pillow, hardcover journal & pen, handmade unscented balm, heartfelt message card, and an intentionally chosen custom gift.

### 2. Handmade Lavender Eye Pillow
- **Product ID:** `prod_TO8fwbcrLqIREu`
- **Price ID:** `price_1SRMNuHB58d6ZKt6FqSnIjnr`
- **Price:** $22.00 USD
- **Payment Link:** https://buy.stripe.com/28EdR9gSl5tEcba3DC1RC01
- **Description:** A calming handmade eye pillow filled with flax seed and lavender — warm or cool for moments of gentle rest.

### 3. Handmade Balm
- **Product ID:** `prod_TO8faz5COGN3sQ`
- **Price ID:** `price_1SRMO9HB58d6ZKt6NPQRCIW9`
- **Price:** $15.00 USD
- **Payment Link:** https://buy.stripe.com/00wcN5dG93lwcba0rq1RC02
- **Description:** A soothing, all-purpose balm handcrafted with beeswax and natural oils — simple care, made with grace.

### 4. Journal and Pen Set
- **Product ID:** `prod_TO8fB5cUYaPNx9`
- **Price ID:** `price_1SRMONHB58d6ZKt6wQpUzuTd`
- **Price:** $18.00 USD
- **Payment Link:** https://buy.stripe.com/5kQdR9eKd7BMdfeb641RC03
- **Description:** A timeless hardcover notebook and pen set — created for moments of reflection, gratitude, and quiet grace.

## Implementation Details

### Configuration File
All Stripe configuration is centralized in: `src/config/stripe.ts`

This file contains:
- Payment link URLs for all products
- Product IDs and price IDs
- Product names and prices
- Easy-to-reference constants

### Integration Points

#### 1. Homepage (`src/pages/Index.tsx`)
- All product prices pulled from Stripe config
- Buy buttons redirect to appropriate Stripe payment links
- Gathered Grace Gift Box opens custom care form first

#### 2. Product Detail Pages
All product detail pages now have:
- Prices from Stripe config
- Functional "Buy Now" buttons that redirect to Stripe checkout
- Updated pages:
  - `src/pages/GatheredGraceDetails.tsx`
  - `src/pages/LavenderEyePillowDetails.tsx`
  - `src/pages/HandmadeBalmDetails.tsx`
  - `src/pages/JournalPenDetails.tsx`

#### 3. Custom Care Form (`src/components/CustomCareForm.tsx`)
- After successful form submission, users are redirected to the Gathered Grace Gift Box Stripe payment link
- Form data is still saved to Supabase and emailed via Resend
- Payment happens on Stripe's secure checkout page

## Payment Flow

### For Gathered Grace Gift Box:
1. User clicks "Buy Now" → Opens custom care form
2. User fills out personalization details
3. Form submits → Data saved to database & emailed to you
4. User redirected to Stripe checkout page
5. User completes payment on Stripe
6. After payment → Redirected back to gatheredgrace.com

### For Other Products:
1. User clicks "Buy Now" → Directly redirected to Stripe checkout
2. User completes payment on Stripe
3. After payment → Redirected back to gatheredgrace.com

## Stripe Payment Links Features

All payment links are configured with:
- ✅ Automatic billing address collection
- ✅ Multiple payment methods (cards, Apple Pay, Google Pay, etc.)
- ✅ Redirect back to gatheredgrace.com after completion
- ✅ Customer creation for order tracking
- ✅ Live mode (real payments)

## Managing Products & Prices

### To Update a Price:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Find the product
3. Create a new price (Stripe doesn't allow editing existing prices)
4. Update the price ID in `src/config/stripe.ts`
5. Optionally, archive the old price in Stripe

### To Add a New Product:
1. Create product in Stripe Dashboard or via API
2. Create a price for the product
3. Create a payment link
4. Add to `src/config/stripe.ts`
5. Add buy button integration in the relevant components

### To Update Payment Link Settings:
1. Go to [Stripe Payment Links](https://dashboard.stripe.com/payment-links)
2. Find the payment link
3. You can update redirect URL, collect shipping address, etc.
4. Note: If you create a new payment link, update the URL in `src/config/stripe.ts`

## Testing

### Test the Integration:
1. Visit your website
2. Click "Buy Now" on any product
3. You should be redirected to Stripe's checkout page
4. For testing, use Stripe's test card: `4242 4242 4242 4242`
   - ⚠️ **IMPORTANT:** These are LIVE payment links, so test payments will be real charges!

### Test Card Numbers (if you switch to test mode):
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires authentication: `4000 0025 0000 3155`
- Use any future expiration date and any CVC

## Security Notes

- ✅ No sensitive Stripe keys in frontend code
- ✅ Payment processing happens entirely on Stripe's secure servers
- ✅ Your publishable key can be added later if you need Stripe.js features
- ✅ Secret key is only used server-side (never exposed to frontend)

## Next Steps (Optional Enhancements)

1. **Enable shipping address collection** - Currently payment links don't collect shipping addresses. You may want to enable this in the payment link settings.

2. **Add tax collection** - Enable automatic tax calculation in Stripe for applicable states.

3. **Set up webhooks** - Listen for payment success events to automate order fulfillment:
   - Create a webhook endpoint in Vercel serverless function
   - Listen for `checkout.session.completed` events
   - Automatically create fulfillment tasks or send confirmation emails

4. **Add inventory tracking** - Connect Stripe products to inventory management.

5. **Subscription options** - For recurring gift boxes, create subscription products.

6. **Discount codes** - Enable promotion codes in payment link settings.

## Support

- **Stripe Dashboard:** https://dashboard.stripe.com
- **Stripe Documentation:** https://stripe.com/docs
- **Payment Links Docs:** https://stripe.com/docs/payment-links

## API Keys

Your Stripe keys are stored securely:
- **Publishable Key:** `pk_live_51SPYW5HB58d6ZKt6wbBSI5oBDr5qrrb3YZZoJNCoLdTMKmpTYWEhv9hb35mWzDOKkpkBkGsPeWYXCUtegQetWca900zY9tXR3D`
- **Secret Key:** (stored securely, not in code)

⚠️ **Never commit your secret key to version control!**

