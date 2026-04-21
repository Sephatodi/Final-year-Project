/**
 * adminRoutes.js - Admin routes for FarmAid
 * Handles administrative functions, user management, system monitoring, and analytics
 */

const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const upload = require('../middleware/uploads');
const adminController = require('../controllers/adminController');
const { APP_CONFIG } = require('../utils/constants');

// All admin routes require authentication and admin authorization
router.use(authenticate);
router.use(authorizeAdmin);

// ===========================================
// Dashboard & Analytics
// ===========================================

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard statistics
 * @access  Admin
 */
router.get('/dashboard', adminController.getDashboardStats);

/**
 * @route   GET /api/admin/analytics/users
 * @desc    Get user analytics
 * @access  Admin
 */
router.get(
  '/analytics/users',
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('groupBy').optional().isIn(['day', 'week', 'month', 'year'])
  ],
  validate,
  adminController.getUserAnalytics
);

/**
 * @route   GET /api/admin/analytics/consultations
 * @desc    Get consultation analytics
 * @access  Admin
 */
router.get(
  '/analytics/consultations',
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('status').optional().isIn(['pending', 'active', 'completed', 'cancelled'])
  ],
  validate,
  adminController.getConsultationAnalytics
);

/**
 * @route   GET /api/admin/analytics/livestock
 * @desc    Get livestock analytics
 * @access  Admin
 */
router.get('/analytics/livestock', adminController.getLivestockAnalytics);

/**
 * @route   GET /api/admin/analytics/revenue
 * @desc    Get revenue analytics
 * @access  Admin
 */
router.get(
  '/analytics/revenue',
  [
    query('period').optional().isIn(['daily', 'weekly', 'monthly', 'yearly']),
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601()
  ],
  validate,
  adminController.getRevenueAnalytics
);

// ===========================================
// User Management
// ===========================================

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with filtering and pagination
 * @access  Admin
 */
router.get(
  '/users',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('role').optional().isIn(['farmer', 'veterinarian', 'admin', 'extension_officer']),
    query('status').optional().isIn(['active', 'inactive', 'suspended', 'pending']),
    query('search').optional().isString().trim(),
    query('sortBy').optional().isIn(['createdAt', 'lastLogin', 'name', 'email']),
    query('sortOrder').optional().isIn(['asc', 'desc'])
  ],
  validate,
  adminController.getAllUsers
);

/**
 * @route   GET /api/admin/users/:userId
 * @desc    Get user details by ID
 * @access  Admin
 */
router.get(
  '/users/:userId',
  [
    param('userId').isUUID().withMessage('Invalid user ID format')
  ],
  validate,
  adminController.getUserById
);

/**
 * @route   PUT /api/admin/users/:userId
 * @desc    Update user (admin override)
 * @access  Admin
 */
router.put(
  '/users/:userId',
  [
    param('userId').isUUID(),
    body('firstName').optional().isString().trim().isLength({ min: 2, max: 50 }),
    body('lastName').optional().isString().trim().isLength({ min: 2, max: 50 }),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().isMobilePhone(),
    body('role').optional().isIn(['farmer', 'veterinarian', 'admin', 'extension_officer']),
    body('status').optional().isIn(['active', 'inactive', 'suspended']),
    body('farmDetails').optional().isObject(),
    body('professionalDetails').optional().isObject()
  ],
  validate,
  adminController.updateUser
);

/**
 * @route   DELETE /api/admin/users/:userId
 * @desc    Delete user (soft delete)
 * @access  Admin
 */
router.delete(
  '/users/:userId',
  [
    param('userId').isUUID()
  ],
  validate,
  adminController.deleteUser
);

/**
 * @route   POST /api/admin/users/:userId/suspend
 * @desc    Suspend user account
 * @access  Admin
 */
router.post(
  '/users/:userId/suspend',
  [
    param('userId').isUUID(),
    body('reason').optional().isString().trim().isLength({ max: 500 }),
    body('duration').optional().isIn(['temporary', 'permanent'])
  ],
  validate,
  adminController.suspendUser
);

/**
 * @route   POST /api/admin/users/:userId/activate
 * @desc    Activate user account
 * @access  Admin
 */
router.post(
  '/users/:userId/activate',
  [
    param('userId').isUUID()
  ],
  validate,
  adminController.activateUser
);

/**
 * @route   GET /api/admin/users/:userId/activity
 * @desc    Get user activity log
 * @access  Admin
 */
router.get(
  '/users/:userId/activity',
  [
    param('userId').isUUID(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601()
  ],
  validate,
  adminController.getUserActivity
);

// ===========================================
// Content Management
// ===========================================

/**
 * @route   GET /api/admin/content/knowledge-base
 * @desc    Get all knowledge base articles with moderation status
 * @access  Admin
 */
router.get(
  '/content/knowledge-base',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('status').optional().isIn(['pending', 'approved', 'rejected', 'archived']),
    query('category').optional().isString(),
    query('search').optional().isString()
  ],
  validate,
  adminController.getKnowledgeBaseArticles
);

