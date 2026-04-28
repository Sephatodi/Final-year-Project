const PouchDB = require('pouchdb');

const COUCHDB_URL = 'https://admin:password1234@farmaid-couchdb.onrender.com';
const db = new PouchDB(`${COUCHDB_URL}/knowledge-base`);

const diseases = [
  {
    _id: 'fmd_001',
    type: 'disease',
    code: 'FMD001',
    title_en: 'Foot and Mouth Disease',
    title_tn: 'Bolwetsi jwa Maoto le Molomo',
    symptoms: ['Blisters in mouth', 'Lameness', 'Excessive salivation', 'Fever'],
    severity: 'critical',
    notifiable: true,
    affected_species: ['cattle', 'goat', 'sheep', 'pig']
  },
  {
    _id: 'heartwater_001',
    type: 'disease',
    code: 'HEART001',
    title_en: 'Heartwater',
    title_tn: 'Bolwetsi jwa Pelo',
    symptoms: ['High fever', 'Nervous signs', 'Difficulty breathing', 'Sudden death'],
    severity: 'high',
    notifiable: true,
    affected_species: ['cattle', 'goat', 'sheep']
  },
  {
    _id: 'lsd_001',
    type: 'disease',
    code: 'LSD001',
    title_en: 'Lumpy Skin Disease',
    title_tn: 'Bolwetsi jwa Letlalo',
    symptoms: ['Skin nodules', 'Fever', 'Nasal discharge', 'Reduced milk'],
    severity: 'medium',
    notifiable: true,
    affected_species: ['cattle']
  }
];

async function seedDatabase() {
  console.log('Starting seeding process...');
  for (const disease of diseases) {
    try {
      // Check if exists
      try {
        const existing = await db.get(disease._id);
        disease._rev = existing._rev;
      } catch (e) {
        // New document
      }
      
      const response = await db.put(disease);
      console.log(`Added/Updated: ${disease.title_en} - ${response.id}`);
    } catch (error) {
      console.error(`Error adding ${disease.title_en}:`, error.message);
    }
  }
  console.log('Seeding complete!');
}

seedDatabase();
