import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import FMDWarning from './FMDWarning';
import TreatmentRecommendations from './TreatmentRecommendations';

const AIResults = ({ results, species, symptoms, photos, onReset }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.5) return 'text-amber-600';
    return 'text-sage-600';
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'critical':
        return <Badge variant="critical" size="md">CRITICAL</Badge>;
      case 'high':
        return <Badge variant="warning" size="md">HIGH PRIORITY</Badge>;
      case 'medium':
        return <Badge variant="info" size="md">MEDIUM</Badge>;
      default:
        return <Badge variant="default" size="md">LOW</Badge>;
    }
  };

  const handleReportDisease = () => {
    navigate('/report-disease', {
      state: {
        species,
        symptoms,
        aiResults: results,
        photos
      }
    });
  };

  const handleConsultExpert = () => {
    navigate('/telehealth', {
      state: {
        symptoms,
        aiResults: results,
        species
      }
    });
  };

  // Check if FMD is detected with high confidence
  const fmdResult = results?.possibleDiseases?.find(
    d => d.name.toLowerCase().includes('foot and mouth') && d.confidence > 0.7
  );

  return (
    <div className="space-y-6">
      {/* FMD Warning - Show if detected */}
      {fmdResult && (
        <FMDWarning 
          confidence={fmdResult.confidence}
          onReport={handleReportDisease}
        />
      )}

      {/* Main Results Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-sage-900 dark:text-white">
                {t('symptomChecker.aiAnalysis') || 'AI Analysis Results'}
              </h3>
              <p className="text-sm text-sage-500">
                {t('symptomChecker.analyzed') || 'Analysis complete'} • {new Date().toLocaleTimeString()}
              </p>
            </div>
            <Badge variant="primary" size="lg" icon="bolt">
              AI POWERED
            </Badge>
          </div>
        </div>

        <div className="p-6">
          {/* Disease Matches */}
          <div className="space-y-4 mb-8">
            <h4 className="font-bold text-sm uppercase tracking-wider text-sage-500">
              {t('symptomChecker.possibleDiseases') || 'Possible Diseases'}
            </h4>

            {results?.possibleDiseases?.map((disease, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  index === 0 
                    ? 'border-primary bg-primary/5' 
                    : 'border-sage-200 dark:border-sage-800'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-bold text-lg">{disease.name}</h5>
                      {getPriorityBadge(disease.priority)}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-sage-500">
                          {t('symptomChecker.confidence') || 'Confidence'}:
                        </span>
                        <span className={`text-lg font-bold ${getConfidenceColor(disease.confidence)}`}>
                          {Math.round(disease.confidence * 100)}%
                        </span>
                      </div>

                      {disease.notifiable && (
                        <Badge variant="critical" size="sm" icon="warning">
                          {t('symptomChecker.notifiable') || 'Notifiable'}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Confidence Gauge */}
                  <div className="w-16 h-16 relative">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={disease.confidence > 0.8 ? '#10B981' : disease.confidence > 0.5 ? '#F59E0B' : '#6B7280'}
                        strokeWidth="3"
                        strokeDasharray={`${disease.confidence * 100}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold">{Math.round(disease.confidence * 100)}%</span>
                    </div>
                  </div>
                </div>

                {/* Matched Symptoms */}
                {disease.matchedSymptoms && disease.matchedSymptoms.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-sage-500 mb-2">
                      {t('symptomChecker.matchedSymptoms') || 'Matched symptoms'}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {disease.matchedSymptoms.map((symptom, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-sage-100 dark:bg-sage-800 rounded text-xs"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Treatment Recommendations */}
          <TreatmentRecommendations 
            recommendations={results?.recommendations || []}
            diseases={results?.possibleDiseases || []}
          />

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-sage-200 dark:border-sage-800">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {results?.possibleDiseases?.length || 0}
              </div>
              <div className="text-xs text-sage-500">
                {t('symptomChecker.matches') || 'Matches'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.max(...(results?.possibleDiseases?.map(d => d.confidence) || [0])) * 100}%
              </div>
              <div className="text-xs text-sage-500">
                {t('symptomChecker.topConfidence') || 'Top Confidence'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {symptoms?.length || 0}
              </div>
              <div className="text-xs text-sage-500">
                {t('symptomChecker.symptoms') || 'Symptoms'}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="secondary"
          size="lg"
          onClick={onReset}
          icon="refresh"
          fullWidth
        >
          {t('common.checkAnother') || 'Check Another'}
        </Button>

        {!fmdResult && (
          <Button
            variant="primary"
            size="lg"
            onClick={handleConsultExpert}
            icon="videocam"
            fullWidth
          >
            {t('symptomChecker.consultExpert') || 'Consult Expert'}
          </Button>
        )}

        <Button
          variant={fmdResult ? 'danger' : 'outline'}
          size="lg"
          onClick={handleReportDisease}
          icon="warning"
          fullWidth
        >
          {t('symptomChecker.reportDisease') || 'Report Disease'}
        </Button>
      </div>
    </div>
  );
};

AIResults.propTypes = {
  results: PropTypes.shape({
    possibleDiseases: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        confidence: PropTypes.number,
        priority: PropTypes.string,
        notifiable: PropTypes.bool,
        matchedSymptoms: PropTypes.array,
      })
    ),
    recommendations: PropTypes.arrayOf(PropTypes.string),
  }),
  species: PropTypes.string,
  symptoms: PropTypes.array,
  photos: PropTypes.array,
  onReset: PropTypes.func.isRequired,
};

export default AIResults;