import { getDB } from './indexedDB';
import { syncQueue } from './syncQueue';

export const offlineStorage = {
  // Save data with offline support
  save: async (storeName, data, options = {}) => {
    const { sync = true, generateId = true } = options;
    
    const db = await getDB();
    const item = {
      ...data,
      ...(generateId && !data.id ? { offlineId: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` } : {}),
      synced: !sync,
      updatedAt: new Date().toISOString(),
    };
    
    const id = await db.add(storeName, item);
    
    if (sync) {
      await syncQueue.add(storeName, 'create', item);
    }
    
    return { ...item, id };
  },

  // Update data with offline support
  update: async (storeName, id, updates, options = {}) => {
    const { sync = true } = options;
    
    const db = await getDB();
    const item = await db.get(storeName, id);
    
    if (!item) {
      throw new Error(`Item not found in ${storeName}`);
    }

    const updatedItem = {
      ...item,
      ...updates,
      synced: !sync,
      updatedAt: new Date().toISOString(),
    };

    await db.put(storeName, updatedItem);
    
    if (sync) {
      await syncQueue.add(storeName, 'update', { id, ...updates });
    }
    
    return updatedItem;
  },

  // Delete data with offline support
  delete: async (storeName, id, options = {}) => {
    const { sync = true } = options;
    
    const db = await getDB();
    await db.delete(storeName, id);
    
    if (sync) {
      await syncQueue.add(storeName, 'delete', { id });
    }
    
    return { success: true };
  },

  // Get data (tries offline first, then optionally online)
  get: async (storeName, id, options = {}) => {
    const { online = false } = options;
    
    const db = await getDB();
    const item = await db.get(storeName, id);
    
    if (online && !item) {
      // In production, would fetch from API
      return null;
    }
    
    return item;
  },

  // Get all data from a store
  getAll: async (storeName, options = {}) => {
    const { filter = null, sort = null } = options;
    
    const db = await getDB();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    let items = await store.getAll();
    
    if (filter) {
      items = items.filter(filter);
    }
    
    if (sort) {
      items.sort(sort);
    }
    
    return items;
  },

  // Get pending sync items
  getPendingSync: async (storeName) => {
    const db = await getDB();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const items = await store.getAll();
    
    return items.filter(item => !item.synced);
  },

  // Mark items as synced
  markAsSynced: async (storeName, ids, serverData = {}) => {
    const db = await getDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    
    for (const id of ids) {
      const item = await store.get(id);
      if (item) {
        const updatedItem = {
          ...item,
          ...serverData[id],
          synced: true,
          syncedAt: new Date().toISOString(),
        };
        await store.put(updatedItem);
      }
    }
    
    return { success: true };
  },

  // Get storage info
  getStorageInfo: async () => {
    const db = await getDB();
    const stores = db.objectStoreNames;
    const info = {};
    
    for (let i = 0; i < stores.length; i++) {
      const storeName = stores[i];
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const items = await store.getAll();
      
      info[storeName] = {
        count: items.length,
        size: new Blob([JSON.stringify(items)]).size,
        pendingSync: items.filter(i => !i.synced).length,
      };
    }
    
    return info;
  },

  // Clear all offline data (for logout)
  clearAll: async () => {
    const db = await getDB();
    const stores = db.objectStoreNames;
    
    for (let i = 0; i < stores.length; i++) {
      const storeName = stores[i];
      const tx = db.transaction(storeName, 'readwrite');
      await tx.objectStore(storeName).clear();
    }
    
    return { success: true };
  },

  // Export data
  exportData: async () => {
    const db = await getDB();
    const stores = db.objectStoreNames;
    const exportData = {};
    
    for (let i = 0; i < stores.length; i++) {
      const storeName = stores[i];
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      exportData[storeName] = await store.getAll();
    }
    
    return exportData;
  },

  // Import data
  importData: async (data, options = {}) => {
    const { clearExisting = true } = options;
    
    const db = await getDB();
    
    for (const [storeName, items] of Object.entries(data)) {
      if (db.objectStoreNames.contains(storeName)) {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        
        if (clearExisting) {
          await store.clear();
        }
        
        for (const item of items) {
          await store.put(item);
        }
      }
    }
    
    return { success: true };
  },
};