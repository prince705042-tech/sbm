import React, { useState } from 'react';
import { 
  X, 
  Award, 
  CheckSquare, 
  Square, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';

interface TakePledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPledgeCompleted: (name: string, dept: string) => void;
  initialName?: string;
  initialDept?: string;
  currentLang?: 'en' | 'hi';
}

export const TakePledgeModal: React.FC<TakePledgeModalProps> = ({
  isOpen,
  onClose,
  onPledgeCompleted,
  initialName = '',
  initialDept = '',
  currentLang = 'en',
}) => {
  const [name, setName] = useState(initialName);
  const [dept, setDept] = useState(initialDept || 'B.Tech Student, NIT Patna');
  const [role, setRole] = useState<'student' | 'faculty' | 'staff' | 'visitor'>('student');
  const [agreed1, setAgreed1] = useState(true);
  const [agreed2, setAgreed2] = useState(true);
  const [agreed3, setAgreed3] = useState(true);
  const [agreed4, setAgreed4] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(currentLang === 'hi' ? 'कृपया अपना नाम दर्ज करें' : 'Please enter your full name');
      return;
    }
    if (!agreed1 || !agreed2 || !agreed3 || !agreed4) {
      setError(currentLang === 'hi' ? 'कृपया सभी स्वच्छता प्रतिज्ञा बिंदुओं की पुष्टि करें' : 'Please agree to all 4 pledge commitments');
      return;
    }

    onPledgeCompleted(name.trim(), dept.trim() || 'NIT Patna Campus Citizen');
  };

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
        className="relative z-10 bg-white w-full max-w-lg rounded-xl shadow-2xl border border-stone-300 overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="p-4 bg-[#0A2540] text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF671F] flex items-center justify-center shadow-xs">
              <Award className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-editorial">
                {currentLang === 'hi' ? 'स्वच्छता प्रतिज्ञा (नागरिक संकल्प)' : 'Take Swachhata Pledge'}
              </h2>
              <span className="text-[10px] text-stone-300">
                Swachh Bharat Mission &bull; Citizen Interface
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-stone-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-stone-800 leading-relaxed font-serif italic text-xs">
            &ldquo;
            {currentLang === 'hi'
              ? 'मैं यह संकल्प लेता हूँ कि मैं स्वयं स्वच्छता के प्रति सजग रहूँगा, परिसर में कभी भी कचरा नहीं फैलाऊँगा तथा गीले व सूखे कचरे का शत-प्रतिशत पृथक्करण करूँगा।'
              : 'I solemnly pledge to keep our campus clean and green, strictly segregate waste at source (Wet in Green, Dry in Blue), avoid single-use plastics, and inspire my peers to uphold national sanitation standards.'}
            &rdquo;
          </div>

          {/* Name & Department Inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                {currentLang === 'hi' ? 'पूरा नाम (प्रमाण पत्र हेतु)' : 'Full Name (for Official Certificate)'} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                placeholder={currentLang === 'hi' ? 'उदा. राहुल कुमार शर्मा' : 'e.g. Rahul Sharma'}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#046A38] bg-stone-50/50"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                {currentLang === 'hi' ? 'विभाग / अनुभाग / हॉस्टल' : 'Department / Hostel / Designation'}
              </label>
              <input
                type="text"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                placeholder="e.g. Department of Computer Science, NIT Patna"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#046A38] bg-stone-50/50"
              />
            </div>
          </div>

          {/* Commitments Checklist */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wider block">
              {currentLang === 'hi' ? 'स्वच्छता प्रतिज्ञा बिंदु:' : 'My 4 Commitments:'}
            </span>

            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={agreed1} 
                onChange={(e) => setAgreed1(e.target.checked)} 
                className="mt-0.5 rounded text-[#046A38] focus:ring-[#046A38]"
              />
              <span className="text-stone-700 text-[11px]">
                {currentLang === 'hi' 
                  ? '१. मैं हमेशा स्रोत पर पृथक्करण करूँगा: गीले कचरे के लिए हरा डस्टबिन, सूखे के लिए नीला डस्टबिन।' 
                  : '1. I will strictly segregate waste at source: Green for wet organic, Blue for dry recyclables.'}
              </span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={agreed2} 
                onChange={(e) => setAgreed2(e.target.checked)} 
                className="mt-0.5 rounded text-[#046A38] focus:ring-[#046A38]"
              />
              <span className="text-stone-700 text-[11px]">
                {currentLang === 'hi' 
                  ? '२. मैं कभी भी सड़कों, गलियारों या कक्षाओं में कचरा नहीं फेंकूँगा।' 
                  : '2. I will never litter or discard wrappers, bottles, or food packets in public corridors.'}
              </span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={agreed3} 
                onChange={(e) => setAgreed3(e.target.checked)} 
                className="mt-0.5 rounded text-[#046A38] focus:ring-[#046A38]"
              />
              <span className="text-stone-700 text-[11px]">
                {currentLang === 'hi' 
                  ? '३. मैं सिंगल-यूज प्लास्टिक का त्याग करूँगा एवं कपड़े के थैले/बोतल का उपयोग करूँगा।' 
                  : '3. I will eliminate single-use plastics and carry a reusable bag and water bottle.'}
              </span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={agreed4} 
                onChange={(e) => setAgreed4(e.target.checked)} 
                className="mt-0.5 rounded text-[#046A38] focus:ring-[#046A38]"
              />
              <span className="text-stone-700 text-[11px]">
                {currentLang === 'hi' 
                  ? '४. परिसर में भरे हुए डस्टबिन या गंदगी दिखने पर तुरंत शिकायत निवारण पोर्टल पर रिपोर्ट करूँगा।' 
                  : '4. I will promptly report overflowing bins or unhygienic spots via the Swachhata portal.'}
              </span>
            </label>
          </div>

          {error && (
            <p className="text-xs text-rose-600 font-semibold">{error}</p>
          )}

          {/* Action Button */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-lg bg-[#046A38] hover:bg-[#03532c] text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>{currentLang === 'hi' ? 'शपथ लें एवं प्रमाण पत्र प्राप्त करें' : 'Commit & Generate Certificate'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
