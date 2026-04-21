import { openDB, deleteDB as idbDeleteDB } from 'idb';
import { schemas } from './schema';

const DB_NAME = 'FarmAID';
const DB_VERSION = 2; // Incremented version to ensure upgrade runs with new schema

const upgradeDB = (db, oldVersion, newVersion, transaction) => {
  console.log(`Upgrading database from version ${oldVersion} to ${newVersion}`);
  
  // Iterate through all schemas and create object stores and indexes
  Object.values(schemas).forEach((schema) => {
    if (!db.objectStoreNames.contains(schema.name)) {
      console.log(`Creating object store: ${schema.name}`);
      const store = db.createObjectStore(schema.name, {
        keyPath: schema.keyPath,
        autoIncrement: schema.autoIncrement,
      });

      if (schema.indexes) {
        schema.indexes.forEach((index) => {
          store.createIndex(index.name, index.keyPath, index.options);
        });
      }
    } else {
      // If store exists, check if we need to add new indexes
      const store = transaction.objectStore(schema.name);
      if (schema.indexes) {
        schema.indexes.forEach((index) => {
          if (!store.indexNames.contains(index.name)) {
            console.log(`Adding index ${index.name} to store ${schema.name}`);
            store.createIndex(index.name, index.keyPath, index.options);
          }
        });
      }
    }
  });
};

export const initDB = async () => {
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade: upgradeDB,
  });
};

export const getDB = async () => {
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade: upgradeDB,
  });
};

export const deleteDB = async () => {
  return await idbDeleteDB(DB_NAME);
};

export const clearAllStores = async () => {
  const db = await getDB();
  const stores = db.objectStoreNames;
  
  for (const storeName of stores) {
    const tx = db.transaction(storeName, 'readwrite');
    await tx.objectStore(storeName).clear();
    await tx.done;
  }
};

// Legacy support for older calls if any exist
export const openDB_Legacy = openDB;

export const saveToIndexedDB = async (storeName, data) => {
  const db = await getDB();
  return await db.put(storeName, data);
};

export const getFromIndexedDB = async (storeName, key) => {
  const db = await getDB();
  return await db.get(storeName, key);
};

export const getAllFromIndexedDB = async (storeName) => {
  const db = await getDB();
  return await db.getAll(storeName);
};

export const deleteFromIndexedDB = async (storeName, key) => {
  const db = await getDB();
  return await db.delete(storeName, key);
};

export const clearIndexedDB = async (storeName) => {
  const db = await getDB();
  return await db.clear(storeName);
};

export default {
  initDB,
  getDB,
  deleteDB,
  clearAllStores,
  saveToIndexedDB,
  getFromIndexedDB,
  getAllFromIndexedDB,
  deleteFromIndexedDB,
  clearIndexedDB,
};
