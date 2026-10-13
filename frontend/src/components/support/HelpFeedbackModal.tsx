import React, { useState, useEffect } from 'react';
import { X, ChevronDown, CheckCircle2, Loader2, Phone, Mail, MapPin } from 'lucide-react';

interface HelpFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
}

export const HelpFeedbackModal: React.FC<HelpFeedbackModalProps> = ({
  isOpen,
  onClose,
  defaultCategory,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [primaryNeed, setPrimaryNeed] = useState('Commercial Fleet Management');
  const [projectOverview, setProjectOverview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultCategory) {
      const categoryMap: Record<string, string> = {
        telemetry: 'Vehicle Telemetry & GPS Tracking',
        maintenance: 'Maintenance & Scheduled Service',
        'driver-app': 'Driver Mobile App & Login',
        breakdown: 'Roadside Breakdown Emergency',
        billing: 'Billing & Subscription Inquiries',
        general: 'General Fleet Feedback & Inquiries',
      };
      if (categoryMap[defaultCategory]) {
        setPrimaryNeed(categoryMap[defaultCategory]);
      }
    }
  }, [defaultCategory]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setError('Please provide your phone or WhatsApp number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 500);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setProjectOverview('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-10 text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] my-8 animate-in zoom-in-95 duration-250">
        {/* Top Right Close Button matching reference Image 2 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 sm:top-7 sm:right-7 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight font-anek-latin">
              Request Received Successfully
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you, <span className="font-semibold text-slate-800">{name}</span>. Our Chennai fleet support specialist has been assigned to your inquiry and will reach out to <span className="font-semibold text-slate-800">{email}</span> within 24 hours.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-8 py-3 rounded-full bg-[#2335f2] hover:bg-[#1a2bd6] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-600/20 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Header matching Image 2 */}
            <div className="pr-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-anek-latin">
                Talk To Us
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Tell us about your fleet requirements, operational goals, or deployment timeline. We respond within 24 hours.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {error}
              </div>
            )}

            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-800 tracking-wider uppercase mb-1.5">
                  NAME *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="First and last name"
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl sm:rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2335f2]/20 focus:border-[#2335f2] transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-800 tracking-wider uppercase mb-1.5">
                  EMAIL *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="work@company.com"
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl sm:rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2335f2]/20 focus:border-[#2335f2] transition-all"
                />
              </div>
            </div>

            {/* Row 2: Phone / Whatsapp & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-800 tracking-wider uppercase mb-1.5">
                  PHONE / WHATSAPP *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl sm:rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2335f2]/20 focus:border-[#2335f2] transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-800 tracking-wider uppercase mb-1.5">
                  COMPANY / BRAND NAME
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your organization name"
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl sm:rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2335f2]/20 focus:border-[#2335f2] transition-all"
                />
              </div>
            </div>

            {/* Row 3: Primary Need */}
            <div>
              <label className="block text-[11px] sm:text-xs font-bold text-slate-800 tracking-wider uppercase mb-1.5">
                PRIMARY NEED *
              </label>
              <div className="relative">
                <select
                  value={primaryNeed}
                  onChange={(e) => setPrimaryNeed(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl sm:rounded-2xl px-4 py-3 pr-10 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2335f2]/20 focus:border-[#2335f2] appearance-none transition-all cursor-pointer"
                >
                  <option value="Commercial Fleet Management">Commercial Fleet Management</option>
                  <option value="Vehicle Telemetry & GPS Tracking">Vehicle Telemetry & GPS Tracking</option>
                  <option value="Maintenance & Scheduled Service">Maintenance & Scheduled Service</option>
                  <option value="Driver Mobile App & Login">Driver Mobile App & Login</option>
                  <option value="Roadside Breakdown Emergency">Roadside Breakdown Emergency</option>
                  <option value="Billing & Subscription Inquiries">Billing & Subscription Inquiries</option>
                  <option value="General Fleet Feedback & Inquiries">General Fleet Feedback & Inquiries</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <ChevronDown className="w-4 h-4 stroke-[2.2]" />
                </div>
              </div>
            </div>

            {/* Row 4: Project Overview & Scope */}
            <div>
              <label className="block text-[11px] sm:text-xs font-bold text-slate-800 tracking-wider uppercase mb-1.5">
                PROJECT OVERVIEW & SCOPE
              </label>
              <textarea
                rows={3}
                value={projectOverview}
                onChange={(e) => setProjectOverview(e.target.value)}
                placeholder="Tell us about your fleet goals, target timeline, or specific challenges..."
                className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl sm:rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2335f2]/20 focus:border-[#2335f2] resize-none transition-all"
              />
            </div>

            {/* Direct Contact info strip */}
            <div className="py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#2335f2]" />
                <span>+91 44 2855 0100</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#2335f2]" />
                <span>support@serviq.in</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2335f2]" />
                <span>Chennai, India</span>
              </div>
            </div>

            {/* Row 5: Action Button (SERVIQ Electric Blue Brand Color) */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-[#2335f2] hover:bg-[#1a2bd6] active:scale-[0.99] text-white font-extrabold uppercase text-sm sm:text-base tracking-wider transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>SEND INQUIRY</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default HelpFeedbackModal;
