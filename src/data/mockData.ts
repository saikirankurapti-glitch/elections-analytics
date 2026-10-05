import {
  StateEntity,
  ConstituencyEntity,
  MandalEntity,
  BoothEntity,
  CampaignEntity,
  CallingSessionEntity,
  CallLogItem,
  WhatsAppGroupEntity,
  SmsCampaignEntity,
  SocialPostEntity,
  DigitalGtmEvent,
  ConversationTopicInsight,
  ReportEntity
} from '../types';

export const mockStates: StateEntity[] = [
  {
    id: 'up',
    code: 'UP',
    name: 'Uttar Pradesh',
    capital: 'Lucknow',
    totalConstituencies: 403,
    totalElectorsEstimate: 153000000,
    regionsCount: 6,
    districtsCount: 75,
    boothsCount: 174351
  }
];

export const mockElections = [
  { id: 'up-vs-2022', name: '18th Vidhan Sabha Elections (ECI 2022)', status: 'Official Benchmark' },
  { id: 'up-vs-2027', name: 'General Assembly Cycle 2027', status: 'Pre-Campaign Live' },
  { id: 'up-bye-2024', name: 'Assembly By-Elections Phase II', status: 'Completed' }
];

export const mockStateKpis = {
  totalConstituencies: 403,
  districtsCount: 75,
  activeCampaigns: 48,
  completedCampaigns: 32,
  peopleReached: 48200000, // 4.82 Crore
  totalCalls: 20244000,    // 2.02 Crore
  connectedCalls: 14656656, // 72.4%
  whatsappMessages: 27956000, // 2.79 Crore
  smsMessages: 34704000,      // 3.47 Crore
  socialReach: 58400000,
  engagementRate: 41.2,
  responses: 6412000,
  followUps: 1948500,
  escalationsResolved: 124500
};

