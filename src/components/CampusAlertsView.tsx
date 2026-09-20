import React, { useState, useEffect } from 'react';
import { ReportTicket, CampusBin } from '../types';
import { formatReportTime } from '../lib/supabase';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  UserCheck, 
  Send, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  LogOut, 
  Filter, 
  Search, 
  Trash2, 
  ShieldAlert, 
  AlertCircle,
  PlusCircle,
  RefreshCw,
  Database,
  FileText,
  Printer
} from 'lucide-react';

interface CampusAlertsViewProps {
  tickets: ReportTicket[];
  bins: CampusBin[];
  isAdmin: boolean;
  highlightedTicketId?: string | null;
  supabaseSyncStatus?: 'connected' | 'syncing' | 'error';
  lastSyncedAt?: string | null;
  onManualSync?: () => Promise<void> | void;
  onAdminLogin: (id: string, pass: string) => boolean;
  onAdminLogout: () => void;
  onResolveTicket: (ticketId: string) => void;
  onDispatchCleaning: (ticketId: string) => void;
  onReopenTicket?: (ticketId: string) => void;
  onDeleteTicket?: (ticketId: string) => Promise<void> | void;
  onDeleteResolvedTickets?: () => Promise<void> | void;
  onDeleteBin?: (binId: string) => void;
  onOpenReportModal: () => void;
  onOpenAddBinModal?: () => void;
  onOpenAuditModal?: () => void;
  onOpenPlacardModal?: (bin: CampusBin) => void;
}

