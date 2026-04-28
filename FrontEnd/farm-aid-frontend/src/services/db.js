// src/services/db.js
import PouchDB from 'pouchdb';
import pouchFind from 'pouchdb-find';

PouchDB.plugin(pouchFind);

// Initialize databases
const localDB = new PouchDB('farm_aid_local');

const remoteUrl = import.meta.env.VITE_COUCHDB_URL || 'http://localhost:5984';
const remoteDbName = import.meta.env.VITE_SYNC_DB_NAME || 'farmaid_sync';
const remoteDB = new PouchDB(`${remoteUrl}/${remoteDbName}`);

// Disease reference data (metadata without images)
const diseaseMetadata = [
  {
    _id: 'disease_fmd',
    name: 'Foot and Mouth Disease',
    localName: 'FMD / Lematsatsa',
    species: ['cattle', 'sheep', 'goats'],
    category: 'viral',
    confidenceThreshold: 0.85,
    treatment: [
      'Report to veterinary authorities immediately (notifiable disease)',
      'Isolate affected animals',
      'No specific antiviral treatment - supportive care only',
      'Disinfect premises with 4% sodium carbonate'
    ],
    medicines: ['Supportive care only', 'Antibiotics for secondary infections']
  },
  {
    _id: 'disease_lsd',
    name: 'Lumpy Skin Disease',
    localName: 'Ntekane',
    species: ['cattle'],
    category: 'viral',
    confidenceThreshold: 0.80,
    treatment: [
      'Isolate infected animals',
      'Supportive care: fluids, anti-inflammatories',
      'Control vectors (insecticides)',
      'Vaccinate healthy herd (Neethling strain vaccine)'
    ],
    medicines: ['NSAIDs for fever', 'Antibiotics for secondary skin infections']
  },
  {
    _id: 'disease_ppr',
    name: 'Peste des Petits Ruminants',
    localName: 'Plague of Small Ruminants',
    species: ['sheep', 'goats'],
    category: 'viral',
    confidenceThreshold: 0.85,
    treatment: [
      'Notifiable disease - report immediately',
      'Isolation and supportive care',
      'Fluids and electrolytes',
      'Antibiotics for secondary infections'
    ],
    medicines: ['Oral rehydration salts', 'Broad-spectrum antibiotics']
  },
  {
    _id: 'disease_heartwater',
    name: 'Heartwater',
    localName: 'Ehrlichiosis',
    species: ['cattle', 'sheep', 'goats'],
    category: 'rickettsial',
    confidenceThreshold: 0.85,
    treatment: [
      'Oxytetracycline LA (20 mg/kg IM)',
      'Supportive fluids',
      'Tick control program'
    ],
    medicines: ['Oxytetracycline LA', 'Flunixin meglumine']
  },
  {
    _id: 'disease_orf',
    name: 'Orf / Soremouth',
    localName: 'Contagious Ecthyma',
    species: ['sheep', 'goats'],
    category: 'viral',
    zoonotic: true,
    confidenceThreshold: 0.80,
    treatment: [
      'Isolate animal',
      'Topical antiseptic ointment',
      'Soft palatable feed',
      'Wear gloves (zoonotic!)'
    ],
    medicines: ['Topical iodine glycerin', 'Penicillin for secondary infection']
  },
  {
    _id: 'disease_anaplasmosis',
    name: 'Anaplasmosis',
    localName: 'Tick Fever',
    species: ['cattle'],
    category: 'rickettsial',
    confidenceThreshold: 0.85,
    treatment: [
      'Oxytetracycline LA (20 mg/kg IM, repeat in 48h)',
      'Blood transfusion if severe anemia',
      'Keep animal quiet, no stress'
    ],
    medicines: ['Oxytetracycline LA', 'Imidocarb dipropionate (Imizol)']
  },
  {
    _id: 'disease_pinkeye',
    name: 'Infectious Bovine Keratoconjunctivitis',
    localName: 'Pinkeye',
    species: ['cattle'],
    category: 'bacterial',
    confidenceThreshold: 0.80,
    treatment: [
      'Flush eye with saline',
      'Subconjunctival oxytetracycline',
      'Patch eye to reduce light',
      'Control flies'
    ],
    medicines: ['Oxytetracycline LA', 'Cloxacillin ophthalmic ointment']
  },
  {
    _id: 'disease_mastitis',
    name: 'Mastitis',
    localName: 'Udder Infection',
    species: ['cattle', 'sheep', 'goats'],
    category: 'bacterial',
    confidenceThreshold: 0.85,
    treatment: [
      'Frequent milking of affected quarter',
      'Intramammary antibiotic infusion',
      'Systemic antibiotics if fever present',
      'NSAID for pain/fever'
    ],
    medicines: ['Ceftiofur (intramammary)', 'Penicillin + streptomycin', 'Meloxicam']
  },
  {
    _id: 'disease_coccidiosis',
    name: 'Coccidiosis',
    localName: 'Cocci',
    species: ['sheep', 'goats', 'cattle'],
    category: 'parasitic',
    confidenceThreshold: 0.80,
    treatment: [
      'Oral amprolium (10 mg/kg for 5 days)',
      'Oral electrolyte solution',
      'Steam-clean pens'
    ],
    medicines: ['Amprolium (Corid)', 'Sulfadimethoxine (Di-Methox)']
  },
  {
    _id: 'disease_footrot',
    name: 'Footrot',
    localName: 'Fouling',
    species: ['sheep', 'goats', 'cattle'],
    category: 'bacterial',
    confidenceThreshold: 0.80,
    treatment: [
      'Trim hoof, remove necrotic tissue',
      'Footbath in 10% zinc sulfate (15 min)',
      'Systemic oxytetracycline',
      'Keep on dry ground'
    ],
    medicines: ['Oxytetracycline LA', 'Zinc sulfate solution']
  },
  {
    _id: 'disease_bloat',
    name: 'Frothy Bloat',
    localName: 'Bloat',
    species: ['cattle', 'sheep', 'goats'],
    category: 'metabolic',
    emergency: true,
    confidenceThreshold: 0.85,
    treatment: [
      'Emergency - pass stomach tube',
      'Poloxalene (Therabloat) 5-10g orally',
      'Roll animal side-to-side',
      'Trocarization if severe'
    ],
    medicines: ['Poloxalene', 'Vegetable oil + Docusate']
  },
  {
    _id: 'disease_healthy',
    name: 'Healthy',
    localName: 'Healthy / No Disease',
    species: ['cattle', 'sheep', 'goats'],
    category: 'healthy',
    confidenceThreshold: 0.70,
    treatment: ['No treatment needed - continue normal husbandry practices'],
    medicines: []
  }
];

