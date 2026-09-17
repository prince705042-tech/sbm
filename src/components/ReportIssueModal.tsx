import React, { useState, useEffect } from 'react';
import { CampusBin, ReportTicket } from '../types';
import { X, AlertTriangle, Send, Lock, ShieldCheck, CheckCircle2, Database } from 'lucide-react';
import { SUPABASE_PROJECT_ID } from '../lib/supabase';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  bins: CampusBin[];
  preselectedBin?: CampusBin | null;
  onSubmitReport: (ticket: Omit<ReportTicket, 'id' | 'reportedAt' | 'status'>) => string | void;
  onNavigateToAdmin?: (ticketId?: string) => void;
  isAdmin?: boolean;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  bins,
  preselectedBin,
  onSubmitReport,
  onNavigateToAdmin,
  isAdmin = false,
}) => {
  const [binId, setBinId] = useState(preselectedBin?.id || bins[0]?.id || '');
  const [issueType, setIssueType] = useState<ReportTicket['issueType']>('overflowing');
  const [details, setDetails] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedBinName, setSubmittedBinName] = useState('');
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setBinId(preselectedBin?.id || bins[0]?.id || '');
      setIsSubmitted(false);
      setCreatedTicketId(null);
    }
  }, [isOpen, preselectedBin, bins]);

  if (!isOpen) return null;

  const targetBin = bins.find((b) => b.id === binId) || preselectedBin || bins[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBin) return;

    setSubmittedBinName(targetBin.name);

    const ticketIdResult = onSubmitReport({
      binId: targetBin.id,
      binName: targetBin.name,
      locationName: targetBin.locationName,
      issueType,
      details: details.trim() || `${issueType.replace('_', ' ')} observed at this location.`,
      reportedBy: reporterName.trim() || (isAdmin ? 'SBM Administrator' : 'Campus Student'),
    });

    if (typeof ticketIdResult === 'string') {
      setCreatedTicketId(ticketIdResult);
    }

    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setDetails('');
    setReporterName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-100 overflow-hidden relative my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
                Report Dustbin Issue
              </h3>
              <p className="text-xs text-slate-500">
                Help housekeeping keep our campus 100% clean
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          /* Submission Confirmation View */
          <div className="py-6 sm:py-8 px-2 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Dispatched to Admin Dashboard
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Database className="w-3 h-3 text-emerald-600" />
                  SupaBase: {SUPABASE_PROJECT_ID}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif] mt-2">
                Report Successfully Received
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your report for <strong className="text-slate-800">{submittedBinName}</strong> has been logged to your SBM Administrator Dashboard and sent to SupaBase backend tables.
              </p>
            </div>

            <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Immediate Housekeeping Action Available</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                You can now view this ticket directly on the Admin Dashboard to dispatch a cleaning team or mark the bin emptied and resolved.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              {onNavigateToAdmin && (
                <button
                  type="button"
                  id="btn-open-admin-dashboard-to-resolve"
                  onClick={() => {
                    handleClose();
                    onNavigateToAdmin(createdTicketId || undefined);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Open Admin Dashboard to Resolve It</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Close & Return to Campus Map
              </button>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs overflow-y-auto pr-1">
            {/* Privacy Assurance Notice */}
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 text-slate-700 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-bold text-emerald-950 block">Visible Only to Admin:</span>
                <span className="text-emerald-900/80">
                  All submitted issue reports appear directly on the SBM Administrator Dashboard for housekeeping dispatch and are visible exclusively to authorized administrators.
                </span>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Select Dustbin Location:
              </label>
              <select
                value={binId}
                onChange={(e) => setBinId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              >
                {bins.map((bin) => (
                  <option key={bin.id} value={bin.id}>
                    {bin.name} ({bin.locationName} - {bin.floor})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                What is the issue?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'overflowing', label: '🗑️ Full / Overflowing' },
                  { id: 'smell', label: '🦨 Bad Odor / Flies' },
                  { id: 'wrong_waste', label: '⚠️ Mixed Waste (Dry & Wet mixed)' },
                  { id: 'damaged', label: '🛠️ Damaged Lid or Body' },
                ].map((type) => (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => setIssueType(type.id as ReportTicket['issueType'])}
                    className={`p-2.5 rounded-xl text-left font-semibold border transition-all cursor-pointer ${
                      issueType === type.id
                        ? 'border-rose-500 bg-rose-50 text-rose-900'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Additional Details / Description (Optional):
              </label>
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="e.g. Green bin is completely full near the canteen counter; cups spilling onto ground."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Your Name / Roll No. (Optional):
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="e.g. Rahul Sharma (CS 3rd Year)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Database className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Connected to SupaBase backend</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-report-to-admin"
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-md shadow-rose-600/25 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Admin & SupaBase</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
