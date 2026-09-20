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
    try {
      window.print();
    } catch (e) {
      console.warn('Print not supported in current window or frame:', e);
    }
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
      className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-xl rounded-lg shadow-xl border border-stone-200 overflow-hidden my-auto animate-in fade-in duration-150">
        {/* Top actions bar */}
        <div className="p-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#134E3A]" />
            <span className="text-xs font-semibold text-stone-800 font-editorial">
              Institutional Swachhata Certification
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 rounded bg-white border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-100 flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer"
              title="Print Certificate"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleShare}
              className="px-2.5 py-1 rounded bg-white border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-100 flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer"
              title="Share Pledge"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#134E3A]" />
                  <span className="text-[#134E3A] font-semibold">Copied</span>
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
              className="w-7 h-7 rounded bg-white hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer border border-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="p-5 sm:p-7 bg-[#F9F7F4] relative">
          {/* Ornate border frame */}
          <div className="border-2 border-stone-300 rounded p-6 sm:p-8 bg-white text-center relative shadow-2xs">
            {/* National emblem & SBM branding */}
            <div className="flex flex-col items-center justify-center mb-3">
              <div className="w-10 h-10 rounded bg-[#134E3A] text-white flex items-center justify-center shadow-2xs mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#134E3A] font-mono-code">
                National Institute of Technology Patna &bull; Swachh Bharat Cell
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-editorial tracking-tight mt-1">
                Certificate of Environmental Commitment
              </h2>
              <div className="text-[11px] font-medium text-stone-500 mt-0.5 font-editorial italic">
                &ldquo;एक कदम स्वच्छता की ओर &bull; Cleanliness is Service&rdquo;
              </div>
            </div>

            {/* Recipient details */}
            <div className="my-4 space-y-1 border-y border-stone-200 py-3">
              <p className="text-[11px] text-stone-500 uppercase tracking-wider font-mono-code">This official commendation is conferred upon</p>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-950 font-editorial">
                {pledgeName || 'Campus Citizen'}
              </h3>
              <p className="text-xs text-stone-600 font-medium">
                {pledgeDept || 'Department of Technical Education, NIT Patna'}
              </p>
            </div>

            {/* Pledge statement */}
            <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed italic font-serif">
              &ldquo;For formally adopting the Swachh Campus Pledge, committing to rigorous source waste segregation into Wet (Green) and Dry (Blue) receptacles, mitigating non-biodegradable waste, and maintaining campus hygiene.&rdquo;
            </p>

            {/* Signatures & Seal Footer */}
            <div className="mt-5 pt-3 border-t border-stone-200 flex items-center justify-between text-left text-[10px] text-stone-500">
              <div>
                <span className="font-semibold text-stone-800 block font-mono-code">Verification Date:</span>
                <span>{pledgeDate || new Date().toLocaleDateString('en-IN')}</span>
                <span className="block text-[9px] text-stone-500 font-mono-code mt-0.5">
                  ID: {certificateId}
                </span>
              </div>

              <div className="text-center">
                <div className="w-11 h-11 rounded-full border border-dashed border-[#134E3A] flex flex-col items-center justify-center mx-auto text-[#134E3A] font-bold text-[7px] uppercase tracking-tighter">
                  <span>NITP</span>
                  <span className="font-mono-code text-[6px]">SBM CELL</span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-editorial italic text-stone-900 text-xs font-bold">
                  S. K. Verma
                </div>
                <div className="h-px w-20 bg-stone-300 ml-auto my-0.5" />
                <span className="font-semibold text-stone-800 block">Nodal Sanitation Officer</span>
                <span>Campus Estate Committee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onResetPledge();
              onClose();
            }}
            className="text-xs font-medium text-stone-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Pledge Record</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#134E3A] hover:bg-[#0F3E2E] text-white font-semibold text-xs shadow-2xs cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
