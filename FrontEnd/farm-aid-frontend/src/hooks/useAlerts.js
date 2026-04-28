import { useEffect, useState } from 'react';
import { getDB } from '../db';
import api from '../services/api';
import { useOffline } from './useOffline';

export const useAlerts = (userId) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOffline } = useOffline();

  useEffect(() => {
    loadAlerts();

    // Set up polling for new alerts
    const interval = setInterval(loadAlerts, 60000); // Every minute

    return () => clearInterval(interval);
  }, [userId, isOffline]);

  const loadAlerts = async () => {
    try {
      if (isOffline) {
        // Load from IndexedDB
        const db = await getDB();
        const tx = db.transaction('alerts', 'readonly');
        const store = tx.objectStore('alerts');
        const data = await store.getAll();
        setAlerts(data.filter(a => !a.expiresAt || new Date(a.expiresAt) > new Date()));
      } else {
        // Load from API
        const response = await api.get('/alerts/active');
        setAlerts(response.data);

        // Cache in IndexedDB
        const db = await getDB();
        const tx = db.transaction('alerts', 'readwrite');
        const store = tx.objectStore('alerts');
        await store.clear();
        for (const alert of response.data) {
          await store.put(alert);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to load alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const dismissAlert = async (alertId) => {
    try {
      if (isOffline) {
        // Mark as dismissed locally
        setAlerts(prev => prev.filter(a => a.id !== alertId));

        const db = await getDB();
        const tx = db.transaction('alerts', 'readwrite');
        await tx.store.delete(alertId);
      } else {
        await api.post(`/alerts/${alertId}/dismiss`);
        setAlerts(prev => prev.filter(a => a.id !== alertId));
      }
    } catch (err) {
      console.error('Failed to dismiss alert:', err);
    }
  };

  const markAsRead = async (alertId) => {
    try {
      setAlerts(prev => prev.map(a => 
        a.id === alertId ? { ...a, read: true } : a
      ));

      if (!isOffline) {
        await api.post(`/alerts/${alertId}/read`);
      }
    } catch (err) {
      console.error('Failed to mark alert as read:', err);
    }
  };

  const getCriticalAlerts = () => {
    return alerts.filter(a => a.severity === 'critical' && !a.read);
  };

  const getAlertsByType = (type) => {
    return alerts.filter(a => a.type === type);
  };

  const getAlertsBySeverity = (severity) => {
    return alerts.filter(a => a.severity === severity);
  };

  const getUnreadCount = () => {
    return alerts.filter(a => !a.read).length;
  };

  return {
    alerts,
    loading,
    error,
    dismissAlert,
    markAsRead,
    getCriticalAlerts,
    getAlertsByType,
    getAlertsBySeverity,
    getUnreadCount,
    refresh: loadAlerts,
  };
};