import React, { useState, useEffect } from 'react';
import { ReportTicket, CampusBin } from '../types';
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
  Sparkles,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';

interface CampusAlertsViewProps {
  tickets: ReportTicket[];
  bins: CampusBin[];
  isAdmin: boolean;
  highlightedTicketId?: string | null;
  onAdminLogin: (id: string, pass: string) => boolean;
  onAdminLogout: () => void;
  onResolveTicket: (ticketId: string) => void;
  onDispatchCleaning: (ticketId: string) => void;
  onReopenTicket?: (ticketId: string) => void;
  onDeleteTicket?: (ticketId: string) => void;
  onOpenReportModal: () => void;
  onOpenAddBinModal?: () => void;
}

export const CampusAlertsView: React.FC<CampusAlertsViewProps> = ({
  tickets,
  bins,
  isAdmin,
  highlightedTicketId,
  onAdminLogin,
  onAdminLogout,
  onResolveTicket,
  onDispatchCleaning,
  onReopenTicket,
  onDeleteTicket,
  onOpenReportModal,
  onOpenAddBinModal,
}) => {
  // Login form state (used when not logged in)
  const [adminIdInput, setAdminIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

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
      setLoginError('Invalid Admin ID or Password. Please check your credentials.');
    }
  };

  // If user is not admin, show secure login gate
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Security Alert Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20 mb-4">
            <Lock className="w-8 h-8" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-3">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-700" />
            Restricted SBM Administration Portal
          </span>

          <h2 className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Administrator Login Required
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            Viewing submitted reports, citizen sanitation complaints, and housekeeping dispatch controls is confidential and restricted strictly to authorized Swachh Bharat Mission administrators.
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-2 bg-emerald-50 py-1.5 px-3 rounded-xl max-w-md mx-auto border border-emerald-200/60">
            🔒 All submitted dustbin reports are private and visible only to verified campus administrators.
          </p>

          {/* Quick error prompt */}
          {loginError && (
            <div className="mt-4 max-w-sm mx-auto p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Inline Login Form */}
          <form onSubmit={handleInlineLogin} className="mt-6 max-w-sm mx-auto text-left space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Admin ID:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="gate-admin-id"
                  type="text"
                  required
                  value={adminIdInput}
                  onChange={(e) => setAdminIdInput(e.target.value)}
                  placeholder="Enter Admin ID"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Password:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="gate-admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter Admin Password"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="btn-gate-login"
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Admin Dashboard</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-slate-200"></div>
              <span className="shrink mx-2 text-[10px] uppercase font-bold text-slate-400">or instant access</span>
              <div className="grow border-t border-slate-200"></div>
            </div>

            <button
              id="btn-gate-quick-access"
              type="button"
              onClick={() => onAdminLogin('SBM', 'SBM@2612047')}
              className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>One-Click Quick Admin Access (Resolve Reports)</span>
            </button>
          </form>

          {/* Alternative action: regular user wanting to submit an issue */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>Are you a student or faculty member reporting a bin?</span>
            <button
              id="btn-gate-open-report"
              onClick={onOpenReportModal}
              className="px-3.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-200 transition-colors inline-flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Submit Issue Report</span>
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Admin Status & Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-900/40">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black font-['Outfit',sans-serif] tracking-tight">
                SBM Administrator Dashboard
              </h2>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                Active: SBM
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                <Lock className="w-3 h-3" /> Visible Only to Admin
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Live monitoring of crowdsourced waste reports & housekeeping dispatches (Confidential View)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAddBinModal && (
            <button
              id="btn-admin-add-bin"
              onClick={onOpenAddBinModal}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Dustbin</span>
            </button>
          )}

          <button
            id="btn-admin-submit-report"
            onClick={onOpenReportModal}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
            <span>New Report</span>
          </button>

          <button
            id="btn-admin-logout"
            onClick={onAdminLogout}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Log out of Admin Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Top Hygiene & Housekeeping Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Reports
            </span>
            <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {tickets.length}
            </span>
            <span className="text-xs font-semibold text-slate-500">All submissions</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{pendingCount} awaiting review</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Action
            </span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 font-['Outfit',sans-serif]">
              {pendingCount}
            </span>
            <span className="text-xs font-bold text-amber-700">Needs dispatch</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Direct housekeeping staff</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Teams Dispatched
            </span>
            <span className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Send className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-sky-600 font-['Outfit',sans-serif]">
              {dispatchedCount}
            </span>
            <span className="text-xs font-bold text-sky-700">En route</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Cleaning staff in progress</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Cleaned & Resolved
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 font-['Outfit',sans-serif]">
              {resolvedCount}
            </span>
            <span className="text-xs font-bold text-emerald-700">Success</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Bins emptied & verified</p>
        </div>
      </div>

      {/* Reports Management Table / List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
              Submitted Sanitation Reports
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage citizen complaints and dispatch campus sanitation personnel
            </p>
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              id="filter-all"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({tickets.length})
            </button>
            <button
              id="filter-pending"
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'pending'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              id="filter-dispatched"
              onClick={() => setStatusFilter('cleaning_dispatched')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'cleaning_dispatched'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dispatched ({dispatchedCount})
            </button>
            <button
              id="filter-resolved"
              onClick={() => setStatusFilter('resolved')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                statusFilter === 'resolved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resolved ({resolvedCount})
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="input-search-reports"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports by dustbin name, campus location, reporter name, or issue description..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
        </div>

        {filteredTickets.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No matching reports found</h4>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery ? 'Try clearing your search query.' : 'There are currently no reports in this category.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => {
              const isHighlighted = ticket.id === highlightedTicketId;
              return (
                <div
                  key={ticket.id}
                  id={`ticket-card-${ticket.id}`}
                  className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isHighlighted
                      ? 'ring-2 ring-emerald-500 border-emerald-400 bg-emerald-50/70 shadow-md shadow-emerald-500/15'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {isHighlighted && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white animate-pulse">
                          ⚡ Newly Submitted — Ready to Resolve
                        </span>
                      )}

                      <span
                        className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                          ticket.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ticket.status === 'cleaning_dispatched'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ticket.status === 'resolved'
                          ? '✅ Cleaned & Resolved'
                          : ticket.status === 'cleaning_dispatched'
                          ? '🚚 Team Dispatched'
                          : '⏳ Action Pending'}
                      </span>

                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded uppercase">
                        {ticket.issueType.replace('_', ' ')}
                      </span>

                      <span className="text-xs text-slate-400">
                        Reported {ticket.reportedAt} by <strong className="text-slate-600">{ticket.reportedBy}</strong>
                      </span>

                      <span className="text-[10px] font-mono text-slate-400 bg-slate-200/70 px-1.5 py-0.5 rounded">
                        ID: {ticket.id}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
                      {ticket.binName}
                    </h4>

                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {ticket.locationName}
                    </p>

                    <p className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 mt-2">
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
                          className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                          title="Mark bin emptied & resolve ticket immediately"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Resolve & Mark Emptied</span>
                        </button>

                        <button
                          id={`btn-dispatch-${ticket.id}`}
                          onClick={() => onDispatchCleaning(ticket.id)}
                          className="px-3 py-2 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch Team</span>
                        </button>
                      </>
                    )}

                    {ticket.status === 'cleaning_dispatched' && (
                      <button
                        id={`btn-resolve-${ticket.id}`}
                        onClick={() => onResolveTicket(ticket.id)}
                        className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Emptied & Resolve</span>
                      </button>
                    )}

                    {ticket.status === 'resolved' && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Resolved
                        </span>
                        {onReopenTicket && (
                          <button
                            id={`btn-reopen-${ticket.id}`}
                            onClick={() => onReopenTicket(ticket.id)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
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
                        onClick={() => onDeleteTicket(ticket.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Dismiss / Delete report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
