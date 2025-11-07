// Test script for the form submission API
// Load environment variables from .env.local if available
import 'dotenv/config';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local manually
try {
  const envFile = readFileSync(join(__dirname, '.env.local'), 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length) {
      const value = values.join('=').trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
} catch (e) {
  console.log('Note: .env.local not found, using process.env');
}

const testFormData = {
  recipient_name: "Jane Smith",
  address: "123 Main Street",
  city: "San Francisco",
  state: "CA",
  zip: "94102",
  recipient_email: "jane@example.com",
  occasion: "Birthday",
  season: "Spring",
  comforts: "Lavender, tea, cozy blankets",
  card_message: "Happy Birthday!",
  name_on_card: "Include my name",
  budget: "$50",
  sender_name: "John Doe",
  sender_email: "john@example.com",
  source_page: "http://localhost:5173/",
};

async function testAPI() {
  console.log('🧪 Testing form submission API...\n');
  
  // Check if we're testing locally or on Vercel
  const apiUrl = process.env.API_URL || 'http://localhost:3000/api/submit-form';
  
  console.log(`📍 API URL: ${apiUrl}`);
  console.log(`🔑 RESEND_API_KEY: ${process.env.RESEND_API_KEY ? 'Set (' + process.env.RESEND_API_KEY.substring(0, 10) + '...)' : 'NOT SET'}`);
  console.log(`📧 FORM_RECIPIENT_EMAIL: ${process.env.FORM_RECIPIENT_EMAIL || 'Not set'}`);
  console.log(`📤 RESEND_FROM_EMAIL: ${process.env.RESEND_FROM_EMAIL || 'Not set'}\n`);

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ ERROR: RESEND_API_KEY is not set in environment variables!');
    console.log('Please set it in .env.local file:\n');
    console.log('RESEND_API_KEY=re_your_api_key_here');
    process.exit(1);
  }

  try {
    console.log('📤 Sending test request...\n');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testFormData),
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    const data = await response.json();
    console.log(`📦 Response:`, JSON.stringify(data, null, 2));

    if (response.ok && data.ok) {
      console.log('\n✅ SUCCESS! Form submission API is working correctly.');
      if (data.emailId) {
        console.log(`📧 Email sent with ID: ${data.emailId}`);
      }
    } else {
      console.error('\n❌ FAILED! API returned an error.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Tip: Make sure the API server is running.');
      console.log('   For local testing, you may need to use Vercel CLI:');
      console.log('   npx vercel dev');
    }
    process.exit(1);
  }
}

testAPI();

