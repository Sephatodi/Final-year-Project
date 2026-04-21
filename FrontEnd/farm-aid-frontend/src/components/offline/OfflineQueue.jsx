import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOffline } from '../../hooks/useOffline';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';

const OfflineQueue = ({ onProcessItem, onClearQueue }) => {
  const { t } = useTranslation();
  const { isOffline } = useOffline();

  const [queueItems, setQueueItems] = useState([
    {
      id: 1,
      type: 'livestock',
      action: 'create',
      data: { name: 'Cow #102', species: 'cattle' },
      timestamp: '2024-03-14T10:15:00',
      retryCount: 0,
      status: 'pending'
    },
    {
      id: 2,
      type: 'health_record',
      action: 'update',
      data: { animalId: 54, diagnosis: 'Fever' },
      timestamp: '2024-03-14T09:30:00',
      retryCount: 1,
      status: 'pending'
    },
    {
      id: 3,
      type: 'disease_report',
      action: 'create',
      data: { disease: 'FMD', location: 'Francistown' },
      timestamp: '2024-03-13T16:20:00',
      retryCount: 2,
      status: 'failed'
    },
  ]);

  const getTypeIcon = (type) => {
    switch(type) {
      case 'livestock': return 'pets';
      case 'health_record': return 'medical_services';
      case 'disease_report': return 'warning';
      case 'consultation': return 'chat';
      default: return 'article';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-sage-100 text-sage-700';
    }
  };

  const handleRetry = (id) => {
    setQueueItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: 'pending', retryCount: item.retryCount + 1 }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setQueueItems(prev => prev.filter(item => item.id !== id));
  };

  const handleProcessAll = () => {
    setQueueItems(prev =>
      prev.map(item => ({ ...item, status: 'processing' }))
    );
  };

  const pendingCount = queueItems.filter(i => i.status === 'pending').length;
  const failedCount = queueItems.filter(i => i.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('offline.queue') || 'Offline Queue'}</h2>
          <p className="text-sage-500">{t('offline.queueSubtitle') || 'Pending operations to sync'}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="warning" size="lg">
            {pendingCount} {t('offline.pending') || 'Pending'}
          </Badge>
          {failedCount > 0 && (
            <Badge variant="critical" size="lg">
              {failedCount} {t('offline.failed') || 'Failed'}
            </Badge>
          )}
        </div>
      </div>

      {/* Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">{queueItems.length}</div>
          <div className="text-xs text-sage-500">{t('offline.totalItems') || 'Total Items'}</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
          <div className="text-xs text-sage-500">{t('offline.pending') || 'Pending'}</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {queueItems.filter(i => i.status === 'completed').length}
          </div>
          <div className="text-xs text-sage-500">{t('offline.completed') || 'Completed'}</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-red-600">{failedCount}</div>
          <div className="text-xs text-sage-500">{t('offline.failed') || 'Failed'}</div>
        </Card>
      </div>

      {/* Queue Actions */}
      <div className="flex gap-3">
        <Button
          variant="primary"
          onClick={handleProcessAll}
          disabled={pendingCount === 0 || !isOffline}
          icon="play_arrow"
        >
          {t('offline.processAll') || 'Process All'}
        </Button>
        <Button
          variant="secondary"
          onClick={onClearQueue}
          icon="clear_all"
        >
          {t('offline.clearQueue') || 'Clear Queue'}
        </Button>
      </div>

      {/* Queue Items */}
      <Card className="overflow-hidden">
        <div className="divide-y divide-sage-200 dark:divide-sage-800">
          {queueItems.map(item => (
            <div key={item.id} className="p-4 hover:bg-sage-50 dark:hover:bg-sage-900/20 transition-colors">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-2 rounded-lg ${
                  item.status === 'failed' ? 'bg-red-100' :
                  item.status === 'processing' ? 'bg-blue-100' :
                  'bg-sage-100'
                }`}>
                  <span className={`material-icons-outlined ${
                    item.status === 'failed' ? 'text-red-600' :
                    item.status === 'processing' ? 'text-blue-600' :
                    'text-sage-600'
                  }`}>
                    {getTypeIcon(item.type)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium capitalize">{item.type.replace('_', ' ')}</h4>
                        <Badge size="sm" variant={
                          item.status === 'pending' ? 'warning' :
                          item.status === 'processing' ? 'info' :
                          item.status === 'completed' ? 'success' : 'critical'
                        }>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-sage-600">
                        {t('offline.action') || 'Action'}: {item.action}
                      </p>
                      <p className="text-xs text-sage-400 mt-1">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                      {item.retryCount > 0 && (
                        <p className="text-xs text-amber-600 mt-1">
                          {t('offline.retryCount') || 'Retry'}: {item.retryCount}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                      {item.status === 'failed' && (
                        <button
                          onClick={() => handleRetry(item.id)}
                          className="p-2 hover:bg-sage-200 dark:hover:bg-sage-800 rounded-lg"
                          title={t('common.retry') || 'Retry'}
                        >
                          <span className="material-icons-outlined text-sm">refresh</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-2 hover:bg-sage-200 dark:hover:bg-sage-800 rounded-lg"
                        title={t('common.remove') || 'Remove'}
                      >
                        <span className="material-icons-outlined text-sm">close</span>
                      </button>
                    </div>
                  </div>

                  {/* Data Preview */}
                  <div className="mt-3 p-2 bg-sage-100 dark:bg-sage-800 rounded text-xs font-mono">
                    {JSON.stringify(item.data, null, 2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {queueItems.length === 0 && (
          <div className="p-12 text-center">
            <span className="material-icons-outlined text-5xl text-sage-300 mb-4">queue</span>
            <p className="text-sage-500">{t('offline.queueEmpty') || 'Queue is empty'}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

OfflineQueue.propTypes = {
  onProcessItem: PropTypes.func,
  onClearQueue: PropTypes.func,
};

export default OfflineQueue;