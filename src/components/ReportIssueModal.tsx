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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-stone-900/60"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 bg-white rounded-lg max-w-lg w-full p-5 sm:p-6 shadow-xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded flex items-center justify-center transition-colors border ${
              isSubmitted
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : isSubmitting
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {isSubmitted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              ) : isSubmitting ? (
                <Sparkles className="w-4 h-4 animate-spin text-amber-700" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-700" />
              )}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 font-editorial">
                {isSubmitted
                  ? 'Maintenance Ticket Registered'
                  : isSubmitting
                  ? 'Dispatching Maintenance Alert...'
                  : 'Submit Sanitation Ticket'}
              </h3>
              <p className="text-xs text-stone-500">
                {isSubmitted
                  ? 'Housekeeping supervisor alerted for resolution'
                  : isSubmitting
                  ? 'Routing notification to estate team...'
                  : 'Official campus hygiene & waste station report'}
              </p>
            </div>
          </div>
          {!isSubmitting && (
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded bg-stone-100 text-stone-500 hover:text-stone-900 hover:bg-stone-200 flex items-center justify-center cursor-pointer transition-colors border border-stone-200"
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="py-10 px-4 text-center flex flex-col items-center justify-center space-y-5"
            >
              <div className="w-16 h-16 rounded-lg bg-stone-100 border border-stone-300 text-stone-800 flex items-center justify-center">
                {submissionStep >= 3 ? (
                  <CheckCircle2 className="w-8 h-8 text-[#134E3A]" />
                ) : (
                  <Radio className="w-8 h-8 text-amber-600 animate-pulse" />
                )}
              </div>

              {/* Step indicator and message */}
              <div className="space-y-1.5 max-w-sm">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-stone-100 text-stone-700 font-mono-code border border-stone-200">
                  {submissionStep === 1 && 'Step 1: Logging Ticket'}
                  {submissionStep === 2 && 'Step 2: Dispatching Crew Alert'}
                  {submissionStep >= 3 && 'Step 3: Acknowledged'}
                </span>

                <h4 className="text-base font-bold text-stone-900 font-editorial">
                  {submissionStep === 1 && `Registering ticket for ${targetBin.name}`}
                  {submissionStep === 2 && `Alerting campus housekeeping crew`}
                  {submissionStep >= 3 && `Ticket recorded successfully`}
                </h4>

                <p className="text-xs text-stone-500">
                  {targetBin.locationName} &bull; Floor: {targetBin.floor}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-xs bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
                <motion.div
                  className="h-full bg-[#134E3A]"
                  initial={{ width: '20%' }}
                  animate={{
                    width:
                      submissionStep === 1
                        ? '45%'
                        : submissionStep === 2
                        ? '80%'
                        : '100%',
                  }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono-code">
                <ShieldCheck className="w-3.5 h-3.5 text-[#134E3A]" />
                <span>NIT Patna Sanitation Dispatch Network</span>
              </div>
            </motion.div>
          ) : isSubmitted ? (
            /* ================= SUBMISSION CONFIRMATION VIEW ================= */
            <motion.div
              key="submitted-confirmation"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="py-6 px-2 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-200 text-[#134E3A] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-900 border border-emerald-200 font-mono-code">
                    <CheckCircle2 className="w-3 h-3 text-[#134E3A]" />
                    Ticket Registered
                  </span>
                </div>
                <h4 className="text-xl font-bold text-stone-900 font-editorial mt-2">
                  Thank You for Your Report
                </h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                  Your report for <strong className="text-stone-800">{submittedBinName}</strong> has been assigned to the estate office housekeeping queue for resolution.
                </p>
                {createdTicketId && (
                  <p className="text-xs font-mono-code text-stone-600 bg-stone-100 inline-block px-2.5 py-1 rounded border border-stone-200">
                    Ticket ID: #{createdTicketId}
                  </p>
                )}
              </div>

              <div className="pt-3 flex items-center justify-center">
                <button
                  type="button"
                  id="btn-close-report-modal"
                  onClick={handleClose}
                  className="px-5 py-2 rounded bg-[#134E3A] hover:bg-[#0F3E2E] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Return to Campus Map</span>
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
              className="mt-4 space-y-3.5 text-xs overflow-y-auto pr-1"
            >
              {/* Privacy Assurance Notice */}
              <div className="p-3 rounded bg-stone-50 border border-stone-200 text-stone-700 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-semibold text-stone-900 block">Estate Office &amp; SBM Dispatch:</span>
                  <span className="text-stone-600">
                    Submitted tickets are logged directly into the administrative housekeeping queue and synchronized with the cloud database.
                  </span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Target Dustbin Station:
                </label>
                <select
                  value={binId}
                  onChange={(e) => setBinId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-xs font-medium text-stone-900 focus:outline-hidden focus:border-[#134E3A] focus:bg-white transition-colors"
                >
                  {bins.map((bin) => (
                    <option key={bin.id} value={bin.id}>
                      {bin.name} ({bin.locationName} &bull; {bin.floor})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Observed Condition:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'overflowing', label: 'Full / Overflowing' },
                    { id: 'smell', label: 'Odor / Hygiene Issue' },
                    { id: 'wrong_waste', label: 'Improper Waste Segregation' },
                    { id: 'damaged', label: 'Damaged Station / Lid' },
                  ].map((type) => (
                    <button
                      type="button"
                      key={type.id}
                      onClick={() => setIssueType(type.id as ReportTicket['issueType'])}
                      className={`p-2.5 rounded text-left font-medium border transition-colors cursor-pointer text-xs ${
                        issueType === type.id
                          ? 'border-[#134E3A] bg-emerald-50/50 text-stone-900 font-semibold'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Specific Observations (Optional):
                </label>
                <textarea
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. Wet compartment is full near the canteen counter; waste spilling onto floor."
                  className="w-full bg-stone-50 border border-stone-200 rounded p-2.5 text-xs font-medium text-stone-900 focus:outline-hidden focus:border-[#134E3A] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Reporter Name / Department (Optional):
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. Rahul Sharma (Civil Engineering)"
                  className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 text-xs font-medium text-stone-900 focus:outline-hidden focus:border-[#134E3A] focus:bg-white transition-colors"
                />
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100">
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono-code">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#134E3A] shrink-0" />
                  <span>Immediate Housekeeping Dispatch</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-3.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-submit-report-to-admin"
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-[#134E3A] hover:bg-[#0F3E2E] rounded shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Ticket</span>
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

