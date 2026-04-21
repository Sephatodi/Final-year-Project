import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';

const WeatherAlert = ({ alert, onDismiss, onAction }) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  const getWeatherIcon = (condition) => {
    switch(condition) {
      case 'heavy_rain': return 'rainy';
      case 'storm': return 'thunderstorm';
      case 'flood': return 'flood';
      case 'drought': return 'wb_sunny';
      case 'heatwave': return 'thermostat';
      case 'cold': return 'ac_unit';
      case 'wind': return 'air';
      default: return 'wb_cloudy';
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/20 border-red-300 text-red-800';
      case 'warning': return 'bg-amber-100 dark:bg-amber-900/20 border-amber-300 text-amber-800';
      case 'advisory': return 'bg-blue-100 dark:bg-blue-900/20 border-blue-300 text-blue-800';
      default: return 'bg-sage-100 dark:bg-sage-800 border-sage-300';
    }
  };

  const getSeverityBadge = (severity) => {
    switch(severity) {
      case 'critical': return 'critical';
      case 'warning': return 'warning';
      case 'advisory': return 'info';
      default: return 'default';
    }
  };

  const mockWeatherAlert = {
    id: 1,
    type: 'weather',
    severity: 'warning',
    condition: 'heavy_rain',
    titleEn: 'Heavy Rainfall Warning',
    titleTn: 'Tlhotlhomiso ya Pula e Ntshwa',    
    messageEn: 'Heavy rainfall expected in Central District. Potential flooding in low-lying areas.',
    messageTn: 'Go lebeletswe pula e ntsi kwa Central District. Go ka nna le morwalela kwa mafelong a a kwa tlase.',
    startTime: '2024-03-15T14:00:00',
    endTime: '2024-03-16T08:00:00',
    rainfall: '50-70mm',
    windSpeed: '40 km/h',
    affectedAreas: ['Francistown', 'Tonota', 'Tutume'],
    recommendations: [
      'Move livestock to higher ground',
      'Secure loose items in kraals',
      'Avoid crossing flooded rivers',
      'Store feed in dry areas'
    ],
    ...alert
  };

  const alert_ = mockWeatherAlert;
  const title = language === 'en' ? alert_.titleEn : alert_.titleTn;
  const message = language === 'en' ? alert_.messageEn : alert_.messageTn;

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className={`overflow-hidden border-l-4 ${
      alert_.severity === 'critical' ? 'border-l-red-500' :
      alert_.severity === 'warning' ? 'border-l-amber-500' :
      'border-l-blue-500'
    }`}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Weather Icon */}
          <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${
            alert_.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/20' :
            alert_.severity === 'warning' ? 'bg-amber-100 dark:bg-amber-900/20' :
            'bg-blue-100 dark:bg-blue-900/20'
          }`}>
            <span className={`material-icons-outlined text-4xl ${
              alert_.severity === 'critical' ? 'text-red-600' :
              alert_.severity === 'warning' ? 'text-amber-600' :
              'text-blue-600'
            }`}>
              {getWeatherIcon(alert_.condition)}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-sage-600 dark:text-sage-400 mt-1">{message}</p>
              </div>
              <Badge variant={getSeverityBadge(alert_.severity)} size="md">
                {alert_.severity.toUpperCase()}
              </Badge>
            </div>

            {/* Time Range */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="material-icons-outlined text-sage-400 text-sm">event</span>
                <span>{t('weather.from') || 'From'}: {formatTime(alert_.startTime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-icons-outlined text-sage-400 text-sm">event</span>
                <span>{t('weather.to') || 'To'}: {formatTime(alert_.endTime)}</span>
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg text-center">
                <span className="material-icons-outlined text-primary">water_drop</span>
                <p className="text-xs text-sage-500 mt-1">{t('weather.rainfall') || 'Rainfall'}</p>
                <p className="font-bold">{alert_.rainfall}</p>
              </div>
              <div className="p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg text-center">
                <span className="material-icons-outlined text-primary">air</span>
                <p className="text-xs text-sage-500 mt-1">{t('weather.wind') || 'Wind'}</p>
                <p className="font-bold">{alert_.windSpeed}</p>
              </div>
              <div className="p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg text-center">
                <span className="material-icons-outlined text-primary">location_on</span>
                <p className="text-xs text-sage-500 mt-1">{t('weather.areas') || 'Areas'}</p>
                <p className="font-bold">{alert_.affectedAreas.length}</p>
              </div>
              <div className="p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg text-center">
                <span className="material-icons-outlined text-primary">warning</span>
                <p className="text-xs text-sage-500 mt-1">{t('weather.severity') || 'Severity'}</p>
                <p className="font-bold capitalize">{alert_.severity}</p>
              </div>
            </div>

            {/* Affected Areas */}
            <div className="mb-6">
              <h4 className="font-bold text-sm mb-3">{t('weather.affectedAreas') || 'Affected Areas'}</h4>
              <div className="flex flex-wrap gap-2">
                {alert_.affectedAreas.map((area, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-sage-100 dark:bg-sage-800 rounded-full text-sm"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="mb-6">
              <h4 className="font-bold text-sm mb-3">{t('weather.recommendations') || 'Recommendations'}</h4>
              <ul className="space-y-2">
                {alert_.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="material-icons-outlined text-primary text-sm">check_circle</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={onAction}
                icon="notifications"
              >
                {t('weather.setReminder') || 'Set Reminder'}
              </Button>
              <Button
                variant="secondary"
                onClick={onDismiss}
                icon="close"
              >
                {t('common.dismiss') || 'Dismiss'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-sage-50 dark:bg-sage-900/20 border-t border-sage-200 dark:border-sage-800">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="material-icons-outlined text-sage-400">update</span>
            <span>{t('weather.updated') || 'Updated'}: {new Date().toLocaleTimeString()}</span>
          </div>
          <a
            href="https://www.weather.bw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1"
          >
            {t('weather.details') || 'More Details'}
            <span className="material-icons-outlined text-sm">open_in_new</span>
          </a>
        </div>
      </div>
    </Card>
  );
};

WeatherAlert.propTypes = {
  alert: PropTypes.object,
  onDismiss: PropTypes.func,
  onAction: PropTypes.func,
};

export default WeatherAlert;