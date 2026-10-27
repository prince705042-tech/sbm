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
      {/* Main Hero Container: Architectural 2-Column Split */}
      <div className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
          
          {/* Left Column: Mission Narrative & Direct Actions (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              {/* Institutional Kicker (Clean unboxed text) */}
              <div className="flex items-center gap-2 text-xs text-stone-500 font-mono-code mb-3">
                <span className="text-[#046A38] font-semibold">NIT Patna</span>
                <span aria-hidden="true">·</span>
                <span>Swachh Bharat Mission</span>
                <span aria-hidden="true">·</span>
                <span>Campus Nodal Registry</span>
              </div>

              {/* Dominant Headline with text-wrap: balance */}
              <h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-bold font-editorial text-stone-900 leading-[1.18] tracking-tight mb-4">
                {currentLang === 'hi' ? (
                  <>
                    कचरा मुक्त परिसर: <span className="text-[#046A38]">शत-प्रतिशत स्रोत पृथक्करण</span> एवं त्वरित स्वच्छता
                  </>
                ) : (
                  <>
                    Building a Garbage-Free Campus Through <span className="text-[#046A38]">100% Segregation at Source</span>
                  </>
                )}
              </h2>

              {/* Subtitle / Context */}
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl mb-6">
                {currentLang === 'hi'
                  ? 'आवासन और शहरी कार्य मंत्रालय (MoHUA) के राष्ट्रीय दिशानिर्देशों के तहत परिसर में गीले (हरा) व सूखे (नीला) कचरे का स्रोत पर पृथक्करण, जियो-टैग्ड डस्टबिन नेटवर्क एवं त्वरित सफाई निवारण सेवा।'
                  : 'Empowering students, researchers, and campus housekeeping under national MoHUA guidelines with geo-tagged dual dustbin stations, real-time fill tracking, and rapid grievance redressal.'}
              </p>

              {/* Primary Interactive Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigateTab('finder')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#046A38] hover:bg-[#03552d] text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                >
                  <Compass className="w-4 h-4 text-emerald-200" />
                  <span>{currentLang === 'hi' ? 'निकटतम डस्टबिन खोजें' : 'Locate Nearest Bin'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={onOpenReportModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0A2540] hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-300" />
                  <span>{currentLang === 'hi' ? 'शिकायत दर्ज करें' : 'Report an Issue'}</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenPledgeModal}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-stone-300 hover:border-stone-400 text-stone-700 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>{currentLang === 'hi' ? 'स्वच्छता प्रतिज्ञा' : 'Take Pledge'}</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenScanModal}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-stone-200 hover:border-stone-300 text-stone-600 hover:text-stone-900 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                  title="Scan bin QR code or enter station ID"
                >
                  <QrCode className="w-4 h-4 text-stone-500" />
                  <span className="hidden sm:inline">{currentLang === 'hi' ? 'स्कैन' : 'Scan Station'}</span>
                </button>
              </div>
            </div>

            {/* Micro Operational Status Row */}
            <div className="pt-6 mt-6 border-t border-stone-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-stone-600">
              <div>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-mono-code">
                  Stations
                </span>
                <span className="text-lg font-bold text-stone-900 tabular-nums">
                  {totalBinsCount}
                </span>
                <span className="text-[11px] text-stone-500 block">Active On-Campus</span>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-mono-code">
                  Streams
                </span>
                <span className="text-lg font-bold text-[#046A38]">
                  Dual
                </span>
                <span className="text-[11px] text-stone-500 block">Wet &amp; Dry Waste</span>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-mono-code">
                  Grievances
                </span>
                <span className="text-lg font-bold text-stone-900 tabular-nums">
                  {activeAlertsCount}
                </span>
                <span className="text-[11px] text-stone-500 block">Pending Action</span>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-mono-code">
                  Resolution
                </span>
                <span className="text-lg font-bold text-stone-900 tabular-nums">
                  &lt; 2 hrs
                </span>
                <span className="text-[11px] text-stone-500 block">Housekeeping SLA</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Campus Visual Anchor (5 cols) */}
          <div className="lg:col-span-5 relative bg-stone-100 min-h-[260px] lg:min-h-full overflow-hidden border-t lg:border-t-0 lg:border-l border-stone-200">
            <img
              src={heroImage}
              alt="NIT Patna Sports Complex and Major Dhyan Chand Stand"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Measured Vignette Scrim for Clear Label Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent pointer-events-none" />
            
            {/* Bottom Caption Pill-Free Location Marker */}
            <div className="absolute bottom-4 left-4 right-4 text-white text-xs pointer-events-none">
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Major Dhyan Chand Stand</span>
                <span className="text-stone-300">· NIT Patna Sports Complex</span>
              </div>
              <p className="text-[11px] text-stone-300 mt-0.5">
                Designated zero-litter athletic quadrant with continuous housekeeping clearance.
              </p>
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

