import React, { useState } from 'react';
import {
  Target,
  Calendar,
  Users,
  PhoneCall,
  MessageSquare,
  Mail,
  Share2,
  TrendingUp,
  Download,
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
  Globe,
  Radio,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
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

export const CampaignDetail: React.FC = () => {
  const { selectedCampaignId, setActiveTab } = useFilters();
  const [isExportOpen, setIsExportOpen] = useState(false);

  const campaign =
    mockCampaigns.find(c => c.id === selectedCampaignId) || mockCampaigns[0];

  const channelBreakdownData = [
    { channel: 'Phone Calls', count: campaign.calls, color: '#138808' },
    { channel: 'WhatsApp', count: campaign.whatsapp, color: '#2A5899' },
    { channel: 'SMS Alerts', count: campaign.sms, color: '#FF9933' },
    { channel: 'Social Imp.', count: campaign.socialImpressions / 3, color: '#0B1F3A' }
  ];

  const funnelData = [
    { stage: 'Target Electorate', count: campaign.targetAudienceSize, percent: 100 },
    { stage: 'People Reached', count: campaign.reach, percent: Math.round((campaign.reach / campaign.targetAudienceSize) * 100) },
    { stage: 'Direct Engagement', count: Math.round(campaign.reach * (campaign.engagementRate / 100)), percent: Math.round(campaign.engagementRate) },
    { stage: 'Citizen Responses', count: campaign.responses, percent: Math.round((campaign.responses / campaign.reach) * 100) },
    { stage: 'Digital Conversions', count: campaign.digitalConversions, percent: Math.round((campaign.digitalConversions / campaign.reach) * 100) }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => setActiveTab('campaigns')}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-navy-900 rounded-md transition-colors mt-0.5"
              title="Return to Campaigns"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded border border-saffron-300">
                  {campaign.code}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
                  {campaign.name}
                </h2>
                <StatusBadge status={campaign.status} />
              </div>
              <p className="text-xs text-txt-secondary mt-1">
                Type: <strong className="text-navy-900">{campaign.type}</strong> • Coverage:{' '}
                <strong className="text-navy-900">{campaign.geographicCoverage}</strong> • Period:{' '}
                <strong className="text-navy-900">{formatReadableDate(campaign.startDate)}</strong> to{' '}
                <strong className="text-navy-900">{formatReadableDate(campaign.endDate)}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExportOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors self-start md:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-saffron" />
            <span>Export Campaign Report</span>
          </button>
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-md border border-slate-200 text-xs text-slate-700">
          <strong className="text-navy-900">Campaign Directive: </strong>
          {campaign.objective}
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard
          title="Target Audience"
          value={formatCompactMetric(campaign.targetAudienceSize)}
          subtitle={`${formatIndianNumber(campaign.targetAudienceSize)} Voters`}
          icon={Target}
          accentColor="navy"
        />
        <KpiCard
          title="People Reached"
          value={formatCompactMetric(campaign.reach)}
          subtitle={`${formatPercent((campaign.reach / campaign.targetAudienceSize) * 100)} Target Saturation`}
          icon={Users}
          accentColor="navy"
          trend={{ value: '+18.5%', isPositive: true }}
        />
        <KpiCard
          title="Phone Calls"
          value={formatCompactMetric(campaign.calls)}
          subtitle={`${formatIndianNumber(campaign.connectedCalls)} Connected`}
          icon={PhoneCall}
          accentColor="green"
          onClick={() => setActiveTab('calling-agent')}
        />
        <KpiCard
          title="WhatsApp Sent"
          value={formatCompactMetric(campaign.whatsapp)}
          subtitle="Direct Message Delivery"
          icon={MessageSquare}
          accentColor="green"
          onClick={() => setActiveTab('whatsapp')}
        />
        <KpiCard
          title="Engagement Rate"
          value={formatPercent(campaign.engagementRate)}
          subtitle="Citizen Interaction"
          icon={TrendingUp}
          accentColor="saffron"
        />
        <KpiCard
          title="Digital Conversions"
          value={formatIndianNumber(campaign.digitalConversions)}
          subtitle="Forms & Pledges"
          icon={Globe}
          accentColor="saffron"
          onClick={() => setActiveTab('digital')}
        />
      </div>

      {/* Visual Analytics Row: Channels Breakdown & Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Channel Outreaches Bar Chart (7 Cols) */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Multi-Channel Delivery Volume"
            subtitle="Comparative outreach across calls, WhatsApp, SMS, and digital impression streams"
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={channelBreakdownData} margin={{ top: 15, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="channel" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={val => formatCompactMetric(val)} />
                <Tooltip
                  formatter={(val: any) => [formatIndianNumber(val), 'Volume']}
                  contentStyle={{ backgroundColor: '#0B1F3A', borderColor: '#1D4175', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#0B1F3A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Campaign Funnel (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-lg border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-navy-900 leading-snug">
              Audience Conversion Funnel
            </h3>
            <p className="text-xs text-txt-secondary mt-0.5">
              From electorate universe to confirmed citizen interaction
            </p>

            <div className="mt-4 space-y-3">
              {funnelData.map((item, idx) => (
                <div key={item.stage} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-navy-900">{item.stage}</span>
                    <span className="text-slate-600 font-medium tabular-nums">
                      {formatIndianNumber(item.count)}{' '}
                      <span className="text-slate-400 font-normal">({item.percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        idx === 0 ? 'bg-navy-900' : idx === 1 ? 'bg-navy-700' : idx === 2 ? 'bg-saffron' : 'bg-igreen'
                      }`}
                      style={{ width: `${Math.max(item.percent, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-txt-secondary">
            <span>Overall Outreach Yield:</span>
            <span className="font-bold text-igreen">
              {formatPercent((campaign.digitalConversions / campaign.targetAudienceSize) * 100, 2)} Net Action Rate
            </span>
          </div>
        </div>
      </div>

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};
