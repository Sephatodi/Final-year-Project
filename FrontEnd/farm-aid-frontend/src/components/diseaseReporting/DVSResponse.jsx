import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import ReportStatus from './ReportStatus';

const DVSResponse = ({ report, onRespond, onAcknowledge }) => {
  const { t } = useTranslation();
  const [response, setResponse] = useState('');
  const [isResponding, setIsResponding] = useState(false);

  const mockResponse = {
    officer: 'Dr. Kealeboga Molefe',
    title: 'Senior Veterinary Officer',
    department: 'Department of Veterinary Services',
    contact: '+267 71 234 567',
    email: 'kmolefe@gov.bw',
    message: 'Thank you for your report. We have assigned an officer to investigate. Please keep animals isolated and do not move them. An officer will visit your farm within 24 hours.',
    instructions: [
      'Keep affected animals separated from healthy ones',
      'Do not allow any animal movements',
      'Disinfect footwear and equipment before and after handling animals',
      'Prepare records of recent animal movements',
      'Have your BAITS documents ready for inspection'
    ],
    attachments: [
      { name: 'FMD_Information_Sheet.pdf', size: '2.4 MB' },
      { name: 'Biosecurity_Guidelines.pdf', size: '1.8 MB' }
    ],
    followUp: {
      date: '2024-03-20',
      time: '10:00 AM',
      type: 'Farm Visit'
    }
  };

  const response_ = report?.response || mockResponse;

  const handleRespond = () => {
    if (response.trim() && onRespond) {
      onRespond(response);
      setResponse('');
      setIsResponding(false);
    }
  };

  const handleAcknowledge = () => {
    if (onAcknowledge) {
      onAcknowledge(report.id);
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="material-icons-outlined text-2xl text-primary">account_balance</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">{t('report.dvsResponse') || 'DVS Response'}</h3>
              <p className="text-sm text-sage-500">
                {t('report.reportId') || 'Report ID'}: {report?.reportId}
              </p>
            </div>
          </div>
          <ReportStatus status={report?.status || 'investigating'} size="md" />
        </div>
      </div>

      {/* Officer Information */}
      <div className="p-6 border-b border-sage-200 dark:border-sage-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-sage-500 mb-1">{t('report.assignedOfficer') || 'Assigned Officer'}</p>
            <h4 className="text-xl font-bold">{response_.officer}</h4>
            <p className="text-sm">{response_.title} • {response_.department}</p>
          </div>
          <div className="flex gap-2">
            <a href={`tel:${response_.contact}`} className="p-2 bg-sage-100 dark:bg-sage-800 rounded-lg hover:bg-primary/20 transition-colors">
              <span className="material-icons-outlined">phone</span>
            </a>
            <a href={`mailto:${response_.email}`} className="p-2 bg-sage-100 dark:bg-sage-800 rounded-lg hover:bg-primary/20 transition-colors">
              <span className="material-icons-outlined">email</span>
            </a>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="p-6 border-b border-sage-200 dark:border-sage-800">
        <p className="text-sage-700 dark:text-sage-300 leading-relaxed">
          {response_.message}
        </p>
      </div>

      {/* Instructions */}
      <div className="p-6 border-b border-sage-200 dark:border-sage-800">
        <h5 className="font-bold mb-4 flex items-center gap-2">
          <span className="material-icons-outlined text-primary">checklist</span>
          {t('report.instructions') || 'Instructions'}
        </h5>
        <ul className="space-y-3">
          {response_.instructions.map((instruction, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <span className="material-icons-outlined text-primary text-sm">chevron_right</span>
              {instruction}
            </li>
          ))}
        </ul>
      </div>

      {/* Attachments */}
      {response_.attachments && (
        <div className="p-6 border-b border-sage-200 dark:border-sage-800">
          <h5 className="font-bold mb-4 flex items-center gap-2">
            <span className="material-icons-outlined text-primary">attach_file</span>
            {t('report.attachments') || 'Attachments'}
          </h5>
          <div className="space-y-2">
            {response_.attachments.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-icons-outlined text-sage-400">description</span>
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-sage-500">{file.size}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-sage-200 dark:hover:bg-sage-800 rounded-lg transition-colors">
                  <span className="material-icons-outlined text-primary">download</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Follow-up */}
      {response_.followUp && (
        <div className="p-6 border-b border-sage-200 dark:border-sage-800">
          <h5 className="font-bold mb-4 flex items-center gap-2">
            <span className="material-icons-outlined text-primary">event</span>
            {t('report.followUp') || 'Follow-up Schedule'}
          </h5>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  {t('report.scheduledVisit') || 'Scheduled Farm Visit'}
                </p>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-200">
                  {response_.followUp.date} at {response_.followUp.time}
                </p>
              </div>
              <Badge variant="info" size="lg">
                {response_.followUp.type}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-6 bg-sage-50 dark:bg-sage-900/20">
        {!isResponding ? (
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              onClick={() => setIsResponding(true)}
              icon="reply"
              fullWidth
            >
              {t('report.respond') || 'Respond to Officer'}
            </Button>
            <Button
              variant="secondary"
              onClick={handleAcknowledge}
              icon="done"
              fullWidth
            >
              {t('report.acknowledge') || 'Acknowledge Receipt'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder={t('report.responsePlaceholder') || 'Type your response...'}
              rows="4"
              className="w-full p-3 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900"
            />
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsResponding(false)}
                fullWidth
              >
                {t('common.cancel') || 'Cancel'}
              </Button>
              <Button
                variant="primary"
                onClick={handleRespond}
                disabled={!response.trim()}
                fullWidth
              >
                {t('common.send') || 'Send'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

DVSResponse.propTypes = {
  report: PropTypes.object,
  onRespond: PropTypes.func,
  onAcknowledge: PropTypes.func,
};

export default DVSResponse;