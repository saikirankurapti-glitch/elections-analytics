import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Download,
  ShieldCheck,
  ArrowRight,
  Filter,
  Search,
  Layers,
  Calendar,
  Building,
  MapPin,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
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
import { mockAiConversationInsights } from '../data/mockData';
import {
  formatIndianNumber,
  formatPercent,
  formatCompactMetric
} from '../utils/formatters';
import { ExportModal } from '../components/common/ExportModal';

export const AiInsightsPage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState(mockAiConversationInsights[0]);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'topics' | 'sentiment' | 'questions'>('topics');

  // Filter state (Phase 17 specs: State, District, Constituency, Campaign, Channel, Date)
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');

  const topicChartData = useMemo(() => {
    return mockAiConversationInsights.map(t => ({
      name: t.topic.split('&')[0].trim(),
      fullName: t.topic,
      volume: t.volume,
      positive: t.sentimentBreakdown.positive,
      neutral: t.sentimentBreakdown.neutral,
      negative: t.sentimentBreakdown.negative
    }));
  }, []);

  // Sentiment distribution
  const overallSentimentData = [
    { name: 'Positive', value: 62.4, color: '#138808' },
    { name: 'Neutral / Informational', value: 28.1, color: '#0B1F3A' },
    { name: 'Constructive Concern', value: 9.5, color: '#E11D48' }
  ];

  // Daily conversation trend across UP (7 days)
  const conversationTrendData = [
    { date: '28 Sep', dialogues: 142000, positive: 88600, neutral: 39900, grievances: 13500 },
    { date: '29 Sep', dialogues: 156000, positive: 97300, neutral: 43800, grievances: 14900 },
    { date: '30 Sep', dialogues: 168000, positive: 104800, neutral: 47200, grievances: 16000 },
    { date: '01 Oct', dialogues: 185000, positive: 115400, neutral: 52000, grievances: 17600 },
    { date: '02 Oct', dialogues: 210000, positive: 131000, neutral: 59000, grievances: 20000 },
    { date: '03 Oct', dialogues: 192000, positive: 119800, neutral: 54000, grievances: 18200 },
    { date: '04 Oct', dialogues: 197000, positive: 122900, neutral: 55400, grievances: 18700 }
  ];

  // Common Citizen Inquiries & Concerns across UP
  const commonInquiries = [
    { category: 'Welfare Schemes', question: 'How do I verify if my Kisan Samman Nidhi installment has been disbursed?', frequency: '28.4%', trend: '+4.2%' },
    { category: 'Infrastructure', question: 'When will the local rural link road repair start under the district plan?', frequency: '22.1%', trend: '+1.8%' },
    { category: 'Electricity & Irrigation', question: 'What is the scheduled daytime power supply roster for agricultural tube-wells?', frequency: '18.6%', trend: '-0.5%' },
    { category: 'Health & Nutrition', question: 'Where is the nearest functional primary health sub-center with maternity facilities?', frequency: '14.2%', trend: '+2.1%' },
    { category: 'Youth & Skilling', question: 'How can young graduates enroll in the regional ITI apprenticeship portal?', frequency: '11.8%', trend: '+5.6%' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-navy-900 tracking-tight uppercase">
              AI Conversation Intelligence
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-saffron-500/20 text-saffron-700 px-2.5 py-0.5 rounded-full border border-saffron-500/30">
              <Sparkles className="w-3 h-3 text-saffron" /> NLP Aggregation Engine
            </span>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
              DEMO DATA
            </span>
          </div>
          <p className="text-xs text-txt-secondary mt-0.5">
            Aggregated speech taxonomy, civic inquiry clustering, and dialogue sentiment across Uttar Pradesh
          </p>
        </div>

        <button
          onClick={() => setIsExportOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy-900 text-white rounded-md text-xs font-semibold hover:bg-navy-800 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-saffron" />
          <span>Export Voice Intelligence</span>
        </button>
      </div>

      {/* Aggregate Disclaimer Notice (Strict Non-Partisan Intelligence Standard) */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-igreen shrink-0 mt-0.5" />
        <div>
          <strong className="text-navy-900 font-bold">Privacy & Non-Partisan Intelligence Standard: </strong>
          Analyzes anonymized speech patterns and civic grievance categories only. Individual voting intentions or private voter political preference profiling are strictly excluded by system architecture.
        </div>
      </div>

      {/* 6 Top-Level KPIs (Phase 17 Specs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <KpiCard
          title="Conversations"
          value="1.25M"
          subtitle="Processed Transcripts"
          icon={MessageSquare}
          accentColor="navy"
        />
        <KpiCard
          title="Positive Sentiment"
          value="62.4%"
          subtitle="Constructive Dialogue"
          icon={CheckCircle2}
          accentColor="green"
        />
        <KpiCard
          title="Neutral Inquiry"
          value="28.1%"
          subtitle="Informational Questions"
          icon={HelpCircle}
          accentColor="navy"
        />
        <KpiCard
          title="Negative / Concern"
          value="9.5%"
          subtitle="Civic Grievances"
          icon={AlertTriangle}
          accentColor="default"
        />
        <KpiCard
          title="Follow-ups"
          value="48,200"
          subtitle="Callbacks Scheduled"
          icon={TrendingUp}
          accentColor="saffron"
        />
        <KpiCard
          title="Escalations"
          value="12,450"
          subtitle="Assigned to Field Teams"
          icon={AlertTriangle}
          accentColor="saffron"
        />
      </div>

      {/* Filter Bar (Phase 17 Specs: District, Channel, Date) */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-navy-900 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-saffron" /> Filters:
          </span>

          <select
            aria-label="Filter by district"
            value={districtFilter}
            onChange={e => setDistrictFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-navy-900 font-medium"
          >
            <option value="ALL">All 75 UP Districts</option>
            <option value="Lucknow">Lucknow District</option>
            <option value="Varanasi">Varanasi District</option>
            <option value="Gorakhpur">Gorakhpur District</option>
            <option value="Gautam Buddha Nagar">Gautam Buddha Nagar</option>
            <option value="Ayodhya">Ayodhya District</option>
          </select>

          <select
            aria-label="Filter by channel"
            value={channelFilter}
            onChange={e => setChannelFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-navy-900 font-medium"
          >
            <option value="ALL">All Channels (Calling & Messaging)</option>
            <option value="Voice">AI Voice Hotline</option>
            <option value="WhatsApp">WhatsApp Inbound</option>
            <option value="Portal">Web Portal Feedback</option>
          </select>
        </div>

        <span className="text-[11px] font-semibold text-slate-500">
          Showing Aggregated Telemetry • 403 Constituencies
        </span>
      </div>

      {/* Visual Analytics: Topics & Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Chart Area (7 Cols) */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Citizen Conversation Taxonomy & Sentiment Distribution"
            subtitle="Volume and sentiment polarity across top public discussion categories"
            badge="DEMO DATA"
            headerAction={
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-[11px] font-semibold">
                <button
                  onClick={() => setActiveTab('topics')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeTab === 'topics' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  Topic Volumes
                </button>
                <button
                  onClick={() => setActiveTab('sentiment')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeTab === 'sentiment' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  Timeline Trend
                </button>
              </div>
            }
          >
            <div className="h-72 w-full pt-2">
              {activeTab === 'topics' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={v => formatCompactMetric(v)} />
                    <Tooltip
                      formatter={(val: any) => [formatIndianNumber(val), 'Volume']}
                      contentStyle={{ backgroundColor: '#0B1F3A', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Bar dataKey="positive" name="Positive Dialogue" stackId="a" fill="#138808" />
                    <Bar dataKey="neutral" name="Neutral Inquiry" stackId="a" fill="#0B1F3A" />
                    <Bar dataKey="negative" name="Grievance / Issue" stackId="a" fill="#E11D48" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={conversationTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dlgPosGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#138808" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#138808" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="dlgGrvGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E11D48" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#E11D48" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} tickFormatter={v => formatCompactMetric(v)} />
                    <Tooltip
                      formatter={(val: any) => [formatIndianNumber(val), 'Dialogues']}
                      contentStyle={{ backgroundColor: '#0B1F3A', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Area type="monotone" dataKey="positive" name="Constructive Inquiries" stroke="#138808" strokeWidth={2} fill="url(#dlgPosGrad)" />
                    <Area type="monotone" dataKey="grievances" name="Escalated Concerns" stroke="#E11D48" strokeWidth={2} fill="url(#dlgGrvGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </ChartCard>
        </div>

        {/* Overall Sentiment Distribution (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-lg border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-navy-900">Overall Citizen Sentiment Index</h3>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
                DEMO DATA
              </span>
            </div>
            <p className="text-xs text-txt-secondary mt-0.5">
              Aggregated NLP sentiment analysis across all processed dialogues
            </p>

            <div className="h-[200px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={overallSentimentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {overallSentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Share']}
                    contentStyle={{ backgroundColor: '#0B1F3A', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
              {overallSentimentData.map(s => (
                <div key={s.name} className="flex justify-between items-center text-[11px]">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </span>
                  <span className="font-bold text-navy-900">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Common Questions & Concerns Table (Phase 17 Specs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Common Questions (6 Cols) */}
        <div className="lg:col-span-6 command-card p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-navy-900">Top Citizen Questions</h3>
              <p className="text-[11px] text-slate-500">Most frequent inquiries recorded during calling and messaging</p>
            </div>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
              DEMO DATA
            </span>
          </div>

          <div className="divide-y divide-slate-100 mt-2 text-xs">
            {commonInquiries.map((inq, idx) => (
              <div key={idx} className="py-2.5 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{inq.category}</span>
                  <p className="font-medium text-navy-900 leading-snug">{inq.question}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-navy-900 block">{inq.frequency}</span>
                  <span className="text-[10px] text-igreen font-semibold">{inq.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Topic Deep Dive (6 Cols) */}
        <div className="lg:col-span-6 command-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-navy-900">Topic Cluster Taxonomy Deep Dive</h3>
                <p className="text-[11px] text-slate-500">Click any topic cluster to inspect resolution pathway</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              {mockAiConversationInsights.map(t => (
                <button
                  key={t.topic}
                  onClick={() => setSelectedTopic(t)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selectedTopic.topic === t.topic
                      ? 'border-saffron bg-saffron-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy-900 truncate">{t.topic}</span>
                    <span className="font-mono text-[10px] text-slate-500">{formatCompactMetric(t.volume)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                    <span className="text-igreen font-semibold">{t.sentimentBreakdown.positive}% Pos</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-rose-600 font-semibold">{t.sentimentBreakdown.negative}% Issue</span>
                  </div>
                </button>
              ))}
            </div>

            {selectedTopic && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-navy-900">
                  Cluster: {selectedTopic.topic}
                </div>
                <div className="space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Key Citizen Inquiry:</span>
                    <span className="font-semibold text-navy-900">{selectedTopic.topQuestion || selectedTopic.sampleFaq}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Primary Civic Grievance:</span>
                    <span className="font-semibold text-rose-700">{selectedTopic.topConcern || selectedTopic.commonConcern}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Action Required:</span>
                    <span className="font-semibold text-saffron-700">{selectedTopic.actionRequired || 'Escalated to Field Office'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};
