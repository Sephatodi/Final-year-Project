import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';

const PendingChanges = ({ onSync, onReview }) => {
  const { t } = useTranslation();

  const [changes, setChanges] = useState({
    livestock: { added: 3, updated: 5, deleted: 1 },
    healthRecords: { added: 8, updated: 2, deleted: 0 },
    diseaseReports: { added: 1, updated: 0, deleted: 0 },
    consultations: { added: 2, updated: 1, deleted: 0 },
  });

  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: t('offline.all'), icon: 'apps', count: getTotalCount() },
    { id: 'livestock', label: t('offline.livestock'), icon: 'pets', count: getCategoryCount('livestock') },
    { id: 'healthRecords', label: t('offline.healthRecords'), icon: 'medical_services', count: getCategoryCount('healthRecords') },
    { id: 'diseaseReports', label: t('offline.diseaseReports'), icon: 'warning', count: getCategoryCount('diseaseReports') },
    { id: 'consultations', label: t('offline.consultations'), icon: 'chat', count: getCategoryCount('consultations') },
  ];

  function getCategoryCount(category) {
    const c = changes[category];
    return c ? c.added + c.updated + c.deleted : 0;
  }

  function getTotalCount() {
    return Object.values(changes).reduce((total, cat) => 
      total + cat.added + cat.updated + cat.deleted, 0
    );
  }

  const totalChanges = getTotalCount();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('offline.pendingChanges') || 'Pending Changes'}</h2>
          <p className="text-sage-500">{t('offline.pendingSubtitle') || 'Review changes before syncing'}</p>
        </div>
        <Badge variant="warning" size="lg" icon="pending">
          {totalChanges} {t('offline.changes') || 'changes'}
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="material-icons-outlined text-green-600">add_circle</span>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('offline.added') || 'Added'}</p>
              <p className="text-xl font-bold">
                {Object.values(changes).reduce((sum, cat) => sum + cat.added, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="material-icons-outlined text-blue-600">edit</span>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('offline.updated') || 'Updated'}</p>
              <p className="text-xl font-bold">
                {Object.values(changes).reduce((sum, cat) => sum + cat.updated, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="material-icons-outlined text-red-600">delete</span>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('offline.deleted') || 'Deleted'}</p>
              <p className="text-xl font-bold">
                {Object.values(changes).reduce((sum, cat) => sum + cat.deleted, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="material-icons-outlined text-purple-600">storage</span>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('offline.total') || 'Total'}</p>
              <p className="text-xl font-bold">{totalChanges}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-primary text-white'
                : 'bg-sage-100 dark:bg-sage-800 text-sage-600 hover:bg-primary/10'
            }`}
          >
            <span className="material-icons-outlined text-sm">{cat.icon}</span>
            {cat.label}
            {cat.count > 0 && (
              <Badge size="sm" variant={selectedCategory === cat.id ? 'white' : 'default'}>
                {cat.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Changes List */}
      <Card className="overflow-hidden">
        <div className="divide-y divide-sage-200 dark:divide-sage-800">
          {/* Livestock Changes */}
          {(selectedCategory === 'all' || selectedCategory === 'livestock') && (
            <div className="p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span className="material-icons-outlined text-primary">pets</span>
                {t('offline.livestock') || 'Livestock'}
              </h3>
              <div className="space-y-2">
                {changes.livestock.added > 0 && (
                  <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="flex items-center gap-2">
                      <span className="material-icons-outlined text-green-600 text-sm">add</span>
                      <span className="text-sm">{changes.livestock.added} {t('offline.newAnimals') || 'new animals'}</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => onReview?.('livestock', 'added')}>
                      {t('common.view') || 'View'}
                    </Button>
                  </div>
                )}
                {changes.livestock.updated > 0 && (
                  <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="flex items-center gap-2">
                      <span className="material-icons-outlined text-blue-600 text-sm">edit</span>
                      <span className="text-sm">{changes.livestock.updated} {t('offline.updatedAnimals') || 'updated animals'}</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => onReview?.('livestock', 'updated')}>
                      {t('common.view') || 'View'}
                    </Button>
                  </div>
                )}
                {changes.livestock.deleted > 0 && (
                  <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <div className="flex items-center gap-2">
                      <span className="material-icons-outlined text-red-600 text-sm">delete</span>
                      <span className="text-sm">{changes.livestock.deleted} {t('offline.deletedAnimals') || 'deleted animals'}</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => onReview?.('livestock', 'deleted')}>
                      {t('common.view') || 'View'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Health Records Changes */}
          {(selectedCategory === 'all' || selectedCategory === 'healthRecords') && (
            <div className="p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span className="material-icons-outlined text-primary">medical_services</span>
                {t('offline.healthRecords') || 'Health Records'}
              </h3>
              <div className="space-y-2">
                {changes.healthRecords.added > 0 && (
                  <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <span>{changes.healthRecords.added} {t('offline.newRecords') || 'new records'}</span>
                    <Button size="sm" variant="ghost">View</Button>
                  </div>
                )}
                {changes.healthRecords.updated > 0 && (
                  <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <span>{changes.healthRecords.updated} {t('offline.updatedRecords') || 'updated records'}</span>
                    <Button size="sm" variant="ghost">View</Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Disease Reports */}
          {(selectedCategory === 'all' || selectedCategory === 'diseaseReports') && (
            <div className="p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span className="material-icons-outlined text-primary">warning</span>
                {t('offline.diseaseReports') || 'Disease Reports'}
              </h3>
              {changes.diseaseReports.added > 0 && (
                <div className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                  <span>{changes.diseaseReports.added} {t('offline.pendingReports') || 'pending reports'}</span>
                  <Button size="sm" variant="ghost">View</Button>
                </div>
              )}
            </div>
          )}

          {/* Consultations */}
          {(selectedCategory === 'all' || selectedCategory === 'consultations') && (
            <div className="p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span className="material-icons-outlined text-primary">chat</span>
                {t('offline.consultations') || 'Consultations'}
              </h3>
              <div className="space-y-2">
                {changes.consultations.added > 0 && (
                  <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <span>{changes.consultations.added} {t('offline.newMessages') || 'new messages'}</span>
                    <Button size="sm" variant="ghost">View</Button>
                  </div>
                )}
                {changes.consultations.updated > 0 && (
                  <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <span>{changes.consultations.updated} {t('offline.updatedMessages') || 'updated messages'}</span>
                    <Button size="sm" variant="ghost">View</Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          variant="primary"
          size="lg"
          onClick={onSync}
          icon="sync"
          fullWidth
        >
          {t('offline.syncAll') || 'Sync All Changes'}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => onReview?.('all')}
          icon="visibility"
          fullWidth
        >
          {t('offline.reviewAll') || 'Review All'}
        </Button>
      </div>
    </div>
  );
};

PendingChanges.propTypes = {
  onSync: PropTypes.func,
  onReview: PropTypes.func,
};

export default PendingChanges;