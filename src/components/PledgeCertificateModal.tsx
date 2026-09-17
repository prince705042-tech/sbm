import React, { useState } from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  Printer, 
  Share2, 
  Sparkles, 
  Check, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface PledgeCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  pledgeName: string;
  pledgeDept: string;
  pledgeDate: string;
  onResetPledge: () => void;
}

export const PledgeCertificateModal: React.FC<PledgeCertificateModalProps> = ({
  isOpen,
  onClose,
  pledgeName,
  pledgeDept,
  pledgeDate,
  onResetPledge,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const text = `🌿 I have taken the official Swachh Campus Pledge under Swachh Bharat Abhiyan at NIT Patna!\n\n"I pledge to never litter and always segregate waste into Dry (Blue) & Wet (Green) dustbins to keep our campus clean and green."\n\n— ${pledgeName || 'Campus Citizen'} (${pledgeDept || 'NIT Patna'})`;
    
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // fallback
      }
    }
  };

  const certificateId = `SBM-NITP-${(pledgeDate ? pledgeDate.replace(/-/g, '') : '2026')}-#${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Top actions bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800">
              Swachhata Green Citizen Certificate
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1 text-xs font-bold transition-all cursor-pointer"
              title="Print Certificate"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1 text-xs font-bold transition-all cursor-pointer"
              title="Share Pledge"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="p-6 sm:p-8 bg-amber-50/40 relative">
          {/* Ornate border frame */}
          <div className="border-4 border-double border-emerald-700/60 rounded-2xl p-6 sm:p-8 bg-white/95 text-center relative shadow-sm">
            {/* Corner flourishes */}
            <div className="absolute top-2 left-2 text-emerald-700 text-xs select-none">✦</div>
            <div className="absolute top-2 right-2 text-emerald-700 text-xs select-none">✦</div>
            <div className="absolute bottom-2 left-2 text-emerald-700 text-xs select-none">✦</div>
            <div className="absolute bottom-2 right-2 text-emerald-700 text-xs select-none">✦</div>

            {/* National emblem & SBM branding */}
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                Swachh Bharat Abhiyan • Campus Chapter
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif] tracking-tight mt-0.5">
                Certificate of Swachhata Commitment
              </h2>
              <div className="text-[11px] font-bold text-amber-700 mt-0.5">
                "एक कदम स्वच्छता की ओर"
              </div>
            </div>

            {/* Recipient details */}
            <div className="my-5 space-y-1.5 border-y border-slate-200/70 py-4">
              <p className="text-xs text-slate-500 italic">This is proudly presented to</p>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif tracking-wide underline decoration-emerald-500/40 decoration-2 underline-offset-4">
                {pledgeName || 'Campus Citizen'}
              </h3>
              <p className="text-xs font-bold text-slate-700">
                {pledgeDept || 'National Institute of Technology Patna'}
              </p>
            </div>

            {/* Pledge statement */}
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed italic">
              "For voluntarily taking the official Swachh Campus Pledge to maintain exemplary source waste segregation, eliminate single-use litter, and uphold 2-bin segregation discipline across all academic, hostel, and sports premises."
            </p>

            {/* Signatures & Seal Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-left text-[10px] text-slate-500">
              <div>
                <span className="font-bold text-slate-700 block">Date Verified:</span>
                <span>{pledgeDate || new Date().toLocaleDateString('en-IN')}</span>
                <span className="block text-[9px] text-slate-400 font-mono mt-0.5">
                  ID: {certificateId}
                </span>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-emerald-600 flex items-center justify-center mx-auto text-emerald-700 font-bold text-[8px] uppercase rotate-12">
                  Verified
                </div>
              </div>

              <div className="text-right">
                <div className="font-serif italic text-slate-800 text-xs font-bold">
                  S. K. Verma
                </div>
                <div className="h-0.5 w-20 bg-slate-300 ml-auto my-0.5" />
                <span className="font-bold text-slate-700 block">Campus Sanitation Officer</span>
                <span>Swachh Campus Committee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('Do you want to reset your pledge status?')) {
                onResetPledge();
                onClose();
              }
            }}
            className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Retake / Reset Pledge</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
