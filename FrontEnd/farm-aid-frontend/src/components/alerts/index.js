// Alerts components index file
import AlertBanner from './AlertBanner';
import AlertCard from './AlertCard';
import AlertList from './AlertList';
import DiseaseZoneMap from './DiseaseZoneMap';
import MovementRestrictions from './MovementRestrictions';
import WeatherAlert from './WeatherAlert';

export { AlertBanner, AlertCard, AlertList, DiseaseZoneMap, MovementRestrictions, WeatherAlert };

// Re-export all alerts components as a single object
const AlertsComponents = {
  AlertBanner,
  AlertList,
  AlertCard,
  DiseaseZoneMap,
  MovementRestrictions,
  WeatherAlert,
};

export default AlertsComponents;
