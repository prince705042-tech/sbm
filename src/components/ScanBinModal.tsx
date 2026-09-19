import React, { useState } from 'react';
import { CampusBin } from '../types';
import { 
  QrCode, 
  X, 
  Search, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation, 
  Printer, 
  Camera, 
  Trash2,
  Clock,
  Sparkles
} from 'lucide-react';

interface ScanBinModalProps {
  isOpen: boolean;
  onClose: () => void;
  bins: CampusBin[];
  onSelectBinAndShowMap: (bin: CampusBin) => void;
  onReportBin: (bin: CampusBin) => void;
  onOpenPlacardModal?: (bin: CampusBin) => void;
}

export const ScanBinModal: React.FC<ScanBinModalProps> = ({
  isOpen,
  onClose,
  bins,
  onSelectBinAndShowMap,
  onReportBin,
  onOpenPlacardModal,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedScannedBin, setSelectedScannedBin] = useState<CampusBin | null>(null);
  const [isSimulatingCamera, setIsSimulatingCamera] = useState(false);

  if (!isOpen) return null;

  // Filtered bins based on search ID or name
  const matchedBins = bins.filter((b) => {
    const q = searchInput.trim().toLowerCase();
    if (!q) return false;
    const formattedId = `nitp-${b.id}`.toLowerCase();
    return (
      b.id.toLowerCase().includes(q) ||
      formattedId.includes(q) ||
      b.name.toLowerCase().includes(q) ||
      b.locationName.toLowerCase().includes(q) ||
      b.landmark.toLowerCase().includes(q)
    );
  });

  const handleSimulateScan = (bin: CampusBin) => {
    setIsSimulatingCamera(true);
    setTimeout(() => {
      setIsSimulatingCamera(false);
      setSelectedScannedBin(bin);
    }, 600);
  };

  const currentBin = selectedScannedBin || (matchedBins.length === 1 ? matchedBins[0] : null);

  return (
    <div 
      id="modal-scan-bin-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl border border-stone-200 overflow-hidden my-auto animate-in fade-in duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-[#134E3A] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-stone-900 font-editorial">
                  Station QR &amp; Rapid Lookup
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded font-mono-code">
                  NITP
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Scan placard QR or input station ID (e.g. SAC-1, CSE, Chem)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded bg-white hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer border border-stone-200"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {/* Simulated Scanner Viewfinder */}
          <div className="relative rounded-lg overflow-hidden bg-stone-900 border border-stone-800 p-6 text-center text-stone-300">
            <div className="w-36 h-36 mx-auto relative flex items-center justify-center border-2 border-dashed border-emerald-500/80 rounded-md bg-stone-950/60">
              {/* Corner brackets */}
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-400"></div>
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-400"></div>
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-400"></div>
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-400"></div>

              {/* Animated laser line */}
              <div className="absolute left-2 right-2 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></div>

              {isSimulatingCamera ? (
                <div className="text-emerald-400 text-xs font-mono-code flex flex-col items-center gap-1">
                  <Camera className="w-6 h-6 animate-bounce" />
                  <span>Decoding QR...</span>
                </div>
              ) : (
                <div className="text-stone-400 flex flex-col items-center gap-1">
                  <QrCode className="w-8 h-8 text-stone-400 opacity-60" />
                  <span className="text-[10px] font-mono-code text-stone-400">Align Placard QR</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-stone-400 mt-3 font-mono-code">
              Point camera at any campus dustbin placard or select a quick demonstration station below.
            </p>
          </div>

          {/* Quick presets for rapid demo testing */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1.5 font-mono-code">
              Quick Demonstration Stations (Tap to Simulate Scan):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {bins.slice(0, 6).map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleSimulateScan(b)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono-code transition-colors cursor-pointer border ${
                    currentBin?.id === b.id
                      ? 'bg-[#134E3A] text-white border-[#134E3A]'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {b.name.split(' ')[0]} ({b.floor.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>

          {/* Search by station ID */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block font-mono-code">
              Or Manual Station ID / Keyword Lookup:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setSelectedScannedBin(null);
                }}
                placeholder="Search e.g. 'chem', 'sac', 'library', 'gate'..."
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-[#134E3A] focus:bg-white font-mono-code"
              />
            </div>

            {searchInput.trim() && matchedBins.length > 1 && !selectedScannedBin && (
              <div className="mt-1 border border-stone-200 rounded max-h-36 overflow-y-auto divide-y divide-stone-100 bg-white shadow-2xs">
                {matchedBins.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedScannedBin(b)}
                    className="p-2 hover:bg-stone-50 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-stone-900">{b.name}</div>
                      <div className="text-[10px] text-stone-500">{b.locationName}</div>
                    </div>
                    <span className="text-[10px] font-mono-code bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">
                      {b.fillLevel}% Full
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scanned Station Details Card */}
          {currentBin && (
            <div className="p-3.5 rounded border border-stone-300 bg-stone-50/80 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-[#134E3A] border border-emerald-200 px-1.5 py-0.2 rounded font-mono-code">
                      Station Verified
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono-code">
                      ID: NITP-{currentBin.id.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-stone-900 font-editorial mt-0.5">
                    {currentBin.name}
                  </h4>
                  <p className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#134E3A]" />
                    <span>{currentBin.locationName} &bull; {currentBin.floor}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className={`text-base font-bold font-editorial ${
                    currentBin.fillLevel >= 80 ? 'text-rose-700' : 'text-[#134E3A]'
                  }`}>
                    {currentBin.fillLevel}% Volume
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono-code block">
                    Cap: {currentBin.capacityLiters} Liters
                  </span>
                </div>
              </div>

              {/* Status & compartments */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-white border border-stone-200">
                  <span className="text-[9px] font-bold uppercase text-stone-500 block font-mono-code">Accepted Streams</span>
                  <div className="flex items-center gap-1 mt-1">
                    {currentBin.hasWet && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px]">
                        Wet (Green)
                      </span>
                    )}
                    {currentBin.hasDry && (
                      <span className="px-1.5 py-0.2 rounded bg-sky-50 text-sky-900 border border-sky-200 text-[10px]">
                        Dry (Blue)
                      </span>
                    )}
                    {currentBin.hasEwaste && (
                      <span className="px-1.5 py-0.2 rounded bg-stone-800 text-stone-100 text-[10px]">
                        E-Waste
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-2 rounded bg-white border border-stone-200">
                  <span className="text-[9px] font-bold uppercase text-stone-500 block font-mono-code">Housekeeping Log</span>
                  <div className="text-stone-800 font-medium mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-500" />
                    <span>Emptied {currentBin.lastEmptied}</span>
                  </div>
                </div>
              </div>

              {/* Landmark info */}
              <div className="p-2 rounded bg-white border border-stone-200 text-[11px] text-stone-600">
                <strong className="text-stone-800">Physical Landmark:</strong> {currentBin.landmark}
              </div>

              {/* Actions toolbar */}
              <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectBinAndShowMap(currentBin);
                  }}
                  className="px-3 py-1.5 rounded bg-[#134E3A] hover:bg-[#0F3E2E] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Highlight on Plan</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onReportBin(currentBin);
                  }}
                  className="px-2.5 py-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-medium border border-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Report Full / Issue</span>
                </button>

                {onOpenPlacardModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPlacardModal(currentBin);
                    }}
                    className="px-2.5 py-1.5 rounded bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium border border-stone-300 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Print physical signage sticker"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Placard</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span className="font-mono-code text-[11px]">
            Format Standard: SBM-NITP-IS10001
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-stone-200 hover:bg-stone-300 text-stone-800 font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
