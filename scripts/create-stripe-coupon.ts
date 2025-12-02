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

async function createWelcomeCoupon() {
  try {
    console.log('🎟️  Creating WELCOME10 coupon in Stripe...');

    // Check if coupon already exists
    try {
      const existingCoupon = await stripe.coupons.retrieve('WELCOME10');
      console.log('✅ Coupon WELCOME10 already exists:', existingCoupon);
      console.log('   - Percent Off:', existingCoupon.percent_off + '%');
      console.log('   - Valid:', existingCoupon.valid ? 'Yes' : 'No');
      return;
    } catch (error: any) {
      if (error.code !== 'resource_missing') {
        throw error;
      }
      // Coupon doesn't exist, continue to create it
    }

    // Create the coupon
    const coupon = await stripe.coupons.create({
      id: 'WELCOME10',
      percent_off: 10,
      duration: 'once',
      name: 'Welcome Discount - 10% Off First Order',
      metadata: {
        description: 'New customer welcome discount',
        source: 'discount_popup',
      },
    });

    console.log('✅ Successfully created WELCOME10 coupon!');
    console.log('   - Coupon ID:', coupon.id);
    console.log('   - Percent Off:', coupon.percent_off + '%');
    console.log('   - Duration:', coupon.duration);
    console.log('   - Name:', coupon.name);
    console.log('\n🎉 Customers can now use code WELCOME10 at checkout for 10% off!');
  } catch (error: any) {
    console.error('❌ Error creating coupon:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('   Authentication failed. Please check your STRIPE_SECRET_KEY.');
    } else if (error.type === 'StripeAPIError') {
      console.error('   Stripe API error:', error.raw?.message);
    }
    process.exit(1);
  }
}

// Run the script
createWelcomeCoupon();
