import React, { useState } from 'react';
import { Pause, Play } from 'lucide-react';

interface SbmUrbanHeaderProps {
  currentLang: 'en' | 'hi';
}

export const SbmUrbanHeader: React.FC<SbmUrbanHeaderProps> = ({ currentLang }) => {
  const [tickerPaused, setTickerPaused] = useState(false);

  const announcements = currentLang === 'hi' ? [
    'परिसर में शत-प्रतिशत कचरा पृथक्करण अनिवार्य: गीले कचरे के लिए हरा डस्टबिन, सूखे के लिए नीला डस्टबिन।',
    'स्वच्छ सर्वेक्षण २०२६: राष्ट्रीय उच्च शिक्षण संस्थान स्वच्छता एवं शून्य-अपशिष्ट मूल्यांकन सक्रिय।',
    'कचरा ओवरफ्लो अथवा बिखरे कचरे की त्वरित शिकायत निवारण हेतु "शिकायत दर्ज करें" पर क्लिक करें।',
    'कचरा मुक्त परिसर (GFC) पहल: परिसर स्वच्छता प्रतिज्ञा लें एवं अपना आधिकारिक ई-प्रमाण पत्र डाउनलोड करें।'
  ] : [
    'Mandatory 100% source segregation: Green bins for organic wet waste, blue bins for dry recyclables.',
    'Swachh Survekshan 2026: Campus cleanliness & zero-waste evaluation protocol in progress.',
    'Immediate housekeeping response: Report unattended litter or overflowing dustbins via Grievance Desk.',
    'Garbage-Free Campus initiative: Take the Swachhata Pledge and receive your official digital certificate.'
  ];

  return (
    <div className="w-full bg-white border-b border-stone-200">
      {/* Main Branding Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left: Gandhi Specs Wordmark + Title */}
          <div className="flex items-center gap-3.5 select-none min-w-0">
            {/* Gandhi Spectacles Symbol */}
            <div className="flex flex-col items-center shrink-0" aria-label="Swachh Bharat Logo">
              <div className="flex items-center">
                {/* Left Lens */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-stone-900 bg-white flex items-center justify-center font-bold text-[11px] sm:text-xs text-stone-900">
                  स्वच्छ
                </div>
                {/* Bridge */}
                <div className="w-3.5 sm:w-4 h-1 flex flex-col justify-between -mx-0.5">
                  <div className="h-0.5 bg-[#FF671F] w-full" />
                  <div className="h-0.5 bg-[#046A38] w-full" />
                </div>
                {/* Right Lens */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-stone-900 bg-white flex items-center justify-center font-bold text-[11px] sm:text-xs text-stone-900">
                  भारत
                </div>
              </div>
              <span className="text-[8px] font-semibold text-stone-600 tracking-wider mt-0.5 uppercase">
                एक कदम स्वच्छता की ओर
              </span>
            </div>

            {/* Subtle Vertical Divider */}
            <div className="h-9 w-px bg-stone-200 hidden sm:block" aria-hidden="true" />

            {/* Title & Institutional Subtitle */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-stone-900 font-editorial tracking-tight truncate">
                  {currentLang === 'hi' ? 'स्वच्छ परिसर पोर्टल' : 'Swachh Campus Portal'}
                </h1>
                <span className="text-[10px] font-mono-code font-medium text-stone-500 uppercase tracking-wider">
                  NIT Patna
                </span>
              </div>
              <p className="text-xs text-stone-600 font-normal truncate mt-0.5">
                {currentLang === 'hi' 
                  ? 'राष्ट्रीय प्रौद्योगिकी संस्थान पटना · आवासन और शहरी कार्य मंत्रालय (MoHUA)' 
                  : 'National Institute of Technology Patna · Ministry of Housing and Urban Affairs'}
              </p>
            </div>
          </div>

          {/* Right: Unboxed Institutional Accreditation Status */}
          <div className="hidden lg:flex items-center gap-6 text-xs text-stone-600 border-l border-stone-200 pl-6 shrink-0">
            <div>
              <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                <span className="text-amber-600 font-editorial text-sm">★</span>
                <span>5-Star GFC</span>
              </div>
              <div className="text-[11px] text-stone-500">Garbage-Free Campus</div>
            </div>
            <div>
              <div className="font-semibold text-stone-900">Swachh Survekshan</div>
              <div className="text-[11px] text-stone-500">2026 Audit Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Official SBM Announcement Ticker */}
      <div className="bg-stone-50 border-t border-stone-200/80 py-1 px-4 sm:px-6 lg:px-8 text-xs text-stone-700 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden flex-1">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[#046A38] shrink-0 font-mono-code">
            {currentLang === 'hi' ? 'सूचना' : 'Bulletin'}
          </span>
          <span className="text-stone-300" aria-hidden="true">|</span>

          <div className="overflow-hidden whitespace-nowrap relative flex-1 text-[11px] font-normal text-stone-700">
            <div 
              className={`inline-block ${tickerPaused ? '' : 'animate-[marquee_30s_linear_infinite]'}`}
              style={{ display: 'inline-block' }}
            >
              {announcements.map((item, idx) => (
                <span key={idx} className="mr-10">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setTickerPaused(!tickerPaused)}
          className="p-1 rounded text-stone-500 hover:text-stone-900 hover:bg-stone-200/80 transition-colors shrink-0 cursor-pointer"
          title={tickerPaused ? "Resume bulletin scroll" : "Pause bulletin scroll"}
          aria-label={tickerPaused ? "Resume bulletin scroll" : "Pause bulletin scroll"}
        >
          {tickerPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
};

