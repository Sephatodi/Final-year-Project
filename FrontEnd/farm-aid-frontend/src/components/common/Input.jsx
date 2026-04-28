import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  icon,
  helper,
  required = false,
  disabled = false,
  fullWidth = true,
  className = '',
  onChange,
  value,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const baseClasses = 'rounded-xl border transition-all outline-none focus:ring-2 bg-white dark:bg-sage-900/20';
  const stateClasses = error
    ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
    : 'border-sage-200 dark:border-sage-800 focus:ring-primary/50 focus:border-primary';
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const paddingLeft = icon ? 'pl-12' : 'pl-4';
  const paddingRight = isPassword ? 'pr-12' : 'pr-4';

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-400">
            <span className="material-icons-outlined">{icon}</span>
          </span>
        )}
        
        <input
          ref={ref}
          type={inputType}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${baseClasses} ${stateClasses} ${widthClass} ${disabledClass} py-3 ${paddingLeft} ${paddingRight}`}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600 dark:hover:text-sage-200"
          >
            <span className="material-icons-outlined">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        )}
      </div>
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helper && !error && <p className="mt-1 text-sm text-sage-500">{helper}</p>}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
  icon: PropTypes.string,
  helper: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Input;