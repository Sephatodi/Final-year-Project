// API Endpoints
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-production-a7388.up.railway.app/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://backend-production-a7388.up.railway.app';

// App Constants
export const APP_NAME = 'Farm-Aid';
export const APP_VERSION = '1.0.0';
export const COMPANY_NAME = 'Farm-Aid Botswana';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date Formats
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';
export const TIME_FORMAT = 'HH:mm';
export const DISPLAY_DATE_FORMAT = 'DD MMM YYYY';
export const DISPLAY_DATETIME_FORMAT = 'DD MMM YYYY, HH:mm';

// Animal Species
export const SPECIES = {
  CATTLE: 'cattle',
  GOAT: 'goat',
  SHEEP: 'sheep',
};

export const SPECIES_LIST = [
  { value: 'cattle', label: 'Cattle', icon: 'pets' },
  { value: 'goat', label: 'Goat', icon: 'cruelty_free' },
  { value: 'sheep', label: 'Sheep', icon: 'agriculture' },
];

// Health Status
export const HEALTH_STATUS = {
  HEALTHY: 'healthy',
  SICK: 'sick',
  CRITICAL: 'critical',
  RECOVERING: 'recovering',
};

export const HEALTH_STATUS_LIST = [
  { value: 'healthy', label: 'Healthy', color: 'green', icon: 'check_circle' },
  { value: 'sick', label: 'Sick', color: 'amber', icon: 'warning' },
  { value: 'critical', label: 'Critical', color: 'red', icon: 'error' },
  { value: 'recovering', label: 'Recovering', color: 'blue', icon: 'healing' },
];

// Gender
export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
};

export const GENDER_LIST = [
  { value: 'male', label: 'Male', icon: 'male' },
  { value: 'female', label: 'Female', icon: 'female' },
];

// Report Status
export const REPORT_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  ACKNOWLEDGED: 'acknowledged',
  INVESTIGATING: 'investigating',
  CONFIRMED: 'confirmed',
  FALSE_ALARM: 'false_alarm',
  RESOLVED: 'resolved',
};

export const REPORT_STATUS_LIST = [
  { value: 'pending', label: 'Pending', color: 'amber' },
  { value: 'submitted', label: 'Submitted', color: 'blue' },
  { value: 'acknowledged', label: 'Acknowledged', color: 'info' },
  { value: 'investigating', label: 'Investigating', color: 'warning' },
  { value: 'confirmed', label: 'Confirmed', color: 'red' },
  { value: 'false_alarm', label: 'False Alarm', color: 'green' },
  { value: 'resolved', label: 'Resolved', color: 'success' },
];

// Priority Levels
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const PRIORITY_LIST = [
  { value: 'low', label: 'Low', color: 'blue' },
  { value: 'medium', label: 'Medium', color: 'amber' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'critical', label: 'Critical', color: 'red' },
];

// Consultation Status
export const CONSULTATION_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  ACTIVE: 'active',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

// Message Types
export const MESSAGE_TYPE = {
  TEXT: 'text',
  IMAGE: 'image',
  VOICE: 'voice',
  SYSTEM: 'system',
};

// Alert Types
export const ALERT_TYPE = {
  DISEASE: 'disease',
  WEATHER: 'weather',
  MOVEMENT: 'movement',
  MARKET: 'market',
  SYSTEM: 'system',
};

// Alert Severity
export const ALERT_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical',
};

// Knowledge Base Categories
export const KB_CATEGORIES = {
  DISEASE: 'disease',
  PREVENTION: 'prevention',
  TREATMENT: 'treatment',
  NUTRITION: 'nutrition',
  BREEDING: 'breeding',
  MANAGEMENT: 'management',
};

// Difficulty Levels
export const DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

// File Types
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  OFFLINE_QUEUE: 'offlineQueue',
  SETTINGS: 'settings',
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  HERD: '/herd',
  HERD_DETAILS: '/herd/:id',
  SYMPTOM_CHECKER: '/symptom-checker',
  REPORT_DISEASE: '/report-disease',
  TELEHEALTH: '/telehealth',
  TELEHEALTH_CHAT: '/telehealth/:id',
  KNOWLEDGE_BASE: '/knowledge-base',
  KNOWLEDGE_ARTICLE: '/knowledge-base/:id',
  ALERTS: '/alerts',
  SETTINGS: '/settings',
  REPORTS: '/reports',
  ANALYTICS: '/analytics',
  HELP: '/help',
  ABOUT: '/about',
  OFFLINE: '/offline',
  NOT_FOUND: '*',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  OFFLINE: 'You are offline. Some features may be limited.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Logged in successfully!',
  LOGOUT: 'Logged out successfully!',
  REGISTER: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  REPORT_SUBMITTED: 'Report submitted successfully!',
  ANIMAL_ADDED: 'Animal added successfully!',
  ANIMAL_UPDATED: 'Animal updated successfully!',
  ANIMAL_DELETED: 'Animal deleted successfully!',
  SYNC_COMPLETE: 'Sync completed successfully!',
};

// Confirmation Messages
export const CONFIRM_MESSAGES = {
  DELETE_ANIMAL: 'Are you sure you want to delete this animal?',
  DELETE_REPORT: 'Are you sure you want to delete this report?',
  DELETE_ACCOUNT: 'Are you sure you want to delete your account? This action cannot be undone.',
  DISCARD_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',
  LOGOUT: 'Are you sure you want to logout?',
};

// Feature Flags
export const FEATURES = {
  OFFLINE_MODE: true,
  BIOMETRIC_LOGIN: true,
  PUSH_NOTIFICATIONS: true,
  SMS_ALERTS: true,
  VIDEO_CALLS: true,
  AI_SYMPTOM_CHECKER: true,
  MULTI_LANGUAGE: true,
  DARK_MODE: true,
};

// App Settings
export const APP_SETTINGS = {
  SYNC_INTERVAL: 30000, // 30 seconds
  AUTO_SAVE_INTERVAL: 5000, // 5 seconds
  TOAST_DURATION: 5000, // 5 seconds
  DEBOUNCE_DELAY: 300, // 300ms
  CACHE_DURATION: 3600000, // 1 hour
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};