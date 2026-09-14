import React, { useState, useMemo } from 'react';
import { WASTE_SEGREGATION_ITEMS } from '../data/campusData';
import { WasteItem } from '../types';
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
  Award
} from 'lucide-react';

export const WasteSegregationGuide: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'wet' | 'dry' | 'e-waste' | 'hazardous'>('all');
  const [pledgeTaken, setPledgeTaken] = useState(false);
  const [pledgeCount, setPledgeCount] = useState(384);

  const filteredItems = useMemo(() => {
    return WASTE_SEGREGATION_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tip.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const handleTakePledge = () => {
    if (!pledgeTaken) {
      setPledgeTaken(true);
      setPledgeCount((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Banner with Swachh Bharat principles */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-sky-800 rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Swachh Bharat Abhiyan • 2-Bin Segregation Guide</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-['Outfit',sans-serif]">
            What goes into which bin?
          </h2>
          <p className="text-slate-100/90 text-sm sm:text-base mt-2 leading-relaxed">
            Waste segregated at the source is 90% recyclable. Search any item below to know the exact bin, disposal tips, and environmental impact.
          </p>

          {/* Quick Search Input */}
          <div className="mt-6 relative max-w-xl">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="input-waste-search"
              type="text"
              placeholder="Search waste item (e.g. banana peel, plastic bottle, tea bag, chips wrapper)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-900 rounded-2xl pl-12 pr-4 py-3.5 text-sm sm:text-base font-medium shadow-lg border-2 border-transparent focus:border-emerald-400 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded-md"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Side-by-side Visual Color Bin Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GREEN BIN - WET WASTE */}
        <div className="bg-emerald-50/70 rounded-3xl p-6 border-2 border-emerald-300 flex flex-col justify-between">
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
              All organic and biodegradable matter that decomposes naturally into rich soil compost.
            </p>

            <div className="space-y-2 bg-white/80 p-3 rounded-2xl border border-emerald-200">
              <div className="text-xs font-bold text-emerald-950">✅ What goes in:</div>
              <ul className="text-xs text-emerald-900 space-y-1">
                <li>• Leftover canteen food, rice, roti & curries</li>
                <li>• Banana & fruit peels, rotten fruits</li>
                <li>• Chai tea leaves, coffee grounds</li>
                <li>• Egg shells, coconut shells</li>
                <li>• Garden leaves & flower clippings</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/80 text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Feeds the campus vermicomposting pit</span>
          </div>
        </div>

        {/* BLUE BIN - DRY WASTE */}
        <div className="bg-sky-50/70 rounded-3xl p-6 border-2 border-sky-300 flex flex-col justify-between">
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
              Non-biodegradable, clean and dry materials that can be baled and processed into new products.
            </p>

            <div className="space-y-2 bg-white/80 p-3 rounded-2xl border border-sky-200">
              <div className="text-xs font-bold text-sky-950">✅ What goes in:</div>
              <ul className="text-xs text-sky-900 space-y-1">
                <li>• Plastic water bottles (empty & crushed)</li>
                <li>• Notebook papers, assignment drafts, cartons</li>
                <li>• Snack & biscuit wrappers (crumbs wiped)</li>
                <li>• Disposable paper / plastic cups</li>
                <li>• Soda & cold drink aluminum cans</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-sky-200/80 text-[11px] font-semibold text-sky-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Sent to certified city recycling mills</span>
          </div>
        </div>

        {/* SPECIAL E-WASTE & HAZARDOUS */}
        <div className="bg-slate-50 rounded-3xl p-6 border-2 border-slate-300 flex flex-col justify-between">
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
              ⚡ E-Waste & Safe Drop
            </h3>
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Specialized Bins (Block A IT Wing)
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Electronic parts and hazardous sanitary materials that should NEVER enter general bins.
            </p>

            <div className="space-y-2 bg-white/80 p-3 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold text-slate-800">✅ Deposit here:</div>
              <ul className="text-xs text-slate-700 space-y-1">
                <li>• Dead AA/AAA/Button batteries</li>
                <li>• Broken phone chargers & USB wires</li>
                <li>• Frayed earphones & mouse peripherals</li>
                <li>• Tube lights & fluorescent bulbs</li>
                <li>• Wrapped sanitary pads (Red bin only)</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Prevents toxic chemicals in groundwater</span>
          </div>
        </div>
      </div>

      {/* Item Database Cards */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
            Campus Waste Catalog ({filteredItems.length} items)
          </h3>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/70 text-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setActiveCategory('wet')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeCategory === 'wet'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              Wet (Green)
            </button>
            <button
              onClick={() => setActiveCategory('dry')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeCategory === 'dry'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-sky-700 hover:bg-sky-50'
              }`}
            >
              Dry (Blue)
            </button>
            <button
              onClick={() => setActiveCategory('e-waste')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeCategory === 'e-waste'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              E-Waste
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      item.binColor === 'green'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : item.binColor === 'blue'
                        ? 'bg-sky-100 text-sky-800 border border-sky-200'
                        : item.binColor === 'red'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-slate-800 text-amber-300'
                    }`}
                  >
                    {item.binName}
                  </span>
                  {item.popular && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      Common
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs bg-slate-50 -mx-4 -mb-4 p-3 rounded-b-2xl">
                <span className="font-bold text-slate-700 block mb-0.5">Disposal Tip:</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">{item.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Swachhata Campus Pledge Banner */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
              Swachh Campus Pledge
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-['Outfit',sans-serif]">
            "I pledge to never litter and always segregate waste into Dry & Wet bins."
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
            Join <strong>{pledgeCount}</strong> students, teachers, and campus staff who have committed to keeping our institution clean under the Swachh Bharat Mission.
          </p>
        </div>

        <button
          id="btn-take-pledge"
          onClick={handleTakePledge}
          disabled={pledgeTaken}
          className={`shrink-0 px-6 py-3.5 rounded-2xl font-black text-sm tracking-wide transition-all shadow-md ${
            pledgeTaken
              ? 'bg-emerald-800 text-emerald-200 cursor-default'
              : 'bg-white text-emerald-900 hover:bg-emerald-50 hover:scale-105 active:scale-95 shadow-emerald-900/30'
          }`}
        >
          {pledgeTaken ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              Pledge Taken!
            </span>
          ) : (
            <span>Take the Swachhata Pledge ✍️</span>
          )}
        </button>
      </div>
    </div>
  );
};
