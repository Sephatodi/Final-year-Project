import { all, call, put, takeLatest } from 'redux-saga/effects';
import { diseaseReportService } from '../../services/sync';
import {
    checkSymptomsFailure,
    checkSymptomsRequest,
    checkSymptomsSuccess,
    fetchReportByIdFailure,
    fetchReportByIdRequest,
    fetchReportByIdSuccess,
    fetchReportsFailure,
    fetchReportsRequest,
    fetchReportsSuccess,
    fetchZonesFailure,
    fetchZonesRequest,
    fetchZonesSuccess,
    submitReportFailure,
    submitReportRequest,
    submitReportSuccess,
    updateReportStatusFailure,
    updateReportStatusRequest,
    updateReportStatusSuccess
} from './actions/diseaseActions';

function* handleFetchReports(action) {
  try {
    const params = action.payload;
    const response = yield call(diseaseReportService.getAll, params);
    yield put(fetchReportsSuccess(response.reports || response, response.stats));
  } catch (error) {
    yield put(fetchReportsFailure(error.message || 'Failed to fetch reports'));
  }
}

function* handleFetchReportById(action) {
  try {
    const id = action.payload;
    const response = yield call(diseaseReportService.getById, id);
    yield put(fetchReportByIdSuccess(response));
  } catch (error) {
    yield put(fetchReportByIdFailure(error.message || 'Failed to fetch report'));
  }
}

function* handleSubmitReport(action) {
  try {
    const reportData = action.payload;
    const response = yield call(diseaseReportService.create, reportData);
    yield put(submitReportSuccess(response));
  } catch (error) {
    yield put(submitReportFailure(error.message || 'Failed to submit report'));
  }
}

function* handleUpdateReportStatus(action) {
  try {
    const { id, status, response: responseMessage } = action.payload;
    const response = yield call(diseaseReportService.updateStatus, id, status, responseMessage);
    yield put(updateReportStatusSuccess(id, status, response));
  } catch (error) {
    yield put(updateReportStatusFailure(error.message || 'Failed to update status'));
  }
}

function* handleCheckSymptoms(action) {
  try {
    const { species, symptoms, photos } = action.payload;
    const response = yield call(diseaseReportService.checkSymptoms, { species, symptoms, photos });
    yield put(checkSymptomsSuccess(response));
  } catch (error) {
    yield put(checkSymptomsFailure(error.message || 'Symptom check failed'));
  }
}

function* handleFetchZones() {
  try {
    const response = yield call(diseaseReportService.getZones);
    yield put(fetchZonesSuccess(response));
  } catch (error) {
    yield put(fetchZonesFailure(error.message || 'Failed to fetch zones'));
  }
}

export function* watchDisease() {
  yield all([
    takeLatest(fetchReportsRequest.type, handleFetchReports),
    takeLatest(fetchReportByIdRequest.type, handleFetchReportById),
    takeLatest(submitReportRequest.type, handleSubmitReport),
    takeLatest(updateReportStatusRequest.type, handleUpdateReportStatus),
    takeLatest(checkSymptomsRequest.type, handleCheckSymptoms),
    takeLatest(fetchZonesRequest.type, handleFetchZones),
  ]);
}

export default function* diseaseSaga() {
  yield call(watchDisease);
}