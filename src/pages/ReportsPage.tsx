import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Eye,
  CheckCircle,
  FileSpreadsheet,
  RefreshCw,
  Search,
  Filter,
  Layers,
  Sparkles,
  ShieldCheck,
  Building,
  MapPin,
  Clock
} from 'lucide-react';
import { ExportModal } from '../components/common/ExportModal';

interface ReportCardItem {
  id: string;
  name: string;
  category: string;
  coverage: string;
  lastGenerated: string;
  dataFreshness: 'Live' | 'Near Real-Time' | 'Last Synced' | 'Historical' | 'Demo Data';
  fileSize: string;
  description: string;
}

export const ReportsPage: React.FC = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportCardItem | null>(null);
  const [exportFormat, setExportFormat] = useState<'PDF' | 'EXCEL'>('PDF');
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  // Phase 24 Specs: 10 Dedicated Campaign Intelligence Reports
  const reportCards: ReportCardItem[] = [
    {
      id: 'rep-01',
      name: 'State Executive Report',
      category: 'Executive Strategic',
      coverage: 'Uttar Pradesh (All 403 ACs & 75 Districts)',
      lastGenerated: '2026-10-05 08:30 IST',
      dataFreshness: 'Demo Data',
      fileSize: '4.8 MB',
      description: 'Consolidated statewide operational briefing covering total reach, multi-channel saturation, and top-line response indices across UP.'
    },
    {
      id: 'rep-02',
      name: 'District Report',
      category: 'Administrative Geo',
      coverage: '75 UP Districts (Regional Clusters)',
      lastGenerated: '2026-10-05 07:45 IST',
      dataFreshness: 'Demo Data',
      fileSize: '9.4 MB',
      description: 'Comprehensive cross-district comparison of citizen contacts, calling connection rates, and community group penetration.'
    },
    {
      id: 'rep-03',
      name: 'Constituency Report',
      category: 'Electoral AC',
      coverage: '403 Assembly Constituencies',
      lastGenerated: '2026-10-04 22:15 IST',
      dataFreshness: 'Demo Data',
      fileSize: '14.2 MB',
      description: 'Constituency-by-constituency dossier detailing ECI 2022 voter baselines, active campaigns, dialogue volumes, and booth reach.'
    },
    {
      id: 'rep-04',
      name: 'Campaign Report',
      category: 'Campaign Operations',
      coverage: 'All Active & Completed Campaigns',
      lastGenerated: '2026-10-05 09:00 IST',
      dataFreshness: 'Demo Data',
      fileSize: '3.6 MB',
      description: 'End-to-end campaign performance tracking including budget utilization, audience targets, channel mix, and direct conversions.'
    },
    {
      id: 'rep-05',
      name: 'Calling Report',
      category: 'Voice Telemetry',
      coverage: 'Statewide Voice Infrastructure',
      lastGenerated: '2026-10-05 08:15 IST',
      dataFreshness: 'Demo Data',
      fileSize: '5.1 MB',
      description: 'AI voice agent dialogue logs, connection rates by hour, call duration histograms, dialect recognition quality, and callback queues.'
    },
    {
      id: 'rep-06',
      name: 'WhatsApp Report',
      category: 'Messaging',
      coverage: 'Ward & Booth Community Groups',
      lastGenerated: '2026-10-04 19:30 IST',
      dataFreshness: 'Demo Data',
      fileSize: '4.2 MB',
      description: 'Meta Cloud API transmission metrics, read receipts, peer-to-peer amplification, and community group vitality scores.'
    },
    {
      id: 'rep-07',
      name: 'SMS Report',
      category: 'Messaging & Compliance',
      coverage: 'Telecom Circles (UP-East & UP-West)',
      lastGenerated: '2026-10-04 18:00 IST',
      dataFreshness: 'Demo Data',
      fileSize: '2.8 MB',
      description: 'TRAI DLT template compliance register, operator gateway delivery success, citizen two-way replies, and opt-out audits.'
    },
    {
      id: 'rep-08',
      name: 'Social Report',
      category: 'Digital Reach',
      coverage: 'YouTube, Facebook, Instagram & X',
      lastGenerated: '2026-10-03 23:00 IST',
      dataFreshness: 'Demo Data',
      fileSize: '6.5 MB',
      description: 'Video watch retention, viral broadcast reach, feed engagement indices, and citizen comments sentiment clustering.'
    },
    {
      id: 'rep-09',
      name: 'Digital Report',
      category: 'Web Attribution',
      coverage: 'State Campaign Web Portals',
      lastGenerated: '2026-10-05 06:45 IST',
      dataFreshness: 'Demo Data',
      fileSize: '3.9 MB',
      description: 'Google Tag Manager event funnels, landing page conversion paths, scheme eligibility checks, and hotline click-throughs.'
    },
    {
      id: 'rep-10',
      name: 'AI Insights Report',
      category: 'NLP Intelligence',
      coverage: 'Aggregated Citizen Voice Corpus',
      lastGenerated: '2026-10-05 07:15 IST',
      dataFreshness: 'Demo Data',
      fileSize: '4.7 MB',
      description: 'Macro topic taxonomy, common citizen questions, grievance clustering, and regional dialect sentiment breakdown.'
    }
  ];

  const handleGenerate = (id: string) => {
    setGeneratingId(id);
    setTimeout(() => {
      setGeneratingId(null);
    }, 1200);
  };

  const handleDownload = (rep: ReportCardItem, format: 'PDF' | 'EXCEL') => {
    setSelectedReport(rep);
    setExportFormat(format);
    setIsExportOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-navy-900 tracking-tight uppercase">
              Report Center
            </h1>
            <span className="text-[11px] font-bold bg-navy-50 text-navy-900 px-2.5 py-0.5 rounded-full border border-navy-200">
              Executive Dossiers & Regulatory Audits
            </span>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
              DEMO DATA
            </span>
          </div>
          <p className="text-xs text-txt-secondary mt-0.5">
            Structured state dossiers, 403-constituency audit registers, and multi-channel campaign compliance exports for Uttar Pradesh
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedReport(reportCards[0]);
            setIsExportOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy-900 text-white rounded-md text-xs font-semibold hover:bg-navy-800 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-saffron" />
          <span>Quick Custom Snapshot</span>
        </button>
      </div>

      {/* Reports Grid (10 Cards - Phase 24 Specs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCards.map(rep => (
          <div
            key={rep.id}
            className="command-card p-5 flex flex-col justify-between hover:border-saffron hover:shadow-card transition-all group"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded border border-saffron-200">
                  {rep.category}
                </span>
                <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
                  {rep.dataFreshness}
                </span>
              </div>

              <h2 className="text-base font-bold text-navy-900 mt-2.5 group-hover:text-saffron-700 transition-colors">
                {rep.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {rep.description}
              </p>

              <div className="mt-4 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Coverage:</span>
                  <span className="font-semibold text-navy-900 text-right truncate max-w-[190px]">{rep.coverage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Generated:</span>
                  <span className="font-semibold text-navy-900 font-mono">{rep.lastGenerated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dossier Size:</span>
                  <span className="font-semibold text-navy-900 font-mono">{rep.fileSize}</span>
                </div>
              </div>
            </div>

            {/* Actions (View, Export PDF, Export Excel) */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
              <button
                onClick={() => setSelectedReport(rep)}
                className="px-2.5 py-1 text-xs font-semibold text-navy-900 hover:bg-slate-100 rounded inline-flex items-center gap-1 transition-colors"
                title="View preview"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>View</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleDownload(rep, 'PDF')}
                  className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded inline-flex items-center gap-1 transition-colors"
                >
                  <FileText className="w-3 h-3 text-rose-600" />
                  <span>PDF</span>
                </button>

                <button
                  onClick={() => handleDownload(rep, 'EXCEL')}
                  className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded inline-flex items-center gap-1 transition-colors"
                >
                  <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                  <span>Excel</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="bg-navy-900 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold">{selectedReport.name}</h4>
                <p className="text-[11px] text-slate-400">{selectedReport.coverage} • {selectedReport.lastGenerated}</p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto text-xs text-slate-700">
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <div className="font-bold text-navy-900 text-sm mb-1">Statewide Executive Abstract</div>
                <p className="leading-relaxed">
                  Official operational dossier for Uttar Pradesh State. Encompasses verified telemetry across 403 constituencies, 75 districts, 174,351 polling stations, and 48.2M citizen contacts.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 border border-slate-200 rounded">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Citizens Reached</span>
                  <span className="text-base font-bold text-navy-900">4,82,00,000</span>
                </div>
                <div className="p-3 border border-slate-200 rounded">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Call Connection Rate</span>
                  <span className="text-base font-bold text-igreen">72.4%</span>
                </div>
                <div className="p-3 border border-slate-200 rounded">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">WhatsApp Handshake</span>
                  <span className="text-base font-bold text-navy-900">96.0% (2.35M)</span>
                </div>
                <div className="p-3 border border-slate-200 rounded">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Overall Engagement Index</span>
                  <span className="text-base font-bold text-saffron-700">41.2%</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                Confidential Uttar Pradesh State Operational Briefing. Generated electronically via ANALYTIX Command Center.
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs text-slate-500">Ready for instant download</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownload(selectedReport, 'PDF');
                    setSelectedReport(null);
                  }}
                  className="px-3 py-1.5 bg-rose-700 text-white rounded text-xs font-semibold hover:bg-rose-800"
                >
                  Export PDF
                </button>
                <button
                  onClick={() => {
                    handleDownload(selectedReport, 'EXCEL');
                    setSelectedReport(null);
                  }}
                  className="px-3 py-1.5 bg-emerald-700 text-white rounded text-xs font-semibold hover:bg-emerald-800"
                >
                  Export Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};
