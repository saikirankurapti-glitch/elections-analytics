import React, { useState } from 'react';
import {
  Map,
  MapPin,
  Layers,
  Building,
  Target,
  Users,
  PhoneCall,
  Download,
  Info,
  ChevronRight
} from 'lucide-react';
import { UpStateMap } from '../components/common/UpStateMap';
import { useFilters } from '../context/FilterContext';
import { formatIndianNumber, formatPercent } from '../utils/formatters';
import { StatusBadge } from '../components/common/StatusBadge';
import { ExportModal } from '../components/common/ExportModal';
import rawUpConstituenciesData from '../data/upConstituenciesData.json';
import { UpAssemblyConstituency } from '../services/providers/types';

export const GeographicPage: React.FC = () => {
  const { navigateToConstituency, setSelectedConstituencyId } = useFilters();
  const [selectedAcNumber, setSelectedAcNumber] = useState<number>(174);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const activeConstituency =
    (rawUpConstituenciesData as unknown as UpAssemblyConstituency[]).find(
      (c) => c.constituencyNumber === selectedAcNumber
    ) || (rawUpConstituenciesData as unknown as UpAssemblyConstituency[])[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-navy-900 tracking-tight">
              Geographic Intelligence & Spatial Command
            </h2>
            <span className="text-[11px] font-bold bg-navy-50 text-navy-900 px-2.5 py-0.5 rounded-full border border-navy-200">
              403 Constituencies Mapped
            </span>
          </div>
          <p className="text-xs text-txt-secondary mt-0.5">
            Territorial campaign saturation, booth coverage density, and operational cluster tracking across Uttar Pradesh
          </p>
        </div>

        <button
          onClick={() => setIsExportOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 text-white rounded-md text-xs font-semibold hover:bg-navy-800 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-saffron" />
          <span>Export Geospatial Data</span>
        </button>
      </div>

      {/* Main Map + Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive UP GeoJSON Map (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <UpStateMap
            selectedAcNumber={selectedAcNumber}
            onSelectConstituency={(ac) => {
              setSelectedAcNumber(ac.constituencyNumber);
              setSelectedConstituencyId(String(ac.constituencyNumber));
            }}
            heightClass="h-[520px]"
          />
        </div>

        {/* Selected Constituency Inspector Card (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-lg border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded border border-saffron-200">
                  AC #{activeConstituency.constituencyNumber}
                </span>
                <h3 className="text-lg font-black text-navy-900 mt-1">
                  {activeConstituency.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeConstituency.district} District • {activeConstituency.region}
                </p>
              </div>
              <StatusBadge status={activeConstituency.campaignOperations.status} size="sm" />
            </div>

            {/* Official ECI Administrative Information */}
            <div className="mt-4 p-3 bg-slate-50 rounded-md border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Official ECI Data (2022)
              </span>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Registered Electors:</span>
                <span className="font-bold text-navy-900 tabular-nums">
                  {formatIndianNumber(activeConstituency.electionInfo.electors)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Turnout Percent:</span>
                <span className="font-bold text-igreen">{activeConstituency.electionInfo.turnoutPercent}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Winning Party:</span>
                <span className="font-bold text-navy-900">{activeConstituency.electionInfo.winningParty}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Victory Margin:</span>
                <span className="font-bold text-navy-900 tabular-nums">{formatIndianNumber(activeConstituency.electionInfo.marginVotes)} votes</span>
              </div>
            </div>

            {/* Operational Metrics (Demo) */}
            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Field Operations
                </span>
                <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                  SAMPLE ANALYTICS
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">People Reached:</span>
                <span className="font-bold text-navy-900 tabular-nums">
                  {formatIndianNumber(activeConstituency.campaignOperations.reach)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Calls Dialed:</span>
                <span className="font-bold text-navy-900 tabular-nums">
                  {formatIndianNumber(activeConstituency.campaignOperations.totalCalls)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Connected Calls:</span>
                <span className="font-bold text-igreen tabular-nums">
                  {formatIndianNumber(activeConstituency.campaignOperations.connectedCalls)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">WhatsApp Messages:</span>
                <span className="font-bold text-navy-900 tabular-nums">
                  {formatIndianNumber(activeConstituency.campaignOperations.whatsappMessages)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">SMS Dispatched:</span>
                <span className="font-bold text-navy-900 tabular-nums">
                  {formatIndianNumber(activeConstituency.campaignOperations.smsMessages)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Engagement Index:</span>
                <span className="font-bold text-saffron tabular-nums">
                  {formatPercent(activeConstituency.campaignOperations.engagementRate)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200">
            <button
              onClick={() => {
                setSelectedConstituencyId(String(activeConstituency.constituencyNumber));
                navigateToConstituency(String(activeConstituency.constituencyNumber));
              }}
              className="w-full py-2 bg-navy-900 hover:bg-navy-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Open Detailed Constituency Dossier</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};
