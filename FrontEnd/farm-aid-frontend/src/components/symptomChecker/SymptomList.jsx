import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';

const SymptomList = ({ 
  area, 
  selectedSymptoms = [], 
  onSymptomToggle,
  species 
}) => {
  const { t } = useTranslation();

  const symptomOptions = {
    mouth: [
      { id: 'excessive_salivation', label: 'Excessive salivation', severity: 'high', fmdRelated: true },
      { id: 'blisters_mouth', label: 'Blisters in mouth', severity: 'high', fmdRelated: true },
      { id: 'difficulty_eating', label: 'Difficulty eating', severity: 'medium' },
      { id: 'drooling', label: 'Drooling', severity: 'medium', fmdRelated: true },
      { id: 'bad_breath', label: 'Bad breath', severity: 'low' },
      { id: 'swollen_tongue', label: 'Swollen tongue', severity: 'high' },
    ],
    feet: [
      { id: 'lameness', label: 'Lameness', severity: 'high', fmdRelated: true },
      { id: 'swollen_feet', label: 'Swollen feet', severity: 'high' },
      { id: 'blisters_feet', label: 'Blisters on hooves', severity: 'high', fmdRelated: true },
      { id: 'reluctant_stand', label: 'Reluctant to stand', severity: 'medium' },
      { id: 'limping', label: 'Limping', severity: 'medium' },
      { id: 'hot_hooves', label: 'Hot hooves', severity: 'medium' },
    ],
    skin: [
      { id: 'skin_lesions', label: 'Skin lesions', severity: 'high' },
      { id: 'lumps', label: 'Lumps under skin', severity: 'high' },
      { id: 'hair_loss', label: 'Hair loss', severity: 'medium' },
      { id: 'scabs', label: 'Scabs/crusts', severity: 'medium' },
      { id: 'itching', label: 'Intense itching', severity: 'low' },
      { id: 'thickened_skin', label: 'Thickened skin', severity: 'medium' },
    ],
    breathing: [
      { id: 'coughing', label: 'Coughing', severity: 'medium' },
      { id: 'nasal_discharge', label: 'Nasal discharge', severity: 'medium' },
      { id: 'difficulty_breathing', label: 'Difficulty breathing', severity: 'high' },
      { id: 'open_mouth', label: 'Open mouth breathing', severity: 'high' },
      { id: 'wheezing', label: 'Wheezing', severity: 'medium' },
      { id: 'rapid_breathing', label: 'Rapid breathing', severity: 'medium' },
    ],
    stomach: [
      { id: 'bloating', label: 'Bloating/distension', severity: 'high' },
      { id: 'diarrhea', label: 'Diarrhea', severity: 'medium' },
      { id: 'loss_appetite', label: 'Loss of appetite', severity: 'medium' },
      { id: 'abdominal_pain', label: 'Abdominal pain', severity: 'high' },
      { id: 'constipation', label: 'Constipation', severity: 'low' },
      { id: 'vomiting', label: 'Vomiting', severity: 'high' },
    ],
    eyes: [
      { id: 'eye_discharge', label: 'Eye discharge', severity: 'medium' },
      { id: 'cloudy_eyes', label: 'Cloudy eyes', severity: 'high' },
      { id: 'swollen_eyes', label: 'Swollen eyelids', severity: 'medium' },
      { id: 'light_sensitive', label: 'Sensitive to light', severity: 'low' },
      { id: 'red_eyes', label: 'Red/inflamed eyes', severity: 'medium' },
      { id: 'blindness', label: 'Blindness', severity: 'high' },
    ],
  };

  const symptoms = symptomOptions[area] || [];

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'bg-red-100 dark:bg-red-900/20 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 border-amber-200';
      case 'low': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 border-blue-200';
      default: return 'bg-sage-100 dark:bg-sage-800 text-sage-700';
    }
  };

  const fmdSymptomsCount = symptoms.filter(s => s.fmdRelated && selectedSymptoms.includes(s.id)).length;
  const totalFmdSymptoms = symptoms.filter(s => s.fmdRelated).length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-sage-900 dark:text-white mb-2">
          {t('symptomChecker.selectSymptoms') || 'Select Observed Symptoms'}
        </h3>
        <p className="text-sm text-sage-500">
          {t('symptomChecker.symptomsSubtitle') || 'Check all symptoms you have observed'}
        </p>
      </div>

      {/* FMD Progress Warning */}
      {area === 'mouth' || area === 'feet' ? (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-icons-outlined text-amber-600">warning</span>
              <span className="text-sm font-medium">
                {t('symptomChecker.fmdSymptoms') || 'FMD-related symptoms'}
              </span>
            </div>
            <span className="text-sm font-bold">
              {fmdSymptomsCount}/{totalFmdSymptoms}
            </span>
          </div>
          <div className="mt-2 w-full h-2 bg-amber-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-600 transition-all duration-300"
              style={{ width: `${(fmdSymptomsCount / totalFmdSymptoms) * 100}%` }}
            />
          </div>
        </div>
      ) : null}

      {/* Symptoms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {symptoms.map(symptom => (
          <button
            key={symptom.id}
            onClick={() => onSymptomToggle(symptom.id)}
            className={`group relative p-4 rounded-xl border-2 transition-all ${
              selectedSymptoms.includes(symptom.id)
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-sage-200 dark:border-sage-800 hover:border-primary/50 hover:bg-sage-50 dark:hover:bg-sage-900/20'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                selectedSymptoms.includes(symptom.id)
                  ? 'bg-primary border-primary text-white'
                  : 'border-sage-300 dark:border-sage-600'
              }`}>
                {selectedSymptoms.includes(symptom.id) && (
                  <span className="material-icons-outlined text-sm">check</span>
                )}
              </div>

              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{symptom.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${getSeverityColor(symptom.severity)}`}>
                    {symptom.severity}
                  </span>
                </div>

                {symptom.fmdRelated && (
                  <div className="flex items-center gap-1">
                    <span className="material-icons-outlined text-xs text-red-500">warning</span>
                    <span className="text-[10px] text-red-600 dark:text-red-400">
                      {t('symptomChecker.fmdRelated') || 'FMD Related'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Hover effect */}
            <div className={`absolute inset-0 rounded-xl pointer-events-none transition-opacity ${
              selectedSymptoms.includes(symptom.id) ? 'opacity-0' : 'group-hover:opacity-100 opacity-0'
            }`} />
          </button>
        ))}
      </div>

      {symptoms.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-sage-500">
            {t('symptomChecker.noSymptoms') || 'No symptoms available for this area'}
          </p>
        </Card>
      )}
    </div>
  );
};

SymptomList.propTypes = {
  area: PropTypes.string.isRequired,
  selectedSymptoms: PropTypes.array,
  onSymptomToggle: PropTypes.func.isRequired,
  species: PropTypes.string,
};

export default SymptomList;