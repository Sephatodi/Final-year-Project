// constants/knowledgeBase.js

/**
 * Knowledge Base System Constants
 * Central place for all configuration values
 */

// ===== Species Constants =====
export const SPECIES = {
  CATTLE: 'cattle',
  GOAT: 'goat',
  SHEEP: 'sheep',
  ALL: 'all'
};

export const SPECIES_NAMES = {
  cattle: { en: 'Cattle', tn: 'Dikgomo' },
  goat: { en: 'Goats', tn: 'Dipodi' },
  sheep: { en: 'Sheep', tn: 'Dinku' },
  all: { en: 'All Species', tn: 'Ditsa Tsotlhe' }
};

// ===== Disease Codes =====
export const DISEASE_CODES = {
  // Original 8 diseases
  FMD: 'FMD',
  HEARTWATER: 'HEARTWATER',
  LSD: 'LSD',
  PPR: 'PPR',
  COCCIDIOSIS: 'COCCIDIOSIS',
  BLUETONGUE: 'BLUETONGUE',
  SCRAPIE: 'SCRAPIE',
  FIRSTAID: 'FIRSTAID',
  // New 13 diseases from comprehensive JSON
  CCPP: 'CCPP',
  ECF: 'ECF',
  MCF: 'MCF',
  BEF: 'BEF',
  ENTEROTOXEMIA: 'ENTEROTOXEMIA',
  COENUROSIS: 'COENUROSIS',
  TRYPANOSOMIASIS: 'TRYPANOSOMIASIS',
  ANTHRAX: 'ANTHRAX',
  ACTINOBACILLOSIS: 'ACTINOBACILLOSIS',
  ARCANOBACTERIOSIS: 'ARCANOBACTERIOSIS',
  OMPHALOPHLEBITIS: 'OMPHALOPHLEBITIS',
  // General guides
  GENERAL_PREVENTION: 'GENERAL_PREVENTION',
  GENERAL_MANAGEMENT: 'GENERAL_MANAGEMENT'
};

// ===== Critical Disease Thresholds =====
export const CRITICAL_DISEASE_THRESHOLD = 0.85;
export const HIGH_DISEASE_THRESHOLD = 0.7;
export const MEDIUM_DISEASE_THRESHOLD = 0.5;

export const DISEASE_PRIORITY = {
  CRITICAL: 'critical',  // Requires immediate reporting
  HIGH: 'high',          // Veterinary attention needed
  MEDIUM: 'medium',      // Monitor closely
  LOW: 'low'             // Informational
};

// ===== Languages =====
export const LANGUAGES = {
  ENGLISH: 'en',
  SETSWANA: 'tn'
};

export const LANGUAGE_NAMES = {
  en: 'English',
  tn: 'Setswana'
};

// ===== Database Configuration =====
export const DB_CONFIG = {
  NAME: process.env.REACT_APP_INDEXEDDB_NAME || 'FarmAidDB',
  VERSION: 1,
  STORES: {
    KNOWLEDGE_BASE: 'knowledgeBase',
    SYNC_QUEUE: 'syncQueue',
    LIVESTOCK_RECORDS: 'livestockRecords',
    HEALTH_RECORDS: 'healthRecords',
    TREATMENT_RECORDS: 'treatmentRecords'
  }
};

// ===== PouchDB/CouchDB Configuration =====
export const SYNC_CONFIG = {
  URL: process.env.REACT_APP_COUCHDB_URL || 'http://localhost:5984/farmaid',
  LIVE: true,
  RETRY: true,
  CONTINUOUS: true,
  HEARTBEAT: 30000,
  BATCH_SIZE: 100,
  SYNC_INTERVAL: process.env.REACT_APP_SYNC_INTERVAL_MS || 30000
};

// ===== UI Configuration =====
export const UI_CONFIG = {
  ITEMS_PER_PAGE: 10,
  SEARCH_DEBOUNCE_MS: 300,
  IMAGE_MAX_SIZE_MB: process.env.REACT_APP_IMAGE_MAX_SIZE_MB || 10,
  IMAGE_PREVIEW_WIDTH: 200,
  IMAGE_PREVIEW_HEIGHT: 200,
  ANIMATION_DURATION_MS: 300
};

// ===== Validation Rules =====
export const VALIDATION = {
  MIN_DISEASE_CODE_LENGTH: 2,
  MAX_DISEASE_CODE_LENGTH: 20,
  MIN_TITLE_LENGTH: 5,
  MAX_TITLE_LENGTH: 200,
  MIN_CONTENT_LENGTH: 50,
  MAX_CONTENT_LENGTH: 10000,
  VALID_SPECIES: Object.values(SPECIES),
  REQUIRED_FIELDS: ['id', 'diseaseCode', 'titleEn', 'species']
};

// ===== DVS Integration =====
export const DVS_CONFIG = {
  PHONE: process.env.REACT_APP_DVS_PHONE || '+267-390-1688',
  EMAIL: process.env.REACT_APP_DVS_EMAIL || 'notifications@dvs.gov.bw',
  HOTLINE: process.env.REACT_APP_DVS_HOTLINE || '+267-390-1688',
  REPORT_DISEASES: [
    'FMD',
    'HEARTWATER',
    'LSD',
    'PPR',
    'BLUETONGUE',
    'SCRAPIE'
  ]
};

