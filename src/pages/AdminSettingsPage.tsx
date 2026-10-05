import React, { useState } from 'react';
import {
  ShieldCheck,
  Settings,
  Layers,
  Database,
  Radio,
  Save,
  CheckCircle2,
  Key,
  Globe,
  Sliders,
  Server,
  RefreshCw,
  ExternalLink,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useFilters } from '../context/FilterContext';

export const AdminSettingsPage: React.FC = () => {
  const [intermediateLevel, setIntermediateLevel] = useState<'Tehsil' | 'Block' | 'Mandal'>('Tehsil');
  const [subLevel, setSubLevel] = useState<'Ward' | 'Gram Panchayat' | 'Sector'>('Gram Panchayat');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [syncingSource, setSyncingSource] = useState<string | null>(null);

  const [dataSources, setDataSources] = useState([
    {
      id: 'eci',
      name: 'Election Commission of India (ECI)',
      type: 'Official Election Statistics & Results',
      status: 'Connected',
      lastSync: '05 Oct 2026 16:20 IST',
      dataset: '2022 UP General Assembly Statistical Report',
      frequency: 'Daily (Post-Poll)',
      records: '403 Assembly Constituencies',
      url: 'https://results.eci.gov.in'
    },
    {
      id: 'up-assembly',
      name: 'Uttar Pradesh Legislative Assembly',
      type: 'Constituency Index & Delimitation Roster',
      status: 'Connected',
      lastSync: '05 Oct 2026 16:22 IST',
      dataset: '18th Vidhan Sabha Constituency Register',
      frequency: 'Weekly',
      records: '403 AC Numbers & Categories',
      url: 'https://plegalassembly.up.gov.in'
    },
    {
      id: 'up-gis',
      name: 'Government GIS / State Spatial Portal',
      type: 'Geographic Boundaries & Polygons',
      status: 'Connected',
      lastSync: '05 Oct 2026 16:23 IST',
      dataset: '2008 Delimitation Commission Boundary Shapefiles',
      frequency: 'Monthly',
      records: '403 PostGIS Boundaries (100% Valid Geometry)',
      url: 'https://upgis.gov.in'
    },
    {
      id: 'campaign-telemetry',
      name: 'Campaign Operations Engine (Calling, WhatsApp, SMS)',
      type: 'Live Field Operations Telemetry',
      status: 'Demo Mode (Synthetic)',
      lastSync: '05 Oct 2026 16:24 IST',
      dataset: 'Synthetic Campaign Telemetry Stream',
      frequency: 'Real-time WebSocket / Hourly Poll',
      records: '4.8M People Reached (Demo)',
      url: 'https://api.analytix.internal/v1/telemetry'
    }
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSyncSource = (id: string) => {
    setSyncingSource(id);
    setTimeout(() => {
      setDataSources(prev =>
        prev.map(s =>
          s.id === id
            ? { ...s, lastSync: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' IST' }
            : s
        )
      );
      setSyncingSource(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-black text-navy-900 tracking-tight">
          Platform Administration & Data Source Management
        </h2>
        <p className="text-xs text-txt-secondary mt-0.5">
          Authoritative public election registries, geospatial boundary ETL, and API telemetry ingestion
        </p>
      </div>

      {/* Official Data Sources Section (Section 20 & 21 Specs) */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-saffron" />
            <h3 className="text-sm font-bold text-navy-900">
              Official Data Ingestion Pipelines & Status
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            ETL Pipeline: ECI & GIS → Normalized Database → REST API
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dataSources.map(source => (
            <div
              key={source.id}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-navy-900">{source.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{source.type}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      source.status.includes('Connected')
                        ? 'bg-emerald-50 text-igreen border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {source.status}
                  </span>
                </div>

                <div className="mt-3 bg-white p-2.5 rounded border border-slate-200 text-[11px] space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Dataset:</span>
                    <span className="font-semibold text-navy-900 truncate max-w-[200px]">{source.dataset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coverage:</span>
                    <span className="font-semibold text-navy-900">{source.records}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sync Cadence:</span>
                    <span className="text-slate-700">{source.frequency}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-1">
                    <span>Last Synced:</span>
                    <span className="font-semibold text-navy-900">{source.lastSync}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-saffron-700 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Source Registry <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => handleSyncSource(source.id)}
                  disabled={syncingSource === source.id}
                  className="px-2.5 py-1 text-xs font-semibold text-navy-900 bg-slate-100 hover:bg-slate-200 rounded inline-flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${syncingSource === source.id ? 'animate-spin text-saffron' : ''}`} />
                  <span>{syncingSource === source.id ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Geographic Hierarchy Engine (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-lg border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Layers className="w-4 h-4 text-saffron" />
            <h3 className="text-sm font-bold text-navy-900">
              Uttar Pradesh Administrative Nomenclature Engine
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Configure electoral intermediate units for <strong className="text-navy-900">Uttar Pradesh</strong> (e.g. Tehsil / Block / Gram Panchayat).
          </p>

          <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-2 font-mono text-navy-900">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-navy-900 text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <span>STATE: UTTAR PRADESH</span>
            </div>
            <div className="pl-6 text-slate-400">↓</div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-navy-800 text-white flex items-center justify-center text-[10px] font-bold">2</span>
              <span>DISTRICT (75 Official UP Districts)</span>
            </div>
            <div className="pl-6 text-slate-400">↓</div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-navy-700 text-white flex items-center justify-center text-[10px] font-bold">3</span>
              <span>ASSEMBLY CONSTITUENCY (403 Vidhan Sabha Seats)</span>
            </div>
            <div className="pl-6 text-slate-400">↓</div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-saffron text-navy-900 flex items-center justify-center text-[10px] font-bold">4</span>
              <span className="font-bold underline text-navy-950">SUB-DISTRICT: {intermediateLevel.toUpperCase()}</span>
            </div>
            <div className="pl-6 text-slate-400">↓</div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-igreen text-white flex items-center justify-center text-[10px] font-bold">5</span>
              <span className="font-bold underline text-navy-950">GRASSROOT UNIT: {subLevel.toUpperCase()}</span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Configure Level 4 Nomenclature (Intermediate Sub-District)
              </label>
              <select
                aria-label="Level 4 Nomenclature"
                value={intermediateLevel}
                onChange={e => setIntermediateLevel(e.target.value as any)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-2 text-navy-900 font-medium"
              >
                <option value="Tehsil">Tehsil (Standard Administrative in UP)</option>
                <option value="Block">Development Block (Vikas Khand)</option>
                <option value="Mandal">Mandal (Party / Operational Sector)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Configure Level 5 Nomenclature (Grassroots Local Unit)
              </label>
              <select
                aria-label="Level 5 Nomenclature"
                value={subLevel}
                onChange={e => setSubLevel(e.target.value as any)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-2 text-navy-900 font-medium"
              >
                <option value="Gram Panchayat">Gram Panchayat / Village Council</option>
                <option value="Ward">Municipal Ward (Nagar Nigam / Palika)</option>
                <option value="Sector">Operational Sector Unit</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-igreen" />
                    <span>Configuration Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-saffron" />
                    <span>Save Hierarchy</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Security, Privacy & API Connector (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-lg border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Radio className="w-4 h-4 text-igreen" />
            <h3 className="text-sm font-bold text-navy-900">
              Live Telecom & Telemetry API Endpoints
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            The platform provides clean abstraction providers so mock demonstration data can be swapped for authorized live campaign endpoints without touching the UI.
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="font-bold text-navy-900">Calling Agent Voice Stream</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">POST https://api.analytix.in/v1/voice/stream</div>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                Demo Provider
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="font-bold text-navy-900">WhatsApp Business Webhook</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">POST https://api.analytix.in/v1/meta/webhook</div>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                Demo Provider
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="font-bold text-navy-900">TRAI DLT Gateway (UP Circle)</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">Sender ID: UP-CAMPAIGN</div>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                Demo Provider
              </span>
            </div>
          </div>

          <div className="p-3 bg-navy-50 rounded border border-navy-200 text-xs text-navy-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-navy-800 shrink-0 mt-0.5" />
            <span>
              <strong>Privacy Standard: </strong>
              Complies with Section 28: Zero voter-level political profiling, no individual persuasion scores, strictly aggregated telemetry.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
