// db/knowledgeBaseQueries.js
import { getDB } from './indexedDB';
import { comprehensiveDiseaseData } from './diseaseDataComprehensive';
import { recognizeDiseaseFromImageBase64, recognizeDiseaseFromVideoFile } from '../ai/aiService';

export const knowledgeBaseQueries = {
  // Initialize knowledge base with default data
  initializeKnowledgeBase: async () => {
    const db = await getDB();
    
    // Check if already initialized
    const existingCount = await db.count('knowledgeBase');
    if (existingCount > 0) return;
    
    const defaultArticles = comprehensiveDiseaseData;
    
    // Transaction to store all articles
    const tx = db.transaction('knowledgeBase', 'readwrite');
    for (const article of defaultArticles) {
      await tx.store.put(article);
    }
    await tx.done;
  },

  // Get all articles
  getAllArticles: async () => {
    const db = await getDB();
    return await db.getAll('knowledgeBase');
  },

  // Get article by ID
  getArticleById: async (id) => {
    const db = await getDB();
    return await db.get('knowledgeBase', id);
  },

  // Get article by disease code
  getArticleByDiseaseCode: async (diseaseCode) => {
    const db = await getDB();
    const allArticles = await db.getAll('knowledgeBase');
    return allArticles.find(article => article.diseaseCode === diseaseCode);
  },

  // Search articles by text
  searchArticles: async (searchText, species = null) => {
    const db = await getDB();
    const allArticles = await db.getAll('knowledgeBase');
    
    if (!searchText) {
      return species ? allArticles.filter(a => a.species === 'all' || a.species === species) : allArticles;
    }

    const lowerText = searchText.toLowerCase();
    return allArticles.filter(article => {
      const matchesSpecies = !species || article.species === 'all' || article.species === species;
      const matchesTitle = article.titleEn.toLowerCase().includes(lowerText) || article.titleTn.toLowerCase().includes(lowerText);
      const matchesContent = article.contentEn.toLowerCase().includes(lowerText) || article.contentTn.toLowerCase().includes(lowerText);
      const matchesTags = article.tags.some(tag => tag.toLowerCase().includes(lowerText));
      
      return matchesSpecies && (matchesTitle || matchesContent || matchesTags);
    });
  },

  // Search articles by symptoms
  searchBySymptoms: async (symptoms, species = null) => {
    const db = await getDB();
    const allArticles = await db.getAll('knowledgeBase');
    
    const results = allArticles.map(article => {
      const matchedSymptoms = symptoms.filter(symptom => {
        const lowerSymptom = symptom.toLowerCase();
        
        // 1. Check direct symptoms array
        const inSymptoms = article.symptoms.some(articleSymptom =>
          articleSymptom.toLowerCase().includes(lowerSymptom) ||
          lowerSymptom.includes(articleSymptom.toLowerCase())
        );
        
        // 2. Check title, description, and tags (broad search for custom text input)
        const inTitle = article.titleEn.toLowerCase().includes(lowerSymptom) || 
                        (article.titleTn && article.titleTn.toLowerCase().includes(lowerSymptom));
        
        const inContent = article.contentEn.toLowerCase().includes(lowerSymptom) || 
                          (article.contentTn && article.contentTn.toLowerCase().includes(lowerSymptom));
                          
        const inTags = article.tags && article.tags.some(tag => tag.toLowerCase().includes(lowerSymptom));
        
        return inSymptoms || inTitle || inContent || inTags;
      });
      
      return {
        article,
        matchedCount: matchedSymptoms.length,
        matchedSymptoms,
        confidence: Math.min(1, matchedSymptoms.length / Math.max(1, symptoms.length))
      };
    }).filter(result => result.matchedCount > 0 && (!species || result.article.species === 'all' || result.article.species === species));
    
    return results.sort((a, b) => b.matchedCount - a.matchedCount);
  },

  // Save article (create or update)
  saveArticle: async (article) => {
    const db = await getDB();
    
    // Auto-generate ID if not provided
    if (!article.id) {
      article.id = `${article.diseaseCode}-${Date.now()}`;
    }
    
    article.updatedAt = new Date().toISOString();
    if (!article.createdAt) {
      article.createdAt = new Date().toISOString();
    }
    
    // Store in knowledgeBase
    await db.put('knowledgeBase', article);
    
    // Add to sync queue for offline changes
    const syncItem = {
      id: `sync-${Date.now()}`,
      type: 'put',
      store: 'knowledgeBase',
      data: article,
      timestamp: new Date().toISOString(),
      synced: false
    };
    
    await db.put('syncQueue', syncItem);
    
    return article;
  },

  // Delete article
  deleteArticle: async (id) => {
    const db = await getDB();
    
    // Delete from knowledgeBase
    await db.delete('knowledgeBase', id);
    
    // Add to sync queue for offline changes
    const syncItem = {
      id: `sync-${Date.now()}`,
      type: 'delete',
      store: 'knowledgeBase',
      id,
      timestamp: new Date().toISOString(),
      synced: false
    };
    
    await db.put('syncQueue', syncItem);
  },

  // Image recognition using AI service
  recognizeDiseaseFromImage: async (imageBase64) => {
    try {
      const results = await recognizeDiseaseFromImageBase64(imageBase64);
      return results.map(result => ({
        diseaseCode: result.diseaseCode,
        confidence: result.confidence,
        matchedSymptoms: result.label ? [result.label] : [],
        note: result.note,
        source: result.source
      }));
    } catch (error) {
      console.warn('Image recognition failed, using fallback', error);
      // Fallback mock results
      return [
        {
          diseaseCode: 'FMD',
          confidence: 0.92,
          matchedSymptoms: ['mouth lesions', 'salivation'],
          note: 'Fallback result - AI model unavailable',
          source: 'fallback'
        },
        {
          diseaseCode: 'LSD',
          confidence: 0.78,
          matchedSymptoms: ['skin nodules'],
          note: 'Fallback result - AI model unavailable',
          source: 'fallback'
        }
      ];
    }
  },

  // Unified Multi-Modal Search
  unifiedSearch: async (inputs) => {
    try {
      const { unifiedSearch: aiUnifiedSearch } = await import('../ai/aiService');
      return await aiUnifiedSearch(inputs);
    } catch (error) {
      console.error('Unified search failed', error);
      return [];
    }
  },

  // Video recognition using AI service
  recognizeDiseaseFromVideo: async (videoFile) => {
    try {
      const results = await recognizeDiseaseFromVideoFile(videoFile);
      return results.map(result => ({
        diseaseCode: result.diseaseCode,
        confidence: result.confidence,
        matchedSymptoms: result.label ? [result.label] : [],
        note: result.note,
        source: result.source
      }));
    } catch (error) {
      console.warn('Video recognition failed, using fallback', error);
      return [
        {
          diseaseCode: 'FMD',
          confidence: 0.75,
          matchedSymptoms: ['animal imagery detected'],
          note: 'Fallback result - AI model unavailable',
          source: 'fallback'
        }
      ];
    }
  },

  // Get general prevention guidelines
  getPreventionGuidelines: async () => {
    const db = await getDB();
    return await db.get('knowledgeBase', 'PREVENTION-001');
  },

  // Get general management guidelines
  getManagementGuidelines: async () => {
    const db = await getDB();
    return await db.get('knowledgeBase', 'MANAGEMENT-001');
  },

  // Get count of articles
  getArticleCount: async () => {
    const db = await getDB();
    return await db.count('knowledgeBase');
  },

  // Get current system status (e.g. AI Ingestion progress)
  getSystemStatus: async (id = 'ai-ingestion') => {
    const db = await getDB();
    return await db.get('systemStatus', id);
  },

  // Update system status
  updateSystemStatus: async (status) => {
    const db = await getDB();
    if (!status.id) status.id = 'ai-ingestion';
    status.updatedAt = new Date().toISOString();
    return await db.put('systemStatus', status);
  }
};