import React from 'react';
import { 
  Compass, 
  AlertTriangle, 
  Award, 
  MapPin, 
  Leaf, 
  Recycle, 
  ArrowRight,
  QrCode
} from 'lucide-react';
import heroImage from '../assets/images/nit_patna_stadium.jpg';

import { AppRoute } from '../utils/seo';

interface SbmUrbanHeroProps {
  currentLang: 'en' | 'hi';
  onNavigateTab: (tab: AppRoute) => void;
  onOpenReportModal: () => void;
  onOpenScanModal: () => void;
  onOpenPledgeModal: () => void;
  totalBinsCount: number;
  activeAlertsCount: number;
}

export const SbmUrbanHero: React.FC<SbmUrbanHeroProps> = ({
  currentLang,
  onNavigateTab,
  onOpenReportModal,
  onOpenScanModal,
  onOpenPledgeModal,
  totalBinsCount,
  activeAlertsCount,
}) => {
  return (
    <section className="w-full mb-6" aria-label="Campus Sanitation Overview">
      {/* Main Hero Container: Image Background with Foreground Content Overlay */}
      <div className="relative rounded-2xl border border-stone-700/30 overflow-hidden shadow-lg bg-stone-950">
        {/* Full-bleed Background Image with Multi-Stop Dark Gradient Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="NIT Patna Sports Complex and Major Dhyan Chand Stand"
            className="w-full h-full object-cover object-center transform scale-[1.01]"
            referrerPolicy="no-referrer"
          />
          {/* Multi-stop scrim: Deep gradient from left (laptop/tablet) and bottom-up (mobile) for 100% contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/85 to-stone-950/50 sm:to-stone-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-stone-950/30" />
        </div>

        {/* Foreground Content: Text, Badges, Direct Actions, and Live Stats */}
        <div className="relative z-10 p-5 sm:p-8 lg:p-10 flex flex-col justify-between min-h-[440px] sm:min-h-[460px] lg:min-h-[490px]">
          <div>
            {/* Institutional Kicker & Campus Location Pill */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-[11px] tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                NIT Patna
              </span>
              <span className="text-stone-400 text-xs">·</span>
              <span className="text-stone-300 text-xs">Swachh Bharat Mission</span>
              <span className="text-stone-400 text-xs hidden sm:inline">·</span>
              <span className="text-stone-400 text-xs hidden sm:inline">Campus Nodal Registry</span>
            </div>

            {/* Dominant Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-[2.35rem] font-bold font-editorial text-white leading-[1.18] tracking-tight mb-3.5 max-w-2xl sm:max-w-3xl drop-shadow-md">
              {currentLang === 'hi' ? (
                <>
                  कचरा मुक्त परिसर: <span className="text-emerald-400 underline decoration-emerald-500/50 decoration-2 underline-offset-4">शत-प्रतिशत स्रोत पृथक्करण</span> एवं त्वरित स्वच्छता
                </>
              ) : (
                <>
                  Building a Garbage-Free Campus Through <span className="text-emerald-400 underline decoration-emerald-500/50 decoration-2 underline-offset-4">100% Segregation at Source</span>
                </>
              )}
            </h2>

            {/* Subtitle / Context */}
            <p className="text-xs sm:text-sm lg:text-[0.95rem] text-stone-200 leading-relaxed max-w-xl lg:max-w-2xl mb-6 drop-shadow-sm font-normal">
              {currentLang === 'hi'
                ? 'आवासन और शहरी कार्य मंत्रालय (MoHUA) के राष्ट्रीय दिशानिर्देशों के तहत परिसर में गीले (हरा) व सूखे (नीला) कचरे का स्रोत पर पृथक्करण, जियो-टैग्ड डस्टबिन नेटवर्क एवं त्वरित सफाई निवारण सेवा।'
                : 'Empowering students, researchers, and campus housekeeping under national MoHUA guidelines with geo-tagged dual dustbin stations, real-time fill tracking, and rapid grievance redressal.'}
            </p>

            {/* Primary Interactive Actions */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => onNavigateTab('finder')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap shadow-md shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40"
              >
                <Compass className="w-4 h-4 text-emerald-100" />
                <span>{currentLang === 'hi' ? 'निकटतम डस्टबिन खोजें' : 'Locate Nearest Bin'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-200" />
              </button>

              <button
                type="button"
                onClick={onOpenReportModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all duration-150 cursor-pointer whitespace-nowrap shadow-md shadow-amber-950/30 hover:scale-[1.02] active:scale-[0.98] border border-amber-300/50"
              >
                <AlertTriangle className="w-4 h-4 text-stone-950" />
                <span>{currentLang === 'hi' ? 'शिकायत दर्ज करें' : 'Report an Issue'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenPledgeModal}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all duration-150 cursor-pointer whitespace-nowrap backdrop-blur-md border border-white/20 hover:border-white/40"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>{currentLang === 'hi' ? 'स्वच्छता प्रतिज्ञा' : 'Take Pledge'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenScanModal}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all duration-150 cursor-pointer whitespace-nowrap backdrop-blur-md border border-white/20 hover:border-white/40"
                title="Scan bin QR code or enter station ID"
              >
                <QrCode className="w-4 h-4 text-stone-200" />
                <span className="hidden sm:inline">{currentLang === 'hi' ? 'स्कैन' : 'Scan Station'}</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Micro Operational Status & Photo Location Badge */}
          <div className="pt-5 mt-6 border-t border-white/15 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 text-stone-200">
              <div className="bg-stone-900/60 backdrop-blur-sm sm:bg-transparent rounded-lg p-2.5 sm:p-0 border border-white/10 sm:border-0">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-mono-code">
                  Stations
                </span>
                <span className="text-lg sm:text-xl font-bold text-white tabular-nums">
                  {totalBinsCount}
                </span>
                <span className="text-[11px] text-stone-300 block">Active On-Campus</span>
              </div>

              <div className="bg-stone-900/60 backdrop-blur-sm sm:bg-transparent rounded-lg p-2.5 sm:p-0 border border-white/10 sm:border-0">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-mono-code">
                  Streams
                </span>
                <span className="text-lg sm:text-xl font-bold text-emerald-400">
                  Dual
                </span>
                <span className="text-[11px] text-stone-300 block">Wet &amp; Dry Waste</span>
              </div>

              <div className="bg-stone-900/60 backdrop-blur-sm sm:bg-transparent rounded-lg p-2.5 sm:p-0 border border-white/10 sm:border-0">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-mono-code">
                  Grievances
                </span>
                <span className="text-lg sm:text-xl font-bold text-amber-300 tabular-nums">
                  {activeAlertsCount}
                </span>
                <span className="text-[11px] text-stone-300 block">Pending Action</span>
              </div>

              <div className="bg-stone-900/60 backdrop-blur-sm sm:bg-transparent rounded-lg p-2.5 sm:p-0 border border-white/10 sm:border-0">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-mono-code">
                  Resolution
                </span>
                <span className="text-lg sm:text-xl font-bold text-white tabular-nums">
                  &lt; 2 hrs
                </span>
                <span className="text-[11px] text-stone-300 block">Housekeeping SLA</span>
              </div>
            </div>

            {/* Photo Location Marker on bottom-right */}
            <div className="flex items-center gap-1.5 text-xs text-stone-300 bg-stone-950/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/15 self-start md:self-auto">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-semibold text-white">Major Dhyan Chand Stand</span>
              <span className="text-stone-300 hidden sm:inline">· Sports Complex</span>
            </div>
          </div>
        </div>
      </div>

      {/* SBM Dual-Stream Source Segregation Reference Strip */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Green Receptacle Guide */}
        <div 
          onClick={() => onNavigateTab('guide')}
          className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition-colors flex items-center justify-between cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label="View Wet Waste guidelines"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-md bg-[#046A38] text-white flex items-center justify-center shrink-0">
              <Leaf className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#046A38] text-sm">
                  {currentLang === 'hi' ? 'हरा डस्टबिन: गीला कचरा' : 'Green Bin: Wet Waste'}
                </span>
                <span className="text-[10px] text-emerald-700 font-mono-code">Biodegradable</span>
              </div>
              <p className="text-stone-600 text-[11px] truncate mt-0.5">
                {currentLang === 'hi' 
                  ? 'भोजन के अवशेष, फल-सब्जी के छिलके, पत्तियां, चाय की पत्ती' 
                  : 'Food scraps, cooked meals, peels, leaves, teabags, organic leftovers'}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-700 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </div>

        {/* Blue Receptacle Guide */}
        <div 
          onClick={() => onNavigateTab('guide')}
          className="p-3.5 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors flex items-center justify-between cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label="View Dry Waste guidelines"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-md bg-[#0A2540] text-white flex items-center justify-center shrink-0">
              <Recycle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#0A2540] text-sm">
                  {currentLang === 'hi' ? 'नीला डस्टबिन: सूखा कचरा' : 'Blue Bin: Dry Waste'}
                </span>
                <span className="text-[10px] text-blue-700 font-mono-code">Recyclable</span>
              </div>
              <p className="text-stone-600 text-[11px] truncate mt-0.5">
                {currentLang === 'hi' 
                  ? 'कागज, कार्डबोर्ड, प्लास्टिक की बोतलें, डिब्बे, कांच, धातु के कैन' 
                  : 'Paper, cardboard, clean plastic bottles, cans, glassware, containers'}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-blue-700 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </div>
      </div>
    </section>
  );
};

