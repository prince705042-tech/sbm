import React from 'react';
import { Trash2, MapPin, Search, AlertCircle, PlusCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'finder' | 'guide' | 'alerts';
  setActiveTab: (tab: 'map' | 'finder' | 'guide' | 'alerts') => void;
  onOpenReportModal: () => void;
  onOpenAddBinModal: () => void;
  activeAlertsCount: number;
  totalBinsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onOpenAddBinModal,
  activeAlertsCount,
  totalBinsCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top mission banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-700 text-white px-4 py-1.5 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center justify-center bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide">
              🇮🇳 SWACHH BHARAT MISSION
            </span>
            <span className="hidden sm:inline text-emerald-100">
              Clean Campus, Green Future — Segregate at Source (Dry & Wet Waste)
            </span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span className="inline-flex items-center gap-1 text-emerald-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Campus Hygiene: <strong>94% Excellent</strong></span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-sky-200">
              <span>{totalBinsCount} Mapped Dustbins</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                  Swachh<span className="text-emerald-600">Campus</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  NIT Patna
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                NIT Patna Main Campus • Smart Dustbin Locator & Waste Segregation
              </p>
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              id="tab-campus-map"
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
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
              onClick={() => setActiveTab('finder')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
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
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
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
              onClick={() => setActiveTab('alerts')}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'alerts'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Alerts</span>
              {activeAlertsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeAlertsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              id="btn-report-issue"
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 transition-colors"
              title="Report full or overflowing dustbin"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden lg:inline">Report Bin</span>
            </button>

            <button
              id="btn-add-bin"
              onClick={onOpenAddBinModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs shadow-emerald-600/30 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Bin</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
