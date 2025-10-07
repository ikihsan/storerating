// Quick API test script
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function testAPI() {
  try {
    // Test login
    console.log('Testing login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'user@stores.com',
      password: 'User123!'
    });
    
    console.log('Login successful:', loginResponse.data.access_token ? 'Token received' : 'No token');
    
    const token = loginResponse.data.access_token;
    
    // Test stores endpoint
    console.log('Testing stores endpoint...');
    const storesResponse = await axios.get(`${API_BASE_URL}/stores`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Stores response:', storesResponse.data);
    console.log('Number of stores:', storesResponse.data.length);
    
  } catch (error) {
    console.error('API Test Error:', error.response?.data || error.message);
  }
}

testAPI();