// 20 Key Representative Uttar Pradesh Assembly Constituencies across all regions
export const mockConstituencies: ConstituencyEntity[] = [
  {
    id: 'up-ac-174',
    code: 'AC-174',
    name: 'Lucknow Central',
    district: 'Lucknow',
    region: 'Awadh Central',
    totalVoters: 347705,
    activeCampaigns: 7,
    totalReach: 148200,
    totalCalls: 62400,
    connectedCalls: 46800,
    whatsappMessages: 84200,
    smsMessages: 112000,
    engagementRate: 42.1,
    responses: 24150,
    followUps: 8340,
    status: 'High Activity',
    mandalsCount: 7,
    wardsCount: 28,
    boothsCount: 312,
    coordinates: { x: 50, y: 52 }
  },
  {
    id: 'up-ac-172',
    code: 'AC-172',
    name: 'Lucknow North',
    district: 'Lucknow',
    region: 'Awadh Central',
    totalVoters: 387545,
    activeCampaigns: 6,
    totalReach: 162400,
    totalCalls: 78200,
    connectedCalls: 54740,
    whatsappMessages: 118000,
    smsMessages: 134000,
    engagementRate: 39.4,
    responses: 31400,
    followUps: 9210,
    status: 'High Activity',
    mandalsCount: 6,
    wardsCount: 34,
    boothsCount: 298,
    coordinates: { x: 50, y: 48 }
  },
  {
    id: 'up-ac-390',
    code: 'AC-390',
    name: 'Varanasi Cantt.',
    district: 'Varanasi',
    region: 'Purvanchal',
    totalVoters: 412800,
    activeCampaigns: 8,
    totalReach: 184000,
    totalCalls: 84500,
    connectedCalls: 60840,
    whatsappMessages: 132000,
    smsMessages: 146000,
    engagementRate: 43.8,
    responses: 38200,
    followUps: 11450,
    status: 'High Activity',
    mandalsCount: 8,
    wardsCount: 36,
    boothsCount: 340,
    coordinates: { x: 74, y: 64 }
  },
  {
    id: 'up-ac-388',
    code: 'AC-388',
    name: 'Varanasi North',
    district: 'Varanasi',
    region: 'Purvanchal',
    totalVoters: 398200,
    activeCampaigns: 6,
    totalReach: 154000,
    totalCalls: 68400,
    connectedCalls: 49250,
    whatsappMessages: 106000,
    smsMessages: 122000,
    engagementRate: 41.2,
    responses: 27600,
    followUps: 8190,
    status: 'High Activity',
    mandalsCount: 6,
    wardsCount: 32,
    boothsCount: 310,
    coordinates: { x: 73, y: 62 }
  },
  {
    id: 'up-ac-322',
    code: 'AC-322',
    name: 'Gorakhpur Urban',
    district: 'Gorakhpur',
    region: 'Purvanchal',
    totalVoters: 442600,
    activeCampaigns: 7,
    totalReach: 218000,
    totalCalls: 96400,
    connectedCalls: 67480,
    whatsappMessages: 164000,
    smsMessages: 182000,
    engagementRate: 44.5,
    responses: 44600,
    followUps: 13120,
    status: 'High Activity',
    mandalsCount: 8,
    wardsCount: 42,
    boothsCount: 384,
    coordinates: { x: 72, y: 38 }
  },
  {
    id: 'up-ac-323',
    code: 'AC-323',
    name: 'Gorakhpur Rural',
    district: 'Gorakhpur',
    region: 'Purvanchal',
    totalVoters: 392100,
    activeCampaigns: 5,
    totalReach: 136500,
    totalCalls: 58200,
    connectedCalls: 40740,
    whatsappMessages: 92400,
    smsMessages: 104500,
    engagementRate: 38.6,
    responses: 21800,
    followUps: 6740,
    status: 'Moderate Activity',
    mandalsCount: 7,
    wardsCount: 26,
    boothsCount: 320,
    coordinates: { x: 74, y: 40 }
  },
  {
    id: 'up-ac-275',
    code: 'AC-275',
    name: 'Ayodhya',
    district: 'Ayodhya',
    region: 'Awadh Central',
    totalVoters: 368400,
    activeCampaigns: 6,
    totalReach: 176400,
    totalCalls: 81200,
    connectedCalls: 59280,
    whatsappMessages: 121000,
    smsMessages: 142000,
    engagementRate: 43.1,
    responses: 35900,
    followUps: 10840,
    status: 'High Activity',
    mandalsCount: 7,
    wardsCount: 35,
    boothsCount: 336,
    coordinates: { x: 62, y: 50 }
  },
  {
    id: 'up-ac-048',
    code: 'AC-048',
    name: 'Meerut Cantt.',
    district: 'Meerut',
    region: 'Western UP',
    totalVoters: 384200,
    activeCampaigns: 5,
    totalReach: 158900,
    totalCalls: 71400,
    connectedCalls: 52120,
    whatsappMessages: 104000,
    smsMessages: 128000,
    engagementRate: 41.0,
    responses: 29800,
    followUps: 8900,
    status: 'High Activity',
    mandalsCount: 6,
    wardsCount: 35,
    boothsCount: 318,
    coordinates: { x: 26, y: 28 }
  },
  {
    id: 'up-ac-086',
    code: 'AC-086',
    name: 'Agra South',
    district: 'Agra',
    region: 'Braj',
    totalVoters: 362100,
    activeCampaigns: 5,
    totalReach: 152000,
    totalCalls: 69200,
    connectedCalls: 50510,
    whatsappMessages: 98000,
    smsMessages: 124000,
    engagementRate: 40.5,
    responses: 28400,
    followUps: 8650,
    status: 'High Activity',
    mandalsCount: 6,
    wardsCount: 32,
    boothsCount: 304,
    coordinates: { x: 32, y: 55 }
  },
  {
    id: 'up-ac-214',
    code: 'AC-214',
    name: 'Kanpur Cantt.',
    district: 'Kanpur Nagar',
    region: 'Awadh Central',
    totalVoters: 338900,
    activeCampaigns: 6,
    totalReach: 142100,
    totalCalls: 63500,
    connectedCalls: 44450,
    whatsappMessages: 88500,
    smsMessages: 115000,
    engagementRate: 37.9,
    responses: 23600,
    followUps: 7120,
    status: 'Moderate Activity',
    mandalsCount: 6,
    wardsCount: 30,
    boothsCount: 310,
    coordinates: { x: 48, y: 60 }
  },
  {
    id: 'up-ac-262',
    code: 'AC-262',
    name: 'Prayagraj City North',
    district: 'Prayagraj',
    region: 'Purvanchal',
    totalVoters: 374600,
    activeCampaigns: 6,
    totalReach: 168400,
    totalCalls: 74200,
    connectedCalls: 53420,
    whatsappMessages: 114000,
    smsMessages: 136000,
    engagementRate: 42.4,
    responses: 32800,
    followUps: 9850,
    status: 'High Activity',
    mandalsCount: 7,
    wardsCount: 36,
    boothsCount: 328,
    coordinates: { x: 60, y: 68 }
  },
  {
    id: 'up-ac-061',
    code: 'AC-061',
    name: 'Noida',
    district: 'Gautam Buddha Nagar',
    region: 'Western UP',
    totalVoters: 482100,
    activeCampaigns: 7,
    totalReach: 245000,
    totalCalls: 104200,
    connectedCalls: 75020,
    whatsappMessages: 182000,
    smsMessages: 210000,
    engagementRate: 45.2,
    responses: 52400,
    followUps: 15400,
    status: 'High Activity',
    mandalsCount: 8,
    wardsCount: 44,
    boothsCount: 410,
    coordinates: { x: 22, y: 32 }
  },
  {
    id: 'up-ac-222',
    code: 'AC-222',
    name: 'Jhansi Nagar',
    district: 'Jhansi',
    region: 'Bundelkhand',
    totalVoters: 312500,
    activeCampaigns: 4,
    totalReach: 119500,
    totalCalls: 49800,
    connectedCalls: 34860,
    whatsappMessages: 64200,
    smsMessages: 89000,
    engagementRate: 34.2,
    responses: 17400,
    followUps: 5120,
    status: 'Optimizing',
    mandalsCount: 5,
    wardsCount: 24,
    boothsCount: 282,
    coordinates: { x: 30, y: 78 }
  },
  {
    id: 'up-ac-124',
    code: 'AC-124',
    name: 'Bareilly',
    district: 'Bareilly',
    region: 'Rohilkhand',
    totalVoters: 345600,
    activeCampaigns: 5,
    totalReach: 132400,
    totalCalls: 56100,
    connectedCalls: 39820,
    whatsappMessages: 76500,
    smsMessages: 98000,
    engagementRate: 37.2,
    responses: 20400,
    followUps: 6180,
    status: 'Moderate Activity',
    mandalsCount: 6,
    wardsCount: 28,
    boothsCount: 295,
    coordinates: { x: 42, y: 34 }
  },
  {
    id: 'up-ac-028',
    code: 'AC-028',
    name: 'Moradabad Nagar',
    district: 'Moradabad',
    region: 'Rohilkhand',
    totalVoters: 368900,
    activeCampaigns: 5,
    totalReach: 145000,
    totalCalls: 64200,
    connectedCalls: 45580,
    whatsappMessages: 86400,
    smsMessages: 108000,
    engagementRate: 38.5,
    responses: 22600,
    followUps: 6840,
    status: 'Moderate Activity',
    mandalsCount: 6,
    wardsCount: 30,
    boothsCount: 315,
    coordinates: { x: 34, y: 26 }
  },
  {
    id: 'up-ac-076',
    code: 'AC-076',
    name: 'Aligarh',
    district: 'Aligarh',
    region: 'Braj',
    totalVoters: 356400,
    activeCampaigns: 5,
    totalReach: 138200,
    totalCalls: 59400,
    connectedCalls: 42170,
    whatsappMessages: 81200,
    smsMessages: 102000,
    engagementRate: 38.0,
    responses: 21500,
    followUps: 6490,
    status: 'Moderate Activity',
    mandalsCount: 6,
    wardsCount: 28,
    boothsCount: 308,
    coordinates: { x: 28, y: 44 }
  },
  {
    id: 'up-ac-084',
    code: 'AC-084',
    name: 'Mathura',
    district: 'Mathura',
    region: 'Braj',
    totalVoters: 342100,
    activeCampaigns: 5,
    totalReach: 146800,
    totalCalls: 63100,
    connectedCalls: 45430,
    whatsappMessages: 89000,
    smsMessages: 114000,
    engagementRate: 41.5,
    responses: 26400,
    followUps: 7920,
    status: 'High Activity',
    mandalsCount: 6,
    wardsCount: 30,
    boothsCount: 298,
    coordinates: { x: 25, y: 48 }
  },
  {
    id: 'up-ac-056',
    code: 'AC-056',
    name: 'Ghaziabad',
    district: 'Ghaziabad',
    region: 'Western UP',
    totalVoters: 462800,
    activeCampaigns: 7,
    totalReach: 215000,
    totalCalls: 94800,
    connectedCalls: 68250,
    whatsappMessages: 154000,
    smsMessages: 188000,
    engagementRate: 43.6,
    responses: 46800,
    followUps: 14100,
    status: 'High Activity',
    mandalsCount: 8,
    wardsCount: 40,
    boothsCount: 395,
    coordinates: { x: 24, y: 30 }
  },
  {
    id: 'up-ac-001',
    code: 'AC-001',
    name: 'Behat',
    district: 'Saharanpur',
    region: 'Western UP',
    totalVoters: 337816,
    activeCampaigns: 4,
    totalReach: 100485,
    totalCalls: 42204,
    connectedCalls: 28830,
    whatsappMessages: 58281,
    smsMessages: 72349,
    engagementRate: 35.8,
    responses: 12591,
    followUps: 3525,
    status: 'Moderate Activity',
    mandalsCount: 5,
    wardsCount: 24,
    boothsCount: 280,
    coordinates: { x: 28, y: 15 }
  },
  {
    id: 'up-ac-004',
    code: 'AC-004',
    name: 'Saharanpur',
    district: 'Saharanpur',
    region: 'Western UP',
    totalVoters: 351200,
    activeCampaigns: 5,
    totalReach: 134200,
    totalCalls: 57400,
    connectedCalls: 40750,
    whatsappMessages: 78400,
    smsMessages: 96800,
    engagementRate: 38.4,
    responses: 21200,
    followUps: 6360,
    status: 'Moderate Activity',
    mandalsCount: 6,
    wardsCount: 30,
    boothsCount: 305,
    coordinates: { x: 29, y: 18 }
  }
];

