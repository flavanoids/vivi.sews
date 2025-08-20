// Test script to verify admin functionality
const API_BASE_URL = 'http://localhost:3001/api';

async function testAdminFunctionality() {
  console.log('🧪 Testing Admin Functionality...\n');

  try {
    // 1. Create a new user (should be pending)
    console.log('1. Creating a new user (should be pending)...');
    const signupResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testuser3@example.com',
        username: 'testuser3',
        password: 'testpass123'
      }),
    });

    if (signupResponse.ok) {
      const signupResult = await signupResponse.json();
      console.log('✅ New user created:', signupResult.message);
    } else {
      const errorData = await signupResponse.json();
      console.log('⚠️ Signup response:', errorData.message);
    }

    // 2. Login as ADMIN
    console.log('\n2. Logging in as ADMIN...');
    const adminLoginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailOrUsername: 'admin@vivisews.com',
        password: 'ADMIN'
      }),
    });

    if (adminLoginResponse.ok) {
      const adminLoginResult = await adminLoginResponse.json();
      console.log('✅ Admin login successful');
      console.log('Admin user:', adminLoginResult.user.username, adminLoginResult.user.role);
      
      const adminToken = adminLoginResult.token;

      // 3. Get pending users
      console.log('\n3. Getting pending users...');
      const pendingResponse = await fetch(`${API_BASE_URL}/auth/pending-users`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (pendingResponse.ok) {
        const pendingResult = await pendingResponse.json();
        console.log('✅ Pending users retrieved');
        console.log('Pending users count:', pendingResult.pendingUsers.length);
        
        if (pendingResult.pendingUsers.length > 0) {
          const pendingUser = pendingResult.pendingUsers[0];
          console.log('First pending user:', pendingUser.username, pendingUser.email);

          // 4. Approve the user
          console.log('\n4. Approving user...');
          const approveResponse = await fetch(`${API_BASE_URL}/auth/approve-user/${pendingUser.id}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${adminToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (approveResponse.ok) {
            const approveResult = await approveResponse.json();
            console.log('✅ User approved:', approveResult.message);
          } else {
            const errorData = await approveResponse.json();
            console.log('❌ Approve failed:', errorData.message);
          }
        }
      } else {
        const errorData = await pendingResponse.json();
        console.log('❌ Get pending users failed:', errorData.message);
      }

    } else {
      const errorData = await adminLoginResponse.json();
      console.log('❌ Admin login failed:', errorData.message);
    }

    console.log('\n🎉 Admin functionality test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminFunctionality();
