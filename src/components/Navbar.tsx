import React, { useState } from 'react';
import { 
  Trash2, 
  MapPin, 
  Search, 
  Sparkles, 
  AlertCircle, 
  PlusCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Shield, 
  LogOut,
  Lock,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'finder' | 'guide' | 'alerts';
  setActiveTab: (tab: 'map' | 'finder' | 'guide' | 'alerts') => void;
  onOpenReportModal: () => void;
  onOpenAddBinModal: () => void;
  activeAlertsCount: number;
  totalBinsCount: number;
  isAdmin: boolean;
  onOpenAdminLoginModal: () => void;
  onAdminLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onOpenAddBinModal,
  activeAlertsCount,
  totalBinsCount,
  isAdmin,
  onOpenAdminLoginModal,
  onAdminLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: 'map' | 'finder' | 'guide' | 'alerts') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top mission banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-700 text-white px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium">
        <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="inline-flex items-center justify-center bg-white/20 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide shrink-0">
              🇮🇳 SBM
            </span>
            <span className="hidden md:inline text-emerald-100 truncate text-[11px]">
              Clean Campus, Green Future — Segregate at Source (Dry & Wet Waste)
            </span>
            <span className="md:hidden text-emerald-100 truncate text-[11px]">
              NIT Patna Swachh Campus
            </span>
          </div>
          <div className="flex items-center space-x-3 text-[10px] sm:text-[11px] shrink-0">
            <span className="inline-flex items-center gap-1 text-emerald-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>Hygiene: <strong className="text-white">94%</strong></span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-sky-200">
              <span>{totalBinsCount} Bins</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3">
          {/* Logo & title */}
          <div 
            onClick={() => handleTabClick('map')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                  Swachh<span className="text-emerald-600">Campus</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  NITP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden lg:block">
                Smart Dustbin Locator & Waste Segregation
              </p>
            </div>
          </div>

          {/* Desktop & Tablet Center Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              id="tab-campus-map"
              onClick={() => handleTabClick('map')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Campus Map</span>
            </button>

            <button
              id="tab-nearest-bin"
              onClick={() => handleTabClick('finder')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'finder'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-sky-600" />
              <span>Find Nearest</span>
            </button>

            <button
              id="tab-sorting-guide"
              onClick={() => handleTabClick('guide')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Waste Guide</span>
            </button>

            <button
              id="tab-campus-alerts"
              onClick={() => handleTabClick('alerts')}
              className={`relative flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'alerts'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {isAdmin ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              )}
              <span className="hidden xl:inline">{isAdmin ? 'Admin Reports' : 'Reports & Alerts'}</span>
              <span className="xl:hidden">Reports</span>
              {activeAlertsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeAlertsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Action Buttons & Admin Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Report Button */}
            <button
              id="btn-report-issue"
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer shrink-0"
              title="Report full or overflowing dustbin"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="hidden md:inline">Report Bin</span>
              <span className="md:hidden">Report</span>
            </button>

            {/* Add Bin Button */}
            {isAdmin ? (
              <button
                id="btn-add-bin"
                onClick={onOpenAddBinModal}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs shadow-emerald-600/30 transition-colors cursor-pointer shrink-0"
                title="Add New Campus Dustbin Station (Admin Verified)"
              >
                <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Add Bin</span>
              </button>
            ) : (
              <button
                id="btn-add-bin"
                onClick={onOpenAddBinModal}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80 transition-colors cursor-pointer shrink-0"
                title="Add Bin (Admin Only — requires SBM login)"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="hidden sm:inline">Add Bin</span>
              </button>
            )}

            {/* Admin Login / Session Status */}
            {isAdmin ? (
              <div className="flex items-center gap-1 pl-0.5">
                <button
                  id="btn-admin-portal-shortcut"
                  onClick={() => handleTabClick('alerts')}
                  className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer shrink-0"
                  title="View Submitted Reports Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="hidden lg:inline text-[11px]">Admin</span>
                </button>
                <button
                  id="btn-admin-header-logout"
                  onClick={onAdminLogout}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  title="Log out from Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="btn-open-admin-login"
                onClick={onOpenAdminLoginModal}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition-colors cursor-pointer shrink-0"
                title="Admin login for authorized SBM personnel"
              >
                <Shield className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="hidden lg:inline">Admin Login</span>
              </button>
            )}

            {/* Mobile Menu Hamburger Toggle */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Visible when hamburger is toggled) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            <button
              id="mobile-nav-map"
              onClick={() => handleTabClick('map')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'map' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Interactive Campus Map</span>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                {totalBinsCount} Bins
              </span>
            </button>

            <button
              id="mobile-nav-finder"
              onClick={() => handleTabClick('finder')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'finder' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-sky-600" />
                <span>Find Nearest Dustbin</span>
              </div>
              <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full font-semibold">
                Radar
              </span>
            </button>

            <button
              id="mobile-nav-guide"
              onClick={() => handleTabClick('guide')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'guide' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Waste Segregation Guide</span>
              </div>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold">
                Wet / Dry
              </span>
            </button>

            <button
              id="mobile-nav-alerts"
              onClick={() => handleTabClick('alerts')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'alerts' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isAdmin ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                )}
                <span>{isAdmin ? 'Admin Reports Portal' : 'Reports & Alerts'}</span>
              </div>
              {activeAlertsCount > 0 && (
                <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {activeAlertsCount}
                </span>
              )}
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>NIT Patna Campus Sanitation</span>
            {isAdmin ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Active
              </span>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminLoginModal();
                }}
                className="text-emerald-600 font-bold hover:underline"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
