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
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Search Header Banner */}
      <div className="bg-stone-900 rounded-lg p-5 sm:p-6 text-stone-100 border border-stone-800 shadow-2xs relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-stone-800 text-emerald-300 text-[10px] font-bold mb-2.5 border border-stone-700 font-mono-code uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Proximity Radar &bull; Geodetic Routing</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-editorial text-white">
            Locate Nearest Campus Disposal Station
          </h2>
          <p className="text-stone-300 text-xs mt-1.5 leading-relaxed">
            Eliminate littering through immediate proximity mapping. Specify your current academic or residential quadrant and the waste stream to route to the nearest receptacle.
          </p>

          {/* Form selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {/* Location selector */}
            <div className="bg-stone-800/80 rounded p-3 border border-stone-700">
              <label className="text-[10px] font-bold text-stone-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1 font-mono-code">
                <Navigation className="w-3 h-3 text-emerald-400" />
                Current Campus Quadrant
              </label>
              <select
                id="finder-user-location"
                value={userZone}
                onChange={(e) => setUserZone(e.target.value as BuildingZone)}
                className="w-full bg-stone-900 text-stone-100 rounded px-2.5 py-1.5 text-xs font-medium border border-stone-700 focus:outline-hidden focus:border-stone-500"
              >
                {CAMPUS_ZONES.map((zone) => (
                  <option key={zone.id} value={zone.id} className="bg-stone-900 text-stone-100">
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Waste type selector */}
            <div className="bg-stone-800/80 rounded p-3 border border-stone-700">
              <label className="text-[10px] font-bold text-stone-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1 font-mono-code">
                <Search className="w-3 h-3 text-sky-400" />
                Target Material Stream
              </label>
              <select
                id="finder-waste-type"
                value={wasteNeed}
                onChange={(e) => setWasteNeed(e.target.value as WasteType | 'any')}
                className="w-full bg-stone-900 text-stone-100 rounded px-2.5 py-1.5 text-xs font-medium border border-stone-700 focus:outline-hidden focus:border-stone-500"
              >
                <option value="both">Dual Stream Station (Green Wet + Blue Dry)</option>
                <option value="wet">Biodegradable / Organic (Green Only)</option>
                <option value="dry">Dry Recyclable Fraction (Blue Only)</option>
                <option value="e-waste">Electronic &amp; Toxic Residue (E-Waste Box)</option>
                <option value="any">All Campus Collection Points</option>
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg p-5 sm:p-6 border border-stone-300 shadow-2xs relative"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded bg-emerald-50 text-[#134E3A] border border-emerald-200 flex items-center justify-center shrink-0">
                  <Footprints className="w-5 h-5" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-[#134E3A] border border-emerald-200 px-2 py-0.5 rounded font-mono-code">
                      Optimal Routing
                    </span>
                    <span className="text-xs font-medium text-stone-500 font-mono-code">
                      {closestBin.floor}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 mt-1 font-editorial">
                    {closestBin.name}
                  </h3>
                  <p className="text-xs text-stone-600 flex items-center gap-1.5 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#134E3A]" />
                    {closestBin.locationName}
                  </p>
                </div>
              </div>

              {/* Walking Distance & Duration Pill */}
              <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 px-3.5 py-2 rounded font-mono-code">
                <div className="text-right">
                  <div className="text-xl font-bold text-stone-900 font-editorial">
                    {closestBin.distanceMeters} m
                  </div>
                  <div className="text-[11px] font-medium text-stone-600 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-500" />
                    ~{closestBin.walkingSeconds}s walk
                  </div>
                </div>
                <div className="h-7 w-px bg-stone-200"></div>
                <div>
                  <div
                    className={`text-xs font-bold ${
                      closestBin.fillLevel >= 85
                        ? 'text-rose-700'
                        : closestBin.fillLevel >= 60
                        ? 'text-amber-700'
                        : 'text-[#134E3A]'
                    }`}
                  >
                    {closestBin.fillLevel}% Volume
                  </div>
                  <div className="text-[10px] text-stone-500">
                    {closestBin.fillLevel < 80 ? 'Capacity available' : 'Approaching full'}
                  </div>
                </div>
              </div>
            </div>

            {/* Details & Directions grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
              <div className="p-3 rounded bg-stone-50 border border-stone-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1 font-mono-code">
                  Access &amp; Landmark
                </div>
                <p className="text-xs font-medium text-stone-800 leading-relaxed">
                  {closestBin.landmark}
                </p>
              </div>

              <div className="p-3 rounded bg-stone-50 border border-stone-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1 font-mono-code">
                  Fractions Accepted
                </div>
                <div className="flex flex-wrap gap-1 mt-1 font-mono-code">
                  {closestBin.hasWet && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
                      Wet Fraction
                    </span>
                  )}
                  {closestBin.hasDry && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-900 border border-sky-200">
                      Dry Recyclable
                    </span>
                  )}
                  {closestBin.hasEwaste && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-800 text-stone-200 border border-stone-700">
                      E-Waste Cell
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 rounded bg-stone-50 border border-stone-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1 font-mono-code">
                  Sanitation Cycle
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-stone-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#134E3A]" />
                  <span>Cleared {closestBin.lastEmptied}</span>
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">
                  Maintenance by Campus Estate Directorate
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-stone-100">
              <motion.button
                whileTap={{ scale: 0.98 }}
                id="btn-show-closest-map"
                onClick={() => onSelectBinAndShowMap(closestBin)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#134E3A] hover:bg-[#0F3E2E] text-white font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
              >
                <span>View Coordinates on Campus Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                id="btn-report-closest-bin"
                onClick={() => onReportBin(closestBin)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs border border-stone-200 transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span>Report Capacity Overflow</span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-lg p-8 text-center border border-stone-200"
          >
            <AlertTriangle className="w-6 h-6 text-amber-700 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-stone-800 font-editorial">No stations matching this stream in selected sector</h3>
            <p className="text-xs text-stone-500 mt-1">Select &ldquo;All Campus Collection Points&rdquo; to survey all available bins.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nearby Alternatives */}
      {alternativeBins.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 font-mono-code px-0.5">
            Secondary Disposal Points
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {alternativeBins.map((bin, idx) => (
              <motion.div
                key={bin.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.2 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-lg p-3.5 border border-stone-200 shadow-2xs hover:border-stone-400 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1 font-mono-code">
                    <span className="font-semibold text-[#134E3A]">{bin.distanceMeters}m</span>
                    <span className="text-stone-400">~{bin.walkingSeconds}s</span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 font-editorial">
                    {bin.name}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{bin.locationName}</p>

                  <div className="flex items-center gap-1.5 my-2.5">
                    {bin.hasWet && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600" title="Wet Waste"></span>
                    )}
                    {bin.hasDry && (
                      <span className="w-2 h-2 rounded-full bg-sky-600" title="Dry Waste"></span>
                    )}
                    {bin.hasEwaste && (
                      <span className="w-2 h-2 rounded-full bg-stone-900" title="E-Waste"></span>
                    )}
                    <span className="text-[11px] text-stone-500 ml-1 font-mono-code">
                      {bin.fillLevel}% full ({bin.floor})
                    </span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectBinAndShowMap(bin)}
                  className="w-full py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors flex items-center justify-center gap-1 border border-stone-200 cursor-pointer"
                >
                  <span>Highlight on Plan</span>
                  <ArrowRight className="w-3 h-3" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
