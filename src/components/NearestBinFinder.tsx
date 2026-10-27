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
  Footprints
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
        // Euclidean percentage distance scaled to approximate campus meters
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
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Search Header Banner */}
      <div className="bg-white rounded-xl p-5 sm:p-7 border border-stone-200 shadow-xs">
        <div className="max-w-3xl">
          <div className="text-xs font-mono-code text-stone-500 mb-1.5 flex items-center gap-1.5">
            <span className="text-[#046A38] font-semibold">Proximity Locator</span>
            <span aria-hidden="true">·</span>
            <span>Campus Walking Radius</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-editorial text-stone-900">
            Find the Closest Waste Bin Station
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1 leading-relaxed">
            Select your current department or hostel quadrant and the waste stream to route to the nearest dual-stream station.
          </p>

          {/* Form selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            {/* Location selector */}
            <div>
              <label htmlFor="finder-user-location" className="text-xs font-semibold text-stone-700 block mb-1.5 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#046A38]" />
                <span>Your Current Campus Location</span>
              </label>
              <select
                id="finder-user-location"
                value={userZone}
                onChange={(e) => setUserZone(e.target.value as BuildingZone)}
                className="w-full bg-stone-50 text-stone-900 rounded-lg px-3 py-2 text-xs font-medium border border-stone-300 focus:outline-hidden focus:border-[#0A2540] transition-colors"
              >
                {CAMPUS_ZONES.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Waste type selector */}
            <div>
              <label htmlFor="finder-waste-type" className="text-xs font-semibold text-stone-700 block mb-1.5 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#0A2540]" />
                <span>Waste Stream Needed</span>
              </label>
              <select
                id="finder-waste-type"
                value={wasteNeed}
                onChange={(e) => setWasteNeed(e.target.value as WasteType | 'any')}
                className="w-full bg-stone-50 text-stone-900 rounded-lg px-3 py-2 text-xs font-medium border border-stone-300 focus:outline-hidden focus:border-[#0A2540] transition-colors"
              >
                <option value="both">Dual Station (Wet Green + Dry Blue)</option>
                <option value="wet">Biodegradable / Food Waste (Green)</option>
                <option value="dry">Dry Recyclables (Blue)</option>
                <option value="e-waste">Electronic Waste Cell</option>
                <option value="any">All Collection Points</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Closest Result Card */}
      <AnimatePresence mode="wait">
        {closestBin ? (
          <motion.div 
            key={closestBin.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200 shadow-xs"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#046A38] border border-emerald-200 flex items-center justify-center shrink-0">
                  <Footprints className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-stone-500 font-mono-code mb-0.5">
                    <span className="font-semibold text-[#046A38]">Nearest Station</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span>{closestBin.floor}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-editorial">
                    {closestBin.name}
                  </h3>
                  <p className="text-xs text-stone-600 flex items-center gap-1.5 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#046A38] shrink-0" />
                    <span>{closestBin.locationName}</span>
                  </p>
                </div>
              </div>

              {/* Walking Distance & Duration */}
              <div className="flex items-center gap-4 bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-lg shrink-0">
                <div>
                  <div className="text-xl font-bold font-mono-code tabular-nums text-stone-900">
                    {closestBin.distanceMeters} m
                  </div>
                  <div className="text-[11px] text-stone-500 flex items-center gap-1 font-mono-code">
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span>~{closestBin.walkingSeconds}s walk</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-stone-200" aria-hidden="true" />
                <div>
                  <div
                    className={`text-sm font-bold font-mono-code tabular-nums ${
                      closestBin.fillLevel >= 80
                        ? 'text-rose-600'
                        : closestBin.fillLevel >= 60
                        ? 'text-amber-600'
                        : 'text-[#046A38]'
                    }`}
                  >
                    {closestBin.fillLevel}% Full
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {closestBin.fillLevel < 80 ? 'Capacity ready' : 'High volume'}
                  </div>
                </div>
              </div>
            </div>

            {/* Details & Directions grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                <div className="text-[11px] font-mono-code text-stone-500 mb-1">
                  Access &amp; Landmark
                </div>
                <p className="text-xs font-medium text-stone-800 leading-relaxed">
                  {closestBin.landmark}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                <div className="text-[11px] font-mono-code text-stone-500 mb-1">
                  Streams Accepted
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1 text-xs">
                  {closestBin.hasWet && (
                    <span className="font-semibold text-[#046A38] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Wet Organic
                    </span>
                  )}
                  {closestBin.hasDry && (
                    <span className="font-semibold text-[#0A2540] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Dry Recyclable
                    </span>
                  )}
                  {closestBin.hasEwaste && (
                    <span className="font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-300">
                      E-Waste Cell
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                <div className="text-[11px] font-mono-code text-stone-500 mb-1">
                  Sanitation History
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-stone-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#046A38]" />
                  <span>Emptied {closestBin.lastEmptied}</span>
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Regular housekeeping cycle
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                id="btn-show-closest-map"
                onClick={() => onSelectBinAndShowMap(closestBin)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#046A38] hover:bg-[#03552d] text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                <span>View on Campus Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                id="btn-report-closest-bin"
                onClick={() => onReportBin(closestBin)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs border border-stone-200 transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Report Station Issue</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center border border-stone-200">
            <AlertTriangle className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-stone-900 font-editorial">No stations matching this stream in selected zone</h3>
            <p className="text-xs text-stone-500 mt-1">Select &ldquo;All Collection Points&rdquo; to survey all available campus bins.</p>
          </div>
        )}
      </AnimatePresence>

      {/* Nearby Alternatives */}
      {alternativeBins.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-semibold text-stone-600 font-mono-code uppercase tracking-wider">
            Alternative Nearby Stations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {alternativeBins.map((bin) => (
              <div
                key={bin.id}
                className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5 font-mono-code tabular-nums">
                    <span className="font-semibold text-[#046A38]">{bin.distanceMeters}m</span>
                    <span className="text-stone-400">~{bin.walkingSeconds}s walk</span>
                  </div>
                  <h4 className="text-sm font-semibold text-stone-900 font-editorial">
                    {bin.name}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{bin.locationName}</p>

                  <div className="flex items-center gap-2 my-3 text-[11px] text-stone-600 font-mono-code">
                    <span className="font-semibold">{bin.fillLevel}% full</span>
                    <span aria-hidden="true">·</span>
                    <span>{bin.floor}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectBinAndShowMap(bin)}
                  className="w-full py-2 text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-lg transition-colors flex items-center justify-center gap-1 border border-stone-200 cursor-pointer"
                >
                  <span>Highlight on Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

