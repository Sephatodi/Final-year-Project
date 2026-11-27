import { knowledgeQueries } from './knowledgeQueries';
import aiService from '../services/aiService';
import KB_ARTICLES from '../constants/offlineKnowledgeBase';

export const knowledgeBaseQueries = {
  ...knowledgeQueries,

  initializeKnowledgeBase: async () => {
    // Seed the offline knowledge base with the bundled bilingual articles if
    // the local store is empty. This makes the Knowledge Base available fully
    // offline, as required by the specification.
    try {
      const existing = await knowledgeQueries.getAllArticles();
      if (existing && existing.length > 0) {
        // Top up any newly-added articles without duplicating existing ones.
        const ids = new Set(existing.map((a) => a.id));
        const toAdd = KB_ARTICLES.filter((a) => !ids.has(a.id));
        if (toAdd.length > 0) {
          await knowledgeQueries.saveArticles(toAdd);
        }
        return true;
      }
      await knowledgeQueries.saveArticles(KB_ARTICLES);
      return true;
    } catch (error) {
      console.error('Failed to initialize knowledge base:', error);
      return false;
    }
  },

  getSystemStatus: async () => {
    // Mock system status for AI ingestion
    return {
      status: 'idle',
      current: 0,
      total: 100,
      message: 'System ready'
    };
  },

  recognizeDiseaseFromImage: async (imageBase64) => {
    // In a real app, this would send to a server or call a local TFJS model
    // For now, we'll simulate a scan
    console.log('Analyzing image...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock results
    return [
      { diseaseCode: 'FMD', confidence: 0.85 },
      { diseaseCode: 'LSD', confidence: 0.15 }
    ];
  },

  recognizeDiseaseFromVideo: async (videoFile) => {
    console.log('Analyzing video...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return [
      { diseaseCode: 'FMD', confidence: 0.72 }
    ];
  },

  unifiedSearch: async (inputs) => {
    const { text, symptoms, image, species } = inputs;
    
    // Combine various search strategies
    let results = await knowledgeQueries.searchArticles(text || symptoms.join(' ') || '');
    
    if (species && species !== 'all') {
      results = results.filter(a => a.species === 'all' || a.species === species);
    }
    
    return results.map(a => ({
      ...a,
      confidence: 0.9, // Mock confidence
      matchSources: { keyword: 0.8, visual: 0.2 }
    }));
  }
};
