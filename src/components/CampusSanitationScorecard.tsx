import React, { useState, useEffect } from 'react';
import { CampusBin, ReportTicket } from '../types';
import { 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  Leaf, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CampusSanitationScorecardProps {
  bins: CampusBin[];
  tickets: ReportTicket[];
  compact?: boolean;
}

export const CampusSanitationScorecard: React.FC<CampusSanitationScorecardProps> = ({
  bins,
  tickets,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [timeUntilSweep, setTimeUntilSweep] = useState<string>('38m 20s');

  // Calculate dynamic statistics
  const totalBins = bins.length;
  const normalBins = bins.filter((b) => b.fillLevel < 60 && b.status === 'normal').length;
  const fillingBins = bins.filter((b) => b.fillLevel >= 60 && b.fillLevel < 80).length;
  const alertBins = bins.filter((b) => b.fillLevel >= 80 || b.status === 'full').length;

  const resolvedTicketsCount = tickets.filter((t) => t.status === 'resolved').length;
  const activeTicketsCount = tickets.filter((t) => t.status !== 'resolved').length;

  // SBM Index formula: base 98 minus penalties for full bins and active tickets
  const penalty = (alertBins * 1.8) + (activeTicketsCount * 0.9);
  const cleanlinessScore = Math.max(78, Math.min(99.4, Number((98.5 - penalty).toFixed(1))));

  // Housekeeping shift countdown calculation
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMin = now.getMinutes();
      const currentSec = now.getSeconds();

      // Shifts at 07:00, 15:30, 20:00
      let targetHour = 15;
      let targetMin = 30;
      let shiftLabel = 'Shift B (Afternoon)';

      const currentTimeMins = currentHour * 60 + currentMin;
      if (currentTimeMins < 7 * 60) {
        targetHour = 7;
        targetMin = 0;
        shiftLabel = 'Shift A (Morning)';
      } else if (currentTimeMins < 15 * 60 + 30) {
        targetHour = 15;
        targetMin = 30;
        shiftLabel = 'Shift B (Afternoon)';
      } else if (currentTimeMins < 20 * 60) {
        targetHour = 20;
        targetMin = 0;
        shiftLabel = 'Shift C (Evening)';
      } else {
        targetHour = 24 + 7;
        targetMin = 0;
        shiftLabel = 'Shift A (Tomorrow Morning)';
      }

      const totalTargetSeconds = (targetHour * 3600) + (targetMin * 60);
      const totalCurrentSeconds = (currentHour * 3600) + (currentMin * 60) + currentSec;
      const diffSeconds = Math.max(0, totalTargetSeconds - totalCurrentSeconds);

      const hours = Math.floor(diffSeconds / 3600);
      const minutes = Math.floor((diffSeconds % 3600) / 60);
      const seconds = diffSeconds % 60;

      if (hours > 0) {
        setTimeUntilSweep(`${hours}h ${minutes}m ${seconds}s &bull; ${shiftLabel}`);
      } else {
        setTimeUntilSweep(`${minutes}m ${seconds}s &bull; ${shiftLabel}`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg border border-stone-200 shadow-2xs overflow-hidden">
      {/* Header bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3 sm:p-4 bg-stone-50/90 border-b border-stone-200 flex items-center justify-between cursor-pointer select-none hover:bg-stone-100/70 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#134E3A] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-stone-900 font-editorial">
                NIT Patna SBM Cleanliness Index &amp; Sanitation Live Scorecard
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-[#134E3A] border border-emerald-200 font-mono-code">
                Grade A+ Star
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Swachh Survekshan Compliant &bull; Next sweep in <span dangerouslySetInnerHTML={{ __html: timeUntilSweep }} />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-base font-bold text-stone-900 font-editorial">
              {cleanlinessScore}%
            </div>
            <span className="text-[10px] text-stone-500 font-mono-code">Institutional Index</span>
          </div>

          <button
            type="button"
            className="p-1 text-stone-500 hover:text-stone-800 transition-colors"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Metrics Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-5 space-y-4 text-xs border-t border-stone-100">
              {/* Top 4 Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="p-3 rounded bg-stone-50 border border-stone-200 transition-shadow"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block font-mono-code">
                    Sanitation Index
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-xl sm:text-2xl font-bold text-stone-900 font-editorial">
                      {cleanlinessScore}%
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold font-mono-code">
                      +1.2% wk
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5">Based on clearance speed</p>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -2 }}
                  className="p-3 rounded bg-stone-50 border border-stone-200 transition-shadow"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block font-mono-code">
                    Station Availability
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-xl sm:text-2xl font-bold text-stone-900 font-editorial">
                      {totalBins - alertBins} / {totalBins}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono-code">
                      {Math.round(((totalBins - alertBins) / totalBins) * 100)}%
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5">Under 80% capacity limit</p>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -2 }}
                  className="p-3 rounded bg-stone-50 border border-stone-200 transition-shadow"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block font-mono-code">
                    Housekeeping Turnaround
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-xl sm:text-2xl font-bold text-stone-900 font-editorial">
                      18 mins
                    </span>
                    <span className="text-[10px] text-[#134E3A] font-semibold font-mono-code">
                      Avg SLA
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5">From report to dispatch</p>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -2 }}
                  className="p-3 rounded bg-stone-50 border border-stone-200 transition-shadow"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block font-mono-code">
                    Compost &amp; Recycled
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-xl sm:text-2xl font-bold text-[#134E3A] font-editorial">
                      480 kg
                    </span>
                    <span className="text-[10px] text-emerald-700 font-mono-code flex items-center">
                      <Leaf className="w-2.5 h-2.5 mr-0.5" /> Organic
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5">Diverted from landfill</p>
                </motion.div>
              </div>

              {/* Fill Level Breakdown Visual Bar */}
              <div className="p-3.5 rounded bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-stone-800 font-editorial">
                    Real-Time Campus Capacity Distribution:
                  </span>
                  <div className="flex items-center gap-3 font-mono-code text-[10px] text-stone-600">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#134E3A]"></span>
                      <span>Normal ({normalBins})</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>Filling ({fillingBins})</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                      <span>Attention ({alertBins})</span>
                    </span>
                  </div>
                </div>

                {/* Segmented progress bar */}
                <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden flex">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(normalBins / totalBins) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="bg-[#134E3A] h-full"
                    title={`Normal: ${normalBins}`}
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(fillingBins / totalBins) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                    className="bg-amber-500 h-full"
                    title={`Filling: ${fillingBins}`}
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(alertBins / totalBins) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                    className="bg-rose-600 h-full"
                    title={`Attention: ${alertBins}`}
                  />
                </div>
              </div>

              {/* Sector compliance breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div className="p-2.5 rounded bg-white border border-stone-200 flex items-center justify-between">
                  <div>
                    <strong className="text-stone-800 block">Academic &amp; Labs Quad</strong>
                    <span className="text-[10px] text-stone-500">CSE, ECE, Civil, Library</span>
                  </div>
                  <span className="font-mono-code font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    98% Clean
                  </span>
                </div>

                <div className="p-2.5 rounded bg-white border border-stone-200 flex items-center justify-between">
                  <div>
                    <strong className="text-stone-800 block">Residential &amp; Hostels</strong>
                    <span className="text-[10px] text-stone-500">Brahmaputra, Kosi, Bagmati</span>
                  </div>
                  <span className="font-mono-code font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                    92% Clean
                  </span>
                </div>

                <div className="p-2.5 rounded bg-white border border-stone-200 flex items-center justify-between">
                  <div>
                    <strong className="text-stone-800 block">Student Activity &amp; Food</strong>
                    <span className="text-[10px] text-stone-500">SAC Canteen, Cafeteria</span>
                  </div>
                  <span className="font-mono-code font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    89% Clean
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
