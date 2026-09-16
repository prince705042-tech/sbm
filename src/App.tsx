import React, { useState, useEffect } from 'react';
import { CampusBin, BuildingZone, ReportTicket } from './types';
import { INITIAL_BINS } from './data/campusData';
import { Navbar } from './components/Navbar';
import { CampusMap } from './components/CampusMap';
import { NearestBinFinder } from './components/NearestBinFinder';
import { WasteSegregationGuide } from './components/WasteSegregationGuide';
import { CampusAlertsView } from './components/CampusAlertsView';
import { ReportIssueModal } from './components/ReportIssueModal';
import { AddBinModal } from './components/AddBinModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Sparkles, Heart, MapPin, Search, AlertCircle, ShieldCheck } from 'lucide-react';

export default function App() {
  // Persistence in localStorage
  // Version key to ensure updated campus locations load cleanly
  const DATA_VERSION = 'v16_fix_duplicate_bin_keys';

  const [bins, setBins] = useState<CampusBin[]>(() => {
    try {
      const savedVersion = localStorage.getItem('swachh_campus_version');
      if (savedVersion === DATA_VERSION) {
        const saved = localStorage.getItem('swachh_campus_bins');
        if (saved) {
          const parsed: CampusBin[] = JSON.parse(saved);
          // Deduplicate keys in case old data was saved
          const seen = new Set<string>();
          return parsed.map((b, idx) => {
            if (seen.has(b.id)) {
              const uniqueId = `${b.id}-${idx}`;
              seen.add(uniqueId);
              return { ...b, id: uniqueId };
            }
            seen.add(b.id);
            return b;
          });
        }
      } else {
        localStorage.setItem('swachh_campus_version', DATA_VERSION);
      }
    } catch {
      // Fallback
    }
    return INITIAL_BINS;
  });

  const [tickets, setTickets] = useState<ReportTicket[]>(() => {
    try {
      const savedVersion = localStorage.getItem('swachh_campus_version');
      if (savedVersion === DATA_VERSION) {
        const saved = localStorage.getItem('swachh_campus_tickets');
        if (saved) return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return [
      {
        id: 't-1',
        binId: 'bin-chem-1',
        binName: 'Chemistry Lab Segregation Station',
        locationName: 'Chemistry Department - Organic Lab Wing',
        issueType: 'overflowing',
        details: 'Lab rough paper and test wrappers full near prep room entrance.',
        reportedAt: '25 mins ago',
        status: 'cleaning_dispatched',
        reportedBy: 'Dr. Verma (Chemistry Faculty)',
      },
      {
        id: 't-2',
        binId: 'bin-sac-1',
        binName: 'SAC Canteen Dual Station',
        locationName: 'SAC Building - Food Counter & Canteen Exit',
        issueType: 'overflowing',
        details: 'Heavy rush during break hour, wet food scrap container reaching full.',
        reportedAt: '40 mins ago',
        status: 'pending',
        reportedBy: 'Kunal (Student Council)',
      },
      {
        id: 't-3',
        binId: 'bin-cse-1',
        binName: 'CSE Dept Dual Bins',
        locationName: 'CSE Department - Ground Floor Labs Corridor',
        issueType: 'wrong_waste',
        details: 'Plastic drink bottles found thrown into green wet waste bin.',
        reportedAt: '1 hour ago',
        status: 'pending',
        reportedBy: 'Ananya (B.Tech 3rd Year)',
      },
    ];
  });

  // Admin authentication state
  // Admin credentials:
  // Admin ID: SBM
  // Password: SBM@2612047
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('swachh_campus_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<'map' | 'finder' | 'guide' | 'alerts'>('map');
  const [userZone, setUserZone] = useState<BuildingZone>('sac-building');
  const [selectedBin, setSelectedBin] = useState<CampusBin | null>(INITIAL_BINS[0]);
  const [highlightedBinId, setHighlightedBinId] = useState<string | null>(null);

  // Modals & reason tracking
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAddBinModalOpen, setIsAddBinModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [adminLoginReason, setAdminLoginReason] = useState<'reports' | 'add_bin' | null>(null);
  const [targetBinForReport, setTargetBinForReport] = useState<CampusBin | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('swachh_campus_bins', JSON.stringify(bins));
    } catch {}
  }, [bins]);

  useEffect(() => {
    try {
      localStorage.setItem('swachh_campus_tickets', JSON.stringify(tickets));
    } catch {}
  }, [tickets]);

  // Admin Authentication Handlers
  const handleAdminLogin = (id: string, pass: string): boolean => {
    if (id.trim() === 'SBM' && pass.trim() === 'SBM@2612047') {
      setIsAdmin(true);
      try {
        localStorage.setItem('swachh_campus_admin_auth', 'true');
      } catch {}
      showToast('🛡️ Welcome SBM Administrator! Admin privileges active.');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem('swachh_campus_admin_auth');
    } catch {}
    showToast('🔒 Logged out from SBM Admin Portal.');
  };

  // Only Admin can open the Add Bin flow
  const handleTriggerAddBin = () => {
    if (isAdmin) {
      setIsAddBinModalOpen(true);
    } else {
      setAdminLoginReason('add_bin');
      setIsAdminLoginModalOpen(true);
    }
  };

  // Callback on successful admin modal login
  const handleAdminLoginSuccess = () => {
    handleAdminLogin('SBM', 'SBM@2612047');
    if (adminLoginReason === 'add_bin') {
      setIsAddBinModalOpen(true);
      showToast('🛡️ SBM Admin verified. You can now register a new dustbin station.');
    } else {
      setActiveTab('alerts');
    }
    setAdminLoginReason(null);
  };

  // Handlers
  const handleSelectBinAndShowMap = (bin: CampusBin) => {
    setSelectedBin(bin);
    setHighlightedBinId(bin.id);
    setActiveTab('map');
    showToast(`📍 Showing route to ${bin.name} on Campus Map`);
  };

  const handleOpenReportForBin = (bin: CampusBin) => {
    setTargetBinForReport(bin);
    setIsReportModalOpen(true);
  };

  const handleAddNewBin = (newBinData: Omit<CampusBin, 'id' | 'reportedCount'>) => {
    if (!isAdmin) {
      showToast('⚠️ Unauthorized. Only SBM Administrators can add bins.');
      return;
    }

    const newBin: CampusBin = {
      ...newBinData,
      id: `bin-${Date.now()}`,
      reportedCount: 0,
    };
    setBins((prev) => [newBin, ...prev]);
    setSelectedBin(newBin);
    setActiveTab('map');
    showToast(`✅ "${newBin.name}" successfully added to Campus Map!`);
  };

  const handleSubmitReport = (data: Omit<ReportTicket, 'id' | 'reportedAt' | 'status'>) => {
    const newTicket: ReportTicket = {
      ...data,
      id: `t-${Date.now()}`,
      reportedAt: 'Just now',
      status: 'pending',
    };

    setTickets((prev) => [newTicket, ...prev]);

    // Update bin status to filling / full
    setBins((prev) =>
      prev.map((b) => {
        if (b.id === data.binId) {
          return {
            ...b,
            status: data.issueType === 'overflowing' ? 'full' : 'filling',
            fillLevel: data.issueType === 'overflowing' ? 95 : b.fillLevel,
            reportedCount: b.reportedCount + 1,
          };
        }
        return b;
      })
    );

    showToast(`📢 Report submitted! SBM sanitation administration has been notified.`);
  };

  const handleDispatchCleaning = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'cleaning_dispatched' } : t))
    );
    showToast('🚚 Housekeeping personnel dispatched to the dustbin location.');
  };

  const handleResolveTicket = (ticketId: string) => {
    const target = tickets.find((t) => t.id === ticketId);
    if (target) {
      // Reset the bin fill level
      setBins((prev) =>
        prev.map((b) =>
          b.id === target.binId
            ? { ...b, fillLevel: 10, status: 'normal', lastEmptied: 'Just now' }
            : b
        )
      );
    }
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'resolved' } : t))
    );
    showToast('✨ Bin emptied & ticket marked as resolved! Campus score updated.');
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    showToast('🗑️ Report ticket dismissed.');
  };

  const activeAlertsCount = tickets.filter((t) => t.status !== 'resolved').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => {
          setTargetBinForReport(selectedBin);
          setIsReportModalOpen(true);
        }}
        onOpenAddBinModal={handleTriggerAddBin}
        activeAlertsCount={activeAlertsCount}
        totalBinsCount={bins.length}
        isAdmin={isAdmin}
        onOpenAdminLoginModal={() => {
          setAdminLoginReason('reports');
          setIsAdminLoginModalOpen(true);
        }}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 md:pb-8">
        {activeTab === 'map' && (
          <CampusMap
            bins={bins}
            selectedBin={selectedBin}
            onSelectBin={(bin) => {
              setSelectedBin(bin);
              setHighlightedBinId(null);
            }}
            userZone={userZone}
            setUserZone={setUserZone}
            highlightedBinId={highlightedBinId}
            onReportBin={handleOpenReportForBin}
          />
        )}

        {activeTab === 'finder' && (
          <NearestBinFinder
            bins={bins}
            userZone={userZone}
            setUserZone={setUserZone}
            onSelectBinAndShowMap={handleSelectBinAndShowMap}
            onReportBin={handleOpenReportForBin}
          />
        )}

        {activeTab === 'guide' && <WasteSegregationGuide />}

        {activeTab === 'alerts' && (
          <CampusAlertsView
            tickets={tickets}
            bins={bins}
            isAdmin={isAdmin}
            onAdminLogin={handleAdminLogin}
            onAdminLogout={handleAdminLogout}
            onResolveTicket={handleResolveTicket}
            onDispatchCleaning={handleDispatchCleaning}
            onDeleteTicket={handleDeleteTicket}
            onOpenReportModal={() => {
              setTargetBinForReport(selectedBin);
              setIsReportModalOpen(true);
            }}
            onOpenAddBinModal={handleTriggerAddBin}
          />
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav 
        id="mobile-bottom-navbar" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg flex items-center justify-around"
      >
        <button
          id="btn-mobile-nav-map"
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'map' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'map' ? 'bg-emerald-50 text-emerald-600' : ''}`}>
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5">Map</span>
        </button>

        <button
          id="btn-mobile-nav-finder"
          onClick={() => setActiveTab('finder')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'finder' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'finder' ? 'bg-emerald-50 text-emerald-600' : ''}`}>
            <Search className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5">Nearest</span>
        </button>

        <button
          id="btn-mobile-nav-guide"
          onClick={() => setActiveTab('guide')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'guide' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'guide' ? 'bg-emerald-50 text-emerald-600' : ''}`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5">Waste Guide</span>
        </button>

        <button
          id="btn-mobile-nav-alerts"
          onClick={() => setActiveTab('alerts')}
          className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'alerts' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'alerts' ? 'bg-emerald-50 text-emerald-600' : ''}`}>
            {isAdmin ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
          </div>
          <span className="text-[10px] mt-0.5">{isAdmin ? 'Admin' : 'Reports'}</span>
          {activeAlertsCount > 0 && (
            <span className="absolute top-1 right-2 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
              {activeAlertsCount}
            </span>
          )}
        </button>
      </nav>

      {/* Modals */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        bins={bins}
        preselectedBin={targetBinForReport}
        onSubmitReport={handleSubmitReport}
      />

      <AddBinModal
        isOpen={isAddBinModalOpen}
        onClose={() => setIsAddBinModalOpen(false)}
        onAddBin={handleAddNewBin}
        isAdmin={isAdmin}
        onRequestAdminLogin={() => {
          setAdminLoginReason('add_bin');
          setIsAdminLoginModalOpen(true);
        }}
      />

      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => {
          setIsAdminLoginModalOpen(false);
          setAdminLoginReason(null);
        }}
        reason={adminLoginReason}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-slate-700">
              NIT Patna Main Campus
            </span>
            <span>•</span>
            <span>Swachh Campus Initiative & Clean India Mission</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Swachh Bharat Abhiyan</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for a Cleaner Campus
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
