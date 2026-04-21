import { createAction } from '@reduxjs/toolkit';

// Action types
export const LOGIN_REQUEST = 'auth/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';

export const LOGOUT_REQUEST = 'auth/LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'auth/LOGOUT_FAILURE';

export const REGISTER_REQUEST = 'auth/REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'auth/REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'auth/REGISTER_FAILURE';

export const OFFLINE_LOGIN_REQUEST = 'auth/OFFLINE_LOGIN_REQUEST';
export const OFFLINE_LOGIN_SUCCESS = 'auth/OFFLINE_LOGIN_SUCCESS';
export const OFFLINE_LOGIN_FAILURE = 'auth/OFFLINE_LOGIN_FAILURE';

export const BIOMETRIC_LOGIN_REQUEST = 'auth/BIOMETRIC_LOGIN_REQUEST';
export const BIOMETRIC_LOGIN_SUCCESS = 'auth/BIOMETRIC_LOGIN_SUCCESS';
export const BIOMETRIC_LOGIN_FAILURE = 'auth/BIOMETRIC_LOGIN_FAILURE';

export const REFRESH_TOKEN_REQUEST = 'auth/REFRESH_TOKEN_REQUEST';
export const REFRESH_TOKEN_SUCCESS = 'auth/REFRESH_TOKEN_SUCCESS';
export const REFRESH_TOKEN_FAILURE = 'auth/REFRESH_TOKEN_FAILURE';

export const GET_CURRENT_USER_REQUEST = 'auth/GET_CURRENT_USER_REQUEST';
export const GET_CURRENT_USER_SUCCESS = 'auth/GET_CURRENT_USER_SUCCESS';
export const GET_CURRENT_USER_FAILURE = 'auth/GET_CURRENT_USER_FAILURE';

export const UPDATE_PROFILE_REQUEST = 'auth/UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS = 'auth/UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE = 'auth/UPDATE_PROFILE_FAILURE';

export const CHANGE_PASSWORD_REQUEST = 'auth/CHANGE_PASSWORD_REQUEST';
export const CHANGE_PASSWORD_SUCCESS = 'auth/CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_FAILURE = 'auth/CHANGE_PASSWORD_FAILURE';

export const FORGOT_PASSWORD_REQUEST = 'auth/FORGOT_PASSWORD_REQUEST';
export const FORGOT_PASSWORD_SUCCESS = 'auth/FORGOT_PASSWORD_SUCCESS';
export const FORGOT_PASSWORD_FAILURE = 'auth/FORGOT_PASSWORD_FAILURE';

export const RESET_PASSWORD_REQUEST = 'auth/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS = 'auth/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILURE = 'auth/RESET_PASSWORD_FAILURE';

export const VERIFY_OTP_REQUEST = 'auth/VERIFY_OTP_REQUEST';
export const VERIFY_OTP_SUCCESS = 'auth/VERIFY_OTP_SUCCESS';
export const VERIFY_OTP_FAILURE = 'auth/VERIFY_OTP_FAILURE';

export const ENABLE_2FA_REQUEST = 'auth/ENABLE_2FA_REQUEST';
export const ENABLE_2FA_SUCCESS = 'auth/ENABLE_2FA_SUCCESS';
export const ENABLE_2FA_FAILURE = 'auth/ENABLE_2FA_FAILURE';

export const DISABLE_2FA_REQUEST = 'auth/DISABLE_2FA_REQUEST';
export const DISABLE_2FA_SUCCESS = 'auth/DISABLE_2FA_SUCCESS';
export const DISABLE_2FA_FAILURE = 'auth/DISABLE_2FA_FAILURE';

export const GET_SESSIONS_REQUEST = 'auth/GET_SESSIONS_REQUEST';
export const GET_SESSIONS_SUCCESS = 'auth/GET_SESSIONS_SUCCESS';
export const GET_SESSIONS_FAILURE = 'auth/GET_SESSIONS_FAILURE';

export const TERMINATE_SESSION_REQUEST = 'auth/TERMINATE_SESSION_REQUEST';
export const TERMINATE_SESSION_SUCCESS = 'auth/TERMINATE_SESSION_SUCCESS';
export const TERMINATE_SESSION_FAILURE = 'auth/TERMINATE_SESSION_FAILURE';

export const CLEAR_AUTH_ERROR = 'auth/CLEAR_AUTH_ERROR';
export const SET_AUTH_TOKEN = 'auth/SET_AUTH_TOKEN';

// Action creators using createAction
export const loginRequest = createAction(LOGIN_REQUEST, (credentials) => ({
  payload: credentials,
}));

export const loginSuccess = createAction(LOGIN_SUCCESS, (user, token) => ({
  payload: { user, token },
}));

export const loginFailure = createAction(LOGIN_FAILURE, (error) => ({
  payload: error,
}));

export const logoutRequest = createAction(LOGOUT_REQUEST);
export const logoutSuccess = createAction(LOGOUT_SUCCESS);
export const logoutFailure = createAction(LOGOUT_FAILURE, (error) => ({
  payload: error,
}));

export const registerRequest = createAction(REGISTER_REQUEST, (userData) => ({
  payload: userData,
}));

export const registerSuccess = createAction(REGISTER_SUCCESS, (user, token) => ({
  payload: { user, token },
}));

export const registerFailure = createAction(REGISTER_FAILURE, (error) => ({
  payload: error,
}));

export const offlineLoginRequest = createAction(OFFLINE_LOGIN_REQUEST, (credentials) => ({
  payload: credentials,
}));

