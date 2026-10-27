/**
 * Institutional SEO & Dynamic Metadata Engine
 * Swachh Bharat Mission (Urban) - National Institute of Technology Patna
 */

export const INSTITUTIONAL_DOMAIN = 'https://swachh.nitp.ac.in';

export type AppRoute = 'map' | 'finder' | 'guide' | 'alerts' | 'pledge' | 'not_found';

export interface RouteMeta {
  slug: string;
  title: string;
  description: string;
  heading: string;
  subheading: string;
  badge: string;
  breadcrumbLabel: string;
}

export const ROUTE_METADATA: Record<AppRoute, RouteMeta> = {
  map: {
    slug: '/map',
    title: 'Interactive Campus Dustbin Locator & Live Map | Swachh Campus NIT Patna',
    description: 'Explore live geospatial dry and wet waste segregation dustbins across NIT Patna Ashok Rajpath campus with real-time status and fill levels.',
    heading: 'NIT Patna Campus Dustbin Locator & Zone Directory',
    subheading: 'Official Swachh Bharat Mission segregation network across academic, lab, administrative, and hostel sectors.',
    badge: 'Geospatial Registry',
    breadcrumbLabel: 'Campus Map & Bin Directory',
  },
  finder: {
    slug: '/finder',
    title: 'Nearest Dustbin Finder & Walking Route | Swachh Campus NIT Patna',
    description: 'Calculate walking distances and find the nearest operational dry, wet, or dual segregation waste bin from your current campus building.',
    heading: 'Find Nearest Dustbin & Disposal Station',
    subheading: 'Instant proximity calculations for academic departments, hostels, laboratories, and common student facilities.',
    badge: 'Proximity Engine',
    breadcrumbLabel: 'Nearest Bin Finder',
  },
  guide: {
    slug: '/guide',
    title: 'Campus Waste Segregation Rules & 3D Handbook | Swachh Campus NIT Patna',
    description: 'MoHUA-aligned campus waste segregation guidelines for biodegradable wet waste, recyclable dry items, biomedical waste, and electronic discards.',
    heading: 'Campus Solid Waste Segregation & Disposal Guide',
    subheading: 'Standard operating procedures for campus source segregation, bin color standards, and circular resource recovery.',
    badge: 'MoHUA Guidelines',
    breadcrumbLabel: 'Segregation Handbook',
  },
  alerts: {
    slug: '/alerts',
    title: 'Sanitation Grievances & SBM Admin Command Desk | Swachh Campus NIT Patna',
    description: 'Live public sanitation complaints, overflowing bin incident logs, cleaning crew dispatching, and administrative grievance redressal.',
    heading: 'Sanitation Grievance Portal & Maintenance Desk',
    subheading: 'Transparent ticket tracking system with real-time cleaning dispatch and municipal audit report generation.',
    badge: 'Civic Grievance Board',
    breadcrumbLabel: 'Sanitation Grievances',
  },
  pledge: {
    slug: '/pledge',
    title: 'National Swachhata Pledge & Certificate | Swachh Campus NIT Patna',
    description: 'Take the official national Swachhata Pledge, dedicate 100 hours annually towards cleanliness, and generate your certified institutional credential.',
    heading: 'Official Swachhata Pledge & Institutional Certification',
    subheading: 'Uphold the mission of Mahatma Gandhi and join thousands of NIT Patna students and faculty committed to a litter-free India.',
    badge: 'National Pledge',
    breadcrumbLabel: 'Swachhata Pledge',
  },
  not_found: {
    slug: '/404',
    title: '404 - Page Not Found | Swachh Campus NIT Patna',
    description: 'The requested campus sanitation page or facility resource does not exist. Navigate back to the campus map, bin finder, or waste guide.',
    heading: '404 - Requested Campus Page Not Found',
    subheading: 'The URL entered does not correspond to an active portal route or campus sanitation resource.',
    badge: 'Error 404',
    breadcrumbLabel: 'Page Not Found',
  },
};

/**
 * Resolves current route from window.location.pathname and search
 */
export function resolveCurrentRoute(): AppRoute {
  if (typeof window === 'undefined') return 'map';

  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';

  if (path === '/' || path === '/map' || path.endsWith('/map') || path.endsWith('/index.html')) {
    return 'map';
  }
  if (path === '/finder' || path.endsWith('/finder')) {
    return 'finder';
  }
  if (path === '/guide' || path.endsWith('/guide')) {
    return 'guide';
  }
  if (path === '/alerts' || path.endsWith('/alerts')) {
    return 'alerts';
  }
  if (path === '/pledge' || path.endsWith('/pledge')) {
    return 'pledge';
  }

  // Check URL hash if history API fallback is present
  const hash = window.location.hash.toLowerCase().replace('#', '');
  if (hash === 'map') return 'map';
  if (hash === 'finder') return 'finder';
  if (hash === 'guide') return 'guide';
  if (hash === 'alerts') return 'alerts';
  if (hash === 'pledge') return 'pledge';

  return 'not_found';
}

/**
 * Updates DOM title, meta tags, and canonical link
 */
export function applyRouteSEO(route: AppRoute): void {
  if (typeof document === 'undefined') return;

  const meta = ROUTE_METADATA[route] || ROUTE_METADATA.map;
  const canonicalUrl = `${INSTITUTIONAL_DOMAIN}${meta.slug === '/map' ? '' : meta.slug}`;

  // 1. Set document title
  document.title = meta.title;

  // 2. Helper to set or create meta tag
  const setMeta = (selector: string, attr: string, value: string) => {
    let el = document.querySelector(selector) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      const [key, val] = selector.replace(/[\[\]"]/g, '').split('=');
      el.setAttribute(key, val);
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  };

  // 3. Set description & OpenGraph & Twitter
  setMeta('meta[name="description"]', 'content', meta.description);
  setMeta('meta[property="og:title"]', 'content', meta.title);
  setMeta('meta[property="og:description"]', 'content', meta.description);
  setMeta('meta[property="og:url"]', 'content', canonicalUrl);
  setMeta('meta[name="twitter:title"]', 'content', meta.title);
  setMeta('meta[name="twitter:description"]', 'content', meta.description);

  // 4. Update or inject Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', canonicalUrl);
}
