import { useState, useEffect, useCallback } from 'react';
import { getAllDiseases, getDiseasesBySpecies, searchDiseasesBySymptom, getDiseaseStats } from '../db/diseases-db';
import { useOffline } from './useOffline';

export const useKnowledgeBase = () => {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const { isOffline } = useOffline();

  useEffect(() => {
    loadDiseases();
    loadStats();
  }, []);

  const loadDiseases = async () => {
    setLoading(true);
    try {
      const data = await getAllDiseases();
      setDiseases(data);
    } catch (error) {
      console.error('Failed to load diseases:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getDiseaseStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const searchBySpecies = useCallback(async (species) => {
    setLoading(true);
    try {
      const results = await getDiseasesBySpecies(species);
      setSearchResults(results);
      return results;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchBySymptom = useCallback(async (symptom) => {
    setLoading(true);
    try {
      const results = await searchDiseasesBySymptom(symptom);
      setSearchResults(results);
      return results;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDiseaseById = useCallback(async (id) => {
    const allDiseases = await getAllDiseases();
    return allDiseases.find(d => d._id === id);
  }, []);

  return {
    diseases,
    loading,
    stats,
    searchResults,
    searchBySpecies,
    searchBySymptom,
    getDiseaseById,
    refresh: loadDiseases,
    isOffline,
  };
};import { useState, useEffect, useCallback } from 'react';
import { getAllDiseases, getDiseasesBySpecies, searchDiseasesBySymptom, getDiseaseStats } from '../db/diseases-db';
import { useOffline } from './useOffline';

export const useKnowledgeBase = () => {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const { isOffline } = useOffline();

  useEffect(() => {
    loadDiseases();
    loadStats();
  }, []);

  const loadDiseases = async () => {
    setLoading(true);
    try {
      const data = await getAllDiseases();
      setDiseases(data);
    } catch (error) {
      console.error('Failed to load diseases:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getDiseaseStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const searchBySpecies = useCallback(async (species) => {
    setLoading(true);
    try {
      const results = await getDiseasesBySpecies(species);
      setSearchResults(results);
      return results;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchBySymptom = useCallback(async (symptom) => {
    setLoading(true);
    try {
      const results = await searchDiseasesBySymptom(symptom);
      setSearchResults(results);
      return results;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDiseaseById = useCallback(async (id) => {
    const allDiseases = await getAllDiseases();
    return allDiseases.find(d => d._id === id);
  }, []);

  return {
    diseases,
    loading,
    stats,
    searchResults,
    searchBySpecies,
    searchBySymptom,
    getDiseaseById,
    refresh: loadDiseases,
    isOffline,
  };
};