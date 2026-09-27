import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Truck,
  Wrench,
  AlertTriangle,
  UserCheck,
  Receipt,
  FileText,
  Bell,
  BarChart3,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Gauge,
  Calendar,
  Lock,
  Download,
  Clock,
  QrCode,
  Layers,
  ChevronDown,
} from 'lucide-react';

import { HelpFeedbackModal } from '../support/HelpFeedbackModal';

const ABOUT_CARDS = [
  {
    step: '01',
    category: 'The Moving Parts',
    headline:
      'Managing a fleet means keeping track of hundreds of moving parts — vehicles, drivers, maintenance, repairs, documents, expenses, and daily operations.',
    chips: [
      { label: 'Vehicles', icon: '🚗' },
      { label: 'Drivers', icon: '👨‍✈️' },
      { label: 'Maintenance', icon: '🔧' },
      { label: 'Repairs', icon: '🛠️' },
      { label: 'Documents', icon: '📄' },
      { label: 'Expenses', icon: '💰' },
      { label: 'Operations', icon: '⚡' },
    ],
    highlightQuote: 'Hundreds of moving parts scattered across spreadsheets, paper, and phone calls.',
    isHeroCard: false,
  },
  {
    step: '02',
    category: 'Unified Architecture',
    headline: 'SERVIQ brings them together in one connected platform.',
    chips: [
      { label: 'Central Database', icon: '🗄️' },
      { label: 'Real-time Sync', icon: '🔄' },
      { label: 'Automated Alerts', icon: '🔔' },
      { label: 'Zero Disconnects', icon: '⚡' },
    ],
    highlightQuote: 'Every asset, driver, and maintenance schedule synchronized in real time.',
    isHeroCard: false,
  },
  {
    step: '03',
    category: 'Complete Lifecycle',
    headline:
      'From the moment a vehicle joins your fleet to every service, repair, and mile that follows, SERVIQ gives your team a clear view of what is happening and what needs attention.',
    chips: [
      { label: 'Onboarding & Specs', icon: '📋' },
      { label: 'Odometer Tracking', icon: '⏱️' },
      { label: 'Preventive Care', icon: '🛡️' },
      { label: 'Cost Auditing', icon: '📊' },
    ],
    highlightQuote: 'Proactive oversight from vehicle acquisition to daily highway operations.',
    isHeroCard: false,
  },
  {
    step: '04',
    category: 'Empowered Roles',
    headline:
      "Whether you're an organization admin, fleet manager, or driver, SERVIQ provides the right tools for the job — helping teams stay organized, respond faster, and keep vehicles ready for the road.",
    chips: [
      { label: 'Organization Admin', icon: '🏢' },
      { label: 'Fleet Manager', icon: '👤' },
      { label: 'Commercial Driver', icon: '📱' },
    ],
    highlightQuote: 'Custom workflows built specifically for how modern fleet teams work.',
    isHeroCard: false,
  },
  {
    step: '05',
    category: 'The SERVIQ Standard',
    headline: 'One platform. Every vehicle. Complete visibility.',
    chips: [
      { label: 'Total Visibility', icon: '👁️' },
      { label: 'Less Downtime', icon: '⏱️' },
      { label: 'Safe Journeys', icon: '🛡️' },
      { label: 'Ready for the Road', icon: '🚀' },
    ],
    highlightQuote: 'Keep your fleet moving forward with complete confidence and transparency.',
    isHeroCard: true,
  },
];

