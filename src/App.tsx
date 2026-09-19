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
import { ScanBinModal } from './components/ScanBinModal';
import { PrintPlacardModal } from './components/PrintPlacardModal';
import { ExportAuditReportModal } from './components/ExportAuditReportModal';
import { CampusSanitationScorecard } from './components/CampusSanitationScorecard';
import { Sparkles, Heart, MapPin, Search, AlertCircle, ShieldCheck, Shield, Lock, LogOut, CheckCircle2, QrCode } from 'lucide-react';
import { 
  fetchReportsFromSupabase, 
  insertReportToSupabase, 
  updateReportStatusInSupabase, 
  deleteReportFromSupabase,
  deleteReportsFromSupabase,
  syncAllLocalTicketsToSupabase,
  subscribeToReportsRealtime,
  toValidIsoDate,
} from './lib/supabase';

export default function App() {
  // Persistence in localStorage
  // Version key to ensure updated campus locations load cleanly
  const DATA_VERSION = 'v20_sanitized_keys';

  const [bins, setBins] = useState<CampusBin[]>(() => {
    try {
      const savedVersion = localStorage.getItem('swachh_campus_version');
      if (savedVersion === DATA_VERSION) {
        const saved = localStorage.getItem('swachh_campus_bins');
        if (saved) {
          const parsed: CampusBin[] = JSON.parse(saved);
          // Deduplicate keys in case old data was saved and filter removed bins
          const seen = new Set<string>();
          return parsed
            .filter((b) => b.id !== 'bin-gandhighat-1')
            .map((b, idx) => {
              if (seen.has(b.id)) {
                const uniqueId = `${b.id}-${idx}`;
                seen.add(uniqueId);
                return { ...b, id: uniqueId };
              }
              seen.add(b.id);
              return b;
            });
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_BINS;
  });

  // Deleted tickets tracker to ensure deleted tickets NEVER resurrect upon re-sync or reload
  const [deletedTicketIds, setDeletedTicketIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('swachh_campus_deleted_tickets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return new Set<string>(parsed);
      }
    } catch {}
    return new Set<string>();
  });

  const [tickets, setTickets] = useState<ReportTicket[]>(() => {
    let deletedSet = new Set<string>();
    try {
      const savedDeleted = localStorage.getItem('swachh_campus_deleted_tickets');
      if (savedDeleted) {
        const parsed = JSON.parse(savedDeleted);
        if (Array.isArray(parsed)) deletedSet = new Set<string>(parsed);
      }
    } catch {}

    try {
      const savedVersion = localStorage.getItem('swachh_campus_version');
      if (savedVersion === DATA_VERSION) {
        const saved = localStorage.getItem('swachh_campus_tickets');
        if (saved) {
          const parsed: ReportTicket[] = JSON.parse(saved);
          return parsed.filter((t) => !deletedSet.has(t.id));
        }
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
    ].filter((t) => !deletedSet.has(t.id));
  });

  // Admin authentication state
  // Starts logged out by default; authorized personnel log in via the Footer Admin Login
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('swachh_campus_admin_auth');
      return saved !== null ? saved === 'true' : false;
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<'map' | 'finder' | 'guide' | 'alerts'>('map');
  const [userZone, setUserZone] = useState<BuildingZone>('sac-building');
  const [selectedBin, setSelectedBin] = useState<CampusBin | null>(INITIAL_BINS[0]);
  const [highlightedBinId, setHighlightedBinId] = useState<string | null>(null);
  const [highlightedTicketId, setHighlightedTicketId] = useState<string | null>(null);

  // Modals & reason tracking
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAddBinModalOpen, setIsAddBinModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [adminLoginReason, setAdminLoginReason] = useState<'reports' | 'add_bin' | null>(null);
  const [targetBinForReport, setTargetBinForReport] = useState<CampusBin | null>(null);

  // New SBM enhancement modal states
  const [isScanBinModalOpen, setIsScanBinModalOpen] = useState(false);
  const [isPlacardModalOpen, setIsPlacardModalOpen] = useState(false);
  const [selectedBinForPlacard, setSelectedBinForPlacard] = useState<CampusBin | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Supabase Sync State & Timestamp
  const [supabaseSyncStatus, setSupabaseSyncStatus] = useState<'connected' | 'syncing' | 'error'>('syncing');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Save to localStorage & version tag
  useEffect(() => {
    try {
      localStorage.setItem('swachh_campus_version', DATA_VERSION);
      localStorage.setItem('swachh_campus_bins', JSON.stringify(bins));
    } catch {}
  }, [bins]);

  useEffect(() => {
    try {
      localStorage.setItem('swachh_campus_tickets', JSON.stringify(tickets));
    } catch {}
  }, [tickets]);

  // Two-way synchronization with Supabase reports table
  const syncWithSupabase = async (showFeedback = false) => {
    setSupabaseSyncStatus('syncing');
    try {
      const { data, error } = await fetchReportsFromSupabase();
      if (error) {
        console.warn('Supabase sync warning:', error.message);
        setSupabaseSyncStatus('error');
        if (showFeedback) showToast(`⚠️ Supabase connection warning: ${error.message}`);
        return;
      }

      let deletedSet = new Set<string>();
      try {
        const savedDeleted = localStorage.getItem('swachh_campus_deleted_tickets');
        if (savedDeleted) {
          const parsed = JSON.parse(savedDeleted);
          if (Array.isArray(parsed)) deletedSet = new Set(parsed);
        }
      } catch {}

      if (data && data.length > 0) {
        // Filter out any tickets that were permanently deleted
        const activeRemoteTickets = data.filter((t) => !deletedSet.has(t.id));

        // Purge any remote records that match local deleted set in a single batch
        const remoteToPurge = data.filter((t) => deletedSet.has(t.id));
        if (remoteToPurge.length > 0) {
          const idsToPurge = remoteToPurge.map((t) => t.id);
          deleteReportsFromSupabase(idsToPurge).catch(() => {});
        }

        setTickets((prev) => {
          const remoteMap = new Map(activeRemoteTickets.map((t) => [t.id, t]));
          const merged = [...activeRemoteTickets];
          // Preserve any local tickets that aren't deleted AND aren't in remote yet
          prev.forEach((localT) => {
            if (!deletedSet.has(localT.id) && !remoteMap.has(localT.id)) {
              merged.push(localT);
            }
          });
          return merged;
        });

        setSupabaseSyncStatus('connected');
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSyncedAt(nowStr);
        if (showFeedback) showToast(`⚡ Synced with Supabase! Loaded ${activeRemoteTickets.length} reports.`);
      } else {
        // Remote table has 0 records
        setTickets((currentTickets) => {
          return currentTickets.filter((t) => !deletedSet.has(t.id));
        });
        setSupabaseSyncStatus('connected');
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSyncedAt(nowStr);
        if (showFeedback) showToast(`⚡ Supabase connected (0 records)`);
      }
    } catch (err) {
      console.warn('Supabase sync notice:', err);
      setSupabaseSyncStatus('error');
      if (showFeedback) showToast(`⚠️ Supabase connection offline / local mode`);
    }
  };

  // Sync reports with Supabase on mount + realtime postgres changes
  useEffect(() => {
    syncWithSupabase();

    const unsubscribe = subscribeToReportsRealtime(() => {
      syncWithSupabase();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Admin Authentication Handlers
  const handleAdminLogin = (id: string, pass: string): boolean => {
    if (id.trim().toUpperCase() === 'SBM' && pass.trim() === 'SBM@2612047') {
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
    setIsAdmin(true);
    try {
      localStorage.setItem('swachh_campus_admin_auth', 'true');
    } catch {}
    showToast('🛡️ Welcome SBM Administrator! Admin privileges active.');
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

  const handleSubmitReport = (data: Omit<ReportTicket, 'id' | 'reportedAt' | 'status'>): string => {
    const newTicketId = `t-${Date.now()}`;
    const isoTimestamp = new Date().toISOString();
    const newTicket: ReportTicket = {
      ...data,
      id: newTicketId,
      reportedAt: isoTimestamp,
      status: 'pending',
    };

    setTickets((prev) => [newTicket, ...prev]);
    setHighlightedTicketId(newTicketId);

    // Sync to Supabase in background (with guaranteed ISO timestamp)
    insertReportToSupabase(newTicket)
      .then((res) => {
        if (res.success) {
          setSupabaseSyncStatus('connected');
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setLastSyncedAt(nowStr);
          showToast(`📢 Report logged & synced to Supabase database table!`);
        } else {
          console.warn('Supabase sync notice:', res.error);
          showToast(`📢 Report saved locally (cloud sync pending)`);
        }
      })
      .catch((err) => {
        console.warn('Supabase insert exception:', err);
      });

    // Update bin status to filling / full
    setBins((prev) =>
      prev.map((b) => {
        if (b.id === data.binId) {
          return {
            ...b,
            status: data.issueType === 'overflowing' ? 'full' : 'filling',
            fillLevel: data.issueType === 'overflowing' ? 95 : Math.max(b.fillLevel, 75),
            reportedCount: b.reportedCount + 1,
          };
        }
        return b;
      })
    );

    return newTicketId;
  };

  const handleDispatchCleaning = (ticketId: string) => {
    const targetTicket = tickets.find((t) => t.id === ticketId);
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'cleaning_dispatched' } : t))
    );
    if (targetTicket) {
      updateReportStatusInSupabase(ticketId, 'cleaning_dispatched', { ...targetTicket, status: 'cleaning_dispatched' })
        .then(() => setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })))
        .catch(() => {});
    } else {
      updateReportStatusInSupabase(ticketId, 'cleaning_dispatched').catch(() => {});
    }
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
      updateReportStatusInSupabase(ticketId, 'resolved', { ...target, status: 'resolved' })
        .then(() => setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })))
        .catch(() => {});
    } else {
      updateReportStatusInSupabase(ticketId, 'resolved').catch(() => {});
    }
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'resolved' } : t))
    );
    showToast('✨ Bin emptied & ticket marked as resolved! Campus score updated.');
  };

  const handleReopenTicket = (ticketId: string) => {
    const target = tickets.find((t) => t.id === ticketId);
    if (target) {
      setBins((prev) =>
        prev.map((b) =>
          b.id === target.binId
            ? { ...b, status: 'filling', fillLevel: 75 }
            : b
        )
      );
      updateReportStatusInSupabase(ticketId, 'pending', { ...target, status: 'pending' })
        .then(() => setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })))
        .catch(() => {});
    } else {
      updateReportStatusInSupabase(ticketId, 'pending').catch(() => {});
    }
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'pending' } : t))
    );
    showToast('🔄 Ticket reopened for housekeeping action.');
  };

  const handleDeleteTicket = async (ticketId: string) => {
    // 1. Immediately record in deleted set
    const nextDeleted = new Set(deletedTicketIds);
    nextDeleted.add(ticketId);
    setDeletedTicketIds(nextDeleted);
    try {
      localStorage.setItem('swachh_campus_deleted_tickets', JSON.stringify([...nextDeleted]));
    } catch {}

    // 2. Remove immediately from local state and storage
    setTickets((prev) => {
      const updated = prev.filter((t) => t.id !== ticketId);
      try {
        localStorage.setItem('swachh_campus_tickets', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 3. Delete from Supabase remote database
    try {
      const res = await deleteReportFromSupabase(ticketId);
      if (res.success) {
        setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        showToast('🗑️ Report ticket deleted permanently from database.');
      } else {
        console.warn('Supabase remote delete notice:', res.error);
        showToast('🗑️ Report ticket deleted locally.');
      }
    } catch (e) {
      console.warn('Delete ticket notice:', e);
      showToast('🗑️ Report ticket removed.');
    }
  };

  const handleDeleteResolvedTickets = async () => {
    const resolvedTickets = tickets.filter((t) => t.status === 'resolved');
    if (resolvedTickets.length === 0) return;

    const resolvedIds = resolvedTickets.map((t) => t.id);

    // 1. Record all in deleted tracker
    const nextDeleted = new Set(deletedTicketIds);
    resolvedIds.forEach((id) => nextDeleted.add(id));
    setDeletedTicketIds(nextDeleted);
    try {
      localStorage.setItem('swachh_campus_deleted_tickets', JSON.stringify([...nextDeleted]));
    } catch {}

    // 2. Remove from local state
    setTickets((prev) => {
      const updated = prev.filter((t) => t.status !== 'resolved');
      try {
        localStorage.setItem('swachh_campus_tickets', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    showToast(`🗑️ Purged ${resolvedIds.length} resolved reports.`);

    // 3. Delete each from Supabase in a single batch call
    if (resolvedIds.length > 0) {
      await deleteReportsFromSupabase(resolvedIds).catch(() => {});
    }
    setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleDeleteBin = (binId: string) => {
    setBins((prev) => {
      const updated = prev.filter((b) => b.id !== binId);
      try {
        localStorage.setItem('swachh_campus_bins', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (selectedBin?.id === binId) {
      setSelectedBin(bins.find((b) => b.id !== binId) || null);
    }
    showToast('🗑️ Dustbin station deleted from campus registry.');
  };

  const activeAlertsCount = tickets.filter((t) => t.status !== 'resolved').length;

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-['Public_Sans',sans-serif] text-stone-800">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-xs font-medium px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 border border-stone-700 animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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
        onOpenScanModal={() => setIsScanBinModalOpen(true)}
        activeAlertsCount={activeAlertsCount}
        totalBinsCount={bins.length}
        isAdmin={isAdmin}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-7 pb-24 md:pb-10">
        {activeTab === 'map' && (
          <div className="space-y-4">
            <CampusSanitationScorecard bins={bins} tickets={tickets} />
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
          </div>
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

        {activeTab === 'guide' && (
          <WasteSegregationGuide
            bins={bins}
            onNavigateToFinder={(wasteType) => {
              setActiveTab('finder');
            }}
            onNavigateToMap={(binId) => {
              setActiveTab('map');
              if (binId) {
                const target = bins.find((b) => b.id === binId);
                if (target) {
                  setSelectedBin(target);
                  setHighlightedBinId(target.id);
                }
              }
            }}
            onOpenReportModal={(bin) => {
              setTargetBinForReport(bin || null);
              setIsReportModalOpen(true);
            }}
          />
        )}

        {activeTab === 'alerts' && (
          <CampusAlertsView
            tickets={tickets}
            bins={bins}
            isAdmin={isAdmin}
            highlightedTicketId={highlightedTicketId}
            supabaseSyncStatus={supabaseSyncStatus}
            lastSyncedAt={lastSyncedAt}
            onManualSync={() => syncWithSupabase(true)}
            onAdminLogin={handleAdminLogin}
            onAdminLogout={handleAdminLogout}
            onResolveTicket={handleResolveTicket}
            onDispatchCleaning={handleDispatchCleaning}
            onReopenTicket={handleReopenTicket}
            onDeleteTicket={handleDeleteTicket}
            onDeleteResolvedTickets={handleDeleteResolvedTickets}
            onDeleteBin={handleDeleteBin}
            onOpenReportModal={() => {
              setTargetBinForReport(selectedBin);
              setIsReportModalOpen(true);
            }}
            onOpenAddBinModal={handleTriggerAddBin}
            onOpenAuditModal={() => setIsAuditModalOpen(true)}
            onOpenPlacardModal={(bin) => {
              setSelectedBinForPlacard(bin);
              setIsPlacardModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav 
        id="mobile-bottom-navbar" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 px-3 py-2 shadow-xs flex items-center justify-around"
      >
        <button
          id="btn-mobile-nav-map"
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-md transition-colors cursor-pointer ${
            activeTab === 'map' ? 'text-[#134E3A] font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Map</span>
        </button>

        <button
          id="btn-mobile-nav-finder"
          onClick={() => setActiveTab('finder')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-md transition-colors cursor-pointer ${
            activeTab === 'finder' ? 'text-[#134E3A] font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Nearest</span>
        </button>

        <button
          id="btn-mobile-nav-scan"
          type="button"
          onClick={() => setIsScanBinModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-md text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          title="Scan Station QR / Lookup"
        >
          <QrCode className="w-4 h-4 text-[#134E3A]" />
          <span className="text-[10px] mt-0.5 font-medium">Scan QR</span>
        </button>

        <button
          id="btn-mobile-nav-guide"
          onClick={() => setActiveTab('guide')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-md transition-colors cursor-pointer ${
            activeTab === 'guide' ? 'text-[#134E3A] font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Guide</span>
        </button>

        {isAdmin && (
          <button
            id="btn-mobile-nav-alerts"
            onClick={() => setActiveTab('alerts')}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-md transition-colors cursor-pointer ${
              activeTab === 'alerts' ? 'text-[#134E3A] font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Admin</span>
            {activeAlertsCount > 0 && (
              <span className="absolute top-0 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center font-mono-code">
                {activeAlertsCount}
              </span>
            )}
          </button>
        )}
      </nav>

      {/* Modals */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        bins={bins}
        preselectedBin={targetBinForReport}
        onSubmitReport={handleSubmitReport}
        isAdmin={isAdmin}
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

      <ScanBinModal
        isOpen={isScanBinModalOpen}
        onClose={() => setIsScanBinModalOpen(false)}
        bins={bins}
        onSelectBinAndShowMap={handleSelectBinAndShowMap}
        onReportBin={handleOpenReportForBin}
        onOpenPlacardModal={(bin) => {
          setSelectedBinForPlacard(bin);
          setIsPlacardModalOpen(true);
        }}
      />

      <PrintPlacardModal
        isOpen={isPlacardModalOpen}
        onClose={() => setIsPlacardModalOpen(false)}
        bin={selectedBinForPlacard}
      />

      <ExportAuditReportModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        bins={bins}
        tickets={tickets}
      />

      {/* Institutional Civic Footer */}
      <footer className="bg-white border-t border-stone-200 mt-14 text-xs text-stone-500">
        <div className="border-b border-stone-200 bg-stone-50/70 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-9 h-9 rounded-md bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 border border-stone-300">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <span className="font-bold text-stone-800 text-xs">
                    Campus Sanitation Registry & Supervisory Console
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-mono-code">
                    NITP-SBM v2.4
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  {isAdmin
                    ? 'Authenticated as SBM Administrator. Bin registry modifications and housekeeping dispatch tickets enabled.'
                    : 'Designated administrative portal for Swachh Bharat Mission supervisors, wardens, and sanitary superintendents.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {isAdmin ? (
                <>
                  <button
                    type="button"
                    id="btn-footer-admin-dashboard"
                    onClick={() => {
                      setActiveTab('alerts');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'alerts'
                        ? 'bg-[#134E3A] text-white shadow-2xs'
                        : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Open Dashboard</span>
                    {activeAlertsCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center font-mono-code">
                        {activeAlertsCount}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    id="btn-footer-admin-logout"
                    onClick={handleAdminLogout}
                    className="px-3 py-1.5 rounded-md text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Log out from Admin"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  id="btn-footer-admin-login"
                  onClick={() => {
                    setAdminLoginReason('reports');
                    setIsAdminLoginModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
                  title="Supervisor Authentication"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Supervisor Login</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* NIT Patna Campus info & official mandate */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-semibold text-stone-700">
              National Institute of Technology Patna
            </span>
            <span>•</span>
            <span>Ashok Rajpath, Mahendru, Patna, Bihar 800005</span>
            <span>•</span>
            <span className="text-emerald-800 font-medium">Swachh Bharat Abhiyan Cell</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-400 font-mono-code">
            <span>Clean Campus Standard IS:10001</span>
            <span>•</span>
            <span>Daily Clearance: 07:00 &amp; 15:30 IST</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
