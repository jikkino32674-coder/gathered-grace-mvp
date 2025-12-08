import Stripe from 'stripe';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('❌ Error: STRIPE_SECRET_KEY not found in environment variables');
  console.error('Please make sure you have a .env.local file with your Stripe secret key');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  typescript: true,
});

// Current payment links from stripe.ts
const CURRENT_LINKS = {
  GATHERED_GRACE_GIFT_BOX: "https://buy.stripe.com/4gMfZhgSl6xIeji1vu1RC00",
  LAVENDER_EYE_PILLOW: "https://buy.stripe.com/28EdR9gSl5tEcba3DC1RC01",
  HANDMADE_BALM: "https://buy.stripe.com/00wcN5dG93lwcba0rq1RC02",
  JOURNAL_PEN_SET: "https://buy.stripe.com/5kQdR9eKd7BMdfeb641RC03",
  REST_KIT: "https://buy.stripe.com/fZu4gzdG93lw0ssa201RC04",
  REST_KIT_CUSTOM_FABRIC: "https://buy.stripe.com/fZu5kD7hL09k3EE5LK1RC05",
  REFLECT_KIT: "https://buy.stripe.com/14A4gzdG91do7UU3DC1RC06",
  REFLECT_KIT_CUSTOM_FABRIC: "https://buy.stripe.com/bJe00jfOhe0a0ss3DC1RC07",
  RESTORE_KIT: "https://buy.stripe.com/00w4gz59D4pA7UUeig1RC08",
  RESTORE_KIT_CUSTOM_FABRIC: "https://buy.stripe.com/00w3cv59De0aeji6PO1RC09",
} as const;

async function enablePromoCodesOnPaymentLinks() {
  try {
    console.log('🔍 Fetching all existing payment links...\n');

    // Get all existing payment links with expanded line items
    const existingLinks = await stripe.paymentLinks.list({
      limit: 100,
      expand: ['data.line_items', 'data.line_items.data.price']
    });

    const newLinks: Record<string, string> = {};
    let successCount = 0;
    let errorCount = 0;

    // Create a map of URLs to product names for easier lookup
    const urlToProductName: Record<string, string> = {};
    for (const [name, url] of Object.entries(CURRENT_LINKS)) {
      urlToProductName[url] = name;
    }

    for (const existingLink of existingLinks.data) {
      try {
        const productName = urlToProductName[existingLink.url];

        if (!productName) {
          console.log(`⚠️  Skipping unknown link: ${existingLink.url}`);
          continue;
        }

        console.log(`📋 ${productName}`);
        console.log(`   Current: ${existingLink.url}`);
        console.log(`   ID: ${existingLink.id}`);

        // Check if promotion codes are already enabled
        if (existingLink.allow_promotion_codes) {
          console.log(`   ✅ Promotion codes already enabled!`);
          newLinks[productName] = existingLink.url;
          successCount++;
          console.log('');
          continue;
        }

        // Create a new payment link with identical settings + allow_promotion_codes
        console.log('   🔄 Creating new link with promo codes enabled...');

        // Get the full payment link details with line items
        const fullLink = await stripe.paymentLinks.retrieve(existingLink.id, {
          expand: ['line_items', 'line_items.data.price']
        });

        if (!fullLink.line_items || !fullLink.line_items.data || fullLink.line_items.data.length === 0) {
          console.error(`   ❌ No line items found`);
          errorCount++;
          console.log('');
          continue;
        }

        // Build after_completion config, filtering out empty custom messages
        let afterCompletion: any = undefined;
        if (fullLink.after_completion?.type === 'redirect') {
          afterCompletion = {
            type: 'redirect',
            redirect: fullLink.after_completion.redirect,
          };
        } else if (fullLink.after_completion?.type === 'hosted_confirmation') {
          afterCompletion = {
            type: 'hosted_confirmation',
            hosted_confirmation: {} as any,
          };
          if (fullLink.after_completion.hosted_confirmation?.custom_message) {
            afterCompletion.hosted_confirmation.custom_message =
              fullLink.after_completion.hosted_confirmation.custom_message;
          }
        }

        const newLink = await stripe.paymentLinks.create({
          line_items: fullLink.line_items.data.map(item => ({
            price: item.price.id,
            quantity: item.quantity || 1,
          })),
          allow_promotion_codes: true,
          after_completion: afterCompletion,
          billing_address_collection: fullLink.billing_address_collection,
          shipping_address_collection: fullLink.shipping_address_collection || undefined,
          automatic_tax: fullLink.automatic_tax?.enabled ? { enabled: true } : undefined,
        });

        console.log(`   ✅ New link created: ${newLink.url}`);
        newLinks[productName] = newLink.url;
        successCount++;
        console.log('');

      } catch (error: any) {
        console.error(`   ❌ Error:`, error.message);
        errorCount++;
        console.log('');
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log('\n');

    if (successCount > 0) {
      console.log('📝 UPDATE src/config/stripe.ts WITH THESE NEW URLS:\n');
      console.log('export const STRIPE_PAYMENT_LINKS = {');
      for (const [productName, url] of Object.entries(newLinks)) {
        console.log(`  ${productName}: "${url}",`);
      }
      console.log('} as const;\n');
    }

    if (errorCount > 0) {
      console.log('⚠️  Some payment links had errors. Please check the output above.');
      process.exit(1);
    }

  } catch (error: any) {
    console.error('❌ Fatal error:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('   Authentication failed. Please check your STRIPE_SECRET_KEY.');
    }
    process.exit(1);
  }
}

// Run the script
enablePromoCodesOnPaymentLinks();
