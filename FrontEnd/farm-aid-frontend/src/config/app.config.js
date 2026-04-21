// Application configuration
export const appConfig = {
  // App metadata
  name: 'Farm-Aid',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  
  // URLs
  websiteUrl: process.env.REACT_APP_WEBSITE_URL || 'https://farmaid.bw',
  supportUrl: process.env.REACT_APP_SUPPORT_URL || 'https://support.farmaid.bw',
  privacyUrl: process.env.REACT_APP_PRIVACY_URL || 'https://farmaid.bw/privacy',
  termsUrl: process.env.REACT_APP_TERMS_URL || 'https://farmaid.bw/terms',
  
  // Features
  features: {
    offlineMode: process.env.REACT_APP_FEATURE_OFFLINE !== 'false',
    biometricLogin: process.env.REACT_APP_FEATURE_BIOMETRIC !== 'false',
    pushNotifications: process.env.REACT_APP_FEATURE_PUSH !== 'false',
    smsAlerts: process.env.REACT_APP_FEATURE_SMS !== 'false',
    videoCalls: process.env.REACT_APP_FEATURE_VIDEO !== 'false',
    aiSymptomChecker: process.env.REACT_APP_FEATURE_AI !== 'false',
    multiLanguage: process.env.REACT_APP_FEATURE_MULTI_LANG !== 'false',
    darkMode: process.env.REACT_APP_FEATURE_DARK_MODE !== 'false',
    analytics: process.env.REACT_APP_FEATURE_ANALYTICS !== 'false',
    reports: process.env.REACT_APP_FEATURE_REPORTS !== 'false',
  },

  // Default settings
  defaults: {
    language: 'en',
    theme: 'light',
    pageSize: 20,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    currency: 'BWP',
    measurementUnit: 'metric', // metric or imperial
    temperatureUnit: 'celsius', // celsius or fahrenheit
    weightUnit: 'kg', // kg or lbs
    distanceUnit: 'km', // km or miles
  },

  // Timeouts
  timeouts: {
    api: 30000, // 30 seconds
    session: 3600000, // 1 hour
    refresh: 300000, // 5 minutes
    idle: 900000, // 15 minutes
    toast: 5000, // 5 seconds
    notification: 10000, // 10 seconds
  },

  // Limits
  limits: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxVideoSize: 50 * 1024 * 1024, // 50MB
    maxPhotosPerUpload: 10,
    maxAnimalsPerFarm: 10000,
    maxHealthRecordsPerAnimal: 1000,
    maxMessagesPerConsultation: 10000,
    maxSearchResults: 100,
    maxAutocompleteResults: 10,
  },

  // Pagination
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    maxPageSize: 100,
  },

  // Cache
  cache: {
    knowledgeBaseTTL: 86400000, // 24 hours
    marketPricesTTL: 3600000, // 1 hour
    weatherTTL: 1800000, // 30 minutes
    userProfileTTL: 300000, // 5 minutes
    maxCacheSize: 50 * 1024 * 1024, // 50MB
  },

  // Logging
  logging: {
    level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    enableReduxLogging: process.env.NODE_ENV !== 'production',
    enableConsoleLogging: true,
    enableRemoteLogging: process.env.NODE_ENV === 'production',
    remoteLoggingEndpoint: process.env.REACT_APP_LOG_ENDPOINT,
  },

  // Security
  security: {
    minPasswordLength: 8,
    requireSpecialChar: true,
    requireNumber: true,
    requireUppercase: true,
    maxLoginAttempts: 5,
    lockoutDuration: 900000, // 15 minutes
    sessionTimeout: 3600000, // 1 hour
    enable2FA: true,
    enableBiometric: true,
  },

  // Contact
  contact: {
    email: 'info@farmaid.bw',
    phone: '+267 71 234 567',
    supportPhone: '+267 71 234 567',
    emergencyPhone: '0800 600 777',
    address: 'Gaborone, Botswana',
  },

  // Social media
  social: {
    facebook: 'https://facebook.com/farmaidbw',
    twitter: 'https://twitter.com/farmaidbw',
    instagram: 'https://instagram.com/farmaidbw',
    linkedin: 'https://linkedin.com/company/farmaidbw',
  },

  // Legal
  legal: {
    companyName: 'Farm-Aid Botswana (Pty) Ltd',
    registrationNumber: 'BW-2024-001',
    taxId: '123456789',
  },
};

export default appConfig;