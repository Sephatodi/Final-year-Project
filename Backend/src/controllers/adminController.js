/**
 * adminController.js - Admin controller for FarmAid
 * Handles all admin-related operations
 */

const { validationResult } = require('express-validator');
const { pgPool, couchServer } = require('../config/database');
const logger = require('../utils/logger');
const { AppError, ERROR_CODES } = require('../utils/constants');
const { asyncHandler } = require('../utils/helpers');
const { User, Consultation, Livestock, KnowledgeBase, AuditLog } = require('../models');
const { backupSystem, restoreSystem } = require('../services/backupService');
const { generateReport } = require('../services/reportService');
const { sendNotification } = require('../services/notificationService');

// ===========================================
// Dashboard & Analytics
// ===========================================

/**
 * Get admin dashboard statistics
 */
exports.getDashboardStats = asyncHandler(async (req, res) => {
  // Get counts from PostgreSQL
  const userStats = await User.getStats();
  const consultationStats = await Consultation.getStats();
  const livestockStats = await Livestock.getStats();

  // Get recent activities
  const recentActivities = await AuditLog.getRecent(50);

  // Get system health
  const systemHealth = await getSystemHealthStatus();

  res.json({
    success: true,
    data: {
      users: userStats,
      consultations: consultationStats,
      livestock: livestockStats,
      recentActivities,
      systemHealth,
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * Get user analytics
 */
exports.getUserAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate, groupBy = 'month' } = req.query;

  const analytics = await User.getAnalytics({
    startDate: startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    endDate: endDate || new Date(),
    groupBy
  });

  res.json({
    success: true,
    data: analytics
  });
});

/**
 * Get consultation analytics
 */
exports.getConsultationAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate, status } = req.query;

  const analytics = await Consultation.getAnalytics({
    startDate: startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    endDate: endDate || new Date(),
    status
  });

  res.json({
    success: true,
    data: analytics
  });
});

/**
 * Get livestock analytics
 */
exports.getLivestockAnalytics = asyncHandler(async (req, res) => {
  const analytics = await Livestock.getAnalytics();

  res.json({
    success: true,
    data: analytics
  });
});

/**
 * Get revenue analytics
 */
exports.getRevenueAnalytics = asyncHandler(async (req, res) => {
  const { period = 'monthly', from, to } = req.query;

  const analytics = await Consultation.getRevenueAnalytics({
    period,
    from: from || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    to: to || new Date()
  });

  res.json({
    success: true,
    data: analytics
  });
});

// ===========================================
// User Management
// ===========================================

/**
 * Get all users with filtering and pagination
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    role,
    status,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const filters = { role, status, search };
  const pagination = { page: parseInt(page), limit: parseInt(limit) };
  const sort = { [sortBy]: sortOrder };

  const result = await User.findWithFilters(filters, pagination, sort);

  res.json({
    success: true,
    data: result.users,
    pagination: result.pagination
  });
});

/**
 * Get user by ID
 */
exports.getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId, {
    includeDetails: true,
    includeFarm: true,
    includeActivity: true
  });

  if (!user) {
    throw new AppError('User not found', 404, ERROR_CODES.USER_NOT_FOUND);
  }

  res.json({
    success: true,
    data: user
  });
});

/**
 * Update user (admin override)
 */
exports.updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, ERROR_CODES.USER_NOT_FOUND);
  }

  // Log the admin action
  await AuditLog.create({
    userId: req.user.id,
    action: 'USER_UPDATE',
    resource: 'user',
    resourceId: userId,
    changes: updates,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  const updatedUser = await User.update(userId, updates);

  // Send notification to user if status changed
  if (updates.status && updates.status !== user.status) {
    await sendNotification(userId, {
      type: 'ACCOUNT_STATUS_CHANGE',
      title: 'Account Status Updated',
      message: `Your account status has been changed to ${updates.status}`,
      data: { oldStatus: user.status, newStatus: updates.status }
    });
  }

  res.json({
    success: true,
    data: updatedUser,
    message: 'User updated successfully'
  });
});

/**
 * Delete user (soft delete)
 */