export const CampusAlertsView: React.FC<CampusAlertsViewProps> = ({
  tickets,
  bins,
  isAdmin,
  highlightedTicketId,
  supabaseSyncStatus = 'connected',
  lastSyncedAt,
  onManualSync,
  onAdminLogin,
  onAdminLogout,
  onResolveTicket,
  onDispatchCleaning,
  onReopenTicket,
  onDeleteTicket,
  onDeleteResolvedTickets,
  onDeleteBin,
  onOpenReportModal,
  onOpenAddBinModal,
  onOpenAuditModal,
  onOpenPlacardModal,
}) => {
  // Login form state (used when not logged in)
  const [adminIdInput, setAdminIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Admin Dashboard Section Switcher
  const [adminTab, setAdminTab] = useState<'reports' | 'bins'>('reports');
  const [binSearchQuery, setBinSearchQuery] = useState('');

  // Delete modal and loading states
  const [ticketToDelete, setTicketToDelete] = useState<ReportTicket | null>(null);
  const [binToDelete, setBinToDelete] = useState<CampusBin | null>(null);
  const [showDeleteResolvedConfirm, setShowDeleteResolvedConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter and search state for logged-in admin
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'cleaning_dispatched' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingCount = tickets.filter((t) => t.status === 'pending').length;
  const dispatchedCount = tickets.filter((t) => t.status === 'cleaning_dispatched').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length;
  const fullBins = bins.filter((b) => b.fillLevel >= 80);

  // Smooth scroll to highlighted ticket when navigating from submit
  useEffect(() => {
    if (highlightedTicketId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`ticket-card-${highlightedTicketId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [highlightedTicketId]);

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const success = onAdminLogin(adminIdInput.trim(), passwordInput.trim());
    if (!success) {
      setLoginError('Invalid Admin ID or Password. Access is restricted to authorized personnel.');
    }
  };

  // If user is not admin, show secure login gate
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        {/* Security Alert Header */}
        <div className="bg-white rounded-lg p-6 sm:p-8 border border-stone-200 shadow-2xs text-center">
          <div className="w-12 h-12 rounded bg-stone-100 text-stone-800 border border-stone-300 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-[#134E3A]" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-200 font-mono-code mb-3">
            <ShieldAlert className="w-3 h-3 text-[#134E3A]" />
            Official Administrative Portal
          </span>

          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-editorial">
            Sanitation Administration Sign-In
          </h2>
          <p className="text-xs text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
            Direct access to submitted maintenance requests, staff dispatch workflows, and registry management is restricted to authorized estate office personnel.
          </p>
          <p className="text-[11px] text-stone-700 mt-3 bg-stone-50 py-2 px-3 rounded border border-stone-200 font-mono-code max-w-md mx-auto">
            Authorized Personnel: SBM Nodal Officers &amp; Housekeeping Supervisors
          </p>

          {/* Quick error prompt */}
          {loginError && (
            <div className="mt-4 max-w-sm mx-auto p-3 rounded bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Inline Login Form */}
          <form onSubmit={handleInlineLogin} className="mt-6 max-w-sm mx-auto text-left space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Admin Username / ID:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="gate-admin-id"
                  type="text"
                  required
                  value={adminIdInput}
                  onChange={(e) => setAdminIdInput(e.target.value)}
                  placeholder="Enter administrator ID"
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs font-medium text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-[#134E3A] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Security Password:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="gate-admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter administrative password"
                  className="w-full pl-9 pr-10 py-2 bg-stone-50 border border-stone-300 rounded text-xs font-medium text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-[#134E3A] focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="btn-gate-login"
              type="submit"
              className="w-full py-2.5 rounded bg-[#134E3A] hover:bg-[#0F3E2E] text-white text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Authenticate &amp; Open Portal</span>
            </button>
          </form>

          {/* Quick Demo Autofill */}
          <div className="mt-4 pt-3 border-t border-stone-100 max-w-sm mx-auto flex items-center justify-between text-[11px] text-stone-500 font-mono-code">
            <span>Demo: SBM / SBM@2612047</span>
            <button
              type="button"
              onClick={() => {
                setAdminIdInput('SBM');
                setPasswordInput('SBM@2612047');
              }}
              className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors cursor-pointer"
            >
              Auto-fill
            </button>
          </div>

          {/* Alternative action: regular user wanting to submit an issue */}
          <div className="mt-8 pt-5 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            <span>Reporting a full or damaged bin on campus?</span>
            <button
              id="btn-gate-open-report"
              onClick={onOpenReportModal}
              className="px-3 py-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium border border-stone-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Submit Maintenance Ticket</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered tickets based on search and status tab
  const filteredTickets = tickets.filter((ticket) => {
    if (statusFilter !== 'all' && ticket.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ticket.binName.toLowerCase().includes(q);
      const matchLoc = ticket.locationName.toLowerCase().includes(q);
      const matchReporter = ticket.reportedBy.toLowerCase().includes(q);
      const matchDetails = ticket.details.toLowerCase().includes(q);
      const matchIssue = ticket.issueType.toLowerCase().includes(q);
      return matchName || matchLoc || matchReporter || matchDetails || matchIssue;
    }
    return true;
  });

  const filteredBins = bins.filter((b) => {
    if (!binSearchQuery.trim()) return true;
    const q = binSearchQuery.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.locationName.toLowerCase().includes(q) ||
      b.floor.toLowerCase().includes(q) ||
      b.landmark.toLowerCase().includes(q) ||
      b.zone.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Admin Status & Banner */}
      <div className="bg-[#1C1917] rounded-lg p-5 sm:p-6 text-stone-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-stone-800">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded bg-stone-800 text-emerald-400 border border-stone-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-editorial text-white tracking-tight">
                Sanitation Control &amp; Dispatch Console
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#134E3A] text-emerald-100 border border-emerald-700 px-2 py-0.5 rounded font-mono-code">
                Staff Active
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Live monitoring of crowdsourced waste reports, housekeeping dispatches, and campus dustbin infrastructure
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAuditModal && (
            <button
              id="btn-admin-export-audit"
              type="button"
              onClick={onOpenAuditModal}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Generate printable Swachh Bharat Mission inspection docket"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">SBM Audit Docket</span>
              <span className="sm:hidden">Audit</span>
            </button>
          )}

          {onOpenAddBinModal && (
            <button
              id="btn-admin-add-bin"
              onClick={onOpenAddBinModal}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-[#134E3A] hover:bg-[#0F3E2E] text-white transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer border border-[#0F3E2E]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register Dustbin</span>
            </button>
          )}

          <button
            id="btn-admin-submit-report"
            onClick={onOpenReportModal}
            className="px-3 py-1.5 text-xs font-medium rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>New Ticket</span>
          </button>

          <button
            id="btn-admin-logout"
            onClick={onAdminLogout}
            className="px-3 py-1.5 text-xs font-medium rounded bg-rose-900/60 hover:bg-rose-900 text-rose-200 border border-rose-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Log out of Admin Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Supabase Cloud Sync Status Card */}
      <div className="bg-white rounded-lg p-4 border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-stone-100 text-stone-700 border border-stone-200 flex items-center justify-center shrink-0">
            <Database className="w-4 h-4 text-[#134E3A]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-stone-900 font-editorial">
                Database Cloud Synchronization
              </span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold font-mono-code px-2 py-0.5 rounded ${
                supabaseSyncStatus === 'connected'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : supabaseSyncStatus === 'syncing'
                  ? 'bg-amber-50 text-amber-900 border border-amber-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  supabaseSyncStatus === 'connected'
                    ? 'bg-emerald-600'
                    : supabaseSyncStatus === 'syncing'
                    ? 'bg-amber-600 animate-ping'
                    : 'bg-rose-600'
                }`} />
                {supabaseSyncStatus === 'connected' 
                  ? 'Database Online' 
                  : supabaseSyncStatus === 'syncing' 
                  ? 'Synchronizing Table...' 
                  : 'Sync Interrupted'}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Target Table: <code className="font-mono-code text-stone-800 bg-stone-100 px-1 py-0.2 rounded">public.reports</code> &bull; {tickets.length} records loaded {lastSyncedAt ? `&bull; Last check at ${lastSyncedAt}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onManualSync && (
            <button
              id="btn-supabase-manual-sync"
              onClick={onManualSync}
              className="px-3 py-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium border border-stone-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Force sync local reports with Supabase cloud table"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-stone-600 ${supabaseSyncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              <span>Refresh Records</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Hygiene & Housekeeping Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 font-mono-code">
              Total Logged
            </span>
            <span className="p-1.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900 font-editorial">
              {tickets.length}
            </span>
            <span className="text-xs text-stone-500 font-mono-code">all tickets</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">{pendingCount} pending assignment</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 font-mono-code">
              Pending Action
            </span>
            <span className="p-1.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-800 font-editorial">
              {pendingCount}
            </span>
            <span className="text-xs text-amber-800 font-mono-code">needs crew</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Requires supervisor dispatch</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-800 font-mono-code">
              Staff Dispatched
            </span>
            <span className="p-1.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
              <Send className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-sky-800 font-editorial">
              {dispatchedCount}
            </span>
            <span className="text-xs text-sky-800 font-mono-code">en route</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Housekeeping team active</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 font-mono-code">
              Resolved &amp; Cleared
            </span>
            <span className="p-1.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-800 font-editorial">
              {resolvedCount}
            </span>
            <span className="text-xs text-emerald-800 font-mono-code">cleared</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Bins emptied and verified</p>
        </div>
      </div>

      {/* Admin Module Switcher */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-1">
        <button
          id="tab-admin-reports"
          onClick={() => setAdminTab('reports')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-t-md transition-colors flex items-center gap-2 cursor-pointer border-b-2 ${
            adminTab === 'reports'
              ? 'border-[#134E3A] text-stone-900 bg-white font-editorial'
              : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-[#134E3A]" />
          <span>Sanitation Complaints &amp; Reports ({tickets.length})</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold font-mono-code">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          id="tab-admin-bins"
          onClick={() => setAdminTab('bins')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-t-md transition-colors flex items-center gap-2 cursor-pointer border-b-2 ${
            adminTab === 'bins'
              ? 'border-[#134E3A] text-stone-900 bg-white font-editorial'
              : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-stone-600" />
          <span>Dustbin Stations Registry ({bins.length})</span>
        </button>
      </div>

      {/* Conditional rendering based on adminTab */}
      {adminTab === 'reports' ? (
        /* Reports Management Table / List */
        <div className="bg-white rounded-lg p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 font-editorial">
                Sanitation Maintenance Requests
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Review submitted notifications and dispatch campus housekeeping teams
              </p>
            </div>

            {/* Status filter tabs */}
            <div className="flex flex-wrap items-center gap-1 bg-stone-100 p-1 rounded-md border border-stone-200">
              <button
                id="filter-all"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All ({tickets.length})
              </button>
              <button
                id="filter-pending"
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                id="filter-dispatched"
                onClick={() => setStatusFilter('cleaning_dispatched')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  statusFilter === 'cleaning_dispatched'
                    ? 'bg-sky-700 text-white shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Dispatched ({dispatchedCount})
              </button>
              <button
                id="filter-resolved"
                onClick={() => setStatusFilter('resolved')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  statusFilter === 'resolved'
                    ? 'bg-[#134E3A] text-white shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Resolved ({resolvedCount})
              </button>

              {statusFilter === 'resolved' && resolvedCount > 0 && onDeleteResolvedTickets && (
                <button
                  id="btn-delete-all-resolved"
                  onClick={() => setShowDeleteResolvedConfirm(true)}
                  className="px-2.5 py-1 text-xs font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors flex items-center gap-1 cursor-pointer ml-1"
                  title="Permanently purge all resolved tickets"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Purge Resolved ({resolvedCount})</span>
                </button>
              )}
            </div>
          </div>

        {/* Search bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="input-search-reports"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by dustbin name, building location, reporter name, or description..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs font-medium text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-[#134E3A] focus:bg-white transition-colors"
          />
        </div>

        {filteredTickets.length === 0 ? (
          <div className="text-center py-10 bg-stone-50 rounded-lg border border-dashed border-stone-200">
            <CheckCircle2 className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-stone-800 font-editorial">No matching reports found</h4>
            <p className="text-xs text-stone-500 mt-0.5">
              {searchQuery ? 'Try clearing your search term.' : 'There are currently no reports in this filter category.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => {
              const isHighlighted = ticket.id === highlightedTicketId;
              return (
                <div
                  key={ticket.id}
                  id={`ticket-card-${ticket.id}`}
                  className={`p-4 rounded-lg border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    isHighlighted
                      ? 'ring-2 ring-[#134E3A]/40 border-[#134E3A] bg-emerald-50/20 shadow-2xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      {isHighlighted && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#134E3A] text-white font-mono-code">
                          Newly Logged
                        </span>
                      )}

                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono-code ${
                          ticket.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                            : ticket.status === 'cleaning_dispatched'
                            ? 'bg-sky-50 text-sky-900 border border-sky-200'
                            : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {ticket.status === 'resolved'
                          ? 'Resolved'
                          : ticket.status === 'cleaning_dispatched'
                          ? 'Crew Dispatched'
                          : 'Pending Action'}
                      </span>

                      <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 uppercase font-mono-code">
                        {ticket.issueType.replace('_', ' ')}
                      </span>

                      <span className="text-xs text-stone-500">
                        {formatReportTime(ticket.reportedAt)} by <strong className="text-stone-700">{ticket.reportedBy}</strong>
                      </span>

                      <span className="text-[10px] font-mono-code text-stone-400 bg-stone-100 px-1.5 py-0.2 rounded border border-stone-200">
                        #{ticket.id.slice(0, 8)}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 font-editorial">
                      {ticket.binName}
                    </h4>

                    <p className="text-xs text-stone-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{ticket.locationName}</span>
                    </p>

                    <p className="text-xs text-stone-700 bg-stone-50 p-2 rounded border border-stone-200 mt-1">
                      "{ticket.details}"
                    </p>
                  </div>

                  {/* Workflow Action Buttons for Admin */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {ticket.status === 'pending' && (
                      <>
                        <button
                          id={`btn-resolve-direct-${ticket.id}`}
                          onClick={() => onResolveTicket(ticket.id)}
                          className="px-3 py-1.5 text-xs font-semibold rounded bg-[#134E3A] hover:bg-[#0F3E2E] text-white shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Mark bin emptied & resolve ticket immediately"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Cleared</span>
                        </button>

                        <button
                          id={`btn-dispatch-${ticket.id}`}
                          onClick={() => onDispatchCleaning(ticket.id)}
                          className="px-3 py-1.5 text-xs font-medium rounded bg-stone-800 hover:bg-stone-900 text-white shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch Staff</span>
                        </button>
                      </>
                    )}

                    {ticket.status === 'cleaning_dispatched' && (
                      <button
                        id={`btn-resolve-${ticket.id}`}
                        onClick={() => onResolveTicket(ticket.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded bg-[#134E3A] hover:bg-[#0F3E2E] text-white shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Emptied &amp; Close</span>
                      </button>
                    )}

                    {ticket.status === 'resolved' && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 font-mono-code">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          Cleared
                        </span>
                        {onReopenTicket && (
                          <button
                            id={`btn-reopen-${ticket.id}`}
                            onClick={() => onReopenTicket(ticket.id)}
                            className="px-2 py-1 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded border border-stone-200 transition-colors cursor-pointer"
                            title="Re-open report"
                          >
                            Re-open
                          </button>
                        )}
                      </div>
                    )}

                    {onDeleteTicket && (
                      <button
                        id={`btn-delete-${ticket.id}`}
                        onClick={() => setTicketToDelete(ticket)}
                        className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                        title="Delete this report permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      ) : (
        /* Campus Dustbin Registry View */
        <div className="bg-white rounded-lg p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 font-editorial">
                Campus Dustbin Stations
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Verify fill level sensors, inspect compartment capacities, and maintain hardware records
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onOpenAddBinModal && (
                <button
                  id="btn-admin-add-bin-secondary"
                  onClick={onOpenAddBinModal}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-[#134E3A] hover:bg-[#0F3E2E] text-white transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Register Station</span>
                </button>
              )}
            </div>
          </div>

          {/* Search bar for bins */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-admin-bins"
              type="text"
              value={binSearchQuery}
              onChange={(e) => setBinSearchQuery(e.target.value)}
              placeholder="Search dustbins by name, campus zone, location, or landmark..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs font-medium text-stone-900 focus:outline-hidden focus:border-[#134E3A] transition-colors placeholder:text-stone-400"
            />
          </div>

          {filteredBins.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-stone-200 rounded-lg bg-stone-50">
              <MapPin className="w-7 h-7 text-stone-300 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-stone-700">No dustbin records match search criteria</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Try filtering with a different zone or keyword.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredBins.map((bin) => (
                <div
                  key={bin.id}
                  id={`bin-card-admin-${bin.id}`}
                  className="p-4 rounded-lg border border-stone-200 bg-white hover:border-stone-300 transition-colors shadow-2xs flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm font-editorial">
                          {bin.name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
                          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{bin.locationName}</span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {bin.landmark} &bull; {bin.floor}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono-code ${
                          bin.status === 'normal'
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                            : bin.status === 'filling'
                            ? 'bg-amber-50 text-amber-900 border border-amber-200'
                            : bin.status === 'full'
                            ? 'bg-rose-50 text-rose-900 border border-rose-200'
                            : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}>
                          {bin.status}
                        </span>

                        {onDeleteBin && (
                          <button
                            id={`btn-delete-bin-${bin.id}`}
                            onClick={() => setBinToDelete(bin)}
                            className="p-1 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Decommission dustbin from registry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Fill Level Meter */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-stone-500 text-[11px]">Fill Status</span>
                        <span className="font-mono-code text-xs font-bold text-stone-800">{bin.fillLevel}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                        <div
                          className={`h-full transition-all duration-300 ${
                            bin.fillLevel >= 80
                              ? 'bg-rose-600'
                              : bin.fillLevel >= 50
                              ? 'bg-amber-500'
                              : 'bg-[#134E3A]'
                          }`}
                          style={{ width: `${bin.fillLevel}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-stone-100 text-[11px] text-stone-500">
                    <div className="flex items-center gap-1">
                      {bin.hasDry && (
                        <span className="px-1.5 py-0.2 rounded bg-sky-50 text-sky-900 font-medium border border-sky-200 text-[10px]">
                          Dry
                        </span>
                      )}
                      {bin.hasWet && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-900 font-medium border border-emerald-200 text-[10px]">
                          Wet
                        </span>
                      )}
                      {bin.hasEwaste && (
                        <span className="px-1.5 py-0.2 rounded bg-stone-100 text-stone-800 font-medium border border-stone-300 text-[10px]">
                          E-Waste
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-code text-[10px]">Cap: {bin.capacityLiters}L &bull; {bin.zone}</span>
                      {onOpenPlacardModal && (
                        <button
                          type="button"
                          onClick={() => onOpenPlacardModal(bin)}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 flex items-center gap-1 cursor-pointer transition-colors"
                          title="Print official physical dustbin sticker with QR"
                        >
                          <Printer className="w-3 h-3 text-[#134E3A]" />
                          <span>Placard</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: Confirm Delete Single Report */}
      {ticketToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg max-w-md w-full p-5 shadow-xl border border-stone-200 animate-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-stone-900 font-editorial">
              Delete Sanitation Report?
            </h4>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Are you sure you want to permanently delete report ticket <strong className="text-stone-900 font-mono-code">#{ticketToDelete.id}</strong>? This action removes the record from both the local console and Supabase database.
            </p>

            <div className="bg-stone-50 border border-stone-200 rounded p-3 my-3 text-xs space-y-0.5">
              <p className="font-bold text-stone-900">{ticketToDelete.binName}</p>
              <p className="text-stone-600">{ticketToDelete.locationName}</p>
              <p className="text-stone-700 italic">"{ticketToDelete.details}"</p>
              <p className="text-[10px] text-stone-400 pt-1 font-mono-code">Reported by {ticketToDelete.reportedBy} &bull; {ticketToDelete.reportedAt}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                id="btn-cancel-delete-report"
                type="button"
                disabled={isDeleting}
                onClick={() => setTicketToDelete(null)}
                className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-delete-report"
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  if (!onDeleteTicket) return;
                  setIsDeleting(true);
                  try {
                    await onDeleteTicket(ticketToDelete.id);
                  } finally {
                    setIsDeleting(false);
                    setTicketToDelete(null);
                  }
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Confirm Delete All Resolved Reports */}
      {showDeleteResolvedConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg max-w-md w-full p-5 shadow-xl border border-stone-200 animate-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-stone-900 font-editorial">
              Purge All Resolved Reports?
            </h4>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              This will permanently delete all <strong className="text-stone-900 font-bold">{resolvedCount}</strong> resolved reports from both the active campus dashboard and the Supabase cloud table.
            </p>
            <div className="flex items-center justify-end gap-2 mt-4 pt-2 border-t border-stone-100">
              <button
                id="btn-cancel-delete-all-resolved"
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteResolvedConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-delete-all-resolved"
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  if (!onDeleteResolvedTickets) return;
                  setIsDeleting(true);
                  try {
                    await onDeleteResolvedTickets();
                  } finally {
                    setIsDeleting(false);
                    setShowDeleteResolvedConfirm(false);
                  }
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Purging...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete {resolvedCount} Reports</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Confirm Delete Dustbin */}
      {binToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg max-w-md w-full p-5 shadow-xl border border-stone-200 animate-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-stone-900 font-editorial">
              Decommission Dustbin Station?
            </h4>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Are you sure you want to remove <strong className="text-stone-900 font-bold">{binToDelete.name}</strong> from the campus registry? It will no longer appear on the interactive map or citizen bin finder.
            </p>

            <div className="bg-stone-50 border border-stone-200 rounded p-3 my-3 text-xs space-y-0.5">
              <p className="font-bold text-stone-900">{binToDelete.name}</p>
              <p className="text-stone-600">{binToDelete.locationName}</p>
              <p className="text-[11px] text-stone-400 font-mono-code">Zone: {binToDelete.zone} &bull; Capacity: {binToDelete.capacityLiters}L</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                id="btn-cancel-delete-bin"
                type="button"
                onClick={() => setBinToDelete(null)}
                className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-delete-bin"
                type="button"
                onClick={() => {
                  if (onDeleteBin) onDeleteBin(binToDelete.id);
                  setBinToDelete(null);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Removal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
