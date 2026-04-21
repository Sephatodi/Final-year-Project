// src/components/dashboard/SummaryCards.jsx
import React from 'react';
import { Card } from './Card';
import { useLivestock } from '../../hooks/useLivestock';

export const SummaryCards = () => {
  const { totalLivestock, monthlyExpenses, healthAlerts } = useLivestock();
  
  const cards = [
    {
      title: 'Total Livestock',
      value: totalLivestock,
      change: '+12 this month',
      icon: '🐄',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Monthly Expenses',
      value: `P ${monthlyExpenses.toLocaleString()}`,
      change: '-5% vs last month',
      icon: '💰',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Health Alerts',
      value: healthAlerts,
      change: 'All records verified',
      icon: '⚠️',
      color: 'bg-red-100 text-red-600',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.change}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.color}`}>
              <span className="text-2xl">{card.icon}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};