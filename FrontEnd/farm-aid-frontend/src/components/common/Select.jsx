import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Select = forwardRef(({
  label,
  options = [],
  error,
  helper,
  required = false,
  disabled = false,
  fullWidth = true,
  className = '',
  value,
  onChange,
  placeholder = 'Select an option',
  ...props
}, ref) => {
  const baseClasses = 'rounded-xl border transition-all outline-none focus:ring-2 bg-white dark:bg-sage-900/20 appearance-none';
  const stateClasses = error
    ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
    : 'border-sage-200 dark:border-sage-800 focus:ring-primary/50 focus:border-primary';
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${baseClasses} ${stateClasses} ${widthClass} ${disabledClass} py-3 px-4 pr-10`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sage-400 pointer-events-none">
          <span className="material-icons-outlined">expand_more</span>
        </span>
      </div>
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helper && !error && <p className="mt-1 text-sm text-sage-500">{helper}</p>}
    </div>
  );
});

Select.displayName = 'Select';

Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  error: PropTypes.string,
  helper: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

export default Select;