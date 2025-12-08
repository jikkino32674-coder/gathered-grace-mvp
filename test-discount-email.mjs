// Quick test script to send a discount email
// Usage: node test-discount-email.mjs your@email.com

const email = process.argv[2] || 'test@example.com';
const name = process.argv[3] || 'Test Customer';

console.log(`📧 Sending test discount email to: ${email}`);

const response = await fetch('https://gatheredgrace.us/api/send-discount-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, name }),
});

const result = await response.json();

if (response.ok) {
  console.log('✅ Email sent successfully!');
  console.log('📬 Check your inbox:', email);
  console.log('Email ID:', result.emailId);
} else {
  console.error('❌ Error sending email:', result);
}
