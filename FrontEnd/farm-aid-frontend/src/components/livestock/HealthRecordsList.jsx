import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';

const HealthRecordsList = ({ records = [], animalId, onAddRecord }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');

  const getRecordIcon = (type) => {
    switch(type) {
      case 'vaccination': return 'vaccines';
      case 'treatment': return 'medical_services';
      case 'checkup': return 'stethoscope';
      case 'surgery': return 'surgery';
      default: return 'note';
    }
  };

  const getRecordColor = (type) => {
    switch(type) {
      case 'vaccination': return 'bg-green-100 dark:bg-green-900/20 text-green-600';
      case 'treatment': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600';
      case 'checkup': return 'bg-purple-100 dark:bg-purple-900/20 text-purple-600';
      case 'surgery': return 'bg-red-100 dark:bg-red-900/20 text-red-600';
      default: return 'bg-sage-100 dark:bg-sage-800 text-sage-600';
    }
  };

  const filteredRecords = filter === 'all' 
    ? records 
    : records.filter(r => r.type === filter);

  const recordTypes = [
    { value: 'all', label: t('healthRecords.all') || 'All Records' },
    { value: 'vaccination', label: t('healthRecords.vaccinations') || 'Vaccinations' },
    { value: 'treatment', label: t('healthRecords.treatments') || 'Treatments' },
    { value: 'checkup', label: t('healthRecords.checkups') || 'Checkups' },
  ];

  if (records.length === 0) {
    return (
      <Card className="p-12 text-center">
        <span className="material-icons-outlined text-5xl text-sage-300 mb-4">medical_services</span>
        <h3 className="text-lg font-bold mb-2">
          {t('healthRecords.noRecords') || 'No Health Records'}
        </h3>
        <p className="text-sage-500 mb-6">
          {t('healthRecords.addFirst') || 'Add your first health record for this animal'}
        </p>
        <Button onClick={onAddRecord} icon="add">
          {t('healthRecords.addRecord') || 'Add Health Record'}
        </Button>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-sage-200 dark:border-sage-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">
            {t('livestock.healthRecords') || 'Health Records'}
          </h3>
          <Button size="sm" onClick={onAddRecord} icon="add">
            {t('common.add') || 'Add'}
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {recordTypes.map(type => (
            <button
              key={type.value}
              onClick={() => setFilter(type.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === type.value
                  ? 'bg-primary text-white'
                  : 'bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-400 hover:bg-sage-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-sage-100 dark:divide-sage-800">
        {filteredRecords.map((record, index) => (
          <div key={index} className="p-6 hover:bg-sage-50 dark:hover:bg-sage-900/20 transition-colors">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getRecordColor(record.type)}`}>
                <span className="material-icons-outlined">{getRecordIcon(record.type)}</span>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-bold">{record.title || record.type}</h4>
                    <p className="text-sm text-sage-500">{record.date}</p>
                  </div>
                  {record.performedBy && (
                    <Badge variant="info" size="sm">
                      {t('healthRecords.by') || 'By'}: {record.performedBy}
                    </Badge>
                  )}
                </div>

                {record.description && (
                  <p className="text-sm text-sage-700 dark:text-sage-300 mb-3">
                    {record.description}
                  </p>
                )}

                {record.medications && record.medications.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-sage-500 mb-2">
                      {t('healthRecords.medications') || 'Medications'}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {record.medications.map((med, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-sage-100 dark:bg-sage-800 rounded text-xs"
                        >
                          {med}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {record.followUp && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-amber-600">
                    <span className="material-icons-outlined text-sm">event</span>
                    <span>{t('healthRecords.followUp') || 'Follow-up'}: {record.followUp}</span>
                  </div>
                )}
              </div>

              <button className="p-2 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-lg transition-colors">
                <span className="material-icons-outlined text-sage-400">more_vert</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="p-8 text-center text-sage-500">
          <p>{t('healthRecords.noFiltered') || 'No records match the selected filter'}</p>
        </div>
      )}
    </Card>
  );
};

HealthRecordsList.propTypes = {
  records: PropTypes.array,
  animalId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onAddRecord: PropTypes.func,
};

export default HealthRecordsList;