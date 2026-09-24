import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Truck,
  Wrench,
  Smartphone,
  CreditCard,
  AlertTriangle,
  HelpCircle,
  Send,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

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
  const [selectedCategory, setSelectedCategory] = useState<string>(
    defaultCategory || 'telemetry'
  );
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const categories = [
    {
      id: 'telemetry',
      label: 'Vehicle Telemetry & GPS',
      icon: Truck,
      desc: 'GPS offline, odometer mismatch, or sync lag',
    },
    {
      id: 'maintenance',
      label: 'Maintenance & Service',
      icon: Wrench,
      desc: 'Service logs, schedules, and workshop bookings',
    },
    {
      id: 'driver-app',
      label: 'Driver App & Login',
      icon: Smartphone,
      desc: 'Driver app login, permissions, and trip logging',
    },
    {
      id: 'breakdown',
      label: 'Roadside Breakdown',
      icon: AlertTriangle,
      desc: 'Urgent roadside assistance or ticket escalation',
    },
    {
      id: 'billing',
      label: 'Billing & Subscriptions',
      icon: CreditCard,
      desc: 'Invoices, plan upgrades, and payment receipts',
    },
    {
      id: 'general',
      label: 'General Inquiries',
      icon: HelpCircle,
      desc: 'Feedback, feature requests, or partnership queries',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-800 border border-slate-100 animate-in zoom-in-95 duration-250">
        
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 bg-studio-blue text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-['Outfit',sans-serif]">
                Help & Feedback
              </h3>
              <p className="text-xs text-white/80">
                Get answers and assistance right where you need it
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                Request Received!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for contacting SERVIQ Support. A live support agent has been assigned to your ticket. We will connect with you via chat or email within a few minutes.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-studio-blue text-white font-semibold rounded-xl hover:bg-[#1523c5] transition-all shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Select Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  1. Select Relevant Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#2335f2] bg-blue-50/70 shadow-sm ring-1 ring-[#2335f2]'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-studio-blue text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {cat.label}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            {cat.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#2335f2] focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Email or Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="e.g. ramesh@fleet.in or +91..."
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#2335f2] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Step 3: Message / Issue Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Describe Your Issue or Feedback
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what issue you are facing or how we can assist your fleet..."
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#2335f2] focus:bg-white transition-colors resize-none"
                />
              </div>

              {/* Direct Support Info strip */}
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#2335f2]" />
                  <span>24/7 Helpline: +91 44 2855 0100</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#2335f2]" />
                  <span>support@serviq.in</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2335f2]" />
                  <span>Chennai, Tamil Nadu</span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-studio-blue text-white text-sm font-bold rounded-xl shadow-lg hover:bg-[#1523c5] transition-all flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Start Live Chat / Submit</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
