import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  LogOut, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  Award,
  Globe,
  FileText
} from 'lucide-react';

interface SbmUrbanFooterProps {
  currentLang: 'en' | 'hi';
  isAdmin: boolean;
  onAdminLoginClick: () => void;
  onAdminLogoutClick: () => void;
  onOpenDashboardClick: () => void;
  activeAlertsCount: number;
  onNavigateTab: (tab: 'map' | 'finder' | 'guide' | 'alerts') => void;
  onOpenPledgeModal: () => void;
}

export const SbmUrbanFooter: React.FC<SbmUrbanFooterProps> = ({
  currentLang,
  isAdmin,
  onAdminLoginClick,
  onAdminLogoutClick,
  onOpenDashboardClick,
  activeAlertsCount,
  onNavigateTab,
  onOpenPledgeModal,
}) => {
  return (
    <footer className="w-full bg-[#071A2E] text-stone-300 text-xs border-t border-stone-800 mt-12 relative z-10 select-none">
      {/* National Tricolor Top Ribbon */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF671F]" />
        <div className="flex-1 bg-[#FFFFFF]" />
        <div className="flex-1 bg-[#046A38]" />
      </div>

      {/* Supervisory & Administrative Bar */}
      <div className="bg-[#0B2545] border-b border-stone-800/80 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-lg bg-[#046A38] text-white flex items-center justify-center shrink-0 shadow-xs border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <span className="font-bold text-white text-xs">
                  {currentLang === 'hi' 
                    ? 'स्वच्छ भारत मिशन — नोडल पर्यवेक्षी कंसोल' 
                    : 'Swachh Bharat Mission Campus Sanitation Registry & Supervisory Console'}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                {isAdmin
                  ? (currentLang === 'hi' ? 'सत्यापित एडमिनिस्ट्रेटर लॉग-इन सक्रिय। हाउसकीपिंग टिकट प्रेषण एवं डस्टबिन प्रबंधन सक्षम।' : 'Authenticated as SBM Administrator. Housekeeping dispatch tickets and bin registry management active.')
                  : (currentLang === 'hi' ? 'स्वच्छ भारत मिशन पर्यवेक्षकों, वार्डन एवं स्वच्छता अधीक्षकों हेतु आरक्षित पोर्टल।' : 'Authorized access for SBM Nodal Supervisors, Estate Wardens, and Sanitary Inspectors.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {isAdmin ? (
              <>
                <button
                  type="button"
                  onClick={onOpenDashboardClick}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#046A38] hover:bg-[#03532c] text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{currentLang === 'hi' ? 'डैशबोर्ड खोलें' : 'Open Dashboard'}</span>
                  {activeAlertsCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center font-mono-code">
                      {activeAlertsCount}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onAdminLogoutClick}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{currentLang === 'hi' ? 'लॉग आउट' : 'Log Out'}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onAdminLoginClick}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#FF671F] hover:bg-[#e05814] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-white" />
                <span>{currentLang === 'hi' ? 'अधिकारी लॉग-इन' : 'Officer Login'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4-Column Directory (Mirroring sbmurban.org) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Citizen Interface */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm font-editorial border-b border-stone-800 pb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#FF671F] rounded-xs" />
              {currentLang === 'hi' ? 'नागरिक इंटरफेस' : 'Citizen Interface'}
            </h3>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li>
                <button 
                  onClick={() => onNavigateTab('finder')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {currentLang === 'hi' ? 'निकटतम डस्टबिन खोजें' : 'Locate Nearest Dustbin'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab('guide')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {currentLang === 'hi' ? 'कचरा पृथक्करण गाइड (गीला/सूखा)' : 'Waste Segregation Guide'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab('map')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {currentLang === 'hi' ? 'परिसर जीआईएस मानचित्र' : 'Campus GIS Dustbin Map'}
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenPledgeModal}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 text-amber-400"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{currentLang === 'hi' ? 'स्वच्छता प्रतिज्ञा एवं प्रमाण पत्र' : 'Swachhata Pledge & Certificate'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Dashboards & Ratings */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm font-editorial border-b border-stone-800 pb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#046A38] rounded-xs" />
              {currentLang === 'hi' ? 'डैशबोर्ड एवं रैंकिंग' : 'Dashboards & Surveys'}
            </h3>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li>
                <span className="flex items-center justify-between text-stone-300">
                  <span>Swachh Survekshan 2026</span>
                  <span className="text-[10px] font-mono-code text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded">Active</span>
                </span>
              </li>
              <li>
                <span className="flex items-center justify-between text-stone-300">
                  <span>Garbage Free Campus (GFC)</span>
                  <span className="text-[10px] font-mono-code text-amber-400">5-Star</span>
                </span>
              </li>
              <li>
                <span className="flex items-center justify-between text-stone-300">
                  <span>Zero Waste Campus Protocol</span>
                  <span className="text-[10px] font-mono-code text-emerald-400">Certified</span>
                </span>
              </li>
              <li>
                <span className="text-stone-400">Daily Clearance Protocol: 07:00 &amp; 15:30 IST</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Important Government Portals */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm font-editorial border-b border-stone-800 pb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-blue-500 rounded-xs" />
              {currentLang === 'hi' ? 'संबंधित सरकारी लिंक' : 'Official Portals'}
            </h3>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li>
                <a 
                  href="https://sbmurban.org" 
                  target="_blank" 
                  rel="noreferrer noopener"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Swachh Bharat Mission</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://mohua.gov.in" 
                  target="_blank" 
                  rel="noreferrer noopener"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Ministry of Housing Affairs</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.mygov.in" 
                  target="_blank" 
                  rel="noreferrer noopener"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>MyGov India — Meri Sarkar</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <span className="text-stone-400">Solid Waste Management Rules 2016</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Nodal Cell */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm font-editorial border-b border-stone-800 pb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-amber-400 rounded-xs" />
              {currentLang === 'hi' ? 'नोडल संपर्क एवं सहायता' : 'Nodal Helpdesk'}
            </h3>
            <div className="space-y-2 text-stone-400 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <span className="leading-tight">
                  Swachh Bharat Mission Cell, NIT Patna, Ashok Rajpath, Patna, Bihar 800005
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Bottom Legal & GIGW Compliance Bar */}
      <div className="border-t border-stone-800/80 bg-[#051322] py-4 px-4 sm:px-6 lg:px-8 text-[11px] text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center gap-3 text-stone-400 font-mono-code text-[10px]">
            <span>Version 2.5 (Swachh Bharat Mission)</span>
            <span>&bull;</span>
            <span>NIC / NITP Digital SBM Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