// ===== Common Symptoms by Species =====
export const SYMPTOMS_BY_SPECIES = {
  cattle: [
    'Excessive salivation',
    'Lameness',
    'Fever',
    'Blisters on mouth',
    'Blisters on feet',
    'Swollen lymph nodes',
    'Reduced milk production',
    'Loss of appetite',
    'Skin nodules',
    'Difficulty breathing',
    'Diarrhea',
    'Weight loss',
    'Lethargy',
    'Nasal discharge',
    'Eye discharge'
  ],
  goat: [
    'Fever',
    'Eye discharge',
    'Nasal discharge',
    'Mouth ulcers',
    'Diarrhea',
    'Pneumonia',
    'Dehydration',
    'Weight loss',
    'Weakness',
    'Loss of appetite',
    'Cough',
    'Lethargy',
    'Abdominal pain',
    'Dull coat'
  ],
  sheep: [
    'Fever',
    'Blue tongue',
    'Lameness',
    'Mouth sores',
    'Swollen face',
    'Difficulty breathing',
    'Wool loss',
    'Weight loss',
    'Tremors',
    'Behavioral changes',
    'Staggering gait',
    'Intense itching',
    'Lethargy',
    'Loss of appetite'
  ]
};

// ===== Common Tags =====
export const COMMON_TAGS = [
  'contagious',
  'viral',
  'bacterial',
  'parasitic',
  'tick-borne',
  'fever',
  'digestive',
  'respiratory',
  'neurological',
  'skin',
  'emergency',
  'vaccine-preventable',
  'fatal',
  'treatable',
  'reportable'
];

// ===== Error Messages =====
export const ERROR_MESSAGES = {
  DB_NOT_INITIALIZED: 'Database not initialized. Please try again.',
  ARTICLE_NOT_FOUND: 'Article not found.',
  INVALID_DISEASE_CODE: 'Invalid disease code format.',
  SYNC_FAILED: 'Sync failed. Changes will retry when online.',
  IMAGE_TOO_LARGE: 'Image size exceeds maximum limit.',
  INVALID_SPECIES: 'Invalid species selected.',
  REQUIRED_FIELD_MISSING: 'Required field is missing.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
};

// ===== Success Messages =====
export const SUCCESS_MESSAGES = {
  ARTICLE_SAVED: 'Article saved successfully.',
  ARTICLE_DELETED: 'Article deleted successfully.',
  SYNC_COMPLETE: 'Sync completed successfully.',
  IMAGE_UPLOADED: 'Image uploaded and analyzed successfully.'
};

// ===== Feature Flags =====
export const FEATURES = {
  OFFLINE_MODE: process.env.REACT_APP_ENABLE_OFFLINE_MODE !== 'false',
  IMAGE_RECOGNITION: process.env.REACT_APP_ENABLE_IMAGE_RECOGNITION !== 'false',
  NOTIFICATIONS: process.env.REACT_APP_ENABLE_NOTIFICATIONS !== 'false',
  ADMIN_PANEL: process.env.REACT_APP_ENABLE_ADMIN_PANEL !== 'false',
  ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true'
};

// ===== UI Colors =====
export const COLORS = {
  SPECIES: {
    cattle: { bg: 'bg-blue-100', text: 'text-blue-700', dark: 'dark:bg-blue-900/30 dark:text-blue-300' },
    goat: { bg: 'bg-green-100', text: 'text-green-700', dark: 'dark:bg-green-900/30 dark:text-green-300' },
    sheep: { bg: 'bg-purple-100', text: 'text-purple-700', dark: 'dark:bg-purple-900/30 dark:text-purple-300' },
    all: { bg: 'bg-gray-100', text: 'text-gray-700', dark: 'dark:bg-gray-900/30 dark:text-gray-300' }
  },
  PRIORITY: {
    critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
  }
};

// ===== API Endpoints =====
export const API_ENDPOINTS = {
  BASE: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  TELEHEALTH: process.env.REACT_APP_TELEHEALTH_API || 'http://localhost:3001/api/telehealth',
  DVS: process.env.REACT_APP_DVS_API || 'http://localhost:3001/api/dvs',
  KNOWLEDGE_BASE: '/api/knowledge-base',
  ANIMALS: '/api/animals',
  HEALTH_RECORDS: '/api/health-records',
  TREATMENT_RECORDS: '/api/treatment-records'
};

// ===== Local Storage Keys =====
export const STORAGE_KEYS = {
  LAST_SEARCH: 'farmaid_last_search',
  PREFERRED_LANGUAGE: 'farmaid_preferred_language',
  LAST_SYNC_TIME: 'farmaid_last_sync_time',
  USER_PREFERENCES: 'farmaid_user_preferences',
  CACHED_RESULTS: 'farmaid_cached_results'
};

// ===== Time Constants (in milliseconds) =====
export const TIME_CONFIG = {
  SYNC_TIMEOUT: 30000,
  SEARCH_TIMEOUT: 5000,
  IMAGE_ANALYSIS_TIMEOUT: 30000,
  CACHE_EXPIRY: 3600000, // 1 hour
  AUTO_REFRESH_INTERVAL: 300000 // 5 minutes
};

// ===== Export all constants as single object =====
export default {
  SPECIES,
  SPECIES_NAMES,
  DISEASE_CODES,
  CRITICAL_DISEASE_THRESHOLD,
  HIGH_DISEASE_THRESHOLD,
  MEDIUM_DISEASE_THRESHOLD,
  DISEASE_PRIORITY,
  LANGUAGES,
  LANGUAGE_NAMES,
  DB_CONFIG,
  SYNC_CONFIG,
  UI_CONFIG,
  VALIDATION,
  DVS_CONFIG,
  SYMPTOMS_BY_SPECIES,
  COMMON_TAGS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FEATURES,
  COLORS,
  API_ENDPOINTS,
  STORAGE_KEYS,
  TIME_CONFIG
};
