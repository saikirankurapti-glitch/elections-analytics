import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Target,
  Users,
  PhoneCall,
  MessageSquare,
  Mail,
  Share2,
  TrendingUp,
  Download,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
  Search,
  ExternalLink,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Building,
  Radio,
  Clock,
  ChevronRight,
  Globe,
  Activity,
  Zap,
  Flame,
  BarChart3,
  PhoneIncoming
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { KpiCard } from '../components/common/KpiCard';
import { ChartCard } from '../components/common/ChartCard';
import { ResponsiveChart } from '../components/common/ResponsiveChart';
import { UpStateMap } from '../components/common/UpStateMap';
import { ExportModal } from '../components/common/ExportModal';
import {
  constituencyDataProvider,
  campaignDataProvider,
  electionDataProvider
} from '../services/providers';
import {
  UpAssemblyConstituency,
  UpDistrictSummary
} from '../services/providers/types';
import {
  formatIndianNumber,
  formatPercent,
  formatCompactMetric
} from '../utils/formatters';
import { useFilters } from '../context/FilterContext';
import { activeStateConfig } from '../config/stateConfig';
import { demoDataEngine } from '../services/demoDataEngine';

interface UpStateDashboardProps {
  onSelectConstituency: (ac: UpAssemblyConstituency) => void;
  onNavigateToModule: (module: string) => void;
}

