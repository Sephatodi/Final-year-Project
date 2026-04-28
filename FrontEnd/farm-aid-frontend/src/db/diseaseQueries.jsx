import { getDB } from './indexedDB';
import { validateData } from './schema';

export const diseaseQueries = {
  // Save disease report (offline first)
  saveDiseaseReport: async (reportData) => {
    const validation = validateData('diseaseReports', reportData);
    if (!validation.valid) {
      throw new Error(`Invalid report data: ${validation.errors.join(', ')}`);
    }

    const db = await getDB();
    const report = {
      ...reportData,
      status: reportData.status || 'pending',
      synced: false,
      createdAt: reportData.createdAt || new Date().toISOString(),
      reportNumber: reportData.reportNumber || `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    };
    
    const id = await db.add('diseaseReports', report);
    return { ...report, id };
  },

  // Get all reports for a farmer
  getFarmerReports: async (farmerId, includeSynced = true) => {
    const db = await getDB();
    const tx = db.transaction('diseaseReports', 'readonly');
    const store = tx.objectStore('diseaseReports');
    const reports = await store.getAll();
    
    let filtered = reports.filter(r => r.farmerId === farmerId);
    
    if (!includeSynced) {
      filtered = filtered.filter(r => !r.synced);
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Get report by ID
  getReportById: async (id) => {
    const db = await getDB();
    return await db.get('diseaseReports', id);
  },

  // Get report by report number
  getReportByNumber: async (reportNumber) => {
    const db = await getDB();
    const tx = db.transaction('diseaseReports', 'readonly');
    const store = tx.objectStore('diseaseReports');
    const index = store.index('reportNumber');
    return await index.get(reportNumber);
  },

  // Update report
  updateReport: async (id, updates) => {
    const db = await getDB();
    const report = await db.get('diseaseReports', id);
    
    if (!report) {
      throw new Error('Report not found');
    }

    const updatedReport = {
      ...report,
      ...updates,
      updatedAt: new Date().toISOString(),
      synced: false,
    };

    const validation = validateData('diseaseReports', updatedReport);
    if (!validation.valid) {
      throw new Error(`Invalid report data: ${validation.errors.join(', ')}`);
    }

    await db.put('diseaseReports', updatedReport);
    return updatedReport;
  },

  // Mark report as synced
  markReportSynced: async (id, serverId) => {
    const db = await getDB();
    const report = await db.get('diseaseReports', id);
    
    if (!report) {
      throw new Error('Report not found');
    }

    const updatedReport = {
      ...report,
      synced: true,
      syncedAt: new Date().toISOString(),
      serverId,
    };

    await db.put('diseaseReports', updatedReport);
    return updatedReport;
  },

  // Get pending sync reports
  getPendingSyncReports: async () => {
    const db = await getDB();
    const tx = db.transaction('diseaseReports', 'readonly');
    const store = tx.objectStore('diseaseReports');
    const reports = await store.getAll();
    
    return reports.filter(r => !r.synced);
  },

  // Get reports by status
  getReportsByStatus: async (status) => {
    const db = await getDB();
    const tx = db.transaction('diseaseReports', 'readonly');
    const store = tx.objectStore('diseaseReports');
    const reports = await store.getAll();
    
    return reports.filter(r => r.status === status)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Get reports by priority
  getReportsByPriority: async (priority) => {
    const db = await getDB();
    const tx = db.transaction('diseaseReports', 'readonly');
    const store = tx.objectStore('diseaseReports');
    const index = store.index('priority');
    return await index.getAll(priority);
  },

  // Get recent reports
  getRecentReports: async (days = 30) => {
    const db = await getDB();
    const tx = db.transaction('diseaseReports', 'readonly');
    const store = tx.objectStore('diseaseReports');
    const reports = await store.getAll();
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return reports
      .filter(r => new Date(r.createdAt) >= cutoffDate)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Get reports in area (by location string, simple contains search)
  getReportsInArea: async (area) => {
    const db = await getDB();
    const tx = db.transaction('diseaseReports', 'readonly');
    const store = tx.objectStore('diseaseReports');
    const reports = await store.getAll();
    
    const lowerArea = area.toLowerCase();
    return reports.filter(r => 
      r.location?.toLowerCase().includes(lowerArea)
    );
  },

  // AI Symptom Checker (mock AI results)
  checkSymptoms: async (species, symptoms, photos = []) => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check for FMD symptoms
    const hasLameness = symptoms.includes('lameness');
    const hasSalivation = symptoms.includes('salivation');
    const hasBlisters = symptoms.includes('blisters');
    
    if ((hasLameness && hasSalivation) || (hasLameness && hasBlisters) || (hasSalivation && hasBlisters)) {
      return {
        possibleDiseases: [
          {
            name: 'Foot and Mouth Disease',
            confidence: 0.92,
            priority: 'critical',
            symptoms: ['lameness', 'salivation', 'blisters'],
            notifiable: true,
          },
          {
            name: 'Lumpy Skin Disease',
            confidence: 0.45,
            priority: 'high',
            symptoms: ['skin lesions', 'fever'],
            notifiable: true,
          },
        ],
        recommendations: [
          'IMMEDIATE ACTION: Isolate affected animals',
          'Report to Department of Veterinary Services immediately',
          'Do not move animals',
          'Disinfect all equipment and footwear',
        ],
        notifiable: true,
      };
    }
    
    if (hasLameness) {
      return {
        possibleDiseases: [
          {
            name: 'Foot Rot',
            confidence: 0.78,
            priority: 'medium',
            symptoms: ['lameness', 'swollen foot'],
            notifiable: false,
          },
          {
            name: 'Digital Dermatitis',
            confidence: 0.65,
            priority: 'medium',
            symptoms: ['lameness', 'skin lesions between claws'],
            notifiable: false,
          },
        ],
        recommendations: [
          'Clean affected feet',
          'Apply topical antibiotic',
          'Keep animals in dry area',
        ],
        notifiable: false,
      };
    }
    
    return {
      possibleDiseases: [
        {
          name: 'No clear match',
          confidence: 0,
          priority: 'low',
          symptoms: [],
          notifiable: false,
        },
      ],
      recommendations: [
        'Monitor animal closely',
        'Consult with veterinarian if symptoms persist',
      ],
      notifiable: false,
    };
  },

  // Get report statistics
  getStats: async (farmerId) => {
    const reports = await diseaseQueries.getFarmerReports(farmerId);
    
    return {
      total: reports.length,
      byStatus: {
        pending: reports.filter(r => r.status === 'pending').length,
        submitted: reports.filter(r => r.status === 'submitted').length,
        investigating: reports.filter(r => r.status === 'investigating').length,
        resolved: reports.filter(r => r.status === 'resolved').length,
      },
      byPriority: {
        low: reports.filter(r => r.priority === 'low').length,
        medium: reports.filter(r => r.priority === 'medium').length,
        high: reports.filter(r => r.priority === 'high').length,
        critical: reports.filter(r => r.priority === 'critical').length,
      },
      bySpecies: {
        cattle: reports.filter(r => r.species === 'cattle').length,
        goat: reports.filter(r => r.species === 'goat').length,
        sheep: reports.filter(r => r.species === 'sheep').length,
        mixed: reports.filter(r => r.species === 'mixed').length,
      },
    };
  },
};