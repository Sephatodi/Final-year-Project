import api, { get, post, put, uploadMultipleFiles } from './api';

class DiseaseReportService {
  async getAll(params = {}) {
    const response = await get('/disease-reports', params);
    return response.data;
  }

  async getById(id) {
    const response = await api.get(`/disease-reports/${id}`);
    return response.data;
  }

  async create(data) {
    const response = await post('/disease-reports', data);
    return response.data;
  }

  async update(id, data) {
    const response = await put(`/disease-reports/${id}`, data);
    return response.data;
  }

  async sync(reportsData) {
    const response = await post('/disease-reports/sync', reportsData);
    return response.data;
  }

  async uploadPhotos(reportId, files, onProgress) {
    const response = await uploadMultipleFiles(`/disease-reports/${reportId}/photos`, files, onProgress);
    return response.data;
  }

  async checkSymptoms(data) {
    const response = await post('/ai/symptom-check', data);
    return response.data;
  }

  async getNearby(params) {
    const response = await get('/disease-reports/nearby', params);
    return response.data;
  }

  async getStats() {
    const response = await api.get('/disease-reports/stats');
    return response.data;
  }

  async getByStatus(status) {
    const response = await get('/disease-reports', { status });
    return response.data;
  }

  async updateStatus(id, status, response_message) {
    const response = await api.patch(`/disease-reports/${id}/status`, { status, response: response_message });
    return response.data;
  }

  async assignOfficer(id, officerId) {
    const response = await api.post(`/disease-reports/${id}/assign`, { officerId });
    return response.data;
  }

  async getPendingSync() {
    const response = await api.get('/disease-reports/pending-sync');
    return response.data;
  }

  async getZones() {
    const response = await api.get('/disease-zones');
    return response.data;
  }

  async getZoneById(zoneId) {
    const response = await api.get(`/disease-zones/${zoneId}`);
    return response.data;
  }
}

export default new DiseaseReportService();