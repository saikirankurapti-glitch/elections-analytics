import React, { useState, useEffect } from 'react';
import { FilterProvider, useFilters } from './context/FilterContext';
import { AppShell } from './components/layout/AppShell';

// Pages
import { UpStateDashboard } from './pages/UpStateDashboard';
import { UpConstituencyDetail } from './pages/UpConstituencyDetail';
import { ConstituenciesPage } from './pages/ConstituenciesPage';
import { DistrictDashboardPage } from './pages/DistrictDashboardPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { CampaignDetail } from './pages/CampaignDetail';
import { CallingAgentPage } from './pages/CallingAgentPage';
import { WhatsAppDataPage } from './pages/WhatsAppDataPage';
import { SmsPage } from './pages/SmsPage';
import { SocialPage } from './pages/SocialPage';
import { DigitalGtmPage } from './pages/DigitalGtmPage';
import { GeographicPage } from './pages/GeographicPage';
import { AiInsightsPage } from './pages/AiInsightsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';

// Data Provider
import { constituencyDataProvider } from './services/providers';
import { UpAssemblyConstituency } from './services/providers/types';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedConstituencyId,
    setSelectedConstituencyId,
    resetToStateDashboard
  } = useFilters();

  const [currentAc, setCurrentAc] = useState<UpAssemblyConstituency | null>(null);

  // When selectedConstituencyId changes, fetch the corresponding UpAssemblyConstituency
  useEffect(() => {
    if (!selectedConstituencyId) {
      setCurrentAc(null);
      return;
    }
    const num = Number(selectedConstituencyId.replace(/\D/g, ''));
    if (!isNaN(num) && num > 0) {
      constituencyDataProvider.getConstituencyByNumber(num).then(ac => {
        if (ac) setCurrentAc(ac);
      });
    } else {
      constituencyDataProvider.getConstituencyById(selectedConstituencyId).then(ac => {
        if (ac) setCurrentAc(ac);
      });
    }
  }, [selectedConstituencyId]);

  const handleSelectConstituency = (ac: UpAssemblyConstituency) => {
    setCurrentAc(ac);
    setSelectedConstituencyId(String(ac.constituencyNumber));
    setActiveTab('constituency-detail');
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <UpStateDashboard
            onSelectConstituency={handleSelectConstituency}
            onNavigateToModule={mod => setActiveTab(mod as any)}
          />
        );

      case 'constituencies':
        return <ConstituenciesPage />;

      case 'districts':
        return <DistrictDashboardPage />;

      case 'constituency-detail':
        if (currentAc) {
          return (
            <UpConstituencyDetail
              constituency={currentAc}
              onBack={resetToStateDashboard}
            />
          );
        }
        return (
          <UpStateDashboard
            onSelectConstituency={handleSelectConstituency}
            onNavigateToModule={mod => setActiveTab(mod as any)}
          />
        );

      case 'campaigns':
        return <CampaignsPage />;

      case 'campaign-detail':
        return <CampaignDetail />;

      case 'calling-agent':
        return <CallingAgentPage />;

      case 'whatsapp':
        return <WhatsAppDataPage />;

      case 'sms':
        return <SmsPage />;

      case 'social':
        return <SocialPage />;

      case 'digital':
        return <DigitalGtmPage />;

      case 'geographic':
        return <GeographicPage />;

      case 'ai-insights':
        return <AiInsightsPage />;

      case 'reports':
        return <ReportsPage />;

      case 'administration':
      case 'settings':
        return <AdminSettingsPage />;

      default:
        return (
          <UpStateDashboard
            onSelectConstituency={handleSelectConstituency}
            onNavigateToModule={mod => setActiveTab(mod as any)}
          />
        );
    }
  };

  return <AppShell>{renderActiveScreen()}</AppShell>;
};

export default function App() {
  return (
    <FilterProvider>
      <AppContent />
    </FilterProvider>
  );
}
