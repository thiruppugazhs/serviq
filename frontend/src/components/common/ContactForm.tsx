import React, { useState } from 'react';
import { X, ChevronDown, CheckCircle2, Cog } from 'lucide-react';

interface ContactFormProps {
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  defaultNeed?: string;
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onClose,
  title = 'Talk To Us',
  subtitle = 'Tell us about your fleet requirements, operational goals, or deployment timeline. We respond within 24 hours.',
  defaultNeed = 'Commercial Fleet Management',
  className = '',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [primaryNeed, setPrimaryNeed] = useState(defaultNeed);
  const [projectOverview, setProjectOverview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid business email.');
      return;
    }
    if (!phone.trim()) {
      setError('Please provide your phone or WhatsApp number.');
      return;
    }

    setIsSubmitting(true);

    // Simulate reliable dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div
      className={`relative bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-100 max-w-xl w-full text-left font-['Plus_Jakarta_Sans',sans-serif] ${className}`}
    >
      {/* Optional Top Right Close Button matching reference Image 2 */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 sm:top-7 sm:right-7 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </button>
      )}

      {isSubmitted ? (
        <div className="py-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Inquiry Sent Successfully
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Thank you, <span className="font-semibold text-slate-800">{name}</span>. A SERVIQ fleet operations specialist has received your inquiry and will reach out to <span className="font-semibold text-slate-800">{email}</span> within 24 hours.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Close Window
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setName('');
                setEmail('');
                setPhone('');
                setCompany('');
                setProjectOverview('');
              }}
              className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Send Another
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Header */}
          <div className="pr-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Anek_Latin',sans-serif]">
              {title}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
              {subtitle}
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
                <option value="Driver Mobile App & Telematics">Driver Mobile App & Telematics</option>
                <option value="Preventive Maintenance & Workshop Billing">Preventive Maintenance & Workshop Billing</option>
                <option value="Compliance & Digital Document Vault">Compliance & Digital Document Vault</option>
                <option value="Custom API & Enterprise Deployment">Custom API & Enterprise Deployment</option>
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
              rows={4}
              value={projectOverview}
              onChange={(e) => setProjectOverview(e.target.value)}
              placeholder="Tell us about your fleet goals, target timeline, or specific challenges..."
              className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl sm:rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2335f2]/20 focus:border-[#2335f2] resize-none transition-all"
            />
          </div>

          {/* Row 5: Action Button (SERVIQ Electric Blue Brand Color) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-[#2335f2] hover:bg-[#1a2bd6] active:scale-[0.99] text-white font-extrabold uppercase text-sm sm:text-base tracking-wider transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Cog className="w-5 h-5 animate-spin" />
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
  );
};

export default ContactForm;
