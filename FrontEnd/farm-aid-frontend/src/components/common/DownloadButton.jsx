import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Download, ChevronDown, Loader } from 'lucide-react';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import downloadService from '../../services/downloadService';

/**
 * DownloadButton
 * Renders a single download button (1 format) or a dropdown (multiple formats).
 *
 * Props:
 *   data       – array/object to export
 *   type       – 'livestock' | 'disease' | 'health' | 'transcript' | 'custom'
 *   filename   – base filename without extension
 *   label      – button text  (default: 'Export')
 *   variant    – 'primary' | 'secondary' | 'outline'
 *   size       – 'sm' | 'md' | 'lg'
 *   options    – override default [{value, label}] list
 *   elementId  – used when format === 'pdf' and type === 'custom'
 */
const DownloadButton = ({
  data,
  type       = 'custom',
  filename,
  label      = 'Export',
  variant    = 'secondary',
  size       = 'md',
  options    = null,
  elementId  = 'main-content',
}) => {
  const [busy, setBusy] = useState(false);

  const defaultFilename = filename || `${type}-${new Date().toISOString().split('T')[0]}`;

  const handleDownload = async (format) => {
    setBusy(true);
    try {
      switch (format) {
        case 'json':
          downloadService.downloadJSON(data, defaultFilename);
          break;
        case 'csv':
          downloadService.downloadCSV(data, defaultFilename);
          break;
        case 'excel':
          if (type === 'livestock') {
            downloadService.downloadLivestockReport(data, defaultFilename);
          } else if (type === 'disease') {
            downloadService.downloadDiseaseReports(data, defaultFilename);
          } else if (type === 'health') {
            downloadService.downloadHealthRecords(data, defaultFilename);
          } else {
            downloadService.downloadExcel(data, defaultFilename);
          }
          break;
        case 'pdf':
          if (type === 'transcript') {
            downloadService.downloadConsultationTranscript(data, defaultFilename);
          } else if (type === 'custom') {
            await downloadService.downloadPDF(elementId, defaultFilename);
          } else {
            // For livestock/disease/health: fall back to Excel version of the report
            downloadService.downloadExcel(data, defaultFilename);
          }
          break;
        case 'txt':
          downloadService.downloadConsultationTranscript(data, defaultFilename);
          break;
        default:
          downloadService.downloadCSV(data, defaultFilename);
      }
    } catch (err) {
      console.error('[DownloadButton] export failed:', err);
    } finally {
      setBusy(false);
    }
  };

  const defaultOptions = [
    { value: 'excel', label: 'Excel (.xlsx)' },
    { value: 'csv',   label: 'CSV (.csv)'   },
    { value: 'json',  label: 'JSON (.json)' },
    { value: 'pdf',   label: 'PDF (.pdf)'   },
  ];

  const downloadOptions = options || defaultOptions;

  // ── Shared button classes by variant ──────────────────────────────────────
  const base = 'inline-flex items-center gap-2 font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95';
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-5 py-3 text-base' };
  const variants = {
    primary:   'bg-[#12ca49] hover:bg-[#0fa63b] text-white shadow-[0_4px_12px_rgba(18,202,73,0.3)] focus:ring-[#12ca49]',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm focus:ring-gray-400',
    outline:   'border border-[#12ca49] text-[#12ca49] hover:bg-[#e5fcf0] focus:ring-[#12ca49]',
  };
  const cls = `${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.secondary}`;

  // ── Single-format shortcut ────────────────────────────────────────────────
  if (downloadOptions.length === 1) {
    return (
      <button
        className={cls}
        disabled={busy}
        onClick={() => handleDownload(downloadOptions[0].value)}
      >
        {busy
          ? <Loader className="w-4 h-4 animate-spin" />
          : <Download className="w-4 h-4" />}
        {label}
      </button>
    );
  }

  // ── Multi-format dropdown ─────────────────────────────────────────────────
  const trigger = (
    <button className={cls} disabled={busy}>
      {busy
        ? <Loader className="w-4 h-4 animate-spin" />
        : <Download className="w-4 h-4" />}
      {label}
      <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-60" />
    </button>
  );

  return (
    <Dropdown trigger={trigger} position="bottom-right">
      {downloadOptions.map(opt => (
        <DropdownItem
          key={opt.value}
          icon={opt.icon || 'download'}
          onClick={() => handleDownload(opt.value)}
        >
          {opt.label}
        </DropdownItem>
      ))}
    </Dropdown>
  );
};

DownloadButton.propTypes = {
  data:      PropTypes.any.isRequired,
  type:      PropTypes.oneOf(['livestock', 'disease', 'health', 'transcript', 'custom']),
  filename:  PropTypes.string,
  label:     PropTypes.string,
  variant:   PropTypes.oneOf(['primary', 'secondary', 'outline']),
  size:      PropTypes.oneOf(['sm', 'md', 'lg']),
  options:   PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })),
  elementId: PropTypes.string,
};

export default DownloadButton;
