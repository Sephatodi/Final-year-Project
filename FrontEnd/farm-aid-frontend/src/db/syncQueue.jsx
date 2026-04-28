import { getDB } from './indexedDB';

export const syncQueue = {
  // Add item to sync queue
  add: async (entity, action, data, priority = 0) => {
    const db = await getDB();
    const item = {
      entity,
      action,
      data,
      priority,
      status: 'pending',
      attempts: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const id = await db.add('syncQueue', item);
    return { ...item, id };
  },

  // Get all pending items
  getPending: async (limit = 100) => {
    const db = await getDB();
    const tx = db.transaction('syncQueue', 'readonly');
    const store = tx.objectStore('syncQueue');
    const items = await store.getAll();
    
    return items
      .filter(item => item.status === 'pending')
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .slice(0, limit);
  },

  // Get items by entity
  getByEntity: async (entity, status = 'pending') => {
    const db = await getDB();
    const tx = db.transaction('syncQueue', 'readonly');
    const store = tx.objectStore('syncQueue');
    const index = store.index('entity');
    const items = await index.getAll(entity);
    
    return items.filter(item => item.status === status);
  },

  // Update item status
  updateStatus: async (id, status, error = null) => {
    const db = await getDB();
    const item = await db.get('syncQueue', id);
    
    if (!item) {
      throw new Error('Sync queue item not found');
    }

    const updatedItem = {
      ...item,
      status,
      error,
      attempts: status === 'failed' ? item.attempts + 1 : item.attempts,
      updatedAt: new Date().toISOString(),
    };

    await db.put('syncQueue', updatedItem);
    return updatedItem;
  },

  // Increment attempt count
  incrementAttempt: async (id) => {
    const db = await getDB();
    const item = await db.get('syncQueue', id);
    
    if (!item) {
      throw new Error('Sync queue item not found');
    }

    const updatedItem = {
      ...item,
      attempts: item.attempts + 1,
      updatedAt: new Date().toISOString(),
    };

    await db.put('syncQueue', updatedItem);
    return updatedItem;
  },

  // Remove item from queue
  remove: async (id) => {
    const db = await getDB();
    await db.delete('syncQueue', id);
    return { success: true };
  },

  // Clear all items
  clear: async () => {
    const db = await getDB();
    const tx = db.transaction('syncQueue', 'readwrite');
    await tx.objectStore('syncQueue').clear();
    return { success: true };
  },

  // Get queue statistics
  getStats: async () => {
    const db = await getDB();
    const tx = db.transaction('syncQueue', 'readonly');
    const store = tx.objectStore('syncQueue');
    const items = await store.getAll();
    
    return {
      total: items.length,
      pending: items.filter(i => i.status === 'pending').length,
      processing: items.filter(i => i.status === 'processing').length,
      failed: items.filter(i => i.status === 'failed').length,
      completed: items.filter(i => i.status === 'completed').length,
      byEntity: items.reduce((acc, item) => {
        acc[item.entity] = (acc[item.entity] || 0) + 1;
        return acc;
      }, {}),
    };
  },

  // Retry failed items
  retryFailed: async (maxAttempts = 3) => {
    const db = await getDB();
    const tx = db.transaction('syncQueue', 'readwrite');
    const store = tx.objectStore('syncQueue');
    const items = await store.getAll();
    
    for (const item of items) {
      if (item.status === 'failed' && item.attempts < maxAttempts) {
        item.status = 'pending';
        item.updatedAt = new Date().toISOString();
        await store.put(item);
      }
    }
    
    return { success: true };
  },

  // Clean old completed items
  cleanOldItems: async (daysToKeep = 7) => {
    const db = await getDB();
    const tx = db.transaction('syncQueue', 'readwrite');
    const store = tx.objectStore('syncQueue');
    const items = await store.getAll();
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    for (const item of items) {
      if (item.status === 'completed' && new Date(item.updatedAt) < cutoffDate) {
        await store.delete(item.id);
      }
    }
    
    return { success: true };
  },
};