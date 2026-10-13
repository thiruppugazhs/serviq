import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { ContactModal } from '../common/ContactModal';

export const PricingSection: React.FC = () => {
  const [contactModalOpen, setContactModalOpen] = useState(false);

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
    <section
      id="pricing"
      data-bg="white"
      className="relative z-30 bg-white text-slate-900 w-full py-20 sm:py-28 shadow-xl font-['Plus_Jakarta_Sans',sans-serif]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            HEADER (SERVIQ DEFAULT ANEK LATIN / SANS TYPOGRAPHY)
        ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 font-anek-latin tracking-tight leading-tight">
            Enterprise Fleet Package
          </h2>

          {/* Subtitle */}
          <p className="mt-3.5 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A comprehensive, all-inclusive package designed for commercial carriers and organizations.
            All modules, driver mobile apps, and dedicated coordinator support are included. No hidden fees.
          </p>
        </div>

        {/* =========================================================================
            SINGLE ENTERPRISE PACKAGE CARD
        ========================================================================= */}
        <div
          id="enterprise"
          className="relative rounded-3xl bg-white border-2 border-[#2335f2] shadow-2xl shadow-[#2335f2]/10 p-8 sm:p-12 transition-all duration-300"
        >
          {/* What's Included in this Package (Grouped 2-Column Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {ENTERPRISE_FEATURES.map((group, gIdx) => (
              <div key={gIdx} className="space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-anek-latin">
                  {group.category}
                </h4>
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

          {/* Divider line matching reference */}
          <div className="mt-10 pt-6 border-t border-slate-200/80">
            {/* Italic Note from reference */}
            <p className="text-xs sm:text-sm text-slate-500 italic leading-relaxed mb-6">
              Engineered for commercial freight carriers, interstate logistics, bus & municipal operators, and regional fleets requiring end-to-end operational governance.
            </p>

            {/* Action Button: Get Cost Estimate */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 text-center sm:text-left">
                Ready for tailored pricing? Reach our enterprise fleet team directly.
              </div>

              <button
                type="button"
                onClick={() => setContactModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-full font-bold text-sm sm:text-base bg-[#f59e0b] hover:bg-[#d97706] active:scale-98 text-slate-950 transition-all shadow-lg hover:shadow-xl hover:shadow-amber-500/20 cursor-pointer"
              >
                <span>Get Cost Estimate</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Talk To Us Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        defaultNeed="Commercial Fleet Management"
      />
    </section>
  );
};

export default PricingSection;
