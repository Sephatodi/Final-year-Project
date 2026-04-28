/**
 * Integration test for all Farm-Aid database functions
 * Tests the complete flow from user creation to consultation
 */

const { 
  userQueries, 
  livestockQueries, 
  consultationQueries, 
  knowledgeQueries,
  syncQueue 
} = require('../db/queries');
const pool = require('../db/pool');
const bcrypt = require('bcrypt');

async function runIntegrationTest() {
  console.log('🔄 Running Farm-Aid Integration Test\n');
  console.log('=' .repeat(60));

  let farmer, expert, livestock, consultation;

  try {
    // STEP 1: Create users
    console.log('\n📝 STEP 1: Creating users');
    
    // Create farmer
    const farmerData = {
      name: 'Integration Farmer',
      phone: '+26771123460',
      email: 'integration.farmer@test.com',
      password_hash: await bcrypt.hash('farmer123', 10),
      role: 'farmer'
    };
    farmer = await userQueries.createUser(farmerData);
    
    const farmerProfile = await userQueries.createFarmerProfile({
      user_id: farmer.id,
      farm_location: 'Mochudi, Botswana',
      herd_size: 25,
      baits_account_id: 'BAITS123INT'
    });
    console.log('✅ Farmer created:', farmer.name);

    // Create expert
    const expertData = {
      name: 'Dr. Integration Vet',
      phone: '+26771234569',
      email: 'integration.vet@test.com',
      password_hash: await bcrypt.hash('vet123', 10),
      role: 'expert'
    };
    expert = await userQueries.createUser(expertData);
    
    const expertProfile = await userQueries.createExpertProfile({
      user_id: expert.id,
      specialization: 'Ruminants',
      license_number: 'VET2024INT',
      region: 'Kgatleng',
      is_available: true
    });
    console.log('✅ Expert created:', expert.name);

    // STEP 2: Add livestock
    console.log('\n🐄 STEP 2: Adding livestock');
    livestock = await livestockQueries.addLivestock({
      farmer_id: farmerProfile.id,
      baits_tag_number: 'BWINT001',
      species: 'cattle',
      breed: 'Tswana',
      birth_date: '2022-05-15',
      gender: 'female',
      health_status: 'healthy'
    });
    console.log('✅ Livestock added:', livestock.baits_tag_number);

    // STEP 3: Check symptoms (simulate AI)
    console.log('\n🔍 STEP 3: Symptom checking');
    console.log('   Symptoms: Fever, loss of appetite, salivation');
    
    // In real app, AI would run here
    const aiResult = {
      possible_diseases: [
        { name: 'Foot and Mouth Disease', confidence: 0.92, notifiable: true },
        { name: 'Bovine Viral Diarrhea', confidence: 0.45, notifiable: false }
      ]
    };
    console.log('   AI Analysis: FMD detected with 92% confidence');
    
    // STEP 4: Create consultation
    console.log('\n💬 STEP 4: Creating consultation');
    consultation = await consultationQueries.createConsultation({
      farmer_id: farmer.id,
      livestock_id: livestock.id,
      ai_suggestions: JSON.stringify(aiResult)
    });
    console.log('✅ Consultation created with ID:', consultation.id);

    // STEP 5: Queue offline sync
    console.log('\n📱 STEP 5: Testing offline sync');
    const syncItem = await syncQueue.queueItem({
      user_id: farmer.id,
      operation_type: 'INSERT',
      table_name: 'consultations',
      record_id: consultation.id,
      data: consultation,
      priority: 3 // High priority for consultations
    });
    console.log('✅ Consultation queued for sync');

    // STEP 6: Expert responds
    console.log('\n👨‍⚕️ STEP 6: Expert response');
    
    // Assign expert
    await consultationQueries.assignExpert(consultation.id, expert.id);
    console.log('✅ Expert assigned');

    // Send messages
    await consultationQueries.sendMessage({
      consultation_id: consultation.id,
      sender_id: farmer.id,
      content: 'My cow is not eating and has blisters on the mouth',
      is_offline: false
    });
    
    await consultationQueries.sendMessage({
      consultation_id: consultation.id,
      sender_id: expert.id,
      content: 'Based on the symptoms and AI analysis, this could be FMD. Please isolate the animal immediately.',
      is_offline: false
    });
    console.log('✅ Messages exchanged');

    // STEP 7: Check knowledge base
    console.log('\n📚 STEP 7: Knowledge base lookup');
    
    // Create FMD article if not exists
    const fmdArticle = await knowledgeQueries.createArticle({
      title_en: 'Foot and Mouth Disease',
      title_tn: 'Bolwetse jwa Lolwapa le Molomo',
      content_en: 'FMD is a severe viral disease...',
      content_tn: 'Bolwetse jwa Lolwapa le Molomo ke...',
      disease_code: 'FMD',
      species: 'cattle,goat,sheep',
      symptoms: 'Blisters on mouth and feet, fever, salivation, lameness',
      treatment: 'No specific treatment. Supportive care only.',
      prevention: 'Vaccination, movement control, biosecurity',
      notifiable: true,
      tags: 'fmd,foot,mouth,blisters,notifiable'
    });
    
    const article = await knowledgeQueries.getArticleByDiseaseCode('FMD', 'en');
    console.log('✅ FMD information retrieved:');
    console.log(`   Title: ${article.title}`);
    console.log(`   Treatment: ${article.treatment.substring(0, 50)}...`);

    // STEP 8: Disease reporting
    console.log('\n🚨 STEP 8: Disease reporting');
    
    // Create disease report (would be triggered by high-confidence FMD)
    const reportData = {
      id: Date.now(),
      farmer_id: farmer.id,
      location: farmerProfile.farm_location,
      description: 'Cow with blisters on mouth and feet, excessive salivation',
      image_url: 'https://example.com/fmd-photo.jpg',
      status: 'pending'
    };
    
    // Queue for sync to DVS
    await syncQueue.queueItem({
      user_id: farmer.id,
      operation_type: 'INSERT',
      table_name: 'disease_reports',
      record_id: reportData.id,
      data: reportData,
      priority: 5 // Highest priority for disease reports
    });
    console.log('✅ Disease report created and queued for DVS');

    // STEP 9: Consultation resolution
    console.log('\n✅ STEP 9: Resolving consultation');
    const resolved = await consultationQueries.resolveConsultation(
      consultation.id,
      'Confirmed FMD case. DVS notified. Animal isolated. Farmer advised on biosecurity.'
    );
    console.log('✅ Consultation resolved:', resolved.status);

    // STEP 10: Sync status check
    console.log('\n📊 STEP 10: Final sync status');
    const syncStatus = await syncQueue.getUserSyncStatus(farmer.id);
    console.log('   Pending items:', syncStatus.pending_count);
    console.log('   Failed items:', syncStatus.failed_count);
    console.log('   Last sync:', syncStatus.last_successful_sync || 'Never');

    console.log('\n' + '=' .repeat(60));
    console.log('🎉 INTEGRATION TEST PASSED!');
    console.log('✅ All Farm-Aid database functions working together');
    console.log('=' .repeat(60));

  } catch (error) {
    console.error('\n❌ Integration test failed:', error);
  } finally {
    await pool.end();
  }
}

runIntegrationTest();