const { userQueries, livestockQueries } = require('../db/queries');
const pool = require('../db/pool');

async function testLivestockQueries() {
  console.log('🧪 Testing Livestock Queries...\n');

  try {
    // First create a test farmer
    const farmerData = {
      name: 'Livestock Test Farmer',
      phone: '+26771123457',
      email: 'livestock@test.com',
      password_hash: 'hashed_password',
      role: 'farmer'
    };

    const farmer = await userQueries.createUser(farmerData);
    const farmerProfile = await userQueries.createFarmerProfile({
      user_id: farmer.id,
      farm_location: 'Test Location',
      herd_size: 0,
      baits_account_id: 'BAITS67890'
    });

    // Test 1: Add livestock
    console.log('Test 1: Adding livestock');
    const livestock1 = await livestockQueries.addLivestock({
      farmer_id: farmerProfile.id,
      baits_tag_number: 'BW123456',
      species: 'cattle',
      breed: 'Brahman',
      birth_date: '2022-01-15',
      gender: 'female',
      health_status: 'healthy'
    });
    console.log('✅ Livestock added:', { 
      id: livestock1.id, 
      tag: livestock1.baits_tag_number,
      species: livestock1.species 
    });

    const livestock2 = await livestockQueries.addLivestock({
      farmer_id: farmerProfile.id,
      baits_tag_number: 'BW123457',
      species: 'goat',
      breed: 'Boer',
      birth_date: '2023-03-20',
      gender: 'male',
      health_status: 'healthy'
    });
    console.log('✅ Second livestock added:', { 
      id: livestock2.id, 
      tag: livestock2.baits_tag_number 
    });

    // Test 2: Get farmer livestock
    console.log('\nTest 2: Getting farmer livestock');
    const livestock = await livestockQueries.getFarmerLivestock(farmerProfile.id);
    console.log(`✅ Found ${livestock.length} animals:`);
    livestock.forEach(l => console.log(`   - ${l.baits_tag_number} (${l.species})`));

    // Test 3: Get livestock by ID
    console.log('\nTest 3: Getting livestock by ID');
    const found = await livestockQueries.getLivestockById(livestock1.id);
    console.log('✅ Found:', { 
      id: found.id, 
      tag: found.baits_tag_number,
      farmer_location: found.farm_location 
    });

    // Test 4: Get livestock by tag
    console.log('\nTest 4: Getting livestock by tag');
    const byTag = await livestockQueries.getLivestockByTag('BW123456');
    console.log('✅ Found by tag:', { 
      id: byTag.id, 
      tag: byTag.baits_tag_number 
    });

    // Test 5: Update livestock
    console.log('\nTest 5: Updating livestock');
    const updated = await livestockQueries.updateLivestock(livestock1.id, {
      health_status: 'sick',
      breed: 'Brahman Cross'
    });
    console.log('✅ Updated:', { 
      id: updated.id, 
      health_status: updated.health_status,
      breed: updated.breed 
    });

    // Test 6: Add health record
    console.log('\nTest 6: Adding health record');
    const healthRecord = await livestockQueries.addHealthRecord({
      livestock_id: livestock1.id,
      date: new Date(),
      symptoms: 'Fever, loss of appetite',
      diagnosis: 'Suspected tick fever',
      treatment: 'Antibiotics',
      ai_confidence: 0.85,
      created_by: farmer.id
    });
    console.log('✅ Health record added:', {
      id: healthRecord.id,
      diagnosis: healthRecord.diagnosis,
      ai_confidence: healthRecord.ai_confidence
    });

    // Test 7: Get health records
    console.log('\nTest 7: Getting health records');
    const records = await livestockQueries.getLivestockHealthRecords(livestock1.id);
    console.log(`✅ Found ${records.length} health records`);
    records.forEach(r => console.log(`   - ${r.date}: ${r.diagnosis} (by ${r.created_by_name})`));

    // Test 8: Get health record by ID
    console.log('\nTest 8: Getting health record by ID');
    const specificRecord = await livestockQueries.getHealthRecordById(healthRecord.id);
    console.log('✅ Found record:', {
      id: specificRecord.id,
      diagnosis: specificRecord.diagnosis,
      animal: specificRecord.baits_tag_number
    });

    // Test 9: Get health summary
    console.log('\nTest 9: Getting health summary');
    const summary = await livestockQueries.getHealthSummary(farmerProfile.id);
    console.log('✅ Summary:', {
      total: summary.summary.total_livestock,
      healthy: summary.summary.healthy_count,
      sick: summary.summary.sick_count,
      recent_events: summary.recentEvents.length
    });

    // Test 10: Filter livestock by species
    console.log('\nTest 10: Filtering livestock by species');
    const cattle = await livestockQueries.getFarmerLivestock(farmerProfile.id, 'cattle');
    console.log(`✅ Found ${cattle.length} cattle`);

    console.log('\n🎉 All livestock query tests passed!\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Clean up would go here
    await pool.end();
  }
}

testLivestockQueries();