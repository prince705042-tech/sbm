import React from 'react';
import { ReportTicket, CampusBin } from '../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  UserCheck,
  Send,
  Building
} from 'lucide-react';

interface CampusAlertsViewProps {
  tickets: ReportTicket[];
  bins: CampusBin[];
  onResolveTicket: (ticketId: string) => void;
  onDispatchCleaning: (ticketId: string) => void;
  onOpenReportModal: () => void;
}

export const CampusAlertsView: React.FC<CampusAlertsViewProps> = ({
  tickets,
  bins,
  onResolveTicket,
  onDispatchCleaning,
  onOpenReportModal,
}) => {
  const pendingCount = tickets.filter((t) => t.status === 'pending').length;
  const dispatchedCount = tickets.filter((t) => t.status === 'cleaning_dispatched').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length;

  const fullBins = bins.filter((b) => b.fillLevel >= 80);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Hygiene & Housekeeping Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Campus Hygiene
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
              94%
            </span>
            <span className="text-xs font-bold text-emerald-600">Optimal</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Based on bin fill levels & sensor checks</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Bins Needing Service
            </span>
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {fullBins.length}
            </span>
            <span className="text-xs font-bold text-rose-600">&gt;80% capacity</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Housekeeping alerted automatically</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Reports
            </span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {pendingCount + dispatchedCount}
            </span>
            <span className="text-xs font-semibold text-amber-700">In workflow</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{dispatchedCount} team on the way</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Avg Clearance Time
            </span>
            <span className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <UserCheck className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
              18 min
            </span>
            <span className="text-xs font-bold text-sky-600">Fast response</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Swachh Campus volunteer team</p>
        </div>
      </div>

      {/* Tickets & Reports Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
              Live Housekeeping Tickets & Student Reports
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Crowdsourced sanitation monitoring for Swachh Bharat Abhiyan
            </p>
          </div>

          <button
            onClick={onOpenReportModal}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Submit a New Report</span>
          </button>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">All campus dustbins are in great shape!</h4>
            <p className="text-xs text-slate-500 mt-1">
              No active complaints or overflowing bins reported at this time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
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
                      Reported {ticket.reportedAt} by {ticket.reportedBy}
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

                {/* Workflow Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {ticket.status === 'pending' && (
                    <button
                      onClick={() => onDispatchCleaning(ticket.id)}
                      className="px-3.5 py-2 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Housekeeping</span>
                    </button>
                  )}

                  {ticket.status === 'cleaning_dispatched' && (
                    <button
                      onClick={() => onResolveTicket(ticket.id)}
                      className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Bin Emptied</span>
                    </button>
                  )}

                  {ticket.status === 'resolved' && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Verified Clean
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
