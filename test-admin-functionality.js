const axios = require('axios');

// Test all admin functionalities
async function testAllAdminFunctionalities() {
  try {
    console.log('🔍 COMPREHENSIVE ADMIN FUNCTIONALITY TEST\n');
    console.log('='.repeat(50));
    
    // Step 1: Create/Login as Admin
    console.log('1️⃣ ADMIN AUTHENTICATION');
    console.log('-'.repeat(30));
    
    let adminToken;
    
    try {
      // Try to login with existing admin (you may need to create one first)
      const adminLoginResponse = await axios.post('http://localhost:3000/auth/login', {
        email: 'admin@stores.com',
        password: 'AdminPass123!'
      });
      adminToken = adminLoginResponse.data.access_token;
      console.log('✅ Admin login successful');
      console.log(`   Role: ${adminLoginResponse.data.user.role}`);
    } catch (error) {
      // If admin doesn't exist, we'll use one of the existing STORE_OWNER accounts with admin-like permissions
      console.log('⚠️  Admin login failed, using STORE_OWNER for testing...');
      const ownerResponse = await axios.post('http://localhost:3000/auth/login', {
        email: 'ik@stores.com',
        password: 'IkPassword123!'
      });
      adminToken = ownerResponse.data.access_token;
      console.log('✅ Using STORE_OWNER account for admin testing');
      console.log(`   Role: ${ownerResponse.data.user.role}`);
    }

    // Step 2: Test Admin Dashboard
    console.log('\n2️⃣ ADMIN DASHBOARD');
    console.log('-'.repeat(30));
    
    try {
      const dashboardResponse = await axios.get('http://localhost:3000/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      console.log('✅ Dashboard API working');
      console.log(`   Total Users: ${dashboardResponse.data.totalUsers}`);
      console.log(`   Total Stores: ${dashboardResponse.data.totalStores}`);
      console.log(`   Total Ratings: ${dashboardResponse.data.totalRatings}`);
    } catch (error) {
      console.log('❌ Dashboard API failed:', error.response?.data || error.message);
    }

    // Step 3: Test Store Management
    console.log('\n3️⃣ ADMIN STORE MANAGEMENT');
    console.log('-'.repeat(30));
    
    try {
      // Get all stores
      const storesResponse = await axios.get('http://localhost:3000/admin/stores', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      console.log('✅ Get stores API working');
      console.log(`   Found ${storesResponse.data.length} stores`);
      
      // Test store creation
      try {
        const newStore = await axios.post('http://localhost:3000/admin/stores', {
          name: 'Admin Test Store with Long Name for Validation',
          email: 'adminstore@test.com',
          address: '456 Admin Street, Admin City, Admin State, 67890',
          ownerId: 'cmgg82kax0000urdcg1n1r72n' // Using existing user ID
        }, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        console.log('✅ Store creation API working');
        console.log(`   Created store: ${newStore.data.name}`);
        
        // Test get store ratings
        if (storesResponse.data.length > 0) {
          const storeId = storesResponse.data[0].id;
          const ratingsResponse = await axios.get(`http://localhost:3000/admin/stores/${storeId}/ratings`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
          });
          console.log('✅ Store ratings API working');
          console.log(`   Found ${ratingsResponse.data.length} ratings for store`);
        }
      } catch (error) {
        console.log('❌ Store creation failed:', error.response?.data || error.message);
      }
    } catch (error) {
      console.log('❌ Store management failed:', error.response?.data || error.message);
    }

    // Step 4: Test User Management
    console.log('\n4️⃣ ADMIN USER MANAGEMENT');
    console.log('-'.repeat(30));
    
    try {
      // Get all users
      const usersResponse = await axios.get('http://localhost:3000/admin/users', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      console.log('✅ Get users API working');
      console.log(`   Found ${usersResponse.data.length} users`);
      
      // Test user creation
      try {
        const newUser = await axios.post('http://localhost:3000/admin/users', {
          name: 'Admin Created User with Long Name for Validation',
          email: 'adminuser@test.com',
          address: '789 User Street, User City, User State, 12345',
          password: 'UserPass123!',
          role: 'USER'
        }, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        console.log('✅ User creation API working');
        console.log(`   Created user: ${newUser.data.name} (${newUser.data.role})`);
      } catch (error) {
        console.log('❌ User creation failed:', error.response?.data || error.message);
      }
      
      // Test get user details
      if (usersResponse.data.length > 0) {
        const userId = usersResponse.data[0].id;
        const userDetailsResponse = await axios.get(`http://localhost:3000/admin/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        console.log('✅ User details API working');
        console.log(`   Retrieved details for: ${userDetailsResponse.data.name}`);
      }
    } catch (error) {
      console.log('❌ User management failed:', error.response?.data || error.message);
    }

    // Step 5: Test Filtering and Search
    console.log('\n5️⃣ ADMIN FILTERING & SEARCH');
    console.log('-'.repeat(30));
    
    try {
      // Test store filtering
      const filteredStores = await axios.get('http://localhost:3000/admin/stores?name=test', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      console.log('✅ Store filtering API working');
      console.log(`   Filtered stores found: ${filteredStores.data.length}`);
      
      // Test user filtering
      const filteredUsers = await axios.get('http://localhost:3000/admin/users?role=USER', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      console.log('✅ User filtering API working');
      console.log(`   Filtered users found: ${filteredUsers.data.length}`);
    } catch (error) {
      console.log('❌ Filtering failed:', error.response?.data || error.message);
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 ADMIN FUNCTIONALITY TEST COMPLETED!');
    console.log('='.repeat(50));
    
    console.log('\n📋 FRONTEND COMPONENTS TO TEST:');
    console.log('• AdminDashboard - http://localhost:3001/admin/dashboard');
    console.log('• AdminStores - http://localhost:3001/admin/stores');
    console.log('• AdminUsers - http://localhost:3001/admin/users');
    console.log('\n💡 Make sure to login as an ADMIN user in the frontend!');

  } catch (error) {
    console.error('💥 Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testAllAdminFunctionalities();