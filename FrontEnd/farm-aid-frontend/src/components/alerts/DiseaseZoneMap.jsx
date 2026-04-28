import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';

// Note: In production, this would use a real mapping library like Leaflet or Mapbox
const DiseaseZoneMap = ({ zones = [], userLocation, onZoneClick }) => {
  const { t } = useTranslation();
  const [selectedZone, setSelectedZone] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Mock zones data
  const mockZones = zones.length ? zones : [
    {
      id: 1,
      name: 'Zone 6B',
      disease: 'Foot and Mouth Disease',
      severity: 'critical',
      restrictions: 'No movement of cloven-hoofed animals',
      coordinates: { lat: -21.5, lng: 27.5 },
      radius: 50,
      active: true
    },
    {
      id: 2,
      name: 'Zone 4A',
      disease: 'Heartwater',
      severity: 'warning',
      restrictions: 'Quarantine required for new animals',
      coordinates: { lat: -22.0, lng: 28.0 },
      radius: 30,
      active: true
    },
    {
      id: 3,
      name: 'Zone 2C',
      disease: 'Anthrax',
      severity: 'info',
      restrictions: 'Vaccination recommended',
      coordinates: { lat: -21.8, lng: 26.5 },
      radius: 40,
      active: false
    }
  ];

  useEffect(() => {
    // Simulate map loading
    setTimeout(() => setMapLoaded(true), 1000);
  }, []);

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-amber-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-sage-500';
    }
  };

  const getSeverityBadge = (severity) => {
    switch(severity) {
      case 'critical': return 'critical';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
    if (onZoneClick) {
      onZoneClick(zone);
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-sage-200 dark:border-sage-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">
              {t('alerts.diseaseZones') || 'Disease Control Zones'}
            </h3>
            <p className="text-sm text-sage-500">
              {t('alerts.activeZones') || 'Active disease surveillance zones'}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="critical" size="sm">Critical</Badge>
            <Badge variant="warning" size="sm">Warning</Badge>
            <Badge variant="info" size="sm">Info</Badge>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="relative bg-sage-100 dark:bg-sage-800 h-96">
        {!mapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sage-500">{t('common.loading') || 'Loading map...'}</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* Mock Map Grid */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}></div>

            {/* Zone Circles */}
            {mockZones.map(zone => (
              <button
                key={zone.id}
                onClick={() => handleZoneClick(zone)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 group ${
                  selectedZone?.id === zone.id ? 'z-10' : ''
                }`}
                style={{
                  left: `${((zone.coordinates.lng + 180) / 360) * 100}%`,
                  top: `${((90 - zone.coordinates.lat) / 180) * 100}%`
                }}
              >
                {/* Zone Radius Indicator */}
                <div 
                  className={`absolute rounded-full opacity-20 ${getSeverityColor(zone.severity)} transition-all group-hover:scale-110`}
                  style={{
                    width: `${zone.radius * 2}px`,
                    height: `${zone.radius * 2}px`,
                    left: `-${zone.radius}px`,
                    top: `-${zone.radius}px`
                  }}
                />
                
                {/* Zone Center Point */}
                <div className={`relative w-4 h-4 rounded-full ${getSeverityColor(zone.severity)} border-2 border-white shadow-lg group-hover:scale-150 transition-transform`}>
                  {!zone.active && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-white rotate-45"></div>
                    </div>
                  )}
                </div>

                {/* Zone Label */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white dark:bg-sage-900 px-2 py-1 rounded shadow-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {zone.name} - {zone.disease}
                </div>
              </button>
            ))}

            {/* User Location */}
            {userLocation && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                style={{
                  left: `${((userLocation.lng + 180) / 360) * 100}%`,
                  top: `${((90 - userLocation.lat) / 180) * 100}%`
                }}
              >
                <div className="relative">
                  <div className="w-6 h-6 bg-primary rounded-full border-3 border-white shadow-lg animate-pulse"></div>
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-primary text-white px-2 py-1 rounded text-xs font-bold">
                    {t('alerts.yourLocation') || 'Your Location'}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Zone Info */}
      {selectedZone && (
        <div className="p-6 border-t border-sage-200 dark:border-sage-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold text-lg">{selectedZone.name}</h4>
                <Badge variant={getSeverityBadge(selectedZone.severity)} size="sm">
                  {selectedZone.severity}
                </Badge>
              </div>
              
              <p className="text-sm font-medium text-sage-700 dark:text-sage-300 mb-1">
                {selectedZone.disease}
              </p>
              
              <p className="text-sm text-sage-500 mb-3">
                {selectedZone.restrictions}
              </p>

              <div className="flex gap-4 text-xs text-sage-500">
                <div className="flex items-center gap-1">
                  <span className="material-icons-outlined text-sm">radio_button_checked</span>
                  <span>{t('alerts.radius') || 'Radius'}: {selectedZone.radius}km</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-icons-outlined text-sm">circle</span>
                  <span>{selectedZone.active ? t('alerts.active') || 'Active' : t('alerts.inactive') || 'Inactive'}</span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {/* View details */}}
              icon="arrow_forward"
              iconPosition="right"
            >
              {t('common.viewDetails') || 'View Details'}
            </Button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="px-6 py-4 bg-sage-50 dark:bg-sage-900/20 border-t border-sage-200 dark:border-sage-800">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>{t('alerts.criticalZone') || 'Critical Zone'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span>{t('alerts.warningZone') || 'Warning Zone'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>{t('alerts.monitoringZone') || 'Monitoring Zone'}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-icons-outlined text-sm text-primary">my_location</span>
            <span>{t('alerts.yourLocation') || 'Your Location'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

DiseaseZoneMap.propTypes = {
  zones: PropTypes.array,
  userLocation: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  onZoneClick: PropTypes.func,
};

export default DiseaseZoneMap;