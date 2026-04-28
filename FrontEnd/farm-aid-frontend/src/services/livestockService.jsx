import api, { del, get, post, put, uploadFile } from './api';
import { openDB } from '../db/indexedDB';
import { syncService } from './sync';

class LivestockService {
  async getAll(params = {}) {
    const response = await get('/livestock', params);
    return response.data;
  }

  async getById(id) {
    const response = await api.get(`/livestock/${id}`);
    return response.data;
  }

  async create(data) {
    const response = await post('/livestock', data);
    return response.data;
  }

  async update(id, data) {
    const response = await put(`/livestock/${id}`, data);
    return response.data;
  }

  async delete(id) {
    const response = await del(`/livestock/${id}`);
    return response.data;
  }

  async sync(livestockData) {
    const response = await post('/livestock/sync', livestockData);
    return response.data;
  }

  async getHealthRecords(livestockId) {
    const response = await api.get(`/livestock/${livestockId}/health-records`);
    return response.data;
  }

  async addHealthRecord(livestockId, data) {
    const response = await post(`/livestock/${livestockId}/health-records`, data);
    return response.data;
  }

  async updateHealthRecord(recordId, data) {
    const response = await put(`/health-records/${recordId}`, data);
    return response.data;
  }

  async deleteHealthRecord(recordId) {
    const response = await del(`/health-records/${recordId}`);
    return response.data;
  }

  async uploadHealthImage(livestockId, file, onProgress) {
    const response = await uploadFile(`/livestock/${livestockId}/images`, file, onProgress);
    return response.data;
  }

  async search(query) {
    const response = await get('/livestock/search', { q: query });
    return response.data;
  }

  async getStats() {
    const response = await api.get('/livestock/stats');
    return response.data;
  }

  async getByBaitsTag(baitsTag) {
    const response = await api.get(`/livestock/baits/${baitsTag}`);
    return response.data;
  }

  async getVaccinationSchedule() {
    const response = await api.get('/livestock/vaccinations/schedule');
    return response.data;
  }

  async recordVaccination(livestockId, data) {
    const response = await post(`/livestock/${livestockId}/vaccinations`, data);
    return response.data;
  }

  async getWeightHistory(livestockId) {
    const response = await api.get(`/livestock/${livestockId}/weight-history`);
    return response.data;
  }

  async recordWeight(livestockId, weight) {
    const response = await post(`/livestock/${livestockId}/weight`, { weight });
    return response.data;
  }
}

export default new LivestockService();