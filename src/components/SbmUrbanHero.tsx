import React, { useRef } from 'react';
import { 
  Compass, 
  AlertTriangle, 
  Award, 
  MapPin, 
  CheckCircle2, 
  QrCode, 
  Leaf, 
  Recycle, 
  ArrowRight,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
// Permanently bundled original NIT Patna Sports Complex photo (249KB user original)
import heroImage from '../assets/images/nit_patna_stadium.jpg';

interface SbmUrbanHeroProps {
  currentLang: 'en' | 'hi';
  onNavigateTab: (tab: 'map' | 'finder' | 'guide' | 'alerts') => void;
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
  // Permanent deployment image — bundled with the app build
  const activeImage = heroImage;
  const heroRef = useRef<HTMLDivElement>(null);

  // Smooth parallax scroll response for hero image
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <div className="w-full mb-6">
      {/* Main Hero Card Container with Permanent Bundled Original Photo */}
      <div 
        ref={heroRef}
        className="relative rounded-2xl overflow-hidden border border-stone-300 shadow-md bg-stone-950 text-white min-h-[460px] flex flex-col justify-between"
      >
        {/* Permanent Unedited Image with Smooth Parallax Scroll Effect */}
        <motion.div 
          style={{ y, scale }}
          className="absolute -inset-6 z-0 pointer-events-none will-change-transform"
        >
          <img
            src={activeImage}
            alt="NIT Patna Sports Complex & Major Dhyan Chand Stand"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Top Floating Badge Bar */}
        <div className="relative z-20 p-4 sm:p-6 flex items-center justify-between pointer-events-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentLang === 'hi' ? 'रा.प्रौ.सं. पटना • मेजर ध्यानचंद स्टैंड' : 'NIT Patna • Major Dhyan Chand Stand'}</span>
          </div>
        </div>

        {/* Content Container (Selected Element) */}
        <div className="relative z-10 px-4 sm:px-8 py-4 sm:py-6 max-w-2xl">
          <div className="bg-stone-950/80 backdrop-blur-md rounded-2xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
            {/* Official Badge Kicker */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF671F] text-white text-[10px] font-bold tracking-wider uppercase shadow-2xs">
                <Sparkles className="w-3 h-3" />
                {currentLang === 'hi' ? 'स्वच्छ भारत मिशन' : 'Swachh Bharat Mission'}
              </span>
              <span className="text-xs text-stone-300 hidden sm:inline">&bull;</span>
              <span className="text-xs text-stone-300 font-medium">
                {currentLang === 'hi' 
                  ? 'राष्ट्रीय प्रौद्योगिकी संस्थान पटना' 
                  : 'National Institute of Technology Patna'}
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-editorial tracking-tight text-white leading-tight">
              {currentLang === 'hi' ? (
                <>
                  कचरा मुक्त परिसर — <span className="text-[#FF9E4A]">१००% स्रोत पृथक्करण</span> एवं सतत स्वच्छता
                </>
              ) : (
                <>
                  Building a <span className="text-[#FF9E4A]">Garbage-Free Campus</span> through 100% Segregation at Source
                </>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              {currentLang === 'hi'
                ? 'आवासन और शहरी कार्य मंत्रालय (MoHUA) के दिशानिर्देशों के अनुरूप परिसर में गीले (हरा) व सूखे (नीला) कचरे का अलग-अलग संग्रहण, रियल-टाइम डस्टबिन मॉनिटरिंग एवं त्वरित स्वच्छता शिकायत निवारण।'
                : 'Empowering campus students, faculty and sanitary teams under MoHUA guidelines with geo-tagged dual dustbins (Green for Wet, Blue for Dry), live capacity monitoring, and rapid grievance redressal.'}
            </p>

            {/* Quick Actions Row */}
            <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => onNavigateTab('finder')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#046A38] hover:bg-[#03532c] text-white text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                <Compass className="w-4 h-4 text-emerald-300" />
                <span>{currentLang === 'hi' ? 'डस्टबिन खोजें' : 'Locate Dustbin'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={onOpenReportModal}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                <AlertTriangle className="w-4 h-4 text-stone-950" />
                <span>{currentLang === 'hi' ? 'शिकायत दर्ज करें' : 'File Grievance'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenPledgeModal}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>{currentLang === 'hi' ? 'शपथ लें' : 'Take Pledge'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenScanModal}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 border border-white/15 text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
              >
                <QrCode className="w-4 h-4 text-stone-200" />
                <span>{currentLang === 'hi' ? 'स्कैन' : 'Scan QR'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Official SBM-Urban Performance Dashboard Strip (Mirroring sbmurban.org) */}
        <div className="relative z-10 border-t border-white/15 bg-black/40 backdrop-blur-xs px-4 sm:px-8 py-3.5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left divide-y md:divide-y-0 md:divide-x divide-white/10">
            {/* Stat 1: 100% Source Segregation */}
            <div className="pt-2 md:pt-0 md:pr-4">
              <span className="text-[10px] text-stone-300 uppercase tracking-wider block font-mono-code">
                {currentLang === 'hi' ? 'स्रोत पृथक्करण' : 'Source Segregation'}
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-bold font-editorial text-emerald-400">100%</span>
                <span className="text-[10px] text-emerald-300 font-mono-code font-bold">Mandatory</span>
              </div>
              <p className="text-[10px] text-stone-300 truncate">Wet (Green) &amp; Dry (Blue)</p>
            </div>

            {/* Stat 2: Active Geo-Tagged Stations */}
            <div className="pt-2 md:pt-0 md:px-4">
              <span className="text-[10px] text-stone-300 uppercase tracking-wider block font-mono-code">
                {currentLang === 'hi' ? 'जियो-टैग्ड डस्टबिन' : 'Geo-Tagged Bins'}
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-bold font-editorial text-white">{totalBinsCount}</span>
                <span className="text-[10px] text-stone-300 font-mono-code">Active Stations</span>
              </div>
              <p className="text-[10px] text-stone-300 truncate">Across Academic &amp; Hostels</p>
            </div>

            {/* Stat 3: Campus GFC Rating */}
            <div className="pt-2 md:pt-0 md:px-4">
              <span className="text-[10px] text-stone-300 uppercase tracking-wider block font-mono-code">
                {currentLang === 'hi' ? 'कचरा मुक्त रैंकिंग' : 'GFC Star Rating'}
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-bold font-editorial text-amber-400">5-Star</span>
                <span className="text-[10px] text-amber-300 font-mono-code font-bold">Grade A+</span>
              </div>
              <p className="text-[10px] text-stone-300 truncate">Garbage-Free Campus</p>
            </div>

            {/* Stat 4: Rapid Resolution SLA */}
            <div className="pt-2 md:pt-0 md:pl-4">
              <span className="text-[10px] text-stone-300 uppercase tracking-wider block font-mono-code">
                {currentLang === 'hi' ? 'शिकायत समाधान दर' : 'Grievance SLA'}
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-bold font-editorial text-emerald-400">&lt; 45 Mins</span>
                <span className="text-[10px] text-emerald-300 font-mono-code font-bold">98.4%</span>
              </div>
              <p className="text-[10px] text-stone-300 truncate">
                {activeAlertsCount} {currentLang === 'hi' ? 'सक्रिय शिकायतें' : 'Pending Action'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SBM-Urban Dual Stream Color Code Bar */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Wet Waste Card */}
        <div 
          onClick={() => onNavigateTab('guide')}
          className="p-3.5 rounded-xl border-2 border-[#046A38] bg-emerald-50/70 hover:bg-emerald-50 transition-all flex items-center justify-between cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#046A38] text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#046A38] text-sm font-editorial">
                  {currentLang === 'hi' ? 'हरा डस्टबिन: गीला कचरा' : 'Green Bin: Wet Waste'}
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-[#046A38] border border-emerald-300">
                  {currentLang === 'hi' ? 'जैवनिम्नीकरणीय' : 'Biodegradable'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-900 mt-0.5">
                {currentLang === 'hi' 
                  ? 'भोजन के अवशेष, फल-सब्जी के छिलके, चाय की पत्ती, पत्ते' 
                  : 'Food scraps, cooked meals, fruit peels, tea bags, garden sweepings'}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#046A38] shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Dry Waste Card */}
        <div 
          onClick={() => onNavigateTab('guide')}
          className="p-3.5 rounded-xl border-2 border-[#0A2540] bg-blue-50/70 hover:bg-blue-50 transition-all flex items-center justify-between cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0A2540] text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0A2540] text-sm font-editorial">
                  {currentLang === 'hi' ? 'नीला डस्टबिन: सूखा कचरा' : 'Blue Bin: Dry Waste'}
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-[#0A2540] border border-blue-300">
                  {currentLang === 'hi' ? 'पुनर्चक्रण योग्य' : 'Recyclable'}
                </span>
              </div>
              <p className="text-[11px] text-blue-900 mt-0.5">
                {currentLang === 'hi' 
                  ? 'कागज, कार्डबोर्ड, प्लास्टिक की बोतलें, डिब्बे, कांच, धातु' 
                  : 'Paper, cardboard, clean plastic bottles, containers, glass, cans'}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#0A2540] shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
};
