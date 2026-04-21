import { all, call, put, takeLatest } from 'redux-saga/effects';
import { alertService } from '../../services/sync';
import {
    dismissAlertFailure,
    dismissAlertRequest,
    dismissAlertSuccess,
    fetchAlertsFailure,
    fetchAlertsRequest,
    fetchAlertsSuccess,
    fetchRestrictionsFailure,
    fetchRestrictionsRequest,
    fetchRestrictionsSuccess,
    fetchZonesFailure,
    fetchZonesRequest,
    fetchZonesSuccess,
    markAsReadFailure,
    markAsReadRequest,
    markAsReadSuccess
} from './actions/alertActions';

function* handleFetchAlerts(action) {
  try {
    const params = action.payload;
    const response = yield call(alertService.getActive, params);
    yield put(fetchAlertsSuccess(response));
  } catch (error) {
    yield put(fetchAlertsFailure(error.message || 'Failed to fetch alerts'));
  }
}

function* handleDismissAlert(action) {
  try {
    const id = action.payload;
    yield call(alertService.dismiss, id);
    yield put(dismissAlertSuccess(id));
  } catch (error) {
    yield put(dismissAlertFailure(error.message || 'Failed to dismiss alert'));
  }
}

function* handleMarkAsRead(action) {
  try {
    const id = action.payload;
    yield call(alertService.markAsRead, id);
    yield put(markAsReadSuccess(id));
  } catch (error) {
    yield put(markAsReadFailure(error.message || 'Failed to mark alert as read'));
  }
}

function* handleFetchZones() {
  try {
    const response = yield call(alertService.getZones);
    yield put(fetchZonesSuccess(response));
  } catch (error) {
    yield put(fetchZonesFailure(error.message || 'Failed to fetch zones'));
  }
}

function* handleFetchRestrictions() {
  try {
    const response = yield call(alertService.getMovementRestrictions);
    yield put(fetchRestrictionsSuccess(response));
  } catch (error) {
    yield put(fetchRestrictionsFailure(error.message || 'Failed to fetch restrictions'));
  }
}

export function* watchAlert() {
  yield all([
    takeLatest(fetchAlertsRequest.type, handleFetchAlerts),
    takeLatest(dismissAlertRequest.type, handleDismissAlert),
    takeLatest(markAsReadRequest.type, handleMarkAsRead),
    takeLatest(fetchZonesRequest.type, handleFetchZones),
    takeLatest(fetchRestrictionsRequest.type, handleFetchRestrictions),
  ]);
}

export default function* alertSaga() {
  yield call(watchAlert);
}