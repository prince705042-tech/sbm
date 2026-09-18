import React, { useState, useEffect } from 'react';
import { CampusBin, ReportTicket } from '../types';
import {
  X,
  AlertTriangle,
  Send,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Radio,
  ArrowRight,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  bins: CampusBin[];
  preselectedBin?: CampusBin | null;
  onSubmitReport: (ticket: Omit<ReportTicket, 'id' | 'reportedAt' | 'status'>) => string | void;
  isAdmin?: boolean;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  bins,
  preselectedBin,
  onSubmitReport,
  isAdmin = false,
}) => {
  const [binId, setBinId] = useState(preselectedBin?.id || bins[0]?.id || '');
  const [issueType, setIssueType] = useState<ReportTicket['issueType']>('overflowing');
  const [details, setDetails] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedBinName, setSubmittedBinName] = useState('');
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setBinId(preselectedBin?.id || bins[0]?.id || '');
      setIsSubmitting(false);
      setSubmissionStep(0);
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
    setIsSubmitting(true);
    setSubmissionStep(1);

    // Call submit handler to register in App state and push to Supabase
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

    // Step 2: Uploading & database dispatch animation
    setTimeout(() => {
      setSubmissionStep(2);
    }, 650);

    // Step 3: Verified & confirmed
    setTimeout(() => {
      setSubmissionStep(3);
    }, 1300);

    // Final: Show rich celebration confirmation screen
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1850);
  };

  const handleClose = () => {
    setIsSubmitting(false);
    setIsSubmitted(false);
    setSubmissionStep(0);
    setDetails('');
    setReporterName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-100 overflow-hidden relative my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isSubmitted
                ? 'bg-emerald-100 text-emerald-600'
                : isSubmitting
                ? 'bg-amber-100 text-amber-600'
                : 'bg-rose-100 text-rose-600'
            }`}>
              {isSubmitted ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : isSubmitting ? (
                <Sparkles className="w-5 h-5 animate-spin text-amber-500" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
                {isSubmitted
                  ? 'Report Received & Confirmed'
                  : isSubmitting
                  ? 'Dispatching Campus Report...'
                  : 'Report Dustbin Issue'}
              </h3>
              <p className="text-xs text-slate-500">
                {isSubmitted
                  ? 'Housekeeping notified for clearance'
                  : isSubmitting
                  ? 'Alerting campus housekeeping crew...'
                  : 'Help housekeeping keep our campus 100% clean'}
              </p>
            </div>
          </div>
          {!isSubmitting && (
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dynamic Body: 1. In-Flight Submission Animation | 2. Confirmed Success | 3. Form */}
        <AnimatePresence mode="wait">
          {isSubmitting ? (
            /* ================= SUBMISSION ANIMATION ================= */
            <motion.div
              key="submitting-animation"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="py-10 px-4 text-center flex flex-col items-center justify-center space-y-6"
            >
              {/* Animated Radar Pulse Core */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Ripple ring 1 */}
                <motion.div
                  animate={{ scale: [1, 1.8, 2.2], opacity: [0.8, 0.3, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full bg-rose-400/25 border border-rose-400/40"
                />
                {/* Ripple ring 2 */}
                <motion.div
                  animate={{ scale: [1, 1.4, 1.7], opacity: [0.9, 0.4, 0] }}
                  transition={{ duration: 1.8, delay: 0.4, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute inset-2 rounded-full bg-emerald-400/20 border border-emerald-400/40"
                />

                {/* Central glowing icon container */}
                <motion.div
                  animate={{
                    scale: submissionStep === 3 ? [1, 1.15, 1] : [1, 1.05, 1],
                    rotate: submissionStep === 1 ? [0, -5, 5, 0] : 0,
                  }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className={`w-20 h-20 rounded-3xl shadow-xl flex items-center justify-center z-10 transition-all duration-300 ${
                    submissionStep >= 3
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                      : submissionStep === 2
                      ? 'bg-blue-600 text-white shadow-blue-600/30'
                      : 'bg-rose-600 text-white shadow-rose-600/30'
                  }`}
                >
                  {submissionStep >= 3 ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                    >
                      <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                    </motion.div>
                  ) : submissionStep === 2 ? (
                    <motion.div
                      animate={{ y: [-3, 3, -3] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                    >
                      <ShieldCheck className="w-10 h-10" />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                    >
                      <Radio className="w-10 h-10 animate-pulse" />
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Step indicator and message */}
              <div className="space-y-2 max-w-sm">
                <motion.div
                  key={submissionStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-100 text-slate-700">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {submissionStep === 1 && 'Transmitting Ticket...'}
                    {submissionStep === 2 && 'Alerting Housekeeping Crew...'}
                    {submissionStep >= 3 && 'Confirmed by Housekeeping!'}
                  </span>
                </motion.div>

                <h4 className="text-base sm:text-lg font-black text-slate-800 font-['Outfit',sans-serif]">
                  {submissionStep === 1 && `Registering issue for ${targetBin.name}`}
                  {submissionStep === 2 && `Alerting campus housekeeping crew`}
                  {submissionStep >= 3 && `Report successfully logged!`}
                </h4>

                <p className="text-xs text-slate-500">
                  {targetBin.locationName} • Floor: {targetBin.floor}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-xs bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 via-blue-500 to-emerald-500"
                  initial={{ width: '15%' }}
                  animate={{
                    width:
                      submissionStep === 1
                        ? '38%'
                        : submissionStep === 2
                        ? '78%'
                        : '100%',
                  }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Swachh Campus SBM Portal</span>
              </div>
            </motion.div>
          ) : isSubmitted ? (
            /* ================= SUBMISSION CONFIRMATION VIEW ================= */
            <motion.div
              key="submitted-confirmation"
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="py-5 sm:py-7 px-2 text-center space-y-4"
            >
              {/* Celebration badge with floating stars */}
              <div className="relative inline-block mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                  className="w-16 h-16 rounded-3xl bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/30"
                >
                  <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                </motion.div>

                {/* Micro floating sparkle tags */}
                <motion.div
                  initial={{ opacity: 0, scale: 0, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="absolute -top-1 -right-3 bg-amber-400 text-slate-900 rounded-full p-1 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </motion.div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    Report Confirmed
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Saved Successfully
                  </span>
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 font-['Outfit',sans-serif] mt-2">
                  Thank You for Your Report!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Your report for <strong className="text-slate-800">{submittedBinName}</strong> has been received. Campus housekeeping staff have been notified to address this bin.
                </p>
                {createdTicketId && (
                  <p className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 inline-block px-2.5 py-0.5 rounded-md">
                    Ticket ID: #{createdTicketId}
                  </p>
                )}
              </div>

              <div className="pt-3 flex items-center justify-center">
                <button
                  type="button"
                  id="btn-close-report-modal"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Done & Return to Campus Map</span>
                </button>
              </div>
            </motion.div>
          ) : (
            /* ================= SUBMISSION FORM ================= */
            <motion.form
              key="submit-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="mt-4 space-y-4 text-xs overflow-y-auto pr-1"
            >
              {/* Privacy Assurance Notice */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 text-slate-700 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold text-emerald-950 block">Visible Only to Admin:</span>
                  <span className="text-emerald-900/80">
                    All submitted issue reports appear directly on the SBM Administrator Dashboard for housekeeping dispatch and are stored in your SupaBase tables.
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
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Immediate Housekeeping Dispatch</span>
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
                    className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-md shadow-rose-600/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95 group"
                  >
                    <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    <span>Submit Report</span>
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

