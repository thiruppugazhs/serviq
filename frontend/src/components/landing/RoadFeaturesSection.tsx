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
  Radio,
  CheckCircle2,
  Lock,
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
    highlights: ['Digital RC & Docs', 'Odometer Sync', 'Service Log'],
    stationType: 'odd',
    stationName: 'Profile & Intake Bay',
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
    stationName: 'Dispatch & Roster Dock',
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
    highlights: ['Interval Alerts', 'Preventive Plan', 'Service Log'],
    stationType: 'odd',
    stationName: 'Scheduled Service Bay',
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
    stationName: 'Diagnostic & Repair Bay',
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
    stationName: 'Accounting & Fuel Dock',
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
    stationName: 'Compliance & RC Station',
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
    stationName: 'Telemetry & Health Bay',
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
    stationName: 'Dispatch Alerts Kiosk',
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
    stationName: 'Operations Command HQ',
  },
];

const TOTAL_STOPS = FEATURES_DATA.length;
const DWELL_SECONDS = 10; // Exactly 10 seconds per stop

// Long distance between stops: 560px spacing between stations!
const MARGIN_LEFT = 420;
const STOP_SPACING = 560;
const TRACK_WIDTH = MARGIN_LEFT * 2 + (TOTAL_STOPS - 1) * STOP_SPACING; // 4880px
const getStopX = (index: number) => MARGIN_LEFT + index * STOP_SPACING;

