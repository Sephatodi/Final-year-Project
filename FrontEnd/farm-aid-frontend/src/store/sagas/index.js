import { all, fork } from 'redux-saga/effects';
import alertSaga from './alertSaga';
import authSaga from './authSaga';
import consultationSaga from './consultationSaga';
import diseaseSaga from './diseaseSaga';
import livestockSaga from './livestockSaga';
import syncSaga from './syncSaga';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(livestockSaga),
    fork(diseaseSaga),
    fork(consultationSaga),
    fork(syncSaga),
    fork(alertSaga),
  ]);
}