exports.deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, ERROR_CODES.USER_NOT_FOUND);
  }

  // Prevent admin from deleting themselves
  if (userId === req.user.id) {
    throw new AppError('Cannot delete your own account', 400, ERROR_CODES.SELF_OPERATION_NOT_ALLOWED);
  }

  // Log the admin action
  await AuditLog.create({
    userId: req.user.id,
    action: 'USER_DELETE',
    resource: 'user',
    resourceId: userId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  await User.softDelete(userId);

  // Send notification
  await sendNotification(userId, {
    type: 'ACCOUNT_DELETED',
    title: 'Account Deleted',
    message: 'Your account has been deleted by an administrator',
    priority: 'high'
  });

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

/**
 * Suspend user
 */
exports.suspendUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { reason, duration = 'temporary' } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, ERROR_CODES.USER_NOT_FOUND);
  }

  if (userId === req.user.id) {
    throw new AppError('Cannot suspend your own account', 400, ERROR_CODES.SELF_OPERATION_NOT_ALLOWED);
  }

  await User.update(userId, {
    status: 'suspended',
    suspensionReason: reason,
    suspendedBy: req.user.id,
    suspendedAt: new Date(),
    suspensionDuration: duration
  });

  // Log the admin action
  await AuditLog.create({
    userId: req.user.id,
    action: 'USER_SUSPEND',
    resource: 'user',
    resourceId: userId,
    details: { reason, duration },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Send notification
  await sendNotification(userId, {
    type: 'ACCOUNT_SUSPENDED',
    title: 'Account Suspended',
    message: `Your account has been suspended. Reason: ${reason || 'No reason provided'}`,
    priority: 'high'
  });

  res.json({
    success: true,
    message: 'User suspended successfully'
  });
});

/**
 * Activate user
 */
exports.activateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, ERROR_CODES.USER_NOT_FOUND);
  }

  await User.update(userId, {
    status: 'active',
    suspensionReason: null,
    suspendedBy: null,
    suspendedAt: null,
    activatedAt: new Date()
  });

  // Log the admin action
  await AuditLog.create({
    userId: req.user.id,
    action: 'USER_ACTIVATE',
    resource: 'user',
    resourceId: userId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Send notification
  await sendNotification(userId, {
    type: 'ACCOUNT_ACTIVATED',
    title: 'Account Activated',
    message: 'Your account has been activated',
    priority: 'normal'
  });

  res.json({
    success: true,
    message: 'User activated successfully'
  });
});

/**
 * Get user activity log
 */
exports.getUserActivity = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 20, from, to } = req.query;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, ERROR_CODES.USER_NOT_FOUND);
  }

  const activities = await AuditLog.getByUser(userId, {
    page: parseInt(page),
    limit: parseInt(limit),
    from: from ? new Date(from) : null,
    to: to ? new Date(to) : null
  });

  res.json({
    success: true,
    data: activities.logs,
    pagination: activities.pagination
  });
});

// ===========================================
// Content Management
// ===========================================

/**
 * Get knowledge base articles with moderation status
 */
exports.getKnowledgeBaseArticles = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    category,
    search
  } = req.query;

  const articles = await KnowledgeBase.findWithFilters({
    status,
    category,
    search,
    page: parseInt(page),
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: articles.items,
    pagination: articles.pagination
  });
});

/**
 * Moderate knowledge base article
 */
exports.moderateKnowledgeArticle = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { status, moderationNotes, rejectionReason } = req.body;

  const article = await KnowledgeBase.findById(articleId);
  if (!article) {
    throw new AppError('Article not found', 404, ERROR_CODES.ARTICLE_NOT_FOUND);
  }

  const updatedArticle = await KnowledgeBase.moderate(articleId, {
    status,
    moderationNotes,
    rejectionReason,
    moderatedBy: req.user.id,
    moderatedAt: new Date()
  });

  // Log the admin action
  await AuditLog.create({
    userId: req.user.id,
    action: 'ARTICLE_MODERATE',
    resource: 'knowledge_base',
    resourceId: articleId,
    details: { status, moderationNotes },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Notify article author
  if (article.authorId) {
    await sendNotification(article.authorId, {
      type: 'ARTICLE_MODERATED',
      title: 'Article Moderated',
      message: `Your article "${article.title}" has been ${status}`,
      data: { status, moderationNotes, rejectionReason }
    });
  }

  res.json({
    success: true,
    data: updatedArticle,
    message: `Article ${status} successfully`
  });
});

