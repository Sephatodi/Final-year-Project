import React from 'react';
import PropTypes from 'prop-types';

const Spinner = ({ size = 'md', color = 'primary', fullPage = false }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const colorClasses = {
    primary: 'text-primary',
    white: 'text-white',
    gray: 'text-sage-500',
  };

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-sage-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <svg className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} mx-auto mb-4`} viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sage-600 dark:text-sage-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <svg className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'white', 'gray']),
  fullPage: PropTypes.bool,
};

export default Spinner;