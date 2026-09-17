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

  // Initialize pledge from localStorage
  useEffect(() => {
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

    localStorage.setItem('swachh_campus_pledge_taken', 'true');
    localStorage.setItem('swachh_campus_pledge_name', finalName);
    localStorage.setItem('swachh_campus_pledge_dept', finalDept);
    localStorage.setItem('swachh_campus_pledge_date', today);
    localStorage.setItem('swachh_campus_pledge_count', String(newCount));

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
    localStorage.removeItem('swachh_campus_pledge_taken');
    localStorage.removeItem('swachh_campus_pledge_name');
    localStorage.removeItem('swachh_campus_pledge_dept');
    localStorage.removeItem('swachh_campus_pledge_date');

    setPledgeTaken(false);
    setPledgeName('');
    setPledgeDept('');
    setPledgeDate('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-sky-800 rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Swachh Bharat Abhiyan • 2-Bin Source Segregation</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-['Outfit',sans-serif]">
            Campus Waste Segregation Portal
          </h2>
          <p className="text-slate-100/90 text-sm sm:text-base mt-2 leading-relaxed">
            Waste segregated at the source is 90% recyclable. Explore dustbin color codes, search items, and test your knowledge.
          </p>

          {/* Sub-Navigation Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setGuideSubView('catalog')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                guideSubView === 'catalog'
                  ? 'bg-white text-emerald-950 scale-102'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Waste Catalog & Search</span>
            </button>

            <button
              onClick={() => setGuideSubView('quiz')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                guideSubView === 'quiz'
                  ? 'bg-white text-emerald-950 scale-102'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>Segregation Challenge Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Switching */}
      {guideSubView === 'quiz' && <WasteQuiz />}

      {guideSubView === 'catalog' && (
        <>
          {/* Quick Search Bar & Keyword Chips */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="input-waste-search"
                type="text"
                placeholder="Search any waste item (e.g. banana peel, plastic bottle, tea bag, chips wrapper, batteries)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleOptionSelect(searchQuery);
                  }
                }}
                className="w-full bg-slate-50 text-slate-900 rounded-2xl pl-12 pr-28 py-3.5 text-sm sm:text-base font-medium border border-slate-200 focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setHighlightedItemId(null);
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-200/80 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
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
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Find
                </button>
              </div>
            </div>

            {/* Quick Keyword Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-bold mr-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Try searching:</span>
              </span>
              {popularChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleOptionSelect(chip)}
                  className={`px-3 py-1 rounded-xl font-medium border transition-all cursor-pointer ${
                    searchQuery.toLowerCase() === chip.toLowerCase()
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs scale-105'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive 3 Master Color Bin Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* GREEN BIN - WET WASTE */}
            <div 
              onClick={() => handleCategorySelectWithScroll('wet')}
              className={`rounded-3xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                activeCategory === 'wet'
                  ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-400/20 shadow-md'
                  : 'bg-emerald-50/60 hover:bg-emerald-50 border-emerald-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-200/80 text-emerald-900">
                    Biodegradable
                  </span>
                </div>

                <h3 className="text-xl font-bold text-emerald-950 font-['Outfit',sans-serif]">
                  🟢 Green Dustbin
                </h3>
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                  Wet Waste / Gila Kachra
                </div>

                <p className="text-xs text-emerald-900/80 leading-relaxed mb-4">
                  All organic food scraps, canteen leftovers, and leaves that decompose into vermicompost.
                </p>

                <div className="space-y-2 bg-white/80 p-3 rounded-2xl border border-emerald-200">
                  <div className="text-xs font-bold text-emerald-950">✅ Common examples:</div>
                  <ul className="text-xs text-emerald-900 space-y-1">
                    <li>• Canteen food scraps, roti & mess rice</li>
                    <li>• Fruit peels, tea bags & coffee grounds</li>
                    <li>• Lawn clippings & flower petals</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <span>{activeCategory === 'wet' ? '✓ Showing Wet' : 'Filter Wet'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>

                {onNavigateToFinder && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToFinder('wet');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-all"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Find Green Bin</span>
                  </button>
                )}
              </div>
            </div>

            {/* BLUE BIN - DRY WASTE */}
            <div 
              onClick={() => handleCategorySelectWithScroll('dry')}
              className={`rounded-3xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                activeCategory === 'dry'
                  ? 'bg-sky-50 border-sky-500 ring-4 ring-sky-400/20 shadow-md'
                  : 'bg-sky-50/60 hover:bg-sky-50 border-sky-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20">
                    <Recycle className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-200/80 text-sky-900">
                    Recyclable
                  </span>
                </div>

                <h3 className="text-xl font-bold text-sky-950 font-['Outfit',sans-serif]">
                  🔵 Blue Dustbin
                </h3>
                <div className="text-xs font-bold text-sky-800 uppercase tracking-wider mb-2">
                  Dry Waste / Sookha Kachra
                </div>

                <p className="text-xs text-sky-900/80 leading-relaxed mb-4">
                  Clean packaging, paper, plastic bottles, boxes, and metal cans processed by city recycling mills.
                </p>

                <div className="space-y-2 bg-white/80 p-3 rounded-2xl border border-sky-200">
                  <div className="text-xs font-bold text-sky-950">✅ Common examples:</div>
                  <ul className="text-xs text-sky-900 space-y-1">
                    <li>• Plastic water bottles (crushed)</li>
                    <li>• Notebook paper, printouts & cartons</li>
                    <li>• Snack wrappers & cold drink cans</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-sky-200 flex items-center justify-between">
                <span className="text-xs font-bold text-sky-700 flex items-center gap-1">
                  <span>{activeCategory === 'dry' ? '✓ Showing Dry' : 'Filter Dry'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>

                {onNavigateToFinder && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToFinder('dry');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-all"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Find Blue Bin</span>
                  </button>
                )}
              </div>
            </div>

            {/* SPECIAL E-WASTE & HAZARDOUS */}
            <div 
              onClick={() => handleCategorySelectWithScroll('e-waste')}
              className={`rounded-3xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                activeCategory === 'e-waste' || activeCategory === 'hazardous'
                  ? 'bg-slate-100 border-slate-700 ring-4 ring-slate-400/20 shadow-md'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center shadow-md">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-900">
                    Special Care
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                  ⚡ E-Waste & Red Bins
                </h3>
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  IT Wing Drop & Health Centre
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Electronic hardware, dead batteries, CFL tubes, and sealed sanitary/biomedical materials.
                </p>

                <div className="space-y-2 bg-white/80 p-3 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-800">✅ Deposit here:</div>
                  <ul className="text-xs text-slate-700 space-y-1">
                    <li>• Dead AA/AAA & button batteries</li>
                    <li>• Broken USB cables & earphones</li>
                    <li>• Medical bandages & wrapped sanitary pads</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <span>{activeCategory === 'e-waste' ? '✓ Showing E-Waste' : 'Filter Special'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>

                {onNavigateToFinder && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToFinder('e-waste');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-900 text-amber-300 text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-all"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Find Drop Box</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Catalog Filter Controls Bar */}
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm">
              {/* Category Pills (Includes Hazardous) */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-bold text-slate-500 mr-1 text-[11px] uppercase tracking-wider">
                  Category:
                </span>
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'wet', label: '🟢 Wet (Green)' },
                  { id: 'dry', label: '🔵 Dry (Blue)' },
                  { id: 'e-waste', label: '⚡ E-Waste' },
                  { id: 'hazardous', label: '🔴 Hazardous / Red' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-slate-900 text-white shadow-xs scale-102'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Trait & Sort Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px] font-semibold">
                  <button
                    onClick={() => setTraitFilter('all')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                      traitFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    All Traits
                  </button>
                  <button
                    onClick={() => setTraitFilter('popular')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                      traitFilter === 'popular' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    ⭐ Common
                  </button>
                  <button
                    onClick={() => setTraitFilter('recyclable')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                      traitFilter === 'recyclable' ? 'bg-white text-sky-800 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    ♻️ Recyclable
                  </button>
                  <button
                    onClick={() => setTraitFilter('biodegradable')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                      traitFilter === 'biodegradable' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    🌱 Compostable
                  </button>
                </div>

                {/* Sort dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-hidden"
                >
                  <option value="recommended">Sort: Recommended</option>
                  <option value="name">Sort: Name (A-Z)</option>
                  <option value="category">Sort: Category</option>
                </select>
              </div>
            </div>

            {/* Smart Classifier Result (When custom search returns no direct catalog matches) */}
            {smartClassification && (
              <div className="p-5 rounded-3xl bg-amber-50/80 border-2 border-amber-300 text-slate-900 shadow-sm space-y-3 animate-in fade-in">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center border border-amber-300">
                      {smartClassification.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                        Instant SBM Segregation Recommendation
                      </span>
                      <h4 className="text-base sm:text-lg font-black font-['Outfit',sans-serif]">
                        "{searchQuery}" belongs in: {smartClassification.bin}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-200/70 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                  >
                    Clear Search
                  </button>
                </div>

                <div className="p-3 bg-white/90 rounded-2xl border border-amber-200 text-xs space-y-1">
                  <p className="text-slate-700 font-medium leading-relaxed">
                    <strong>Rule:</strong> {smartClassification.reason}
                  </p>
                  <p className="text-emerald-800 font-semibold leading-relaxed">
                    💡 <strong>Proper Handling:</strong> {smartClassification.tip}
                  </p>
                </div>
              </div>
            )}

            {/* Active Query Waste Classification Callout */}
            {searchQuery.trim() && filteredItems.length > 0 && (
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-500/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                    {filteredItems[0].category === 'wet' && '🟢'}
                    {filteredItems[0].category === 'dry' && '🔵'}
                    {filteredItems[0].category === 'e-waste' && '⚡'}
                    {filteredItems[0].category === 'hazardous' && '🔴'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md">
                        What Kind of Waste Is It?
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {filteredItems.length} {filteredItems.length === 1 ? 'match' : 'matches'} found
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit',sans-serif] mt-0.5">
                      "{searchQuery}" is classified as{' '}
                      <span className="text-emerald-700 underline underline-offset-2">
                        {filteredItems[0].category === 'wet' && 'Wet Waste / Gila Kachra (Green Bin)'}
                        {filteredItems[0].category === 'dry' && 'Dry Waste / Sookha Kachra (Blue Bin)'}
                        {filteredItems[0].category === 'e-waste' && 'E-Waste / IT Hardware (Special Drop)'}
                        {filteredItems[0].category === 'hazardous' && 'Hazardous / Medical Waste (Red Bin)'}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Recommended disposal: <strong>{filteredItems[0].binName}</strong> &bull; {filteredItems[0].recyclable ? '♻️ 100% Recyclable' : filteredItems[0].biodegradable ? '🌱 Biodegradable Compost' : '⚠️ Special handling protocol'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                  <button
                    onClick={() => handleItemClick(filteredItems[0])}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <span>Inspect Full Guide</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setHighlightedItemId(null);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer transition-all"
                  >
                    Clear Filter
                  </button>
                </div>
              </div>
            )}

            {/* Zero Results fallback when no match and no classification */}
            {filteredItems.length === 0 && !smartClassification && (
              <div className="text-center py-12 px-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Search className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800 font-['Outfit',sans-serif]">
                    No specific catalog item found for "{searchQuery}"
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Try searching for common terms like "plastic", "paper", "food", "cup", or reset your category filter.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                    setTraitFilter('all');
                    setHighlightedItemId(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                >
                  Reset Filters & View All
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
                    className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                      isHighlighted
                        ? 'border-emerald-500 ring-4 ring-emerald-500/40 shadow-xl scale-[1.02] bg-emerald-50/40'
                        : 'border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-400/60'
                    }`}
                  >
                    <div>
                      {/* Highlighted Banner Callout */}
                      {isHighlighted && (
                        <div className="mb-2.5 py-1 px-2.5 rounded-lg bg-emerald-600 text-white text-[11px] font-black flex items-center justify-between animate-pulse">
                          <span>🎯 Selected Waste Item</span>
                          <span className="uppercase tracking-wider">
                            {item.category === 'wet' && '🟢 Wet Waste'}
                            {item.category === 'dry' && '🔵 Dry Waste'}
                            {item.category === 'e-waste' && '⚡ E-Waste'}
                            {item.category === 'hazardous' && '🔴 Hazardous'}
                          </span>
                        </div>
                      )}

                      {/* Header Badge: Exactly What Kind of Waste It Is */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg inline-flex items-center gap-1 shadow-2xs ${
                              item.category === 'wet'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : item.category === 'dry'
                                ? 'bg-sky-100 text-sky-900 border border-sky-300'
                                : item.category === 'e-waste'
                                ? 'bg-slate-800 text-amber-300 border border-slate-700'
                                : 'bg-rose-100 text-rose-900 border border-rose-300'
                            }`}
                          >
                            {item.category === 'wet' && '🟢 WET WASTE (GILA KACHRA)'}
                            {item.category === 'dry' && '🔵 DRY WASTE (SOOKHA KACHRA)'}
                            {item.category === 'e-waste' && '⚡ E-WASTE & ELECTRONIC'}
                            {item.category === 'hazardous' && '🔴 HAZARDOUS / MEDICAL'}
                          </span>
                          <span className="text-[11px] font-bold text-slate-700">
                            Disposal: {item.binName}
                          </span>
                        </div>

                        {item.popular && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md shrink-0">
                            ⭐ Common
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors font-['Outfit',sans-serif]">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      {/* Recyclability & Material Trait Chips */}
                      <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                        {item.recyclable && (
                          <span className="text-[10px] font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md border border-sky-200 flex items-center gap-1">
                            <Recycle className="w-3 h-3 text-sky-600" />
                            <span>Recyclable</span>
                          </span>
                        )}
                        {item.biodegradable && (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                            <Leaf className="w-3 h-3 text-emerald-600" />
                            <span>Compostable</span>
                          </span>
                        )}
                        {!item.recyclable && !item.biodegradable && (
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <span>Special Handling</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs bg-slate-50/80 -mx-4 -mb-4 p-3 rounded-b-2xl flex items-center justify-between">
                      <p className="text-[11px] text-slate-600 truncate pr-2">
                        <span className="font-bold text-slate-700">Rule: </span>
                        {item.tip}
                      </p>
                      <span className="text-[11px] font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform shrink-0 flex items-center">
                        View Details
                        <ChevronRight className="w-3 h-3 ml-0.5" />
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
      <div className="bg-gradient-to-br from-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
              National Clean Campus Commitment
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-['Outfit',sans-serif]">
            "I pledge to never litter and always segregate waste into Dry & Wet dustbins."
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
            Join <strong>{pledgeCount}</strong> students, faculty, and sanitation staff at NIT Patna who have committed to source segregation discipline under the Swachh Bharat Mission.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          {pledgeTaken ? (
            <>
              <button
                onClick={() => setIsCertificateOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 font-black text-xs sm:text-sm tracking-wide transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
              >
                <Award className="w-4 h-4 text-emerald-600" />
                <span>View Official Certificate</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Do you want to retake or edit your pledge?')) {
                    setIsPledgeFormOpen(true);
                  }
                }}
                className="px-3.5 py-3 rounded-2xl bg-emerald-800/80 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                title="Edit Pledge Info"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              id="btn-take-pledge"
              onClick={() => setIsPledgeFormOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 hover:scale-105 active:scale-95 font-black text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-emerald-900/30 cursor-pointer"
            >
              Take the Swachhata Pledge ✍️
            </button>
          )}
        </div>
      </div>

      {/* Modal: Take Pledge Form */}
      {isPledgeFormOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPledgeFormOpen(false);
          }}
        >
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base font-['Outfit',sans-serif]">
                    Take the Swachhata Pledge
                  </h3>
                  <span className="text-[11px] text-emerald-200">
                    National Clean Campus Chapter
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsPledgeFormOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmPledge} className="p-5 sm:p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Your Full Name:
                </label>
                <input
                  type="text"
                  required
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Department / Hostel / Role:
                </label>
                <input
                  type="text"
                  value={tempDept}
                  onChange={(e) => setTempDept(e.target.value)}
                  placeholder="e.g. Computer Science (3rd Year) / Kosi Hostel"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-2">
                <span className="font-bold text-emerald-950 block">Pledge Statement:</span>
                <p className="text-emerald-900 leading-relaxed italic">
                  "I solemnly pledge to keep my university campus clean. I will never throw trash on paths or lawns, always separate dry and wet waste at the source, and actively motivate my peers to uphold Swachh Bharat ideals."
                </p>

                <label className="flex items-center gap-2 pt-1 font-bold text-emerald-950 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={pledgeAgreement}
                    onChange={(e) => setPledgeAgreement(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                  />
                  <span>I agree and commit to this green charter</span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPledgeFormOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!pledgeAgreement || !tempName.trim()}
                  className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm & Issue Certificate</span>
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
