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
import { CheckCircle2, Sparkles, Heart } from 'lucide-react';

export default function App() {
  // Persistence in localStorage
  // Version key to ensure updated campus locations load cleanly
  const DATA_VERSION = 'v13_added_koshi_extension';

  const [bins, setBins] = useState<CampusBin[]>(() => {
    try {
      const savedVersion = localStorage.getItem('swachh_campus_version');
      if (savedVersion === DATA_VERSION) {
        const saved = localStorage.getItem('swachh_campus_bins');
        if (saved) return JSON.parse(saved);
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
    ];
  });

  const [activeTab, setActiveTab] = useState<'map' | 'finder' | 'guide' | 'alerts'>('map');
  const [userZone, setUserZone] = useState<BuildingZone>('sac-building');
  const [selectedBin, setSelectedBin] = useState<CampusBin | null>(INITIAL_BINS[0]);
  const [highlightedBinId, setHighlightedBinId] = useState<string | null>(null);

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAddBinModalOpen, setIsAddBinModalOpen] = useState(false);
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

    showToast(`📢 Report submitted! Campus sanitation team has been notified.`);
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
        onOpenAddBinModal={() => setIsAddBinModalOpen(true)}
        activeAlertsCount={activeAlertsCount}
        totalBinsCount={bins.length}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
            onResolveTicket={handleResolveTicket}
            onDispatchCleaning={handleDispatchCleaning}
            onOpenReportModal={() => {
              setTargetBinForReport(selectedBin);
              setIsReportModalOpen(true);
            }}
          />
        )}
      </main>

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
