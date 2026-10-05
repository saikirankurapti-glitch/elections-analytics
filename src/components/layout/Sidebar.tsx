import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Building,
  Target,
  PhoneCall,
  MessageSquare,
  Mail,
  Share2,
  Globe,
  Map,
  Sparkles,
  FileText,
  ShieldCheck,
  Settings,
  Database
} from 'lucide-react';
import { useFilters } from '../../context/FilterContext';
import { NavigationTab } from '../../types';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  section?: 'operations' | 'channels' | 'intelligence' | 'system';
}

const navItems: NavItem[] = [
  // Operations
  { id: 'dashboard', label: 'State Command Center', icon: LayoutDashboard, section: 'operations' },
  { id: 'constituencies', label: 'Constituency Intel', icon: MapPin, badge: '403', section: 'operations' },
  { id: 'districts', label: 'District Intel', icon: Building, badge: '75', section: 'operations' },
  { id: 'campaigns', label: 'Campaign Command', icon: Target, badge: '48', section: 'operations' },

  // Channels
  { id: 'calling-agent', label: 'Calling Agent', icon: PhoneCall, badge: 'Sample', section: 'channels' },
  { id: 'whatsapp', label: 'WhatsApp & Groups', icon: MessageSquare, section: 'channels' },
  { id: 'sms', label: 'SMS Outreach', icon: Mail, section: 'channels' },
  { id: 'social', label: 'Social Engagement', icon: Share2, section: 'channels' },
  { id: 'digital', label: 'Digital / GTM', icon: Globe, section: 'channels' },

  // Intelligence
  { id: 'geographic', label: 'Geographic Intel', icon: Map, badge: 'GIS', section: 'intelligence' },
  { id: 'ai-insights', label: 'AI Voice Insights', icon: Sparkles, section: 'intelligence' },
  { id: 'reports', label: 'Report Center', icon: FileText, section: 'intelligence' },

  // System
  { id: 'administration', label: 'Data Sources & ETL', icon: Database, section: 'system' },
  { id: 'settings', label: 'Hierarchy Config', icon: Settings, section: 'system' },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen } = useFilters();

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 max-w-[85vw] bg-navy-950 border-r border-navy-800 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain py-4 px-3 space-y-5">
          {/* Section: Operational Command */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Uttar Pradesh Operations
            </div>
            <nav className="space-y-1">
              {navItems.filter(item => item.section === 'operations').map(item => {
                const Icon = item.icon;
                const isActive =
                  activeTab === item.id ||
                  (item.id === 'constituencies' && activeTab === 'constituency-detail') ||
                  (item.id === 'campaigns' && activeTab === 'campaign-detail');
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-navy-850 text-white font-semibold border-l-3 border-saffron shadow-sm'
                        : 'text-slate-300 hover:bg-navy-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-saffron' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-saffron text-navy-950' : 'bg-navy-800 text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section: Communication Channels */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Outreach Channels
            </div>
            <nav className="space-y-1">
              {navItems.filter(item => item.section === 'channels').map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-navy-850 text-white font-semibold border-l-3 border-saffron shadow-sm'
                        : 'text-slate-300 hover:bg-navy-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-saffron' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 font-bold rounded">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section: Intelligence & Analysis */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Intelligence & Reports
            </div>
            <nav className="space-y-1">
              {navItems.filter(item => item.section === 'intelligence').map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-navy-850 text-white font-semibold border-l-3 border-saffron shadow-sm'
                        : 'text-slate-300 hover:bg-navy-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-saffron' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-saffron-500/20 text-saffron-300 font-bold rounded">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section: Data Sources & Administration */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Data & System
            </div>
            <nav className="space-y-1">
              {navItems.filter(item => item.section === 'system').map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-navy-850 text-white font-semibold border-l-3 border-saffron shadow-sm'
                        : 'text-slate-300 hover:bg-navy-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-saffron' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* State Telemetry Footer */}
        <div className="p-3 bg-navy-900/90 border-t border-navy-800">
          <div className="bg-navy-950/80 rounded-md p-2.5 border border-navy-800 text-[11px]">
            <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-igreen animate-pulse" />
                ECI Data Nodes
              </span>
              <span className="text-igreen font-bold">403/403</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              State: Uttar Pradesh • 75 Districts
            </p>
            <div className="w-full bg-navy-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-gradient-to-r from-igreen via-saffron to-navy-500 h-full w-[100%]" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
