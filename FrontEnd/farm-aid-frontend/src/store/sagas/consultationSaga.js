import { all, call, put, takeLatest } from 'redux-saga/effects';
import { consultationService } from '../../services/sync';
import {
    createConsultationFailure,
    createConsultationRequest,
    createConsultationSuccess,
    fetchConsultationsFailure,
    fetchConsultationsRequest,
    fetchConsultationsSuccess,
    fetchMessagesFailure,
    fetchMessagesRequest,
    fetchMessagesSuccess,
    rateConsultationFailure,
    rateConsultationRequest,
    rateConsultationSuccess,
    resolveConsultationFailure,
    resolveConsultationRequest,
    resolveConsultationSuccess,
    sendMessageFailure,
    sendMessageRequest,
    sendMessageSuccess
} from './actions/consultationActions';

function* handleFetchConsultations(action) {
  try {
    const params = action.payload;
    const response = yield call(consultationService.getAll, params);
    yield put(fetchConsultationsSuccess(response));
  } catch (error) {
    yield put(fetchConsultationsFailure(error.message || 'Failed to fetch consultations'));
  }
}

function* handleCreateConsultation(action) {
  try {
    const data = action.payload;
    const response = yield call(consultationService.create, data);
    yield put(createConsultationSuccess(response));
  } catch (error) {
    yield put(createConsultationFailure(error.message || 'Failed to create consultation'));
  }
}

function* handleFetchMessages(action) {
  try {
    const consultationId = action.payload;
    const response = yield call(consultationService.getMessages, consultationId);
    yield put(fetchMessagesSuccess(consultationId, response));
  } catch (error) {
    yield put(fetchMessagesFailure(error.message || 'Failed to fetch messages'));
  }
}

function* handleSendMessage(action) {
  try {
    const { consultationId, content, attachments } = action.payload;
    const response = yield call(consultationService.sendMessage, consultationId, { content, attachments });
    yield put(sendMessageSuccess(consultationId, response));
  } catch (error) {
    yield put(sendMessageFailure(error.message || 'Failed to send message'));
  }
}

function* handleResolveConsultation(action) {
  try {
    const { id, resolution } = action.payload;
    const response = yield call(consultationService.resolve, id, resolution);
    yield put(resolveConsultationSuccess(response));
  } catch (error) {
    yield put(resolveConsultationFailure(error.message || 'Failed to resolve consultation'));
  }
}

function* handleRateConsultation(action) {
  try {
    const { id, rating, feedback } = action.payload;
    const response = yield call(consultationService.rate, id, rating, feedback);
    yield put(rateConsultationSuccess(id, rating, feedback));
  } catch (error) {
    yield put(rateConsultationFailure(error.message || 'Failed to rate consultation'));
  }
}

export function* watchConsultation() {
  yield all([
    takeLatest(fetchConsultationsRequest.type, handleFetchConsultations),
    takeLatest(createConsultationRequest.type, handleCreateConsultation),
    takeLatest(fetchMessagesRequest.type, handleFetchMessages),
    takeLatest(sendMessageRequest.type, handleSendMessage),
    takeLatest(resolveConsultationRequest.type, handleResolveConsultation),
    takeLatest(rateConsultationRequest.type, handleRateConsultation),
  ]);
}

export default function* consultationSaga() {
  yield call(watchConsultation);
}