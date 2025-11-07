// Simple test script for the form submission API
// Usage: node test-api-simple.mjs

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
  
  // Use Vercel dev server if running, otherwise use production
  const apiUrl = process.env.API_URL || 'http://localhost:3000/api/submit-form';
  
  console.log(`📍 API URL: ${apiUrl}\n`);

  try {
    console.log('📤 Sending test request...\n');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testFormData),
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}\n`);
    
    const data = await response.json();
    console.log(`📦 Response:`, JSON.stringify(data, null, 2));

    if (response.ok && data.ok) {
      console.log('\n✅ SUCCESS! Form submission API is working correctly.');
      if (data.emailId) {
        console.log(`📧 Email sent with ID: ${data.emailId}`);
      }
      return true;
    } else {
      console.error('\n❌ FAILED! API returned an error.');
      console.error(`Error: ${data.error || 'Unknown error'}`);
      console.error(`Message: ${data.message || 'No message'}`);
      return false;
    }
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
      console.log('\n💡 Tip: Start the Vercel dev server first:');
      console.log('   npx vercel dev');
      console.log('\n   Or test against production:');
      console.log('   API_URL=https://momgatheredgrace.vercel.app/api/submit-form node test-api-simple.mjs');
    }
    return false;
  }
}

testAPI().then(success => {
  process.exit(success ? 0 : 1);
});