const AboutCardStack: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const totalScrollable = rect.height - window.innerHeight;
        if (totalScrollable <= 0) return;

        // When container top reaches 0, scrolled starts at 0
        const scrolled = -rect.top;
        // Divide the scroll track evenly across the 5 cards
        const progress = Math.max(0, Math.min(1, scrolled / (totalScrollable * 0.92)));
        const newIndex = Math.min(
          ABOUT_CARDS.length - 1,
          Math.floor(progress * ABOUT_CARDS.length)
        );
        setActiveIndex((prev) => (prev !== newIndex ? newIndex : prev));
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const getCardStyle = (index: number): React.CSSProperties => {
    const diff = index - activeIndex;

    if (diff === 0) {
      // Active Front Card
      return {
        transform: 'translate3d(0, 0, 0) scale(1)',
        opacity: 1,
        filter: 'blur(0px)',
        zIndex: 20,
        pointerEvents: 'auto',
        boxShadow:
          '0 25px 60px -15px rgba(35, 53, 242, 0.14), 0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)',
      };
    }

    if (diff < 0) {
      // Already read, stacks behind at top of deck
      const stackDepth = Math.abs(diff);
      return {
        transform: `translate3d(0, -${stackDepth * 15}px, -${stackDepth * 20}px) scale(${Math.max(
          0.85,
          1 - stackDepth * 0.04
        )})`,
        opacity: Math.max(0.12, 1 - stackDepth * 0.28),
        filter: `blur(${Math.min(5, stackDepth * 1.5)}px)`,
        zIndex: 20 - stackDepth,
        pointerEvents: 'none',
        boxShadow: '0 10px 25px -10px rgba(0, 0, 0, 0.06)',
      };
    }

    // Future Card waiting below to enter
    return {
      transform: `translate3d(0, ${Math.min(100, diff * 55)}px, 0) scale(${Math.max(
        0.94,
        1 - diff * 0.025
      )})`,
      opacity: 0,
      filter: 'blur(3px)',
      zIndex: 10 - diff,
      pointerEvents: 'none',
    };
  };

  return (
    <div ref={containerRef} className="relative bg-white min-h-[300vh] sm:min-h-[340vh] w-full">
      <div className="sticky top-0 min-h-screen bg-white flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto select-none w-full">
        
        {/* Top Header Bar: Kicker + Interactive Step Pills */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Section Kicker */}
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2335f2] animate-pulse" />
            <span
              className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#2335f2] font-anek-latin"
              style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
            >
              About SERVIQ
            </span>
          </div>

          {/* Clickable Step Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100/80 p-1 rounded-full border border-slate-200">
            {ABOUT_CARDS.map((card, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={card.step}
                  onClick={() => setActiveIndex(idx)}
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#2335f2] text-white shadow-sm scale-105'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  aria-label={`Jump to step ${card.step}`}
                >
                  {card.step}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center my-2 sm:my-3">
          <h2
            className="text-2xl sm:text-4xl md:text-[44px] font-black text-slate-900 font-anek-latin tracking-tight leading-[1.12] max-w-3xl mx-auto"
            style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
          >
            Everything Your Fleet Needs. In One Place.
          </h2>
        </div>

        {/* 3D Stack Stage */}
        <div className="relative w-full max-w-3xl mx-auto h-[350px] sm:h-[380px] md:h-[400px] flex items-center justify-center my-auto">
          {ABOUT_CARDS.map((card, idx) => {
            const isHero = card.isHeroCard;
            return (
              <div
                key={card.step}
                onClick={() => setActiveIndex(idx)}
                style={getCardStyle(idx)}
                className={`absolute inset-0 rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col justify-between transition-all duration-500 ease-out cursor-pointer ${
                  isHero
                    ? 'bg-gradient-to-br from-[#1622aa] via-[#2335f2] to-[#3949f5] text-white border-2 border-white/20'
                    : 'bg-white border-2 border-slate-200/90 text-slate-900'
                }`}
              >
                {/* Continuous Shimmer on Hero Card */}
                {isHero && (
                  <span className="absolute inset-0 -translate-x-full animate-continuous-shimmer bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none rounded-3xl" />
                )}

                {/* Card Top: Step Pill + Category Label */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-mono font-black text-xs sm:text-sm flex items-center justify-center ${
                        isHero
                          ? 'bg-white text-[#2335f2] shadow-md'
                          : 'bg-studio-blue/10 text-[#2335f2]'
                      }`}
                    >
                      {card.step}
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-extrabold uppercase tracking-widest font-anek-latin ${
                        isHero ? 'text-white/80' : 'text-[#2335f2]'
                      }`}
                      style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                    >
                      {card.category}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2.5 sm:px-3 py-1 rounded-full ${
                      isHero ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    SERVIQ Architecture
                  </span>
                </div>

                {/* Card Body: Main Headline + Visual Chips */}
                <div className="my-auto py-2 sm:py-3 relative z-10">
                  <p
                    className={`font-anek-latin leading-snug sm:leading-[1.5] tracking-tight ${
                      isHero
                        ? 'text-2xl sm:text-3xl md:text-[34px] text-white font-black drop-shadow-sm'
                        : 'text-base sm:text-xl md:text-[23px] text-slate-900 font-bold'
                    }`}
                    style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                  >
                    {card.headline}
                  </p>

                  {/* Interactive Visual Chips */}
                  <div className="flex flex-wrap gap-2 sm:gap-2.5 mt-4 sm:mt-5">
                    {card.chips.map((chip, cIdx) => (
                      <span
                        key={cIdx}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                          isHero
                            ? 'bg-white/15 text-white border border-white/20 backdrop-blur-sm'
                            : 'bg-slate-50 border border-slate-200 text-slate-700 shadow-xs'
                        }`}
                      >
                        <span>{chip.icon}</span>
                        <span
                          className="font-anek-latin font-bold"
                          style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                        >
                          {chip.label}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Bottom: Quote & Progress */}
                <div
                  className={`pt-3 border-t flex items-center justify-between text-xs sm:text-sm relative z-10 ${
                    isHero ? 'border-white/20 text-white/80' : 'border-slate-100 text-slate-500'
                  }`}
                >
                  <span className="font-medium italic truncate max-w-[80%]">
                    "{card.highlightQuote}"
                  </span>
                  <span className="font-mono text-[11px] font-bold opacity-75">
                    0{idx + 1} / 05
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar: Progress Indicator & Scroll Prompt */}
        <div className="w-full max-w-3xl mx-auto flex items-center justify-between pt-3 border-t border-slate-100">
          {/* Progress Bar */}
          <div className="flex items-center gap-3 w-1/2 sm:w-1/3">
            <span className="text-[11px] font-mono font-bold text-slate-400">
              0{activeIndex + 1}
            </span>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2335f2] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((activeIndex + 1) / ABOUT_CARDS.length) * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-400">
              05
            </span>
          </div>

          {/* Scroll / Swipe Prompt */}
          <div className="text-right">
            <span
              className="text-xs uppercase tracking-widest text-slate-400 font-bold inline-flex items-center gap-1.5 font-anek-latin"
              style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
            >
              {activeIndex === ABOUT_CARDS.length - 1 ? (
                <span className="text-[#2335f2] font-extrabold">Complete Visibility</span>
              ) : (
                <>
                  Scroll down for next card
                  <ChevronDown className="w-3.5 h-3.5 animate-bounce text-[#2335f2]" />
                </>
              )}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [headerTheme, setHeaderTheme] = useState<'transparent' | 'blue' | 'white'>('transparent');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    const handleScroll = () => {
      // First page / hero top: it should be like there is no header
      if (window.scrollY < 40) {
        setHeaderTheme('transparent');
        return;
      }

      // Check which section is passing underneath the fixed header (y ≈ 50)
      const sections = document.querySelectorAll('section, footer');
      let currentSectionBg: 'blue' | 'white' = 'blue';

      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        // If the section covers the header area (top <= 50 and bottom > 50)
        if (rect.top <= 50 && rect.bottom > 50) {
          if (sec.classList.contains('bg-white') || sec.getAttribute('data-bg') === 'white') {
            currentSectionBg = 'white';
          } else {
            currentSectionBg = 'blue';
          }
        }
      });

      setHeaderTheme(currentSectionBg);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'fleet_manager') return '/manager/dashboard';
    if (user.role === 'driver') return '/driver/home';
    return '/login';
  };

  return (
    <div className="min-h-screen bg-studio-blue text-white font-['Plus_Jakarta_Sans',sans-serif] selection:bg-white selection:text-[#393df0] overflow-x-hidden relative">

      {/* Ambient background glow orbs */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="fixed bottom-20 right-10 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* =========================================================================
          1. NAVIGATION — DYNAMIC GLASS HEADER
             - On first page: like there is no header (bg-transparent, no line, no blur)
             - On scroll over blue sections: blue glass, white logo, white name logo, white hamburger
             - On scroll over white sections: white glass, blue/white logo, black name logo, black hamburger
             - NO thin line at bottom
      ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full px-6 sm:px-12 transition-all duration-300 flex items-center justify-between border-none ${
          headerTheme === 'transparent'
            ? 'py-4 sm:py-5 bg-transparent backdrop-blur-none shadow-none'
            : headerTheme === 'blue'
            ? 'py-3.5 bg-[#1826d0]/80 backdrop-blur-xl shadow-lg shadow-blue-950/20'
            : 'py-3.5 bg-white/80 backdrop-blur-xl shadow-sm shadow-slate-900/5'
        }`}
      >
        {/* Left: Logo & Wordmark matching section background */}
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

        {/* Right: Hamburger icon (White on blue/transparent, Black on white) */}
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
      </header>

      {/* =========================================================================
          FULL-PAGE DROP-DOWN MENU (MATCHING REFERENCE IMAGE)
          Slides smoothly down from the top on open, and slides back up on close
      ========================================================================= */}
      <div
        className={`fixed inset-0 z-[100] bg-studio-blue text-white flex flex-col overflow-y-auto transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileMenuOpen ? 'translate-y-0 pointer-events-auto' : '-translate-y-full pointer-events-none'
        }`}
      >
        {/* Ambient background glow orbs inside the menu */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[160px] pointer-events-none" />

        {/* Top Bar: Serviq Logo (White) + Rounded Close 'X' Button */}
        <div className="relative z-10 w-full px-6 sm:px-12 md:px-16 py-5 sm:py-6 flex items-center justify-between border-b border-white/10">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 sm:gap-3 group"
          >
            <img
              src="/logo-white.png"
              alt="Serviq"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow"
            />
            <img
              src="/serviq-name-logo.png"
              alt="Serviq"
              className="h-5 sm:h-6 md:h-7 w-auto object-contain drop-shadow-sm group-hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* Close 'X' button in rounded translucent square matching screenshot */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-10 h-10 sm:w-11 sm:h-11 bg-white/20 hover:bg-white/30 active:scale-95 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm"
            aria-label="Close Menu"
          >
            <X className="w-6 h-6 text-white stroke-[2.5]" />
          </button>
        </div>

        {/* Content Area: 2 Columns matching screenshot */}
        <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 py-10 md:py-16 flex flex-col md:flex-row justify-between items-start gap-12 md:gap-16">
          
          {/* Left Column: Reach out & Support + Action Buttons */}
          <div className="md:w-5/12 lg:w-4/12 flex flex-col justify-start pt-2 sm:pt-4">
            <p className="text-white text-base sm:text-lg">
              Reach out to us via{' '}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setHelpModalOpen(true);
                }}
                className="underline underline-offset-4 decoration-2 font-medium hover:text-white/80 transition-colors cursor-pointer text-left inline"
              >
                Help & Feedback
              </button>
            </p>
            <p className="text-white/80 text-xs sm:text-sm mt-3 leading-relaxed max-w-sm">
              Need assistance with your fleet or account? Connect with our dedicated support team in Chennai.
            </p>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {user ? (
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-6 py-3 bg-white text-[#2335f2] font-bold rounded-xl shadow-lg hover:bg-white/95 text-center transition-all"
                >
                  Open Console →
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl text-center transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-6 py-3 bg-white text-[#2335f2] font-bold rounded-xl shadow-lg hover:bg-white/95 text-center transition-all"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Large Bold Nav Links matching screenshot */}
          <div className="md:w-7/12 lg:w-8/12 flex flex-col space-y-1 sm:space-y-2 md:space-y-3">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-white/70 hover:text-white leading-[1.12] tracking-tight block transition-colors select-none"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-white/70 hover:text-white leading-[1.12] tracking-tight block transition-colors select-none"
            >
              About Us
            </a>
            <Link
              to="/download"
              onClick={() => setMobileMenuOpen(false)}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-white/70 hover:text-white leading-[1.12] tracking-tight block transition-colors select-none"
            >
              Download App
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setHelpModalOpen(true);
              }}
              className="text-left text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-white/70 hover:text-white leading-[1.12] tracking-tight block transition-colors select-none cursor-pointer"
            >
              Help & Feedback
            </button>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-white/70 hover:text-white leading-[1.12] tracking-tight block transition-colors select-none"
            >
              About Us
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-white/70 hover:text-white leading-[1.12] tracking-tight block transition-colors select-none"
            >
              Features
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-white/70 hover:text-white leading-[1.12] tracking-tight block transition-colors select-none"
            >
              Enterprise FAQ
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-white/70 hover:text-white leading-[1.12] tracking-tight block transition-colors select-none"
            >
              Contact Us
            </a>
          </div>

        </div>
      </div>

      {/* =========================================================================
          HERO SECTION — EXACT MATCH OF UPLOADED DESIGN (FULL VIEWPORT)
      ========================================================================= */}
      <section
        id="hero"
        className="relative z-10 min-h-screen flex flex-col justify-between overflow-hidden bg-studio-blue pt-20 sm:pt-24"
      >
        {/* Center Typography & CTA Buttons */}
        <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center my-auto text-center px-4 py-8 animate-in fade-in zoom-in-95 duration-300">
          {/* Main Headline: Two lines in Anek Latin font */}
          <h1
            className="font-anek-latin font-bold text-white text-2xl sm:text-3xl md:text-4xl lg:text-[46px] xl:text-[52px] leading-[1.15] tracking-tight select-none drop-shadow-md uppercase"
            style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
          >
            <span className="block">EVERY MILE, EVERY VEHICLE</span>
            <span className="block text-white/95 mt-1 sm:mt-1.5">UNDER CONTROL</span>
          </h1>

          {/* Sub-headline in Neue Haas Medium */}
          <p className="font-neue-haas-medium text-white/90 text-sm sm:text-base md:text-lg max-w-2xl lg:max-w-3xl mx-auto leading-relaxed mt-4 sm:mt-5 px-4">
            We help organizations keep their fleets moving through smarter vehicle management, timely maintenance, seamless repair tracking, and complete fleet visibility.
          </p>

          {/* CTA Action Button with Continuous BG Shining */}
          <div className="mt-7 sm:mt-8 flex items-center justify-center z-20">
            {/* Get Started Button (Small Size) */}
            <Link
              to={user ? getDashboardLink() : "/register"}
              className="relative overflow-hidden group inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-2.5 rounded-xl bg-white text-[#2335f2] font-bold text-xs sm:text-sm shadow-lg shadow-blue-950/25 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              {/* Continuous BG Shining Sheen */}
              <span className="absolute inset-0 -translate-x-full animate-continuous-shimmer bg-gradient-to-r from-transparent via-blue-400/35 to-transparent pointer-events-none" />
              <span className="relative z-10">{user ? "Open Console" : "Get Started"}</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* =========================================================================
            3D ELEMENTS (Matching Reference Image: Spacing, Placement, Size & Soft Shadows)
        ========================================================================= */}

        {/* 1. 3D Gear (Top-Left / Mid-Left) - Moved a little bit down */}
        <div className="absolute -left-12 sm:-left-16 md:-left-20 lg:-left-24 top-[18%] sm:top-[19%] md:top-[20%] w-28 sm:w-36 md:w-44 lg:w-52 pointer-events-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] z-10 select-none">
          <img
            src="/gear.png"
            alt="3D Fleet Gear"
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>

        {/* 2. 3D Cube (Lower-Left Foreground) - Slightly bigger, touches the bottom of the screen */}
        <div className="absolute left-3 sm:left-6 md:left-10 lg:left-14 bottom-0 w-26 sm:w-32 md:w-38 lg:w-46 pointer-events-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] z-20 select-none">
          <img
            src="/cube.png"
            alt="3D Angled Cube"
            className="w-full h-auto object-contain object-bottom block"
            draggable={false}
          />
        </div>

        {/* 3. 3D Spanner / Wrench (Top-Right) - Moved slightly down */}
        <div className="absolute -right-8 sm:-right-12 md:-right-16 lg:-right-20 top-[13%] sm:top-[14%] md:top-[15%] w-32 sm:w-44 md:w-52 lg:w-64 pointer-events-none filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.14)] z-10 select-none">
          <img
            src="/spanner.png"
            alt="3D Spanner Wrench"
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>

        {/* 4. 3D Car with headlights (Bottom-Right) - Sits on bottom of screen with ground shadow */}
        <div className="absolute -right-2 sm:right-2 md:right-6 lg:right-10 bottom-0 w-44 sm:w-60 md:w-72 lg:w-[350px] pointer-events-none z-20 select-none">
          {/* Ground Contact Shadow Under the Car */}
          <div className="absolute -bottom-1.5 left-[4%] right-[2%] h-4 sm:h-5 md:h-6 bg-[#0c1445]/60 rounded-[100%] blur-[8px] pointer-events-none" />
          <div className="absolute -bottom-1 left-[10%] right-[8%] h-3 sm:h-4 bg-black/40 rounded-[100%] blur-[5px] pointer-events-none" />

          {/* Soft Headlight Glow */}
          <div className="absolute left-[8%] bottom-[32%] w-14 h-10 bg-white/15 rounded-full blur-lg pointer-events-none" />
          <div className="absolute left-[30%] bottom-[32%] w-18 h-12 bg-white/15 rounded-full blur-lg pointer-events-none" />
          <img
            src="/car.png"
            alt="3D Fleet Vehicle"
            className="w-full h-auto object-contain object-bottom block filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)]"
            draggable={false}
          />
        </div>
      </section>

      {/* =========================================================================
          PAGE 2 (EVEN): ABOUT US — SCROLL-DRIVEN WORD-BY-WORD MANIFESTO & PLATFORM
      ========================================================================= */}
      <section id="about" className="relative z-30 bg-white text-slate-900 w-full shadow-2xl">
        {/* 3D Sticky Card Stack */}
        <AboutCardStack />
      </section>

      {/* =========================================================================
          PAGE 3 (EVEN): FEATURES SECTION — WHITE BACKGROUND
      ========================================================================= */}
      <section id="features" className="w-full bg-white text-slate-900">
        <div className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
          
          {/* Section Kicker */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2335f2] animate-pulse" />
            <span
              className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#2335f2] font-anek-latin"
              style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
            >
              Features
            </span>
          </div>

          {/* Section Heading & Subheading */}
          <div className="max-w-3xl mb-12 sm:mb-16">
            <h2
              className="text-3xl sm:text-5xl font-black text-slate-900 font-anek-latin tracking-tight leading-tight"
              style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
            >
              Everything You Need to Keep Moving.
            </h2>
            <p
              className="text-sm sm:text-base md:text-lg text-slate-600 mt-4 leading-relaxed font-anek-latin"
              style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
            >
              From everyday fleet operations to unexpected repairs, SERVIQ keeps your vehicles, people, and maintenance connected.
            </p>
          </div>

          {/* 9 Feature Cards in 3x3 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {/* Feature 01 */}
            <div className="p-7 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-50 border-2 border-slate-100 hover:border-[#393df0]/30 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-studio-blue/10 text-[#393df0] flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-[#393df0] group-hover:text-white transition-all duration-300 shadow-sm">
                    <Truck className="w-6 h-6" />
                  </div>
                  <span className="font-mono font-black text-xs sm:text-sm text-slate-400 group-hover:text-[#393df0] transition-colors">
                    Feature 01
                  </span>
                </div>
                <h3
                  className="font-extrabold text-xl sm:text-2xl text-slate-900 font-anek-latin group-hover:text-[#393df0] transition-colors"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Vehicle Management
                </h3>
                <p
                  className="font-bold text-sm sm:text-base text-slate-800 mt-2 font-anek-latin"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Know every vehicle, inside and out.
                </p>
                <p
                  className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-anek-latin"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Manage vehicle profiles, assignments, status, odometer readings, service history, and important information from one place.
                </p>
              </div>
            </div>

            {/* Feature 02 */}
            <div className="p-7 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-50 border-2 border-slate-100 hover:border-[#393df0]/30 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-studio-blue/10 text-[#393df0] flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-[#393df0] group-hover:text-white transition-all duration-300 shadow-sm">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <span className="font-mono font-black text-xs sm:text-sm text-slate-400 group-hover:text-[#393df0] transition-colors">
                    Feature 02
                  </span>
                </div>
                <h3
                  className="font-extrabold text-xl sm:text-2xl text-slate-900 font-anek-latin group-hover:text-[#393df0] transition-colors"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Driver Management
                </h3>
                <p
                  className="font-bold text-sm sm:text-base text-slate-800 mt-2 font-anek-latin"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Keep your drivers connected to their vehicles.
                </p>
                <p
                  className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-anek-latin"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Create individual driver profiles, manage assignments, track details, and give drivers quick access to the information they need.
                </p>
              </div>
            </div>

            {/* Feature 03 */}
            <div className="p-7 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-50 border-2 border-slate-100 hover:border-[#393df0]/30 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-studio-blue/10 text-[#393df0] flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-[#393df0] group-hover:text-white transition-all duration-300 shadow-sm">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <span className="font-mono font-black text-xs sm:text-sm text-slate-400 group-hover:text-[#393df0] transition-colors">
                    Feature 03
                  </span>
                </div>
                <h3
                  className="font-extrabold text-xl sm:text-2xl text-slate-900 font-anek-latin group-hover:text-[#393df0] transition-colors"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Maintenance Management
                </h3>
                <p
                  className="font-bold text-sm sm:text-base text-slate-800 mt-2 font-anek-latin"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Stay ahead of what’s due.
                </p>
                <p
                  className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-anek-latin"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Schedule maintenance, track service history, monitor upcoming work, and make sure important servicing doesn't get overlooked.
                </p>
              </div>
            </div>

            {/* Feature 04 */}
            <div className="p-7 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-50 border-2 border-slate-100 hover:border-[#393df0]/30 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-studio-blue/10 text-[#393df0] flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-[#393df0] group-hover:text-white transition-all duration-300 shadow-sm">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <span className="font-mono font-black text-xs sm:text-sm text-slate-400 group-hover:text-[#393df0] transition-colors">
                    Feature 04
                  </span>
                </div>
                <h3
                  className="font-extrabold text-xl sm:text-2xl text-slate-900 font-anek-latin group-hover:text-[#393df0] transition-colors"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Repair Tracking
                </h3>
                <p
                  className="font-bold text-sm sm:text-base text-slate-800 mt-2 font-anek-latin"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  From issue reported to repair completed.
                </p>
                <p
                  className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-anek-latin"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Drivers can report vehicle issues while fleet managers can track, manage, and update repairs throughout the entire process.
                </p>
              </div>
            </div>

            {/* Feature 05 */}
            <div className="p-7 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-50 border-2 border-slate-100 hover:border-[#393df0]/30 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-studio-blue/10 text-[#393df0] flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-[#393df0] group-hover:text-white transition-all duration-300 shadow-sm">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <span className="font-mono font-black text-xs sm:text-sm text-slate-400 group-hover:text-[#393df0] transition-colors">
                    Feature 05
                  </span>
                </div>
                <h3
                  className="font-extrabold text-xl sm:text-2xl text-slate-900 font-anek-latin group-hover:text-[#393df0] transition-colors"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Expense Management
                </h3>
                <p
                  className="font-bold text-sm sm:text-base text-slate-800 mt-2 font-anek-latin"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Know where your fleet spending goes.
                </p>
                <p
                  className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-anek-latin"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Keep maintenance and repair expenses organized so your team has a clearer picture of vehicle-related costs.
                </p>
              </div>
            </div>

            {/* Feature 06 */}
            <div className="p-7 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-50 border-2 border-slate-100 hover:border-[#393df0]/30 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-studio-blue/10 text-[#393df0] flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-[#393df0] group-hover:text-white transition-all duration-300 shadow-sm">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="font-mono font-black text-xs sm:text-sm text-slate-400 group-hover:text-[#393df0] transition-colors">
                    Feature 06
                  </span>
                </div>
                <h3
                  className="font-extrabold text-xl sm:text-2xl text-slate-900 font-anek-latin group-hover:text-[#393df0] transition-colors"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Documents
                </h3>
                <p
                  className="font-bold text-sm sm:text-base text-slate-800 mt-2 font-anek-latin"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Keep important documents within reach.
                </p>
                <p
                  className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-anek-latin"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Organize vehicle and driver documents, track their details, and stay aware of upcoming expirations.
                </p>
              </div>
            </div>

            {/* Feature 07 */}
            <div className="p-7 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-50 border-2 border-slate-100 hover:border-[#393df0]/30 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-studio-blue/10 text-[#393df0] flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-[#393df0] group-hover:text-white transition-all duration-300 shadow-sm">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="font-mono font-black text-xs sm:text-sm text-slate-400 group-hover:text-[#393df0] transition-colors">
                    Feature 07
                  </span>
                </div>
                <h3
                  className="font-extrabold text-xl sm:text-2xl text-slate-900 font-anek-latin group-hover:text-[#393df0] transition-colors"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Vehicle Health
                </h3>
                <p
                  className="font-bold text-sm sm:text-base text-slate-800 mt-2 font-anek-latin"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Know when a vehicle needs attention.
                </p>
                <p
                  className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-anek-latin"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Keep track of vehicle condition, reported issues, maintenance status, and other important health indicators.
                </p>
              </div>
            </div>

            {/* Feature 08 */}
            <div className="p-7 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-50 border-2 border-slate-100 hover:border-[#393df0]/30 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-studio-blue/10 text-[#393df0] flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-[#393df0] group-hover:text-white transition-all duration-300 shadow-sm">
                    <Bell className="w-6 h-6" />
                  </div>
                  <span className="font-mono font-black text-xs sm:text-sm text-slate-400 group-hover:text-[#393df0] transition-colors">
                    Feature 08
                  </span>
                </div>
                <h3
                  className="font-extrabold text-xl sm:text-2xl text-slate-900 font-anek-latin group-hover:text-[#393df0] transition-colors"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Notifications & Reminders
                </h3>
                <p
                  className="font-bold text-sm sm:text-base text-slate-800 mt-2 font-anek-latin"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  The right information, at the right time.
                </p>
                <p
                  className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-anek-latin"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Stay updated about maintenance, repairs, documents, assignments, and other important fleet activities.
                </p>
              </div>
            </div>

            {/* Feature 09 */}
            <div className="p-7 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-50 border-2 border-slate-100 hover:border-[#393df0]/30 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-studio-blue/10 text-[#393df0] flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-[#393df0] group-hover:text-white transition-all duration-300 shadow-sm">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <span className="font-mono font-black text-xs sm:text-sm text-slate-400 group-hover:text-[#393df0] transition-colors">
                    Feature 09
                  </span>
                </div>
                <h3
                  className="font-extrabold text-xl sm:text-2xl text-slate-900 font-anek-latin group-hover:text-[#393df0] transition-colors"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Fleet Insights
                </h3>
                <p
                  className="font-bold text-sm sm:text-base text-slate-800 mt-2 font-anek-latin"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Turn fleet activity into clear visibility.
                </p>
                <p
                  className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-anek-latin"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  Get an organized view of vehicles, maintenance, repairs, expenses, and fleet operations to make everyday decisions easier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQS SECTION — BLUE BACKGROUND WITH 10 ACCORDION CARDS
      ========================================================================= */}
      <section id="faq" className="py-24 sm:py-32 bg-studio-blue text-white relative">
        {/* Ambient background glow orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Centered Big Bold FAQs Title matching reference image */}
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-white font-['Outfit',sans-serif] text-center mb-14 tracking-tight drop-shadow-sm select-none">
            FAQs
          </h2>

          {/* 10 Accordion Cards matching reference screenshot */}
          <div className="space-y-4">
            {[
              {
                question: 'What is SERVIQ?',
                answer:
                  'SERVIQ is an all-in-one fleet operations and vehicle maintenance intelligence platform. It automates preventive service scheduling, connects highway drivers to verified repair workshops, and gives fleet managers full transparency over maintenance expenses and vehicle health.',
              },
              {
                question: 'How does the dual-trigger maintenance reminder work?',
                answer:
                  'SERVIQ synchronizes both daily odometer mileage and calendar intervals. If a vehicle approaches its 10,000 km oil service or 90-day inspection milestone, the system automatically alerts both the fleet manager and driver before mechanical issues arise.',
              },
              {
                question: 'How can drivers report roadside breakdowns using the mobile app?',
                answer:
                  'Drivers simply tap "Report Breakdown" on the SERVIQ Mobile App, capture a photo of the defect, and select the issue category. The app automatically geotags the vehicle\'s exact GPS location and notifies the nearest authorized workshop and fleet dispatcher in under 60 seconds.',
              },
              {
                question: 'Can SERVIQ integrate with OBD-II devices and GPS trackers?',
                answer:
                  'Yes. SERVIQ supports direct API integrations with standard OBD-II scanners, CAN-bus telemetry hardware, and major GPS tracking providers to ingest live mileage, fault codes (DTCs), and diagnostic health data automatically.',
              },
              {
                question: 'How does SERVIQ help reduce fleet maintenance costs?',
                answer:
                  'By enforcing scheduled preventive maintenance, fleets avoid catastrophic highway engine seizures and transmission failures. Digital job cards and itemized parts auditing eliminate unauthorized workshop billing, reducing overall fleet maintenance expenditure by up to 42%.',
              },
              {
                question: 'What types of commercial vehicles are supported?',
                answer:
                  'SERVIQ supports all commercial vehicles including light commercial vehicles (LCVs), heavy commercial trucks (HCVs), interstate trailers, municipal buses, delivery vans, refrigerated trucks, and electric fleet vehicles.',
              },
              {
                question: 'How does digital document storage work for driver compliance?',
                answer:
                  'Every vehicle has a digital glovebox storing its Registration Certificate (RC), Insurance Policy, Pollution Under Control (PUC), National Permits, and Fitness Certificates. Drivers can access these offline via the mobile app during RTO or traffic police inspections.',
              },
              {
                question: 'Can multiple fleet managers and depot supervisors use the platform?',
                answer:
                  'Yes. SERVIQ features enterprise Role-Based Access Control (RBAC). You can assign distinct permissions for organization admins, regional depot managers, dispatch officers, and commercial drivers.',
              },
              {
                question: 'How does workshop billing and job card verification work?',
                answer:
                  'When a vehicle enters an authorized workshop, mechanics create a digital job card detailing spare parts, labor charges, and diagnostic findings. Fleet managers review and approve the estimate digitally before physical repairs commence.',
              },
              {
                question: 'How do I get started with SERVIQ for my fleet?',
                answer:
                  'Getting started is seamless. Click "Get Started Free" to create your company account, add your vehicle registration numbers, and invite your drivers to download the mobile app. You can have your fleet operational in under 10 minutes.',
              },
            ].map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white shadow-xl overflow-hidden transition-all duration-200 border border-white/20 hover:shadow-2xl"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full py-5 px-6 sm:px-8 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-base sm:text-lg text-slate-900 font-['Outfit',sans-serif]">
                      {faq.question}
                    </span>
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#3949f5] hover:bg-[#2535e0] flex items-center justify-center shrink-0 transition-transform duration-300 shadow-sm ${
                        isOpen ? 'rotate-180 bg-[#2535e0]' : ''
                      }`}
                    >
                      <ChevronDown className="w-5 h-5 text-white stroke-[2.5]" />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-6 sm:px-8 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          PAGE 14 (EVEN): FOOTER — WHITE BACKGROUND (Matching Images 2 & 3)
      ========================================================================= */}
      <footer id="contact" className="bg-white text-slate-800 pt-20 pb-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-left">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Logo and Tagline matching Image 2 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-12 border-b border-slate-100 gap-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo-blue.png"
                alt="SERVIQ Logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-slate-900 font-['Outfit',sans-serif] block leading-none">
                  serviq.
                </span>
                <span className="text-[11px] text-slate-500 font-semibold tracking-wider block mt-0.5">
                  by Fleet Innovations
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-500 max-w-sm sm:text-right font-medium">
              Simplify Fleet Maintenance. Reduce Downtime. Keep Vehicles Ready.
            </div>
          </div>

          {/* 4-Column Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-14 border-b border-slate-100 text-xs">
            {/* Col 1: Company */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 font-['Outfit',sans-serif]">Company</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#about" className="hover:text-[#393df0] transition-colors">About us</a></li>
                <li><a href="#faq" className="hover:text-[#393df0] transition-colors">Enterprise FAQ</a></li>
              </ul>
            </div>

            {/* Col 2: Legal & Compliance */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 font-['Outfit',sans-serif]">Legal & Compliance</h4>
              <ul className="space-y-2 text-slate-600">
                <li><Link to="/terms-of-use" className="hover:text-[#393df0] transition-colors">Terms of use</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-[#393df0] transition-colors">Privacy Policy</Link></li>
                <li><Link to="/grievance-policy" className="hover:text-[#393df0] transition-colors">Grievance Policy</Link></li>
                <li><Link to="/merchant-terms" className="hover:text-[#393df0] transition-colors">Merchant Terms</Link></li>
                <li><Link to="/data-protection-standards" className="hover:text-[#393df0] transition-colors">Data Protection Standards</Link></li>
              </ul>
            </div>

            {/* Col 3: Download App */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 font-['Outfit',sans-serif]">Download App</h4>
              <ul className="space-y-2 text-slate-600">
                <li><Link to="/download" className="hover:text-[#393df0] transition-colors">Download App</Link></li>
              </ul>
            </div>

            {/* Col 4: Support */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 font-['Outfit',sans-serif]">Support</h4>
              <p className="text-slate-700 font-medium leading-relaxed">
                Get Answers and Assistance Right Where You Need It
              </p>
              <ol className="space-y-2 text-slate-600 leading-relaxed list-decimal list-inside">
                <li>Click the menu</li>
                <li>
                  Go to the{' '}
                  <button
                    onClick={() => setHelpModalOpen(true)}
                    className="font-semibold text-slate-800 underline hover:text-[#2335f2] cursor-pointer inline"
                  >
                    Help & Feedback
                  </button>{' '}
                  option.
                </li>
                <li>Select the <span className="font-semibold text-slate-800">relevant category</span> matching your issue to start a live chat instantly.</li>
              </ol>
            </div>
          </div>

          {/* Bottom Copyright & Address Row */}
          <div className="py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-slate-500">
            <div>
              Copyright © 2026 SERVIQ . All rights reserved.
            </div>

            <div className="md:text-right space-y-0.5 leading-relaxed text-xs text-slate-500">
              <div className="font-semibold text-slate-700">SERVIQ By Orcescale</div>
              <div>Location - Chennai, Tamil Nadu, India.</div>
            </div>
          </div>

          {/* Huge Faint Watermark Text at Bottom */}
          <div className="pt-6 text-center select-none pointer-events-none opacity-40">
            <span className="font-black text-6xl sm:text-9xl lg:text-[140px] text-slate-200 tracking-tight leading-none block font-['Outfit',sans-serif]">
              Let's Begin Serviq
            </span>
          </div>
        </div>
      </footer>

      {/* Support / Help & Feedback Modal */}
      <HelpFeedbackModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
    </div>
  );
};

export default LandingPage;
