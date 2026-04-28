import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Select from '../common/Select';

const HealthChart = ({ data = [], loading = false }) => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('6months');

  const mockData = data.length ? data : [
    { month: 'MAY', healthy: 42, sick: 3, critical: 1, recovered: 2 },
    { month: 'JUN', healthy: 44, sick: 2, critical: 0, recovered: 3 },
    { month: 'JUL', healthy: 46, sick: 1, critical: 2, recovered: 1 },
    { month: 'AUG', healthy: 45, sick: 4, critical: 1, recovered: 2 },
    { month: 'SEP', healthy: 48, sick: 2, critical: 0, recovered: 3 },
    { month: 'OCT', healthy: 52, sick: 1, critical: 1, recovered: 2 },
  ];

  const timeRangeOptions = [
    { value: '30days', label: t('dashboard.last30Days') || 'Last 30 Days' },
    { value: '3months', label: t('dashboard.last3Months') || 'Last 3 Months' },
    { value: '6months', label: t('dashboard.last6Months') || 'Last 6 Months' },
    { value: '1year', label: t('dashboard.lastYear') || 'Last Year' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-sage-900 p-3 rounded-lg shadow-lg border border-sage-200 dark:border-sage-800">
          <p className="font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-sage-600 dark:text-sage-400">{entry.name}:</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="w-40 h-6 bg-sage-200 dark:bg-sage-800 rounded animate-pulse"></div>
          <div className="w-32 h-8 bg-sage-200 dark:bg-sage-800 rounded animate-pulse"></div>
        </div>
        <div className="h-[300px] bg-sage-100 dark:bg-sage-800/50 rounded animate-pulse"></div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h4 className="font-bold text-lg text-sage-900 dark:text-white">
            {t('dashboard.healthTrends') || 'Herd Health Trends'}
          </h4>
          <p className="text-sm text-sage-500 dark:text-sage-400">
            {t('dashboard.healthTrendsSubtitle') || 'Track health status over time'}
          </p>
        </div>
        
        <Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          options={timeRangeOptions}
          className="w-40"
        />
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={mockData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorHealthy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#13ec5b" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#13ec5b" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSick" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" className="stroke-sage-200 dark:stroke-sage-800" />
            
            <XAxis 
              dataKey="month" 
              className="text-xs text-sage-500"
              tick={{ fill: 'currentColor' }}
            />
            
            <YAxis 
              className="text-xs text-sage-500"
              tick={{ fill: 'currentColor' }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '12px'
              }}
            />
            
            <Area
              type="monotone"
              dataKey="healthy"
              name={t('dashboard.healthy') || 'Healthy'}
              stroke="#13ec5b"
              fill="url(#colorHealthy)"
              strokeWidth={2}
            />
            
            <Area
              type="monotone"
              dataKey="sick"
              name={t('dashboard.sick') || 'Sick'}
              stroke="#f59e0b"
              fill="url(#colorSick)"
              strokeWidth={2}
            />
            
            <Area
              type="monotone"
              dataKey="critical"
              name={t('dashboard.critical') || 'Critical'}
              stroke="#ef4444"
              fill="url(#colorCritical)"
              strokeWidth={2}
            />
            
            <Area
              type="monotone"
              dataKey="recovered"
              name={t('dashboard.recovered') || 'Recovered'}
              stroke="#3b82f6"
              fill="url(#colorRecovered)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-sage-200 dark:border-sage-800">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">94%</div>
          <div className="text-xs text-sage-500">{t('dashboard.overallHealth') || 'Overall Health'}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-600">4</div>
          <div className="text-xs text-sage-500">{t('dashboard.atRisk') || 'At Risk'}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">12</div>
          <div className="text-xs text-sage-500">{t('dashboard.vaccinationsDue') || 'Vaccinations Due'}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">+8%</div>
          <div className="text-xs text-sage-500">{t('dashboard.improvement') || 'Improvement'}</div>
        </div>
      </div>
    </Card>
  );
};

HealthChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string,
      healthy: PropTypes.number,
      sick: PropTypes.number,
      critical: PropTypes.number,
      recovered: PropTypes.number,
    })
  ),
  loading: PropTypes.bool,
};

export default HealthChart;