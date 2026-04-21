import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';

const AlertCard = ({ alert, onDismiss, onMarkAsRead }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const [isExpanded, setIsExpanded] = useState(false);

  const getAlertIcon = (type, severity) => {
    if (severity === 'critical') return 'error';
    if (severity === 'warning') return 'warning';
    
    switch(type) {
      case 'disease': return 'coronavirus';
      case 'weather': return 'wb_sunny';
      case 'movement': return 'block';
      case 'market': return 'trending_up';
      case 'system': return 'settings';
      default: return 'notifications';
    }
  };

  const getAlertColors = (severity) => {
    switch(severity) {
      case 'critical':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          icon: 'text-red-600',
          title: 'text-red-900 dark:text-red-100',
          badge: 'critical'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800',
          icon: 'text-amber-600',
          title: 'text-amber-900 dark:text-amber-100',
          badge: 'warning'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600',
          title: 'text-blue-900 dark:text-blue-100',
          badge: 'info'
        };
      default:
        return {
          bg: 'bg-sage-50 dark:bg-sage-900/20',
          border: 'border-sage-200 dark:border-sage-800',
          icon: 'text-sage-600',
          title: '',
          badge: 'default'
        };
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('time.justNow') || 'Just now';
    if (diffMins < 60) return `${diffMins}m ${t('time.ago') || 'ago'}`;
    if (diffHours < 24) return `${diffHours}h ${t('time.ago') || 'ago'}`;
    if (diffDays < 7) return `${diffDays}d ${t('time.ago') || 'ago'}`;
    return date.toLocaleDateString();
  };

  const colors = getAlertColors(alert.severity);
  const title = language === 'en' ? alert.titleEn : alert.titleTn || alert.titleEn;
  const content = language === 'en' ? alert.contentEn : alert.contentTn || alert.contentEn;

  const handleAction = () => {
    if (alert.actionLink) {
      navigate(alert.actionLink);
    }
  };

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss(alert.id);
    }
  };

  const handleMarkAsRead = () => {
    if (onMarkAsRead) {
      onMarkAsRead(alert.id);
    }
  };

  return (
    <Card className={`overflow-hidden transition-all ${!alert.read ? 'ring-2 ring-primary/20' : ''}`}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
            <span className={`material-icons-outlined text-2xl ${colors.icon}`}>
              {getAlertIcon(alert.type, alert.severity)}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <h3 className={`font-bold text-lg ${!alert.read ? colors.title : ''}`}>
                  {title}
                </h3>
                {!alert.read && (
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant={colors.badge} size="sm">
                  {alert.severity}
                </Badge>
                <span className="text-xs text-sage-500">
                  {formatTime(alert.createdAt)}
                </span>
              </div>
            </div>

            {/* Content (truncated or expanded) */}
            <div className={`text-sage-600 dark:text-sage-400 text-sm ${
              isExpanded ? '' : 'line-clamp-2'
            }`}>
              {content}
            </div>

            {/* Read More Toggle */}
            {content.length > 150 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary text-sm hover:underline mt-1"
              >
                {isExpanded ? t('common.showLess') || 'Show less' : t('common.readMore') || 'Read more'}
              </button>
            )}

            {/* Alert Details */}
            {(alert.zone || alert.expiresAt) && (
              <div className="flex flex-wrap gap-4 mt-3 text-xs">
                {alert.zone && (
                  <div className="flex items-center gap-1 text-sage-500">
                    <span className="material-icons-outlined text-sm">location_on</span>
                    <span>{alert.zone}</span>
                  </div>
                )}
                {alert.expiresAt && (
                  <div className="flex items-center gap-1 text-sage-500">
                    <span className="material-icons-outlined text-sm">schedule</span>
                    <span>{t('alerts.expires') || 'Expires'}: {new Date(alert.expiresAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-4">
              {alert.actionable && (
                <Button
                  size="sm"
                  variant={alert.severity === 'critical' ? 'danger' : 'primary'}
                  onClick={handleAction}
                  icon={alert.actionIcon || 'arrow_forward'}
                  iconPosition="right"
                >
                  {alert.actionText || t('alerts.takeAction') || 'Take Action'}
                </Button>
              )}

              {!alert.read && onMarkAsRead && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleMarkAsRead}
                  icon="done"
                >
                  {t('alerts.markAsRead') || 'Mark as Read'}
                </Button>
              )}

              {onDismiss && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  icon="close"
                >
                  {t('alerts.dismiss') || 'Dismiss'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

AlertCard.propTypes = {
  alert: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    severity: PropTypes.string,
    titleEn: PropTypes.string,
    titleTn: PropTypes.string,
    contentEn: PropTypes.string,
    contentTn: PropTypes.string,
    createdAt: PropTypes.string,
    expiresAt: PropTypes.string,
    zone: PropTypes.string,
    read: PropTypes.bool,
    actionable: PropTypes.bool,
    actionLink: PropTypes.string,
    actionText: PropTypes.string,
    actionIcon: PropTypes.string,
  }).isRequired,
  onDismiss: PropTypes.func,
  onMarkAsRead: PropTypes.func,
};

export default AlertCard;