import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Truck,
  UserCheck,
  Wrench,
  AlertTriangle,
  Receipt,
  FileText,
  ShieldCheck,
  Bell,
  BarChart3,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Navigation,
} from 'lucide-react';

export interface FeatureItem {
  number: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accentColor: string;
  badge: string;
  highlights: string[];
}

export const FEATURES_DATA: FeatureItem[] = [
  {
    number: '01',
    title: 'Vehicle Management',
    tagline: 'Know every vehicle, inside and out.',
    description:
      'Manage vehicle profiles, assignments, status, odometer readings, service history, and important information from one place.',
    icon: Truck,
    accentColor: '#2563eb',
    badge: 'Asset Directory',
    highlights: ['Digital RC & Docs', 'Live Odometer Sync', 'Service History'],
  },
  {
    number: '02',
    title: 'Driver Management',
    tagline: 'Keep your drivers connected to their vehicles.',
    description:
      'Create individual driver profiles, manage assignments, track details, and give drivers quick access to the information they need.',
    icon: UserCheck,
    accentColor: '#0284c7',
    badge: 'Driver Roster',
    highlights: ['Driver Profiles & License', 'Vehicle Assignments', 'Direct Mobile Access'],
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
    highlights: ['Preventive Reminders', 'Interval Alerts', 'Maintenance Log'],
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
    highlights: ['Defect Issue Reporting', 'Workshop Job Cards', 'End-to-End Status'],
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
    highlights: ['Parts & Labor Costs', 'Categorized Receipts', 'Fleet Spend Audit'],
  },
  {
    number: '06',
    title: 'Documents',
    tagline: 'Keep important documents within reach.',
    description:
      'Store vehicle registration, insurance, fitness certificates, and permits in one organized digital place.',
    icon: FileText,
    accentColor: '#8b5cf6',
    badge: 'Compliance Vault',
    highlights: ['RC, Insurance & PUC', 'Permit Storage', 'Expiry Alerts'],
  },
  {
    number: '07',
    title: 'Vehicle Health',
    tagline: 'Keep your fleet in peak condition.',
    description:
      'Monitor vehicle readiness, track ongoing issues, and make sure every vehicle is fit for the road.',
    icon: ShieldCheck,
    accentColor: '#10b981',
    badge: 'Health Intelligence',
    highlights: ['Fleet Readiness', 'Active Issue Tracking', 'Roadworthy Checks'],
  },
  {
    number: '08',
    title: 'Notifications & Reminders',
    tagline: 'Never miss what needs attention.',
    description:
      'Get timely alerts for upcoming maintenance, pending repairs, expiring documents, and important fleet updates.',
    icon: Bell,
    accentColor: '#f59e0b',
    badge: 'Automated Reminders',
    highlights: ['Due Date Reminders', 'Document Expiry Alerts', 'Instant Push Notices'],
  },
  {
    number: '09',
    title: 'Fleet Insights',
    tagline: 'See the big picture of your fleet.',
    description:
      'View fleet activity, monitor vehicle status, track service records, and make informed operational decisions.',
    icon: BarChart3,
    accentColor: '#6366f1',
    badge: 'Operational Visibility',
    highlights: ['Activity Analytics', 'Maintenance Trends', 'Fleet Transparency'],
  },
];

// Track layout constants
const MARGIN_LEFT = 240;
const STOP_SPACING = 210;
const TOTAL_STOPS = FEATURES_DATA.length;
const TRACK_WIDTH = MARGIN_LEFT * 2 + (TOTAL_STOPS - 1) * STOP_SPACING; // 2160px

// Helper to get stop X center position
const getStopX = (index: number) => MARGIN_LEFT + index * STOP_SPACING;

