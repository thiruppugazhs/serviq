import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown, ShieldCheck, FileText, ArrowLeft, X, MessageSquare } from 'lucide-react';
import { HelpFeedbackModal } from '../support/HelpFeedbackModal';

interface PolicyData {
  title: string;
  subtitle: string;
  effectiveDate: string;
  sections: { heading: string; paragraphs: string[] }[];
}

const POLICIES: Record<string, PolicyData> = {
  'terms-of-use': {
    title: 'Terms of Use',
    subtitle: 'Please review the terms and conditions governing the use of the SERVIQ Fleet intelligence and vehicle maintenance platform.',
    effectiveDate: 'January 1, 2026',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        paragraphs: [
          'By accessing, registering for, or using the SERVIQ platform, web dashboard, mobile driver applications, or associated telemetry APIs (collectively, the "Services"), provided by SERVIQ By Orcescale ("SERVIQ", "we", "our", or "us"), located in Chennai, Tamil Nadu, India, you agree to be legally bound by these Terms of Use.',
          'If you are entering into these Terms on behalf of an enterprise, logistics operator, transport corporation, or commercial entity, you represent and warrant that you possess full corporate authority to bind such entity to these Terms.',
        ],
      },
      {
        heading: '2. Platform Services & User Roles',
        paragraphs: [
          'SERVIQ grants you a revocable, non-exclusive, non-transferable, limited license to access our fleet operations console, log vehicle service records, manage driver profiles, and monitor real-time vehicle maintenance status.',
          'User accounts are categorized into Organization Administrators, Fleet Managers, and Drivers. Each user is responsible for safeguarding their login credentials and all activities occurring under their assigned credentials.',
        ],
      },
      {
        heading: '3. Telemetry, Odometer & Vehicle Data',
        paragraphs: [
          'Our platform processes vehicle odometer readings, diagnostic trouble codes (DTCs), GPS coordinates, fuel slips, and digital repair work orders. You agree to ensure that data submitted manually or synchronized via OBD-II/CAN-bus devices is genuine, accurate, and non-fraudulent.',
          'SERVIQ provides automated maintenance reminder alerts based on odometer and calendar triggers; however, fleet operators remain strictly liable for the mechanical roadworthiness and statutory fitness certificate of their vehicles.',
        ],
      },
      {
        heading: '4. Service Center & Merchant Collaborations',
        paragraphs: [
          'SERVIQ facilitates digitized work orders and job cards between fleet managers and authorized maintenance workshops. Any commercial agreement for physical parts replacement, lubricants, or manual mechanical labor is solely between the fleet operator and the respective service merchant.',
        ],
      },
      {
        heading: '5. Subscription Fees & Payment Terms',
        paragraphs: [
          'Access to premium fleet telemetry tiers, enterprise API connectors, and dedicated maintenance tracking modules is subject to timely subscription fee payments as designated in your commercial contract.',
          'All fees are exclusive of applicable Indian Goods and Services Tax (GST) and are non-refundable once an active billing cycle has commenced.',
        ],
      },
      {
        heading: '6. Limitation of Liability',
        paragraphs: [
          'In no event shall SERVIQ or its parent entity Orcescale be liable for direct, indirect, incidental, punitive, or consequential damages resulting from roadside vehicle breakdowns, engine failures, transit delays, or loss of commercial cargo.',
        ],
      },
      {
        heading: '7. Governing Law & Dispute Resolution',
        paragraphs: [
          'These Terms shall be construed, interpreted, and governed under the laws of the Republic of India. Any legal dispute, arbitration, or controversy arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the competent courts in Chennai, Tamil Nadu, India.',
        ],
      },
    ],
  },

  'privacy-policy': {
    title: 'Privacy Policy',
    subtitle: 'Learn how SERVIQ collects, processes, encrypts, and safeguards your vehicle telemetry and personal data.',
    effectiveDate: 'January 1, 2026',
    sections: [
      {
        heading: '1. Information We Collect',
        paragraphs: [
          'We collect business information (company name, GSTIN, registered address), user information (driver name, mobile number, government driving license number), and vehicle telemetry data (registration number, chassis number, odometer logs, GPS locations, trip timings, and maintenance history).',
          'Data is gathered during account registration, daily driver mobile app check-ins, breakdown photo uploads, and automated device sync.',
        ],
      },
      {
        heading: '2. Purpose of Data Processing',
        paragraphs: [
          'Your fleet data is utilized exclusively to calculate predictive maintenance intervals, issue preventive service notifications, detect irregular odometer jumps, generate expense summaries, and streamline breakdown roadside assistance.',
          'We do not sell, rent, or monetize your vehicle location or fleet proprietary data to third-party advertisers.',
        ],
      },
      {
        heading: '3. Data Security & Storage Architecture',
        paragraphs: [
          'All communication between driver mobile devices, manager browsers, and SERVIQ cloud servers is encrypted via TLS 1.3. Rest telemetry datasets are protected using AES-256 bit encryption on secure servers situated within Indian data center regions.',
        ],
      },
      {
        heading: '4. Driver Privacy & Tracking Consent',
        paragraphs: [
          'Fleet operators deploying the SERVIQ Driver Mobile App agree to obtain required consent from employed drivers regarding business-hours location tracking, odometer capture, and pre-trip vehicle condition checklists.',
        ],
      },
      {
        heading: '5. Data Retention & Deletion Rights',
        paragraphs: [
          'You may request complete export or deletion of your historical fleet logs, driver profiles, and maintenance vouchers upon termination of your SERVIQ account by contacting privacy@serviq.in.',
        ],
      },
    ],
  },

  'grievance-policy': {
    title: 'Grievance Policy',
    subtitle: 'Our dedicated redressal mechanism to ensure quick resolution for any fleet operator or driver concerns.',
    effectiveDate: 'January 1, 2026',
    sections: [
      {
        heading: '1. Commitment to Prompt Redressal',
        paragraphs: [
          'SERVIQ By Orcescale is dedicated to maintaining high service availability, transparent ticketing, and swift resolution of operational, billing, or telemetry discrepancy complaints.',
        ],
      },
      {
        heading: '2. Escalation & Redressal Matrix',
        paragraphs: [
          'Level 1 (In-App Support): Access the Help & Feedback menu option in the SERVIQ app or console to start a live support ticket. Initial response is provided within 4 hours.',
          'Level 2 (Grievance Officer): For unresolved operational issues exceeding 48 hours, issues are escalated directly to our designated Grievance Officer in Chennai.',
        ],
      },
      {
        heading: '3. Grievance Officer Details',
        paragraphs: [
          'Name: Grievance Redressal Officer, SERVIQ By Orcescale',
          'Office Location: Chennai, Tamil Nadu, India.',
          'Official Email: grievances@serviq.in',
          'Working Hours: Monday to Friday, 09:30 AM to 06:30 PM IST.',
        ],
      },
    ],
  },

  'merchant-terms': {
    title: 'Merchant Terms',
    subtitle: 'Terms governing authorized maintenance workshops, spare part vendors, and service center merchants.',
    effectiveDate: 'January 1, 2026',
    sections: [
      {
        heading: '1. Workshop & Merchant Onboarding',
        paragraphs: [
          'Authorized service stations, independent commercial workshops, and tire/lube centers onboarding onto the SERVIQ Partner Network must provide valid business registration, trade license, GST certificates, and physical workshop verification documents.',
        ],
      },
      {
        heading: '2. Job Cards & Maintenance Estimates',
        paragraphs: [
          'Merchants agree to publish digital job cards detailing verified parts replacing, labor charges, and diagnostic inspection findings through the SERVIQ Merchant Console prior to commencing high-value repairs.',
          'All billed parts must adhere to OEM (Original Equipment Manufacturer) or OES quality specifications to preserve fleet safety.',
        ],
      },
      {
        heading: '3. Payout Settlements & Performance Standards',
        paragraphs: [
          'Digital settlement of approved fleet maintenance invoices is processed via Indian banking clearing channels within 3 business days following job card sign-off by the respective fleet manager.',
        ],
      },
    ],
  },

  'data-protection-standards': {
    title: 'Data Protection Standards',
    subtitle: 'Comprehensive overview of our technical, architectural, and procedural controls protecting fleet assets.',
    effectiveDate: 'January 1, 2026',
    sections: [
      {
        heading: '1. Indian DPDP Act Compliance',
        paragraphs: [
          'SERVIQ aligns with the Digital Personal Data Protection (DPDP) Act of India and international information security benchmarks (ISO/IEC 27001). Personal identifiers belonging to drivers and fleet personnel are anonymized wherever feasible.',
        ],
      },
      {
        heading: '2. Network Isolation & Role-Based Access Control (RBAC)',
        paragraphs: [
          'Multi-tenant database isolation prevents cross-organization data leakage. Access rights are strictly partitioned: drivers can view only their active assigned vehicles, managers access their assigned depot, and enterprise admins govern organizational parameters.',
        ],
      },
      {
        heading: '3. Business Continuity & Disaster Recovery',
        paragraphs: [
          'Telemetry streams, maintenance invoices, and document attachments undergo automated, encrypted multi-zone daily snapshots with a Recovery Time Objective (RTO) under 60 minutes and Recovery Point Objective (RPO) under 5 minutes.',
        ],
      },
    ],
  },
};

