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
  Zap,
  Clock,
  Radio,
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
  stationType: 'odd' | 'even';
  stationName: string;
}

export const FEATURES_DATA: FeatureItem[] = [
  {
    number: '01',
    title: 'Vehicle Management',
    tagline: 'Know every vehicle, inside and out.',
    description:
      'Manage vehicle profiles, assignments, status, odometer readings, and service history from one place.',
    icon: Truck,
    accentColor: '#2563eb',
    badge: 'Asset Directory',
    highlights: ['Digital RC', 'Odometer Sync', 'Service Log'],
    stationType: 'odd',
    stationName: 'Profile Bay',
  },
  {
    number: '02',
    title: 'Driver Management',
    tagline: 'Keep drivers connected.',
    description:
      'Create driver profiles, manage assignments, track licenses, and give drivers instant mobile access.',
    icon: UserCheck,
    accentColor: '#0284c7',
    badge: 'Driver Roster',
    highlights: ['Driver Profiles', 'Assignments', 'Mobile App'],
    stationType: 'even',
    stationName: 'Dispatch Dock',
  },
  {
    number: '03',
    title: 'Maintenance',
    tagline: 'Stay ahead of what’s due.',
    description:
      'Schedule maintenance, track service history, monitor upcoming work, and prevent roadside breakdowns.',
    icon: Wrench,
    accentColor: '#d97706',
    badge: 'Dual-Trigger',
    highlights: ['Interval Alerts', 'Preventive Plan', 'Service History'],
    stationType: 'odd',
    stationName: 'Service Bay',
  },
  {
    number: '04',
    title: 'Repair Tracking',
    tagline: 'From reported to completed.',
    description:
      'Drivers report defect issues while fleet managers track job cards and repair status end-to-end.',
    icon: AlertTriangle,
    accentColor: '#e11d48',
    badge: 'Resolution',
    highlights: ['Defect Reports', 'Job Cards', 'Live Status'],
    stationType: 'even',
    stationName: 'Repair Bay',
  },
  {
    number: '05',
    title: 'Expense Management',
    tagline: 'Know where spending goes.',
    description:
      'Keep parts and maintenance expenses organized so your team has a clear picture of vehicle costs.',
    icon: Receipt,
    accentColor: '#059669',
    badge: 'TCO Audit',
    highlights: ['Parts & Labor', 'Receipts', 'Spend Audit'],
    stationType: 'odd',
    stationName: 'Accounting Dock',
  },
  {
    number: '06',
    title: 'Documents',
    tagline: 'Important docs within reach.',
    description:
      'Store registration, insurance, fitness certificates, and permits in one secure digital vault.',
    icon: FileText,
    accentColor: '#8b5cf6',
    badge: 'Compliance Vault',
    highlights: ['RC & Insurance', 'Permits', 'Expiry Alerts'],
    stationType: 'even',
    stationName: 'Compliance Station',
  },
  {
    number: '07',
    title: 'Vehicle Health',
    tagline: 'Fleet in peak condition.',
    description:
      'Monitor vehicle readiness, track ongoing issues, and make sure every asset is fit for the road.',
    icon: ShieldCheck,
    accentColor: '#10b981',
    badge: 'Intelligence',
    highlights: ['Fleet Readiness', 'Issue Tracking', 'Roadworthy'],
    stationType: 'odd',
    stationName: 'Diagnostics Bay',
  },
  {
    number: '08',
    title: 'Notifications',
    tagline: 'Never miss what needs attention.',
    description:
      'Get timely alerts for upcoming service, pending repairs, expiring documents, and fleet updates.',
    icon: Bell,
    accentColor: '#f59e0b',
    badge: 'Auto Alerts',
    highlights: ['Due Reminders', 'Expiry Notices', 'Push Alerts'],
    stationType: 'even',
    stationName: 'Alerts Kiosk',
  },
  {
    number: '09',
    title: 'Fleet Insights',
    tagline: 'See the big picture.',
    description:
      'View fleet activity, monitor vehicle status, track service records, and make informed operational decisions.',
    icon: BarChart3,
    accentColor: '#6366f1',
    badge: 'Visibility',
    highlights: ['Analytics', 'Maintenance Trends', 'Transparency'],
    stationType: 'odd',
    stationName: 'Operations HQ',
  },
];

