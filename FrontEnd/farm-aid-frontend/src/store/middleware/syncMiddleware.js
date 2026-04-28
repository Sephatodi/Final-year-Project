import { syncQueue } from '../db/syncQueue';
import consultationService from '../services/consultations';
import diseaseReportService from '../services/diseaseReports';
import livestockService from '../services/livestock';
import { setPendingChanges, setSyncProgress, syncAll } from '../slices/syncSlice';
import { showToast } from '../slices/uiSlice';

// Map of entity names to their service methods
const SERVICE_MAP = {
  livestock: {
    create: livestockService.create,
    update: livestockService.update,
    delete: livestockService.delete,
  },
  disease: {
    create: diseaseReportService.create,
    update: diseaseReportService.update,
    delete: diseaseReportService.delete,
  },
  consultations: {
    create: consultationService.create,
    update: consultationService.update,
    delete: consultationService.delete,
    sendMessage: consultationService.sendMessage,
  },
};

const syncMiddleware = (store) => (next) => (action) => {
  // Handle successful sync
  if (action.type === syncAll.fulfilled.type) {
    store.dispatch(showToast({
      message: 'Sync completed successfully',
      type: 'success',
    }));
  }

  // Handle sync failure
  if (action.type === syncAll.rejected.type) {
    store.dispatch(showToast({
      message: `Sync failed: ${action.payload || 'Unknown error'}`,
      type: 'error',
    }));
  }

  // Process actions that might trigger sync
  const result = next(action);

  // After certain actions, check if we should sync
  const SYNC_TRIGGER_ACTIONS = [
    'livestock/ADD_LIVESTOCK_SUCCESS',
    'livestock/UPDATE_LIVESTOCK_SUCCESS',
    'livestock/DELETE_LIVESTOCK_SUCCESS',
    'disease/SUBMIT_REPORT_SUCCESS',
    'disease/UPDATE_REPORT_SUCCESS',
    'consultations/SEND_MESSAGE_SUCCESS',
    'consultations/CREATE_CONSULTATION_SUCCESS',
  ];

  if (SYNC_TRIGGER_ACTIONS.includes(action.type) && navigator.onLine) {
    // Debounce sync to avoid multiple rapid syncs
    clearTimeout(window.syncTimeout);
    window.syncTimeout = setTimeout(() => {
      store.dispatch(syncAll());
    }, 5000);
  }

  return result;
};

// Background sync processor
export const startBackgroundSync = (store) => {
  const checkAndSync = async () => {
    if (!navigator.onLine) return;

    try {
      const pendingCount = await syncQueue.getPendingCount();
      store.dispatch(setPendingChanges(pendingCount));

      if (pendingCount > 0) {
        const pending = await syncQueue.getPending();
        let processed = 0;

        for (const item of pending) {
          try {
            store.dispatch(setSyncProgress({
              current: processed,
              total: pending.length,
              currentItem: item,
            }));

            const service = SERVICE_MAP[item.entity];
            if (service && service[item.action]) {
              await service[item.action](item.data);
              await syncQueue.remove(item.id);
              processed++;
            }
          } catch (error) {
            console.error(`Failed to sync ${item.entity} item:`, error);
            
            // Increment attempt count
            await syncQueue.incrementAttempt(item.id);
            
            // If too many attempts, mark as failed
            if (item.attempts >= 3) {
              await syncQueue.updateStatus(item.id, 'failed', error.message);
            }
          }
        }

        store.dispatch(setSyncProgress(null));
        store.dispatch(setPendingChanges(await syncQueue.getPendingCount()));

        if (processed > 0) {
          store.dispatch(showToast({
            message: `Synced ${processed} item(s)`,
            type: 'success',
          }));
        }
      }
    } catch (error) {
      console.error('Background sync failed:', error);
    }
  };

  // Run sync every 30 seconds when online
  const interval = setInterval(checkAndSync, 30000);

  // Also sync when coming online
  window.addEventListener('online', checkAndSync);

  return () => {
    clearInterval(interval);
    window.removeEventListener('online', checkAndSync);
  };
};

export default syncMiddleware;