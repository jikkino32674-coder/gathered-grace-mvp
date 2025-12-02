import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('⚠️ WARNING: STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    })
  : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    if (!stripe) {
      return res.status(500).json({ 
        error: 'Stripe not configured',
        message: 'STRIPE_SECRET_KEY environment variable is missing',
      });
    }

    const {
      kitType,
      basePrice,
      customFabric = false,
      customBudget,
      formData,
      items_eye_pillow,
      items_balm,
      items_journal,
      items_custom_gift,
    } = req.body;

    if (!kitType) {
      return res.status(400).json({ error: 'Missing required field: kitType' });
    }

    // Calculate total amount
    let amount = 0; // in cents
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // For build_custom, build line items from individual selections
    if (kitType === 'build_custom') {
      // Add individual items based on selections
      if (items_eye_pillow) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Lavender Eye Pillow',
            },
            unit_amount: 2200, // $22
          },
          quantity: 1,
        });
        amount += 2200;
      }

      if (items_balm) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Handmade Balm',
            },
            unit_amount: 1500, // $15
          },
          quantity: 1,
        });
        amount += 1500;
      }

      if (items_journal) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Journal and Pen Set',
            },
            unit_amount: 1800, // $18
          },
          quantity: 1,
        });
        amount += 1800;
      }

      // Add $5 custom fabric upcharge if selected
      if (customFabric && items_eye_pillow) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Custom Fabric Upcharge',
              description: 'Custom themed fabric for eye pillow',
            },
            unit_amount: 500, // $5
          },
          quantity: 1,
        });
        amount += 500;
      }

      // Add custom budget as a tip/donation line item - ALWAYS add if custom gift is selected
      if (items_custom_gift && customBudget) {
        // Parse budget range to get the amount
        let budgetAmount = 0;
        if (customBudget === '$10-$20') budgetAmount = 1500; // $15 (middle of range)
        else if (customBudget === '$20-$30') budgetAmount = 2500; // $25 (middle of range)
        else if (customBudget === '$30-$50') budgetAmount = 4000; // $40 (middle of range)
        else if (customBudget === '$50+') budgetAmount = 5000; // $50 (minimum)

        if (budgetAmount > 0) {
          // Add as a custom line item (tip/bonus for custom gift)
          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Custom Gift Budget',
                description: `Budget for personalized custom gift (${customBudget})`,
              },
              unit_amount: budgetAmount,
            },
            quantity: 1,
          });
          amount += budgetAmount;
        }
      }
    } else {
      // For standard kits (rest/reflect), use kit price IDs
      if (!basePrice) {
        return res.status(400).json({ error: 'Missing required field: basePrice for standard kits' });
      }

      const priceId = kitType === 'rest' 
        ? process.env.STRIPE_REST_KIT_PRICE_ID || 'price_rest_kit'
        : process.env.STRIPE_REFLECT_KIT_PRICE_ID || 'price_reflect_kit';

      lineItems.push({
        price: priceId,
        quantity: 1,
      });
      amount = basePrice;

      // Add $5 custom fabric upcharge if selected
      if (customFabric) {
        const customFabricPriceId = kitType === 'rest'
          ? process.env.STRIPE_REST_KIT_CUSTOM_FABRIC_PRICE_ID || 'price_rest_kit_custom_fabric'
          : process.env.STRIPE_REFLECT_KIT_CUSTOM_FABRIC_PRICE_ID || 'price_reflect_kit_custom_fabric';
        
        lineItems.push({
          price: customFabricPriceId,
          quantity: 1,
        });
        amount += 500; // $5 in cents
      }
    }

    // Get base URL
    const host = req.headers.host || 'momgatheredgrace.vercel.app';
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const baseUrl = `${protocol}://${host}`;

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/build-custom-kit?canceled=true`,
      metadata: {
        kit_type: kitType,
        custom_fabric: customFabric ? 'yes' : 'no',
        custom_budget: customBudget || '',
        form_data: JSON.stringify(formData || {}),
      },
      customer_email: formData?.sender_email || undefined,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
    });

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message,
    });
  }
}

