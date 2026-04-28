import React from 'react';
import EducationalTooltip from './EducationalTooltip';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  tooltipContent, 
  color = 'green',
  subtitle,
  onClick,
  className = ''
}) => {
  const colorClasses = {
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      trend: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      trend: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      trend: 'text-orange-600',
      iconBg: 'bg-orange-100'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      trend: 'text-purple-600',
      iconBg: 'bg-purple-100'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      trend: 'text-red-600',
      iconBg: 'bg-red-100'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      trend: 'text-amber-600',
      iconBg: 'bg-amber-100'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      trend: 'text-emerald-600',
      iconBg: 'bg-emerald-100'
    }
  };

  const colors = colorClasses[color] || colorClasses.green;

  return (
    <div 
      className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.iconBg} ${colors.text}`}>
          {icon}
        </div>
        {tooltipContent && (
          <EducationalTooltip 
            title={`About ${title}`}
            content={tooltipContent}
            position="top"
          />
        )}
      </div>
      
      {subtitle && (
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{subtitle}</p>
      )}
      
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
      
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-gray-900 leading-none">{value}</span>
        {trend && (
          <span className={`text-sm font-bold leading-none mb-1 ${colors.trend}`}>{trend}</span>
        )}
      </div>
      
      <div className="mt-3 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
        👆 Click for details
      </div>
    </div>
  );
};

export default StatCard;