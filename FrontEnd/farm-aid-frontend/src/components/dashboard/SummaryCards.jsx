import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Badge from '../common/Badge';

const SummaryCards = ({ stats, loading = false }) => {
  const { t } = useTranslation();

  const cards = [
    {
      id: 'totalCattle',
      icon: 'pets',
      label: t('dashboard.totalCattle') || 'Total Cattle',
      value: stats?.totalCattle || 0,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      trend: stats?.cattleTrend,
      badge: stats?.cattleChange
    },
    {
      id: 'vaccinations',
      icon: 'vaccines',
      label: t('dashboard.vaccinations') || 'Vaccinations',
      value: stats?.recentVaccinations || 0,
      subtext: t('dashboard.thisMonth') || 'THIS MONTH',
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      trend: stats?.vaccinationTrend,
      badge: '+2'
    },
    {
      id: 'pendingTasks',
      icon: 'assignment',
      label: t('dashboard.pendingTasks') || 'Pending Tasks',
      value: stats?.pendingTasks || 0,
      subtext: t('dashboard.dueSoon') || 'DUE SOON',
      color: 'amber',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      trend: stats?.tasksTrend,
      badge: '⚠️'
    },
    {
      id: 'consultations',
      icon: 'clinical_notes',
      label: t('dashboard.activeConsultations') || 'Active Consultations',
      value: stats?.activeConsultations || 0,
      subtext: t('dashboard.active') || 'ACTIVE',
      color: 'purple',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      trend: stats?.consultationTrend
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-sage-200 dark:bg-sage-800 rounded-lg"></div>
              <div className="w-16 h-4 bg-sage-200 dark:bg-sage-800 rounded"></div>
            </div>
            <div className="w-24 h-4 bg-sage-200 dark:bg-sage-800 rounded mb-2"></div>
            <div className="w-16 h-8 bg-sage-200 dark:bg-sage-800 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map(card => (
        <Card key={card.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 ${card.bgColor} rounded-lg`}>
              <span className={`material-icons-outlined ${card.iconColor}`}>{card.icon}</span>
            </div>
            {card.subtext && (
              <span className="text-xs font-bold text-sage-400 uppercase tracking-wider">
                {card.subtext}
              </span>
            )}
            {card.badge && (
              <Badge variant={card.color === 'amber' ? 'warning' : 'success'} size="sm">
                {card.badge}
              </Badge>
            )}
          </div>
          
          <p className="text-sage-500 dark:text-sage-400 text-sm font-medium mb-1">
            {card.label}
          </p>
          
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-sage-900 dark:text-white">
              {card.value.toLocaleString()}
            </h3>
            
            {card.trend && (
              <div className={`flex items-center gap-1 text-sm ${
                card.trend > 0 ? 'text-green-600' : card.trend < 0 ? 'text-red-600' : 'text-sage-400'
              }`}>
                <span className="material-icons-outlined text-base">
                  {card.trend > 0 ? 'trending_up' : card.trend < 0 ? 'trending_down' : 'trending_flat'}
                </span>
                <span className="font-medium">{Math.abs(card.trend)}%</span>
              </div>
            )}
          </div>

          {/* Mini progress bar for tasks */}
          {card.id === 'pendingTasks' && stats?.totalTasks > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-sage-500">Progress</span>
                <span className="font-medium">
                  {Math.round(((stats.totalTasks - stats.pendingTasks) / stats.totalTasks) * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-sage-100 dark:bg-sage-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${((stats.totalTasks - stats.pendingTasks) / stats.totalTasks) * 100}%` }}
                />
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

SummaryCards.propTypes = {
  stats: PropTypes.shape({
    totalCattle: PropTypes.number,
    totalGoats: PropTypes.number,
    totalSheep: PropTypes.number,
    recentVaccinations: PropTypes.number,
    pendingTasks: PropTypes.number,
    totalTasks: PropTypes.number,
    activeConsultations: PropTypes.number,
    cattleTrend: PropTypes.number,
    vaccinationTrend: PropTypes.number,
    tasksTrend: PropTypes.number,
    consultationTrend: PropTypes.number,
    cattleChange: PropTypes.string,
  }),
  loading: PropTypes.bool,
};

export default SummaryCards;