import { syncQueue } from '../db/syncQueue';
import { showToast } from '../slices/uiSlice';

// Actions that should be queued when offline
const OFFLINE_ACTIONS = [
  'livestock/ADD_LIVESTOCK_REQUEST',
  'livestock/UPDATE_LIVESTOCK_REQUEST',
  'livestock/DELETE_LIVESTOCK_REQUEST',
  'livestock/ADD_HEALTH_RECORD_REQUEST',
  'livestock/UPDATE_HEALTH_RECORD_REQUEST',
  'livestock/DELETE_HEALTH_RECORD_REQUEST',
  'disease/SUBMIT_REPORT_REQUEST',
  'disease/UPDATE_REPORT_REQUEST',
  'consultations/SEND_MESSAGE_REQUEST',
  'consultations/CREATE_CONSULTATION_REQUEST',
];

// Actions that should be blocked when offline
const BLOCKED_OFFLINE_ACTIONS = [
  'auth/LOGIN_REQUEST',
  'auth/REGISTER_REQUEST',
  'auth/REFRESH_TOKEN_REQUEST',
];

const offlineMiddleware = (store) => (next) => async (action) => {
  // Skip if not an offline action
  if (!OFFLINE_ACTIONS.includes(action.type) && !BLOCKED_OFFLINE_ACTIONS.includes(action.type)) {
    return next(action);
  }

  const state = store.getState();
  const isOffline = !navigator.onLine;

  // Handle blocked actions when offline
  if (isOffline && BLOCKED_OFFLINE_ACTIONS.includes(action.type)) {
    store.dispatch(showToast({
      message: 'You are offline. This action requires an internet connection.',
      type: 'warning',
    }));
    return;
  }

  // Handle offline queueing
  if (isOffline && OFFLINE_ACTIONS.includes(action.type)) {
    try {
      // Extract entity and action type from the Redux action
      const [entity, operation] = action.type.split('/');
      const operationType = operation.replace('_REQUEST', '').toLowerCase();

      // Add to sync queue
      await syncQueue.add(
        entity,
        operationType,
        {
          type: action.type,
          payload: action.payload,
          timestamp: new Date().toISOString(),
        }
      );

      // Show notification
      store.dispatch(showToast({
        message: 'Action saved offline. Will sync when connection is restored.',
        type: 'info',
      }));

      // Still dispatch the action to update local state
      return next(action);
    } catch (error) {
      console.error('Failed to queue offline action:', error);
      store.dispatch(showToast({
        message: 'Failed to save offline action. Please try again.',
        type: 'error',
      }));
      return;
    }
  }

  // Process action normally when online
  return next(action);
};

export default offlineMiddleware;