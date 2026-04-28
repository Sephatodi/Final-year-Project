import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  Check,
  Trash2,
  Archive,
  ShieldAlert,
  MessageCircle,
  ListTodo,
  Clock,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import notificationApi from '../../services/notificationApi';

const NotificationsModal = ({ isOpen, onClose, userRole }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, disease, consultation, vaccination

  // Load notifications based on filter
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch notifications from backend API
      const response = await notificationApi.getNotifications(filter, 50, 0);
      setNotifications(response.notifications || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = (id) => {
    notificationApi.markAsRead(id)
      .then(() => {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        );
      })
      .catch(err => console.error('Error marking as read:', err));
  };

  const handleDelete = (id) => {
    notificationApi.deleteNotification(id)
      .then(() => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
      })
      .catch(err => console.error('Error deleting notification:', err));
  };

  const handleArchive = (id) => {
    notificationApi.archiveNotification(id)
      .then(() => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
      })
      .catch(err => console.error('Error archiving notification:', err));
  };

  const handleMarkAllAsRead = () => {
    notificationApi.markAllAsRead()
      .then(() => {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, read: true }))
        );
      })
      .catch(err => console.error('Error marking all as read:', err));
  };

  const getFilteredNotifications = () => {
    return notifications.filter(notif => {
      if (filter === 'all') return true;
      if (filter === 'unread') return !notif.read;
      if (filter === 'disease') return notif.type === 'disease_alert' || notif.type === 'health_alert';
      if (filter === 'consultation') return notif.type.includes('consultation');
      if (filter === 'message') return notif.type === 'farmer_message' || notif.type === 'consultation_update';
      return true;
    });
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      'consultation_update': MessageCircle,
      'disease_alert': ShieldAlert,
      'vaccination_reminder': ListTodo,
      'new_consultation': AlertTriangle,
      'farmer_message': MessageCircle,
      'treatment_plan': Check,
      'health_alert': AlertTriangle
    };
    return iconMap[type] || Bell;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'high':
        return 'bg-orange-50 border-orange-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
      case 'normal':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getSeverityIconColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-600';
      case 'high':
        return 'bg-orange-100 text-orange-600';
      case 'medium':
        return 'bg-yellow-100 text-yellow-600';
      case 'low':
      case 'normal':
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };
     
  

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = getFilteredNotifications();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Right Sidebar Modal */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-white sticky top-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Notifications</h2>
                {unreadCount > 0 && (
                  <p className="text-xs text-gray-500">{unreadCount} unread</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 text-xs overflow-x-auto">
            {['all', 'unread', 'disease', 'consultation', 'message'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                  filter === f
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        {unreadCount > 0 && (
          <div className="px-4 py-2 bg-orange-50 border-b border-orange-100 flex gap-2">
            <button
              onClick={handleMarkAllAsRead}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-white border border-orange-200 text-orange-600 rounded-lg text-xs font-semibold hover:bg-orange-50 transition-colors"
              title="Mark all as read"
            >
              <Check className="w-4 h-4" />
              Mark All Read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="p-4 m-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-semibold text-sm">{error}</p>
              <button
                onClick={fetchNotifications}
                className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
              >
                Retry
              </button>
            </div>
          )}
          {loading && !error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-orange-500 mx-auto mb-2 animate-spin" />
                <p className="text-sm text-gray-500">Loading notifications...</p>
              </div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No notifications</p>
              </div>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {filteredNotifications.map(notif => {
                const IconComponent = getNotificationIcon(notif.type);
                return (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg border transition-all ${
                      getSeverityColor(notif.severity)
                    } ${notif.read ? 'opacity-70' : 'opacity-100'}`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getSeverityIconColor(notif.severity)}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className={`text-sm font-semibold text-gray-900 ${!notif.read ? 'font-bold' : ''}`}>
                            {notif.title}
                          </h3>
                          {!notif.read && (
                            <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {notif.message}
                        </p>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(notif.timestamp)}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-1">
                        {!notif.read && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="p-1.5 rounded hover:bg-white/50 transition-colors text-gray-500 hover:text-gray-700"
                            title="Mark as read"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleArchive(notif.id)}
                          className="p-1.5 rounded hover:bg-white/50 transition-colors text-gray-500 hover:text-orange-600"
                          title="Archive"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="p-1.5 rounded hover:bg-white/50 transition-colors text-gray-500 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </>
  );
};

export default NotificationsModal;
