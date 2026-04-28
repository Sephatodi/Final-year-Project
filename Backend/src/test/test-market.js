// test-market.js
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testMarketAPI() {
    console.log('🧪 Testing Market API endpoints...\n');

    try {
        // Test 1: Get all prices
        console.log('1️⃣ Getting all market prices...');
        const prices = await axios.get(`${API_URL}/market/prices?limit=5`);
        console.log(`   ✅ Found ${prices.data.data.total} prices`);
        console.log('   Sample:', prices.data.data.prices[0]?.livestockType, prices.data.data.prices[0]?.price);
        
        // Test 2: Get livestock types
        console.log('\n2️⃣ Getting livestock types...');
        const types = await axios.get(`${API_URL}/market/livestock-types`);
        console.log('   ✅ Types:', types.data.data.map(t => t.livestockType).join(', '));
        
        // Test 3: Get locations
        console.log('\n3️⃣ Getting market locations...');
        const locations = await axios.get(`${API_URL}/market/locations`);
        console.log('   ✅ Locations:', locations.data.data.map(l => l.location).join(', '));
        
        // Test 4: Get trends
        console.log('\n4️⃣ Getting price trends...');
        const trends = await axios.get(`${API_URL}/market/trends?livestockType=cattle&period=month`);
        console.log('   ✅ Trends data received');
        
        // Test 5: Compare prices
        console.log('\n5️⃣ Comparing prices...');
        const compare = await axios.get(`${API_URL}/market/compare?livestockType=cattle&locations=Nairobi,Nakuru`);
        console.log('   ✅ Comparison:', compare.data.data.comparison);

        console.log('\n🎉 All market API tests passed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testMarketAPI();