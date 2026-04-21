import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';

const ConsultationSummary = ({ consultation, messages, onRate, onDownload }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getDuration = () => {
    if (!consultation?.createdAt || !consultation?.resolvedAt) return 'N/A';
    const start = new Date(consultation.createdAt);
    const end = new Date(consultation.resolvedAt);
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins % 60}m`;
    }
    return `${diffMins}m`;
  };

  const getMessageCount = () => {
    return messages?.length || 0;
  };

  const getAttachmentCount = () => {
    return messages?.reduce((count, msg) => 
      count + (msg.attachments?.length || 0), 0
    ) || 0;
  };

  const handleDownloadTranscript = () => {
    // Generate and download transcript
    const transcript = messages?.map(msg => 
      `[${new Date(msg.timestamp).toLocaleString()}] ${msg.senderName}: ${msg.content}`
    ).join('\n');
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultation-${consultation.id}-transcript.txt`;
    a.click();
  };

  const handleNewConsultation = () => {
    navigate('/telehealth/new');
  };

  return (
    <Card className="max-w-3xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-6 border-b border-primary/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="material-icons-outlined text-3xl text-primary">check_circle</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{t('telehealth.consultationComplete') || 'Consultation Complete'}</h2>
            <p className="text-sage-500">
              {t('telehealth.summary') || 'Summary of your consultation'}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-sage-500">{t('telehealth.duration') || 'Duration'}</p>
            <p className="text-xl font-bold">{getDuration()}</p>
          </div>
          <div>
            <p className="text-xs text-sage-500">{t('telehealth.messages') || 'Messages'}</p>
            <p className="text-xl font-bold">{getMessageCount()}</p>
          </div>
          <div>
            <p className="text-xs text-sage-500">{t('telehealth.attachments') || 'Attachments'}</p>
            <p className="text-xl font-bold">{getAttachmentCount()}</p>
          </div>
          <div>
            <p className="text-xs text-sage-500">{t('telehealth.expert') || 'Expert'}</p>
            <p className="text-xl font-bold truncate">{consultation?.expertName || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Diagnosis & Treatment */}
      {(consultation?.diagnosis || consultation?.treatment) && (
        <div className="p-6 border-b border-sage-200 dark:border-sage-800">
          <h3 className="font-bold text-lg mb-4">{t('telehealth.diagnosis') || 'Diagnosis & Treatment'}</h3>
          
          {consultation.diagnosis && (
            <div className="mb-4">
              <p className="text-sm text-sage-500 mb-1">{t('telehealth.diagnosis') || 'Diagnosis'}</p>
              <p className="font-medium p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
                {consultation.diagnosis}
              </p>
            </div>
          )}

          {consultation.treatment && (
            <div>
              <p className="text-sm text-sage-500 mb-1">{t('telehealth.treatment') || 'Treatment Plan'}</p>
              <p className="font-medium p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
                {consultation.treatment}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {consultation?.recommendations && consultation.recommendations.length > 0 && (
        <div className="p-6 border-b border-sage-200 dark:border-sage-800">
          <h3 className="font-bold text-lg mb-4">{t('telehealth.recommendations') || 'Recommendations'}</h3>
          <ul className="space-y-2">
            {consultation.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="material-icons-outlined text-primary text-sm">check_circle</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Follow-up */}
      {consultation?.followUp && (
        <div className="p-6 border-b border-sage-200 dark:border-sage-800">
          <h3 className="font-bold text-lg mb-4">{t('telehealth.followUp') || 'Follow-up'}</h3>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="material-icons-outlined text-blue-600">event</span>
              <div>
                <p className="font-medium">{t('telehealth.nextAppointment') || 'Next Appointment'}</p>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {new Date(consultation.followUp).toLocaleDateString()} at 10:00 AM
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-6 bg-sage-50 dark:bg-sage-900/20 space-y-4">
        {/* Rating Prompt */}
        {!consultation?.rated && (
          <div className="text-center mb-4">
            <p className="text-sm text-sage-600 mb-3">
              {t('telehealth.rateExperience') || 'How was your experience?'}
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => onRate?.(rating)}
                  className="w-10 h-10 rounded-full hover:bg-primary/10 flex items-center justify-center group"
                >
                  <span className="material-icons-outlined text-2xl text-sage-400 group-hover:text-primary">
                    star
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="secondary"
            onClick={handleDownloadTranscript}
            icon="download"
            fullWidth
          >
            {t('telehealth.downloadTranscript') || 'Download Transcript'}
          </Button>
          
          <Button
            variant="primary"
            onClick={handleNewConsultation}
            icon="add"
            fullWidth
          >
            {t('telehealth.newConsultation') || 'New Consultation'}
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-center text-sage-400 mt-4">
          {t('telehealth.disclaimer') || 'This consultation summary is for informational purposes only. Always follow your veterinarian\'s advice.'}
        </p>
      </div>
    </Card>
  );
};

ConsultationSummary.propTypes = {
  consultation: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    expertName: PropTypes.string,
    diagnosis: PropTypes.string,
    treatment: PropTypes.string,
    recommendations: PropTypes.arrayOf(PropTypes.string),
    followUp: PropTypes.string,
    rated: PropTypes.bool,
    createdAt: PropTypes.string,
    resolvedAt: PropTypes.string,
  }),
  messages: PropTypes.array,
  onRate: PropTypes.func,
  onDownload: PropTypes.func,
};

export default ConsultationSummary;