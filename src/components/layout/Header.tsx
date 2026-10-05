import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  Bell,
  Menu,
  X,
  Layers,
  Calendar,
  CheckCircle2,
  ChevronDown,
  User,
  ShieldAlert,
  MapPin
} from 'lucide-react';
import { useFilters } from '../../context/FilterContext';
import rawUpConstituenciesData from '../../data/upConstituenciesData.json';

export const Header: React.FC = () => {
  const {
    filters,
    updateFilter,
    globalSearch,
    setGlobalSearch,
    sidebarOpen,
    setSidebarOpen,
    resetToStateDashboard,
    setSelectedConstituencyId,
    setActiveTab
  } = useFilters();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, title: 'ECI Data Ingestion', desc: '403 Assembly Constituencies verified against 2022 report.', time: '12m ago', unread: true },
    { id: 2, title: 'Geospatial Boundaries', desc: 'Post-2008 delimitation polygons loaded (100% pass).', time: '35m ago', unread: true },
    { id: 3, title: 'Campaign Telemetry Stream', desc: 'Sample telemetry stream active.', time: '1h ago', unread: false }
  ];

  // Search results for UP Constituencies
  const searchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return [];
    const isNum = /^\d+$/.test(q);
    if (isNum) {
      const num = parseInt(q, 10);
      return (rawUpConstituenciesData as any[])
        .filter((c) => c.constituencyNumber === num || String(c.constituencyNumber).startsWith(q))
        .slice(0, 8);
    }
    return (rawUpConstituenciesData as any[])
      .filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        String(c.constituencyNumber).includes(q)
      )
      .slice(0, 8);
  }, [globalSearch]);

  // Click outside to dismiss search results
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectConstituency = (ac: any) => {
    setSelectedConstituencyId(String(ac.constituencyNumber));
    setGlobalSearch(`${ac.constituencyNumber} - ${ac.name}`);
    setSearchDropdownOpen(false);
    setActiveTab('dashboard');
  };

  return (
    <header className="sticky top-0 z-40 bg-navy-900 border-b border-navy-800 text-white shadow-header">
      <div className="min-w-0 px-3 sm:px-5 lg:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4 overflow-hidden">
        {/* Left Section: Logo & Product Title */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-md hover:bg-navy-800 text-slate-300 hover:text-white transition-colors lg:hidden"
            aria-label="Toggle Navigation Sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={resetToStateDashboard}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Indian Public Sector Enterprise Emblem Symbol */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-navy-850 to-navy-950 border border-navy-700 flex items-center justify-center p-1.5 shadow-inner">
              <div className="relative w-full h-full flex items-center justify-center">
                <span className="text-saffron font-black text-lg tracking-tighter">A</span>
                <span className="w-1.5 h-1.5 rounded-full bg-igreen absolute top-0.5 right-0.5 ring-1 ring-navy-900" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-wider text-white uppercase font-sans">
                  ANALYTIX
                </h1>
                <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-widest bg-saffron-500/20 text-saffron-300 px-1.5 py-0.5 rounded border border-saffron-500/30">
                  Command Center
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-300 tracking-wide">
                State Campaign Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Center / Global Search with Autocomplete */}
        <div ref={searchContainerRef} className="hidden md:flex flex-1 min-w-0 max-w-lg mx-2 relative">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search 403 ACs (e.g. 174 Lucknow Central, Varanasi, Gorakhpur)..."
              value={globalSearch}
              onFocus={() => setSearchDropdownOpen(true)}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setSearchDropdownOpen(true);
              }}
              className="w-full pl-9 pr-8 py-1.5 bg-navy-950/70 border border-navy-700/80 rounded-md text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-saffron focus:border-saffron transition-all"
            />
            {globalSearch && (
              <button
                type="button"
                onClick={() => {
                  setGlobalSearch('');
                  setSearchDropdownOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {searchDropdownOpen && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-navy-900 border border-navy-700 rounded-md shadow-2xl z-50 py-1.5 max-h-72 overflow-y-auto">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-saffron-400 border-b border-navy-800">
                Uttar Pradesh Assembly Constituencies ({searchResults.length})
              </div>
              {searchResults.map((ac) => (
                <button
                  key={ac.id}
                  type="button"
                  onClick={() => handleSelectConstituency(ac)}
                  className="w-full text-left px-3 py-2 hover:bg-navy-800 transition-colors flex items-center justify-between border-b border-navy-800/40 last:border-0"
                >
                  <div>
                    <div className="font-bold text-white text-xs">
                      AC {ac.constituencyNumber} — {ac.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {ac.district} District • {ac.region}
                    </div>
                  </div>
                  <span className="text-[9px] bg-navy-950 text-slate-300 px-1.5 py-0.5 rounded font-mono border border-navy-700">
                    {ac.reservedCategory}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Section: Selectors, Notifications & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* State Selector: Uttar Pradesh Configured for 403 ACs */}
          <div className="hidden 2xl:flex items-center">
            <select
              aria-label="State Selector"
              value={filters.stateId}
              onChange={(e) => updateFilter('stateId', e.target.value)}
              className="bg-navy-800 text-xs font-semibold text-saffron-300 border border-navy-700 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-saffron cursor-pointer"
            >
              <option value="up" className="bg-navy-900 text-white font-bold">
                State: Uttar Pradesh (403 ACs)
              </option>
            </select>
          </div>

          {/* Election Selector */}
          <div className="hidden 2xl:flex items-center">
            <select
              aria-label="Election Selector"
              value={filters.electionId}
              onChange={(e) => updateFilter('electionId', e.target.value)}
              className="bg-navy-800 text-xs font-medium text-slate-200 border border-navy-700 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-saffron cursor-pointer max-w-[210px] truncate"
            >
              <option value="up-vs-2022" className="bg-navy-900 text-white">
                18th Vidhan Sabha (ECI 2022)
              </option>
              <option value="up-vs-2027" className="bg-navy-900 text-white">
                Upcoming Assembly Cycle 2027
              </option>
              <option value="up-bye-2024" className="bg-navy-900 text-white">
                By-Elections Phase II
              </option>
            </select>
          </div>

          {/* Sample Mode Badge */}
          <div className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Sample Mode
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileOpen(false);
              }}
              className="relative p-2 rounded-md hover:bg-navy-800 text-slate-300 hover:text-white transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-saffron ring-2 ring-navy-900" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-navy-900 border border-navy-700 rounded-lg shadow-xl py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-navy-800 flex items-center justify-between">
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                    System Verification
                  </span>
                  <span className="text-[10px] text-saffron font-medium">3 New</span>
                </div>
                <div className="divide-y divide-navy-800/60 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="px-4 py-2.5 hover:bg-navy-800/50 transition-colors">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-slate-200">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-md hover:bg-navy-800 text-slate-200 transition-colors"
              aria-label="User account settings"
            >
              <div className="w-7 h-7 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center text-xs font-bold text-saffron">
                AD
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-navy-900 border border-navy-700 rounded-lg shadow-xl py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-navy-800">
                  <p className="font-bold text-white">Campaign Administrator</p>
                  <p className="text-[11px] text-slate-400">admin@analytix.internal</p>
                  <p className="text-[10px] text-saffron-300 font-mono mt-0.5">UP-HQ-LUCKNOW</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      resetToStateDashboard();
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-1.5 text-slate-300 hover:bg-navy-800 hover:text-white"
                  >
                    State Command View
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('administration');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-1.5 text-slate-300 hover:bg-navy-800 hover:text-white"
                  >
                    Admin & Security
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
