import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  CheckCircle,
  Eye,
  CornerDownRight,
  MousePointerClick,
  Users,
  TrendingUp,
  Download,
  Search,
  Filter,
  CheckCheck,
  Building,
  MapPin,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
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
import { ResponsiveChart } from '../components/common/ResponsiveChart';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  mockWhatsAppKpis,
  mockWhatsAppFunnel,
  mockWhatsAppGroups,
  mockConstituencies
} from '../data/mockData';
import {
  formatIndianNumber,
  formatPercent,
  formatCompactMetric
} from '../utils/formatters';
import { ExportModal } from '../components/common/ExportModal';

export const WhatsAppDataPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeChartMetric, setActiveChartMetric] = useState<'volume' | 'rates' | 'groups'>('volume');

  const filteredGroups = useMemo(() => {
    return mockWhatsAppGroups.filter(
      grp =>
        grp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (grp.constituencyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (grp.mandalName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Volume & Rates trend data across Uttar Pradesh (7 days)
  const whatsappTimelineData = [
    { day: '28 Sep', sent: 3400000, delivered: 3264000, read: 2652000, replies: 782000, deliveryRate: 96.0, readRate: 81.2, replyRate: 29.5 },
    { day: '29 Sep', sent: 3650000, delivered: 3510000, read: 2880000, replies: 864000, deliveryRate: 96.2, readRate: 82.0, replyRate: 30.0 },
    { day: '30 Sep', sent: 3900000, delivered: 3750000, read: 3100000, replies: 930000, deliveryRate: 96.1, readRate: 82.7, replyRate: 30.0 },
    { day: '01 Oct', sent: 4200000, delivered: 4040000, read: 3380000, replies: 1040000, deliveryRate: 96.2, readRate: 83.6, replyRate: 30.8 },
    { day: '02 Oct', sent: 4600000, delivered: 4425000, read: 3720000, replies: 1150000, deliveryRate: 96.2, readRate: 84.1, replyRate: 30.9 },
    { day: '03 Oct', sent: 4100000, delivered: 3944000, read: 3310000, replies: 1020000, deliveryRate: 96.2, readRate: 83.9, replyRate: 30.8 },
    { day: '04 Oct', sent: 4106000, delivered: 3942000, read: 3350000, replies: 1035000, deliveryRate: 96.0, readRate: 85.0, replyRate: 30.9 }
  ];

  // Constituency WhatsApp Activity Ranking
  const constituencyWhatsAppActivity = [
    { ac: 'Lucknow Central (174)', district: 'Lucknow', broadcasts: 182000, groups: 48, members: 11200, replies: 42800, engRate: 43.6 },
    { ac: 'Varanasi Cantt (390)', district: 'Varanasi', broadcasts: 164000, groups: 42, members: 9800, replies: 38200, engRate: 44.2 },
    { ac: 'Gorakhpur Urban (322)', district: 'Gorakhpur', broadcasts: 158000, groups: 39, members: 9200, replies: 36100, engRate: 42.8 },
    { ac: 'Noida (061)', district: 'G.B. Nagar', broadcasts: 182000, groups: 56, members: 13400, replies: 44500, engRate: 45.2 },
    { ac: 'Ayodhya (275)', district: 'Ayodhya', broadcasts: 142000, groups: 36, members: 8600, replies: 32400, engRate: 41.5 },
    { ac: 'Meerut Cantt (047)', district: 'Meerut', broadcasts: 148000, groups: 38, members: 8900, replies: 33900, engRate: 40.8 },
    { ac: 'Kanpur Cantt (216)', district: 'Kanpur Nagar', broadcasts: 172000, groups: 44, members: 10500, replies: 39800, engRate: 42.0 },
    { ac: 'Prayagraj North (262)', district: 'Prayagraj', broadcasts: 156000, groups: 40, members: 9400, replies: 35600, engRate: 41.8 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-navy-900 tracking-tight uppercase">
              WhatsApp Intelligence
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-igreen/10 text-igreen px-2.5 py-0.5 rounded-full border border-igreen/20">
              <CheckCheck className="w-3 h-3" /> Meta Cloud API Active
            </span>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
              SAMPLE ANALYTICS
            </span>
          </div>
          <p className="text-xs text-txt-secondary mt-0.5">
            Peer-to-peer mobilization, broadcast message delivery funnels, and ward community group vitality across Uttar Pradesh
          </p>
        </div>

        <button
          onClick={() => setIsExportOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy-900 text-white rounded-md text-xs font-semibold hover:bg-navy-800 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-saffron" />
          <span>Export WhatsApp Data</span>
        </button>
      </div>

      {/* 8 WhatsApp KPIs (Phase 13 Specs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2.5">
        <KpiCard
          title="Messages Sent"
          value={formatCompactMetric(mockWhatsAppKpis.messagesSent)}
          subtitle={`${formatIndianNumber(mockWhatsAppKpis.messagesSent)} Outgoing`}
          icon={MessageSquare}
          accentColor="navy"
        />
        <KpiCard
          title="Delivered"
          value={formatCompactMetric(mockWhatsAppKpis.delivered)}
          subtitle="96.0% Handshake"
          icon={CheckCircle}
          accentColor="green"
        />
        <KpiCard
          title="Read"
          value={formatCompactMetric(mockWhatsAppKpis.read)}
          subtitle="78.0% Blue Tick Rate"
          icon={Eye}
          accentColor="green"
        />
        <KpiCard
          title="Replies"
          value={formatCompactMetric(mockWhatsAppKpis.replies)}
          subtitle="Inbound Citizen Notes"
          icon={CornerDownRight}
          accentColor="saffron"
        />
        <KpiCard
          title="Reply Rate"
          value={formatPercent(mockWhatsAppKpis.replyRate)}
          subtitle="Interactive Dialogue"
          icon={TrendingUp}
          accentColor="saffron"
        />
        <KpiCard
          title="Groups Reached"
          value={formatIndianNumber(mockWhatsAppKpis.activeGroups)}
          subtitle="Ward & Booth Groups"
          icon={Users}
          accentColor="navy"
        />
        <KpiCard
          title="Group Members"
          value={formatCompactMetric(mockWhatsAppKpis.totalGroupMembers)}
          subtitle="Enrolled Citizens"
          icon={Users}
          accentColor="navy"
        />
        <KpiCard
          title="Engagement"
          value="41.5%"
          subtitle="Content Share Index"
          icon={Sparkles}
          accentColor="green"
        />
      </div>

      {/* Visual Analytics: Delivery Funnel & Activity Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Chart Area (7 Cols) */}
        <div className="lg:col-span-7">
          <ChartCard
            title="WhatsApp Transmission & Citizen Interaction Trends"
            subtitle="Daily message dispatch volume, delivery performance, and inbound reply velocity"
            badge="SAMPLE ANALYTICS"
            headerAction={
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-[11px] font-semibold">
                <button
                  onClick={() => setActiveChartMetric('volume')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeChartMetric === 'volume' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  Message Volume
                </button>
                <button
                  onClick={() => setActiveChartMetric('rates')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeChartMetric === 'rates' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  Conversion Rates
                </button>
              </div>
            }
          >
            <div className="h-72 w-full pt-2">
              {activeChartMetric === 'volume' ? (
                <ResponsiveChart width="100%" height="100%">
                  <AreaChart data={whatsappTimelineData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="waSentGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0B1F3A" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0B1F3A" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="waDeliveredGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#138808" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#138808" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="waReplyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF9933" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#FF9933" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} tickFormatter={v => formatCompactMetric(v)} />
                    <Tooltip
                      formatter={(val: any) => [formatIndianNumber(val), 'Volume']}
                      contentStyle={{ backgroundColor: '#0B1F3A', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Area type="monotone" dataKey="sent" name="Sent Broadcasts" stroke="#0B1F3A" strokeWidth={2} fill="url(#waSentGrad)" />
                    <Area type="monotone" dataKey="delivered" name="Delivered" stroke="#138808" strokeWidth={2} fill="url(#waDeliveredGrad)" />
                    <Area type="monotone" dataKey="replies" name="Inbound Replies" stroke="#FF9933" strokeWidth={2} fill="url(#waReplyGrad)" />
                  </AreaChart>
                </ResponsiveChart>
              ) : (
                <ResponsiveChart width="100%" height="100%">
                  <LineChart data={whatsappTimelineData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} domain={[0, 100]} unit="%" />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Rate']}
                      contentStyle={{ backgroundColor: '#0B1F3A', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Line type="monotone" dataKey="deliveryRate" name="Delivery Rate" stroke="#138808" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="readRate" name="Read (Blue Tick) Rate" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="replyRate" name="Reply Rate" stroke="#FF9933" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveChart>
              )}
            </div>
          </ChartCard>
        </div>

        {/* WhatsApp Conversion Funnel (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-lg border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-navy-900">Broadcast Transmission Funnel</h3>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
                SAMPLE ANALYTICS
              </span>
            </div>
            <p className="text-xs text-txt-secondary mt-0.5">
              Cumulative delivery stages and citizen conversation retention
            </p>

            <div className="space-y-3 mt-4">
              {mockWhatsAppFunnel.map((stage, idx) => (
                <div key={stage.stage} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-navy-900">{stage.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-500">{formatIndianNumber(stage.count)}</span>
                      <span className="font-bold text-navy-900 w-12 text-right">{stage.rate}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0 ? 'bg-navy-900' :
                        idx === 1 ? 'bg-emerald-600' :
                        idx === 2 ? 'bg-blue-600' :
                        idx === 3 ? 'bg-saffron' : 'bg-purple-600'
                      }`}
                      style={{ width: `${stage.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Verified Meta Business Manager Cloud API</span>
            <span className="font-mono font-bold text-igreen">Zero DLT Blocklist</span>
          </div>
        </div>
      </div>

      {/* Constituency WhatsApp Activity Table */}
      <div className="command-card overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-navy-900">Constituency WhatsApp Mobilization Activity</h3>
            <p className="text-[11px] text-slate-500">Benchmark of broadcasts, active community groups, and reply volumes per constituency</p>
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
                <th className="py-2.5 px-3 text-right">Broadcasts</th>
                <th className="py-2.5 px-3 text-right">Active Groups</th>
                <th className="py-2.5 px-3 text-right">Group Members</th>
                <th className="py-2.5 px-3 text-right">Citizen Replies</th>
                <th className="py-2.5 px-3 text-right">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {constituencyWhatsAppActivity.map((ac, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-navy-900">{ac.ac}</td>
                  <td className="py-2.5 px-3 text-slate-600">{ac.district}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-navy-900">
                    {formatIndianNumber(ac.broadcasts)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    {ac.groups}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    {formatIndianNumber(ac.members)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-igreen">
                    {formatIndianNumber(ac.replies)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="font-mono font-bold text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded">
                      {ac.engRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ward & Booth Community Groups Register */}
      <div className="command-card overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-navy-900">Top Active Community Groups</h3>
            <p className="text-[11px] text-slate-500">Monitored grassroots volunteer and ward communication clusters</p>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search groups, mandals, or ACs..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs bg-white border border-slate-200 rounded-md text-navy-900 focus:outline-none focus:border-saffron"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-navy-900 border-b border-slate-200 uppercase tracking-wider">
                <th className="py-2.5 px-4">Group Name</th>
                <th className="py-2.5 px-3">Constituency</th>
                <th className="py-2.5 px-3">Mandal / Ward</th>
                <th className="py-2.5 px-3 text-right">Members</th>
                <th className="py-2.5 px-3 text-right">Daily Posts</th>
                <th className="py-2.5 px-3 text-right">Engagement</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredGroups.map(grp => (
                <tr key={grp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-navy-900">{grp.name}</td>
                  <td className="py-2.5 px-3 text-slate-600">{grp.constituencyName}</td>
                  <td className="py-2.5 px-3 text-slate-600">{grp.mandalName}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-navy-900">{grp.membersCount}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">{grp.dailyMessages}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="font-mono font-bold text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded">
                      {grp.engagementScore}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {grp.status}
                    </span>
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
