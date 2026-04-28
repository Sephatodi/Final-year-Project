// Sync configuration
export const syncConfig = {
  // Sync strategy
  strategy: {
    default: 'incremental', // 'full', 'incremental', 'differential'
    onReconnect: 'full',
    onStartup: 'incremental',
    onBackground: 'differential',
  },

  // Sync frequency
  frequency: {
    online: 30000, // 30 seconds
    offline: 0, // disabled
    background: 300000, // 5 minutes
    idle: 60000, // 1 minute
  },

  // Batch configuration
  batch: {
    enabled: true,
    size: 50,
    timeout: 5000, // 5 seconds
    parallel: 3,
  },

  // Delta sync
  delta: {
    enabled: true,
    since: 'timestamp', // 'timestamp', 'version', 'sequence'
    compress: true,
  },

  // Conflict resolution
  conflict: {
    strategy: 'timestamp', // 'timestamp', 'version', 'manual', 'server-wins', 'client-wins'
    field: 'updatedAt',
    resolveAutomatically: true,
    notifyOnConflict: true,
    storeConflicts: true,
    mergeStrategy: 'last-write-wins',
  },

  // Retry configuration
  retry: {
    maxAttempts: 5,
    backoff: 'exponential', // 'linear', 'exponential', 'fixed'
    baseDelay: 1000,
    maxDelay: 30000,
    jitter: true,
    retryOn: [
      'network-error',
      'timeout',
      'server-error',
    ],
  },

  // Timeouts
  timeout: {
    default: 30000, // 30 seconds
    full: 60000, // 60 seconds
    incremental: 30000, // 30 seconds
    differential: 15000, // 15 seconds
    batch: 60000, // 60 seconds
  },

  // Sync queue
  queue: {
    enabled: true,
    maxSize: 1000,
    persistence: true,
    priority: true,
    processInterval: 1000,
    maxConcurrent: 5,
  },

  // Sync history
  history: {
    enabled: true,
    maxEntries: 100,
    storeResults: true,
    storeErrors: true,
    retention: 30, // days
  },

  // Sync monitoring
  monitoring: {
    enabled: true,
    logLevel: 'info',
    metrics: true,
    alerts: true,
    threshold: {
      duration: 30000, // 30 seconds
      failures: 3,
    },
  },

  // Entities configuration
  entities: {
    livestock: {
      sync: true,
      strategy: 'incremental',
      fields: ['id', 'baitsTagNumber', 'name', 'species', 'breed', 'birthDate', 'gender', 'weight', 'healthStatus', 'location', 'updatedAt'],
      relations: ['healthRecords'],
      batchSize: 100,
    },
    healthRecords: {
      sync: true,
      strategy: 'incremental',
      fields: ['id', 'livestockId', 'type', 'date', 'diagnosis', 'treatment', 'medications', 'notes', 'updatedAt'],
      relations: [],
      batchSize: 200,
    },
    diseaseReports: {
      sync: true,
      strategy: 'incremental',
      fields: ['id', 'reportNumber', 'farmerId', 'location', 'species', 'animalCount', 'symptoms', 'description', 'suspectedDisease', 'status', 'priority', 'photos', 'updatedAt'],
      relations: [],
      batchSize: 50,
      priority: 1,
    },
    consultations: {
      sync: true,
      strategy: 'incremental',
      fields: ['id', 'farmerId', 'expertId', 'title', 'description', 'status', 'priority', 'aiSuggestion', 'updatedAt'],
      relations: ['messages'],
      batchSize: 50,
      priority: 2,
    },
    messages: {
      sync: true,
      strategy: 'incremental',
      fields: ['id', 'consultationId', 'senderId', 'content', 'messageType', 'mediaUrl', 'timestamp', 'status', 'updatedAt'],
      relations: [],
      batchSize: 500,
      priority: 2,
    },
    knowledgeBase: {
      sync: true,
      strategy: 'full',
      fields: ['id', 'titleEn', 'titleTn', 'contentEn', 'contentTn', 'category', 'species', 'notifiable', 'viewCount', 'updatedAt'],
      relations: [],
      batchSize: 50,
      ttl: 86400000, // 24 hours
    },
    alerts: {
      sync: true,
      strategy: 'incremental',
      fields: ['id', 'type', 'severity', 'titleEn', 'titleTn', 'contentEn', 'contentTn', 'zoneId', 'expiresAt', 'read', 'createdAt'],
      relations: [],
      batchSize: 100,
      ttl: 3600000, // 1 hour
    },
    marketPrices: {
      sync: true,
      strategy: 'incremental',
      fields: ['id', 'commodity', 'category', 'price', 'unit', 'location', 'date', 'trend'],
      relations: [],
      batchSize: 200,
      ttl: 3600000, // 1 hour
    },
    settings: {
      sync: false,
      strategy: 'none',
      fields: [],
      relations: [],
    },
  },

  // Compression
  compression: {
    enabled: true,
    algorithm: 'gzip', // 'gzip', 'deflate', 'none'
    threshold: 1024, // 1KB
    level: 6,
  },

  // Encryption
  encryption: {
    enabled: false,
    algorithm: 'AES-GCM',
    keyLength: 256,
  },

  // WebSocket sync
  websocket: {
    enabled: true,
    reconnect: true,
    syncOnConnect: true,
    realtime: true,
    events: {
      sync: 'sync',
      conflict: 'conflict',
      update: 'update',
      delete: 'delete',
    },
  },

  // Debugging
  debug: {
    enabled: process.env.NODE_ENV === 'development',
    logSync: true,
    logConflicts: true,
    logQueue: true,
    logPerformance: true,
    simulateSlowSync: false,
    simulateErrors: false,
  },
};

export default syncConfig;