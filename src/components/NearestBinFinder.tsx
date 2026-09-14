import React, { useState, useMemo } from 'react';
import { CampusBin, BuildingZone, WasteType } from '../types';
import { CAMPUS_ZONES } from '../data/campusData';
import { 
  Search, 
  MapPin, 
  ArrowRight, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Footprints,
  Sparkles
} from 'lucide-react';

interface NearestBinFinderProps {
  bins: CampusBin[];
  userZone: BuildingZone;
  setUserZone: (zone: BuildingZone) => void;
  onSelectBinAndShowMap: (bin: CampusBin) => void;
  onReportBin: (bin: CampusBin) => void;
}

export const NearestBinFinder: React.FC<NearestBinFinderProps> = ({
  bins,
  userZone,
  setUserZone,
  onSelectBinAndShowMap,
  onReportBin,
}) => {
  const [wasteNeed, setWasteNeed] = useState<WasteType | 'any'>('both');

  const currentZoneInfo = useMemo(() => {
    return CAMPUS_ZONES.find((z) => z.id === userZone) || CAMPUS_ZONES[0];
  }, [userZone]);

  // Compute calculated distance from user's current zone center
  const rankedBins = useMemo(() => {
    const userCenter = {
      x: currentZoneInfo.coords.x + currentZoneInfo.coords.width / 2,
      y: currentZoneInfo.coords.y + currentZoneInfo.coords.height / 2,
    };

    return bins
      .filter((bin) => {
        if (wasteNeed === 'any') return true;
        if (wasteNeed === 'wet') return bin.hasWet;
        if (wasteNeed === 'dry') return bin.hasDry;
        if (wasteNeed === 'both') return bin.hasWet && bin.hasDry;
        if (wasteNeed === 'e-waste') return bin.hasEwaste;
        return true;
      })
      .map((bin) => {
        // Euclidean percentage distance scaled to approximate campus meters (100% ~ 200m)
        const dx = (bin.coords.x - userCenter.x) * 2.2;
        const dy = (bin.coords.y - userCenter.y) * 1.8;
        const approxMeters = Math.round(Math.sqrt(dx * dx + dy * dy) * 1.8);
        const approxSeconds = Math.max(15, Math.round(approxMeters * 0.8));

        return {
          ...bin,
          distanceMeters: approxMeters,
          walkingSeconds: approxSeconds,
        };
      })
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }, [bins, currentZoneInfo, wasteNeed]);

  const closestBin = rankedBins[0];
  const alternativeBins = rankedBins.slice(1, 4);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Nearest Dustbin Radar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit',sans-serif]">
            Find the closest dustbin in seconds
          </h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Never litter or keep trash in your bag. Select where you are on campus and what you need to dispose of.
          </p>

          {/* Form selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {/* Location selector */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <label className="text-xs font-semibold text-emerald-200 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                Where Are You Right Now?
              </label>
              <select
                id="finder-user-location"
                value={userZone}
                onChange={(e) => setUserZone(e.target.value as BuildingZone)}
                className="w-full bg-slate-900/90 text-white rounded-xl px-3 py-2 text-sm font-semibold border border-white/20 focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
              >
                {CAMPUS_ZONES.map((zone) => (
                  <option key={zone.id} value={zone.id} className="bg-slate-900 text-white">
                    📍 {zone.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Waste type selector */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <label className="text-xs font-semibold text-sky-200 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-sky-400" />
                What Are You Disposing?
              </label>
              <select
                id="finder-waste-type"
                value={wasteNeed}
                onChange={(e) => setWasteNeed(e.target.value as WasteType | 'any')}
                className="w-full bg-slate-900/90 text-white rounded-xl px-3 py-2 text-sm font-semibold border border-white/20 focus:outline-hidden focus:ring-2 focus:ring-sky-400"
              >
                <option value="both">🟢 + 🔵 Dual Station (Wet & Dry Together)</option>
                <option value="wet">🟢 Wet Waste Only (Food, Fruits, Tea)</option>
                <option value="dry">🔵 Dry Waste Only (Bottles, Paper, Wrappers)</option>
                <option value="e-waste">⚡ E-Waste (Dead Batteries, Cables)</option>
                <option value="any">🗑️ Any Available Dustbin</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Closest Result Card */}
      {closestBin ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/80 shadow-md relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/25">
                <Footprints className="w-7 h-7" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    Closest Match
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {closestBin.floor}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-['Outfit',sans-serif]">
                  {closestBin.name}
                </h3>
                <p className="text-sm text-slate-600 flex items-center gap-1.5 mt-1 font-medium">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  {closestBin.locationName}
                </p>
              </div>
            </div>

            {/* Walking Distance & Duration Pill */}
            <div className="flex items-center gap-4 bg-emerald-50/70 border border-emerald-200/80 px-4 py-3 rounded-2xl">
              <div className="text-right">
                <div className="text-2xl font-black text-emerald-950 font-['Outfit',sans-serif]">
                  {closestBin.distanceMeters} m
                </div>
                <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  ~{closestBin.walkingSeconds} sec walk
                </div>
              </div>
              <div className="h-8 w-px bg-emerald-200"></div>
              <div>
                <div
                  className={`text-sm font-bold ${
                    closestBin.fillLevel >= 85
                      ? 'text-rose-700'
                      : closestBin.fillLevel >= 60
                      ? 'text-amber-700'
                      : 'text-emerald-700'
                  }`}
                >
                  {closestBin.fillLevel}% Full
                </div>
                <div className="text-xs text-slate-500">
                  {closestBin.fillLevel < 80 ? 'Plenty of space' : 'Filling up'}
                </div>
              </div>
            </div>
          </div>

          {/* Details & Directions grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Landmark & Navigation
              </div>
              <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                {closestBin.landmark}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Waste Compartments
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {closestBin.hasWet && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
                    🟢 Green (Wet Waste)
                  </span>
                )}
                {closestBin.hasDry && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 border border-sky-200">
                    🔵 Blue (Dry Waste)
                  </span>
                )}
                {closestBin.hasEwaste && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-800 text-amber-300">
                    ⚡ E-Waste
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Hygiene Status
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Emptied {closestBin.lastEmptied}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Cleaned by campus housekeeping team
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              id="btn-show-closest-map"
              onClick={() => onSelectBinAndShowMap(closestBin)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-colors"
            >
              <span>View Route on Campus Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-report-closest-bin"
              onClick={() => onReportBin(closestBin)}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs border border-amber-200 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Report Bin Full / Damaged</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">No bins matching this filter nearby</h3>
          <p className="text-xs text-slate-500 mt-1">Try switching to "Any Available Dustbin" to see all spots.</p>
        </div>
      )}

      {/* Nearby Alternatives */}
      {alternativeBins.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 px-1">
            Other Nearby Dustbins:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alternativeBins.map((bin) => (
              <div
                key={bin.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-extrabold text-emerald-700">{bin.distanceMeters} meters away</span>
                    <span className="text-slate-400">~{bin.walkingSeconds}s</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 font-['Outfit',sans-serif]">
                    {bin.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{bin.locationName}</p>

                  <div className="flex items-center gap-1.5 my-3">
                    {bin.hasWet && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Wet Waste"></span>
                    )}
                    {bin.hasDry && (
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500" title="Dry Waste"></span>
                    )}
                    {bin.hasEwaste && (
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-900" title="E-Waste"></span>
                    )}
                    <span className="text-[11px] text-slate-500 ml-1">
                      {bin.fillLevel}% full ({bin.floor})
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectBinAndShowMap(bin)}
                  className="w-full py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <span>Highlight on Map</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
