// API configuration
export const apiConfig = {
  // Base URLs
  baseUrl: import.meta.env.VITE_API_URL || 'https://backend-production-a7388.up.railway.app/api',
  socketUrl: import.meta.env.VITE_SOCKET_URL || 'https://backend-production-a7388.up.railway.app',
  
  // API version
  version: 'v1',
  
  // Endpoints
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      me: '/auth/me',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
      verifyOTP: '/auth/verify-otp',
      changePassword: '/auth/change-password',
      enable2FA: '/auth/2fa/enable',
      disable2FA: '/auth/2fa/disable',
      sessions: '/auth/sessions',
      biometric: '/auth/biometric-login',
      offline: '/auth/offline-login',
    },
    
    livestock: {
      base: '/livestock',
      byId: (id) => `/livestock/${id}`,
      healthRecords: (id) => `/livestock/${id}/health-records`,
      vaccinations: (id) => `/livestock/${id}/vaccinations`,
      weight: (id) => `/livestock/${id}/weight`,
      images: (id) => `/livestock/${id}/images`,
      search: '/livestock/search',
      stats: '/livestock/stats',
      sync: '/livestock/sync',
    },
    
    disease: {
      base: '/disease-reports',
      byId: (id) => `/disease-reports/${id}`,
      status: (id) => `/disease-reports/${id}/status`,
      assign: (id) => `/disease-reports/${id}/assign`,
      photos: (id) => `/disease-reports/${id}/photos`,
      nearby: '/disease-reports/nearby',
      stats: '/disease-reports/stats',
      sync: '/disease-reports/sync',
      zones: '/disease-zones',
      zoneById: (id) => `/disease-zones/${id}`,
    },
    
    consultations: {
      base: '/consultations',
      byId: (id) => `/consultations/${id}`,
      messages: (id) => `/consultations/${id}/messages`,
      read: (id) => `/consultations/${id}/read`,
      resolve: (id) => `/consultations/${id}/resolve`,
      rate: (id) => `/consultations/${id}/rate`,
      assign: (id) => `/consultations/${id}/assign`,
      video: {
        start: (id) => `/consultations/${id}/video/start`,
        end: (id) => `/consultations/${id}/video/end`,
      },
      experts: '/experts/available',
      expertById: (id) => `/experts/${id}`,
    },
    
    knowledge: {
      base: '/knowledge-base',
      byId: (id) => `/knowledge-base/${id}`,
      byDisease: (code) => `/knowledge-base/disease/${code}`,
      search: '/knowledge-base/search',
      related: (id) => `/knowledge-base/${id}/related`,
      view: (id) => `/knowledge-base/${id}/view`,
      categories: '/knowledge-base/categories',
      offline: '/knowledge-base/offline/bundle',
    },
    
    alerts: {
      base: '/alerts',
      active: '/alerts/active',
      byId: (id) => `/alerts/${id}`,
      dismiss: (id) => `/alerts/${id}/dismiss`,
      read: (id) => `/alerts/${id}/read`,
      readAll: '/alerts/mark-all-read',
      subscribe: (zoneId) => `/alerts/subscribe/${zoneId}`,
      unsubscribe: (zoneId) => `/alerts/unsubscribe/${zoneId}`,
      settings: '/users/notification-settings',
    },
    
    sync: {
      status: '/sync/status',
      history: '/sync/history',
      changes: '/sync/changes',
      push: '/sync/push',
      pull: '/sync/pull',
      all: '/sync/all',
      conflicts: '/sync/conflicts',
      resolve: (id) => `/sync/conflicts/${id}`,
    },
    
    ai: {
      symptomCheck: '/ai/symptom-check',
      analyzeImage: '/ai/analyze-image',
      predictDisease: '/ai/predict-disease',
      treatment: '/ai/treatment-recommendations',
      areaPrediction: '/ai/area-prediction',
      trends: '/ai/analyze-trends',
      anomalies: '/ai/detect-anomalies',
      risk: '/ai/risk-assessment',
    },
    
    users: {
      profile: '/users/profile',
      farm: '/users/farm',
      settings: '/users/settings',
      notifications: '/users/notification-settings',
    },
    
    market: {
      prices: '/market/prices',
      byCommodity: (commodity) => `/market/prices/${commodity}`,
      trends: '/market/trends',
    },
    
    weather: {
      current: '/weather/current',
      forecast: '/weather/forecast',
      alerts: '/weather/alerts',
    },
  },

  // Headers
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Version': process.env.REACT_APP_VERSION || '1.0.0',
    'X-Client-Platform': 'web',
  },

  // Authentication
  auth: {
    tokenKey: 'token',
    refreshTokenKey: 'refreshToken',
    tokenType: 'Bearer',
    storageKey: 'token',
  },

  // Retry configuration
  retry: {
    maxAttempts: 3,
    backoffFactor: 2,
    initialDelay: 1000,
    statusCodes: [408, 429, 500, 502, 503, 504],
  },

  // Caching
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutes
    maxSize: 100,
    storage: 'memory', // memory, localStorage, sessionStorage
  },

  // WebSocket
  websocket: {
    enabled: true,
    reconnectAttempts: 5,
    reconnectDelay: 1000,
    timeout: 10000,
    events: {
      connect: 'connect',
      disconnect: 'disconnect',
      error: 'error',
      message: 'message',
      typing: 'typing',
      consultation: 'consultation',
      alert: 'alert',
    },
  },

  // File upload
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    chunkSize: 1024 * 1024, // 1MB
    parallelUploads: 3,
  },

  // Error handling
  errors: {
    showToast: true,
    logToConsole: true,
    logToServer: process.env.NODE_ENV === 'production',
    ignoreErrors: ['CANCELLED', 'ABORTED'],
  },

  // Performance
  performance: {
    debounceDelay: 300,
    throttleDelay: 500,
    requestTimeout: 30000,
    maxConcurrentRequests: 10,
  },
};

export default apiConfig;