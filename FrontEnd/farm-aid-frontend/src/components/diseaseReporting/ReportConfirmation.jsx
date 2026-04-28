import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Button from '../common/Button';
import Alert from '../common/Alert';

const ReportConfirmation = ({ report, onSync, isOffline }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleViewReports = () => {
    navigate('/reports');
  };

  const handleNewReport = () => {
    navigate('/report-disease');
  };

  const handleSync = () => {
    if (onSync) {
      onSync(report.id);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="overflow-hidden">
        {/* Success Header */}
        <div className="bg-green-600 px-6 py-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-icons-outlined text-5xl text-white">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {t('report.confirmation.title') || 'Report Submitted Successfully'}
          </h2>
          <p className="text-green-100">
            {t('report.confirmation.subtitle') || 'Your disease report has been received'}
          </p>
        </div>

        {/* Report Details */}
        <div className="p-6 space-y-6">
          {/* Report ID */}
          <div className="text-center p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
            <p className="text-xs text-sage-500 mb-1">
              {t('report.confirmation.reportId') || 'Report ID'}
            </p>
            <p className="text-xl font-mono font-bold">{report.reportId}</p>
          </div>

          {/* Offline Warning */}
          {isOffline && (
            <Alert
              type="warning"
              title={t('report.confirmation.offlineTitle') || 'Saved Offline'}
              message={t('report.confirmation.offlineMessage') || 'Your report has been saved locally and will be submitted automatically when you are back online.'}
            />
          )}

          {/* Summary Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
              <p className="text-xs text-sage-500 mb-1">{t('report.species') || 'Species'}</p>
              <p className="font-medium capitalize">{report.species}</p>
            </div>
            <div className="p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
              <p className="text-xs text-sage-500 mb-1">{t('report.animalCount') || 'Animals'}</p>
              <p className="font-medium">{report.animalCount}</p>
            </div>
            <div className="p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
              <p className="text-xs text-sage-500 mb-1">{t('report.location') || 'Location'}</p>
              <p className="font-medium text-sm truncate">{report.location}</p>
            </div>
            <div className="p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
              <p className="text-xs text-sage-500 mb-1">{t('report.time') || 'Time'}</p>
              <p className="font-medium text-sm">
                {new Date(report.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
              <span className="material-icons-outlined">next_plan</span>
              {t('report.confirmation.nextSteps') || 'Next Steps'}
            </h3>
            <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
              <li className="flex items-start gap-2">
                <span className="material-icons-outlined text-sm">check_circle</span>
                {t('report.confirmation.step1') || 'DVS has been notified of your report'}
              </li>
              <li className="flex items-start gap-2">
                <span className="material-icons-outlined text-sm">check_circle</span>
                {t('report.confirmation.step2') || 'An officer will contact you within 24 hours'}
              </li>
              <li className="flex items-start gap-2">
                <span className="material-icons-outlined text-sm">check_circle</span>
                {t('report.confirmation.step3') || 'Do not move animals until advised'}
              </li>
              <li className="flex items-start gap-2">
                <span className="material-icons-outlined text-sm">check_circle</span>
                {t('report.confirmation.step4') || 'Isolate affected animals if possible'}
              </li>
            </ul>
          </div>

          {/* Emergency Contacts */}
          <div className="border border-sage-200 dark:border-sage-800 rounded-lg p-4">
            <h3 className="font-bold mb-3">{t('report.confirmation.emergency') || 'Emergency Contacts'}</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-sage-600">DVS Emergency:</span>
                <a href="tel:0800600777" className="font-bold text-primary">0800 600 777</a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-sage-600">Local Vet:</span>
                <a href="tel:+26771234567" className="font-bold text-primary">+267 71 234 567</a>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {isOffline && (
              <Button
                variant="primary"
                onClick={handleSync}
                icon="sync"
                fullWidth
              >
                {t('report.confirmation.syncNow') || 'Sync Now'}
              </Button>
            )}
            
            <Button
              variant="secondary"
              onClick={handleViewReports}
              icon="list"
              fullWidth
            >
              {t('report.confirmation.viewReports') || 'View My Reports'}
            </Button>

            <Button
              variant="outline"
              onClick={handleNewReport}
              icon="add"
              fullWidth
            >
              {t('report.confirmation.newReport') || 'New Report'}
            </Button>
          </div>

          {/* Print/Save Option */}
          <div className="text-center">
            <button
              onClick={() => window.print()}
              className="text-sm text-sage-500 hover:text-primary flex items-center gap-1 mx-auto"
            >
              <span className="material-icons-outlined text-sm">print</span>
              {t('common.print') || 'Print or Save PDF'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

ReportConfirmation.propTypes = {
  report: PropTypes.shape({
    reportId: PropTypes.string,
    species: PropTypes.string,
    animalCount: PropTypes.number,
    location: PropTypes.string,
    submittedAt: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  onSync: PropTypes.func,
  isOffline: PropTypes.bool,
};

export default ReportConfirmation;