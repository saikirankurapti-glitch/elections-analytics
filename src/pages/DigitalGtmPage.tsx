import React, { useState, useMemo } from 'react';
import {
  Globe,
  Users,
  MousePointerClick,
  MessageSquare,
  PhoneCall,
  CheckCircle2,
  TrendingUp,
  Download,
  Layers,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
  FileText
} from 'lucide-react';
import {
  BarChart,
  Bar,
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
import { ResponsiveChart } from '../components/common/ResponsiveChart';
import {
  mockDigitalKpis,
  mockDigitalGtmEvents,
  mockTrafficSources
} from '../data/mockData';
import {
  formatIndianNumber,
  formatPercent,
  formatCompactMetric
} from '../utils/formatters';
import { ExportModal } from '../components/common/ExportModal';

export const DigitalGtmPage: React.FC = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<'traffic' | 'sources' | 'funnel'>('traffic');

  // Traffic Trend Data across UP Web Portals (7 Days)
  const trafficTrendData = [
    { date: '28 Sep', visits: 185000, unique: 142000, ctaClicks: 28400, conversions: 5800 },
    { date: '29 Sep', visits: 210000, unique: 161000, ctaClicks: 32500, conversions: 6600 },
    { date: '30 Sep', visits: 245000, unique: 188000, ctaClicks: 38200, conversions: 7800 },
    { date: '01 Oct', visits: 280000, unique: 215000, ctaClicks: 44100, conversions: 9100 },
    { date: '02 Oct', visits: 320000, unique: 246000, ctaClicks: 51200, conversions: 10500 },
    { date: '03 Oct', visits: 275000, unique: 210000, ctaClicks: 42800, conversions: 8700 },
    { date: '04 Oct', visits: 295000, unique: 228000, ctaClicks: 46200, conversions: 9400 }
  ];

  // Digital Conversion Funnel
  const conversionFunnelStages = [
    { stage: '1. Portal Visitors', count: 1810000, pct: '100%', rate: 100, color: '#0B1F3A' },
    { stage: '2. Scheme / Manifesto Page Views', count: 1240000, pct: '68.5%', rate: 68.5, color: '#1E3A8A' },
    { stage: '3. Interactive CTA Clicked', count: 284000, pct: '15.7%', rate: 15.7, color: '#FF9933' },
    { stage: '4. WhatsApp Channel Joined', count: 96000, pct: '5.3%', rate: 5.3, color: '#138808' },
    { stage: '5. Verified Action Form Submitted', count: 57900, pct: '3.2%', rate: 3.2, color: '#10B981' }
  ];

  // User Journey Touchpoints
  const userJourneySteps = [
    { step: 'Search / Social Ad Click', description: 'Citizen lands on district scheme verification page', share: '46%' },
    { step: 'Constituency & Booth Selector', description: 'Citizen selects local MLA constituency and ward', share: '38%' },
    { step: 'Scheme Entitlement Check', description: 'Citizen inspects road, pension, or tube-well eligibility', share: '29%' },
    { step: 'Action Trigger (WhatsApp / Call)', description: 'Citizen requests callback or joins local broadcast', share: '16%' },
    { step: 'Feedback Submission', description: 'Citizen completes verified local grievance or support note', share: '3.2%' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-navy-900 tracking-tight uppercase">
              Digital Campaign Intelligence
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-navy-50 text-navy-900 px-2.5 py-0.5 rounded-full border border-navy-200">
              Web Attribution & Citizen Actions
            </span>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
              SAMPLE ANALYTICS
            </span>
          </div>
          <p className="text-xs text-txt-secondary mt-0.5">
            Web portal traffic, campaign event attribution, and citizen digital action funnels across Uttar Pradesh
          </p>
        </div>

        <button
          onClick={() => setIsExportOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy-900 text-white rounded-md text-xs font-semibold hover:bg-navy-800 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-saffron" />
          <span>Export Digital Audit</span>
        </button>
      </div>

      {/* 9 Digital KPIs (Phase 16 Specs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2.5">
        <KpiCard
          title="Website Visitors"
          value={formatCompactMetric(mockDigitalKpis.websiteVisits)}
          subtitle={`${formatIndianNumber(mockDigitalKpis.websiteVisits)} Sessions`}
          icon={Globe}
          accentColor="navy"
        />
        <KpiCard
          title="Unique Visitors"
          value={formatCompactMetric(mockDigitalKpis.uniqueVisitors)}
          subtitle="Distinct Citizens"
          icon={Users}
          accentColor="navy"
        />
        <KpiCard
          title="Campaign Views"
          value={formatCompactMetric(mockDigitalKpis.campaignPageVisits)}
          subtitle="Scheme & Manifesto"
          icon={Layers}
          accentColor="navy"
        />
        <KpiCard
          title="CTA Clicks"
          value={formatCompactMetric(mockDigitalKpis.ctaClicks)}
          subtitle="Action Triggers"
          icon={MousePointerClick}
          accentColor="saffron"
        />
        <KpiCard
          title="WhatsApp Clicks"
          value={formatCompactMetric(mockDigitalKpis.whatsAppClicks)}
          subtitle="Community Redirects"
          icon={MessageSquare}
          accentColor="green"
        />
        <KpiCard
          title="Call Clicks"
          value={formatCompactMetric(mockDigitalKpis.callClicks)}
          subtitle="Hotline Dial Taps"
          icon={PhoneCall}
          accentColor="navy"
        />
        <KpiCard
          title="Form Submissions"
          value={formatCompactMetric(mockDigitalKpis.formSubmissions)}
          subtitle="Grievance / Feedback"
          icon={FileText}
          accentColor="navy"
        />
        <KpiCard
          title="Conversions"
          value={formatCompactMetric(mockDigitalKpis.conversions)}
          subtitle="Completed Outcomes"
          icon={CheckCircle2}
          accentColor="green"
        />
        <KpiCard
          title="Conversion Rate"
          value={formatPercent(mockDigitalKpis.conversionRate)}
          subtitle="Visitor-to-Action"
          icon={TrendingUp}
          accentColor="saffron"
        />
      </div>

      {/* Visual Analytics: Traffic & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <ChartCard
            title="Portal Traffic & Citizen Conversion Velocity"
            subtitle="Daily visits, verified unique citizens, and action conversions across UP"
            badge="SAMPLE ANALYTICS"
            headerAction={
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-[11px] font-semibold">
                <button
                  onClick={() => setActiveChartTab('traffic')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeChartTab === 'traffic' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  Traffic Trend
                </button>
                <button
                  onClick={() => setActiveChartTab('funnel')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeChartTab === 'funnel' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  Conversions
                </button>
              </div>
            }
          >
            <div className="h-72 w-full pt-2">
              {activeChartTab === 'traffic' ? (
                <ResponsiveChart width="100%" height="100%">
                  <AreaChart data={trafficTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0B1F3A" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0B1F3A" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="ctaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF9933" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#FF9933" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} tickFormatter={v => formatCompactMetric(v)} />
                    <Tooltip
                      formatter={(val: any) => [formatIndianNumber(val), 'Volume']}
                      contentStyle={{ backgroundColor: '#0B1F3A', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Area type="monotone" dataKey="visits" name="Total Sessions" stroke="#0B1F3A" strokeWidth={2.5} fill="url(#visGrad)" />
                    <Area type="monotone" dataKey="ctaClicks" name="CTA Clicks" stroke="#FF9933" strokeWidth={2} fill="url(#ctaGrad)" />
                  </AreaChart>
                </ResponsiveChart>
              ) : (
                <ResponsiveChart width="100%" height="100%">
                  <BarChart data={trafficTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} tickFormatter={v => formatCompactMetric(v)} />
                    <Tooltip
                      formatter={(val: any) => [formatIndianNumber(val), 'Count']}
                      contentStyle={{ backgroundColor: '#0B1F3A', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Bar dataKey="conversions" name="Verified Conversions" fill="#138808" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="ctaClicks" name="Action Trigger Clicks" fill="#FF9933" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveChart>
              )}
            </div>
          </ChartCard>
        </div>

        {/* Traffic Sources Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-lg border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-navy-900">Traffic Acquisition Channels</h3>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
                SAMPLE ANALYTICS
              </span>
            </div>
            <p className="text-xs text-txt-secondary mt-0.5">
              Distribution of incoming citizen visits by referrer source
            </p>

            <div className="h-[200px] mt-2">
              <ResponsiveChart width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockTrafficSources}
                    dataKey="visitors"
                    nameKey="source"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {mockTrafficSources.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={['#0B1F3A', '#FF9933', '#138808', '#2563EB', '#64748B'][index % 5]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatIndianNumber(val), 'Visitors']}
                    contentStyle={{ backgroundColor: '#0B1F3A', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveChart>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
              {mockTrafficSources.map((s, idx) => (
                <div key={s.source} className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-600 truncate">{s.source}</span>
                  <span className="font-bold text-navy-900">{s.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Funnel & User Journey (Phase 16 Specs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Digital Conversion Funnel */}
        <div className="lg:col-span-6 command-card p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-navy-900">Digital Conversion Funnel</h3>
              <p className="text-[11px] text-slate-500">Step-by-step citizen drop-off and conversion efficiency</p>
            </div>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
              SAMPLE ANALYTICS
            </span>
          </div>

          <div className="space-y-3 mt-4">
            {conversionFunnelStages.map((stage, idx) => (
              <div key={stage.stage} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-navy-900">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500">{formatIndianNumber(stage.count)}</span>
                    <span className="font-bold text-navy-900 w-12 text-right">{stage.pct}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${stage.rate}%`, backgroundColor: stage.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Journey Pathway */}
        <div className="lg:col-span-6 command-card p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-navy-900">Citizen Digital Action Pathway</h3>
              <p className="text-[11px] text-slate-500">Top pathway sequence from discovery to verified response</p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {userJourneySteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy-900">{step.step}</span>
                    <span className="text-[11px] font-mono font-bold text-saffron-700 bg-saffron-50 px-1.5 py-0.5 rounded">
                      {step.share}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Events Table (Friendly Labels - Phase 16 Specs) */}
      <div className="command-card overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-navy-900">Digital Action Events Register</h3>
            <p className="text-[11px] text-slate-500">Business-friendly attribution labels for portal interactions and citizen engagements</p>
          </div>
          <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
            SAMPLE ANALYTICS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-navy-900 border-b border-slate-200 uppercase tracking-wider">
                <th className="py-2.5 px-4">Event Purpose / Category</th>
                <th className="py-2.5 px-3">Business Friendly Label</th>
                <th className="py-2.5 px-3">Primary Action Channel</th>
                <th className="py-2.5 px-3 text-right">Total Event Count</th>
                <th className="py-2.5 px-3 text-right">Unique Citizens</th>
                <th className="py-2.5 px-3 text-right">Conversion Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {mockDigitalGtmEvents.map((ev, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-navy-900">{ev.category}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-700">{ev.friendlyName || ev.businessLabel || ev.eventName}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-navy-900">
                      {ev.channel || 'Web Portal'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-navy-900">
                    {formatIndianNumber(ev.count || ev.totalTriggered || 0)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    {formatIndianNumber(ev.uniqueUsers || Math.round((ev.totalTriggered || 100000) * 0.88))}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-saffron-700">
                    {ev.conversionContribution || 18.5}%
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
