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
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { AppRoute } from '../utils/seo';

interface NavbarProps {
  activeTab: AppRoute;
  setActiveTab: (tab: AppRoute) => void;
  onOpenReportModal: () => void;
  onOpenAddBinModal?: () => void;
  onOpenScanModal?: () => void;
  onOpenPledgeModal?: () => void;
  onOpenContactModal?: () => void;
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
  onOpenContactModal,
  activeAlertsCount,
  totalBinsCount,
  isAdmin,
  currentLang = 'en',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: AppRoute, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-30 bg-[#0A2540] text-white border-b border-stone-800 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13 sm:h-14 gap-3 sm:gap-6">
          {/* Left: Desktop Tab Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 h-full overflow-x-auto no-scrollbar">
            {/* Tab 1: Campus Map */}
            <a
              id="tab-campus-map"
              href="/map"
              onClick={(e) => handleTabClick('map', e)}
              className={`relative h-full flex items-center gap-2 px-3.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'map'
                  ? 'text-white font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-stone-300" />
              <span>{currentLang === 'hi' ? 'परिसर मानचित्र' : 'Map & Bins'}</span>
              {activeTab === 'map' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF671F]" />
              )}
            </a>

            {/* Tab 2: Find Nearest Dustbin */}
            <a
              id="tab-nearest-bin"
              href="/finder"
              onClick={(e) => handleTabClick('finder', e)}
              className={`relative h-full flex items-center gap-2 px-3.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'finder'
                  ? 'text-white font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-stone-300" />
              <span>{currentLang === 'hi' ? 'निकटतम डस्टबिन' : 'Nearest Bin'}</span>
              {activeTab === 'finder' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF671F]" />
              )}
            </a>

            {/* Tab 3: Waste Segregation Guide */}
            <a
              id="tab-sorting-guide"
              href="/guide"
              onClick={(e) => handleTabClick('guide', e)}
              className={`relative h-full flex items-center gap-2 px-3.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'guide'
                  ? 'text-white font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-300" />
              <span>{currentLang === 'hi' ? 'पृथक्करण गाइड' : 'Segregation Manual'}</span>
              {activeTab === 'guide' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF671F]" />
              )}
            </a>

            {/* Tab 4: Swachh Grievance Portal */}
            <a
              id="tab-campus-alerts"
              href="/alerts"
              onClick={(e) => handleTabClick('alerts', e)}
              className={`relative h-full flex items-center gap-2 px-3.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'alerts'
                  ? 'text-white font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-stone-300" />
              <span>{currentLang === 'hi' ? 'स्वच्छता शिकायत' : 'Grievance Desk'}</span>
              {activeAlertsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono-code tabular-nums bg-rose-600 text-white leading-none">
                  {activeAlertsCount}
                </span>
              )}
              {activeTab === 'alerts' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF671F]" />
              )}
            </a>

            {/* Tab 5: Swachhata Pledge */}
            <a
              id="tab-swachhata-pledge"
              href="/pledge"
              onClick={(e) => handleTabClick('pledge', e)}
              className={`relative h-full flex items-center gap-2 px-3.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'pledge'
                  ? 'text-white font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>{currentLang === 'hi' ? 'स्वच्छता प्रतिज्ञा' : 'Pledge'}</span>
              {activeTab === 'pledge' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF671F]" />
              )}
            </a>
          </div>

          {/* Mobile Identity View */}
          <div className="md:hidden flex items-center gap-2 min-w-0">
            <span className="font-semibold text-white text-xs truncate">
              {currentLang === 'hi' ? 'स्वच्छ परिसर पोर्टल' : 'NIT Patna Sanitation'}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-stone-300 font-mono-code tabular-nums">
              {totalBinsCount} Bins
            </span>
          </div>

          {/* Right: Focused Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Swachhata Pledge Button */}
            {onOpenPledgeModal && (
              <button
                type="button"
                onClick={onOpenPledgeModal}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded text-amber-200 hover:text-amber-100 hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                title="Take Swachhata Pledge"
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>{currentLang === 'hi' ? 'प्रतिज्ञा' : 'Pledge'}</span>
              </button>
            )}

            {/* Scan QR Code Button */}
            {onOpenScanModal && (
              <button
                type="button"
                onClick={onOpenScanModal}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded text-stone-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                title="Scan dustbin QR code or lookup station ID"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{currentLang === 'hi' ? 'क्यूआर स्कैन' : 'Scan Station'}</span>
              </button>
            )}

            {/* Report Grievance (High contrast primary button) */}
            <button
              id="btn-report-issue"
              type="button"
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded bg-[#FF671F] hover:bg-[#e65a15] active:bg-[#cc4f10] text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Report overflowing dustbin or litter"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-white" />
              <span>{currentLang === 'hi' ? 'शिकायत दर्ज करें' : 'Report Issue'}</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="btn-mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded text-stone-300 hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
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
            <a
              id="mobile-nav-map"
              href="/map"
              onClick={(e) => handleTabClick('map', e)}
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
            </a>

            <a
              id="mobile-nav-finder"
              href="/finder"
              onClick={(e) => handleTabClick('finder', e)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'finder' ? 'bg-[#FF671F] text-white' : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4" />
                <span>{currentLang === 'hi' ? 'निकटतम डस्टबिन खोजें' : 'Find Nearest Dustbin'}</span>
              </div>
              <span className="text-[10px] text-stone-400">Walking ETA</span>
            </a>

            <a
              id="mobile-nav-guide"
              href="/guide"
              onClick={(e) => handleTabClick('guide', e)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'guide' ? 'bg-[#FF671F] text-white' : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4" />
                <span>{currentLang === 'hi' ? 'कचरा पृथक्करण गाइड' : 'Waste Segregation Manual'}</span>
              </div>
              <span className="text-[10px] text-emerald-400">Wet &amp; Dry</span>
            </a>

            <a
              id="mobile-nav-alerts"
              href="/alerts"
              onClick={(e) => handleTabClick('alerts', e)}
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
            </a>

            <a
              id="mobile-nav-pledge"
              href="/pledge"
              onClick={(e) => handleTabClick('pledge', e)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'pledge' ? 'bg-[#FF671F] text-white' : 'bg-white/10 text-amber-300 hover:bg-white/20'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-amber-300" />
                <span>{currentLang === 'hi' ? 'स्वच्छता प्रतिज्ञा एवं प्रमाण पत्र' : 'Swachhata Pledge & Certificate'}</span>
              </div>
              <span className="text-[10px] font-mono-code bg-amber-400/20 px-1.5 py-0.5 rounded text-amber-300">
                Citizen
              </span>
            </a>

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

            {onOpenContactModal && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContactModal();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold text-stone-300 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-emerald-400 text-sm">✉️</span>
                  <span>{currentLang === 'hi' ? 'नोडल सहायता / संपर्क' : 'Nodal Helpdesk & Contact'}</span>
                </div>
                <span className="text-[10px] font-mono-code text-stone-400">swachh@nitp.ac.in</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
