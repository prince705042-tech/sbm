import React, { useState } from 'react';
import { 
  Trash2, 
  MapPin, 
  Compass, 
  BookOpen, 
  AlertTriangle, 
  PlusCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Menu, 
  X,
  Building2,
  QrCode
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'finder' | 'guide' | 'alerts';
  setActiveTab: (tab: 'map' | 'finder' | 'guide' | 'alerts') => void;
  onOpenReportModal: () => void;
  onOpenAddBinModal: () => void;
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
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Campus Identity */}
          <div 
            onClick={() => handleTabClick('map')}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-lg bg-[#134E3A] text-white flex items-center justify-center border border-[#0F3E2E] shrink-0 shadow-xs">
              <Trash2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-stone-900 font-editorial tracking-tight">
                  Swachh Campus
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded border border-stone-200">
                  NITP
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Source Segregation & Infrastructure Map
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/90 p-1 rounded-lg border border-stone-200">
            <button
              id="tab-campus-map"
              onClick={() => handleTabClick('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'map'
                  ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${activeTab === 'map' ? 'text-[#134E3A]' : 'text-stone-500'}`} />
              <span>Campus Map</span>
            </button>

            <button
              id="tab-nearest-bin"
              onClick={() => handleTabClick('finder')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'finder'
                  ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 ${activeTab === 'finder' ? 'text-[#134E3A]' : 'text-stone-500'}`} />
              <span>Find Nearest</span>
            </button>

            <button
              id="tab-sorting-guide"
              onClick={() => handleTabClick('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'guide'
                  ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${activeTab === 'guide' ? 'text-[#134E3A]' : 'text-stone-500'}`} />
              <span>Segregation Guide</span>
            </button>

            {isAdmin && (
              <button
                id="tab-campus-alerts"
                onClick={() => handleTabClick('alerts')}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'alerts'
                    ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#134E3A]" />
                <span>Admin Portal</span>
                {activeAlertsCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold font-mono-code">
                    {activeAlertsCount}
                  </span>
                )}
              </button>
            )}
          </nav>

          {/* Action Utilities */}
          <div className="flex items-center gap-2">
            {onOpenScanModal && (
              <button
                id="btn-scan-qr"
                type="button"
                onClick={onOpenScanModal}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                title="Scan Dustbin QR Code or Direct Lookup"
              >
                <QrCode className="w-3.5 h-3.5 text-[#134E3A] shrink-0" />
                <span className="hidden sm:inline">Scan QR / ID</span>
                <span className="sm:hidden">QR</span>
              </button>
            )}

            <button
              id="btn-report-issue"
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-amber-50 text-amber-900 hover:bg-amber-100/80 border border-amber-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Report full bin or misplaced waste"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="hidden sm:inline">Report Issue</span>
              <span className="sm:hidden">Report</span>
            </button>

            <button
              id="btn-add-bin"
              onClick={onOpenAddBinModal}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isAdmin
                  ? 'bg-[#134E3A] text-white hover:bg-[#0F3E2E] shadow-2xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300'
              }`}
              title={isAdmin ? "Add New Station (Admin)" : "Add New Station"}
            >
              <PlusCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Add Station</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-stone-700 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 py-3 shadow-sm space-y-1">
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

          <div className="pt-2 mt-2 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-stone-400" />
              NIT Patna Main Campus
            </span>
            <span className="text-emerald-700 font-semibold font-mono-code">SBM-Cell Active</span>
          </div>
        </div>
      )}
    </header>
  );
};

