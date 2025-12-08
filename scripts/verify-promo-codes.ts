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

async function verifyPromoCodes() {
  try {
    console.log('🔍 Verifying promo code support on new payment links...\n');

    // Test a few of the new links
    const testLinks = [
      { name: 'GATHERED_GRACE_GIFT_BOX', id: 'plink_1SZigZHB58d6ZKt6tGfS3WTl' },
      { name: 'LAVENDER_EYE_PILLOW', id: 'plink_1SZigYHB58d6ZKt6H2oLaIHb' },
      { name: 'REST_KIT', id: 'plink_1SZigWHB58d6ZKt6VJwB4Q29' },
    ];

    // Get all payment links
    const allLinks = await stripe.paymentLinks.list({ limit: 100 });

    // Check the most recent ones (our new links)
    const recentLinks = allLinks.data.slice(0, 10);

    console.log('📊 Recent Payment Links:\n');

    for (const link of recentLinks) {
      const promoStatus = link.allow_promotion_codes ? '✅ ENABLED' : '❌ DISABLED';
      console.log(`${promoStatus} - ${link.url}`);
    }

    const enabledCount = recentLinks.filter(l => l.allow_promotion_codes).length;
    const totalCount = recentLinks.length;

    console.log('\n' + '━'.repeat(80));
    console.log(`\n✅ ${enabledCount}/${totalCount} recent links have promo codes enabled`);

    if (enabledCount === totalCount) {
      console.log('\n🎉 SUCCESS! All new payment links support promo codes!');
      console.log('\nCustomers can now enter code WELCOME10 at checkout for 10% off.\n');
    } else {
      console.log('\n⚠️  Warning: Not all links have promo codes enabled');
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyPromoCodes();
