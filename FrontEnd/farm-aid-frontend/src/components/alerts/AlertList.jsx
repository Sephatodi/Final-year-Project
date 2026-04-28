import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import Card from '../common/Card';
import Input from '../common/Input';
import AlertBanner from './AlertBanner';
import AlertCard from './AlertCard';

const AlertList = ({ 
  alerts = [], 
  onDismiss,
  onMarkAsRead,
  onRefresh,
  loading = false 
}) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlerts = alerts.filter(alert => {
    // Apply status filter
    if (filter === 'unread' && alert.read) return false;
    if (filter === 'read' && !alert.read) return false;
    if (filter === 'critical' && alert.severity !== 'critical') return false;
    
    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const title = alert.titleEn?.toLowerCase() || '';
      const message = alert.messageEn?.toLowerCase() || '';
      return title.includes(searchLower) || message.includes(searchLower);
    }
    
    return true;
  });

  const stats = {
    total: alerts.length,
    unread: alerts.filter(a => !a.read).length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
  };

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.read);
  const bannerAlerts = criticalAlerts.slice(0, 3); // Show top 3 critical as banners

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-20 bg-sage-200 dark:bg-sage-800 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight text-sage-900 dark:text-white">
            {t('alerts.title') || 'Alerts & Notifications'}
          </h2>
          <p className="text-sage-500 dark:text-sage-400 mt-1">
            {t('alerts.subtitle') || 'Stay informed about disease outbreaks and important updates'}
          </p>
        </div>

        {onRefresh && (
          <Button
            variant="outline"
            onClick={onRefresh}
            icon="refresh"
          >
            {t('common.refresh') || 'Refresh'}
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <div className="text-xs text-sage-500">{t('alerts.total') || 'Total'}</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-amber-600">{stats.unread}</div>
          <div className="text-xs text-sage-500">{t('alerts.unread') || 'Unread'}</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          <div className="text-xs text-sage-500">{t('alerts.critical') || 'Critical'}</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.warning}</div>
          <div className="text-xs text-sage-500">{t('alerts.warning') || 'Warnings'}</div>
        </Card>
      </div>

      {/* Critical Alert Banners */}
      {bannerAlerts.length > 0 && (
        <div className="space-y-3">
          {bannerAlerts.map(alert => (
            <AlertBanner
              key={alert.id}
              alert={alert}
              onDismiss={onDismiss}
            />
          ))}
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder={t('alerts.searchPlaceholder') || 'Search alerts...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="search"
            fullWidth
          />
        </div>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900"
        >
          <option value="all">{t('alerts.allAlerts') || 'All Alerts'}</option>
          <option value="unread">{t('alerts.unread') || 'Unread'}</option>
          <option value="read">{t('alerts.read') || 'Read'}</option>
          <option value="critical">{t('alerts.critical') || 'Critical'}</option>
        </select>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length > 0 ? (
        <div className="space-y-4">
          {filteredAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onDismiss={onDismiss}
              onMarkAsRead={onMarkAsRead}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <span className="material-icons-outlined text-5xl text-sage-300 mb-4">notifications_off</span>
          <h3 className="text-lg font-bold mb-2">
            {t('alerts.noAlerts') || 'No Alerts'}
          </h3>
          <p className="text-sage-500">
            {searchTerm 
              ? t('alerts.noSearchResults') || 'No alerts match your search'
              : t('alerts.allClear') || 'All clear! No alerts at this time.'}
          </p>
        </Card>
      )}
    </div>
  );
};

AlertList.propTypes = {
  alerts: PropTypes.array,
  onDismiss: PropTypes.func,
  onMarkAsRead: PropTypes.func,
  onRefresh: PropTypes.func,
  loading: PropTypes.bool,
};

export default AlertList;