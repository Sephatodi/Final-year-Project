import PropTypes from 'prop-types';
import { useState } from 'react';

const Tabs = ({ tabs, defaultTab, onChange, variant = 'underline' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  const variants = {
    underline: {
      container: 'border-b border-sage-200 dark:border-sage-800',
      tab: (isActive) => `
        px-4 py-2 text-sm font-medium transition-colors relative
        ${isActive 
          ? 'text-primary border-b-2 border-primary -mb-px' 
          : 'text-sage-500 hover:text-sage-700 dark:hover:text-sage-300'
        }
      `,
    },
    pills: {
      container: 'flex flex-wrap gap-2',
      tab: (isActive) => `
        px-4 py-2 text-sm font-medium rounded-lg transition-colors
        ${isActive 
          ? 'bg-primary text-white' 
          : 'bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-400 hover:bg-sage-200 dark:hover:bg-sage-700'
        }
      `,
    },
    buttons: {
      container: 'flex gap-1 p-1 bg-sage-100 dark:bg-sage-800 rounded-lg',
      tab: (isActive) => `
        px-4 py-2 text-sm font-medium rounded-md transition-colors flex-1 text-center
        ${isActive 
          ? 'bg-white dark:bg-sage-900 text-primary shadow-sm' 
          : 'text-sage-600 dark:text-sage-400 hover:text-sage-900 dark:hover:text-white'
        }
      `,
    },
  };

  const currentVariant = variants[variant] || variants.underline;

  return (
    <div>
      {/* Tab Headers */}
      <div className={currentVariant.container}>
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={currentVariant.tab(activeTab === tab.id)}
              disabled={tab.disabled}
            >
              {tab.icon && (
                <span className="material-icons-outlined text-sm mr-2 align-middle">
                  {tab.icon}
                </span>
              )}
              {tab.label}
              {tab.badge && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
      icon: PropTypes.string,
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      disabled: PropTypes.bool,
    })
  ).isRequired,
  defaultTab: PropTypes.string,
  onChange: PropTypes.func,
  variant: PropTypes.oneOf(['underline', 'pills', 'buttons']),
};

export default Tabs;