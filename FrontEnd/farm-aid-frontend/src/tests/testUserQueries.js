const { userQueries } = require('../db/queries');
const pool = require('../db/pool');
const bcrypt = require('bcrypt');

async function testUserQueries() {
  console.log('🧪 Testing User Queries...\n');

  try {
    // Test 1: Create a farmer user
    console.log('Test 1: Creating farmer user');
    const farmerData = {
      name: 'Test Farmer',
      phone: '+26771123456',
      email: 'farmer@test.com',
      password_hash: await bcrypt.hash('password123', 10),
      role: 'farmer',
      language_pref: 'en'
    };

    const farmer = await userQueries.createUser(farmerData);
    console.log('✅ Farmer created:', { id: farmer.id, name: farmer.name });
    
    // Create farmer profile
    const farmerProfile = await userQueries.createFarmerProfile({
      user_id: farmer.id,
      farm_location: 'Francistown, Botswana',
      herd_size: 50,
      baits_account_id: 'BAITS12345'
    });
    console.log('✅ Farmer profile created:', farmerProfile);

    // Test 2: Create an expert user
    console.log('\nTest 2: Creating expert user');
    const expertData = {
      name: 'Dr. Test Vet',
      phone: '+26771234567',
      email: 'vet@test.com',
      password_hash: await bcrypt.hash('password123', 10),
      role: 'expert',
      language_pref: 'en'
    };

    const expert = await userQueries.createUser(expertData);
    console.log('✅ Expert created:', { id: expert.id, name: expert.name });

    // Create expert profile
    const expertProfile = await userQueries.createExpertProfile({
      user_id: expert.id,
      specialization: 'Cattle',
      license_number: 'VET2024001',
      region: 'Francistown',
      is_available: true
    });
    console.log('✅ Expert profile created:', expertProfile);

    // Test 3: Find user by email
    console.log('\nTest 3: Finding user by email');
    const foundByEmail = await userQueries.findByEmail('farmer@test.com');
    console.log('✅ Found by email:', { id: foundByEmail.id, email: foundByEmail.email });

    // Test 4: Find user by phone
    console.log('\nTest 4: Finding user by phone');
    const foundByPhone = await userQueries.findByPhone('+26771123456');
    console.log('✅ Found by phone:', { id: foundByPhone.id, phone: foundByPhone.phone });

    // Test 5: Get user profile with role details
    console.log('\nTest 5: Getting user profile');
    const profile = await userQueries.getUserProfile(farmer.id);
    console.log('✅ Profile retrieved:', {
      id: profile.id,
      name: profile.name,
      role: profile.role,
      farm_location: profile.farm_location,
      herd_size: profile.herd_size
    });

    // Test 6: Update user
    console.log('\nTest 6: Updating user');
    const updated = await userQueries.updateUser(farmer.id, {
      name: 'Test Farmer Updated',
      language_pref: 'tn'
    });
    console.log('✅ User updated:', updated);

    // Test 7: Get available experts
    console.log('\nTest 7: Getting available experts');
    const experts = await userQueries.getAvailableExperts('Francistown');
    console.log('✅ Available experts:', experts.length);
    experts.forEach(e => console.log(`   - ${e.name} (${e.specialization})`));

    // Test 8: Update expert availability
    console.log('\nTest 8: Updating expert availability');
    const updatedExpert = await userQueries.updateExpertAvailability(expertProfile.id, false);
    console.log('✅ Expert availability updated:', updatedExpert);

    // Test 9: Update herd size
    console.log('\nTest 9: Updating herd size');
    const updatedFarmer = await userQueries.updateHerdSize(farmerProfile.id, 75);
    console.log('✅ Herd size updated:', updatedFarmer);

    console.log('\n🎉 All user query tests passed!\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Clean up test data
    await pool.end();
  }
}

// Run tests
testUserQueries();