import React, { useState } from 'react';
import { 
  Trash2, 
  MapPin, 
  Compass, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Menu, 
  X,
  Building2,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  activeTab: 'map' | 'finder' | 'guide' | 'alerts';
  setActiveTab: (tab: 'map' | 'finder' | 'guide' | 'alerts') => void;
  onOpenReportModal: () => void;
  onOpenAddBinModal?: () => void;
  onOpenScanModal?: () => void;
  activeAlertsCount: number;
  totalBinsCount: number;
  isAdmin: boolean;
  onAdminLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onOpenAddBinModal,
  onOpenScanModal,
  activeAlertsCount,
  totalBinsCount,
  isAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: 'map' | 'finder' | 'guide' | 'alerts') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-stone-200">
      {/* Institutional Top Header Strip */}
      <div className="bg-[#134E3A] text-stone-100 px-3 sm:px-6 py-1.5 text-[11px] font-medium tracking-tight">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center font-bold px-1.5 py-0.5 rounded bg-white/15 text-[10px] tracking-wider shrink-0 uppercase">
              SBM • NIT Patna
            </span>
            <span className="hidden sm:inline text-stone-200 truncate">
              National Institute of Technology Patna — Swachh Bharat Sanitation & Segregation Registry
            </span>
            <span className="sm:hidden text-stone-200 truncate">
              NIT Patna — Swachh Campus
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px] text-stone-300 font-mono-code">
            <span className="inline-flex items-center gap-1.5 text-stone-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Sanitation Index: <strong>94%</strong></span>
            </span>
            <span className="hidden md:inline text-stone-400">|</span>
            <span className="hidden md:inline text-stone-300">
              {totalBinsCount} Active Stations
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
          {/* Logo & Campus Identity */}
          <div 
            onClick={() => handleTabClick('map')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none min-w-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#134E3A] text-white flex items-center justify-center border border-[#0F3E2E] shrink-0 shadow-xs">
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-xl font-bold text-stone-900 font-editorial tracking-tight truncate">
                  Swachh Campus
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-1 sm:px-1.5 py-0.5 rounded border border-stone-200 shrink-0">
                  NITP
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block truncate">
                Source Segregation & Infrastructure Map
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/90 p-1 rounded-lg border border-stone-200">
            <button
              id="tab-campus-map"
              onClick={() => handleTabClick('map')}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'map' ? 'text-stone-900' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {activeTab === 'map' && (
                <motion.div
                  layoutId="navbar-active-tab"
                  className="absolute inset-0 bg-white rounded-md shadow-2xs border border-stone-200/80 -z-0"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <MapPin className={`w-3.5 h-3.5 ${activeTab === 'map' ? 'text-[#134E3A]' : 'text-stone-500'}`} />
                <span>Campus Map</span>
              </span>
            </button>

            <button
              id="tab-nearest-bin"
              onClick={() => handleTabClick('finder')}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'finder' ? 'text-stone-900' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {activeTab === 'finder' && (
                <motion.div
                  layoutId="navbar-active-tab"
                  className="absolute inset-0 bg-white rounded-md shadow-2xs border border-stone-200/80 -z-0"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Compass className={`w-3.5 h-3.5 ${activeTab === 'finder' ? 'text-[#134E3A]' : 'text-stone-500'}`} />
                <span>Find Nearest</span>
              </span>
            </button>

            <button
              id="tab-sorting-guide"
              onClick={() => handleTabClick('guide')}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'guide' ? 'text-stone-900' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {activeTab === 'guide' && (
                <motion.div
                  layoutId="navbar-active-tab"
                  className="absolute inset-0 bg-white rounded-md shadow-2xs border border-stone-200/80 -z-0"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <BookOpen className={`w-3.5 h-3.5 ${activeTab === 'guide' ? 'text-[#134E3A]' : 'text-stone-500'}`} />
                <span>Segregation Guide</span>
              </span>
            </button>

            {isAdmin && (
              <button
                id="tab-campus-alerts"
                onClick={() => handleTabClick('alerts')}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'alerts' ? 'text-stone-900' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {activeTab === 'alerts' && (
                  <motion.div
                    layoutId="navbar-active-tab"
                    className="absolute inset-0 bg-white rounded-md shadow-2xs border border-stone-200/80 -z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#134E3A]" />
                  <span>Admin Portal</span>
                  {activeAlertsCount > 0 && (
                    <motion.span 
                      key={activeAlertsCount}
                      initial={{ scale: 0.6 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold font-mono-code"
                    >
                      {activeAlertsCount}
                    </motion.span>
                  )}
                </span>
              </button>
            )}
          </nav>

          {/* Action Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onOpenScanModal && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                id="btn-scan-qr"
                type="button"
                onClick={onOpenScanModal}
                className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 h-9 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-800 border border-stone-300 transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-2xs touch-manipulation"
                title="Scan Dustbin QR Code or Direct Lookup"
              >
                <QrCode className="w-3.5 h-3.5 text-[#134E3A] shrink-0" />
                <span className="hidden sm:inline">Scan QR</span>
                <span className="sm:hidden text-xs">QR</span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              id="btn-report-issue"
              onClick={onOpenReportModal}
              className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 h-9 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-950 border border-amber-300 transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-2xs touch-manipulation"
              title="Report full bin or misplaced waste"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-800 shrink-0" />
              <span className="text-xs font-semibold">Report</span>
              <span className="hidden sm:inline font-semibold">Issue</span>
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg text-stone-700 hover:bg-stone-100 active:bg-stone-200 border border-stone-200 transition-colors cursor-pointer shrink-0 touch-manipulation"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-stone-200 px-4 py-3 shadow-sm space-y-1 overflow-hidden"
          >
            <button
              id="mobile-nav-map"
              onClick={() => handleTabClick('map')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'map' ? 'bg-[#134E3A]/10 text-[#134E3A]' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#134E3A]" />
                <span>Campus Map & Bins</span>
              </div>
              <span className="text-[10px] font-mono-code bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                {totalBinsCount} Bins
              </span>
            </button>

            <button
              id="mobile-nav-finder"
              onClick={() => handleTabClick('finder')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'finder' ? 'bg-[#134E3A]/10 text-[#134E3A]' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-[#134E3A]" />
                <span>Find Nearest Dustbin</span>
              </div>
              <span className="text-[10px] text-stone-500">Walking routes</span>
            </button>

            <button
              id="mobile-nav-guide"
              onClick={() => handleTabClick('guide')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'guide' ? 'bg-[#134E3A]/10 text-[#134E3A]' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-[#134E3A]" />
                <span>Waste Segregation Guide</span>
              </div>
              <span className="text-[10px] text-stone-500">Wet / Dry / E-Waste</span>
            </button>

            {isAdmin && (
              <button
                id="mobile-nav-alerts"
                onClick={() => handleTabClick('alerts')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === 'alerts' ? 'bg-[#134E3A]/10 text-[#134E3A]' : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#134E3A]" />
                  <span>Admin Dispatch & Reports</span>
                </div>
                {activeAlertsCount > 0 && (
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded font-mono-code">
                    {activeAlertsCount}
                  </span>
                )}
              </button>
            )}

            {onOpenScanModal && (
              <button
                id="mobile-nav-scan-qr"
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenScanModal();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <QrCode className="w-4 h-4 text-[#134E3A]" />
                  <span>Scan Station QR / ID</span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono-code">Live Lookup</span>
              </button>
            )}

            <button
              id="mobile-nav-report-issue"
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReportModal();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-950 hover:bg-amber-100 border border-amber-200/80 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Report Issue or Full Bin</span>
              </div>
              <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded">
                Quick Ticket
              </span>
            </button>

            <div className="pt-2 mt-2 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-stone-400" />
                NIT Patna Main Campus
              </span>
              <span className="text-emerald-700 font-semibold font-mono-code">SBM-Cell Active</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

