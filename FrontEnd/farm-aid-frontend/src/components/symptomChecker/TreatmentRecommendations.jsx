import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';

const TreatmentRecommendations = ({ recommendations = [], diseases = [] }) => {
  const { t } = useTranslation();

  const getUrgencyColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'high': return 'bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'medium': return 'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default: return 'bg-sage-100 dark:bg-sage-800 border-sage-200 dark:border-sage-800';
    }
  };

  const getUrgencyIcon = (priority) => {
    switch (priority) {
      case 'critical': return 'emergency';
      case 'high': return 'priority_high';
      case 'medium': return 'schedule';
      default: return 'info';
    }
  };

  const criticalCount = diseases.filter(d => d.priority === 'critical' || d.priority === 'high').length;

  return (
    <Card className="overflow-hidden">
      <div className="bg-sage-50 dark:bg-sage-900/20 px-6 py-4 border-b border-sage-200 dark:border-sage-800">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-lg">
              {t('symptomChecker.recommendations') || 'Treatment Recommendations'}
            </h4>
            {criticalCount > 0 && (
              <p className="text-sm text-red-600 mt-1">
                ⚠️ {criticalCount} {t('symptomChecker.urgentActions') || 'urgent action(s) required'}
              </p>
            )}
          </div>
          <span className="material-icons-outlined text-3xl text-primary">medical_services</span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Immediate Actions */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            <h5 className="font-bold text-sm uppercase tracking-wider text-sage-500">
              {t('symptomChecker.immediateActions') || 'Immediate Actions'}
            </h5>

            {recommendations.map((rec, index) => {
              const isUrgent = rec.includes('IMMEDIATE') || rec.includes('URGENT');
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${isUrgent
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      : 'bg-sage-50 dark:bg-sage-900/20 border-sage-200 dark:border-sage-800'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`material-icons-outlined ${isUrgent ? 'text-red-600' : 'text-primary'
                      }`}>
                      {isUrgent ? 'warning' : 'check_circle'}
                    </span>
                    <span className={`flex-1 text-sm ${isUrgent ? 'font-bold' : ''
                      }`}>
                      {rec}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Disease-specific Information */}
        {diseases.map((disease, index) => (
          <div key={index} className={`p-4 rounded-lg border ${getUrgencyColor(disease.priority)}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`material-icons-outlined text-sm ${disease.priority === 'critical' ? 'text-red-600' :
                  disease.priority === 'high' ? 'text-amber-600' :
                    'text-blue-600'
                }`}>
                {getUrgencyIcon(disease.priority)}
              </span>
              <h6 className="font-bold">{disease.name}</h6>
            </div>

            {/* Quick Treatment Tips */}
            <ul className="space-y-2 text-sm">
              {disease.treatment && (
                <li className="flex items-start gap-2">
                  <span className="material-icons-outlined text-xs text-primary">medication</span>
                  <span>{disease.treatment}</span>
                </li>
              )}
              {disease.prevention && (
                <li className="flex items-start gap-2">
                  <span className="material-icons-outlined text-xs text-primary">shield</span>
                  <span>{disease.prevention}</span>
                </li>
              )}
            </ul>
          </div>
        ))}

        {/* Prevention Tips */}
        <div className="mt-6 pt-6 border-t border-sage-200 dark:border-sage-800">
          <h5 className="font-bold text-sm uppercase tracking-wider text-sage-500 mb-4">
            {t('symptomChecker.preventionTips') || 'Prevention Tips'}
          </h5>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg text-center">
              <span className="material-icons-outlined text-primary mb-1">clean_hands</span>
              <p className="text-xs">{t('prevention.biosecurity') || 'Maintain biosecurity'}</p>
            </div>
            <div className="p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg text-center">
              <span className="material-icons-outlined text-primary mb-1">vaccines</span>
              <p className="text-xs">{t('prevention.vaccinate') || 'Vaccinate regularly'}</p>
            </div>
            <div className="p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg text-center">
              <span className="material-icons-outlined text-primary mb-1">bug_report</span>
              <p className="text-xs">{t('prevention.quarantine') || 'Quarantine new animals'}</p>
            </div>
            <div className="p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg text-center">
              <span className="material-icons-outlined text-primary mb-1">monitor_heart</span>
              <p className="text-xs">{t('prevention.monitor') || 'Monitor daily'}</p>
            </div>
          </div>
        </div>

        {/* When to Call Vet */}
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <span className="material-icons-outlined text-amber-600">phone_in_talk</span>
            <div>
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">
                {t('symptomChecker.whenCallVet') || 'When to Call a Veterinarian'}
              </p>
              <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
                <li>• {t('symptomChecker.vetReason1') || 'Symptoms persist for more than 24 hours'}</li>
                <li>• {t('symptomChecker.vetReason2') || 'Multiple animals show symptoms'}</li>
                <li>• {t('symptomChecker.vetReason3') || 'Animal is in severe distress'}</li>
                <li>• {t('symptomChecker.vetReason4') || 'Notifiable diseases are suspected'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

TreatmentRecommendations.propTypes = {
  recommendations: PropTypes.arrayOf(PropTypes.string),
  diseases: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      priority: PropTypes.string,
      treatment: PropTypes.string,
      prevention: PropTypes.string,
    })
  ),
};

export default TreatmentRecommendations;