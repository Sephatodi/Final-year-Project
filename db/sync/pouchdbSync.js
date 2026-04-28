// db/sync/pouchdbSync.js
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

// Enable the find plugin
PouchDB.plugin(PouchDBFind);

// Configuration
const DB_NAME = 'farmaid-local';
const REMOTE_DB_URL = process.env.REACT_APP_COUCHDB_URL || 'http://localhost:5984/farmaid';

let localDB;
let syncHandler;

/**
 * Initialize local PouchDB instance
 */
export const initPouchDB = async () => {
  if (localDB) return localDB;

  localDB = new PouchDB(DB_NAME);

  // Create indexes for better query performance
  await createIndexes();

  return localDB;
};

/**
 * Create necessary indexes for fast queries
 */
const createIndexes = async () => {
  if (!localDB) return;

  try {
    await localDB.createIndex({
      index: {
        fields: ['diseaseCode']
      }
    });

    await localDB.createIndex({
      index: {
        fields: ['species']
      }
    });

    await localDB.createIndex({
      index: {
        fields: ['titleEn']
      }
    });

    await localDB.createIndex({
      index: {
        fields: ['updatedAt']
      }
    });

    console.log('PouchDB indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};

/**
 * Start syncing with remote CouchDB
 */
export const startSync = (onSyncChange, onSyncError) => {
  if (!localDB) {
    console.error('Local DB not initialized. Call initPouchDB first.');
    return;
  }

  // Stop any existing sync
  if (syncHandler) {
    syncHandler.cancel();
  }

  // Create remote DB reference
  const remoteDB = new PouchDB(REMOTE_DB_URL);

  // Start continuous sync (both ways)
  syncHandler = localDB.sync(remoteDB, {
    live: true,
    retry: true,
    continuous: true,
    heartbeat: 30000
  })
    .on('change', (change) => {
      console.log('Sync change:', change);
      if (onSyncChange) onSyncChange(change);
    })
    .on('paused', (info) => {
      console.log('Sync paused:', info);
    })
    .on('active', (info) => {
      console.log('Sync active:', info);
    })
    .on('denied', (err) => {
      console.error('Sync denied:', err);
      if (onSyncError) onSyncError(err);
    })
    .on('error', (err) => {
      console.error('Sync error:', err);
      if (onSyncError) onSyncError(err);
    });

  return syncHandler;
};

/**
 * Stop syncing
 */
export const stopSync = () => {
  if (syncHandler) {
    syncHandler.cancel();
    syncHandler = null;
  }
};

/**
 * Force one-way sync to remote
 */
export const forceSync = async () => {
  if (!localDB) {
    throw new Error('Local DB not initialized');
  }

  const remoteDB = new PouchDB(REMOTE_DB_URL);

  try {
    const result = await localDB.replicate.to(remoteDB, { batch_size: 100 });
    console.log('Force sync completed:', result);
    return result;
  } catch (error) {
    console.error('Force sync failed:', error);
    throw error;
  }
};

/**
 * Get sync status
 */
export const getSyncStatus = async () => {
  if (!localDB) {
    throw new Error('Local DB not initialized');
  }

  const remoteDB = new PouchDB(REMOTE_DB_URL);

  try {
    const localDoc = await localDB.info();
    const remoteDoc = await remoteDB.info();

    return {
      local: localDoc,
      remote: remoteDoc,
      isSynced: localDoc.doc_count === remoteDoc.doc_count
    };
  } catch (error) {
    console.error('Error getting sync status:', error);
    throw error;
  }
};

/**
 * PouchDB query operations
 */
export const pouchdbOperations = {
  /**
   * Add a new document
   */
  add: async (doc) => {
    if (!localDB) throw new Error('Local DB not initialized');
    return await localDB.post(doc);
  },

  /**
   * Update a document
   */
  update: async (id, updates) => {
    if (!localDB) throw new Error('Local DB not initialized');

    const doc = await localDB.get(id);
    const updated = { ...doc, ...updates, _id: doc._id, _rev: doc._rev };
    return await localDB.put(updated);
  },

  /**
   * Delete a document
   */
  delete: async (id) => {
    if (!localDB) throw new Error('Local DB not initialized');

    const doc = await localDB.get(id);
    return await localDB.remove(doc._id, doc._rev);
  },

  /**
   * Get single document
   */
  get: async (id) => {
    if (!localDB) throw new Error('Local DB not initialized');
    return await localDB.get(id);
  },

  /**
   * Get all documents
   */
  getAll: async () => {
    if (!localDB) throw new Error('Local DB not initialized');
    return await localDB.allDocs({ include_docs: true });
  },

  /**
   * Query by field using Mango queries
   */
  query: async (selector) => {
    if (!localDB) throw new Error('Local DB not initialized');
    return await localDB.find({ selector });
  },

  /**
   * Search documents
   */
  search: async (field, value) => {
    if (!localDB) throw new Error('Local DB not initialized');

    const result = await localDB.find({
      selector: {
        [field]: { $regex: value }
      }
    });

    return result.docs;
  },

  /**
   * Bulk operations
   */
  bulkDocs: async (docs) => {
    if (!localDB) throw new Error('Local DB not initialized');
    return await localDB.bulkDocs(docs);
  },

  /**
   * Clear all documents
   */
  clear: async () => {
    if (!localDB) throw new Error('Local DB not initialized');

    const allDocs = await localDB.allDocs();
    const toDelete = allDocs.rows.map(row => ({
      _id: row.id,
      _rev: row.value.rev,
      _deleted: true
    }));

    return await localDB.bulkDocs(toDelete);
  }
};

/**
 * Export local DB instance getter
 */
export const getLocalDB = () => {
  if (!localDB) {
    throw new Error('PouchDB not initialized. Call initPouchDB first.');
  }
  return localDB;
};
