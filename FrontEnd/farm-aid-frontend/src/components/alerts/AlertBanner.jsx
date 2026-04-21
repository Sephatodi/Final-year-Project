import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';

const AlertBanner = ({ alert, onDismiss, autoDismiss = false, dismissAfter = 5000 }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (autoDismiss && dismissAfter > 0) {
      const interval = 50;
      const steps = dismissAfter / interval;
      const decrement = 100 / steps;
      
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            handleDismiss();
            return 0;
          }
          return prev - decrement;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [autoDismiss, dismissAfter]);

  const getAlertStyles = (type, severity) => {
    const styles = {
      info: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-800 dark:text-blue-200',
        icon: 'info',
        progress: 'bg-blue-500'
      },
      warning: {
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        border: 'border-amber-200 dark:border-amber-800',
        text: 'text-amber-800 dark:text-amber-200',
        icon: 'warning',
        progress: 'bg-amber-500'
      },
      critical: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-800 dark:text-red-200',
        icon: 'error',
        progress: 'bg-red-500'
      },
      success: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-800 dark:text-green-200',
        icon: 'check_circle',
        progress: 'bg-green-500'
      }
    };

    return styles[severity] || styles.info;
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss(alert.id);
    }
  };

  const handleAction = () => {
    if (alert.actionLink) {
      navigate(alert.actionLink);
    } else if (alert.action) {
      alert.action();
    }
  };

  if (!isVisible) return null;

  const styles = getAlertStyles(alert.type, alert.severity);
  const title = language === 'en' ? alert.titleEn : alert.titleTn || alert.titleEn;
  const message = language === 'en' ? alert.messageEn : alert.messageTn || alert.messageEn;

  return (
    <div className={`relative ${styles.bg} ${styles.border} border-l-4 rounded-lg overflow-hidden shadow-md`}>
      {/* Progress Bar (for auto-dismiss) */}
      {autoDismiss && (
        <div 
          className={`absolute bottom-0 left-0 h-1 ${styles.progress} transition-all duration-50`}
          style={{ width: `${progress}%` }}
        />
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 ${styles.text}`}>
            <span className="material-icons-outlined">{styles.icon}</span>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className={`font-bold ${styles.text}`}>{title}</h4>
                <p className={`text-sm mt-1 ${styles.text} opacity-90`}>{message}</p>
              </div>
              
              {/* Timestamp */}
              {alert.timestamp && (
                <span className="text-xs text-sage-500 whitespace-nowrap">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            {(alert.actionable || alert.actionLink) && (
              <div className="flex gap-3 mt-3">
                <Button
                  size="sm"
                  variant={alert.severity === 'critical' ? 'danger' : 'primary'}
                  onClick={handleAction}
                >
                  {alert.actionText || t('alerts.takeAction') || 'Take Action'}
                </Button>
                
                {alert.secondaryAction && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={alert.secondaryAction}
                  >
                    {alert.secondaryText || t('common.learnMore') || 'Learn More'}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className={`flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors ${styles.text}`}
          >
            <span className="material-icons-outlined text-sm">close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

AlertBanner.propTypes = {
  alert: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    severity: PropTypes.oneOf(['info', 'warning', 'critical', 'success']),
    titleEn: PropTypes.string,
    titleTn: PropTypes.string,
    messageEn: PropTypes.string,
    messageTn: PropTypes.string,
    timestamp: PropTypes.string,
    actionable: PropTypes.bool,
    actionLink: PropTypes.string,
    actionText: PropTypes.string,
    action: PropTypes.func,
    secondaryAction: PropTypes.func,
    secondaryText: PropTypes.string,
  }).isRequired,
  onDismiss: PropTypes.func,
  autoDismiss: PropTypes.bool,
  dismissAfter: PropTypes.number,
};

export default AlertBanner;