/**
 * Farm-Aid Database Seed Script
 * 
 * This script populates the database with initial test data
 * Run: node scripts/seed-data.js
 * 
 * Options:
 *   --clean: Clean existing data before seeding
 *   --test: Add additional test data
 *   --production: Production-safe mode (no destructive actions)
 */

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Parse command line arguments
const args = process.argv.slice(2);
const CLEAN_MODE = args.includes('--clean');
const TEST_MODE = args.includes('--test');
const PRODUCTION_MODE = args.includes('--production');

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'farm_aid',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}[WARN]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.magenta}${msg}${colors.reset}`)
};

// Test data
const testData = {
  farmers: [
    {
      name: 'Thato Mokwena',
      phone: '+26771123456',
      email: 'thato.mokwena@example.com',
      password: 'farmer123',
      farm_location: 'Mochudi, Kgatleng District',
      baits_account: 'BAITS001234',
      herd_size: 45
    },
    {
      name: 'Keabetswe Modise',
      phone: '+26771234567',
      email: 'keabetswe.modise@example.com',
      password: 'farmer123',
      farm_location: 'Francistown, North-East District',
      baits_account: 'BAITS001235',
      herd_size: 78
    },
    {
      name: 'Oarabile Sechele',
      phone: '+26771345678',
      email: 'oarabile.sechele@example.com',
      password: 'farmer123',
      farm_location: 'Maun, Ngamiland District',
      baits_account: 'BAITS001236',
      herd_size: 120
    }
  ],
  
  experts: [
    {
      name: 'Dr. Kgomotso Ramotse',
      phone: '+26772123456',
      email: 'kgomotso.ramotse@vet.co.bw',
      password: 'expert123',
      specialization: 'Cattle & Small Ruminants',
      license: 'VET2024001',
      region: 'Kgatleng'
    },
    {
      name: 'Dr. Modisaotsile Kenosi',
      phone: '+26772234567',
      email: 'modisaotsile.kenosi@vet.co.bw',
      password: 'expert123',
      specialization: 'Epidemiology',
      license: 'VET2024002',
      region: 'North-East'
    },
    {
      name: 'Dr. Lorato Gaolaolwe',
      phone: '+26772345678',
      email: 'lorato.gaolaolwe@vet.co.bw',
      password: 'expert123',
      specialization: 'Livestock Extension',
      license: 'VET2024003',
      region: 'Ngamiland'
    }
  ],
  
  admins: [
    {
      name: 'System Administrator',
      phone: '+26770000001',
      email: 'admin@farm-aid.com',
      password: 'admin123'
    }
  ],
  
  diseaseZones: [
    {
      zone_code: '6A',
      zone_name: 'Francistown FMD Protection Zone',
      restrictions: 'No movement of cloven-hoofed animals without permit. Mandatory vaccination.'
    },
    {
      zone_code: '6B',
      zone_name: 'Ngamiland FMD Surveillance Zone',
      restrictions: 'Movement restricted. Regular surveillance required. Vaccination recommended.'
    },
    {
      zone_code: '10',
      zone_name: 'Greater Gaborone',
      restrictions: 'No current restrictions. Standard biosecurity measures apply.'
    },
    {
      zone_code: '5',
      zone_name: 'Central District',
      restrictions: 'Movement permits required for cattle. Sheep and goats unrestricted.'
    }
  ],
  
  knowledgeBase: [
    {
      title_en: 'Foot and Mouth Disease (FMD)',
      title_tn: 'Bolwetse jwa Lolwapa le Molomo',
      content_en: 'Foot and Mouth Disease (FMD) is a severe, highly contagious viral disease affecting cloven-hoofed animals including cattle, goats, and sheep. It causes fever and blister-like lesions on the mouth, tongue, nose, feet, and teats.',
      content_tn: 'Bolwetse jwa Lolwapa le Molomo ke bolwetse jo bo maswe jo bo anameng ka bofefo mo diphologolong tse di arolaganeng dinala, go akaretsa dikgomo, dipodi le dinku. Bo baka lefefo le marontho mo molomong, lelemes, nko, dinaong le matswele.',
      disease_code: 'FMD',
      species: 'all',
      symptoms: 'Fever (40-41°C), loss of appetite, shivering, reduced milk yield, blisters on mouth and feet, excessive salivation, lameness, drooling',
      treatment: 'No specific treatment. Supportive care: soft food, clean water, foot care. Notify veterinary authorities immediately.',
      prevention: 'Regular vaccination, movement control, biosecurity measures, disinfection of vehicles and equipment, quarantine of new animals',
      notifiable: true,
      tags: 'fmd foot mouth blisters lameness fever notifiable'
    },
    {
      title_en: 'Heartwater',
      title_tn: 'Bolwetse jwa Pelo',
      content_en: 'Heartwater is a tick-borne disease caused by the bacterium Ehrlichia ruminantium. It affects cattle, sheep, and goats and is transmitted by Amblyomma ticks.',
      content_tn: 'Bolwetse jwa Pelo ke bolwetse jo bo tshwarwang ke dinose jo bo bakwang ke baktheria ya Ehrlichia ruminantium. Bo tlhasela dikgomo, dinku le dipodi mme bo tshwarwa ke dinose tsa mofuta wa Amblyomma.',
      disease_code: 'HEARTWATER',
      species: 'cattle,goat,sheep',
      symptoms: 'High fever, neurological signs (circling, tremors), difficulty breathing, fluid in chest cavity, rapid heartbeat, convulsions before death',
      treatment: 'Tetracycline antibiotics (Oxytetracycline). Early treatment is critical for survival.',
      prevention: 'Tick control using acaricides, regular dipping, vaccination where available, pasture rotation',
      notifiable: true,
      tags: 'heartwater tick nervous fever tetracycline notifiable'
    },
    {
      title_en: 'Anthrax',
      title_tn: 'Bolwetse jwa Sebodu',
      content_en: 'Anthrax is a serious bacterial disease caused by Bacillus anthracis. It affects all warm-blooded animals including livestock and humans (zoonotic).',
      content_tn: 'Bolwetse jwa Sebodu ke bolwetse jo bo maswe jo bo bakwang ke baktheria ya Bacillus anthracis. Bo tlhasela diphologolo tsotlhe le batho.',
      disease_code: 'ANTHRAX',
      species: 'all',
      symptoms: 'Sudden death, high fever, bleeding from orifices, difficulty breathing, swelling of neck and chest, convulsions',
      treatment: 'Penicillin and other antibiotics if caught early. DO NOT open carcass - this spreads spores.',
      prevention: 'Annual vaccination in high-risk areas, proper disposal of carcasses (burning with quicklime), avoid contact with infected animals',
      notifiable: true,
      tags: 'anthrax sudden death bleeding zoonotic notifiable'
    },
    {
      title_en: 'Mastitis',
      title_tn: 'Bolwetse jwa Matswele',
      content_en: 'Mastitis is inflammation of the mammary gland (udder) usually caused by bacterial infection. It is a common disease in dairy cattle.',
      content_tn: 'Bolwetse jwa Matswele ke go ruru ga matswele a a bakwang ke baktheria. Ke bolwetse jo bo tlwaelegileng mo dikgomong tsa mashi.',
      disease_code: 'MASTITIS',
      species: 'cattle,goat',
      symptoms: 'Swollen, hot, hard udder, pain on touching, abnormal milk (clots, watery, bloody), reduced milk yield, fever',
      treatment: 'Intramammary antibiotics, anti-inflammatory drugs, frequent milking out, good hygiene',
      prevention: 'Clean milking procedures, teat dipping after milking, dry cow therapy, culling chronic cases',
      notifiable: false,
      tags: 'mastitis udder milk clots dairy'
    },
    {
      title_en: 'Blackleg',
      title_tn: 'Bolwetse jwa Leoto',
      content_en: 'Blackleg is an acute bacterial disease caused by Clostridium chauvoei. It affects cattle and sheep, causing gas production in muscles.',
      content_tn: 'Bolwetse jwa Leoto ke bolwetse jo bo tlhaselang mesifa jo bo bakwang ke baktheria ya Clostridium chauvoei.',
      disease_code: 'BLACKLEG',
      species: 'cattle,sheep',
      symptoms: 'Sudden death, lameness, swelling of hindquarters, crackling sound when pressing swollen areas, fever, depression',
      treatment: 'High doses of penicillin, surgical drainage of swellings. Prevention is better than cure.',
      prevention: 'Vaccination of young stock, avoid grazing in contaminated pastures, proper carcass disposal',
      notifiable: false,
      tags: 'blackleg clostridium lameness swelling'
    }
  ],
  
  alerts: [
    {
      type: 'disease',
      title_en: 'FMD Outbreak Alert - Francistown',
      title_tn: 'Tlhagiso ya Bolwetse jwa Lolwapa le Molomo - Francistown',
      content_en: 'FMD outbreak detected in Francistown region. Restrict all animal movement. Report any symptoms immediately to DVS.',
      content_tn: 'Go fitlhetswe bolwetse jwa Lolwapa le Molomo mo kgaolong ya Francistown. Thibela go tsamaisa diphologolo. Isege fa go na le ditshupo.',
      zone_code: '6A',
      expiry_days: 30
    },
    {
      type: 'weather',
      title_en: 'Heavy Rain Warning',
      title_tn: 'Tlhagiso ya Pula e Ntšh',
      content_en: 'Heavy rains expected in Ngamiland. Move livestock to higher ground. Check for flooding.',
      content_tn: 'Go solofetswe pula e ntšh mo Ngamiland. Isang diphologolo kwa mafelong a a kwa godimo. Lebelela morwalela.',
      zone_code: '6B',
      expiry_days: 3
    },
    {
      type: 'movement',
      title_en: 'Movement Restriction Update',
      title_tn: 'Phetogo ya Thibelo ya go Tsamaisa Diphologolo',
      content_en: 'Movement permits required for all cattle in Central District. Contact veterinary office.',
      content_tn: 'Go tlhokega ditumelelo tsa go tsamaisa dikgomo tsotlhe mo Central District. Ikgolaganye le ofisi ya bongaka jwa diphologolo.',
      zone_code: '5',
      expiry_days: 60
    }
  ],
  
  livestock: [
    {
      farmer_email: 'thato.mokwena@example.com',
      animals: [
        { tag: 'BW123001', species: 'cattle', breed: 'Tswana', birth: '2020-03-15', gender: 'female' },
        { tag: 'BW123002', species: 'cattle', breed: 'Brahman', birth: '2021-06-20', gender: 'female' },
        { tag: 'BW123003', species: 'cattle', breed: 'Tswana', birth: '2022-01-10', gender: 'male' },
        { tag: 'BW123004', species: 'goat', breed: 'Boer', birth: '2023-02-05', gender: 'female' },
        { tag: 'BW123005', species: 'goat', breed: 'Tswana', birth: '2023-02-05', gender: 'female' },
        { tag: 'BW123006', species: 'sheep', breed: 'Dorper', birth: '2022-11-15', gender: 'male' }
      ]
    },
    {
      farmer_email: 'keabetswe.modise@example.com',
      animals: [
        { tag: 'BW124001', species: 'cattle', breed: 'Brahman', birth: '2019-08-10', gender: 'female' },
        { tag: 'BW124002', species: 'cattle', breed: 'Tswana', birth: '2020-12-01', gender: 'female' },
        { tag: 'BW124003', species: 'cattle', breed: 'Simmental', birth: '2022-04-18', gender: 'male' },
        { tag: 'BW124004', species: 'goat', breed: 'Boer', birth: '2023-01-22', gender: 'female' },
        { tag: 'BW124005', species: 'goat', breed: 'Boer', birth: '2023-01-22', gender: 'female' }
      ]
    }
  ],
  
  marketPrices: [
    { commodity: 'Cattle - Weaner (200kg)', price: 3500, unit: 'per head', location: 'Francistown', source: 'BMC' },
    { commodity: 'Cattle - Heifer', price: 4500, unit: 'per head', location: 'Francistown', source: 'BMC' },
    { commodity: 'Cattle - Cow', price: 5500, unit: 'per head', location: 'Francistown', source: 'BMC' },
    { commodity: 'Cattle - Bull', price: 8000, unit: 'per head', location: 'Francistown', source: 'BMC' },
    { commodity: 'Goat - Adult', price: 1200, unit: 'per head', location: 'Gaborone', source: 'Informal Market' },
    { commodity: 'Goat - Kid', price: 600, unit: 'per head', location: 'Gaborone', source: 'Informal Market' },
    { commodity: 'Sheep - Adult', price: 1500, unit: 'per head', location: 'Gaborone', source: 'Informal Market' },
    { commodity: 'Sheep - Lamb', price: 800, unit: 'per head', location: 'Gaborone', source: 'Informal Market' },
    { commodity: 'Maize Silage', price: 450, unit: 'per ton', location: 'Francistown', source: 'AgriFeed' },
    { commodity: 'Protein Supplement', price: 850, unit: 'per 50kg bag', location: 'Francistown', source: 'AgriFeed' }
  ]
};

// Additional test data for TEST_MODE
const testModeData = {
  healthRecords: [
    {
      tag: 'BW123001',
      date: '2024-01-15',
      symptoms: 'Fever, loss of appetite',
      diagnosis: 'Tick fever',
      treatment: 'Antibiotics, tick control',
      confidence: 0.87
    },
    {
      tag: 'BW123002',
      date: '2024-02-20',
      symptoms: 'Lameness, swelling in foot',
      diagnosis: 'Foot rot',
      treatment: 'Foot bath, antibiotics',
      confidence: 0.92
    }
  ],
  
  consultations: [
    {
      farmer: 'thato.mokwena@example.com',
      expert: 'kgomotso.ramotse@vet.co.bw',
      status: 'resolved',
      messages: [
        { sender: 'farmer', content: 'My cow is limping and has a swollen foot', is_offline: false },
        { sender: 'expert', content: 'Please send a photo of the foot', is_offline: false },
        { sender: 'farmer', content: '[Photo attached]', is_offline: false },
        { sender: 'expert', content: 'This looks like foot rot. Clean the foot and apply antibiotics.', is_offline: false }
      ]
    }
  ]
};

/**
 * Main seeding function
 */
async function seedDatabase() {
  log.section('🌱 FARM-AID DATABASE SEEDING');
  log.info(`Mode: ${PRODUCTION_MODE ? 'PRODUCTION' : 'DEVELOPMENT'} ${TEST_MODE ? '(with test data)' : ''}`);
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check if we're in production mode
    if (PRODUCTION_MODE) {
      log.warn('Running in PRODUCTION mode - will not delete existing data');
      // In production, only add missing data
      await seedProductionMode(client);
    } else {
      // Development mode - clean and reseed
      if (CLEAN_MODE) {
        log.info('Cleaning existing data...');
        await cleanDatabase(client);
      }
      await seedDevelopmentMode(client);
    }
    
    await client.query('COMMIT');
    log.success('Database seeding completed successfully!');
    
    // Display summary
    await displaySummary();
    
  } catch (error) {
    await client.query('ROLLBACK');
    log.error(`Seeding failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

