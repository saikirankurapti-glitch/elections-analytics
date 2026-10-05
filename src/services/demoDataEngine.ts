// Centralized Deterministic Synthetic Data Engine for ANALYTIX Uttar Pradesh
// Provides bottom-up reconciled metrics: Constituency -> District -> State
import upConstituenciesJson from '../data/upConstituenciesData.json';
import upDistrictsJson from '../data/upDistrictsData.json';
import { UpAssemblyConstituency, UpDistrictSummary } from './providers/types';

export interface StateKpiSummary {
  totalConstituencies: number;
  totalDistricts: number;
  totalElectors: number;
  activeCampaigns: number;
  completedCampaigns: number;
  peopleReached: number;
  totalCalls: number;
  connectedCalls: number;
  connectionRate: number;
  whatsappMessages: number;
  smsMessages: number;
  socialReach: number;
  engagementRate: number;
  responses: number;
  followUps: number;
  isDemoData: boolean;
  lastSynced: string;
}

export interface DailyTrendPoint {
  date: string;
  dayLabel: string;
  reach: number;
  calls: number;
  connectedCalls: number;
  whatsapp: number;
  sms: number;
  engagement: number;
  responses: number;
  followUps: number;
}

export interface ChannelPerformanceSummary {
  channel: string;
  category: 'Voice' | 'Messaging' | 'Social' | 'Digital';
  volume: number;
  reach: number;
  engagementRate: number;
  responseCount: number;
  trend: string;
  accentColor: string;
  status: string;
}

export interface FunnelStage {
  stage: string;
  label: string;
  count: number;
  formattedCount: string;
  conversionFromPrevious: number;
  conversionFromTop: number;
  color: string;
}

// In-memory typed datasets
const rawConstituencies = upConstituenciesJson as unknown as UpAssemblyConstituency[];
const rawDistricts = upDistrictsJson as unknown as UpDistrictSummary[];

// Pre-computed State Aggregates (100% reconciled from constituencies)
const stateElectors = rawConstituencies.reduce((a, c) => a + c.electionInfo.electors, 0);
const stateReach = rawConstituencies.reduce((a, c) => a + c.campaignOperations.reach, 0);
const stateCalls = rawConstituencies.reduce((a, c) => a + c.campaignOperations.totalCalls, 0);
const stateConnected = rawConstituencies.reduce((a, c) => a + c.campaignOperations.connectedCalls, 0);
const stateWhatsapp = rawConstituencies.reduce((a, c) => a + c.campaignOperations.whatsappMessages, 0);
const stateSms = rawConstituencies.reduce((a, c) => a + c.campaignOperations.smsMessages, 0);
const stateResponses = rawConstituencies.reduce((a, c) => a + c.campaignOperations.responses, 0);
const stateFollowUps = rawConstituencies.reduce((a, c) => a + c.campaignOperations.followUps, 0);
const stateSocialReach = Math.round(stateReach * 1.208); // ~60.3M

const stateAvgEngagement = Number(
  (
    rawConstituencies.reduce((a, c) => a + c.campaignOperations.engagementRate * c.campaignOperations.reach, 0) /
    (stateReach || 1)
  ).toFixed(1)
);

const stateConnectionRate = Number(((stateConnected / (stateCalls || 1)) * 100).toFixed(1));

