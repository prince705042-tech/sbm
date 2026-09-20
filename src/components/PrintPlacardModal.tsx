import React from 'react';
import { CampusBin } from '../types';
import { Printer, X, ShieldCheck, QrCode } from 'lucide-react';

interface PrintPlacardModalProps {
  isOpen: boolean;
  onClose: () => void;
  bin: CampusBin | null;
}

export const PrintPlacardModal: React.FC<PrintPlacardModalProps> = ({
  isOpen,
  onClose,
  bin,
}) => {
  if (!isOpen || !bin) return null;

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Print not supported in current environment:', e);
    }
  };

  const stationCode = `NITP-SBM-${bin.id.toUpperCase().replace('BIN-', '')}`;

  return (
    <div 
      id="modal-print-placard-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-xl rounded-lg shadow-xl border border-stone-200 overflow-hidden my-auto animate-in fade-in duration-150">
        {/* Top actions bar */}
        <div className="p-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-[#134E3A]" />
            <span className="text-xs font-semibold text-stone-800 font-editorial">
              Official Station Placard &amp; Signage Generator
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1 rounded bg-[#134E3A] hover:bg-[#0F3E2E] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Signage</span>
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

        {/* Printable Placard Document Body */}
        <div className="p-5 sm:p-7 bg-[#F9F7F4] overflow-x-auto">
          <div 
            id="printable-sbm-placard"
            className="w-full bg-white border-4 border-stone-900 rounded p-5 sm:p-6 text-center shadow-2xs space-y-4 max-w-md mx-auto"
          >
            {/* Official Header */}
            <div className="border-b-2 border-stone-900 pb-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-7 h-7 rounded bg-[#134E3A] text-white flex items-center justify-center font-bold text-xs">
                  NITP
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-tight">
                    National Institute of Technology Patna
                  </h3>
                  <p className="text-[9px] text-stone-600 uppercase tracking-widest font-mono-code">
                    Swachh Bharat Mission &bull; Campus Estate Directorate
                  </p>
                </div>
              </div>
              <div className="bg-[#134E3A] text-white py-1 px-2 text-[11px] font-bold uppercase tracking-wider rounded-xs mt-2 font-mono-code">
                Source Waste Segregation Station
              </div>
            </div>

            {/* Station ID & Location */}
            <div className="bg-stone-50 border border-stone-300 p-2.5 rounded text-left">
              <div className="flex items-center justify-between text-[10px] font-mono-code text-stone-600">
                <span>STATION CODE:</span>
                <strong className="text-stone-900 text-xs">{stationCode}</strong>
              </div>
              <div className="text-xs font-bold text-stone-900 mt-1 font-editorial">
                {bin.name}
              </div>
              <div className="text-[11px] text-stone-600 mt-0.5">
                {bin.locationName} &bull; {bin.floor}
              </div>
            </div>

            {/* Dual Stream Color Instruction Blocks */}
            <div className="grid grid-cols-2 gap-2 text-left">
              {/* Green / Wet Waste */}
              <div className="p-2.5 rounded bg-[#134E3A]/10 border-2 border-[#134E3A] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-[#134E3A] font-mono-code">
                    WET / गीला
                  </span>
                  <span className="w-3 h-3 rounded-full bg-[#134E3A]"></span>
                </div>
                <div className="text-[11px] font-bold text-stone-900">
                  Organic &amp; Food Waste
                </div>
                <p className="text-[9px] text-stone-600 leading-snug">
                  Leftover food, fruit peels, tea leaves, garden leaves. No plastics.
                </p>
              </div>

              {/* Blue / Dry Waste */}
              <div className="p-2.5 rounded bg-sky-50 border-2 border-sky-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-sky-800 font-mono-code">
                    DRY / सूखा
                  </span>
                  <span className="w-3 h-3 rounded-full bg-sky-600"></span>
                </div>
                <div className="text-[11px] font-bold text-stone-900">
                  Recyclables &amp; Paper
                </div>
                <p className="text-[9px] text-stone-600 leading-snug">
                  Water bottles, paper, cardboard, clean cans &amp; wrappers.
                </p>
              </div>
            </div>

            {/* QR Code Block for Live Scanning */}
            <div className="border border-dashed border-stone-400 p-3 rounded flex items-center justify-center gap-4 bg-stone-50">
              {/* Simplified vector QR Code representation */}
              <div className="w-20 h-20 bg-white border-2 border-stone-900 p-1.5 flex flex-col justify-between shrink-0 shadow-2xs">
                <div className="flex justify-between">
                  <div className="w-4 h-4 bg-stone-900"></div>
                  <div className="w-2 h-2 bg-stone-900 self-center"></div>
                  <div className="w-4 h-4 bg-stone-900"></div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="w-6 h-6 border-2 border-stone-900 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#134E3A]"></div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 bg-stone-900"></div>
                  <div className="w-2 h-2 bg-stone-900 self-center"></div>
                  <div className="w-4 h-4 bg-stone-900"></div>
                </div>
              </div>

              <div className="text-left text-[10px] text-stone-600 space-y-0.5">
                <strong className="text-stone-900 block font-mono-code">SCAN TO REPORT OR CHECK</strong>
                <p>1. Open Swachh Campus App</p>
                <p>2. Tap Station QR Scanner</p>
                <p>3. Report overflow or check next clearance</p>
              </div>
            </div>

            {/* Civic Motto Footer */}
            <div className="border-t border-stone-300 pt-2 text-[10px] text-stone-600 font-editorial italic flex items-center justify-between">
              <span>&ldquo;स्वच्छता ही सेवा &bull; Clean Campus Initiative&rdquo;</span>
              <span className="font-mono-code text-[8px] text-stone-400">NITP-EST-2026</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Lamination Standard: A5 / Gloss Outdoor Vinyl</span>
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
