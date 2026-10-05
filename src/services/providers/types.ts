// Data Provider Abstraction Interfaces for ANALYTIX
// Decouples UI from data origin (ECI, PostGIS DB, REST API, WebSocket, or Demo Synthetics)

export interface OfficialElectionData {
  electionYear: number;
  assemblyTerm: string;
  electors: number;
  votesPolled: number;
  turnoutPercent: number;
  winningParty: string;
  marginVotes: number;
  source: string;
  sourceReport: string;
  sourceUrl: string;
  lastUpdated: string;
}

export interface SyntheticCampaignOperations {
  isDemoData: boolean;
  campaignsCount: number;
  reach: number;
  totalCalls: number;
  connectedCalls: number;
  connectionRate: number;
  whatsappMessages: number;
  smsMessages: number;
  engagementRate: number;
  responses: number;
  followUps: number;
  status: 'High Activity' | 'Moderate Activity' | 'Optimizing';
  lastActivity: string;
  lastSynced: string;
}

export interface UpAssemblyConstituency {
  id: string; // 'up-ac-174'
  stateId: string; // 'up'
  stateName: string; // 'Uttar Pradesh'
  districtId: string;
  district: string;
  region: string;
  constituencyNumber: number; // 1 to 403
  name: string;
  reservedCategory: string; // 'GEN', 'SC', 'ST'
  parliamentaryConstituency: string;
  pcNumber: number;
  centroidLatitude: number;
  centroidLongitude: number;
  electionInfo: OfficialElectionData;
  campaignOperations: SyntheticCampaignOperations;
}

export interface UpDistrictSummary {
  id: string;
  district: string;
  region: string;
  constituencyCount: number;
  totalElectors: number;
  totalReach: number;
  totalCalls: number;
  connectedCalls: number;
  whatsappMessages: number;
  smsMessages: number;
  totalResponses: number;
  totalFollowUps: number;
  activeCampaigns: number;
  averageEngagementRate: number;
  constituencyIds: string[];
}

export interface ElectionDataProvider {
  getOfficialElectionData(acNumber: number): Promise<OfficialElectionData | undefined>;
  getStateElectionSummary(): Promise<{
    totalAssemblyConstituencies: number;
    totalElectors: number;
    overallTurnout: number;
    assemblyTerm: string;
    source: string;
    lastSynced: string;
  }>;
}

export interface ConstituencyDataProvider {
  getAllConstituencies(): Promise<UpAssemblyConstituency[]>;
  getConstituencyByNumber(acNumber: number): Promise<UpAssemblyConstituency | undefined>;
  getConstituencyById(id: string): Promise<UpAssemblyConstituency | undefined>;
  searchConstituencies(query: string, district?: string): Promise<UpAssemblyConstituency[]>;
  getDistricts(): Promise<UpDistrictSummary[]>;
}

export interface GeographicDataProvider {
  getConstituencyGeoJson(): Promise<any>;
}

export interface CampaignDataProvider {
  getStateCampaignKpis(): Promise<{
    totalConstituencies: number;
    activeCampaigns: number;
    completedCampaigns: number;
    peopleReached: number;
    totalCalls: number;
    connectedCalls: number;
    whatsappMessages: number;
    smsMessages: number;
    socialReach: number;
    engagementRate: number;
    responses: number;
    followUps: number;
    isDemoData: boolean;
    lastSynced: string;
  }>;
}
