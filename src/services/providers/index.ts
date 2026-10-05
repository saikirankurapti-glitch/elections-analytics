// Implementation of Data Providers for ANALYTIX Uttar Pradesh
import upConstituenciesData from '../../data/upConstituenciesData.json';
import upDistrictsData from '../../data/upDistrictsData.json';
import {
  ElectionDataProvider,
  ConstituencyDataProvider,
  GeographicDataProvider,
  CampaignDataProvider,
  UpAssemblyConstituency,
  UpDistrictSummary
} from './types';

// In-memory typed cache
const typedConstituencies = upConstituenciesData as unknown as UpAssemblyConstituency[];
const typedDistricts = upDistrictsData as unknown as UpDistrictSummary[];

let cachedGeoJson: any = null;

export const electionDataProvider: ElectionDataProvider = {
  async getOfficialElectionData(acNumber: number) {
    const ac = typedConstituencies.find(c => c.constituencyNumber === acNumber);
    return Promise.resolve(ac?.electionInfo);
  },

  async getStateElectionSummary() {
    const totalElectors = typedConstituencies.reduce((acc, c) => acc + c.electionInfo.electors, 0);
    const avgTurnout = Number(
      (
        typedConstituencies.reduce((acc, c) => acc + c.electionInfo.turnoutPercent, 0) /
        typedConstituencies.length
      ).toFixed(2)
    );

    return Promise.resolve({
      totalAssemblyConstituencies: 403,
      totalElectors,
      overallTurnout: avgTurnout,
      assemblyTerm: '18th Uttar Pradesh Legislative Assembly',
      source: 'Election Commission of India (ECI)',
      lastSynced: '05 Oct 2026'
    });
  }
};

export const constituencyDataProvider: ConstituencyDataProvider = {
  async getAllConstituencies() {
    return Promise.resolve([...typedConstituencies]);
  },

  async getConstituencyByNumber(acNumber: number) {
    const ac = typedConstituencies.find(c => c.constituencyNumber === acNumber);
    return Promise.resolve(ac);
  },

  async getConstituencyById(id: string) {
    const ac = typedConstituencies.find(
      c => c.id === id || c.id === `up-ac-${String(id).padStart(3, '0')}`
    );
    return Promise.resolve(ac);
  },

  async searchConstituencies(query: string, district?: string) {
    let list = [...typedConstituencies];

    if (district && district !== 'ALL') {
      list = list.filter(c => c.district.toLowerCase() === district.toLowerCase());
    }

    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      const numQuery = Number(q.replace(/\D/g, ''));

      list = list.filter(c => {
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesDistrict = c.district.toLowerCase().includes(q);
        const matchesPC = c.parliamentaryConstituency.toLowerCase().includes(q);
        const matchesNumber = !isNaN(numQuery) && numQuery > 0 && c.constituencyNumber === numQuery;
        return matchesName || matchesDistrict || matchesPC || matchesNumber;
      });
    }

    return Promise.resolve(list);
  },

  async getDistricts() {
    return Promise.resolve([...typedDistricts]);
  }
};

export const geographicDataProvider: GeographicDataProvider = {
  async getConstituencyGeoJson() {
    if (cachedGeoJson) return cachedGeoJson;
    try {
      const res = await fetch('/data/up_assembly_constituencies.geojson');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      cachedGeoJson = await res.json();
      return cachedGeoJson;
    } catch (err) {
      console.error('Failed to load UP GeoJSON:', err);
      return null;
    }
  }
};

export const campaignDataProvider: CampaignDataProvider = {
  async getStateCampaignKpis() {
    const totalReach = typedConstituencies.reduce((acc, c) => acc + c.campaignOperations.reach, 0);
    const totalCalls = typedConstituencies.reduce((acc, c) => acc + c.campaignOperations.totalCalls, 0);
    const connectedCalls = typedConstituencies.reduce((acc, c) => acc + c.campaignOperations.connectedCalls, 0);
    const whatsapp = typedConstituencies.reduce((acc, c) => acc + c.campaignOperations.whatsappMessages, 0);
    const sms = typedConstituencies.reduce((acc, c) => acc + c.campaignOperations.smsMessages, 0);
    const responses = typedConstituencies.reduce((acc, c) => acc + c.campaignOperations.responses, 0);
    const followUps = typedConstituencies.reduce((acc, c) => acc + c.campaignOperations.followUps, 0);

    const avgEngagement = Number(
      (
        typedConstituencies.reduce((acc, c) => acc + c.campaignOperations.engagementRate, 0) /
        typedConstituencies.length
      ).toFixed(1)
    );

    return Promise.resolve({
      totalConstituencies: 403,
      activeCampaigns: 48,
      completedCampaigns: 32,
      peopleReached: totalReach,
      totalCalls,
      connectedCalls,
      whatsappMessages: whatsapp,
      smsMessages: sms,
      socialReach: Math.round(totalReach * 1.45),
      engagementRate: avgEngagement,
      responses,
      followUps,
      isDemoData: true,
      lastSynced: '05 Oct 2026 16:24 IST'
    });
  }
};
