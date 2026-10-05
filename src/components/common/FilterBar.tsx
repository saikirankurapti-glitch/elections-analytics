import React from 'react';
import { Filter, Calendar, MapPin, Target, Download, Check } from 'lucide-react';
import { useFilters } from '../../context/FilterContext';
import { mockStates, mockElections, mockConstituencies, mockCampaigns } from '../../data/mockData';

interface FilterBarProps {
  onExportClick?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onExportClick }) => {
  const { filters, updateFilter, selectedConstituencyId, setSelectedConstituencyId, selectedCampaignId, setSelectedCampaignId } = useFilters();

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-subtle mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-navy-900 border-r border-slate-200 pr-2.5">
            <Filter className="w-3.5 h-3.5 text-saffron-600" />
            <span>Filters</span>
          </div>

          {/* State Selector */}
          <div className="relative">
            <select
              aria-label="Select State"
              value={filters.stateId}
              onChange={(e) => updateFilter('stateId', e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900 focus:bg-white transition-all cursor-pointer"
            >
              {mockStates.map(state => (
                <option key={state.id} value={state.id}>
                  State: {state.name} ({state.totalConstituencies} ACs)
                </option>
              ))}
            </select>
          </div>

          {/* Election Selector */}
          <div className="relative">
            <select
              aria-label="Select Election"
              value={filters.electionId}
              onChange={(e) => updateFilter('electionId', e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900 focus:bg-white transition-all cursor-pointer max-w-[220px] truncate"
            >
              {mockElections.map(el => (
                <option key={el.id} value={el.id}>
                  {el.name}
                </option>
              ))}
            </select>
          </div>

          {/* Constituency Selector */}
          <div className="relative flex items-center">
            <MapPin className="w-3 h-3 text-slate-400 absolute left-2 pointer-events-none" />
            <select
              aria-label="Select Constituency"
              value={selectedConstituencyId || filters.constituencyId}
              onChange={(e) => {
                const val = e.target.value;
                updateFilter('constituencyId', val);
                setSelectedConstituencyId(val === 'ALL' ? null : val);
              }}
              className="pl-6 text-xs font-medium bg-slate-50 border border-slate-200 rounded-md pr-3 py-1.5 text-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900 focus:bg-white transition-all cursor-pointer"
            >
              <option value="ALL">All Constituencies (403)</option>
              {mockConstituencies.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} {c.name} ({c.district})
                </option>
              ))}
            </select>
          </div>

          {/* Campaign Selector */}
          <div className="relative flex items-center">
            <Target className="w-3 h-3 text-slate-400 absolute left-2 pointer-events-none" />
            <select
              aria-label="Select Campaign"
              value={selectedCampaignId || filters.campaignId}
              onChange={(e) => {
                const val = e.target.value;
                updateFilter('campaignId', val);
                setSelectedCampaignId(val === 'ALL' ? null : val);
              }}
              className="pl-6 text-xs font-medium bg-slate-50 border border-slate-200 rounded-md pr-3 py-1.5 text-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900 focus:bg-white transition-all cursor-pointer max-w-[200px] truncate"
            >
              <option value="ALL">All Campaigns (6 Active)</option>
              {mockCampaigns.map(cmp => (
                <option key={cmp.id} value={cmp.id}>
                  {cmp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Selector */}
          <div className="relative flex items-center">
            <Calendar className="w-3 h-3 text-slate-400 absolute left-2 pointer-events-none" />
            <select
              aria-label="Select Date Range"
              value={filters.dateRange}
              onChange={(e) => updateFilter('dateRange', e.target.value as any)}
              className="pl-6 text-xs font-medium bg-slate-50 border border-slate-200 rounded-md pr-3 py-1.5 text-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900 focus:bg-white transition-all cursor-pointer"
            >
              <option value="LAST_7_DAYS">Last 7 Days</option>
              <option value="LAST_14_DAYS">Last 14 Days</option>
              <option value="LAST_30_DAYS">Last 30 Days (Sep - Oct)</option>
              <option value="THIS_CAMPAIGN_CYCLE">This Campaign Cycle</option>
            </select>
          </div>
        </div>

        {/* Right Export Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onExportClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-white rounded-md text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-1"
          >
            <Download className="w-3.5 h-3.5 text-saffron" />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
