import React, { useState, useMemo } from 'react';
import {
  PhoneCall,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  Play,
  RotateCcw,
  Volume2,
  Filter,
  Download,
  Search,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { KpiCard } from '../components/common/KpiCard';
import { ChartCard } from '../components/common/ChartCard';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  mockCallingAgentKpis,
  mockCallsByHour,
  mockCallOutcomes,
  mockCallLogs,
  mockConstituencies,
  mockCampaigns
} from '../data/mockData';
import {
  formatIndianNumber,
  formatPercent,
  formatCompactMetric,
  formatCallDuration
} from '../utils/formatters';
import { ExportModal } from '../components/common/ExportModal';

export const CallingAgentPage: React.FC = () => {
  const [selectedCallLog, setSelectedCallLog] = useState<(typeof mockCallLogs)[0] | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [filterConstituency, setFilterConstituency] = useState('ALL');
  const [filterOutcome, setFilterOutcome] = useState('ALL');
  const [activeVizTab, setActiveVizTab] = useState<'hourly' | 'daily' | 'duration' | 'conversations'>('hourly');

  const filteredLogs = useMemo(() => {
    return mockCallLogs.filter(log => {
      const matchConst = filterConstituency === 'ALL' || log.constituency.includes(filterConstituency);
      const matchOutcome = filterOutcome === 'ALL' || log.outcome === filterOutcome;
      return matchConst && matchOutcome;
    });
  }, [filterConstituency, filterOutcome]);

  // Calls by Day (Last 7 Days)
  const callsByDayData = [
    { day: 'Mon', initiated: 284000, connected: 204500, rate: 72.0, followups: 3200 },
    { day: 'Tue', initiated: 310000, connected: 226300, rate: 73.0, followups: 3650 },
    { day: 'Wed', initiated: 298000, connected: 217500, rate: 73.0, followups: 3410 },
    { day: 'Thu', initiated: 325000, connected: 240500, rate: 74.0, followups: 3890 },
    { day: 'Fri', initiated: 340000, connected: 251600, rate: 74.0, followups: 4120 },
    { day: 'Sat', initiated: 385000, connected: 292600, rate: 76.0, followups: 4950 },
    { day: 'Sun', initiated: 270000, connected: 202500, rate: 75.0, followups: 3180 }
  ];

  // Duration distribution data
  const durationBucketsData = [
    { range: '< 30s', count: 124000, label: 'Brief / Answering Machine' },
    { range: '30s - 1m', count: 186000, label: 'Short Introduction' },
    { range: '1m - 2m', count: 342000, label: 'Key Scheme Explainer' },
    { range: '2m - 4m', count: 580000, label: 'Full Interactive Dialogue' },
    { range: '> 4m', count: 218000, label: 'Detailed Grievance Intake' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-navy-900 tracking-tight uppercase">
              Calling Agent Intelligence
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-igreen/10 text-igreen px-2.5 py-0.5 rounded-full border border-igreen/20">
              <span className="w-1.5 h-1.5 rounded-full bg-igreen animate-pulse" />
              Active Voice Engine
            </span>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
              DEMO DATA
            </span>
          </div>
          <p className="text-xs text-txt-secondary mt-0.5">
            Real-time outbound voice dialogues across Uttar Pradesh 403 constituencies, connection performance, and citizen audio sentiment
          </p>
        </div>

        <button
          onClick={() => setIsExportOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy-900 text-white rounded-md text-xs font-semibold hover:bg-navy-800 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-saffron" />
          <span>Export Calling Audit</span>
        </button>
      </div>

      {/* Calling KPIs (8 Cards - Phase 12 Specs) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <KpiCard
          title="Calls Initiated"
          value={formatCompactMetric(mockCallingAgentKpis.callsInitiated)}
          subtitle={`${formatIndianNumber(mockCallingAgentKpis.callsInitiated)} Dialed`}
          icon={PhoneCall}
          accentColor="navy"
        />
        <KpiCard
          title="Connected"
          value={formatCompactMetric(mockCallingAgentKpis.callsConnected)}
          subtitle="Delivered Dialogues"
          icon={CheckCircle2}
          accentColor="green"
          trend={{ value: '+5.2%', isPositive: true }}
        />
        <KpiCard
          title="Connection Rate"
          value={formatPercent(mockCallingAgentKpis.connectionRate)}
          subtitle="State Direct Answer"
          icon={TrendingUp}
          accentColor="green"
        />
        <KpiCard
          title="Average Duration"
          value={formatCallDuration(mockCallingAgentKpis.avgDurationSec)}
          subtitle="Benchmark: > 2 mins"
          icon={Clock}
          accentColor="navy"
        />
        <KpiCard
          title="Total Talk Time"
          value={`${formatIndianNumber(mockCallingAgentKpis.totalTalkTimeHours)}h`}
          subtitle="Cumulative Voice Time"
          icon={Volume2}
          accentColor="navy"
        />
        <KpiCard
          title="Successful Convs"
          value={formatCompactMetric(mockCallingAgentKpis.conversationCount)}
          subtitle="Completed In-Depth"
          icon={MessageSquare}
          accentColor="saffron"
        />
        <KpiCard
          title="Follow-ups"
          value={formatIndianNumber(mockCallingAgentKpis.followUps)}
          subtitle="Callback Scheduled"
          icon={Calendar}
          accentColor="saffron"
        />
        <KpiCard
          title="Escalations"
          value={formatIndianNumber(mockCallingAgentKpis.escalations)}
          subtitle="Assigned to Field"
          icon={AlertTriangle}
          accentColor="default"
        />
      </div>

      {/* Large Calling Agent Performance Visualization */}
      <div className="command-card p-5 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white rounded-xl shadow-lg border border-navy-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-navy-700/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-saffron/20 text-saffron">
                <Activity className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white tracking-wide">
                Calling Agent Live Operational Telemetry
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-igreen/20 text-igreen px-2 py-0.5 rounded border border-igreen/30">
                Voice Cluster Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Active concurrent lines: 2,400 SIP trunks • Dialing throughput: 140 calls/sec • Average latency: 280ms
            </p>
          </div>

          <div className="flex items-center gap-2 bg-navy-800/80 p-1 rounded-lg border border-navy-700">
            <button
              onClick={() => setActiveVizTab('hourly')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                activeVizTab === 'hourly' ? 'bg-saffron text-navy-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Hourly Peak
            </button>
            <button
              onClick={() => setActiveVizTab('daily')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                activeVizTab === 'daily' ? 'bg-saffron text-navy-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Daily Volume
            </button>
            <button
              onClick={() => setActiveVizTab('duration')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                activeVizTab === 'duration' ? 'bg-saffron text-navy-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Duration Depth
            </button>
          </div>
        </div>

        {/* Dynamic Chart in Performance Card */}
        <div className="h-64 w-full pt-4">
          {activeVizTab === 'hourly' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockCallsByHour} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="callHourlyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF9933" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#FF9933" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="connHourlyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#138808" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#138808" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} tickFormatter={v => formatCompactMetric(v)} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-navy-950 text-white p-3 rounded shadow-xl text-xs space-y-1 border border-navy-700">
                          <p className="font-bold text-saffron">{label} Window</p>
                          {payload.map((e: any, idx: number) => (
                            <div key={idx} className="flex justify-between gap-4">
                              <span style={{ color: e.color }}>{e.name}:</span>
                              <span className="font-mono font-bold">{formatIndianNumber(e.value)}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Area type="monotone" dataKey="calls" name="Initiated Calls" stroke="#FF9933" strokeWidth={2} fill="url(#callHourlyGrad)" />
                <Area type="monotone" dataKey="connected" name="Connected Calls" stroke="#138808" strokeWidth={2} fill="url(#connHourlyGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeVizTab === 'daily' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={callsByDayData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} tickFormatter={v => formatCompactMetric(v)} />
                <Tooltip
                  formatter={(val: any) => [formatIndianNumber(val), 'Volume']}
                  contentStyle={{ backgroundColor: '#0B1F3A', borderColor: '#334155', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Bar dataKey="initiated" name="Initiated Calls" fill="#3B82F6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="connected" name="Connected Calls" fill="#10B981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeVizTab === 'duration' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={durationBucketsData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} tickFormatter={v => formatCompactMetric(v)} />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${formatIndianNumber(val)} calls (${item.payload.label})`,
                    'Completed Duration'
                  ]}
                  contentStyle={{ backgroundColor: '#0B1F3A', borderColor: '#334155', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="count" name="Dialogue Sessions" fill="#FF9933" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Visual Analytics: Outcomes & Follow-up Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Call Outcomes Donut */}
        <div className="lg:col-span-5 bg-white p-5 rounded-lg border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-navy-900">Call Outcome & Citizen Sentiment</h3>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
                DEMO DATA
              </span>
            </div>
            <p className="text-xs text-txt-secondary mt-0.5">
              Breakdown of automated and assisted citizen voice interactions across UP
            </p>

            <div className="h-[210px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockCallOutcomes}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {mockCallOutcomes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatIndianNumber(val), 'Volume']}
                    contentStyle={{ backgroundColor: '#0B1F3A', borderColor: '#1D4175', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
              {mockCallOutcomes.map(item => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] text-slate-600 truncate">{item.name}</span>
                  <span className="text-[11px] font-bold text-navy-900 ml-auto">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversation Quality & Audio Audit Panel */}
        <div className="lg:col-span-7 command-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-navy-900">Voice Dialogue Quality Audit</h3>
              <span className="text-[11px] font-semibold text-igreen flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 99.4% Synthesizer Accuracy
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Bilingual Hindi/English natural language processing with regional dialect adaptation (Bhojpuri, Awadhi, Braj, Bundeli)
            </p>

            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Dialect Fidelity</span>
                <span className="text-base font-black text-navy-900 font-mono">98.2%</span>
                <span className="text-[10px] text-igreen font-semibold block mt-0.5">Awadhi & Bhojpuri tuned</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Grievance Capture</span>
                <span className="text-base font-black text-navy-900 font-mono">94.7%</span>
                <span className="text-[10px] text-slate-600 font-semibold block mt-0.5">Auto-categorized</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Sentiment Index</span>
                <span className="text-base font-black text-igreen font-mono">+64 Net</span>
                <span className="text-[10px] text-slate-600 font-semibold block mt-0.5">Constructive dialogue</span>
              </div>
            </div>

            {selectedCallLog && (
              <div className="p-3.5 bg-navy-50 border border-navy-200 rounded-lg text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-navy-200/60 pb-1.5">
                  <span className="font-bold text-navy-900">
                    Inspecting Session: {selectedCallLog.constituency}
                  </span>
                  <span className="font-mono text-[11px] text-navy-700">
                    Duration: {formatCallDuration(selectedCallLog.durationSec || selectedCallLog.durationSeconds || 0)}
                  </span>
                </div>
                <p className="text-slate-600 italic leading-relaxed">
                  "{selectedCallLog.summary}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Sentiment: <strong className="text-navy-900">{selectedCallLog.sentiment}</strong></span>
                  <button
                    onClick={() => setSelectedCallLog(null)}
                    className="text-xs text-navy-700 hover:underline font-semibold"
                  >
                    Close inspection
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Voice calling compliant with TRAI telecom regulations</span>
            <span>Click any session below to inspect details</span>
          </div>
        </div>
      </div>

      {/* Voice Dialogue Sessions Log Table */}
      <div className="command-card overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-navy-900">Recent Calling Sessions & Quality Audit</h3>
            <p className="text-[11px] text-slate-500">Live operational telemetry logs across Uttar Pradesh constituencies</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              aria-label="Filter by outcome"
              value={filterOutcome}
              onChange={e => setFilterOutcome(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-md px-2.5 py-1 text-navy-900 font-medium cursor-pointer"
            >
              <option value="ALL">All Outcomes</option>
              <option value="Interested">Interested</option>
              <option value="Callback Requested">Callback Requested</option>
              <option value="Escalated">Escalated</option>
              <option value="Information Sent">Information Sent</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-navy-900 border-b border-slate-200 uppercase tracking-wider">
                <th className="py-2.5 px-4">Time</th>
                <th className="py-2.5 px-3">Constituency</th>
                <th className="py-2.5 px-3">Mandal / Area</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Outcome</th>
                <th className="py-2.5 px-3">Sentiment</th>
                <th className="py-2.5 px-3">Key Topic</th>
                <th className="py-2.5 px-3 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map(log => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedCallLog(log)}
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                    selectedCallLog?.id === log.id ? 'bg-navy-50/60' : ''
                  }`}
                >
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500">{log.time}</td>
                  <td className="py-2.5 px-3 font-semibold text-navy-900">{log.constituency}</td>
                  <td className="py-2.5 px-3 text-slate-600">{log.mandal}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{formatCallDuration(log.durationSec || log.durationSeconds || 0)}</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.outcome === 'Interested' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      log.outcome === 'Callback Requested' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      log.outcome === 'Escalated' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {log.outcome}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`font-semibold text-[11px] ${
                      log.sentiment === 'Positive' ? 'text-igreen' :
                      log.sentiment === 'Negative' ? 'text-rose-600' : 'text-slate-600'
                    }`}>
                      {log.sentiment}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 truncate max-w-xs">{log.summary}</td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCallLog(log);
                      }}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-navy-900 rounded text-[11px] font-semibold transition-colors"
                    >
                      Audit
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
