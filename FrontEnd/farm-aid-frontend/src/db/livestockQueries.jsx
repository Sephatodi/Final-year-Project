import { getDB } from './indexedDB';
import { validateData } from './schema';

export const livestockQueries = {
  // Add a new animal
  addAnimal: async (animalData) => {
    const validation = validateData('livestock', animalData);
    if (!validation.valid) {
      throw new Error(`Invalid animal data: ${validation.errors.join(', ')}`);
    }

    const db = await getDB();
    const animal = {
      ...animalData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      healthStatus: animalData.healthStatus || 'healthy',
      synced: false,
    };
    
    const id = await db.add('livestock', animal);
    return { ...animal, id };
  },

  // Get all animals for a farmer
  getFarmerAnimals: async (farmerId, includeInactive = false) => {
    const db = await getDB();
    const tx = db.transaction('livestock', 'readonly');
    const store = tx.objectStore('livestock');
    const index = store.index('farmerId');
    let animals = await index.getAll(farmerId);
    
    if (!includeInactive) {
      animals = animals.filter(a => a.isActive !== false);
    }
    
    return animals.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  // Get animal by ID
  getAnimalById: async (id) => {
    const db = await getDB();
    return await db.get('livestock', id);
  },

  // Get animal by BAITS tag
  getAnimalByBaitsTag: async (baitsTag) => {
    const db = await getDB();
    const tx = db.transaction('livestock', 'readonly');
    const store = tx.objectStore('livestock');
    const index = store.index('baitsTag');
    return await index.get(baitsTag);
  },

  // Update animal
  updateAnimal: async (id, updates) => {
    const db = await getDB();
    const animal = await db.get('livestock', id);
    
    if (!animal) {
      throw new Error('Animal not found');
    }

    const updatedAnimal = {
      ...animal,
      ...updates,
      updatedAt: new Date().toISOString(),
      synced: false,
    };

    const validation = validateData('livestock', updatedAnimal);
    if (!validation.valid) {
      throw new Error(`Invalid animal data: ${validation.errors.join(', ')}`);
    }

    await db.put('livestock', updatedAnimal);
    return updatedAnimal;
  },

  // Delete animal (soft delete)
  deleteAnimal: async (id) => {
    const db = await getDB();
    const animal = await db.get('livestock', id);
    
    if (!animal) {
      throw new Error('Animal not found');
    }

    const updatedAnimal = {
      ...animal,
      isActive: false,
      updatedAt: new Date().toISOString(),
      synced: false,
    };

    await db.put('livestock', updatedAnimal);
    return { success: true };
  },

  // Add health record
  addHealthRecord: async (recordData) => {
    const validation = validateData('healthRecords', recordData);
    if (!validation.valid) {
      throw new Error(`Invalid health record: ${validation.errors.join(', ')}`);
    }

    const db = await getDB();
    const record = {
      ...recordData,
      createdAt: new Date().toISOString(),
      synced: false,
    };
    
    const id = await db.add('healthRecords', record);
    
    // Update animal's health status if needed
    if (recordData.diagnosis) {
      const animal = await db.get('livestock', recordData.livestockId);
      if (animal) {
        let healthStatus = 'sick';
        if (recordData.diagnosis.toLowerCase().includes('fmd')) {
          healthStatus = 'critical';
        }
        await livestockQueries.updateAnimal(animal.id, { healthStatus });
      }
    }
    
    return { ...record, id };
  },

  // Get health records for an animal
  getAnimalHealthRecords: async (livestockId, limit = 50) => {
    const db = await getDB();
    const tx = db.transaction('healthRecords', 'readonly');
    const store = tx.objectStore('healthRecords');
    const index = store.index('livestockId');
    let records = await index.getAll(livestockId);
    
    return records
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  },

  // Get recent health records
  getRecentHealthRecords: async (farmerId, days = 30) => {
    const db = await getDB();
    const animals = await livestockQueries.getFarmerAnimals(farmerId);
    const animalIds = animals.map(a => a.id);
    
    const tx = db.transaction('healthRecords', 'readonly');
    const store = tx.objectStore('healthRecords');
    const allRecords = await store.getAll();
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return allRecords
      .filter(r => animalIds.includes(r.livestockId) && new Date(r.date) >= cutoffDate)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // Get animals by health status
  getAnimalsByStatus: async (farmerId, status) => {
    const animals = await livestockQueries.getFarmerAnimals(farmerId);
    return animals.filter(a => a.healthStatus === status);
  },

  // Search animals
  searchAnimals: async (farmerId, query) => {
    const animals = await livestockQueries.getFarmerAnimals(farmerId);
    const lowerQuery = query.toLowerCase();
    
    return animals.filter(a => 
      a.baitsTagNumber?.toLowerCase().includes(lowerQuery) ||
      a.name?.toLowerCase().includes(lowerQuery) ||
      a.breed?.toLowerCase().includes(lowerQuery) ||
      a.species?.toLowerCase().includes(lowerQuery)
    );
  },

  // Get animal statistics
  getStats: async (farmerId) => {
    const animals = await livestockQueries.getFarmerAnimals(farmerId);
    
    return {
      total: animals.length,
      bySpecies: {
        cattle: animals.filter(a => a.species === 'cattle').length,
        goat: animals.filter(a => a.species === 'goat').length,
        sheep: animals.filter(a => a.species === 'sheep').length,
      },
      byHealth: {
        healthy: animals.filter(a => a.healthStatus === 'healthy').length,
        sick: animals.filter(a => a.healthStatus === 'sick').length,
        critical: animals.filter(a => a.healthStatus === 'critical').length,
        recovering: animals.filter(a => a.healthStatus === 'recovering').length,
      },
      byGender: {
        male: animals.filter(a => a.gender === 'male').length,
        female: animals.filter(a => a.gender === 'female').length,
      },
    };
  },
};