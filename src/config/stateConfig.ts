// Central Source of Truth for ANALYTIX State Campaign Intelligence
// Configured specifically for Uttar Pradesh (403 ACs, 75 Districts)

export interface StateConfiguration {
  selectedState: string;
  stateCode: string;
  stateName: string;
  hindiName: string;
  assemblyConstituencyCount: number;
  districtCount: number;
  parliamentaryConstituencyCount: number;
  totalElectorsEstimate: number;
  capital: string;
  activeCycle: string;
  benchmarkElection: string;
  assemblyTerm: string;
  regions: string[];
  delimitationYear: number;
  boothsCount: number;
  isDemoData: boolean;
  officialDataSource: string;
  officialDataUrl: string;
  lastUpdated: string;
}

export const activeStateConfig: StateConfiguration = {
  selectedState: 'up',
  stateCode: 'UP',
  stateName: 'Uttar Pradesh',
  hindiName: 'उत्तर प्रदेश',
  assemblyConstituencyCount: 403,
  districtCount: 75,
  parliamentaryConstituencyCount: 80,
  totalElectorsEstimate: 153000000, // 15.3 Crore electors
  capital: 'Lucknow',
  activeCycle: 'General Assembly Pre-Campaign Cycle 2026-2027',
  benchmarkElection: '18th Vidhan Sabha Elections (ECI 2022)',
  assemblyTerm: '18th Uttar Pradesh Legislative Assembly',
  regions: [
    'Western UP',
    'Awadh Central',
    'Purvanchal / Eastern UP',
    'Bundelkhand',
    'Rohilkhand',
    'Braj'
  ],
  delimitationYear: 2008,
  boothsCount: 174351,
  isDemoData: true,
  officialDataSource: 'Election Commission of India (ECI)',
  officialDataUrl: 'https://results.eci.gov.in',
  lastUpdated: '05 Oct 2026'
};

export const getStateConfig = (): StateConfiguration => {
  return activeStateConfig;
};
