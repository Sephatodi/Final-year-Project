import { getDB } from './indexedDB';

export const knowledgeQueries = {
  // Save multiple articles (for caching)
  saveArticles: async (articles) => {
    const db = await getDB();
    const tx = db.transaction('knowledgeBase', 'readwrite');
    const store = tx.objectStore('knowledgeBase');
    
    for (const article of articles) {
      await store.put(article);
    }
    
    return articles.length;
  },

  // Get all articles
  getAllArticles: async () => {
    const db = await getDB();
    const tx = db.transaction('knowledgeBase', 'readonly');
    const store = tx.objectStore('knowledgeBase');
    return await store.getAll();
  },

  // Get article by ID
  getArticleById: async (id) => {
    const db = await getDB();
    return await db.get('knowledgeBase', id);
  },

  // Get article by disease code
  getArticleByDiseaseCode: async (diseaseCode) => {
    const db = await getDB();
    const tx = db.transaction('knowledgeBase', 'readonly');
    const store = tx.objectStore('knowledgeBase');
    const index = store.index('diseaseCode');
    return await index.get(diseaseCode);
  },

  // Get articles by category
  getArticlesByCategory: async (category) => {
    const db = await getDB();
    const tx = db.transaction('knowledgeBase', 'readonly');
    const store = tx.objectStore('knowledgeBase');
    const index = store.index('category');
    return await index.getAll(category);
  },

  // Get articles by species
  getArticlesBySpecies: async (species) => {
    const db = await getDB();
    const tx = db.transaction('knowledgeBase', 'readonly');
    const store = tx.objectStore('knowledgeBase');
    const index = store.index('species');
    return await index.getAll(species);
  },

  // Get notifiable diseases
  getNotifiableDiseases: async () => {
    const db = await getDB();
    const tx = db.transaction('knowledgeBase', 'readonly');
    const store = tx.objectStore('knowledgeBase');
    const index = store.index('notifiable');
    return await index.getAll(true);
  },

  // Search articles
  searchArticles: async (query, language = 'en') => {
    const db = await getDB();
    const tx = db.transaction('knowledgeBase', 'readonly');
    const store = tx.objectStore('knowledgeBase');
    const articles = await store.getAll();
    
    const lowerQuery = query.toLowerCase();
    
    return articles.filter(article => {
      const title = language === 'en' ? article.titleEn : article.titleTn;
      const content = language === 'en' ? article.contentEn : article.contentTn;
      
      return (
        title?.toLowerCase().includes(lowerQuery) ||
        content?.toLowerCase().includes(lowerQuery) ||
        article.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    });
  },

  // Get popular articles
  getPopularArticles: async (limit = 10) => {
    const db = await getDB();
    const tx = db.transaction('knowledgeBase', 'readonly');
    const store = tx.objectStore('knowledgeBase');
    const index = store.index('popularity');
    let articles = await index.getAll();
    
    return articles
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, limit);
  },

  // Get related articles
  getRelatedArticles: async (articleId, limit = 5) => {
    const article = await knowledgeQueries.getArticleById(articleId);
    if (!article) return [];

    const db = await getDB();
    const tx = db.transaction('knowledgeBase', 'readonly');
    const store = tx.objectStore('knowledgeBase');
    const articles = await store.getAll();
    
    // Find articles with same category or overlapping species
    return articles
      .filter(a => 
        a.id !== articleId && 
        (a.category === article.category || 
         a.species?.some(s => article.species?.includes(s)))
      )
      .slice(0, limit);
  },

  // Increment view count
  incrementViewCount: async (articleId) => {
    const db = await getDB();
    const article = await db.get('knowledgeBase', articleId);
    
    if (article) {
      article.viewCount = (article.viewCount || 0) + 1;
      await db.put('knowledgeBase', article);
    }
    
    return article;
  },

  // Clear cache
  clearCache: async () => {
    const db = await getDB();
    const tx = db.transaction('knowledgeBase', 'readwrite');
    await tx.objectStore('knowledgeBase').clear();
  },

  // Get cache info
  getCacheInfo: async () => {
    const db = await getDB();
    const tx = db.transaction('knowledgeBase', 'readonly');
    const store = tx.objectStore('knowledgeBase');
    const count = await store.count();
    const articles = await store.getAll();
    
    const totalSize = new Blob([JSON.stringify(articles)]).size;
    
    return {
      count,
      totalSize,
      lastUpdated: articles.length > 0 
        ? Math.max(...articles.map(a => new Date(a.updatedAt || 0))) 
        : null,
    };
  },

  // Get categories with counts
  getCategories: async () => {
    const articles = await knowledgeQueries.getAllArticles();
    const categories = {};
    
    articles.forEach(article => {
      if (article.category) {
        categories[article.category] = (categories[article.category] || 0) + 1;
      }
    });
    
    return Object.entries(categories).map(([name, count]) => ({
      id: name,
      name,
      count,
    }));
  },
};