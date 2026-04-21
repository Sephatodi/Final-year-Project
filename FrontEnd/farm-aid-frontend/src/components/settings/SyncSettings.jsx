import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOffline } from '../../hooks/useOffline';
import { useSync } from '../../hooks/useSync';
import Alert from '../common/Alert';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';

const SyncSettings = ({ onUpdate }) => {
  const { t } = useTranslation();
  const { lastSync, pendingChanges, syncNow, isSyncing } = useSync();
  const { isOffline } = useOffline();

  const [settings, setSettings] = useState({
    autoSync: true,
    syncInterval: 60, // minutes
    syncOnWifiOnly: true,
    syncOnMobileData: false,
    syncImages: true,
    syncVideos: false,
    maxSyncSize: 50, // MB
    backgroundSync: true,
    conflictResolution: 'server-wins',
    retentionDays: 30,
  });

  const [success, setSuccess] = useState(false);
  const [syncHistory, setSyncHistory] = useState([
    { id: 1, timestamp: '2024-03-14T10:30:00', status: 'success', items: 15 },
    { id: 2, timestamp: '2024-03-13T15:45:00', status: 'success', items: 23 },
    { id: 3, timestamp: '2024-03-12T09:20:00', status: 'partial', items: 8, failed: 2 },
  ]);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    if (onUpdate) {
      onUpdate(settings);
    }
  };

  const handleManualSync = async () => {
    await syncNow();
  };

  const handleClearCache = () => {
    if (window.confirm(t('settings.confirmClearCache') || 'Clear all cached data?')) {
      // Clear cache logic
      alert(t('settings.cacheCleared') || 'Cache cleared successfully');
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">{t('settings.sync') || 'Sync Settings'}</h2>

        {success && (
          <Alert
            type="success"
            message={t('settings.syncUpdated') || 'Sync settings updated!'}
            className="mb-6"
            dismissible
            autoDismiss
          />
        )}

        {/* Current Status */}
        <div className="mb-8 p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
          <h3 className="font-bold mb-4">{t('settings.currentStatus') || 'Current Status'}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-sage-500">{t('settings.connection') || 'Connection'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-red-500' : 'bg-green-500'}`}></span>
                <span className="font-medium">{isOffline ? t('common.offline') || 'Offline' : t('common.online') || 'Online'}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('settings.lastSync') || 'Last Sync'}</p>
              <p className="font-medium mt-1">{lastSync ? formatDate(lastSync) : t('common.never') || 'Never'}</p>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('settings.pending') || 'Pending'}</p>
              <p className="font-medium mt-1">{pendingChanges} {t('settings.changes') || 'changes'}</p>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('settings.storage') || 'Storage'}</p>
              <p className="font-medium mt-1">156 MB / 500 MB</p>
            </div>
          </div>
        </div>

        {/* Sync Now Button */}
        <div className="mb-8">
          <Button
            variant="primary"
            size="lg"
            onClick={handleManualSync}
            loading={isSyncing}
            disabled={isOffline}
            icon="sync"
            fullWidth
          >
            {isSyncing ? t('settings.syncing') || 'Syncing...' : t('settings.syncNow') || 'Sync Now'}
          </Button>
          {isOffline && (
            <p className="text-sm text-amber-600 mt-2 text-center">
              {t('settings.cannotSyncOffline') || 'Cannot sync while offline'}
            </p>
          )}
        </div>

        {/* Auto Sync Settings */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg">{t('settings.autoSync') || 'Auto Sync'}</h3>

          <label className="flex items-center justify-between p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium">{t('settings.enableAutoSync') || 'Enable Auto Sync'}</p>
              <p className="text-xs text-sage-500">
                {t('settings.autoSyncHelp') || 'Automatically sync data when online'}
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSync}
              onChange={() => handleToggle('autoSync')}
              className="w-5 h-5 rounded border-sage-300 text-primary focus:ring-primary"
            />
          </label>

          {settings.autoSync && (
            <div className="space-y-4 ml-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('settings.syncInterval') || 'Sync Interval (minutes)'}
                </label>
                <select
                  name="syncInterval"
                  value={settings.syncInterval}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900"
                >
                  <option value="15">15 {t('common.minutes') || 'minutes'}</option>
                  <option value="30">30 {t('common.minutes') || 'minutes'}</option>
                  <option value="60">1 {t('common.hour') || 'hour'}</option>
                  <option value="120">2 {t('common.hours') || 'hours'}</option>
                  <option value="360">6 {t('common.hours') || 'hours'}</option>
                </select>
              </div>

              <label className="flex items-center justify-between p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium">{t('settings.wifiOnly') || 'Wi-Fi Only'}</p>
                  <p className="text-xs text-sage-500">
                    {t('settings.wifiHelp') || 'Only sync on Wi-Fi connection'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.syncOnWifiOnly}
                  onChange={() => handleToggle('syncOnWifiOnly')}
                  className="w-5 h-5 rounded border-sage-300 text-primary focus:ring-primary"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium">{t('settings.mobileData') || 'Allow Mobile Data'}</p>
                  <p className="text-xs text-sage-500">
                    {t('settings.mobileHelp') || 'Sync using mobile data when Wi-Fi unavailable'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.syncOnMobileData}
                  onChange={() => handleToggle('syncOnMobileData')}
                  className="w-5 h-5 rounded border-sage-300 text-primary focus:ring-primary"
                />
              </label>
            </div>
          )}

          <h3 className="font-bold text-lg mt-8">{t('settings.dataSync') || 'Data Sync'}</h3>

          <label className="flex items-center justify-between p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium">{t('settings.syncImages') || 'Sync Images'}</p>
              <p className="text-xs text-sage-500">
                {t('settings.imagesHelp') || 'Sync animal photos and documents'}
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.syncImages}
              onChange={() => handleToggle('syncImages')}
              className="w-5 h-5 rounded border-sage-300 text-primary focus:ring-primary"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium">{t('settings.syncVideos') || 'Sync Videos'}</p>
              <p className="text-xs text-sage-500">
                {t('settings.videosHelp') || 'Sync consultation recordings'}
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.syncVideos}
              onChange={() => handleToggle('syncVideos')}
              className="w-5 h-5 rounded border-sage-300 text-primary focus:ring-primary"
            />
          </label>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('settings.maxSyncSize') || 'Max Sync Size (MB)'}
            </label>
            <input
              type="range"
              name="maxSyncSize"
              min="10"
              max="200"
              value={settings.maxSyncSize}
              onChange={handleChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-sage-500 mt-1">
              <span>10 MB</span>
              <span>{settings.maxSyncSize} MB</span>
              <span>200 MB</span>
            </div>
          </div>

          <h3 className="font-bold text-lg mt-8">{t('settings.advanced') || 'Advanced'}</h3>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('settings.conflictResolution') || 'Conflict Resolution'}
            </label>
            <select
              name="conflictResolution"
              value={settings.conflictResolution}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900"
            >
              <option value="server-wins">{t('settings.serverWins') || 'Server version wins'}</option>
              <option value="client-wins">{t('settings.clientWins') || 'Local version wins'}</option>
              <option value="manual">{t('settings.manual') || 'Ask me each time'}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('settings.retention') || 'Data Retention (days)'}
            </label>
            <input
              type="number"
              name="retentionDays"
              value={settings.retentionDays}
              onChange={handleChange}
              min="7"
              max="365"
              className="w-full p-2 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900"
            />
          </div>

          {/* Sync History */}
          <div className="mt-8">
            <h3 className="font-bold text-lg mb-4">{t('settings.syncHistory') || 'Sync History'}</h3>
            <div className="space-y-2">
              {syncHistory.map(entry => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={entry.status === 'success' ? 'success' : 'warning'} size="sm">
                      {entry.status}
                    </Badge>
                    <span className="text-sm">{formatDate(entry.timestamp)}</span>
                  </div>
                  <span className="text-sm text-sage-500">
                    {entry.items} {t('settings.items') || 'items'}
                    {entry.failed && ` (${entry.failed} failed)`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-8 p-4 border-2 border-red-200 dark:border-red-800 rounded-lg">
            <h3 className="font-bold text-lg text-red-600 mb-4">{t('settings.dangerZone') || 'Danger Zone'}</h3>
            
            <div className="space-y-4">
              <Button
                variant="danger"
                onClick={handleClearCache}
                icon="delete_sweep"
                fullWidth
              >
                {t('settings.clearCache') || 'Clear Cache'
                }
              </Button>

              <Button
                variant="danger"
                onClick={() => {/* Reset all data */}}
                icon="delete_forever"
                fullWidth
              >
                {t('settings.resetAll') || 'Reset All Data'}
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6">
            <Button
              variant="primary"
              onClick={handleSave}
              icon="save"
            >
              {t('common.saveChanges') || 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

SyncSettings.propTypes = {
  onUpdate: PropTypes.func,
};

export default SyncSettings;