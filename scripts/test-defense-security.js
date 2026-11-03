const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          'Origin': 'http://localhost:4200'
        }
      },
      (res) => {
        let respData = '';
        res.on('data', chunk => respData += chunk);
        res.on('end', () => {
          let parsed;
          try { parsed = JSON.parse(respData); } catch (e) { parsed = respData; }
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING DEFENSIVE SECURITY & QA VERIFICATION SUITE ---\n');

  // Test 1: Honeypot on /api/contact
  const botContact = await post('/api/contact', {
    name: 'Spam Bot',
    email: 'spambot@spam.com',
    phone: '+1 555 123 4567',
    message: 'Buy cheap watches now!',
    website: 'http://malicious-spam-url.com' // Trigger Honeypot
  });
  console.log('Test 1 (Honeypot /api/contact):', botContact.status === 200 ? '✅ PASSED' : '❌ FAILED', botContact);

  // Test 2: Invalid Phone Number on /api/contact
  const badPhoneContact = await post('/api/contact', {
    name: 'Real User',
    email: 'user@example.com',
    phone: 'not-a-phone-number',
    message: 'Looking for Oracle Fusion HCM consulting services.'
  });
  console.log('Test 2 (Invalid Phone /api/contact):', badPhoneContact.status === 400 ? '✅ PASSED' : '❌ FAILED', badPhoneContact);

  // Test 3: Honeypot on /api/apply
  const botApply = await post('/api/apply', {
    name: 'Spam Applicant',
    email: 'bot@spam.com',
    resumeLink: 'https://drive.google.com/resume.pdf',
    jobTitle: 'Oracle HCM Consultant',
    website: 'http://automated-bot.com' // Trigger Honeypot
  });
  console.log('Test 3 (Honeypot /api/apply):', botApply.status === 200 ? '✅ PASSED' : '❌ FAILED', botApply);

  // Test 4: Malicious/Insecure Resume Link on /api/apply (Reject javascript:)
  const xssApply = await post('/api/apply', {
    name: 'Malicious Attacker',
    email: 'attacker@evil.com',
    resumeLink: 'javascript:alert(1)',
    jobTitle: 'Oracle HCM Consultant'
  });
  console.log('Test 4 (Reject javascript: URI /api/apply):', xssApply.status === 400 ? '✅ PASSED' : '❌ FAILED', xssApply);

  // Test 5: Insecure HTTP (Non-HTTPS) Resume Link on /api/apply
  const httpApply = await post('/api/apply', {
    name: 'Insecure User',
    email: 'insecure@domain.com',
    resumeLink: 'http://my-insecure-site.com/resume.pdf',
    jobTitle: 'Oracle HCM Consultant'
  });
  console.log('Test 5 (Reject plain http:// /api/apply):', httpApply.status === 400 ? '✅ PASSED' : '❌ FAILED', httpApply);

  console.log('\n--- ALL DEFENSIVE SECURITY TESTS COMPLETE ---');
}

runTests().catch(console.error);
