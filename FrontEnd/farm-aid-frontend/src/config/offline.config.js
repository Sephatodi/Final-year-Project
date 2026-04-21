// Offline configuration
export const offlineConfig = {
  // Enable offline mode
  enabled: process.env.REACT_APP_OFFLINE_ENABLED !== 'false',
  
  // Database configuration
  database: {
    name: 'farm-aid-db',
    version: 3,
    stores: [
      'livestock',
      'healthRecords',
      'diseaseReports',
      'consultations',
      'messages',
      'knowledgeBase',
      'alerts',
      'marketPrices',
      'settings',
      'syncQueue',
      'conflicts',
      'syncLogs',
      'offlineActions',
    ],
    backupInterval: 86400000, // 24 hours
    maxBackups: 5,
  },

  // Sync configuration
  sync: {
    autoSync: true,
    syncInterval: 30000, // 30 seconds
    syncOnReconnect: true,
    syncOnStartup: true,
    backgroundSync: true,
    maxConcurrentSyncs: 3,
    retryAttempts: 3,
    retryDelay: 5000, // 5 seconds
    conflictStrategy: 'server-wins', // 'server-wins', 'client-wins', 'manual'
    
    // Entities to sync
    entities: {
      livestock: true,
      healthRecords: true,
      diseaseReports: true,
      consultations: true,
      messages: true,
      knowledgeBase: true,
      alerts: true,
      marketPrices: true,
      settings: false,
    },

    // Sync priority (lower number = higher priority)
    priority: {
      diseaseReports: 1,
      consultations: 2,
      messages: 2,
      livestock: 3,
      healthRecords: 3,
      knowledgeBase: 4,
      alerts: 4,
      marketPrices: 5,
    },
  },

  // Queue configuration
  queue: {
    maxSize: 1000,
    maxRetries: 5,
    retryDelay: 1000, // 1 second
    persistence: true,
    processOnReconnect: true,
    clearOnSuccess: true,
  },

  // Cache configuration
  cache: {
    enabled: true,
    maxAge: 86400000, // 24 hours
    maxSize: 50 * 1024 * 1024, // 50MB
    strategies: {
      knowledgeBase: 'stale-while-revalidate',
      marketPrices: 'stale-while-revalidate',
      alerts: 'network-first',
      userProfile: 'cache-first',
    },
    preload: {
      knowledgeBase: true,
      marketPrices: true,
      alerts: true,
    },
  },

  // Storage configuration
  storage: {
    type: 'indexeddb', // 'indexeddb', 'websql', 'localstorage'
    quota: 100 * 1024 * 1024, // 100MB
    compression: true,
    encryption: false,
    migration: {
      enabled: true,
      onVersionChange: 'migrate', // 'migrate', 'reset', 'ignore'
    },
  },

  // Network detection
  network: {
    checkInterval: 10000, // 10 seconds
    timeout: 5000, // 5 seconds
    endpoints: [
      'https://www.google.com/favicon.ico',
      'https://www.cloudflare.com/favicon.ico',
    ],
    simulateOffline: process.env.NODE_ENV === 'development' && false,
  },

  // Offline actions
  actions: {
    queueWhenOffline: true,
    showNotification: true,
    notificationMessage: 'Action saved offline. Will sync when online.',
    confirmBeforeAction: false,
    allowedActions: [
      'create',
      'update',
      'delete',
    ],
    blockedActions: [
      'login',
      'register',
      'refresh',
    ],
  },

  // Conflict resolution
  conflict: {
    strategy: 'timestamp', // 'timestamp', 'version', 'manual'
    resolveAutomatically: true,
    notifyOnConflict: true,
    storeConflicts: true,
    maxConflicts: 100,
  },

  // Data retention
  retention: {
    enabled: true,
    period: 90, // days
    cleanupInterval: 86400000, // 24 hours
    excludeFromCleanup: [
      'settings',
      'knowledgeBase',
    ],
  },

  // Debugging
  debug: {
    enabled: process.env.NODE_ENV === 'development',
    logSync: true,
    logQueue: true,
    logConflicts: true,
    logStorage: false,
  },

  // Service Worker
  serviceWorker: {
    enabled: true,
    scope: '/',
    updateInterval: 86400000, // 24 hours
    cacheName: 'farm-aid-v1',
    precache: [
      '/',
      '/index.html',
      '/static/js/main.js',
      '/static/css/main.css',
    ],
    runtimeCache: {
      images: {
        maxEntries: 50,
        maxAge: 30 * 86400000, // 30 days
      },
      api: {
        maxEntries: 100,
        maxAge: 3600000, // 1 hour
      },
    },
  },

  // Background sync
  backgroundSync: {
    enabled: true,
    tag: 'farm-aid-sync',
    minInterval: 0,
    maxRetentionTime: 24 * 60, // 24 hours in minutes
  },

  // Periodic sync
  periodicSync: {
    enabled: true,
    tag: 'farm-aid-periodic',
    minInterval: 12 * 60 * 60 * 1000, // 12 hours
  },
};

export default offlineConfig;