/**
 * @route   PUT /api/admin/content/knowledge-base/:articleId/moderate
 * @desc    Moderate knowledge base article
 * @access  Admin
 */
router.put(
  '/content/knowledge-base/:articleId/moderate',
  [
    param('articleId').isUUID(),
    body('status').isIn(['approved', 'rejected', 'pending']),
    body('moderationNotes').optional().isString().trim().isLength({ max: 1000 }),
    body('rejectionReason').optional().if(body('status').equals('rejected')).isString().trim()
  ],
  validate,
  adminController.moderateKnowledgeArticle
);

/**
 * @route   POST /api/admin/content/announcements
 * @desc    Create system announcement
 * @access  Admin
 */
router.post(
  '/content/announcements',
  [
    body('title').isString().trim().isLength({ min: 5, max: 200 }),
    body('content').isString().trim().isLength({ min: 10, max: 5000 }),
    body('targetAudience').isIn(['all', 'farmers', 'veterinarians', 'extension_officers']),
    body('priority').isIn(['low', 'medium', 'high', 'urgent']),
    body('expiresAt').optional().isISO8601(),
    body('attachments').optional().isArray()
  ],
  validate,
  adminController.createAnnouncement
);

/**
 * @route   GET /api/admin/content/announcements
 * @desc    Get all announcements
 * @access  Admin
 */
router.get('/content/announcements', adminController.getAnnouncements);

/**
 * @route   DELETE /api/admin/content/announcements/:announcementId
 * @desc    Delete announcement
 * @access  Admin
 */
router.delete(
  '/content/announcements/:announcementId',
  [
    param('announcementId').isUUID()
  ],
  validate,
  adminController.deleteAnnouncement
);

// ===========================================
// System Management
// ===========================================

/**
 * @route   GET /api/admin/system/health
 * @desc    Get comprehensive system health status
 * @access  Admin
 */
router.get('/system/health', adminController.getSystemHealth);

/**
 * @route   GET /api/admin/system/metrics
 * @desc    Get system performance metrics
 * @access  Admin
 */
router.get('/system/metrics', adminController.getSystemMetrics);

/**
 * @route   GET /api/admin/system/logs
 * @desc    Get system logs
 * @access  Admin
 */
router.get(
  '/system/logs',
  [
    query('level').optional().isIn(['error', 'warn', 'info', 'debug']),
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601(),
    query('limit').optional().isInt({ min: 1, max: 1000 }).toInt()
  ],
  validate,
  adminController.getSystemLogs
);

/**
 * @route   POST /api/admin/system/backup
 * @desc    Create system backup
 * @access  Admin
 */
router.post('/system/backup', adminController.createBackup);

/**
 * @route   GET /api/admin/system/backups
 * @desc    List all backups
 * @access  Admin
 */
router.get('/system/backups', adminController.listBackups);

/**
 * @route   POST /api/admin/system/restore/:backupId
 * @desc    Restore from backup
 * @access  Admin
 */
router.post(
  '/system/restore/:backupId',
  [
    param('backupId').isUUID()
  ],
  validate,
  adminController.restoreFromBackup
);

/**
 * @route   DELETE /api/admin/system/backups/:backupId
 * @desc    Delete backup
 * @access  Admin
 */
router.delete(
  '/system/backups/:backupId',
  [
    param('backupId').isUUID()
  ],
  validate,
  adminController.deleteBackup
);

/**
 * @route   GET /api/admin/system/config
 * @desc    Get system configuration
 * @access  Admin
 */
router.get('/system/config', adminController.getSystemConfig);

/**
 * @route   PUT /api/admin/system/config
 * @desc    Update system configuration
 * @access  Admin
 */
router.put(
  '/system/config',
  [
    body('maintenanceMode').optional().isBoolean(),
    body('maxUploadSize').optional().isInt({ min: 1 }),
    body('allowedFileTypes').optional().isArray(),
    body('rateLimits').optional().isObject(),
    body('featureFlags').optional().isObject()
  ],
  validate,
  adminController.updateSystemConfig
);

// ===========================================
// Consultation Management
// ===========================================

/**
 * @route   GET /api/admin/consultations
 * @desc    Get all consultations with advanced filtering
 * @access  Admin
 */
router.get(
  '/consultations',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('status').optional().isIn(['pending', 'active', 'completed', 'cancelled']),
    query('priority').optional().isIn(['low', 'medium', 'high', 'emergency']),
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601(),
    query('veterinarianId').optional().isUUID(),
    query('farmerId').optional().isUUID()
  ],
  validate,
  adminController.getAllConsultations
);

/**
 * @route   PUT /api/admin/consultations/:consultationId/assign
 * @desc    Assign consultation to veterinarian
 * @access  Admin
 */
