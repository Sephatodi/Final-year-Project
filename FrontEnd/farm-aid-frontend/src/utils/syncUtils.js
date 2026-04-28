import PouchDB from 'pouchdb';
import find from 'pouchdb-find';

PouchDB.plugin(find);

/**
 * CouchDB Sync & Query Utility for Farm-Aid
 * Handles offline-first logic using PouchDB and real-time sync with Render.
 */

const COUCHDB_URL = import.meta.env.VITE_COUCHDB_URL || 'https://admin:password123@farmaid-couchdb.onrender.com';

// Local Databases
export const localDBs = {
  knowledgeBase: new PouchDB('farmaid_kb_local'),
  consultations: new PouchDB('farmaid_consultations_local'),
  alerts: new PouchDB('farmaid_alerts_local'),
  marketPrices: new PouchDB('farmaid_prices_local')
};

// Remote Databases (on Render)
const remoteDBs = {
  knowledgeBase: new PouchDB(`${COUCHDB_URL}/knowledge-base`),
  consultations: new PouchDB(`${COUCHDB_URL}/consultations`),
  alerts: new PouchDB(`${COUCHDB_URL}/alerts`),
  marketPrices: new PouchDB(`${COUCHDB_URL}/market-prices`)
};

/**
 * Initializes synchronization for all databases
 */
export const startGlobalSync = () => {
  console.log('[SyncService] Starting Global Sync with Render...');
  
  Object.keys(localDBs).forEach(key => {
    localDBs[key].sync(remoteDBs[key], {
      live: true,
      retry: true
    }).on('change', (info) => {
      console.log(`[SyncService] ${key} synced:`, info.docs_written);
    }).on('error', (err) => {
      console.error(`[SyncService] ${key} Sync Error:`, err);
    });
  });
};

/**
 * Knowledge Base Queries
 */
export async function getDiseasesBySpecies(species) {
  try {
    const result = await localDBs.knowledgeBase.query('diseases/by-species', {
      key: species,
      include_docs: true
    });
    return result.rows.map(row => row.doc);
  } catch (error) {
    console.error('Error fetching diseases:', error);
    return [];
  }
}

export async function searchBySymptom(symptom) {
  try {
    const result = await localDBs.knowledgeBase.query('diseases/by-symptom', {
      key: symptom.toLowerCase(),
      include_docs: true
    });
    return result.rows.map(row => row.doc);
  } catch (error) {
    console.error('Error searching by symptom:', error);
    return [];
  }
}

/**
 * Consultation Queries
 */
export async function createConsultationOffline(consultationData) {
  const doc = {
    _id: `consult_offline_${Date.now()}`,
    type: 'consultation',
    status: 'pending_sync',
    created_offline: true,
    ...consultationData,
    created_at: new Date().toISOString()
  };
  
  try {
    const result = await localDBs.consultations.put(doc);
    return { success: true, id: result.id };
  } catch (error) {
    console.error('Error saving offline consultation:', error);
    return { success: false, error: error.message };
  }
}

export async function getFarmerConsultations(farmerId) {
  try {
    const result = await localDBs.consultations.query('consultations/by-farmer', {
      key: farmerId,
      include_docs: true,
      descending: true
    });
    return result.rows.map(row => row.doc);
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return [];
  }
}

/**
 * Market Price Queries
 */
export async function getLatestPrices(commodity, location) {
  try {
    const result = await localDBs.marketPrices.query('prices/by-commodity', {
      startkey: [commodity, location],
      endkey: [commodity, location, {}],
      descending: true,
      limit: 5,
      include_docs: true
    });
    return result.rows.map(row => row.doc);
  } catch (error) {
    console.error('Error fetching prices:', error);
    return [];
  }
}
