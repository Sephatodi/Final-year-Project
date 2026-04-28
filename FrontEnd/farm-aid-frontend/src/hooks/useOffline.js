import { useEffect, useState } from 'react';

export const useOffline = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastOnline, setLastOnline] = useState(null);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [networkType, setNetworkType] = useState(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setLastOnline(new Date());
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    const handleConnectionChange = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection;
        setNetworkType(connection.effectiveType);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', handleConnectionChange);
      handleConnectionChange();
    }

    // Load offline queue from localStorage
    const savedQueue = localStorage.getItem('offlineQueue');
    if (savedQueue) {
      setOfflineQueue(JSON.parse(savedQueue));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  const addToQueue = (action) => {
    const newQueue = [...offlineQueue, { ...action, id: Date.now(), timestamp: new Date().toISOString() }];
    setOfflineQueue(newQueue);
    localStorage.setItem('offlineQueue', JSON.stringify(newQueue));
  };

  const removeFromQueue = (id) => {
    const newQueue = offlineQueue.filter(item => item.id !== id);
    setOfflineQueue(newQueue);
    localStorage.setItem('offlineQueue', JSON.stringify(newQueue));
  };

  const clearQueue = () => {
    setOfflineQueue([]);
    localStorage.removeItem('offlineQueue');
  };

  const processQueue = async (processor) => {
    for (const item of offlineQueue) {
      try {
        await processor(item);
        removeFromQueue(item.id);
      } catch (error) {
        console.error('Failed to process queue item:', error);
      }
    }
  };

  const getNetworkStrength = () => {
    if (!navigator.onLine) return 0;
    if ('connection' in navigator) {
      const connection = navigator.connection;
      switch (connection.effectiveType) {
        case 'slow-2g':
          return 1;
        case '2g':
          return 2;
        case '3g':
          return 3;
        case '4g':
          return 4;
        default:
          return 3;
      }
    }
    return 3;
  };

  return {
    useOffline,
    isOffline,
    lastOnline,
    offlineQueue,
    networkType,
    addToQueue,
    removeFromQueue,
    clearQueue,
    processQueue,
    getNetworkStrength,
    queueSize: offlineQueue.length,
  };
};