/**
 * Create system announcement
 */
exports.createAnnouncement = asyncHandler(async (req, res) => {
  const announcementData = {
    ...req.body,
    createdBy: req.user.id,
    createdAt: new Date()
  };

  const announcement = await KnowledgeBase.createAnnouncement(announcementData);

  // Send push notifications to target audience
  await sendNotification(announcementData.targetAudience, {
    type: 'ANNOUNCEMENT',
    title: announcementData.title,
    message: announcementData.content.substring(0, 100) + '...',
    data: { announcementId: announcement.id },
    priority: announcementData.priority === 'urgent' ? 'high' : 'normal'
  });

  // Log the admin action
  await AuditLog.create({
    userId: req.user.id,
    action: 'ANNOUNCEMENT_CREATE',
    resource: 'announcement',
    resourceId: announcement.id,
    details: { title: announcementData.title, targetAudience: announcementData.targetAudience },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(201).json({
    success: true,
    data: announcement,
    message: 'Announcement created successfully'
  });
});

/**
 * Get all announcements
 */
exports.getAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await KnowledgeBase.getAnnouncements();

  res.json({
    success: true,
    data: announcements
  });
});

/**
 * Delete announcement
 */
exports.deleteAnnouncement = asyncHandler(async (req, res) => {
  const { announcementId } = req.params;

  const announcement = await KnowledgeBase.findAnnouncementById(announcementId);
  if (!announcement) {
    throw new AppError('Announcement not found', 404, ERROR_CODES.ANNOUNCEMENT_NOT_FOUND);
  }

  await KnowledgeBase.deleteAnnouncement(announcementId);

  // Log the admin action
  await AuditLog.create({
    userId: req.user.id,
    action: 'ANNOUNCEMENT_DELETE',
    resource: 'announcement',
    resourceId: announcementId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json({
    success: true,
    message: 'Announcement deleted successfully'
  });
});

// ===========================================
// System Management
// ===========================================

/**
 * Get comprehensive system health status
 */
exports.getSystemHealth = asyncHandler(async (req, res) => {
  const health = await getSystemHealthStatus();

  res.json({
    success: true,
    data: health
  });
});

/**
 * Get system performance metrics
 */
exports.getSystemMetrics = asyncHandler(async (req, res) => {
  const metrics = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    connections: {
      postgresql: pgPool.totalCount,
      postgresql_active: pgPool.activeCount,
      couchdb: await getCouchDBMetrics()
    },
    requests: await getRequestMetrics(),
    responseTime: await getAverageResponseTime(),
    timestamp: new Date().toISOString()
  };

  res.json({
    success: true,
    data: metrics
  });
});

/**
 * Get system logs
 */
exports.getSystemLogs = asyncHandler(async (req, res) => {
  const { level, from, to, limit = 100 } = req.query;

  const logs = await logger.getLogs({
    level,
    from: from ? new Date(from) : null,
    to: to ? new Date(to) : null,
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: logs
  });
});

/**
 * Create system backup
 */
exports.createBackup = asyncHandler(async (req, res) => {
  const backup = await backupSystem({
    createdBy: req.user.id,
    includeFiles: true,
    includeDatabase: true
  });

  // Log the admin action
  await AuditLog.create({
    userId: req.user.id,
    action: 'BACKUP_CREATE',
    resource: 'backup',
    resourceId: backup.id,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json({
    success: true,
    data: backup,
    message: 'Backup created successfully'
  });
});

/**
 * List all backups
 */
exports.listBackups = asyncHandler(async (req, res) => {
  const backups = await getBackupList();

  res.json({
    success: true,
    data: backups
  });
});

/**
 * Restore from backup
 */
exports.restoreFromBackup = asyncHandler(async (req, res) => {
  const { backupId } = req.params;

  // Log the admin action before restore
  await AuditLog.create({
    userId: req.user.id,
    action: 'BACKUP_RESTORE',
    resource: 'backup',
    resourceId: backupId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  const result = await restoreSystem(backupId);

  res.json({
    success: true,
    data: result,
    message: 'System restored successfully'
  });
});

/**
 * Delete backup
 */
exports.deleteBackup = asyncHandler(async (req, res) => {
  const { backupId } = req.params;

  await deleteBackup(backupId);

  // Log the admin action
  await AuditLog.create({
    userId: req.user.id,
    action: 'BACKUP_DELETE',
    resource: 'backup',
    resourceId: backupId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json({
    success: true,
    message: 'Backup deleted successfully'
  });
});

/**
 * Get system configuration
 */
exports.getSystemConfig = asyncHandler(async (req, res) => {
  const config = await getSystemConfiguration();

  res.json({
    success: true,
    data: config
  });
});

/**
 * Update system configuration
 */
exports.updateSystemConfig = asyncHandler(async (req, res) => {
  const updates = req.body;

  const oldConfig = await getSystemConfiguration();
  const newConfig = await updateSystemConfiguration(updates);

  // Log the admin action
  await AuditLog.create({
    userId: req.user.id,
    action: 'CONFIG_UPDATE',
    resource: 'system_config',
    changes: updates,
    oldValues: oldConfig,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json({
    success: true,
    data: newConfig,
    message: 'System configuration updated successfully'
  });
});

// ===========================================
// Consultation Management
// ===========================================

/**
 * Get all consultations with advanced filtering
 */
exports.getAllConsultations = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    priority,
    from,
    to,
    veterinarianId,
    farmerId
  } = req.query;

  const consultations = await Consultation.findWithFilters({
    status,
    priority,
    from: from ? new Date(from) : null,
    to: to ? new Date(to) : null,
    veterinarianId,
    farmerId,
    page: parseInt(page),
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: consultations.items,
    pagination: consultations.pagination
  });
});

/**
 * Assign consultation to veterinarian
 */
exports.assignConsultation = asyncHandler(async (req, res) => {
  const { consultationId } = req.params;
  const { veterinarianId, priority } = req.body;

  const consultation = await Consultation.findById(consultationId);
  if (!consultation) {
    throw new AppError('Consultation not found', 404, ERROR_CODES.CONSULTATION_NOT_FOUND);
  }

  const veterinarian = await User.findById(veterinarianId);
  if (!veterinarian || veterinarian.role !== 'veterinarian') {
    throw new AppError('Invalid veterinarian', 400, ERROR_CODES.INVALID_VETERINARIAN);
  }

  const updatedConsultation = await Consultation.assignVeterinarian(consultationId, {
    veterinarianId,
    priority: priority || consultation.priority,
    assignedBy: req.user.id,
    assignedAt: new Date()
  });

  // Log the admin action
  await AuditLog.create({
    userId: req.user.id,
    action: 'CONSULTATION_ASSIGN',
    resource: 'consultation',
    resourceId: consultationId,
    details: { veterinarianId, priority },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Notify the veterinarian
  await sendNotification(veterinarianId, {
    type: 'CONSULTATION_ASSIGNED',
    title: 'New Consultation Assigned',
    message: `You have been assigned to consultation #${consultationId}`,
    data: { consultationId, priority },
    priority: priority === 'emergency' ? 'high' : 'normal'
  });

  // Notify the farmer
  await sendNotification(consultation.farmerId, {
    type: 'VETERINARIAN_ASSIGNED',
    title: 'Veterinarian Assigned',
    message: `Dr. ${veterinarian.firstName} ${veterinarian.lastName} has been assigned to your consultation`,
    data: { consultationId, veterinarianId },
    priority: 'normal'
  });

  res.json({
    success: true,
    data: updatedConsultation,
    message: 'Consultation assigned successfully'
  });
});

/**
 * Escalate consultation
 */
exports.escalateConsultation = asyncHandler(async (req, res) => {
  const { consultationId } = req.params;
  const { reason, escalateTo } = req.body;

  const consultation = await Consultation.findById(consultationId);
  if (!consultation) {
    throw new AppError('Consultation not found', 404, ERROR_CODES.CONSULTATION_NOT_FOUND);
  }

  const escalatedConsultation = await Consultation.escalate(consultationId, {
    reason,
    escalatedBy: req.user.id,
    escalatedTo: escalateTo,
    escalatedAt: new Date()
  });

  // Log the admin action
  await AuditLog.create({
    userId: req.user.id,
    action: 'CONSULTATION_ESCALATE',
    resource: 'consultation',
    resourceId: consultationId,
    details: { reason, escalateTo },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Notify the new assignee if specified
  if (escalateTo) {
    await sendNotification(escalateTo, {
      type: 'CONSULTATION_ESCALATED',
      title: 'Consultation Escalated',
      message: `A consultation has been escalated to you. Reason: ${reason}`,
      data: { consultationId },
      priority: 'high'
    });
  }

  res.json({
    success: true,
    data: escalatedConsultation,
    message: 'Consultation escalated successfully'
  });
});

// ===========================================
// Reports
// ===========================================

/**
 * Generate custom report
 */
exports.generateReport = asyncHandler(async (req, res) => {
  const { reportType, format, dateRange, filters, includeCharts } = req.body;

  const report = await generateReport({
    type: reportType,
    format,
    dateRange,
    filters,
    includeCharts,
    generatedBy: req.user.id
  });

  // Log the admin action
  await AuditLog.create({
    userId: req.user.id,
    action: 'REPORT_GENERATE',
    resource: 'report',
    details: { reportType, format, dateRange },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json({
    success: true,
    data: report,
    message: 'Report generated successfully'
  });
});

/**
 * Get scheduled reports
 */
exports.getScheduledReports = asyncHandler(async (req, res) => {
  const schedules = await getReportSchedules();

  res.json({
    success: true,
    data: schedules
  });
});

/**
 * Schedule recurring report
 */
exports.scheduleReport = asyncHandler(async (req, res) => {
  const { reportType, frequency, format, recipients, filters } = req.body;

  const schedule = await createReportSchedule({
    reportType,
    frequency,
    format,
    recipients,
    filters,
    createdBy: req.user.id,
    createdAt: new Date()
  });

  // Log the admin action
  await AuditLog.create({
    userId: req.user.id,
    action: 'REPORT_SCHEDULE',
    resource: 'report_schedule',
    resourceId: schedule.id,
    details: { reportType, frequency, format, recipients },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json({
    success: true,
    data: schedule,
    message: 'Report scheduled successfully'
  });
});

/**
 * Delete scheduled report
 */
exports.deleteScheduledReport = asyncHandler(async (req, res) => {
  const { scheduleId } = req.params;

  await deleteReportSchedule(scheduleId);

  // Log the admin action
  await AuditLog.create({
    userId: req.user.id,
    action: 'REPORT_SCHEDULE_DELETE',
    resource: 'report_schedule',
    resourceId: scheduleId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json({
    success: true,
    message: 'Scheduled report deleted successfully'
  });
});

// ===========================================
// Audit Logs
// ===========================================

/**
 * Get audit logs
 */
exports.getAuditLogs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 50,
    action,
    userId,
    resource,
    from,
    to
  } = req.query;

  const logs = await AuditLog.findWithFilters({
    action,
    userId,
    resource,
    from: from ? new Date(from) : null,
    to: to ? new Date(to) : null,
    page: parseInt(page),
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: logs.items,
    pagination: logs.pagination
  });
});

/**
 * Export audit logs
 */
exports.exportAuditLogs = asyncHandler(async (req, res) => {
  const { format, from, to } = req.query;

  const logs = await AuditLog.findWithFilters({
    from: from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: to ? new Date(to) : new Date(),
    limit: 10000 // Reasonable limit for export
  });

  if (format === 'csv') {
    const csv = convertToCSV(logs.items);
    res.header('Content-Type', 'text/csv');
    res.attachment(`audit_logs_${new Date().toISOString()}.csv`);
    return res.send(csv);
  } else {
    res.json({
      success: true,
      data: logs.items
    });
  }
});

// ===========================================
// Bulk Operations
// ===========================================

/**
 * Bulk update user status
 */
exports.bulkUpdateUserStatus = asyncHandler(async (req, res) => {
  const { userIds, status, reason } = req.body;

  // Prevent admin from updating themselves
  if (userIds.includes(req.user.id)) {
    throw new AppError('Cannot update your own status in bulk operation', 400, ERROR_CODES.SELF_OPERATION_NOT_ALLOWED);
  }

  const result = await User.bulkUpdateStatus(userIds, {
    status,
    reason,
    updatedBy: req.user.id,
    updatedAt: new Date()
  });

  // Log the admin action
  await AuditLog.create({
    userId: req.user.id,
    action: 'BULK_USER_UPDATE',
    resource: 'user',
    details: { userIds, status, reason, count: userIds.length },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Send notifications to affected users
  for (const userId of userIds) {
    await sendNotification(userId, {
      type: 'ACCOUNT_STATUS_CHANGE',
      title: 'Account Status Updated',
      message: `Your account status has been changed to ${status}${reason ? `: ${reason}` : ''}`,
      priority: 'high'
    });
  }

  res.json({
    success: true,
    data: result,
    message: `Updated ${result.updated} users successfully`
  });
});

/**
 * Bulk update consultation status
 */
exports.bulkUpdateConsultationStatus = asyncHandler(async (req, res) => {
  const { consultationIds, status } = req.body;

  const result = await Consultation.bulkUpdateStatus(consultationIds, {
    status,
    updatedBy: req.user.id,
    updatedAt: new Date()
  });

  // Log the admin action
  await AuditLog.create({
    userId: req.user.id,
    action: 'BULK_CONSULTATION_UPDATE',
    resource: 'consultation',
    details: { consultationIds, status, count: consultationIds.length },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json({
    success: true,
    data: result,
    message: `Updated ${result.updated} consultations successfully`
  });
});

// ===========================================
// File Management
// ===========================================

/**
 * Upload admin files
 */
exports.uploadFiles = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError('No files uploaded', 400, ERROR_CODES.NO_FILES_UPLOADED);
  }

  const files = req.files.map(file => ({
    filename: file.filename,
    originalName: file.originalname,
    path: file.path,
    size: file.size,
    mimetype: file.mimetype,
    uploadedBy: req.user.id,
    uploadedAt: new Date()
  }));

  // Save file metadata to database
  const savedFiles = await saveFileMetadata(files);

  // Log the admin action
  await AuditLog.create({
    userId: req.user.id,
    action: 'FILES_UPLOAD',
    resource: 'file',
    details: { fileCount: files.length, files: savedFiles.map(f => f.id) },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json({
    success: true,
    data: savedFiles,
    message: `Uploaded ${files.length} file(s) successfully`
  });
});

/**
 * List uploaded files
 */
exports.listFiles = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type } = req.query;

  const files = await getFileList({
    type,
    page: parseInt(page),
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: files.items,
    pagination: files.pagination
  });
});

/**
 * Delete file
 */
exports.deleteFile = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  await deleteFile(fileId);

  // Log the admin action
  await AuditLog.create({
    userId: req.user.id,
    action: 'FILE_DELETE',
    resource: 'file',
    resourceId: fileId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json({
    success: true,
    message: 'File deleted successfully'
  });
});

// ===========================================
// Helper Functions
// ===========================================

async function getSystemHealthStatus() {
  const health = {
    status: 'healthy',
    components: {},
    timestamp: new Date().toISOString()
  };

  // Check PostgreSQL
  try {
    const pgClient = await pgPool.connect();
    await pgClient.query('SELECT 1');
    pgClient.release();
    health.components.postgresql = { status: 'healthy' };
  } catch (error) {
    health.components.postgresql = { status: 'unhealthy', error: error.message };
    health.status = 'degraded';
  }

  // Check CouchDB
  try {
    await couchServer.db.list();
    health.components.couchdb = { status: 'healthy' };
  } catch (error) {
    health.components.couchdb = { status: 'unhealthy', error: error.message };
    health.status = 'degraded';
  }

  // Check disk space
  const diskSpace = await checkDiskSpace();
  health.components.disk = diskSpace;
  if (diskSpace.available < 1024 * 1024 * 1024) { // Less than 1GB
    health.status = 'degraded';
  }

  // Check memory usage
  const memoryUsage = process.memoryUsage();
  health.components.memory = {
    used: memoryUsage.heapUsed,
    total: memoryUsage.heapTotal,
    rss: memoryUsage.rss,
    usagePercent: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100
  };

  return health;
}

async function getCouchDBMetrics() {
  try {
    const stats = await couchServer.db.stats();
    return {
      totalDocs: stats.doc_count,
      totalSize: stats.sizes.active,
      updateSeq: stats.update_seq
    };
  } catch (error) {
    logger.error('Error getting CouchDB metrics:', error);
    return { error: 'Unable to fetch metrics' };
  }
}

async function getRequestMetrics() {
  // This would typically come from your monitoring system
  // Placeholder implementation
  return {
    total: 0,
    perMinute: 0,
    errorRate: 0
  };
}

async function getAverageResponseTime() {
  // This would typically come from your monitoring system
  // Placeholder implementation
  return {
    average: 0,
    p95: 0,
    p99: 0
  };
}

async function checkDiskSpace() {
  // This would typically use a library like 'diskusage'
  // Placeholder implementation
  return {
    available: 10 * 1024 * 1024 * 1024, // 10GB
    total: 100 * 1024 * 1024 * 1024, // 100GB
    used: 90 * 1024 * 1024 * 1024 // 90GB
  };
}

async function getBackupList() {
  // This would list backups from your backup storage
  // Placeholder implementation
  return [];
}

async function getSystemConfiguration() {
  // This would return system configuration from database
  // Placeholder implementation
  return {
    maintenanceMode: false,
    maxUploadSize: 50 * 1024 * 1024, // 50MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    rateLimits: {
      api: 100,
      auth: 10
    },
    featureFlags: {
      aiDiagnostics: true,
      videoConsultation: true,
      offlineMode: true
    }
  };
}

async function updateSystemConfiguration(updates) {
  // This would update system configuration in database
  // Placeholder implementation
  return {
    ...await getSystemConfiguration(),
    ...updates,
    updatedAt: new Date()
  };
}

async function getReportSchedules() {
  // This would get scheduled reports from database
  // Placeholder implementation
  return [];
}

async function createReportSchedule(scheduleData) {
  // This would create a report schedule in database
  // Placeholder implementation
  return {
    id: generateId(),
    ...scheduleData,
    nextRunAt: calculateNextRun(scheduleData.frequency)
  };
}

async function deleteReportSchedule(scheduleId) {
  // This would delete a report schedule from database
  // Placeholder implementation
  return true;
}

async function saveFileMetadata(files) {
  // This would save file metadata to database
  // Placeholder implementation
  return files.map((file, index) => ({
    id: generateId(),
    ...file
  }));
}

async function getFileList({ type, page, limit }) {
  // This would get file list from database
  // Placeholder implementation
  return {
    items: [],
    pagination: { page, limit, total: 0, pages: 0 }
  };
}

async function deleteFile(fileId) {
  // This would delete file and its metadata
  // Placeholder implementation
  return true;
}

function generateId() {
  return 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function calculateNextRun(frequency) {
  const now = new Date();
  switch (frequency) {
    case 'daily':
      return new Date(now.setDate(now.getDate() + 1));
    case 'weekly':
      return new Date(now.setDate(now.getDate() + 7));
    case 'monthly':
      return new Date(now.setMonth(now.getMonth() + 1));
    case 'quarterly':
      return new Date(now.setMonth(now.getMonth() + 3));
    default:
      return new Date(now.setDate(now.getDate() + 1));
  }
}

function convertToCSV(items) {
  if (!items || items.length === 0) return '';

  const headers = Object.keys(items[0]);
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(','));

  // Add rows
  for (const item of items) {
    const values = headers.map(header => {
      const value = item[header] || '';
      return JSON.stringify(value);
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}