export const LegalPage: React.FC<{ policyKey?: string }> = ({ policyKey: propPolicyKey }) => {
  const { slug } = useParams<{ slug: string }>();
  const activeKey = propPolicyKey || slug || 'terms-of-use';
  const policy = POLICIES[activeKey] || POLICIES['terms-of-use'];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [headerTheme, setHeaderTheme] = useState<'transparent' | 'blue' | 'white'>('transparent');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeKey]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 40) {
        setHeaderTheme('transparent');
        return;
      }
      const contentEl = document.getElementById('legal-content');
      if (contentEl) {
        const rect = contentEl.getBoundingClientRect();
        if (rect.top <= 50) {
          setHeaderTheme('white');
          return;
        }
      }
      setHeaderTheme('blue');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-studio-blue text-white font-['Plus_Jakarta_Sans',sans-serif] selection:bg-white selection:text-[#393df0] overflow-x-hidden relative">

      {/* Ambient background glow orbs */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="fixed bottom-20 right-10 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* Header — Dynamic Glass Header matching landing page */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full px-6 sm:px-12 transition-all duration-300 flex items-center justify-between border-none ${
          headerTheme === 'transparent'
            ? 'py-4 sm:py-5 bg-transparent backdrop-blur-none shadow-none'
            : headerTheme === 'blue'
            ? 'py-3.5 bg-[#1826d0]/80 backdrop-blur-xl shadow-lg shadow-blue-950/20'
            : 'py-3.5 bg-white/80 backdrop-blur-xl shadow-sm shadow-slate-900/5'
        }`}
      >
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <img
            src={headerTheme === 'white' ? '/logo-blue.png' : '/logo-white.png'}
            alt="Serviq"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow"
          />
          <img
            src="/serviq-name-logo.png"
            alt="Serviq"
            className={`h-5 sm:h-6 md:h-7 w-auto object-contain transition-all group-hover:opacity-90 ${
              headerTheme === 'white' ? 'filter brightness-0' : 'drop-shadow-sm'
            }`}
          />
        </Link>

        {/* Right: Back Link + Hamburger Menu */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/"
            className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
              headerTheme === 'white'
                ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                : 'border-white/20 text-white/90 hover:bg-white/10'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="w-10 h-10 flex flex-col justify-center items-end gap-1.5 p-2 focus:outline-none cursor-pointer group"
            aria-label="Navigation Menu"
          >
            <span
              className={`w-6 h-[2px] rounded-full transition-all group-hover:w-7 ${
                headerTheme === 'white' ? 'bg-slate-900' : 'bg-white'
              }`}
            ></span>
            <span
              className={`w-6 h-[2px] rounded-full transition-all group-hover:w-7 ${
                headerTheme === 'white' ? 'bg-slate-900' : 'bg-white'
              }`}
            ></span>
          </button>
        </div>
      </header>

      {/* Full-Page Drop-Down Menu */}
      <div
        className={`fixed inset-0 z-[100] bg-studio-blue text-white flex flex-col overflow-y-auto transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileMenuOpen ? 'translate-y-0 pointer-events-auto' : '-translate-y-full pointer-events-none'
        }`}
      >
        <div className="relative z-10 w-full px-6 sm:px-12 md:px-16 py-5 sm:py-6 flex items-center justify-between border-b border-white/10">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 sm:gap-3 group">
            <img src="/logo-white.png" alt="Serviq" className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow" />
            <img src="/serviq-name-logo.png" alt="Serviq" className="h-5 sm:h-6 md:h-7 w-auto object-contain drop-shadow-sm" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-10 h-10 sm:w-11 sm:h-11 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-6 h-6 text-white stroke-[2.5]" />
          </button>
        </div>

        <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 py-10 md:py-16 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="md:w-5/12 flex flex-col justify-start">
            <p className="text-white text-base sm:text-lg">
              Reach out to us via{' '}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setHelpModalOpen(true);
                }}
                className="underline underline-offset-4 decoration-2 font-medium hover:text-white/80 transition-colors cursor-pointer text-left"
              >
                Help & Feedback
              </button>
            </p>
            <p className="text-white/80 text-xs sm:text-sm mt-3 leading-relaxed max-w-sm">
              Need assistance with your fleet or account? Connect with our dedicated support team in Chennai.
            </p>
            <div className="mt-8 flex gap-3">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl text-center">
                Log In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 bg-white text-[#2335f2] font-bold rounded-xl shadow-lg hover:bg-white/95 text-center">
                Get Started
              </Link>
            </div>
          </div>

          <div className="md:w-7/12 flex flex-col space-y-2 md:space-y-3">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-4xl sm:text-5xl md:text-6xl font-bold text-white/70 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/download" onClick={() => setMobileMenuOpen(false)} className="text-4xl sm:text-5xl md:text-6xl font-bold text-white/70 hover:text-white transition-colors">
              Download App
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setHelpModalOpen(true);
              }}
              className="text-left text-4xl sm:text-5xl md:text-6xl font-bold text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              Help & Feedback
            </button>
            <Link to="/terms-of-use" onClick={() => setMobileMenuOpen(false)} className="text-2xl sm:text-3xl font-semibold text-white/60 hover:text-white transition-colors pt-4">
              Terms of Use
            </Link>
            <Link to="/privacy-policy" onClick={() => setMobileMenuOpen(false)} className="text-2xl sm:text-3xl font-semibold text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/grievance-policy" onClick={() => setMobileMenuOpen(false)} className="text-2xl sm:text-3xl font-semibold text-white/60 hover:text-white transition-colors">
              Grievance Policy
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PAGE 1 (FULL VIEWPORT): BIG BOLD TITLE ON GRADIENT BACKGROUND
      ========================================================================= */}
      <section className="min-h-screen relative flex flex-col justify-between items-center text-center px-4 sm:px-6 pt-24 pb-12 overflow-hidden bg-studio-blue">
        
        {/* Subtle decorative shield icon badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-white/90 animate-in fade-in duration-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>SERVIQ Legal & Compliance</span>
        </div>

        {/* Center Big Bold Title filling first page */}
        <div className="max-w-5xl mx-auto my-auto py-8">
          <h1 className="font-anek-latin font-bold text-white text-6xl sm:text-7xl md:text-8xl lg:text-[104px] leading-tight tracking-tight select-none drop-shadow-md animate-in zoom-in-95 duration-300">
            {policy.title}
          </h1>

          <p className="font-neue-haas-medium text-white/90 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mt-4 sm:mt-6 px-4">
            {policy.subtitle}
          </p>

          <div className="mt-6 text-xs text-white/70 font-mono tracking-wide">
            Effective: {policy.effectiveDate} | SERVIQ By Orcescale
          </div>
        </div>

        {/* Animated Scroll Down Indicator */}
        <div className="flex flex-col items-center gap-2 text-white/80 animate-bounce select-none">
          <span className="text-xs uppercase tracking-widest font-semibold">Scroll down to read</span>
          <ChevronDown className="w-5 h-5 text-white" />
        </div>
      </section>

      {/* =========================================================================
          PAGE 2+: LEGAL CONTENT (APPEARS ON SCROLL)
      ========================================================================= */}
      <section id="legal-content" className="py-20 sm:py-24 bg-white text-slate-800 relative">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          
          {/* Quick Policy Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2 pb-10 border-b border-slate-200 mb-12 text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider mr-2">All Policies:</span>
            {[
              { label: 'Terms of Use', path: '/terms-of-use' },
              { label: 'Privacy Policy', path: '/privacy-policy' },
              { label: 'Grievance Policy', path: '/grievance-policy' },
              { label: 'Merchant Terms', path: '/merchant-terms' },
              { label: 'Data Protection', path: '/data-protection-standards' },
            ].map((p) => (
              <Link
                key={p.path}
                to={p.path}
                className={`px-3.5 py-1.5 rounded-full transition-all font-medium ${
                  window.location.pathname === p.path
                    ? 'bg-studio-blue text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p.label}
              </Link>
            ))}
          </div>

          {/* Document Content Sections */}
          <div className="space-y-12 leading-relaxed text-sm sm:text-base text-slate-700">
            {policy.sections.map((sec, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                  {sec.heading}
                </h2>
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="leading-relaxed text-slate-600">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Support / Contact Note */}
          <div className="mt-16 p-6 sm:p-8 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Have questions regarding these terms?</h3>
              <p className="text-xs text-slate-500 mt-1">Our compliance and legal team in Chennai is here to provide clarity.</p>
            </div>
            <button
              onClick={() => setHelpModalOpen(true)}
              className="px-5 py-2.5 bg-studio-blue text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#1523c5] transition-all cursor-pointer shrink-0"
            >
              Contact Support
            </button>
          </div>

          {/* Back to top */}
          <div className="mt-12 text-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2335f2] hover:underline cursor-pointer"
            >
              <span>Back to top</span>
              <ChevronDown className="w-4 h-4 rotate-180" />
            </button>
          </div>

        </div>
      </section>

      {/* Footer matching standard landing page */}
      <footer className="bg-white text-slate-800 border-t-2 border-slate-100 py-12 px-6 sm:px-12 text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-slate-500">
          <div>
            Copyright © 2026 SERVIQ . All rights reserved.
          </div>
          <div className="md:text-right space-y-0.5 leading-relaxed text-xs text-slate-500">
            <div className="font-semibold text-slate-700">SERVIQ By Orcescale</div>
            <div>Location - Chennai, Tamil Nadu, India.</div>
          </div>
        </div>
      </footer>

      {/* Interactive Support Modal */}
      <HelpFeedbackModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
    </div>
  );
};
