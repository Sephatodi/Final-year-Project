import { createContext, useContext, useEffect, useState } from 'react';
import { getDB } from '../db';
import api from '../services/api';
import { useOffline } from './useOffline';

const SyncContext = createContext();

export const SyncProvider = ({ children }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [pendingChanges, setPendingChanges] = useState(0);
  const [syncError, setSyncError] = useState(null);
  const [syncHistory, setSyncHistory] = useState([]);
  const { isOffline, addToQueue } = useOffline();

  useEffect(() => {
    checkPendingChanges();
    loadSyncHistory();
  }, []);

  useEffect(() => {
    if (!isOffline && pendingChanges > 0) {
      syncNow();
    }
  }, [isOffline]);

  const checkPendingChanges = async () => {
    try {
      const db = await getDB();
      const tx = db.transaction('syncQueue', 'readonly');
      const store = tx.objectStore('syncQueue');
      const count = await store.count();
      setPendingChanges(count);
    } catch (error) {
      console.error('Failed to check pending changes:', error);
    }
  };

  const loadSyncHistory = async () => {
    try {
      const response = await api.get('/sync/history');
      setSyncHistory(response.data);
    } catch (error) {
      console.error('Failed to load sync history:', error);
    }
  };

  const syncNow = async () => {
    if (isOffline) {
      setSyncError('Cannot sync while offline');
      return;
    }

    setIsSyncing(true);
    setSyncError(null);

    try {
      const db = await getDB();
      const tx = db.transaction('syncQueue', 'readonly');
      const store = tx.objectStore('syncQueue');
      const pending = await store.getAll();

      const result = {
        changesPushed: 0,
        changesPulled: 0,
        conflicts: 0
      };

      // Push pending changes
      for (const item of pending) {
        try {
          const response = await api.post(`/${item.entity}/sync`, item.data);
          result.changesPushed++;

          // Remove from queue
          const deleteTx = db.transaction('syncQueue', 'readwrite');
          await deleteTx.store.delete(item.id);
        } catch (error) {
          console.error('Failed to sync item:', error);
          if (error.response?.status === 409) {
            result.conflicts++;
          }
        }
      }

      // Pull latest changes
      const pullResponse = await api.post('/sync/changes', {
        since: lastSync
      });

      result.changesPulled = pullResponse.data.count;

      // Apply pulled changes to local DB
      if (pullResponse.data.changes) {
        const { changes } = pullResponse.data;
        for (const [entity, items] of Object.entries(changes)) {
          if (items.length > 0) {
            const entityTx = db.transaction(entity, 'readwrite');
            const entityStore = entityTx.objectStore(entity);
            for (const item of items) {
              await entityStore.put(item);
            }
          }
        }
      }

      setLastSync(new Date().toISOString());
      await checkPendingChanges();
      await loadSyncHistory();

      return result;
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncError(error.message);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  const getSyncStatus = async () => {
    try {
      const response = await api.get('/sync/status');
      return response.data;
    } catch (error) {
      console.error('Failed to get sync status:', error);
      return null;
    }
  };

  const value = {
    isSyncing,
    lastSync,
    pendingChanges,
    syncError,
    syncHistory,
    syncNow,
    getSyncStatus,
    checkPendingChanges,
  };

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within SyncProvider');
  }
  return context;
};