import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';

const AlertsWidget = ({ alerts = [], loading = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const mockAlerts = alerts.length ? alerts : [
    {
      id: 1,
      type: 'critical',
      title: 'FMD Alert - Zone 6B',
      message: 'Movement restrictions in place. Report any symptoms immediately.',
      time: '2 hours ago',
      actionable: true,
      zone: 'Francistown'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Weather Alert',
      message: 'Heavy rains expected in Central District. Secure livestock shelters.',
      time: '5 hours ago',
      actionable: false,
    },
    {
      id: 3,
      type: 'info',
      title: 'Market Price Update',
      message: 'Cattle prices increased by 5% in Gaborone market.',
      time: '1 day ago',
      actionable: false,
    },
    {
      id: 4,
      type: 'success',
      title: 'Vaccination Reminder',
      message: '15 cattle due for FMD booster next week.',
      time: '2 days ago',
      actionable: true,
    },
  ];

  const getAlertIcon = (type) => {
    switch(type) {
      case 'critical': return 'warning';
      case 'warning': return 'error';
      case 'info': return 'info';
      case 'success': return 'check_circle';
      default: return 'notifications';
    }
  };

  const getAlertColors = (type) => {
    switch(type) {
      case 'critical':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          icon: 'text-red-600 dark:text-red-400',
          title: 'text-red-900 dark:text-red-100',
          message: 'text-red-700 dark:text-red-300'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800',
          icon: 'text-amber-600 dark:text-amber-400',
          title: 'text-amber-900 dark:text-amber-100',
          message: 'text-amber-700 dark:text-amber-300'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          title: 'text-blue-900 dark:text-blue-100',
          message: 'text-blue-700 dark:text-blue-300'
        };
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          icon: 'text-green-600 dark:text-green-400',
          title: 'text-green-900 dark:text-green-100',
          message: 'text-green-700 dark:text-green-300'
        };
      default:
        return {
          bg: 'bg-sage-50 dark:bg-sage-900/20',
          border: 'border-sage-200 dark:border-sage-800',
          icon: 'text-sage-600',
          title: '',
          message: ''
        };
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="w-32 h-6 bg-sage-200 dark:bg-sage-800 rounded animate-pulse"></div>
          <div className="w-20 h-8 bg-sage-200 dark:bg-sage-800 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-sage-200 dark:bg-sage-800 rounded animate-pulse"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-sage-200 dark:border-sage-800 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-lg text-sage-900 dark:text-white flex items-center gap-2">
            {t('dashboard.alerts') || 'Alerts & Updates'}
            {mockAlerts.filter(a => a.type === 'critical').length > 0 && (
              <Badge variant="critical" size="sm">
                {mockAlerts.filter(a => a.type === 'critical').length} CRITICAL
              </Badge>
            )}
          </h4>
          <p className="text-sm text-sage-500">
            {t('dashboard.alertsSubtitle') || 'Important notifications for your farm'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/alerts')}
          icon="notifications"
        >
          {t('common.viewAll') || 'View All'}
        </Button>
      </div>

      <div className="divide-y divide-sage-100 dark:divide-sage-800 max-h-[400px] overflow-y-auto">
        {mockAlerts.map(alert => {
          const colors = getAlertColors(alert.type);
          return (
            <div
              key={alert.id}
              className={`p-4 ${colors.bg} ${colors.border} border-l-4 hover:brightness-95 transition-all cursor-pointer`}
              onClick={() => alert.actionable && navigate(`/alerts/${alert.id}`)}
            >
              <div className="flex gap-3">
                <span className={`material-icons-outlined ${colors.icon} flex-shrink-0`}>
                  {getAlertIcon(alert.type)}
                </span>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h5 className={`font-bold text-sm ${colors.title}`}>
                      {alert.title}
                    </h5>
                    <span className="text-xs text-sage-500 whitespace-nowrap">
                      {alert.time}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${colors.message} mb-2`}>
                    {alert.message}
                  </p>
                  
                  {alert.zone && (
                    <div className="flex items-center gap-1 text-xs text-sage-500">
                      <span className="material-icons-outlined text-xs">location_on</span>
                      {alert.zone}
                    </div>
                  )}
                  
                  {alert.actionable && (
                    <button className="mt-2 text-xs font-bold text-primary hover:underline flex items-center gap-1">
                      {t('common.takeAction') || 'Take Action'}
                      <span className="material-icons-outlined text-xs">arrow_forward</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disease Zone Quick Info */}
      <div className="px-6 py-4 bg-sage-50 dark:bg-sage-900/20 border-t border-sage-200 dark:border-sage-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-icons-outlined text-sage-500 text-sm">map</span>
            <span className="text-sm font-medium">{t('dashboard.activeZones') || 'Active Disease Zones:'}</span>
          </div>
          <div className="flex gap-2">
            <Badge variant="critical" size="sm">Zone 6B</Badge>
            <Badge variant="warning" size="sm">Zone 4A</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

AlertsWidget.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      type: PropTypes.string,
      title: PropTypes.string,
      message: PropTypes.string,
      time: PropTypes.string,
      actionable: PropTypes.bool,
      zone: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
};

export default AlertsWidget;