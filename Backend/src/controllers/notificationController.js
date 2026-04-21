const { Notification, User, Consultation, Livestock } = require('../models');
const { Op } = require('sequelize');

// Get notifications for the current user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { filter = 'all', limit = 50, offset = 0 } = req.query;

    // Build where clause based on filter
    const whereClause = {
      userId,
      archived: false
    };

    if (filter === 'unread') {
      whereClause.read = false;
    } else if (filter !== 'all') {
      whereClause.type = filter;
    }

    // Fetch notifications with related data
    const { count, rows } = await Notification.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'relatedUser',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Consultation,
          attributes: ['id', 'subject', 'status', 'priority']
        },
        {
          model: Livestock,
          attributes: ['id', 'tagId', 'species', 'name']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Transform data for frontend
    const notifications = rows.map(notif => ({
      id: notif.id,
      type: notif.type,
      title: notif.title,
      message: notif.message,
      severity: notif.severity,
      timestamp: notif.createdAt,
      read: notif.read,
      archived: notif.archived,
      consultationId: notif.consultationId,
      livestockId: notif.livestockId,
      relatedUser: notif.relatedUser,
      consultation: notif.Consultation,
      livestock: notif.Livestock,
      actionUrl: notif.actionUrl,
      metadata: notif.metadata
    }));

    res.status(200).json({
      notifications,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ 
      message: 'Error fetching notifications',
      error: error.message 
    });
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.count({
      where: {
        userId,
        read: false,
        archived: false
      }
    });

    res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ 
      message: 'Error fetching unread count',
      error: error.message 
    });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id: notificationId, userId }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ 
      message: 'Notification marked as read',
      notification 
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ 
      message: 'Error marking notification as read',
      error: error.message 
    });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.update(
      { read: true },
      { where: { userId, archived: false } }
    );

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ 
      message: 'Error marking all notifications as read',
      error: error.message 
    });
  }
};

// Archive notification
exports.archiveNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id: notificationId, userId }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.archived = true;
    await notification.save();

    res.status(200).json({ 
      message: 'Notification archived',
      notification 
    });
  } catch (error) {
    console.error('Error archiving notification:', error);
    res.status(500).json({ 
      message: 'Error archiving notification',
      error: error.message 
    });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id: notificationId, userId }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.destroy();

    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ 
      message: 'Error deleting notification',
      error: error.message 
    });
  }
};

// Create notification (internal use by other services)
exports.createNotification = async (data) => {
  try {
    const notification = await Notification.create({
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      severity: data.severity || 'normal',
      consultationId: data.consultationId,
      livestockId: data.livestockId,
      relatedUserId: data.relatedUserId,
      actionUrl: data.actionUrl,
      metadata: data.metadata || {}
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};
