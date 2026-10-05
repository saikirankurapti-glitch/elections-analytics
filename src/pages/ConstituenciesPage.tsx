import React, { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  Search,
  Filter,
  Download,
  Users,
  PhoneCall,
  MessageSquare,
  Mail,
  Share2,
  TrendingUp,
  Target,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Globe
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import { useFilters } from '../context/FilterContext';
import { KpiCard } from '../components/common/KpiCard';
import { ChartCard } from '../components/common/ChartCard';
import { UpConstituencyTable } from '../components/common/UpConstituencyTable';
import { ExportModal } from '../components/common/ExportModal';
import { constituencyDataProvider, campaignDataProvider } from '../services/providers';
import { UpAssemblyConstituency } from '../services/providers/types';
import { formatIndianNumber, formatPercent, formatCompactMetric } from '../utils/formatters';
import { demoDataEngine } from '../services/demoDataEngine';

export const ConstituenciesPage: React.FC = () => {
  const { navigateToConstituency, setSelectedConstituencyId } = useFilters();
  const [constituencies, setConstituencies] = useState<UpAssemblyConstituency[]>([]);
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeChartMetric, setActiveChartMetric] = useState<'activity' | 'calls' | 'messages' | 'engagement'>('activity');

  const sparklines = useMemo(() => demoDataEngine.getSparklines(), []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const list = await constituencyDataProvider.getAllConstituencies();
      if (isMounted) setConstituencies(list);
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const districtsList = useMemo(() => {
    return Array.from(new Set(constituencies.map(c => c.district))).sort();
  }, [constituencies]);

  // Aggregated totals across all 403 constituencies
  const kpis = useMemo(() => {
    const totalAcs = constituencies.length || 403;
    const totalReach = constituencies.reduce((acc, c) => acc + c.campaignOperations.reach, 0);
    const totalCalls = constituencies.reduce((acc, c) => acc + c.campaignOperations.totalCalls, 0);
    const totalConnected = constituencies.reduce((acc, c) => acc + c.campaignOperations.connectedCalls, 0);
    const totalWhatsapp = constituencies.reduce((acc, c) => acc + c.campaignOperations.whatsappMessages, 0);
    const totalSms = constituencies.reduce((acc, c) => acc + c.campaignOperations.smsMessages, 0);
    const totalResponses = constituencies.reduce((acc, c) => acc + c.campaignOperations.responses, 0);
    const totalFollowUps = constituencies.reduce((acc, c) => acc + c.campaignOperations.followUps, 0);
    const connectionRate = totalCalls > 0 ? (totalConnected / totalCalls) * 100 : 71.1;
    const avgEngagement = constituencies.length > 0
      ? constituencies.reduce((acc, c) => acc + c.campaignOperations.engagementRate * c.campaignOperations.reach, 0) / (totalReach || 1)
      : 41.0;

    return {
      totalAcs,
      activeCampaigns: 48,
      totalReach,
      totalCalls,
      connectionRate,
      totalWhatsapp,
      totalSms,
      socialReach: Math.round(totalReach * 1.208),
      avgEngagement,
      totalResponses,
      totalFollowUps
    };
  }, [constituencies]);

  // Chart data: Top 8 constituencies by active metric
  const topConstituenciesChartData = useMemo(() => {
    return [...constituencies]
      .sort((a, b) => {
        if (activeChartMetric === 'calls') {
          return b.campaignOperations.totalCalls - a.campaignOperations.totalCalls;
        }
        if (activeChartMetric === 'messages') {
          return b.campaignOperations.whatsappMessages - a.campaignOperations.whatsappMessages;
        }
        if (activeChartMetric === 'engagement') {
          return b.campaignOperations.engagementRate - a.campaignOperations.engagementRate;
        }
        return b.campaignOperations.reach - a.campaignOperations.reach;
      })
      .slice(0, 8)
      .map(c => ({
        name: `${c.constituencyNumber} - ${c.name}`,
        reach: c.campaignOperations.reach,
        calls: c.campaignOperations.totalCalls,
        messages: c.campaignOperations.whatsappMessages,
        engagement: c.campaignOperations.engagementRate
      }));
  }, [constituencies, activeChartMetric]);

  const handleSelectConstituency = (ac: UpAssemblyConstituency) => {
    setSelectedConstituencyId(String(ac.constituencyNumber));
    navigateToConstituency(String(ac.constituencyNumber));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-navy-900 tracking-tight uppercase">
              Constituency Intelligence
            </h1>
            <span className="text-[11px] font-bold bg-navy-50 text-navy-900 px-2.5 py-0.5 rounded-full border border-navy-200">
              403 Assembly Constituencies Active
            </span>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
              SAMPLE ANALYTICS
            </span>
          </div>
          <p className="text-xs text-txt-secondary mt-0.5">
            Real Uttar Pradesh assembly boundary telemetry, official ECI 2022 statistics, and multi-channel campaign saturation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExportOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 text-white rounded-md text-xs font-semibold hover:bg-navy-800 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-saffron" />
            <span>Export Constituency Register</span>
          </button>
        </div>
      </div>

      {/* 10 KPIs with 3D Depth Numbers & Sparklines */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5">
        <KpiCard
          title="Campaigns"
          value={kpis.activeCampaigns}
          subtitle="Active Cycles"
          icon={Target}
          accentColor="saffron"
          sparkline={sparklines.campaigns}
        />
        <KpiCard
          title="Total Reach"
          value={formatCompactMetric(kpis.totalReach)}
          subtitle="All 403 ACs"
          icon={Users}
          accentColor="blue"
          sparkline={sparklines.reach}
          trend={{ value: '+14.8%', isPositive: true }}
        />
        <KpiCard
          title="Phone Calls"
          value={formatCompactMetric(kpis.totalCalls)}
          subtitle="AI Voice Outreach"
          icon={PhoneCall}
          accentColor="green"
          sparkline={sparklines.calls}
        />
        <KpiCard
          title="Connect Rate"
          value={formatPercent(kpis.connectionRate)}
          subtitle="Voice Delivery"
          icon={PhoneCall}
          accentColor="emerald"
          sparkline={sparklines.connectedRate}
        />
        <KpiCard
          title="WhatsApp"
          value={formatCompactMetric(kpis.totalWhatsapp)}
          subtitle="Delivered API"
          icon={MessageSquare}
          accentColor="teal"
          sparkline={sparklines.whatsapp}
        />
        <KpiCard
          title="SMS Dispatched"
          value={formatCompactMetric(kpis.totalSms)}
          subtitle="TRAI DLT Verified"
          icon={Mail}
          accentColor="purple"
          sparkline={sparklines.sms}
        />
        <KpiCard
          title="Social Reach"
          value={formatCompactMetric(kpis.socialReach)}
          subtitle="Multi-Platform"
          icon={Share2}
          accentColor="indigo"
          sparkline={sparklines.social}
        />
        <KpiCard
          title="Engagement"
          value={formatPercent(kpis.avgEngagement)}
          subtitle="Weighted Index"
          icon={TrendingUp}
          accentColor="amber"
          sparkline={sparklines.engagement}
          trend={{ value: '+2.4%', isPositive: true }}
        />
        <KpiCard
          title="Responses"
          value={formatCompactMetric(kpis.totalResponses)}
          subtitle="Citizen Inquiries"
          icon={CheckCircle2}
          accentColor="cyan"
          sparkline={sparklines.responses}
        />
        <KpiCard
          title="Follow-ups"
          value={formatCompactMetric(kpis.totalFollowUps)}
          subtitle="Grievance Pipeline"
          icon={Sparkles}
          accentColor="coral"
          sparkline={sparklines.followUps}
        />
      </div>

      {/* Chart Section: Top Constituencies Benchmark */}
      <ChartCard
        title="Top Assembly Constituencies by Operational Volume"
        subtitle="Comparative density across outreach channels for leading Uttar Pradesh constituencies"
        action={
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-xs">
            <button
              onClick={() => setActiveChartMetric('activity')}
              className={`px-2 py-0.5 rounded ${activeChartMetric === 'activity' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
            >
              Reach
            </button>
            <button
              onClick={() => setActiveChartMetric('calls')}
              className={`px-2 py-0.5 rounded ${activeChartMetric === 'calls' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
            >
              Calls
            </button>
            <button
              onClick={() => setActiveChartMetric('messages')}
              className={`px-2 py-0.5 rounded ${activeChartMetric === 'messages' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
            >
              WhatsApp
            </button>
            <button
              onClick={() => setActiveChartMetric('engagement')}
              className={`px-2 py-0.5 rounded ${activeChartMetric === 'engagement' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
            >
              Engagement %
            </button>
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={topConstituenciesChartData} margin={{ top: 15, right: 10, left: 10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} angle={-20} textAnchor="end" />
            <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={val => activeChartMetric === 'engagement' ? `${val}%` : formatCompactMetric(val)} />
            <Tooltip
              formatter={(val: any) => [activeChartMetric === 'engagement' ? `${val}%` : formatIndianNumber(val), activeChartMetric.toUpperCase()]}
              contentStyle={{ backgroundColor: '#0B1F3A', borderColor: '#1D4175', color: '#fff', fontSize: '12px' }}
            />
            <Bar
              dataKey={activeChartMetric === 'engagement' ? 'engagement' : activeChartMetric === 'calls' ? 'calls' : activeChartMetric === 'messages' ? 'messages' : 'reach'}
              fill={
                activeChartMetric === 'calls'
                  ? '#16A34A'
                  : activeChartMetric === 'messages'
                  ? '#0D9488'
                  : activeChartMetric === 'engagement'
                  ? '#D97706'
                  : '#2563EB'
              }
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 403-Constituency Data Table Component */}
      <UpConstituencyTable
        constituencies={constituencies}
        onSelectConstituency={handleSelectConstituency}
        districtFilter={districtFilter}
        onDistrictFilterChange={setDistrictFilter}
        districtsList={districtsList}
        onExportCsv={() => setIsExportOpen(true)}
      />

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};
