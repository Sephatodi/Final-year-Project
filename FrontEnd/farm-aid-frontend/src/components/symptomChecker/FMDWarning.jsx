import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';

const FMDWarning = ({ confidence, onReport }) => {
  const { t } = useTranslation();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Pulse animation every 2 seconds
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white shadow-2xl transition-transform ${
      pulse ? 'scale-[1.02]' : 'scale-100'
    }`}>
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-start gap-4">
          {/* Warning Icon with Pulse */}
          <div className={`relative transition-transform ${pulse ? 'scale-110' : 'scale-100'}`}>
            <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
            <div className="relative w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="material-icons-outlined text-4xl">warning</span>
            </div>
          </div>

          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-black tracking-tight">
                {t('symptomChecker.fmdDetected') || 'FMD DETECTED'}
              </h2>
              <div className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold backdrop-blur-sm">
                {Math.round(confidence * 100)}% {t('common.confidence') || 'Confidence'}
              </div>
            </div>

            <p className="text-red-100 text-lg mb-4">
              {t('symptomChecker.fmdWarning') || 'Foot and Mouth Disease suspected - Immediate action required!'}
            </p>

            {/* Action Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">1</span>
                </div>
                <span className="text-sm">{t('symptomChecker.fmdStep1') || 'Isolate affected animals immediately'}</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">2</span>
                </div>
                <span className="text-sm">{t('symptomChecker.fmdStep2') || 'Do NOT move any animals'}</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">3</span>
                </div>
                <span className="text-sm">{t('symptomChecker.fmdStep3') || 'Disinfect all equipment and footwear'}</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">4</span>
                </div>
                <span className="text-sm">{t('symptomChecker.fmdStep4') || 'Report to DVS immediately'}</span>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <p className="text-sm font-bold mb-2">
                {t('symptomChecker.emergencyContacts') || 'Emergency Contacts:'}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-red-200">DVS Emergency</p>
                  <p className="font-bold">0800 600 777</p>
                </div>
                <div>
                  <p className="text-xs text-red-200">Local Vet</p>
                  <p className="font-bold">+267 71 234 567</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="danger"
                size="lg"
                onClick={onReport}
                icon="warning"
                className="bg-white text-red-600 hover:bg-red-50 border-0 flex-1"
              >
                {t('symptomChecker.reportNow') || 'REPORT TO DVS NOW'}
              </Button>
              
              <Button
                variant="danger"
                size="lg"
                onClick={() => window.location.href = 'tel:0800600777'}
                icon="phone"
                className="bg-transparent border-2 border-white text-white hover:bg-white/20 flex-1"
              >
                {t('common.call') || 'Call Emergency'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Information */}
      <div className="bg-red-800/50 px-6 py-3 border-t border-red-500">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="material-icons-outlined text-sm">location_on</span>
            <span>{t('symptomChecker.currentZone') || 'Current Zone'}: <span className="font-bold">Zone 6B - Francistown</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-icons-outlined text-sm">block</span>
            <span>{t('symptomChecker.restrictions') || 'Movement Restrictions'}: <span className="font-bold">ACTIVE</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

FMDWarning.propTypes = {
  confidence: PropTypes.number,
  onReport: PropTypes.func.isRequired,
};

export default FMDWarning;