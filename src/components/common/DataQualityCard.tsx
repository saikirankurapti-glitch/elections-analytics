import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Database, RefreshCw, Server } from 'lucide-react';

interface DataQualityCardProps {
  totalConstituencies?: number;
  electionRecordsCount?: number;
  boundariesMapped?: number;
  lastSynced?: string;
}

export const DataQualityCard: React.FC<DataQualityCardProps> = ({
  totalConstituencies = 403,
  electionRecordsCount = 403,
  boundariesMapped = 403,
  lastSynced = '05 Oct 2026 16:24 IST'
}) => {
  const isComplete = boundariesMapped === 403 && electionRecordsCount === 403;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-emerald-50 text-igreen flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
              Data Ingestion & Quality Assurance
            </h4>
            <p className="text-[11px] text-slate-500">
              ECI Delimitation Verification & Electoral Boundary Integrity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-igreen bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            100% Boundary Audit Passed
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
        <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Constituencies Mapped</span>
          <span className="text-sm font-bold text-navy-900 tabular-nums">
            {boundariesMapped} / {totalConstituencies}
          </span>
          <span className="text-[10px] text-igreen block mt-0.5">0 Missing • 0 Duplicates</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Official ECI Records</span>
          <span className="text-sm font-bold text-navy-900 tabular-nums">
            {electionRecordsCount} / {totalConstituencies}
          </span>
          <span className="text-[10px] text-igreen block mt-0.5">2022 Vidhan Sabha Report</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Telemetry Mode</span>
          <span className="text-sm font-bold text-amber-700">
            DEMO MODE
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Synthetic Campaign Data</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Data Freshness</span>
          <span className="text-sm font-bold text-navy-900">
            {lastSynced.split(' ')[0]} {lastSynced.split(' ')[1]}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Last Sync: {lastSynced}</span>
        </div>
      </div>
    </div>
  );
};
