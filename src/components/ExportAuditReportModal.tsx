import React from 'react';
import { CampusBin, ReportTicket } from '../types';
import { Printer, X, FileText, Download, ShieldCheck } from 'lucide-react';

interface ExportAuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bins: CampusBin[];
  tickets: ReportTicket[];
}

export const ExportAuditReportModal: React.FC<ExportAuditReportModalProps> = ({
  isOpen,
  onClose,
  bins,
  tickets,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const totalBins = bins.length;
  const alertBins = bins.filter((b) => b.fillLevel >= 80);
  const pendingTickets = tickets.filter((t) => t.status === 'pending');
  const dispatchedTickets = tickets.filter((t) => t.status === 'cleaning_dispatched');
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved');

  return (
    <div 
      id="modal-export-audit-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl border border-stone-200 overflow-hidden my-auto animate-in fade-in duration-150">
        {/* Modal Top Actions */}
        <div className="p-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#134E3A]" />
            <span className="text-xs font-semibold text-stone-800 font-editorial">
              Official Campus Sanitation &amp; SBM Audit Inspection Report
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1 rounded bg-[#134E3A] hover:bg-[#0F3E2E] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded bg-white hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer border border-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audit Document Body */}
        <div className="p-6 sm:p-8 bg-[#FAF8F5] overflow-x-auto max-h-[80vh] overflow-y-auto text-stone-900 text-xs">
          <div className="bg-white p-6 sm:p-8 border border-stone-300 rounded shadow-xs space-y-6">
            {/* Official Letterhead */}
            <div className="border-b-2 border-stone-900 pb-4 text-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono-code mb-1">
                Ministry of Education &bull; Government of India
              </div>
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-tight text-stone-900 font-editorial">
                National Institute of Technology Patna
              </h2>
              <p className="text-xs text-stone-600">
                Ashok Rajpath, Mahendru, Patna, Bihar — 800005
              </p>
              <div className="mt-2 inline-block bg-[#134E3A] text-white px-3 py-0.5 rounded-xs text-[11px] font-bold uppercase tracking-wider font-mono-code">
                Daily Swachh Bharat Mission Sanitation Audit Docket
              </div>
            </div>

            {/* Audit Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] p-3 rounded bg-stone-50 border border-stone-200 font-mono-code">
              <div>
                <span className="text-stone-500 block text-[9px] uppercase">Audit Date:</span>
                <strong>{todayStr}</strong>
              </div>
              <div>
                <span className="text-stone-500 block text-[9px] uppercase">Inspection Standard:</span>
                <strong>IS:10001 (SBM-U)</strong>
              </div>
              <div>
                <span className="text-stone-500 block text-[9px] uppercase">Campus Territory:</span>
                <strong>Main Campus (Ashok Rajpath)</strong>
              </div>
              <div>
                <span className="text-stone-500 block text-[9px] uppercase">Supervisory Unit:</span>
                <strong>Estate Sanitation Directorate</strong>
              </div>
            </div>

            {/* Executive Summary Metrics */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-2 font-mono-code border-b border-stone-200 pb-1">
                1. Executive Infrastructure &amp; Hygiene Metrics
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded border border-stone-200 text-center">
                  <span className="text-[10px] text-stone-500 block font-mono-code">Total Stations Mapped</span>
                  <div className="text-lg font-bold text-stone-900 font-editorial">{totalBins}</div>
                </div>
                <div className="p-2.5 rounded border border-stone-200 text-center">
                  <span className="text-[10px] text-stone-500 block font-mono-code">Attention / Alert Bins</span>
                  <div className="text-lg font-bold text-rose-700 font-editorial">{alertBins.length}</div>
                </div>
                <div className="p-2.5 rounded border border-stone-200 text-center">
                  <span className="text-[10px] text-stone-500 block font-mono-code">Resolved Tickets</span>
                  <div className="text-lg font-bold text-[#134E3A] font-editorial">{resolvedTickets.length}</div>
                </div>
                <div className="p-2.5 rounded border border-stone-200 text-center">
                  <span className="text-[10px] text-stone-500 block font-mono-code">Campus Sanitation Index</span>
                  <div className="text-lg font-bold text-emerald-800 font-editorial">94.8% (Grade A+)</div>
                </div>
              </div>
            </div>

            {/* Active Incident Log Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-2 font-mono-code border-b border-stone-200 pb-1">
                2. Active Maintenance &amp; Clearance Queue ({tickets.length} Total Logged)
              </h4>
              <table className="w-full text-left text-[10px] font-mono-code border border-stone-200 divide-y divide-stone-200">
                <thead className="bg-stone-100 text-stone-700">
                  <tr>
                    <th className="p-2">Docket ID</th>
                    <th className="p-2">Station Location</th>
                    <th className="p-2">Anomaly Type</th>
                    <th className="p-2">Reported By</th>
                    <th className="p-2">Resolution Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {tickets.slice(0, 8).map((t) => (
                    <tr key={t.id} className="hover:bg-stone-50">
                      <td className="p-2 font-bold">{t.id}</td>
                      <td className="p-2">{t.binName}</td>
                      <td className="p-2 uppercase">{t.issueType}</td>
                      <td className="p-2 text-stone-600">{t.reportedBy}</td>
                      <td className="p-2 font-semibold">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] ${
                          t.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                            : t.status === 'cleaning_dispatched'
                            ? 'bg-sky-50 text-sky-900 border border-sky-200'
                            : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}>
                          {t.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {tickets.length > 8 && (
                <p className="text-[9px] text-stone-500 mt-1 font-mono-code">
                  Showing 8 of {tickets.length} total tickets. Full records maintained in central PostgreSQL repository.
                </p>
              )}
            </div>

            {/* Official Signatory Blocks */}
            <div className="pt-6 border-t border-stone-300 grid grid-cols-2 gap-8 text-[10px] text-stone-700">
              <div className="space-y-10">
                <div className="border-b border-stone-400 w-48"></div>
                <div>
                  <strong>Superintendent of Housekeeping</strong>
                  <div className="text-stone-500">Sanitation Directorate, NIT Patna</div>
                </div>
              </div>

              <div className="space-y-10 text-right">
                <div className="border-b border-stone-400 w-48 ml-auto"></div>
                <div>
                  <strong>Dean (Planning &amp; Development) / Nodal Officer</strong>
                  <div className="text-stone-500">Swachh Bharat Abhiyan, NIT Patna</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span className="font-mono-code text-[11px]">
            NITP-SBM-AUDIT-DOCKET-2026
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded bg-stone-200 hover:bg-stone-300 text-stone-800 font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
