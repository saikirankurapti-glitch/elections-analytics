import React, { useState } from 'react';
import {
  MapPin,
  Target,
  Users,
  PhoneCall,
  MessageSquare,
  Mail,
  Share2,
  TrendingUp,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Building,
  Vote,
  ShieldCheck,
  Download
} from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import {
  mockConstituencies,
  mockMandals,
  mockBooths,
  mockCampaigns
} from '../data/mockData';
import { KpiCard } from '../components/common/KpiCard';
import { ChartCard } from '../components/common/ChartCard';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  formatIndianNumber,
  formatPercent,
  formatCompactMetric
} from '../utils/formatters';
import { ExportModal } from '../components/common/ExportModal';

export const ConstituencyDetail: React.FC = () => {
  const {
    selectedConstituencyId,
    resetToStateDashboard,
    navigateToCampaign,
    setActiveTab
  } = useFilters();

  const [activeTabSub, setActiveTabSub] = useState<'hierarchy' | 'campaigns' | 'channels'>('hierarchy');
  const [selectedMandalId, setSelectedMandalId] = useState<string>('mnd-01');
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Retrieve constituency details or fallback to AC-174 Lucknow Central
  const constituency =
    mockConstituencies.find(
      c => c.id === selectedConstituencyId || c.code.toLowerCase() === selectedConstituencyId?.toLowerCase()
    ) || mockConstituencies[0];

  const mandals = mockMandals.filter(m => m.constituencyId === constituency.id);
  const displayMandals = mandals.length > 0 ? mandals : mockMandals;
  const booths = mockBooths.filter(b => b.mandalId === selectedMandalId);
  const displayBooths = booths.length > 0 ? booths : mockBooths;

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb & Title */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              onClick={resetToStateDashboard}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-navy-900 rounded-md transition-colors mt-0.5"
              title="Return to State Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded border border-saffron-300">
                  {constituency.code}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
                  {constituency.name} Constituency
                </h2>
                <StatusBadge status={constituency.status} />
              </div>
              <p className="text-xs text-txt-secondary mt-1">
                District: <strong className="text-navy-900">{constituency.district}</strong> • Region:{' '}
                <strong className="text-navy-900">{constituency.region}</strong> • Total Electorate:{' '}
                <strong className="text-navy-900">{formatIndianNumber(constituency.totalVoters)}</strong> Voters
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsExportOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-saffron" />
              <span>Export Constituency Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* 9 Constituency Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <KpiCard
          title="Active Campaigns"
          value={constituency.activeCampaigns}
          subtitle="Multi-channel programs"
          icon={Target}
          accentColor="saffron"
        />
        <KpiCard
          title="People Reached"
          value={formatCompactMetric(constituency.totalReach)}
          subtitle={`${formatIndianNumber(constituency.totalReach)} Contacted`}
          icon={Users}
          accentColor="navy"
          trend={{ value: '+12.4%', isPositive: true }}
        />
        <KpiCard
          title="Phone Calls"
          value={formatCompactMetric(constituency.totalCalls)}
          subtitle={`${formatIndianNumber(constituency.connectedCalls)} Connected`}
          icon={PhoneCall}
          accentColor="navy"
          onClick={() => setActiveTab('calling-agent')}
        />
        <KpiCard
          title="Connected Rate"
          value={formatPercent((constituency.connectedCalls / constituency.totalCalls) * 100)}
          subtitle="Connection efficiency"
          icon={CheckCircle2}
          accentColor="green"
        />
        <KpiCard
          title="WhatsApp Sent"
          value={formatCompactMetric(constituency.whatsappMessages)}
          subtitle="Community groups & broadcasts"
          icon={MessageSquare}
          accentColor="green"
          onClick={() => setActiveTab('whatsapp')}
        />
        <KpiCard
          title="SMS Sent"
          value={formatCompactMetric(constituency.smsMessages)}
          subtitle="DLT Verified outreach"
          icon={Mail}
          accentColor="navy"
          onClick={() => setActiveTab('sms')}
        />
        <KpiCard
          title="Engagement Rate"
          value={formatPercent(constituency.engagementRate)}
          subtitle="Active citizen response"
          icon={TrendingUp}
          accentColor="saffron"
        />
        <KpiCard
          title="Direct Responses"
          value={formatIndianNumber(constituency.responses)}
          subtitle="Form & voice feedbacks"
          icon={Users}
          accentColor="green"
        />
        <KpiCard
          title="Scheduled Follow-ups"
          value={formatIndianNumber(constituency.followUps)}
          subtitle="Pending voter queries"
          icon={Calendar}
          accentColor="saffron"
        />
        <KpiCard
          title="Electorate Coverage"
          value={formatPercent((constituency.totalReach / constituency.totalVoters) * 100)}
          subtitle="Outreach saturation"
          icon={Vote}
          accentColor="navy"
        />
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTabSub('hierarchy')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
            activeTabSub === 'hierarchy'
              ? 'border-saffron text-navy-900'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          Mandals, Wards & Booth Coverage ({constituency.mandalsCount} Mandals, {constituency.boothsCount} Booths)
        </button>
        <button
          onClick={() => setActiveTabSub('campaigns')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
            activeTabSub === 'campaigns'
              ? 'border-saffron text-navy-900'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          Active Campaigns in this AC ({constituency.activeCampaigns})
        </button>
        <button
          onClick={() => setActiveTabSub('channels')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
            activeTabSub === 'channels'
              ? 'border-saffron text-navy-900'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          Channel Breakdown & AI Insights
        </button>
      </div>

      {/* Tab 1: Hierarchy (Mandal -> Ward -> Booth) */}
      {activeTabSub === 'hierarchy' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Mandals List (6 Cols) */}
          <div className="lg:col-span-6 bg-white p-4 rounded-lg border border-slate-200 shadow-subtle">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-navy-900">Mandal / Block Level Telemetry</h3>
                <p className="text-xs text-txt-secondary">Select a mandal to inspect polling booth contact coverage</p>
              </div>
              <span className="text-[11px] font-semibold bg-slate-100 px-2 py-0.5 rounded text-navy-900">
                {displayMandals.length} Mandals
              </span>
            </div>

            <div className="space-y-2">
              {displayMandals.map(mnd => {
                const isSelected = selectedMandalId === mnd.id;
                return (
                  <div
                    key={mnd.id}
                    onClick={() => setSelectedMandalId(mnd.id)}
                    className={`p-3 rounded-md border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-saffron bg-saffron-50/40 shadow-xs ring-1 ring-saffron'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-navy-800" />
                        <span className="text-xs font-bold text-navy-900">{mnd.name}</span>
                      </div>
                      <StatusBadge status={mnd.status} size="sm" />
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Wards</span>
                        <span className="font-semibold text-navy-900">{mnd.wardsCount}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Booths</span>
                        <span className="font-semibold text-navy-900">{mnd.boothsCount}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Reach</span>
                        <span className="font-semibold text-navy-900">{formatIndianNumber(mnd.reach)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Engagement</span>
                        <span className="font-semibold text-igreen">{formatPercent(mnd.engagementRate)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Booths List (6 Cols) */}
          <div className="lg:col-span-6 bg-white p-4 rounded-lg border border-slate-200 shadow-subtle">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-navy-900">
                  Booth Level Contact Coverage
                </h3>
                <p className="text-xs text-txt-secondary">
                  Micro-level polling station contact progress
                </p>
              </div>
              <span className="text-[11px] font-semibold bg-navy-50 text-navy-900 px-2 py-0.5 rounded border border-navy-200">
                Mandal Selected
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-txt-secondary">
                  <tr>
                    <th className="py-2.5 px-3">Booth #</th>
                    <th className="py-2.5 px-3">Location & Center</th>
                    <th className="py-2.5 px-2 text-right">Electors</th>
                    <th className="py-2.5 px-2 text-right">Targeted</th>
                    <th className="py-2.5 px-3 text-right">Coverage %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayBooths.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-bold text-navy-900">
                        #{b.boothNumber}
                      </td>
                      <td className="py-2 px-3">
                        <div className="font-semibold text-navy-900 line-clamp-1">{b.name}</div>
                        <div className="text-[10px] text-slate-500">{b.location}</div>
                      </td>
                      <td className="py-2 px-2 text-right tabular-nums text-slate-700">
                        {b.voterCount}
                      </td>
                      <td className="py-2 px-2 text-right tabular-nums text-navy-900 font-medium">
                        {b.contactsTargeted}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <div className="inline-flex items-center gap-1 font-bold text-igreen tabular-nums">
                          <span>{b.reachPercent}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Standard Election Commission polling station registry linked</span>
              <span className="text-navy-900 font-semibold">100% booth committee verified</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Active Campaigns in this AC */}
      {activeTabSub === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockCampaigns.slice(0, 4).map(cmp => (
            <div
              key={cmp.id}
              onClick={() => navigateToCampaign(cmp.id)}
              className="command-card p-4 cursor-pointer hover:border-saffron transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {cmp.type}
                  </span>
                  <h4 className="text-sm font-bold text-navy-900 hover:text-saffron-700 mt-0.5">
                    {cmp.name}
                  </h4>
                </div>
                <StatusBadge status={cmp.status} size="sm" />
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cmp.objective}</p>

              <div className="grid grid-cols-4 gap-2 mt-3 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">AC Reach</span>
                  <span className="font-semibold text-navy-900">{formatCompactMetric(cmp.reach / 8)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Calls</span>
                  <span className="font-semibold text-navy-900">{formatCompactMetric(cmp.calls / 8)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">WhatsApp</span>
                  <span className="font-semibold text-navy-900">{formatCompactMetric(cmp.whatsapp / 8)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Engagement</span>
                  <span className="font-semibold text-igreen">{formatPercent(cmp.engagementRate)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Channel Breakdown & AI Insights */}
      {activeTabSub === 'channels' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Calling summary */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-subtle">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-navy-800" />
                AI Calling Desk
              </h4>
              <button
                onClick={() => setActiveTab('calling-agent')}
                className="text-[11px] text-saffron-700 font-semibold hover:underline"
              >
                Inspect Logs →
              </button>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Total Calls:</span>
                <span className="font-bold text-navy-900">{formatIndianNumber(constituency.totalCalls)}</span>
              </div>
              <div className="flex justify-between">
                <span>Connected:</span>
                <span className="font-bold text-igreen">{formatIndianNumber(constituency.connectedCalls)}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Talk Duration:</span>
                <span className="font-bold text-navy-900">2m 14s</span>
              </div>
            </div>
          </div>

          {/* WhatsApp summary */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-subtle">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-igreen" />
                WhatsApp Broadcasts
              </h4>
              <button
                onClick={() => setActiveTab('whatsapp')}
                className="text-[11px] text-saffron-700 font-semibold hover:underline"
              >
                View Groups →
              </button>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Messages Sent:</span>
                <span className="font-bold text-navy-900">{formatIndianNumber(constituency.whatsappMessages)}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Groups:</span>
                <span className="font-bold text-navy-900">42 Groups</span>
              </div>
              <div className="flex justify-between">
                <span>Read Rate:</span>
                <span className="font-bold text-igreen">78.4%</span>
              </div>
            </div>
          </div>

          {/* AI Sentiment summary */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-subtle">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-saffron" />
                AI Voice Topics
              </h4>
              <button
                onClick={() => setActiveTab('ai-insights')}
                className="text-[11px] text-saffron-700 font-semibold hover:underline"
              >
                Topic Analytics →
              </button>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Top Civic Focus:</span>
                <span className="font-bold text-navy-900">Irrigation Canal Release</span>
              </div>
              <div className="flex justify-between">
                <span>Secondary Issue:</span>
                <span className="font-bold text-navy-900">Skill Development Centers</span>
              </div>
              <div className="flex justify-between">
                <span>Overall Sentiment:</span>
                <span className="font-bold text-igreen">64% Constructive Positive</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};
