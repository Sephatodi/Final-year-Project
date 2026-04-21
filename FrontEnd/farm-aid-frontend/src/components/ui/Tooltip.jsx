import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  delay = 200,
  disabled = false,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  let timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showTooltip = () => {
    if (disabled) return;
    
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const getTooltipPosition = () => {
    const { top, left, width, height } = coords;
    const tooltipWidth = tooltipRef.current?.offsetWidth || 0;
    const tooltipHeight = tooltipRef.current?.offsetHeight || 0;

    switch(position) {
      case 'top':
        return {
          top: top - tooltipHeight - 8,
          left: left + (width / 2) - (tooltipWidth / 2),
        };
      case 'bottom':
        return {
          top: top + height + 8,
          left: left + (width / 2) - (tooltipWidth / 2),
        };
      case 'left':
        return {
          top: top + (height / 2) - (tooltipHeight / 2),
          left: left - tooltipWidth - 8,
        };
      case 'right':
        return {
          top: top + (height / 2) - (tooltipHeight / 2),
          left: left + width + 8,
        };
      default:
        return { top, left };
    }
  };

  const tooltipPosition = getTooltipPosition();

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className={`inline-block ${className}`}
      >
        {children}
      </span>

      {isVisible && createPortal(
        <div
          ref={tooltipRef}
          className="fixed z-50 px-3 py-2 bg-sage-900 dark:bg-sage-700 text-white text-sm rounded-lg shadow-lg max-w-xs whitespace-normal break-words"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
          role="tooltip"
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-sage-900 dark:bg-sage-700 transform rotate-45 ${
              position === 'top' ? '-bottom-1 left-1/2 -translate-x-1/2' :
              position === 'bottom' ? '-top-1 left-1/2 -translate-x-1/2' :
              position === 'left' ? '-right-1 top-1/2 -translate-y-1/2' :
              '-left-1 top-1/2 -translate-y-1/2'
            }`}
          />
        </div>,
        document.body
      )}
    </>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  delay: PropTypes.number,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Tooltip;