router.put(
  '/consultations/:consultationId/assign',
  [
    param('consultationId').isUUID(),
    body('veterinarianId').isUUID(),
    body('priority').optional().isIn(['low', 'medium', 'high', 'emergency'])
  ],
  validate,
  adminController.assignConsultation
);

/**
 * @route   POST /api/admin/consultations/:consultationId/escalate
 * @desc    Escalate consultation
 * @access  Admin
 */
router.post(
  '/consultations/:consultationId/escalate',
  [
    param('consultationId').isUUID(),
    body('reason').isString().trim().isLength({ min: 10, max: 500 }),
    body('escalateTo').optional().isUUID()
  ],
  validate,
  adminController.escalateConsultation
);

// ===========================================
// Reports
// ===========================================

/**
 * @route   POST /api/admin/reports/generate
 * @desc    Generate custom report
 * @access  Admin
 */
router.post(
  '/reports/generate',
  [
    body('reportType').isIn(['users', 'consultations', 'revenue', 'livestock', 'system']),
    body('format').isIn(['pdf', 'csv', 'excel', 'json']),
    body('dateRange').optional().isObject(),
    body('filters').optional().isObject(),
    body('includeCharts').optional().isBoolean()
  ],
  validate,
  adminController.generateReport
);

/**
 * @route   GET /api/admin/reports/scheduled
 * @desc    Get scheduled reports
 * @access  Admin
 */
router.get('/reports/scheduled', adminController.getScheduledReports);

/**
 * @route   POST /api/admin/reports/schedule
 * @desc    Schedule recurring report
 * @access  Admin
 */
router.post(
  '/reports/schedule',
  [
    body('reportType').isIn(['users', 'consultations', 'revenue', 'livestock', 'system']),
    body('frequency').isIn(['daily', 'weekly', 'monthly', 'quarterly']),
    body('format').isIn(['pdf', 'csv', 'excel']),
    body('recipients').isArray(),
    body('recipients.*').isEmail(),
    body('filters').optional().isObject()
  ],
  validate,
  adminController.scheduleReport
);

/**
 * @route   DELETE /api/admin/reports/scheduled/:scheduleId
 * @desc    Delete scheduled report
 * @access  Admin
 */
router.delete(
  '/reports/scheduled/:scheduleId',
  [
    param('scheduleId').isUUID()
  ],
  validate,
  adminController.deleteScheduledReport
);

// ===========================================
// Audit Logs
// ===========================================

/**
 * @route   GET /api/admin/audit-logs
 * @desc    Get audit logs
 * @access  Admin
 */
router.get(
  '/audit-logs',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 500 }).toInt(),
    query('action').optional().isString(),
    query('userId').optional().isUUID(),
    query('resource').optional().isString(),
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601()
  ],
  validate,
  adminController.getAuditLogs
);

/**
 * @route   GET /api/admin/audit-logs/export
 * @desc    Export audit logs
 * @access  Admin
 */
router.get(
  '/audit-logs/export',
  [
    query('format').isIn(['csv', 'json']),
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601()
  ],
  validate,
  adminController.exportAuditLogs
);

// ===========================================
// Bulk Operations
// ===========================================

/**
 * @route   POST /api/admin/bulk/users/status
 * @desc    Bulk update user status
 * @access  Admin
 */
router.post(
  '/bulk/users/status',
  [
    body('userIds').isArray().isLength({ min: 1, max: 100 }),
    body('userIds.*').isUUID(),
    body('status').isIn(['active', 'inactive', 'suspended']),
    body('reason').optional().isString().trim().isLength({ max: 500 })
  ],
  validate,
  adminController.bulkUpdateUserStatus
);

/**
 * @route   POST /api/admin/bulk/consultations/status
 * @desc    Bulk update consultation status
 * @access  Admin
 */
router.post(
  '/bulk/consultations/status',
  [
    body('consultationIds').isArray().isLength({ min: 1, max: 100 }),
    body('consultationIds.*').isUUID(),
    body('status').isIn(['pending', 'active', 'completed', 'cancelled'])
  ],
  validate,
  adminController.bulkUpdateConsultationStatus
);

// ===========================================
// File Management
// ===========================================

/**
 * @route   POST /api/admin/files/upload
 * @desc    Upload admin files
 * @access  Admin
 */
router.post(
  '/files/upload',
  upload.array('files', 10),
  adminController.uploadFiles
);

/**
 * @route   GET /api/admin/files
 * @desc    List uploaded files
 * @access  Admin
 */
router.get(
  '/files',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('type').optional().isString()
  ],
  validate,
  adminController.listFiles
);

/**
 * @route   DELETE /api/admin/files/:fileId
 * @desc    Delete file
 * @access  Admin
 */
router.delete(
  '/files/:fileId',
  [
    param('fileId').isUUID()
  ],
  validate,
  adminController.deleteFile
);

module.exports = router;