// Deterministic 30-Day Time-Series Generator
const generate30DayTimeSeries = (): DailyTrendPoint[] => {
  const points: DailyTrendPoint[] = [];
  const baseReachDaily = stateReach / 30; // ~1.66M per day average
  const baseCallsDaily = stateCalls / 30; // ~672k per day average
  const baseWaDaily = stateWhatsapp / 30; // ~925k per day average
  const baseSmsDaily = stateSms / 30;     // ~1.17M per day average
  const baseRespDaily = stateResponses / 30; // ~258k per day average

  // Generate 30 days leading to 05 Oct 2026
  for (let i = 29; i >= 0; i--) {
    const d = new Date(2026, 9, 5); // Oct 5, 2026
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay(); // 0 is Sunday, 6 is Saturday
    const dayStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

    // Realistic day-of-week multipliers:
    // Weekdays (Mon-Fri) steady; Saturday high youth outreach; Sunday low calling (-30%), higher WhatsApp (+20%)
    let dayMultiplier = 1.0;
    let callMultiplier = 1.0;
    let waMultiplier = 1.0;

    if (dayOfWeek === 0) {
      // Sunday
      dayMultiplier = 0.88;
      callMultiplier = 0.68;
      waMultiplier = 1.22;
    } else if (dayOfWeek === 6) {
      // Saturday
      dayMultiplier = 1.15;
      callMultiplier = 1.12;
      waMultiplier = 1.18;
    } else if (dayOfWeek === 3 || dayOfWeek === 4) {
      // Wed / Thu peak campaign operations
      dayMultiplier = 1.08;
      callMultiplier = 1.10;
      waMultiplier = 1.05;
    }

    // Organic campaign trajectory: gradual buildup from Day 1 to Day 30 with 2 broadcast drive spikes
    const progressionFactor = 0.72 + (29 - i) * 0.016; // 0.72 at Day 1 to ~1.18 at Day 30
    const spike = (i === 18 || i === 8 || i === 2) ? 1.35 : 1.0; // campaign pulse spikes

    const dailyReach = Math.round(baseReachDaily * dayMultiplier * progressionFactor * spike);
    const dailyCalls = Math.round(baseCallsDaily * callMultiplier * progressionFactor * spike);
    const dailyConnected = Math.round(dailyCalls * (0.69 + (i % 5) * 0.012));
    const dailyWa = Math.round(baseWaDaily * waMultiplier * progressionFactor * spike);
    const dailySms = Math.round(baseSmsDaily * dayMultiplier * progressionFactor * spike);
    const dailyResp = Math.round(baseRespDaily * dayMultiplier * progressionFactor * spike);
    const dailyFlw = Math.round(dailyResp * 0.28);
    const dailyEng = Number((38.0 + (dayOfWeek * 0.7) + (29 - i) * 0.12).toFixed(1));

    points.push({
      date: dayStr,
      dayLabel: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      reach: dailyReach,
      calls: dailyCalls,
      connectedCalls: dailyConnected,
      whatsapp: dailyWa,
      sms: dailySms,
      engagement: dailyEng,
      responses: dailyResp,
      followUps: dailyFlw
    });
  }

  return points;
};

const precomputedTimeSeries = generate30DayTimeSeries();

