import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '../common/Alert';
import Button from '../common/Button';
import Card from '../common/Card';

const DataManagement = ({ onUpdate }) => {
  const { t } = useTranslation();
  const [success, setSuccess] = useState(false);
  const [exportProgress, setExportProgress] = useState(null);
  const [importProgress, setImportProgress] = useState(null);

  const dataStats = {
    livestock: 142,
    healthRecords: 356,
    consultations: 28,
    diseaseReports: 12,
    knowledgeBase: 45,
    totalSize: '156 MB',
  };

  const handleExportData = async (format) => {
    setExportProgress('starting');
    // Simulate export
    setTimeout(() => {
      setExportProgress('complete');
      setTimeout(() => setExportProgress(null), 3000);
    }, 2000);
  };

  const handleImportData = async () => {
    setImportProgress('starting');
    // Simulate import
    setTimeout(() => {
      setImportProgress('complete');
      setTimeout(() => setImportProgress(null), 3000);
    }, 2000);
  };

  const handleDeleteData = (type) => {
    if (window.confirm(t('data.confirmDelete') || `Delete all ${type} data?`)) {
      // Delete logic
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">{t('settings.dataManagement') || 'Data Management'}</h2>

        {success && (
          <Alert
            type="success"
            message={t('data.operationComplete') || 'Operation completed successfully!'}
            className="mb-6"
            dismissible
            autoDismiss
          />
        )}

        {/* Data Statistics */}
        <div className="mb-8 p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
          <h3 className="font-bold mb-4">{t('data.statistics') || 'Data Statistics'}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-sage-500">{t('data.livestock') || 'Livestock'}</p>
              <p className="text-xl font-bold">{dataStats.livestock}</p>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('data.healthRecords') || 'Health Records'}</p>
              <p className="text-xl font-bold">{dataStats.healthRecords}</p>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('data.consultations') || 'Consultations'}</p>
              <p className="text-xl font-bold">{dataStats.consultations}</p>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('data.reports') || 'Disease Reports'}</p>
              <p className="text-xl font-bold">{dataStats.diseaseReports}</p>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('data.articles') || 'Knowledge Base'}</p>
              <p className="text-xl font-bold">{dataStats.knowledgeBase}</p>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('data.totalSize') || 'Total Size'}</p>
              <p className="text-xl font-bold">{dataStats.totalSize}</p>
            </div>
          </div>
        </div>

        {/* Export Data */}
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4">{t('data.export') || 'Export Data'}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="secondary"
                onClick={() => handleExportData('csv')}
                loading={exportProgress === 'starting'}
                icon="download"
              >
                CSV {t('data.format') || 'Format'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleExportData('json')}
                loading={exportProgress === 'starting'}
                icon="download"
              >
                JSON {t('data.format') || 'Format'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleExportData('pdf')}
                loading={exportProgress === 'starting'}
                icon="picture_as_pdf"
              >
                PDF {t('data.report') || 'Report'}
              </Button>
            </div>

            {exportProgress === 'complete' && (
              <Alert
                type="success"
                message={t('data.exportComplete') || 'Export complete! Check your downloads folder.'}
              />
            )}
          </div>
        </div>

        {/* Import Data */}
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4">{t('data.import') || 'Import Data'}</h3>
          <div className="p-6 border-2 border-dashed border-sage-300 dark:border-sage-700 rounded-lg text-center">
            <input
              type="file"
              accept=".csv,.json"
              className="hidden"
              id="import-file"
              onChange={handleImportData}
            />
            <label
              htmlFor="import-file"
              className="cursor-pointer block"
            >
              <span className="material-icons-outlined text-4xl text-sage-400 mb-2">cloud_upload</span>
              <p className="font-medium mb-1">{t('data.clickToUpload') || 'Click to upload or drag and drop'}</p>
              <p className="text-xs text-sage-500">CSV or JSON (max 50MB)</p>
            </label>
          </div>

          {importProgress === 'complete' && (
            <Alert
              type="success"
              message={t('data.importComplete') || 'Import complete! Data has been added to your account.'}
              className="mt-4"
            />
          )}
        </div>

        {/* Backup & Restore */}
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4">{t('data.backup') || 'Backup & Restore'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="primary"
              icon="backup"
            >
              {t('data.createBackup') || 'Create Backup'}
            </Button>
            <Button
              variant="secondary"
              icon="restore"
            >
              {t('data.restoreBackup') || 'Restore Backup'}
            </Button>
          </div>
        </div>

        {/* Data Cleanup */}
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4">{t('data.cleanup') || 'Data Cleanup'}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
              <div>
                <p className="font-medium">{t('data.clearCache') || 'Clear Cache'}</p>
                <p className="text-xs text-sage-500">
                  {t('data.cacheHelp') || 'Remove temporary files and cached data'}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDeleteData('cache')}
                icon="delete"
              >
                {t('common.clear') || 'Clear'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
              <div>
                <p className="font-medium">{t('data.deleteOld') || 'Delete Old Records'}</p>
                <p className="text-xs text-sage-500">
                  {t('data.oldHelp') || 'Remove records older than 2 years'}
                </p>
              </div>
              <Button
                variant="warning"
                size="sm"
                onClick={() => handleDeleteData('old')}
                icon="delete_sweep"
              >
                {t('data.delete') || 'Delete'}
              </Button>
            </div>
          </div>
        </div>

        {/* Archive */}
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4">{t('data.archive') || 'Archive'}</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
              <div>
                <p className="font-medium">farm_data_2024_03_14.zip</p>
                <p className="text-xs text-sage-500">156 MB • {t('data.created') || 'Created'} 2 {t('data.daysAgo') || 'days ago'}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-sage-200 dark:hover:bg-sage-800 rounded-lg">
                  <span className="material-icons-outlined text-sm">download</span>
                </button>
                <button className="p-2 hover:bg-sage-200 dark:hover:bg-sage-800 rounded-lg">
                  <span className="material-icons-outlined text-sm">restore</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-4 border-2 border-red-200 dark:border-red-800 rounded-lg">
          <h3 className="font-bold text-lg text-red-600 mb-4">{t('data.dangerZone') || 'Danger Zone'}</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t('data.deleteAll') || 'Delete All Data'}</p>
                <p className="text-xs text-sage-500">
                  {t('data.deleteAllHelp') || 'Permanently delete all your farm data'}
                </p>
              </div>
              <Button
                variant="danger"
                onClick={() => handleDeleteData('all')}
                icon="delete_forever"
              >
                {t('data.deleteAll') || 'Delete All'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t('data.deleteAccount') || 'Delete Account'}</p>
                <p className="text-xs text-sage-500">
                  {t('data.deleteAccountHelp') || 'Permanently delete your account and all data'}
                </p>
              </div>
              <Button
                variant="danger"
                onClick={() => handleDeleteData('account')}
                icon="person_remove"
              >
                {t('data.deleteAccount') || 'Delete Account'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

DataManagement.propTypes = {
  onUpdate: PropTypes.func,
};

export default DataManagement;