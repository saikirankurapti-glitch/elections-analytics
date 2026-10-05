import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle, FileSpreadsheet, ShieldCheck } from 'lucide-react';
import { useFilters } from '../../context/FilterContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { filters } = useFilters();
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      // Create a downloadable mock report data file
      const reportContent = `ANALYTIX - State Campaign Intelligence Report
Export Timestamp: ${new Date().toISOString()}
State ID: ${filters.stateId.toUpperCase()}
Election: ${filters.electionId}
Date Range: ${filters.dateRange}
Constituency Filter: ${filters.constituencyId}
Campaign Filter: ${filters.campaignId}

Executive KPI Summary:
Total Constituencies Monitored: 403
Total Districts Monitored: 75
Total People Reached: 48,200,000
Total Phone Calls: 20,244,000 (Connected: 14,656,656 | Rate: 72.4%)
WhatsApp Messages: 27,956,000
SMS Sent: 34,704,000 (Delivery Rate: 96.0%)
Social Reach: 58,400,000
Overall Engagement Rate: 41.2%
Direct Citizen Responses: 6,412,000
Scheduled Follow-ups: 194,850

Confidential State Campaign Analytics - Generated via ANALYTIX Command Platform.
`;
      const blob = new Blob([reportContent], { type: format === 'pdf' ? 'application/pdf' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ANALYTIX_State_Report_${filters.stateId.toUpperCase()}_${Date.now()}.${format === 'excel' ? 'csv' : format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-navy-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-saffron" />
            <h3 className="text-sm font-bold tracking-wide">Export Operational Intelligence Report</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-txt-secondary leading-relaxed">
            Generate an authenticated state campaign snapshot for executive briefings, operational command, or field coordinators.
          </p>

          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-2">Select Export Format</label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                  format === 'pdf'
                    ? 'border-saffron bg-saffron-50/50 text-navy-900 font-semibold ring-1 ring-saffron'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <FileText className="w-5 h-5 text-rose-600 mb-1" />
                <span className="text-xs">Executive PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('excel')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                  format === 'excel'
                    ? 'border-saffron bg-saffron-50/50 text-navy-900 font-semibold ring-1 ring-saffron'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="text-xs">Excel / CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                  format === 'csv'
                    ? 'border-saffron bg-saffron-50/50 text-navy-900 font-semibold ring-1 ring-saffron'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <FileText className="w-5 h-5 text-blue-600 mb-1" />
                <span className="text-xs">Raw Telemetry</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-md p-3 border border-slate-200 text-[11px] space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span>Jurisdiction:</span>
              <span className="font-semibold text-navy-900">Uttar Pradesh State (403 ACs)</span>
            </div>
            <div className="flex justify-between">
              <span>Scope:</span>
              <span className="font-semibold text-navy-900">All Multi-Channel Logs</span>
            </div>
            <div className="flex justify-between">
              <span>Privacy & Compliance:</span>
              <span className="text-igreen font-medium inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Aggregate Telemetry Only
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white rounded-md text-xs font-semibold shadow-sm transition-all"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-igreen" />
                <span>Export Downloaded</span>
              </>
            ) : downloading ? (
              <span>Preparing Snapshot...</span>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-saffron" />
                <span>Generate & Download</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
