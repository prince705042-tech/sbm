import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Volume2,
  VolumeX,
  Languages
} from 'lucide-react';
import { motion } from 'motion/react';

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

  // Audio Speech Synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLang, setAudioLang] = useState<'hi' | 'en'>('hi');
  const [audioNotice, setAudioNotice] = useState<string | null>(null);

  // Stop speech when modal closes or item changes
  useEffect(() => {
    return () => {
      try {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } catch {}
    };
  }, [item]);

  const handleToggleAudio = () => {
    setAudioNotice(null);
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setAudioNotice('Speech audio is not supported in this browser environment.');
      return;
    }

    try {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }

      window.speechSynthesis.cancel();

      let textToSpeak = '';
      if (audioLang === 'hi') {
        if (item.category === 'wet') {
          textToSpeak = `${item.name} गीला कचरा है। इसे हमेशा हरे डस्टबिन में डालें। ${item.tip}`;
        } else if (item.category === 'dry') {
          textToSpeak = `${item.name} सूखा कचरा है। इसे नीले डस्टबिन में डालें। ${item.tip}`;
        } else if (item.category === 'e-waste') {
          textToSpeak = `${item.name} ई-कचरा है। इसे कंप्यूटर साइंस डिपार्टमेंट के ई-वेस्ट ड्रॉप बॉक्स में डालें। ${item.tip}`;
        } else {
          textToSpeak = `${item.name} हानिकारक कचरा है। इसे सावधानी से लाल डस्टबिन या स्वास्थ्य केंद्र में दें।`;
        }
      } else {
        textToSpeak = `Official disposal guide for ${item.name}. Category: ${meta.label}. Protocol instruction: ${item.tip}`;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = audioLang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;

      utterance.onend = () => {
        setIsPlayingAudio(false);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };

      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      setIsPlayingAudio(false);
      setAudioNotice('Audio playback unavailable in this session.');
    }
  };

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 bg-white w-full max-w-lg rounded-lg shadow-xl border border-stone-200 overflow-hidden my-auto"
      >
        {/* Header with bin color theme */}
        <div className={`p-4 sm:p-5 ${meta.bgColor} border-b ${meta.borderColor} flex items-start justify-between relative`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-white shadow-2xs flex items-center justify-center shrink-0 border border-stone-200">
              {meta.icon}
            </div>
            <div>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded border mb-1 font-mono-code ${meta.badgeColor}`}>
                {meta.label}
              </span>
              <h3 className={`text-lg sm:text-xl font-bold font-editorial leading-tight ${meta.textColor}`}>
                {item.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded bg-white/90 hover:bg-white text-stone-500 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer border border-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-5 space-y-3.5 max-h-[75vh] overflow-y-auto text-xs">
          {/* Audio Voice Guidance Control Strip */}
          <div className="p-2.5 rounded bg-stone-50 border border-stone-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleAudio}
                className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-rose-700 text-white'
                    : 'bg-[#134E3A] hover:bg-[#0F3E2E] text-white shadow-2xs'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen Audio Guide</span>
                  </>
                )}
              </button>

              <span className="text-[10px] text-stone-500 font-mono-code hidden sm:inline">
                {isPlayingAudio ? 'Speaking...' : 'Institutional Voice Synthesizer'}
              </span>
            </div>

            {/* Language toggle: Hindi / English */}
            <div className="flex items-center gap-1 bg-stone-200/80 p-0.5 rounded text-[10px] font-mono-code font-bold">
              <button
                type="button"
                onClick={() => setAudioLang('hi')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  audioLang === 'hi' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setAudioLang('en')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  audioLang === 'en' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                ENG
              </button>
            </div>
          </div>

          {audioNotice && (
            <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{audioNotice}</span>
            </div>
          )}

          {/* Quick specs grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5 font-mono-code">
                Recyclability
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                {item.recyclable ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#134E3A]" />
                    <span>Recyclable Stream</span>
                  </>
                ) : (
                  <>
                    <X className="w-3.5 h-3.5 text-rose-700" />
                    <span>Non-Recyclable</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-2.5 rounded bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5 font-mono-code">
                Biodegradability
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                {item.biodegradable ? (
                  <>
                    <Leaf className="w-3.5 h-3.5 text-[#134E3A]" />
                    <span>Organic / Compostable</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Persistent Material</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Description & Tip */}
          <div className="space-y-2">
            <div className="p-3 rounded bg-stone-50 border border-stone-200 space-y-1">
              <span className="font-semibold text-stone-900 block font-editorial text-sm">Description</span>
              <p className="text-stone-600 leading-relaxed">{item.description}</p>
            </div>

            <div className="p-3 rounded bg-emerald-50/50 border border-emerald-200 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#134E3A]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#134E3A]" />
                <span className="font-editorial text-sm">Disposal Protocol</span>
              </div>
              <p className="text-stone-700 leading-relaxed font-medium">{item.tip}</p>
            </div>
          </div>

          {/* Environmental Impact & Decomposition */}
          <div className="p-3 rounded bg-stone-50 border border-stone-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-stone-900">
              <Clock className="w-3.5 h-3.5 text-stone-700" />
              <span className="font-editorial text-sm">Decomposition &amp; Environmental Lifecycle</span>
            </div>
            <p className="text-stone-700 leading-relaxed">
              <strong className="text-stone-900">Degradation Duration:</strong> {meta.decomp}
            </p>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              <strong className="text-stone-900">Campus Facility Treatment:</strong> {meta.process}
            </p>
          </div>

          {/* Do's and Don'ts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 rounded bg-stone-50 border border-stone-200 space-y-1.5">
              <div className="font-semibold text-[#134E3A] flex items-center gap-1 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#134E3A]" />
                <span>Mandatory Protocols</span>
              </div>
              <ul className="space-y-1 text-[11px] text-stone-600">
                {meta.dos.map((d, idx) => (
                  <li key={idx}>&bull; {d}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded bg-stone-50 border border-stone-200 space-y-1.5">
              <div className="font-semibold text-rose-800 flex items-center gap-1 text-xs">
                <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
                <span>Prohibited Actions</span>
              </div>
              <ul className="space-y-1 text-[11px] text-stone-600">
                {meta.donts.map((d, idx) => (
                  <li key={idx}>&bull; {d}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-2">
            {onNavigateToFinder && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToFinder(item.category === 'wet' ? 'wet' : item.category === 'dry' ? 'dry' : 'e-waste');
                }}
                className="w-full sm:w-1/2 py-2 px-3 rounded bg-[#134E3A] hover:bg-[#0F3E2E] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Locate Nearest Station</span>
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
                className="w-full sm:w-1/2 py-2 px-3 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-stone-200"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Stations on Map</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