export const RoadFeaturesSection: React.FC = () => {
  const [activeStop, setActiveStop] = useState<number>(0);
  const [displayedStop, setDisplayedStop] = useState<number>(0);
  const [isDriving, setIsDriving] = useState<boolean>(false);
  const [carYOffset, setCarYOffset] = useState<number>(-8); // parked in top bay initially (Stop 1 is odd)
  const [driveDirection, setDriveDirection] = useState<'right' | 'left'>('right');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [viewportWidth, setViewportWidth] = useState<number>(1200);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const driveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Track viewport width for smooth camera panning
  useEffect(() => {
    const updateWidth = () => {
      if (wrapperRef.current) {
        setViewportWidth(wrapperRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

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

      // Hide all feature details while the car is in transit
      setDisplayedStop(-1);

      // Car moves to road center lane (Y=0)
      setCarYOffset(0);

      if (driveTimerRef.current) clearTimeout(driveTimerRef.current);

      // Car drives across the long distance (1350ms), arrives at the station, pulls into bay
      driveTimerRef.current = setTimeout(() => {
        setCarYOffset(targetBayY);
        setIsDriving(false);
        // THE FEATURE IS REVEALED ONLY AFTER THE CAR HAS REACHED THE SERVICE CENTER!
        setDisplayedStop(normalizedIndex);
      }, 1350);
    },
    [activeStop, isDriving]
  );

  const handleNext = useCallback(() => {
    goToStop((activeStop + 1) % TOTAL_STOPS);
  }, [activeStop, goToStop]);

  // Automatic travel with exactly 10-second dwell time per station
  useEffect(() => {
    if (isDriving || isHovered) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    timerRef.current = setTimeout(() => {
      handleNext();
    }, DWELL_SECONDS * 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isDriving, isHovered, activeStop, handleNext]);

  // Camera tracking: keeps the active station and car centered in the screen
  const targetX = getStopX(activeStop);
  const cameraX = Math.max(0, targetX - viewportWidth / 2);

  return (
    <section
      id="features"
      className="relative w-full bg-studio-blue text-white py-12 sm:py-16 overflow-hidden select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container - Fits Screen Viewport (max-w-7xl) */}
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
            Long-distance highway journey across 9 alternating Service Stations. Each feature is revealed only once the car pulls into the bay.
          </p>
        </div>

        {/* =========================================================================
            2. HIGHWAY STAGE: SMOOTH CAMERA TRACKING, LONG DISTANCE BETWEEN STOPS
        ========================================================================= */}
        <div
          ref={wrapperRef}
          className="relative w-full overflow-hidden rounded-3xl py-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Smooth Camera Track - Moves seamlessly with the car */}
          <div
            className="relative flex flex-col justify-between transition-transform duration-1000 ease-[cubic-bezier(0.35,1,0.4,1)]"
            style={{
              width: `${TRACK_WIDTH}px`,
              transform: `translateX(-${cameraX}px)`,
            }}
          >
            {/* ---------------------------------------------------------------------
                A. TOP SECTION: ODD SERVICE STATIONS (Stop 01, 03, 05, 07, 09)
            --------------------------------------------------------------------- */}
            <div className="relative w-full h-[220px] sm:h-[230px]">
              {FEATURES_DATA.map((feat, idx) => {
                const isOdd = idx % 2 === 0; // idx 0 = Stop 1 (odd)
                if (!isOdd) return null;

                const stopX = getStopX(idx);
                const isStationRevealed = displayedStop === idx;

                return (
                  <div
                    key={`station-top-${feat.number}`}
                    onClick={() => goToStop(idx)}
                    className="absolute bottom-1 -translate-x-1/2 cursor-pointer transition-all duration-500 ease-out"
                    style={{
                      left: `${stopX}px`,
                      width: '320px',
                      maxWidth: '90vw',
                    }}
                  >
                    {/* The Service Station Card: REVEALED vs STANDBY */}
                    <div
                      className={`relative rounded-2xl p-4 transition-all duration-500 flex flex-col justify-between select-none ${
                        isStationRevealed
                          ? 'bg-white text-slate-900 shadow-[0_20px_45px_rgba(0,0,0,0.4)] ring-2 ring-white scale-105 z-30 animate-in fade-in zoom-in-95 duration-400'
                          : 'bg-white/10 backdrop-blur-md text-white/80 border border-white/15 hover:bg-white/20 hover:scale-102 z-10'
                      }`}
                      style={{ minHeight: isStationRevealed ? '200px' : '90px' }}
                    >
                      {/* Station Top Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold text-white shadow-xs"
                            style={{ backgroundColor: feat.accentColor }}
                          >
                            BAY {feat.number}
                          </span>

                          <div className="flex items-center gap-2">
                            {isStationRevealed ? (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                Reached & Inspected
                              </span>
                            ) : (
                              <span className="text-[10px] text-white/50 font-mono font-semibold flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5 opacity-60" />
                                Standby Bay
                              </span>
                            )}

                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                                isStationRevealed ? 'bg-slate-100' : 'bg-white/10'
                              }`}
                              style={{
                                color: isStationRevealed ? feat.accentColor : 'rgba(255,255,255,0.7)',
                              }}
                            >
                              <feat.icon className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        {/* REVEALED CONTENT: Displayed ONLY once car reaches station! */}
                        {isStationRevealed ? (
                          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            {/* Title */}
                            <h3 className="font-black text-base sm:text-lg text-slate-900 font-anek-latin tracking-tight leading-tight">
                              {feat.title}
                            </h3>

                            {/* Tagline */}
                            <p
                              className="font-bold text-xs mt-0.5 font-anek-latin"
                              style={{ color: feat.accentColor }}
                            >
                              {feat.tagline}
                            </p>

                            {/* Description */}
                            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-anek-latin">
                              {feat.description}
                            </p>

                            {/* Feature Highlights */}
                            <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                              {feat.highlights.map((h, hIdx) => (
                                <span
                                  key={hIdx}
                                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200 font-anek-latin"
                                >
                                  <span
                                    className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{ backgroundColor: feat.accentColor }}
                                  />
                                  {h}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          /* UNREVEALED / STANDBY CONTENT: Station Name & Awaiting prompt */
                          <div className="pt-1">
                            <span className="text-xs font-bold text-white/90 font-anek-latin block">
                              {feat.stationName}
                            </span>
                            <span className="text-[10px] text-white/50 block mt-0.5">
                              Feature revealed upon vehicle arrival...
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Station Footer */}
                      <div className="mt-2 pt-1.5 border-t border-slate-100/20 flex items-center justify-between text-[10px]">
                        <span
                          className={`font-semibold ${
                            isStationRevealed ? 'text-slate-500' : 'text-white/50'
                          }`}
                        >
                          {feat.badge}
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            isStationRevealed ? 'text-slate-400' : 'text-white/40'
                          }`}
                        >
                          {feat.number} / 09
                        </span>
                      </div>

                      {/* Downward Pointer Triangle pointing to Road */}
                      <div
                        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] transition-colors ${
                          isStationRevealed ? 'border-t-white' : 'border-t-white/30'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ---------------------------------------------------------------------
                B. CENTER THIN ROAD (SLEEK 42px THICKNESS, EXTENDING ACROSS LONG TRACK)
            --------------------------------------------------------------------- */}
            <div className="relative w-full h-[42px] my-1 flex items-center select-none">
              {/* Upper Road Curb (Thin 2px line) */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/40 shadow-[0_0_6px_rgba(255,255,255,0.4)]" />

              {/* Thin Asphalt Lane Surface */}
              <div className="relative w-full h-[38px] bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 flex items-center justify-between px-2 overflow-hidden shadow-inner">
                {/* Center Dashed Yellow Divider (Thin 1.5px across long distance) */}
                <div className="w-full flex items-center justify-between">
                  {Array.from({ length: 140 }).map((_, i) => (
                    <div
                      key={`dash-${i}`}
                      className="h-[2px] w-5 shrink-0 mx-2 bg-yellow-400/90 rounded-full shadow-[0_0_4px_rgba(250,204,21,0.5)]"
                    />
                  ))}
                </div>

                {/* 9 Stencil Stop Checkpoints along the Road */}
                {FEATURES_DATA.map((feat, idx) => {
                  const stopX = getStopX(idx);
                  const isCurrent = activeStop === idx;

                  return (
                    <div
                      key={`road-mark-${feat.number}`}
                      onClick={() => goToStop(idx)}
                      className="absolute top-0 bottom-0 -translate-x-1/2 flex items-center justify-center cursor-pointer group"
                      style={{ left: `${stopX}px`, width: '80px' }}
                    >
                      <div
                        className={`w-0.5 h-full transition-colors ${
                          isCurrent ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-white/20'
                        }`}
                      />
                      <span
                        className={`absolute text-[9px] font-mono font-bold transition-all ${
                          isCurrent
                            ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.9)] scale-110'
                            : 'text-white/30'
                        }`}
                      >
                        BAY {feat.number}
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
                    left: `${targetX}px`,
                    top: '50%',
                    transform: `translate(-50%, -50%) translateY(${carYOffset}px) ${
                      driveDirection === 'left' ? 'scaleX(-1)' : 'scaleX(1)'
                    }`,
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Forward Headlight Beam on the Thin Road */}
                    <div
                      className={`absolute left-[80%] top-1/2 -translate-y-1/2 w-32 h-8 pointer-events-none transition-opacity ${
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

                    {/* Proportional Compact Fleet Vehicle SVG (72px x 28px) */}
                    <svg
                      viewBox="0 0 140 56"
                      className="w-[70px] sm:w-[76px] h-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
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
            <div className="relative w-full h-[220px] sm:h-[230px]">
              {FEATURES_DATA.map((feat, idx) => {
                const isEven = idx % 2 === 1; // idx 1 = Stop 2 (even)
                if (!isEven) return null;

                const stopX = getStopX(idx);
                const isStationRevealed = displayedStop === idx;

                return (
                  <div
                    key={`station-bot-${feat.number}`}
                    onClick={() => goToStop(idx)}
                    className="absolute top-1 -translate-x-1/2 cursor-pointer transition-all duration-500 ease-out"
                    style={{
                      left: `${stopX}px`,
                      width: '320px',
                      maxWidth: '90vw',
                    }}
                  >
                    {/* Upward Pointer Triangle pointing to Road */}
                    <div
                      className={`absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] transition-colors z-10 ${
                        isStationRevealed ? 'border-b-white' : 'border-b-white/30'
                      }`}
                    />

                    {/* Bottom Station Card: REVEALED vs STANDBY */}
                    <div
                      className={`relative rounded-2xl p-4 transition-all duration-500 flex flex-col justify-between select-none ${
                        isStationRevealed
                          ? 'bg-white text-slate-900 shadow-[0_20px_45px_rgba(0,0,0,0.4)] ring-2 ring-white scale-105 z-30 animate-in fade-in zoom-in-95 duration-400'
                          : 'bg-white/10 backdrop-blur-md text-white/80 border border-white/15 hover:bg-white/20 hover:scale-102 z-10'
                      }`}
                      style={{ minHeight: isStationRevealed ? '200px' : '90px' }}
                    >
                      {/* Station Top Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold text-white shadow-xs"
                            style={{ backgroundColor: feat.accentColor }}
                          >
                            BAY {feat.number}
                          </span>

                          <div className="flex items-center gap-2">
                            {isStationRevealed ? (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                Reached & Inspected
                              </span>
                            ) : (
                              <span className="text-[10px] text-white/50 font-mono font-semibold flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5 opacity-60" />
                                Standby Bay
                              </span>
                            )}

                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                                isStationRevealed ? 'bg-slate-100' : 'bg-white/10'
                              }`}
                              style={{
                                color: isStationRevealed ? feat.accentColor : 'rgba(255,255,255,0.7)',
                              }}
                            >
                              <feat.icon className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        {/* REVEALED CONTENT: Displayed ONLY once car reaches station! */}
                        {isStationRevealed ? (
                          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Title */}
                            <h3 className="font-black text-base sm:text-lg text-slate-900 font-anek-latin tracking-tight leading-tight">
                              {feat.title}
                            </h3>

                            {/* Tagline */}
                            <p
                              className="font-bold text-xs mt-0.5 font-anek-latin"
                              style={{ color: feat.accentColor }}
                            >
                              {feat.tagline}
                            </p>

                            {/* Description */}
                            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-anek-latin">
                              {feat.description}
                            </p>

                            {/* Feature Highlights */}
                            <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                              {feat.highlights.map((h, hIdx) => (
                                <span
                                  key={hIdx}
                                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200 font-anek-latin"
                                >
                                  <span
                                    className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{ backgroundColor: feat.accentColor }}
                                  />
                                  {h}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          /* UNREVEALED / STANDBY CONTENT: Station Name & Awaiting prompt */
                          <div className="pt-1">
                            <span className="text-xs font-bold text-white/90 font-anek-latin block">
                              {feat.stationName}
                            </span>
                            <span className="text-[10px] text-white/50 block mt-0.5">
                              Feature revealed upon vehicle arrival...
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Station Footer */}
                      <div className="mt-2 pt-1.5 border-t border-slate-100/20 flex items-center justify-between text-[10px]">
                        <span
                          className={`font-semibold ${
                            isStationRevealed ? 'text-slate-500' : 'text-white/50'
                          }`}
                        >
                          {feat.badge}
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            isStationRevealed ? 'text-slate-400' : 'text-white/40'
                          }`}
                        >
                          {feat.number} / 09
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
