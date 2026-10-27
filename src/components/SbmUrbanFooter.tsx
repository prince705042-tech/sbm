import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  LogOut, 
  MapPin, 
  ExternalLink, 
  Award,
  CheckCircle2
} from 'lucide-react';

import { AppRoute } from '../utils/seo';

interface SbmUrbanFooterProps {
  currentLang: 'en' | 'hi';
  isAdmin: boolean;
  onAdminLoginClick: () => void;
  onAdminLogoutClick: () => void;
  onOpenDashboardClick: () => void;
  activeAlertsCount: number;
  onNavigateTab: (tab: AppRoute) => void;
  onOpenPledgeModal: () => void;
  onOpenContactModal?: () => void;
  onOpenSecurityModal?: () => void;
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
  onOpenContactModal,
  onOpenSecurityModal,
}) => {
  return (
    <footer className="w-full bg-[#071A2E] text-stone-300 text-xs border-t border-stone-800 mt-12 relative z-10 select-none">
      {/* National Tricolor Top Line */}
      <div className="h-1 w-full flex" aria-hidden="true">
        <div className="flex-1 bg-[#FF671F]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#046A38]" />
      </div>

      {/* Supervisory & Administrative Bar */}
      <div className="bg-[#0B2545] border-b border-stone-800/80 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-lg bg-[#046A38] text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="font-semibold text-white text-xs">
                {currentLang === 'hi' 
                  ? 'स्वच्छ भारत मिशन · नोडल पर्यवेक्षी कंसोल' 
                  : 'Swachh Bharat Mission Campus Sanitation Registry & Supervisory Console'}
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                {isAdmin
                  ? (currentLang === 'hi' ? 'सत्यापित एडमिनिस्ट्रेटर सत्र सक्रिय। हाउसकीपिंग टिकट प्रेषण एवं डस्टबिन प्रबंधन सक्षम।' : 'Authenticated as SBM Administrator. Housekeeping dispatch tickets and bin registry management active.')
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
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#046A38] hover:bg-[#03552d] text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{currentLang === 'hi' ? 'डैशबोर्ड खोलें' : 'Open Dashboard'}</span>
                  {activeAlertsCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono-code tabular-nums bg-rose-600 text-white">
                      {activeAlertsCount}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onAdminLogoutClick}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{currentLang === 'hi' ? 'लॉग आउट' : 'Log Out'}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onAdminLoginClick}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#FF671F] hover:bg-[#e65a15] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-white" />
                <span>{currentLang === 'hi' ? 'अधिकारी लॉग-इन' : 'Officer Login'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4-Column Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Citizen Interface */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white text-xs font-mono-code uppercase tracking-wider border-b border-stone-800 pb-2">
              {currentLang === 'hi' ? 'नागरिक सेवाएँ' : 'Citizen Services'}
            </h3>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li>
                <a 
                  href="/finder"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('finder'); }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  {currentLang === 'hi' ? 'निकटतम डस्टबिन खोजें' : 'Locate Nearest Dustbin'}
                </a>
              </li>
              <li>
                <a 
                  href="/guide"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('guide'); }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  {currentLang === 'hi' ? 'कचरा पृथक्करण गाइड' : 'Waste Segregation Manual'}
                </a>
              </li>
              <li>
                <a 
                  href="/map"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('map'); }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  {currentLang === 'hi' ? 'परिसर जीआईएस मानचित्र' : 'Campus Dustbin GIS Map'}
                </a>
              </li>
              <li>
                <a 
                  href="/pledge"
                  onClick={(e) => { e.preventDefault(); onNavigateTab('pledge'); }}
                  className="hover:text-amber-200 transition-colors cursor-pointer text-left flex items-center gap-1.5 text-amber-300"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{currentLang === 'hi' ? 'स्वच्छता प्रतिज्ञा एवं प्रमाण पत्र' : 'Swachhata Pledge & Certificate'}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Dashboards & Surveys */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white text-xs font-mono-code uppercase tracking-wider border-b border-stone-800 pb-2">
              {currentLang === 'hi' ? 'मूल्यांकन एवं मानक' : 'Standards & Audit'}
            </h3>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li className="flex items-center justify-between text-stone-300">
                <span>Swachh Survekshan 2026</span>
                <span className="text-[10px] font-mono-code text-emerald-400">Active</span>
              </li>
              <li className="flex items-center justify-between text-stone-300">
                <span>Garbage Free Campus (GFC)</span>
                <span className="text-[10px] font-mono-code text-amber-300">5-Star</span>
              </li>
              <li className="flex items-center justify-between text-stone-300">
                <span>Zero Waste Protocol</span>
                <span className="text-[10px] font-mono-code text-emerald-400">Certified</span>
              </li>
              <li className="text-stone-400 pt-1">
                Scheduled Daily Sweeps: 07:00, 15:30, 20:00
              </li>
            </ul>
          </div>

          {/* Column 3: Important Official Portals */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white text-xs font-mono-code uppercase tracking-wider border-b border-stone-800 pb-2">
              {currentLang === 'hi' ? 'आधिकारिक पोर्टल' : 'Official Portals'}
            </h3>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li>
                <a 
                  href="https://sbmurban.org" 
                  target="_blank" 
                  rel="noreferrer noopener"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Swachh Bharat Mission (MoHUA)</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://mohua.gov.in" 
                  target="_blank" 
                  rel="noreferrer noopener"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Ministry of Housing &amp; Urban Affairs</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nitp.ac.in" 
                  target="_blank" 
                  rel="noreferrer noopener"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>NIT Patna Official Website</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.mygov.in" 
                  target="_blank" 
                  rel="noreferrer noopener"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>MyGov India</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Nodal Cell */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white text-xs font-mono-code uppercase tracking-wider border-b border-stone-800 pb-2">
              {currentLang === 'hi' ? 'नोडल संपर्क एवं सहायता' : 'Nodal Helpdesk'}
            </h3>
            <div className="space-y-2.5 text-stone-400 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Swachh Bharat Mission Sanitation Desk, NIT Patna, Ashok Rajpath, Patna, Bihar 800005
                </span>
              </div>
              <div className="text-[11px] text-stone-400">
                Official Email: <span className="text-emerald-400 font-mono-code">swachh@nitp.ac.in</span>
              </div>
              <div className="pt-1">
                {onOpenContactModal && (
                  <button
                    type="button"
                    onClick={onOpenContactModal}
                    className="w-full py-2 px-3 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/50 text-emerald-300 hover:text-emerald-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>{currentLang === 'hi' ? 'नागरिक सहायता / संदेश भेजें' : 'Contact Helpdesk / Send Query'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Security Bar */}
      <div className="border-t border-stone-800 bg-[#051322] py-4 px-4 sm:px-6 lg:px-8 text-[11px] text-stone-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 font-mono-code text-[11px]">
            <span>National Institute of Technology Patna</span>
            <span aria-hidden="true">·</span>
            <span>Swachh Bharat Mission Portal</span>
            <span aria-hidden="true">·</span>
            {onOpenSecurityModal ? (
              <button
                type="button"
                onClick={onOpenSecurityModal}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/60 transition-colors cursor-pointer"
                title="View verified 256-Bit SSL certificate"
              >
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>256-Bit SSL Encrypted (HTTPS)</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>HTTPS Encrypted</span>
              </span>
            )}
          </div>
          <div className="text-stone-400 text-[11px]">
            Compliant with Solid Waste Management Rules 2016 &amp; MoHUA Source Segregation Directives
          </div>
        </div>
      </div>
    </footer>
  );
};