/**
 * Clean database (delete all data)
 */
async function cleanDatabase(client) {
  const tables = [
    'sync_queue',
    'messages',
    'consultations',
    'health_records',
    'livestock',
    'alerts',
    'market_prices',
    'knowledge_base_articles',
    'disease_reports',
    'disease_zones',
    'farmers',
    'experts',
    'users'
  ];
  
  for (const table of tables) {
    await client.query(`DELETE FROM ${table}`);
    log.info(`Cleared table: ${table}`);
  }
}

/**
 * Seed data for production mode (safe upserts)
 */
async function seedProductionMode(client) {
  log.info('Adding/updating production data...');
  
  // Add admin if not exists
  for (const admin of testData.admins) {
    const passwordHash = await bcrypt.hash(admin.password, 10);
    await client.query(
      `INSERT INTO users (name, phone, email, password_hash, role, language_pref)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO NOTHING`,
      [admin.name, admin.phone, admin.email, passwordHash, 'admin', 'en']
    );
  }
  
  // Add disease zones
  for (const zone of testData.diseaseZones) {
    await client.query(
      `INSERT INTO disease_zones (zone_code, zone_name, restrictions, is_active)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (zone_code) DO UPDATE SET
         zone_name = EXCLUDED.zone_name,
         restrictions = EXCLUDED.restrictions,
         is_active = EXCLUDED.is_active`,
      [zone.zone_code, zone.zone_name, zone.restrictions, true]
    );
  }
  
  // Add knowledge base articles
  for (const article of testData.knowledgeBase) {
    await client.query(
      `INSERT INTO knowledge_base_articles 
       (title_en, title_tn, content_en, content_tn, disease_code, species, symptoms, treatment, prevention, notifiable, tags, version)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (disease_code) DO UPDATE SET
         title_en = EXCLUDED.title_en,
         title_tn = EXCLUDED.title_tn,
         content_en = EXCLUDED.content_en,
         content_tn = EXCLUDED.content_tn,
         version = knowledge_base_articles.version + 1`,
      [article.title_en, article.title_tn, article.content_en, article.content_tn,
       article.disease_code, article.species, article.symptoms, article.treatment,
       article.prevention, article.notifiable, article.tags, 1]
    );
  }
}

