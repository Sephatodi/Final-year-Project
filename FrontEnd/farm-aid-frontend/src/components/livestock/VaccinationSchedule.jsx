import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';

const VaccinationSchedule = ({ vaccinations = [], onMarkComplete }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('upcoming');

  const getVaccineIcon = (type) => {
    switch(type) {
      case 'fmd': return '⚠️';
      case 'heartwater': return '💧';
      case 'brucellosis': return '🦠';
      case 'blackleg': return '⚫';
      default: return '💉';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'success';
      case 'overdue': return 'critical';
      case 'due-soon': return 'warning';
      default: return 'default';
    }
  };

  const mockVaccinations = vaccinations.length ? vaccinations : [
    {
      id: 1,
      vaccine: 'FMD Booster',
      type: 'fmd',
      dueDate: '2024-03-20',
      status: 'due-soon',
      animals: 30,
      completed: 0,
    },
    {
      id: 2,
      vaccine: 'Heartwater',
      type: 'heartwater',
      dueDate: '2024-03-15',
      status: 'overdue',
      animals: 45,
      completed: 0,
    },
    {
      id: 3,
      vaccine: 'Brucellosis',
      type: 'brucellosis',
      dueDate: '2024-03-25',
      status: 'upcoming',
      animals: 15,
      completed: 0,
    },
    {
      id: 4,
      vaccine: 'Blackleg',
      type: 'blackleg',
      dueDate: '2024-03-10',
      status: 'completed',
      animals: 25,
      completed: 25,
    },
  ];

  const filteredVaccinations = mockVaccinations.filter(v => 
    filter === 'all' ? true : v.status === filter
  );

  const stats = {
    total: mockVaccinations.length,
    completed: mockVaccinations.filter(v => v.status === 'completed').length,
    overdue: mockVaccinations.filter(v => v.status === 'overdue').length,
    dueSoon: mockVaccinations.filter(v => v.status === 'due-soon').length,
  };

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-sage-200 dark:border-sage-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">
              {t('vaccinations.schedule') || 'Vaccination Schedule'}
            </h3>
            <p className="text-sm text-sage-500">
              {t('vaccinations.track') || 'Track and manage vaccinations'}
            </p>
          </div>
          <Button variant="primary" size="sm" icon="add">
            {t('vaccinations.schedule') || 'Schedule'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-xs text-sage-500">{t('vaccinations.overdue') || 'Overdue'}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{stats.dueSoon}</div>
            <div className="text-xs text-sage-500">{t('vaccinations.dueSoon') || 'Due Soon'}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs text-sage-500">{t('vaccinations.completed') || 'Completed'}</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {['all', 'upcoming', 'due-soon', 'overdue', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-sage-100 dark:bg-sage-800 text-sage-600 hover:bg-sage-200'
              }`}
            >
              {t(`vaccinations.${status}`) || status}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-sage-100 dark:divide-sage-800">
        {filteredVaccinations.map(vaccine => (
          <div key={vaccine.id} className="p-6 hover:bg-sage-50 dark:hover:bg-sage-900/20 transition-colors">
            <div className="flex items-start gap-4">
              <div className="text-2xl">{getVaccineIcon(vaccine.type)}</div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-bold">{vaccine.vaccine}</h4>
                    <p className="text-sm text-sage-500">
                      {t('vaccinations.due') || 'Due'}: {new Date(vaccine.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(vaccine.status)} size="sm">
                    {vaccine.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm mb-3">
                  <span className="flex items-center gap-1">
                    <span className="material-icons-outlined text-sage-400 text-sm">pets</span>
                    {vaccine.animals} {t('vaccinations.animals') || 'animals'}
                  </span>
                  {vaccine.completed > 0 && (
                    <span className="text-green-600">
                      {vaccine.completed} {t('vaccinations.completed') || 'completed'}
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-sage-100 dark:bg-sage-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(vaccine.completed / vaccine.animals) * 100}%` }}
                  />
                </div>

                {/* Action Buttons */}
                {vaccine.status !== 'completed' && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onMarkComplete?.(vaccine.id)}
                    >
                      {t('vaccinations.markComplete') || 'Mark Complete'}
                    </Button>
                    <Button size="sm" variant="ghost" icon="schedule">
                      {t('common.reschedule') || 'Reschedule'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

VaccinationSchedule.propTypes = {
  vaccinations: PropTypes.array,
  onMarkComplete: PropTypes.func,
};

export default VaccinationSchedule;