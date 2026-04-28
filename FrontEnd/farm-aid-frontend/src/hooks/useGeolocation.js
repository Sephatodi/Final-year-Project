import { useEffect, useState } from 'react';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    watch = false
  } = options;

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    let watchId;

    const success = (position) => {
      const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } = position.coords;
      
      setLocation({
        latitude,
        longitude,
        accuracy,
        altitude,
        altitudeAccuracy,
        heading,
        speed,
        timestamp: position.timestamp
      });
      
      setError(null);
      setLoading(false);
    };

    const failure = (error) => {
      let errorMessage;

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location permission denied';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information unavailable';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out';
          break;
        default:
          errorMessage = 'Unknown geolocation error';
      }

      setError(errorMessage);
      setLoading(false);
    };

    if (watch) {
      watchId = navigator.geolocation.watchPosition(success, failure, {
        enableHighAccuracy,
        timeout,
        maximumAge
      });
    } else {
      navigator.geolocation.getCurrentPosition(success, failure, {
        enableHighAccuracy,
        timeout,
        maximumAge
      });
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [enableHighAccuracy, timeout, maximumAge, watch]);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation not supported');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      // In production, use a geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      return data.display_name;
    } catch (err) {
      console.error('Failed to get address:', err);
      return null;
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value) => {
    return (value * Math.PI) / 180;
  };

  return {
    location,
    error,
    loading,
    getCurrentLocation,
    getAddressFromCoords,
    calculateDistance
  };
};