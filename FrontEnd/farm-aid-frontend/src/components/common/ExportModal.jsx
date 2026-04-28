import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Download, X, Calendar, FileSpreadsheet, FileText, FileJson, FileDown } from 'lucide-react';
import Modal from './Modal';
import downloadService from '../../services/downloadService';

const FORMAT_OPTIONS = [
  { value: 'excel', label: 'Microsoft Excel (.xlsx)', icon: FileSpreadsheet, color: '#16a34a' },
  { value: 'csv',   label: 'CSV File (.csv)',          icon: FileText,        color: '#2563eb' },
  { value: 'json',  label: 'JSON Data (.json)',         icon: FileJson,        color: '#d97706' },
  { value: 'pdf',   label: 'PDF Document (.pdf)',       icon: FileDown,        color: '#dc2626' },
];

const DATE_RANGES = [
  { value: 'all',     label: 'All Time'     },
  { value: 'month',   label: 'Last Month'   },
  { value: 'quarter', label: 'Last Quarter' },
  { value: 'year',    label: 'Last Year'    },
];

/**
 * ExportModal
 * A polished modal for choosing export format + optional date range filter.
 *
 * Props:
 *   isOpen    – boolean
 *   onClose   – () => void
 *   data      – array to export
 *   title     – display title inside the modal header
 *   dataType  – 'livestock' | 'disease' | 'health' | 'custom'
 *   filename  – base filename without extension
 *   onExport  – optional override: (filteredData, format, filename) => void
 */
const ExportModal = ({ isOpen, onClose, data, title, dataType = 'custom', filename, onExport }) => {
  const [format,      setFormat]      = useState('excel');
  const [dateFilter,  setDateFilter]  = useState(false);
  const [dateRange,   setDateRange]   = useState('all');
  const [loading,     setLoading]     = useState(false);
  const [done,        setDone]        = useState(false);

  const baseFilename = filename || `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`;

  const filterByDate = (arr) => {
    if (!dateFilter || dateRange === 'all') return arr;
    const cutoff = new Date();
    if (dateRange === 'month')   cutoff.setMonth(cutoff.getMonth() - 1);
    if (dateRange === 'quarter') cutoff.setMonth(cutoff.getMonth() - 3);
    if (dateRange === 'year')    cutoff.setFullYear(cutoff.getFullYear() - 1);
    return arr.filter(item => new Date(item.createdAt || item.date || item.submittedAt) >= cutoff);
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const exportData = Array.isArray(data) ? filterByDate(data) : data;

      if (onExport) {
        await onExport(exportData, format, baseFilename);
      } else {
        switch (format) {
          case 'excel':
            if (dataType === 'livestock') downloadService.downloadLivestockReport(exportData, baseFilename);
            else if (dataType === 'disease') downloadService.downloadDiseaseReports(exportData, baseFilename);
            else if (dataType === 'health') downloadService.downloadHealthRecords(exportData, baseFilename);
            else downloadService.downloadExcel(exportData, baseFilename);
            break;
          case 'csv':
            downloadService.downloadCSV(exportData, baseFilename);
            break;
          case 'json':
            downloadService.downloadJSON(exportData, baseFilename);
            break;
          case 'pdf':
            await downloadService.downloadPDF('export-content', baseFilename);
            break;
        }
      }

      setDone(true);
      setTimeout(() => { setDone(false); onClose(); }, 1200);
    } catch (err) {
      console.error('[ExportModal] export error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Export — ${title}`} size="md">
      <div className="space-y-5">

        {/* Format Picker */}
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Export Format</p>
          <div className="grid grid-cols-2 gap-2">
            {FORMAT_OPTIONS.map(opt => {
              const Icon = opt.icon;
              const active = format === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setFormat(opt.value)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-150
                    ${active
                      ? 'border-[#12ca49] bg-[#e5fcf0] shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}
                >
                  <Icon
                    className="w-5 h-5 shrink-0"
                    style={{ color: active ? opt.color : '#94a3b8' }}
                  />
                  <span className={`text-[13px] font-bold leading-tight ${active ? 'text-gray-900' : 'text-slate-500'}`}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date filter toggle */}
        {Array.isArray(data) && (
          <div className="bg-[#f8fafc] rounded-xl border border-gray-200 p-4">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => setDateFilter(v => !v)}
                className={`relative w-10 h-5 rounded-full transition-colors ${dateFilter ? 'bg-[#12ca49]' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${dateFilter ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <div>
                <span className="text-sm font-bold text-gray-800">Filter by date range</span>
                <p className="text-xs text-slate-400 mt-0.5">Only include records within a time window</p>
              </div>
            </label>

            {dateFilter && (
              <div className="mt-4 flex gap-2 flex-wrap">
                {DATE_RANGES.map(r => (
                  <button
                    key={r.value}
                    onClick={() => setDateRange(r.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                      ${dateRange === r.value
                        ? 'bg-[#12ca49] text-white shadow-sm'
                        : 'bg-white border border-gray-200 text-slate-600 hover:border-[#12ca49] hover:text-[#12ca49]'}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Record count preview */}
        {Array.isArray(data) && (
          <p className="text-xs text-slate-400 text-center">
            Exporting&nbsp;
            <span className="font-bold text-gray-700">
              {filterByDate(data).length}
            </span>
            &nbsp;record{filterByDate(data).length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold text-sm hover:bg-gray-50 transition active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={loading || done}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2
              ${done
                ? 'bg-[#e5fcf0] text-[#12ca49] border-2 border-[#12ca49]'
                : 'bg-[#12ca49] hover:bg-[#0fa63b] text-white shadow-[0_4px_12px_rgba(18,202,73,0.3)]'}
              disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Exporting…</>
            ) : done ? (
              <><Calendar className="w-4 h-4" /> Done!</>
            ) : (
              <><Download className="w-4 h-4" /> Export {FORMAT_OPTIONS.find(f => f.value === format)?.label.split(' ')[0]}</>
            )}
          </button>
        </div>

      </div>
    </Modal>
  );
};

ExportModal.propTypes = {
  isOpen:   PropTypes.bool.isRequired,
  onClose:  PropTypes.func.isRequired,
  data:     PropTypes.any.isRequired,
  title:    PropTypes.string.isRequired,
  dataType: PropTypes.oneOf(['livestock', 'disease', 'health', 'custom']),
  filename: PropTypes.string,
  onExport: PropTypes.func,
};

export default ExportModal;
