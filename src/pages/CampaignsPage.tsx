import React, { useState, useMemo } from 'react';
import {
  Target,
  Calendar,
  Users,
  PhoneCall,
  MessageSquare,
  Mail,
  TrendingUp,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  PieChart as PieChartIcon,
  BarChart3,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { mockCampaigns } from '../data/mockData';
import { useFilters } from '../context/FilterContext';
import { KpiCard } from '../components/common/KpiCard';
import { ChartCard } from '../components/common/ChartCard';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  formatIndianNumber,
  formatPercent,
  formatCompactMetric,
  formatReadableDate
} from '../utils/formatters';
import { ExportModal } from '../components/common/ExportModal';

export const CampaignsPage: React.FC = () => {
  const { navigateToCampaign } = useFilters();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<'activity' | 'channels' | 'distribution'>('activity');

  const campaignTypes = useMemo(() => {
    return Array.from(new Set(mockCampaigns.map(c => c.type)));
  }, []);

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return mockCampaigns.filter(cmp => {
      const matchSearch =
        cmp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmp.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmp.geographicCoverage.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || cmp.status === statusFilter;
      const matchType = typeFilter === 'ALL' || cmp.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [searchTerm, statusFilter, typeFilter]);

  // Aggregate 9 Phase 11 KPIs
  const kpis = useMemo(() => {
    const total = mockCampaigns.length;
    const active = mockCampaigns.filter(c => c.status === 'Active').length;
    const completed = mockCampaigns.filter(c => c.status === 'Completed').length;
    const totalReach = mockCampaigns.reduce((acc, c) => acc + c.reach, 0);
    const totalCalls = mockCampaigns.reduce((acc, c) => acc + c.calls, 0);
    const totalWhatsapp = mockCampaigns.reduce((acc, c) => acc + c.whatsapp, 0);
    const totalSms = mockCampaigns.reduce((acc, c) => acc + c.sms, 0);
    const totalResponses = mockCampaigns.reduce((acc, c) => acc + c.responses, 0);
    const avgEngagement =
      mockCampaigns.reduce((acc, c) => acc + c.engagementRate, 0) / (total || 1);

    return {
      total,
      active,
      completed,
      totalReach,
      totalCalls,
      totalWhatsapp,
      totalSms,
      avgEngagement,
      totalResponses
    };
  }, []);

  // Timeline / Trend data
  const activityTimelineData = [
    { date: 'Aug W1', reach: 4200000, calls: 1600000, responses: 480000 },
    { date: 'Aug W2', reach: 6800000, calls: 2400000, responses: 720000 },
    { date: 'Aug W3', reach: 9800000, calls: 3500000, responses: 1100000 },
    { date: 'Aug W4', reach: 14200000, calls: 5100000, responses: 1620000 },
    { date: 'Sep W1', reach: 18500000, calls: 6800000, responses: 2200000 },
    { date: 'Sep W2', reach: 24100000, calls: 8600000, responses: 2850000 },
    { date: 'Sep W3', reach: 31200000, calls: 11200000, responses: 3600000 },
    { date: 'Sep W4', reach: 38400000, calls: 14100000, responses: 4500000 },
    { date: 'Oct W1', reach: 48200000, calls: 17200000, responses: 5400000 }
  ];

  // Channel breakdown by campaign
  const campaignChannelData = mockCampaigns.slice(0, 6).map(c => ({
    name: c.code.replace('CMP-', ''),
    reach: c.reach,
    calls: c.calls,
    whatsapp: c.whatsapp,
    sms: c.sms
  }));

  // Type distribution
  const typeDistributionData = [
    { name: 'Voter Awareness', value: 38, color: '#0B1F3A' },
    { name: 'Youth Outreach', value: 24, color: '#FF9933' },
    { name: 'Scheme Advisory', value: 20, color: '#138808' },
    { name: 'Grievance Hotline', value: 12, color: '#2563EB' },
    { name: 'Regional Corridor', value: 6, color: '#D97706' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-navy-900 tracking-tight uppercase">
              Campaign Command Center
            </h1>
            <span className="text-[11px] font-bold bg-navy-50 text-navy-900 px-2.5 py-0.5 rounded-full border border-navy-200">
              Uttar Pradesh State Operations
            </span>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
              SAMPLE ANALYTICS
            </span>
          </div>
          <p className="text-xs text-txt-secondary mt-0.5">
            Omnichannel citizen mobilization campaigns, multi-constituency outreach schedules, and real-time operational response tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExportOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-saffron" />
            <span>Export Campaign Audit</span>
          </button>
        </div>
      </div>

      {/* Top 9 Campaign KPIs (Phase 11 Specs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5">
        <KpiCard
          title="Total Campaigns"
          value={kpis.total}
          subtitle="All Registered"
          icon={Target}
          accentColor="navy"
        />
        <KpiCard
          title="Active Campaigns"
          value={kpis.active}
          subtitle="Live Operations"
          icon={Clock}
          accentColor="saffron"
        />
        <KpiCard
          title="Completed"
          value={kpis.completed}
          subtitle="Archived Cycles"
          icon={CheckCircle2}
          accentColor="green"
        />
        <KpiCard
          title="Total Reach"
          value={formatCompactMetric(kpis.totalReach)}
          subtitle="Unique Citizens"
          icon={Users}
          accentColor="navy"
        />
        <KpiCard
          title="Voice Calls"
          value={formatCompactMetric(kpis.totalCalls)}
          subtitle="Dialed Dialogues"
          icon={PhoneCall}
          accentColor="navy"
        />
        <KpiCard
          title="WhatsApp Sent"
          value={formatCompactMetric(kpis.totalWhatsapp)}
          subtitle="Direct Broadcasts"
          icon={MessageSquare}
          accentColor="green"
        />
        <KpiCard
          title="SMS Messages"
          value={formatCompactMetric(kpis.totalSms)}
          subtitle="TRAI DLT Verified"
          icon={Mail}
          accentColor="navy"
        />
        <KpiCard
          title="Engagement"
          value={formatPercent(kpis.avgEngagement)}
          subtitle="State Average"
          icon={TrendingUp}
          accentColor="saffron"
        />
        <KpiCard
          title="Responses"
          value={formatCompactMetric(kpis.totalResponses)}
          subtitle="Citizen Inbounds"
          icon={Sparkles}
          accentColor="green"
        />
      </div>

      {/* Analytics & Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Chart Area */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Campaign Activity & Outreach Velocity"
            subtitle="Cumulative citizen reach, voice calls, and inbound feedback trends"
            badge="SAMPLE ANALYTICS"
            headerAction={
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-[11px] font-semibold">
                <button
                  onClick={() => setActiveChartTab('activity')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeChartTab === 'activity' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  Activity Trend
                </button>
                <button
                  onClick={() => setActiveChartTab('channels')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeChartTab === 'channels' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  Channel Breakdown
                </button>
              </div>
            }
          >
            <div className="h-72 w-full pt-2">
              {activeChartTab === 'activity' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityTimelineData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="cmpReachGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0B1F3A" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0B1F3A" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="cmpCallGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF9933" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#FF9933" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} tickFormatter={v => formatCompactMetric(v)} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-navy-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1">
                              <p className="font-bold text-saffron border-b border-navy-700 pb-1">{label} Period</p>
                              {payload.map((entry: any, index: number) => (
                                <div key={`item-${index}`} className="flex justify-between gap-4">
                                  <span style={{ color: entry.color }}>{entry.name}:</span>
                                  <span className="font-mono font-bold">{formatIndianNumber(entry.value)}</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                    <Area type="monotone" dataKey="reach" name="Total Reach" stroke="#0B1F3A" strokeWidth={2.5} fillOpacity={1} fill="url(#cmpReachGrad)" />
                    <Area type="monotone" dataKey="calls" name="Voice Calls" stroke="#FF9933" strokeWidth={2} fillOpacity={1} fill="url(#cmpCallGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignChannelData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} tickFormatter={v => formatCompactMetric(v)} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-navy-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1">
                              <p className="font-bold text-saffron border-b border-navy-700 pb-1">Campaign {label}</p>
                              {payload.map((entry: any, index: number) => (
                                <div key={`item-${index}`} className="flex justify-between gap-4">
                                  <span style={{ color: entry.color }}>{entry.name}:</span>
                                  <span className="font-mono font-bold">{formatIndianNumber(entry.value)}</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                    <Bar dataKey="reach" name="Reach" fill="#0B1F3A" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="calls" name="Calls" fill="#FF9933" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="whatsapp" name="WhatsApp" fill="#138808" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="sms" name="SMS" fill="#2563EB" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </ChartCard>
        </div>

        {/* Campaign Type Distribution & Timeline */}
        <div className="space-y-4">
          <ChartCard
            title="Campaign Objective Taxonomy"
            subtitle="Allocation across strategic communication mandates"
            badge="SAMPLE ANALYTICS"
          >
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {typeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value}% Share`, 'Volume']}
                    contentStyle={{ backgroundColor: '#0B1F3A', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 text-[10px]">
              {typeDistributionData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Quick Stats Panel */}
          <div className="command-card p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-navy-900">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-saffron" /> Active Campaign Velocity
              </span>
              <span className="text-[10px] text-igreen font-bold bg-igreen/10 px-2 py-0.5 rounded-full">
                All Clusters Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Targeted across 403 constituencies with continuous automated calling, verified WhatsApp templates, and DLT SMS gateways.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-subtle flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search campaigns by name, code, or coverage..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-navy-900 focus:outline-none focus:border-saffron"
            />
          </div>

          <select
            aria-label="Filter by campaign status"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-navy-900 font-medium focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses (Active & Completed)</option>
            <option value="Active">Active Only</option>
            <option value="Completed">Completed Only</option>
          </select>

          <select
            aria-label="Filter by campaign type"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-navy-900 font-medium focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Campaign Types</option>
            {campaignTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Showing {filteredCampaigns.length} of {mockCampaigns.length} Campaigns
        </span>
      </div>

      {/* Comprehensive Campaign Table (Phase 11 Specs) */}
      <div className="command-card overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-navy-900">Campaign Operations Register</h3>
            <p className="text-[11px] text-slate-500">Detailed multi-channel delivery metrics and schedule status per campaign</p>
          </div>
          <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
            SAMPLE ANALYTICS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-navy-900 border-b border-slate-200 uppercase tracking-wider">
                <th className="py-3 px-4">Campaign</th>
                <th className="py-3 px-3">Coverage / ACs</th>
                <th className="py-3 px-3">Start Date</th>
                <th className="py-3 px-3">End Date</th>
                <th className="py-3 px-3 text-right">Reach</th>
                <th className="py-3 px-3 text-right">Calls</th>
                <th className="py-3 px-3 text-right">WhatsApp</th>
                <th className="py-3 px-3 text-right">SMS</th>
                <th className="py-3 px-3 text-right">Engagement</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCampaigns.map(cmp => (
                <tr
                  key={cmp.id}
                  onClick={() => navigateToCampaign(cmp.id)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="font-bold text-navy-900 group-hover:text-saffron-700 transition-colors">
                      {cmp.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {cmp.code} • {cmp.type}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-block bg-slate-100 text-navy-900 text-[11px] font-medium px-2 py-0.5 rounded">
                      {cmp.geographicCoverage}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                    {formatReadableDate(cmp.startDate)}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                    {formatReadableDate(cmp.endDate)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-navy-900">
                    {formatCompactMetric(cmp.reach)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600">
                    {formatCompactMetric(cmp.calls)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600">
                    {formatCompactMetric(cmp.whatsapp)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600">
                    {formatCompactMetric(cmp.sms)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="font-mono font-bold text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded">
                      {formatPercent(cmp.engagementRate)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <StatusBadge status={cmp.status} />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToCampaign(cmp.id);
                      }}
                      className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-navy-900 transition-colors"
                      title="View Campaign Dossier"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};