// Uttar Pradesh Mandals & Administrative Blocks
export const mockMandals: MandalEntity[] = [
  {
    id: 'mnd-01',
    constituencyId: 'up-ac-174',
    name: 'Hazratganj Central Mandal',
    wardsCount: 6,
    boothsCount: 64,
    reach: 38400,
    calls: 16500,
    engagementRate: 44.8,
    status: 'Optimal'
  },
  {
    id: 'mnd-02',
    constituencyId: 'up-ac-174',
    name: 'Gomti Nagar West Mandal',
    wardsCount: 5,
    boothsCount: 52,
    reach: 32600,
    calls: 13900,
    engagementRate: 43.1,
    status: 'Optimal'
  },
  {
    id: 'mnd-03',
    constituencyId: 'up-ac-174',
    name: 'Chowk Heritage Mandal',
    wardsCount: 5,
    boothsCount: 48,
    reach: 26400,
    calls: 11200,
    engagementRate: 40.5,
    status: 'Active'
  },
  {
    id: 'mnd-04',
    constituencyId: 'up-ac-174',
    name: 'Aminabad Commercial Mandal',
    wardsCount: 4,
    boothsCount: 46,
    reach: 24800,
    calls: 10400,
    engagementRate: 41.2,
    status: 'Active'
  },
  {
    id: 'mnd-05',
    constituencyId: 'up-ac-390',
    name: 'Kashi Vidyapeeth Block',
    wardsCount: 6,
    boothsCount: 68,
    reach: 42100,
    calls: 18900,
    engagementRate: 45.6,
    status: 'Optimal'
  },
  {
    id: 'mnd-06',
    constituencyId: 'up-ac-390',
    name: 'Dashashwamedh Mandal',
    wardsCount: 5,
    boothsCount: 54,
    reach: 36200,
    calls: 15800,
    engagementRate: 44.2,
    status: 'Optimal'
  },
  {
    id: 'mnd-07',
    constituencyId: 'up-ac-322',
    name: 'Gorakhpur Sadar Block',
    wardsCount: 7,
    boothsCount: 72,
    reach: 48500,
    calls: 21400,
    engagementRate: 46.2,
    status: 'Optimal'
  },
  {
    id: 'mnd-08',
    constituencyId: 'up-ac-322',
    name: 'Gorakhnath Temple Area Mandal',
    wardsCount: 6,
    boothsCount: 60,
    reach: 39800,
    calls: 17600,
    engagementRate: 45.0,
    status: 'Optimal'
  }
];

// Uttar Pradesh Real Polling Station Booths
export const mockBooths: BoothEntity[] = [
  { id: 'bth-01', mandalId: 'mnd-01', boothNumber: 101, name: 'GIC Government Inter College East Wing, Room 1', location: 'Hazratganj, Lucknow', voterCount: 980, contactsTargeted: 920, callsCompleted: 785, reachPercent: 85.3 },
  { id: 'bth-02', mandalId: 'mnd-01', boothNumber: 102, name: 'GIC Government Inter College West Wing, Room 2', location: 'Hazratganj, Lucknow', voterCount: 920, contactsTargeted: 870, callsCompleted: 742, reachPercent: 85.2 },
  { id: 'bth-03', mandalId: 'mnd-01', boothNumber: 103, name: 'Navayug Kanya Mahavidyalaya Main Auditorium', location: 'Rajendra Nagar, Lucknow', voterCount: 1050, contactsTargeted: 990, callsCompleted: 820, reachPercent: 82.8 },
  { id: 'bth-04', mandalId: 'mnd-02', boothNumber: 115, name: 'City Montessori School (CMS) Campus Hall', location: 'Gomti Nagar, Lucknow', voterCount: 1180, contactsTargeted: 1110, callsCompleted: 940, reachPercent: 84.6 },
  { id: 'bth-05', mandalId: 'mnd-05', boothNumber: 142, name: 'Queens Inter College Main Building', location: 'Varanasi Cantt.', voterCount: 1020, contactsTargeted: 950, callsCompleted: 810, reachPercent: 85.2 },
  { id: 'bth-06', mandalId: 'mnd-05', boothNumber: 143, name: 'Harish Chandra Post Graduate College Hall', location: 'Maidagin, Varanasi', voterCount: 1140, contactsTargeted: 1070, callsCompleted: 890, reachPercent: 83.1 },
  { id: 'bth-07', mandalId: 'mnd-07', boothNumber: 181, name: 'Maharana Pratap Inter College, Civil Lines', location: 'Gorakhpur Town', voterCount: 1220, contactsTargeted: 1160, callsCompleted: 985, reachPercent: 84.9 }
];

