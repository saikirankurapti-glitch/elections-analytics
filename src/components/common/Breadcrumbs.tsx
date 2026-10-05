import React from 'react';
import { ChevronRight, Home, MapPin, Target, Radio } from 'lucide-react';
import { useFilters } from '../../context/FilterContext';
import upConstituenciesData from '../../data/upConstituenciesData.json';

export const Breadcrumbs: React.FC = () => {
  const {
    activeTab,
    selectedConstituencyId,
    selectedCampaignId,
    resetToStateDashboard,
    setActiveTab
  } = useFilters();

  const selectedConstituency = selectedConstituencyId
    ? (upConstituenciesData as any[]).find(
        c =>
          c.id === selectedConstituencyId ||
          c.constituencyNumber === Number(selectedConstituencyId) ||
          c.id === `up-ac-${String(selectedConstituencyId).padStart(3, '0')}`
      )
    : null;

  const getChannelName = () => {
    switch (activeTab) {
      case 'calling-agent':
        return 'Calling Agent';
      case 'whatsapp':
        return 'WhatsApp Analytics';
      case 'sms':
        return 'SMS Outreach';
      case 'social':
        return 'Social Engagement';
      case 'digital':
        return 'Digital / GTM';
      case 'geographic':
        return 'Geographic Intelligence';
      case 'ai-insights':
        return 'AI Voice Insights';
      case 'reports':
        return 'Report Center';
      case 'constituencies':
        return 'All 403 Constituencies';
      case 'campaigns':
        return 'Campaign Registry';
      case 'administration':
        return 'Data Sources & Admin';
      default:
        return null;
    }
  };

  const channelName = getChannelName();

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-txt-secondary py-1 overflow-x-auto whitespace-nowrap">
      {/* State Root */}
      <button
        onClick={resetToStateDashboard}
        className="flex items-center gap-1 font-medium hover:text-navy-900 transition-colors text-navy-800"
      >
        <Home className="w-3.5 h-3.5 text-saffron" />
        <span>Uttar Pradesh</span>
      </button>

      {/* Constituency Level: Uttar Pradesh / Constituency 174 / Lucknow Central */}
      {selectedConstituency && (
        <>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <button
            onClick={() => setActiveTab('constituency-detail')}
            className={`flex items-center gap-1 font-medium transition-colors ${
              activeTab === 'constituency-detail' && !channelName
                ? 'text-navy-900 font-semibold cursor-default'
                : 'hover:text-navy-900 text-slate-600'
            }`}
          >
            <MapPin className="w-3 h-3 text-navy-700" />
            <span>Constituency {selectedConstituency.constituencyNumber}</span>
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="font-bold text-navy-900">
            {selectedConstituency.name}
          </span>
        </>
      )}

      {/* Channel / Module Level */}
      {channelName && (
        <>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="flex items-center gap-1 font-semibold text-navy-900">
            <Radio className="w-3 h-3 text-igreen" />
            <span>{channelName}</span>
          </span>
        </>
      )}
    </nav>
  );
};
