// ANALYTIX Core Data Models & Types

export type GeographicLevel = 'STATE' | 'CONSTITUENCY' | 'MANDAL' | 'WARD' | 'BOOTH';

export interface StateEntity {
  id: string;
  code: string;
  name: string;
  capital: string;
  totalConstituencies: number;
  totalElectorsEstimate: number;
  regionsCount: number;
  districtsCount: number;
  boothsCount: number;
}

export interface ConstituencyEntity {
  id: string;
  code: string; // e.g. "AC-042"
  name: string;
  district: string;
  region: string;
  totalVoters: number;
  activeCampaigns: number;
  totalReach: number;
  totalCalls: number;
  connectedCalls: number;
  whatsappMessages: number;
  smsMessages: number;
  engagementRate: number; // percentage e.g. 38.4
  responses: number;
  followUps: number;
  status: 'High Activity' | 'Moderate Activity' | 'Optimizing' | 'Scheduled';
  mandalsCount: number;
  wardsCount: number;
  boothsCount: number;
  coordinates?: { x: number; y: number };
}

export interface MandalEntity {
  id: string;
  constituencyId: string;
  name: string;
  wardsCount: number;
  boothsCount: number;
  reach: number;
  calls: number;
  engagementRate: number;
  status: 'Active' | 'Review Required' | 'Optimal';
}

export interface BoothEntity {
  id: string;
  mandalId: string;
  boothNumber: number;
  name: string;
  location: string;
  voterCount: number;
  contactsTargeted: number;
  callsCompleted: number;
  reachPercent: number;
}

export type CampaignType = 
  | 'Voter Awareness & Outreach'
  | 'Scheme Benefit Delivery'
  | 'Youth & First-Time Voters'
  | 'Volunteer Mobilization'
  | 'Feedback & Issue Redressal'
  | 'Special Intensive Campaign'
  | 'Women Empowerment & Healthcare'
  | 'Regional Development';

export type CampaignStatus = 'Active' | 'Completed' | 'Scheduled' | 'Paused';

export interface CampaignEntity {
  id: string;
  name: string;
  code: string;
  type: CampaignType;
  startDate: string;
  endDate: string;
  geographicCoverage: string; // e.g. "All 403 Constituencies" or "Western UP Cluster (42 ACs)"
  constituencyIds?: string[];
  targetAudienceSize: number;
  reach: number;
  calls: number;
  connectedCalls: number;
  whatsapp: number;
  sms: number;
  socialImpressions: number;
  engagementRate: number;
  responses: number;
  digitalConversions: number;
  status: CampaignStatus;
  objective: string;
  budgetUtilizedPercent: number;
}

export interface CallingSessionEntity {
  id: string;
  campaignId: string;
  campaignName: string;
  constituencyId: string;
  constituencyName: string;
  sessionDate: string;
  callsInitiated: number;
  callsConnected: number;
  connectionRate: number;
  avgDurationSec: number;
  totalTalkTimeHours: number;
  followUpsScheduled: number;
  escalationsCount: number;
  primaryLanguage: string;
}

export interface CallLogItem {
  id: string;
  citizenName?: string;
  phoneMasked?: string;
  timestamp: string;
  time?: string;
  constituency: string;
  campaign?: string;
  mandal?: string;
  durationSec?: number;
  durationSeconds?: number;
  outcome: string;
  sentiment: string;
  topic: string;
  summary?: string;
  agentType?: string;
}

export interface WhatsAppGroupEntity {
  id: string;
  name: string;
  district?: string;
  constituencyId?: string;
  constituencyName?: string;
  mandalName?: string;
  membersCount: number;
  messagesSent?: number;
  messagesSentWeek?: number;
  dailyMessages?: number;
  reactionsCount?: number;
  repliesCount?: number;
  engagementRate?: number;
  engagementScore?: number;
  activityLevel?: 'High' | 'Moderate' | 'Low';
  status?: string;
  topTopic?: string;
  adminContact?: string;
  lastActive?: string;
}

export interface SmsCampaignEntity {
  id: string;
  name?: string;
  title: string;
  senderId?: string;
  dltTemplateId: string;
  campaignType: string;
  sent?: number;
  sentCount: number;
  delivered?: number;
  deliveredCount: number;
  failedCount?: number;
  deliveryRate: number;
  responses?: number;
  responsesCount?: number;
  responseRate: number;
  linkClicks: number;
  optOuts: number;
  date?: string;
  timestamp: string;
  status: 'Delivered' | 'In Progress' | 'Scheduled' | 'Active';
}

export interface SocialPostEntity {
  id: string;
  platform: string;
  title: string;
  date?: string;
  postDate?: string;
  publishedDate?: string;
  impressions: number;
  reach: number;
  views?: number;
  likes: number;
  comments: number;
  shares: number;
  videoViews?: number;
  engagementRate: number;
  topConstituencyImpact?: string;
}

export interface DigitalGtmEvent {
  id?: string;
  eventName: string; // Technical or display name
  technicalEvent?: string;
  businessLabel?: string;
  friendlyName?: string;
  channel?: string;
  category: string;
  count?: number;
  totalTriggered?: number;
  growth?: number;
  uniqueUsers?: number;
  conversionRate?: number;
  conversionContribution?: number;
  conversionImpact?: string;
  lastFired?: string;
}

export interface ConversationTopicInsight {
  id?: string;
  topic: string;
  volume: number;
  percentage?: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  sampleFaq?: string;
  topQuestion?: string;
  commonConcern?: string;
  topConcern?: string;
  resolutionRate?: number;
  actionRequired?: string;
}

export interface ReportEntity {
  id: string;
  type: 
    | 'State Executive Report'
    | 'District Report'
    | 'Constituency Report'
    | 'Campaign Report'
    | 'Calling Agent Report'
    | 'WhatsApp Report'
    | 'SMS Report'
    | 'Social Engagement Report'
    | 'Digital/GTM Report'
    | 'AI Insights Report'
    | 'Geographic Report';
  title: string;
  description: string;
  period: string;
  generatedDate: string;
  fileSize: string;
  status: 'Ready' | 'Generating' | 'Scheduled';
  format: 'PDF' | 'EXCEL';
}

export interface GlobalFilterState {
  stateId: string;
  electionId: string;
  constituencyId: string; // 'ALL' or specific id
  campaignId: string; // 'ALL' or specific id
  dateRange: 'LAST_7_DAYS' | 'LAST_14_DAYS' | 'LAST_30_DAYS' | 'THIS_CAMPAIGN_CYCLE' | 'CUSTOM';
  startDate?: string;
  endDate?: string;
}

export type NavigationTab = 
  | 'dashboard'
  | 'constituencies'
  | 'constituency-detail'
  | 'districts'
  | 'campaigns'
  | 'campaign-detail'
  | 'calling-agent'
  | 'whatsapp'
  | 'sms'
  | 'social'
  | 'digital'
  | 'geographic'
  | 'ai-insights'
  | 'reports'
  | 'administration'
  | 'settings';
