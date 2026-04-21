import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';

const ConflictResolver = ({ conflicts = [], onResolve }) => {
  const { t } = useTranslation();
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [resolution, setResolution] = useState('');

  const mockConflicts = conflicts.length ? conflicts : [
    {
      id: 1,
      type: 'livestock',
      entityId: 'C-102',
      field: 'weight',
      localValue: '450',
      serverValue: '425',
      timestamp: '2024-03-14T10:30:00',
      resolved: false
    },
    {
      id: 2,
      type: 'health_record',
      entityId: 'HR-054',
      field: 'diagnosis',
      localValue: 'Fever',
      serverValue: 'Infection',
      timestamp: '2024-03-14T09:15:00',
      resolved: false
    },
    {
      id: 3,
      type: 'disease_report',
      entityId: 'RPT-123',
      field: 'status',
      localValue: 'pending',
      serverValue: 'investigating',
      timestamp: '2024-03-13T16:20:00',
      resolved: true
    },
  ];

  const getTypeIcon = (type) => {
    switch(type) {
      case 'livestock': return 'pets';
      case 'health_record': return 'medical_services';
      case 'disease_report': return 'warning';
      default: return 'article';
    }
  };

  const unresolvedCount = mockConflicts.filter(c => !c.resolved).length;

  const handleResolve = (conflictId, choice) => {
    setResolution(choice);
    if (onResolve) {
      onResolve(conflictId, choice);
    }
    setSelectedConflict(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('offline.conflictResolver') || 'Conflict Resolver'}</h2>
          <p className="text-sage-500">{t('offline.conflictSubtitle') || 'Resolve data conflicts'}</p>
        </div>
        <Badge variant={unresolvedCount > 0 ? 'critical' : 'success'} size="lg">
          {unresolvedCount} {t('offline.unresolved') || 'unresolved'}
        </Badge>
      </div>

      {/* Instructions */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
        <div className="flex items-start gap-2">
          <span className="material-icons-outlined text-blue-600">info</span>
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
              {t('offline.conflictHelp') || 'How to resolve conflicts'}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              {t('offline.conflictInstructions') || 'Choose which version to keep when data differs between local and server.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Conflicts List */}
      <div className="space-y-4">
        {mockConflicts.map(conflict => (
          <Card
            key={conflict.id}
            className={`p-6 ${conflict.resolved ? 'opacity-50' : ''}`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`p-3 rounded-xl ${
                conflict.resolved ? 'bg-green-100' : 'bg-amber-100'
              }`}>
                <span className={`material-icons-outlined ${
                  conflict.resolved ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {getTypeIcon(conflict.type)}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold capitalize">{conflict.type.replace('_', ' ')}</h3>
                      <Badge size="sm" variant={conflict.resolved ? 'success' : 'critical'}>
                        {conflict.resolved ? t('offline.resolved') || 'Resolved' : t('offline.unresolved') || 'Unresolved'}
                      </Badge>
                    </div>
                    <p className="text-sm text-sage-500">
                      {t('offline.entity') || 'Entity'}: {conflict.entityId}
                    </p>
                    <p className="text-xs text-sage-400">
                      {new Date(conflict.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Conflict Details */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
                    <p className="text-xs text-sage-500 mb-1">{t('offline.localVersion') || 'Local Version'}</p>
                    <p className="font-medium">{conflict.field}: {conflict.localValue}</p>
                  </div>
                  <div className="p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
                    <p className="text-xs text-sage-500 mb-1">{t('offline.serverVersion') || 'Server Version'}</p>
                    <p className="font-medium">{conflict.field}: {conflict.serverValue}</p>
                  </div>
                </div>

                {/* Resolution Actions */}
                {!conflict.resolved && (
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleResolve(conflict.id, 'local')}
                    >
                      {t('offline.keepLocal') || 'Keep Local'}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleResolve(conflict.id, 'server')}
                    >
                      {t('offline.keepServer') || 'Keep Server'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedConflict(conflict.id)}
                    >
                      {t('offline.manual') || 'Manual Merge'}
                    </Button>
                  </div>
                )}

                {/* Manual Merge Input */}
                {selectedConflict === conflict.id && (
                  <div className="mt-4 space-y-3">
                    <input
                      type="text"
                      className="w-full p-2 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900"
                      placeholder={t('offline.enterValue') || 'Enter merged value...'}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" variant="primary">
                        {t('common.apply') || 'Apply'}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedConflict(null)}>
                        {t('common.cancel') || 'Cancel'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bulk Actions */}
      {unresolvedCount > 0 && (
        <div className="flex gap-4">
          <Button
            variant="primary"
            onClick={() => handleResolve('all', 'local')}
            icon="done_all"
            fullWidth
          >
            {t('offline.resolveAllLocal') || 'Resolve All (Keep Local)'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleResolve('all', 'server')}
            icon="cloud_done"
            fullWidth
          >
            {t('offline.resolveAllServer') || 'Resolve All (Keep Server)'}
          </Button>
        </div>
      )}
    </div>
  );
};

ConflictResolver.propTypes = {
  conflicts: PropTypes.array,
  onResolve: PropTypes.func,
};

export default ConflictResolver;