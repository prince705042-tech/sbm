import React, { useState } from 'react';
import { Award, ShieldCheck, Sparkles, Volume2, Pause, Play, CheckCircle2 } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

interface SbmUrbanHeaderProps {
  currentLang: 'en' | 'hi';
}

export const SbmUrbanHeader: React.FC<SbmUrbanHeaderProps> = ({ currentLang }) => {
  const [tickerPaused, setTickerPaused] = useState(false);

  const announcements = currentLang === 'hi' ? [
    'स्वच्छ भारत मिशन: परिसर में १००% कचरा पृथक्करण अनिवार्य — गीले कचरे के लिए हरा डस्टबिन, सूखे के लिए नीला डस्टबिन।',
    'स्वच्छ सर्वेक्षण २०२६: राष्ट्रीय संस्थान स्वच्छता एवं शून्य-अपशिष्ट ऑडिट प्रक्रिया सक्रिय।',
    'कचरा ओवरफ्लो अथवा बिखरे कचरे की तुरंत रिपोर्ट करें — स्वच्छता शिकायत निवारण प्रकोष्ठ।',
    'कचरा मुक्त परिसर (GFC) ५-स्टार रेटिंग हेतु परिसर स्वच्छता प्रतिज्ञा लें एवं अपना प्रमाण पत्र डाउनलोड करें।'
  ] : [
    'Swachh Bharat Mission: 100% Source Segregation Mandatory — Green Bins for Wet Waste, Blue Bins for Dry Recyclables.',
    'Swachh Survekshan 2026: Higher Education Campus Cleanliness & Zero-Waste Evaluation Active.',
    'Report unattended litter or overflowing dustbins via Rapid Grievance Redressal Portal.',
    'Join the 5-Star Garbage Free Campus (GFC) drive — Take the Swachhata Pledge & download your official certificate.'
  ];

  return (
    <div className="w-full bg-white border-b border-stone-200">
      {/* Main Branding Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-6">
          {/* Left: Swachh Bharat Gandhi Glasses Logo + Title */}
          <div className="flex items-center gap-3 sm:gap-4 select-none w-full md:w-auto">
            {/* Swachh Bharat Official Glasses Vector Logo */}
            <div className="flex flex-col items-center shrink-0">
              <div className="flex items-center">
                {/* Left Lens: स्वच्छ */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[3px] border-stone-800 bg-white flex items-center justify-center font-bold text-xs sm:text-sm text-stone-900 shadow-2xs">
                  स्वच्छ
                </div>
                {/* Bridge: Indian Tricolor Bridge */}
                <div className="w-3.5 sm:w-5 h-1.5 flex flex-col justify-between -mx-0.5">
                  <div className="h-0.5 bg-[#FF671F] w-full" />
                  <div className="h-0.5 bg-stone-300 w-full" />
                  <div className="h-0.5 bg-[#046A38] w-full" />
                </div>
                {/* Right Lens: भारत */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[3px] border-stone-800 bg-white flex items-center justify-center font-bold text-xs sm:text-sm text-stone-900 shadow-2xs">
                  भारत
                </div>
              </div>
              <span className="text-[8px] sm:text-[9px] font-bold text-stone-700 tracking-tight mt-0.5 uppercase">
                एक कदम स्वच्छता की ओर
              </span>
            </div>

            {/* Vertical Separator */}
            <div className="h-10 sm:h-12 w-px bg-stone-200 hidden sm:block" />

            {/* Title & Ministry Tag */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0A2540] font-editorial tracking-tight">
                  {currentLang === 'hi' ? 'स्वच्छ भारत मिशन' : 'Swachh Bharat Mission'}
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#046A38] text-white uppercase tracking-wider shrink-0">
                  SBM
                </span>
              </div>
              <p className="text-xs text-stone-600 font-medium truncate mt-0.5">
                {currentLang === 'hi' 
                  ? 'आवासन और शहरी कार्य मंत्रालय | राष्ट्रीय प्रौद्योगिकी संस्थान पटना — नोडल स्वच्छता प्रकोष्ठ' 
                  : 'Ministry of Housing and Urban Affairs | NIT Patna Campus Sanitation & Segregation Registry'}
              </p>
            </div>
          </div>

          {/* Right: National Mission Pillars Badges (Mirroring sbmurban.org) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap justify-end w-full md:w-auto">
            {/* GFC 5 Star */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 shadow-2xs">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                ★
              </div>
              <div className="text-left leading-none">
                <span className="block text-[10px] font-bold text-amber-900 font-editorial">5-Star GFC</span>
                <span className="text-[9px] text-amber-700 font-medium">Garbage Free Campus</span>
              </div>
            </div>

            {/* Swachh Survekshan */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 shadow-2xs">
              <div className="w-6 h-6 rounded-full bg-[#0A2540] text-white flex items-center justify-center font-bold text-xs shrink-0">
                🏆
              </div>
              <div className="text-left leading-none">
                <span className="block text-[10px] font-bold text-blue-950 font-editorial">Swachh Survekshan</span>
                <span className="text-[9px] text-blue-700 font-medium">2026 Evaluation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official SBM-Urban Announcement News Ticker */}
      <div className="bg-[#FFF9F2] border-t border-amber-200/70 py-1.5 px-3 sm:px-6 lg:px-8 text-xs text-amber-950 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FF671F] text-white font-bold text-[10px] uppercase tracking-wider shrink-0 shadow-2xs">
            <Sparkles className="w-2.5 h-2.5" />
            {currentLang === 'hi' ? 'नवीनतम सूचना' : 'Bulletin'}
          </span>

          <div className="overflow-hidden whitespace-nowrap relative flex-1 text-[11px] font-medium text-stone-800">
            <div 
              className={`inline-block ${tickerPaused ? '' : 'animate-[marquee_30s_linear_infinite]'}`}
              style={{ display: 'inline-block' }}
            >
              {announcements.map((item, idx) => (
                <span key={idx} className="mr-8">
                  &bull; {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setTickerPaused(!tickerPaused)}
          className="p-1 rounded text-stone-500 hover:text-stone-900 hover:bg-amber-100/80 transition-colors shrink-0 cursor-pointer"
          title={tickerPaused ? "Resume announcement scroll" : "Pause announcement scroll"}
        >
          {tickerPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
};
