import { all, call, delay, put, takeLatest } from 'redux-saga/effects';
import { syncService } from '../../services/sync';
import {
    fetchSyncHistoryFailure,
    fetchSyncHistoryRequest,
    fetchSyncHistorySuccess,
    fetchSyncStatusFailure,
    fetchSyncStatusRequest,
    fetchSyncStatusSuccess,
    resolveConflictFailure,
    resolveConflictRequest,
    resolveConflictSuccess,
    syncAllFailure,
    syncAllRequest,
    syncAllSuccess
} from './actions/syncActions';
import { showToast } from './slices/uiSlice';

function* handleSyncAll() {
  try {
    yield delay(1000); // Simulate sync delay
    const response = yield call(syncService.syncAll);
    yield put(syncAllSuccess(response));
    yield put(showToast({ message: 'Sync completed successfully', type: 'success' }));
  } catch (error) {
    yield put(syncAllFailure(error.message || 'Sync failed'));
    yield put(showToast({ message: 'Sync failed', type: 'error' }));
  }
}

function* handleFetchSyncStatus() {
  try {
    const response = yield call(syncService.getStatus);
    yield put(fetchSyncStatusSuccess(response));
  } catch (error) {
    yield put(fetchSyncStatusFailure(error.message || 'Failed to fetch sync status'));
  }
}

function* handleFetchSyncHistory(action) {
  try {
    const params = action.payload;
    const response = yield call(syncService.getHistory, params);
    yield put(fetchSyncHistorySuccess(response));
  } catch (error) {
    yield put(fetchSyncHistoryFailure(error.message || 'Failed to fetch sync history'));
  }
}

function* handleResolveConflict(action) {
  try {
    const { conflictId, resolution } = action.payload;
    const response = yield call(syncService.resolveConflict, conflictId, resolution);
    yield put(resolveConflictSuccess(conflictId, resolution));
    yield put(showToast({ message: 'Conflict resolved successfully', type: 'success' }));
  } catch (error) {
    yield put(resolveConflictFailure(error.message || 'Failed to resolve conflict'));
  }
}

export function* watchSync() {
  yield all([
    takeLatest(syncAllRequest.type, handleSyncAll),
    takeLatest(fetchSyncStatusRequest.type, handleFetchSyncStatus),
    takeLatest(fetchSyncHistoryRequest.type, handleFetchSyncHistory),
    takeLatest(resolveConflictRequest.type, handleResolveConflict),
  ]);
}

export default function* syncSaga() {
  yield call(watchSync);
}