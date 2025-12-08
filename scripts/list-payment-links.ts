import Stripe from 'stripe';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('❌ Error: STRIPE_SECRET_KEY not found in environment variables');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  typescript: true,
});

async function listPaymentLinks() {
  try {
    console.log('🔍 Fetching all payment links...\n');

    const paymentLinks = await stripe.paymentLinks.list({ limit: 100 });

    if (paymentLinks.data.length === 0) {
      console.log('❌ No payment links found in your Stripe account.');
      return;
    }

    console.log(`Found ${paymentLinks.data.length} payment links:\n`);

    for (const link of paymentLinks.data) {
      console.log('━'.repeat(80));
      console.log(`ID: ${link.id}`);
      console.log(`URL: ${link.url}`);
      console.log(`Active: ${link.active}`);
      console.log(`Promotion Codes Allowed: ${link.allow_promotion_codes ? '✅ YES' : '❌ NO'}`);

      // Get product/price info
      if (link.line_items && link.line_items.length > 0) {
        for (const item of link.line_items) {
          console.log(`Price ID: ${item.price.id}`);
          console.log(`Product: ${item.price.product}`);

          // Fetch product details
          try {
            const product = await stripe.products.retrieve(item.price.product as string);
            console.log(`Product Name: ${product.name}`);
            console.log(`Amount: $${(item.price.unit_amount || 0) / 100}`);
          } catch (e) {
            console.log(`Product: ${item.price.product}`);
          }
        }
      }
      console.log('');
    }

    console.log('━'.repeat(80));
    console.log(`\n📊 Total: ${paymentLinks.data.length} payment links`);
    console.log(`✅ With promo codes: ${paymentLinks.data.filter(l => l.allow_promotion_codes).length}`);
    console.log(`❌ Without promo codes: ${paymentLinks.data.filter(l => !l.allow_promotion_codes).length}\n`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listPaymentLinks();