// Store image as attachment
export async function storeReferenceImage(diseaseId, imageBlob, filename) {
  try {
    // Get existing document or create new one
    let doc;
    try {
      doc = await localDB.get(diseaseId);
    } catch (err) {
      if (err.status === 404) {
        // Create new document with disease metadata
        const metadata = diseaseMetadata.find(d => d._id === diseaseId);
        doc = metadata || { _id: diseaseId, type: 'disease_reference' };
      } else {
        throw err;
      }
    }

    // Add or update attachment
    const attachmentKey = `reference_${filename || Date.now()}.jpg`;
    doc._attachments = doc._attachments || {};
    doc._attachments[attachmentKey] = {
      content_type: 'image/jpeg',
      data: await blobToBase64(imageBlob)
    };

    // Save document with attachment
    const result = await localDB.put(doc);
    return { success: true, rev: result.rev, attachmentKey };
  } catch (error) {
    console.error('Error storing image:', error);
    return { success: false, error: error.message };
  }
}

// Helper: Convert Blob to Base64
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Helper: Convert Base64 to Blob
export function base64ToBlob(base64, contentType = 'image/jpeg') {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

// Get all reference images for a disease
export async function getReferenceImages(diseaseId) {
  try {
    const doc = await localDB.get(diseaseId, { attachments: true });
    if (!doc._attachments) return [];

    const images = [];
    for (const [key, attachment] of Object.entries(doc._attachments)) {
      if (attachment.data) {
        images.push({
          key,
          blob: base64ToBlob(attachment.data, attachment.content_type),
          url: URL.createObjectURL(base64ToBlob(attachment.data, attachment.content_type))
        });
      }
    }
    return images;
  } catch (error) {
    console.error('Error getting reference images:', error);
    return [];
  }
}

// Get disease metadata by ID
export async function getDiseaseMetadata(diseaseId) {
  const metadata = diseaseMetadata.find(d => d._id === diseaseId);
  if (metadata) return metadata;

  try {
    const doc = await localDB.get(diseaseId);
    return doc;
  } catch {
    return null;
  }
}

// Get all diseases
export async function getAllDiseases() {
  return diseaseMetadata.filter(d => d._id !== 'disease_healthy');
}

// Search diseases by symptom
export async function searchBySymptom(symptom) {
  const symptomLower = symptom.toLowerCase();
  const symptomMap = {
    'fever': ['disease_fmd', 'disease_lsd', 'disease_anaplasmosis', 'disease_heartwater', 'disease_mastitis'],
    'diarrhea': ['disease_coccidiosis', 'disease_fmd'],
    'skin lesions': ['disease_lsd', 'disease_orf', 'disease_fmd'],
    'lameness': ['disease_footrot', 'disease_fmd', 'disease_anaplasmosis'],
    'cough': ['disease_fmd'],
    'swollen udder': ['disease_mastitis'],
    'eye discharge': ['disease_pinkeye', 'disease_fmd'],
    'bloat': ['disease_bloat'],
    'sudden death': ['disease_anaplasmosis', 'disease_bloat', 'disease_heartwater']
  };

  const matchedIds = symptomMap[symptomLower] || [];
  return diseaseMetadata.filter(d => matchedIds.includes(d._id));
}

// Sync with remote CouchDB
export async function syncWithCouchDB() {
  const syncHandler = localDB.sync(remoteDB, {
    live: true,
    retry: true
  });

  syncHandler.on('change', (info) => {
    console.log('Sync change:', info);
  });

  syncHandler.on('error', (err) => {
    console.error('Sync error:', err);
  });

  return syncHandler;
}

// Export database instance
export { localDB, remoteDB };
