import React, { useState, useMemo } from 'react';
import {
  Share2,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Repeat,
  Video,
  TrendingUp,
  Download,
  ExternalLink,
  Sparkles,
  Layers,
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
import {
  mockSocialKpis,
  mockSocialPlatformBreakdown,
  mockSocialPosts
} from '../data/mockData';
import {
  formatIndianNumber,
  formatPercent,
  formatCompactMetric,
  formatReadableDate
} from '../utils/formatters';
import { ExportModal } from '../components/common/ExportModal';

export const SocialPage: React.FC = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<'reach' | 'engagement' | 'platforms'>('reach');

  // Daily Reach & Engagement Trends across UP (7 days)
  const socialTimelineData = [
    { date: '28 Sep', reach: 6800000, impressions: 14200000, views: 2400000, likes: 380000, engRate: 4.8 },
    { date: '29 Sep', reach: 7400000, impressions: 15800000, views: 2750000, likes: 410000, engRate: 5.1 },
    { date: '30 Sep', reach: 8100000, impressions: 17500000, views: 3100000, likes: 460000, engRate: 5.3 },
    { date: '01 Oct', reach: 8900000, impressions: 19400000, views: 3600000, likes: 520000, engRate: 5.6 },
    { date: '02 Oct', reach: 9800000, impressions: 22100000, views: 4200000, likes: 610000, engRate: 5.9 },
    { date: '03 Oct', reach: 8600000, impressions: 18800000, views: 3400000, likes: 490000, engRate: 5.4 },
    { date: '04 Oct', reach: 8950000, impressions: 19600000, views: 3650000, likes: 530000, engRate: 5.5 }
  ];

  // Constituency Social Activity Ranking
  const constituencySocialActivity = [
    { ac: 'Lucknow Central (174)', district: 'Lucknow', reach: 480000, impressions: 1250000, views: 310000, likes: 46000, engRate: 6.2 },
    { ac: 'Varanasi Cantt (390)', district: 'Varanasi', reach: 440000, impressions: 1120000, views: 285000, likes: 42000, engRate: 6.0 },
    { ac: 'Gorakhpur Urban (322)', district: 'Gorakhpur', reach: 425000, impressions: 1080000, views: 270000, likes: 41000, engRate: 5.9 },
    { ac: 'Noida (061)', district: 'G.B. Nagar', reach: 520000, impressions: 1450000, views: 380000, likes: 58000, engRate: 6.8 },
    { ac: 'Ayodhya (275)', district: 'Ayodhya', reach: 395000, impressions: 980000, views: 250000, likes: 39000, engRate: 5.8 },
    { ac: 'Meerut Cantt (047)', district: 'Meerut', reach: 410000, impressions: 1020000, views: 260000, likes: 38000, engRate: 5.7 },
    { ac: 'Kanpur Cantt (216)', district: 'Kanpur Nagar', reach: 460000, impressions: 1180000, views: 295000, likes: 44000, engRate: 5.9 },
    { ac: 'Prayagraj North (262)', district: 'Prayagraj', reach: 430000, impressions: 1090000, views: 275000, likes: 41500, engRate: 5.8 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-navy-900 tracking-tight uppercase">
              Social Engagement Intelligence
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-navy-50 text-navy-900 px-2.5 py-0.5 rounded-full border border-navy-200">
              Multi-Platform Aggregator
            </span>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
              SAMPLE ANALYTICS
            </span>
          </div>
          <p className="text-xs text-txt-secondary mt-0.5">
            Cross-platform reach, organic citizen amplification, and video watch retention across Uttar Pradesh
          </p>
        </div>

        <button
          onClick={() => setIsExportOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy-900 text-white rounded-md text-xs font-semibold hover:bg-navy-800 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-saffron" />
          <span>Export Social Report</span>
        </button>
      </div>

      {/* 8 Social KPIs (Phase 15 Specs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-2.5">
        <KpiCard
          title="Published Posts"
          value={mockSocialKpis.posts}
          subtitle="All Channels Combined"
          icon={Share2}
          accentColor="navy"
        />
        <KpiCard
          title="Citizen Reach"
          value={formatCompactMetric(mockSocialKpis.reach)}
          subtitle={`${formatIndianNumber(mockSocialKpis.reach)} Unique`}
          icon={Users}
          accentColor="navy"
          trend={{ value: '+14.6%', isPositive: true }}
        />
        <KpiCard
          title="Impressions"
          value={formatCompactMetric(mockSocialKpis.impressions)}
          subtitle="Feed & Timeline Views"
          icon={Eye}
          accentColor="navy"
        />
        <KpiCard
          title="Likes & Reacts"
          value={formatCompactMetric(mockSocialKpis.likes)}
          subtitle="Positive Appreciation"
          icon={Heart}
          accentColor="saffron"
        />
        <KpiCard
          title="Comments"
          value={formatCompactMetric(mockSocialKpis.comments)}
          subtitle="Civic Dialogue Notes"
          icon={MessageCircle}
          accentColor="navy"
        />
        <KpiCard
          title="Shares & RTs"
          value={formatCompactMetric(mockSocialKpis.shares)}
          subtitle="Peer Amplification"
          icon={Repeat}
          accentColor="green"
        />
        <KpiCard
          title="Video Views"
          value={formatCompactMetric(mockSocialKpis.videoViews)}
          subtitle="Watch Retention > 30s"
          icon={Video}
          accentColor="navy"
        />
        <KpiCard
          title="Engagement Rate"
          value={formatPercent(mockSocialKpis.engagementRate)}
          subtitle="State Average"
          icon={TrendingUp}
          accentColor="saffron"
        />
      </div>

      {/* Visual Analytics: Reach & Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <ChartCard
            title="Social Velocity & Video Watch Volume"
            subtitle="Daily impressions, organic reach, and citizen interaction trends in Uttar Pradesh"
            badge="SAMPLE ANALYTICS"
            headerAction={
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-[11px] font-semibold">
                <button
                  onClick={() => setActiveChartTab('reach')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeChartTab === 'reach' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  Reach & Views
                </button>
                <button
                  onClick={() => setActiveChartTab('engagement')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeChartTab === 'engagement' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  Engagement %
                </button>
              </div>
            }
          >
            <div className="h-72 w-full pt-2">
              {activeChartTab === 'reach' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={socialTimelineData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="socReachGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0B1F3A" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0B1F3A" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="socViewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF9933" stopOpacity={0.3} />
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
                    <Area type="monotone" dataKey="reach" name="Citizen Reach" stroke="#0B1F3A" strokeWidth={2.5} fill="url(#socReachGrad)" />
                    <Area type="monotone" dataKey="views" name="Video Views" stroke="#FF9933" strokeWidth={2} fill="url(#socViewsGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={socialTimelineData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} domain={[0, 10]} unit="%" />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Engagement Rate']}
                      contentStyle={{ backgroundColor: '#0B1F3A', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Line type="monotone" dataKey="engRate" name="Daily Engagement Rate" stroke="#138808" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </ChartCard>
        </div>

        {/* Platform Distribution Bar Chart (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-lg border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-navy-900">Platform Distribution</h3>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
                SAMPLE ANALYTICS
              </span>
            </div>
            <p className="text-xs text-txt-secondary mt-0.5">
              Audience share across YouTube, Facebook, Instagram, and X
            </p>

            <div className="h-[210px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockSocialPlatformBreakdown} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="platform" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={v => formatCompactMetric(v)} />
                  <Tooltip
                    formatter={(val: any) => [formatIndianNumber(val), 'Reach']}
                    contentStyle={{ backgroundColor: '#0B1F3A', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                  />
                  <Bar dataKey="reach" name="Platform Reach" fill="#0B1F3A" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
              {mockSocialPlatformBreakdown.map(p => (
                <div key={p.platform} className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-600 font-medium">{p.platform}</span>
                  <span className="font-bold text-navy-900">{formatCompactMetric(p.reach)} ({p.engagement}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Constituency Social Activity Table (Phase 15 Specs) */}
      <div className="command-card overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-navy-900">Constituency Social Media Penetration</h3>
            <p className="text-[11px] text-slate-500">Video viewership, feed impressions, and citizen reaction benchmarks per constituency</p>
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
                <th className="py-2.5 px-3 text-right">Reach</th>
                <th className="py-2.5 px-3 text-right">Impressions</th>
                <th className="py-2.5 px-3 text-right">Video Views</th>
                <th className="py-2.5 px-3 text-right">Likes</th>
                <th className="py-2.5 px-3 text-right">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {constituencySocialActivity.map((ac, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-navy-900">{ac.ac}</td>
                  <td className="py-2.5 px-3 text-slate-600">{ac.district}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-navy-900">
                    {formatIndianNumber(ac.reach)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    {formatIndianNumber(ac.impressions)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    {formatIndianNumber(ac.views)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-saffron-700">
                    {formatIndianNumber(ac.likes)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {ac.engRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performing Content Posts Table */}
      <div className="command-card overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-navy-900">Content Performance Register</h3>
            <p className="text-[11px] text-slate-500">Highest amplified video briefings and scheme explainers across UP</p>
          </div>
          <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-300">
            SAMPLE ANALYTICS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-navy-900 border-b border-slate-200 uppercase tracking-wider">
                <th className="py-2.5 px-4">Post Topic / Title</th>
                <th className="py-2.5 px-3">Platform</th>
                <th className="py-2.5 px-3">Published</th>
                <th className="py-2.5 px-3 text-right">Reach</th>
                <th className="py-2.5 px-3 text-right">Views</th>
                <th className="py-2.5 px-3 text-right">Likes</th>
                <th className="py-2.5 px-3 text-right">Shares</th>
                <th className="py-2.5 px-3 text-right">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {mockSocialPosts.map(post => (
                <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-navy-900">{post.title}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-navy-900">
                      {post.platform}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{formatReadableDate(post.publishedDate || post.postDate || post.date || '')}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-navy-900">
                    {formatIndianNumber(post.reach)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    {formatIndianNumber(post.views)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    {formatIndianNumber(post.likes)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-igreen">
                    {formatIndianNumber(post.shares)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="font-mono font-bold text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded">
                      {formatPercent(post.engagementRate)}
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
