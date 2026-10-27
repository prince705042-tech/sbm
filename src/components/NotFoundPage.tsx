import React, { useState } from 'react';
import { MapPin, Compass, BookOpen, AlertCircle, ArrowLeft, Search, Building2, HelpCircle } from 'lucide-react';
import { AppRoute } from '../utils/seo';

interface NotFoundPageProps {
  onNavigate: (route: AppRoute) => void;
  onSearchCampusZone?: (term: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate, onSearchCampusZone }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const quickLinks: { route: AppRoute; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      route: 'map',
      label: 'Interactive Campus Map',
      desc: 'Browse all 18+ color-coded dry & wet waste bins across academic and hostel sectors.',
      icon: <MapPin className="w-5 h-5 text-emerald-700" />,
    },
    {
      route: 'finder',
      label: 'Nearest Dustbin Finder',
      desc: 'Calculate walking distances and directions to the closest functional segregation unit.',
      icon: <Compass className="w-5 h-5 text-blue-700" />,
    },
    {
      route: 'guide',
      label: 'Waste Segregation Guide',
      desc: 'Official MoHUA 2026 waste categorization standards and interactive 3D handbook.',
      icon: <BookOpen className="w-5 h-5 text-amber-700" />,
    },
    {
      route: 'alerts',
      label: 'Sanitation Grievance Portal',
      desc: 'View public sanitation reports, submit maintenance requests, or check cleaning logs.',
      icon: <AlertCircle className="w-5 h-5 text-rose-700" />,
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (onSearchCampusZone) {
        onSearchCampusZone(searchTerm.trim());
      }
      onNavigate('map');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-10 shadow-xs text-stone-900">
        {/* Error header */}
        <div className="border-b border-stone-200 pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            HTTP 404 · Resource Not Found
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
            Campus Page or Resource Not Found
          </h1>
          <p className="mt-2 text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl">
            The link you followed may be outdated, or the campus sanitation page might have moved. Use the quick links below or search for any building to locate disposal stations.
          </p>
        </div>

        {/* Quick search */}
        <div className="mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search department, hostel, or lab (e.g. Kosi, SAC, Chemistry)..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-900"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Locate on Map</span>
            </button>
          </form>
        </div>

        {/* Primary directory destinations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {quickLinks.map((item) => (
            <button
              key={item.route}
              type="button"
              onClick={() => onNavigate(item.route)}
              className="text-left p-4 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100/80 hover:border-stone-300 transition-all flex items-start gap-3.5 group focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <div className="p-2 bg-white rounded-md border border-stone-200 shrink-0 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-stone-900 group-hover:text-emerald-900 flex items-center gap-1.5">
                  <span>{item.label}</span>
                </div>
                <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Institutional footer line */}
        <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-stone-400 shrink-0" />
            <span>Estate & Sanitation Wing · National Institute of Technology Patna</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('map')}
            className="inline-flex items-center gap-1.5 font-medium text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Campus Overview</span>
          </button>
        </div>
      </div>
    </div>
  );
};
