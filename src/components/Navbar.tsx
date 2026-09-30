import React, { useState } from 'react';
import { 
  MapPin, 
  Compass, 
  BookOpen, 
  AlertTriangle, 
  ShieldCheck, 
  Menu, 
  X,
  QrCode,
  Award,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  activeTab: 'map' | 'finder' | 'guide' | 'alerts';
  setActiveTab: (tab: 'map' | 'finder' | 'guide' | 'alerts') => void;
  onOpenReportModal: () => void;
  onOpenAddBinModal?: () => void;
  onOpenScanModal?: () => void;
  onOpenPledgeModal?: () => void;
  activeAlertsCount: number;
  totalBinsCount: number;
  isAdmin: boolean;
  onAdminLogout: () => void;
  currentLang?: 'en' | 'hi';
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onOpenAddBinModal,
  onOpenScanModal,
  onOpenPledgeModal,
  activeAlertsCount,
  totalBinsCount,
  isAdmin,
  currentLang = 'en',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: 'map' | 'finder' | 'guide' | 'alerts') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-30 bg-[#0A2540] text-white shadow-md border-b-2 border-[#FF671F] select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-15 gap-2 sm:gap-4">
          {/* Left: Desktop Tab Links (Government Navigation Bar Style) */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-1.5 h-full overflow-x-auto no-scrollbar">
            {/* Tab 1: Campus Map */}
            <button
              id="tab-campus-map"
              type="button"
              onClick={() => handleTabClick('map')}
              className={`relative h-full flex items-center gap-1.5 px-3 lg:px-3.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'map'
                  ? 'text-white bg-white/10'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${activeTab === 'map' ? 'text-[#FF9E4A]' : 'text-stone-300'}`} />
              <span>{currentLang === 'hi' ? 'परिसर मानचित्र' : 'Campus Map & Bins'}</span>
              {activeTab === 'map' && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF671F]" />
              )}
            </button>

            {/* Tab 2: Find Nearest Dustbin */}
            <button
              id="tab-nearest-bin"
              type="button"
              onClick={() => handleTabClick('finder')}
              className={`relative h-full flex items-center gap-1.5 px-3 lg:px-3.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'finder'
                  ? 'text-white bg-white/10'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 ${activeTab === 'finder' ? 'text-[#FF9E4A]' : 'text-stone-300'}`} />
              <span>{currentLang === 'hi' ? 'निकटतम डस्टबिन' : 'Find Nearest'}</span>
              {activeTab === 'finder' && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF671F]" />
              )}
            </button>

            {/* Tab 3: Waste Segregation Guide */}
            <button
              id="tab-sorting-guide"
              type="button"
              onClick={() => handleTabClick('guide')}
              className={`relative h-full flex items-center gap-1.5 px-3 lg:px-3.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'guide'
                  ? 'text-white bg-white/10'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${activeTab === 'guide' ? 'text-[#FF9E4A]' : 'text-stone-300'}`} />
              <span>{currentLang === 'hi' ? 'पृथक्करण गाइड' : 'Segregation Manual'}</span>
              {activeTab === 'guide' && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF671F]" />
              )}
            </button>

            {/* Tab 4: Swachh Grievance Portal (Alerts & Citizen Reports) */}
            <button
              id="tab-campus-alerts"
              type="button"
              onClick={() => handleTabClick('alerts')}
              className={`relative h-full flex items-center gap-1.5 px-3 lg:px-3.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'alerts'
                  ? 'text-white bg-white/10'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === 'alerts' ? 'text-[#FF9E4A]' : 'text-stone-300'}`} />
              <span>{currentLang === 'hi' ? 'स्वच्छता शिकायत निवारण' : 'Grievance Portal'}</span>
              {activeAlertsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold font-mono-code">
                  {activeAlertsCount}
                </span>
              )}
              {activeTab === 'alerts' && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF671F]" />
              )}
            </button>
          </div>

          {/* Mobile Identity View */}
          <div className="md:hidden flex items-center gap-2 min-w-0">
            <span className="font-bold text-white text-xs truncate font-editorial">
              {currentLang === 'hi' ? 'स्वच्छ परिसर पोर्टल' : 'SBM Swachh Campus'}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-mono-code">
              {totalBinsCount} Bins
            </span>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Swachhata Pledge Button */}
            {onOpenPledgeModal && (
              <button
                type="button"
                onClick={onOpenPledgeModal}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-white/15 hover:bg-white/25 text-amber-300 border border-white/20 transition-all cursor-pointer whitespace-nowrap shadow-2xs"
                title="Take Swachhata Pledge & Generate Official Certificate"
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>{currentLang === 'hi' ? 'शपथ लें' : 'Pledge'}</span>
              </button>
            )}

            {/* Scan QR Code Button */}
            {onOpenScanModal && (
              <button
                type="button"
                onClick={onOpenScanModal}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md bg-white/10 hover:bg-white/20 text-stone-200 border border-white/15 transition-all cursor-pointer whitespace-nowrap shadow-2xs"
                title="Scan Dustbin QR Code or Search ID"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{currentLang === 'hi' ? 'क्यूआर' : 'Scan QR'}</span>
              </button>
            )}

            {/* Report Grievance (Primary CTA styled in SBM-Urban Alert Gold) */}
            <button
              id="btn-report-issue"
              type="button"
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-bold rounded-md bg-[#FF671F] hover:bg-[#e65a15] active:bg-[#cc4f10] text-white shadow-xs transition-all cursor-pointer whitespace-nowrap"
              title="Report overflowing bin or litter"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-white" />
              <span>{currentLang === 'hi' ? 'शिकायत दर्ज करें' : 'Report Issue'}</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="btn-mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-8 w-8 flex items-center justify-center rounded-md text-stone-200 hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#071A2E] border-t border-stone-800 px-4 py-3 space-y-1.5 shadow-lg overflow-hidden"
          >
            <button
              id="mobile-nav-map"
              type="button"
              onClick={() => handleTabClick('map')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'map' ? 'bg-[#FF671F] text-white' : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>{currentLang === 'hi' ? 'परिसर मानचित्र' : 'Campus Map & Bins'}</span>
              </div>
              <span className="text-[10px] font-mono-code bg-black/30 px-2 py-0.5 rounded">
                {totalBinsCount} Bins
              </span>
            </button>

            <button
              id="mobile-nav-finder"
              type="button"
              onClick={() => handleTabClick('finder')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'finder' ? 'bg-[#FF671F] text-white' : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4" />
                <span>{currentLang === 'hi' ? 'निकटतम डस्टबिन खोजें' : 'Find Nearest Dustbin'}</span>
              </div>
              <span className="text-[10px] text-stone-400">Walking ETA</span>
            </button>

            <button
              id="mobile-nav-guide"
              type="button"
              onClick={() => handleTabClick('guide')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'guide' ? 'bg-[#FF671F] text-white' : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4" />
                <span>{currentLang === 'hi' ? 'कचरा पृथक्करण गाइड' : 'Waste Segregation Manual'}</span>
              </div>
              <span className="text-[10px] text-emerald-400">Wet &amp; Dry</span>
            </button>

            <button
              id="mobile-nav-alerts"
              type="button"
              onClick={() => handleTabClick('alerts')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'alerts' ? 'bg-[#FF671F] text-white' : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span>{currentLang === 'hi' ? 'स्वच्छता शिकायत निवारण' : 'Grievance Redressal'}</span>
              </div>
              {activeAlertsCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded font-mono-code">
                  {activeAlertsCount}
                </span>
              )}
            </button>

            {onOpenPledgeModal && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPledgeModal();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold bg-white/10 text-amber-300 hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>{currentLang === 'hi' ? 'स्वच्छता प्रतिज्ञा एवं प्रमाण पत्र' : 'Swachhata Pledge & Certificate'}</span>
                </div>
                <span className="text-[10px] font-mono-code bg-amber-400/20 px-1.5 py-0.5 rounded text-amber-300">
                  Citizen
                </span>
              </button>
            )}

            {onOpenScanModal && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenScanModal();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold text-stone-300 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span>{currentLang === 'hi' ? 'डस्टबिन क्यूआर स्कैन' : 'Scan Bin QR Code'}</span>
                </div>
                <span className="text-[10px] font-mono-code text-stone-400">Camera / ID</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
