import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  HelpCircle,
  ShieldCheck,
  Truck,
  ArrowRight,
  PhoneCall,
  Sliders,
  Sparkles,
  Calculator,
  X,
  ChevronDown,
  Building2,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { HelpFeedbackModal } from '../support/HelpFeedbackModal';

interface PlanPackage {
  id: 'starter' | 'professional' | 'enterprise';
  title: string;
  pill: string;
  typicalStay: string;
  monthlyPricePerVehicle: number; // in INR
  annualPricePerVehicle: number;
  isPopular?: boolean;
  features: string[];
  footerNote: string;
  ctaText: string;
  ctaVariant: 'yellow' | 'teal';
}

const PACKAGES: PlanPackage[] = [
  {
    id: 'starter',
    title: 'Starter Fleet Package',
    pill: 'Essential Fleet Operations',
    typicalStay: 'Typical setup: 1–2 business days',
    monthlyPricePerVehicle: 799,
    annualPricePerVehicle: 640,
    features: [
      'Initial fleet onboarding & vehicle directory',
      'Odometer monitoring & daily mileage sync',
      'Preventive maintenance calendar alerts',
      'Driver breakdown reporting & photo capture',
      'Digital document vault (RC, PUC, Fitness, Insurance)',
      'Dedicated coordinator support via chat',
    ],
    footerNote:
      'Ideal for regional delivery fleets, local municipal vans, or single-depot operations.',
    ctaText: 'Get Cost Estimate',
    ctaVariant: 'yellow',
  },
  {
    id: 'professional',
    title: 'Professional Fleet Package',
    pill: 'Most Popular',
    typicalStay: 'Typical setup: 2–3 business days',
    monthlyPricePerVehicle: 1299,
    annualPricePerVehicle: 1040,
    isPopular: true,
    features: [
      'Initial fleet audit & hardware investigation',
      'Real-time GPS tracking & live trip monitoring',
      'Dual-trigger maintenance engine (Mileage + Days)',
      'Digital repair job cards & workshop estimates',
      'Real-time Driver Mobile Application sync',
      'Multi-depot & fleet manager role permissions',
      'Automated compliance expiry alerts (SMS & Email)',
      'Priority certified workshop network access',
      'Coordinator support throughout 24/7',
    ],
    footerNote:
      'Comprehensive fleet operations with real-time driver sync included as standard. High uptime rate.',
    ctaText: 'Get Cost Estimate',
    ctaVariant: 'teal',
  },
  {
    id: 'enterprise',
    title: 'Enterprise Logistics Package',
    pill: 'Large Fleets & Logistics',
    typicalStay: 'Typical setup: Custom deployment SLA',
    monthlyPricePerVehicle: 1999,
    annualPricePerVehicle: 1599,
    features: [
      'Initial multi-branch consultation & integration roadmap',
      'Custom telematics, CAN-bus & OBD-II API pipeline',
      'Automated preventive maintenance protocols',
      'Itemized spare parts auditing & invoice verification',
      'Unlimited driver mobile licenses & offline mode',
      'Custom role-based permissions & audit logging',
      'Multi-year historical compliance archives',
      'Dedicated enterprise fleet account director',
      '24/7 priority hotline & 99.9% uptime SLA',
    ],
    footerNote:
      'Engineered for interstate freight carriers, logistics providers, and heavy commercial vehicle fleets.',
    ctaText: 'Get Cost Estimate',
    ctaVariant: 'yellow',
  },
];

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [headerTheme, setHeaderTheme] = useState<'transparent' | 'blue' | 'white'>('white');

  // Estimate Modal state
  const [estimateModalOpen, setEstimateModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanPackage>(PACKAGES[1]);
  const [vehicleCount, setVehicleCount] = useState<number>(25);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openEstimateModal = (plan: PlanPackage) => {
    setSelectedPlan(plan);
    setEstimateModalOpen(true);
    setQuoteSubmitted(false);
  };

  const calculateEstimate = () => {
    const rate =
      billingCycle === 'annual'
        ? selectedPlan.annualPricePerVehicle
        : selectedPlan.monthlyPricePerVehicle;
    return rate * vehicleCount;
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#0f5b66] selection:text-white flex flex-col justify-between">
      {/* =========================================================================
          TOP NAVIGATION BAR (LIGHT THEME MATCHING SERVIQ IDENTITY)
      ========================================================================= */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-12 py-3.5 flex items-center justify-between shadow-xs">
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <img
            src="/logo-blue.png"
            alt="SERVIQ Logo"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
          />
          <img
            src="/serviq-name-logo-blue.png"
            alt="SERVIQ"
            className="h-5 sm:h-6 md:h-7 w-auto object-contain transition-opacity group-hover:opacity-90"
          />
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <Link to="/" className="hover:text-[#2335f2] transition-colors">
            Home
          </Link>
          <Link to="/#about" className="hover:text-[#2335f2] transition-colors">
            About
          </Link>
          <Link to="/#features" className="hover:text-[#2335f2] transition-colors">
            Features
          </Link>
          <Link to="/pricing" className="text-[#2335f2] font-bold">
            Pricing
          </Link>
          <Link to="/download" className="hover:text-[#2335f2] transition-colors">
            Download App
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 sm:px-6 sm:py-2.5 bg-[#2335f2] hover:bg-[#1a2bd6] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-600/20 active:scale-95 transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* =========================================================================
          HERO & PACKAGES SECTION (EXACT DESIGN MATCH OF REFERENCE SCREENSHOT)
      ========================================================================= */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        {/* Top Eyebrow */}
        <div className="text-center">
          <span className="text-[11px] sm:text-xs font-extrabold tracking-[0.25em] text-[#0f5b66] uppercase block font-mono mb-3">
            TRANSPARENT PRICING
          </span>

          {/* Headline matching font and weight from reference */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 font-serif tracking-tight leading-tight">
            Choose Your Package
          </h1>

          {/* Subtitle description */}
          <p className="mt-3.5 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            All packages include driver mobile access, preventive maintenance scheduling,
            digital compliance vaults, and coordinator support. No hidden fees.
          </p>

          {/* Billing Cycle Switch (Monthly / Annual with 20% discount badge) */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-full bg-slate-200/70 border border-slate-300/80 shadow-inner">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                billingCycle === 'annual'
                  ? 'bg-[#0f5b66] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annual Billing
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-800 border border-emerald-400/30">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            3 PRICING PACKAGE CARDS (EXACT REPLICA OF REFERENCE SCREENSHOT)
        ========================================================================= */}
        <div className="mt-14 sm:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-6 lg:gap-8 items-stretch">
          {PACKAGES.map((pkg) => {
            const isFeatured = pkg.isPopular;
            const rate =
              billingCycle === 'annual'
                ? pkg.annualPricePerVehicle
                : pkg.monthlyPricePerVehicle;

            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-2xl bg-white p-7 sm:p-8 transition-all duration-300 ${
                  isFeatured
                    ? 'border-2 border-[#164e63] shadow-xl shadow-slate-900/10 scale-100 lg:-translate-y-2 z-10'
                    : 'border border-slate-200/90 shadow-sm hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                {/* Floating "Most Popular" Pill on top border for middle card */}
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full text-[11px] font-bold text-[#0f5b66] bg-[#e6f4f6] border border-[#0f5b66]/30 shadow-xs uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  {/* Card Title */}
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight">
                    {pkg.title}
                  </h2>

                  {/* Sub-badge pill */}
                  <div className="mt-2.5">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/70">
                      {pkg.pill}
                    </span>
                  </div>

                  {/* Pricing Display */}
                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black font-serif text-slate-900">
                      ₹{rate.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      / vehicle / month
                    </span>
                  </div>

                  {/* Typical setup duration line */}
                  <p className="mt-2 text-xs font-medium text-slate-500">
                    {pkg.typicalStay}
                  </p>

                  {/* Checklist matching reference screenshot */}
                  <ul className="mt-6 space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Section: Divider, Italic Note, and Action Button */}
                <div className="mt-8 pt-6 border-t border-slate-200/80">
                  {/* Italic Note from screenshot */}
                  <p className="text-[11px] sm:text-xs text-slate-500 italic leading-relaxed mb-6 min-h-[38px]">
                    {pkg.footerNote}
                  </p>

                  {/* Action Button */}
                  {pkg.ctaVariant === 'teal' ? (
                    <button
                      onClick={() => openEstimateModal(pkg)}
                      className="w-full py-3.5 px-6 rounded-full font-bold text-sm bg-[#164e63] hover:bg-[#0e3b4b] active:scale-98 text-white transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>{pkg.ctaText}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => openEstimateModal(pkg)}
                      className="w-full py-3.5 px-6 rounded-full font-bold text-sm bg-[#f59e0b] hover:bg-[#d97706] active:scale-98 text-slate-950 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>{pkg.ctaText}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            TRANSPARENCY & VALUE HIGHLIGHTS STRIP
        ========================================================================= */}
        <div className="mt-20 rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0f5b66] border border-teal-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">No Setup or Ingestion Fees</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Every account includes full cloud setup, RTO document templates, and driver onboarding at zero surcharge.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2335f2] border border-blue-100 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Free Unlimited Driver Apps</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Drivers download the React Native mobile app for free on Android. You only pay for active fleet vehicles.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0">
                <PhoneCall className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">30-Day Money-Back Guarantee</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Test SERVIQ with your commercial vehicles. If downtime isn't reduced, receive a 100% full refund with no questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          INTERACTIVE COST ESTIMATOR MODAL
      ========================================================================= */}
      {estimateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setEstimateModalOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {quoteSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h3 className="text-2xl font-bold font-serif text-slate-900">
                  Estimate Generated Successfully!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-slate-900">{clientName || 'Fleet Operator'}</span>.
                  A formal quote for <span className="font-semibold text-slate-900">{vehicleCount} vehicles</span> on the{' '}
                  <span className="font-semibold text-slate-900">{selectedPlan.title}</span> has been dispatched to your email.
                </p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left max-w-md mx-auto text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Package:</span>
                    <span className="font-bold text-slate-900">{selectedPlan.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Vehicles:</span>
                    <span className="font-bold text-slate-900">{vehicleCount} Units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Billing:</span>
                    <span className="font-bold text-slate-900">{billingCycle === 'annual' ? 'Annual (20% off)' : 'Monthly'}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1 text-sm font-black text-[#0f5b66]">
                    <span>Estimated Total:</span>
                    <span>₹{calculateEstimate().toLocaleString('en-IN')}/mo</span>
                  </div>
                </div>
                <button
                  onClick={() => setEstimateModalOpen(false)}
                  className="mt-4 px-8 py-3 bg-[#164e63] hover:bg-[#0e3b4b] text-white font-bold text-sm rounded-full transition-all"
                >
                  Close & Continue
                </button>
              </div>
            ) : (
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0f5b66]">
                  INSTANT FLEET ESTIMATOR
                </span>
                <h3 className="text-2xl font-bold font-serif text-slate-900 mt-1">
                  {selectedPlan.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust your fleet size below to see transparent, all-inclusive monthly investment.
                </p>

                {/* Slider for Vehicle Count */}
                <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Fleet Size</span>
                    <span className="text-lg font-black font-serif text-[#0f5b66]">
                      {vehicleCount} Vehicles
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="150"
                    step="1"
                    value={vehicleCount}
                    onChange={(e) => setVehicleCount(Number(e.target.value))}
                    className="w-full mt-3 accent-[#0f5b66] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>3 units</span>
                    <span>50 units</span>
                    <span>100 units</span>
                    <span>150+ units</span>
                  </div>
                </div>

                {/* Live Cost Output */}
                <div className="mt-4 p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#0f5b66] block">
                      Estimated Monthly Investment
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Billed {billingCycle} · No hidden coordinator charges
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black font-serif text-slate-900 block leading-tight">
                      ₹{calculateEstimate().toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      (₹{billingCycle === 'annual' ? selectedPlan.annualPricePerVehicle : selectedPlan.monthlyPricePerVehicle}/vehicle/mo)
                    </span>
                  </div>
                </div>

                {/* Contact Form */}
                <form onSubmit={handleQuoteSubmit} className="mt-6 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name / Fleet Administrator
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0f5b66] focus:ring-1 focus:ring-[#0f5b66]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="admin@fleetcorp.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0f5b66] focus:ring-1 focus:ring-[#0f5b66]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0f5b66] focus:ring-1 focus:ring-[#0f5b66]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3.5 bg-[#164e63] hover:bg-[#0e3b4b] text-white font-bold text-sm rounded-full shadow-md active:scale-98 transition-all cursor-pointer"
                  >
                    Receive Official Quote & Free Trial →
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SITE FOOTER
      ========================================================================= */}
      <footer className="bg-white border-t border-slate-200/80 pt-16 pb-12 px-4 sm:px-6 lg:px-8 mt-20 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo-blue.png" alt="SERVIQ Logo" className="w-8 h-8 object-contain" />
            <div>
              <span className="font-extrabold text-xl text-slate-900 font-serif block leading-none">
                serviq.
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider">
                Fleet Maintenance & Operations Platform
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 font-medium text-slate-600">
            <Link to="/" className="hover:text-[#2335f2]">Home</Link>
            <Link to="/pricing" className="text-[#2335f2] font-bold">Pricing</Link>
            <Link to="/download" className="hover:text-[#2335f2]">Download App</Link>
            <Link to="/terms-of-use" className="hover:text-[#2335f2]">Terms of Use</Link>
            <Link to="/privacy-policy" className="hover:text-[#2335f2]">Privacy Policy</Link>
          </div>

          <div>
            Copyright © 2026 SERVIQ. All rights reserved. Chennai, India.
          </div>
        </div>
      </footer>

      {/* Support / Help Modal */}
      <HelpFeedbackModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
    </div>
  );
};

export default PricingPage;
