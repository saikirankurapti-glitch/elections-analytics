import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { Layers, Maximize2, Minimize2, RotateCcw, Info, Search, MapPin, X } from 'lucide-react';
import { UpAssemblyConstituency } from '../../services/providers/types';
import { constituencyDataProvider, geographicDataProvider } from '../../services/providers';
import { formatIndianNumber, formatPercent } from '../../utils/formatters';
import rawUpConstituenciesData from '../../data/upConstituenciesData.json';

interface UpStateMapProps {
  selectedAcNumber?: number | null;
  onSelectConstituency?: (ac: UpAssemblyConstituency) => void;
  heightClass?: string;
  activeDistrict?: string;
}

type MapColorMetric = 'activity' | 'reach' | 'calls' | 'engagement';

export const UpStateMap: React.FC<UpStateMapProps> = ({
  selectedAcNumber,
  onSelectConstituency,
  heightClass = 'h-[520px]',
  activeDistrict
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);

  const [activeMetric, setActiveMetric] = useState<MapColorMetric>('activity');
  const [constituencies, setConstituencies] = useState<UpAssemblyConstituency[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  // In-map search query state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Synchronous pre-indexed lookup map of all 403 constituencies
  const acLookup = useMemo(() => {
    const map = new Map<number, UpAssemblyConstituency>();
    // Default complete dataset of 403 ACs
    (rawUpConstituenciesData as unknown as UpAssemblyConstituency[]).forEach((item) => {
      map.set(item.constituencyNumber, item);
    });
    // Overlay dynamic state
    constituencies.forEach((item) => {
      map.set(item.constituencyNumber, item);
    });
    return map;
  }, [constituencies]);

  // Load constituency metadata
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      const list = await constituencyDataProvider.getAllConstituencies();
      if (isMounted) setConstituencies(list);
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered search results for autocomplete (supports AC#, Name, District)
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const all = Array.from(acLookup.values());
    const isNum = /^\d+$/.test(q);

    if (isNum) {
      const num = parseInt(q, 10);
      return all
        .filter((c) => c.constituencyNumber === num || String(c.constituencyNumber).startsWith(q))
        .slice(0, 8);
    }

    return all
      .filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        String(c.constituencyNumber).includes(q)
      )
      .slice(0, 8);
  }, [searchQuery, acLookup]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Determine polygon color based on active metric
  const getColor = (ac: UpAssemblyConstituency | undefined): string => {
    if (!ac) return '#CBD5E1';

    if (activeMetric === 'activity') {
      const status = ac.campaignOperations.status;
      if (status === 'High Activity') return '#0B1F3A'; // Navy 900
      if (status === 'Moderate Activity') return '#2A5899'; // Navy 600
      return '#8FAEE0'; // Light Navy
    }

    if (activeMetric === 'reach') {
      const r = ac.campaignOperations.reach;
      if (r > 140000) return '#0B1F3A';
      if (r > 105000) return '#1D4175';
      if (r > 80000) return '#3D74BF';
      return '#A6C3EE';
    }

    if (activeMetric === 'calls') {
      const calls = ac.campaignOperations.totalCalls;
      if (calls > 55000) return '#138808';
      if (calls > 40000) return '#46AE4E';
      if (calls > 28000) return '#7DC883';
      return '#C4E8C7';
    }

    // Engagement %
    const eng = ac.campaignOperations.engagementRate;
    if (eng >= 42.0) return '#E67E17';
    if (eng >= 38.0) return '#FF9933';
    if (eng >= 35.0) return '#FFAA52';
    return '#FFD9AD';
  };

  // Helper to build rich Leaflet tooltip HTML with demo badge
  const createConstituencyTooltipHtml = (
    ac: UpAssemblyConstituency | undefined,
    acNo: number,
    fallbackName: string
  ): string => {
    const name = ac ? ac.name : fallbackName;
    const district = ac ? ac.district : 'Uttar Pradesh';
    const category = ac ? ac.reservedCategory : 'GEN';

    if (!ac) {
      return `
        <div style="min-width: 210px; padding: 4px; font-family: inherit;">
          <div style="font-weight: 800; font-size: 12px; color: #FF9933; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px; margin-bottom: 6px;">
            AC ${acNo} — ${name}
          </div>
          <div style="font-size: 11px; color: #CBD5E1;">District: <strong>${district}</strong></div>
          <div style="font-size: 10px; color: #94A3B8; margin-top: 4px;">Official Election Data: Verified (ECI 2022)</div>
          <div style="font-size: 10px; color: #E2E8F0; margin-top: 2px;">Campaign Data: No campaign data available</div>
          <div style="margin-top: 6px; font-size: 9px; font-weight: 800; color: #FBBF24;">DEMO DATA</div>
        </div>
      `;
    }

    const ops = ac.campaignOperations;

    return `
      <div style="min-width: 235px; padding: 4px; font-family: inherit; line-height: 1.4;">
        <div style="border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px; margin-bottom: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 8px;">
            <span style="font-weight: 800; font-size: 13px; color: #FF9933;">AC ${ac.constituencyNumber} — ${name}</span>
            <span style="font-size: 9px; background: rgba(255,255,255,0.15); padding: 1px 5px; border-radius: 4px; color: #E2E8F0; font-weight: bold;">${category}</span>
          </div>
          <div style="font-size: 11px; color: #CBD5E1; margin-top: 2px;">
            District: <strong style="color: #FFFFFF;">${district}</strong>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 2.5px; font-size: 11px;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94A3B8;">Campaigns:</span>
            <strong style="color: #FFFFFF;">${ops.campaignsCount}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94A3B8;">People Reached:</span>
            <strong style="color: #FFFFFF;">${formatIndianNumber(ops.reach)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94A3B8;">Phone Calls:</span>
            <strong style="color: #FFFFFF;">${formatIndianNumber(ops.totalCalls)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94A3B8;">Connected Calls:</span>
            <strong style="color: #4ADE80;">${formatIndianNumber(ops.connectedCalls)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94A3B8;">WhatsApp Messages:</span>
            <strong style="color: #FFFFFF;">${formatIndianNumber(ops.whatsappMessages)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94A3B8;">SMS Messages:</span>
            <strong style="color: #FFFFFF;">${formatIndianNumber(ops.smsMessages)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94A3B8;">Engagement:</span>
            <strong style="color: #FF9933;">${formatPercent(ops.engagementRate)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 3px; margin-top: 2px; font-size: 10px;">
            <span style="color: #94A3B8;">Last Activity:</span>
            <span style="color: #E2E8F0; font-weight: 500;">${ops.lastActivity}</span>
          </div>
        </div>

        <div style="border-top: 1px solid rgba(255,255,255,0.15); padding-top: 4px; margin-top: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 9px;">
          <span style="font-weight: 800; color: #FBBF24; letter-spacing: 0.05em; text-transform: uppercase;">DEMO DATA</span>
          <span style="color: #FED7AA;">Click to open dossier →</span>
        </div>
      </div>
    `;
  };

  // Initialize Leaflet Map with OpenStreetMap Basemap (No CARTO, No API Key required)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Uttar Pradesh Center: [26.85, 80.95] (Lucknow)
      const map = L.map(mapContainerRef.current, {
        center: [26.85, 80.95],
        zoom: 7,
        minZoom: 6,
        maxZoom: 14,
        zoomControl: true,
        attributionControl: true
      });

      // Standard OpenStreetMap Basemap (100% Free, No API key, No CARTO watermark)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Load Real Uttar Pradesh 403-Constituency GeoJSON
    let isMounted = true;
    geographicDataProvider.getConstituencyGeoJson().then((geoData) => {
      if (!isMounted || !geoData) return;

      if (geojsonLayerRef.current) {
        map.removeLayer(geojsonLayerRef.current);
      }

      const layer = L.geoJSON(geoData, {
        style: (feature) => {
          const acNo = Number(feature?.properties?.AC_NO);
          const ac = acLookup.get(acNo);
          const isSelected = selectedAcNumber === acNo;
          const isDistrictMatch = activeDistrict && activeDistrict !== 'ALL'
            ? ac?.district.toLowerCase() === activeDistrict.toLowerCase()
            : true;

          return {
            fillColor: getColor(ac),
            weight: isSelected ? 3 : 1,
            opacity: 1,
            color: isSelected ? '#FF9933' : '#0B1F3A', // Dark navy borders, saffron when selected
            fillOpacity: isDistrictMatch ? 0.82 : 0.18
          };
        },
        onEachFeature: (feature, featureLayer) => {
          const acNo = Number(feature.properties.AC_NO);
          const acName = String(feature.properties.AC_NAME || '');
          const ac = acLookup.get(acNo);

          // Native Leaflet Tooltip with sticky mouse tracking (60fps, no flicker, no block)
          const tooltipHtml = createConstituencyTooltipHtml(ac, acNo, acName);
          featureLayer.bindTooltip(tooltipHtml, {
            sticky: true,
            className: 'up-constituency-tooltip',
            direction: 'auto',
            opacity: 0.98
          });

          featureLayer.on({
            mouseover: (e: L.LeafletMouseEvent) => {
              const layerTarget = e.target as L.Path;
              layerTarget.setStyle({
                weight: 3,
                color: '#FF9933', // Saffron highlight on hover
                fillOpacity: 0.92
              });
              if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layerTarget.bringToFront();
              }
            },
            mouseout: (e: L.LeafletMouseEvent) => {
              if (geojsonLayerRef.current) {
                geojsonLayerRef.current.resetStyle(e.target);
              }
            },
            click: (e: L.LeafletMouseEvent) => {
              const targetAc = acLookup.get(acNo) || ac;
              if (targetAc && onSelectConstituency) {
                onSelectConstituency(targetAc);
              }
              if (e.target && typeof (e.target as any).getBounds === 'function') {
                map.fitBounds((e.target as any).getBounds(), { maxZoom: 11, padding: [25, 25] });
              }
            }
          });
        }
      });

      layer.addTo(map);
      geojsonLayerRef.current = layer;
      setLoading(false);

      // Fit bounds to UP extent initially
      if (layer.getBounds().isValid() && !selectedAcNumber) {
        map.fitBounds(layer.getBounds(), { padding: [15, 15] });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [acLookup, activeMetric, activeDistrict, selectedAcNumber]);

  // Handle selected AC zoom & highlight
  useEffect(() => {
    if (!selectedAcNumber || !mapInstanceRef.current || !geojsonLayerRef.current) return;
    const ac = acLookup.get(selectedAcNumber);
    if (ac && ac.centroidLatitude && ac.centroidLongitude) {
      mapInstanceRef.current.setView([ac.centroidLatitude, ac.centroidLongitude], 10, {
        animate: true
      });
    }
  }, [selectedAcNumber, acLookup]);

  const resetView = () => {
    if (mapInstanceRef.current && geojsonLayerRef.current) {
      mapInstanceRef.current.fitBounds(geojsonLayerRef.current.getBounds(), { padding: [15, 15] });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);
  };

  const handleSelectSearchResult = (ac: UpAssemblyConstituency) => {
    setIsSearchOpen(false);
    setSearchQuery(`${ac.constituencyNumber} - ${ac.name}`);
    if (onSelectConstituency) {
      onSelectConstituency(ac);
    }
    if (mapInstanceRef.current && ac.centroidLatitude && ac.centroidLongitude) {
      mapInstanceRef.current.setView([ac.centroidLatitude, ac.centroidLongitude], 10, {
        animate: true
      });
    }
  };

  return (
    <div
      className={`relative w-full rounded-lg border border-slate-200 bg-white shadow-subtle overflow-hidden flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* Map Control Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-3.5 py-2 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-bold text-navy-900">
            <MapPin className="w-3.5 h-3.5 text-saffron" />
            <span>Uttar Pradesh 403 Assembly Constituencies</span>
          </div>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="hidden sm:inline text-[11px] text-slate-500 font-medium">
            OpenStreetMap Basemap & Official ECI Geometry
          </span>
        </div>

        {/* Search Bar + Color Metric Switcher */}
        <div className="flex items-center gap-2">
          {/* Quick Map Search Bar */}
          <div ref={searchContainerRef} className="relative">
            <div className="flex items-center bg-white border border-slate-200 rounded-md px-2 py-1 shadow-xs focus-within:ring-1 focus-within:ring-saffron focus-within:border-saffron">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder="Search 403 ACs (e.g. 174 Lucknow Central, Varanasi, Gorakhpur)..."
                className="w-44 sm:w-64 text-xs text-navy-900 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-md border border-slate-200 shadow-xl z-50 py-1 max-h-64 overflow-y-auto">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Matching UP Constituencies
                </div>
                {searchResults.map((ac) => (
                  <button
                    key={ac.id}
                    type="button"
                    onClick={() => handleSelectSearchResult(ac)}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 transition-colors flex items-center justify-between border-b border-slate-50 last:border-0"
                  >
                    <div>
                      <div className="font-bold text-navy-900 text-xs">
                        AC {ac.constituencyNumber} — {ac.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {ac.district} District • {ac.region}
                      </div>
                    </div>
                    <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                      {ac.reservedCategory}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color Metric Switcher */}
          <div className="hidden sm:inline-flex rounded-md shadow-xs bg-white border border-slate-200 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveMetric('activity')}
              className={`px-2 py-1 rounded font-medium transition-all ${
                activeMetric === 'activity' ? 'bg-navy-900 text-white' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Activity Level
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('reach')}
              className={`px-2 py-1 rounded font-medium transition-all ${
                activeMetric === 'reach' ? 'bg-navy-900 text-white' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Reach
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('calls')}
              className={`px-2 py-1 rounded font-medium transition-all ${
                activeMetric === 'calls' ? 'bg-navy-900 text-white' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Calls
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('engagement')}
              className={`px-2 py-1 rounded font-medium transition-all ${
                activeMetric === 'engagement' ? 'bg-navy-900 text-white' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Engagement
            </button>
          </div>

          {/* Action buttons */}
          <button
            onClick={resetView}
            className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 transition-colors"
            title="Reset Map Extent"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative flex-1 w-full bg-slate-50">
        <div ref={mapContainerRef} className={`w-full ${isFullscreen ? 'h-[calc(100vh-80px)]' : heightClass}`} />

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-20">
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-navy-900 border-t-saffron rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-semibold text-navy-900">Loading 403 Official UP Constituencies...</p>
              <p className="text-[10px] text-slate-500">Delimitation boundary geometries</p>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Bar */}
      <div className="bg-slate-50 border-t border-slate-200 px-3.5 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-navy-900 text-[11px]">Legend:</span>
          {activeMetric === 'activity' ? (
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-navy-900" /> High Activity
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2A5899]" /> Moderate Activity
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8FAEE0]" /> Optimizing
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px]">
              <span>Low</span>
              <div
                className={`w-20 h-2 rounded ${
                  activeMetric === 'calls'
                    ? 'bg-gradient-to-r from-[#C4E8C7] to-[#138808]'
                    : activeMetric === 'engagement'
                    ? 'bg-gradient-to-r from-[#FFD9AD] to-[#E67E17]'
                    : 'bg-gradient-to-r from-[#A6C3EE] to-[#0B1F3A]'
                }`}
              />
              <span>High Density</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <Info className="w-3.5 h-3.5 text-navy-700 shrink-0" />
          <span>OpenStreetMap Basemap • 403/403 UP Constituencies Active (No API Key Required)</span>
        </div>
      </div>
    </div>
  );
};
