// db/indexedDB.js
import { openDB } from 'idb';

let db;

export const getDB = async () => {
  if (db) return db;

  db = await openDB('FarmAidDB', 2, {
    upgrade(db) {
      // Knowledge Base Store
      if (!db.objectStoreNames.contains('knowledgeBase')) {
        const kbStore = db.createObjectStore('knowledgeBase', { keyPath: 'id' });
        kbStore.createIndex('diseaseCode', 'diseaseCode');
        kbStore.createIndex('species', 'species');
        kbStore.createIndex('titleEn', 'titleEn');
        kbStore.createIndex('updatedAt', 'updatedAt');
      }

      // Sync Queue Store
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
      }

      // Livestock Records Store
      if (!db.objectStoreNames.contains('livestockRecords')) {
        const lrStore = db.createObjectStore('livestockRecords', { keyPath: 'id' });
        lrStore.createIndex('timestamp', 'timestamp');
        lrStore.createIndex('species', 'species');
      }

      // Health Records Store
      if (!db.objectStoreNames.contains('healthRecords')) {
        const hrStore = db.createObjectStore('healthRecords', { keyPath: 'id' });
        hrStore.createIndex('livestockId', 'livestockId');
        hrStore.createIndex('timestamp', 'timestamp');
        hrStore.createIndex('status', 'status');
      }

      // Treatment Records Store
      if (!db.objectStoreNames.contains('treatmentRecords')) {
        const trStore = db.createObjectStore('treatmentRecords', { keyPath: 'id' });
        trStore.createIndex('livestockId', 'livestockId');
        trStore.createIndex('timestamp', 'timestamp');
        trStore.createIndex('completedAt', 'completedAt');
      }

      // System Status Store (for AI Ingestion tracking)
      if (!db.objectStoreNames.contains('systemStatus')) {
        db.createObjectStore('systemStatus', { keyPath: 'id' });
      }
    }
  });

  return db;
};

// Helper functions for common operations
export const dbOperations = {
  // Count total items in a store
  countItems: async (storeName) => {
    const db = await getDB();
    return await db.count(storeName);
  },

  // Get all items from a store
  getAllItems: async (storeName) => {
    const db = await getDB();
    return await db.getAll(storeName);
  },

  // Add item to store
  addItem: async (storeName, data) => {
    const db = await getDB();
    return await db.add(storeName, data);
  },

  // Put item in store (add or update)
  putItem: async (storeName, data) => {
    const db = await getDB();
    return await db.put(storeName, data);
  },

  // Get item by key
  getItem: async (storeName, key) => {
    const db = await getDB();
    return await db.get(storeName, key);
  },

  // Delete item
  deleteItem: async (storeName, key) => {
    const db = await getDB();
    return await db.delete(storeName, key);
  },

  // Query by index
  queryByIndex: async (storeName, indexName, value) => {
    const db = await getDB();
    const tx = db.transaction(storeName, 'readonly');
    const index = tx.store.index(indexName);
    return await index.getAll(value);
  },

  // Clear entire store
  clearStore: async (storeName) => {
    const db = await getDB();
    return await db.clear(storeName);
  },

  // Batch add items
  batchAdd: async (storeName, items) => {
    const db = await getDB();
    const tx = db.transaction(storeName, 'readwrite');
    for (const item of items) {
      await tx.store.add(item);
    }
    await tx.done;
  },

  // Batch update items
  batchPut: async (storeName, items) => {
    const db = await getDB();
    const tx = db.transaction(storeName, 'readwrite');
    for (const item of items) {
      await tx.store.put(item);
    }
    await tx.done;
  }
};
