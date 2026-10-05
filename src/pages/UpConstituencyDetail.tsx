import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Vote,
  Users,
  PhoneCall,
  MessageSquare,
  Mail,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Sparkles,
  ShieldCheck,
  Download,
  ExternalLink,
  Info,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { UpAssemblyConstituency } from '../services/providers/types';
import { KpiCard } from '../components/common/KpiCard';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  formatIndianNumber,
  formatPercent,
  formatCompactMetric
} from '../utils/formatters';
import { ExportModal } from '../components/common/ExportModal';

interface UpConstituencyDetailProps {
  constituency: UpAssemblyConstituency;
  onBack: () => void;
}

export const UpConstituencyDetail: React.FC<UpConstituencyDetailProps> = ({
  constituency,
  onBack
}) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'election' | 'channels'>('campaigns');

  const { electionInfo, campaignOperations } = constituency;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              onClick={onBack}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-navy-900 rounded-md transition-colors mt-0.5"
              title="Return to State Dashboard / Map"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded border border-saffron-300">
                  AC #{constituency.constituencyNumber}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
                  {constituency.name}
                </h2>
                <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {constituency.reservedCategory === 'GEN' ? 'General' : `${constituency.reservedCategory} Reserved`}
                </span>
                <StatusBadge status={campaignOperations.status} />
              </div>
              <p className="text-xs text-txt-secondary mt-1">
                District: <strong className="text-navy-900">{constituency.district}</strong> • Region:{' '}
                <strong className="text-navy-900">{constituency.region}</strong> • Parliamentary Constituency:{' '}
                <strong className="text-navy-900">{constituency.parliamentaryConstituency} (PC #{constituency.pcNumber})</strong>
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

        {/* Data Source & Freshness Metadata Banner (Section 19 & 20) */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-navy-900">Election Data:</span>
            <span>{electionInfo.source} ({electionInfo.electionYear})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-navy-900">Campaign Operations:</span>
            <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">Sample Telemetry</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-navy-900">Last Telemetry Synced:</span>
            <span>{campaignOperations.lastSynced}</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Row: Campaign Operations Telemetry (Section 12 KPIs) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
            <span>Operational Campaign Metrics</span>
            <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Sample Telemetry
            </span>
          </h3>
          <span className="text-xs text-slate-500">
            Last Activity: <strong className="text-navy-900">{campaignOperations.lastActivity}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3">
          <KpiCard
            title="Active Campaigns"
            value={campaignOperations.campaignsCount}
            subtitle="Multi-channel drives"
            icon={MapPin}
            accentColor="saffron"
          />
          <KpiCard
            title="People Reached"
            value={formatCompactMetric(campaignOperations.reach)}
            subtitle={`${formatIndianNumber(campaignOperations.reach)} Contacts`}
            icon={Users}
            accentColor="navy"
            trend={{ value: '+14.2%', isPositive: true }}
          />
          <KpiCard
            title="Phone Calls"
            value={formatCompactMetric(campaignOperations.totalCalls)}
            subtitle={`${formatIndianNumber(campaignOperations.connectedCalls)} Connected`}
            icon={PhoneCall}
            accentColor="navy"
          />
          <KpiCard
            title="Connection Rate"
            value={formatPercent(campaignOperations.connectionRate)}
            subtitle="Voice dialogue completion"
            icon={CheckCircle2}
            accentColor="green"
          />
          <KpiCard
            title="WhatsApp Sent"
            value={formatCompactMetric(campaignOperations.whatsappMessages)}
            subtitle="Direct messages & groups"
            icon={MessageSquare}
            accentColor="green"
          />
          <KpiCard
            title="SMS Dispatched"
            value={formatCompactMetric(campaignOperations.smsMessages)}
            subtitle="DLT compliant templates"
            icon={Mail}
            accentColor="navy"
          />
          <KpiCard
            title="Engagement Rate"
            value={formatPercent(campaignOperations.engagementRate)}
            subtitle="Citizen interaction index"
            icon={TrendingUp}
            accentColor="saffron"
          />
          <KpiCard
            title="Citizen Responses"
            value={formatIndianNumber(campaignOperations.responses)}
            subtitle="Interactive feedbacks"
            icon={Users}
            accentColor="green"
          />
          <KpiCard
            title="Scheduled Follow-ups"
            value={formatIndianNumber(campaignOperations.followUps)}
            subtitle="Pending inquiries"
            icon={Calendar}
            accentColor="saffron"
          />
          <KpiCard
            title="Elector Coverage"
            value={formatPercent((campaignOperations.reach / electionInfo.electors) * 100)}
            subtitle="Voter base reached"
            icon={Vote}
            accentColor="navy"
          />
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-slate-200 gap-3">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'campaigns'
              ? 'border-saffron text-navy-900'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          Campaign Operations Breakdown
        </button>
        <button
          onClick={() => setActiveTab('election')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'election'
              ? 'border-saffron text-navy-900'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          <Vote className="w-3.5 h-3.5 text-navy-800" />
          <span>Official ECI Election Information ({electionInfo.electionYear})</span>
        </button>
        <button
          onClick={() => setActiveTab('channels')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'channels'
              ? 'border-saffron text-navy-900'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          Channel Telemetry & AI Voice Insights
        </button>
      </div>

      {/* Tab 1: Campaign Operations */}
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-subtle space-y-4">
            <h4 className="text-sm font-bold text-navy-900">Campaign Channel Saturation</h4>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600">Voice Calling Reach</span>
                  <span className="font-bold text-navy-900">{formatIndianNumber(campaignOperations.totalCalls)}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-navy-900 h-full rounded-full" style={{ width: '42%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600">WhatsApp Broadcast Saturation</span>
                  <span className="font-bold text-navy-900">{formatIndianNumber(campaignOperations.whatsappMessages)}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-igreen h-full rounded-full" style={{ width: '58%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600">SMS Outreach Push</span>
                  <span className="font-bold text-navy-900">{formatIndianNumber(campaignOperations.smsMessages)}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-saffron h-full rounded-full" style={{ width: '72%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-subtle space-y-4">
            <h4 className="text-sm font-bold text-navy-900">Field Activity Summary</h4>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span>Active Field Programs:</span>
                <span className="font-bold text-navy-900">{campaignOperations.campaignsCount} Outreaches</span>
              </div>
              <div className="flex justify-between">
                <span>Current Status:</span>
                <StatusBadge status={campaignOperations.status} size="sm" />
              </div>
              <div className="flex justify-between">
                <span>Last Telemetry Sync:</span>
                <span className="font-semibold text-slate-900">{campaignOperations.lastSynced}</span>
              </div>
              <div className="flex justify-between">
                <span>Data Environment:</span>
                <span className="text-amber-700 font-bold">Sample Campaign Telemetry</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Official ECI Election Information (Section 13) */}
      {activeTab === 'election' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-subtle space-y-4">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-base font-bold text-navy-900">
                Official Vidhan Sabha Election Benchmark ({electionInfo.electionYear})
              </h4>
              <p className="text-xs text-txt-secondary">
                Public electoral statistics sourced directly from the Election Commission of India
              </p>
            </div>
            <span className="text-xs bg-emerald-50 text-igreen px-2.5 py-1 rounded border border-emerald-200 font-semibold inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> ECI Verified Report
            </span>
          </div>

          {/* Warning banner separating historical from current */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <strong>Historical Reference Benchmark: </strong>
              The data below represents verified results from the {electionInfo.assemblyTerm}. It serves as a spatial reference and is strictly separated from operational campaign analytics.
            </div>
          </div>

          {/* Election Stat Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Electors</span>
              <span className="text-base font-bold text-navy-900 tabular-nums">
                {formatIndianNumber(electionInfo.electors)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Registered Voters</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Votes Polled</span>
              <span className="text-base font-bold text-navy-900 tabular-nums">
                {formatIndianNumber(electionInfo.votesPolled)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">EVMS & Postal Ballots</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Voter Turnout</span>
              <span className="text-base font-bold text-igreen tabular-nums">
                {electionInfo.turnoutPercent}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">State Average: 60.8%</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Victory Margin</span>
              <span className="text-base font-bold text-navy-900 tabular-nums">
                {formatIndianNumber(electionInfo.marginVotes)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Winning Party: {electionInfo.winningParty}</span>
            </div>
          </div>

          {/* Report Citation */}
          <div className="p-3 bg-slate-50 rounded border border-slate-100 text-[11px] text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Source Authority:</span>
              <span className="font-semibold text-navy-900">{electionInfo.source}</span>
            </div>
            <div className="flex justify-between">
              <span>Publication:</span>
              <span className="font-semibold text-navy-900">{electionInfo.sourceReport}</span>
            </div>
            <div className="flex justify-between">
              <span>Reference Link:</span>
              <a
                href={electionInfo.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-saffron-700 font-semibold hover:underline inline-flex items-center gap-1"
              >
                results.eci.gov.in <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Channel Telemetry & AI Insights */}
      {activeTab === 'channels' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-subtle space-y-2">
            <div className="flex items-center gap-2 font-bold text-navy-900 text-xs">
              <PhoneCall className="w-4 h-4 text-navy-800" />
              <span>Voice Calling Agent</span>
            </div>
            <div className="text-xs space-y-1.5 text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Total Calls:</span>
                <span className="font-bold text-navy-900">{formatIndianNumber(campaignOperations.totalCalls)}</span>
              </div>
              <div className="flex justify-between">
                <span>Connected:</span>
                <span className="font-bold text-igreen">{formatIndianNumber(campaignOperations.connectedCalls)}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Duration:</span>
                <span className="font-bold text-navy-900">2m 18s</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-subtle space-y-2">
            <div className="flex items-center gap-2 font-bold text-navy-900 text-xs">
              <MessageSquare className="w-4 h-4 text-igreen" />
              <span>WhatsApp Broadcasts</span>
            </div>
            <div className="text-xs space-y-1.5 text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Sent:</span>
                <span className="font-bold text-navy-900">{formatIndianNumber(campaignOperations.whatsappMessages)}</span>
              </div>
              <div className="flex justify-between">
                <span>Read Rate:</span>
                <span className="font-bold text-igreen">78.5%</span>
              </div>
              <div className="flex justify-between">
                <span>Active Groups:</span>
                <span className="font-bold text-navy-900">38 Groups</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-subtle space-y-2">
            <div className="flex items-center gap-2 font-bold text-navy-900 text-xs">
              <Sparkles className="w-4 h-4 text-saffron" />
              <span>AI Conversation Topics</span>
            </div>
            <div className="text-xs space-y-1.5 text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Top Topic:</span>
                <span className="font-bold text-navy-900">Irrigation & Power Supply</span>
              </div>
              <div className="flex justify-between">
                <span>Secondary:</span>
                <span className="font-bold text-navy-900">Rural Roads & Transport</span>
              </div>
              <div className="flex justify-between">
                <span>Sentiment Index:</span>
                <span className="font-bold text-igreen">62% Constructive</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};
