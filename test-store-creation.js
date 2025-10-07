const axios = require('axios');

// Test the store creation functionality
async function testStoreCreation() {
  try {
    console.log('Testing Store Creation Functionality...\n');
    
    // Step 1: Login as STORE_OWNER (skip registration since user already exists)
    console.log('1. Logging in as STORE_OWNER...');
    const loginResponse = await axios.post('http://localhost:3000/auth/login', {
      email: 'testuser@test.com',
      password: 'Password123!'
    });
    
    const token = loginResponse.data.access_token;
    console.log('Login successful, token received');
    console.log('User role:', loginResponse.data.user.role);
    
    // Step 2: Try to create a store
    console.log('2. Creating a store...');
    const createStoreResponse = await axios.post('http://localhost:3000/stores', {
      name: 'Test Store with Proper Length for Validation Requirements',
      email: 'teststore@test.com',
      address: '123 Test Street, Test City, Test State, 12345'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Store created successfully:', createStoreResponse.data);
    
    // Step 3: Verify the store was created
    console.log('3. Verifying store creation...');
    const storesResponse = await axios.get('http://localhost:3000/stores/my-stores', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('User stores:', storesResponse.data);
    
    console.log('\n✅ Store creation test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.code) {
      console.error('Error code:', error.code);
    } else {
      console.error('Full error:', error);
    }
  }
}

testStoreCreation();