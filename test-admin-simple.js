const https = require('https');
const http = require('http');

// Simple HTTP client function
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const req = client.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ data: parsed, status: res.statusCode });
        } catch (e) {
          resolve({ data, status: res.statusCode });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.data) {
      req.write(JSON.stringify(options.data));
    }
    
    req.end();
  });
}

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
      // Try to login with existing store owner
      const response = await makeRequest('http://localhost:3000/auth/login', {
        method: 'POST',
        data: {
          email: 'ik@stores.com',
          password: 'IkPassword123!'
        }
      });
      
      if (response.status === 200 || response.status === 201) {
        adminToken = response.data.access_token;
        console.log('✅ Store owner login successful');
        console.log(`   Role: ${response.data.user.role}`);
        console.log(`   Token: ${adminToken ? 'Generated' : 'Missing'}`);
      } else {
        throw new Error(`Login failed with status: ${response.status}`);
      }
    } catch (error) {
      console.log('❌ Authentication failed:', error.message);
      return;
    }

    // Step 2: Test Admin Dashboard
    console.log('\n2️⃣ ADMIN DASHBOARD');
    console.log('-'.repeat(30));
    
    try {
      const dashboardResponse = await makeRequest('http://localhost:3000/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      if (dashboardResponse.status === 200) {
        console.log('✅ Dashboard API working');
        console.log(`   Response: ${JSON.stringify(dashboardResponse.data, null, 2)}`);
      } else {
        console.log('❌ Dashboard API failed with status:', dashboardResponse.status);
        console.log('   Response:', dashboardResponse.data);
      }
    } catch (error) {
      console.log('❌ Dashboard API failed:', error.message);
    }

    // Step 3: Test Store Management
    console.log('\n3️⃣ ADMIN STORE MANAGEMENT');
    console.log('-'.repeat(30));
    
    try {
      // Get all stores
      const storesResponse = await makeRequest('http://localhost:3000/admin/stores', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      if (storesResponse.status === 200) {
        console.log('✅ Get stores API working');
        console.log(`   Found ${storesResponse.data.length} stores`);
        if (storesResponse.data.length > 0) {
          console.log('   First store:', storesResponse.data[0].name);
        }
      } else {
        console.log('❌ Get stores failed with status:', storesResponse.status);
      }
    } catch (error) {
      console.log('❌ Store management failed:', error.message);
    }

    // Step 4: Test User Management
    console.log('\n4️⃣ ADMIN USER MANAGEMENT');
    console.log('-'.repeat(30));
    
    try {
      // Get all users
      const usersResponse = await makeRequest('http://localhost:3000/admin/users', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      if (usersResponse.status === 200) {
        console.log('✅ Get users API working');
        console.log(`   Found ${usersResponse.data.length} users`);
        if (usersResponse.data.length > 0) {
          console.log('   First user:', usersResponse.data[0].name, `(${usersResponse.data[0].role})`);
        }
      } else {
        console.log('❌ Get users failed with status:', usersResponse.status);
      }
    } catch (error) {
      console.log('❌ User management failed:', error.message);
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
  }
}

testAllAdminFunctionalities();