// Uttar Pradesh Campaigns
export const mockCampaigns: CampaignEntity[] = [
  {
    id: 'cmp-01',
    name: 'UP Vikas & Citizen Entitlement Mission 2026',
    code: 'CMP-VIKAS-UP26',
    type: 'Voter Awareness & Outreach',
    startDate: '2026-08-01',
    endDate: '2026-11-30',
    geographicCoverage: 'All 403 Constituencies',
    targetAudienceSize: 32000000,
    reach: 24800000,
    calls: 9400000,
    connectedCalls: 6862000,
    whatsapp: 14500000,
    sms: 18200000,
    socialImpressions: 42000000,
    engagementRate: 42.5,
    responses: 3840000,
    digitalConversions: 482000,
    status: 'Active',
    objective: 'Statewide verification of citizen welfare scheme delivery, road connectivity, and polling station locations.',
    budgetUtilizedPercent: 72
  },
  {
    id: 'cmp-02',
    name: 'Yuva Shakti First-Time Voter & Skilling Drive',
    code: 'CMP-YUVA-UP26',
    type: 'Youth & First-Time Voters',
    startDate: '2026-08-15',
    endDate: '2026-12-15',
    geographicCoverage: 'Urban & Semi-Urban Clusters (84 ACs)',
    targetAudienceSize: 12000000,
    reach: 9800000,
    calls: 3800000,
    connectedCalls: 2850000,
    whatsapp: 6200000,
    sms: 7400000,
    socialImpressions: 31000000,
    engagementRate: 46.8,
    responses: 1720000,
    digitalConversions: 324000,
    status: 'Active',
    objective: 'College and first-time voter dialogue on digital employment exchanges, apprenticeships, and voter ID updates.',
    budgetUtilizedPercent: 64
  },
  {
    id: 'cmp-03',
    name: 'Kisan Samman & Tube-well Solarization Advisory',
    code: 'CMP-KISAN-UP26',
    type: 'Scheme Benefit Delivery',
    startDate: '2026-07-10',
    endDate: '2026-11-20',
    geographicCoverage: 'Rural & Agricultural Districts (168 ACs)',
    targetAudienceSize: 24000000,
    reach: 18500000,
    calls: 7200000,
    connectedCalls: 5184000,
    whatsapp: 9800000,
    sms: 14200000,
    socialImpressions: 18000000,
    engagementRate: 38.2,
    responses: 2850000,
    digitalConversions: 189000,
    status: 'Active',
    objective: 'Verifying disbursement status of agricultural inputs, tube-well free electricity roster, and mandi accessibility.',
    budgetUtilizedPercent: 86
  },
  {
    id: 'cmp-04',
    name: 'Prajavani UP Public Grievance Redressal Hotline',
    code: 'CMP-PRAJA-UP26',
    type: 'Feedback & Issue Redressal',
    startDate: '2026-08-01',
    endDate: '2026-12-31',
    geographicCoverage: 'All 403 Constituencies',
    targetAudienceSize: 18000000,
    reach: 12400000,
    calls: 5100000,
    connectedCalls: 3825000,
    whatsapp: 7400000,
    sms: 8900000,
    socialImpressions: 14500000,
    engagementRate: 43.6,
    responses: 2150000,
    digitalConversions: 241000,
    status: 'Active',
    objective: 'Systematic recording and escalation of citizen feedback on drinking water, road maintenance, and local power supply.',
    budgetUtilizedPercent: 55
  },
  {
    id: 'cmp-05',
    name: 'Matru Shakti & Poshan Direct Benefit Mission',
    code: 'CMP-MATRU-UP26',
    type: 'Women Empowerment & Healthcare',
    startDate: '2026-09-01',
    endDate: '2026-12-15',
    geographicCoverage: 'High-Priority Districts (112 ACs)',
    targetAudienceSize: 14000000,
    reach: 9200000,
    calls: 3400000,
    connectedCalls: 2482000,
    whatsapp: 4900000,
    sms: 6800000,
    socialImpressions: 12000000,
    engagementRate: 41.2,
    responses: 1450000,
    digitalConversions: 165000,
    status: 'Active',
    objective: 'Awareness regarding maternal nutrition benefits, Kanya Sumangala assistance, and self-help group revolving credit.',
    budgetUtilizedPercent: 48
  },
  {
    id: 'cmp-06',
    name: 'Purvanchal Industrial Corridor Outreach',
    code: 'CMP-PURVA-UP26',
    type: 'Regional Development',
    startDate: '2026-08-10',
    endDate: '2026-11-15',
    geographicCoverage: 'Eastern UP Districts (76 ACs)',
    targetAudienceSize: 9500000,
    reach: 6800000,
    calls: 2400000,
    connectedCalls: 1752000,
    whatsapp: 3600000,
    sms: 4800000,
    socialImpressions: 9800000,
    engagementRate: 39.5,
    responses: 920000,
    digitalConversions: 112000,
    status: 'Active',
    objective: 'Showcasing expressway connectivity, manufacturing clusters, ODOP artisan hubs, and local cold storage facilities.',
    budgetUtilizedPercent: 60
  }
];

export const mockActivityTrends = [
  { date: '22 Sep', reach: 3420000, calls: 1420000, whatsapp: 1980000, sms: 2450000, engagement: 37.5, responses: 440000 },
  { date: '24 Sep', reach: 3680000, calls: 1540000, whatsapp: 2120000, sms: 2640000, engagement: 38.2, responses: 480000 },
  { date: '26 Sep', reach: 3950000, calls: 1680000, whatsapp: 2280000, sms: 2840000, engagement: 39.1, responses: 520000 },
  { date: '28 Sep', reach: 4210000, calls: 1790000, whatsapp: 2450000, sms: 3050000, engagement: 39.8, responses: 560000 },
  { date: '30 Sep', reach: 4480000, calls: 1890000, whatsapp: 2610000, sms: 3260000, engagement: 40.5, responses: 600000 },
  { date: '02 Oct', reach: 4720000, calls: 1980000, whatsapp: 2740000, sms: 3420000, engagement: 41.0, responses: 630000 },
  { date: '04 Oct', reach: 4820000, calls: 2024400, whatsapp: 2795600, sms: 3470400, engagement: 41.2, responses: 641200 }
];

export const mockCallingAgentKpis = {
  callsInitiated: 20244000,
  callsConnected: 14656656,
  connectionRate: 72.4,
  averageDurationSeconds: 168, // 2m 48s
  avgDurationSec: 168,
  totalTalkTimeHours: 684200,
  successfulDialogues: 12480000,
  conversationCount: 12480000,
  scheduledFollowUps: 1948500,
  followUps: 1948500,
  escalationsCreated: 124500,
  escalations: 124500,
  avgSentimentScore: 7.6 // out of 10
};

