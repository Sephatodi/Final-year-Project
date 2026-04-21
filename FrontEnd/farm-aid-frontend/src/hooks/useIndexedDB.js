import { useEffect, useState } from 'react';
import { getDB } from '../db';

export const useIndexedDB = (storeName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      const db = await getDB();
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const result = await store.getAll();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error(`Failed to load data from ${storeName}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [storeName]);

  const add = async (item) => {
    try {
      const db = await getDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const id = await store.add(item);
      await loadData();
      return id;
    } catch (err) {
      console.error(`Failed to add item to ${storeName}:`, err);
      throw err;
    }
  };

  const update = async (id, updates) => {
    try {
      const db = await getDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const item = await store.get(id);
      const updated = { ...item, ...updates };
      await store.put(updated);
      await loadData();
      return updated;
    } catch (err) {
      console.error(`Failed to update item in ${storeName}:`, err);
      throw err;
    }
  };

  const remove = async (id) => {
    try {
      const db = await getDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.delete(id);
      await loadData();
      return id;
    } catch (err) {
      console.error(`Failed to remove item from ${storeName}:`, err);
      throw err;
    }
  };

  const get = async (id) => {
    try {
      const db = await getDB();
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      return await store.get(id);
    } catch (err) {
      console.error(`Failed to get item from ${storeName}:`, err);
      throw err;
    }
  };

  const query = async (indexName, value) => {
    try {
      const db = await getDB();
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      return await index.getAll(value);
    } catch (err) {
      console.error(`Failed to query ${storeName}:`, err);
      throw err;
    }
  };

  const clear = async () => {
    try {
      const db = await getDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.clear();
      await loadData();
    } catch (err) {
      console.error(`Failed to clear ${storeName}:`, err);
      throw err;
    }
  };

  const count = async () => {
    try {
      const db = await getDB();
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      return await store.count();
    } catch (err) {
      console.error(`Failed to count ${storeName}:`, err);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    add,
    update,
    remove,
    get,
    query,
    clear,
    count,
    refresh: loadData,
  };
};