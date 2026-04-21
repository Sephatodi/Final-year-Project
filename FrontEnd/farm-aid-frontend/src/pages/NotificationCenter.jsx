import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Bell,
  Check,
  X,
  Archive,
  MessageCircle,
  Smartphone,
  ShieldAlert,
  ListTodo,
  ChevronRight,
  Trash2,
  Settings,
  Clock,
  PhoneCall,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import smsService from '../services/smsService';
import pushNotificationService from '../services/pushNotificationService';
import alertService from '../services/alertService';

const NotificationCenter = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, disease, consultation, vaccination
  const [loading, setLoading] = useState(false);
  
  const [notificationSettings, setNotificationSettings] = useState({
    pushEnabled: false,
    smsEnabled: true,
    emailEnabled: false,
    whatsappEnabled: false,
    diseaseAlerts: true,
    consultationUpdates: true,
    vaccinationReminders: true,
    marketPrices: false
  });

  const [activeTab, setActiveTab] = useState('notifications'); // notifications or settings

  // Initialize notifications on mount
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadNotifications();
    initializePushNotifications();
    loadSettings();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const initializePushNotifications = async () => {
    try {
      const isSupported = await pushNotificationService.init();
      if (isSupported) {
        const subscription = await pushNotificationService.getSubscription();
        setNotificationSettings(prev => ({
          ...prev,
          pushEnabled: !!subscription
        }));
      }
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
    }
  };

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Simulate loading notifications from backend
      // In production, this would call alertService.getAll()
      const mockNotifications = [
        {
          id: 1,
          type: 'disease_alert',
          title: 'FMD Alert - Central District',
          message: 'Foot and Mouth Disease detected. Movement restrictions in effect. Isolate your herd immediately.',
          severity: 'critical',
          timestamp: new Date(Date.now() - 2 * 60 * 60000),
          read: false,
          sent: {
            push: true,
            sms: true,
            email: false
          }
        },
        {
          id: 2,
          type: 'consultation_update',
          title: 'Dr. Kagiso accepted your case',
          message: 'Your consultation request #CONS-001 has been assigned to Dr. Kagiso. Start chat now.',
          severity: 'normal',
          timestamp: new Date(Date.now() - 24 * 60 * 60000),
          read: false,
          sent: {
            push: true,
            sms: false,
            email: false
          }
        },
        {
          id: 3,
          type: 'vaccination_reminder',
          title: 'Vaccination due - Bessie',
          message: 'Bessie (Cow ID: BW-2024-0034) is due for annual vaccination. Schedule appointment.',
          severity: 'medium',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000),
          read: true,
          sent: {
            push: true,
            sms: false,
            email: true
          }
        },
        {
          id: 4,
          type: 'market_price',
          title: 'Market Price Update',
          message: 'Cattle prices up 5% this week. Current rate: P28/kg. Check market trends.',
          severity: 'low',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60000),
          read: true,
          sent: {
            push: false,
            sms: false,
            email: false
          }
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      // Load settings from localStorage or backend
      const savedSettings = localStorage.getItem('notificationSettings');
      if (savedSettings) {
        setNotificationSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    }
  };

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleDeleteAll = () => {
    if (window.confirm('Delete all notifications?')) {
      setNotifications([]);
    }
  };

  const handleTogglePushNotifications = async () => {
    try {
      if (notificationSettings.pushEnabled) {
        await pushNotificationService.unsubscribe();
        setNotificationSettings(prev => ({
          ...prev,
          pushEnabled: false
        }));
      } else {
        await pushNotificationService.subscribe();
        setNotificationSettings(prev => ({
          ...prev,
          pushEnabled: true
        }));
      }
      saveSettings();
    } catch (error) {
      console.error('Failed to update push notification setting:', error);
    }
  };

  const handleToggleSMS = () => {
    setNotificationSettings(prev => ({
      ...prev,
      smsEnabled: !prev.smsEnabled
    }));
    saveSettings();
  };

  const handleSettingChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    saveSettings();
  };

  const saveSettings = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
  };

  const getFilteredNotifications = () => {
    return notifications.filter(notif => {
      if (filter === 'all') return true;
      if (filter === 'unread') return !notif.read;
      if (filter === 'disease') return notif.type === 'disease_alert';
      if (filter === 'consultation') return notif.type === 'consultation_update';
      if (filter === 'vaccination') return notif.type === 'vaccination_reminder';
      return true;
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'disease_alert':
        return <ShieldAlert className="w-5 h-5" />;
      case 'consultation_update':
        return <MessageCircle className="w-5 h-5" />;
      case 'vaccination_reminder':
        return <ListTodo className="w-5 h-5" />;
      case 'market_price':
        return <Smartphone className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'normal':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="bg-[#ea580c] p-2 rounded-xl text-white">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Notification Center</h1>
                <p className="text-sm text-gray-500">Stay updated on farm alerts & reminders</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{
              backgroundColor: isOnline ? '#dcfce7' : '#fef3c7',
              color: isOnline ? '#15803d' : '#b45309'
            }}>
              {isOnline ? (
                <><Wifi className="w-3 h-3" /> Online</>
              ) : (
                <><WifiOff className="w-3 h-3" /> Offline</>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'notifications'
                  ? 'bg-[#ea580c] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Bell className="w-4 h-4" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#ea580c] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {activeTab === 'notifications' ? (
          <>
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['all', 'unread', 'disease', 'consultation', 'vaccination'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    filter === f
                      ? 'bg-[#ea580c] text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-[#ea580c]'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            {unreadCount > 0 && (
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold hover:bg-blue-200 transition-all"
                >
                  <Check className="w-4 h-4" />
                  Mark All Read
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="mt-4 text-gray-500">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-500">You're all caught up!</p>
                </div>
              ) : (
                filteredNotifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-5 rounded-2xl border shadow-sm transition-all hover:shadow-md ${
                      notif.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                    } ${getSeverityColor(notif.severity)}`}
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notif.severity === 'critical'
                          ? 'bg-red-200 text-red-600'
                          : notif.severity === 'high'
                          ? 'bg-orange-200 text-orange-600'
                          : 'bg-blue-200 text-blue-600'
                      }`}>
                        {getNotificationIcon(notif.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-gray-900 mb-1">{notif.title}</h3>
                            <p className="text-sm text-gray-700 mb-3">{notif.message}</p>
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(notif.timestamp)}
                              </span>
                              <div className="flex gap-1">
                                {notif.sent.push && (
                                  <span className="text-xs bg-white px-2 py-1 rounded border border-gray-300 font-bold text-gray-700">
                                    Push
                                  </span>
                                )}
                                {notif.sent.sms && (
                                  <span className="text-xs bg-white px-2 py-1 rounded border border-gray-300 font-bold text-gray-700 flex items-center gap-1">
                                    <PhoneCall className="w-3 h-3" /> SMS
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            {!notif.read && (
                              <button
                                onClick={() => handleMarkAsRead(notif.id)}
                                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4 text-gray-400" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notif.id)}
                              className="p-2 hover:bg-white/50 rounded-lg transition-colors text-gray-400 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {notif.severity === 'critical' && (
                          <div className="mt-3 pt-3 border-t border-current/20">
                            <button className="flex items-center gap-2 font-bold hover:gap-3 transition-all text-sm">
                              Take Action <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Delete All Button */}
            {notifications.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="mt-8 text-sm text-gray-500 hover:text-red-600 font-bold flex items-center gap-2 mx-auto"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Notifications
              </button>
            )}
          </>
        ) : (
          // Settings Tab
          <div className="space-y-6 max-w-lg">
            <h2 className="text-xl font-black text-gray-900 mb-6">Notification Preferences</h2>

            {/* Notification Channels */}
            <section className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Channels</h3>
              <div className="space-y-4">
                {/* Push Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <h4 className="font-bold text-gray-900">Push Notifications</h4>
                    <p className="text-xs text-gray-500 mt-1">Instant alerts on your device</p>
                  </div>
                  <button
                    onClick={handleTogglePushNotifications}
                    className={`p-2 rounded-lg transition-colors ${
                      notificationSettings.pushEnabled
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Toggle2 className="w-6 h-6" />
                  </button>
                </div>

                {/* SMS Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <h4 className="font-bold text-gray-900">SMS Alerts</h4>
                    <p className="text-xs text-gray-500 mt-1">Works without internet or app</p>
                  </div>
                  <button
                    onClick={handleToggleSMS}
                    className={`p-2 rounded-lg transition-colors ${
                      notificationSettings.smsEnabled
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Toggle2 className="w-6 h-6" />
                  </button>
                </div>

                {/* Email Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <h4 className="font-bold text-gray-900">Email Notifications</h4>
                    <p className="text-xs text-gray-500 mt-1">Detailed updates via email</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('emailEnabled')}
                    className={`p-2 rounded-lg transition-colors ${
                      notificationSettings.emailEnabled
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Toggle2 className="w-6 h-6" />
                  </button>
                </div>

                {/* WhatsApp Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl opacity-50 cursor-not-allowed">
                  <div>
                    <h4 className="font-bold text-gray-900">WhatsApp Alerts</h4>
                    <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
                  </div>
                  <button disabled className="p-2 rounded-lg bg-gray-200 text-gray-600">
                    <Toggle2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </section>

            {/* Alert Types */}
            <section className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Alert Types</h3>
              <div className="space-y-4">
                {[
                  { key: 'diseaseAlerts', label: 'Disease Alerts', desc: 'Critical disease outbreaks & warnings' },
                  { key: 'consultationUpdates', label: 'Consultation Updates', desc: 'VetTeam response & analysis' },
                  { key: 'vaccinationReminders', label: 'Vaccination Reminders', desc: 'Schedule & due dates' },
                  { key: 'marketPrices', label: 'Market Prices', desc: 'Weekly price updates' }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <h4 className="font-bold text-gray-900">{item.label}</h4>
                      <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange(item.key)}
                      className={`p-2 rounded-lg transition-colors ${
                        notificationSettings[item.key]
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      <Toggle2 className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Save Notice */}
            <p className="text-xs text-gray-500 text-center">Settings are saved automatically</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificationCenter;
