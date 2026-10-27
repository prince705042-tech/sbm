import React, { useState, useEffect } from 'react';
import { CampusBin, ReportTicket } from '../types';
import { 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertTriangle,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CampusSanitationScorecardProps {
  bins: CampusBin[];
  tickets: ReportTicket[];
  compact?: boolean;
}

export const CampusSanitationScorecard: React.FC<CampusSanitationScorecardProps> = React.memo(({
  bins,
  tickets,
}) => {
  // Collapsed by default for clean page hierarchy; opens on user intent
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeShiftLabel, setActiveShiftLabel] = useState<string>('Shift B (Afternoon Clearance)');

  // Factual, real statistics calculated strictly from state
  const totalBins = bins.length;
  const normalBins = bins.filter((b) => b.fillLevel < 60 && b.status === 'normal').length;
  const fillingBins = bins.filter((b) => b.fillLevel >= 60 && b.fillLevel < 80).length;
  const alertBins = bins.filter((b) => b.fillLevel >= 80 || b.status === 'full').length;

  const resolvedTicketsCount = tickets.filter((t) => t.status === 'resolved').length;
  const activeTicketsCount = tickets.filter((t) => t.status !== 'resolved').length;
  const normalPercentage = totalBins > 0 ? Math.round((normalBins / totalBins) * 100) : 100;

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentMins = currentHour * 60 + currentMin;

    if (currentMins >= 7 * 60 && currentMins < 15 * 60 + 30) {
      setActiveShiftLabel('Shift A · Morning Sweep (07:00 - 15:30)');
    } else if (currentMins >= 15 * 60 + 30 && currentMins < 20 * 60) {
      setActiveShiftLabel('Shift B · Afternoon Clearance (15:30 - 20:00)');
    } else {
      setActiveShiftLabel('Shift C · Evening Sweep & Secure (20:00 - 07:00)');
    }
  }, []);

  return (
    <section className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs mb-6" aria-label="Campus Sanitation Status">
      {/* Primary Trigger / Status Header */}
      <div 
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none hover:bg-stone-50 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#046A38] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-stone-900 tracking-tight">
                Live Sanitation &amp; Waste Station Status
              </h3>
              <span className="text-xs text-stone-400" aria-hidden="true">·</span>
              <span className="text-xs font-mono-code font-medium text-emerald-800">
                {normalPercentage}% Normal Capacity
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5 truncate flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>{activeShiftLabel}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 pl-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-stone-900 font-mono-code tabular-nums">
              {totalBins - alertBins} / {totalBins}
            </div>
            <span className="text-[11px] text-stone-500">Available Stations</span>
          </div>

          <div className="w-8 h-8 rounded-md bg-stone-100 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expandable Operational Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-stone-200"
          >
            <div className="p-5 sm:p-6 space-y-5 bg-stone-50/50 text-xs">
              
              {/* Primary Real-Data Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-lg bg-white border border-stone-200">
                  <span className="text-[11px] font-mono-code text-stone-500 block">
                    Operating Normally
                  </span>
                  <div className="text-2xl font-bold font-mono-code tabular-nums text-stone-900 mt-1">
                    {normalBins}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">Below 60% fill capacity</p>
                </div>

                <div className="p-3.5 rounded-lg bg-white border border-stone-200">
                  <span className="text-[11px] font-mono-code text-stone-500 block">
                    Filling Steadily
                  </span>
                  <div className="text-2xl font-bold font-mono-code tabular-nums text-amber-600 mt-1">
                    {fillingBins}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">60% to 79% fill capacity</p>
                </div>

                <div className="p-3.5 rounded-lg bg-white border border-stone-200">
                  <span className="text-[11px] font-mono-code text-stone-500 block">
                    Attention Required
                  </span>
                  <div className="text-2xl font-bold font-mono-code tabular-nums text-rose-600 mt-1">
                    {alertBins}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">At or above 80% capacity</p>
                </div>

                <div className="p-3.5 rounded-lg bg-white border border-stone-200">
                  <span className="text-[11px] font-mono-code text-stone-500 block">
                    Grievances Resolved
                  </span>
                  <div className="text-2xl font-bold font-mono-code tabular-nums text-[#046A38] mt-1">
                    {resolvedTicketsCount}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">{activeTicketsCount} currently in queue</p>
                </div>
              </div>

              {/* Real-Time Capacity Breakdown Visual Bar */}
              <div className="p-4 rounded-lg bg-white border border-stone-200 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
                  <span className="font-semibold text-stone-800">
                    Station Fill Level Distribution across Campus
                  </span>
                  <div className="flex items-center gap-4 text-[11px] text-stone-600 font-mono-code">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#046A38]" aria-hidden="true" />
                      <span>Normal ({normalBins})</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" aria-hidden="true" />
                      <span>Filling ({fillingBins})</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-rose-600" aria-hidden="true" />
                      <span>Attention ({alertBins})</span>
                    </span>
                  </div>
                </div>

                {/* Segmented capacity bar */}
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden flex">
                  <div 
                    style={{ width: `${totalBins > 0 ? (normalBins / totalBins) * 100 : 0}%` }}
                    className="bg-[#046A38] h-full transition-all duration-300"
                    title={`Normal: ${normalBins}`}
                  />
                  <div 
                    style={{ width: `${totalBins > 0 ? (fillingBins / totalBins) * 100 : 0}%` }}
                    className="bg-amber-500 h-full transition-all duration-300"
                    title={`Filling: ${fillingBins}`}
                  />
                  <div 
                    style={{ width: `${totalBins > 0 ? (alertBins / totalBins) * 100 : 0}%` }}
                    className="bg-rose-600 h-full transition-all duration-300"
                    title={`Attention: ${alertBins}`}
                  />
                </div>
              </div>

              {/* Campus Zones Quick Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-white border border-stone-200">
                  <span className="font-semibold text-stone-900 block">Academic &amp; Labs</span>
                  <span className="text-[11px] text-stone-500">CSE, ECE, Civil, Chemistry, Library</span>
                  <div className="mt-2 text-stone-700 font-mono-code text-[11px]">
                    Continuous daytime clearance
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white border border-stone-200">
                  <span className="font-semibold text-stone-900 block">Residential Hostels</span>
                  <span className="text-[11px] text-stone-500">Brahmaputra, Kosi, Bagmati, Ganga</span>
                  <div className="mt-2 text-stone-700 font-mono-code text-[11px]">
                    Morning &amp; evening sweeps
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white border border-stone-200">
                  <span className="font-semibold text-stone-900 block">Common Amenities</span>
                  <span className="text-[11px] text-stone-500">SAC Canteen, Cafeteria, Sports Ground</span>
                  <div className="mt-2 text-stone-700 font-mono-code text-[11px]">
                    Post-lunch &amp; break rush monitor
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

