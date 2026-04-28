import { all, call, put, takeLatest } from 'redux-saga/effects';
import { livestockService } from '../../services/sync';
import {
    addHealthRecordFailure,
    addHealthRecordRequest,
    addHealthRecordSuccess,
    addLivestockFailure,
    addLivestockRequest,
    addLivestockSuccess,
    deleteLivestockFailure,
    deleteLivestockRequest,
    deleteLivestockSuccess,
    fetchHealthRecordsFailure,
    fetchHealthRecordsRequest,
    fetchHealthRecordsSuccess,
    fetchLivestockByIdFailure,
    fetchLivestockByIdRequest,
    fetchLivestockByIdSuccess,
    fetchLivestockFailure,
    fetchLivestockRequest,
    fetchLivestockSuccess,
    updateLivestockFailure,
    updateLivestockRequest,
    updateLivestockSuccess
} from './actions/livestockActions';

function* handleFetchLivestock(action) {
  try {
    const params = action.payload;
    const response = yield call(livestockService.getAll, params);
    yield put(fetchLivestockSuccess(response.animals || response, response.total));
  } catch (error) {
    yield put(fetchLivestockFailure(error.message || 'Failed to fetch livestock'));
  }
}

function* handleFetchLivestockById(action) {
  try {
    const id = action.payload;
    const response = yield call(livestockService.getById, id);
    yield put(fetchLivestockByIdSuccess(response));
  } catch (error) {
    yield put(fetchLivestockByIdFailure(error.message || 'Failed to fetch animal'));
  }
}

function* handleAddLivestock(action) {
  try {
    const animalData = action.payload;
    const response = yield call(livestockService.create, animalData);
    yield put(addLivestockSuccess(response));
  } catch (error) {
    yield put(addLivestockFailure(error.message || 'Failed to add animal'));
  }
}

function* handleUpdateLivestock(action) {
  try {
    const { id, data } = action.payload;
    const response = yield call(livestockService.update, id, data);
    yield put(updateLivestockSuccess(response));
  } catch (error) {
    yield put(updateLivestockFailure(error.message || 'Failed to update animal'));
  }
}

function* handleDeleteLivestock(action) {
  try {
    const id = action.payload;
    yield call(livestockService.delete, id);
    yield put(deleteLivestockSuccess(id));
  } catch (error) {
    yield put(deleteLivestockFailure(error.message || 'Failed to delete animal'));
  }
}

function* handleFetchHealthRecords(action) {
  try {
    const livestockId = action.payload;
    const response = yield call(livestockService.getHealthRecords, livestockId);
    yield put(fetchHealthRecordsSuccess(livestockId, response));
  } catch (error) {
    yield put(fetchHealthRecordsFailure(error.message || 'Failed to fetch health records'));
  }
}

function* handleAddHealthRecord(action) {
  try {
    const { livestockId, data } = action.payload;
    const response = yield call(livestockService.addHealthRecord, livestockId, data);
    yield put(addHealthRecordSuccess(livestockId, response));
  } catch (error) {
    yield put(addHealthRecordFailure(error.message || 'Failed to add health record'));
  }
}

export function* watchLivestock() {
  yield all([
    takeLatest(fetchLivestockRequest.type, handleFetchLivestock),
    takeLatest(fetchLivestockByIdRequest.type, handleFetchLivestockById),
    takeLatest(addLivestockRequest.type, handleAddLivestock),
    takeLatest(updateLivestockRequest.type, handleUpdateLivestock),
    takeLatest(deleteLivestockRequest.type, handleDeleteLivestock),
    takeLatest(fetchHealthRecordsRequest.type, handleFetchHealthRecords),
    takeLatest(addHealthRecordRequest.type, handleAddHealthRecord),
  ]);
}

export default function* livestockSaga() {
  yield call(watchLivestock);
}