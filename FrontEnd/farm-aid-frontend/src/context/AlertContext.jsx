import { createContext, useCallback, useContext, useState } from 'react';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [toasts, setToasts] = useState([]);

  const addAlert = useCallback((alert) => {
    const newAlert = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...alert
    };
    
    setAlerts(prev => [newAlert, ...prev].slice(0, 100)); // Keep last 100 alerts
    
    // Also show as toast if it's critical
    if (alert.severity === 'critical') {
      addToast({
        type: alert.severity,
        title: alert.title,
        message: alert.message,
        duration: 0 // Don't auto-dismiss critical alerts
      });
    }
    
    return newAlert.id;
  }, []);

  const removeAlert = useCallback((alertId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  }, []);

  const markAsRead = useCallback((alertId) => {
    setAlerts(prev => prev.map(a =>
      a.id === alertId ? { ...a, read: true } : a
    ));
  }, []);

  const markAllAsRead = useCallback(() => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const addToast = useCallback((toast) => {
    const newToast = {
      id: Date.now(),
      duration: 5000,
      ...toast
    };
    
    setToasts(prev => [...prev, newToast]);
    
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(newToast.id);
      }, newToast.duration);
    }
    
    return newToast.id;
  }, []);

  const removeToast = useCallback((toastId) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const getUnreadCount = useCallback(() => {
    return alerts.filter(a => !a.read).length;
  }, [alerts]);

  const getCriticalAlerts = useCallback(() => {
    return alerts.filter(a => a.severity === 'critical' && !a.read);
  }, [alerts]);

  const getAlertsByType = useCallback((type) => {
    return alerts.filter(a => a.type === type);
  }, [alerts]);

  const getAlertsBySeverity = useCallback((severity) => {
    return alerts.filter(a => a.severity === severity);
  }, [alerts]);

  const value = {
    alerts,
    toasts,
    addAlert,
    removeAlert,
    markAsRead,
    markAllAsRead,
    clearAlerts,
    addToast,
    removeToast,
    clearToasts,
    getUnreadCount,
    getCriticalAlerts,
    getAlertsByType,
    getAlertsBySeverity,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ${
              toast.type === 'critical' ? 'bg-red-600 text-white' :
              toast.type === 'warning' ? 'bg-amber-500 text-white' :
              toast.type === 'success' ? 'bg-green-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold">{toast.title}</h4>
                <p className="text-sm mt-1">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 hover:opacity-80"
              >
                <span className="material-icons-outlined text-sm">close</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};