export const UpStateDashboard: React.FC<UpStateDashboardProps> = ({
  onSelectConstituency,
  onNavigateToModule
}) => {
  const { selectedConstituencyId, setSelectedConstituencyId, setActiveTab } = useFilters();
  const [constituencies, setConstituencies] = useState<UpAssemblyConstituency[]>([]);
  const [districts, setDistricts] = useState<UpDistrictSummary[]>([]);
  const [selectedAcNumber, setSelectedAcNumber] = useState<number | null>(174); // Default to AC 174 Lucknow Central
  const [activeDistrict, setActiveDistrict] = useState<string>('ALL');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [stateKpis, setStateKpis] = useState<any>(null);
  const [activeTrendMetric, setActiveTrendMetric] = useState<'reach' | 'calls' | 'whatsapp' | 'sms' | 'engagement' | 'responses'>('reach');
  const [topAcMetric, setTopAcMetric] = useState<'reach' | 'calls' | 'whatsapp' | 'engagement'>('reach');
  const [topDistrictMetric, setTopDistrictMetric] = useState<'reach' | 'calls' | 'whatsapp' | 'sms' | 'engagement'>('reach');

  // Load centralized deterministic demo engine metrics
  const sparklines = useMemo(() => demoDataEngine.getSparklines(), []);
  const funnelStages = useMemo(() => demoDataEngine.getStateFunnel(), []);
  const omnichannelList = useMemo(() => demoDataEngine.getOmnichannelPerformance(), []);
  const upActivityTrends30Days = useMemo(() => demoDataEngine.getTimeSeries(30), []);
  const executiveInsights = useMemo(() => demoDataEngine.getExecutiveSummary(), []);

  // Sync with selectedConstituencyId from global filters / header search
  useEffect(() => {
    if (selectedConstituencyId && selectedConstituencyId !== 'ALL') {
      const num = Number(selectedConstituencyId.replace(/\D/g, ''));
      if (!isNaN(num) && num > 0) {
        setSelectedAcNumber(num);
      }
    }
  }, [selectedConstituencyId]);

  // Load live data providers
  useEffect(() => {
    let isMounted = true;
    const loadAll = async () => {
      const [acs, dists, kpis] = await Promise.all([
        constituencyDataProvider.getAllConstituencies(),
        constituencyDataProvider.getDistricts(),
        campaignDataProvider.getStateCampaignKpis()
      ]);
      if (isMounted) {
        setConstituencies(acs);
        setDistricts(dists);
        setStateKpis(kpis);
      }
    };
    loadAll();
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedAc = useMemo(() => {
    if (!selectedAcNumber) return null;
    return constituencies.find(c => c.constituencyNumber === selectedAcNumber) || null;
  }, [selectedAcNumber, constituencies]);

  // Dynamic Top Constituencies data (Rankings shift based on active metric!)
  const topConstituenciesChartData = useMemo(() => {
    return demoDataEngine.getTopConstituencies(topAcMetric, 8).map(c => ({
      name: `${c.constituencyNumber} - ${c.name}`,
      reach: c.campaignOperations.reach,
      calls: c.campaignOperations.totalCalls,
      whatsapp: c.campaignOperations.whatsappMessages,
      engagement: c.campaignOperations.engagementRate,
      district: c.district
    }));
  }, [topAcMetric]);

  // Dynamic Top Districts data (Rankings shift based on active metric!)
  const topDistrictsChartData = useMemo(() => {
    return demoDataEngine.getTopDistricts(topDistrictMetric, 8).map(d => ({
      name: d.district,
      reach: d.totalReach,
      calls: d.totalCalls,
      whatsapp: d.whatsappMessages,
      sms: d.smsMessages,
      engagement: d.averageEngagementRate,
      acs: d.constituencyCount
    }));
  }, [topDistrictMetric]);

  // Operational tier counts across 403 constituencies
  const tierBreakdown = useMemo(() => {
    const list = constituencies.length ? constituencies : demoDataEngine.getAllConstituencies();
    return {
      veryHigh: list.filter(c => c.campaignOperations.reach >= 220000).length,
      high: list.filter(c => c.campaignOperations.reach >= 150000 && c.campaignOperations.reach < 220000).length,
      medium: list.filter(c => c.campaignOperations.reach >= 85000 && c.campaignOperations.reach < 150000).length,
      low: list.filter(c => c.campaignOperations.reach >= 40000 && c.campaignOperations.reach < 85000).length,
      early: list.filter(c => c.campaignOperations.reach < 40000).length
    };
  }, [constituencies]);

  // Recent Live Activity Stream (Synthetic demo audit trail)
  const recentActivities = [
    { id: 1, time: '3m ago', ac: 'AC 174 Lucknow Central', campaign: 'UP Vikas Mission', channel: 'AI Voice Calling', activity: 'Completed batch of 450 dialogues (78% connection rate)', status: 'Success' },
    { id: 2, time: '7m ago', ac: 'AC 390 Varanasi Cantt.', campaign: 'Yuva Shakti Drive', channel: 'WhatsApp Broadcast', activity: 'Dispatched 12,500 event registration invites', status: 'Delivered' },
    { id: 3, time: '12m ago', ac: 'AC 322 Gorakhpur Urban', campaign: 'Prajavani Grievance', channel: 'DLT SMS Alert', activity: 'Broadcasted road repair resolution codes to 8,400 voters', status: 'Delivered' },
    { id: 4, time: '18m ago', ac: 'AC 275 Ayodhya', campaign: 'Matru Shakti Mission', channel: 'AI Voice Calling', activity: 'Surveyed 620 beneficiaries regarding nutrition cards', status: 'Success' },
    { id: 5, time: '24m ago', ac: 'AC 048 Meerut Cantt.', campaign: 'Kisan Samman Connect', channel: 'WhatsApp Community', activity: '48 community group updates shared across rural mandals', status: 'Active' },
    { id: 6, time: '35m ago', ac: 'AC 061 Noida', campaign: 'Yuva Shakti Drive', channel: 'Digital Portal', activity: '1,420 online volunteer registrations completed', status: 'Converted' }
  ];

  return (
    <div className="space-y-6">
      {/* State Header Command Bar (Phase 5 Specs) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight uppercase font-sans">
              UTTAR PRADESH
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider bg-navy-900 text-white px-2.5 py-0.5 rounded shadow-xs">
              State Campaign Intelligence Command Center
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              SAMPLE ANALYTICS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-txt-secondary mt-1">
            403 Assembly Constituencies • 75 Districts • ECI 2022 Official Benchmark & 2008 Delimitation Geometry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('districts')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-navy-900 rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <Building className="w-3.5 h-3.5 text-navy-700" />
            <span>75 Districts View</span>
          </button>
          <button
            onClick={() => setIsExportOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-saffron" />
            <span>Export State Briefing</span>
          </button>
        </div>
      </div>

      {/* Top KPI Command Bar with 3D Depth Numbers & Sparklines */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3">
        <KpiCard
          title="Constituencies"
          value="403"
          subtitle="75 Districts Active"
          icon={MapPin}
          accentColor="navy"
          onClick={() => setActiveTab('constituencies')}
        />
        <KpiCard
          title="Districts"
          value="75"
          subtitle="6 Regional Clusters"
          icon={Building}
          accentColor="navy"
          onClick={() => setActiveTab('districts')}
        />
        <KpiCard
          title="Campaigns"
          value={stateKpis?.activeCampaigns || 48}
          subtitle="Active Campaign Cycles"
          icon={Target}
          accentColor="saffron"
          sparkline={sparklines.campaigns}
          trend={{ value: '+12.4%', isPositive: true }}
          onClick={() => onNavigateToModule('campaigns')}
        />
        <KpiCard
          title="Total Reach"
          value={formatCompactMetric(stateKpis?.peopleReached || 49900816)}
          subtitle="32.7% of UP Electorate"
          icon={Users}
          accentColor="blue"
          sparkline={sparklines.reach}
          trend={{ value: '+14.8%', isPositive: true }}
        />
        <KpiCard
          title="Phone Calls"
          value={formatCompactMetric(stateKpis?.totalCalls || 20175446)}
          subtitle={`${formatPercent(stateKpis?.connectionRate || 71.1)} Connected`}
          icon={PhoneCall}
          accentColor="green"
          sparkline={sparklines.calls}
          onClick={() => onNavigateToModule('calling-agent')}
        />
        <KpiCard
          title="Connect Rate"
          value={formatPercent(stateKpis?.connectionRate || 71.1)}
          subtitle="AI Voice Dialogue"
          icon={PhoneIncoming}
          accentColor="emerald"
          sparkline={sparklines.connectedRate}
          trend={{ value: '+3.2%', isPositive: true }}
          onClick={() => onNavigateToModule('calling-agent')}
        />
        <KpiCard
          title="WhatsApp Sent"
          value={formatCompactMetric(stateKpis?.whatsappMessages || 27752307)}
          subtitle="Meta Cloud API"
          icon={MessageSquare}
          accentColor="teal"
          sparkline={sparklines.whatsapp}
          onClick={() => onNavigateToModule('whatsapp')}
        />
        <KpiCard
          title="SMS Dispatched"
          value={formatCompactMetric(stateKpis?.smsMessages || 35130944)}
          subtitle="TRAI DLT Verified"
          icon={Mail}
          accentColor="purple"
          sparkline={sparklines.sms}
          onClick={() => onNavigateToModule('sms')}
        />
        <KpiCard
          title="Social Reach"
          value={formatCompactMetric(stateKpis?.socialReach || 60300000)}
          subtitle="Video Views & Impressions"
          icon={Share2}
          accentColor="indigo"
          sparkline={sparklines.social}
          onClick={() => onNavigateToModule('social')}
        />
        <KpiCard
          title="Avg Engagement"
          value={formatPercent(stateKpis?.engagementRate || 41.0)}
          subtitle="Multi-Channel Response"
          icon={TrendingUp}
          accentColor="amber"
          sparkline={sparklines.engagement}
          trend={{ value: '+2.4%', isPositive: true }}
        />
        <KpiCard
          title="Responses"
          value={formatCompactMetric(stateKpis?.responses || 7742273)}
          subtitle="Inbound Citizen Inquiries"
          icon={CheckCircle2}
          accentColor="cyan"
          sparkline={sparklines.responses}
        />
        <KpiCard
          title="Follow-ups"
          value={formatCompactMetric(stateKpis?.followUps || 2204353)}
          subtitle="Grievance Pipeline Queue"
          icon={Sparkles}
          accentColor="coral"
          sparkline={sparklines.followUps}
        />
      </div>

      {/* Main Map + Selected Constituency Analytics Layout (Phase 8 Specs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real Uttar Pradesh 403-Constituency Map (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <UpStateMap
            selectedAcNumber={selectedAcNumber}
            onSelectConstituency={(ac) => {
              setSelectedAcNumber(ac.constituencyNumber);
              setSelectedConstituencyId(String(ac.constituencyNumber));
            }}
            activeDistrict={activeDistrict}
            heightClass="h-[530px]"
          />
        </div>

        {/* Selected Constituency Intelligence Panel (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-lg border border-slate-200 shadow-subtle flex flex-col justify-between">
          {selectedAc ? (
            <div className="space-y-3.5">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded border border-saffron-200">
                      AC #{selectedAc.constituencyNumber}
                    </span>
                    <h3 className="text-xl font-black text-navy-900 mt-1">
                      {selectedAc.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedAc.district} District • {selectedAc.region}
                    </p>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                    {selectedAc.reservedCategory}
                  </span>
                </div>
              </div>

              {/* Official ECI 2022 Election Snapshot (Official Data Label) */}
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200 space-y-1 text-xs">
                <div className="flex items-center justify-between text-navy-900 font-bold border-b border-slate-200 pb-1">
                  <span>ECI 2022 Official Election Data</span>
                  <span className="text-[9px] text-igreen font-bold bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                    OFFICIAL DATA
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Registered Electors:</span>
                  <span className="font-semibold text-navy-900 tabular-nums">
                    {formatIndianNumber(selectedAc.electionInfo.electors)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Voter Turnout:</span>
                  <span className="font-semibold text-igreen tabular-nums">
                    {selectedAc.electionInfo.turnoutPercent}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Winning Party:</span>
                  <span className="font-semibold text-navy-900">
                    {selectedAc.electionInfo.winningParty}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Victory Margin:</span>
                  <span className="font-semibold text-navy-900 tabular-nums">
                    {formatIndianNumber(selectedAc.electionInfo.marginVotes)} votes
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 pt-0.5">
                  Source: {selectedAc.electionInfo.source}
                </div>
              </div>

              {/* Campaign Operations Telemetry (Demo Data Label) */}
              <div className="p-3 bg-amber-50/40 rounded-md border border-amber-200/70 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-navy-900 border-b border-amber-200/50 pb-1">
                  <span>Campaign Operations</span>
                  <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                    SAMPLE ANALYTICS
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Reach</span>
                    <span className="font-bold text-navy-900 tabular-nums">
                      {formatIndianNumber(selectedAc.campaignOperations.reach)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Phone Calls</span>
                    <span className="font-bold text-navy-900 tabular-nums">
                      {formatIndianNumber(selectedAc.campaignOperations.totalCalls)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Connected Calls</span>
                    <span className="font-bold text-igreen tabular-nums">
                      {formatIndianNumber(selectedAc.campaignOperations.connectedCalls)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Engagement</span>
                    <span className="font-bold text-saffron tabular-nums">
                      {formatPercent(selectedAc.campaignOperations.engagementRate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>Last Telemetry Sync:</span>
                <span className="font-semibold text-navy-900">{selectedAc.campaignOperations.lastSynced}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">Hover or click any constituency on the map to inspect intelligence</p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200">
            {selectedAc && (
              <button
                onClick={() => {
                  setSelectedConstituencyId(String(selectedAc.constituencyNumber));
                  onSelectConstituency(selectedAc);
                }}
                className="w-full py-2 bg-navy-900 hover:bg-navy-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Open Full Constituency Dossier</span>
                <ArrowRight className="w-3.5 h-3.5 text-saffron" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* State Campaign Funnel & Omnichannel Performance (Phase 18 & 19 Specs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* State Campaign Funnel (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-lg border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-navy-900 text-sm">
                  Statewide Citizen Outreach & Engagement Funnel
                </h3>
                <p className="text-xs text-slate-500">
                  Progression from 15.3 Cr total electors to completed civic dialogues and follow-ups
                </p>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                SAMPLE ANALYTICS
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {funnelStages.map((stage, idx) => (
                <div key={stage.stage} className="relative">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-navy-900 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-navy-100 text-navy-900 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      {stage.stage}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-mono">{stage.label}</span>
                      <span className="font-bold text-navy-900 text-xs tabular-nums">{stage.formattedCount}</span>
                      <span className="text-[10px] font-bold text-saffron bg-saffron-50 px-1.5 py-0.5 rounded">
                        {stage.conversionFromPrevious}%
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0 ? 'bg-navy-900' : idx === 1 ? 'bg-navy-800' : idx === 2 ? 'bg-navy-700' : idx === 3 ? 'bg-igreen' : 'bg-saffron'
                      }`}
                      style={{ width: `${Math.max(10, 100 - idx * 16)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Overall Conversion: <strong>4.2%</strong> of Target Electorate directly engaged</span>
            <span>Funnel Efficiency: <strong>High Saturation</strong></span>
          </div>
        </div>

        {/* Omnichannel Performance (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-lg border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-navy-900 text-sm">
                  Omnichannel Performance Mix
                </h3>
                <p className="text-xs text-slate-500">
                  Cross-channel delivery volume, response counts and engagement rates
                </p>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                SAMPLE ANALYTICS
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {omnichannelList.map(channel => {
                const getIcon = () => {
                  if (channel.category === 'Voice') return <PhoneCall className="w-4 h-4 text-green-600" />;
                  if (channel.channel.includes('WhatsApp')) return <MessageSquare className="w-4 h-4 text-teal-600" />;
                  if (channel.category === 'Messaging') return <Mail className="w-4 h-4 text-purple-600" />;
                  if (channel.category === 'Social') return <Share2 className="w-4 h-4 text-indigo-600" />;
                  return <Globe className="w-4 h-4 text-blue-600" />;
                };

                const getBg = () => {
                  if (channel.category === 'Voice') return 'bg-green-50 text-green-700 border-green-200';
                  if (channel.channel.includes('WhatsApp')) return 'bg-teal-50 text-teal-700 border-teal-200';
                  if (channel.category === 'Messaging') return 'bg-purple-50 text-purple-700 border-purple-200';
                  if (channel.category === 'Social') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
                  return 'bg-blue-50 text-blue-700 border-blue-200';
                };

                const getModule = () => {
                  if (channel.category === 'Voice') return 'calling-agent';
                  if (channel.channel.includes('WhatsApp')) return 'whatsapp';
                  if (channel.category === 'Messaging') return 'sms';
                  if (channel.category === 'Social') return 'social';
                  return 'digital';
                };

                return (
                  <div
                    key={channel.channel}
                    onClick={() => onNavigateToModule(getModule())}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded flex items-center justify-center font-bold border ${getBg()}`}>
                        {getIcon()}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-navy-900">{channel.channel}</div>
                        <div className="text-[10px] text-slate-500">
                          {formatCompactMetric(channel.volume)} volume • {channel.status}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-navy-900 tabular-nums">
                        {channel.engagementRate}%
                      </span>
                      <div className="text-[10px] text-emerald-600 font-semibold">{channel.trend}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500">All channels fully integrated with Central Uttar Pradesh CRM</span>
          </div>
        </div>
      </div>

      {/* State Performance Trends Chart (30 Days with Deterministic Spikes & Weekend Effects) */}
      <ChartCard
        title="Uttar Pradesh 30-Day Campaign Activity & Response Telemetry"
        subtitle="Daily outreach trajectory with campaign launch pulses, weekend shifts and verified response telemetry"
        action={
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-0.5 rounded text-xs">
            <button
              onClick={() => setActiveTrendMetric('reach')}
              className={`px-2 py-0.5 rounded font-medium ${activeTrendMetric === 'reach' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
            >
              Reach
            </button>
            <button
              onClick={() => setActiveTrendMetric('calls')}
              className={`px-2 py-0.5 rounded font-medium ${activeTrendMetric === 'calls' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
            >
              Calls
            </button>
            <button
              onClick={() => setActiveTrendMetric('whatsapp')}
              className={`px-2 py-0.5 rounded font-medium ${activeTrendMetric === 'whatsapp' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
            >
              WhatsApp
            </button>
            <button
              onClick={() => setActiveTrendMetric('sms')}
              className={`px-2 py-0.5 rounded font-medium ${activeTrendMetric === 'sms' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
            >
              SMS
            </button>
            <button
              onClick={() => setActiveTrendMetric('engagement')}
              className={`px-2 py-0.5 rounded font-medium ${activeTrendMetric === 'engagement' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
            >
              Engagement %
            </button>
            <button
              onClick={() => setActiveTrendMetric('responses')}
              className={`px-2 py-0.5 rounded font-medium ${activeTrendMetric === 'responses' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
            >
              Responses
            </button>
          </div>
        }
      >
        <ResponsiveChart width="100%" height={260}>
          <AreaChart data={upActivityTrends30Days} margin={{ top: 15, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="upColorDynamic" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={
                    activeTrendMetric === 'calls'
                      ? '#16A34A'
                      : activeTrendMetric === 'whatsapp'
                      ? '#0D9488'
                      : activeTrendMetric === 'sms'
                      ? '#7C3AED'
                      : activeTrendMetric === 'engagement'
                      ? '#D97706'
                      : activeTrendMetric === 'responses'
                      ? '#0891B2'
                      : '#2563EB'
                  }
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={
                    activeTrendMetric === 'calls'
                      ? '#16A34A'
                      : activeTrendMetric === 'whatsapp'
                      ? '#0D9488'
                      : activeTrendMetric === 'sms'
                      ? '#7C3AED'
                      : activeTrendMetric === 'engagement'
                      ? '#D97706'
                      : activeTrendMetric === 'responses'
                      ? '#0891B2'
                      : '#2563EB'
                  }
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} interval={2} />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748B' }}
              tickFormatter={val => activeTrendMetric === 'engagement' ? `${val}%` : formatCompactMetric(val)}
            />
            <Tooltip
              formatter={(val: any) => [activeTrendMetric === 'engagement' ? `${val}%` : formatIndianNumber(val), activeTrendMetric.toUpperCase()]}
              contentStyle={{ backgroundColor: '#0B1F3A', borderColor: '#1D4175', color: '#fff', fontSize: '12px' }}
            />
            <Area
              type="monotone"
              dataKey={activeTrendMetric}
              stroke={
                activeTrendMetric === 'calls'
                  ? '#16A34A'
                  : activeTrendMetric === 'whatsapp'
                  ? '#0D9488'
                  : activeTrendMetric === 'sms'
                  ? '#7C3AED'
                  : activeTrendMetric === 'engagement'
                  ? '#D97706'
                  : activeTrendMetric === 'responses'
                  ? '#0891B2'
                  : '#2563EB'
              }
              fillOpacity={1}
              fill="url(#upColorDynamic)"
            />
          </AreaChart>
        </ResponsiveChart>
      </ChartCard>

      {/* Top Constituencies & Top Districts Benchmark (Rankings Shift Dynamically By Metric!) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Constituencies by Metric (6 Cols) */}
        <div className="lg:col-span-6">
          <ChartCard
            title="Top Assembly Constituencies by Operational Volume"
            subtitle="Leading UP assembly constituencies ranked dynamically by channel saturation"
            action={
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-xs">
                <button
                  onClick={() => setTopAcMetric('reach')}
                  className={`px-2 py-0.5 rounded font-medium ${topAcMetric === 'reach' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
                >
                  Reach
                </button>
                <button
                  onClick={() => setTopAcMetric('calls')}
                  className={`px-2 py-0.5 rounded font-medium ${topAcMetric === 'calls' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
                >
                  Calls
                </button>
                <button
                  onClick={() => setTopAcMetric('whatsapp')}
                  className={`px-2 py-0.5 rounded font-medium ${topAcMetric === 'whatsapp' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => setTopAcMetric('engagement')}
                  className={`px-2 py-0.5 rounded font-medium ${topAcMetric === 'engagement' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
                >
                  Engagement %
                </button>
              </div>
            }
          >
            <ResponsiveChart width="100%" height={260}>
              <BarChart data={topConstituenciesChartData} margin={{ top: 15, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} angle={-20} textAnchor="end" />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={val => topAcMetric === 'engagement' ? `${val}%` : formatCompactMetric(val)}
                />
                <Tooltip
                  formatter={(val: any) => [
                    topAcMetric === 'engagement' ? `${val}%` : formatIndianNumber(val),
                    topAcMetric.toUpperCase()
                  ]}
                  contentStyle={{ backgroundColor: '#0B1F3A', borderColor: '#1D4175', color: '#fff', fontSize: '12px' }}
                />
                <Bar
                  dataKey={topAcMetric}
                  fill={
                    topAcMetric === 'calls'
                      ? '#16A34A'
                      : topAcMetric === 'whatsapp'
                      ? '#0D9488'
                      : topAcMetric === 'engagement'
                      ? '#D97706'
                      : '#2563EB'
                  }
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveChart>
          </ChartCard>
        </div>

        {/* Top Districts by Metric (6 Cols) */}
        <div className="lg:col-span-6">
          <ChartCard
            title="Top Uttar Pradesh Districts by Campaign Activity"
            subtitle="Aggregated multi-constituency operational volume across top administrative districts"
            action={
              <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-0.5 rounded text-xs">
                <button
                  onClick={() => setTopDistrictMetric('reach')}
                  className={`px-2 py-0.5 rounded font-medium ${topDistrictMetric === 'reach' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
                >
                  Reach
                </button>
                <button
                  onClick={() => setTopDistrictMetric('calls')}
                  className={`px-2 py-0.5 rounded font-medium ${topDistrictMetric === 'calls' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
                >
                  Calls
                </button>
                <button
                  onClick={() => setTopDistrictMetric('whatsapp')}
                  className={`px-2 py-0.5 rounded font-medium ${topDistrictMetric === 'whatsapp' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => setTopDistrictMetric('sms')}
                  className={`px-2 py-0.5 rounded font-medium ${topDistrictMetric === 'sms' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
                >
                  SMS
                </button>
                <button
                  onClick={() => setTopDistrictMetric('engagement')}
                  className={`px-2 py-0.5 rounded font-medium ${topDistrictMetric === 'engagement' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
                >
                  Engagement %
                </button>
              </div>
            }
          >
            <ResponsiveChart width="100%" height={260}>
              <BarChart data={topDistrictsChartData} margin={{ top: 15, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} angle={-20} textAnchor="end" />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={val => topDistrictMetric === 'engagement' ? `${val}%` : formatCompactMetric(val)}
                />
                <Tooltip
                  formatter={(val: any) => [
                    topDistrictMetric === 'engagement' ? `${val}%` : formatIndianNumber(val),
                    topDistrictMetric.toUpperCase()
                  ]}
                  contentStyle={{ backgroundColor: '#0B1F3A', borderColor: '#1D4175', color: '#fff', fontSize: '12px' }}
                />
                <Bar
                  dataKey={topDistrictMetric}
                  fill={
                    topDistrictMetric === 'calls'
                      ? '#16A34A'
                      : topDistrictMetric === 'whatsapp'
                      ? '#0D9488'
                      : topDistrictMetric === 'sms'
                      ? '#7C3AED'
                      : topDistrictMetric === 'engagement'
                      ? '#D97706'
                      : '#0B1F3A'
                  }
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveChart>
          </ChartCard>
        </div>
      </div>

      {/* High-Value Operations Performance Grid (Calling, Messaging, Digital, AI Insights) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Section 6: Calling Performance */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-green-600" />
                Calling Performance
              </span>
              <span className="text-[10px] bg-green-50 text-green-700 font-bold px-1.5 py-0.5 rounded">
                AI Dialect
              </span>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Initiated Calls:</span>
                <span className="font-bold text-navy-900 tabular-nums">2.02 Cr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Connected Dialogues:</span>
                <span className="font-bold text-green-600 tabular-nums">1.44 Cr (71.1%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Average Duration:</span>
                <span className="font-semibold text-navy-900 tabular-nums">2m 48s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Surveys Completed:</span>
                <span className="font-semibold text-navy-900 tabular-nums">64.2 L (44.6%)</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Grievance Escalate: 22.0 L</span>
            <button
              onClick={() => onNavigateToModule('calling-agent')}
              className="text-green-700 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>Dossier</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Section 7: Messaging Performance */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                Messaging Performance
              </span>
              <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-1.5 py-0.5 rounded">
                WhatsApp + SMS
              </span>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">WhatsApp Delivered:</span>
                <span className="font-bold text-navy-900 tabular-nums">2.68 Cr (96.5%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">WhatsApp Read Rate:</span>
                <span className="font-bold text-teal-600 tabular-nums">74.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Direct Inbound Replies:</span>
                <span className="font-semibold text-navy-900 tabular-nums">27.8 L (10.4%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SMS DLT Delivery:</span>
                <span className="font-semibold text-purple-700 tabular-nums">96.0% (3.37 Cr)</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Opt-out rate: 0.14%</span>
            <button
              onClick={() => onNavigateToModule('whatsapp')}
              className="text-teal-700 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>Dossier</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Section 8: Digital Media Performance */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                Digital & Web Portals
              </span>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                Attribution
              </span>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Social Video Views:</span>
                <span className="font-bold text-navy-900 tabular-nums">4.28 Cr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Web Portal Sessions:</span>
                <span className="font-bold text-blue-600 tabular-nums">1.48 Cr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Manifesto Downloads:</span>
                <span className="font-semibold text-navy-900 tabular-nums">842,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Volunteer Enlistments:</span>
                <span className="font-semibold text-navy-900 tabular-nums">142,800</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">CTR: 4.8%</span>
            <button
              onClick={() => onNavigateToModule('digital')}
              className="text-blue-700 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>Dossier</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Section 9: AI Conversational Insights */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                AI Conversation Insights
              </span>
              <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded">
                4 Dialects
              </span>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Dominant Topic:</span>
                <span className="font-bold text-navy-900">Infrastructure (34%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Agri & Welfare Queries:</span>
                <span className="font-semibold text-navy-900">28% of dialogues</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Youth & Employment:</span>
                <span className="font-semibold text-navy-900">21% of dialogues</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Citizen Sentiment:</span>
                <span className="font-bold text-emerald-600">68% Constructive</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Dialects: Bhojpuri, Awadhi, Braj</span>
            <button
              onClick={() => onNavigateToModule('ai-insights')}
              className="text-amber-700 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>Dossier</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Section 5: Constituency Operational Saturation Heatmap Breakdown */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-navy-900 text-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-saffron" />
              <span>Constituency Operational Saturation Breakdown</span>
            </h3>
            <p className="text-xs text-slate-500">
              Distribution of all 403 Uttar Pradesh constituencies across verified operational reach tiers
            </p>
          </div>
          <span className="text-[10px] font-bold text-navy-900 bg-slate-100 px-2.5 py-0.5 rounded">
            403 ACs Categorized
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-3">
          <div className="p-3 rounded-lg bg-navy-900 text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">Very High Activity</span>
            <div className="text-xl font-black mt-1 text-white">{tierBreakdown.veryHigh} ACs</div>
            <div className="text-[11px] text-slate-300 mt-0.5">&gt; 2.2 Lakh reach</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">High Activity</span>
            <div className="text-xl font-black mt-1 text-blue-900">{tierBreakdown.high} ACs</div>
            <div className="text-[11px] text-blue-700 mt-0.5">1.5L - 2.2L reach</div>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Medium Activity</span>
            <div className="text-xl font-black mt-1 text-emerald-900">{tierBreakdown.medium} ACs</div>
            <div className="text-[11px] text-emerald-700 mt-0.5">85k - 1.5L reach</div>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Low Activity</span>
            <div className="text-xl font-black mt-1 text-amber-900">{tierBreakdown.low} ACs</div>
            <div className="text-[11px] text-amber-700 mt-0.5">40k - 85k reach</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Early / New Campaign</span>
            <div className="text-xl font-black mt-1 text-slate-900">{tierBreakdown.early} ACs</div>
            <div className="text-[11px] text-slate-500 mt-0.5">&lt; 40k initial cycle</div>
          </div>
        </div>
      </div>

      {/* Executive Snapshot & Recent Live Activity Section (Phase 20 & 23 Specs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Executive Operational Snapshot (Calculated Truthfully From Engine Data) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-lg border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-navy-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-saffron" />
                <span>Executive Operational Snapshot</span>
              </h3>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                100% Reconciled
              </span>
            </div>

            <div className="mt-3.5 space-y-2.5 text-xs text-slate-700">
              {executiveInsights.map((stmt, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <div className="text-slate-800 leading-relaxed font-medium">
                    {stmt}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Non-partisan operational telemetry • Calculated bottom-up</span>
            <span className="text-navy-900 font-bold">Updated: Today, 18:30 IST</span>
          </div>
        </div>

        {/* Live Campaign Activity Feed (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-lg border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-navy-900 text-sm flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-igreen animate-pulse" />
                <span>Recent Campaign Operations Feed</span>
              </h3>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                LAST SYNCED (DEMO)
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {recentActivities.map(evt => (
                <div key={evt.id} className="p-2.5 rounded border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors text-xs flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-navy-900 text-[11px]">{evt.ac}</span>
                      <span className="text-[9px] bg-white border border-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                        {evt.channel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{evt.activity}</p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-[10px] text-slate-400 block font-mono">{evt.time}</span>
                    <span className="text-[9px] font-bold text-igreen bg-green-50 px-1.5 py-0.2 rounded">
                      {evt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Synchronized across 75 district operations control centers</span>
            <button
              onClick={() => onNavigateToModule('reports')}
              className="text-saffron-700 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View Full Audit Logs</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Global Data Freshness & Source Integrity Indicators (Phase 21 Specs) */}
      <div className="bg-slate-900 text-white rounded-lg p-4 border border-slate-800 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-igreen" />
            <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Statewide Data Provenance & Freshness Matrix
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            System Node: UP-COMMAND-CENTRAL-01
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-3 text-xs">
          <div className="p-2.5 bg-slate-800/60 rounded border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Election Commission of India</span>
            <div className="font-bold text-white mt-0.5">2022 Vidhan Sabha</div>
            <div className="text-[10px] text-igreen flex items-center gap-1 mt-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-igreen" /> Official Data (Verified)
            </div>
          </div>

          <div className="p-2.5 bg-slate-800/60 rounded border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Geographic Delimitation</span>
            <div className="font-bold text-white mt-0.5">403 AC GeoJSON</div>
            <div className="text-[10px] text-igreen flex items-center gap-1 mt-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-igreen" /> ECI 2008 Boundaries
            </div>
          </div>

          <div className="p-2.5 bg-slate-800/60 rounded border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Campaign Operations</span>
            <div className="font-bold text-white mt-0.5">48 Statewide Cycles</div>
            <div className="text-[10px] text-amber-400 flex items-center gap-1 mt-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Sample Telemetry
            </div>
          </div>

          <div className="p-2.5 bg-slate-800/60 rounded border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Voice Calling Telemetry</span>
            <div className="font-bold text-white mt-0.5">AI Dialect Dialogue</div>
            <div className="text-[10px] text-blue-400 flex items-center gap-1 mt-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Last Synced: 16:24 IST
            </div>
          </div>

          <div className="p-2.5 bg-slate-800/60 rounded border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">TRAI DLT & WhatsApp</span>
            <div className="font-bold text-white mt-0.5">Cloud Messaging API</div>
            <div className="text-[10px] text-blue-400 flex items-center gap-1 mt-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Last Synced: 16:24 IST
            </div>
          </div>
        </div>
      </div>

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};
