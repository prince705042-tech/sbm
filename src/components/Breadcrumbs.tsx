import React from 'react';
import { ChevronRight, Home, MapPin, Compass, BookOpen, AlertCircle, Award } from 'lucide-react';
import { AppRoute, ROUTE_METADATA } from '../utils/seo';

interface BreadcrumbsProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  subItemName?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentRoute,
  onNavigate,
  subItemName,
}) => {
  const currentMeta = ROUTE_METADATA[currentRoute] || ROUTE_METADATA.map;

  const getRouteIcon = (r: AppRoute) => {
    switch (r) {
      case 'map':
        return <MapPin className="w-3.5 h-3.5 text-stone-500" />;
      case 'finder':
        return <Compass className="w-3.5 h-3.5 text-stone-500" />;
      case 'guide':
        return <BookOpen className="w-3.5 h-3.5 text-stone-500" />;
      case 'alerts':
        return <AlertCircle className="w-3.5 h-3.5 text-stone-500" />;
      case 'pledge':
        return <Award className="w-3.5 h-3.5 text-stone-500" />;
      default:
        return null;
    }
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="py-2.5 mb-3"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-stone-600 font-medium">
        {/* Home item */}
        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
          className="flex items-center"
        >
          <button
            type="button"
            onClick={() => onNavigate('map')}
            className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-600 rounded px-1"
            title="Return to Campus Map & Overview"
          >
            <Home className="w-3.5 h-3.5 text-stone-500" />
            <span itemProp="name">Swachh Campus</span>
          </button>
          <meta itemProp="position" content="1" />
          <meta itemProp="item" content="https://swachh.nitp.ac.in/" />
        </li>

        {/* Separator */}
        <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" aria-hidden="true" />

        {/* Current Primary Route */}
        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
          className="flex items-center"
        >
          {subItemName ? (
            <>
              <button
                type="button"
                onClick={() => onNavigate(currentRoute)}
                className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-600 rounded px-1"
              >
                {getRouteIcon(currentRoute)}
                <span itemProp="name">{currentMeta.breadcrumbLabel}</span>
              </button>
              <meta itemProp="position" content="2" />
              <meta itemProp="item" content={`https://swachh.nitp.ac.in${currentMeta.slug}`} />
            </>
          ) : (
            <span
              className="flex items-center gap-1.5 text-stone-900 font-semibold bg-stone-100 border border-stone-200/80 rounded px-2 py-0.5"
              aria-current="page"
            >
              {getRouteIcon(currentRoute)}
              <span itemProp="name">{currentMeta.breadcrumbLabel}</span>
              <meta itemProp="position" content="2" />
              <meta itemProp="item" content={`https://swachh.nitp.ac.in${currentMeta.slug}`} />
            </span>
          )}
        </li>

        {/* Sub-item if applicable (e.g. selected bin or ticket) */}
        {subItemName && (
          <>
            <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" aria-hidden="true" />
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="flex items-center"
            >
              <span
                className="text-stone-900 font-semibold bg-stone-100 border border-stone-200/80 rounded px-2 py-0.5 truncate max-w-[240px]"
                aria-current="page"
                title={subItemName}
              >
                <span itemProp="name">{subItemName}</span>
                <meta itemProp="position" content="3" />
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};
