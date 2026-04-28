const { knowledgeQueries } = require('../db/queries');
const pool = require('../db/pool');

async function testKnowledgeQueries() {
  console.log('🧪 Testing Knowledge Base Queries...\n');

  try {
    // Test 1: Create knowledge articles
    console.log('Test 1: Creating knowledge articles');
    
    const fmdArticle = await knowledgeQueries.createArticle({
      title_en: 'Foot and Mouth Disease',
      title_tn: 'Bolwetse jwa Lolwapa le Molomo',
      content_en: 'Foot and Mouth Disease (FMD) is a severe viral disease affecting cloven-hoofed animals...',
      content_tn: 'Bolwetse jwa Lolwapa le Molomo ke bolwetse jo bo maswe jo bo tlhaselang diphologolo...',
      disease_code: 'FMD',
      species: 'all',
      symptoms: 'Fever, blisters on mouth and feet, salivation, lameness',
      treatment: 'No specific treatment, supportive care only',
      prevention: 'Vaccination, movement control, biosecurity',
      notifiable: true,
      tags: 'fmd,foot,mouth,blisters,notifiable'
    });
    console.log('✅ FMD article created:', { id: fmdArticle.id, title_en: fmdArticle.title_en });

    const heartwaterArticle = await knowledgeQueries.createArticle({
      title_en: 'Heartwater',
      title_tn: 'Bolwetse jwa Pelo',
      content_en: 'Heartwater is a tick-borne disease caused by Ehrlichia ruminantium...',
      content_tn: 'Bolwetse jwa Pelo ke bolwetse jo bo tshwarwang ke dinose...',
      disease_code: 'HEARTWATER',
      species: 'cattle,goat,sheep',
      symptoms: 'Fever, nervous signs, fluid in chest',
      treatment: 'Tetracycline antibiotics',
      prevention: 'Tick control, vaccination where available',
      notifiable: true,
      tags: 'heartwater,tick,nervous,notifiable'
    });
    console.log('✅ Heartwater article created:', { id: heartwaterArticle.id });

    // Test 2: Get article by ID with localization
    console.log('\nTest 2: Getting article by ID (English)');
    const articleEn = await knowledgeQueries.getArticleById(fmdArticle.id, 'en');
    console.log('✅ English version:', { 
      title: articleEn.title,
      notifiable: articleEn.notifiable 
    });

    console.log('\nGetting article by ID (Setswana)');
    const articleTn = await knowledgeQueries.getArticleById(fmdArticle.id, 'tn');
    console.log('✅ Setswana version:', { 
      title: articleTn.title 
    });

    // Test 3: Search articles
    console.log('\nTest 3: Searching articles');
    const searchResults = await knowledgeQueries.searchArticles('foot mouth', 'en');
    console.log(`✅ Found ${searchResults.length} articles matching "foot mouth":`);
    searchResults.forEach(r => console.log(`   - ${r.title} (confidence: ${r.rank})`));

    // Test 4: Get article by disease code
    console.log('\nTest 4: Getting article by disease code');
    const byCode = await knowledgeQueries.getArticleByDiseaseCode('FMD', 'en');
    console.log('✅ Found by code:', { 
      title: byCode.title,
      disease_code: byCode.disease_code 
    });

    // Test 5: Get notifiable diseases
    console.log('\nTest 5: Getting notifiable diseases');
    const notifiable = await knowledgeQueries.getNotifiableDiseases('en');
    console.log(`✅ Found ${notifiable.length} notifiable diseases:`);
    notifiable.forEach(d => console.log(`   - ${d.title} (${d.disease_code})`));

    // Test 6: Get articles by species
    console.log('\nTest 6: Getting articles for cattle');
    const cattleArticles = await knowledgeQueries.getArticlesBySpecies('cattle', 'en');
    console.log(`✅ Found ${cattleArticles.length} articles for cattle`);

    // Test 7: Get featured articles
    console.log('\nTest 7: Getting featured articles');
    const featured = await knowledgeQueries.getFeaturedArticles('en');
    console.log('✅ Featured articles (FMD should be first):');
    featured.forEach((a, i) => console.log(`   ${i+1}. ${a.title}`));

    // Test 8: Update article
    console.log('\nTest 8: Updating article');
    const updated = await knowledgeQueries.updateArticle(heartwaterArticle.id, {
      treatment: 'Tetracycline antibiotics (Oxytetracycline)',
      prevention: 'Tick control using acaricides, vaccination where available'
    });
    console.log('✅ Article updated:', { 
      id: updated.id,
      version: updated.version,
      updated_at: updated.updated_at 
    });

    // Test 9: Get AI training data
    console.log('\nTest 9: Getting AI training data');
    const trainingData = await knowledgeQueries.getAITrainingData();
    console.log(`✅ Retrieved ${trainingData.length} training records`);

    // Test 10: Search in Setswana
    console.log('\nTest 10: Searching in Setswana');
    const tnSearch = await knowledgeQueries.searchArticles('lolwapa', 'tn');
    console.log(`✅ Found ${tnSearch.length} articles matching "lolwapa"`);

    console.log('\n🎉 All knowledge query tests passed!\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await pool.end();
  }
}

testKnowledgeQueries();