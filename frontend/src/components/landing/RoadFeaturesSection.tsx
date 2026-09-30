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
  Navigation,
  Zap,
  Clock,
  Radio,
  Activity,
  Layers,
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
      'Manage vehicle profiles, assignments, status, odometer readings, service history, and important information from one place.',
    icon: Truck,
    accentColor: '#2563eb',
    badge: 'Asset Directory',
    highlights: ['Digital RC & Docs', 'Live Odometer Sync', 'Service History'],
    stationType: 'odd',
    stationName: 'Fleet Intake & Profile Bay',
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
    stationType: 'even',
    stationName: 'Driver Dispatch & Roster Dock',
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
    stationType: 'odd',
    stationName: 'Scheduled Lube & Service Bay',
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
    stationType: 'even',
    stationName: 'Rapid Diagnostic & Repair Bay',
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
    stationType: 'odd',
    stationName: 'Parts & Fuel Accounting Dock',
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
    stationType: 'even',
    stationName: 'Permit & RC Compliance Station',
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
    stationType: 'odd',
    stationName: 'OBD Telemetry & Health Bay',
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
    stationType: 'even',
    stationName: 'Automated Dispatch & Alerts Kiosk',
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
    stationType: 'odd',
    stationName: 'Executive Fleet Operations HQ',
  },
];

// Track layout constants
const MARGIN_LEFT = 280;
const STATION_SPACING = 270;
const TOTAL_STOPS = FEATURES_DATA.length;
const TRACK_WIDTH = MARGIN_LEFT * 2 + (TOTAL_STOPS - 1) * STATION_SPACING; // 2720px
const DWELL_SECONDS = 10; // Exactly 10 seconds per stop

// Helper to get stop X center position
const getStopX = (index: number) => MARGIN_LEFT + index * STATION_SPACING;

