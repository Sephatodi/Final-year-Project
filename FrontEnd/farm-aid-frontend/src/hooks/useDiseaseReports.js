import { useEffect, useState } from 'react';
import { diseaseQueries } from '../db/diseaseQueries';
import api from '../services/api';
import { useOffline } from './useOffline';

export const useDiseaseReports = (farmerId) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOffline, addToQueue } = useOffline();

  useEffect(() => {
    loadReports();
  }, [farmerId]);

  const loadReports = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isOffline) {
        const data = await diseaseQueries.getFarmerReports(farmerId);
        setReports(data);
      } else {
        const response = await api.get('/disease-reports');
        setReports(response.data);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitReport = async (reportData) => {
    try {
      const report = {
        ...reportData,
        farmerId,
        status: isOffline ? 'pending' : 'submitted',
        submittedAt: new Date().toISOString()
      };

      if (isOffline) {
        // Save locally and queue for sync
        const saved = await diseaseQueries.saveDiseaseReport(report);
        setReports(prev => [saved, ...prev]);
        return { success: true, data: saved };
      } else {
        // Submit to API
        const response = await api.post('/disease-reports', report);
        setReports(prev => [response.data, ...prev]);
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error('Failed to submit report:', err);
      return { success: false, error: err.message };
    }
  };

  const updateReportStatus = async (reportId, status, response) => {
    try {
      if (isOffline) {
        // Queue for sync when online
        addToQueue({
          entity: 'diseaseReports',
          action: 'update',
          data: { id: reportId, status, response }
        });

        // Update local state
        setReports(prev => prev.map(r => 
          r.id === reportId ? { ...r, status, response } : r
        ));
        return { success: true };
      } else {
        const apiResponse = await api.patch(`/disease-reports/${reportId}/status`, { status, response });
        setReports(prev => prev.map(r => 
          r.id === reportId ? apiResponse.data : r
        ));
        return { success: true };
      }
    } catch (err) {
      console.error('Failed to update report status:', err);
      return { success: false, error: err.message };
    }
  };

  const checkSymptoms = async (species, symptoms, photos) => {
    try {
      if (isOffline) {
        // Use local AI model
        const results = await diseaseQueries.checkSymptoms(species, symptoms, photos);
        return results;
      } else {
        // Use cloud AI
        const response = await api.post('/ai/symptom-check', { species, symptoms, photos });
        return response.data;
      }
    } catch (err) {
      console.error('Failed to check symptoms:', err);
      throw err;
    }
  };

  const getReport = async (reportId) => {
    try {
      if (isOffline) {
        return reports.find(r => r.id === reportId);
      } else {
        const response = await api.get(`/disease-reports/${reportId}`);
        return response.data;
      }
    } catch (err) {
      console.error('Failed to get report:', err);
      return null;
    }
  };

  const getReportsByStatus = (status) => {
    return reports.filter(r => r.status === status);
  };

  const getPendingSync = async () => {
    return await diseaseQueries.getPendingSyncReports();
  };

  const getStatistics = () => {
    return {
      total: reports.length,
      pending: reports.filter(r => r.status === 'pending').length,
      submitted: reports.filter(r => r.status === 'submitted').length,
      investigating: reports.filter(r => r.status === 'investigating').length,
      resolved: reports.filter(r => r.status === 'resolved').length,
      critical: reports.filter(r => r.priority === 'critical').length,
    };
  };

  return {
    reports,
    loading,
    error,
    submitReport,
    updateReportStatus,
    checkSymptoms,
    getReport,
    getReportsByStatus,
    getPendingSync,
    getStatistics,
    refresh: loadReports,
  };
};