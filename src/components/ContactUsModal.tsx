import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Building2,
  Clock,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ContactSubmission } from '../types';

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: 'en' | 'hi';
  onSubmissionSuccess?: (submission: ContactSubmission) => void;
}

export const ContactUsModal: React.FC<ContactUsModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'en',
  onSubmissionSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<ContactSubmission['role']>('student');
  const [category, setCategory] = useState<ContactSubmission['category']>('segregation');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required.';
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please provide a valid email format (e.g., student@nitp.ac.in).';
    }
    if (phone.trim() && !/^[0-9+\s-]{8,15}$/.test(phone.trim())) {
      errs.phone = 'Please enter a valid phone number or leave blank.';
    }
    if (!subject.trim()) errs.subject = 'Subject heading is required.';
    if (!message.trim() || message.trim().length < 10) {
      errs.message = 'Please provide detailed comments (at least 10 characters).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const trackingId = `NITP-SBM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const submission: ContactSubmission = {
      id: trackingId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      role,
      category,
      subject: subject.trim(),
      message: message.trim(),
      submittedAt: new Date().toISOString(),
      status: 'new',
    };

    // Save to localStorage
    try {
      const existing = localStorage.getItem('swachh_campus_contact_submissions');
      const list: ContactSubmission[] = existing ? JSON.parse(existing) : [];
      list.unshift(submission);
      localStorage.setItem('swachh_campus_contact_submissions', JSON.stringify(list));
    } catch (err) {
      console.warn('Could not save contact inquiry locally:', err);
    }

    if (onSubmissionSuccess) {
      onSubmissionSuccess(submission);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedId(trackingId);
      setIsSubmitted(true);
    }, 700);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('swachh@nitp.ac.in');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleResetAndClose = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
    setErrors({});
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs"
      onClick={handleResetAndClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl border border-stone-200 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Tricolor Accent Header */}
        <div className="h-1 w-full flex" aria-hidden="true">
          <div className="flex-1 bg-[#FF671F]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#046A38]" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-200 bg-[#0A2540] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FF671F] text-white flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 id="contact-modal-title" className="text-sm font-bold text-white flex items-center gap-2">
                <span>{currentLang === 'hi' ? 'स्वच्छता संपर्क एवं नागरिक सहायता' : 'Sanitation Helpdesk & Citizen Contact'}</span>
              </h3>
              <p className="text-[11px] text-stone-300">
                {currentLang === 'hi' ? 'एनआईटी पटना स्वच्छ भारत मिशन नोडल डेस्क' : 'NIT Patna Estate & Swachh Bharat Mission Nodal Unit'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-700">
          {isSubmitted ? (
            /* Confirmation View */
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#046A38] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Tracking ID: {submittedId}
                </span>
                <h4 className="text-lg font-bold text-stone-900 mt-2 font-editorial">
                  {currentLang === 'hi' ? 'आपका संदेश सफलतापूर्व दर्ज कर लिया गया है' : 'Inquiry Dispatched Successfully'}
                </h4>
                <p className="text-stone-600 max-w-md mx-auto text-xs leading-relaxed">
                  {currentLang === 'hi'
                    ? `धन्यवाद ${name}। आपका संदेश नोडल स्वच्छता डेस्क को अग्रेषित कर दिया गया है। हमारा दल २४ से ४८ घंटे के भीतर ${email} पर संपर्क करेगा।`
                    : `Thank you, ${name}. Your message has been routed to the NIT Patna Sanitation Desk. Our nodal team will respond to ${email} within 24 to 48 hours.`}
                </p>
              </div>

              {/* Direct Mail Fallback */}
              <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 max-w-md mx-auto text-left space-y-2 text-[11px]">
                <div className="font-semibold text-stone-900">Official Institutional Email:</div>
                <div className="flex items-center justify-between gap-2 p-2 rounded bg-white border border-stone-200">
                  <span className="font-mono-code text-[#0A2540] font-semibold">swachh@nitp.ac.in</span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
                  >
                    {copiedEmail ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 rounded-lg bg-[#0A2540] hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  {currentLang === 'hi' ? 'पूर्ण करें' : 'Done & Return to Portal'}
                </button>
              </div>
            </div>
          ) : (
            /* Inquiry Form */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Quick Institutional Notice */}
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-[#0A2540] shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed text-stone-600">
                  <span className="font-semibold text-stone-900">Nodal Office: </span>
                  Sanitation Section, Estate Department, NIT Patna, Ashok Rajpath, Patna 800005. Direct Helpline: Ext. 404 / <a href="mailto:swachh@nitp.ac.in" className="text-[#046A38] font-semibold hover:underline">swachh@nitp.ac.in</a>.
                </div>
              </div>

              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. A. Sharma / Rahul Kumar"
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-base sm:text-xs text-stone-900 focus:outline-hidden focus:border-[#046A38] focus:bg-white transition-colors"
                  />
                  {errors.name && <p className="text-rose-600 text-[10px] mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@nitp.ac.in"
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-base sm:text-xs text-stone-900 focus:outline-hidden focus:border-[#046A38] focus:bg-white transition-colors"
                  />
                  {errors.email && <p className="text-rose-600 text-[10px] mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Row 2: Phone & Affiliation Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Mobile / WhatsApp <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-base sm:text-xs text-stone-900 focus:outline-hidden focus:border-[#046A38] focus:bg-white transition-colors"
                  />
                  {errors.phone && <p className="text-rose-600 text-[10px] mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Campus Role / Affiliation
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as ContactSubmission['role'])}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-base sm:text-xs text-stone-900 focus:outline-hidden focus:border-[#046A38] focus:bg-white transition-colors"
                  >
                    <option value="student">Student / Scholar</option>
                    <option value="faculty">Faculty / Department Chair</option>
                    <option value="staff">Sanitary &amp; Estate Staff</option>
                    <option value="resident">Campus Resident</option>
                    <option value="visitor">Alumnus / Visitor</option>
                  </select>
                </div>
              </div>

              {/* Category of Query */}
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Inquiry Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'segregation', label: 'Waste Segregation' },
                    { id: 'maintenance', label: 'Bin Maintenance' },
                    { id: 'green_initiative', label: 'Green Initiative' },
                    { id: 'technical', label: 'Portal Support' },
                    { id: 'general', label: 'General Nodal' },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id as ContactSubmission['category'])}
                      className={`p-2 rounded text-left border transition-colors cursor-pointer text-[11px] font-medium ${
                        category === cat.id
                          ? 'border-[#046A38] bg-emerald-50 text-[#046A38] font-semibold'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Subject Heading <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Request for additional e-waste receptacle near CSE lab"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-base sm:text-xs text-stone-900 focus:outline-hidden focus:border-[#046A38] focus:bg-white transition-colors"
                />
                {errors.subject && <p className="text-rose-600 text-[10px] mt-1">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-stone-800">
                    Message Details <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-stone-400 font-mono-code">
                    {message.length} chars (min 10)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your observation, recommendation, or inquiry in detail..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-base sm:text-xs text-stone-900 focus:outline-hidden focus:border-[#046A38] focus:bg-white transition-colors"
                />
                {errors.message && <p className="text-rose-600 text-[10px] mt-1">{errors.message}</p>}
              </div>

              {/* Submission CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-200">
                <div className="flex items-center gap-2">
                  <a
                    href="mailto:swachh@nitp.ac.in"
                    className="inline-flex items-center gap-1.5 text-[11px] text-[#046A38] hover:underline font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Or direct email to swachh@nitp.ac.in</span>
                  </a>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="px-3.5 py-2 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer w-1/2 sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-lg bg-[#046A38] hover:bg-[#03552d] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 w-1/2 sm:w-auto shadow-xs disabled:opacity-60"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Dispatching...' : 'Send Inquiry'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
