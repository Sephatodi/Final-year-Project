/**
 * AI System Integration Test & Verification
 * This file verifies that all AI learning components are properly integrated
 */

import { initializeAI, unifiedSearch, recognizeDiseaseFromImageBase64 } from './aiService.js';
import { knowledgeBaseQueries } from '../db/knowledgeBaseQueries.js';
import { learnFromPDFs, ingestLocalImages, learnFromImagesFolderPDFs, startComprehensiveAILearning } from './knowledgeIngestionService.js';

export async function runIntegrationTests() {
  console.log('\n=== AI System Integration Test Suite ===\n');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Test 1: Verify imports
  console.log('Test 1: Verifying module imports...');
  try {
    if (typeof initializeAI !== 'function') throw new Error('initializeAI not exported');
    if (typeof unifiedSearch !== 'function') throw new Error('unifiedSearch not exported');
    if (typeof learnFromPDFs !== 'function') throw new Error('learnFromPDFs not exported');
    if (typeof ingestLocalImages !== 'function') throw new Error('ingestLocalImages not exported');
    if (typeof learnFromImagesFolderPDFs !== 'function') throw new Error('learnFromImagesFolderPDFs not exported');
    if (typeof startComprehensiveAILearning !== 'function') throw new Error('startComprehensiveAILearning not exported');
    
    console.log('✓ All AI functions properly exported');
    results.passed++;
    results.tests.push({ name: 'Module Imports', status: 'PASS' });
  } catch (err) {
    console.error('✗ Import verification failed:', err.message);
    results.failed++;
    results.tests.push({ name: 'Module Imports', status: 'FAIL', error: err.message });
  }

  // Test 2: Verify IndexedDB setup
  console.log('\nTest 2: Verifying IndexedDB schemas...');
  try {
    const db = await knowledgeBaseQueries.getDB();
    if (!db.objectStoreNames.contains('knowledgeBase')) throw new Error('knowledgeBase store missing');
    if (!db.objectStoreNames.contains('systemStatus')) throw new Error('systemStatus store missing');
    
    console.log('✓ All required IndexedDB stores present');
    results.passed++;
    results.tests.push({ name: 'IndexedDB Setup', status: 'PASS' });
  } catch (err) {
    console.error('✗ IndexedDB verification failed:', err.message);
    results.failed++;
    results.tests.push({ name: 'IndexedDB Setup', status: 'FAIL', error: err.message });
  }

  // Test 3: Verify knowledge base initialization
  console.log('\nTest 3: Initializing knowledge base...');
  try {
    await knowledgeBaseQueries.initializeKnowledgeBase();
    const count = await knowledgeBaseQueries.getArticleCount();
    if (count === 0) throw new Error('Knowledge base empty after initialization');
    
    console.log(`✓ Knowledge base initialized with ${count} articles`);
    results.passed++;
    results.tests.push({ name: 'Knowledge Base Init', status: 'PASS', details: `${count} articles` });
  } catch (err) {
    console.error('✗ Knowledge base initialization failed:', err.message);
    results.failed++;
    results.tests.push({ name: 'Knowledge Base Init', status: 'FAIL', error: err.message });
  }

  // Test 4: Verify system status tracking
  console.log('\nTest 4: Verifying system status tracking...');
  try {
    const status = await knowledgeBaseQueries.getSystemStatus();
    if (!status) throw new Error('No system status record');
    
    console.log(`✓ System status accessible - Current state: ${status.status || 'idle'}`);
    results.passed++;
    results.tests.push({ name: 'System Status', status: 'PASS', details: status.status });
  } catch (err) {
    console.error('✗ System status verification failed:', err.message);
    results.failed++;
    results.tests.push({ name: 'System Status', status: 'FAIL', error: err.message });
  }

  // Test 5: Verify AI initialization
  console.log('\nTest 5: Initializing AI engine...');
  try {
    const aiReady = await initializeAI();
    if (!aiReady) throw new Error('AI initialization returned false');
    
    console.log('✓ AI engine initialized successfully (MobileNet loaded)');
    results.passed++;
    results.tests.push({ name: 'AI Initialization', status: 'PASS' });
  } catch (err) {
    console.error('✗ AI initialization failed:', err.message);
    results.failed++;
    results.tests.push({ name: 'AI Initialization', status: 'FAIL', error: err.message });
  }

  // Test 6: Verify symptom search
  console.log('\nTest 6: Testing symptom search...');
  try {
    const results = await knowledgeBaseQueries.searchBySymptoms(['fever', 'lesions'], 'cattle');
    if (!Array.isArray(results)) throw new Error('Search returned non-array');
    
    console.log(`✓ Symptom search working - Found ${results.length} results`);
    results.passed++;
    results.tests.push({ name: 'Symptom Search', status: 'PASS', details: `${results.length} results` });
  } catch (err) {
    console.error('✗ Symptom search test failed:', err.message);
    results.failed++;
    results.tests.push({ name: 'Symptom Search', status: 'FAIL', error: err.message });
  }

  // Test 7: Verify unified search
  console.log('\nTest 7: Testing unified search...');
  try {
    const results = await unifiedSearch({ 
      text: 'fever', 
      species: 'cattle',
      image: null 
    });
    if (!Array.isArray(results)) throw new Error('Unified search returned non-array');
    
    console.log(`✓ Unified search working - Found ${results.length} results`);
    results.passed++;
    results.tests.push({ name: 'Unified Search', status: 'PASS', details: `${results.length} results` });
  } catch (err) {
    console.error('✗ Unified search test failed:', err.message);
    results.failed++;
    results.tests.push({ name: 'Unified Search', status: 'FAIL', error: err.message });
  }

  // Summary
  console.log('\n=== Integration Test Summary ===\n');
  console.log(`Passed: ${results.passed}/${results.passed + results.failed}`);
  console.log(`Failed: ${results.failed}/${results.passed + results.failed}`);
  
  results.tests.forEach(test => {
    const icon = test.status === 'PASS' ? '✓' : '✗';
    const details = test.details ? ` (${test.details})` : '';
    const error = test.error ? ` - ${test.error}` : '';
    console.log(`${icon} ${test.name}${details}${error}`);
  });

  console.log('\n=== AI System Status ===\n');
  try {
    const status = await knowledgeBaseQueries.getSystemStatus();
    console.log('Current Learning State:', status.status);
    console.log('Progress:', status.current, '/', status.total);
    console.log('Message:', status.message);
  } catch (err) {
    console.error('Could not retrieve status:', err.message);
  }

  console.log('\n=== Integration Tests Complete ===\n');
  
  return results;
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runIntegrationTests().catch(console.error);
}