export const offlineLoginSuccess = createAction(OFFLINE_LOGIN_SUCCESS, (user, token) => ({
  payload: { user, token },
}));

export const offlineLoginFailure = createAction(OFFLINE_LOGIN_FAILURE, (error) => ({
  payload: error,
}));

export const biometricLoginRequest = createAction(BIOMETRIC_LOGIN_REQUEST);
export const biometricLoginSuccess = createAction(BIOMETRIC_LOGIN_SUCCESS, (user, token) => ({
  payload: { user, token },
}));
export const biometricLoginFailure = createAction(BIOMETRIC_LOGIN_FAILURE, (error) => ({
  payload: error,
}));

export const refreshTokenRequest = createAction(REFRESH_TOKEN_REQUEST);
export const refreshTokenSuccess = createAction(REFRESH_TOKEN_SUCCESS, (token) => ({
  payload: token,
}));
export const refreshTokenFailure = createAction(REFRESH_TOKEN_FAILURE, (error) => ({
  payload: error,
}));

export const getCurrentUserRequest = createAction(GET_CURRENT_USER_REQUEST);
export const getCurrentUserSuccess = createAction(GET_CURRENT_USER_SUCCESS, (user) => ({
  payload: user,
}));
export const getCurrentUserFailure = createAction(GET_CURRENT_USER_FAILURE, (error) => ({
  payload: error,
}));

export const updateProfileRequest = createAction(UPDATE_PROFILE_REQUEST, (profileData) => ({
  payload: profileData,
}));
export const updateProfileSuccess = createAction(UPDATE_PROFILE_SUCCESS, (user) => ({
  payload: user,
}));
export const updateProfileFailure = createAction(UPDATE_PROFILE_FAILURE, (error) => ({
  payload: error,
}));

export const changePasswordRequest = createAction(CHANGE_PASSWORD_REQUEST, (passwords) => ({
  payload: passwords,
}));
export const changePasswordSuccess = createAction(CHANGE_PASSWORD_SUCCESS);
export const changePasswordFailure = createAction(CHANGE_PASSWORD_FAILURE, (error) => ({
  payload: error,
}));

export const forgotPasswordRequest = createAction(FORGOT_PASSWORD_REQUEST, (phone) => ({
  payload: phone,
}));
export const forgotPasswordSuccess = createAction(FORGOT_PASSWORD_SUCCESS);
export const forgotPasswordFailure = createAction(FORGOT_PASSWORD_FAILURE, (error) => ({
  payload: error,
}));

export const resetPasswordRequest = createAction(RESET_PASSWORD_REQUEST, (data) => ({
  payload: data,
}));
export const resetPasswordSuccess = createAction(RESET_PASSWORD_SUCCESS);
export const resetPasswordFailure = createAction(RESET_PASSWORD_FAILURE, (error) => ({
  payload: error,
}));

export const verifyOTPRequest = createAction(VERIFY_OTP_REQUEST, (data) => ({
  payload: data,
}));
export const verifyOTPSuccess = createAction(VERIFY_OTP_SUCCESS);
export const verifyOTPFailure = createAction(VERIFY_OTP_FAILURE, (error) => ({
  payload: error,
}));

export const enable2FARequest = createAction(ENABLE_2FA_REQUEST, (code) => ({
  payload: code,
}));
export const enable2FASuccess = createAction(ENABLE_2FA_SUCCESS);
export const enable2FAFailure = createAction(ENABLE_2FA_FAILURE, (error) => ({
  payload: error,
}));

export const disable2FARequest = createAction(DISABLE_2FA_REQUEST);
export const disable2FASuccess = createAction(DISABLE_2FA_SUCCESS);
export const disable2FAFailure = createAction(DISABLE_2FA_FAILURE, (error) => ({
  payload: error,
}));

export const getSessionsRequest = createAction(GET_SESSIONS_REQUEST);
export const getSessionsSuccess = createAction(GET_SESSIONS_SUCCESS, (sessions) => ({
  payload: sessions,
}));
export const getSessionsFailure = createAction(GET_SESSIONS_FAILURE, (error) => ({
  payload: error,
}));

export const terminateSessionRequest = createAction(TERMINATE_SESSION_REQUEST, (sessionId) => ({
  payload: sessionId,
}));
export const terminateSessionSuccess = createAction(TERMINATE_SESSION_SUCCESS, (sessionId) => ({
  payload: sessionId,
}));
export const terminateSessionFailure = createAction(TERMINATE_SESSION_FAILURE, (error) => ({
  payload: error,
}));

export const clearAuthError = createAction(CLEAR_AUTH_ERROR);
export const setAuthToken = createAction(SET_AUTH_TOKEN, (token) => ({
  payload: token,
}));

// Action object for easier imports
const authActions = {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  offlineLoginRequest,
  offlineLoginSuccess,
  offlineLoginFailure,
  biometricLoginRequest,
  biometricLoginSuccess,
  biometricLoginFailure,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
  getCurrentUserRequest,
  getCurrentUserSuccess,
  getCurrentUserFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  verifyOTPRequest,
  verifyOTPSuccess,
  verifyOTPFailure,
  enable2FARequest,
  enable2FASuccess,
  enable2FAFailure,
  disable2FARequest,
  disable2FASuccess,
  disable2FAFailure,
  getSessionsRequest,
  getSessionsSuccess,
  getSessionsFailure,
  terminateSessionRequest,
  terminateSessionSuccess,
  terminateSessionFailure,
  clearAuthError,
  setAuthToken,
};

export default authActions;