const axios = require('axios');

// Test the store creation functionality
async function testStoreCreation() {
  try {
    console.log('Testing Store Creation Functionality...\n');
    
    // Step 1: Register a store owner
    console.log('1. Registering a store owner...');
    const registerResponse = await axios.post('http://localhost:3000/auth/register', {
      email: 'storeowner@test.com',
      password: 'password123',
      name: 'Test Store Owner',
      role: 'STORE_OWNER'
    });
    
    console.log('Store owner registered successfully');
    
    // Step 2: Login as store owner
    console.log('2. Logging in as store owner...');
    const loginResponse = await axios.post('http://localhost:3000/auth/login', {
      email: 'storeowner@test.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.access_token;
    console.log('Login successful, token received');
    
    // Step 3: Try to create a store
    console.log('3. Creating a store...');
    const createStoreResponse = await axios.post('http://localhost:3000/stores', {
      name: 'Test Store',
      email: 'teststore@test.com',
      address: '123 Test Street, Test City'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Store created successfully:', createStoreResponse.data);
    
    // Step 4: Verify the store was created
    console.log('4. Verifying store creation...');
    const storesResponse = await axios.get('http://localhost:3000/stores/my-stores', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Store owner stores:', storesResponse.data);
    
    console.log('\n✅ Store creation test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testStoreCreation();