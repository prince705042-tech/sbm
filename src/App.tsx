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
import { SplashScreen } from './components/SplashScreen';
import { SbmUrbanTopBar } from './components/SbmUrbanTopBar';
import { SbmUrbanHeader } from './components/SbmUrbanHeader';
import { SbmUrbanHero } from './components/SbmUrbanHero';
import { SbmUrbanFooter } from './components/SbmUrbanFooter';
import { TakePledgeModal } from './components/TakePledgeModal';
import { PledgeCertificateModal } from './components/PledgeCertificateModal';
import { CampusPledgeView } from './components/CampusPledgeView';
import { ContactUsModal } from './components/ContactUsModal';
import { SecurityCertificateModal } from './components/SecurityCertificateModal';
import { Breadcrumbs } from './components/Breadcrumbs';
import { NotFoundPage } from './components/NotFoundPage';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { getAssetUrl } from './utils/assets';
import { AppRoute, ROUTE_METADATA, resolveCurrentRoute, applyRouteSEO } from './utils/seo';
import { Heart, MapPin, Compass, BookOpen, Search, AlertCircle, ShieldCheck, Shield, Lock, LogOut, CheckCircle2, QrCode, ArrowUp, Award } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
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
import {
  verifyAdminCredentials,
  createAdminSession,
  validateAdminSession,
  clearAdminSession,
  checkRateLimit,
  recordRateLimitAttempt,
  resetRateLimit,
  sanitizeText,
} from './utils/security';

