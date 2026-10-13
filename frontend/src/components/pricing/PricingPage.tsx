import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const ENTERPRISE_FEATURES = [
    {
      category: 'Core Fleet Operations',
      items: [
        'Initial multi-branch consultation & telematic setup',
        'Real-time GPS tracking & live trip monitoring',
        'Dual-trigger maintenance engine (Mileage + Calendar days)',
        'Digital repair job cards & itemized parts audit verification',
      ],
    },
    {
      category: 'Driver & Mobile Ecosystem',
      items: [
        'Dedicated Driver Mobile Application with offline mode',
        'Instant roadside breakdown defect reporting with photo capture',
        'Digital odometer synchronization & tamper detection',
        'Driver assignment history, license & badge tracking',
      ],
    },
    {
      category: 'Compliance & Governance',
      items: [
        'Digital compliance vault (RC, PUC, Fitness, Insurance, Permits)',
        'Automated regulatory expiry alerts via SMS, WhatsApp & Email',
        'Multi-depot & executive role-based access control (RBAC)',
        'Multi-year audit archives & downloadable compliance reports',
      ],
    },
    {
      category: 'Enterprise Integration & Support',
      items: [
        'Custom CAN-bus, OBD-II telemetry & enterprise API pipeline',
        'Priority access to verified commercial repair workshops',
        'Dedicated enterprise fleet account director',
        '24/7 priority emergency dispatch hotline & 99.9% uptime SLA',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#2335f2] selection:text-white flex flex-col justify-between">
      {/* Top Header */}
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
            About Us
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

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        {/* Main Header (SERVIQ Typography) */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 font-anek-latin tracking-tight leading-tight">
            Single Fleet Package
          </h1>

          <p className="mt-3.5 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Create an account to start with <strong className="text-slate-900 font-bold">1 month completely free</strong>.
            After 1 month, continue with flexible monthly or discounted yearly billing.
          </p>
        </div>

        {/* Single Price Package Card */}
        <div className="relative rounded-3xl bg-white border-2 border-[#2335f2] shadow-2xl shadow-[#2335f2]/10 p-6 sm:p-10 md:p-12 transition-all duration-300">
          {/* Card Top: Plan Title, Billing Switcher & Pricing */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-anek-latin tracking-tight">
                All-in-One Fleet Package
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md leading-relaxed">
                Complete access to all fleet modules, unlimited vehicles, driver app, and live dispatch.
              </p>

              {/* Billing Cycle Switcher */}
              <div className="mt-5 inline-flex p-1 bg-slate-100 rounded-full border border-slate-200">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-[#2335f2] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly Payment
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    billingCycle === 'yearly'
                      ? 'bg-[#2335f2] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Yearly Subscription</span>
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      billingCycle === 'yearly'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    SAVE ₹2,000
                  </span>
                </button>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-slate-50/90 rounded-2xl p-5 sm:p-6 border border-slate-200/90 text-left lg:text-right shrink-0">
              <span className="inline-block text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                Month 1: Free (₹0)
              </span>
              <div className="flex items-baseline lg:justify-end gap-1.5">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 font-anek-latin tracking-tight">
                  {billingCycle === 'monthly' ? '₹1,000' : '₹10,000'}
                </span>
                <span className="text-slate-500 font-semibold text-sm">
                  {billingCycle === 'monthly' ? '/ month' : '/ year'}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-500 max-w-[260px] lg:ml-auto">
                {billingCycle === 'monthly'
                  ? 'After 1 free month, ₹1,000 charged monthly. Cancel anytime.'
                  : 'After 1 free month, ₹10,000 charged yearly (₹833/mo equivalent).'}
              </p>
            </div>
          </div>

          {/* What's Included */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {ENTERPRISE_FEATURES.map((group, gIdx) => (
              <div key={gIdx} className="space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-anek-latin">
                  {group.category}
                </h3>
                <ul className="space-y-3">
                  {group.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 leading-snug">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider line & Note */}
          <div className="mt-10 pt-6 border-t border-slate-200/80">
            <p className="text-xs sm:text-sm text-slate-500 italic leading-relaxed mb-6">
              Engineered for commercial freight carriers, interstate logistics, bus & municipal operators, and regional fleets requiring end-to-end operational governance.
            </p>

            {/* Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-end">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold text-sm sm:text-base bg-[#2335f2] hover:bg-[#1a2bd6] active:scale-98 text-white transition-all shadow-lg hover:shadow-blue-600/25 cursor-pointer text-center"
              >
                <span>Start 1 Month Free</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 pt-16 pb-12 px-4 sm:px-6 lg:px-8 mt-20 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo-blue.png" alt="SERVIQ Logo" className="w-8 h-8 object-contain" />
            <div>
              <span className="font-extrabold text-xl text-slate-900 font-['Outfit',sans-serif] block leading-none">
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
    </div>
  );
};

export default PricingPage;
