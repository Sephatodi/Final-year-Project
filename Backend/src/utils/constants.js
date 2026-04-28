/**
 * constants.js - Application constants and configuration
 */

// ==================== OBJECT CONSTANTS (for Object.values) ====================

// Livestock species
const LIVESTOCK_SPECIES = {
    CATTLE: 'cattle',
    SHEEP: 'sheep',
    GOAT: 'goat',
    PIG: 'pig',
    CHICKEN: 'chicken',
    HORSE: 'horse',
    DONKEY: 'donkey',
    CAMEL: 'camel',
    RABBIT: 'rabbit'
};

// Record types for health records
const RECORD_TYPES = {
    CHECKUP: 'checkup',
    VACCINATION: 'vaccination',
    TREATMENT: 'treatment',
    SURGERY: 'surgery',
    BIRTH: 'birth',
    DEATH: 'death',
    WEIGHT: 'weight',
    OTHER: 'other'
};

// Consultation priorities
const CONSULTATION_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
};

// User roles
const USER_ROLES = {
    FARMER: 'farmer',
    VETERINARIAN: 'veterinarian',
    EXTENSION_OFFICER: 'extension_officer',
    ADMIN: 'admin'
};

// User statuses
const USER_STATUSES = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
    PENDING: 'pending'
};

// Consultation statuses
const CONSULTATION_STATUS = {
    PENDING: 'pending',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

// Health status
const HEALTH_STATUS = {
    HEALTHY: 'healthy',
    SICK: 'sick',
    RECOVERING: 'recovering',
    QUARANTINE: 'quarantine',
    CRITICAL: 'critical'
};

// Gender
const GENDER = {
    MALE: 'male',
    FEMALE: 'female'
};

// Article statuses
const ARTICLE_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    ARCHIVED: 'archived'
};

// Announcement priorities
const ANNOUNCEMENT_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
};

// Announcement target audiences
const ANNOUNCEMENT_TARGET = {
    ALL: 'all',
    FARMERS: 'farmers',
    VETERINARIANS: 'veterinarians',
    EXTENSION_OFFICERS: 'extension_officers'
};

// Report formats
const REPORT_FORMATS = {
    PDF: 'pdf',
    CSV: 'csv',
    EXCEL: 'excel',
    JSON: 'json'
};

// Report frequencies
const REPORT_FREQUENCY = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    QUARTERLY: 'quarterly'
};

// ==================== ERROR CODES ====================

const ERROR_CODES = {
    // Authentication errors (1000-1999)
    INVALID_CREDENTIALS: 1001,
    NO_TOKEN: 1002,
    INVALID_TOKEN: 1003,
    TOKEN_EXPIRED: 1004,
    ACCOUNT_INACTIVE: 1005,
    AUTH_REQUIRED: 1006,
    AUTH_RATE_LIMIT: 1007,

    // Authorization errors (2000-2999)
    INSUFFICIENT_PERMISSIONS: 2001,
    ADMIN_REQUIRED: 2002,
    SELF_OPERATION_NOT_ALLOWED: 2003,

    // Resource errors (3000-3999)
    USER_NOT_FOUND: 3001,
    CONSULTATION_NOT_FOUND: 3002,
    ARTICLE_NOT_FOUND: 3003,
    ANNOUNCEMENT_NOT_FOUND: 3004,
    LIVESTOCK_NOT_FOUND: 3005,
    HEALTH_RECORD_NOT_FOUND: 3006,

    // Validation errors (4000-4999)
    VALIDATION_ERROR: 4001,
    INVALID_INPUT: 4002,
    MISSING_FIELD: 4003,
    INVALID_VETERINARIAN: 4004,

    // File errors (5000-5999)
    NO_FILES_UPLOADED: 5001,
    FILE_TOO_LARGE: 5002,
    INVALID_FILE_TYPE: 5003,
    UPLOAD_FAILED: 5004,

    // System errors (6000-6999)
    DATABASE_ERROR: 6001,
    RATE_LIMIT_EXCEEDED: 6002,
    SERVICE_UNAVAILABLE: 6003,
    BACKUP_FAILED: 6004,
    RESTORE_FAILED: 6005,

    // Business logic errors (7000-7999)
    CONSULTATION_ALREADY_ASSIGNED: 7001,
    INVALID_CONSULTATION_STATUS: 7002,
    INVALID_PAYMENT: 7003
};

// ==================== AUDIT ACTIONS ====================

const AUDIT_ACTIONS = {
    // User actions
    USER_CREATE: 'USER_CREATE',
    USER_UPDATE: 'USER_UPDATE',
    USER_DELETE: 'USER_DELETE',
    USER_SUSPEND: 'USER_SUSPEND',
    USER_ACTIVATE: 'USER_ACTIVATE',
    
    // Consultation actions
    CONSULTATION_CREATE: 'CONSULTATION_CREATE',
    CONSULTATION_UPDATE: 'CONSULTATION_UPDATE',
    CONSULTATION_ASSIGN: 'CONSULTATION_ASSIGN',
    CONSULTATION_ESCALATE: 'CONSULTATION_ESCALATE',
    
    // Content actions
    ARTICLE_MODERATE: 'ARTICLE_MODERATE',
    ANNOUNCEMENT_CREATE: 'ANNOUNCEMENT_CREATE',
    ANNOUNCEMENT_DELETE: 'ANNOUNCEMENT_DELETE',
    
    // System actions
    BACKUP_CREATE: 'BACKUP_CREATE',
    BACKUP_RESTORE: 'BACKUP_RESTORE',
    BACKUP_DELETE: 'BACKUP_DELETE',
    CONFIG_UPDATE: 'CONFIG_UPDATE',
    
    // Report actions
    REPORT_GENERATE: 'REPORT_GENERATE',
    REPORT_SCHEDULE: 'REPORT_SCHEDULE',
    REPORT_SCHEDULE_DELETE: 'REPORT_SCHEDULE_DELETE',
    
    // Bulk actions
    BULK_USER_UPDATE: 'BULK_USER_UPDATE',
    BULK_CONSULTATION_UPDATE: 'BULK_CONSULTATION_UPDATE',
    
    // File actions
    FILES_UPLOAD: 'FILES_UPLOAD',
    FILE_DELETE: 'FILE_DELETE'
};

// ==================== APP CONFIG ====================

const APP_CONFIG = {
    name: 'FarmAid',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    apiVersion: 'v1',
    description: 'Farm Management System'
};

// ==================== FILE UPLOAD CONFIG ====================
const FILE_UPLOAD = {
    MAX_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,
    ALLOWED_TYPES: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/jpg,image/png').split(','),
    UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads'
};

// ==================== CUSTOM ERROR CLASS ====================
class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}

// ==================== EXPORT ALL CONSTANTS ====================

module.exports = {
    // Object constants
    LIVESTOCK_SPECIES,
    RECORD_TYPES,
    CONSULTATION_PRIORITY,
    USER_ROLES,
    USER_STATUSES,
    CONSULTATION_STATUS,
    HEALTH_STATUS,
    GENDER,
    ARTICLE_STATUS,
    ANNOUNCEMENT_PRIORITY,
    ANNOUNCEMENT_TARGET,
    REPORT_FORMATS,
    REPORT_FREQUENCY,
    
    // Error codes
    ERROR_CODES,
    
    // Audit actions
    AUDIT_ACTIONS,
    
    // Custom error class
    AppError,
    
    // App config
    APP_CONFIG,

    // File upload config
    FILE_UPLOAD
};