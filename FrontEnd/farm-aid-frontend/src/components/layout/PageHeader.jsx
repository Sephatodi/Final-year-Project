import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumb from './Breadcrumb';
import Button from '../common/Button';

const PageHeader = ({ title, subtitle, actions = [], showBreadcrumb = true }) => {
  return (
    <div className="mb-6">
      {showBreadcrumb && <Breadcrumb />}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight text-sage-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sage-500 dark:text-sage-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        
        {actions.length > 0 && (
          <div className="flex items-center gap-3">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'primary'}
                size={action.size || 'md'}
                icon={action.icon}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      variant: PropTypes.string,
      size: PropTypes.string,
      icon: PropTypes.string,
      onClick: PropTypes.func.isRequired,
    })
  ),
  showBreadcrumb: PropTypes.bool,
};

export default PageHeader;