import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

const Dropdown = ({ 
  trigger, 
  children, 
  position = 'bottom-left',
  closeOnClick = true,
  closeOnOutsideClick = true,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (closeOnOutsideClick && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeOnOutsideClick]);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (onClick) => {
    if (closeOnClick) {
      setIsOpen(false);
    }
    if (onClick) {
      onClick();
    }
  };

  const getPositionClasses = () => {
    switch(position) {
      case 'bottom-left': return 'top-full left-0 mt-1';
      case 'bottom-right': return 'top-full right-0 mt-1';
      case 'top-left': return 'bottom-full left-0 mb-1';
      case 'top-right': return 'bottom-full right-0 mb-1';
      default: return 'top-full left-0 mt-1';
    }
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={handleTriggerClick} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute z-50 min-w-[200px] bg-white dark:bg-sage-900 rounded-lg shadow-lg border border-sage-200 dark:border-sage-800 py-1 ${getPositionClasses()}`}>
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                onClick: () => handleItemClick(child.props.onClick),
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ children, onClick, icon, disabled = false, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full px-4 py-2 text-left text-sm hover:bg-sage-50 dark:hover:bg-sage-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${className}`}
  >
    {icon && <span className="material-icons-outlined text-sm">{icon}</span>}
    {children}
  </button>
);

export const DropdownDivider = () => (
  <hr className="my-1 border-sage-200 dark:border-sage-800" />
);

export const DropdownHeader = ({ children }) => (
  <div className="px-4 py-2 text-xs font-medium text-sage-500 uppercase tracking-wider">
    {children}
  </div>
);

Dropdown.propTypes = {
  trigger: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['bottom-left', 'bottom-right', 'top-left', 'top-right']),
  closeOnClick: PropTypes.bool,
  closeOnOutsideClick: PropTypes.bool,
  className: PropTypes.string,
};

DropdownItem.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

DropdownDivider.propTypes = {};
DropdownHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Dropdown;