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
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  PhoneCall,
  Route,
  Users,
} from 'lucide-react';

import { HelpFeedbackModal } from '../support/HelpFeedbackModal';

const WORKFLOW_PILLS = [
  { label: 'Vehicle visibility', icon: Eye },
  { label: 'Maintenance scheduling', icon: Calendar },
  { label: 'Repair tracking', icon: Wrench },
  { label: 'Fleet-wide access', icon: ShieldCheck },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Manage & Assign',
    description: 'Add vehicles and drivers, manage fleet details, and assign vehicles before operations begin.',
    icon: Truck,
    iconBg: 'bg-[#2335f2]',
    shadowGlow: 'shadow-blue-600/25',
  },
  {
    step: '02',
    title: 'Monitor Fleet',
    description: 'Track vehicle status, odometer readings, availability, and important fleet information in one place.',
    icon: Gauge,
    iconBg: 'bg-[#393df0]',
    shadowGlow: 'shadow-indigo-600/25',
  },
  {
    step: '03',
    title: 'Stay Ahead of Maintenance',
    description: 'Schedule services, monitor maintenance due dates, and maintain a complete service history for every vehicle.',
    icon: Wrench,
    iconBg: 'bg-[#2563eb]',
    shadowGlow: 'shadow-blue-500/25',
  },
  {
    step: '04',
    title: 'Resolve & Record',
    description: 'Report vehicle issues, manage repairs, track expenses, and keep every service and repair record organized.',
    icon: AlertTriangle,
    iconBg: 'bg-[#1826d0]',
    shadowGlow: 'shadow-blue-950/25',
  },
];