export const RoadFeaturesSection: React.FC = () => {
  const [activeStop, setActiveStop] = useState<number>(0);
  const [displayedStop, setDisplayedStop] = useState<number>(0);
  const [isDriving, setIsDriving] = useState<boolean>(false);
  const [driveDirection, setDriveDirection] = useState<'right' | 'left'>('right');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [autoPlayProgress, setAutoPlayProgress] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const driveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Center the active stop in the scrollable viewport
  const centerStopInViewport = useCallback((stopIndex: number, smooth = true) => {
    if (!containerRef.current) return;
    const targetX = getStopX(stopIndex);
    const containerWidth = containerRef.current.clientWidth;
    const scrollTarget = targetX - containerWidth / 2;

    containerRef.current.scrollTo({
      left: Math.max(0, scrollTarget),
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, []);

  // Jump or drive to a specific stop
  const goToStop = useCallback(
    (targetIndex: number) => {
      if (targetIndex === activeStop && !isDriving) return;

      const normalizedIndex = (targetIndex + TOTAL_STOPS) % TOTAL_STOPS;
      setDriveDirection(normalizedIndex >= activeStop ? 'right' : 'left');
      setIsDriving(true);
      setActiveStop(normalizedIndex);
      setAutoPlayProgress(0);

      // Hide current card while car travels to the new stop
      setDisplayedStop(-1);

      centerStopInViewport(normalizedIndex, true);

      if (driveTimerRef.current) clearTimeout(driveTimerRef.current);

      // When the car reaches the stop (after travel animation), display the feature card!
      driveTimerRef.current = setTimeout(() => {
        setIsDriving(false);
        setDisplayedStop(normalizedIndex);
      }, 950);
    },
    [activeStop, isDriving, centerStopInViewport]
  );

  const handleNext = useCallback(() => {
    goToStop((activeStop + 1) % TOTAL_STOPS);
  }, [activeStop, goToStop]);

  const handlePrev = useCallback(() => {
    goToStop((activeStop - 1 + TOTAL_STOPS) % TOTAL_STOPS);
  }, [activeStop, goToStop]);

  // Initial scroll position alignment
  useEffect(() => {
    const timer = setTimeout(() => {
      centerStopInViewport(0, false);
    }, 150);
    return () => clearTimeout(timer);
  }, [centerStopInViewport]);

  // Window resize re-centering
  useEffect(() => {
    const handleResize = () => centerStopInViewport(activeStop, false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeStop, centerStopInViewport]);

  // Auto-tour timer loop (pauses when hovered or user pauses)
  useEffect(() => {
    if (!isPlaying || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const DURATION = 4600; // 4.6 seconds at each stop
    const INTERVAL = 50;
    let elapsed = 0;

    progressIntervalRef.current = setInterval(() => {
      elapsed += INTERVAL;
      setAutoPlayProgress(Math.min(100, (elapsed / DURATION) * 100));
    }, INTERVAL);

    timerRef.current = setTimeout(() => {
      handleNext();
    }, DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, isHovered, activeStop, handleNext]);

  const activeFeature = FEATURES_DATA[activeStop];
  const activeX = getStopX(activeStop);

  return (
    <section
      id="features"
      className="relative w-full bg-studio-blue text-white py-16 sm:py-24 overflow-hidden select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center px-4 sm:px-6">
        {/* =========================================================================
            1. SECTION HEADER
        ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 z-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-white/90 mb-4 shadow-sm">
            <Navigation className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
            <span>Interactive Highway Tour</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-anek-latin tracking-tight leading-tight drop-shadow-sm"
            style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
          >
            Everything You Need to Keep Moving.
          </h2>

          <p className="font-neue-haas-medium text-white/85 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-3 sm:mt-4 leading-relaxed">
            Follow our fleet car down the highway across 9 key operational stops — each revealing a core capability that powers your fleet.
          </p>
        </div>

        {/* =========================================================================
            2. HORIZONTAL ROAD HIGHWAY & FEATURE DISPLAY STAGE
        ========================================================================= */}
        <div
          className="relative w-full overflow-x-auto scrollbar-none pb-4 pt-2 cursor-grab active:cursor-grabbing focus:outline-none"
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Scrollable Track Canvas (2160px) */}
          <div
            className="relative"
            style={{ width: `${TRACK_WIDTH}px`, minHeight: '600px' }}
          >
            {/* ---------------------------------------------------------------------
                A. TOP FEATURE CARDS LAYER (DISPLAYED DIRECTLY ABOVE EACH STOP)
            --------------------------------------------------------------------- */}
            <div className="relative w-full h-[340px] pointer-events-none">
              {FEATURES_DATA.map((feat, idx) => {
                const stopX = getStopX(idx);
                const isCardVisible = displayedStop === idx;

                return (
                  <div
                    key={feat.number}
                    className={`absolute top-2 transition-all duration-400 ease-out pointer-events-auto ${
                      isCardVisible
                        ? 'opacity-100 scale-100 translate-y-0 z-30'
                        : 'opacity-0 scale-90 translate-y-6 pointer-events-none z-10'
                    }`}
                    style={{
                      left: `${stopX}px`,
                      transform: `translateX(-50%) ${
                        isCardVisible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(16px)'
                      }`,
                      width: '400px',
                      maxWidth: '90vw',
                    }}
                  >
                    {/* The Clean, Modern Feature Card */}
                    <div className="relative bg-white text-slate-900 rounded-[28px] p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] border-2 border-white ring-4 ring-white/15 flex flex-col justify-between select-none">
                      {/* Top Header Row */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-bold shadow-sm transition-transform duration-300"
                            style={{
                              backgroundColor: `${feat.accentColor}18`,
                              color: feat.accentColor,
                            }}
                          >
                            <feat.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-slate-600 font-anek-latin bg-slate-100 px-3 py-1 rounded-full border border-slate-200/80">
                              {feat.badge}
                            </span>
                            <span
                              className="font-bold text-xs px-2.5 py-1 rounded-full text-white font-mono shadow-xs"
                              style={{ backgroundColor: feat.accentColor }}
                            >
                              Stop {feat.number}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3
                          className="font-black text-2xl sm:text-[26px] text-slate-900 font-anek-latin tracking-tight leading-snug"
                          style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                        >
                          {feat.title}
                        </h3>

                        {/* Tagline */}
                        <p
                          className="font-bold text-sm sm:text-base mt-1.5 font-anek-latin"
                          style={{
                            fontFamily: "'Anek Latin', 'AnekLatin', sans-serif",
                            color: feat.accentColor,
                          }}
                        >
                          {feat.tagline}
                        </p>

                        {/* Description */}
                        <p
                          className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-anek-latin"
                          style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                        >
                          {feat.description}
                        </p>
                      </div>

                      {/* Feature Highlights Pills */}
                      <div className="mt-4 pt-3.5 border-t border-slate-100">
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {feat.highlights.map((h, hIdx) => (
                            <span
                              key={hIdx}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200/80 font-anek-latin"
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: feat.accentColor }}
                              />
                              {h}
                            </span>
                          ))}
                        </div>

                        {/* Live Stop Status Footer */}
                        <div className="pt-3 mt-1 flex items-center justify-between text-xs text-slate-400 font-mono font-medium">
                          <span className="flex items-center gap-1.5 text-[11px] font-sans font-semibold text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            Stop Reached • Ready to Deploy
                          </span>
                          <span className="text-slate-400 font-bold">
                            {feat.number} / 09
                          </span>
                        </div>
                      </div>

                      {/* Card Downward Triangular Stem / Pointer pointing to the Stop on the Road */}
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[14px] border-t-white filter drop-shadow-[0_4px_3px_rgba(0,0,0,0.15)]" />
                    </div>

                    {/* Glowing Vertical Light Beam Connecting Card to the Road Stop */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-10 pointer-events-none"
                      style={{
                        background: `linear-gradient(to bottom, ${feat.accentColor}, transparent)`,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* ---------------------------------------------------------------------
                B. THE ROAD (HIGHWAY IN CENTER FROM LEFT TO RIGHT)
            --------------------------------------------------------------------- */}
            <div className="relative w-full h-[120px] my-2">
              {/* Upper Concrete Highway Curb with Reflective Stripes */}
              <div className="w-full h-3 bg-slate-800 border-t border-white/20 flex overflow-hidden">
                {Array.from({ length: 90 }).map((_, i) => (
                  <div
                    key={`curb-top-${i}`}
                    className={`h-full w-6 shrink-0 ${
                      i % 2 === 0 ? 'bg-amber-400/80' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Main Asphalt Road Surface */}
              <div className="relative w-full h-[96px] bg-gradient-to-b from-[#172033] via-[#111827] to-[#172033] shadow-inner flex flex-col justify-between py-2 border-y border-white/10">
                {/* Upper Solid Road Shoulder Line */}
                <div className="w-full h-1 bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />

                {/* Center Dashed Lane Divider with Subtle Highway Glow */}
                <div className="w-full flex items-center justify-between px-2 overflow-hidden">
                  {Array.from({ length: 65 }).map((_, i) => (
                    <div
                      key={`dash-${i}`}
                      className="h-1.5 w-7 shrink-0 mx-2 bg-yellow-400/85 rounded-full shadow-[0_0_6px_rgba(250,204,21,0.6)]"
                    />
                  ))}
                </div>

                {/* Lower Solid Road Shoulder Line */}
                <div className="w-full h-1 bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />

                {/* -------------------------------------------------------------
                    9 PAINTED STOP MARKINGS ALONG THE ASPHALT
                ------------------------------------------------------------- */}
                {FEATURES_DATA.map((feat, idx) => {
                  const stopX = getStopX(idx);
                  const isActive = activeStop === idx;

                  return (
                    <div
                      key={`road-stop-${feat.number}`}
                      onClick={() => goToStop(idx)}
                      className="absolute top-0 bottom-0 flex flex-col items-center justify-center cursor-pointer group"
                      style={{
                        left: `${stopX}px`,
                        transform: 'translateX(-50%)',
                        width: '120px',
                      }}
                    >
                      {/* Checkpoint Zebra Line Across Road */}
                      <div
                        className={`absolute top-0 bottom-0 w-28 border-x-2 border-dashed transition-all duration-300 ${
                          isActive
                            ? 'border-white/90 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                            : 'border-white/20 group-hover:border-white/50 group-hover:bg-white/5'
                        }`}
                      />

                      {/* Painted Road Stencil: STOP 01 */}
                      <span
                        className={`text-[10px] tracking-widest font-black uppercase font-mono transition-all duration-300 ${
                          isActive
                            ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] scale-110'
                            : 'text-white/40 group-hover:text-white/80'
                        }`}
                      >
                        STOP {feat.number}
                      </span>
                    </div>
                  );
                })}

                {/* -------------------------------------------------------------
                    THE FLEET CAR MOVING ON THE ROAD
                ------------------------------------------------------------- */}
                <div
                  className="absolute bottom-2 z-20 pointer-events-none select-none transition-transform duration-1000 ease-[cubic-bezier(0.34,1.15,0.64,1)]"
                  style={{
                    left: `${activeX}px`,
                    transform: `translateX(-50%) ${
                      driveDirection === 'left' ? 'scaleX(-1)' : 'scaleX(1)'
                    } ${isDriving ? 'translateY(-2px)' : 'translateY(0)'}`,
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Forward Headlight Cone Shining onto the Asphalt */}
                    <div
                      className={`absolute left-[80%] top-1/2 -translate-y-1/2 w-44 h-16 pointer-events-none transition-opacity duration-300 ${
                        isDriving ? 'opacity-90' : 'opacity-65'
                      }`}
                      style={{
                        background:
                          'radial-gradient(ellipse at left, rgba(147, 197, 253, 0.7) 0%, rgba(59, 130, 246, 0.25) 45%, transparent 75%)',
                        clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)',
                        filter: 'blur(2px)',
                      }}
                    />

                    {/* Red Rear Taillight Ambient Glow */}
                    <div className="absolute right-[92%] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-rose-500/50 blur-md pointer-events-none" />

                    {/* Under-Car Ground Shadow */}
                    <div className="absolute -bottom-1 left-2 right-2 h-3.5 bg-black/60 rounded-[100%] blur-[4px] pointer-events-none" />

                    {/* Sleek Vector Fleet Car SVG */}
                    <svg
                      viewBox="0 0 200 80"
                      className="w-36 sm:w-40 md:w-44 h-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Car Body Gradient */}
                      <defs>
                        <linearGradient id="carBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="60%" stopColor="#f1f5f9" />
                          <stop offset="100%" stopColor="#cbd5e1" />
                        </linearGradient>
                        <linearGradient id="windowGlass" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#0f172a" />
                          <stop offset="100%" stopColor="#1e293b" />
                        </linearGradient>
                        <linearGradient id="fleetStripe" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                      </defs>

                      {/* Aerodynamic Vehicle Chassis */}
                      <path
                        d="M 16 54 
                           L 12 46 
                           C 10 38, 18 34, 28 34 
                           L 52 34 
                           L 74 16 
                           C 78 13, 86 12, 94 12 
                           L 134 12 
                           C 142 12, 148 15, 154 22 
                           L 172 38 
                           L 188 44 
                           C 194 46, 196 50, 196 56 
                           L 194 62 
                           L 182 62 
                           C 182 52, 168 52, 168 62 
                           L 66 62 
                           C 66 52, 52 52, 52 62 
                           L 20 62 
                           Z"
                        fill="url(#carBodyGrad)"
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                      />

                      {/* Fleet Accent Side Decal Stripe */}
                      <path
                        d="M 28 44 L 180 44 L 176 48 L 26 48 Z"
                        fill="url(#fleetStripe)"
                      />

                      {/* Front Windshield and Windows */}
                      <path
                        d="M 77 31 L 96 16 L 132 16 L 132 31 Z"
                        fill="url(#windowGlass)"
                      />
                      <path
                        d="M 136 16 L 150 16 L 168 31 L 136 31 Z"
                        fill="url(#windowGlass)"
                      />

                      {/* Glass Glare Reflection Line */}
                      <path
                        d="M 102 18 L 146 18"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.6"
                      />

                      {/* SERVIQ Decal Text on Front Door */}
                      <text
                        x="98"
                        y="42"
                        fill="#1e3a8a"
                        fontSize="7"
                        fontWeight="800"
                        fontFamily="sans-serif"
                        letterSpacing="1"
                      >
                        SERVIQ
                      </text>

                      {/* Front Projector Headlight */}
                      <path
                        d="M 186 44 L 195 47 L 193 54 L 184 52 Z"
                        fill="#e0f2fe"
                        filter="drop-shadow(0 0 4px #38bdf8)"
                      />

                      {/* Rear LED Taillight */}
                      <path
                        d="M 12 44 L 16 44 L 16 50 L 12 50 Z"
                        fill="#ef4444"
                        filter="drop-shadow(0 0 3px #f43f5e)"
                      />

                      {/* Rear Wheel */}
                      <g transform="translate(59, 62)">
                        <circle cx="0" cy="0" r="12" fill="#0f172a" />
                        <circle cx="0" cy="0" r="8" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
                        <circle cx="0" cy="0" r="3.5" fill="#e2e8f0" />
                        {/* Rotating Spokes when driving */}
                        <g className={isDriving ? 'animate-spin origin-center' : ''}>
                          <line x1="0" y1="-8" x2="0" y2="8" stroke="#cbd5e1" strokeWidth="1.5" />
                          <line x1="-8" y1="0" x2="8" y2="0" stroke="#cbd5e1" strokeWidth="1.5" />
                        </g>
                      </g>

                      {/* Front Wheel */}
                      <g transform="translate(175, 62)">
                        <circle cx="0" cy="0" r="12" fill="#0f172a" />
                        <circle cx="0" cy="0" r="8" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
                        <circle cx="0" cy="0" r="3.5" fill="#e2e8f0" />
                        {/* Rotating Spokes when driving */}
                        <g className={isDriving ? 'animate-spin origin-center' : ''}>
                          <line x1="0" y1="-8" x2="0" y2="8" stroke="#cbd5e1" strokeWidth="1.5" />
                          <line x1="-8" y1="0" x2="8" y2="0" stroke="#cbd5e1" strokeWidth="1.5" />
                        </g>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Lower Concrete Highway Curb */}
              <div className="w-full h-3 bg-slate-800 border-b border-white/20 flex overflow-hidden">
                {Array.from({ length: 90 }).map((_, i) => (
                  <div
                    key={`curb-bot-${i}`}
                    className={`h-full w-6 shrink-0 ${
                      i % 2 === 0 ? 'bg-amber-400/80' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* ---------------------------------------------------------------------
                C. BOTTOM MILESTONE CHECKPOINTS (9 STOPS)
            --------------------------------------------------------------------- */}
            <div className="relative w-full h-[140px] pt-4">
              {FEATURES_DATA.map((feat, idx) => {
                const stopX = getStopX(idx);
                const isArrived = displayedStop === idx;
                const isEnRoute = activeStop === idx && isDriving;
                const isActive = isArrived || isEnRoute;

                return (
                  <div
                    key={`checkpoint-${feat.number}`}
                    onClick={() => goToStop(idx)}
                    className="absolute flex flex-col items-center cursor-pointer group"
                    style={{
                      left: `${stopX}px`,
                      transform: 'translateX(-50%)',
                    }}
                  >
                    {/* Vertical Connecting Rod to Highway */}
                    <div
                      className={`w-0.5 h-4 transition-colors duration-300 ${
                        isActive ? 'bg-white' : 'bg-white/30 group-hover:bg-white/60'
                      }`}
                    />

                    {/* Milestone Pin Badge */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 shadow-lg ${
                        isArrived
                          ? 'scale-110 ring-4 ring-white/50 shadow-[0_0_25px_rgba(255,255,255,0.6)]'
                          : isEnRoute
                          ? 'scale-105 ring-2 ring-white/40 animate-pulse'
                          : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: isActive ? feat.accentColor : undefined,
                        color: isActive ? '#ffffff' : undefined,
                      }}
                    >
                      <feat.icon className="w-5 h-5" />
                    </div>

                    {/* Milestone Stop Number & Title */}
                    <div className="text-center mt-2">
                      <span
                        className={`text-xs font-mono font-bold block transition-colors duration-300 ${
                          isActive
                            ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]'
                            : 'text-white/60 group-hover:text-white'
                        }`}
                      >
                        Stop {feat.number}
                      </span>
                      <span
                        className={`text-[11px] font-semibold block whitespace-nowrap mt-0.5 transition-colors duration-300 ${
                          isActive ? 'text-white font-bold' : 'text-white/50 group-hover:text-white/80'
                        }`}
                      >
                        {feat.title}
                      </span>
                    </div>

                    {/* Active Milestone Pulse Ping */}
                    {isArrived && (
                      <span
                        className="w-2 h-2 rounded-full mt-1 animate-ping"
                        style={{ backgroundColor: feat.accentColor }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. HIGHWAY DASHBOARD CONTROLS & MINI TIMELINE
        ========================================================================= */}
        <div className="w-full max-w-4xl mx-auto mt-6 flex flex-col items-center gap-5 z-20">
          {/* Quick Jump Stop Pills (01 to 09) */}
          <div className="flex items-center justify-center flex-wrap gap-2 px-2">
            {FEATURES_DATA.map((feat, idx) => {
              const isActive = activeStop === idx;
              return (
                <button
                  key={`pill-${feat.number}`}
                  onClick={() => goToStop(idx)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-md ring-2 ring-white/60 scale-105'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/15 hover:text-white'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      backgroundColor: isActive ? feat.accentColor : 'rgba(255,255,255,0.4)',
                    }}
                  />
                  <span>
                    {feat.number} {feat.title.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Player Bar: Previous, Auto-Drive / Pause, Next */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-white/20 shadow-lg">
            {/* Previous Stop Button */}
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer active:scale-95"
              aria-label="Previous Feature Stop"
              title="Previous Stop"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Play / Pause Auto-Tour Button */}
            <button
              onClick={() => setIsPlaying((prev) => !prev)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white text-[#2335f2] font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-[#2335f2]" />
                  <span>Pause Tour</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-[#2335f2]" />
                  <span>Auto-Drive</span>
                </>
              )}
            </button>

            {/* Next Stop Button */}
            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer active:scale-95"
              aria-label="Next Feature Stop"
              title="Next Stop"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Divider */}
            <div className="w-[1px] h-6 bg-white/20" />

            {/* Current Stop Indicator & Auto-drive progress bar */}
            <div className="flex items-center gap-2.5 text-xs font-medium text-white/90">
              <span className="font-mono font-bold text-white">
                {activeFeature.number} / 09
              </span>
              <span>{activeFeature.title}</span>

              {/* Progress bar toward next stop */}
              {isPlaying && !isHovered && (
                <div className="w-14 h-1.5 bg-white/20 rounded-full overflow-hidden ml-1">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-75"
                    style={{ width: `${autoPlayProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
