import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  RotateCcw, 
  Award, 
  Leaf, 
  Recycle, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Bookmark, 
  Sparkles,
  Maximize2,
  Minimize2,
  FileText,
  CornerDownRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookHandbook3DProps {
  onOpenQuiz?: () => void;
  onOpenPledge?: () => void;
  onTakeAction?: (type: string) => void;
}

export const BookHandbook3D: React.FC<BookHandbook3DProps> = ({
  onOpenQuiz,
  onOpenPledge,
  onTakeAction,
}) => {
  // Current spread index: 0 = Cover, 1 = Wet Waste, 2 = Dry Waste, 3 = E-Waste & Hazardous, 4 = Scorecard & Pledge
  const [currentSpread, setCurrentSpread] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [dogEarHovered, setDogEarHovered] = useState<boolean>(false);
  const bookContainerRef = useRef<HTMLDivElement>(null);

  const totalSpreads = 5;

  const handleNext = () => {
    if (isFlipping || currentSpread >= totalSpreads - 1) return;
    setFlipDirection('next');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSpread((prev) => Math.min(totalSpreads - 1, prev + 1));
      setIsFlipping(false);
    }, 450);
  };

  const handlePrev = () => {
    if (isFlipping || currentSpread <= 0) return;
    setFlipDirection('prev');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSpread((prev) => Math.max(0, prev - 1));
      setIsFlipping(false);
    }, 450);
  };

  const handleGoToSpread = (idx: number) => {
    if (isFlipping || idx === currentSpread) return;
    setFlipDirection(idx > currentSpread ? 'next' : 'prev');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSpread(idx);
      setIsFlipping(false);
    }, 400);
  };

  // Keyboard navigation support (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSpread, isFlipping]);

  return (
    <div 
      ref={bookContainerRef}
      className={`relative w-full transition-all duration-300 ${
        isFullscreen 
          ? 'fixed inset-0 z-50 bg-stone-900/95 backdrop-blur-md p-4 sm:p-8 flex flex-col justify-center items-center overflow-y-auto' 
          : 'my-4'
      }`}
    >
      {/* Top Handbook Control Bar */}
      <div className="w-full max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#134E3A] text-white rounded-lg text-xs font-bold shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
            <span>3D Folding Handbook</span>
          </div>
          <span className="text-xs text-stone-500 font-mono-code hidden sm:inline">
            Spread {currentSpread + 1} of {totalSpreads} &bull; {currentSpread === 0 ? 'Cover' : `Pages ${currentSpread * 2 - 1}-${currentSpread * 2}`}
          </span>
        </div>

        {/* Quick Chapter Selector Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          {[
            { label: 'Cover', icon: Bookmark },
            { label: 'Wet Waste', icon: Leaf },
            { label: 'Dry Waste', icon: Recycle },
            { label: 'E-Waste', icon: Zap },
            { label: 'Pledge', icon: Award },
          ].map((chap, i) => (
            <button
              key={chap.label}
              type="button"
              onClick={() => handleGoToSpread(i)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                currentSpread === i
                  ? 'bg-[#134E3A] text-white shadow-xs'
                  : 'bg-white/80 hover:bg-stone-200 text-stone-700 border border-stone-200'
              }`}
            >
              <chap.icon className="w-3 h-3" />
              <span>{chap.label}</span>
            </button>
          ))}

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 rounded-md border border-stone-200 ml-1 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Reading Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main 3D Book Stage */}
      <div 
        className="w-full max-w-4xl mx-auto"
        style={{ perspective: '1600px' }}
      >
        {/* Book Outer Wrapper with realistic shadow & physical thickness */}
        <div 
          className="relative w-full rounded-2xl transition-transform duration-500"
          style={{ 
            transformStyle: 'preserve-3d',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(0,0,0,0.08)'
          }}
        >
          {/* Bookmark Ribbon Hanging from Top */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-40 w-5 h-12 bg-rose-700 shadow-md rounded-b flex flex-col items-center justify-end pb-1 pointer-events-none">
            <div className="w-2.5 h-2.5 bg-rose-900 rotate-45 mb-[-6px]" />
          </div>

          {/* SPREAD 0: HARDBOUND COVER */}
          {currentSpread === 0 && (
            <motion.div
              key="spread-cover"
              initial={{ rotateY: flipDirection === 'prev' ? -25 : 25, opacity: 0.8 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="relative w-full bg-gradient-to-br from-[#0c2f23] via-[#134E3A] to-[#0a261c] rounded-2xl border-4 border-[#c5a059] p-6 sm:p-12 text-stone-100 flex flex-col items-center justify-between min-h-[500px] sm:min-h-[560px] overflow-hidden"
            >
              {/* Embossed Gold Filigree Corner Ornaments */}
              <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-[#c5a059]/60 rounded-tl pointer-events-none" />
              <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-[#c5a059]/60 rounded-tr pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-[#c5a059]/60 rounded-bl pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-[#c5a059]/60 rounded-br pointer-events-none" />

              {/* Central Spine Embossing on the left */}
              <div className="absolute top-0 bottom-0 left-6 w-3 bg-gradient-to-r from-black/40 via-transparent to-white/10 pointer-events-none" />

              {/* Tricolor Ribbon Stripe */}
              <div className="w-full flex items-center justify-center gap-1.5 my-2">
                <span className="w-12 h-1 bg-amber-500 rounded-full" />
                <span className="w-12 h-1 bg-white rounded-full" />
                <span className="w-12 h-1 bg-emerald-500 rounded-full" />
              </div>

              {/* Institutional Header */}
              <div className="text-center space-y-1.5 mt-2">
                <span className="text-xs uppercase font-mono-code tracking-[0.28em] text-[#e0ca9a]">
                  National Institute of Technology Patna
                </span>
                <p className="text-[11px] text-emerald-200/80 font-mono-code tracking-wider">
                  Swachh Bharat Mission &bull; Campus Cell
                </p>
              </div>

              {/* Title Crest */}
              <div className="flex flex-col items-center justify-center my-6 text-center max-w-lg">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#c5a059] p-1.5 mb-4 shadow-inner flex items-center justify-center bg-black/25">
                  <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-[#e0ca9a]" />
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold font-editorial text-[#f7e8c3] tracking-tight drop-shadow-md">
                  CAMPUS SWACHHATA HANDBOOK
                </h1>
                <p className="text-xs sm:text-sm font-editorial text-emerald-100/90 italic mt-2">
                  Standard Operating Manual for Source Segregation, Zero-Waste Campus &amp; Citizen Accountability
                </p>
                <div className="mt-4 px-3 py-1 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#f7e8c3] text-[11px] font-mono-code font-bold">
                  Official Edition 2026 &bull; Green Campus Standard
                </div>
              </div>

              {/* Interactive Dog-Ear Corner to Turn */}
              <div 
                onClick={handleNext}
                onMouseEnter={() => setDogEarHovered(true)}
                onMouseLeave={() => setDogEarHovered(false)}
                className="absolute bottom-0 right-0 w-20 h-20 cursor-pointer group"
                title="Click to flip open the handbook"
              >
                {/* Folded paper triangle */}
                <div 
                  className={`absolute bottom-0 right-0 w-16 h-16 bg-[#e0ca9a] shadow-[-4px_-4px_10px_rgba(0,0,0,0.4)] transition-all duration-300 origin-bottom-right ${
                    dogEarHovered ? 'scale-125 bg-amber-200' : 'scale-100'
                  }`}
                  style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
                />
                <span className="absolute bottom-2 right-2 text-[9px] font-bold text-stone-900 font-mono-code flex items-center gap-0.5 z-10 pointer-events-none">
                  Open &rarr;
                </span>
              </div>

              {/* Bottom Instructions */}
              <div className="text-center w-full pb-2">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d6b36e] active:scale-95 text-stone-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <span>Flip Open Handbook</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* SPREADS 1 TO 4: DUAL-PAGE 3D OPEN SPREAD */}
          {currentSpread > 0 && (
            <motion.div
              key={`spread-${currentSpread}`}
              initial={{ rotateY: flipDirection === 'next' ? 18 : -18, opacity: 0.9 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.42, ease: 'easeOut' }}
              className="relative w-full bg-[#fbf9f4] rounded-2xl border border-stone-300 shadow-2xl flex flex-col md:flex-row min-h-[540px] sm:min-h-[580px] overflow-hidden"
              style={{
                backgroundImage: 'radial-gradient(#e5e1d8 0.75px, transparent 0.75px)',
                backgroundSize: '16px 16px',
              }}
            >
              {/* Central Spine Fold Crease Shadow */}
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/15 via-black/30 to-black/15 pointer-events-none z-20 shadow-inner" />

              {/* LEFT PAGE */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-300/80 relative">
                {/* Page Number & Running Header */}
                <div className="flex items-center justify-between text-[11px] font-mono-code text-stone-500 border-b border-stone-300/70 pb-2">
                  <span className="font-bold text-[#134E3A]">NIT PATNA SWACHHATA CODE</span>
                  <span>Page {currentSpread * 2 - 1}</span>
                </div>

                {/* Left Page Body Content */}
                <div className="my-4 flex-1">
                  {currentSpread === 1 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <Leaf className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-xl font-bold font-editorial text-stone-900">
                          Wet Waste Protocols (हरा कचरा)
                        </h2>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Wet waste consists of all organic, biodegradable food materials generated across mess facilities, canteens, and faculty quarters. It must never be mixed with plastics.
                      </p>

                      <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3 space-y-2">
                        <h4 className="text-xs font-bold text-emerald-900 uppercase font-mono-code">
                          Approved for Green Dustbins:
                        </h4>
                        <ul className="text-xs text-emerald-950 space-y-1 list-disc list-inside">
                          <li>Cooked &amp; uncooked food leftovers (rice, roti, dal)</li>
                          <li>Fruit peels, seeds, and vegetable cuttings</li>
                          <li>Tea leaves, tea bags, and coffee grounds</li>
                          <li>Egg shells, flower garlands, and garden leaves</li>
                        </ul>
                      </div>

                      <div className="border-l-2 border-emerald-600 pl-3 py-1">
                        <span className="text-[11px] font-bold text-stone-800 block">Strict Prohibitions:</span>
                        <p className="text-[11px] text-stone-600">
                          Do NOT wrap wet waste in polythene bags before dumping. Empty the container directly into the green bin.
                        </p>
                      </div>
                    </div>
                  )}

                  {currentSpread === 2 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sky-800">
                        <Recycle className="w-5 h-5 text-sky-600" />
                        <h2 className="text-xl font-bold font-editorial text-stone-900">
                          Dry Waste Protocols (नीला कचरा)
                        </h2>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Dry waste comprises all non-biodegradable, clean recyclables. Keeping items clean and dry prevents them from ending up in Patna municipal landfills.
                      </p>

                      <div className="bg-sky-50/80 border border-sky-200 rounded-lg p-3 space-y-2">
                        <h4 className="text-xs font-bold text-sky-900 uppercase font-mono-code">
                          Approved for Blue Dustbins:
                        </h4>
                        <ul className="text-xs text-sky-950 space-y-1 list-disc list-inside">
                          <li>Flattened carton boxes, courier packaging &amp; charts</li>
                          <li>Rinsed plastic beverage bottles (Bisleri, soft drinks)</li>
                          <li>Newspapers, magazines, notebook sheets &amp; xerox paper</li>
                          <li>Aluminium soda cans, tin foil, and metal bottle caps</li>
                        </ul>
                      </div>

                      <div className="border-l-2 border-sky-600 pl-3 py-1">
                        <span className="text-[11px] font-bold text-stone-800 block">Space-Saving Directive:</span>
                        <p className="text-[11px] text-stone-600">
                          Crush all plastic bottles and fold cardboard cartons before disposal to maximize station capacity.
                        </p>
                      </div>
                    </div>
                  )}

                  {currentSpread === 3 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-amber-800">
                        <Zap className="w-5 h-5 text-amber-600" />
                        <h2 className="text-xl font-bold font-editorial text-stone-900">
                          E-Waste Bins (इलेक्ट्रॉनिक कचरा)
                        </h2>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Electronic components contain dangerous toxins like lead, mercury, and cadmium. They require specialized processing and must NEVER enter regular bins.
                      </p>

                      <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3 space-y-2">
                        <h4 className="text-xs font-bold text-amber-900 uppercase font-mono-code">
                          Designated E-Waste Items:
                        </h4>
                        <ul className="text-xs text-amber-950 space-y-1 list-disc list-inside">
                          <li>Dead laptop &amp; smartphone batteries (tape terminals)</li>
                          <li>Broken earphones, USB cords, chargers &amp; mice</li>
                          <li>Fried motherboards, RAM sticks &amp; microcontroller kits</li>
                          <li>Fused CFL/LED tubes and laboratory soldering waste</li>
                        </ul>
                      </div>

                      <div className="border-l-2 border-amber-600 pl-3 py-1">
                        <span className="text-[11px] font-bold text-stone-800 block">Campus Drop Location:</span>
                        <p className="text-[11px] text-stone-600">
                          Dedicated orange e-waste bins are located at CSE Department Block A, Ground Floor IT Lab.
                        </p>
                      </div>
                    </div>
                  )}

                  {currentSpread === 4 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-900">
                        <Award className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-xl font-bold font-editorial text-stone-900">
                          Hostel Cleanliness Scorecard
                        </h2>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Hostels and academic blocks are audited weekly on source segregation accuracy, bin overflow responsiveness, and corridor sanitation.
                      </p>

                      <div className="space-y-2.5">
                        <div className="bg-white border border-stone-200 rounded-lg p-2.5 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-stone-900 block">Brahmaputra Hostel</span>
                            <span className="text-[10px] text-stone-500 font-mono-code">Rank #1 &bull; 96.4% Compliance</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            A+ Grade
                          </span>
                        </div>

                        <div className="bg-white border border-stone-200 rounded-lg p-2.5 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-stone-900 block">Ganga Girls Hostel</span>
                            <span className="text-[10px] text-stone-500 font-mono-code">Rank #2 &bull; 93.8% Compliance</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            A Grade
                          </span>
                        </div>

                        <div className="bg-white border border-stone-200 rounded-lg p-2.5 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-stone-900 block">Kosi Hostel</span>
                            <span className="text-[10px] text-stone-500 font-mono-code">Rank #3 &bull; 88.2% Compliance</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                            B+ Grade
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Left Corner: Prev Button */}
                <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                  <span className="text-[10px] text-stone-400 font-mono-code">NITP Green Campus Standard</span>
                </div>
              </div>

              {/* RIGHT PAGE */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between relative">
                {/* Dog-ear fold on the top-right corner */}
                {currentSpread < totalSpreads - 1 && (
                  <div
                    onClick={handleNext}
                    onMouseEnter={() => setDogEarHovered(true)}
                    onMouseLeave={() => setDogEarHovered(false)}
                    className="absolute top-0 right-0 w-14 h-14 cursor-pointer group z-20"
                    title="Click to turn to the next page"
                  >
                    <div 
                      className={`absolute top-0 right-0 w-10 h-10 bg-amber-200 shadow-[2px_2px_6px_rgba(0,0,0,0.25)] transition-all duration-300 origin-top-right ${
                        dogEarHovered ? 'scale-125 bg-amber-300' : 'scale-100'
                      }`}
                      style={{ clipPath: 'polygon(0 0, 100% 100%, 100% 0)' }}
                    />
                    <CornerDownRight className="w-3.5 h-3.5 text-stone-800 absolute top-1.5 right-1.5 pointer-events-none" />
                  </div>
                )}

                {/* Page Number & Running Header */}
                <div className="flex items-center justify-between text-[11px] font-mono-code text-stone-500 border-b border-stone-300/70 pb-2">
                  <span>CHAPTER {currentSpread}</span>
                  <span className="font-bold text-[#134E3A]">Page {currentSpread * 2}</span>
                </div>

                {/* Right Page Body Content */}
                <div className="my-4 flex-1">
                  {currentSpread === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold font-editorial text-stone-900">
                        Campus Vermicomposting Cycle
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        All segregated wet waste from mess halls is transferred to the NIT Patna Aerobic Compost Pits located adjacent to the campus nursery.
                      </p>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-stone-200 shadow-2xs">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                          <span className="text-stone-700"><strong>Daily Collection:</strong> Mess supervisors deposit organic waste by 09:30 AM and 03:00 PM.</span>
                        </div>
                        <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-stone-200 shadow-2xs">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                          <span className="text-stone-700"><strong>Bio-Degradation:</strong> Earthworm composting converts 450 kg of organic waste into nutrient manure every 45 days.</span>
                        </div>
                        <div className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-stone-200 shadow-2xs">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                          <span className="text-stone-700"><strong>Campus Lawns:</strong> Finished rich compost feeds the Ganga-facing green lawns &amp; botanical garden.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentSpread === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold font-editorial text-stone-900">
                        Single-Use Plastics (SUP) Ban
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Under Ministry of Jal Shakti guidelines, the following items are strictly banned across all NIT Patna canteens, stationery shops, and hostel stalls:
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-rose-50 border border-rose-200 rounded p-2 text-rose-900">
                          <strong>Banned Items:</strong>
                          <ul className="list-disc list-inside mt-1 space-y-0.5 text-stone-700">
                            <li>Polythene bags &lt; 120 microns</li>
                            <li>Plastic straws &amp; stirrers</li>
                            <li>Thermocol plates / cups</li>
                          </ul>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 rounded p-2 text-emerald-900">
                          <strong>Eco Alternatives:</strong>
                          <ul className="list-disc list-inside mt-1 space-y-0.5 text-stone-700">
                            <li>Jute &amp; cotton cloth bags</li>
                            <li>Steel bottles &amp; tumblers</li>
                            <li>Biodegradable areca leaf plates</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs">
                        <span className="text-xs font-bold text-stone-800 block">Penalty for Non-Compliance:</span>
                        <p className="text-[11px] text-stone-600 mt-0.5">
                          First infraction: &yen;200 fine. Repeated violations by campus vendors result in loss of canteen license.
                        </p>
                      </div>
                    </div>
                  )}

                  {currentSpread === 3 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-rose-800">
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                        <h3 className="text-base font-bold font-editorial text-stone-900">
                          Hazardous &amp; Biomedical Waste
                        </h3>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Medical sharps, expired medicines, and sanitary waste require red-label wrapping to safeguard campus sanitation staff from infectious biohazards.
                      </p>

                      <div className="bg-rose-50/80 border border-rose-200 rounded-lg p-3 space-y-2">
                        <h4 className="text-xs font-bold text-rose-900 uppercase font-mono-code">
                          Mandatory Wrapping Protocol:
                        </h4>
                        <ol className="text-xs text-rose-950 space-y-1.5 list-decimal list-inside">
                          <li>Wrap securely in multiple layers of old newspaper.</li>
                          <li>Mark the exterior clearly with a <strong>red marker symbol (X)</strong>.</li>
                          <li>Deposit in the designated sanitary disposal receptacle inside restrooms.</li>
                        </ol>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs">
                        <span className="text-xs font-bold text-stone-800 block">Health Centre Assistance:</span>
                        <p className="text-[11px] text-stone-600 mt-0.5">
                          Unused medical supplies and syringes can be handed directly to the Campus Health Centre pharmacy counter.
                        </p>
                      </div>
                    </div>
                  )}

                  {currentSpread === 4 && (
                    <div className="space-y-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#134E3A] flex items-center justify-center mx-auto shadow-inner">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold font-editorial text-stone-900">
                        Official Citizen Cleanliness Oath
                      </h3>
                      <p className="text-xs text-stone-600 italic px-2">
                        &ldquo;I commit to keeping NIT Patna clean, segregating every piece of waste at the source, and actively discouraging littering on our sacred Ganga-side campus.&rdquo;
                      </p>

                      {/* Official Verified Stamp Graphic */}
                      <div className="inline-block border-2 border-emerald-700/60 rounded-xl px-4 py-2 rotate-[-2deg] bg-emerald-50/70 shadow-xs">
                        <div className="text-[10px] font-bold tracking-widest text-emerald-800 uppercase font-mono-code">
                          VERIFIED GREEN CAMPUS REGISTRY
                        </div>
                        <div className="text-xs font-black text-[#134E3A] font-editorial">
                          NIT PATNA SBM CELL
                        </div>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={onOpenPledge}
                          className="w-full sm:w-auto px-4 py-2 bg-[#134E3A] hover:bg-[#0f3e2e] active:scale-95 text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5 text-amber-300" />
                          <span>Sign Swachhata Pledge</span>
                        </button>
                        <button
                          type="button"
                          onClick={onOpenQuiz}
                          className="w-full sm:w-auto px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-lg border border-stone-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#134E3A]" />
                          <span>Test Quiz (100 Pts)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Right Corner: Next Page Button */}
                <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 font-mono-code">
                    {currentSpread === totalSpreads - 1 ? 'End of Handbook' : 'Click corner or button'}
                  </span>
                  {currentSpread < totalSpreads - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#134E3A] hover:bg-[#0f3e2e] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <span>Next Page</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleGoToSpread(0)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Back to Cover</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