const WorkflowSection: React.FC = () => {
  return (
    <div className="w-full bg-white select-none">
      {/* Top Feature Badges / Status Pills Bar in SERVIQ Color Palette */}
      <div className="w-full border-y border-blue-100/70 bg-[#f8faff]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-blue-100/70">
          {WORKFLOW_PILLS.map((pill, idx) => {
            const Icon = pill.icon;
            return (
              <div
                key={idx}
                className="group flex items-center justify-center gap-3 px-6 py-4 transition-colors hover:bg-blue-50/60"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 border border-blue-100 text-[#2335f2] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 group-hover:bg-[#2335f2] group-hover:text-white transition-all duration-200">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </div>
                <span
                  className="text-xs sm:text-sm font-semibold text-slate-800 tracking-tight font-anek-latin group-hover:text-[#2335f2] transition-colors"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  {pill.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Workflow Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20 sm:pb-28">
        {/* Eyebrow Label in SERVIQ Brand Blue with Pulsing Beacon */}
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2335f2] animate-pulse" />
          <span
            className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.22em] text-[#2335f2] font-anek-latin"
            style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
          >
            FLEET MANAGEMENT WORKFLOW
          </span>
        </div>

        {/* Section Headline */}
        <h2
          className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 text-center tracking-tight leading-[1.18] max-w-4xl mx-auto font-anek-latin px-4"
          style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
        >
          Built around what keeps your fleet moving
        </h2>

        {/* Subtitle / Description */}
        <p
          className="text-slate-500 text-xs sm:text-sm md:text-base text-center max-w-2xl mx-auto mt-4 sm:mt-5 px-4 leading-relaxed font-anek-latin"
          style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
        >
          From managing vehicles and drivers to tracking maintenance and repairs, SERVIQ keeps every stage of your fleet operation connected.
        </p>

        {/* 4 Workflow Sequential Cards in SERVIQ Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-12 sm:mt-16">
          {WORKFLOW_STEPS.map((card) => {
            const CardIcon = card.icon;
            return (
              <div
                key={card.step}
                className="group relative bg-white rounded-[22px] border border-slate-200/90 hover:border-[#2335f2]/40 p-6 sm:p-7 shadow-[0_2px_12px_rgba(35,53,242,0.04)] hover:shadow-2xl hover:shadow-[#2335f2]/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Top Row: SERVIQ Brand Squircle Icon + Step Number */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl ${card.iconBg} text-white flex items-center justify-center shadow-lg ${card.shadowGlow} group-hover:scale-105 transition-transform duration-300`}
                    >
                      <CardIcon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-xs sm:text-sm font-mono font-semibold text-slate-400 group-hover:text-[#2335f2] transition-colors tracking-wider">
                      {card.step}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3
                    className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#2335f2] transition-colors mt-6 mb-2 tracking-tight font-anek-latin"
                    style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                  >
                    {card.title}
                  </h3>

                  {/* Card Description */}
                  <p
                    className="text-slate-500 text-xs sm:text-sm leading-relaxed font-anek-latin"
                    style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                  >
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const FEATURES_DATA = [
  {
    number: '01',
    title: 'Vehicle Management',
    tagline: 'Know every vehicle, inside and out.',
    description:
      'Manage vehicle profiles, assignments, status, odometer readings, service history, and important information from one place.',
    icon: Truck,
    accentColor: '#2563eb',
    badge: 'Asset Directory',
  },
  {
    number: '02',
    title: 'Driver Management',
    tagline: 'Keep your drivers connected to their vehicles.',
    description:
      'Create individual driver profiles, manage assignments, track details, and give drivers quick access to the information they need.',
    icon: UserCheck,
    accentColor: '#3b82f6',
    badge: 'Driver Roster',
  },
  {
    number: '03',
    title: 'Maintenance Management',
    tagline: 'Stay ahead of what’s due.',
    description:
      'Schedule maintenance, track service history, monitor upcoming work, and make sure important servicing doesn’t get overlooked.',
    icon: Wrench,
    accentColor: '#d97706',
    badge: 'Dual-Trigger Engine',
  },
  {
    number: '04',
    title: 'Repair Tracking',
    tagline: 'From issue reported to repair completed.',
    description:
      'Drivers can report vehicle issues while fleet managers can track, manage, and update repairs throughout the entire process.',
    icon: AlertTriangle,
    accentColor: '#e11d48',
    badge: 'Real-time Resolution',
  },
  {
    number: '05',
    title: 'Expense Management',
    tagline: 'Know where your fleet spending goes.',
    description:
      'Keep maintenance and repair expenses organized so your team has a clearer picture of vehicle-related costs.',
    icon: Receipt,
    accentColor: '#059669',
    badge: 'TCO & Parts Audit',
  },
  {
    number: '06',
    title: 'Documents',
    tagline: 'Keep important documents within reach.',
    description:
      'Organize vehicle and driver documents, track their details, and stay aware of upcoming expirations.',
    icon: FileText,
    accentColor: '#7c3aed',
    badge: 'Compliance Vault',
  },
  {
    number: '07',
    title: 'Vehicle Health',
    tagline: 'Know when a vehicle needs attention.',
    description:
      'Keep track of vehicle condition, reported issues, maintenance status, and other important health indicators.',
    icon: ShieldCheck,
    accentColor: '#0284c7',
    badge: 'Fleet Readiness',
  },
  {
    number: '08',
    title: 'Notifications & Reminders',
    tagline: 'The right information, at the right time.',
    description:
      'Stay updated about maintenance, repairs, documents, assignments, and other important fleet activities.',
    icon: Bell,
    accentColor: '#f59e0b',
    badge: 'Instant Alerts',
  },
  {
    number: '09',
    title: 'Fleet Insights',
    tagline: 'Turn fleet activity into clear visibility.',
    description:
      'Get an organized view of vehicles, maintenance, repairs, expenses, and fleet operations to make everyday decisions easier.',
    icon: BarChart3,
    accentColor: '#4f46e5',
    badge: 'Executive Oversight',
  },
];

const RotationalFeaturesSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const totalScrollable = rect.height - window.innerHeight;
        if (totalScrollable <= 0) return;

        const scrolled = -rect.top;
        const p = Math.max(0, Math.min(1, scrolled / totalScrollable));
        const activeFloat = p * (FEATURES_DATA.length - 1);
        setScrollProgress(activeFloat);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const scrollToCard = (index: number) => {
    if (!containerRef.current) return;
    const totalScrollable = containerRef.current.scrollHeight - window.innerHeight;
    const targetScroll = (index / (FEATURES_DATA.length - 1)) * totalScrollable;
    const rect = containerRef.current.getBoundingClientRect();
    const containerTop = window.scrollY + rect.top;
    window.scrollTo({
      top: containerTop + targetScroll,
      behavior: 'smooth',
    });
  };

  const currentIndex = Math.round(scrollProgress);

  return (
    <section id="features" ref={containerRef} className="relative w-full bg-white text-slate-900 min-h-[420vh]">
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between items-center overflow-hidden py-6 sm:py-8 md:py-10 px-4 sm:px-6 select-none bg-white">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto pt-2 sm:pt-4 z-20 pointer-events-auto">
          {/* Section Kicker */}
          <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2335f2] animate-pulse" />
            <span
              className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#2335f2] font-anek-latin"
              style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
            >
              Features
            </span>
          </div>

          <h2
            className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 font-anek-latin tracking-tight leading-tight"
            style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
          >
            Everything You Need to Keep Moving.
          </h2>
          <p
            className="text-xs sm:text-sm md:text-base text-slate-600 mt-2 sm:mt-3 leading-relaxed font-anek-latin max-w-2xl mx-auto hidden sm:block"
            style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
          >
            From everyday fleet operations to unexpected repairs, SERVIQ keeps your vehicles, people, and maintenance connected.
          </p>
        </div>

        {/* 3D Rotational Carousel Stage */}
        <div className="relative w-full max-w-6xl h-[360px] sm:h-[400px] md:h-[440px] flex items-center justify-center [perspective:1400px] z-10 my-auto">
          <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
            {FEATURES_DATA.map((feat, i) => {
              const offset = i - scrollProgress;
              const absOffset = Math.abs(offset);

              // Skip rendering cards far away for high performance
              if (absOffset > 3.2) return null;

              const xSpacing = isMobile ? 260 : 380;
              const translateX = offset * xSpacing;
              // 3D rotation angle: cards to the right face left (-Y), cards to the left face right (+Y)
              const rotateY = Math.max(-50, Math.min(50, offset * -28));
              // 3D depth push
              const translateZ = -Math.pow(absOffset, 1.2) * 110;
              // Scale factor
              const scale = Math.max(0.72, 1 - absOffset * 0.12);
              // Opacity factor
              const opacity = Math.max(0, Math.min(1, 1 - (absOffset - 0.25) * 0.55));
              // Z-Index
              const zIndex = Math.round(100 - absOffset * 15);
              const isClosest = absOffset < 0.5;

              return (
                <div
                  key={feat.number}
                  onClick={() => scrollToCard(i)}
                  style={{
                    transform: `translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    zIndex,
                    transition: 'transform 0.08s linear, opacity 0.08s linear, box-shadow 0.3s ease',
                  }}
                  className={`absolute w-[86vw] max-w-[330px] sm:max-w-[380px] md:max-w-[420px] h-[340px] sm:h-[380px] md:h-[410px] p-6 sm:p-8 md:p-9 rounded-3xl bg-white border-2 flex flex-col justify-between cursor-pointer select-none ${
                    isClosest
                      ? 'border-[#393df0] shadow-[0_25px_60px_rgba(57,61,240,0.18)] ring-4 ring-[#393df0]/10'
                      : 'border-slate-200/90 shadow-xl hover:border-slate-300'
                  }`}
                >
                  {/* Card Header: Icon & Feature Number */}
                  <div>
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-bold transition-transform duration-300 shadow-sm"
                        style={{
                          backgroundColor: `${feat.accentColor}18`,
                          color: feat.accentColor,
                        }}
                      >
                        <feat.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      <span className="font-mono font-black text-xs sm:text-sm text-[#393df0] bg-[#393df0]/10 px-3 py-1 rounded-full">
                        Feature {feat.number}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="font-extrabold text-xl sm:text-2xl text-slate-900 font-anek-latin tracking-tight"
                      style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                    >
                      {feat.title}
                    </h3>

                    {/* Tagline */}
                    <p
                      className="font-bold text-sm sm:text-base text-slate-800 mt-2 font-anek-latin"
                      style={{
                        fontFamily: "'Anek Latin', 'AnekLatin', sans-serif",
                        color: feat.accentColor,
                      }}
                    >
                      {feat.tagline}
                    </p>

                    {/* Description */}
                    <p
                      className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed font-anek-latin line-clamp-3 sm:line-clamp-none"
                      style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                    >
                      {feat.description}
                    </p>
                  </div>

                  {/* Card Footer: Category Badge & Index Indicator */}
                  <div className="pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium font-anek-latin">
                    <span>{feat.badge}</span>
                    <span className="font-mono text-[#393df0] font-bold">
                      {feat.number} / 09
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation & Controls */}
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-2.5 sm:gap-3.5 z-20 pointer-events-auto pb-2">
          {/* Controls row: Prev Arrow, Dots, Next Arrow */}
          <div className="flex items-center gap-3 sm:gap-6 bg-slate-50/95 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border border-slate-200/80 shadow-sm">
            <button
              onClick={() => scrollToCard(Math.max(0, currentIndex - 1))}
              disabled={currentIndex <= 0}
              className="p-1.5 rounded-full hover:bg-white text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              aria-label="Previous Feature"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* 9 Indicator Pills */}
            <div className="flex items-center gap-1.5">
              {FEATURES_DATA.map((_, dotIdx) => {
                const isActive = dotIdx === currentIndex;
                return (
                  <button
                    key={dotIdx}
                    onClick={() => scrollToCard(dotIdx)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      isActive
                        ? 'w-6 sm:w-7 h-2 sm:h-2.5 bg-[#393df0]'
                        : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Jump to feature ${dotIdx + 1}`}
                  />
                );
              })}
            </div>

            <button
              onClick={() => scrollToCard(Math.min(FEATURES_DATA.length - 1, currentIndex + 1))}
              disabled={currentIndex >= FEATURES_DATA.length - 1}
              className="p-1.5 rounded-full hover:bg-white text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              aria-label="Next Feature"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Hint text */}
          <div className="text-center text-[11px] sm:text-xs text-slate-400 font-anek-latin font-medium flex items-center gap-2">
            <span>Scroll down to rotate features</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#393df0] animate-pulse" />
            <span className="font-mono text-slate-500">
              {String(currentIndex + 1).padStart(2, '0')} of 09
            </span>
          </div>
        </div>

      </div>
    </section>
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
        {/* Sticky Word-by-Word Scroll Reveal Manifesto (matches super.money reference) */}
        <WorkflowSection />
      </section>

      {/* =========================================================================
          PAGE 3 (EVEN): ROTATIONAL FEATURES SECTION � WHITE BACKGROUND
      ========================================================================= */}
      <RotationalFeaturesSection />

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