export default function App() {
  // Persistence in localStorage
  // Version key to ensure updated campus locations load cleanly
  const DATA_VERSION = 'v46_kosi_bhagmati_riverfront';

  const [bins, setBins] = useState<CampusBin[]>(() => {
    try {
      const savedVersion = localStorage.getItem('swachh_campus_version');
      if (savedVersion === DATA_VERSION) {
        const saved = localStorage.getItem('swachh_campus_bins');
        if (saved) {
          const parsed: CampusBin[] = JSON.parse(saved);
          // Deduplicate keys in case old data was saved and filter removed bins
          const seen = new Set<string>();
          const removedBinIds = new Set(['bin-gandhighat-1', 'bin-kosi-ext-2', 'bin-sports-1', 'bin-physics-1', 'bin-chem-1', 'bin-kosi-ext-1']);
          return parsed
            .filter((b) => !removedBinIds.has(b.id))
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
    const fallbackTickets: ReportTicket[] = [
      {
        id: 't-1',
        binId: 'bin-main-1',
        binName: 'Main Building Outside Twin Station',
        locationName: 'Main Building - Outside Central Entrance Plaza',
        issueType: 'overflowing',
        details: 'Visitor wrappers full near central portico entrance.',
        reportedAt: '25 mins ago',
        status: 'cleaning_dispatched',
        reportedBy: 'Administrative Staff',
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
    return fallbackTickets.filter((t) => !deletedSet.has(t.id));
  });

  // Admin authentication state: validated cryptographically against session token
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Validate cryptographic session on mount and ensure no stale forged auth
  useEffect(() => {
    validateAdminSession().then((isValid) => {
      setIsAdmin(isValid);
      if (!isValid) {
        clearAdminSession();
      }
    });
  }, []);

  const [activeTab, setActiveTab] = useState<AppRoute>(() => resolveCurrentRoute());

  const handleNavigateRoute = (route: AppRoute) => {
    // If routing to alerts administrative portal, re-verify signed session
    if (route === 'alerts') {
      validateAdminSession().then((isValid) => {
        setIsAdmin(isValid);
      });
    }
    setActiveTab(route);
    const meta = ROUTE_METADATA[route] || ROUTE_METADATA.map;
    if (typeof window !== 'undefined') {
      const targetSlug = meta.slug === '/map' ? '/' : meta.slug;
      if (window.location.pathname !== targetSlug) {
        window.history.pushState(null, '', targetSlug);
      }
    }
    applyRouteSEO(route);
  };

  // Sync routing and dynamic SEO on mount and browser back/forward navigation
  useEffect(() => {
    const initialRoute = resolveCurrentRoute();
    setActiveTab(initialRoute);
    applyRouteSEO(initialRoute);

    const handlePopState = () => {
      const r = resolveCurrentRoute();
      setActiveTab(r);
      applyRouteSEO(r);
      if (r === 'alerts') {
        validateAdminSession().then((isValid) => setIsAdmin(isValid));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  // Language & Accessibility State (English / Hindi matching sbmurban.org)
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>(() => {
    try {
      const saved = localStorage.getItem('swachh_campus_lang');
      if (saved === 'hi' || saved === 'en') return saved;
    } catch {}
    return 'en';
  });

  const handleLangChange = (lang: 'en' | 'hi') => {
    setCurrentLang(lang);
    try {
      localStorage.setItem('swachh_campus_lang', lang);
    } catch {}
    showToast(lang === 'hi' ? '🇮🇳 भाषा बदलकर हिन्दी कर दी गई है' : '🌐 Language set to English');
  };

  const handleFontSizeChange = (size: 'small' | 'normal' | 'large') => {
    if (size === 'small') {
      document.documentElement.style.fontSize = '14px';
      showToast('Text size set to Small');
    } else if (size === 'large') {
      document.documentElement.style.fontSize = '18px';
      showToast('Text size set to Large');
    } else {
      document.documentElement.style.fontSize = '16px';
      showToast('Text size set to Normal');
    }
  };

  // Swachhata Pledge Modal State & Stored Record
  const [isTakePledgeModalOpen, setIsTakePledgeModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [pledgeRecord, setPledgeRecord] = useState<{ name: string; dept: string; date: string } | null>(() => {
    try {
      const saved = localStorage.getItem('swachh_campus_pledge');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const handleOpenPledge = () => {
    if (pledgeRecord) {
      setIsCertificateModalOpen(true);
    } else {
      setIsTakePledgeModalOpen(true);
    }
  };

  const handlePledgeCompleted = (name: string, dept: string) => {
    const record = {
      name,
      dept,
      date: new Date().toLocaleDateString('en-IN'),
    };
    setPledgeRecord(record);
    try {
      localStorage.setItem('swachh_campus_pledge', JSON.stringify(record));
    } catch {}
    setIsTakePledgeModalOpen(false);
    setIsCertificateModalOpen(true);
    showToast('🏅 Swachhata Pledge registered! Official certificate generated.');
  };

  const handleResetPledge = () => {
    setPledgeRecord(null);
    try {
      localStorage.removeItem('swachh_campus_pledge');
    } catch {}
    showToast('Pledge record cleared.');
  };

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Supabase Sync State & Timestamp
  const [supabaseSyncStatus, setSupabaseSyncStatus] = useState<'connected' | 'syncing' | 'error'>('syncing');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // Swachh Bharat Background artwork state
  const [showSplash, setShowSplash] = useState(true);
  const [bgStyle, setBgStyle] = useState<'watermark' | 'vibrant' | 'minimal'>(() => {
    try {
      const saved = localStorage.getItem('swachh_campus_bg_style');
      if (saved === 'vibrant' || saved === 'minimal' || saved === 'watermark') return saved;
    } catch {}
    return 'watermark';
  });

  // Reset site-wide zoom on mount to eliminate zoom lag
  useEffect(() => {
    try {
      localStorage.removeItem('swachh_campus_site_zoom');
      document.documentElement.style.zoom = '';
    } catch {}
  }, []);

  const handleBgStyleChange = (style: 'watermark' | 'vibrant' | 'minimal') => {
    setBgStyle(style);
    try {
      localStorage.setItem('swachh_campus_bg_style', style);
    } catch {}
    if (style === 'vibrant') {
      showToast('🎨 Swachh Bharat background set to Vibrant mode');
    } else if (style === 'watermark') {
      showToast('👓 Swachh Bharat background set to Watermark mode');
    } else {
      showToast('Background image hidden');
    }
  };

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

  // Save current data version and bins to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('swachh_campus_version', DATA_VERSION);
      localStorage.setItem('swachh_campus_bins', JSON.stringify(bins));
    } catch {}
  }, [bins]);

  // Admin Authentication Handlers with cryptographic verification & brute force defense
  const handleAdminLogin = async (id: string, pass: string): Promise<boolean> => {
    // Rate limit login attempts
    const rateStatus = checkRateLimit('admin_auth_attempts', 5, 300000, 60000);
    if (!rateStatus.allowed) {
      showToast(`⚠️ Too many failed attempts. Security cooldown active: please wait ${rateStatus.retryAfterSeconds}s.`);
      return false;
    }

    try {
      const isValid = await verifyAdminCredentials(id, pass);
      if (isValid) {
        resetRateLimit('admin_auth_attempts');
        await createAdminSession();
        setIsAdmin(true);
        showToast('🛡️ Welcome SBM Administrator! Ephemeral cryptographic session active.');
        return true;
      } else {
        recordRateLimitAttempt('admin_auth_attempts', 300000, 5, 60000);
        const nextStatus = checkRateLimit('admin_auth_attempts', 5, 300000, 60000);
        if (!nextStatus.allowed) {
          showToast(`⚠️ Account locked for ${nextStatus.retryAfterSeconds}s due to failed attempts.`);
        } else {
          showToast(`⚠️ Invalid credentials (${nextStatus.remainingAttempts} attempt${nextStatus.remainingAttempts === 1 ? '' : 's'} remaining).`);
        }
        return false;
      }
    } catch {
      showToast('⚠️ Authentication verification error.');
      return false;
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    clearAdminSession();
    showToast('🔒 Logged out from SBM Admin Portal. Signed session terminated.');
  };

  // Only Admin can open the Add Bin flow
  const handleTriggerAddBin = async () => {
    const isSessionValid = await validateAdminSession();
    if (isAdmin && isSessionValid) {
      setIsAddBinModalOpen(true);
    } else {
      setIsAdmin(false);
      clearAdminSession();
      setAdminLoginReason('add_bin');
      setIsAdminLoginModalOpen(true);
    }
  };

  // Callback on successful admin modal login
  const handleAdminLoginSuccess = async () => {
    setIsAdmin(true);
    showToast('🛡️ Welcome SBM Administrator! Admin privileges verified.');
    if (adminLoginReason === 'add_bin') {
      setIsAddBinModalOpen(true);
      showToast('🛡️ SBM Admin verified. You can now register a new dustbin station.');
    } else {
      handleNavigateRoute('alerts');
    }
    setAdminLoginReason(null);
  };

  // Handlers
  const handleSelectBinAndShowMap = (bin: CampusBin) => {
    setSelectedBin(bin);
    setHighlightedBinId(bin.id);
    handleNavigateRoute('map');
    showToast(`📍 Showing route to ${bin.name} on Campus Map`);
  };

  const handleOpenReportForBin = (bin: CampusBin) => {
    setTargetBinForReport(bin);
    setIsReportModalOpen(true);
  };

  const handleAddNewBin = async (newBinData: Omit<CampusBin, 'id' | 'reportedCount'>) => {
    const isSessionValid = await validateAdminSession();
    if (!isAdmin || !isSessionValid) {
      setIsAdmin(false);
      clearAdminSession();
      showToast('⚠️ Unauthorized or session expired. Please re-authenticate as Admin.');
      return;
    }

    const newBin: CampusBin = {
      ...newBinData,
      name: sanitizeText(newBinData.name, 100),
      locationName: sanitizeText(newBinData.locationName, 120),
      landmark: sanitizeText(newBinData.landmark, 150),
      id: `bin-${Date.now()}`,
      reportedCount: 0,
    };
    setBins((prev) => [newBin, ...prev]);
    setSelectedBin(newBin);
    handleNavigateRoute('map');
    showToast(`✅ "${newBin.name}" successfully added to Campus Map!`);
  };

  const handleSubmitReport = (data: Omit<ReportTicket, 'id' | 'reportedAt' | 'status'>): string => {
    // Rate limit citizen report submissions (max 4 reports per 60 seconds)
    const rateStatus = checkRateLimit('citizen_report_submission', 4, 60000, 30000);
    if (!rateStatus.allowed) {
      showToast(`⚠️ Submission rate limit reached. Please wait ${rateStatus.retryAfterSeconds}s before reporting again.`);
      return '';
    }
    recordRateLimitAttempt('citizen_report_submission', 60000, 4, 30000);

    const newTicketId = `t-${Date.now()}`;
    const isoTimestamp = new Date().toISOString();
    const newTicket: ReportTicket = {
      ...data,
      details: sanitizeText(data.details, 800),
      reportedBy: sanitizeText(data.reportedBy, 80),
      binName: sanitizeText(data.binName, 100),
      locationName: sanitizeText(data.locationName, 120),
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

  const handleEmptyBin = (binId: string) => {
    setBins((prev) => {
      const updated = prev.map((b) =>
        b.id === binId
          ? {
              ...b,
              fillLevel: 5,
              status: 'normal' as const,
              lastEmptied: 'Just now',
            }
          : b
      );
      try {
        localStorage.setItem('swachh_campus_bins', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Automatically resolve any active report tickets for this dustbin
    setTickets((prev) => {
      const hasActive = prev.some((t) => t.binId === binId && t.status !== 'resolved');
      if (!hasActive) return prev;
      const updatedTickets = prev.map((t) => {
        if (t.binId === binId && t.status !== 'resolved') {
          updateReportStatusInSupabase(t.id, 'resolved', { ...t, status: 'resolved' }).catch(() => {});
          return { ...t, status: 'resolved' as const };
        }
        return t;
      });
      try {
        localStorage.setItem('swachh_campus_tickets', JSON.stringify(updatedTickets));
      } catch {}
      return updatedTickets;
    });

    if (selectedBin?.id === binId) {
      setSelectedBin((prev) =>
        prev ? { ...prev, fillLevel: 5, status: 'normal', lastEmptied: 'Just now' } : null
      );
    }

    showToast('✨ Dustbin emptied & set to Normal (5% fill). Campus registry updated.');
  };

  const activeAlertsCount = tickets.filter((t) => t.status !== 'resolved').length;

  // Real-time scroll progress tracking & spring physics
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Lag-free inertial momentum scrolling (Lenis)
  // touchMultiplier: 0 guarantees that mobile phones use 120Hz/60Hz native hardware touch scrolling without any JS interception lag!
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 0,
      syncTouch: false,
    });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F8F9FA] relative flex flex-col font-['Public_Sans',sans-serif] text-stone-800">
      {/* Real-time Tricolor Scroll Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF671F] via-[#F4B400] to-[#046A38] z-50 origin-left shadow-sm pointer-events-none"
      />
      {/* Opening Mahatma Gandhi Splash Screen on Initial Link Open */}
      {showSplash && (
        <SplashScreen 
          durationMs={1350} 
          onFinish={() => setShowSplash(false)} 
        />
      )}

      {/* Official Swachh Bharat Abhiyan Background Artwork (Quiet Watermark for WCAG AA Contrast) */}
      {bgStyle !== 'minimal' && (
        <div 
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" 
          aria-hidden="true"
          style={{ transform: 'translateZ(0)' }}
        >
          <div 
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat ${
              bgStyle === 'vibrant' 
                ? 'opacity-15' 
                : 'opacity-[0.05]'
            }`}
            style={{
              backgroundImage: `url('${getAssetUrl('swachh-bharat-bg.webp')}')`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              transform: 'translateZ(0)',
            }}
          />
        </div>
      )}

      {/* Toast popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-xs font-medium px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 border border-stone-700 pointer-events-auto"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SBM Urban Official Government of India Top Ribbon & Accessibility */}
      <SbmUrbanTopBar 
        currentLang={currentLang} 
        onLangChange={handleLangChange} 
        onFontSizeChange={handleFontSizeChange} 
      />

      {/* SBM Urban Official Header with Gandhi Specs Logo & Initiatives */}
      <SbmUrbanHeader currentLang={currentLang} />

      {/* Main SBM Urban Navy Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigateRoute}
        onOpenReportModal={() => {
          setTargetBinForReport(selectedBin);
          setIsReportModalOpen(true);
        }}
        onOpenAddBinModal={handleTriggerAddBin}
        onOpenScanModal={() => setIsScanBinModalOpen(true)}
        onOpenPledgeModal={() => handleNavigateRoute('pledge')}
        activeAlertsCount={activeAlertsCount}
        totalBinsCount={bins.length}
        isAdmin={isAdmin}
        onAdminLogout={handleAdminLogout}
        currentLang={currentLang}
      />

      {/* Main View Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-7 pb-24 md:pb-10 min-w-0">
        {/* Institutional Breadcrumbs Navigation */}
        <Breadcrumbs currentRoute={activeTab} onNavigate={handleNavigateRoute} />

        <AnimatePresence mode="wait">
          {activeTab === 'map' && (
            <motion.div
              key="tab-map"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* Distinct Page Heading */}
              <div className="border-b border-stone-200/80 pb-3 mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded tracking-wide uppercase">
                    {ROUTE_METADATA.map.badge}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">Ashok Rajpath, NIT Patna</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight">
                  {ROUTE_METADATA.map.heading}
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
                  {ROUTE_METADATA.map.subheading}
                </p>
              </div>

              <SbmUrbanHero
                currentLang={currentLang}
                onNavigateTab={handleNavigateRoute}
                onOpenReportModal={() => {
                  setTargetBinForReport(selectedBin);
                  setIsReportModalOpen(true);
                }}
                onOpenScanModal={() => setIsScanBinModalOpen(true)}
                onOpenPledgeModal={() => handleNavigateRoute('pledge')}
                totalBinsCount={bins.length}
                activeAlertsCount={activeAlertsCount}
              />
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4 }}
              >
                <CampusSanitationScorecard bins={bins} tickets={tickets} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4 }}
              >
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
                  onEmptyBin={handleEmptyBin}
                />
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'finder' && (
            <motion.div
              key="tab-finder"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {/* Distinct Page Heading */}
              <div className="border-b border-stone-200/80 pb-3 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded tracking-wide uppercase">
                    {ROUTE_METADATA.finder.badge}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">Real-Time Distance Engine</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight">
                  {ROUTE_METADATA.finder.heading}
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
                  {ROUTE_METADATA.finder.subheading}
                </p>
              </div>

              <NearestBinFinder
                bins={bins}
                userZone={userZone}
                setUserZone={setUserZone}
                onSelectBinAndShowMap={handleSelectBinAndShowMap}
                onReportBin={handleOpenReportForBin}
              />
            </motion.div>
          )}

          {activeTab === 'guide' && (
            <motion.div
              key="tab-guide"
              initial={{ opacity: 0, rotateY: -16, scale: 0.98 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: 16, scale: 0.98 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'left center', perspective: 1200 }}
            >
              {/* Distinct Page Heading */}
              <div className="border-b border-stone-200/80 pb-3 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded tracking-wide uppercase">
                    {ROUTE_METADATA.guide.badge}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">MoHUA SBM Urban Directives</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight">
                  {ROUTE_METADATA.guide.heading}
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
                  {ROUTE_METADATA.guide.subheading}
                </p>
              </div>

              <WasteSegregationGuide
                bins={bins}
                onNavigateToFinder={() => {
                  handleNavigateRoute('finder');
                }}
                onNavigateToMap={(binId) => {
                  handleNavigateRoute('map');
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
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              key="tab-alerts"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {/* Distinct Page Heading */}
              <div className="border-b border-stone-200/80 pb-3 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded tracking-wide uppercase">
                    {ROUTE_METADATA.alerts.badge}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">Civic Grievance Board</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight">
                  {ROUTE_METADATA.alerts.heading}
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
                  {ROUTE_METADATA.alerts.subheading}
                </p>
              </div>

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
                onEmptyBin={handleEmptyBin}
              />
            </motion.div>
          )}

          {activeTab === 'pledge' && (
            <motion.div
              key="tab-pledge"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {/* Distinct Page Heading */}
              <div className="border-b border-stone-200/80 pb-3 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded tracking-wide uppercase">
                    {ROUTE_METADATA.pledge.badge}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">National Swachhata Campaign</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight">
                  {ROUTE_METADATA.pledge.heading}
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
                  {ROUTE_METADATA.pledge.subheading}
                </p>
              </div>

              <CampusPledgeView
                pledgeRecord={pledgeRecord}
                onTakePledge={handlePledgeCompleted}
                onResetPledge={handleResetPledge}
              />
            </motion.div>
          )}

          {activeTab === 'not_found' && (
            <motion.div
              key="tab-not-found"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <NotFoundPage
                onNavigate={handleNavigateRoute}
                onSearchCampusZone={(term) => {
                  handleNavigateRoute('map');
                  showToast(`🔍 Located zone: ${term}`);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation Bar (Clean ergonomic thumb access) */}
      <nav 
        id="mobile-bottom-navbar" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 px-2 py-1.5 shadow-sm flex items-center justify-around select-none"
        aria-label="Mobile Navigation"
      >
        {/* Tab 1: Map */}
        <button
          id="btn-mobile-nav-map"
          type="button"
          onClick={() => handleNavigateRoute('map')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded transition-colors cursor-pointer min-h-[44px] ${
            activeTab === 'map' ? 'text-[#046A38] font-semibold' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <MapPin className={`w-4 h-4 ${activeTab === 'map' ? 'text-[#046A38]' : 'text-stone-400'}`} />
          <span className="text-[10px] mt-1 font-medium">Map</span>
        </button>

        {/* Tab 2: Nearest */}
        <button
          id="btn-mobile-nav-finder"
          type="button"
          onClick={() => handleNavigateRoute('finder')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded transition-colors cursor-pointer min-h-[44px] ${
            activeTab === 'finder' ? 'text-[#046A38] font-semibold' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Compass className={`w-4 h-4 ${activeTab === 'finder' ? 'text-[#046A38]' : 'text-stone-400'}`} />
          <span className="text-[10px] mt-1 font-medium">Nearest</span>
        </button>

        {/* Tab 3: Quick Scan Station */}
        <button
          id="btn-mobile-nav-scan"
          type="button"
          onClick={() => setIsScanBinModalOpen(true)}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded text-stone-600 hover:text-stone-900 transition-colors cursor-pointer min-h-[44px]"
        >
          <QrCode className="w-4 h-4 text-emerald-700" />
          <span className="text-[10px] mt-1 font-medium">Scan QR</span>
        </button>

        {/* Tab 4: Guide */}
        <button
          id="btn-mobile-nav-guide"
          type="button"
          onClick={() => handleNavigateRoute('guide')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded transition-colors cursor-pointer min-h-[44px] ${
            activeTab === 'guide' ? 'text-[#046A38] font-semibold' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <BookOpen className={`w-4 h-4 ${activeTab === 'guide' ? 'text-[#046A38]' : 'text-stone-400'}`} />
          <span className="text-[10px] mt-1 font-medium">Manual</span>
        </button>

        {/* Tab 5: Grievances / Desk */}
        <button
          id="btn-mobile-nav-alerts"
          type="button"
          onClick={() => handleNavigateRoute('alerts')}
          className={`flex-1 relative flex flex-col items-center justify-center py-1 rounded transition-colors cursor-pointer min-h-[44px] ${
            activeTab === 'alerts' ? 'text-[#046A38] font-semibold' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <div className="relative">
            <ShieldCheck className={`w-4 h-4 ${activeTab === 'alerts' ? 'text-[#046A38]' : 'text-stone-400'}`} />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-2.5 min-w-[15px] h-3.5 px-1 rounded-full bg-rose-600 text-white text-[8px] font-bold flex items-center justify-center font-mono-code tabular-nums">
                {activeAlertsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium">
            {isAdmin ? 'Admin' : 'Grievance'}
          </span>
        </button>
      </nav>

      {/* Modals */}
      <AnimatePresence>
        {isReportModalOpen && (
          <ReportIssueModal
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            bins={bins}
            preselectedBin={targetBinForReport}
            onSubmitReport={handleSubmitReport}
            isAdmin={isAdmin}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddBinModalOpen && (
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
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAdminLoginModalOpen && (
          <AdminLoginModal
            isOpen={isAdminLoginModalOpen}
            onClose={() => {
              setIsAdminLoginModalOpen(false);
              setAdminLoginReason(null);
            }}
            reason={adminLoginReason}
            onLoginSuccess={handleAdminLoginSuccess}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isScanBinModalOpen && (
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
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPlacardModalOpen && (
          <PrintPlacardModal
            isOpen={isPlacardModalOpen}
            onClose={() => setIsPlacardModalOpen(false)}
            bin={selectedBinForPlacard}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAuditModalOpen && (
          <ExportAuditReportModal
            isOpen={isAuditModalOpen}
            onClose={() => setIsAuditModalOpen(false)}
            bins={bins}
            tickets={tickets}
          />
        )}
      </AnimatePresence>

      {/* Swachhata Pledge Input Modal */}
      <AnimatePresence>
        {isTakePledgeModalOpen && (
          <TakePledgeModal
            isOpen={isTakePledgeModalOpen}
            onClose={() => setIsTakePledgeModalOpen(false)}
            onPledgeCompleted={handlePledgeCompleted}
            initialName={pledgeRecord?.name || ''}
            initialDept={pledgeRecord?.dept || ''}
            currentLang={currentLang}
          />
        )}
      </AnimatePresence>

      {/* Official SBM-Urban Swachhata Pledge Certificate Modal */}
      <AnimatePresence>
        {isCertificateModalOpen && (
          <PledgeCertificateModal
            isOpen={isCertificateModalOpen}
            onClose={() => setIsCertificateModalOpen(false)}
            pledgeName={pledgeRecord?.name || 'Campus Citizen'}
            pledgeDept={pledgeRecord?.dept || 'NIT Patna'}
            pledgeDate={pledgeRecord?.date || new Date().toLocaleDateString('en-IN')}
            onResetPledge={handleResetPledge}
            currentLang={currentLang}
          />
        )}
      </AnimatePresence>

      {/* Official SBM-Urban Government of India 4-Column Footer */}
      <SbmUrbanFooter
        currentLang={currentLang}
        isAdmin={isAdmin}
        onAdminLoginClick={() => {
          setAdminLoginReason('reports');
          setIsAdminLoginModalOpen(true);
        }}
        onAdminLogoutClick={handleAdminLogout}
        onOpenDashboardClick={() => {
          handleNavigateRoute('alerts');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeAlertsCount={activeAlertsCount}
        onNavigateTab={handleNavigateRoute}
        onOpenPledgeModal={() => handleNavigateRoute('pledge')}
      />

      {/* Floating Scroll to Top Action with Live Circular Progress (Self-Contained & Lag-Free) */}
      <ScrollToTopButton />
    </div>
  );
}
