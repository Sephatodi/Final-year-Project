// src/services/sync.js
import { getPendingSync, addToSyncQueue as addToQueue, openDB } from '../db/indexedDB.jsx';
import api from './api.jsx';


class SyncService {
  async queueOperation(operation, data) {
    return await addToQueue(operation, data);
  }

  async syncAll() {
    const pending = await getPendingSync();
    const results = {
      success: [],
      failed: []
    };

    for (const item of pending) {
      try {
        await this.syncItem(item);
        results.success.push(item);
        await this.markAsSynced(item.id);
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error);
        results.failed.push({ ...item, error: error.message });
      }
    }

    return results;
  }

  async syncItem(item) {
    switch (item.operation) {
      case 'create_livestock':
        return await api.post('/livestock', item.data);
      case 'update_livestock':
        return await api.put(`/livestock/${item.data.id}`, item.data);
      case 'delete_livestock':
        return await api.delete(`/livestock/${item.data.id}`);
      case 'create_health_record':
        return await api.post('/health-records', item.data);
      case 'create_expense':
        return await api.post('/expenses', item.data);
      case 'report_disease':
        return await api.post('/disease-reports', item.data);
      case 'create_consultation':
        return await api.post('/consultations', item.data);
      default:
        throw new Error(`Unknown operation: ${item.operation}`);
    }
  }

  async markAsSynced(id) {
    const db = await openDB();
    const transaction = db.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const syncService = new SyncService();