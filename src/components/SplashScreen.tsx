import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onFinish?: () => void;
  durationMs?: number; // default ~1300ms
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 1350,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onFinish?.();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onFinish]);

  const handleDismiss = () => {
    setIsVisible(false);
    onFinish?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleDismiss}
          className="fixed inset-0 z-50 bg-[#F9F9FA] flex flex-col items-center justify-between p-6 sm:p-10 select-none cursor-pointer overflow-hidden"
          title="Click to continue directly"
        >
          {/* Top Tricolor Ambient Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-white to-emerald-600 shadow-xs" />

          {/* Institutional Top Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="flex items-center justify-between w-full max-w-md pt-2"
          >
            <span className="text-[11px] font-bold tracking-widest text-[#134E3A] uppercase font-mono-code bg-[#134E3A]/8 px-2.5 py-1 rounded-full border border-[#134E3A]/15">
              SBM &bull; NIT PATNA
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              className="text-[11px] font-semibold text-stone-500 hover:text-stone-900 transition-colors px-2 py-0.5 rounded cursor-pointer"
            >
              Skip &rarr;
            </button>
          </motion.div>

          {/* Centerpiece Image & Slogan */}
          <div className="flex-1 flex flex-col items-center justify-center max-w-sm w-full py-4 text-center">
            {/* Gandhi Walking Silhouette Artwork */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="relative w-48 sm:w-56 h-72 sm:h-80 flex items-center justify-center"
            >
              {/* Soft radial glow behind */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/50 via-emerald-100/30 to-transparent rounded-full filter blur-xl -z-10" />

              <img
                src="/gandhi-splash.webp"
                alt="Mahatma Gandhi - Swachh Bharat Abhiyan"
                className="w-full h-full object-contain drop-shadow-md"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Campaign Slogan & Title */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18 }}
              className="mt-3 space-y-1.5"
            >
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-editorial tracking-tight">
                स्वच्छ भारत
              </h1>
              <p className="text-base sm:text-lg font-semibold text-stone-700 font-editorial">
                एक कदम स्वच्छता की ओर
              </p>
              <p className="text-xs text-stone-500 font-mono-code pt-0.5">
                Swachh Campus Infrastructure &bull; Segregation Registry
              </p>
            </motion.div>
          </div>

          {/* Bottom Progress Bar & Loading Indicator */}
          <div className="w-full max-w-xs flex flex-col items-center gap-2 pb-2">
            <div className="w-full h-1 bg-stone-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: durationMs / 1000, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-amber-500 via-[#134E3A] to-emerald-600"
              />
            </div>
            <span className="text-[10px] text-stone-400 font-mono-code">
              Opening campus registry...
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
