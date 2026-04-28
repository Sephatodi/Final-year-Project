import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Alert = ({
  type = 'info',
  title,
  message,
  dismissible = false,
  autoDismiss = false,
  dismissAfter = 5000,
  onDismiss,
  className = '',
  children,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const typeClasses = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    critical: 'bg-red-600 border-red-700 text-white',
  };

  const iconMap = {
    info: 'info',
    success: 'check_circle',
    warning: 'warning',
    error: 'error',
    critical: 'warning',
  };

  useEffect(() => {
    if (autoDismiss && dismissible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, dismissAfter);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissible, dismissAfter, onDismiss]);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div className={`rounded-lg border p-4 ${typeClasses[type]} ${className}`} role="alert">
      <div className="flex items-start gap-3">
        <span className="material-icons-outlined flex-shrink-0">{iconMap[type]}</span>
        
        <div className="flex-1">
          {title && <h4 className="font-bold mb-1">{title}</h4>}
          {message && <p className="text-sm">{message}</p>}
          {children}
        </div>
        
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-black/10 rounded-lg transition-colors"
          >
            <span className="material-icons-outlined text-sm">close</span>
          </button>
        )}
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error', 'critical']),
  title: PropTypes.string,
  message: PropTypes.string,
  dismissible: PropTypes.bool,
  autoDismiss: PropTypes.bool,
  dismissAfter: PropTypes.number,
  onDismiss: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Alert;