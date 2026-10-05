import React, { useState, useMemo } from 'react';
import {
  Building,
  MapPin,
  Target,
  Users,
  PhoneCall,
  MessageSquare,
  Mail,
  TrendingUp,
  Search,
  Download,
  Filter,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { KpiCard } from '../components/common/KpiCard';
import { ChartCard } from '../components/common/ChartCard';
import { ExportModal } from '../components/common/ExportModal';
import { useFilters } from '../context/FilterContext';
import { formatIndianNumber, formatPercent, formatCompactMetric } from '../utils/formatters';
import rawUpDistrictsData from '../data/upDistrictsData.json';
import { demoDataEngine } from '../services/demoDataEngine';

interface DistrictItem {
  id: string;
  district: string;
  region: string;
  constituencyCount: number;
  totalElectors: number;
  totalReach: number;
  totalCalls: number;
  connectedCalls: number;
  whatsappMessages: number;
  smsMessages: number;
  totalResponses: number;
  totalFollowUps: number;
  activeCampaigns: number;
  constituencyIds: string[];
  averageEngagementRate: number;
}

export const DistrictDashboardPage: React.FC = () => {
  const { setActiveTab, updateFilter } = useFilters();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [sortField, setSortField] = useState<keyof DistrictItem>('totalReach');
  const [sortAsc, setSortAsc] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeChartMetric, setActiveChartMetric] = useState<'reach' | 'calls' | 'whatsapp' | 'sms' | 'engagement'>('reach');

  const sparklines = useMemo(() => demoDataEngine.getSparklines(), []);
  const districts = rawUpDistrictsData as unknown as DistrictItem[];

  // Regions list
  const regions = useMemo(() => {
    return Array.from(new Set(districts.map(d => d.region))).sort();
  }, [districts]);

  // Aggregate totals
  const totals = useMemo(() => {
    const totalDistricts = districts.length;
    const totalAcs = districts.reduce((acc, d) => acc + d.constituencyCount, 0);
    const totalElectors = districts.reduce((acc, d) => acc + d.totalElectors, 0);
    const totalReach = districts.reduce((acc, d) => acc + d.totalReach, 0);
    const totalCalls = districts.reduce((acc, d) => acc + d.totalCalls, 0);
    const totalConnected = districts.reduce((acc, d) => acc + d.connectedCalls, 0);
    const totalWhatsapp = districts.reduce((acc, d) => acc + d.whatsappMessages, 0);
    const totalSms = districts.reduce((acc, d) => acc + d.smsMessages, 0);
    const avgEngagement = Number(
      (districts.reduce((acc, d) => acc + d.averageEngagementRate * d.totalReach, 0) / (totalReach || 1)).toFixed(1)
    );

    return {
      totalDistricts,
      totalAcs,
      totalElectors,
      totalReach,
      totalCalls,
      totalConnected,
      totalWhatsapp,
      totalSms,
      avgEngagement
    };
  }, [districts]);

  // Filter & sort districts
  const filteredDistricts = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return districts
      .filter(d => {
        const matchesSearch =
          q === '' ||
          d.district.toLowerCase().includes(q) ||
          d.region.toLowerCase().includes(q);
        const matchesRegion = selectedRegion === 'ALL' || d.region === selectedRegion;
        return matchesSearch && matchesRegion;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
  }, [districts, searchTerm, selectedRegion, sortField, sortAsc]);

  // Top 8 districts by active metric (Rankings shift dynamically!)
  const topDistrictsChart = useMemo(() => {
    return demoDataEngine.getTopDistricts(activeChartMetric, 8).map(d => ({
      name: d.district,
      reach: d.totalReach,
      calls: d.totalCalls,
      whatsapp: d.whatsappMessages,
      sms: d.smsMessages,
      engagement: d.averageEngagementRate
    }));
  }, [activeChartMetric]);

  // Regional breakdown
  const regionalBreakdown = useMemo(() => {
    const map: Record<string, { region: string; districts: number; acs: number; reach: number }> = {};
    districts.forEach(d => {
      if (!map[d.region]) {
        map[d.region] = { region: d.region, districts: 0, acs: 0, reach: 0 };
      }
      map[d.region].districts += 1;
      map[d.region].acs += d.constituencyCount;
      map[d.region].reach += d.totalReach;
    });
    return Object.values(map).sort((a, b) => b.reach - a.reach);
  }, [districts]);

  const handleFilterToDistrict = (districtName: string) => {
    // Navigate to State Dashboard with district filter applied
    setActiveTab('dashboard');
  };

  const handleSort = (field: keyof DistrictItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-navy-900 tracking-tight uppercase">
              District Intelligence
            </h1>
            <span className="text-[11px] font-bold bg-navy-50 text-navy-900 px-2.5 py-0.5 rounded-full border border-navy-200">
              75 Districts Active
            </span>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
              SAMPLE ANALYTICS
            </span>
          </div>
          <p className="text-xs text-txt-secondary mt-0.5">
            Operational campaign telemetry, multi-channel saturation, and electoral metrics across all 75 Uttar Pradesh administrative districts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExportOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 text-white rounded-md text-xs font-semibold hover:bg-navy-800 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-saffron" />
            <span>Export District Dossier</span>
          </button>
        </div>
      </div>

      {/* Top 8 District KPIs with 3D Depth Numbers & Sparklines */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3">
        <KpiCard
          title="Districts"
          value="75"
          subtitle="All Monitored"
          icon={Building}
          accentColor="navy"
        />
        <KpiCard
          title="Constituencies"
          value="403"
          subtitle="ECI 2008 Delimited"
          icon={MapPin}
          accentColor="navy"
        />
        <KpiCard
          title="Active Campaigns"
          value="48"
          subtitle="Cross-District"
          icon={Target}
          accentColor="saffron"
          sparkline={sparklines.campaigns}
        />
        <KpiCard
          title="People Reached"
          value={formatCompactMetric(totals.totalReach)}
          subtitle="All 75 Districts"
          icon={Users}
          accentColor="blue"
          sparkline={sparklines.reach}
          trend={{ value: '+14.8%', isPositive: true }}
        />
        <KpiCard
          title="Phone Calls"
          value={formatCompactMetric(totals.totalCalls)}
          subtitle={`${formatPercent(71.1)} Connected`}
          icon={PhoneCall}
          accentColor="green"
          sparkline={sparklines.calls}
        />
        <KpiCard
          title="WhatsApp"
          value={formatCompactMetric(totals.totalWhatsapp)}
          subtitle="Broadcast & groups"
          icon={MessageSquare}
          accentColor="teal"
          sparkline={sparklines.whatsapp}
        />
        <KpiCard
          title="SMS Dispatched"
          value={formatCompactMetric(totals.totalSms)}
          subtitle="TRAI DLT Verified"
          icon={Mail}
          accentColor="purple"
          sparkline={sparklines.sms}
        />
        <KpiCard
          title="Avg Engagement"
          value={formatPercent(totals.avgEngagement)}
          subtitle="Weighted Mean"
          icon={TrendingUp}
          accentColor="amber"
          sparkline={sparklines.engagement}
          trend={{ value: '+2.4%', isPositive: true }}
        />
      </div>

      {/* Regional Comparison and Top District Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Districts by Selected Metric Bar Chart (8 Cols) */}
        <div className="lg:col-span-8">
          <ChartCard
            title="Top Uttar Pradesh Districts by Campaign Activity"
            subtitle="Comparing citizen reach, voice, and messaging saturation across leading administrative districts"
            action={
              <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-0.5 rounded text-xs">
                <button
                  onClick={() => setActiveChartMetric('reach')}
                  className={`px-2 py-0.5 rounded font-medium ${activeChartMetric === 'reach' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
                >
                  Reach
                </button>
                <button
                  onClick={() => setActiveChartMetric('calls')}
                  className={`px-2 py-0.5 rounded font-medium ${activeChartMetric === 'calls' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
                >
                  Calls
                </button>
                <button
                  onClick={() => setActiveChartMetric('whatsapp')}
                  className={`px-2 py-0.5 rounded font-medium ${activeChartMetric === 'whatsapp' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => setActiveChartMetric('sms')}
                  className={`px-2 py-0.5 rounded font-medium ${activeChartMetric === 'sms' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
                >
                  SMS
                </button>
                <button
                  onClick={() => setActiveChartMetric('engagement')}
                  className={`px-2 py-0.5 rounded font-medium ${activeChartMetric === 'engagement' ? 'bg-navy-900 text-white font-bold' : 'text-slate-600'}`}
                >
                  Engagement %
                </button>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topDistrictsChart} margin={{ top: 15, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} angle={-20} textAnchor="end" />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={val => activeChartMetric === 'engagement' ? `${val}%` : formatCompactMetric(val)}
                />
                <Tooltip
                  formatter={(val: any) => [
                    activeChartMetric === 'engagement' ? `${val}%` : formatIndianNumber(val),
                    activeChartMetric.toUpperCase()
                  ]}
                  contentStyle={{ backgroundColor: '#0B1F3A', borderColor: '#1D4175', color: '#fff', fontSize: '12px' }}
                />
                <Bar
                  dataKey={activeChartMetric}
                  fill={
                    activeChartMetric === 'calls'
                      ? '#16A34A'
                      : activeChartMetric === 'whatsapp'
                      ? '#0D9488'
                      : activeChartMetric === 'sms'
                      ? '#7C3AED'
                      : activeChartMetric === 'engagement'
                      ? '#D97706'
                      : '#0B1F3A'
                  }
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Regional Breakdown Cards (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-lg border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-navy-900 text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-saffron" />
                <span>Regional Cluster Summary</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">6 Regional Clusters</span>
            </div>

            <div className="mt-3 space-y-2.5">
              {regionalBreakdown.map((r, i) => (
                <div
                  key={r.region}
                  onClick={() => setSelectedRegion(selectedRegion === r.region ? 'ALL' : r.region)}
                  className={`p-2.5 rounded border transition-all cursor-pointer ${
                    selectedRegion === r.region
                      ? 'bg-navy-900 text-white border-saffron shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{r.region}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      selectedRegion === r.region ? 'bg-navy-800 text-saffron' : 'bg-white text-slate-600 border border-slate-200'
                    }`}>
                      {r.districts} Districts • {r.acs} ACs
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] mt-1 text-slate-400">
                    <span>Citizen Reach:</span>
                    <strong className={selectedRegion === r.region ? 'text-white' : 'text-navy-900'}>
                      {formatIndianNumber(r.reach)}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedRegion !== 'ALL' && (
            <button
              onClick={() => setSelectedRegion('ALL')}
              className="mt-3 text-xs text-saffron-700 font-semibold hover:underline flex items-center justify-center gap-1 py-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Regional Filter
            </button>
          )}
        </div>
      </div>

      {/* 75-District Comprehensive Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-subtle overflow-hidden">
        {/* Table Filter & Search Controls */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-navy-900 text-sm">
              All 75 Uttar Pradesh Districts
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              ({filteredDistricts.length} displayed)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search district or region..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 bg-white border border-slate-200 rounded text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-saffron w-48 sm:w-60"
              />
            </div>

            {/* Region Select */}
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-navy-900 focus:outline-none focus:ring-1 focus:ring-saffron cursor-pointer"
            >
              <option value="ALL">All Regions (6)</option>
              {regions.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[10px] font-bold">
                <th
                  onClick={() => handleSort('district')}
                  className="py-3 px-3.5 cursor-pointer hover:text-navy-900 select-none"
                >
                  District
                </th>
                <th
                  onClick={() => handleSort('region')}
                  className="py-3 px-3 cursor-pointer hover:text-navy-900 select-none"
                >
                  Region
                </th>
                <th
                  onClick={() => handleSort('constituencyCount')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-navy-900 select-none"
                >
                  Constituencies
                </th>
                <th
                  onClick={() => handleSort('totalElectors')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-navy-900 select-none hidden lg:table-cell"
                >
                  Electors
                </th>
                <th
                  onClick={() => handleSort('activeCampaigns')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-navy-900 select-none"
                >
                  Campaigns
                </th>
                <th
                  onClick={() => handleSort('totalReach')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-navy-900 select-none font-bold text-navy-900"
                >
                  Reach
                </th>
                <th
                  onClick={() => handleSort('totalCalls')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-navy-900 select-none"
                >
                  Phone Calls
                </th>
                <th
                  onClick={() => handleSort('whatsappMessages')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-navy-900 select-none hidden sm:table-cell"
                >
                  WhatsApp
                </th>
                <th
                  onClick={() => handleSort('smsMessages')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-navy-900 select-none hidden md:table-cell"
                >
                  SMS
                </th>
                <th
                  onClick={() => handleSort('averageEngagementRate')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-navy-900 select-none"
                >
                  Engagement
                </th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDistricts.map(d => (
                <tr
                  key={d.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-2.5 px-3.5 font-bold text-navy-900">
                    {d.district}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">
                    {d.region}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-navy-900">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono">
                      {d.constituencyCount} ACs
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600 tabular-nums hidden lg:table-cell">
                    {formatIndianNumber(d.totalElectors)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-700">
                    {d.activeCampaigns}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-navy-900 tabular-nums">
                    {formatIndianNumber(d.totalReach)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-700 tabular-nums">
                    {formatIndianNumber(d.totalCalls)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-700 tabular-nums hidden sm:table-cell">
                    {formatIndianNumber(d.whatsappMessages)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-700 tabular-nums hidden md:table-cell">
                    {formatIndianNumber(d.smsMessages)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-saffron tabular-nums">
                    {formatPercent(d.averageEngagementRate)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => handleFilterToDistrict(d.district)}
                      className="px-2 py-1 bg-slate-100 hover:bg-navy-900 hover:text-white text-navy-900 rounded text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                      title="Inspect District on Map"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3 text-saffron" />
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
