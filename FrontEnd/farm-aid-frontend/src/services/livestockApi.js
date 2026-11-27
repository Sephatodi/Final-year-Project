// Livestock API Service (offline-first)
// Tries the backend first; when the backend is unreachable (the common case in
// rural / offline use), falls back to a device-local IndexedDB store so farmers
// can keep recording livestock without connectivity. Records are marked
// `synced:false` and can be synchronized later.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://final-year-project-s9va.onrender.com/api';

import { livestockQueries } from '../db/livestockQueries';

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token;
};

const currentFarmerId = () => {
  try {
    const u = JSON.parse(localStorage.getItem('user')) || {};
    return u.userId || u.id || 'local-farmer';
  } catch {
    return 'local-farmer';
  }
};

// Perform a request with a short timeout. Throws on network/HTTP errors so
// callers can fall back to the local store.
const makeRequest = async (endpoint, options = {}, timeoutMs = 6000) => {
  const token = getAuthToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token && !token.startsWith('offline.')) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers, signal: controller.signal });
    if (!response.ok) {
      let errorMessage = `API Error: ${response.status}`;
      try {
        const errorData = await response.json();
        if (typeof errorData === 'string') errorMessage = errorData;
        else if (errorData.message) errorMessage = errorData.message;
        else if (errorData.error) errorMessage = errorData.error;
      } catch { /* keep default */ }
      throw new Error(errorMessage);
    }
    return response.json();
  } finally {
    clearTimeout(timer);
  }
};

export const livestockApi = {
  // Get all livestock for current user (farmer) — offline-first.
  getLivestock: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.species) params.append('species', filters.species.toLowerCase());
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      const response = await makeRequest(`/livestock?${params.toString()}`);
      return response.data || response || [];
    } catch (err) {
      console.warn('getLivestock offline fallback:', err.message);
      let animals = await livestockQueries.getFarmerAnimals(currentFarmerId());
      if (filters.species) {
        const sp = filters.species.toLowerCase();
        animals = animals.filter((a) => a.species === sp);
      }
      return animals;
    }
  },

  // Get single livestock by ID
  getLivestockById: async (id) => {
    try {
      return await makeRequest(`/livestock/${id}`);
    } catch (err) {
      return livestockQueries.getAnimalById(id);
    }
  },

  // Create new livestock record — offline-first.
  createLivestock: async (data) => {
    try {
      const payload = {
        tagId: data.tagId,
        name: data.name,
        species: data.species.toLowerCase(),
        breed: data.breed,
        gender: data.gender,
        birthDate: data.birthDate ? new Date(data.birthDate).toISOString() : null,
        acquisitionDate: data.acquisitionDate ? new Date(data.acquisitionDate).toISOString() : new Date().toISOString(),
        acquisitionMethod: data.acquisitionMethod || 'born',
      };
      const response = await makeRequest('/livestock', { method: 'POST', body: JSON.stringify(payload) });
      return response.data || response;
    } catch (err) {
      console.warn('createLivestock offline fallback:', err.message);
      return livestockQueries.addAnimal({
        farmerId: currentFarmerId(),
        tagId: data.tagId,
        baitsTagNumber: data.tagId,
        name: data.name,
        species: (data.species || '').toLowerCase(),
        breed: data.breed,
        gender: data.gender,
        birthDate: data.birthDate || null,
        acquisitionMethod: data.acquisitionMethod || 'born',
        healthStatus: 'healthy',
        isActive: true,
      });
    }
  },

  // Update livestock record
  updateLivestock: async (id, data) => {
    try {
      return await makeRequest(`/livestock/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    } catch (err) {
      return livestockQueries.updateAnimal(id, data);
    }
  },

  // Delete livestock
  deleteLivestock: async (id) => {
    try {
      return await makeRequest(`/livestock/${id}`, { method: 'DELETE' });
    } catch (err) {
      return livestockQueries.deleteAnimal(id);
    }
  },

  // Log health event for livestock — offline-first.
  logHealthEvent: async (id, eventData) => {
    try {
      return await makeRequest(`/livestock/${id}/health-events`, { method: 'POST', body: JSON.stringify(eventData) });
    } catch (err) {
      console.warn('logHealthEvent offline fallback:', err.message);
      return livestockQueries.addHealthRecord
        ? livestockQueries.addHealthRecord({ ...eventData, livestockId: id, farmerId: currentFarmerId() })
        : livestockQueries.updateAnimal(id, { lastHealthEvent: eventData, updatedAt: new Date().toISOString() });
    }
  },

  // Get health history for livestock
  getHealthHistory: async (id) => {
    try {
      const res = await makeRequest(`/livestock/${id}/health-events`);
      return res.data || res || [];
    } catch (err) {
      return livestockQueries.getAnimalHealthRecords ? livestockQueries.getAnimalHealthRecords(id) : [];
    }
  },

  // Upload livestock image
  uploadImage: async (id, file) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = getAuthToken();
    const headers = {};
    if (token && !token.startsWith('offline.')) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}/livestock/${id}/images`, { method: 'POST', headers, body: formData });
    if (!response.ok) throw new Error('Failed to upload image');
    return response.json();
  },

  // Get herd statistics (for dashboard) — offline-first.
  getHerdStats: async () => {
    try {
      const res = await makeRequest('/livestock/stats');
      if (res && (res.data || res.total !== undefined)) return res.data || res;
    } catch (err) {
      console.warn('getHerdStats offline fallback:', err.message);
    }
    const animals = await livestockQueries.getFarmerAnimals(currentFarmerId());
    const counts = { cattle: 0, goat: 0, sheep: 0 };
    animals.forEach((a) => {
      if (counts[a.species] !== undefined) counts[a.species] += 1;
    });
    const bySpecies = Object.entries(counts).map(([species, count]) => ({ species, count }));
    return { total: animals.length, bySpecies };
  },
};

export default livestockApi;