export const mockCallsByHour = [
  { hour: '08:00', initiated: 480000, connected: 312000, rate: 65.0 },
  { hour: '09:00', initiated: 1250000, connected: 887500, rate: 71.0 },
  { hour: '10:00', initiated: 2180000, connected: 1613200, rate: 74.0 },
  { hour: '11:00', initiated: 2420000, connected: 1815000, rate: 75.0 },
  { hour: '12:00', initiated: 1980000, connected: 1425600, rate: 72.0 },
  { hour: '13:00', initiated: 1120000, connected: 761600, rate: 68.0 },
  { hour: '14:00', initiated: 1420000, connected: 994000, rate: 70.0 },
  { hour: '15:00', initiated: 2240000, connected: 1657600, rate: 74.0 },
  { hour: '16:00', initiated: 2680000, connected: 2036800, rate: 76.0 },
  { hour: '17:00', initiated: 2540000, connected: 1930400, rate: 76.0 },
  { hour: '18:00', initiated: 1480000, connected: 1065600, rate: 72.0 },
  { hour: '19:00', initiated: 454000, connected: 286020, rate: 63.0 }
];

export const mockCallOutcomes = [
  { outcome: 'Full Survey / Info Completed', name: 'Full Survey / Info Completed', count: 9420000, percentage: 64.3, percent: 64.3, color: '#138808' },
  { outcome: 'Partial Dialogue Completed', name: 'Partial Dialogue Completed', count: 3060000, percentage: 20.9, percent: 20.9, color: '#3D74BF' },
  { outcome: 'Citizen Requested Callback', name: 'Citizen Requested Callback', count: 1240000, percentage: 8.5, percent: 8.5, color: '#FF9933' },
  { outcome: 'Issue Grievance Logged', name: 'Issue Grievance Logged', count: 680000, percentage: 4.6, percent: 4.6, color: '#E67E17' },
  { outcome: 'Not Interested / Busy', name: 'Not Interested / Busy', count: 256656, percentage: 1.7, percent: 1.7, color: '#94A3B8' }
];

export const mockCallLogs: CallLogItem[] = [
  { id: 'cl-001', citizenName: 'Rajendra Prasad Sharma', phoneMasked: '+91 98390 •••••', constituency: 'Lucknow Central (AC-174)', mandal: 'Hazratganj Mandal', durationSec: 215, durationSeconds: 215, timestamp: '10 mins ago', time: '10 mins ago', outcome: 'Interested', sentiment: 'Positive', topic: 'Kisan Credit & Piped Water', summary: 'Citizen verified receipt of piped water scheme and requested Kisan loan details.', agentType: 'Automated AI Voice' },
  { id: 'cl-002', citizenName: 'Sunita Devi Yadav', phoneMasked: '+91 94152 •••••', constituency: 'Varanasi Cantt. (AC-390)', mandal: 'Kashi Vidyapeeth', durationSec: 184, durationSeconds: 184, timestamp: '14 mins ago', time: '14 mins ago', outcome: 'Interested', sentiment: 'Positive', topic: 'Kanya Sumangala Scheme', summary: 'Daughter enrolled in secondary school; verified benefit disbursement.', agentType: 'Automated AI Voice' },
  { id: 'cl-003', citizenName: 'Mohammad Tariq Ansari', phoneMasked: '+91 91250 •••••', constituency: 'Gorakhpur Urban (AC-322)', mandal: 'Gorakhpur Sadar', durationSec: 142, durationSeconds: 142, timestamp: '18 mins ago', time: '18 mins ago', outcome: 'Escalated', sentiment: 'Neutral', topic: 'Drainage & Road Repair', summary: 'Grievance recorded regarding road repair in ward 14.', agentType: 'Automated AI Voice' },
  { id: 'cl-004', citizenName: 'Brijesh Kumar Mishra', phoneMasked: '+91 97920 •••••', constituency: 'Ayodhya (AC-275)', mandal: 'Ayodhya Sadar', durationSec: 198, durationSeconds: 198, timestamp: '25 mins ago', time: '25 mins ago', outcome: 'Interested', sentiment: 'Positive', topic: 'Pilgrim Corridor Transport', summary: 'Appreciated EV bus connectivity to railway station.', agentType: 'Automated AI Voice' },
  { id: 'cl-005', citizenName: 'Vikram Singh Chauhan', phoneMasked: '+91 98371 •••••', constituency: 'Meerut Cantt. (AC-048)', mandal: 'Meerut Sadar', durationSec: 165, durationSeconds: 165, timestamp: '32 mins ago', time: '32 mins ago', outcome: 'Interested', sentiment: 'Positive', topic: 'Rapid Rail RRTS Station Connectivity', summary: 'Inquired about feeder bus schedule from cantonment area.', agentType: 'Automated AI Voice' },
  { id: 'cl-006', citizenName: 'Harish Chandra Agarwal', phoneMasked: '+91 94122 •••••', constituency: 'Agra South (AC-086)', mandal: 'Tajganj Mandal', durationSec: 132, durationSeconds: 132, timestamp: '40 mins ago', time: '40 mins ago', outcome: 'Callback Requested', sentiment: 'Neutral', topic: 'Commercial Electricity Tariffs', summary: 'Requested evening callback to discuss artisan MSME tariff slab.', agentType: 'Automated AI Voice' },
  { id: 'cl-007', citizenName: 'Poonam Maurya', phoneMasked: '+91 96214 •••••', constituency: 'Prayagraj City North (AC-262)', mandal: 'Civil Lines', durationSec: 220, durationSeconds: 220, timestamp: '48 mins ago', time: '48 mins ago', outcome: 'Interested', sentiment: 'Positive', topic: 'University Student Fellowship', summary: 'Ph.D. student confirmed receipt of state research grant stipend.', agentType: 'Automated AI Voice' },
  { id: 'cl-008', citizenName: 'Sanjay Kumar Verma', phoneMasked: '+91 98110 •••••', constituency: 'Noida (AC-061)', mandal: 'Sector 62 Cluster', durationSec: 175, durationSeconds: 175, timestamp: '55 mins ago', time: '55 mins ago', outcome: 'Information Sent', sentiment: 'Positive', topic: 'Metro Extension & IT Parks', summary: 'SMS sent with details on new expressway junction route.', agentType: 'Automated AI Voice' }
];

