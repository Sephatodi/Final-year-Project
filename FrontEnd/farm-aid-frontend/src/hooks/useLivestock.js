import { useEffect, useState } from 'react';
import { livestockQueries } from '../db/livestockQueries';
import api from '../services/api';
import { useOffline } from './useOffline';

export const useLivestock = (farmerId) => {
  const [livestock, setLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOffline, addToQueue } = useOffline();

  useEffect(() => {
    loadLivestock();
  }, [farmerId]);

  const loadLivestock = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isOffline) {
        // Load from IndexedDB
        const data = await livestockQueries.getFarmerAnimals(farmerId);
        setLivestock(data);
      } else {
        // Load from API
        const response = await api.get('/livestock');
        setLivestock(response.data);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to load livestock:', err);
    } finally {
      setLoading(false);
    }
  };

  const addAnimal = async (animalData) => {
    try {
      if (isOffline) {
        // Save to IndexedDB and queue for sync
        const newAnimal = await livestockQueries.addAnimal({
          ...animalData,
          farmerId,
          offlineId: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        });

        addToQueue({
          entity: 'livestock',
          action: 'create',
          data: newAnimal
        });

        setLivestock(prev => [...prev, newAnimal]);
        return { success: true, data: newAnimal };
      } else {
        // Save to API
        const response = await api.post('/livestock', animalData);
        setLivestock(prev => [...prev, response.data]);
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error('Failed to add animal:', err);
      return { success: false, error: err.message };
    }
  };

  const updateAnimal = async (id, updates) => {
    try {
      if (isOffline) {
        // Update in IndexedDB and queue for sync
        const updated = await livestockQueries.updateAnimal(id, updates);

        addToQueue({
          entity: 'livestock',
          action: 'update',
          data: { id, ...updates }
        });

        setLivestock(prev => prev.map(a => a.id === id ? updated : a));
        return { success: true, data: updated };
      } else {
        // Update via API
        const response = await api.put(`/livestock/${id}`, updates);
        setLivestock(prev => prev.map(a => a.id === id ? response.data : a));
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error('Failed to update animal:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteAnimal = async (id) => {
    try {
      if (isOffline) {
        // Mark as deleted in IndexedDB and queue for sync
        await livestockQueries.updateAnimal(id, { isActive: false });

        addToQueue({
          entity: 'livestock',
          action: 'delete',
          data: { id }
        });

        setLivestock(prev => prev.filter(a => a.id !== id));
        return { success: true };
      } else {
        // Delete via API
        await api.delete(`/livestock/${id}`);
        setLivestock(prev => prev.filter(a => a.id !== id));
        return { success: true };
      }
    } catch (err) {
      console.error('Failed to delete animal:', err);
      return { success: false, error: err.message };
    }
  };

  const addHealthRecord = async (livestockId, recordData) => {
    try {
      if (isOffline) {
        // Save to IndexedDB and queue for sync
        const newRecord = await livestockQueries.addHealthRecord({
          ...recordData,
          livestockId,
          offlineId: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        });

        addToQueue({
          entity: 'healthRecords',
          action: 'create',
          data: newRecord
        });

        return { success: true, data: newRecord };
      } else {
        // Save via API
        const response = await api.post(`/livestock/${livestockId}/health-records`, recordData);
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error('Failed to add health record:', err);
      return { success: false, error: err.message };
    }
  };

  const getAnimal = async (id) => {
    try {
      if (isOffline) {
        return await livestockQueries.getAnimalById(id);
      } else {
        const response = await api.get(`/livestock/${id}`);
        return response.data;
      }
    } catch (err) {
      console.error('Failed to get animal:', err);
      return null;
    }
  };

  const getHealthRecords = async (livestockId) => {
    try {
      if (isOffline) {
        return await livestockQueries.getAnimalHealthRecords(livestockId);
      } else {
        const response = await api.get(`/livestock/${livestockId}/health-records`);
        return response.data;
      }
    } catch (err) {
      console.error('Failed to get health records:', err);
      return [];
    }
  };

  const searchLivestock = async (query) => {
    try {
      if (isOffline) {
        // Simple local search
        const all = await livestockQueries.getFarmerAnimals(farmerId);
        return all.filter(a => 
          a.baitsTagNumber?.toLowerCase().includes(query.toLowerCase()) ||
          a.name?.toLowerCase().includes(query.toLowerCase()) ||
          a.breed?.toLowerCase().includes(query.toLowerCase())
        );
      } else {
        const response = await api.get('/livestock/search', { params: { q: query } });
        return response.data;
      }
    } catch (err) {
      console.error('Failed to search livestock:', err);
      return [];
    }
  };

  return {
    livestock,
    loading,
    error,
    addAnimal,
    updateAnimal,
    deleteAnimal,
    addHealthRecord,
    getAnimal,
    getHealthRecords,
    searchLivestock,
    refresh: loadLivestock,
  };
};