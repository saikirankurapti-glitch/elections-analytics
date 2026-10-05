import React, { useState, useMemo } from 'react';
import {
  Users,
  PhoneCall,
  MessageSquare,
  Mail,
  Share2,
  TrendingUp,
  Target,
  ArrowUpRight,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  CheckCircle2,
  Sparkles,
  Download,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { KpiCard } from '../components/common/KpiCard';
import { ChartCard } from '../components/common/ChartCard';
import { FilterBar } from '../components/common/FilterBar';
import { StateMap } from '../components/common/StateMap';
import { StatusBadge } from '../components/common/StatusBadge';
import { ExportModal } from '../components/common/ExportModal';
import { useFilters } from '../context/FilterContext';
import {
  mockStateKpis,
  mockActivityTrends,
  mockConstituencies,
  mockCampaigns
} from '../data/mockData';
import {
  formatIndianNumber,
  formatPercent,
  formatCompactMetric
} from '../utils/formatters';
import { ConstituencyEntity } from '../types';

export const StateDashboard: React.FC = () => {
  const {
    navigateToConstituency,
    navigateToCampaign,
    setActiveTab,
    globalSearch
  } = useFilters();

  const [activeTrendMetric, setActiveTrendMetric] = useState<
    'reach' | 'calls' | 'whatsapp' | 'sms' | 'engagement' | 'responses'
  >('reach');

  const [tableSearch, setTableSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [sortField, setSortField] = useState<keyof ConstituencyEntity>('totalReach');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Filtered & Sorted Constituencies Table
  const filteredConstituencies = useMemo(() => {
    let list = [...mockConstituencies];
    const searchTerm = (tableSearch || globalSearch).toLowerCase().trim();

    if (searchTerm) {
      list = list.filter(
        c =>
          c.name.toLowerCase().includes(searchTerm) ||
          c.code.toLowerCase().includes(searchTerm) ||
          c.district.toLowerCase().includes(searchTerm)
      );
    }

    if (selectedRegion !== 'ALL') {
      list = list.filter(c => c.region === selectedRegion);
    }

    list.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return list;
  }, [tableSearch, globalSearch, selectedRegion, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredConstituencies.length / pageSize);
  const paginatedConstituencies = filteredConstituencies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: keyof ConstituencyEntity) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Regions list for filter
  const regions = useMemo(() => {
    return Array.from(new Set(mockConstituencies.map(c => c.region)));
  }, []);

  // Format metric config for trend chart
  const getTrendConfig = () => {
    switch (activeTrendMetric) {
      case 'reach':
        return { dataKey: 'reach', name: 'People Reached', color: '#0B1F3A', stroke: '#0B1F3A', fill: '#0B1F3A' };
      case 'calls':
        return { dataKey: 'calls', name: 'Phone Calls', color: '#138808', stroke: '#138808', fill: '#138808' };
      case 'whatsapp':
        return { dataKey: 'whatsapp', name: 'WhatsApp Messages', color: '#2A5899', stroke: '#2A5899', fill: '#2A5899' };
      case 'sms':
        return { dataKey: 'sms', name: 'SMS Sent', color: '#FF9933', stroke: '#FF9933', fill: '#FF9933' };
      case 'engagement':
        return { dataKey: 'engagement', name: 'Engagement Rate (%)', color: '#E67E17', stroke: '#E67E17', fill: '#E67E17' };
      case 'responses':
        return { dataKey: 'responses', name: 'Direct Responses', color: '#1D4175', stroke: '#1D4175', fill: '#1D4175' };
    }
  };

  const trendConfig = getTrendConfig();

  return (
    <div className="space-y-6">
      {/* State Dashboard Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
              State Campaign Intelligence
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-igreen/10 text-igreen px-2.5 py-0.5 rounded-full border border-igreen/20">
              <span className="w-1.5 h-1.5 rounded-full bg-igreen animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-txt-secondary mt-1">
            Unified overview of campaign outreach, engagement and communication activity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('geographic')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-navy-900 rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-navy-700" />
            <span>Geographic View</span>
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

      {/* Global Filter Bar */}
      <FilterBar onExportClick={() => setIsExportOpen(true)} />

      {/* State KPI Grid (12 KPI Cards) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900">
            Statewide Operational Telemetry (403 Assembly Constituencies)
          </h3>
          <span className="text-xs text-txt-secondary">
            Aggregate Updated: <span className="font-semibold text-navy-900">Today, 15:30 IST</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
          <KpiCard
            title="Total Constituencies"
            value="403"
            subtitle="75 Districts Monitored"
            icon={MapPin}
            accentColor="navy"
            onClick={() => setActiveTab('constituencies')}
          />
          <KpiCard
            title="Active Campaigns"
            value={mockStateKpis.activeCampaigns}
            subtitle={`${mockStateKpis.completedCampaigns} Completed Cycles`}
            icon={Target}
            accentColor="saffron"
            trend={{ value: '+2 New', isPositive: true }}
            onClick={() => setActiveTab('campaigns')}
          />
          <KpiCard
            title="People Reached"
            value={formatCompactMetric(mockStateKpis.peopleReached)}
            subtitle={`${formatIndianNumber(mockStateKpis.peopleReached)} Direct`}
            icon={Users}
            accentColor="navy"
            trend={{ value: '+14.2%', isPositive: true }}
          />
          <KpiCard
            title="Total Calls"
            value={formatCompactMetric(mockStateKpis.totalCalls)}
            subtitle={`${formatIndianNumber(mockStateKpis.totalCalls)} Calls`}
            icon={PhoneCall}
            accentColor="navy"
            onClick={() => setActiveTab('calling-agent')}
          />
          <KpiCard
            title="Connected Calls"
            value={formatCompactMetric(mockStateKpis.connectedCalls)}
            subtitle="72.0% Connection Rate"
            icon={CheckCircle2}
            accentColor="green"
            trend={{ value: '+4.8%', isPositive: true }}
            onClick={() => setActiveTab('calling-agent')}
          />
          <KpiCard
            title="WhatsApp Messages"
            value={formatCompactMetric(mockStateKpis.whatsappMessages)}
            subtitle="96% Delivery Rate"
            icon={MessageSquare}
            accentColor="green"
            onClick={() => setActiveTab('whatsapp')}
          />
          <KpiCard
            title="SMS Sent"
            value={formatCompactMetric(mockStateKpis.smsMessages)}
            subtitle="95% DLT Delivered"
            icon={Mail}
            accentColor="navy"
            onClick={() => setActiveTab('sms')}
          />
          <KpiCard
            title="Social Reach"
            value={formatCompactMetric(mockStateKpis.socialReach)}
            subtitle="11.2M Impressions"
            icon={Share2}
            accentColor="navy"
            onClick={() => setActiveTab('social')}
          />
          <KpiCard
            title="Engagement Rate"
            value={formatPercent(mockStateKpis.engagementRate)}
            subtitle="Cross-channel benchmark"
            icon={TrendingUp}
            accentColor="saffron"
            trend={{ value: '+2.1%', isPositive: true }}
          />
          <KpiCard
            title="Responses"
            value={formatCompactMetric(mockStateKpis.responses)}
            subtitle={`${formatIndianNumber(mockStateKpis.responses)} Citizens`}
            icon={Users}
            accentColor="green"
            trend={{ value: '+8.6%', isPositive: true }}
          />
          <KpiCard
            title="Follow-ups"
            value={formatCompactMetric(mockStateKpis.followUps)}
            subtitle="Scheduled Outreaches"
            icon={Calendar}
            accentColor="saffron"
            onClick={() => setActiveTab('calling-agent')}
          />
          <KpiCard
            title="Escalations Resolved"
            value={formatIndianNumber(mockStateKpis.escalationsResolved)}
            subtitle="98.1% Citizen Redressal"
            icon={Sparkles}
            accentColor="green"
            onClick={() => setActiveTab('ai-insights')}
          />
        </div>
      </div>

      {/* Main Charts & Geo Intelligence Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large Analytics Chart: State Campaign Activity Trend (7 Cols) */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Campaign Activity Trend"
            subtitle="Multi-channel reach, calling sessions, messages and engagement velocity"
            action={
              <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-0.5 rounded-md text-xs">
                {(['reach', 'calls', 'whatsapp', 'sms', 'engagement', 'responses'] as const).map(
                  m => (
                    <button
                      key={m}
                      onClick={() => setActiveTrendMetric(m)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-all capitalize ${
                        activeTrendMetric === m
                          ? 'bg-navy-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-navy-900'
                      }`}
                    >
                      {m}
                    </button>
                  )
                )}
              </div>
            }
            footer={
              <>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-xs text-navy-900 font-semibold">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: trendConfig.color }}
                    />
                    {trendConfig.name}
                  </span>
                  <span className="text-xs text-txt-secondary">
                    Peak Recorded: <strong className="text-navy-900">05 Oct (5.28L Reach)</strong>
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className="text-xs font-semibold text-navy-800 hover:text-saffron-700 inline-flex items-center gap-1"
                >
                  View All Campaigns <ArrowRight className="w-3 h-3" />
                </button>
              </>
            }
          >
            <ResponsiveContainer width="100%" height={290}>
              <AreaChart data={mockActivityTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={trendConfig.color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={trendConfig.color} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#CBD5E1' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={val =>
                    activeTrendMetric === 'engagement' ? `${val}%` : formatCompactMetric(val)
                  }
                />
                <Tooltip
                  formatter={(val: any) => [
                    activeTrendMetric === 'engagement'
                      ? `${val}%`
                      : formatIndianNumber(val),
                    trendConfig.name
                  ]}
                  contentStyle={{
                    backgroundColor: '#0B1F3A',
                    borderColor: '#1D4175',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={trendConfig.dataKey}
                  stroke={trendConfig.stroke}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#trendGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* State Map: Geographic Intelligence (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-white rounded-lg border border-slate-200 shadow-subtle p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-navy-900 leading-snug">
                  Geographic Intelligence
                </h3>
                <p className="text-xs text-txt-secondary mt-0.5">
                  Statewide constituency mapping & operational density
                </p>
              </div>
              <button
                onClick={() => setActiveTab('geographic')}
                className="text-xs font-semibold text-saffron-700 hover:underline inline-flex items-center gap-1"
              >
                Expand Map <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 my-2">
              <StateMap />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-txt-secondary">
              <span>Interactive drilldown enabled</span>
              <span className="font-semibold text-navy-900">Click any constituency to explore</span>
            </div>
          </div>
        </div>
      </div>

      {/* Constituency Performance Table Section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-subtle overflow-hidden">
        {/* Table Header & Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-navy-900">Constituency Performance</h3>
              <span className="text-xs bg-navy-50 text-navy-900 font-semibold px-2 py-0.5 rounded-full border border-navy-200">
                {filteredConstituencies.length} Constituencies Listed
              </span>
            </div>
            <p className="text-xs text-txt-secondary mt-0.5">
              Click any constituency row to drill down into mandals, booths, and channel telemetry
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search constituency or district..."
                value={tableSearch}
                onChange={e => {
                  setTableSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-navy-900 w-56"
              />
            </div>

            {/* Region Filter */}
            <select
              aria-label="Filter by Region"
              value={selectedRegion}
              onChange={e => {
                setSelectedRegion(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-navy-900 font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Regions</option>
              {regions.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {/* Export CSV for table */}
            <button
              onClick={() => setIsExportOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-navy-900 rounded-md text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-txt-secondary select-none">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:text-navy-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Constituency</span>
                    {sortField === 'name' &&
                      (sortAsc ? (
                        <ChevronUp className="w-3 h-3 text-saffron" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-saffron" />
                      ))}
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Active Campaigns</th>
                <th
                  onClick={() => handleSort('totalReach')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-navy-900"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Reach</span>
                    {sortField === 'totalReach' &&
                      (sortAsc ? (
                        <ChevronUp className="w-3 h-3 text-saffron" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-saffron" />
                      ))}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('totalCalls')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-navy-900"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Calls</span>
                    {sortField === 'totalCalls' &&
                      (sortAsc ? (
                        <ChevronUp className="w-3 h-3 text-saffron" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-saffron" />
                      ))}
                  </div>
                </th>
                <th className="py-3 px-3 text-right">WhatsApp</th>
                <th className="py-3 px-3 text-right">SMS</th>
                <th
                  onClick={() => handleSort('engagementRate')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-navy-900"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Engagement</span>
                    {sortField === 'engagementRate' &&
                      (sortAsc ? (
                        <ChevronUp className="w-3 h-3 text-saffron" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-saffron" />
                      ))}
                  </div>
                </th>
                <th className="py-3 px-3 text-right">Responses</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedConstituencies.map(c => (
                <tr
                  key={c.id}
                  onClick={() => navigateToConstituency(c.id)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="font-semibold text-navy-900 group-hover:text-saffron-700 transition-colors">
                      {c.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {c.code} • {c.district} ({c.region})
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 font-bold text-navy-900 text-xs">
                      {c.activeCampaigns}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-navy-900 tabular-nums">
                    {formatIndianNumber(c.totalReach)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700 tabular-nums">
                    <div>{formatIndianNumber(c.totalCalls)}</div>
                    <div className="text-[10px] text-igreen font-medium">
                      {formatIndianNumber(c.connectedCalls)} Conn.
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700 tabular-nums">
                    {formatIndianNumber(c.whatsappMessages)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700 tabular-nums">
                    {formatIndianNumber(c.smsMessages)}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-igreen tabular-nums">
                    {formatPercent(c.engagementRate)}
                  </td>
                  <td className="py-3 px-3 text-right text-navy-900 font-medium tabular-nums">
                    {formatIndianNumber(c.responses)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={c.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        navigateToConstituency(c.id);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold text-navy-900 bg-slate-100 hover:bg-navy-900 hover:text-white rounded transition-colors"
                    >
                      Drilldown →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-txt-secondary">
          <div>
            Showing{' '}
            <strong className="text-navy-900">
              {Math.min(
                (currentPage - 1) * pageSize + 1,
                filteredConstituencies.length
              )}
            </strong>{' '}
            to{' '}
            <strong className="text-navy-900">
              {Math.min(currentPage * pageSize, filteredConstituencies.length)}
            </strong>{' '}
            of <strong className="text-navy-900">{filteredConstituencies.length}</strong>{' '}
            constituencies
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-navy-900 disabled:opacity-40 hover:bg-slate-100 transition-colors"
            >
              Previous
            </button>
            <span className="px-2 text-xs font-medium text-slate-700">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-navy-900 disabled:opacity-40 hover:bg-slate-100 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Active Campaigns Spotlight Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockCampaigns.slice(0, 3).map(cmp => (
          <div
            key={cmp.id}
            onClick={() => navigateToCampaign(cmp.id)}
            className="command-card p-4 cursor-pointer hover:border-saffron transition-all"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {cmp.type}
              </span>
              <StatusBadge status={cmp.status} size="sm" />
            </div>
            <h4 className="text-sm font-bold text-navy-900 mt-1 line-clamp-1 hover:text-saffron-700">
              {cmp.name}
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{cmp.objective}</p>

            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-2 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Reach</span>
                <span className="font-semibold text-navy-900 tabular-nums">
                  {formatCompactMetric(cmp.reach)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Phone Calls</span>
                <span className="font-semibold text-navy-900 tabular-nums">
                  {formatCompactMetric(cmp.calls)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Engagement</span>
                <span className="font-semibold text-igreen tabular-nums">
                  {formatPercent(cmp.engagementRate)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Export Modal */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};