export const mockWhatsAppKpis = {
  messagesSent: 27956000,
  deliveredCount: 26837760, // 96.0%
  delivered: 26837760,
  readCount: 22644360,      // 81.0%
  read: 22644360,
  repliesCount: 6150320,    // 22.0%
  replies: 6150320,
  deliveryRate: 96.0,
  readRate: 84.4,
  replyRate: 22.9,
  broadcastLists: 4820,
  activeCommunityGroups: 2450,
  activeGroups: 2450,
  groupTotalMembers: 4820000,
  totalGroupMembers: 4820000,
  linksClicked: 3840000
};

export const mockWhatsAppFunnel = [
  { stage: 'Sent Broadcasts', count: 27956000, percentage: 100, rate: 100, color: '#0B1F3A' },
  { stage: 'Delivered (WhatsApp API)', count: 26837760, percentage: 96.0, rate: 96.0, color: '#1D4175' },
  { stage: 'Read by Citizen', count: 22644360, percentage: 81.0, rate: 81.0, color: '#3D74BF' },
  { stage: 'Interacted / Replied', count: 6150320, percentage: 22.0, rate: 22.0, color: '#138808' },
  { stage: 'Action / Portal Redirect', count: 3840000, percentage: 13.7, rate: 13.7, color: '#FF9933' }
];

export const mockWhatsAppGroups: WhatsAppGroupEntity[] = [
  { id: 'wag-01', name: 'UP Farmers Welfare Network — Western Cluster', district: 'Meerut', constituencyName: 'Meerut Cantt (047)', mandalName: 'Meerut Sadar', membersCount: 1024, dailyMessages: 42, messagesSentWeek: 42, engagementRate: 46.5, engagementScore: 46.5, topTopic: 'PM-Kisan & Sugarcane Mill Dues', adminContact: '+91 98370 •••••', status: 'Active' },
  { id: 'wag-02', name: 'Lucknow Civic Residents & RWA Council', district: 'Lucknow', constituencyName: 'Lucknow Central (174)', mandalName: 'Hazratganj', membersCount: 1024, dailyMessages: 38, messagesSentWeek: 38, engagementRate: 48.2, engagementScore: 48.2, topTopic: 'Waste Segregation & Park Maintenance', adminContact: '+91 94150 •••••', status: 'Active' },
  { id: 'wag-03', name: 'Varanasi Youth & Cultural Forum', district: 'Varanasi', constituencyName: 'Varanasi Cantt (390)', mandalName: 'Kashi Vidyapeeth', membersCount: 1020, dailyMessages: 34, messagesSentWeek: 34, engagementRate: 44.8, engagementScore: 44.8, topTopic: 'Skill India Rozgar Mela Schedules', adminContact: '+91 98390 •••••', status: 'Active' },
  { id: 'wag-04', name: 'Gorakhpur Industrial Workers & Artisans', district: 'Gorakhpur', constituencyName: 'Gorakhpur Urban (322)', mandalName: 'Gorakhpur Sadar', membersCount: 980, dailyMessages: 28, messagesSentWeek: 28, engagementRate: 41.0, engagementScore: 41.0, topTopic: 'GIDA MSME Credit Support', adminContact: '+91 91250 •••••', status: 'Active' },
  { id: 'wag-05', name: 'Prayagraj Competitive Students Forum', district: 'Prayagraj', constituencyName: 'Prayagraj North (262)', mandalName: 'Civil Lines', membersCount: 1024, dailyMessages: 45, messagesSentWeek: 45, engagementRate: 52.4, engagementScore: 52.4, topTopic: 'Free Coaching & Digital Library Access', adminContact: '+91 96210 •••••', status: 'Active' },
  { id: 'wag-06', name: 'Agra Tourism & Handicrafts Guild', district: 'Agra', constituencyName: 'Agra South (086)', mandalName: 'Tajganj', membersCount: 890, dailyMessages: 24, messagesSentWeek: 24, engagementRate: 38.6, engagementScore: 38.6, topTopic: 'Marble Inlay Export Incentives', adminContact: '+91 94120 •••••', status: 'Active' },
  { id: 'wag-07', name: 'Ayodhya Dham Pilgrimage Volunteer Cell', district: 'Ayodhya', constituencyName: 'Ayodhya (275)', mandalName: 'Ayodhya Sadar', membersCount: 1024, dailyMessages: 50, messagesSentWeek: 50, engagementRate: 54.2, engagementScore: 54.2, topTopic: 'Festival Traffic & Crowd Management', adminContact: '+91 97920 •••••', status: 'Active' },
  { id: 'wag-08', name: 'Bundelkhand Water Harvest Volunteers', district: 'Jhansi', constituencyName: 'Jhansi Nagar (222)', mandalName: 'Jhansi Sadar', membersCount: 760, dailyMessages: 20, messagesSentWeek: 20, engagementRate: 36.4, engagementScore: 36.4, topTopic: 'Check Dam Repair & Solar Pumps', adminContact: '+91 98380 •••••', status: 'Active' }
];

export const mockSmsKpis = {
  totalSent: 34704000,
  messagesSent: 34704000,
  delivered: 33315840,
  deliveryRate: 96.0,
  failed: 1388160,
  directResponses: 3820000,
  responses: 3820000,
  responseRate: 11.0,
  dltApprovedTemplates: 64,
  optOuts: 18450,
  linkClicks: 4210000
};

export const mockSmsCampaigns: SmsCampaignEntity[] = [
  { id: 'sms-01', name: 'DLT-01: Polling Station Verification SMS', title: 'DLT-01: Polling Station Verification SMS', senderId: 'UPGOVT', dltTemplateId: '140716892301982', campaignType: 'Awareness', sent: 12500000, sentCount: 12500000, delivered: 12050000, deliveredCount: 12050000, failedCount: 450000, deliveryRate: 96.4, responses: 1680000, responsesCount: 1680000, responseRate: 13.4, linkClicks: 2150000, optOuts: 4450, date: '2026-10-04', timestamp: '2026-10-04', status: 'Delivered' },
  { id: 'sms-02', name: 'DLT-02: Kisan Samman Nidhi Disbursement Alert', title: 'DLT-02: Kisan Samman Nidhi Disbursement Alert', senderId: 'UPGOVT', dltTemplateId: '140716892302144', campaignType: 'Welfare Delivery', sent: 9800000, sentCount: 9800000, delivered: 9420000, deliveredCount: 9420000, failedCount: 380000, deliveryRate: 96.1, responses: 1240000, responsesCount: 1240000, responseRate: 12.6, linkClicks: 1120000, optOuts: 3200, date: '2026-10-03', timestamp: '2026-10-03', status: 'Delivered' },
  { id: 'sms-03', name: 'DLT-03: Youth Rojgar Mela Online Registration', title: 'DLT-03: Youth Rojgar Mela Online Registration', senderId: 'UPGOVT', dltTemplateId: '140716892303019', campaignType: 'Employment', sent: 6800000, sentCount: 6800000, delivered: 6510000, deliveredCount: 6510000, failedCount: 290000, deliveryRate: 95.7, responses: 680000, responsesCount: 680000, responseRate: 10.0, linkClicks: 740000, optOuts: 6400, date: '2026-10-02', timestamp: '2026-10-02', status: 'Delivered' },
  { id: 'sms-04', name: 'DLT-04: UP Toll-Free Civic Grievance Helpline', title: 'DLT-04: UP Toll-Free Civic Grievance Helpline', senderId: 'UPGOVT', dltTemplateId: '140716892304118', campaignType: 'Helpline', sent: 5604000, sentCount: 5604000, delivered: 5335840, deliveredCount: 5335840, failedCount: 268160, deliveryRate: 95.2, responses: 220000, responsesCount: 220000, responseRate: 3.9, linkClicks: 200000, optOuts: 4400, date: '2026-10-01', timestamp: '2026-10-01', status: 'Delivered' }
];

