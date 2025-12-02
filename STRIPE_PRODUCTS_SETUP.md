# Stripe Products Setup Guide

This guide will help you create the Stripe products and payment links for the new kits using Stripe CLI.

## Prerequisites

1. Make sure you're logged into Stripe CLI:
   ```bash
   stripe login
   ```

2. Verify you're using the correct Stripe account (live or test mode)

## Step 1: Create Products

### Rest Kit Product
```bash
stripe products create \
  --name "Rest Kit" \
  --description "Includes a lavender eye pillow and soothing balm — a simple duo to ease tension and invite calm." \
  --id prod_rest_kit
```

### Reflect Kit Product
```bash
stripe products create \
  --name "Reflect Kit" \
  --description "Includes a lavender eye pillow, soothing balm, notepad, and pen — an invitation to unwind, breathe deeply, and put thoughts to paper." \
  --id prod_reflect_kit
```

### Custom Fabric Add-on Product
```bash
stripe products create \
  --name "Custom Fabric Selection" \
  --description "Custom themed fabric selection for eye pillow (+$5)" \
  --id prod_custom_fabric
```

## Step 2: Create Prices

### Rest Kit Base Price ($39)
```bash
stripe prices create \
  --product prod_rest_kit \
  --unit-amount 3900 \
  --currency usd \
  --id price_rest_kit
```

### Rest Kit with Custom Fabric ($44)
```bash
stripe prices create \
  --product prod_rest_kit \
  --unit-amount 4400 \
  --currency usd \
  --id price_rest_kit_custom_fabric
```

### Reflect Kit Base Price ($49)
```bash
stripe prices create \
  --product prod_reflect_kit \
  --unit-amount 4900 \
  --currency usd \
  --id price_reflect_kit
```

### Reflect Kit with Custom Fabric ($54)
```bash
stripe prices create \
  --product prod_reflect_kit \
  --unit-amount 5400 \
  --currency usd \
  --id price_reflect_kit_custom_fabric
```

### Custom Fabric Add-on Price ($5)
```bash
stripe prices create \
  --product prod_custom_fabric \
  --unit-amount 500 \
  --currency usd \
  --id price_custom_fabric
```

## Step 3: Create Payment Links

### Rest Kit Payment Link
```bash
stripe payment_links create \
  --line-items[0][price]=price_rest_kit \
  --line-items[0][quantity]=1 \
  --after-completion[type]=redirect \
  --after-completion[redirect][url]=https://momgatheredgrace.com
```

Copy the payment link URL and update `src/config/stripe.ts`:
- `REST_KIT: "https://buy.stripe.com/..."`

### Rest Kit with Custom Fabric Payment Link
```bash
stripe payment_links create \
  --line-items[0][price]=price_rest_kit_custom_fabric \
  --line-items[0][quantity]=1 \
  --after-completion[type]=redirect \
  --after-completion[redirect][url]=https://momgatheredgrace.com
```

Copy the payment link URL and update `src/config/stripe.ts`:
- `REST_KIT_CUSTOM_FABRIC: "https://buy.stripe.com/..."`

### Reflect Kit Payment Link
```bash
stripe payment_links create \
  --line-items[0][price]=price_reflect_kit \
  --line-items[0][quantity]=1 \
  --after-completion[type]=redirect \
  --after-completion[redirect][url]=https://momgatheredgrace.com
```

Copy the payment link URL and update `src/config/stripe.ts`:
- `REFLECT_KIT: "https://buy.stripe.com/..."`

### Reflect Kit with Custom Fabric Payment Link
```bash
stripe payment_links create \
  --line-items[0][price]=price_reflect_kit_custom_fabric \
  --line-items[0][quantity]=1 \
  --after-completion[type]=redirect \
  --after-completion[redirect][url]=https://momgatheredgrace.com
```

Copy the payment link URL and update `src/config/stripe.ts`:
- `REFLECT_KIT_CUSTOM_FABRIC: "https://buy.stripe.com/..."`

## Step 4: Update Configuration

After creating all payment links, update `src/config/stripe.ts` with the actual payment link URLs.

## Step 5: Environment Variables

Make sure to set the following environment variables in your Vercel project:

- `STRIPE_SECRET_KEY` - Your Stripe secret key (for checkout session API)

## Testing

1. Test the Rest Kit form with and without custom fabric
2. Test the Reflect Kit form with and without custom fabric
3. Test the Build Custom Kit form with custom budget selection

## Notes

- Payment links are configured to redirect back to `https://momgatheredgrace.com` after completion
- All prices are in USD
- Custom fabric adds $5 to the base price
- The Build Custom Kit form uses a dynamic checkout session that includes the custom budget as a line item

