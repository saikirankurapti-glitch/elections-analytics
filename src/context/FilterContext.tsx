import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GlobalFilterState, NavigationTab } from '../types';

interface FilterContextType {
  filters: GlobalFilterState;
  setFilters: React.Dispatch<React.SetStateAction<GlobalFilterState>>;
  updateFilter: <K extends keyof GlobalFilterState>(key: K, value: GlobalFilterState[K]) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedConstituencyId: string | null;
  setSelectedConstituencyId: (id: string | null) => void;
  selectedCampaignId: string | null;
  setSelectedCampaignId: (id: string | null) => void;
  globalSearch: string;
  setGlobalSearch: (term: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  navigateToConstituency: (id: string) => void;
  navigateToCampaign: (id: string) => void;
  resetToStateDashboard: () => void;
}

const defaultFilters: GlobalFilterState = {
  stateId: 'up',
  electionId: 'up-vs-2022',
  constituencyId: 'ALL',
  campaignId: 'ALL',
  dateRange: 'LAST_30_DAYS'
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<GlobalFilterState>(defaultFilters);
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedConstituencyId, setSelectedConstituencyId] = useState<string | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const updateFilter = <K extends keyof GlobalFilterState>(key: K, value: GlobalFilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const navigateToConstituency = (id: string) => {
    setSelectedConstituencyId(id);
    updateFilter('constituencyId', id);
    setActiveTab('constituency-detail');
  };

  const navigateToCampaign = (id: string) => {
    setSelectedCampaignId(id);
    updateFilter('campaignId', id);
    setActiveTab('campaign-detail');
  };

  const resetToStateDashboard = () => {
    setSelectedConstituencyId(null);
    setSelectedCampaignId(null);
    updateFilter('constituencyId', 'ALL');
    updateFilter('campaignId', 'ALL');
    setActiveTab('dashboard');
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        updateFilter,
        activeTab,
        setActiveTab,
        selectedConstituencyId,
        setSelectedConstituencyId,
        selectedCampaignId,
        setSelectedCampaignId,
        globalSearch,
        setGlobalSearch,
        sidebarOpen,
        setSidebarOpen,
        navigateToConstituency,
        navigateToCampaign,
        resetToStateDashboard
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