export const mockSocialKpis = {
  totalPosts: 384,
  posts: 384,
  totalReach: 58400000,
  reach: 58400000,
  totalImpressions: 114500000,
  impressions: 114500000,
  totalLikes: 4820000,
  likes: 4820000,
  totalComments: 684000,
  comments: 684000,
  totalShares: 1120000,
  shares: 1120000,
  totalVideoViews: 42800000,
  videoViews: 42800000,
  avgEngagementRate: 9.8,
  engagementRate: 9.8
};

export const mockSocialPlatformBreakdown = [
  { platform: 'YouTube', impressions: 48200000, reach: 24500000, engagement: 11.2, sharePercent: 42 },
  { platform: 'Facebook', impressions: 34500000, reach: 18200000, engagement: 9.4, sharePercent: 30 },
  { platform: 'Instagram', impressions: 21800000, reach: 11000000, engagement: 12.8, sharePercent: 19 },
  { platform: 'X / Twitter', impressions: 10000000, reach: 4700000, engagement: 6.8, sharePercent: 9 }
];

export const mockSocialPosts: SocialPostEntity[] = [
  { id: 'sp-01', platform: 'YouTube', title: 'Documentary: Transforming Expressway & Logistics Corridors in Eastern UP', postDate: '2026-10-03', publishedDate: '2026-10-03', impressions: 8400000, reach: 5200000, likes: 640000, comments: 89000, shares: 142000, views: 6800000, videoViews: 6800000, engagementRate: 10.4, topConstituencyImpact: 'Gorakhpur Urban (AC-322)' },
  { id: 'sp-02', platform: 'Instagram', title: 'Youth Skill Expo Lucknow 2026: 25,000+ First-Time Voter Certifications Awarded', postDate: '2026-10-04', publishedDate: '2026-10-04', impressions: 4200000, reach: 2900000, likes: 480000, comments: 46000, shares: 98000, views: 3200000, videoViews: 3200000, engagementRate: 14.8, topConstituencyImpact: 'Lucknow Central (AC-174)' },
  { id: 'sp-03', platform: 'Facebook', title: 'Kashi Vishwanath Corridor & Heritage Tourism Impact Report 2026', postDate: '2026-10-02', publishedDate: '2026-10-02', impressions: 6100000, reach: 3900000, likes: 380000, comments: 72000, shares: 125000, views: 2400000, videoViews: 2400000, engagementRate: 9.4, topConstituencyImpact: 'Varanasi Cantt. (AC-390)' },
  { id: 'sp-04', platform: 'X / Twitter', title: 'Operational Update: Over 20.2M citizen phone dialogues completed across 403 UP ACs', postDate: '2026-10-05', publishedDate: '2026-10-05', impressions: 2800000, reach: 1800000, likes: 165000, comments: 24000, shares: 58000, views: 1800000, videoViews: 1800000, engagementRate: 7.2, topConstituencyImpact: 'Ayodhya (AC-275)' }
];

export const mockDigitalKpis = {
  websiteVisits: 14800000,
  uniqueVisitors: 9200000,
  campaignPageVisits: 7900000,
  ctaClicks: 3240000,
  whatsAppClicks: 1820000,
  callClicks: 940000,
  formSubmissions: 785000,
  conversions: 142800,
  conversionRate: 18.2
};

export const mockTrafficSources = [
  { source: 'WhatsApp Broadcast Links', visitors: 5820000, percent: 39.3 },
  { source: 'SMS Verified URLs', visitors: 4150000, percent: 28.0 },
  { source: 'Social Media Channels', visitors: 2840000, percent: 19.2 },
  { source: 'Direct & Organic Search', visitors: 1420000, percent: 9.6 },
  { source: 'Digital QR Code Displays', visitors: 570000, percent: 3.9 }
];

export const mockDigitalGtmEvents: DigitalGtmEvent[] = [
  { eventName: 'Voter Information Lookup', technicalEvent: 'gtm_voter_slip_view', category: 'Civic Navigation', totalTriggered: 3240000, uniqueUsers: 2840000, conversionImpact: 'High', lastFired: '2 mins ago' },
  { eventName: 'WhatsApp Community Redirect', technicalEvent: 'gtm_whatsapp_join_click', category: 'Outreach', totalTriggered: 1820000, uniqueUsers: 1650000, conversionImpact: 'High', lastFired: '4 mins ago' },
  { eventName: 'Toll-Free Helpline Dial Click', technicalEvent: 'gtm_helpline_call_click', category: 'Inquiry', totalTriggered: 940000, uniqueUsers: 880000, conversionImpact: 'Medium', lastFired: '7 mins ago' },
  { eventName: 'Volunteer Registration Form', technicalEvent: 'gtm_volunteer_submit', category: 'Mobilization', totalTriggered: 785000, uniqueUsers: 742000, conversionImpact: 'High', lastFired: '12 mins ago' },
  { eventName: 'Manifesto & Welfare Guide Download', technicalEvent: 'gtm_pdf_guide_download', category: 'Policy', totalTriggered: 1240000, uniqueUsers: 1080000, conversionImpact: 'Medium', lastFired: '15 mins ago' }
];

