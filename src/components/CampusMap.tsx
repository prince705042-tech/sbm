import React, { useState } from 'react';
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
  X
} from 'lucide-react';

interface CampusMapProps {
  bins: CampusBin[];
  selectedBin: CampusBin | null;
  onSelectBin: (bin: CampusBin) => void;
  userZone: BuildingZone;
  setUserZone: (zone: BuildingZone) => void;
  highlightedBinId?: string | null;
  onReportBin: (bin: CampusBin) => void;
}

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
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showMailModal, setShowMailModal] = useState<boolean>(false);
  const [mailCategory, setMailCategory] = useState<string>('bin-clearance');
  const [mailMessage, setMailMessage] = useState<string>('');
  const [mailSender, setMailSender] = useState<string>('');
  const [mailSubmitted, setMailSubmitted] = useState<boolean>(false);

  // Filter bins based on selected filter
  const filteredBins = bins.filter((bin) => {
    if (filterType === 'wet') return bin.hasWet;
    if (filterType === 'dry') return bin.hasDry;
    if (filterType === 'ewaste') return bin.hasEwaste;
    if (filterType === 'full') return bin.fillLevel >= 80 || bin.status === 'full';
    return true;
  });

  const currentUserZoneInfo = CAMPUS_ZONES.find((z) => z.id === userZone) || CAMPUS_ZONES[0];

  // Map user location coordinates on 720 x 1040 canvas
  const userCoords = {
    x: ((currentUserZoneInfo.coords.x + currentUserZoneInfo.coords.width / 2) / 100) * 720,
    y: ((currentUserZoneInfo.coords.y + currentUserZoneInfo.coords.height / 2) / 100) * 1040,
  };

  const selectedBinCoords = selectedBin && selectedBin.coords
    ? {
        x: (selectedBin.coords.x / 100) * 720,
        y: (selectedBin.coords.y / 100) * 1040,
      }
    : null;

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Map Main Canvas Area */}
      <div className="flex-1 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col">
        {/* Map Header & Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
                NIT Patna Main Campus — Interactive Waste Bin Map
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {filteredBins.length} bins mapped
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Live master plan aligned with the official 3D aerial campus layout. Click any zone to change your spot or tap any bin to view details.
            </p>
          </div>

          {/* Placement Standard Banner */}
          <div className="w-full sm:w-auto flex items-center gap-2 bg-emerald-50/90 border border-emerald-200/80 px-3 py-1.5 rounded-xl text-[11px] text-emerald-900 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
            <span>
              <strong>Campus Standard:</strong> Wet & Dry bins are paired <strong>together just outside buildings</strong>. Only <strong>SAC Building</strong> has an indoor dustbin.
            </span>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/70 text-xs">
            <button
              id="filter-all-bins"
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Bins ({bins.length})
            </button>
            <button
              id="filter-wet-bins"
              onClick={() => setFilterType('wet')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterType === 'wet'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 border border-white inline-block"></span>
              Wet (Green)
            </button>
            <button
              id="filter-dry-bins"
              onClick={() => setFilterType('dry')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterType === 'dry'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-sky-700 hover:bg-sky-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-500 border border-white inline-block"></span>
              Dry (Blue)
            </button>
            <button
              id="filter-ewaste-bins"
              onClick={() => setFilterType('ewaste')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterType === 'ewaste'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              ⚡ E-Waste
            </button>
            <button
              id="filter-full-bins"
              onClick={() => setFilterType('full')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterType === 'full'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              Full / Alert
            </button>
          </div>
        </div>

        {/* Current Location & Map Controls Bar */}
        <div className="py-2.5 px-3 my-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex items-center gap-1 font-semibold text-slate-700 shrink-0">
              <Navigation className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              My Current Location:
            </span>
            <select
              id="select-user-zone"
              value={userZone}
              onChange={(e) => setUserZone(e.target.value as BuildingZone)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs truncate max-w-[190px] sm:max-w-xs"
            >
              {CAMPUS_ZONES.map((zone) => (
                <option key={zone.id} value={zone.id} title={zone.name}>
                  📍 {zone.shortName || zone.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Zoom Controls */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
              <button
                id="btn-zoom-out"
                onClick={() => setZoomLevel((z) => Math.max(0.85, Number((z - 0.15).toFixed(2))))}
                disabled={zoomLevel <= 0.85}
                className="p-1 text-slate-600 hover:bg-slate-100 rounded disabled:opacity-40"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 text-[11px] font-bold text-slate-700 select-none">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                id="btn-zoom-in"
                onClick={() => setZoomLevel((z) => Math.min(1.45, Number((z + 0.15).toFixed(2))))}
                disabled={zoomLevel >= 1.45}
                className="p-1 text-slate-600 hover:bg-slate-100 rounded disabled:opacity-40"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-zoom-reset"
                onClick={() => setZoomLevel(1)}
                className="p-1 text-slate-600 hover:bg-slate-100 rounded ml-0.5"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              id="btn-toggle-labels"
              onClick={() => setShowLabels((v) => !v)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                showLabels
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-white text-slate-600 border-slate-200'
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
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-indigo-200 bg-indigo-50/90 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 transition-colors shadow-2xs"
              title="Contact Sanitation Desk / Send Mail Feedback"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span>Mail Desk</span>
            </button>
          </div>
        </div>

        {/* SVG Campus Map Canvas */}
        <div className="relative w-full max-w-3xl mx-auto rounded-xl overflow-x-auto overflow-y-hidden border-2 border-slate-900 bg-[#0c1f2e] shadow-xl select-none transition-all duration-300">
          <div 
            className="min-w-[320px] sm:min-w-[480px] md:min-w-[600px] lg:min-w-[700px] w-full mx-auto"
            style={{ 
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-out'
            }}
          >
            <svg
              viewBox="0 0 720 1040"
              className="w-full h-auto block"
              style={{ shapeRendering: 'geometricPrecision' }}
            >
              <defs>
                {/* Ganga River Gradient */}
                <linearGradient id="gangaRiverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="35%" stopColor="#0284c7" />
                  <stop offset="85%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>

                {/* Campus Greenery Gradient */}
                <linearGradient id="campusLawnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#166534" />
                  <stop offset="50%" stopColor="#15803d" />
                  <stop offset="100%" stopColor="#14532d" />
                </linearGradient>

                {/* Athletic Turf Gradient */}
                <radialGradient id="playgroundTurf" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="60%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#15803d" />
                </radialGradient>

                {/* Parking Bay Pattern */}
                <pattern id="parkingLines" width="20" height="14" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="14" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" />
                  <rect x="2" y="2" width="16" height="10" rx="2" fill="#334155" opacity="0.7" />
                  {/* Car windshields */}
                  <rect x="5" y="4" width="4" height="6" rx="1" fill="#64748b" opacity="0.6" />
                </pattern>

                {/* Tree Symbol */}
                <g id="campusTree">
                  <circle cx="0" cy="0" r="10" fill="#14532d" opacity="0.8" />
                  <circle cx="0" cy="0" r="8.5" fill="#15803d" />
                  <circle cx="-2.5" cy="-2.5" r="4.5" fill="#22c55e" />
                  <circle cx="1.5" cy="1.5" r="2.5" fill="#166534" />
                </g>

                {/* Palm Tree Symbol */}
                <g id="palmTree">
                  <circle cx="0" cy="0" r="4" fill="#78350f" />
                  <path d="M0,0 Q-8,-10 -15,-6 Q-5,-4 0,0" fill="#15803d" />
                  <path d="M0,0 Q-3,-14 0,-18 Q3,-14 0,0" fill="#22c55e" />
                  <path d="M0,0 Q8,-10 15,-6 Q5,-4 0,0" fill="#15803d" />
                  <path d="M0,0 Q12,-3 16,5 Q8,2 0,0" fill="#16a34a" />
                  <path d="M0,0 Q-12,-3 -16,5 Q-8,2 0,0" fill="#16a34a" />
                </g>

                {/* River Wave Ripple */}
                <g id="riverWave">
                  <path d="M0,0 Q10,-3 20,0 T40,0" stroke="#bae6fd" strokeWidth="1.5" fill="none" opacity="0.6" />
                </g>

                {/* Traditional Boat */}
                <g id="gangaBoat">
                  <path d="M0,0 L18,0 L14,5 L4,5 Z" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
                  <line x1="9" y1="0" x2="9" y2="-8" stroke="#d97706" strokeWidth="1" />
                  <polygon points="9,-8 15,-4 9,-1" fill="#fef08a" opacity="0.9" />
                </g>

                {/* Blue Badge Filter / Shadow */}
                <filter id="badgeShadow" x="-10%" y="-10%" width="120%" height="130%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.45" />
                </filter>
              </defs>

              {/* ======================================================== */}
              {/* 1. SURROUNDING GEOGRAPHY: GANGA RIVER & ASHOK RAJPATH     */}
              {/* ======================================================== */}

              {/* Base Canvas */}
              <rect width="720" height="1040" fill="#1e293b" />

              {/* Ganga River (West side, x: 0 to 125) */}
              <rect x="0" y="0" width="125" height="1040" fill="url(#gangaRiverGrad)" />

              {/* River Animated/Static Waves & Details */}
              <use href="#riverWave" x="20" y="80" />
              <use href="#riverWave" x="50" y="160" />
              <use href="#riverWave" x="15" y="280" />
              <use href="#riverWave" x="65" y="380" />
              <use href="#riverWave" x="25" y="510" />
              <use href="#riverWave" x="60" y="660" />
              <use href="#riverWave" x="20" y="820" />
              <use href="#riverWave" x="55" y="940" />

              {/* Boats on Ganga River */}
              <use href="#gangaBoat" x="45" y="230" />
              <use href="#gangaBoat" x="70" y="550" />
              <use href="#gangaBoat" x="35" y="880" />

              {/* Ganga River Label (vertical) */}
              <g transform="translate(32, 430) rotate(-90)">
                <text fill="#ffffff" textAnchor="middle" className="text-[15px] font-black tracking-widest drop-shadow-md">
                  Ganga River  ~~~
                </text>
              </g>

              {/* J.P. Ganga Path Bridge (top left across Ganga) */}
              <g id="jp-ganga-path">
                <rect x="0" y="55" width="140" height="32" fill="#475569" stroke="#334155" strokeWidth="2" />
                <line x1="0" y1="71" x2="140" y2="71" stroke="#facc15" strokeWidth="2" strokeDasharray="6 4" />
                {/* Bridge piers */}
                <rect x="25" y="87" width="12" height="16" fill="#1e293b" />
                <rect x="80" y="87" width="12" height="16" fill="#1e293b" />
                <g filter="url(#badgeShadow)">
                  <rect x="14" y="60" width="86" height="18" rx="4" fill="#0f172a" />
                  <text x="57" y="73" fill="#ffffff" textAnchor="middle" className="text-[9px] font-extrabold tracking-wider">
                    J.P. Ganga Path
                  </text>
                </g>
              </g>

              {/* Gandhi Ghat Promenade & River Stairs (Middle West) */}
              <g id="gandhi-ghat-area">
                <rect x="105" y="440" width="28" height="420" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                {/* Ghat Stairs */}
                {Array.from({ length: 18 }).map((_, i) => (
                  <line key={i} x1="105" y1={450 + i * 22} x2="133" y2={450 + i * 22} stroke="#64748b" strokeWidth="1" />
                ))}
                <g transform="translate(118, 680) rotate(-90)">
                  <g filter="url(#badgeShadow)">
                    <rect x="-42" y="-10" width="84" height="20" rx="5" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
                    <text x="0" y="4" fill="#0f172a" textAnchor="middle" className="text-[10px] font-extrabold">
                      Gandhi Ghat
                    </text>
                  </g>
                </g>
              </g>

              {/* Ashok Rajpath (South Wide Highway across entire bottom) */}
              <g id="ashok-rajpath-road">
                <rect x="0" y="930" width="720" height="110" fill="#334155" stroke="#1e293b" strokeWidth="2" />
                {/* White dividing barrier and lane lines */}
                <line x1="0" y1="980" x2="720" y2="980" stroke="#f8fafc" strokeWidth="2.5" strokeDasharray="12 8" />
                {/* Road crossings */}
                <rect x="330" y="930" width="80" height="110" fill="#334155" />
                {Array.from({ length: 8 }).map((_, i) => (
                  <rect key={i} x={340 + i * 8} y="940" width="4" height="22" fill="#f8fafc" opacity="0.8" />
                ))}
                {/* Street trees along Ashok Rajpath */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <use key={i} href="#campusTree" x={60 + i * 55} y="930" />
                ))}
                {/* Ashok Rajpath Label */}
                <g filter="url(#badgeShadow)">
                  <rect x="310" y="995" width="120" height="24" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="1" />
                  <text x="370" y="1012" fill="#ffffff" textAnchor="middle" className="text-[12px] font-black tracking-wider">
                    Ashok Rajpath
                  </text>
                </g>
              </g>

              {/* ======================================================== */}
              {/* 2. CAMPUS BOUNDARY & GREEN GROUNDS                       */}
              {/* ======================================================== */}

              {/* Campus Grounds polygon */}
              <polygon
                points="132,80 695,80 695,920 132,920"
                fill="url(#campusLawnGrad)"
                stroke="#0f172a"
                strokeWidth="2"
              />

              {/* RED BOUNDARY WALL (as shown in map legend) */}
              <polyline
                points="132,80 695,80 695,850 685,850 685,920 132,920 132,80"
                fill="none"
                stroke="#dc2626"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* ======================================================== */}
              {/* 3. ROADS NETWORK                                         */}
              {/* ======================================================== */}

              {/* Common Road (horizontal beneath hostels) */}
              <rect x="135" y="130" width="555" height="24" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
              <line x1="140" y1="142" x2="685" y2="142" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="8 6" />
              <g filter="url(#badgeShadow)">
                <rect x="350" y="133" width="90" height="18" rx="4" fill="#1e293b" opacity="0.85" />
                <text x="395" y="146" fill="#ffffff" textAnchor="middle" className="text-[10px] font-bold">
                  Common Road
                </text>
              </g>

              {/* Main Vertical Spine Road (Clear 28px central roadway flanked by sidewalks) */}
              <rect x="330" y="154" width="28" height="690" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
              {/* White dashed center line */}
              <line x1="344" y1="154" x2="344" y2="844" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="8 6" />

              {/* Concrete sidewalks with curb along both sides of Central Spine Road */}
              <line x1="329" y1="154" x2="329" y2="844" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="359" y1="154" x2="359" y2="844" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Zebra Crosswalk between Main Building & Central Library */}
              <g id="crosswalk-main-library" opacity="0.85">
                <rect x="331" y="546" width="26" height="3" fill="#f8fafc" />
                <rect x="331" y="552" width="26" height="3" fill="#f8fafc" />
                <rect x="331" y="558" width="26" height="3" fill="#f8fafc" />
                <rect x="331" y="564" width="26" height="3" fill="#f8fafc" />
              </g>

              {/* Zebra Crosswalk between Nano Building & CSE Dept */}
              <g id="crosswalk-nano-cse" opacity="0.85">
                <rect x="331" y="196" width="26" height="3" fill="#f8fafc" />
                <rect x="331" y="202" width="26" height="3" fill="#f8fafc" />
                <rect x="331" y="208" width="26" height="3" fill="#f8fafc" />
              </g>

              {/* Road between Alak Nanda & ECE */}
              <rect x="300" y="240" width="30" height="110" fill="#64748b" />

              {/* Road around Play Ground */}
              <rect x="358" y="348" width="190" height="20" fill="#64748b" stroke="#334155" strokeWidth="1" />
              <rect x="548" y="348" width="22" height="160" fill="#64748b" stroke="#334155" strokeWidth="1" />
              <rect x="358" y="494" width="212" height="22" fill="#64748b" stroke="#334155" strokeWidth="1" />

              {/* Road leading to Parking */}
              <rect x="150" y="630" width="180" height="22" fill="#64748b" stroke="#334155" strokeWidth="1" />
              <line x1="150" y1="641" x2="330" y2="641" stroke="#ffffff" strokeWidth="1" strokeDasharray="6 4" />

              {/* Road leading towards southern boundary */}
              <rect x="330" y="830" width="28" height="85" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
              <line x1="344" y1="830" x2="344" y2="915" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 4" />

              {/* ======================================================== */}
              {/* 4. CAMPUS BUILDINGS & STRUCTURES                         */}
              {/* ======================================================== */}

              {/* 1. Hostels (Pink/Coral Toned Blocks) */}

              {/* Brahmaputra Hostel (Top Right) */}
              <g 
                id="zone-brahmaputra"
                onClick={() => setUserZone('brahmaputra-hostel')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="420" y="10" width="115" height="52" rx="4" fill="#fda4af" stroke="#e11d48" strokeWidth="2" />
                <rect x="428" y="16" width="99" height="16" rx="2" fill="#f43f5e" opacity="0.3" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="428" y="20" width="100" height="19" rx="4" fill="#1e40af" />
                    <text x="478" y="33" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      Brahmaputra Hostel
                    </text>
                  </g>
                )}
              </g>

              {/* Koshi Hostel (Interchanged to West side along Common Road) */}
              <g 
                id="zone-kosi"
                onClick={() => setUserZone('kosi-hostel')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="280" y="64" width="180" height="60" rx="5" fill="#fff1f2" stroke="#e11d48" strokeWidth="2.5" />
                <rect x="290" y="72" width="160" height="14" rx="2" fill="#fda4af" stroke="#f43f5e" strokeWidth="1" />
                <rect x="290" y="94" width="160" height="14" rx="2" fill="#fda4af" stroke="#f43f5e" strokeWidth="1" />
                <rect x="340" y="86" width="60" height="14" rx="2" fill="#16a34a" stroke="#15803d" strokeWidth="1" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="318" y="80" width="105" height="20" rx="4" fill="#1e40af" stroke="#60a5fa" strokeWidth="1" />
                    <text x="370" y="94" fill="#ffffff" textAnchor="middle" className="text-[10px] font-black tracking-wide">
                      Koshi Hostel
                    </text>
                  </g>
                )}
              </g>

              {/* Connecting Courtyard Walkway between Koshi & Bhagmati */}
              <rect x="460" y="78" width="15" height="32" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />

              {/* Bhagmati Hostel (Interchanged to East side along Common Road) */}
              <g 
                id="zone-bhagmati"
                onClick={() => setUserZone('bhagmati-hostel')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="475" y="64" width="180" height="60" rx="5" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2" />
                <rect x="485" y="72" width="160" height="14" rx="2" fill="#f43f5e" opacity="0.25" />
                <rect x="485" y="94" width="160" height="14" rx="2" fill="#f43f5e" opacity="0.25" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="512" y="80" width="105" height="20" rx="4" fill="#1e40af" />
                    <text x="564" y="94" fill="#ffffff" textAnchor="middle" className="text-[10px] font-black">
                      Bhagmati Hostel
                    </text>
                  </g>
                )}
              </g>

              {/* Ganga Girls Hostel (West edge by river) */}
              <g 
                id="zone-gangagirls"
                onClick={() => setUserZone('ganga-girls-hostel')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="156" y="168" width="86" height="68" rx="5" fill="#fbcfe8" stroke="#db2777" strokeWidth="2" />
                <rect x="164" y="176" width="70" height="16" rx="2" fill="#ec4899" opacity="0.3" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="159" y="185" width="80" height="22" rx="4" fill="#1e40af" />
                    <text x="199" y="200" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      Ganga Girls Hostel
                    </text>
                  </g>
                )}
              </g>

              {/* Nano Building (Health Centre) - Fully clear of central road */}
              <g 
                id="zone-nano"
                onClick={() => setUserZone('nano-building')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="250" y="168" width="72" height="68" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                <rect x="256" y="174" width="60" height="16" rx="2" fill="#b45309" opacity="0.25" />
                {/* Entrance path leading east to central road sidewalk */}
                <rect x="318" y="194" width="12" height="16" rx="1" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="253" y="182" width="66" height="28" rx="4" fill="#1e40af" />
                    <text x="286" y="195" fill="#ffffff" textAnchor="middle" className="text-[8.5px] font-black">
                      Nano Building
                    </text>
                    <text x="286" y="206" fill="#93c5fd" textAnchor="middle" className="text-[7.5px] font-bold">
                      (Health Centre)
                    </text>
                  </g>
                )}
              </g>

              {/* Computer Science Department (CSE) */}
              <g 
                id="zone-cse"
                onClick={() => setUserZone('cse-dept')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="366" y="168" width="98" height="68" rx="4" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
                <rect x="374" y="174" width="82" height="16" rx="2" fill="#c2410c" opacity="0.25" />
                {/* Entrance path */}
                <rect x="358" y="194" width="10" height="16" rx="1" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="373" y="182" width="86" height="28" rx="4" fill="#1e40af" />
                    <text x="416" y="195" fill="#ffffff" textAnchor="middle" className="text-[8px] font-black">
                      Computer Science
                    </text>
                    <text x="416" y="206" fill="#93c5fd" textAnchor="middle" className="text-[7.5px] font-bold">
                      Department (CSE)
                    </text>
                  </g>
                )}
              </g>

              {/* ALAK NANDA BHAWAN */}
              <g 
                id="zone-alaknanda"
                onClick={() => setUserZone('alaknanda-bhawan')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="176" y="248" width="124" height="98" rx="5" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2" />
                {/* Inner courtyard */}
                <rect x="210" y="278" width="56" height="38" rx="3" fill="#15803d" stroke="#166534" strokeWidth="1" />
                <use href="#campusTree" x="238" y="297" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="194" y="254" width="88" height="26" rx="4" fill="#1e40af" />
                    <text x="238" y="267" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      ALAK NANDA
                    </text>
                    <text x="238" y="276" fill="#ffffff" textAnchor="middle" className="text-[8.5px] font-black">
                      BHAWAN
                    </text>
                  </g>
                )}
              </g>

              {/* ECE DEPARTMENT */}
              <g 
                id="zone-ece"
                onClick={() => setUserZone('ece-dept')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="364" y="248" width="96" height="98" rx="5" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                {/* Courtyard */}
                <rect x="388" y="280" width="48" height="36" rx="3" fill="#15803d" />
                <use href="#campusTree" x="412" y="298" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="373" y="254" width="78" height="26" rx="4" fill="#1e40af" />
                    <text x="412" y="267" fill="#ffffff" textAnchor="middle" className="text-[9.5px] font-black">
                      ECE
                    </text>
                    <text x="412" y="276" fill="#ffffff" textAnchor="middle" className="text-[8px] font-black">
                      DEPARTMENT
                    </text>
                  </g>
                )}
              </g>

              {/* Auditorium CWRS */}
              <g 
                id="zone-audi"
                onClick={() => setUserZone('auditorium-cwrs')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="456" y="226" width="118" height="88" rx="5" fill="#e0e7ff" stroke="#4338ca" strokeWidth="2" />
                <rect x="466" y="234" width="98" height="20" rx="3" fill="#3730a3" opacity="0.3" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="473" y="250" width="84" height="26" rx="4" fill="#1e40af" />
                    <text x="515" y="264" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      Auditorium
                    </text>
                    <text x="515" y="273" fill="#93c5fd" textAnchor="middle" className="text-[8px] font-bold">
                      CWRS
                    </text>
                  </g>
                )}
              </g>

              {/* AMPHITHEATRE (stepped semicircle) */}
              <g 
                id="zone-amphi"
                onClick={() => setUserZone('amphitheatre')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <path
                  d="M465,324 A50,40 0 0,0 565,324 Z"
                  fill="#bbf7d0"
                  stroke="#16a34a"
                  strokeWidth="2"
                />
                {/* Tier steps */}
                <path d="M478,324 A38,30 0 0,0 552,324" fill="none" stroke="#15803d" strokeWidth="1.5" />
                <path d="M492,324 A24,18 0 0,0 538,324" fill="none" stroke="#15803d" strokeWidth="1.5" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="477" y="328" width="76" height="18" rx="4" fill="#1e40af" />
                    <text x="515" y="341" fill="#ffffff" textAnchor="middle" className="text-[8px] font-black tracking-wider">
                      AMPHITHEATRE
                    </text>
                  </g>
                )}
              </g>

              {/* I.T. Lab */}
              <g 
                id="zone-itlab"
                onClick={() => setUserZone('it-lab')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="170" y="374" width="56" height="70" rx="4" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="174" y="394" width="48" height="24" rx="4" fill="#1e40af" />
                    <text x="198" y="407" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      I.T.
                    </text>
                    <text x="198" y="416" fill="#ffffff" textAnchor="middle" className="text-[8px] font-black">
                      Lab
                    </text>
                  </g>
                )}
              </g>

              {/* Basketball Court */}
              <g 
                id="zone-basketball"
                onClick={() => setUserZone('basketball-court')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="236" y="374" width="64" height="70" rx="4" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
                {/* Court Orange Key Lines */}
                <rect x="242" y="380" width="52" height="58" fill="#f97316" stroke="#ffffff" strokeWidth="1.2" />
                <circle cx="268" cy="409" r="10" fill="none" stroke="#ffffff" strokeWidth="1.2" />
                <line x1="242" y1="409" x2="294" y2="409" stroke="#ffffff" strokeWidth="1.2" />
                {/* Hoops */}
                <circle cx="268" cy="386" r="3" fill="#ffffff" />
                <circle cx="268" cy="432" r="3" fill="#ffffff" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="244" y="396" width="48" height="26" rx="4" fill="#1e40af" />
                    <text x="268" y="408" fill="#ffffff" textAnchor="middle" className="text-[8px] font-black">
                      Basketball
                    </text>
                    <text x="268" y="418" fill="#ffffff" textAnchor="middle" className="text-[8px] font-black">
                      Court
                    </text>
                  </g>
                )}
              </g>

              {/* Open Sports Lawn & Seating Plaza (Replacing old Koshi Hostel block) */}
              <g id="zone-sports-plaza" className="opacity-90">
                <rect x="232" y="440" width="84" height="64" rx="6" fill="#16a34a" fillOpacity="0.15" stroke="#15803d" strokeWidth="1.5" strokeDasharray="4 3" />
                <rect x="240" y="448" width="68" height="6" rx="2" fill="#94a3b8" />
                <rect x="240" y="460" width="68" height="6" rx="2" fill="#94a3b8" />
                <use href="#campusTree" x="248" y="484" />
                <use href="#campusTree" x="300" y="484" />
                <text x="274" y="482" fill="#166534" textAnchor="middle" className="text-[8px] font-black tracking-wide">
                  Open Sports Lawn
                </text>
              </g>

              {/* PLAY GROUND (Center Athletic Grounds) */}
              <g 
                id="zone-playground"
                onClick={() => setUserZone('play-ground')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="360" y="374" width="134" height="120" rx="8" fill="url(#playgroundTurf)" stroke="#15803d" strokeWidth="2" />
                {/* Running track oval */}
                <ellipse cx="427" cy="434" rx="55" ry="46" fill="none" stroke="#86efac" strokeWidth="1.5" strokeDasharray="4 3" />
                {/* Cricket Pitch in center */}
                <rect x="422" y="420" width="10" height="28" fill="#d97706" rx="2" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="397" y="424" width="60" height="24" rx="4" fill="#1e40af" />
                    <text x="427" y="437" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      PLAY
                    </text>
                    <text x="427" y="445" fill="#ffffff" textAnchor="middle" className="text-[8px] font-black">
                      GROUND
                    </text>
                  </g>
                )}
              </g>

              {/* SAC BUILDING */}
              <g 
                id="zone-sac"
                onClick={() => setUserZone('sac-building')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="515" y="380" width="70" height="88" rx="5" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="522" y="408" width="56" height="28" rx="4" fill="#1e40af" />
                    <text x="550" y="422" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      SAC
                    </text>
                    <text x="550" y="432" fill="#ffffff" textAnchor="middle" className="text-[8px] font-black">
                      BUILDING
                    </text>
                  </g>
                )}
              </g>

              {/* Main Gate (Internal) - The Campus Main Gate */}
              <g 
                id="zone-maingate-internal"
                onClick={() => setUserZone('main-gate-internal')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="515" y="472" width="70" height="24" rx="4" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
                {/* Gate Pillars & Checkpoint */}
                <rect x="517" y="474" width="6" height="20" rx="1" fill="#1e3a8a" />
                <rect x="577" y="474" width="6" height="20" rx="1" fill="#1e3a8a" />
                <line x1="523" y1="484" x2="577" y2="484" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 3" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="502" y="473" width="96" height="22" rx="4" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1" />
                    <text x="550" y="488" fill="#ffffff" textAnchor="middle" className="text-[8.5px] font-black">
                      Main Gate (Internal)
                    </text>
                  </g>
                )}
              </g>

              {/* Civil Dept. */}
              <g 
                id="zone-civil"
                onClick={() => setUserZone('civil-dept')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="152" y="498" width="64" height="88" rx="4" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="158" y="524" width="52" height="26" rx="4" fill="#1e40af" />
                    <text x="184" y="538" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      Civil
                    </text>
                    <text x="184" y="547" fill="#ffffff" textAnchor="middle" className="text-[8.5px] font-black">
                      Dept.
                    </text>
                  </g>
                )}
              </g>

              {/* Main Building (Historic colonnade & plaza) - West of central road */}
              <g 
                id="zone-mainbuilding"
                onClick={() => setUserZone('main-building')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="222" y="514" width="100" height="84" rx="5" fill="#fef3c7" stroke="#b45309" strokeWidth="2.5" />
                {/* Colonnade / Porch Entrance pathway leading east toward central road */}
                <rect x="316" y="546" width="14" height="20" rx="1" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                {/* Front Portico & Fountain Lawn */}
                <circle cx="272" cy="574" r="13" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="272" cy="574" r="4.5" fill="#ffffff" />
                {/* Surrounding palm trees */}
                <use href="#palmTree" x="248" y="574" />
                <use href="#palmTree" x="296" y="574" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="238" y="534" width="68" height="22" rx="4" fill="#1e40af" />
                    <text x="272" y="549" fill="#ffffff" textAnchor="middle" className="text-[9.5px] font-black">
                      Main Building
                    </text>
                  </g>
                )}
              </g>

              {/* Central Library (with prominent dome) - East of central road */}
              <g 
                id="zone-library"
                onClick={() => setUserZone('central-library')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="372" y="516" width="104" height="88" rx="5" fill="#fef3c7" stroke="#b45309" strokeWidth="2.5" />
                {/* Entrance path from central road sidewalk */}
                <rect x="358" y="550" width="16" height="18" rx="1" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                {/* Circular Dome */}
                <circle cx="424" cy="528" r="12" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="391" y="540" width="66" height="26" rx="4" fill="#1e40af" />
                    <text x="424" y="553" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      Central
                    </text>
                    <text x="424" y="562" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      Library
                    </text>
                  </g>
                )}
              </g>

              {/* Indian Bank (ATM) */}
              <g 
                id="zone-bank"
                onClick={() => setUserZone('indian-bank-atm')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="488" y="532" width="50" height="58" rx="4" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="490" y="544" width="46" height="26" rx="4" fill="#1e40af" />
                    <text x="513" y="555" fill="#ffffff" textAnchor="middle" className="text-[7.5px] font-black">
                      Indian Bank
                    </text>
                    <text x="513" y="566" fill="#93c5fd" textAnchor="middle" className="text-[7.5px] font-bold">
                      (ATM)
                    </text>
                  </g>
                )}
              </g>

              {/* Cafeteria */}
              <g 
                id="zone-cafeteria"
                onClick={() => setUserZone('cafeteria')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="548" y="516" width="70" height="102" rx="4" fill="#ffe4e6" stroke="#f43f5e" strokeWidth="2" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="558" y="550" width="50" height="20" rx="4" fill="#1e40af" />
                    <text x="583" y="564" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      Cafeteria
                    </text>
                  </g>
                )}
              </g>

              {/* Stationery */}
              <g 
                id="zone-stationery"
                onClick={() => setUserZone('stationery')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="376" y="622" width="96" height="58" rx="4" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="394" y="639" width="60" height="20" rx="4" fill="#1e40af" />
                    <text x="424" y="653" fill="#ffffff" textAnchor="middle" className="text-[9.5px] font-black">
                      Stationery
                    </text>
                  </g>
                )}
              </g>

              {/* Shop 2 */}
              <g 
                id="zone-shop2"
                onClick={() => setUserZone('shop-2')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="548" y="632" width="70" height="58" rx="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="561" y="648" width="44" height="20" rx="4" fill="#1e40af" />
                    <text x="583" y="662" fill="#ffffff" textAnchor="middle" className="text-[9.5px] font-black">
                      Shop 2
                    </text>
                  </g>
                )}
              </g>

              {/* Parking area (Large unified parking lot on west, clear of central road) */}
              <g 
                id="zone-parking"
                onClick={() => setUserZone('parking-area')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="142" y="658" width="180" height="182" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                {/* Parking lot bays pattern */}
                <rect x="148" y="666" width="168" height="166" fill="url(#parkingLines)" />
                {/* Tree avenues */}
                <use href="#campusTree" x="175" y="700" />
                <use href="#campusTree" x="175" y="750" />
                <use href="#campusTree" x="175" y="800" />
                <use href="#campusTree" x="235" y="700" />
                <use href="#campusTree" x="235" y="750" />
                <use href="#campusTree" x="235" y="800" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="196" y="728" width="72" height="24" rx="4" fill="#1e40af" />
                    <text x="232" y="744" fill="#ffffff" textAnchor="middle" className="text-[10px] font-black">
                      Parking area
                    </text>
                  </g>
                )}
              </g>

              {/* Pathway connecting Central Road sidewalk to Physics & Chemistry Lab */}
              <rect x="358" y="732" width="18" height="16" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
              <rect x="358" y="812" width="18" height="16" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />

              {/* Paved Avenue between Chemistry Lab and Kosi Ext */}
              <rect x="520" y="705" width="18" height="188" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
              <line x1="529" y1="710" x2="529" y2="888" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" />

              {/* PHYSICS DEPARTMENT */}
              <g 
                id="zone-physics"
                onClick={() => setUserZone('physics-dept')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="376" y="708" width="144" height="64" rx="4" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
                <rect x="384" y="715" width="128" height="12" rx="2" fill="#c2410c" opacity="0.25" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="402" y="724" width="92" height="26" rx="4" fill="#1e40af" />
                    <text x="448" y="736" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      PHYSICS
                    </text>
                    <text x="448" y="746" fill="#ffffff" textAnchor="middle" className="text-[8px] font-black">
                      DEPARTMENT
                    </text>
                  </g>
                )}
              </g>

              {/* CHEMISTRY DEPARTMENT (LAB) - Situated beside Koshi Ext */}
              <g 
                id="zone-chem"
                onClick={() => setUserZone('chemistry-dept')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                <rect x="376" y="784" width="144" height="74" rx="4" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
                <rect x="384" y="791" width="128" height="12" rx="2" fill="#c2410c" opacity="0.25" />
                {/* Chemistry Lab benches & fume vents representation */}
                <circle cx="396" cy="840" r="4" fill="#ea580c" opacity="0.3" />
                <circle cx="410" cy="840" r="4" fill="#ea580c" opacity="0.3" />
                <circle cx="486" cy="840" r="4" fill="#ea580c" opacity="0.3" />
                <circle cx="500" cy="840" r="4" fill="#ea580c" opacity="0.3" />
                {showLabels && (
                  <g filter="url(#badgeShadow)">
                    <rect x="392" y="800" width="112" height="32" rx="4" fill="#1e40af" stroke="#60a5fa" strokeWidth="1" />
                    <text x="448" y="813" fill="#ffffff" textAnchor="middle" className="text-[9px] font-black">
                      CHEMISTRY LAB
                    </text>
                    <text x="448" y="825" fill="#93c5fd" textAnchor="middle" className="text-[7.5px] font-bold">
                      Beside Koshi Ext ➔
                    </text>
                  </g>
                )}
              </g>

              {/* KOSHI EXTENSION HOSTEL (Residential Block beside Chemistry Lab) */}
              <g 
                id="zone-kosi-ext"
                onClick={() => setUserZone('kosi-ext')}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                {/* Main Hostel structural block */}
                <rect x="540" y="706" width="144" height="186" rx="6" fill="#fff1f2" stroke="#e11d48" strokeWidth="2.5" />

                {/* North Residential Wing */}
                <rect x="546" y="712" width="132" height="24" rx="3" fill="#fda4af" stroke="#f43f5e" strokeWidth="1" />
                {/* East Residential Wing along eastern boundary */}
                <rect x="642" y="736" width="36" height="122" rx="3" fill="#fda4af" stroke="#f43f5e" strokeWidth="1" />
                {/* West Living & Entrance Wing facing Chemistry Lab */}
                <rect x="546" y="736" width="36" height="122" rx="3" fill="#fda4af" stroke="#f43f5e" strokeWidth="1" />
                {/* South Wing along boundary wall */}
                <rect x="546" y="858" width="132" height="28" rx="3" fill="#fecdd3" stroke="#f43f5e" strokeWidth="1" />

                {/* Inner Quadrangle & Hostel Lawn */}
                <rect x="584" y="738" width="56" height="118" rx="4" fill="#16a34a" stroke="#15803d" strokeWidth="1" />
                {/* Quadrangle walkways & trees */}
                <line x1="612" y1="738" x2="612" y2="856" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3 2" />
                <line x1="584" y1="797" x2="640" y2="797" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3 2" />
                <use href="#campusTree" x="597" y="765" />
                <use href="#campusTree" x="625" y="825" />

                {/* Entrance Porch Gate facing West Avenue */}
                <rect x="540" y="784" width="8" height="24" rx="2" fill="#1e3a8a" />

                {showLabels && (
                  <>
                    <g filter="url(#badgeShadow)">
                      <rect x="548" y="715" width="128" height="22" rx="4" fill="#be123c" stroke="#fecdd3" strokeWidth="1" />
                      <text x="612" y="730" fill="#ffffff" textAnchor="middle" className="text-[9.5px] font-black tracking-wide">
                        KOSHI EXTENSION
                      </text>
                    </g>
                    <g filter="url(#badgeShadow)">
                      <rect x="550" y="828" width="124" height="24" rx="4" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1" />
                      <text x="612" y="841" fill="#ffffff" textAnchor="middle" className="text-[8.5px] font-black">
                        KOSHI EXT HOSTEL
                      </text>
                      <text x="612" y="850" fill="#93c5fd" textAnchor="middle" className="text-[7px] font-bold">
                        Student Residential Wing
                      </text>
                    </g>
                  </>
                )}
              </g>

              {/* Eastern Campus Boundary Wall (Running alongside Koshi Ext & Chem Lab) */}
              <g id="east-campus-boundary-wall">
                {/* Brick Boundary Wall Structure along East Edge */}
                <rect x="686" y="700" width="12" height="224" rx="2" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
                {/* Boundary Wall pillars */}
                {Array.from({ length: 7 }).map((_, i) => (
                  <rect key={i} x="684" y={710 + i * 32} width="16" height="6" rx="1.5" fill="#7f1d1d" />
                ))}
                {showLabels && (
                  <g filter="url(#badgeShadow)" transform="translate(685, 785) rotate(90)">
                    <rect x="-42" y="-12" width="84" height="18" rx="3" fill="#991b1b" stroke="#fca5a5" strokeWidth="1" />
                    <text x="0" y="0" fill="#ffffff" textAnchor="middle" className="text-[7.5px] font-black tracking-widest">
                      BOUNDARY WALL
                    </text>
                  </g>
                )}
              </g>

              {/* Campus Southern Boundary Wall along Ashok Rajpath */}
              <g id="ashok-rajpath-boundary-wall">
                {/* Brick/Stone Boundary Wall Structure */}
                <rect x="132" y="912" width="554" height="14" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
                {/* Boundary Wall pillars at intervals */}
                {Array.from({ length: 14 }).map((_, i) => (
                  <rect key={i} x={140 + i * 40} y="908" width="8" height="22" rx="1.5" fill="#7f1d1d" />
                ))}
                {showLabels && (
                  <>
                    <g filter="url(#badgeShadow)">
                      <rect x="250" y="888" width="100" height="18" rx="4" fill="#991b1b" stroke="#fca5a5" strokeWidth="1" />
                      <text x="300" y="900" fill="#ffffff" textAnchor="middle" className="text-[8px] font-extrabold tracking-wider">
                        Boundary Wall
                      </text>
                    </g>
                    {/* Southeast Boundary Wall Label directly beside Koshi Ext */}
                    <g filter="url(#badgeShadow)">
                      <rect x="635" y="890" width="82" height="18" rx="4" fill="#991b1b" stroke="#fca5a5" strokeWidth="1" />
                      <text x="676" y="902" fill="#ffffff" textAnchor="middle" className="text-[7.5px] font-black tracking-wider">
                        BOUNDARY WALL
                      </text>
                    </g>
                  </>
                )}
              </g>

              {/* ======================================================== */}
              {/* 5. OFFICIAL NIT PATNA HEADER BADGE & LEGEND             */}
              {/* ======================================================== */}

              {/* Top Right: NIT PATNA Seal & Compass */}
              <g transform="translate(540, 10)" filter="url(#badgeShadow)">
                <rect x="0" y="0" width="168" height="56" rx="8" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                {/* NIT Seal Emblem */}
                <circle cx="28" cy="28" r="18" fill="#ffffff" />
                <circle cx="28" cy="28" r="15" fill="#1e3a8a" />
                <text x="28" y="32" fill="#ffffff" textAnchor="middle" className="text-[13px] font-black">
                  NIT
                </text>
                <text x="56" y="24" fill="#ffffff" className="text-[13px] font-black tracking-wider">
                  NIT PATNA
                </text>
                <text x="56" y="40" fill="#93c5fd" className="text-[9.5px] font-extrabold tracking-widest">
                  MAIN CAMPUS
                </text>
              </g>

              {/* North Arrow Indicator */}
              <g transform="translate(680, 85)" filter="url(#badgeShadow)">
                <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                {/* Compass Needle pointing up */}
                <polygon points="0,-12 4,0 0,-3 -4,0" fill="#ef4444" />
                <polygon points="0,12 4,0 0,3 -4,0" fill="#94a3b8" />
                <text x="0" y="-14" fill="#f8fafc" textAnchor="middle" className="text-[10px] font-black">
                  N
                </text>
              </g>

              {/* Map Legend Box (matching the original visual) */}
              <g transform="translate(615, 125)" filter="url(#badgeShadow)">
                <rect x="0" y="0" width="95" height="96" rx="6" fill="#0f172a" opacity="0.92" stroke="#334155" strokeWidth="1" />
                
                {/* Item 1: Main Buildings */}
                <rect x="8" y="8" width="14" height="8" rx="2" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
                <text x="26" y="15" fill="#e2e8f0" className="text-[7.5px] font-bold">
                  Main Buildings
                </text>

                {/* Item 2: Departments */}
                <rect x="8" y="22" width="14" height="8" rx="2" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" />
                <text x="26" y="29" fill="#e2e8f0" className="text-[7.5px] font-bold">
                  Departments
                </text>

                {/* Item 3: Hostels */}
                <rect x="8" y="36" width="14" height="8" rx="2" fill="#fbcfe8" stroke="#e11d48" strokeWidth="1" />
                <text x="26" y="43" fill="#e2e8f0" className="text-[7.5px] font-bold">
                  Hostels
                </text>

                {/* Item 4: Roads */}
                <rect x="8" y="50" width="14" height="8" rx="2" fill="#64748b" stroke="#334155" strokeWidth="1" />
                <text x="26" y="57" fill="#e2e8f0" className="text-[7.5px] font-bold">
                  Roads
                </text>

                {/* Item 5: Green Area */}
                <rect x="8" y="64" width="14" height="8" rx="2" fill="#15803d" stroke="#16a34a" strokeWidth="1" />
                <text x="26" y="71" fill="#e2e8f0" className="text-[7.5px] font-bold">
                  Green Area
                </text>

                {/* Item 6: Boundary Wall */}
                <line x1="8" y1="84" x2="22" y2="84" stroke="#dc2626" strokeWidth="2.5" />
                <text x="26" y="87" fill="#fca5a5" className="text-[7.5px] font-bold">
                  Boundary Wall
                </text>
              </g>

              {/* ======================================================== */}
              {/* 6. ROUTE FROM USER TO SELECTED DUSTBIN                   */}
              {/* ======================================================== */}
              {selectedBinCoords && (
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

                // Color palette based on waste types
                let pinFill = '#2563eb'; // default blue (dry)
                if (bin.hasWet && !bin.hasDry) pinFill = '#16a34a'; // green
                else if (bin.hasWet && bin.hasDry) pinFill = '#059669'; // dual
                if (bin.hasEwaste) pinFill = '#1e293b';

                return (
                  <g
                    key={bin.id}
                    id={`map-bin-${bin.id}`}
                    transform={`translate(${bx}, ${by})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBin(bin);
                    }}
                    className="cursor-pointer group"
                    filter="url(#badgeShadow)"
                  >
                    {/* Pulsing ring for selected bin */}
                    {(isSelected || isHighlighted) && (
                      <circle
                        cx="0"
                        cy="-16"
                        r="22"
                        fill="none"
                        stroke={bin.fillLevel >= 80 ? '#f43f5e' : '#10b981'}
                        strokeWidth="3"
                        strokeDasharray="4 3"
                        className="animate-spin"
                        style={{ animationDuration: '4s' }}
                      />
                    )}

                    {/* Pin Drop SVG Icon */}
                    <g transform="translate(0, -18) scale(1.15)">
                      <path
                        d="M0,0 C-10,-10 -14,-18 -14,-26 C-14,-34 -7,-41 0,-41 C7,-41 14,-34 14,-26 C14,-18 10,-10 0,0 Z"
                        fill={bin.fillLevel >= 80 ? '#e11d48' : pinFill}
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      {/* Inner circle badge */}
                      <circle cx="0" cy="-26" r="9.5" fill="#ffffff" />

                      {/* Waste icon / text */}
                      {bin.hasWet && bin.hasDry ? (
                        <g>
                          <path d="M-8,-26 A8,8 0 0,1 0,-34 L0,-18 A8,8 0 0,1 -8,-26 Z" fill="#16a34a" />
                          <path d="M8,-26 A8,8 0 0,0 0,-34 L0,-18 A8,8 0 0,0 8,-26 Z" fill="#2563eb" />
                        </g>
                      ) : bin.hasWet ? (
                        <circle cx="0" cy="-26" r="7" fill="#16a34a" />
                      ) : bin.hasEwaste ? (
                        <circle cx="0" cy="-26" r="7" fill="#0f172a" />
                      ) : (
                        <circle cx="0" cy="-26" r="7" fill="#2563eb" />
                      )}

                      {/* Fill Level Dot Indicator */}
                      <circle
                        cx="8"
                        cy="-35"
                        r="4.5"
                        fill={
                          bin.fillLevel >= 80
                            ? '#e11d48'
                            : bin.fillLevel >= 55
                            ? '#f59e0b'
                            : '#10b981'
                        }
                        stroke="#ffffff"
                        strokeWidth="1.2"
                      />
                    </g>

                    {/* Compact Title Label beneath */}
                    <g transform="translate(0, 10)">
                      <rect
                        x="-45"
                        y="0"
                        width="90"
                        height="16"
                        rx="4"
                        fill={isSelected ? '#0f172a' : '#1e293b'}
                        stroke={isSelected ? '#10b981' : '#64748b'}
                        strokeWidth={isSelected ? '1.5' : '0.8'}
                        opacity="0.9"
                      />
                      <text
                        x="0"
                        y="11"
                        fill="#ffffff"
                        textAnchor="middle"
                        className="text-[7.5px] font-bold"
                      >
                        {bin.name.length > 17 ? bin.name.substring(0, 15) + '..' : bin.name}
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
                <g transform="translate(0, -26)" filter="url(#badgeShadow)">
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
            <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded font-semibold text-[11px] border border-indigo-200/60">
              <span>🏢 Indoor Station: SAC Building Only</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Click any building or bin marker to explore</span>
          </div>
        </div>
      </div>

      {/* Selected Bin Details & Action Sidebar */}
      <div className="w-full xl:w-80 shrink-0 flex flex-col gap-4">
        {selectedBin ? (
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {selectedBin.floor}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1 font-['Outfit',sans-serif]">
                    {selectedBin.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {selectedBin.locationName}
                  </p>
                </div>

                <div
                  className={`px-2 py-1 rounded-lg text-xs font-bold shrink-0 ${
                    selectedBin.fillLevel >= 85
                      ? 'bg-rose-100 text-rose-800'
                      : selectedBin.fillLevel >= 60
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {selectedBin.fillLevel}% Full
                </div>
              </div>

              {/* Fill Level Meter */}
              <div className="my-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">Capacity & Fill Level</span>
                  <span className="text-slate-500">
                    {Math.round((selectedBin.fillLevel / 100) * selectedBin.capacityLiters)}L / {selectedBin.capacityLiters}L
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedBin.fillLevel >= 85
                        ? 'bg-rose-500'
                        : selectedBin.fillLevel >= 60
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${selectedBin.fillLevel}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                  <span>Last emptied: {selectedBin.lastEmptied}</span>
                  <span className="font-medium text-slate-600">
                    {selectedBin.fillLevel < 80 ? '✅ Ready for use' : '⚠️ Cleaning requested'}
                  </span>
                </div>
              </div>

              {/* Supported Segregations */}
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Available Compartments:
                </h4>
                <div className="space-y-2">
                  {selectedBin.hasWet && (
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-xs">
                      <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        🟢
                      </div>
                      <div>
                        <div className="font-bold text-emerald-950">Green Bin: Wet / Organic</div>
                        <div className="text-[11px] text-emerald-800">
                          Food leftovers, fruit peels, tea leaves, compostable waste
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedBin.hasDry && (
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-sky-50/80 border border-sky-200/80 text-xs">
                      <div className="w-6 h-6 rounded-md bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                        🔵
                      </div>
                      <div>
                        <div className="font-bold text-sky-950">Blue Bin: Dry / Recyclable</div>
                        <div className="text-[11px] text-sky-800">
                          Plastic bottles, notebooks, cardboard, wrappers, drink cans
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedBin.hasEwaste && (
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-100 border border-slate-300 text-xs">
                      <div className="w-6 h-6 rounded-md bg-slate-800 text-amber-300 flex items-center justify-center font-bold text-xs">
                        ⚡
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Black/Yellow: E-Waste Box</div>
                        <div className="text-[11px] text-slate-600">
                          Dead batteries, chargers, earphone wires, broken gadgets
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Landmark directions */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 mb-4">
                <div className="font-bold flex items-center gap-1 text-amber-950 mb-0.5">
                  <Compass className="w-3.5 h-3.5 text-amber-600" />
                  Exact Spot on Campus
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  {selectedBin.landmark} ({selectedBin.floor})
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <button
                id="btn-report-selected-bin"
                onClick={() => onReportBin(selectedBin)}
                className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                Report Full / Damaged / Request Cleaning
              </button>
            </div>
          </div>
        ) : (
          /* Empty selection guide */
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 font-['Outfit',sans-serif]">
              Select Any Dustbin Marker
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Click on any colored marker on the NIT Patna master plan to see its real-time fill level, segregation compartments, and walking route.
            </p>

            <div className="w-full mt-5 pt-4 border-t border-slate-100 text-left space-y-2.5">
              <div className="text-xs font-bold text-slate-700">NIT Patna Cleanliness Guidelines:</div>
              <div className="text-[11px] text-slate-600 flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">1.</span>
                <span>Crush plastic bottles flat before depositing in Blue Bins.</span>
              </div>
              <div className="text-[11px] text-slate-600 flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">2.</span>
                <span>Keep hostel mess food scraps strictly in Green Bins for campus composting.</span>
              </div>
              <div className="text-[11px] text-slate-600 flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">3.</span>
                <span>Never mix dead phone or mouse batteries with ordinary trash. Drop in I.T. Lab box.</span>
              </div>
            </div>
          </div>
        )}

        {/* Swachhata Vision Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-4 text-white shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
              NIT Patna Swachhata
            </span>
          </div>
          <h4 className="text-sm font-bold leading-snug">
            Clean Campus, Green Future
          </h4>
          <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
            Report overflowing bins directly to campus sanitation teams and keep the academic, residential, and riverfront zones clean.
          </p>
        </div>
      </div>

      {/* Campus Sanitation & Feedback Mail Modal */}
      {showMailModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-sky-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-['Outfit',sans-serif]">Campus Sanitation Mail Desk</h3>
                  <p className="text-[11px] text-indigo-100">NIT Patna Swachhata Cell & Estate Office</p>
                </div>
              </div>
              <button
                onClick={() => setShowMailModal(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
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
          </div>
        </div>
      )}
    </div>
  );
};
