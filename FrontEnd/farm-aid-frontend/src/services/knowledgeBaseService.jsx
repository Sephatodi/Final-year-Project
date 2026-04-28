import api, { del, get, post, put } from './api';

class KnowledgeBaseService {
  async getAll(params = {}) {
    const response = await get('/knowledge-base', params);
    return response.data;
  }

  async getById(id) {
    const response = await api.get(`/knowledge-base/${id}`);
    return response.data;
  }

  async getByDiseaseCode(code) {
    const response = await api.get(`/knowledge-base/disease/${code}`);
    return response.data;
  }

  async search(query) {
    const response = await get('/knowledge-base/search', { q: query });
    return response.data;
  }

  async getNotifiable() {
    const response = await get('/knowledge-base', { notifiable: true });
    return response.data;
  }

  async getRelated(id) {
    const response = await api.get(`/knowledge-base/${id}/related`);
    return response.data;
  }

  async incrementView(id) {
    const response = await post(`/knowledge-base/${id}/view`);
    return response.data;
  }

  async getCategories() {
    const response = await api.get('/knowledge-base/categories');
    return response.data;
  }

  async getOfflineBundle() {
    const response = await api.get('/knowledge-base/offline/bundle');
    return response.data;
  }

  // Admin/Expert endpoints
  async create(articleData) {
    const response = await post('/knowledge-base', articleData);
    return response.data;
  }

  async update(id, articleData) {
    const response = await put(`/knowledge-base/${id}`, articleData);
    return response.data;
  }

  async delete(id) {
    const response = await del(`/knowledge-base/${id}`);
    return response.data;
  }

  async uploadImage(id, file, onProgress) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post(`/knowledge-base/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  }

  async deleteImage(id, imageId) {
    const response = await del(`/knowledge-base/${id}/images/${imageId}`);
    return response.data;
  }
}

export default new KnowledgeBaseService();