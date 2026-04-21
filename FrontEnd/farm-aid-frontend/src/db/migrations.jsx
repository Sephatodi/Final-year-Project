import { getDB } from './indexedDB';

export const migrations = [
  {
    version: 1,
    description: 'Initial database schema',
    up: async (db) => {
      // Version 1 is created automatically in initDB
      console.log('Migration to version 1 completed');
    },
  },
  {
    version: 2,
    description: 'Add offlineId indexes and sync tracking',
    up: async (db) => {
      const stores = ['livestock', 'healthRecords', 'diseaseReports', 'consultations', 'messages'];
      
      for (const storeName of stores) {
        if (db.objectStoreNames.contains(storeName)) {
          const store = db.transaction(storeName, 'versionchange').objectStore(storeName);
          
          if (!store.indexNames.contains('offlineId')) {
            store.createIndex('offlineId', 'offlineId', { unique: true });
          }
          
          if (!store.indexNames.contains('synced')) {
            store.createIndex('synced', 'synced', { unique: false });
          }
        }
      }
      
      // Add syncQueue store if not exists
      if (!db.objectStoreNames.contains('syncQueue')) {
        const syncStore = db.createObjectStore('syncQueue', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        syncStore.createIndex('entity', 'entity');
        syncStore.createIndex('action', 'action');
        syncStore.createIndex('timestamp', 'timestamp');
        syncStore.createIndex('status', 'status');
        syncStore.createIndex('attempts', 'attempts');
      }
      
      console.log('Migration to version 2 completed');
    },
  },
  {
    version: 3,
    description: 'Add conflicts store and improve indexing',
    up: async (db) => {
      // Add conflicts store
      if (!db.objectStoreNames.contains('conflicts')) {
        const conflictStore = db.createObjectStore('conflicts', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        conflictStore.createIndex('entity', 'entity');
        conflictStore.createIndex('entityId', 'entityId');
        conflictStore.createIndex('resolved', 'resolved');
        conflictStore.createIndex('timestamp', 'timestamp');
      }
      
      // Add sync logs store
      if (!db.objectStoreNames.contains('syncLogs')) {
        const logStore = db.createObjectStore('syncLogs', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        logStore.createIndex('timestamp', 'timestamp');
        logStore.createIndex('status', 'status');
      }
      
      // Add offline actions store
      if (!db.objectStoreNames.contains('offlineActions')) {
        const actionStore = db.createObjectStore('offlineActions', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        actionStore.createIndex('timestamp', 'timestamp');
        actionStore.createIndex('processed', 'processed');
      }
      
      console.log('Migration to version 3 completed');
    },
  },
];

export const runMigrations = async () => {
  const db = await getDB();
  const currentVersion = db.version;
  
  console.log(`Current database version: ${currentVersion}`);
  
  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      console.log(`Running migration to version ${migration.version}: ${migration.description}`);
      // Migrations are handled by the upgrade function in initDB
      // This is just for logging
    }
  }
};

export const getMigrationStatus = async () => {
  const db = await getDB();
  return {
    currentVersion: db.version,
    migrations: migrations.map(m => ({
      ...m,
      applied: m.version <= db.version,
    })),
  };
};

export const exportData = async () => {
  const db = await getDB();
  const stores = db.objectStoreNames;
  const exportData = {};

  for (let i = 0; i < stores.length; i++) {
    const storeName = stores[i];
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    exportData[storeName] = await store.getAll();
  }

  return {
    version: db.version,
    timestamp: new Date().toISOString(),
    data: exportData,
  };
};

export const importData = async (data) => {
  const db = await getDB();
  
  for (const [storeName, items] of Object.entries(data.data)) {
    if (db.objectStoreNames.contains(storeName)) {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      
      await store.clear();
      
      for (const item of items) {
        await store.add(item);
      }
    }
  }
  
  console.log('Data import completed');
};