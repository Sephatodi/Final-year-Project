import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FileText, Loader, CalendarDays, BarChart2, Download } from 'lucide-react';
import downloadService from '../../services/downloadService';

const REPORT_TYPES = [
  { value: 'livestock',    label: 'Livestock Report',            icon: '🐄' },
  { value: 'health',       label: 'Health Records Report',        icon: '💉' },
  { value: 'disease',      label: 'Disease Surveillance Report',  icon: '🔬' },
  { value: 'vaccination',  label: 'Vaccination Report',           icon: '🩺' },
  { value: 'financial',    label: 'Financial Report',             icon: '📊' },
];

const FORMAT_OPTIONS = [
  { value: 'pdf',   label: 'PDF'   },
  { value: 'excel', label: 'Excel' },
  { value: 'csv',   label: 'CSV'   },
];

/**
 * ReportGenerator
 * A self-contained card that lets users pick type, date range, and format,
 * then calls downloadService to produce the file.
 *
 * Props:
 *   data       – array of records to draw from
 *   onGenerate – optional (reportMeta) => void callback after export
 */
const ReportGenerator = ({ data = [], onGenerate }) => {
  const [reportType,    setReportType]    = useState('livestock');
  const [startDate,     setStartDate]     = useState('');
  const [endDate,       setEndDate]       = useState('');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [format,        setFormat]        = useState('pdf');
  const [loading,       setLoading]       = useState(false);
  const [done,          setDone]          = useState(false);

  const filterByRange = (arr) => {
    if (!startDate && !endDate) return arr;
    return arr.filter(item => {
      const d = new Date(item.date || item.createdAt || item.submittedAt);
      if (startDate && d < new Date(startDate)) return false;
      if (endDate   && d > new Date(endDate))   return false;
      return true;
    });
  };

  const generateStatistics = (arr) => {
    if (!arr.length) return 'No data in selected range.';
    return `Total records: ${arr.length}\nSample: ${JSON.stringify(arr.slice(0, 3), null, 2)}`;
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const filtered  = filterByRange(data);
      const filename  = `${reportType}-report-${new Date().toISOString().split('T')[0]}`;

      if (format === 'pdf') {
        const sections = [
          {
            title:   `Report: ${REPORT_TYPES.find(r => r.value === reportType)?.label}`,
            content: `Generated: ${new Date().toLocaleString()}`,
          },
          {
            title:   'Summary',
            content: `Records: ${filtered.length}\nFrom: ${startDate || 'All time'} → ${endDate || 'Present'}`,
          },
          ...(includeCharts ? [{
            title:   'Statistics',
            content: generateStatistics(filtered),
          }] : []),
        ];
        await downloadService.generateReportPDF(sections, filename);

      } else if (format === 'excel') {
        if      (reportType === 'livestock')   downloadService.downloadLivestockReport(filtered, filename);
        else if (reportType === 'disease')     downloadService.downloadDiseaseReports(filtered, filename);
        else if (reportType === 'health')      downloadService.downloadHealthRecords(filtered, filename);
        else                                   downloadService.downloadExcel(filtered, filename);

      } else {
        downloadService.downloadCSV(filtered, filename);
      }

      onGenerate?.({ type: reportType, format, count: filtered.length });
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch (err) {
      console.error('[ReportGenerator] generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-6 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#e5fcf0] rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-[#12ca49]" />
        </div>
        <div>
          <h3 className="text-[16px] font-extrabold text-gray-900">Generate Report</h3>
          <p className="text-xs text-slate-400">Choose type, range, and format</p>
        </div>
      </div>

      {/* Report Type */}
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Report Type</p>
        <div className="grid grid-cols-1 gap-1.5">
          {REPORT_TYPES.map(rt => (
            <button
              key={rt.value}
              onClick={() => setReportType(rt.value)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-left transition-all
                ${reportType === rt.value
                  ? 'bg-[#e5fcf0] text-[#15803d] border border-[#12ca49]/40'
                  : 'bg-[#f8fafc] text-slate-600 hover:bg-gray-100 border border-transparent'}`}
            >
              <span className="text-base">{rt.icon}</span>
              {rt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5" /> Date Range
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 font-medium block mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-[#f8fafc] text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#12ca49]/30 focus:border-[#12ca49]"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 font-medium block mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-[#f8fafc] text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#12ca49]/30 focus:border-[#12ca49]"
            />
          </div>
        </div>
      </div>

      {/* Include charts toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div
          onClick={() => setIncludeCharts(v => !v)}
          className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${includeCharts ? 'bg-[#12ca49]' : 'bg-gray-300'}`}
        >
          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${includeCharts ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-bold text-gray-700">Include statistics &amp; summary</span>
        </div>
      </label>

      {/* Format */}
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Format</p>
        <div className="flex gap-2">
          {FORMAT_OPTIONS.map(fo => (
            <button
              key={fo.value}
              onClick={() => setFormat(fo.value)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all border
                ${format === fo.value
                  ? 'bg-[#12ca49] text-white border-[#12ca49] shadow-sm'
                  : 'bg-white text-slate-600 border-gray-200 hover:border-[#12ca49] hover:text-[#12ca49]'}`}
            >
              {fo.label}
            </button>
          ))}
        </div>
      </div>

      {/* Record count */}
      <p className="text-center text-xs text-slate-400">
        {filterByRange(data).length} record{filterByRange(data).length !== 1 ? 's' : ''} will be included
      </p>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={loading || done}
        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2
          ${done
            ? 'bg-[#e5fcf0] text-[#12ca49] border-2 border-[#12ca49]'
            : 'bg-[#12ca49] hover:bg-[#0fa63b] text-white shadow-[0_4px_14px_rgba(18,202,73,0.35)]'}
          disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <><Loader className="w-4 h-4 animate-spin" /> Generating…</>
        ) : done ? (
          '✓ Report Downloaded!'
        ) : (
          <><Download className="w-4 h-4" /> Generate {format.toUpperCase()} Report</>
        )}
      </button>

    </div>
  );
};

ReportGenerator.propTypes = {
  data:       PropTypes.array,
  onGenerate: PropTypes.func,
};

export default ReportGenerator;