/**
 * Seed data for development mode (full test data)
 */
async function seedDevelopmentMode(client) {
  log.info('Seeding development data...');
  
  // Create users and profiles
  const userIds = {};
  
  // Create farmers
  for (const farmer of testData.farmers) {
    const passwordHash = await bcrypt.hash(farmer.password, 10);
    const userResult = await client.query(
      `INSERT INTO users (name, phone, email, password_hash, role, language_pref)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [farmer.name, farmer.phone, farmer.email, passwordHash, 'farmer', 'tn']
    );
    const userId = userResult.rows[0].id;
    userIds[farmer.email] = userId;
    
    await client.query(
      `INSERT INTO farmers (user_id, farm_location, herd_size, baits_account_id)
       VALUES ($1, $2, $3, $4)`,
      [userId, farmer.farm_location, farmer.herd_size, farmer.baits_account]
    );
    log.success(`Created farmer: ${farmer.name}`);
  }
  
  // Create experts
  for (const expert of testData.experts) {
    const passwordHash = await bcrypt.hash(expert.password, 10);
    const userResult = await client.query(
      `INSERT INTO users (name, phone, email, password_hash, role, language_pref)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [expert.name, expert.phone, expert.email, passwordHash, 'expert', 'en']
    );
    const userId = userResult.rows[0].id;
    userIds[expert.email] = userId;
    
    await client.query(
      `INSERT INTO experts (user_id, specialization, license_number, region, is_available)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, expert.specialization, expert.license, expert.region, true]
    );
    log.success(`Created expert: ${expert.name}`);
  }
  
  // Create admins
  for (const admin of testData.admins) {
    const passwordHash = await bcrypt.hash(admin.password, 10);
    const userResult = await client.query(
      `INSERT INTO users (name, phone, email, password_hash, role, language_pref)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [admin.name, admin.phone, admin.email, passwordHash, 'admin', 'en']
    );
    userIds[admin.email] = userResult.rows[0].id;
    log.success(`Created admin: ${admin.name}`);
  }
  
  // Create disease zones
  for (const zone of testData.diseaseZones) {
    await client.query(
      `INSERT INTO disease_zones (zone_code, zone_name, restrictions, is_active)
       VALUES ($1, $2, $3, $4)`,
      [zone.zone_code, zone.zone_name, zone.restrictions, true]
    );
  }
  log.success(`Created ${testData.diseaseZones.length} disease zones`);
  
  // Get zone IDs
  const zones = await client.query('SELECT id, zone_code FROM disease_zones');
  const zoneMap = {};
  zones.rows.forEach(z => zoneMap[z.zone_code] = z.id);
  
  // Create knowledge base articles
  for (const article of testData.knowledgeBase) {
    await client.query(
      `INSERT INTO knowledge_base_articles 
       (title_en, title_tn, content_en, content_tn, disease_code, species, symptoms, treatment, prevention, notifiable, tags, version)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [article.title_en, article.title_tn, article.content_en, article.content_tn,
       article.disease_code, article.species, article.symptoms, article.treatment,
       article.prevention, article.notifiable, article.tags, 1]
    );
  }
  log.success(`Created ${testData.knowledgeBase.length} knowledge base articles`);
  
  // Create alerts
  for (const alert of testData.alerts) {
    const zoneId = zoneMap[alert.zone_code];
    await client.query(
      `INSERT INTO alerts (type, title_en, title_tn, content_en, content_tn, zone_id, expiry)
       VALUES ($1, $2, $3, $4, $5, $6, NOW() + ($7 || ' days')::INTERVAL)`,
      [alert.type, alert.title_en, alert.title_tn, alert.content_en, alert.content_tn,
       zoneId, alert.expiry_days]
    );
  }
  log.success(`Created ${testData.alerts.length} alerts`);
  
  // Create market prices
  for (const price of testData.marketPrices) {
    await client.query(
      `INSERT INTO market_prices (commodity, price, unit, location, date, source, cached_until)
       VALUES ($1, $2, $3, $4, $5, $6, NOW() + INTERVAL '7 days')`,
      [price.commodity, price.price, price.unit, price.location, new Date(), price.source]
    );
  }
  log.success(`Created ${testData.marketPrices.length} market prices`);
  
  // Create livestock
  const livestockMap = {};
  for (const farmerData of testData.livestock) {
    const userId = userIds[farmerData.farmer_email];
    const farmerResult = await client.query(
      'SELECT id FROM farmers WHERE user_id = $1',
      [userId]
    );
    const farmerId = farmerResult.rows[0].id;
    
    for (const animal of farmerData.animals) {
      const livestockResult = await client.query(
        `INSERT INTO livestock 
         (farmer_id, baits_tag_number, species, breed, birth_date, gender, health_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [farmerId, animal.tag, animal.species, animal.breed, animal.birth, animal.gender, 'healthy']
      );
      livestockMap[animal.tag] = livestockResult.rows[0].id;
    }
  }
  log.success('Created livestock records');
  
  // Add test mode data if requested
  if (TEST_MODE) {
    log.info('Adding additional test data...');
    
    // Add health records
    for (const record of testModeData.healthRecords) {
      const livestockId = livestockMap[record.tag];
      if (livestockId) {
        await client.query(
          `INSERT INTO health_records 
           (livestock_id, date, symptoms, diagnosis, treatment, ai_confidence, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [livestockId, record.date, record.symptoms, record.diagnosis, 
           record.treatment, record.confidence, userIds['thato.mokwena@example.com']]
        );
      }
    }
    
    // Add consultations
    for (const consult of testModeData.consultations) {
      const farmerId = userIds[consult.farmer];
      const expertId = userIds[consult.expert];
      
      const consultResult = await client.query(
        `INSERT INTO consultations (farmer_id, expert_id, status, created_at, resolved_at)
         VALUES ($1, $2, $3, NOW() - INTERVAL '3 days', NOW())
         RETURNING id`,
        [farmerId, expertId, consult.status]
      );
      const consultId = consultResult.rows[0].id;
      
      for (const msg of consult.messages) {
        const senderId = msg.sender === 'farmer' ? farmerId : expertId;
        await client.query(
          `INSERT INTO messages (consultation_id, sender_id, content, timestamp, is_offline)
           VALUES ($1, $2, $3, NOW() - INTERVAL '2 days', $4)`,
          [consultId, senderId, msg.content, msg.is_offline]
        );
      }
    }
    
    log.success('Added test mode data');
  }
}

/**
 * Display summary of seeded data
 */
async function displaySummary() {
  log.section('📊 DATABASE SUMMARY');
  
  const counts = await pool.query(`
    SELECT 
      (SELECT COUNT(*) FROM users) as users,
      (SELECT COUNT(*) FROM farmers) as farmers,
      (SELECT COUNT(*) FROM experts) as experts,
      (SELECT COUNT(*) FROM livestock) as livestock,
      (SELECT COUNT(*) FROM health_records) as health_records,
      (SELECT COUNT(*) FROM consultations) as consultations,
      (SELECT COUNT(*) FROM knowledge_base_articles) as articles,
      (SELECT COUNT(*) FROM disease_zones) as zones,
      (SELECT COUNT(*) FROM alerts) as alerts,
      (SELECT COUNT(*) FROM market_prices) as market_prices
  `);
  
  const c = counts.rows[0];
  console.log(`
┌─────────────────────────────┐
│ Table                Count  │
├─────────────────────────────┤
│ Users                ${c.users.toString().padStart(5)} │
│ Farmers              ${c.farmers.toString().padStart(5)} │
│ Experts              ${c.experts.toString().padStart(5)} │
│ Livestock            ${c.livestock.toString().padStart(5)} │
│ Health Records       ${c.health_records.toString().padStart(5)} │
│ Consultations        ${c.consultations.toString().padStart(5)} │
│ Knowledge Articles   ${c.articles.toString().padStart(5)} │
│ Disease Zones        ${c.zones.toString().padStart(5)} │
│ Alerts               ${c.alerts.toString().padStart(5)} │
│ Market Prices        ${c.market_prices.toString().padStart(5)} │
└─────────────────────────────┘
  `);
  
  log.success('Test accounts:');
  console.log(`
  👨‍🌾 Farmer:  thato.mokwena@example.com / farmer123
  👨‍⚕️ Expert:  kgomotso.ramotse@vet.co.bw / expert123
  👤 Admin:   admin@farm-aid.com / admin123
  `);
}

// Run the seed function
seedDatabase().catch(err => {
  log.error('Fatal error during seeding');
  console.error(err);
  process.exit(1);
});