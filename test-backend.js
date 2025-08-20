// Simple test script to verify backend API functionality
// Using built-in fetch (Node.js 18+)

const API_BASE_URL = 'http://localhost:3001/api';

async function testBackend() {
  console.log('🧪 Testing ViviSews Backend API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check passed:', healthData);
    } else {
      console.log('❌ Health check failed');
      return;
    }

    // Test signup endpoint
    console.log('\n2. Testing signup endpoint...');
    const signupData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'testpass123'
    };

    const signupResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    });

    if (signupResponse.ok) {
      const signupResult = await signupResponse.json();
      console.log('✅ Signup successful:', signupResult.message);
    } else {
      const errorData = await signupResponse.json();
      console.log('⚠️ Signup response:', errorData.message);
    }

    // Test login endpoint
    console.log('\n3. Testing login endpoint...');
    const loginData = {
      emailOrUsername: 'testuser',
      password: 'testpass123'
    };

    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (loginResponse.ok) {
      const loginResult = await loginResponse.json();
      console.log('✅ Login successful');
      console.log('Token received:', loginResult.token ? 'Yes' : 'No');
      console.log('User data:', loginResult.user ? 'Yes' : 'No');

      // Test authenticated endpoint
      console.log('\n4. Testing authenticated fabric endpoint...');
      const fabricsResponse = await fetch(`${API_BASE_URL}/fabrics`, {
        headers: {
          'Authorization': `Bearer ${loginResult.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (fabricsResponse.ok) {
        const fabricsResult = await fabricsResponse.json();
        console.log('✅ Fabrics endpoint working');
        console.log('Fabrics count:', fabricsResult.fabrics.length);
      } else {
        console.log('❌ Fabrics endpoint failed');
      }

    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Login failed:', errorData.message);
    }

    console.log('\n🎉 Backend API test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 3001');
    console.log('   Run: cd backend && npm run dev');
  }
}

testBackend();
