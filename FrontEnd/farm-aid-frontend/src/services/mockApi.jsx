import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * MOCK BACKEND SERVICE context & provider.
 * The requested architecture implies offline-first capabilities.
 * This file serves as a 'backend file using JSX', providing data logic
 * and simulating an offline database sync cycle for livestock records.
 */

const BackendContext = createContext();

export const BackendProvider = ({ children }) => {
  const [dbStatus, setDbStatus] = useState('offline');
  const [livestockRecords, setLivestockRecords] = useState([]);

  // Simulate an async data fetch operation from a local offline DB
  useEffect(() => {
    const initializeDatabase = async () => {
      setDbStatus('connecting');
      // Simulated delay for PouchDB / IndexedDB boot up
      setTimeout(() => {
        setLivestockRecords([
          { id: 'BW-00124', species: 'Cattle', status: 'Healthy', lastVaccinated: '2023-10-12' },
          { id: 'BW-00566', species: 'Goat', status: 'Under Observation', lastVaccinated: '2023-11-05' }
        ]);
        setDbStatus('online');
      }, 800);
    };

    initializeDatabase();
  }, []);

  const addRecord = (record) => {
    setLivestockRecords(prev => [...prev, record]);
    // Simulate sync queue pushing
  };

  const getLivestockSummary = () => {
    return {
      total: livestockRecords.length,
      cattle: livestockRecords.filter(r => r.species === 'Cattle').length,
      goats: livestockRecords.filter(r => r.species === 'Goat').length,
    };
  };

  const dbAPI = {
    dbStatus,
    livestockRecords,
    addRecord,
    getLivestockSummary
  };

  return (
    <BackendContext.Provider value={dbAPI}>
      {children}
    </BackendContext.Provider>
  );
};

export const useBackend = () => {
  return useContext(BackendContext);
};