export const RoadFeaturesSection: React.FC = () => {
  const [activeStop, setActiveStop] = useState<number>(0);
  const [displayedStop, setDisplayedStop] = useState<number>(0);
  const [isDriving, setIsDriving] = useState<boolean>(false);
  const [carYOffset, setCarYOffset] = useState<number>(-26); // parked in top bay initially (Stop 1 is odd)
  const [driveDirection, setDriveDirection] = useState<'right' | 'left'>('right');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(DWELL_SECONDS);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
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

  // Jump or drive to a specific station
  const goToStop = useCallback(
    (targetIndex: number) => {
      const normalizedIndex = (targetIndex + TOTAL_STOPS) % TOTAL_STOPS;
      if (normalizedIndex === activeStop && !isDriving) return;

      const isOddStation = normalizedIndex % 2 === 0; // index 0 = Stop 1 (odd)
      const targetBayY = isOddStation ? -26 : 26; // pull into top bay (-26px) or bottom bay (+26px)

      setDriveDirection(normalizedIndex >= activeStop ? 'right' : 'left');
      setIsDriving(true);
      setActiveStop(normalizedIndex);
      setSecondsRemaining(DWELL_SECONDS);

      // Hide card while car is driving
      setDisplayedStop(-1);

      // Step 1: Car moves out to the center lane (Y=0) immediately
      setCarYOffset(0);

      centerStopInViewport(normalizedIndex, true);

      if (driveTimerRef.current) clearTimeout(driveTimerRef.current);

      // Step 2: As the car approaches target X, pull into the service bay
      driveTimerRef.current = setTimeout(() => {
        setCarYOffset(targetBayY);
        setIsDriving(false);
        setDisplayedStop(normalizedIndex);
        setSecondsRemaining(DWELL_SECONDS);
      }, 1050);
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

  // Automatic travel with exactly 10-second dwell time per station
  useEffect(() => {
    if (!isPlaying || isHovered || isDriving) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      return;
    }

    // Start 10-second countdown
    setSecondsRemaining(DWELL_SECONDS);

    countdownIntervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // After 10 seconds (10,000 ms), drive automatically to next station
    timerRef.current = setTimeout(() => {
      handleNext();
    }, DWELL_SECONDS * 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [isPlaying, isHovered, isDriving, activeStop, handleNext]);

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
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 z-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-white/90 mb-3 shadow-sm">
            <Radio className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
            <span>Autonomous Fleet Service Highway</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-anek-latin tracking-tight leading-tight drop-shadow-sm"
            style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
          >
            Everything You Need to Keep Moving.
          </h2>

          <p className="font-neue-haas-medium text-white/85 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-2.5 leading-relaxed">
            Watch our vehicle pull into 9 alternating Service Stations along the highway — Odd Stations on top, Even Stations on the bottom — with a 10-second operational inspection at each stop.
          </p>
        </div>

        {/* =========================================================================
            2. HIGHWAY CANVAS: TOP ODD STATIONS, CENTER ROAD, BOTTOM EVEN STATIONS
        ========================================================================= */}
        <div
          className="relative w-full overflow-x-auto scrollbar-none pb-4 pt-2 cursor-grab active:cursor-grabbing focus:outline-none"
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Scrollable Highway Canvas (2720px) */}
          <div
            className="relative flex flex-col justify-between"
            style={{ width: `${TRACK_WIDTH}px`, minHeight: '820px' }}
          >
            {/* ---------------------------------------------------------------------
                A. TOP SECTION: ODD SERVICE STATIONS (Stop 01, 03, 05, 07, 09)
            --------------------------------------------------------------------- */}
            <div className="relative w-full h-[330px]">
              {FEATURES_DATA.map((feat, idx) => {
                const isOdd = idx % 2 === 0; // idx 0 = Stop 1 (odd)
                if (!isOdd) return null; // Even stations rendered in bottom section

                const stopX = getStopX(idx);
                const isCurrentStop = activeStop === idx;
                const isCardVisible = displayedStop === idx;

                return (
                  <div
                    key={`station-top-${feat.number}`}
                    className="absolute bottom-0"
                    style={{
                      left: `${stopX}px`,
                      transform: 'translateX(-50%)',
                      width: '410px',
                    }}
                  >
                    {/* The Service Station Building & Feature Card */}
                    <div
                      onClick={() => goToStop(idx)}
                      className={`relative rounded-3xl transition-all duration-500 ease-out cursor-pointer ${
                        isCardVisible
                          ? 'bg-white text-slate-900 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.45)] border-2 border-white ring-4 ring-white/20 -translate-y-2'
                          : 'bg-white/15 backdrop-blur-md text-white/90 border border-white/20 hover:bg-white/25 hover:-translate-y-1'
                      }`}
                    >
                      {/* Station Illuminated Roof Canopy */}
                      <div
                        className={`rounded-t-3xl px-5 py-2.5 flex items-center justify-between border-b transition-colors ${
                          isCardVisible
                            ? 'border-slate-100'
                            : 'border-white/10 bg-black/10'
                        }`}
                        style={{
                          backgroundColor: isCardVisible ? `${feat.accentColor}12` : undefined,
                        }}
                      >
                        {/* Service Station Identifier */}
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-white shadow-xs"
                            style={{ backgroundColor: feat.accentColor }}
                          >
                            STATION {feat.number}
                          </span>
                          <span
                            className={`text-xs font-bold font-anek-latin ${
                              isCardVisible ? 'text-slate-700' : 'text-white/80'
                            }`}
                          >
                            {feat.stationName}
                          </span>
                        </div>

                        {/* Top Bay Tag */}
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-white/20 text-white/90">
                          ▲ TOP BAY
                        </span>
                      </div>

                      {/* Station Content / Feature Details */}
                      <div className="p-5 sm:p-6">
                        {/* Header Row: Icon + Badge + 10s Countdown */}
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shadow-sm transition-transform ${
                              isCardVisible ? 'scale-105' : 'opacity-80'
                            }`}
                            style={{
                              backgroundColor: `${feat.accentColor}20`,
                              color: feat.accentColor,
                            }}
                          >
                            <feat.icon className="w-5 h-5" />
                          </div>

                          {/* 10s Dwell Service Gauge */}
                          {isCardVisible && (
                            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full text-emerald-700 text-xs font-bold">
                              <Zap className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                              <span>Servicing: {secondsRemaining}s</span>
                              <div className="w-10 h-1.5 bg-emerald-200 rounded-full overflow-hidden ml-0.5">
                                <div
                                  className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
                                  style={{
                                    width: `${((DWELL_SECONDS - secondsRemaining) / DWELL_SECONDS) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          {!isCardVisible && (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/70 border border-white/15">
                              {feat.badge}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3
                          className={`font-black text-xl sm:text-2xl font-anek-latin tracking-tight leading-tight ${
                            isCardVisible ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          {feat.title}
                        </h3>

                        {/* Tagline */}
                        <p
                          className="font-bold text-xs sm:text-sm mt-1 font-anek-latin"
                          style={{
                            color: isCardVisible ? feat.accentColor : '#93c5fd',
                          }}
                        >
                          {feat.tagline}
                        </p>

                        {/* Description: full details when reached, preview when standby */}
                        <p
                          className={`text-xs mt-2 leading-relaxed font-anek-latin ${
                            isCardVisible ? 'text-slate-600 line-clamp-3' : 'text-white/60 line-clamp-2'
                          }`}
                        >
                          {feat.description}
                        </p>

                        {/* Feature Highlights Pills (Active at Station) */}
                        {isCardVisible && (
                          <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                            {feat.highlights.map((h, hIdx) => (
                              <span
                                key={hIdx}
                                className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 font-anek-latin"
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full shrink-0"
                                  style={{ backgroundColor: feat.accentColor }}
                                />
                                {h}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Station Driveway Ramp Connecting to Highway Below */}
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                        <div
                          className={`w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] ${
                            isCardVisible ? 'border-t-white' : 'border-t-white/30'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Overhead Station Spotlight Beam Shining Down onto the Bay when car is present */}
                    {isCardVisible && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 top-full w-24 h-16 pointer-events-none opacity-40 blur-[4px]"
                        style={{
                          background: `radial-gradient(ellipse at top, ${feat.accentColor} 0%, transparent 75%)`,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* ---------------------------------------------------------------------
                B. CENTER HORIZONTAL ROAD (LEFT TO RIGHT)
            --------------------------------------------------------------------- */}
            <div className="relative w-full h-[140px] my-1">
              {/* Upper Highway Concrete Curb & Hazard Warning Blocks */}
              <div className="w-full h-3 bg-slate-800 border-t border-white/20 flex overflow-hidden">
                {Array.from({ length: 110 }).map((_, i) => (
                  <div
                    key={`curb-top-${i}`}
                    className={`h-full w-6 shrink-0 ${
                      i % 2 === 0 ? 'bg-amber-400/80' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Main Asphalt Highway Surface */}
              <div className="relative w-full h-[116px] bg-gradient-to-b from-[#172033] via-[#0f172a] to-[#172033] shadow-inner flex flex-col justify-between py-2 border-y border-white/10">
                {/* Upper Lane Shoulder Line */}
                <div className="w-full h-1 bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />

                {/* Center Highway Dashed Divider */}
                <div className="w-full flex items-center justify-between px-2 overflow-hidden">
                  {Array.from({ length: 80 }).map((_, i) => (
                    <div
                      key={`dash-${i}`}
                      className="h-1.5 w-7 shrink-0 mx-2 bg-yellow-400/85 rounded-full shadow-[0_0_6px_rgba(250,204,21,0.6)]"
                    />
                  ))}
                </div>

                {/* Lower Lane Shoulder Line */}
                <div className="w-full h-1 bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />

                {/* -------------------------------------------------------------
                    9 STATION SERVICE BAY ROAD MARKINGS (ODD TOP, EVEN BOTTOM)
                ------------------------------------------------------------- */}
                {FEATURES_DATA.map((feat, idx) => {
                  const isOdd = idx % 2 === 0;
                  const stopX = getStopX(idx);
                  const isCurrent = activeStop === idx;

                  return (
                    <div
                      key={`station-road-${feat.number}`}
                      onClick={() => goToStop(idx)}
                      className="absolute top-0 bottom-0 flex flex-col items-center justify-between py-1 cursor-pointer group"
                      style={{
                        left: `${stopX}px`,
                        transform: 'translateX(-50%)',
                        width: '130px',
                      }}
                    >
                      {/* Top Bay Service Entry Markings (For Odd Stations) */}
                      <div
                        className={`w-28 text-center py-0.5 rounded-t text-[9px] font-mono font-black transition-all ${
                          isOdd && isCurrent
                            ? 'bg-emerald-500/25 text-emerald-300 border-t-2 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                            : isOdd
                            ? 'text-white/40 group-hover:text-white/80'
                            : 'opacity-0'
                        }`}
                      >
                        {isOdd ? `▲ SERVICE BAY ${feat.number}` : ''}
                      </div>

                      {/* Stencil Pit Stop Checkpoint */}
                      <div
                        className={`w-full py-0.5 text-center font-mono font-bold text-[10px] tracking-wider transition-all ${
                          isCurrent
                            ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] scale-110'
                            : 'text-white/35 group-hover:text-white/70'
                        }`}
                      >
                        {isCurrent ? `● IN BAY ${feat.number}` : `STOP ${feat.number}`}
                      </div>

                      {/* Bottom Bay Service Entry Markings (For Even Stations) */}
                      <div
                        className={`w-28 text-center py-0.5 rounded-b text-[9px] font-mono font-black transition-all ${
                          !isOdd && isCurrent
                            ? 'bg-blue-500/25 text-blue-300 border-b-2 border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.5)]'
                            : !isOdd
                            ? 'text-white/40 group-hover:text-white/80'
                            : 'opacity-0'
                        }`}
                      >
                        {!isOdd ? `▼ SERVICE BAY ${feat.number}` : ''}
                      </div>
                    </div>
                  );
                })}

                {/* -------------------------------------------------------------
                    THE FLEET VEHICLE (PULLS INTO TOP BAY OR BOTTOM BAY)
                ------------------------------------------------------------- */}
                <div
                  className="absolute bottom-2 z-20 pointer-events-none select-none transition-all duration-1000 ease-[cubic-bezier(0.34,1.15,0.64,1)]"
                  style={{
                    left: `${activeX}px`,
                    transform: `translateX(-50%) translateY(${carYOffset}px) ${
                      driveDirection === 'left' ? 'scaleX(-1)' : 'scaleX(1)'
                    }`,
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Forward Headlight Beam illuminating the Road & Service Bay */}
                    <div
                      className={`absolute left-[80%] top-1/2 -translate-y-1/2 w-48 h-16 pointer-events-none transition-opacity duration-300 ${
                        isDriving ? 'opacity-90' : 'opacity-70'
                      }`}
                      style={{
                        background:
                          'radial-gradient(ellipse at left, rgba(147, 197, 253, 0.75) 0%, rgba(59, 130, 246, 0.3) 45%, transparent 75%)',
                        clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)',
                        filter: 'blur(2px)',
                      }}
                    />

                    {/* Red Rear Taillight Glow */}
                    <div className="absolute right-[92%] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-rose-500/50 blur-md pointer-events-none" />

                    {/* Under-Car Contact Shadow */}
                    <div className="absolute -bottom-1 left-2 right-2 h-3.5 bg-black/60 rounded-[100%] blur-[4px] pointer-events-none" />

                    {/* Sleek Vector Fleet Vehicle SVG */}
                    <svg
                      viewBox="0 0 200 80"
                      className="w-36 sm:w-40 md:w-44 h-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
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

                      {/* Aerodynamic Chassis */}
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

                      {/* Fleet Accent Stripe */}
                      <path
                        d="M 28 44 L 180 44 L 176 48 L 26 48 Z"
                        fill="url(#fleetStripe)"
                      />

                      {/* Windshield and Windows */}
                      <path
                        d="M 77 31 L 96 16 L 132 16 L 132 31 Z"
                        fill="url(#windowGlass)"
                      />
                      <path
                        d="M 136 16 L 150 16 L 168 31 L 136 31 Z"
                        fill="url(#windowGlass)"
                      />

                      {/* Glare Reflection */}
                      <path
                        d="M 102 18 L 146 18"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.6"
                      />

                      {/* SERVIQ Decal */}
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

                      {/* Rear Wheel with Rotating Spokes */}
                      <g transform="translate(59, 62)">
                        <circle cx="0" cy="0" r="12" fill="#0f172a" />
                        <circle cx="0" cy="0" r="8" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
                        <circle cx="0" cy="0" r="3.5" fill="#e2e8f0" />
                        <g className={isDriving ? 'animate-spin origin-center' : ''}>
                          <line x1="0" y1="-8" x2="0" y2="8" stroke="#cbd5e1" strokeWidth="1.5" />
                          <line x1="-8" y1="0" x2="8" y2="0" stroke="#cbd5e1" strokeWidth="1.5" />
                        </g>
                      </g>

                      {/* Front Wheel with Rotating Spokes */}
                      <g transform="translate(175, 62)">
                        <circle cx="0" cy="0" r="12" fill="#0f172a" />
                        <circle cx="0" cy="0" r="8" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
                        <circle cx="0" cy="0" r="3.5" fill="#e2e8f0" />
                        <g className={isDriving ? 'animate-spin origin-center' : ''}>
                          <line x1="0" y1="-8" x2="0" y2="8" stroke="#cbd5e1" strokeWidth="1.5" />
                          <line x1="-8" y1="0" x2="8" y2="0" stroke="#cbd5e1" strokeWidth="1.5" />
                        </g>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Lower Highway Concrete Curb */}
              <div className="w-full h-3 bg-slate-800 border-b border-white/20 flex overflow-hidden">
                {Array.from({ length: 110 }).map((_, i) => (
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
                C. BOTTOM SECTION: EVEN SERVICE STATIONS (Stop 02, 04, 06, 08)
            --------------------------------------------------------------------- */}
            <div className="relative w-full h-[330px]">
              {FEATURES_DATA.map((feat, idx) => {
                const isEven = idx % 2 === 1; // idx 1 = Stop 2 (even)
                if (!isEven) return null; // Odd stations rendered in top section

                const stopX = getStopX(idx);
                const isCurrentStop = activeStop === idx;
                const isCardVisible = displayedStop === idx;

                return (
                  <div
                    key={`station-bot-${feat.number}`}
                    className="absolute top-0"
                    style={{
                      left: `${stopX}px`,
                      transform: 'translateX(-50%)',
                      width: '410px',
                    }}
                  >
                    {/* Ramp Pointer Connecting Road above to the Station Card below */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10">
                      <div
                        className={`w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] ${
                          isCardVisible ? 'border-b-white' : 'border-b-white/30'
                        }`}
                      />
                    </div>

                    {/* The Service Station Building & Feature Card */}
                    <div
                      onClick={() => goToStop(idx)}
                      className={`relative rounded-3xl transition-all duration-500 ease-out cursor-pointer ${
                        isCardVisible
                          ? 'bg-white text-slate-900 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.45)] border-2 border-white ring-4 ring-white/20 translate-y-2'
                          : 'bg-white/15 backdrop-blur-md text-white/90 border border-white/20 hover:bg-white/25 hover:translate-y-1'
                      }`}
                    >
                      {/* Station Illuminated Roof Canopy */}
                      <div
                        className={`rounded-t-3xl px-5 py-2.5 flex items-center justify-between border-b transition-colors ${
                          isCardVisible
                            ? 'border-slate-100'
                            : 'border-white/10 bg-black/10'
                        }`}
                        style={{
                          backgroundColor: isCardVisible ? `${feat.accentColor}12` : undefined,
                        }}
                      >
                        {/* Station Number Badge */}
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-white shadow-xs"
                            style={{ backgroundColor: feat.accentColor }}
                          >
                            STATION {feat.number}
                          </span>
                          <span
                            className={`text-xs font-bold font-anek-latin ${
                              isCardVisible ? 'text-slate-700' : 'text-white/80'
                            }`}
                          >
                            {feat.stationName}
                          </span>
                        </div>

                        {/* Bottom Bay Tag */}
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-white/20 text-white/90">
                          ▼ BOTTOM BAY
                        </span>
                      </div>

                      {/* Station Details */}
                      <div className="p-5 sm:p-6">
                        {/* Header Row: Icon + Badge + 10s Countdown */}
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shadow-sm transition-transform ${
                              isCardVisible ? 'scale-105' : 'opacity-80'
                            }`}
                            style={{
                              backgroundColor: `${feat.accentColor}20`,
                              color: feat.accentColor,
                            }}
                          >
                            <feat.icon className="w-5 h-5" />
                          </div>

                          {/* 10s Dwell Service Gauge */}
                          {isCardVisible && (
                            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full text-emerald-700 text-xs font-bold">
                              <Zap className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                              <span>Servicing: {secondsRemaining}s</span>
                              <div className="w-10 h-1.5 bg-emerald-200 rounded-full overflow-hidden ml-0.5">
                                <div
                                  className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
                                  style={{
                                    width: `${((DWELL_SECONDS - secondsRemaining) / DWELL_SECONDS) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          {!isCardVisible && (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/70 border border-white/15">
                              {feat.badge}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3
                          className={`font-black text-xl sm:text-2xl font-anek-latin tracking-tight leading-tight ${
                            isCardVisible ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          {feat.title}
                        </h3>

                        {/* Tagline */}
                        <p
                          className="font-bold text-xs sm:text-sm mt-1 font-anek-latin"
                          style={{
                            color: isCardVisible ? feat.accentColor : '#93c5fd',
                          }}
                        >
                          {feat.tagline}
                        </p>

                        {/* Description */}
                        <p
                          className={`text-xs mt-2 leading-relaxed font-anek-latin ${
                            isCardVisible ? 'text-slate-600 line-clamp-3' : 'text-white/60 line-clamp-2'
                          }`}
                        >
                          {feat.description}
                        </p>

                        {/* Highlights (Visible when car reached station) */}
                        {isCardVisible && (
                          <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                            {feat.highlights.map((h, hIdx) => (
                              <span
                                key={hIdx}
                                className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 font-anek-latin"
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full shrink-0"
                                  style={{ backgroundColor: feat.accentColor }}
                                />
                                {h}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Overhead Spotlight onto Lower Bay */}
                    {isCardVisible && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 -top-10 w-24 h-16 pointer-events-none opacity-40 blur-[4px]"
                        style={{
                          background: `radial-gradient(ellipse at bottom, ${feat.accentColor} 0%, transparent 75%)`,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. HIGHWAY CONTROLS & 10-SECOND SERVICE STATUS MONITOR
        ========================================================================= */}
        <div className="w-full max-w-4xl mx-auto mt-6 flex flex-col items-center gap-4 z-20">
          {/* Quick Jump Buttons with Top/Bottom Indicators */}
          <div className="flex items-center justify-center flex-wrap gap-2 px-2">
            {FEATURES_DATA.map((feat, idx) => {
              const isCurrent = activeStop === idx;
              const isOdd = idx % 2 === 0;

              return (
                <button
                  key={`pill-${feat.number}`}
                  onClick={() => goToStop(idx)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
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
                  <span className="text-[9px] opacity-75 font-mono">
                    {isOdd ? '▲' : '▼'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Master Controller: Previous, Auto-Drive/Pause, Next & 10-Second Timer */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-white/20 shadow-lg">
            {/* Prev Station Button */}
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer active:scale-95"
              aria-label="Previous Service Station"
              title="Previous Station"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Play/Pause Auto-Tour Button */}
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
                  <span>Auto-Drive (10s)</span>
                </>
              )}
            </button>

            {/* Next Station Button */}
            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer active:scale-95"
              aria-label="Next Service Station"
              title="Next Station"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="w-[1px] h-6 bg-white/20" />

            {/* Current Station & 10-Second Countdown Meter */}
            <div className="flex items-center gap-2.5 text-xs font-medium text-white/90">
              <span className="font-mono font-bold text-white">
                Station {activeFeature.number} / 09
              </span>
              <span className="hidden sm:inline text-white/80">({activeFeature.stationType === 'odd' ? 'Top Bay' : 'Bottom Bay'})</span>

              {/* 10-Second Dwell Meter */}
              {isPlaying && !isHovered && !isDriving && (
                <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 rounded-full ml-1 font-mono text-emerald-300 font-bold text-[11px]">
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
