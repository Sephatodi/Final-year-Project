import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '../common/Alert';
import Button from '../common/Button';
import Card from '../common/Card';

const DataExporter = ({ onExport }) => {
  const { t } = useTranslation();
  const [exporting, setExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [selectedData, setSelectedData] = useState({
    livestock: true,
    healthRecords: true,
    diseaseReports: true,
    consultations: true,
    knowledgeBase: false,
    settings: false,
  });

  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');
  const [includeMedia, setIncludeMedia] = useState(false);

  const handleToggleAll = () => {
    const allSelected = Object.values(selectedData).every(v => v);
    setSelectedData({
      livestock: !allSelected,
      healthRecords: !allSelected,
      diseaseReports: !allSelected,
      consultations: !allSelected,
      knowledgeBase: !allSelected,
      settings: !allSelected,
    });
  };

  const handleToggle = (key) => {
    setSelectedData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = async () => {
    setExporting(true);
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 3000));
    setExporting(false);
    setExportComplete(true);
    setTimeout(() => setExportComplete(false), 5000);
    
    if (onExport) {
      onExport({
        data: selectedData,
        format: exportFormat,
        dateRange,
        includeMedia,
      });
    }
  };

  const selectedCount = Object.values(selectedData).filter(v => v).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">{t('offline.dataExporter') || 'Data Exporter'}</h2>
        <p className="text-sage-500">{t('offline.exporterSubtitle') || 'Export your data for backup or analysis'}</p>
      </div>

      {exportComplete && (
        <Alert
          type="success"
          message={t('offline.exportComplete') || 'Export complete! Check your downloads folder.'}
          dismissible
          autoDismiss
        />
      )}

      {/* Data Selection */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">{t('offline.selectData') || 'Select Data to Export'}</h3>
          <Button variant="ghost" size="sm" onClick={handleToggleAll}>
            {selectedCount === 6 ? t('offline.deselectAll') || 'Deselect All' : t('offline.selectAll') || 'Select All'}
          </Button>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="material-icons-outlined text-primary">pets</span>
              <span>{t('offline.livestock') || 'Livestock Records'}</span>
            </div>
            <input
              type="checkbox"
              checked={selectedData.livestock}
              onChange={() => handleToggle('livestock')}
              className="w-5 h-5 rounded border-sage-300 text-primary focus:ring-primary"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="material-icons-outlined text-primary">medical_services</span>
              <span>{t('offline.healthRecords') || 'Health Records'}</span>
            </div>
            <input
              type="checkbox"
              checked={selectedData.healthRecords}
              onChange={() => handleToggle('healthRecords')}
              className="w-5 h-5 rounded border-sage-300 text-primary focus:ring-primary"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="material-icons-outlined text-primary">warning</span>
              <span>{t('offline.diseaseReports') || 'Disease Reports'}</span>
            </div>
            <input
              type="checkbox"
              checked={selectedData.diseaseReports}
              onChange={() => handleToggle('diseaseReports')}
              className="w-5 h-5 rounded border-sage-300 text-primary focus:ring-primary"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="material-icons-outlined text-primary">chat</span>
              <span>{t('offline.consultations') || 'Consultations'}</span>
            </div>
            <input
              type="checkbox"
              checked={selectedData.consultations}
              onChange={() => handleToggle('consultations')}
              className="w-5 h-5 rounded border-sage-300 text-primary focus:ring-primary"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="material-icons-outlined text-primary">menu_book</span>
              <span>{t('offline.knowledgeBase') || 'Knowledge Base'}</span>
            </div>
            <input
              type="checkbox"
              checked={selectedData.knowledgeBase}
              onChange={() => handleToggle('knowledgeBase')}
              className="w-5 h-5 rounded border-sage-300 text-primary focus:ring-primary"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="material-icons-outlined text-primary">settings</span>
              <span>{t('offline.settings') || 'Settings'}</span>
            </div>
            <input
              type="checkbox"
              checked={selectedData.settings}
              onChange={() => handleToggle('settings')}
              className="w-5 h-5 rounded border-sage-300 text-primary focus:ring-primary"
            />
          </label>
        </div>
      </Card>

      {/* Export Options */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">{t('offline.exportOptions') || 'Export Options'}</h3>

        <div className="space-y-4">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('offline.format') || 'Format'}</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setExportFormat('csv')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  exportFormat === 'csv'
                    ? 'border-primary bg-primary/5'
                    : 'border-sage-200 hover:border-primary/50'
                }`}
              >
                <span className="material-icons-outlined text-primary mb-1">table_chart</span>
                <p className="text-sm font-medium">CSV</p>
              </button>
              <button
                onClick={() => setExportFormat('json')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  exportFormat === 'json'
                    ? 'border-primary bg-primary/5'
                    : 'border-sage-200 hover:border-primary/50'
                }`}
              >
                <span className="material-icons-outlined text-primary mb-1">data_object</span>
                <p className="text-sm font-medium">JSON</p>
              </button>
              <button
                onClick={() => setExportFormat('pdf')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  exportFormat === 'pdf'
                    ? 'border-primary bg-primary/5'
                    : 'border-sage-200 hover:border-primary/50'
                }`}
              >
                <span className="material-icons-outlined text-primary mb-1">picture_as_pdf</span>
                <p className="text-sm font-medium">PDF</p>
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('offline.dateRange') || 'Date Range'}</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full p-2 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900"
            >
              <option value="all">{t('offline.allTime') || 'All Time'}</option>
              <option value="year">{t('offline.lastYear') || 'Last Year'}</option>
              <option value="month">{t('offline.lastMonth') || 'Last Month'}</option>
              <option value="custom">{t('offline.custom') || 'Custom Range'}</option>
            </select>
          </div>

          {/* Custom Date Range */}
          {dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                className="p-2 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900"
              />
              <input
                type="date"
                className="p-2 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900"
              />
            </div>
          )}

          {/* Include Media */}
          <label className="flex items-center justify-between p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium">{t('offline.includeMedia') || 'Include Media'}</p>
              <p className="text-xs text-sage-500">
                {t('offline.mediaHelp') || 'Export photos and documents'}
              </p>
            </div>
            <input
              type="checkbox"
              checked={includeMedia}
              onChange={() => setIncludeMedia(!includeMedia)}
              className="w-5 h-5 rounded border-sage-300 text-primary focus:ring-primary"
            />
          </label>
        </div>
      </Card>

      {/* Export Summary */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">{t('offline.exportSummary') || 'Export Summary'}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>{t('offline.selectedItems') || 'Selected Items'}:</span>
            <span className="font-bold">{selectedCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t('offline.estimatedSize') || 'Estimated Size'}:</span>
            <span className="font-bold">45 MB</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t('offline.estimatedTime') || 'Estimated Time'}:</span>
            <span className="font-bold">~30 seconds</span>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleExport}
          loading={exporting}
          disabled={selectedCount === 0}
          icon="download"
          fullWidth
        >
          {exporting 
            ? t('offline.exporting') || 'Exporting...'
            : t('offline.startExport') || 'Start Export'}
        </Button>
      </Card>
    </div>
  );
};

DataExporter.propTypes = {
  onExport: PropTypes.func,
};

export default DataExporter;