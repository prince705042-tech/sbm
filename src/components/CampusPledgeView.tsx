import React, { useState } from 'react';
import { Award, CheckCircle2, ShieldCheck, Download, Printer, User, Building2, Calendar, RotateCcw } from 'lucide-react';
import { getAssetUrl } from '../utils/assets';

interface CampusPledgeViewProps {
  pledgeRecord: { name: string; dept: string; date: string } | null;
  onTakePledge: (name: string, dept: string) => void;
  onResetPledge: () => void;
}

export const CampusPledgeView: React.FC<CampusPledgeViewProps> = ({
  pledgeRecord,
  onTakePledge,
  onResetPledge,
}) => {
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const departments = [
    'Computer Science & Engineering',
    'Electronics & Communication Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Architecture & Planning',
    'Physics & Nanotechnology',
    'Chemistry & Environmental Science',
    'Mathematics & Computing',
    'Humanities & Social Sciences',
    'Estate & Sanitation Division',
    'Hostel Administration & Wardens',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name as it should appear on your certificate.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMsg('Please affirm the national Swachhata commitment statement.');
      return;
    }
    setErrorMsg('');
    onTakePledge(fullName.trim(), department);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {pledgeRecord ? (
        /* Certificate View */
        <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-10 shadow-xs max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100/70 text-emerald-900 border border-emerald-300/60 mb-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  Official Credential Verified
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
                  Swachhata Citizen Certification
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
              <button
                type="button"
                onClick={onResetPledge}
                className="px-3 py-2 border border-stone-300 hover:border-stone-400 text-stone-700 hover:text-stone-900 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Pledge as another student or officer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                <span>New Pledge</span>
              </button>
            </div>
          </div>

          {/* Certificate Board */}
          <div className="relative border-4 border-double border-emerald-900/40 rounded-xl p-6 sm:p-10 bg-amber-50/20 text-center overflow-hidden">
            {/* Watermark */}
            <div 
              className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-5 pointer-events-none"
              style={{ backgroundImage: `url('${getAssetUrl('swachh-bharat-bg.webp')}')` }}
            />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <div className="text-xs uppercase tracking-widest font-mono text-emerald-950 font-semibold">
                Ministry of Housing &amp; Urban Affairs · Government of India
              </div>
              <div className="text-sm font-semibold text-stone-700">
                National Institute of Technology Patna · Swachh Campus Unit
              </div>

              <div className="py-2">
                <span className="text-xs text-stone-500 italic block mb-1">This is officially presented to</span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 border-b-2 border-emerald-800 pb-1 inline-block px-6">
                  {pledgeRecord.name}
                </span>
                <span className="text-xs font-medium text-stone-600 block mt-2">
                  {pledgeRecord.dept}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-xl mx-auto italic">
                &ldquo;For formally pledging dedication towards cleanliness, committing to devote 100 hours annually (2 hours per week) to voluntary labor for swachhata, propagating 100% source segregation of waste, and actively striving for a clean and plastic-free NIT Patna campus.&rdquo;
              </p>

              <div className="pt-6 border-t border-stone-300/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
                <div className="text-left">
                  <span className="block text-[10px] text-stone-400 uppercase font-mono">Date Certified</span>
                  <span className="font-semibold text-stone-900">{pledgeRecord.date}</span>
                </div>
                <div className="text-center">
                  <span className="block text-[10px] text-stone-400 uppercase font-mono">Certificate Code</span>
                  <span className="font-mono text-xs font-bold text-emerald-900">NITP-SBM-2026-CERT</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-stone-400 uppercase font-mono">Verified Under</span>
                  <span className="font-semibold text-stone-900">Swachh Survekshan 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Take Pledge Form */
        <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-10 shadow-xs max-w-3xl mx-auto">
          <div className="border-b border-stone-200 pb-6 mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded text-xs font-semibold uppercase tracking-wider mb-3">
              <Award className="w-4 h-4 text-emerald-700" />
              National Civic Commitment
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              National Swachhata Pledge
            </h2>
            <p className="mt-2 text-stone-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
              Mahatma Gandhi dreamed of an India which was not only free but also clean and well-maintained. Join thousands of NIT Patna students, faculty, and staff in taking the pledge.
            </p>
          </div>

          {/* Pledge Text Card */}
          <div className="p-4 sm:p-6 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-800 leading-relaxed space-y-3 mb-6">
            <p className="font-medium text-stone-900">
              &ldquo;I take this pledge that I will remain committed towards cleanliness and devote time for this. I will devote 100 hours per year, that is two hours per week, to voluntary work for cleanliness.&rdquo;
            </p>
            <p>
              &ldquo;I will neither litter nor let others litter on campus or in public places. I will initiate the quest for cleanliness with myself, my family, my hostel, and my institute campus. I will segregate wet and dry waste at the source and encourage 100 other persons to take this pledge.&rdquo;
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">
                {errorMsg}
              </div>
            )}

            <div>
              <label htmlFor="pledge-name" className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name (As you want on certificate) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="pledge-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="pledge-dept" className="block text-xs font-semibold text-stone-700 mb-1">
                Department / Sector *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  id="pledge-dept"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-900"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-700 select-none">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-stone-300 text-emerald-700 focus:ring-emerald-600"
                />
                <span>
                  I solemnly affirm this pledge and commit to upholding source segregation and campus sanitation standards at NIT Patna.
                </span>
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>Affirm Pledge &amp; Generate Institutional Certificate</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
