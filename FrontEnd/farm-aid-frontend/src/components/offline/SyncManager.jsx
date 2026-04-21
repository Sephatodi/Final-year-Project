import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOffline } from '../../hooks/useOffline';
import { useSync } from '../../hooks/useSync';
import Alert from '../common/Alert';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';

const SyncManager = ({ onSyncComplete }) => {
  const { t } = useTranslation();
  const { isOffline } = useOffline();
  const { 
    isSyncing, 
    lastSync, 
    pendingChanges, 
    syncError, 
    syncNow,
    getSyncStatus 
  } = useSync();

  const [syncHistory, setSyncHistory] = useState([]);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [syncProgress, setSyncProgress] = useState(null);

  useEffect(() => {
    loadSyncHistory();
  }, []);

  const loadSyncHistory = async () => {
    // Mock sync history
    setSyncHistory([
      { id: 1, timestamp: '2024-03-14T10:30:00', status: 'success', items: 15, duration: '2.3s' },
      { id: 2, timestamp: '2024-03-13T15:45:00', status: 'success', items: 23, duration: '3.1s' },
      { id: 3, timestamp: '2024-03-12T09:20:00', status: 'partial', items: 8, failed: 2, duration: '4.5s' },
      { id: 4, timestamp: '2024-03-11T14:15:00', status: 'failed', items: 0, error: 'Connection timeout', duration: '10.2s' },
    ]);
  };

  const handleSync = async () => {
    setSyncProgress({ current: 0, total: pendingChanges });
    await syncNow();
    setSyncProgress(null);
    if (onSyncComplete) {
      onSyncComplete();
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'success': return 'check_circle';
      case 'partial': return 'warning';
      case 'failed': return 'error';
      default: return 'sync';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'text-green-600';
      case 'partial': return 'text-amber-600';
      case 'failed': return 'text-red-600';
      default: return 'text-sage-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('offline.syncManager') || 'Sync Manager'}</h2>
          <p className="text-sage-500">{t('offline.syncSubtitle') || 'Manage data synchronization'}</p>
        </div>
        <Badge variant={isOffline ? 'warning' : 'success'} size="lg">
          {isOffline ? t('common.offline') || 'Offline' : t('common.online') || 'Online'}
        </Badge>
      </div>

      {/* Current Status Card */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">{t('offline.currentStatus') || 'Current Status'}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {pendingChanges}
            </div>
            <p className="text-sm text-sage-500">{t('offline.pendingChanges') || 'Pending Changes'}</p>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {lastSync ? new Date(lastSync).toLocaleTimeString() : '—'}
            </div>
            <p className="text-sm text-sage-500">{t('offline.lastSync') || 'Last Sync'}</p>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {syncHistory.filter(h => h.status === 'success').length}
            </div>
            <p className="text-sm text-sage-500">{t('offline.successfulSyncs') || 'Successful Syncs'}</p>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              156 MB
            </div>
            <p className="text-sm text-sage-500">{t('offline.storageUsed') || 'Storage Used'}</p>
          </div>
        </div>

        {/* Sync Button */}
        <div className="mt-6">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSync}
            loading={isSyncing}
            disabled={isOffline || pendingChanges === 0}
            icon="sync"
            fullWidth
          >
            {isSyncing 
              ? t('offline.syncing') || 'Syncing...' 
              : pendingChanges > 0 
                ? t('offline.syncNow') || 'Sync Now' 
                : t('offline.allSynced') || 'All Synced'}
          </Button>

          {isOffline && (
            <p className="text-sm text-amber-600 mt-2 text-center">
              {t('offline.cannotSync') || 'Cannot sync while offline'}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        {syncProgress && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{t('offline.syncing') || 'Syncing...'}</span>
              <span>{Math.round((syncProgress.current / syncProgress.total) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-sage-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(syncProgress.current / syncProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {syncError && (
          <Alert
            type="error"
            message={syncError}
            className="mt-4"
            dismissible
          />
        )}
      </Card>

      {/* Auto Sync Settings */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">{t('offline.autoSync') || 'Auto Sync'}</h3>
            <p className="text-sm text-sage-500">
              {t('offline.autoSyncHelp') || 'Automatically sync when online'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoSyncEnabled}
              onChange={() => setAutoSyncEnabled(!autoSyncEnabled)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-sage-300 rounded-full peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/50 transition-colors"></div>
            <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
          </label>
        </div>

        {autoSyncEnabled && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <select className="p-2 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900">
              <option value="15">15 {t('common.minutes') || 'minutes'}</option>
              <option value="30">30 {t('common.minutes') || 'minutes'}</option>
              <option value="60">1 {t('common.hour') || 'hour'}</option>
              <option value="120">2 {t('common.hours') || 'hours'}</option>
            </select>

            <select className="p-2 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900">
              <option value="wifi">{t('offline.wifiOnly') || 'Wi-Fi only'}</option>
              <option value="any">{t('offline.anyNetwork') || 'Any network'}</option>
            </select>
          </div>
        )}
      </Card>

      {/* Sync History */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">{t('offline.syncHistory') || 'Sync History'}</h3>

        <div className="space-y-3">
          {syncHistory.map(entry => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className={`material-icons-outlined ${getStatusColor(entry.status)}`}>
                  {getStatusIcon(entry.status)}
                </span>
                <div>
                  <p className="font-medium">{formatDate(entry.timestamp)}</p>
                  <div className="flex items-center gap-2 text-xs text-sage-500">
                    <span>{entry.items} {t('offline.items') || 'items'}</span>
                    {entry.failed && (
                      <span className="text-red-600">{entry.failed} {t('offline.failed') || 'failed'}</span>
                    )}
                    <span>• {entry.duration}</span>
                  </div>
                </div>
              </div>
              {entry.error && (
                <span className="text-xs text-red-600" title={entry.error}>
                  {t('offline.error') || 'Error'}
                </span>
              )}
            </div>
          ))}
        </div>

        <Button variant="ghost" className="mt-4" icon="history" fullWidth>
          {t('offline.viewAll') || 'View All History'}
        </Button>
      </Card>
    </div>
  );
};

SyncManager.propTypes = {
  onSyncComplete: PropTypes.func,
};

export default SyncManager;