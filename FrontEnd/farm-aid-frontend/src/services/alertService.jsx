import api from './api';

class AlertService {
  async getActive(params = {}) {
    const response = await api.get('/alerts', { params });
    return response.data;
  }

  async dismiss(id) {
    const response = await api.post(`/alerts/${id}/dismiss`);
    return response.data;
  }

  async markAsRead(id) {
    const response = await api.post(`/alerts/${id}/read`);
    return response.data;
  }

  async getZones() {
    const response = await api.get('/disease-zones');
    return response.data;
  }

  async getMovementRestrictions() {
    const response = await api.get('/movement-restrictions');
    return response.data;
  }
}

export default new AlertService();
