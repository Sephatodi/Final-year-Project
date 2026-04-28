import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';

const RecentActivities = ({ activities = [], loading = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const mockActivities = activities.length ? activities : [
    { id: 'C-102', action: 'Vaccination', status: 'completed', date: '24 Oct', animal: 'Cow #102' },
    { id: 'B-054', action: 'Weight Check', status: 'completed', date: '23 Oct', animal: 'Bull #54' },
    { id: 'C-089', action: 'Deworming', status: 'pending', date: '22 Oct', animal: 'Cow #89' },
    { id: 'M-112', action: 'Sale Record', status: 'completed', date: '20 Oct', animal: 'Sheep #112' },
    { id: 'G-023', action: 'Health Check', status: 'in-progress', date: '19 Oct', animal: 'Goat #23' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'in-progress': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return 'check_circle';
      case 'pending': return 'pending';
      case 'in-progress': return 'sync';
      default: return 'info';
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
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-sage-200 dark:bg-sage-800 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="w-32 h-4 bg-sage-200 dark:bg-sage-800 rounded mb-2 animate-pulse"></div>
                <div className="w-24 h-3 bg-sage-200 dark:bg-sage-800 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-sage-200 dark:border-sage-800 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-lg text-sage-900 dark:text-white">
            {t('dashboard.recentActivities') || 'Recent Activities'}
          </h4>
          <p className="text-sm text-sage-500">
            {t('dashboard.recentActivitiesSubtitle') || 'Latest updates from your farm'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/reports')}
          icon="arrow_forward"
          iconPosition="right"
        >
          {t('common.viewAll') || 'View All'}
        </Button>
      </div>

      <div className="divide-y divide-sage-100 dark:divide-sage-800">
        {mockActivities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 hover:bg-sage-50 dark:hover:bg-sage-900/20 transition-colors cursor-pointer"
            onClick={() => navigate(`/herd/${activity.id}`)}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activity.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20' :
              activity.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/20' :
              'bg-blue-100 dark:bg-blue-900/20'
            }`}>
              <span className={`material-icons-outlined ${
                activity.status === 'completed' ? 'text-green-600' :
                activity.status === 'pending' ? 'text-amber-600' :
                'text-blue-600'
              }`}>
                {getStatusIcon(activity.status)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sage-900 dark:text-white truncate">
                  {activity.animal}
                </span>
                <Badge variant={getStatusColor(activity.status)} size="sm">
                  {activity.status}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-sage-600 dark:text-sage-400">{activity.action}</span>
                <span className="text-sage-300 dark:text-sage-700">•</span>
                <span className="text-sage-500 text-xs">{activity.date}</span>
              </div>
            </div>

            <button className="p-2 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-full transition-colors">
              <span className="material-icons-outlined text-sage-400 text-sm">chevron_right</span>
            </button>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="px-6 py-4 bg-sage-50 dark:bg-sage-900/20 border-t border-sage-200 dark:border-sage-800">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">8</div>
            <div className="text-xs text-sage-500">{t('dashboard.completed') || 'Completed'}</div>
          </div>
          <div>
            <div className="text-lg font-bold text-amber-600">3</div>
            <div className="text-xs text-sage-500">{t('dashboard.pending') || 'Pending'}</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">2</div>
            <div className="text-xs text-sage-500">{t('dashboard.today') || 'Today'}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

RecentActivities.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      action: PropTypes.string,
      status: PropTypes.string,
      date: PropTypes.string,
      animal: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
};

export default RecentActivities;