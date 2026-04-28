const { userQueries, livestockQueries, consultationQueries } = require('../db/queries');
const pool = require('../db/pool');

async function testConsultationQueries() {
  console.log('🧪 Testing Consultation Queries...\n');

  try {
    // Create test users
    const farmerData = {
      name: 'Consultation Farmer',
      phone: '+26771123458',
      email: 'consult@test.com',
      password_hash: 'hashed',
      role: 'farmer'
    };
    const farmer = await userQueries.createUser(farmerData);
    const farmerProfile = await userQueries.createFarmerProfile({
      user_id: farmer.id,
      farm_location: 'Test Location',
      baits_account_id: 'BAITS999'
    });

    const expertData = {
      name: 'Dr. Consultation',
      phone: '+26771234568',
      email: 'consult.vet@test.com',
      password_hash: 'hashed',
      role: 'expert'
    };
    const expert = await userQueries.createUser(expertData);
    const expertProfile = await userQueries.createExpertProfile({
      user_id: expert.id,
      specialization: 'General',
      license_number: 'VET2024002',
      region: 'Test Region'
    });

    // Add a test animal
    const livestock = await livestockQueries.addLivestock({
      farmer_id: farmerProfile.id,
      baits_tag_number: 'BW999888',
      species: 'sheep',
      breed: 'Dorper',
      birth_date: '2023-01-01',
      gender: 'female'
    });

    // Test 1: Create consultation
    console.log('Test 1: Creating consultation');
    const consultation = await consultationQueries.createConsultation({
      farmer_id: farmer.id,
      livestock_id: livestock.id,
      ai_suggestions: 'AI suggests possible tick infestation'
    });
    console.log('✅ Consultation created:', { 
      id: consultation.id, 
      status: consultation.status 
    });

    // Test 2: Get farmer consultations
    console.log('\nTest 2: Getting farmer consultations');
    const farmerConsults = await consultationQueries.getFarmerConsultations(farmer.id);
    console.log(`✅ Found ${farmerConsults.length} consultations`);
    farmerConsults.forEach(c => console.log(`   - ID: ${c.id}, Status: ${c.status}`));

    // Test 3: Assign expert
    console.log('\nTest 3: Assigning expert to consultation');
    const assigned = await consultationQueries.assignExpert(consultation.id, expert.id);
    console.log('✅ Expert assigned:', { 
      id: assigned.id, 
      expert_id: assigned.expert_id,
      status: assigned.status 
    });

    // Test 4: Get expert consultations
    console.log('\nTest 4: Getting expert consultations');
    const expertConsults = await consultationQueries.getExpertConsultations(expert.id);
    console.log(`✅ Found ${expertConsults.length} consultations for expert`);

    // Test 5: Send message
    console.log('\nTest 5: Sending messages');
    const message1 = await consultationQueries.sendMessage({
      consultation_id: consultation.id,
      sender_id: farmer.id,
      content: 'My sheep is not eating and has a fever',
      is_offline: false
    });
    console.log('✅ Farmer message sent:', message1.content);

    const message2 = await consultationQueries.sendMessage({
      consultation_id: consultation.id,
      sender_id: expert.id,
      content: 'Please provide more details about the symptoms',
      is_offline: false
    });
    console.log('✅ Expert message sent:', message2.content);

    // Test 6: Get consultation messages
    console.log('\nTest 6: Getting consultation messages');
    const messages = await consultationQueries.getConsultationMessages(consultation.id);
    console.log(`✅ Found ${messages.length} messages:`);
    messages.forEach(m => console.log(`   [${m.sender_role}] ${m.sender_name}: ${m.content}`));

    // Test 7: Get consultation by ID with details
    console.log('\nTest 7: Getting consultation details');
    const details = await consultationQueries.getConsultationById(consultation.id);
    console.log('✅ Consultation details:', {
      farmer: details.farmer_name,
      expert: details.expert_name,
      animal: details.baits_tag_number,
      status: details.status
    });

    // Test 8: Mark messages as read
    console.log('\nTest 8: Marking messages as read');
    await consultationQueries.markMessagesAsRead(consultation.id, expert.id);
    console.log('✅ Messages marked as read');

    // Test 9: Get pending count
    console.log('\nTest 9: Getting pending consultation count');
    const pending = await consultationQueries.getPendingCount(expert.id);
    console.log(`✅ Pending consultations: ${pending}`);

    // Test 10: Resolve consultation
    console.log('\nTest 10: Resolving consultation');
    const resolved = await consultationQueries.resolveConsultation(
      consultation.id, 
      'Diagnosed with tick infestation, treatment prescribed'
    );
    console.log('✅ Consultation resolved:', {
      id: resolved.id,
      status: resolved.status,
      resolved_at: resolved.resolved_at
    });

    // Test 11: Sync offline messages
    console.log('\nTest 11: Syncing offline messages');
    const offlineMessages = [
      {
        consultation_id: consultation.id,
        sender_id: farmer.id,
        content: 'Offline message 1',
        timestamp: new Date()
      },
      {
        consultation_id: consultation.id,
        sender_id: farmer.id,
        content: 'Offline message 2',
        timestamp: new Date()
      }
    ];
    const synced = await consultationQueries.syncOfflineMessages(offlineMessages);
    console.log(`✅ Synced ${synced.length} offline messages`);

    console.log('\n🎉 All consultation query tests passed!\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await pool.end();
  }
}

testConsultationQueries();