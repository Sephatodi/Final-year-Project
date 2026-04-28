import { all, call, put, takeLatest } from 'redux-saga/effects';
import { authService } from '../../services/sync';
import {
    changePasswordFailure,
    changePasswordRequest,
    changePasswordSuccess,
    getCurrentUserFailure,
    getCurrentUserRequest,
    getCurrentUserSuccess,
    loginFailure,
    loginRequest,
    loginSuccess,
    logoutFailure,
    logoutRequest,
    logoutSuccess,
    registerFailure,
    registerRequest,
    registerSuccess,
    updateProfileFailure,
    updateProfileRequest,
    updateProfileSuccess
} from './actions/authActions';

function* handleLogin(action) {
  try {
    const { phone, password, rememberMe } = action.payload;
    const response = yield call(authService.login, phone, password);
    yield put(loginSuccess(response.user, response.token));
    
    if (rememberMe) {
      localStorage.setItem('token', response.token);
    } else {
      sessionStorage.setItem('token', response.token);
    }
  } catch (error) {
    yield put(loginFailure(error.message || 'Login failed'));
  }
}

function* handleRegister(action) {
  try {
    const userData = action.payload;
    const response = yield call(authService.register, userData);
    yield put(registerSuccess(response.user, response.token));
    localStorage.setItem('token', response.token);
  } catch (error) {
    yield put(registerFailure(error.message || 'Registration failed'));
  }
}

function* handleLogout() {
  try {
    yield call(authService.logout);
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    yield put(logoutSuccess());
  } catch (error) {
    yield put(logoutFailure(error.message || 'Logout failed'));
  }
}

function* handleGetCurrentUser() {
  try {
    const response = yield call(authService.getCurrentUser);
    yield put(getCurrentUserSuccess(response));
  } catch (error) {
    yield put(getCurrentUserFailure(error.message || 'Failed to get user'));
  }
}

function* handleUpdateProfile(action) {
  try {
    const profileData = action.payload;
    const response = yield call(authService.updateProfile, profileData);
    yield put(updateProfileSuccess(response));
  } catch (error) {
    yield put(updateProfileFailure(error.message || 'Profile update failed'));
  }
}

function* handleChangePassword(action) {
  try {
    const { currentPassword, newPassword } = action.payload;
    yield call(authService.changePassword, currentPassword, newPassword);
    yield put(changePasswordSuccess());
  } catch (error) {
    yield put(changePasswordFailure(error.message || 'Password change failed'));
  }
}

export function* watchAuth() {
  yield all([
    takeLatest(loginRequest.type, handleLogin),
    takeLatest(registerRequest.type, handleRegister),
    takeLatest(logoutRequest.type, handleLogout),
    takeLatest(getCurrentUserRequest.type, handleGetCurrentUser),
    takeLatest(updateProfileRequest.type, handleUpdateProfile),
    takeLatest(changePasswordRequest.type, handleChangePassword),
  ]);
}

export default function* authSaga() {
  yield call(watchAuth);
}