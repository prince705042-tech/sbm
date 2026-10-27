import React from 'react';

interface SbmUrbanTopBarProps {
  currentLang: 'en' | 'hi';
  onLangChange: (lang: 'en' | 'hi') => void;
  onFontSizeChange?: (size: 'small' | 'normal' | 'large') => void;
}

export const SbmUrbanTopBar: React.FC<SbmUrbanTopBarProps> = ({
  currentLang,
  onLangChange,
  onFontSizeChange,
}) => {
  return (
    <div className="w-full text-stone-700 bg-stone-100 text-xs border-b border-stone-200/90 select-none">
      {/* National Tricolor Top Accent Line */}
      <div className="h-0.5 w-full flex" aria-hidden="true">
        <div className="flex-1 bg-[#FF671F]" />
        <div className="flex-1 bg-white border-y border-stone-200" />
        <div className="flex-1 bg-[#046A38]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-3 text-[11px]">
        {/* Left: Government of India & Ministry Emblem Lockup */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="leading-tight truncate">
            <div className="font-semibold text-stone-900 tracking-tight flex items-center gap-1.5">
              <span>{currentLang === 'hi' ? 'भारत सरकार' : 'Government of India'}</span>
              <span className="text-stone-300" aria-hidden="true">·</span>
              <span className="hidden sm:inline font-normal text-stone-600">
                {currentLang === 'hi' ? 'आवासन और शहरी कार्य मंत्रालय' : 'Ministry of Housing and Urban Affairs'}
              </span>
            </div>
            <div className="text-[10px] text-stone-500 hidden md:block">
              {currentLang === 'hi' 
                ? 'स्वच्छ भारत मिशन · राष्ट्रीय उच्चतर शिक्षा परिसर स्वच्छता पोर्टल' 
                : 'Swachh Bharat Mission · Campus Sanitation & Source Segregation Portal'}
            </div>
          </div>
        </div>

        {/* Right: Accessibility Font Size & Language Switcher */}
        <div className="flex items-center gap-3 shrink-0 text-stone-600">
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-stone-500 font-mono-code">
            <span className="mr-0.5 text-stone-400">Size:</span>
            <button 
              type="button"
              onClick={() => onFontSizeChange && onFontSizeChange('small')}
              className="px-1.5 py-0.5 hover:bg-stone-200 text-stone-700 rounded transition-colors cursor-pointer font-medium"
              title="Small text"
            >
              A-
            </button>
            <button 
              type="button"
              onClick={() => onFontSizeChange && onFontSizeChange('normal')}
              className="px-1.5 py-0.5 hover:bg-stone-200 text-stone-700 rounded transition-colors cursor-pointer font-medium"
              title="Default text"
            >
              A
            </button>
            <button 
              type="button"
              onClick={() => onFontSizeChange && onFontSizeChange('large')}
              className="px-1.5 py-0.5 hover:bg-stone-200 text-stone-700 rounded transition-colors cursor-pointer font-medium"
              title="Large text"
            >
              A+
            </button>
          </div>

          <div className="h-3 w-px bg-stone-300 hidden lg:block" aria-hidden="true" />

          {/* Bilingual Switcher */}
          <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden" role="group" aria-label="Language selector">
            <button
              type="button"
              onClick={() => onLangChange('en')}
              className={`px-2.5 py-0.5 text-[10px] font-semibold transition-colors cursor-pointer ${
                currentLang === 'en'
                  ? 'bg-[#0A2540] text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onLangChange('hi')}
              className={`px-2.5 py-0.5 text-[10px] font-semibold transition-colors cursor-pointer ${
                currentLang === 'hi'
                  ? 'bg-[#0A2540] text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

