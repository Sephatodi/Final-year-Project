import PouchDB from 'pouchdb';
import { API_BASE_URL } from './constants';

/**
 * CouchDB Sync Utility for Farm-Aid
 * Handles offline-first data synchronization between local PouchDB and remote CouchDB.
 */

const COUCHDB_REMOTE_URL = import.meta.env.VITE_COUCHDB_URL || 'https://admin:password1234@farm-aid-couchdb.onrender.com/farm_aid_production';

// Local database instance
export const localDB = new PouchDB('farm_aid_local');

// Remote database instance
export const remoteDB = new PouchDB(COUCHDB_REMOTE_URL);

/**
 * Initializes two-way synchronization
 */
export const startSync = () => {
  console.log('[SyncService] Initializing bidirectional sync with:', COUCHDB_REMOTE_URL);
  
  return localDB.sync(remoteDB, {
    live: true,
    retry: true
  }).on('change', (info) => {
    console.log('[SyncService] Data change detected:', info);
  }).on('paused', (err) => {
    if (err) {
      console.warn('[SyncService] Sync paused due to error:', err);
    } else {
      console.log('[SyncService] Sync paused (up to date)');
    }
  }).on('active', () => {
    console.log('[SyncService] Sync resumed (active)');
  }).on('error', (err) => {
    console.error('[SyncService] Critical sync error:', err);
  });
};

/**
 * Example JSON document structure for Livestock
 */
export const LIVESTOCK_SCHEMA = {
  _id: 'livestock_uuid', // unique id
  type: 'livestock',
  species: 'cattle',
  breed: 'Brahman',
  gender: 'female',
  birthDate: '2023-01-01',
  ownerId: 'user_uuid',
  healthStatus: 'healthy',
  lastChecked: new Date().toISOString()
};

/**
 * Example JSON document structure for Consultation
 */
export const CONSULTATION_SCHEMA = {
  _id: 'consultation_uuid',
  type: 'consultation',
  farmerId: 'farmer_uuid',
  vetId: 'vet_uuid',
  status: 'pending',
  messages: [],
  createdAt: new Date().toISOString()
};
