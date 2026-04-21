import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Button from '../common/Button';

const QuickActions = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const actions = [
    {
      id: 'addAnimal',
      icon: 'add_circle',
      label: t('actions.addAnimal') || 'Add Animal',
      color: 'bg-green-100 dark:bg-green-900/20 text-green-600',
      path: '/herd?action=add'
    },
    {
      id: 'checkSymptoms',
      icon: 'search',
      label: t('actions.checkSymptoms') || 'Check Symptoms',
      color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600',
      path: '/symptom-checker'
    },
    {
      id: 'reportDisease',
      icon: 'warning',
      label: t('actions.reportDisease') || 'Report Disease',
      color: 'bg-red-100 dark:bg-red-900/20 text-red-600',
      path: '/report-disease'
    },
    {
      id: 'consultVet',
      icon: 'videocam',
      label: t('actions.consultVet') || 'Consult Vet',
      color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600',
      path: '/telehealth'
    },
    {
      id: 'viewAlerts',
      icon: 'notifications',
      label: t('actions.viewAlerts') || 'View Alerts',
      color: 'bg-amber-100 dark:bg-amber-900/20 text-amber-600',
      path: '/alerts'
    },
    {
      id: 'recordVaccination',
      icon: 'vaccines',
      label: t('actions.recordVaccination') || 'Record Vaccination',
      color: 'bg-primary/20 text-primary',
      path: '/herd?action=vaccinate'
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-lg text-sage-900 dark:text-white">
          {t('dashboard.quickActions') || 'Quick Actions'}
        </h4>
        <span className="text-xs text-sage-500">{t('common.shortcuts') || 'Shortcuts'}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {actions.map(action => (
          <button
            key={action.id}
            onClick={() => navigate(action.path)}
            className="group flex flex-col items-center p-4 rounded-xl hover:bg-sage-50 dark:hover:bg-sage-900/20 transition-all hover:scale-105"
          >
            <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-2 group-hover:shadow-lg transition-shadow`}>
              <span className="material-icons-outlined">{action.icon}</span>
            </div>
            <span className="text-xs font-medium text-center text-sage-700 dark:text-sage-300">
              {action.label}
            </span>
          </button>
        ))}
      </div>

      {/* Emergency Action */}
      <div className="mt-6 pt-6 border-t border-sage-200 dark:border-sage-800">
        <Button
          variant="danger"
          size="lg"
          fullWidth
          onClick={() => navigate('/report-disease?emergency=true')}
          icon="warning"
        >
          {t('actions.emergency') || '🚨 Emergency - Report FMD'}
        </Button>
        <p className="text-center text-xs text-sage-500 mt-2">
          {t('actions.emergencyNote') || 'For suspected notifiable diseases only'}
        </p>
      </div>
    </Card>
  );
};

export default QuickActions;