import React, { useState } from 'react';
import { 
  X, 
  Award, 
  Printer, 
  Share2, 
  Check, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  QrCode
} from 'lucide-react';
import { motion } from 'motion/react';

interface PledgeCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  pledgeName: string;
  pledgeDept: string;
  pledgeDate: string;
  onResetPledge: () => void;
  currentLang?: 'en' | 'hi';
}

export const PledgeCertificateModal: React.FC<PledgeCertificateModalProps> = ({
  isOpen,
  onClose,
  pledgeName,
  pledgeDept,
  pledgeDate,
  onResetPledge,
  currentLang = 'en',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Print not supported:', e);
    }
  };

  const handleShare = async () => {
    const text = `🇮🇳 I have taken the official Swachhata Pledge under Swachh Bharat Mission!\n\n"I pledge to never litter and always segregate waste into Dry (Blue) & Wet (Green) dustbins to keep our campus 100% clean and green."\n\n— ${pledgeName || 'Campus Citizen'} (${pledgeDept || 'NIT Patna'})\n#SwachhBharatMission #CleanCampus`;
    
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {}
    }
  };

  const certificateId = `SBM-NITP-${(pledgeDate ? pledgeDate.replace(/-/g, '') : '2026')}-${Math.floor(10000 + Math.random() * 90000)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/75 backdrop-blur-xs"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.22 }}
        className="relative z-10 bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-stone-300 overflow-hidden my-auto"
      >
        {/* Top Actions Ribbon */}
        <div className="p-3.5 bg-[#0A2540] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold font-editorial">
              {currentLang === 'hi' ? 'स्वच्छ भारत मिशन — आधिकारिक प्रमाण पत्र' : 'Swachh Bharat Mission Certification'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 text-white flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer"
              title="Print Certificate"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 text-white flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer"
              title="Share on Social Media"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-stone-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Display Canvas */}
        <div className="p-4 sm:p-7 bg-[#FFFDF9] relative">
          {/* Certificate Ornate Double Frame */}
          <div className="border-4 border-[#0A2540] rounded-lg p-5 sm:p-8 bg-white text-center relative shadow-sm">
            {/* Corner Decorative Elements */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#FF671F]" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#FF671F]" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#046A38]" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#046A38]" />

            {/* National Emblem & SBM Urban Header */}
            <div className="flex flex-col items-center justify-center mb-3">
              {/* Ashoka Lion Capital SVG */}
              <div className="w-8 h-9 text-stone-800 mb-1">
                <svg viewBox="0 0 40 48" fill="currentColor" className="w-full h-full">
                  <path d="M20 2c-1.5 0-3 1.2-3 2.7 0 1 .5 1.8 1.3 2.3-.8.4-1.5 1.1-1.9 2-.5-.3-1.1-.5-1.7-.5-1.5 0-2.8 1.2-2.8 2.7 0 1.2.8 2.2 1.9 2.5-.2.6-.3 1.2-.3 1.9 0 2.2 1.4 4 3.3 4.7-.2.6-.3 1.2-.3 1.9 0 1.4.5 2.6 1.4 3.5-1.2.6-2.1 1.8-2.3 3.3-.2 1.3.4 2.5 1.4 3.3-1.5.8-2.6 2.3-2.8 4.2h15.6c-.2-1.9-1.3-3.4-2.8-4.2 1-.8 1.6-2 1.4-3.3-.2-1.5-1.1-2.7-2.3-3.3.9-.9 1.4-2.1 1.4-3.5 0-.7-.1-1.3-.3-1.9 1.9-.7 3.3-2.5 3.3-4.7 0-.7-.1-1.3-.3-1.9 1.1-.3 1.9-1.3 1.9-2.5 0-1.5-1.3-2.7-2.8-2.7-.6 0-1.2.2-1.7.5-.4-.9-1.1-1.6-1.9-2 .8-.5 1.3-1.3 1.3-2.3C23 3.2 21.5 2 20 2zM15 42h10v2H15v-2zm-2 3h14v1.5H13V45z"/>
                </svg>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700">
                {currentLang === 'hi' ? 'भारत सरकार | आवासन और शहरी कार्य मंत्रालय' : 'Government of India | Ministry of Housing and Urban Affairs'}
              </span>

              {/* SBM Gandhi Chashma Logo */}
              <div className="flex items-center my-1.5">
                <div className="w-8 h-8 rounded-full border-2 border-stone-800 flex items-center justify-center font-bold text-[10px] text-stone-900 bg-white">
                  स्वच्छ
                </div>
                <div className="w-3 h-1 flex flex-col justify-between -mx-0.5">
                  <div className="h-0.5 bg-[#FF671F] w-full" />
                  <div className="h-0.5 bg-[#046A38] w-full" />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-stone-800 flex items-center justify-center font-bold text-[10px] text-stone-900 bg-white">
                  भारत
                </div>
              </div>

              <h2 className="text-lg sm:text-2xl font-bold text-[#0A2540] font-editorial tracking-tight">
                {currentLang === 'hi' ? 'स्वच्छता प्रतिज्ञा प्रमाण पत्र' : 'Swachhata Pledge Certificate'}
              </h2>
              <span className="text-[10px] font-semibold text-[#046A38] uppercase tracking-wider font-mono-code">
                Swachh Bharat Mission &bull; Clean Campus Initiative
              </span>
            </div>

            {/* Recipient Details */}
            <div className="my-3 py-2.5 border-y border-stone-200 bg-stone-50/60 rounded">
              <p className="text-[10px] text-stone-500 uppercase tracking-widest font-mono-code">
                {currentLang === 'hi' ? 'यह आधिकारिक प्रमाण पत्र प्रदान किया जाता है' : 'This is proudly conferred upon'}
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-editorial mt-0.5">
                {pledgeName || 'Campus Citizen'}
              </h3>
              <p className="text-xs text-stone-600 font-medium">
                {pledgeDept || 'National Institute of Technology Patna'}
              </p>
            </div>

            {/* Formal Pledge Statement */}
            <p className="text-xs text-stone-700 max-w-lg mx-auto leading-relaxed italic font-serif">
              {currentLang === 'hi' ? (
                <>
                  &ldquo;परिसर को स्वच्छ, हरा-भरा एवं कचरा मुक्त बनाए रखने हेतु १००% कचरा पृथक्करण (गीले कचरे हेतु हरा डस्टबिन, सूखे कचरे हेतु नीला डस्टबिन) करने तथा स्वच्छता के प्रति निरंतर जागरूक रहने की औपचारिक शपथ लेने के उपलक्ष्य में।&rdquo;
                </>
              ) : (
                <>
                  &ldquo;In recognition of solemnly adopting the Swachh Campus Pledge under Swachh Bharat Mission, committing to 100% source segregation into Green (Wet) and Blue (Dry) receptacles, eliminating single-use plastics, and upholding national sanitation standards.&rdquo;
                </>
              )}
            </p>

            {/* Signatures & Verification Seal */}
            <div className="mt-6 pt-3 border-t border-stone-200 flex items-center justify-between text-left text-[10px] text-stone-600">
              {/* Verification Info */}
              <div>
                <span className="font-bold text-stone-900 block font-mono-code">Registration ID:</span>
                <span className="font-mono-code text-[9px] text-stone-600">{certificateId}</span>
                <span className="block text-[9px] text-stone-500 font-mono-code mt-0.5">
                  Date: {pledgeDate || new Date().toLocaleDateString('en-IN')}
                </span>
              </div>

              {/* SBM Emblem Seal */}
              <div className="text-center hidden sm:block">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#046A38] flex flex-col items-center justify-center mx-auto text-[#046A38] font-bold text-[7px] uppercase tracking-tighter bg-emerald-50/50">
                  <span>SBM</span>
                  <span className="font-mono-code text-[6px]">MoHUA VERIFIED</span>
                </div>
              </div>

              {/* Official Signature */}
              <div className="text-right">
                <div className="h-px w-24 bg-stone-400 ml-auto my-2" />
                <span className="font-bold text-stone-800 block">Nodal Sanitation Officer</span>
                <span className="text-[9px] text-stone-500">SBM Cell &bull; NIT Patna</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onResetPledge();
              onClose();
            }}
            className="text-xs font-medium text-stone-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Name</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0A2540] hover:bg-[#071A2E] text-white font-semibold text-xs shadow-xs cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
