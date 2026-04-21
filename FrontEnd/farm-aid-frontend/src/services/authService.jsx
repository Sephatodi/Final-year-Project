import api, { post } from './api';

class AuthService {
  async login(phone, password) {
    const response = await post('/auth/login', { phone, password });
    return response.data;
  }

  async offlineLogin(offlineUuid, pin) {
    const response = await post('/auth/offline-login', { offlineUuid, pin });
    return response.data;
  }

  async biometricLogin() {
    const response = await post('/auth/biometric-login');
    return response.data;
  }

  async register(userData) {
    const response = await post('/auth/register', userData);
    return response.data;
  }

  async logout() {
    await post('/auth/logout');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await post('/auth/refresh', { refreshToken });
    return response.data;
  }

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  }

  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  }

  async changePassword(currentPassword, newPassword) {
    const response = await post('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  }

  async forgotPassword(phone) {
    const response = await post('/auth/forgot-password', { phone });
    return response.data;
  }

  async verifyOTP(phone, otp) {
    const response = await post('/auth/verify-otp', { phone, otp });
    return response.data;
  }

  async resetPassword(phone, otp, newPassword) {
    const response = await post('/auth/reset-password', { phone, otp, newPassword });
    return response.data;
  }

  async enable2FA(code) {
    const response = await post('/auth/2fa/enable', { code });
    return response.data;
  }

  async disable2FA() {
    const response = await post('/auth/2fa/disable');
    return response.data;
  }

  async get2FABackupCodes() {
    const response = await api.get('/auth/2fa/backup-codes');
    return response.data;
  }

  async getSessions() {
    const response = await api.get('/auth/sessions');
    return response.data;
  }

  async terminateSession(sessionId) {
    const response = await api.delete(`/auth/sessions/${sessionId}`);
    return response.data;
  }

  async terminateAllSessions() {
    const response = await api.delete('/auth/sessions');
    return response.data;
  }

  async updateFarmDetails(farmData) {
    const response = await api.put('/users/farm', farmData);
    return response.data;
  }
}

export default new AuthService();