const PouchDB = require('pouchdb');

const COUCHDB_URL = 'https://admin:password123@farmaid-couchdb.onrender.com';
const db = new PouchDB(`${COUCHDB_URL}/knowledge-base`);

const diseases = [
  {
    "_id": "heartwater_001",
    "type": "disease",
    "code": "HEART001",
    "title_en": "Heartwater in Goats and Cattle",
    "title_tn": "Bolwetsi jwa Pelo mo Dipoding le Dikgomong",
    "summary_en": "Heartwater is a fatal tick-borne disease affecting goats, sheep, and cattle.",
    "summary_tn": "Bolwetsi jwa pelo ke bolwetsi jo bo bolayang jo bo tshwarwang ke libotsana.",
    "content_en": "Heartwater is caused by the bacterium Ehrlichia ruminantium. It is transmitted by the bont tick (Amblyomma hebraeum).",
    "content_tn": "Heartwater e bakiwa ke baketeria ya Ehrlichia ruminantium. E tshwarwa ke libotsana ya bont.",
    "category": "bacterial",
    "severity": "high",
    "notifiable": true,
    "affected_species": ["goat", "sheep", "cattle"],
    "symptoms": ["High fever (105-107°F)", "Nervous signs", "Difficulty breathing", "Sudden death"],
    "symptoms_tn": ["Letshoroma le legolo", "Matshwao a methapo", "Go tlhoka maowa", "Loso lo lo tshoganetseng"],
    "treatment": "Treatment with tetracycline antibiotics if caught early. Oxytetracycline 10mg/kg IV.",
    "prevention": "Regular dipping or spraying with acaricides every 14-21 days.",
    "last_updated": "2024-03-25T10:00:00Z",
    "version": 2
  },
  {
    "_id": "fmd_001",
    "type": "disease",
    "code": "FMD001",
    "title_en": "Foot and Mouth Disease",
    "title_tn": "Bolwetsi jwa Maoto le Molomo",
    "summary_en": "Foot and Mouth Disease is a severe viral disease affecting cloven-hoofed animals.",
    "summary_tn": "Bolwetsi jwa maoto le molomo ke bolwetsi jo bo maswe jwa kokoana-hloko jo bo tshwarang diruiwa tsa dinaka tse di mashatlhang.",
    "content_en": "FMD is caused by the Aphthovirus. It spreads rapidly through direct contact.",
    "content_tn": "FMD e bakiwa ke kokoana-hloko ya Aphthovirus. E tsamaisa ka bonako ka go tshwaragana ka tlhamalalo.",
    "category": "viral",
    "severity": "critical",
    "notifiable": true,
    "affected_species": ["cattle", "goat", "sheep", "pig"],
    "symptoms": ["Excessive salivation", "Blisters in mouth", "Lameness", "Blisters on feet", "Fever", "Reduced milk"],
    "symptoms_tn": ["Mathe a le mantsi", "Mathopa mo molomong", "Kgobega", "Mathopa mo maotong", "Letshoroma", "Mashi a fokotsega"],
    "treatment": "No treatment. Report immediately to DVS. Quarantine all affected animals.",
    "prevention": "Vaccination every 6 months. Quarantine new animals for 21 days.",
    "last_updated": "2024-03-20T10:00:00Z",
    "version": 3
  },
  {
    "_id": "lsd_001",
    "type": "disease",
    "code": "LSD001",
    "title_en": "Lumpy Skin Disease",
    "title_tn": "Bolwetsi jwa Letlalo",
    "summary_en": "Lumpy Skin Disease is a viral disease causing skin nodules in cattle.",
    "summary_tn": "Bolwetsi jwa letlalo ke bolwetsi jwa kokoana-hloko jo bo bakang marontho mo letlalong la dikgomo.",
    "category": "viral",
    "severity": "medium",
    "notifiable": true,
    "affected_species": ["cattle"],
    "symptoms": ["Skin nodules", "Fever", "Nasal discharge", "Reduced milk", "Lameness"],
    "treatment": "Supportive care. Antibiotics for secondary infections.",
    "prevention": "Vaccination. Vector control (flies and mosquitoes).",
    "last_updated": "2024-03-18T10:00:00Z",
    "version": 1
  },
  {
    "_id": "anthrax_001",
    "type": "disease",
    "code": "ANTHRAX001",
    "title_en": "Anthrax",
    "title_tn": "Bolwetsi jwa Anthrax",
    "category": "bacterial",
    "severity": "critical",
    "notifiable": true,
    "affected_species": ["cattle", "goat", "sheep"],
    "symptoms": ["Sudden death", "Blood from orifices", "Bloating", "Fever"],
    "treatment": "Do not open carcass. Report immediately to DVS.",
    "prevention": "Annual vaccination before rainy season.",
    "last_updated": "2024-03-15T10:00:00Z",
    "version": 1
  }
];

async function seedDatabase() {
  console.log('Starting seeding process for Knowledge Base...');
  for (const disease of diseases) {
    try {
      try {
        const existing = await db.get(disease._id);
        disease._rev = existing._rev;
      } catch (e) { }
      
      await db.put(disease);
      console.log(`✅ Success: ${disease.title_en}`);
    } catch (error) {
      console.error(`❌ Error: ${disease.title_en}:`, error.message);
    }
  }
  console.log('Seeding complete!');
}

seedDatabase();
