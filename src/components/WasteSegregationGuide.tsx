import React, { useState, useMemo, useEffect } from 'react';
import { WASTE_SEGREGATION_ITEMS } from '../data/campusData';
import { WasteItem, CampusBin } from '../types';
import { 
  Search, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Leaf, 
  Recycle, 
  Zap, 
  AlertCircle,
  Award,
  SlidersHorizontal,
  MapPin,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Check,
  X
} from 'lucide-react';
import { WasteItemDetailModal } from './WasteItemDetailModal';
import { WasteQuiz } from './WasteQuiz';
import { PledgeCertificateModal } from './PledgeCertificateModal';

interface WasteSegregationGuideProps {
  bins?: CampusBin[];
  onNavigateToFinder?: (wasteType?: string) => void;
  onNavigateToMap?: (binId?: string) => void;
  onOpenReportModal?: (bin?: CampusBin) => void;
}

export const WasteSegregationGuide: React.FC<WasteSegregationGuideProps> = ({
  bins = [],
  onNavigateToFinder,
  onNavigateToMap,
  onOpenReportModal,
}) => {
  // Navigation within guide
  const [guideSubView, setGuideSubView] = useState<'catalog' | 'quiz'>('catalog');

  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'wet' | 'dry' | 'e-waste' | 'hazardous'>('all');
  const [traitFilter, setTraitFilter] = useState<'all' | 'popular' | 'recyclable' | 'biodegradable'>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'name' | 'category'>('recommended');
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);

  // Modal states
  const [selectedItem, setSelectedItem] = useState<WasteItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPledgeFormOpen, setIsPledgeFormOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  // Swachhata Pledge persistence
  const [pledgeTaken, setPledgeTaken] = useState(false);
  const [pledgeName, setPledgeName] = useState('');
  const [pledgeDept, setPledgeDept] = useState('');
  const [pledgeDate, setPledgeDate] = useState('');
  const [pledgeCount, setPledgeCount] = useState(384);

  // Input states for taking the pledge form
  const [tempName, setTempName] = useState('');
  const [tempDept, setTempDept] = useState('NIT Patna - Student');
  const [pledgeAgreement, setPledgeAgreement] = useState(true);

  // Initialize pledge from localStorage safely
  useEffect(() => {
    try {
      const isTaken = localStorage.getItem('swachh_campus_pledge_taken') === 'true';
      const savedName = localStorage.getItem('swachh_campus_pledge_name') || '';
      const savedDept = localStorage.getItem('swachh_campus_pledge_dept') || '';
      const savedDate = localStorage.getItem('swachh_campus_pledge_date') || '';
      const savedCount = localStorage.getItem('swachh_campus_pledge_count');

      if (isTaken) {
        setPledgeTaken(true);
        setPledgeName(savedName);
        setPledgeDept(savedDept);
        setPledgeDate(savedDate);
      }

      if (savedCount) {
        setPledgeCount(parseInt(savedCount, 10));
      }
    } catch {
      // Local storage fallback for restricted environments
    }
  }, []);

  // Filtered & sorted items
  const filteredItems = useMemo(() => {
    return WASTE_SEGREGATION_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tip.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTrait = 
        traitFilter === 'all' ||
        (traitFilter === 'popular' && item.popular) ||
        (traitFilter === 'recyclable' && item.recyclable) ||
        (traitFilter === 'biodegradable' && item.biodegradable);

      return matchesCategory && matchesSearch && matchesTrait;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      // recommended: popular items first
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return 0;
    });
  }, [searchQuery, activeCategory, traitFilter, sortBy]);

  // Smart classifier for unknown queries
  const smartClassification = useMemo(() => {
    if (!searchQuery.trim() || filteredItems.length > 0) return null;
    const q = searchQuery.toLowerCase();

    if (
      q.includes('fruit') || 
      q.includes('vegetable') || 
      q.includes('food') || 
      q.includes('rice') || 
      q.includes('roti') || 
      q.includes('tea') || 
      q.includes('coffee') || 
      q.includes('peel') || 
      q.includes('apple') || 
      q.includes('egg') || 
      q.includes('flower') || 
      q.includes('leaf') || 
      q.includes('bread') ||
      q.includes('bone') ||
      q.includes('soup')
    ) {
      return {
        bin: 'Green Dustbin',
        category: 'Wet Waste (Gila Kachra)',
        color: 'emerald',
        icon: <Leaf className="w-5 h-5 text-emerald-600" />,
        reason: 'Organic biodegradable food & garden waste decomposes into natural compost.',
        tip: 'Drain excess liquid, remove any packaging wrap, and place directly into the Green bin.',
      };
    }

    if (
      q.includes('plastic') || 
      q.includes('paper') || 
      q.includes('box') || 
      q.includes('bottle') || 
      q.includes('carton') || 
      q.includes('can') || 
      q.includes('foil') || 
      q.includes('glass') || 
      q.includes('wrapper') || 
      q.includes('straw') || 
      q.includes('cup') ||
      q.includes('magazine') ||
      q.includes('book') ||
      q.includes('pen')
    ) {
      return {
        bin: 'Blue Dustbin',
        category: 'Dry Waste (Sookha Kachra)',
        color: 'sky',
        icon: <Recycle className="w-5 h-5 text-sky-600" />,
        reason: 'Non-biodegradable recyclable packaging, cardboard, metal, and clean plastics.',
        tip: 'Ensure the item is rinsed clean, completely dry, and crushed flat to optimize bin space.',
      };
    }

    if (
      q.includes('battery') || 
      q.includes('wire') || 
      q.includes('cable') || 
      q.includes('charger') || 
      q.includes('mouse') || 
      q.includes('phone') || 
      q.includes('laptop') || 
      q.includes('bulb') || 
      q.includes('cfl') || 
      q.includes('led') || 
      q.includes('electronic')
    ) {
      return {
        bin: 'E-Waste Drop Bin',
        category: 'Electronic Waste (Block A IT Lab)',
        color: 'slate',
        icon: <Zap className="w-5 h-5 text-amber-500" />,
        reason: 'Heavy metals (lead, mercury, cadmium) that should NEVER enter general bins or landfills.',
        tip: 'Tape battery terminals and deposit in the designated e-waste box at Computer Science IT Lab.',
      };
    }

    if (
      q.includes('medicine') || 
      q.includes('tablet') || 
      q.includes('syrup') || 
      q.includes('bandage') || 
      q.includes('mask') || 
      q.includes('syringe') || 
      q.includes('pad') || 
      q.includes('sanitary') || 
      q.includes('needle') || 
      q.includes('chemical')
    ) {
      return {
        bin: 'Red Marked Bin',
        category: 'Hazardous / Biomedical Waste',
        color: 'rose',
        icon: <AlertCircle className="w-5 h-5 text-rose-600" />,
        reason: 'Biohazard risk or chemical toxicity requiring specialized incinerator disposal.',
        tip: 'Wrap securely in newspaper, mark with a red X, and deliver to the Campus Health Centre.',
      };
    }

    return null;
  }, [searchQuery, filteredItems.length]);

  // Handle open item modal
  const handleItemClick = (item: WasteItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  // Quick search suggestions
  const popularChips = [
    'Plastic Bottles',
    'Banana Peels',
    'Mess Rice',
    'Paper Cups',
    'Batteries',
    'Carton Boxes',
    'Tea Bags',
    'Sanitary Waste',
  ];

  // Push the user directly to where it shows what kind of waste it is
  const handleOptionSelect = (chip: string) => {
    setSearchQuery(chip);
    setActiveCategory('all');
    setTraitFilter('all');

    const lowerChip = chip.toLowerCase();
    const matchedItem = WASTE_SEGREGATION_ITEMS.find((item) => {
      const itemName = item.name.toLowerCase();
      return (
        itemName.includes(lowerChip) ||
        (lowerChip.includes('plastic') && itemName.includes('plastic')) ||
        (lowerChip.includes('banana') && itemName.includes('banana')) ||
        (lowerChip.includes('rice') && (itemName.includes('rice') || itemName.includes('mess'))) ||
        (lowerChip.includes('cup') && itemName.includes('cup')) ||
        (lowerChip.includes('batter') && itemName.includes('batter')) ||
        (lowerChip.includes('carton') && (itemName.includes('box') || itemName.includes('carton'))) ||
        (lowerChip.includes('tea') && itemName.includes('tea')) ||
        (lowerChip.includes('sanitary') && (itemName.includes('sanitary') || item.category === 'hazardous'))
      );
    });

    if (matchedItem) {
      setHighlightedItemId(matchedItem.id);
    } else {
      setHighlightedItemId(null);
    }

    // Scroll smoothly directly to the item or catalog grid
    setTimeout(() => {
      if (matchedItem) {
        const itemEl = document.getElementById(`waste-item-${matchedItem.id}`);
        if (itemEl) {
          itemEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }
      const gridEl = document.getElementById('waste-catalog-grid');
      if (gridEl) {
        gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  const handleCategorySelectWithScroll = (cat: 'all' | 'wet' | 'dry' | 'e-waste' | 'hazardous') => {
    setActiveCategory(cat);
    setSearchQuery('');
    setHighlightedItemId(null);
    setTimeout(() => {
      const gridEl = document.getElementById('waste-catalog-grid');
      if (gridEl) {
        gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  // Submit pledge
  const handleConfirmPledge = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = tempName.trim() || 'Campus Citizen';
    const finalDept = tempDept.trim() || 'National Institute of Technology Patna';
    const today = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const newCount = pledgeCount + 1;

    try {
      localStorage.setItem('swachh_campus_pledge_taken', 'true');
      localStorage.setItem('swachh_campus_pledge_name', finalName);
      localStorage.setItem('swachh_campus_pledge_dept', finalDept);
      localStorage.setItem('swachh_campus_pledge_date', today);
      localStorage.setItem('swachh_campus_pledge_count', String(newCount));
    } catch {}

    setPledgeTaken(true);
    setPledgeName(finalName);
    setPledgeDept(finalDept);
    setPledgeDate(today);
    setPledgeCount(newCount);
    setIsPledgeFormOpen(false);
    setIsCertificateOpen(true);
  };

  // Reset pledge
  const handleResetPledge = () => {
    try {
      localStorage.removeItem('swachh_campus_pledge_taken');
      localStorage.removeItem('swachh_campus_pledge_name');
      localStorage.removeItem('swachh_campus_pledge_dept');
      localStorage.removeItem('swachh_campus_pledge_date');
    } catch {}

    setPledgeTaken(false);
    setPledgeName('');
    setPledgeDept('');
    setPledgeDate('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-7">
      {/* Institutional Top Header Banner */}
      <div className="bg-[#134E3A] rounded-lg p-6 sm:p-8 text-stone-100 border border-[#0F3E2E] shadow-2xs relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/15 text-stone-200 text-xs font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Swachh Bharat Abhiyan • Source Segregation Standard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-white tracking-tight">
            Campus Waste Classification &amp; Segregation Manual
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Waste segregated at the source enables 90% direct recycling and vermicomposting on campus. Review dustbin color codes, search catalog items, or take the cleanliness assessment.
          </p>

          {/* Sub-Navigation Tabs */}
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => setGuideSubView('catalog')}
              className={`px-3.5 py-2 rounded-md font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                guideSubView === 'catalog'
                  ? 'bg-white text-stone-900 shadow-2xs border border-stone-200'
                  : 'bg-white/10 text-stone-200 hover:bg-white/20'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Waste Classification Index</span>
            </button>

            <button
              onClick={() => setGuideSubView('quiz')}
              className={`px-3.5 py-2 rounded-md font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                guideSubView === 'quiz'
                  ? 'bg-white text-stone-900 shadow-2xs border border-stone-200'
                  : 'bg-white/10 text-stone-200 hover:bg-white/20'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>Sanitation Knowledge Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Switching */}
      {guideSubView === 'quiz' && <WasteQuiz />}

      {guideSubView === 'catalog' && (
        <>
          {/* Quick Search Bar & Keyword Chips */}
          <div className="bg-white rounded-lg p-5 border border-stone-200 shadow-2xs space-y-3.5">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="input-waste-search"
                type="text"
                placeholder="Search catalog (e.g. plastic bottle, mess rice, banana peel, tea bag, battery)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleOptionSelect(searchQuery);
                  }
                }}
                className="w-full bg-stone-50 text-stone-900 rounded-md pl-10 pr-28 py-2.5 text-xs sm:text-sm font-medium border border-stone-300 focus:bg-white focus:border-[#134E3A] focus:outline-hidden transition-colors"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setHighlightedItemId(null);
                    }}
                    className="text-xs font-medium text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (searchQuery.trim()) {
                      handleOptionSelect(searchQuery);
                    }
                  }}
                  className="px-3 py-1 rounded bg-[#134E3A] hover:bg-[#0F3E2E] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Lookup
                </button>
              </div>
            </div>

            {/* Quick Keyword Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-stone-500 font-semibold mr-1">
                Common searches:
              </span>
              {popularChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleOptionSelect(chip)}
                  className={`px-2.5 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                    searchQuery.toLowerCase() === chip.toLowerCase()
                      ? 'bg-[#134E3A] text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive 3 Master Color Bin Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* GREEN BIN - WET WASTE */}
            <div 
              onClick={() => handleCategorySelectWithScroll('wet')}
              className={`rounded-lg p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                activeCategory === 'wet'
                  ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-600/30 shadow-xs'
                  : 'bg-white hover:bg-emerald-50/40 border-stone-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded bg-[#134E3A] text-white flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-emerald-300" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono-code">
                    Compostable
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 font-editorial">
                  Green Dustbin
                </h3>
                <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5">
                  Wet Waste • Organic
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  All biodegradable food remnants, mess leftovers, and horticulture cuttings routed to the campus vermicomposting pit.
                </p>

                <div className="space-y-1.5 bg-stone-50 p-2.5 rounded border border-stone-200 text-xs">
                  <div className="text-[11px] font-bold text-stone-800">Standard items:</div>
                  <ul className="text-[11px] text-stone-600 space-y-0.5">
                    <li>• Canteen &amp; hostel mess rice, bread, scraps</li>
                    <li>• Fruit peels, tea bags, coffee grinds</li>
                    <li>• Lawn leaves and campus botanical waste</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-800 flex items-center gap-1">
                  <span>{activeCategory === 'wet' ? '✓ Showing Wet' : 'Filter Category'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>

                {onNavigateToFinder && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToFinder('wet');
                    }}
                    className="px-2 py-1 rounded bg-[#134E3A] hover:bg-[#0F3E2E] text-white text-[11px] font-medium flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Locate Green</span>
                  </button>
                )}
              </div>
            </div>

            {/* BLUE BIN - DRY WASTE */}
            <div 
              onClick={() => handleCategorySelectWithScroll('dry')}
              className={`rounded-lg p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                activeCategory === 'dry'
                  ? 'bg-sky-50/90 border-sky-600 ring-2 ring-sky-600/30 shadow-xs'
                  : 'bg-white hover:bg-sky-50/40 border-stone-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded bg-sky-700 text-white flex items-center justify-center">
                    <Recycle className="w-5 h-5 text-sky-200" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-900 font-mono-code">
                    Recyclable
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 font-editorial">
                  Blue Dustbin
                </h3>
                <div className="text-[11px] font-bold text-sky-800 uppercase tracking-wider mb-1.5">
                  Dry Waste • Packaging
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  Clean packaging materials, printouts, plastic bottles, boxes, and beverage cans processed by authorized recyclers.
                </p>

                <div className="space-y-1.5 bg-stone-50 p-2.5 rounded border border-stone-200 text-xs">
                  <div className="text-[11px] font-bold text-stone-800">Standard items:</div>
                  <ul className="text-[11px] text-stone-600 space-y-0.5">
                    <li>• Plastic water bottles (flattened)</li>
                    <li>• Notebook paper, exam booklets, cartons</li>
                    <li>• Clean beverage cans &amp; snack cartons</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                <span className="text-xs font-medium text-sky-800 flex items-center gap-1">
                  <span>{activeCategory === 'dry' ? '✓ Showing Dry' : 'Filter Category'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>

                {onNavigateToFinder && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToFinder('dry');
                    }}
                    className="px-2 py-1 rounded bg-sky-700 hover:bg-sky-800 text-white text-[11px] font-medium flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Locate Blue</span>
                  </button>
                )}
              </div>
            </div>

            {/* SPECIAL E-WASTE & HAZARDOUS */}
            <div 
              onClick={() => handleCategorySelectWithScroll('e-waste')}
              className={`rounded-lg p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                activeCategory === 'e-waste' || activeCategory === 'hazardous'
                  ? 'bg-stone-100 border-stone-800 ring-2 ring-stone-800/30 shadow-xs'
                  : 'bg-white hover:bg-stone-50 border-stone-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded bg-stone-800 text-amber-300 flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-200 text-stone-800 font-mono-code">
                    Specialized
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 font-editorial">
                  E-Waste &amp; Hazardous
                </h3>
                <div className="text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                  Designated Drop Boxes
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  Electronic hardware, dead battery cells, light fixtures, and biomedical waste requiring segregated isolation.
                </p>

                <div className="space-y-1.5 bg-stone-50 p-2.5 rounded border border-stone-200 text-xs">
                  <div className="text-[11px] font-bold text-stone-800">Drop locations:</div>
                  <ul className="text-[11px] text-stone-600 space-y-0.5">
                    <li>• Dead batteries &rarr; Computer Center Lab Box</li>
                    <li>• Broken peripherals &rarr; Hardware Lab</li>
                    <li>• Medical waste &rarr; Campus Health Centre Red Bin</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                <span className="text-xs font-medium text-stone-700 flex items-center gap-1">
                  <span>{activeCategory === 'e-waste' ? '✓ Showing Special' : 'Filter Category'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>

                {onNavigateToFinder && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToFinder('e-waste');
                    }}
                    className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-900 text-white text-[11px] font-medium flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Locate Drop</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Catalog Filter Controls Bar */}
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200 shadow-2xs">
              {/* Category Pills (Includes Hazardous) */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-semibold text-stone-500 mr-1 text-[11px] uppercase tracking-wider">
                  Category:
                </span>
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'wet', label: 'Wet (Green)' },
                  { id: 'dry', label: 'Dry (Blue)' },
                  { id: 'e-waste', label: 'E-Waste' },
                  { id: 'hazardous', label: 'Hazardous / Medical' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-md font-medium text-xs transition-colors cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-[#134E3A] text-white shadow-2xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Trait & Sort Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-md border border-stone-200 text-[11px] font-medium">
                  <button
                    onClick={() => setTraitFilter('all')}
                    className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                      traitFilter === 'all' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                    }`}
                  >
                    All Traits
                  </button>
                  <button
                    onClick={() => setTraitFilter('popular')}
                    className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                      traitFilter === 'popular' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                    }`}
                  >
                    Common
                  </button>
                  <button
                    onClick={() => setTraitFilter('recyclable')}
                    className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                      traitFilter === 'recyclable' ? 'bg-white text-sky-900 shadow-2xs' : 'text-stone-600'
                    }`}
                  >
                    Recyclable
                  </button>
                  <button
                    onClick={() => setTraitFilter('biodegradable')}
                    className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                      traitFilter === 'biodegradable' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-stone-600'
                    }`}
                  >
                    Compostable
                  </button>
                </div>

                {/* Sort dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-stone-50 border border-stone-300 rounded-md px-2.5 py-1.5 text-xs font-medium text-stone-700 focus:outline-hidden focus:border-[#134E3A]"
                >
                  <option value="recommended">Sort: Priority</option>
                  <option value="name">Sort: Name (A-Z)</option>
                  <option value="category">Sort: Category</option>
                </select>
              </div>
            </div>

            {/* Smart Classifier Result (When custom search returns no direct catalog matches) */}
            {smartClassification && (
              <div className="p-4 rounded-lg bg-amber-50/90 border border-amber-300 text-stone-900 shadow-2xs space-y-2.5 animate-in fade-in">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-white flex items-center justify-center border border-amber-300 shrink-0">
                      {smartClassification.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 font-mono-code">
                        Recommended Classification
                      </span>
                      <h4 className="text-base font-bold font-editorial">
                        "{searchQuery}" &rarr; {smartClassification.bin}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-medium text-amber-900 hover:text-stone-900 bg-amber-200/60 hover:bg-amber-200 px-2.5 py-1 rounded transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                </div>

                <div className="p-2.5 bg-white rounded border border-amber-200 text-xs space-y-1">
                  <p className="text-stone-700 leading-relaxed">
                    <strong>Standard Rule:</strong> {smartClassification.reason}
                  </p>
                  <p className="text-emerald-900 font-medium leading-relaxed">
                    <strong>Campus Protocol:</strong> {smartClassification.tip}
                  </p>
                </div>
              </div>
            )}

            {/* Active Query Waste Classification Callout */}
            {searchQuery.trim() && filteredItems.length > 0 && (
              <div className="p-4 rounded-lg bg-stone-50 border border-stone-300 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-white border border-stone-300 flex items-center justify-center font-bold text-lg shrink-0">
                    {filteredItems[0].category === 'wet' && '🟢'}
                    {filteredItems[0].category === 'dry' && '🔵'}
                    {filteredItems[0].category === 'e-waste' && '⚡'}
                    {filteredItems[0].category === 'hazardous' && '🔴'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-1.5 py-0.5 rounded font-mono-code">
                        Item Classification
                      </span>
                      <span className="text-xs text-stone-500 font-mono-code">
                        {filteredItems.length} {filteredItems.length === 1 ? 'record' : 'records'} found
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-stone-900 font-editorial mt-0.5">
                      "{searchQuery}" is classified under{' '}
                      <span className="text-[#134E3A] underline underline-offset-2">
                        {filteredItems[0].category === 'wet' && 'Wet Waste (Green Dustbin)'}
                        {filteredItems[0].category === 'dry' && 'Dry Waste (Blue Dustbin)'}
                        {filteredItems[0].category === 'e-waste' && 'E-Waste (Special Drop Box)'}
                        {filteredItems[0].category === 'hazardous' && 'Hazardous / Medical (Red Bin)'}
                      </span>
                    </h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Assigned Container: <strong>{filteredItems[0].binName}</strong> &bull; {filteredItems[0].recyclable ? 'Recyclable' : filteredItems[0].biodegradable ? 'Compostable Organic' : 'Special Protocol'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                  <button
                    onClick={() => handleItemClick(filteredItems[0])}
                    className="px-3 py-1.5 rounded bg-[#134E3A] hover:bg-[#0F3E2E] text-white text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <span>View Guidelines</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setHighlightedItemId(null);
                    }}
                    className="px-2.5 py-1.5 rounded bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-medium cursor-pointer transition-colors"
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
            )}

            {/* Zero Results fallback when no match and no classification */}
            {filteredItems.length === 0 && !smartClassification && (
              <div className="text-center py-12 px-4 bg-white rounded-lg border border-stone-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded bg-stone-100 text-stone-400 mx-auto flex items-center justify-center border border-stone-200">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 font-editorial">
                    No catalog entry found for "{searchQuery}"
                  </h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                    Try searching for common campus items like "plastic", "paper", "mess food", "tea cup", or clear the category filter.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                    setTraitFilter('all');
                    setHighlightedItemId(null);
                  }}
                  className="px-4 py-2 rounded bg-[#134E3A] hover:bg-[#0F3E2E] text-white text-xs font-medium cursor-pointer transition-colors"
                >
                  Reset Filters &amp; View All
                </button>
              </div>
            )}

            {/* Waste Catalog Grid (Target destination for push/scroll) */}
            <div id="waste-catalog-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => {
                const isHighlighted = highlightedItemId === item.id;
                return (
                  <div
                    key={item.id}
                    id={`waste-item-${item.id}`}
                    onClick={() => handleItemClick(item)}
                    className={`bg-white rounded-lg p-4 border transition-all cursor-pointer flex flex-col justify-between group relative ${
                      isHighlighted
                        ? 'border-[#134E3A] ring-2 ring-[#134E3A]/40 shadow-xs bg-emerald-50/20'
                        : 'border-stone-200 shadow-2xs hover:border-stone-400'
                    }`}
                  >
                    <div>
                      {/* Highlighted Banner Callout */}
                      {isHighlighted && (
                        <div className="mb-2 py-0.5 px-2 rounded bg-[#134E3A] text-white text-[10px] font-bold font-mono-code flex items-center justify-between">
                          <span>MATCHED ITEM</span>
                          <span className="uppercase tracking-wider">
                            {item.category === 'wet' && 'Wet Waste'}
                            {item.category === 'dry' && 'Dry Waste'}
                            {item.category === 'e-waste' && 'E-Waste'}
                            {item.category === 'hazardous' && 'Hazardous'}
                          </span>
                        </div>
                      )}

                      {/* Header Badge: Exactly What Kind of Waste It Is */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded inline-flex items-center gap-1 font-mono-code ${
                              item.category === 'wet'
                                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                                : item.category === 'dry'
                                ? 'bg-sky-50 text-sky-900 border border-sky-200'
                                : item.category === 'e-waste'
                                ? 'bg-stone-100 text-stone-800 border border-stone-300'
                                : 'bg-rose-50 text-rose-900 border border-rose-200'
                            }`}
                          >
                            {item.category === 'wet' && 'Wet Waste (Green)'}
                            {item.category === 'dry' && 'Dry Waste (Blue)'}
                            {item.category === 'e-waste' && 'E-Waste (Drop Box)'}
                            {item.category === 'hazardous' && 'Hazardous (Red)'}
                          </span>
                          <span className="text-[10px] font-mono-code text-stone-500">
                            {item.binName}
                          </span>
                        </div>

                        {item.popular && (
                          <span className="text-[10px] font-medium text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 shrink-0">
                            Frequent
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-stone-900 group-hover:text-[#134E3A] transition-colors font-editorial">
                        {item.name}
                      </h4>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      {/* Recyclability & Material Trait Chips */}
                      <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                        {item.recyclable && (
                          <span className="text-[10px] font-medium bg-sky-50 text-sky-800 px-1.5 py-0.5 rounded border border-sky-200 flex items-center gap-1">
                            <Recycle className="w-3 h-3 text-sky-700" />
                            <span>Recyclable</span>
                          </span>
                        )}
                        {item.biodegradable && (
                          <span className="text-[10px] font-medium bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                            <Leaf className="w-3 h-3 text-emerald-700" />
                            <span>Compostable</span>
                          </span>
                        )}
                        {!item.recyclable && !item.biodegradable && (
                          <span className="text-[10px] font-medium bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded border border-stone-200 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-stone-600" />
                            <span>Controlled Protocol</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-100 text-xs flex items-center justify-between">
                      <p className="text-[11px] text-stone-500 truncate pr-2">
                        <span className="font-semibold text-stone-700">Rule: </span>
                        {item.tip}
                      </p>
                      <span className="text-[11px] font-medium text-stone-700 group-hover:text-[#134E3A] transition-colors shrink-0 flex items-center">
                        Details &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Swachhata Campus Pledge Banner */}
      <div className="bg-[#134E3A] rounded-lg p-6 sm:p-7 text-stone-100 border border-[#0F3E2E] flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 font-mono-code">
              Campus Environmental Commitment
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-editorial text-white leading-snug">
            "I pledge to never litter and always segregate waste into Dry and Wet dustbins."
          </h3>
          <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
            Join <strong>{pledgeCount}</strong> students, faculty, and sanitation stewards at NIT Patna who have signed the institutional source segregation charter.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
          {pledgeTaken ? (
            <>
              <button
                onClick={() => setIsCertificateOpen(true)}
                className="px-4 py-2.5 rounded bg-white text-stone-900 hover:bg-stone-100 font-semibold text-xs tracking-wide transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="w-4 h-4 text-[#134E3A]" />
                <span>View Certificate</span>
              </button>

              <button
                onClick={() => setIsPledgeFormOpen(true)}
                className="p-2.5 rounded bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-semibold cursor-pointer transition-colors"
                title="Edit Pledge Info"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              id="btn-take-pledge"
              onClick={() => setIsPledgeFormOpen(true)}
              className="px-4 py-2.5 rounded bg-white text-stone-900 hover:bg-stone-100 font-semibold text-xs tracking-wide transition-colors shadow-2xs cursor-pointer"
            >
              Sign Campus Swachhata Pledge
            </button>
          )}
        </div>
      </div>

      {/* Modal: Take Pledge Form */}
      {isPledgeFormOpen && (
        <div 
          className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPledgeFormOpen(false);
          }}
        >
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-[#134E3A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-white/15 flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm font-editorial">
                    Campus Swachhata Pledge
                  </h3>
                  <span className="text-[11px] text-emerald-200">
                    NIT Patna Clean Campus Chapter
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsPledgeFormOpen(false)}
                className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmPledge} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Full Name:
                </label>
                <input
                  type="text"
                  required
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-xs font-medium text-stone-800 focus:outline-hidden focus:border-[#134E3A]"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Department / Hostel / Designation:
                </label>
                <input
                  type="text"
                  value={tempDept}
                  onChange={(e) => setTempDept(e.target.value)}
                  placeholder="e.g. Computer Science (3rd Year) / Kosi Hostel"
                  className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-xs font-medium text-stone-800 focus:outline-hidden focus:border-[#134E3A]"
                />
              </div>

              <div className="p-3 rounded-md bg-stone-50 border border-stone-200 space-y-1.5">
                <span className="font-semibold text-stone-800 block text-[11px] uppercase tracking-wider">Pledge Declaration</span>
                <p className="text-stone-700 leading-relaxed italic text-[11px]">
                  "I solemnly pledge to keep my university campus clean. I will never litter pathways or lawns, always separate dry and wet waste at the source, and actively motivate my peers to uphold Swachh Bharat ideals."
                </p>

                <label className="flex items-center gap-2 pt-1 font-semibold text-stone-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={pledgeAgreement}
                    onChange={(e) => setPledgeAgreement(e.target.checked)}
                    className="w-4 h-4 rounded text-[#134E3A] accent-[#134E3A]"
                  />
                  <span>I agree and commit to this campus charter</span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsPledgeFormOpen(false)}
                  className="px-3.5 py-1.5 font-medium text-stone-600 hover:bg-stone-100 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!pledgeAgreement || !tempName.trim()}
                  className="px-4 py-1.5 font-semibold text-white bg-[#134E3A] hover:bg-[#0F3E2E] disabled:opacity-50 rounded-md shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm &amp; Issue Certificate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Item Detail View */}
      <WasteItemDetailModal
        item={selectedItem}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onNavigateToFinder={onNavigateToFinder}
        onNavigateToMap={onNavigateToMap}
        onOpenReportModal={onOpenReportModal}
        bins={bins}
      />

      {/* Modal: Official Pledge Certificate */}
      <PledgeCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        pledgeName={pledgeName}
        pledgeDept={pledgeDept}
        pledgeDate={pledgeDate}
        onResetPledge={handleResetPledge}
      />
    </div>
  );
};
