// context/SyncContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getDB } from '../db/indexedDB';

const SyncContext = createContext();

export const SyncProvider = ({ children }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncError, setSyncError] = useState(null);

  // Check for pending sync items and sync when online
  useEffect(() => {
    const handleOnline = async () => {
      if (navigator.onLine) {
        await performSync();
      }
    };

    window.addEventListener('online', handleOnline);

    // Initial sync check
    if (navigator.onLine) {
      // Small delay to ensure app is ready
      const timer = setTimeout(() => {
        performSync();
      }, 2000);

      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const performSync = async () => {
    try {
      setIsSyncing(true);
      setSyncError(null);

      const db = await getDB();
      const syncQueue = await db.getAll('syncQueue');

      if (syncQueue.length === 0) {
        setLastSyncTime(new Date());
        setIsSyncing(false);
        return;
      }

      // In production, this would sync with a backend server
      // For now, we'll simulate the sync process
      for (const item of syncQueue) {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 100));

          // Remove from sync queue after successful sync
          await db.delete('syncQueue', item.id);
        } catch (error) {
          console.error('Sync item failed:', error);
          setSyncError(error.message);
        }
      }

      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncError(error.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SyncContext.Provider value={{ isSyncing, lastSyncTime, syncError, performSync }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within SyncProvider');
  }
  return context;
};
