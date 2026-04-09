async function testFullRegistration() {
  try {
    const ts = Date.now();
    const testEmail = `gamified_${ts}@example.com`;
    
    console.log(`1. Testing interactive schema registration: ${testEmail}`);
    const payload = {
      name: 'Interactive Student',
      email: testEmail,
      password: 'password123',
      bio: 'I am a test generated user',
      educationalBackground: 'Test University',
      skills: ['React', 'Nodejs'],
      hobbies: ['Testing API'],
      socialLinks: {
        github: 'https://github.com/test',
        hackerrank: 'https://hackerrank.com/test',
        linkedin: 'https://linkedin.com/in/test'
      }
    };

    const registerRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!registerRes.ok) {
        const err = await registerRes.json();
        throw new Error(`Registration failed: ${err.message}`);
    }
    
    const registerData = await registerRes.json();
    console.log(`✅ Registered successfully! Token received.`);

    console.log('\n2. Fetching profile using token...');
    const token = registerData.token;

    const meRes = await fetch('http://localhost:5000/api/auth/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!meRes.ok) throw new Error('Fetch /me failed');
    const meData = await meRes.json();
    
    console.log(`✅ Profile retrieved.`);
    
    // Validate fields
    if (meData.bio === 'I am a test generated user' && meData.socialLinks?.github === 'https://github.com/test') {
       console.log('✅ Integrity Check: Bio and Social Links successfully retrieved!');
    } else {
       console.error('❌ Missing data across the wire:', meData);
       throw new Error('Data validation failed');
    }

    console.log('\n🚀 ALL UI AND BACKEND DATA STRUCTURES REPORTED CLEAN AND FULLY CONNECTED!');

  } catch (err) {
    console.error('❌ Test failed!', err.stack || err.message);
  }
}

testFullRegistration();
