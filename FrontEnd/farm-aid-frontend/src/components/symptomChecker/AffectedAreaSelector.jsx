import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';

const AffectedAreaSelector = ({ selectedArea, onSelect }) => {
  const { t } = useTranslation();

  const areas = [
    {
      id: 'mouth',
      icon: 'mouthpiece',
      label: t('areas.mouth') || 'Mouth',
      description: t('areas.mouthDesc') || 'Salivation, blisters, difficulty eating',
      color: 'bg-red-100 dark:bg-red-900/20 text-red-600',
      symptoms: ['Excessive salivation', 'Blisters', 'Difficulty eating', 'Drooling']
    },
    {
      id: 'feet',
      icon: 'footprint',
      label: t('areas.feet') || 'Feet/Legs',
      description: t('areas.feetDesc') || 'Lameness, swelling, blisters on hooves',
      color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600',
      symptoms: ['Lameness', 'Swollen feet', 'Blisters on hooves', 'Reluctant to stand']
    },
    {
      id: 'skin',
      icon: 'skincare',
      label: t('areas.skin') || 'Skin/Hide',
      description: t('areas.skinDesc') || 'Lesions, lumps, hair loss',
      color: 'bg-green-100 dark:bg-green-900/20 text-green-600',
      symptoms: ['Skin lesions', 'Lumps', 'Hair loss', 'Scabs']
    },
    {
      id: 'breathing',
      icon: 'lungs',
      label: t('areas.breathing') || 'Breathing',
      description: t('areas.breathingDesc') || 'Coughing, nasal discharge, difficulty breathing',
      color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600',
      symptoms: ['Coughing', 'Nasal discharge', 'Difficulty breathing', 'Open mouth breathing']
    },
    {
      id: 'stomach',
      icon: 'stomach',
      label: t('areas.stomach') || 'Digestive',
      description: t('areas.stomachDesc') || 'Bloating, diarrhea, loss of appetite',
      color: 'bg-amber-100 dark:bg-amber-900/20 text-amber-600',
      symptoms: ['Bloating', 'Diarrhea', 'Loss of appetite', 'Pain when touched']
    },
    {
      id: 'eyes',
      icon: 'visibility',
      label: t('areas.eyes') || 'Eyes',
      description: t('areas.eyesDesc') ||      description: t('areas.eyesDesc') || 'Discharge, cloudiness, swelling',
      color: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600',
      symptoms: ['Eye discharge', 'Cloudiness', 'Swelling', 'Sensitivity to light']
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-sage-900 dark:text-white mb-2">
          {t('symptomChecker.selectArea') || 'Select Affected Area'}
        </h3>
        <p className="text-sm text-sage-500">
          {t('symptomChecker.areaSubtitle') || 'Which part of the animal shows symptoms?'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {areas.map(area => (
          <button
            key={area.id}
            onClick={() => onSelect(area.id)}
            className={`group text-left transition-all duration-300 ${
              selectedArea === area.id ? 'scale-102' : 'hover:scale-101'
            }`}
          >
            <Card className={`p-4 h-full ${
              selectedArea === area.id 
                ? 'ring-2 ring-primary shadow-lg' 
                : 'hover:shadow-md'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-3 rounded-xl ${area.color} group-hover:scale-110 transition-transform`}>
                  <span className="material-icons-outlined">{area.icon}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold">{area.label}</h4>
                    {selectedArea === area.id && (
                      <span className="material-icons-outlined text-primary text-sm">check_circle</span>
                    )}
                  </div>
                  <p className="text-xs text-sage-500 mb-2">{area.description}</p>
                  
                  {/* Symptom Preview */}
                  <div className="flex flex-wrap gap-1">
                    {area.symptoms.slice(0, 2).map((symptom, idx) => (
                      <span key={idx} className="text-[10px] bg-sage-100 dark:bg-sage-800 px-1.5 py-0.5 rounded">
                        {symptom}
                      </span>
                    ))}
                    {area.symptoms.length > 2 && (
                      <span className="text-[10px] text-sage-400">+{area.symptoms.length - 2}</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </button>
        ))}
      </div>

      {/* FMD Warning for Mouth/Feet */}
      {(selectedArea === 'mouth' || selectedArea === 'feet') && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="material-icons-outlined text-red-600">warning</span>
            <div>
              <p className="text-sm font-bold text-red-800 dark:text-red-300">
                {t('symptomChecker.fmdWarning') || '⚠️ FMD Risk Area'}
              </p>
              <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                {t('symptomChecker.fmdAreaWarning') || 'Symptoms in mouth or feet could indicate Foot and Mouth Disease. Please be extra vigilant.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AffectedAreaSelector.propTypes = {
  selectedArea: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

export default AffectedAreaSelector;