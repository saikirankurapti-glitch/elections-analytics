// API Service Layer for ANALYTIX
// Can be effortlessly swapped with Axios/fetch HTTP calls to backend endpoints

import {
  mockStates,
  mockElections,
  mockStateKpis,
  mockConstituencies,
  mockMandals,
  mockBooths,
  mockCampaigns,
  mockActivityTrends,
  mockCallingAgentKpis,
  mockCallsByHour,
  mockCallOutcomes,
  mockCallLogs,
  mockWhatsAppKpis,
  mockWhatsAppFunnel,
  mockWhatsAppGroups,
  mockSmsKpis,
  mockSmsCampaigns,
  mockSocialKpis,
  mockSocialPlatformBreakdown,
  mockSocialPosts,
  mockDigitalKpis,
  mockDigitalGtmEvents,
  mockTrafficSources,
  mockAiConversationInsights,
  mockReports
} from '../data/mockData';
import {
  StateEntity,
  ConstituencyEntity,
  MandalEntity,
  BoothEntity,
  CampaignEntity,
  GlobalFilterState,
  ReportEntity
} from '../types';

export const analytixApi = {
  // States & Elections
  async getStates(): Promise<StateEntity[]> {
    return Promise.resolve([...mockStates]);
  },

  async getElections() {
    return Promise.resolve([...mockElections]);
  },

  // State KPI Overview
  async getStateKpis(_filters?: Partial<GlobalFilterState>) {
    return Promise.resolve({ ...mockStateKpis });
  },

  // Campaign Activity Trends
  async getActivityTrends(_metric: string = 'reach', _filters?: Partial<GlobalFilterState>) {
    return Promise.resolve([...mockActivityTrends]);
  },

  // Constituencies
  async getConstituencies(query?: string, region?: string): Promise<ConstituencyEntity[]> {
    let list = [...mockConstituencies];
    if (query && query.trim() !== '') {
      const q = query.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.code.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q)
      );
    }
    if (region && region !== 'ALL') {
      list = list.filter(c => c.region === region);
    }
    return Promise.resolve(list);
  },

  async getConstituencyById(id: string): Promise<ConstituencyEntity | undefined> {
    const item = mockConstituencies.find(c => c.id === id || c.code.toLowerCase() === id.toLowerCase());
    return Promise.resolve(item);
  },

  // Mandals & Booths
  async getMandalsByConstituency(constituencyId: string): Promise<MandalEntity[]> {
    const mandals = mockMandals.filter(m => m.constituencyId === constituencyId);
    return Promise.resolve(mandals.length > 0 ? mandals : mockMandals.slice(0, 4));
  },

  async getBoothsByMandal(mandalId: string): Promise<BoothEntity[]> {
    const booths = mockBooths.filter(b => b.mandalId === mandalId);
    return Promise.resolve(booths.length > 0 ? booths : mockBooths);
  },

  // Campaigns
  async getCampaigns(status?: string): Promise<CampaignEntity[]> {
    let list = [...mockCampaigns];
    if (status && status !== 'ALL') {
      list = list.filter(c => c.status === status);
    }
    return Promise.resolve(list);
  },

  async getCampaignById(id: string): Promise<CampaignEntity | undefined> {
    const item = mockCampaigns.find(c => c.id === id || c.code.toLowerCase() === id.toLowerCase());
    return Promise.resolve(item);
  },

  // Calling Agent
  async getCallingAgentData(_filters?: Partial<GlobalFilterState>) {
    return Promise.resolve({
      kpis: mockCallingAgentKpis,
      byHour: mockCallsByHour,
      outcomes: mockCallOutcomes,
      recentLogs: mockCallLogs
    });
  },

  // WhatsApp
  async getWhatsAppData() {
    return Promise.resolve({
      kpis: mockWhatsAppKpis,
      funnel: mockWhatsAppFunnel,
      groups: mockWhatsAppGroups
    });
  },

  // SMS
  async getSmsData() {
    return Promise.resolve({
      kpis: mockSmsKpis,
      campaigns: mockSmsCampaigns
    });
  },

  // Social
  async getSocialData() {
    return Promise.resolve({
      kpis: mockSocialKpis,
      platforms: mockSocialPlatformBreakdown,
      topPosts: mockSocialPosts
    });
  },

  // Digital / GTM
  async getDigitalData() {
    return Promise.resolve({
      kpis: mockDigitalKpis,
      gtmEvents: mockDigitalGtmEvents,
      trafficSources: mockTrafficSources
    });
  },

  // AI Insights
  async getAiInsights() {
    return Promise.resolve({
      topics: mockAiConversationInsights,
      totalAnalyzed: 1245000,
      overallSentiment: { positive: 62.4, neutral: 28.1, constructiveConcern: 9.5 }
    });
  },

  // Reports
  async getReports(): Promise<ReportEntity[]> {
    return Promise.resolve([...mockReports]);
  },

  async generateReport(type: string): Promise<ReportEntity> {
    const newReport: ReportEntity = {
      id: `rep-${Date.now()}`,
      type: type as any,
      title: `${type} - Live Generation`,
      description: `Real-time generated export snapshot based on selected filters.`,
      period: 'Today (Live Snapshot)',
      generatedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      fileSize: '3.4 MB',
      status: 'Ready',
      format: 'PDF'
    };
    return Promise.resolve(newReport);
  }
};
