import React, { useState, useMemo } from 'react';
import {
  Mail,
  CheckCircle,
  AlertOctagon,
  TrendingUp,
  MousePointerClick,
  UserX,
  ShieldCheck,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { KpiCard } from '../components/common/KpiCard';
import { ChartCard } from '../components/common/ChartCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { mockSmsKpis, mockSmsCampaigns } from '../data/mockData';
import {
  formatIndianNumber,
  formatPercent,
  formatCompactMetric,
  formatReadableDate
} from '../utils/formatters';
import { ExportModal } from '../components/common/ExportModal';

export const SmsPage: React.FC = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<'volume' | 'delivery' | 'responses'>('volume');

  // 7-day SMS Volume & Delivery telemetry data across UP
  const smsTelemetryData = [
    { date: '28 Sep', sent: 4800000, delivered: 4536000, failed: 264000, responses: 220000, clicks: 312000, deliveryRate: 94.5, optouts: 120 },
    { date: '29 Sep', sent: 5200000, delivered: 4929600, failed: 270400, responses: 245000, clicks: 348000, deliveryRate: 94.8, optouts: 145 },
    { date: '30 Sep', sent: 5600000, delivered: 5320000, failed: 280000, responses: 278000, clicks: 384000, deliveryRate: 95.0, optouts: 160 },
    { date: '01 Oct', sent: 6100000, delivered: 5807200, failed: 292800, responses: 315000, clicks: 425000, deliveryRate: 95.2, optouts: 180 },
    { date: '02 Oct', sent: 6800000, delivered: 6487200, failed: 312800, responses: 362000, clicks: 482000, deliveryRate: 95.4, optouts: 210 },
    { date: '03 Oct', sent: 5900000, delivered: 5616800, failed: 283200, responses: 304000, clicks: 410000, deliveryRate: 95.2, optouts: 155 },
    { date: '04 Oct', sent: 6150000, delivered: 5854800, failed: 295200, responses: 326000, clicks: 439000, deliveryRate: 95.2, optouts: 170 }
  ];

  // Constituency SMS Activity Ranking
  const constituencySmsActivity = [
    { ac: 'Lucknow Central (174)', district: 'Lucknow', dispatched: 210000, delivered: 201600, deliveryRate: 96.0, responses: 11200, clicks: 15800 },
    { ac: 'Varanasi Cantt (390)', district: 'Varanasi', dispatched: 195000, delivered: 186225, deliveryRate: 95.5, responses: 9800, clicks: 14200 },
    { ac: 'Gorakhpur Urban (322)', district: 'Gorakhpur', dispatched: 188000, delivered: 179540, deliveryRate: 95.5, responses: 9400, clicks: 13900 },
    { ac: 'Noida (061)', district: 'G.B. Nagar', dispatched: 210000, delivered: 202650, deliveryRate: 96.5, responses: 12500, clicks: 18200 },
    { ac: 'Ayodhya (275)', district: 'Ayodhya', dispatched: 175000, delivered: 166250, deliveryRate: 95.0, responses: 8600, clicks: 12400 },
    { ac: 'Meerut Cantt (047)', district: 'Meerut', dispatched: 180000, delivered: 171360, deliveryRate: 95.2, responses: 8900, clicks: 13100 },
    { ac: 'Kanpur Cantt (216)', district: 'Kanpur Nagar', dispatched: 198000, delivered: 189090, deliveryRate: 95.5, responses: 10400, clicks: 15200 },
    { ac: 'Prayagraj North (262)', district: 'Prayagraj', dispatched: 184000, delivered: 175168, deliveryRate: 95.2, responses: 9200, clicks: 13600 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-navy-900 tracking-tight uppercase">
              SMS Intelligence
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-igreen/10 text-igreen px-2.5 py-0.5 rounded-full border border-igreen/20">
              <ShieldCheck className="w-3 h-3" /> TRAI DLT Verified
            </span>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
              SAMPLE ANALYTICS
            </span>
          </div>
          <p className="text-xs text-txt-secondary mt-0.5">
            Telecom circle gateway delivery logs, template whitelist verification, and citizen response audits across Uttar Pradesh
          </p>
        </div>

        <button
          onClick={() => setIsExportOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy-900 text-white rounded-md text-xs font-semibold hover:bg-navy-800 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-saffron" />
          <span>Export SMS Delivery Audit</span>
        </button>
      </div>

      {/* 8 SMS KPIs (Phase 14 Specs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2.5">
        <KpiCard
          title="Messages Sent"
          value={formatCompactMetric(mockSmsKpis.messagesSent)}
          subtitle={`${formatIndianNumber(mockSmsKpis.messagesSent)} Dispatched`}
          icon={Mail}
          accentColor="navy"
        />
        <KpiCard
          title="Delivered"
          value={formatCompactMetric(mockSmsKpis.delivered)}
          subtitle="Telecom Handshake OK"
          icon={CheckCircle}
          accentColor="green"
        />
        <KpiCard
          title="Failed"
          value={formatCompactMetric(mockSmsKpis.failed)}
          subtitle="Invalid / Switched Off"
          icon={AlertOctagon}
          accentColor="default"
        />
        <KpiCard
          title="Delivery Rate"
          value={formatPercent(mockSmsKpis.deliveryRate)}
          subtitle="Telecom Benchmark"
          icon={TrendingUp}
          accentColor="green"
        />
        <KpiCard
          title="Responses"
          value={formatCompactMetric(mockSmsKpis.responses)}
          subtitle="Two-way SMS Inbound"
          icon={Mail}
          accentColor="saffron"
        />
        <KpiCard
          title="Response Rate"
          value={formatPercent(mockSmsKpis.responseRate)}
          subtitle="Direct Feedback Index"
          icon={TrendingUp}
          accentColor="saffron"
        />
        <KpiCard
          title="Link Clicks"
          value={formatCompactMetric(mockSmsKpis.linkClicks)}
          subtitle="Portal Redirections"
          icon={MousePointerClick}
          accentColor="navy"
        />
        <KpiCard
          title="Opt-outs"
          value={formatIndianNumber(mockSmsKpis.optOuts)}
          subtitle="TRAI DND Compliant"
          icon={UserX}
          accentColor="default"
        />
      </div>

      {/* Visual Analytics: SMS Volume & Delivery Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <ChartCard
            title="SMS Dispatch Volume & Telecom Gateway Performance"
            subtitle="Daily delivery status across Airtel, Jio, and BSNL UP telecom circles"
            badge="SAMPLE ANALYTICS"
            headerAction={
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-[11px] font-semibold">
                <button
                  onClick={() => setActiveChartTab('volume')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeChartTab === 'volume' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  Volume
                </button>
                <button
                  onClick={() => setActiveChartTab('delivery')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeChartTab === 'delivery' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  Delivery Rate
                </button>
                <button
                  onClick={() => setActiveChartTab('responses')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeChartTab === 'responses' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  Inbounds
                </button>
              </div>
            }
          >
            <div className="h-72 w-full pt-2">
              {activeChartTab === 'volume' && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={smsTelemetryData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="smsSentGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0B1F3A" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0B1F3A" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="smsDelivGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#138808" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#138808" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} tickFormatter={v => formatCompactMetric(v)} />
                    <Tooltip
                      formatter={(val: any) => [formatIndianNumber(val), 'Messages']}
                      contentStyle={{ backgroundColor: '#0B1F3A', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Area type="monotone" dataKey="sent" name="Dispatched SMS" stroke="#0B1F3A" strokeWidth={2} fill="url(#smsSentGrad)" />
                    <Area type="monotone" dataKey="delivered" name="Delivered SMS" stroke="#138808" strokeWidth={2} fill="url(#smsDelivGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {activeChartTab === 'delivery' && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={smsTelemetryData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} domain={[90, 100]} unit="%" />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Delivery Efficiency']}
                      contentStyle={{ backgroundColor: '#0B1F3A', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Line type="monotone" dataKey="deliveryRate" name="Telecom Handshake %" stroke="#138808" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {activeChartTab === 'responses' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={smsTelemetryData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} tickFormatter={v => formatCompactMetric(v)} />
                    <Tooltip
                      formatter={(val: any) => [formatIndianNumber(val), 'Count']}
                      contentStyle={{ backgroundColor: '#0B1F3A', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Bar dataKey="responses" name="Two-way Inbound Replies" fill="#FF9933" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="clicks" name="Shortlink CTR" fill="#2563EB" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </ChartCard>
        </div>

        {/* DLT Whitelist & Regulatory Audit */}
        <div className="lg:col-span-4 command-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-bold text-navy-900">DLT Template Compliance</span>
              <span className="text-[10px] font-bold text-igreen bg-igreen/10 px-2 py-0.5 rounded-full">
                100% Certified
              </span>
            </div>

            <div className="space-y-3 mt-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Header Sender ID</span>
                <span className="font-mono font-bold text-navy-900 text-sm">UPGOVT / CMPIGN</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Principal Entity ID: 1701159843210</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Registered Templates</span>
                <span className="font-bold text-navy-900 text-sm">18 Active Templates</span>
                <span className="text-[10px] text-igreen font-semibold block mt-0.5">Voter awareness & grievance hotlines</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">DND Suppression Filter</span>
                <span className="font-bold text-navy-900 text-sm">Active Scrubbing</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Zero commercial violations recorded</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100">
            Telecom circle gateway: UP-East & UP-West
          </div>
        </div>
      </div>

      {/* Constituency SMS Activity Table (Phase 14 Specs) */}
      <div className="command-card overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-navy-900">Constituency SMS Activity & Delivery Register</h3>
            <p className="text-[11px] text-slate-500">Benchmark of dispatches, delivery efficiency, and citizen clicks per constituency</p>
          </div>
          <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
            SAMPLE ANALYTICS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-navy-900 border-b border-slate-200 uppercase tracking-wider">
                <th className="py-2.5 px-4">Assembly Constituency</th>
                <th className="py-2.5 px-3">District</th>
                <th className="py-2.5 px-3 text-right">Dispatched</th>
                <th className="py-2.5 px-3 text-right">Delivered</th>
                <th className="py-2.5 px-3 text-right">Delivery Rate</th>
                <th className="py-2.5 px-3 text-right">Citizen Replies</th>
                <th className="py-2.5 px-3 text-right">Link Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {constituencySmsActivity.map((ac, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-navy-900">{ac.ac}</td>
                  <td className="py-2.5 px-3 text-slate-600">{ac.district}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-navy-900">
                    {formatIndianNumber(ac.dispatched)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    {formatIndianNumber(ac.delivered)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {ac.deliveryRate}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-saffron-700">
                    {formatIndianNumber(ac.responses)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-navy-900">
                    {formatIndianNumber(ac.clicks)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registered SMS Campaigns Table */}
      <div className="command-card overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-navy-900">Active SMS Broadcast Campaigns</h3>
            <p className="text-[11px] text-slate-500">TRAI whitelisted transactional and informational broadcasts</p>
          </div>
          <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
            SAMPLE ANALYTICS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-navy-900 border-b border-slate-200 uppercase tracking-wider">
                <th className="py-2.5 px-4">Campaign Name</th>
                <th className="py-2.5 px-3">Sender ID</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">Sent</th>
                <th className="py-2.5 px-3 text-right">Delivered</th>
                <th className="py-2.5 px-3 text-right">Delivery %</th>
                <th className="py-2.5 px-3 text-right">Responses</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {mockSmsCampaigns.map(cmp => (
                <tr key={cmp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-navy-900">{cmp.name}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{cmp.senderId}</td>
                  <td className="py-2.5 px-3 text-slate-600">{formatReadableDate(cmp.date || cmp.timestamp || '')}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-navy-900">
                    {formatIndianNumber(cmp.sent)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    {formatIndianNumber(cmp.delivered)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {formatPercent(cmp.deliveryRate)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-saffron-700">
                    {formatIndianNumber(cmp.responses)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <StatusBadge status={cmp.status} />
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
