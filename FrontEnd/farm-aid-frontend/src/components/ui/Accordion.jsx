import PropTypes from 'prop-types';
import { useState } from 'react';

const Accordion = ({ 
  items, 
  allowMultiple = false, 
  defaultExpanded = [],
  variant = 'default' 
}) => {
  const [expandedItems, setExpandedItems] = useState(defaultExpanded);

  const toggleItem = (itemId) => {
    if (allowMultiple) {
      setExpandedItems(prev =>
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setExpandedItems(prev =>
        prev.includes(itemId) ? [] : [itemId]
      );
    }
  };

  const variants = {
    default: {
      container: 'border border-sage-200 dark:border-sage-800 rounded-lg overflow-hidden',
      item: 'border-b border-sage-200 dark:border-sage-800 last:border-0',
      header: 'px-4 py-3 bg-white dark:bg-sage-900 hover:bg-sage-50 dark:hover:bg-sage-800 cursor-pointer',
      content: 'px-4 py-3 bg-sage-50 dark:bg-sage-900/20',
    },
    bordered: {
      container: 'space-y-2',
      item: 'border border-sage-200 dark:border-sage-800 rounded-lg overflow-hidden',
      header: 'px-4 py-3 bg-white dark:bg-sage-900 hover:bg-sage-50 dark:hover:bg-sage-800 cursor-pointer',
      content: 'px-4 py-3 border-t border-sage-200 dark:border-sage-800',
    },
    minimal: {
      container: 'space-y-1',
      item: 'overflow-hidden',
      header: 'px-2 py-2 hover:bg-sage-50 dark:hover:bg-sage-800 rounded-lg cursor-pointer',
      content: 'px-2 py-2 text-sage-600 dark:text-sage-400',
    },
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div className={currentVariant.container}>
      {items.map(item => {
        const isExpanded = expandedItems.includes(item.id);

        return (
          <div key={item.id} className={currentVariant.item}>
            {/* Header */}
            <div
              className={currentVariant.header}
              onClick={() => toggleItem(item.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.icon && (
                    <span className="material-icons-outlined text-primary">
                      {item.icon}
                    </span>
                  )}
                  <span className="font-medium">{item.title}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="material-icons-outlined text-sage-400 transition-transform duration-200">
                  {isExpanded ? 'expand_less' : 'expand_more'}
                </span>
              </div>
              {item.subtitle && (
                <p className="text-sm text-sage-500 mt-1">{item.subtitle}</p>
              )}
            </div>

            {/* Content */}
            {isExpanded && (
              <div className={currentVariant.content}>
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

Accordion.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
      icon: PropTypes.string,
      subtitle: PropTypes.string,
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  allowMultiple: PropTypes.bool,
  defaultExpanded: PropTypes.arrayOf(PropTypes.string),
  variant: PropTypes.oneOf(['default', 'bordered', 'minimal']),
};

export default Accordion;