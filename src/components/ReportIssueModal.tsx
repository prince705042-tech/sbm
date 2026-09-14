import React, { useState } from 'react';
import { CampusBin, ReportTicket } from '../types';
import { X, AlertTriangle, Send } from 'lucide-react';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  bins: CampusBin[];
  preselectedBin?: CampusBin | null;
  onSubmitReport: (ticket: Omit<ReportTicket, 'id' | 'reportedAt' | 'status'>) => void;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  bins,
  preselectedBin,
  onSubmitReport,
}) => {
  const [binId, setBinId] = useState(preselectedBin?.id || bins[0]?.id || '');
  const [issueType, setIssueType] = useState<ReportTicket['issueType']>('overflowing');
  const [details, setDetails] = useState('');
  const [reporterName, setReporterName] = useState('');

  if (!isOpen) return null;

  const targetBin = bins.find((b) => b.id === binId) || preselectedBin || bins[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBin) return;

    onSubmitReport({
      binId: targetBin.id,
      binName: targetBin.name,
      locationName: targetBin.locationName,
      issueType,
      details: details.trim() || `${issueType.replace('_', ' ')} observed at this location.`,
      reportedBy: reporterName.trim() || 'Campus Student',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
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
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
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
                  className={`p-2.5 rounded-xl text-left font-semibold border transition-all ${
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

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/25 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
