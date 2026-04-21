import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Input from '../common/Input';
import Button from '../common/Button';

const LocationPicker = ({ 
  location, 
  onLocationChange, 
  error, 
  detecting, 
  onDetect 
}) => {
  const { t } = useTranslation();
  const [showMap, setShowMap] = useState(false);
  const [manualAddress, setManualAddress] = useState('');

  const handleManualSubmit = () => {
    if (manualAddress.trim()) {
      onLocationChange(manualAddress.trim(), null);
      setManualAddress('');
      setShowMap(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Current Location Display */}
      <div className="flex gap-2">
        <Input
          value={location}
          onChange={(e) => onLocationChange(e.target.value, null)}
          placeholder={t('report.locationPlaceholder') || 'Farm location or GPS coordinates'}
          error={error}
          icon="location_on"
          fullWidth
          readOnly={detecting}
        />
        
        <Button
          type="button"
          variant="secondary"
          onClick={onDetect}
          loading={detecting}
          icon="gps_fixed"
        >
          {t('report.detect') || 'Detect'}
        </Button>
      </div>

      {/* Location Status */}
      {detecting && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <span className="material-icons-outlined animate-spin">refresh</span>
          {t('report.detecting') || 'Detecting your location...'}
        </div>
      )}

      {/* Manual Entry Toggle */}
      <button
        type="button"
        onClick={() => setShowMap(!showMap)}
        className="text-sm text-primary hover:underline flex items-center gap-1"
      >
        <span className="material-icons-outlined text-sm">
          {showMap ? 'expand_less' : 'expand_more'}
        </span>
        {showMap 
          ? (t('report.hideManual') || 'Hide manual entry')
          : (t('report.enterManually') || 'Enter location manually')}
      </button>

      {/* Manual Address Entry */}
      {showMap && (
        <div className="mt-3 p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg space-y-3">
          <p className="text-sm font-medium">
            {t('report.manualAddress') || 'Enter farm address or description:'}
          </p>
          
          <textarea
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            rows="3"
            className="w-full p-2 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900"
            placeholder={t('report.addressPlaceholder') || 'e.g., 5km north of Francistown, near the river...'}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setShowMap(false)}
            >
              {t('common.cancel') || 'Cancel'}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="primary"
              onClick={handleManualSubmit}
              disabled={!manualAddress.trim()}
            >
              {t('common.apply') || 'Apply'}
            </Button>
          </div>
        </div>
      )}

      {/* Location Help */}
      <div className="flex items-start gap-2 text-xs text-sage-500">
        <span className="material-icons-outlined text-sm">info</span>
        <p>
          {t('report.locationHelp') || 'Your location helps DVS respond quickly. GPS detection works best outdoors.'}
        </p>
      </div>
    </div>
  );
};

LocationPicker.propTypes = {
  location: PropTypes.string,
  onLocationChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  detecting: PropTypes.bool,
  onDetect: PropTypes.func.isRequired,
};

export default LocationPicker;