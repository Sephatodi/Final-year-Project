import { useEffect, useState } from 'react';

export const useNetworkStatus = () => {
  const [status, setStatus] = useState({
    online: navigator.onLine,
    type: null,
    downlink: null,
    rtt: null,
    saveData: false,
    effectiveType: null
  });

  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

      setStatus({
        online: navigator.onLine,
        type: connection?.type || 'unknown',
        downlink: connection?.downlink,
        rtt: connection?.rtt,
        saveData: connection?.saveData || false,
        effectiveType: connection?.effectiveType
      });
    };

    const handleOnline = () => {
      updateNetworkStatus();
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, online: false }));
    };

    const handleConnectionChange = () => {
      updateNetworkStatus();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
      updateNetworkStatus();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  const getNetworkQuality = () => {
    if (!status.online) return 'offline';

    if (status.effectiveType) {
      switch (status.effectiveType) {
        case 'slow-2g':
          return 'very-poor';
        case '2g':
          return 'poor';
        case '3g':
          return 'fair';
        case '4g':
          return 'good';
        default:
          return 'unknown';
      }
    }

    if (status.downlink) {
      if (status.downlink < 0.5) return 'very-poor';
      if (status.downlink < 1) return 'poor';
      if (status.downlink < 5) return 'fair';
      return 'good';
    }

    return 'unknown';
  };

  const isSlowConnection = () => {
    const quality = getNetworkQuality();
    return quality === 'very-poor' || quality === 'poor';
  };

  const shouldLoadHighResImages = () => {
    return !isSlowConnection() && status.saveData === false;
  };

  const getEstimatedSpeed = () => {
    if (status.downlink) {
      return `${status.downlink} Mbps`;
    }
    return 'Unknown';
  };

  return {
    ...status,
    getNetworkQuality,
    isSlowConnection,
    shouldLoadHighResImages,
    getEstimatedSpeed
  };
};