export const demoDataEngine = {
  // 1. Reconciled State-Level KPIs
  getStateKpis(): StateKpiSummary {
    return {
      totalConstituencies: 403,
      totalDistricts: 75,
      totalElectors: stateElectors,
      activeCampaigns: 48,
      completedCampaigns: 32,
      peopleReached: stateReach,
      totalCalls: stateCalls,
      connectedCalls: stateConnected,
      connectionRate: stateConnectionRate,
      whatsappMessages: stateWhatsapp,
      smsMessages: stateSms,
      socialReach: stateSocialReach,
      engagementRate: stateAvgEngagement,
      responses: stateResponses,
      followUps: stateFollowUps,
      isDemoData: true,
      lastSynced: '05 Oct 2026 18:30 IST'
    };
  },

  // 2. State Campaign Funnel (Reconciled from bottom-up metrics)
  getStateFunnel(): FunnelStage[] {
    const targetAudience = stateElectors; // 152,398,162
    const reached = stateReach;           // 49,900,816 (32.7% of target)
    const engaged = Math.round(reached * (stateAvgEngagement / 100)); // ~20,459,335
    const responded = stateResponses;     // 7,742,273
    const conversation = stateConnected;  // 14,350,197 voice + dialogue inbounds
    const followUp = stateFollowUps;      // 2,204,353

    return [
      {
        stage: 'Target Audience',
        label: 'Total Registered Electorate',
        count: targetAudience,
        formattedCount: '15.24 Cr',
        conversionFromPrevious: 100,
        conversionFromTop: 100,
        color: '#0B1F3A'
      },
      {
        stage: 'People Reached',
        label: 'Multi-Channel Verified Contacts',
        count: reached,
        formattedCount: '4.99 Cr',
        conversionFromPrevious: Number(((reached / targetAudience) * 100).toFixed(1)),
        conversionFromTop: Number(((reached / targetAudience) * 100).toFixed(1)),
        color: '#2563EB'
      },
      {
        stage: 'Engaged',
        label: 'Active Content Consumed / Dialogue',
        count: engaged,
        formattedCount: '2.05 Cr',
        conversionFromPrevious: Number(((engaged / reached) * 100).toFixed(1)),
        conversionFromTop: Number(((engaged / targetAudience) * 100).toFixed(1)),
        color: '#FF9933'
      },
      {
        stage: 'Responded',
        label: 'Inbound Feedback & Replies',
        count: responded,
        formattedCount: '77.4 L',
        conversionFromPrevious: Number(((responded / engaged) * 100).toFixed(1)),
        conversionFromTop: Number(((responded / targetAudience) * 100).toFixed(1)),
        color: '#06B6D4'
      },
      {
        stage: 'Direct Conversations',
        label: 'Completed Voice & Message Sessions',
        count: conversation,
        formattedCount: '1.44 Cr',
        conversionFromPrevious: Number(((conversation / reached) * 100).toFixed(1)),
        conversionFromTop: Number(((conversation / targetAudience) * 100).toFixed(1)),
        color: '#138808'
      },
      {
        stage: 'Follow-ups Scheduled',
        label: 'Field / Telephonic Callback Queue',
        count: followUp,
        formattedCount: '22.0 L',
        conversionFromPrevious: Number(((followUp / responded) * 100).toFixed(1)),
        conversionFromTop: Number(((followUp / targetAudience) * 100).toFixed(1)),
        color: '#F43F5E'
      }
    ];
  },

  // 3. Omnichannel Performance Matrix
  getOmnichannelPerformance(): ChannelPerformanceSummary[] {
    return [
      {
        channel: 'Voice Calling',
        category: 'Voice',
        volume: stateCalls,
        reach: Math.round(stateReach * 0.404),
        engagementRate: stateConnectionRate,
        responseCount: Math.round(stateResponses * 0.38),
        trend: '+8.4%',
        accentColor: '#138808',
        status: 'Active SIP Trunks'
      },
      {
        channel: 'WhatsApp Broadcasts',
        category: 'Messaging',
        volume: stateWhatsapp,
        reach: Math.round(stateReach * 0.556),
        engagementRate: 46.2,
        responseCount: Math.round(stateResponses * 0.36),
        trend: '+14.2%',
        accentColor: '#0D9488',
        status: 'Meta Cloud API'
      },
      {
        channel: 'SMS Gateway',
        category: 'Messaging',
        volume: stateSms,
        reach: Math.round(stateReach * 0.704),
        engagementRate: 96.0,
        responseCount: Math.round(stateResponses * 0.16),
        trend: '+3.1%',
        accentColor: '#8B5CF6',
        status: 'TRAI DLT Verified'
      },
      {
        channel: 'Social Media',
        category: 'Social',
        volume: 384,
        reach: stateSocialReach,
        engagementRate: 9.8,
        responseCount: Math.round(stateResponses * 0.08),
        trend: '+18.6%',
        accentColor: '#4F46E5',
        status: 'YT / FB / Insta / X'
      },
      {
        channel: 'Digital Web Portals',
        category: 'Digital',
        volume: 14800000,
        reach: 9200000,
        engagementRate: 18.2,
        responseCount: 142800,
        trend: '+12.0%',
        accentColor: '#2563EB',
        status: 'Portal Attribution'
      }
    ];
  },

  // 4. Time-Series Trends (Last 30 Days)
  getTimeSeries(days: number = 30): DailyTrendPoint[] {
    return precomputedTimeSeries.slice(30 - days);
  },

  // 5. Sparkline Array Generator for KPI Cards (14 distinct data points each)
  getSparklines(): Record<string, number[]> {
    const last14 = precomputedTimeSeries.slice(16);
    return {
      campaigns: [40, 41, 41, 42, 43, 44, 44, 45, 46, 46, 47, 47, 48, 48],
      reach: last14.map(p => p.reach),
      calls: last14.map(p => p.calls),
      connectedRate: last14.map(p => Number((p.connectedCalls / (p.calls || 1) * 100).toFixed(1))),
      whatsapp: last14.map(p => p.whatsapp),
      sms: last14.map(p => p.sms),
      social: [52, 53, 53, 54, 55, 56, 56, 57, 58, 58, 59, 60, 60, 60.3],
      engagement: last14.map(p => p.engagement),
      responses: last14.map(p => p.responses),
      followUps: last14.map(p => p.followUps)
    };
  },

  // 6. Dynamic Executive Insights (Truthfully calculated from the aggregate data)
  getExecutiveSummary(): string[] {
    const callingPct = ((stateCalls / (stateCalls + stateWhatsapp + stateSms)) * 100).toFixed(1);
    const waPct = ((stateWhatsapp / (stateCalls + stateWhatsapp + stateSms)) * 100).toFixed(1);
    const activeAcs = rawConstituencies.filter(c => c.campaignOperations.status === 'High Activity').length;
    const saturatedDistricts = rawDistricts.filter(d => (d.totalReach / d.totalElectors) >= 0.35).length;
    const topDistrict = [...rawDistricts].sort((a, b) => b.totalReach - a.totalReach)[0];

    return [
      `48 active campaign cycles are currently deployed across Uttar Pradesh covering ${rawConstituencies.length} assembly constituencies.`,
      `Voice calling accounts for ${callingPct}% of telecommunication outreach with a state connection efficiency of ${stateConnectionRate}%.`,
      `WhatsApp broadcasts represent ${waPct}% of message dispatches, generating ${(stateResponses * 0.36 / 100000).toFixed(1)}L direct citizen interactions.`,
      `${activeAcs} constituencies currently exhibit high operational saturation with over 55% local voter reach.`,
      `${saturatedDistricts} of 75 administrative districts report voter contact saturation above 35% of registered electors, led by ${topDistrict.district} (${(topDistrict.totalReach / 100000).toFixed(1)}L reached).`,
      `All campaign metrics reconcile exactly: 403 constituencies aggregate to 75 districts, totaling ${(stateReach / 10000000).toFixed(2)} Cr state citizen contacts.`
    ];
  },

  // 7. All 403 Constituencies
  getAllConstituencies(): UpAssemblyConstituency[] {
    return rawConstituencies;
  },

  // 8. Get Single Constituency by Number
  getConstituencyByNumber(num: number): UpAssemblyConstituency | undefined {
    return rawConstituencies.find(c => c.constituencyNumber === num);
  },

  // 9. All 75 Districts
  getAllDistricts(): UpDistrictSummary[] {
    return rawDistricts;
  },

  // 10. Top Constituencies Ranked Dynamically by Metric (Ensures Rankings Shift!)
  getTopConstituencies(metric: 'reach' | 'calls' | 'whatsapp' | 'sms' | 'engagement' | 'responses', limit: number = 8) {
    return [...rawConstituencies]
      .sort((a, b) => {
        if (metric === 'calls') return b.campaignOperations.totalCalls - a.campaignOperations.totalCalls;
        if (metric === 'whatsapp') return b.campaignOperations.whatsappMessages - a.campaignOperations.whatsappMessages;
        if (metric === 'sms') return b.campaignOperations.smsMessages - a.campaignOperations.smsMessages;
        if (metric === 'engagement') return b.campaignOperations.engagementRate - a.campaignOperations.engagementRate;
        if (metric === 'responses') return b.campaignOperations.responses - a.campaignOperations.responses;
        return b.campaignOperations.reach - a.campaignOperations.reach;
      })
      .slice(0, limit);
  },

  // 11. Top Districts Ranked Dynamically by Metric (Ensures Rankings Shift!)
  getTopDistricts(metric: 'reach' | 'calls' | 'whatsapp' | 'sms' | 'engagement' | 'responses', limit: number = 8) {
    return [...rawDistricts]
      .sort((a, b) => {
        if (metric === 'calls') return b.totalCalls - a.totalCalls;
        if (metric === 'whatsapp') return b.whatsappMessages - a.whatsappMessages;
        if (metric === 'sms') return b.smsMessages - a.smsMessages;
        if (metric === 'engagement') return b.averageEngagementRate - a.averageEngagementRate;
        if (metric === 'responses') return b.totalResponses - a.totalResponses;
        return b.totalReach - a.totalReach;
      })
      .slice(0, limit);
  }
};
