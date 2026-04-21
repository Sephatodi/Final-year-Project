import api, { get, post, put, uploadFile } from './api';

class ConsultationService {
  async getAll(params = {}) {
    const response = await get('/consultations', params);
    return response.data;
  }

  async getById(id) {
    const response = await api.get(`/consultations/${id}`);
    return response.data;
  }

  async create(data) {
    const response = await post('/consultations', data);
    return response.data;
  }

  async update(id, data) {
    const response = await put(`/consultations/${id}`, data);
    return response.data;
  }

  async getMessages(consultationId) {
    const response = await api.get(`/consultations/${consultationId}/messages`);
    return response.data;
  }

  async sendMessage(consultationId, data) {
    const response = await post(`/consultations/${consultationId}/messages`, data);
    return response.data;
  }

  async uploadImage(consultationId, file, onProgress) {
    const response = await uploadFile(`/consultations/${consultationId}/images`, file, onProgress);
    return response.data;
  }

  async markAsRead(consultationId) {
    const response = await post(`/consultations/${consultationId}/read`);
    return response.data;
  }

  async assignExpert(consultationId, expertId) {
    const response = await post(`/consultations/${consultationId}/assign`, { expertId });
    return response.data;
  }

  async resolve(consultationId, data) {
    const response = await post(`/consultations/${consultationId}/resolve`, data);
    return response.data;
  }

  async rate(consultationId, rating, feedback) {
    const response = await post(`/consultations/${consultationId}/rate`, { rating, feedback });
    return response.data;
  }

  async getAvailableExperts(params = {}) {
    const response = await get('/experts/available', params);
    return response.data;
  }

  async getExpertById(expertId) {
    const response = await api.get(`/experts/${expertId}`);
    return response.data;
  }

  async rateExpert(expertId, rating, feedback) {
    const response = await post(`/experts/${expertId}/rate`, { rating, feedback });
    return response.data;
  }

  async startVideoCall(consultationId) {
    const response = await post(`/consultations/${consultationId}/video/start`);
    return response.data;
  }

  async endVideoCall(consultationId) {
    const response = await post(`/consultations/${consultationId}/video/end`);
    return response.data;
  }

  async getCallHistory(consultationId) {
    const response = await api.get(`/consultations/${consultationId}/calls`);
    return response.data;
  }
}

export default new ConsultationService();