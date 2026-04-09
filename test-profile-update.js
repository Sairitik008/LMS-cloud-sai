async function testProfileUpdate() {
  try {
    console.log('1. Logging in as student...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@example.com', password: 'password123' })
    });
    
    if (!loginRes.ok) throw new Error('Login failed');
    const loginData = await loginRes.json();
    
    const token = loginData.token;
    console.log(`✅ Logged in successfully. Token received.`);
    console.log(`Original Name: ${loginData.name}`);

    console.log('\n2. Updating profile name...');
    
    // When using multer, we sometimes need FormData, but we can also use multipart.
    // Wait, the client used FormData. We should use FormData for fetch.

    // Wait, the uploadImage middleware intercepts form-data.
    // If we only send a name, we can format a FormData payload using node's FormData
    const formData = new FormData();
    formData.append('name', 'John Student The Third');

    const updateRes2 = await fetch('http://localhost:5000/api/auth/me', {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!updateRes2.ok) {
        const err = await updateRes2.json();
        console.error("Server Error Payload:", err);
        throw new Error(`Update failed: ${err.message}`);
    }
    const updateData = await updateRes2.json();
    
    console.log(`✅ Profile updated! New Name: ${updateData.name}`);

    console.log('\n3. Reverting profile name...');
    const formDataRevert = new FormData();
    formDataRevert.append('name', 'LMS Student');

    const revertRes = await fetch('http://localhost:5000/api/auth/me', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formDataRevert
    });
    
    if (!revertRes.ok) {
        const err = await revertRes.json();
        throw new Error(`Revert failed: ${err.message}`);
    }
    const revertData = await revertRes.json();
    console.log(`✅ Profile reverted to: ${revertData.name}`);

    console.log('\n🚀 ALL TESTS PASSED SUCCESSFULLY!');

  } catch (err) {
    console.error('❌ Test failed!', err.message);
  }
}

testProfileUpdate();