const TOTAL_STOPS = FEATURES_DATA.length;
const DWELL_SECONDS = 10; // Exactly 10 seconds per stop

// Percentage position of each of the 9 stops along the 100% width road
// Spaced evenly from 6% to 94% across the screen
const getStopPercent = (index: number) => 6 + index * 11;

export const RoadFeaturesSection: React.FC = () => {
  const [activeStop, setActiveStop] = useState<number>(0);
  const [displayedStop, setDisplayedStop] = useState<number>(0);
  const [isDriving, setIsDriving] = useState<boolean>(false);
  const [carYOffset, setCarYOffset] = useState<number>(-8); // parked in top bay initially (Stop 1 is odd)
  const [driveDirection, setDriveDirection] = useState<'right' | 'left'>('right');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(DWELL_SECONDS);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const driveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Jump or drive to a specific station
  const goToStop = useCallback(
    (targetIndex: number) => {
      const normalizedIndex = (targetIndex + TOTAL_STOPS) % TOTAL_STOPS;
      if (normalizedIndex === activeStop && !isDriving) return;

      const isOddStation = normalizedIndex % 2 === 0; // index 0 = Stop 1 (odd)
      const targetBayY = isOddStation ? -8 : 8; // subtle pull into top bay (-8px) or bottom bay (+8px)

      setDriveDirection(normalizedIndex >= activeStop ? 'right' : 'left');
      setIsDriving(true);
      setActiveStop(normalizedIndex);
      setSecondsRemaining(DWELL_SECONDS);

      // Hide active highlight while car travels
      setDisplayedStop(-1);

      // Car moves to road center lane (Y=0)
      setCarYOffset(0);

      if (driveTimerRef.current) clearTimeout(driveTimerRef.current);

      // Car reaches destination after 1000ms, pulls into bay
      driveTimerRef.current = setTimeout(() => {
        setCarYOffset(targetBayY);
        setIsDriving(false);
        setDisplayedStop(normalizedIndex);
        setSecondsRemaining(DWELL_SECONDS);
      }, 1000);
    },
    [activeStop, isDriving]
  );

  const handleNext = useCallback(() => {
    goToStop((activeStop + 1) % TOTAL_STOPS);
  }, [activeStop, goToStop]);

  const handlePrev = useCallback(() => {
    goToStop((activeStop - 1 + TOTAL_STOPS) % TOTAL_STOPS);
  }, [activeStop, goToStop]);

  // Automatic travel with exactly 10-second dwell time per station
  useEffect(() => {
    if (!isPlaying || isHovered || isDriving) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      return;
    }

    setSecondsRemaining(DWELL_SECONDS);

    countdownIntervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    timerRef.current = setTimeout(() => {
      handleNext();
    }, DWELL_SECONDS * 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [isPlaying, isHovered, isDriving, activeStop, handleNext]);

  const activeFeature = FEATURES_DATA[activeStop];
  const activePercent = getStopPercent(activeStop);

  return (
    <section
      id="features"
      className="relative w-full bg-studio-blue text-white py-12 sm:py-16 overflow-hidden select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container - Fits Screen 100% Width (max-w-7xl) */}
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center px-3 sm:px-6">
        {/* =========================================================================
            1. SECTION HEADER
        ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white/90 mb-2.5 shadow-sm">
            <Radio className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
            <span>Autonomous Fleet Service Highway</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-0.5" />
          </div>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-anek-latin tracking-tight leading-tight drop-shadow-sm"
            style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
          >
            Everything You Need to Keep Moving.
          </h2>

          <p className="font-neue-haas-medium text-white/80 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-1.5 leading-relaxed">
            Odd Stations on top, Even Stations on the bottom. The fleet vehicle automatically inspects each bay with a 10-second service stop.
          </p>
        </div>

        {/* =========================================================================
            2. HIGHWAY STAGE: FITS 100% SCREEN WIDTH, THIN ROAD IN CENTER
        ========================================================================= */}
        <div
          className="relative w-full flex flex-col justify-between py-2 overflow-x-auto sm:overflow-visible"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-full min-w-[760px] flex flex-col justify-between">
            {/* ---------------------------------------------------------------------
                A. TOP SECTION: ODD SERVICE STATIONS (Stop 01, 03, 05, 07, 09)
            --------------------------------------------------------------------- */}
            <div className="relative w-full h-[210px] sm:h-[220px]">
              {FEATURES_DATA.map((feat, idx) => {
                const isOdd = idx % 2 === 0; // idx 0 = Stop 1 (odd)
                if (!isOdd) return null;

                const stopPct = getStopPercent(idx);
                const isCardVisible = displayedStop === idx;

                return (
                  <div
                    key={`station-top-${feat.number}`}
                    onClick={() => goToStop(idx)}
                    className="absolute bottom-1 -translate-x-1/2 cursor-pointer transition-all duration-500 ease-out"
                    style={{
                      left: `${stopPct}%`,
                      width: '18%',
                      maxWidth: '210px',
                      minWidth: '135px',
                    }}
                  >
                    {/* Top Station Card */}
                    <div
                      className={`relative rounded-2xl p-3 sm:p-3.5 transition-all duration-300 flex flex-col justify-between select-none ${
                        isCardVisible
                          ? 'bg-white text-slate-900 shadow-[0_15px_35px_rgba(0,0,0,0.35)] ring-2 ring-white scale-105 z-30'
                          : 'bg-white/10 backdrop-blur-md text-white/90 border border-white/15 hover:bg-white/20 hover:scale-102 z-10'
                      }`}
                      style={{ minHeight: '185px' }}
                    >
                      {/* Station Header: Badge + Category Icon + 10s Timer */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-white shadow-xs"
                            style={{ backgroundColor: feat.accentColor }}
                          >
                            BAY {feat.number}
                          </span>

                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                              isCardVisible ? 'bg-slate-100 text-slate-900' : 'bg-white/10 text-white'
                            }`}
                            style={{
                              color: isCardVisible ? feat.accentColor : undefined,
                            }}
                          >
                            <feat.icon className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* Title */}
                        <h3
                          className={`font-black text-xs sm:text-sm font-anek-latin tracking-tight leading-tight line-clamp-1 ${
                            isCardVisible ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          {feat.title}
                        </h3>

                        {/* Tagline */}
                        <p
                          className="font-bold text-[10px] sm:text-[11px] font-anek-latin mt-0.5 line-clamp-1"
                          style={{
                            color: isCardVisible ? feat.accentColor : '#93c5fd',
                          }}
                        >
                          {feat.tagline}
                        </p>

                        {/* Description */}
                        <p
                          className={`text-[10px] mt-1 leading-snug font-anek-latin line-clamp-2 ${
                            isCardVisible ? 'text-slate-600' : 'text-white/60'
                          }`}
                        >
                          {feat.description}
                        </p>
                      </div>

                      {/* Footer: 10s Live Timer when active, or Category Pill */}
                      <div className="mt-2 pt-1.5 border-t border-slate-100/20 flex items-center justify-between">
                        {isCardVisible ? (
                          <div className="flex items-center justify-between w-full">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 font-mono">
                              <Zap className="w-3 h-3 text-emerald-500 animate-pulse" />
                              {secondsRemaining}s
                            </span>
                            <div className="w-12 h-1 bg-emerald-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
                                style={{
                                  width: `${((DWELL_SECONDS - secondsRemaining) / DWELL_SECONDS) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-[9px] text-white/50 font-semibold truncate">
                            ▲ Top Bay
                          </span>
                        )}
                      </div>

                      {/* Downward Pointer Triangle pointing to Road */}
                      <div
                        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] transition-colors ${
                          isCardVisible ? 'border-t-white' : 'border-t-white/30'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ---------------------------------------------------------------------
                B. CENTER THIN ROAD (SLEEK 42px THICKNESS)
            --------------------------------------------------------------------- */}
            <div className="relative w-full h-[42px] my-1 flex items-center select-none">
              {/* Upper Road Curb (Thin 2px line) */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/40 shadow-[0_0_6px_rgba(255,255,255,0.4)]" />

              {/* Thin Asphalt Lane Surface */}
              <div className="relative w-full h-[38px] bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 flex items-center justify-between px-2 overflow-hidden shadow-inner">
                {/* Center Dashed Yellow Divider (Thin 1.5px) */}
                <div className="w-full flex items-center justify-between">
                  {Array.from({ length: 45 }).map((_, i) => (
                    <div
                      key={`dash-${i}`}
                      className="h-[2px] w-4 shrink-0 mx-1.5 bg-yellow-400/90 rounded-full shadow-[0_0_4px_rgba(250,204,21,0.5)]"
                    />
                  ))}
                </div>

                {/* 9 Stencil Stop Checkpoints along the Road */}
                {FEATURES_DATA.map((feat, idx) => {
                  const stopPct = getStopPercent(idx);
                  const isCurrent = activeStop === idx;

                  return (
                    <div
                      key={`road-mark-${feat.number}`}
                      onClick={() => goToStop(idx)}
                      className="absolute top-0 bottom-0 -translate-x-1/2 flex items-center justify-center cursor-pointer group"
                      style={{ left: `${stopPct}%`, width: '40px' }}
                    >
                      <div
                        className={`w-0.5 h-full transition-colors ${
                          isCurrent ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-white/20'
                        }`}
                      />
                      <span
                        className={`absolute text-[8px] font-mono font-bold transition-all ${
                          isCurrent
                            ? 'text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.9)] scale-110'
                            : 'text-white/30'
                        }`}
                      >
                        {feat.number}
                      </span>
                    </div>
                  );
                })}

                {/* -------------------------------------------------------------
                    THE COMPACT FLEET VEHICLE ON THE THIN ROAD
                ------------------------------------------------------------- */}
                <div
                  className="absolute z-20 pointer-events-none select-none transition-all duration-1000 ease-[cubic-bezier(0.34,1.15,0.64,1)]"
                  style={{
                    left: `${activePercent}%`,
                    top: '50%',
                    transform: `translate(-50%, -50%) translateY(${carYOffset}px) ${
                      driveDirection === 'left' ? 'scaleX(-1)' : 'scaleX(1)'
                    }`,
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Forward Headlight Beam on the Thin Road */}
                    <div
                      className={`absolute left-[80%] top-1/2 -translate-y-1/2 w-28 h-8 pointer-events-none transition-opacity ${
                        isDriving ? 'opacity-90' : 'opacity-65'
                      }`}
                      style={{
                        background:
                          'radial-gradient(ellipse at left, rgba(147, 197, 253, 0.75) 0%, rgba(59, 130, 246, 0.25) 45%, transparent 75%)',
                        clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)',
                        filter: 'blur(1px)',
                      }}
                    />

                    {/* Red Rear Taillight Glow */}
                    <div className="absolute right-[90%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-rose-500/60 blur-xs pointer-events-none" />

                    {/* Under-Car Contact Shadow */}
                    <div className="absolute -bottom-0.5 left-1 right-1 h-2 bg-black/60 rounded-[100%] blur-[2px] pointer-events-none" />

                    {/* Proportional Compact Fleet Vehicle SVG (70px x 28px) */}
                    <svg
                      viewBox="0 0 140 56"
                      className="w-[66px] sm:w-[72px] h-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient id="thinCarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="60%" stopColor="#f1f5f9" />
                          <stop offset="100%" stopColor="#cbd5e1" />
                        </linearGradient>
                      </defs>

                      {/* Aerodynamic Chassis */}
                      <path
                        d="M 10 38 
                           L 8 32 
                           C 6 26, 12 24, 20 24 
                           L 36 24 
                           L 52 11 
                           C 55 9, 60 8, 66 8 
                           L 94 8 
                           C 100 8, 104 10, 108 15 
                           L 120 27 
                           L 132 31 
                           C 136 32, 137 35, 137 39 
                           L 136 43 
                           L 127 43 
                           C 127 36, 117 36, 117 43 
                           L 46 43 
                           C 46 36, 36 36, 36 43 
                           L 14 43 
                           Z"
                        fill="url(#thinCarGrad)"
                        stroke="#94a3b8"
                        strokeWidth="1"
                      />

                      {/* Blue Accent Side Stripe */}
                      <path
                        d="M 20 31 L 126 31 L 123 34 L 18 34 Z"
                        fill="#2563eb"
                      />

                      {/* Tinted Windows */}
                      <path
                        d="M 54 22 L 68 11 L 93 11 L 93 22 Z"
                        fill="#0f172a"
                      />
                      <path
                        d="M 96 11 L 106 11 L 118 22 L 96 22 Z"
                        fill="#0f172a"
                      />

                      {/* SERVIQ Decal */}
                      <text
                        x="69"
                        y="30"
                        fill="#1e3a8a"
                        fontSize="5"
                        fontWeight="800"
                        fontFamily="sans-serif"
                        letterSpacing="0.5"
                      >
                        SERVIQ
                      </text>

                      {/* Front Projector Headlight */}
                      <path
                        d="M 130 31 L 136 33 L 135 38 L 129 37 Z"
                        fill="#e0f2fe"
                      />

                      {/* Rear LED Taillight */}
                      <path
                        d="M 8 31 L 11 31 L 11 35 L 8 35 Z"
                        fill="#ef4444"
                      />

                      {/* Rear Wheel with Rotating Spokes */}
                      <g transform="translate(41, 43)">
                        <circle cx="0" cy="0" r="8.5" fill="#0f172a" />
                        <circle cx="0" cy="0" r="5.5" fill="#64748b" />
                        <circle cx="0" cy="0" r="2.5" fill="#e2e8f0" />
                        <g className={isDriving ? 'animate-spin origin-center' : ''}>
                          <line x1="0" y1="-5.5" x2="0" y2="5.5" stroke="#cbd5e1" strokeWidth="1" />
                          <line x1="-5.5" y1="0" x2="5.5" y2="0" stroke="#cbd5e1" strokeWidth="1" />
                        </g>
                      </g>

                      {/* Front Wheel with Rotating Spokes */}
                      <g transform="translate(122, 43)">
                        <circle cx="0" cy="0" r="8.5" fill="#0f172a" />
                        <circle cx="0" cy="0" r="5.5" fill="#64748b" />
                        <circle cx="0" cy="0" r="2.5" fill="#e2e8f0" />
                        <g className={isDriving ? 'animate-spin origin-center' : ''}>
                          <line x1="0" y1="-5.5" x2="0" y2="5.5" stroke="#cbd5e1" strokeWidth="1" />
                          <line x1="-5.5" y1="0" x2="5.5" y2="0" stroke="#cbd5e1" strokeWidth="1" />
                        </g>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Lower Road Curb (Thin 2px line) */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/40 shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
            </div>

            {/* ---------------------------------------------------------------------
                C. BOTTOM SECTION: EVEN SERVICE STATIONS (Stop 02, 04, 06, 08)
            --------------------------------------------------------------------- */}
            <div className="relative w-full h-[210px] sm:h-[220px]">
              {FEATURES_DATA.map((feat, idx) => {
                const isEven = idx % 2 === 1; // idx 1 = Stop 2 (even)
                if (!isEven) return null;

                const stopPct = getStopPercent(idx);
                const isCardVisible = displayedStop === idx;

                return (
                  <div
                    key={`station-bot-${feat.number}`}
                    onClick={() => goToStop(idx)}
                    className="absolute top-1 -translate-x-1/2 cursor-pointer transition-all duration-500 ease-out"
                    style={{
                      left: `${stopPct}%`,
                      width: '18%',
                      maxWidth: '210px',
                      minWidth: '135px',
                    }}
                  >
                    {/* Upward Pointer Triangle pointing to Road */}
                    <div
                      className={`absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] transition-colors z-10 ${
                        isCardVisible ? 'border-b-white' : 'border-b-white/30'
                      }`}
                    />

                    {/* Bottom Station Card */}
                    <div
                      className={`relative rounded-2xl p-3 sm:p-3.5 transition-all duration-300 flex flex-col justify-between select-none ${
                        isCardVisible
                          ? 'bg-white text-slate-900 shadow-[0_15px_35px_rgba(0,0,0,0.35)] ring-2 ring-white scale-105 z-30'
                          : 'bg-white/10 backdrop-blur-md text-white/90 border border-white/15 hover:bg-white/20 hover:scale-102 z-10'
                      }`}
                      style={{ minHeight: '185px' }}
                    >
                      {/* Station Header: Badge + Category Icon + 10s Timer */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-white shadow-xs"
                            style={{ backgroundColor: feat.accentColor }}
                          >
                            BAY {feat.number}
                          </span>

                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                              isCardVisible ? 'bg-slate-100 text-slate-900' : 'bg-white/10 text-white'
                            }`}
                            style={{
                              color: isCardVisible ? feat.accentColor : undefined,
                            }}
                          >
                            <feat.icon className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* Title */}
                        <h3
                          className={`font-black text-xs sm:text-sm font-anek-latin tracking-tight leading-tight line-clamp-1 ${
                            isCardVisible ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          {feat.title}
                        </h3>

                        {/* Tagline */}
                        <p
                          className="font-bold text-[10px] sm:text-[11px] font-anek-latin mt-0.5 line-clamp-1"
                          style={{
                            color: isCardVisible ? feat.accentColor : '#93c5fd',
                          }}
                        >
                          {feat.tagline}
                        </p>

                        {/* Description */}
                        <p
                          className={`text-[10px] mt-1 leading-snug font-anek-latin line-clamp-2 ${
                            isCardVisible ? 'text-slate-600' : 'text-white/60'
                          }`}
                        >
                          {feat.description}
                        </p>
                      </div>

                      {/* Footer: 10s Live Timer when active, or Category Pill */}
                      <div className="mt-2 pt-1.5 border-t border-slate-100/20 flex items-center justify-between">
                        {isCardVisible ? (
                          <div className="flex items-center justify-between w-full">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 font-mono">
                              <Zap className="w-3 h-3 text-emerald-500 animate-pulse" />
                              {secondsRemaining}s
                            </span>
                            <div className="w-12 h-1 bg-emerald-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
                                style={{
                                  width: `${((DWELL_SECONDS - secondsRemaining) / DWELL_SECONDS) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-[9px] text-white/50 font-semibold truncate">
                            ▼ Bottom Bay
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. HIGHWAY CONTROLS & 10-SECOND SERVICE STATUS MONITOR
        ========================================================================= */}
        <div className="w-full max-w-3xl mx-auto mt-4 sm:mt-5 flex flex-col items-center gap-3 z-20">
          {/* Quick Jump Buttons with Top/Bottom Indicators */}
          <div className="flex items-center justify-center flex-wrap gap-1.5 px-2">
            {FEATURES_DATA.map((feat, idx) => {
              const isCurrent = activeStop === idx;
              const isOdd = idx % 2 === 0;

              return (
                <button
                  key={`pill-${feat.number}`}
                  onClick={() => goToStop(idx)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-300 cursor-pointer ${
                    isCurrent
                      ? 'bg-white text-slate-900 shadow-md ring-2 ring-white/60 scale-105'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/15 hover:text-white'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: isCurrent ? feat.accentColor : 'rgba(255,255,255,0.4)',
                    }}
                  />
                  <span>
                    {feat.number} {feat.title.split(' ')[0]}
                  </span>
                  <span className="text-[8px] opacity-75 font-mono">
                    {isOdd ? '▲' : '▼'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Master Controller: Previous, Auto-Drive/Pause, Next & 10-Second Timer */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2 rounded-2xl border border-white/20 shadow-lg text-xs">
            {/* Prev Station Button */}
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer active:scale-95"
              aria-label="Previous Service Station"
              title="Previous Station"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Play/Pause Auto-Tour Button */}
            <button
              onClick={() => setIsPlaying((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-white text-[#2335f2] font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-[#2335f2]" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-[#2335f2]" />
                  <span>Auto-Drive (10s)</span>
                </>
              )}
            </button>

            {/* Next Station Button */}
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer active:scale-95"
              aria-label="Next Service Station"
              title="Next Station"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-5 bg-white/20" />

            {/* Current Station & 10-Second Countdown Meter */}
            <div className="flex items-center gap-2 text-white/90">
              <span className="font-mono font-bold text-white">
                Bay {activeFeature.number} / 09
              </span>
              <span className="hidden sm:inline text-white/80">
                ({activeFeature.stationType === 'odd' ? 'Top' : 'Bottom'})
              </span>

              {/* 10-Second Dwell Meter */}
              {isPlaying && !isHovered && !isDriving && (
                <div className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 rounded-full ml-1 font-mono text-emerald-300 font-bold text-[10px]">
                  <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>{secondsRemaining}s</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
