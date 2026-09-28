import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { StaticCampusLayer } from './StaticCampusLayer';
import { CampusBin, CampusZoneInfo, BuildingZone } from '../types';
import { CAMPUS_ZONES } from '../data/campusData';
import { 
  Trash2, 
  MapPin, 
  RotateCcw, 
  Compass, 
  Navigation,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Mail,
  Send,
  CheckCircle2,
  X,
  Search,
  ArrowRight,
  Eye,
  Layers,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CampusMapProps {
  bins: CampusBin[];
  selectedBin: CampusBin | null;
  onSelectBin: (bin: CampusBin | null) => void;
  userZone: BuildingZone;
  setUserZone: (zone: BuildingZone) => void;
  highlightedBinId?: string | null;
  onReportBin: (bin: CampusBin) => void;
}

export const getShortStationName = (bin: CampusBin): string => {
  const map: Record<string, string> = {
    'bin-kosi-1': 'Kosi Outside',
    'bin-bhagmati-1': 'Bhagmati Outside',
    'bin-brahma-1': 'Brahmaputra Outside',
    'bin-gangagirls-1': 'Ganga Girls Outside',
    'bin-nano-1': 'Nano / Clinic Outside',
    'bin-cse-1': 'CSE Dept Outside',
    'bin-ece-1': 'ECE Dept Outside',
    'bin-alak-1': 'Alak Nanda Outside',
    'bin-itlab-1': 'I.T. Lab Outside',
    'bin-sac-indoor-1': 'SAC Plaza Outside',
    'bin-sac-1': 'SAC Porch Outside',
    'bin-civil-1': 'Civil Dept Outside',
    'bin-main-1': 'Main Block Outside',
    'bin-lib-1': 'Library Outside',
    'bin-cafeteria-1': 'Canteen Outside',
    'bin-maingate-1': 'Main Gate Outside',
    'bin-physics-1': 'Physics Outside',
    'bin-chem-1': 'Chemistry Outside',
    'bin-kosi-ext-1': 'Kosi Ext Outside',
  };
  return map[bin.id] || bin.name.split(' ')[0] + ' Outside';
};

export const CampusMap: React.FC<CampusMapProps> = ({
  bins,
  selectedBin,
  onSelectBin,
  userZone,
  setUserZone,
  highlightedBinId,
  onReportBin,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'wet' | 'dry' | 'ewaste' | 'full'>('all');
  const [hoveredZone, setHoveredZone] = useState<CampusZoneInfo | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [highlightAllDustbins, setHighlightAllDustbins] = useState<boolean>(true);
  const [locatorSearch, setLocatorSearch] = useState<string>('');
  const [sidebarTab, setSidebarTab] = useState<'selected' | 'locator'>('selected');
  const [showMailModal, setShowMailModal] = useState<boolean>(false);
  const [mailCategory, setMailCategory] = useState<string>('bin-clearance');
  const [mailMessage, setMailMessage] = useState<string>('');
  const [mailSender, setMailSender] = useState<string>('');
  const [mailSubmitted, setMailSubmitted] = useState<boolean>(false);

  // References for touch pinch-to-zoom and pan calculations
  const mapViewportRef = useRef<HTMLDivElement>(null);
  const innerMapRef = useRef<HTMLDivElement>(null);
  const currentZoomRef = useRef<number>(1);
  const currentPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isInteractingRef = useRef<boolean>(false);
  const pinchStartDistRef = useRef<number | null>(null);
  const initialZoomRef = useRef<number>(1);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTapTimeRef = useRef<number>(0);
  const hasMovedSignificantRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);

  const MIN_ZOOM = 0.65;
  const MAX_ZOOM = 2.6;

  // Sync refs when committed state changes (from button clicks)
  useEffect(() => {
    currentZoomRef.current = zoomLevel;
    currentPanRef.current = panOffset;
  }, [zoomLevel, panOffset]);

  // Apply transform directly to inner map element via requestAnimationFrame
  const scheduleTransform = useCallback((x: number, y: number, z: number) => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      if (innerMapRef.current) {
        innerMapRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${z})`;
      }
      rafIdRef.current = null;
    });
  }, []);

  const handleZoomIn = () => {
    const next = Math.min(MAX_ZOOM, Number((zoomLevel + 0.25).toFixed(2)));
    currentZoomRef.current = next;
    setZoomLevel(next);
  };

  const handleZoomOut = () => {
    const next = Math.max(MIN_ZOOM, Number((zoomLevel - 0.25).toFixed(2)));
    currentZoomRef.current = next;
    if (next <= 1) {
      currentPanRef.current = { x: 0, y: 0 };
      setPanOffset({ x: 0, y: 0 });
    }
    setZoomLevel(next);
  };

  const handleResetZoom = () => {
    currentZoomRef.current = 1;
    currentPanRef.current = { x: 0, y: 0 };
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Touch Handlers for Pinch-to-Zoom and Drag-to-Pan on Mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      pinchStartDistRef.current = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      initialZoomRef.current = currentZoomRef.current;
      hasMovedSignificantRef.current = true;
      if (!isInteractingRef.current) {
        isInteractingRef.current = true;
        setIsInteracting(true);
      }
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      dragStartRef.current = { x: touch.clientX, y: touch.clientY };
      initialPanRef.current = { ...currentPanRef.current };
      hasMovedSignificantRef.current = false;

      // Double-tap detection
      const now = Date.now();
      if (now - lastTapTimeRef.current < 320) {
        const next = currentZoomRef.current < 1.35 ? 1.6 : 1;
        currentZoomRef.current = next;
        if (next <= 1) {
          currentPanRef.current = { x: 0, y: 0 };
          setPanOffset({ x: 0, y: 0 });
        }
        setZoomLevel(next);
        lastTapTimeRef.current = 0;
      } else {
        lastTapTimeRef.current = now;
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const scaleFactor = dist / pinchStartDistRef.current;
      const targetZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number((initialZoomRef.current * scaleFactor).toFixed(2))));
      currentZoomRef.current = targetZoom;
      if (targetZoom <= 1) {
        currentPanRef.current = { x: 0, y: 0 };
      }
      hasMovedSignificantRef.current = true;
      scheduleTransform(currentPanRef.current.x, currentPanRef.current.y, targetZoom);
    } else if (e.touches.length === 1 && currentZoomRef.current > 1.05) {
      const touch = e.touches[0];
      const dx = touch.clientX - dragStartRef.current.x;
      const dy = touch.clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        hasMovedSignificantRef.current = true;
        if (!isInteractingRef.current) {
          isInteractingRef.current = true;
          setIsInteracting(true);
        }
      }
      const maxPan = (currentZoomRef.current - 1) * 380;
      const newX = Math.max(-maxPan, Math.min(maxPan, initialPanRef.current.x + dx));
      const newY = Math.max(-maxPan, Math.min(maxPan, initialPanRef.current.y + dy));
      currentPanRef.current = { x: newX, y: newY };
      scheduleTransform(newX, newY, currentZoomRef.current);
    }
  };

  const handleTouchEnd = () => {
    pinchStartDistRef.current = null;
    if (isInteractingRef.current) {
      isInteractingRef.current = false;
      setIsInteracting(false);
    }
    setZoomLevel(currentZoomRef.current);
    setPanOffset(currentPanRef.current);
  };

  // Mouse pan handlers for desktop when zoomed in
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (currentZoomRef.current > 1.05) {
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      initialPanRef.current = { ...currentPanRef.current };
      isInteractingRef.current = true;
      setIsInteracting(true);
      hasMovedSignificantRef.current = false;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isInteractingRef.current && currentZoomRef.current > 1.05) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        hasMovedSignificantRef.current = true;
      }
      const maxPan = (currentZoomRef.current - 1) * 380;
      const newX = Math.max(-maxPan, Math.min(maxPan, initialPanRef.current.x + dx));
      const newY = Math.max(-maxPan, Math.min(maxPan, initialPanRef.current.y + dy));
      currentPanRef.current = { x: newX, y: newY };
      scheduleTransform(newX, newY, currentZoomRef.current);
    }
  };

  const handleMouseUp = () => {
    if (isInteractingRef.current) {
      isInteractingRef.current = false;
      setIsInteracting(false);
      setZoomLevel(currentZoomRef.current);
      setPanOffset(currentPanRef.current);
    }
  };

  // Native wheel listener for Ctrl/Cmd+scroll map zoom with preventDefault
  useEffect(() => {
    const el = mapViewportRef.current;
    if (!el) return;

    let wheelTimeout: ReturnType<typeof setTimeout> | null = null;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (!isInteractingRef.current) {
          isInteractingRef.current = true;
          setIsInteracting(true);
        }
        const delta = e.deltaY < 0 ? 0.15 : -0.15;
        const targetZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number((currentZoomRef.current + delta).toFixed(2))));
        currentZoomRef.current = targetZoom;
        if (targetZoom <= 1) {
          currentPanRef.current = { x: 0, y: 0 };
        }
        scheduleTransform(currentPanRef.current.x, currentPanRef.current.y, targetZoom);

        if (wheelTimeout) clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          isInteractingRef.current = false;
          setIsInteracting(false);
          setZoomLevel(currentZoomRef.current);
          setPanOffset(currentPanRef.current);
        }, 150);
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [scheduleTransform]);

  const handleZoneSelect = useCallback((zone: BuildingZone) => {
    if (hasMovedSignificantRef.current) return;
    setUserZone(zone);
  }, [setUserZone]);

  const currentUserZoneInfo = CAMPUS_ZONES.find((z) => z.id === userZone) || CAMPUS_ZONES[0];

  // Map user location coordinates on 720 x 1040 canvas
  const userCoords = {
    x: ((currentUserZoneInfo.coords.x + currentUserZoneInfo.coords.width / 2) / 100) * 720,
    y: ((currentUserZoneInfo.coords.y + currentUserZoneInfo.coords.height / 2) / 100) * 1040,
  };

  // Calculate distance in meters & walking time from user's current location to each bin
  const rankedBins = useMemo(() => {
    const userCenter = {
      x: currentUserZoneInfo.coords.x + currentUserZoneInfo.coords.width / 2,
      y: currentUserZoneInfo.coords.y + currentUserZoneInfo.coords.height / 2,
    };

    return bins
      .map((bin) => {
        const dx = (bin.coords.x - userCenter.x) * 2.2;
        const dy = (bin.coords.y - userCenter.y) * 1.8;
        const approxMeters = Math.max(10, Math.round(Math.sqrt(dx * dx + dy * dy) * 1.8));
        const approxSeconds = Math.max(15, Math.round(approxMeters * 0.8));
        return {
          ...bin,
          distanceMeters: approxMeters,
          walkingSeconds: approxSeconds,
        };
      })
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }, [bins, currentUserZoneInfo]);

  // Filter bins based on selected filter
  const filteredBins = useMemo(() => {
    return bins.filter((bin) => {
      if (filterType === 'wet') return bin.hasWet;
      if (filterType === 'dry') return bin.hasDry;
      if (filterType === 'ewaste') return bin.hasEwaste;
      if (filterType === 'full') return bin.fillLevel >= 80 || bin.status === 'full';
      return true;
    });
  }, [bins, filterType]);

  // Find nearest dustbin
  const handleFindNearestDustbin = () => {
    if (rankedBins.length > 0) {
      onSelectBin(rankedBins[0]);
      setSidebarTab('selected');
    }
  };

  const selectedBinCoords = selectedBin && selectedBin.coords
    ? {
        x: (selectedBin.coords.x / 100) * 720,
        y: (selectedBin.coords.y / 100) * 1040,
      }
    : null;

  const isSelectedBinVisible = !selectedBin || filteredBins.some((b) => b.id === selectedBin.id);

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full max-w-full min-w-0">
      {/* Map Main Canvas Area */}
      <div className="flex-1 bg-white rounded-lg p-3 sm:p-6 border border-stone-200 shadow-2xs flex flex-col min-w-0 max-w-full">
        {/* Map Header & Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-editorial tracking-tight">
                NIT Patna Main Campus — Infrastructure &amp; Dustbin Directory
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200 font-mono-code">
                {filteredBins.length} mapped
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Live master plan aligned with the official campus layout. Tap any zone to update your location or inspect stations.
            </p>
          </div>

          {/* Placement Standard Banner */}
          <div className="w-full sm:w-auto flex items-center gap-2 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-md text-[11px] text-stone-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#134E3A] shrink-0"></span>
            <span>
              <strong>Campus Standard:</strong> Wet &amp; Dry pairs are installed <strong>at building entrances</strong>. <strong>SAC Building</strong> features designated indoor segregation.
            </span>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1 bg-stone-100 p-1 rounded-md border border-stone-200 text-xs">
            <button
              id="filter-all-bins"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Stations ({bins.length})
            </button>
            <button
              id="filter-wet-bins"
              onClick={() => setFilterType('wet')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                filterType === 'wet'
                  ? 'bg-[#134E3A] text-white shadow-2xs'
                  : 'text-emerald-800 hover:bg-stone-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              Wet / Organic
            </button>
            <button
              id="filter-dry-bins"
              onClick={() => setFilterType('dry')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                filterType === 'dry'
                  ? 'bg-sky-700 text-white shadow-2xs'
                  : 'text-sky-800 hover:bg-stone-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block"></span>
              Dry / Recyclable
            </button>
            <button
              id="filter-ewaste-bins"
              onClick={() => setFilterType('ewaste')}
              className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                filterType === 'ewaste'
                  ? 'bg-stone-800 text-white shadow-2xs'
                  : 'text-stone-700 hover:bg-stone-200/60'
              }`}
            >
              E-Waste
            </button>
            <button
              id="filter-full-bins"
              onClick={() => setFilterType('full')}
              className={`flex items-center gap-1 px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                filterType === 'full'
                  ? 'bg-rose-700 text-white shadow-2xs'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              Full / Alert
            </button>
          </div>
        </div>

        {/* Current Location & Map Controls Bar */}
        <div className="py-2.5 px-3 my-3 rounded-lg bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="flex items-center gap-1 font-semibold text-stone-700 shrink-0">
              <Navigation className="w-3.5 h-3.5 text-[#134E3A]" />
              My Current Location:
            </span>
            <select
              id="select-user-zone"
              value={userZone}
              onChange={(e) => setUserZone(e.target.value as BuildingZone)}
              className="bg-white border border-stone-300 rounded px-2.5 py-1 text-xs font-bold text-stone-800 focus:outline-hidden focus:border-[#134E3A] cursor-pointer shadow-2xs truncate max-w-[145px] sm:max-w-xs font-mono-code"
            >
              {CAMPUS_ZONES.map((zone) => (
                <option key={zone.id} value={zone.id} title={zone.name}>
                  {zone.shortName || zone.name}
                </option>
              ))}
            </select>

            {/* Quick action: Locate Nearest Dustbin */}
            <button
              id="btn-find-nearest-dustbin"
              onClick={handleFindNearestDustbin}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
              title="Instantly locate and route to the closest dustbin from your current building"
            >
              <Navigation className="w-3.5 h-3.5 fill-current" />
              <span>Nearest Dustbin</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Toggle Highlight Dustbins */}
            <button
              id="btn-toggle-highlight-dustbins"
              onClick={() => setHighlightAllDustbins((v) => !v)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border transition-colors cursor-pointer ${
                highlightAllDustbins
                  ? 'bg-emerald-50 text-[#134E3A] border-emerald-300 font-semibold'
                  : 'bg-white text-stone-600 border-stone-200'
              }`}
              title="Toggle radar beacon rings around all mapped dustbins"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Glow Pins</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center bg-white border border-stone-200 rounded p-0.5 shadow-2xs">
              <button
                id="btn-zoom-out"
                onClick={handleZoomOut}
                disabled={zoomLevel <= MIN_ZOOM}
                className="p-1 text-stone-600 hover:bg-stone-100 active:bg-stone-200 rounded disabled:opacity-40 cursor-pointer"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="px-1.5 text-[11px] font-bold text-stone-700 hover:text-emerald-700 cursor-pointer select-none font-mono-code"
                title="Click to reset zoom to 100%"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                id="btn-zoom-in"
                onClick={handleZoomIn}
                disabled={zoomLevel >= MAX_ZOOM}
                className="p-1 text-stone-600 hover:bg-stone-100 active:bg-stone-200 rounded disabled:opacity-40 cursor-pointer"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-zoom-reset"
                onClick={handleResetZoom}
                className="p-1 text-stone-600 hover:bg-stone-100 active:bg-stone-200 rounded ml-0.5 cursor-pointer"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              id="btn-toggle-labels"
              onClick={() => setShowLabels((v) => !v)}
              className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors cursor-pointer ${
                showLabels
                  ? 'bg-emerald-50 text-[#134E3A] border-emerald-300 font-semibold'
                  : 'bg-white text-stone-600 border-stone-200'
              }`}
            >
              Building Badges
            </button>

            {/* Campus Sanitation Desk (Envelope / Mail) Button */}
            <button
              id="btn-campus-mail"
              onClick={() => {
                setMailSubmitted(false);
                setShowMailModal(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 transition-colors shadow-2xs cursor-pointer"
              title="Contact Sanitation Desk / Send Mail Feedback"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span>Mail Desk</span>
            </button>
          </div>
        </div>

        {/* Quick Dustbin Locator Strip */}
        <div className="bg-stone-100/90 rounded-lg p-2 mb-3 border border-stone-200 w-full max-w-full min-w-0 overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-600 mb-1.5 px-1">
            <span className="flex items-center gap-1.5 font-mono-code">
              <Trash2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>QUICK LOCATE DUSTBINS ({bins.length} STATIONS):</span>
            </span>
            <span className="text-[10px] text-stone-400 font-normal">Click to highlight &amp; draw walking route</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar touch-pan-x overscroll-x-contain">
            {rankedBins.map((bin) => {
              const isSelected = selectedBin?.id === bin.id;
              const shortName = getShortStationName(bin);
              return (
                <button
                  key={bin.id}
                  id={`quick-locate-bin-${bin.id}`}
                  onClick={() => {
                    onSelectBin(bin);
                    setSidebarTab('selected');
                  }}
                  className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-xs scale-105 ring-2 ring-emerald-400'
                      : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-300 shadow-2xs'
                  }`}
                  title={`Locate ${bin.name} (~${bin.distanceMeters}m away from ${currentUserZoneInfo.shortName})`}
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      bin.fillLevel >= 80
                        ? 'bg-rose-500'
                        : bin.fillLevel >= 60
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <span>{shortName}</span>
                  <span className={`text-[10px] font-mono-code ${isSelected ? 'text-emerald-200' : 'text-stone-400'}`}>
                    ~{bin.distanceMeters}m
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SVG Campus Map Canvas */}
        <div 
          id="campus-map-interactive-viewport"
          ref={mapViewportRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`relative w-full max-w-3xl mx-auto rounded-xl overflow-hidden border-2 border-slate-900 bg-[#0c1f2e] shadow-xl select-none ${
            isInteracting ? 'is-interacting ' : ''
          }${
            zoomLevel > 1.05 ? (isInteracting ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
          }`}
          style={{ touchAction: zoomLevel > 1.05 ? 'none' : 'pan-y' }}
        >
          {/* Floating On-Map Mobile Zoom Controls (Always accessible, right on the map canvas) */}
          <div className="absolute bottom-3 right-3 z-30 flex flex-col items-center bg-white border border-stone-300/80 rounded-xl shadow-lg p-1 gap-1">
            <button
              id="map-floating-zoom-in"
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= MAX_ZOOM}
              aria-label="Zoom In"
              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-stone-50 hover:bg-stone-100 active:bg-stone-200 text-stone-800 disabled:opacity-35 transition-colors cursor-pointer"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-5 h-5 sm:w-4 sm:h-4 text-[#134E3A]" />
            </button>

            {/* Current Zoom Indicator */}
            <button
              type="button"
              onClick={handleResetZoom}
              aria-label="Reset zoom"
              className="px-1.5 py-0.5 text-[10px] sm:text-[11px] font-bold font-mono-code text-stone-700 hover:text-emerald-700 cursor-pointer text-center select-none"
              title="Click to reset zoom to 100%"
            >
              {Math.round(zoomLevel * 100)}%
            </button>

            <button
              id="map-floating-zoom-out"
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= MIN_ZOOM}
              aria-label="Zoom Out"
              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-stone-50 hover:bg-stone-100 active:bg-stone-200 text-stone-800 disabled:opacity-35 transition-colors cursor-pointer"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-5 h-5 sm:w-4 sm:h-4 text-[#134E3A]" />
            </button>

            <div className="w-full h-px bg-stone-200 my-0.5" />

            <button
              id="map-floating-zoom-reset"
              type="button"
              onClick={handleResetZoom}
              aria-label="Reset View"
              className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-stone-50 hover:bg-stone-100 active:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              title="Reset Zoom & Center View"
            >
              <RotateCcw className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>

          {/* Mobile Gestures Guidance Chip */}
          <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white text-[10px] text-stone-800 font-mono-code border border-stone-300 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Pinch 2 fingers to zoom &bull; Drag to pan</span>
            </span>
          </div>

          {/* Scaled & Panned Inner Map Container */}
          <div 
            ref={innerMapRef}
            className="w-full max-w-full mx-auto"
            style={{ 
              transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoomLevel})`,
              transformOrigin: 'center center',
              willChange: 'transform',
              transition: isInteracting ? 'none' : 'transform 0.2s ease-out'
            }}
          >
            <svg
              viewBox="0 0 720 1040"
              className="w-full h-auto block"
              style={{ shapeRendering: 'geometricPrecision' }}
            >
                            <StaticCampusLayer showLabels={showLabels} onZoneSelect={handleZoneSelect} />

{/* 6. ROUTE FROM USER TO SELECTED DUSTBIN                   */}
              {/* ======================================================== */}
              {selectedBinCoords && isSelectedBinVisible && (
                <g id="navigationRoute">
                  {/* Glowing underlay */}
                  <line
                    x1={userCoords.x}
                    y1={userCoords.y}
                    x2={selectedBinCoords.x}
                    y2={selectedBinCoords.y}
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeOpacity="0.3"
                    strokeLinecap="round"
                  />
                  {/* Animated walking path */}
                  <line
                    x1={userCoords.x}
                    y1={userCoords.y}
                    x2={selectedBinCoords.x}
                    y2={selectedBinCoords.y}
                    stroke="#059669"
                    strokeWidth="3.5"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                    className="animate-[dash_1.5s_linear_infinite]"
                  />
                </g>
              )}

              {/* ======================================================== */}
              {/* 7. DUSTBIN STATION PINS                                  */}
              {/* ======================================================== */}
              {filteredBins.map((bin) => {
                const bx = (bin.coords.x / 100) * 720;
                const by = (bin.coords.y / 100) * 1040;
                const isSelected = selectedBin?.id === bin.id;
                const isHighlighted = highlightedBinId === bin.id;
                const shortLabel = getShortStationName(bin);

                return (
                  <g
                    key={bin.id}
                    id={`map-bin-${bin.id}`}
                    transform={`translate(${bx}, ${by})`}
                    onClick={(e) => {
                      if (hasMovedSignificantRef.current) return;
                      e.stopPropagation();
                      onSelectBin(bin);
                      setSidebarTab('selected');
                    }}
                    className="cursor-pointer group"
                    style={{ transition: 'transform 0.2s ease-out' }}
                  >
                    {/* Glowing beacon ring */}
                    {(isSelected || isHighlighted || highlightAllDustbins) && (
                      <circle
                        cx="0"
                        cy="-12"
                        r={isSelected ? 26 : 18}
                        fill={isSelected ? (bin.fillLevel >= 80 ? '#f43f5e' : '#10b981') : '#0284c7'}
                        fillOpacity={isSelected ? 0.28 : 0.12}
                        stroke={isSelected ? (bin.fillLevel >= 80 ? '#f43f5e' : '#10b981') : '#38bdf8'}
                        strokeWidth={isSelected ? 2.5 : 1.2}
                        strokeDasharray={isSelected ? '4 3' : '2 2'}
                        className={isSelected ? 'animate-spin' : ''}
                        style={{ animationDuration: '4s' }}
                      />
                    )}

                    {/* DUSTBIN STATION GRAPHIC: Dual / Triple Physical Receptacles */}
                    <g transform="translate(0, -5)">
                      {/* Cheap offset dark shadow */}
                      <rect x="-18" y="0.5" width="36" height="4" rx="2" fill="#000000" opacity="0.35" />
                      {/* Concrete Station Foundation Pedestal */}
                      <rect x="-18" y="-1" width="36" height="4" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="0.8" />

                      {/* 1. GREEN WET WASTE RECEPTACLE (Left) */}
                      <g transform="translate(-16, -22)">
                        {/* Bin Body */}
                        <rect x="0" y="3" width="14" height="18" rx="2" fill="#15803d" stroke="#ffffff" strokeWidth="1" />
                        {/* Bin Lid */}
                        <rect x="-1" y="0" width="16" height="4" rx="1.5" fill="#166534" stroke="#ffffff" strokeWidth="0.8" />
                        {/* Handle */}
                        <line x1="5" y1="-1" x2="9" y2="-1" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
                        {/* Front Label W */}
                        <rect x="2.5" y="8" width="9" height="8" rx="1.5" fill="#14532d" />
                        <text x="7" y="14.5" fill="#86efac" textAnchor="middle" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">
                          W
                        </text>
                      </g>

                      {/* 2. BLUE DRY WASTE RECEPTACLE (Right) */}
                      <g transform="translate(2, -22)">
                        {/* Bin Body */}
                        <rect x="0" y="3" width="14" height="18" rx="2" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
                        {/* Bin Lid */}
                        <rect x="-1" y="0" width="16" height="4" rx="1.5" fill="#0369a1" stroke="#ffffff" strokeWidth="0.8" />
                        {/* Handle */}
                        <line x1="5" y1="-1" x2="9" y2="-1" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
                        {/* Front Label D */}
                        <rect x="2.5" y="8" width="9" height="8" rx="1.5" fill="#0c4a6e" />
                        <text x="7" y="14.5" fill="#bae6fd" textAnchor="middle" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">
                          D
                        </text>
                      </g>

                      {/* 3. OPTIONAL E-WASTE BOX (for CSE, SAC, IT-Lab, ECE) */}
                      {bin.hasEwaste && (
                        <g transform="translate(-5, -29)">
                          <rect x="0" y="0" width="10" height="7" rx="1.5" fill="#090d16" stroke="#f59e0b" strokeWidth="0.8" />
                          <text x="5" y="5.5" fill="#fcd34d" textAnchor="middle" fontSize="5.5" fontWeight="bold">
                            ⚡E
                          </text>
                        </g>
                      )}

                      {/* Fill Level Status Pill */}
                      <g transform="translate(15, -26)">
                        <circle
                          cx="0"
                          cy="0"
                          r="5.5"
                          fill={bin.fillLevel >= 80 ? '#e11d48' : bin.fillLevel >= 55 ? '#f59e0b' : '#10b981'}
                          stroke="#ffffff"
                          strokeWidth="1.2"
                        />
                        <text x="0" y="2.5" fill="#ffffff" textAnchor="middle" fontSize="5" fontWeight="bold">
                          {bin.fillLevel >= 80 ? '!' : `${bin.fillLevel}%`}
                        </text>
                      </g>
                    </g>

                    {/* DUSTBIN STATION LABEL BADGE */}
                    <g transform="translate(0, 9)">
                      {/* Cheap offset dark shadow */}
                      <rect x="-46" y="1.5" width="92" height="17" rx="4.5" fill="#000000" opacity="0.35" />
                      <rect
                        x="-46"
                        y="0"
                        width="92"
                        height="17"
                        rx="4.5"
                        fill={isSelected ? '#0f172a' : '#1e293b'}
                        stroke={isSelected ? '#34d399' : isHighlighted ? '#38bdf8' : '#64748b'}
                        strokeWidth={isSelected ? '2' : '1'}
                      />
                      {/* Waste type color dots */}
                      <circle cx="-37" cy="8.5" r="2.5" fill="#16a34a" />
                      <circle cx="-30" cy="8.5" r="2.5" fill="#2563eb" />
                      {bin.hasEwaste && <circle cx="-23" cy="8.5" r="2.5" fill="#f59e0b" />}

                      <text
                        x={bin.hasEwaste ? '8' : '4'}
                        y="12"
                        fill="#ffffff"
                        textAnchor="middle"
                        className="text-[8px] font-extrabold tracking-wide"
                      >
                        {shortLabel}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* ======================================================== */}
              {/* 8. USER CURRENT LOCATION PIN                             */}
              {/* ======================================================== */}
              <g id="userCurrentLocationPin" transform={`translate(${userCoords.x}, ${userCoords.y})`}>
                {/* Radar Waves */}
                <circle cx="0" cy="0" r="24" fill="#6366f1" opacity="0.2" className="animate-ping" />
                <circle cx="0" cy="0" r="14" fill="#6366f1" opacity="0.4" />
                <circle cx="0" cy="0" r="8" fill="#4f46e5" stroke="#ffffff" strokeWidth="2.5" />
                {/* Floating User Tooltip */}
                <g transform="translate(0, -26)">
                  {/* Cheap offset dark shadow */}
                  <rect x="-48" y="-16.5" width="96" height="20" rx="5" fill="#000000" opacity="0.35" />
                  <rect x="-48" y="-18" width="96" height="20" rx="5" fill="#4338ca" stroke="#c7d2fe" strokeWidth="1" />
                  <text x="0" y="-5" fill="#ffffff" textAnchor="middle" className="text-[9px] font-extrabold tracking-wide">
                    📍 YOU ARE HERE
                  </text>
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* Map Bottom Legend Strip */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-bold text-slate-800">Station Legend:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-linear-to-r from-emerald-500 to-sky-500 border border-white inline-block shadow-2xs"></span>
              <span className="font-semibold text-slate-800">Twin Station: Wet (Green) + Dry (Blue) Paired Together</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-800 border border-white inline-block shadow-2xs"></span>
              <span className="font-semibold text-slate-800">E-Waste Box (Black)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-semibold text-[11px] border border-emerald-200/60">
              <span>📍 All Dustbins Located Outside Buildings (Entrances &amp; Walkways)</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Click any building or bin marker to explore</span>
          </div>
        </div>
      </div>

      {/* Dustbin Locator & Inspector Sidebar */}
      <div className="w-full xl:w-84 shrink-0 flex flex-col gap-4">
        {/* Mode Switcher Tabs */}
        <div className="flex bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
          <button
            id="tab-view-all-locator"
            onClick={() => setSidebarTab('locator')}
            className={`flex-1 py-1.5 px-3 rounded-md font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              sidebarTab === 'locator'
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/90'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>Campus Locator ({bins.length})</span>
          </button>
          <button
            id="tab-view-selected-bin"
            onClick={() => setSidebarTab('selected')}
            className={`flex-1 py-1.5 px-3 rounded-md font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              sidebarTab === 'selected'
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/90'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span className="truncate max-w-[120px]">
              {selectedBin ? getShortStationName(selectedBin) : 'Selected Bin'}
            </span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {sidebarTab === 'locator' || !selectedBin ? (
            /* Directory of all dustbins sorted by distance from current location */
            <motion.div
              key="locator-directory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg p-4 border border-stone-200 shadow-2xs flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-editorial">
                    Campus Dustbin Stations
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Distances from <strong>{currentUserZoneInfo.shortName}</strong>
                  </p>
                </div>
                <button
                  onClick={handleFindNearestDustbin}
                  className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded cursor-pointer transition-colors"
                >
                  ⚡ Nearest
                </button>
              </div>

              {/* Search input */}
              <div className="relative my-3">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search stations, buildings..."
                  value={locatorSearch}
                  onChange={(e) => setLocatorSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                />
              </div>

              {/* Ranked list of stations */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {rankedBins
                  .filter((b) => {
                    if (!locatorSearch.trim()) return true;
                    const q = locatorSearch.toLowerCase();
                    return (
                      b.name.toLowerCase().includes(q) ||
                      b.locationName.toLowerCase().includes(q) ||
                      b.landmark.toLowerCase().includes(q)
                    );
                  })
                  .map((bin) => {
                    const isSelected = selectedBin?.id === bin.id;
                    const shortName = getShortStationName(bin);
                    return (
                      <div
                        key={bin.id}
                        onClick={() => {
                          onSelectBin(bin);
                          setSidebarTab('selected');
                        }}
                        className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/90 border-emerald-400 ring-1 ring-emerald-400 shadow-2xs'
                            : 'bg-stone-50/70 hover:bg-stone-100 border-stone-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full shrink-0 bg-linear-to-r from-emerald-500 to-sky-500" />
                              <h4 className="text-xs font-bold text-stone-900 truncate">
                                {shortName}
                              </h4>
                            </div>
                            <p className="text-[11px] text-stone-500 truncate mt-0.5">
                              {bin.locationName}
                            </p>
                          </div>

                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 font-mono-code ${
                              bin.fillLevel >= 80
                                ? 'bg-rose-100 text-rose-800'
                                : bin.fillLevel >= 60
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {bin.fillLevel}%
                          </span>
                        </div>

                        {/* Walking distance and tags */}
                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-200/60 text-[11px]">
                          <span className="font-semibold text-emerald-800 font-mono-code flex items-center gap-1">
                            <Navigation className="w-3 h-3 text-emerald-600" />
                            ~{bin.distanceMeters}m ({bin.walkingSeconds}s walk)
                          </span>

                          <div className="flex items-center gap-1">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                              W
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-900 text-[10px] font-bold">
                              D
                            </span>
                            {bin.hasEwaste && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                                E
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key={selectedBin.id}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg p-5 border border-stone-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                {/* Back to All Dustbins Button */}
                <button
                  onClick={() => setSidebarTab('locator')}
                  className="mb-3 text-[11px] font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ArrowRight className="w-3 h-3 rotate-180" />
                  <span>View All {bins.length} Dustbins in Locator</span>
                </button>

                {/* Header */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-200">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono-code">
                        {selectedBin.floor}
                      </span>
                      <span className="text-[10px] font-mono-code text-stone-400">
                        #{selectedBin.id.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-stone-900 mt-1 font-editorial">
                      {selectedBin.name}
                    </h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      {selectedBin.locationName}
                    </p>
                  </div>

                  <div
                    className={`px-2.5 py-1 rounded text-xs font-bold font-mono-code shrink-0 border ${
                      selectedBin.fillLevel >= 85
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : selectedBin.fillLevel >= 60
                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                        : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    }`}
                  >
                    {selectedBin.fillLevel}% Full
                  </div>
                </div>

                {/* Distance Callout from Current Location */}
                {(() => {
                  const distInfo = rankedBins.find((b) => b.id === selectedBin.id);
                  if (!distInfo) return null;
                  return (
                    <div className="mt-3 p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-md text-xs text-emerald-950 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-emerald-900">
                        From <strong>{currentUserZoneInfo.shortName}</strong>:
                      </span>
                      <span className="font-bold font-mono-code text-emerald-800 flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        ~{distInfo.distanceMeters}m ({distInfo.walkingSeconds}s walk)
                      </span>
                    </div>
                  );
                })()}

                {/* Fill Level Meter */}
                <div className="my-4 bg-stone-50 p-3 rounded-md border border-stone-200">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-stone-700">Capacity &amp; Current Fill</span>
                    <span className="text-stone-500 font-mono-code">
                      {Math.round((selectedBin.fillLevel / 100) * selectedBin.capacityLiters)}L / {selectedBin.capacityLiters}L
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedBin.fillLevel}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className={`h-full ${
                        selectedBin.fillLevel >= 85
                          ? 'bg-rose-600'
                          : selectedBin.fillLevel >= 60
                          ? 'bg-amber-500'
                          : 'bg-emerald-600'
                      }`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1.5">
                    <span>Last cleared: {selectedBin.lastEmptied}</span>
                    <span className="font-medium">
                      {selectedBin.fillLevel < 80 ? 'In Service' : 'Clearing Required'}
                    </span>
                  </div>
                </div>

                {/* Supported Segregations */}
                <div className="mb-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Segregation Compartments:
                  </h4>
                  <div className="space-y-2">
                    {selectedBin.hasWet && (
                      <div className="flex items-center gap-2.5 p-2 rounded-md bg-emerald-50/70 border border-emerald-200 text-xs">
                        <div className="w-5 h-5 rounded bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          W
                        </div>
                        <div>
                          <div className="font-bold text-emerald-950">Green Bin: Wet / Biodegradable</div>
                          <div className="text-[11px] text-emerald-800">
                            Food scraps, canteen leftovers, leaves, tea waste
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedBin.hasDry && (
                      <div className="flex items-center gap-2.5 p-2 rounded-md bg-sky-50/70 border border-sky-200 text-xs">
                        <div className="w-5 h-5 rounded bg-sky-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          D
                        </div>
                        <div>
                          <div className="font-bold text-sky-950">Blue Bin: Dry / Recyclable</div>
                          <div className="text-[11px] text-sky-800">
                            Plastics, paper, cardboard, cans, stationery
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedBin.hasEwaste && (
                      <div className="flex items-center gap-2.5 p-2 rounded-md bg-stone-100 border border-stone-300 text-xs">
                        <div className="w-5 h-5 rounded bg-stone-800 text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                          E
                        </div>
                        <div>
                          <div className="font-bold text-stone-900">E-Waste Containment Box</div>
                          <div className="text-[11px] text-stone-600">
                            Batteries, cables, circuit boards, small peripherals
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Landmark directions */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-800 mb-4">
                  <div className="font-bold flex items-center gap-1 text-stone-900 mb-0.5">
                    <Compass className="w-3.5 h-3.5 text-stone-600" />
                    Station Position
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {selectedBin.landmark} ({selectedBin.floor})
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2 border-t border-stone-100">
                <button
                  id="btn-report-selected-bin"
                  onClick={() => onReportBin(selectedBin)}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  Report Full Station or Defect
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Official Campus Directive Card */}
        <div className="bg-[#134E3A] rounded-lg p-4 text-stone-100 border border-[#0F3E2E] shadow-2xs">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/15 px-1.5 py-0.5 rounded text-emerald-200">
              NIT Patna Directive
            </span>
          </div>
          <h4 className="text-sm font-bold font-editorial text-white leading-snug">
            Swachh Bharat Abhiyan Protocol
          </h4>
          <p className="text-xs text-stone-300 mt-1 leading-relaxed">
            Report overflowing bins directly to Estate Sanitation supervisory staff to maintain hygienic academic and hostel surroundings.
          </p>
        </div>
      </div>

      {/* Campus Sanitation & Feedback Mail Modal */}
      <AnimatePresence>
        {showMailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMailModal(false)}
              className="fixed inset-0 bg-stone-900/60"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 bg-white rounded-lg max-w-md w-full shadow-lg border border-stone-200 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-[#134E3A] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-white/15 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-editorial">Campus Sanitation Mail Desk</h3>
                  <p className="text-[11px] text-emerald-200">NIT Patna Estate Office &amp; Swachhata Cell</p>
                </div>
              </div>
              <button
                onClick={() => setShowMailModal(false)}
                className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              {mailSubmitted ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">Mail Dispatched to Sanitation Team</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Your request has been routed to <strong>sanitation@nitp.ac.in</strong> and the Campus Cleanliness Warden.
                  </p>
                  <button
                    onClick={() => setShowMailModal(false)}
                    className="mt-4 px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setMailSubmitted(true);
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Campus Location
                    </label>
                    <div className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{currentUserZoneInfo.name}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Message Topic
                    </label>
                    <select
                      value={mailCategory}
                      onChange={(e) => setMailCategory(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="bin-clearance">🚨 Request Urgent Dustbin Clearance / Overflowing</option>
                      <option value="new-bin">➕ Suggest New Dustbin Installation Spot</option>
                      <option value="broken-bin">🛠️ Report Damaged / Broken Dustbin</option>
                      <option value="feedback">🌱 Cleanliness Feedback / Suggestion for NITP</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Your Roll No / Email / Name
                    </label>
                    <input
                      type="text"
                      required
                      value={mailSender}
                      onChange={(e) => setMailSender(e.target.value)}
                      placeholder="e.g. 2106042 or student@nitp.ac.in"
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Details / Message
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={mailMessage}
                      onChange={(e) => setMailMessage(e.target.value)}
                      placeholder="Describe the issue, landmark, or suggestion..."
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowMailModal(false)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs shadow-indigo-600/30"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send Mail</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </div>
  );
};
