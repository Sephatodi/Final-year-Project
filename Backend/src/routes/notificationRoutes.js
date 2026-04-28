const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

// All notification routes require authentication
router.use(authenticate);

// Get unread notification count (must be before /:notificationId routes)
router.get('/unread/count', notificationController.getUnreadCount);

// Get all notifications for current user
router.get('/', notificationController.getNotifications);

// Mark all notifications as read (must be before /:notificationId routes)
router.put('/read/all', notificationController.markAllAsRead);

// Mark notification as read
router.put('/:notificationId/read', notificationController.markAsRead);

// Archive notification
router.put('/:notificationId/archive', notificationController.archiveNotification);

// Delete notification
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router;
