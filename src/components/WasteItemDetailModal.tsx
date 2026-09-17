import React from 'react';
import { WasteItem, CampusBin } from '../types';
import { 
  X, 
  Leaf, 
  Recycle, 
  Zap, 
  AlertTriangle, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface WasteItemDetailModalProps {
  item: WasteItem | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToFinder?: (wasteType?: string) => void;
  onNavigateToMap?: (binId?: string) => void;
  onOpenReportModal?: () => void;
  bins?: CampusBin[];
}

export const WasteItemDetailModal: React.FC<WasteItemDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onNavigateToFinder,
  onNavigateToMap,
  onOpenReportModal,
  bins = [],
}) => {
  if (!isOpen || !item) return null;

  // Matching bin icon and colors
  const getBinMeta = () => {
    switch (item.binColor) {
      case 'green':
        return {
          icon: <Leaf className="w-5 h-5 text-emerald-600" />,
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-300',
          textColor: 'text-emerald-950',
          badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          label: 'Wet Waste (Green Dustbin)',
          decomp: '2 to 4 weeks (Rapid Composting)',
          process: 'Processed at campus vermicomposting pit for university botanical gardens.',
          dos: [
            'Drain excess gravies or water before throwing into green bin.',
            'Remove any plastic wraps, toothpicks, or foil first.',
            'Shake food clean from plates before washing trays.',
          ],
          donts: [
            'Never dispose plastic bags, pouches, or thermocol in green bins.',
            'Do not throw medicine tablets or chemical liquids here.',
          ],
        };
      case 'blue':
        return {
          icon: <Recycle className="w-5 h-5 text-sky-600" />,
          bgColor: 'bg-sky-50',
          borderColor: 'border-sky-300',
          textColor: 'text-sky-950',
          badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
          label: 'Dry Waste (Blue Dustbin)',
          decomp: item.name.toLowerCase().includes('plastic')
            ? '450+ years (Non-biodegradable)'
            : item.name.toLowerCase().includes('aluminum')
            ? '200+ years (100% Recyclable)'
            : '2 to 6 months (Recyclable paper pulp)',
          process: 'Sorted, baled, and transferred to Patna Municipal Corporation recycling units.',
          dos: [
            'Ensure the item is completely empty and dry.',
            'Crush plastic bottles and flatten courier boxes to save bin space.',
            'Tear off greasy cardboard sections before depositing papers.',
          ],
          donts: [
            'Do not throw food scraps or wet soup residue into blue bins.',
            'Avoid tossing batteries or electrical wires here.',
          ],
        };
      case 'black':
        return {
          icon: <Zap className="w-5 h-5 text-amber-500" />,
          bgColor: 'bg-slate-900',
          borderColor: 'border-amber-400/40',
          textColor: 'text-white',
          badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
          label: 'E-Waste Drop Bin (IT Wing / Lab)',
          decomp: 'Indefinite (Hazardous Heavy Metals)',
          process: 'Collected by authorized e-waste dismantling and rare-earth recovery agencies.',
          dos: [
            'Tape battery terminals with cellotape to prevent accidental short circuits.',
            'Keep cables and adapters bundled together.',
            'Drop inside the designated e-waste drop station in Computer Science & IT Block.',
          ],
          donts: [
            'Never dispose batteries in general green or blue dustbins.',
            'Do not crush or puncture battery casings.',
          ],
        };
      case 'red':
      default:
        return {
          icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-300',
          textColor: 'text-rose-950',
          badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
          label: 'Hazardous / Medical Disposal (Red Bin)',
          decomp: 'Persistent / Biohazard Risks',
          process: 'Sterilized and incinerated safely under Biomedical Waste Management Rules.',
          dos: [
            'Wrap sanitary napkins or bandages tightly in newspaper or paper bags.',
            'Mark wrapped packets with a red ink "X" for sanitation worker safety.',
            'Deposit at the Campus Health Centre or designated red disposal bins.',
          ],
          donts: [
            'Never flush sanitary pads into hostel toilet plumbing.',
            'Never mix medical sharps with common cafeteria trash.',
          ],
        };
    }
  };

  const meta = getBinMeta();

  // Find campus bins that accept this waste
  const relevantBins = bins.filter((b) => {
    if (item.category === 'wet') return b.hasWet;
    if (item.category === 'dry') return b.hasDry;
    if (item.category === 'e-waste') return b.hasEwaste;
    return false;
  });

  return (
    <div 
      id="modal-waste-detail-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header with bin color theme */}
        <div className={`p-5 sm:p-6 ${meta.bgColor} border-b ${meta.borderColor} flex items-start justify-between relative`}>
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-200/60">
              {meta.icon}
            </div>
            <div>
              <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border mb-1.5 ${meta.badgeColor}`}>
                {meta.label}
              </span>
              <h3 className={`text-lg sm:text-xl font-black font-['Outfit',sans-serif] leading-tight ${meta.textColor}`}>
                {item.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Quick specs grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Recyclability
              </span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                {item.recyclable ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Recyclable</span>
                  </>
                ) : (
                  <>
                    <X className="w-3.5 h-3.5 text-rose-500" />
                    <span>Non-recyclable</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Biodegradability
              </span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                {item.biodegradable ? (
                  <>
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Biodegradable</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Non-biodegradable</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Description & Tip */}
          <div className="space-y-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-700 block">Description:</span>
              <p className="text-slate-600 leading-relaxed">{item.description}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Expert SBM Disposal Rule:</span>
              </div>
              <p className="text-emerald-900/90 leading-relaxed font-medium">{item.tip}</p>
            </div>
          </div>

          {/* Environmental Impact & Decomposition */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Decomposition & Impact:</span>
            </div>
            <p className="text-amber-900/90 leading-relaxed">
              <strong>Timeframe:</strong> {meta.decomp}
            </p>
            <p className="text-amber-900/80 text-[11px] leading-relaxed">
              <strong>Campus Treatment:</strong> {meta.process}
            </p>
          </div>

          {/* Do's and Don'ts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-emerald-700 flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Recommended (Do)</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600">
                {meta.dos.map((d, idx) => (
                  <li key={idx}>• {d}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-rose-700 flex items-center gap-1 text-[11px]">
                <AlertCircle className="w-3 h-3 text-rose-500" />
                <span>Avoid (Don't)</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600">
                {meta.donts.map((d, idx) => (
                  <li key={idx}>• {d}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
            {onNavigateToFinder && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToFinder(item.category === 'wet' ? 'wet' : item.category === 'dry' ? 'dry' : 'e-waste');
                }}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer transition-all"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Find Nearest Bin</span>
              </button>
            )}

            {onNavigateToMap && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  const targetBin = relevantBins[0];
                  onNavigateToMap(targetBin?.id);
                }}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Bins on Map</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
