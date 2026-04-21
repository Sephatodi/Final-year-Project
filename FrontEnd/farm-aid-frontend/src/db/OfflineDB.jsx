import { openDB } from 'idb';

const DB_NAME = 'farm-aid-offline';
const DB_VERSION = 3;

export const initOfflineDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      console.log(`Upgrading offline DB from version ${oldVersion} to ${newVersion}`);

      // 1. Livestock Store - for animal records
      if (!db.objectStoreNames.contains('livestock')) {
        const livestockStore = db.createObjectStore('livestock', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        livestockStore.createIndex('farmerId', 'farmerId');
        livestockStore.createIndex('baitsTag', 'baitsTagNumber', { unique: true });
        livestockStore.createIndex('species', 'species');
        livestockStore.createIndex('healthStatus', 'healthStatus');
        livestockStore.createIndex('synced', 'synced');
        livestockStore.createIndex('updatedAt', 'updatedAt');
      }

      // 2. Health Records Store
      if (!db.objectStoreNames.contains('healthRecords')) {
        const healthStore = db.createObjectStore('healthRecords', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        healthStore.createIndex('livestockId', 'livestockId');
        healthStore.createIndex('date', 'date');
        healthStore.createIndex('type', 'type');
        healthStore.createIndex('synced', 'synced');
      }

      // 3. Disease Reports Store
      if (!db.objectStoreNames.contains('diseaseReports')) {
        const reportsStore = db.createObjectStore('diseaseReports', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        reportsStore.createIndex('farmerId', 'farmerId');
        reportsStore.createIndex('status', 'status');
        reportsStore.createIndex('createdAt', 'createdAt');
        reportsStore.createIndex('synced', 'synced');
      }

      // 4. Sync Queue Store - pending operations
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

      // 5. Knowledge Base Store - offline articles
      if (!db.objectStoreNames.contains('knowledgeBase')) {
        const kbStore = db.createObjectStore('knowledgeBase', { 
          keyPath: 'id' 
        });
        kbStore.createIndex('category', 'category');
        kbStore.createIndex('species', 'species', { multiEntry: true });
      }

      // 6. Farmer Settings Store
      if (!db.objectStoreNames.contains('farmerSettings')) {
        db.createObjectStore('farmerSettings', { keyPath: 'key' });
      }

      // 7. Alerts Cache Store
      if (!db.objectStoreNames.contains('alertsCache')) {
        const alertsStore = db.createObjectStore('alertsCache', { 
          keyPath: 'id' 
        });
        alertsStore.createIndex('severity', 'severity');
        alertsStore.createIndex('expiresAt', 'expiresAt');
      }
    },
  });

  return db;
};

export const getOfflineDB = async () => {
  return await openDB(DB_NAME, DB_VERSION);
};

export const clearOfflineData = async () => {
  const db = await getOfflineDB();
  const stores = db.objectStoreNames;
  
  for (let i = 0; i < stores.length; i++) {
    const store = stores[i];
    if (store !== 'farmerSettings') { // Keep settings
      const tx = db.transaction(store, 'readwrite');
      await tx.objectStore(store).clear();
    }
  }
};