export const mockAiConversationInsights: ConversationTopicInsight[] = [
  {
    topic: 'Kisan Electricity & Solar Pump Support',
    volume: 384000,
    percentage: 30.7,
    sentimentBreakdown: { positive: 74, neutral: 18, negative: 8 },
    sampleFaq: 'What is the schedule for 24-hour agricultural power supply and PM-KUSUM subsidy?',
    commonConcern: 'Low voltage during evening irrigation slots in canal-tail villages.',
    actionRequired: 'Transmit rural feeder maintenance schedule via WhatsApp automated audio note.'
  },
  {
    topic: 'Pothole & Rural Road Connectivity',
    volume: 245000,
    percentage: 19.6,
    sentimentBreakdown: { positive: 58, neutral: 26, negative: 16 },
    sampleFaq: 'When will the village link road under PMGSY Phase IV be completed?',
    commonConcern: 'Heavy tractor movement during sugarcane crushing season damaging asphalt.',
    actionRequired: 'Escalate geo-tagged road coordinates to District PWD nodal officer.'
  },
  {
    topic: 'UP Scholarship & Education Welfare',
    volume: 218000,
    percentage: 17.4,
    sentimentBreakdown: { positive: 81, neutral: 14, negative: 5 },
    sampleFaq: 'How to complete Aadhaar biometric verification for post-matric scholarship?',
    commonConcern: 'Server timeout on scholarship portal during final submission deadline.',
    actionRequired: 'Provide direct link to CSC digital service centers in constituency.'
  },
  {
    topic: 'Jal Jeevan Mission Household Tap Water',
    volume: 184000,
    percentage: 14.7,
    sentimentBreakdown: { positive: 76, neutral: 18, negative: 6 },
    sampleFaq: 'When will household pipeline connections be functional in our gram panchayat?',
    commonConcern: 'Water pressure low during summer peak hours.',
    actionRequired: 'Dispatch pipeline inspection team confirmation code via SMS.'
  },
  {
    topic: 'Youth Apprenticeship & Rozgar Mela',
    volume: 124000,
    percentage: 9.9,
    sentimentBreakdown: { positive: 84, neutral: 12, negative: 4 },
    sampleFaq: 'Where is the upcoming district employment mela scheduled?',
    commonConcern: 'Need more technical training seats in government ITIs.',
    actionRequired: 'Send notification regarding upcoming job fairs in Lucknow, Kanpur, and Varanasi.'
  },
  {
    topic: 'Ayushman Bharat Golden Card Verification',
    volume: 95000,
    percentage: 7.7,
    sentimentBreakdown: { positive: 78, neutral: 16, negative: 6 },
    sampleFaq: 'Which empanelled private hospitals in our district accept cashless treatment?',
    commonConcern: 'Name mismatch on ration card versus Aadhaar.',
    actionRequired: 'Direct voter to nearest Community Health Center e-Kendra operator.'
  }
];

export const mockReports: ReportEntity[] = [
  { id: 'rep-01', type: 'State Executive Report', title: 'Comprehensive State Outreach & Campaign Audit', description: 'Consolidated performance across all 403 constituencies, 75 districts, and active campaigns in Uttar Pradesh.', period: 'Last 30 Days (Sep - Oct 2026)', generatedDate: '2026-10-05 06:00', fileSize: '4.8 MB', status: 'Ready', format: 'PDF' },
  { id: 'rep-02', type: 'District Report', title: '75-District Operational Benchmarking Dossier', description: 'Cross-district comparison of reach, calling completion rates, and voter response indices across UP.', period: 'Current Campaign Cycle', generatedDate: '2026-10-05 07:15', fileSize: '9.4 MB', status: 'Ready', format: 'EXCEL' },
  { id: 'rep-03', type: 'Constituency Report', title: '403 Assembly Constituency Detailed Performance Register', description: 'Side-by-side analysis of reach, phone connection rates, and booth-level citizen engagement.', period: 'Current Campaign Cycle', generatedDate: '2026-10-04 18:30', fileSize: '12.8 MB', status: 'Ready', format: 'EXCEL' },
  { id: 'rep-04', type: 'Calling Agent Report', title: 'AI Voice Calling Agent Operational Metrics & Audio Sentiment', description: 'Connection rates by hour, duration histograms, outcomes, and callback resolution status across UP.', period: 'Last 7 Days', generatedDate: '2026-10-05 08:00', fileSize: '3.1 MB', status: 'Ready', format: 'PDF' },
  { id: 'rep-05', type: 'WhatsApp Report', title: 'WhatsApp Broadcasting & District Community Engagement', description: 'Community group activity levels, member reach, reply rates, and link click attribution.', period: 'Last 14 Days', generatedDate: '2026-10-03 12:00', fileSize: '2.4 MB', status: 'Ready', format: 'PDF' },
  { id: 'rep-06', type: 'SMS Report', title: 'TRAI DLT-Compliant SMS Campaign Delivery & Opt-out Audit', description: 'Template delivery efficiency, telecom circle failure analysis, and citizen replies.', period: 'September 2026', generatedDate: '2026-10-01 09:15', fileSize: '1.9 MB', status: 'Ready', format: 'EXCEL' },
  { id: 'rep-07', type: 'Social Engagement Report', title: 'Multi-Platform Video Views, Reach & Community Sentiment', description: 'Cross-platform metrics across YouTube, Facebook, Instagram, and X in Uttar Pradesh.', period: 'Last 30 Days', generatedDate: '2026-10-02 16:45', fileSize: '5.2 MB', status: 'Ready', format: 'PDF' },
  { id: 'rep-08', type: 'Digital/GTM Report', title: 'GTM Event Conversion Funnel & Digital Citizen Attribution', description: 'Landing page journeys, call clicks, WhatsApp redirects, and volunteer registrations.', period: 'Last 14 Days', generatedDate: '2026-10-04 14:20', fileSize: '2.8 MB', status: 'Ready', format: 'PDF' },
  { id: 'rep-09', type: 'AI Insights Report', title: 'Citizen Voice & Conversation Topic Trend Analysis', description: 'Aggregate topic distribution, common concerns, and civic grievance resolution pipeline across 403 ACs.', period: 'Current Campaign Cycle', generatedDate: '2026-10-05 07:30', fileSize: '3.6 MB', status: 'Ready', format: 'PDF' },
  { id: 'rep-10', type: 'Geographic Report', title: 'Booth Coverage & Block Penetration Intelligence', description: 'Booth-level contact density, unreached pockets, and block resource allocation across 75 districts.', period: 'Last 30 Days', generatedDate: '2026-10-04 20:00', fileSize: '7.2 MB', status: 'Ready', format: 'EXCEL' }
];
