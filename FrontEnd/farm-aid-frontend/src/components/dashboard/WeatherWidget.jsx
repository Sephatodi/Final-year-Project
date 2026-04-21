import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';

const WeatherWidget = ({ location = 'Kweneng District', loading = false }) => {
  const { t } = useTranslation();
  const [weather, setWeather] = useState({
    temperature: 32,
    condition: 'Clear Skies',
    humidity: 45,
    windSpeed: 12,
    rainfall: 5,
    forecast: [
      { day: 'Mon', temp: 31, condition: 'sunny' },
      { day: 'Tue', temp: 30, condition: 'partly_cloudy' },
      { day: 'Wed', temp: 29, condition: 'cloudy' },
      { day: 'Thu', temp: 28, condition: 'rain' },
      { day: 'Fri', temp: 30, condition: 'sunny' },
    ]
  });

  const getWeatherIcon = (condition) => {
    switch(condition.toLowerCase()) {
      case 'clear skies':
      case 'sunny':
        return 'sunny';
      case 'partly_cloudy':
        return 'partly_cloudy';
      case 'cloudy':
        return 'cloud';
      case 'rain':
        return 'rainy';
      case 'storm':
        return 'thunderstorm';
      default:
        return 'wb_sunny';
    }
  };

  const getWeatherColor = (condition) => {
    switch(condition.toLowerCase()) {
      case 'clear skies':
      case 'sunny':
        return 'text-amber-400';
      case 'partly_cloudy':
        return 'text-sage-400';
      case 'cloudy':
        return 'text-sage-500';
      case 'rain':
        return 'text-blue-400';
      case 'storm':
        return 'text-purple-500';
      default:
        return 'text-amber-400';
    }
  };

  if (loading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-48 bg-sage-200 dark:bg-sage-800 rounded"></div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-sage-800 to-background-dark text-white">
      {/* Current Weather */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-widest">
              {t('dashboard.weather') || 'Weather Forecast'}
            </p>
            <h5 className="text-xl font-bold mt-1">{location}</h5>
          </div>
          <span className={`material-icons-outlined text-5xl ${getWeatherColor(weather.condition)}`}>
            {getWeatherIcon(weather.condition)}
          </span>
        </div>

        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-5xl font-black">{weather.temperature}°C</span>
            <p className="text-sage-300 mt-1">{weather.condition}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-sage-300">{t('weather.humidity') || 'Humidity'}</p>
            <p className="text-lg font-bold">{weather.humidity}%</p>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
          <div className="text-center">
            <span className="material-icons-outlined text-sage-300">air</span>
            <p className="text-xs text-sage-300 mt-1">{t('weather.wind') || 'Wind'}</p>
            <p className="text-sm font-bold">{weather.windSpeed} km/h</p>
          </div>
          <div className="text-center">
            <span className="material-icons-outlined text-sage-300">water_drop</span>
            <p className="text-xs text-sage-300 mt-1">{t('weather.rain') || 'Rain'}</p>
            <p className="text-sm font-bold">{weather.rainfall}%</p>
          </div>
          <div className="text-center">
            <span className="material-icons-outlined text-sage-300">sunny</span>
            <p className="text-xs text-sage-300 mt-1">{t('weather.uv') || 'UV'}</p>
            <p className="text-sm font-bold">Moderate</p>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-black/20 px-6 py-4">
        <p className="text-xs font-medium text-sage-300 mb-3">
          {t('weather.forecast') || '5-Day Forecast'}
        </p>
        <div className="grid grid-cols-5 gap-2">
          {weather.forecast.map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-xs text-sage-300 mb-1">{day.day}</p>
              <span className={`material-icons-outlined text-sm ${getWeatherColor(day.condition)}`}>
                {getWeatherIcon(day.condition)}
              </span>
              <p className="text-xs font-bold mt-1">{day.temp}°</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Alert if any */}
      {weather.condition === 'rain' && (
        <div className="bg-blue-600/20 px-6 py-3 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm">
            <span className="material-icons-outlined text-blue-300">info</span>
            <p className="text-xs">
              {t('weather.rainAlert') || 'Light showers expected. Ensure livestock shelters are secure.'}
            </p>
          </div>
        </div>
      )}

      {weather.temperature > 35 && (
        <div className="bg-amber-600/20 px-6 py-3 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm">
            <span className="material-icons-outlined text-amber-300">warning</span>
            <p className="text-xs">
              {t('weather.heatAlert') || 'High temperatures. Ensure adequate water for livestock.'}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

WeatherWidget.propTypes = {
  location: PropTypes.string,
  loading: PropTypes.bool,
};

export default WeatherWidget;