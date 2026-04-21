let dbInstance = null;
const DB_NAME = 'FarmAidDB';
const DB_VERSION = 1;

export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('livestock')) {
        const livestockStore = db.createObjectStore('livestock', { keyPath: 'id', autoIncrement: true });
        livestockStore.createIndex('species', 'species', { unique: false });
        livestockStore.createIndex('status', 'status', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('healthRecords')) {
        const healthStore = db.createObjectStore('healthRecords', { keyPath: 'id', autoIncrement: true });
        healthStore.createIndex('animalId', 'animalId', { unique: false });
        healthStore.createIndex('date', 'date', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

export const initDB = async () => {
  return await openDB();
};

export const getDB = async () => {
  if (dbInstance) return dbInstance;
  return await openDB();
};

export const deleteDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => {
      dbInstance = null;
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
};

export const clearAllStores = async () => {
  const db = await getDB();
  const stores = Array.from(db.objectStoreNames);
  const transaction = db.transaction(stores, 'readwrite');
  stores.forEach(store => transaction.objectStore(store).clear());
};

export const addToSyncQueue = async (operation, data) => {
  const db = await openDB();
  const transaction = db.transaction(['syncQueue'], 'readwrite');
  const store = transaction.objectStore('syncQueue');
  
  return new Promise((resolve, reject) => {
    const request = store.add({
      operation,
      data,
      timestamp: new Date().toISOString(),
      synced: false
    });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getPendingSync = async () => {
  const db = await openDB();
  const transaction = db.transaction(['syncQueue'], 'readonly');
  const store = transaction.objectStore('syncQueue');
  const index = store.index('synced');
  
  return new Promise((resolve, reject) => {
    const request = index.getAll(false);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};