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
}

export const FEATURES_DATA: FeatureItem[] = [
  {
    number: '01',
    title: 'Vehicle Management',
    tagline: 'Know every vehicle.',
    description:
      'Manage profiles, assignments, status, odometer readings, and service history from one place.',
    icon: Truck,
    accentColor: '#2563eb',
    badge: 'Asset Directory',
    highlights: ['Digital RC & Docs', 'Odometer Sync'],
    stationType: 'odd',
  },
  {
    number: '02',
    title: 'Driver Management',
    tagline: 'Connected drivers.',
    description:
      'Create driver profiles, manage assignments, track licenses, and give drivers mobile access.',
    icon: UserCheck,
    accentColor: '#0284c7',
    badge: 'Driver Roster',
    highlights: ['Driver Profiles', 'Mobile App'],
    stationType: 'even',
  },
  {
    number: '03',
    title: 'Maintenance',
    tagline: 'Ahead of what’s due.',
    description:
      'Schedule maintenance, track service history, monitor upcoming work, and prevent breakdowns.',
    icon: Wrench,
    accentColor: '#d97706',
    badge: 'Dual-Trigger',
    highlights: ['Preventive Plan', 'Interval Alerts'],
    stationType: 'odd',
  },
  {
    number: '04',
    title: 'Repair Tracking',
    tagline: 'Reported to fixed.',
    description:
      'Drivers report issues while fleet managers track job cards and repair status end-to-end.',
    icon: AlertTriangle,
    accentColor: '#e11d48',
    badge: 'Resolution',
    highlights: ['Defect Reports', 'Job Cards'],
    stationType: 'even',
  },
  {
    number: '05',
    title: 'Expense Management',
    tagline: 'Control spend.',
    description:
      'Keep parts and maintenance expenses organized so your team has full visibility on costs.',
    icon: Receipt,
    accentColor: '#059669',
    badge: 'TCO Audit',
    highlights: ['Parts & Labor', 'Spend Audit'],
    stationType: 'odd',
  },
  {
    number: '06',
    title: 'Documents',
    tagline: 'Within reach.',
    description:
      'Store registration, insurance, fitness certificates, and permits in one secure digital vault.',
    icon: FileText,
    accentColor: '#8b5cf6',
    badge: 'Compliance',
    highlights: ['RC & Insurance', 'Expiry Alerts'],
    stationType: 'even',
  },
  {
    number: '07',
    title: 'Vehicle Health',
    tagline: 'Peak condition.',
    description:
      'Monitor vehicle readiness, track ongoing issues, and make sure every asset is roadworthy.',
    icon: ShieldCheck,
    accentColor: '#10b981',
    badge: 'Intelligence',
    highlights: ['Fleet Readiness', 'Diagnostics'],
    stationType: 'odd',
  },
  {
    number: '08',
    title: 'Notifications',
    tagline: 'Never miss alerts.',
    description:
      'Get timely alerts for upcoming service, pending repairs, expiring documents, and fleet notices.',
    icon: Bell,
    accentColor: '#f59e0b',
    badge: 'Auto Alerts',
    highlights: ['Due Reminders', 'Push Notices'],
    stationType: 'even',
  },
  {
    number: '09',
    title: 'Fleet Insights',
    tagline: 'The big picture.',
    description:
      'View fleet activity, monitor vehicle status, track service records, and make informed decisions.',
    icon: BarChart3,
    accentColor: '#6366f1',
    badge: 'Visibility',
    highlights: ['Analytics', 'Fleet Trends'],
    stationType: 'odd',
  },
];

const TOTAL_STOPS = FEATURES_DATA.length;
const DWELL_SECONDS = 10; // Exactly 10 seconds per active stop

// Percentage position of each of the 9 stops along the thin line (from 10% to 90%)
const getStopPercent = (index: number) => 10 + index * 10;

export const RoadFeaturesSection: React.FC = () => {
  const [activeStop, setActiveStop] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const goToStop = useCallback((targetIndex: number) => {
    const normalizedIndex = (targetIndex + TOTAL_STOPS) % TOTAL_STOPS;
    setActiveStop(normalizedIndex);
  }, []);

  const handleNext = useCallback(() => {
    goToStop((activeStop + 1) % TOTAL_STOPS);
  }, [activeStop, goToStop]);

  // Automatic progression: moves to next stop every 10 seconds
  useEffect(() => {
    if (isHovered) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    timerRef.current = setTimeout(() => {
      handleNext();
    }, DWELL_SECONDS * 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isHovered, activeStop, handleNext]);

  return (
    <section
      id="features"
      className="relative w-full bg-studio-blue text-white py-12 sm:py-16 overflow-hidden select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container - Fits Screen Viewport (100% width max-w-7xl) */}
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center px-2 sm:px-4 lg:px-6">
        {/* =========================================================================
            1. SECTION HEADER
        ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white/90 mb-2.5 shadow-sm">
            <Radio className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
            <span>Fleet Operations Roadmap</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-0.5" />
          </div>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-anek-latin tracking-tight leading-tight drop-shadow-sm"
            style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
          >
            Everything You Need to Keep Moving.
          </h2>

          <p className="font-neue-haas-medium text-white/80 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-1.5 leading-relaxed">
            All 9 core operational capabilities at a glance — Odd features on top, Even features on the bottom.
          </p>
        </div>

        {/* =========================================================================
            2. ALL FEATURES TOGETHER IN ONE SCREEN (TOP CARDS, THIN LINE, BOTTOM CARDS)
        ========================================================================= */}
        <div
          className="relative w-full overflow-x-auto lg:overflow-visible py-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-full min-w-[920px] flex flex-col justify-between">
            {/* ---------------------------------------------------------------------
                A. TOP ROW: ODD STATIONS (01, 03, 05, 07, 09)
            --------------------------------------------------------------------- */}
            <div className="relative w-full h-[190px] sm:h-[200px]">
              {FEATURES_DATA.map((feat, idx) => {
                const isOdd = idx % 2 === 0; // idx 0 = Stop 1 (odd)
                if (!isOdd) return null;

                const stopPct = getStopPercent(idx);
                const isActive = activeStop === idx;

                return (
                  <div
                    key={`station-top-${feat.number}`}
                    onClick={() => goToStop(idx)}
                    className="absolute bottom-2 -translate-x-1/2 cursor-pointer transition-all duration-300"
                    style={{
                      left: `${stopPct}%`,
                      width: '17.5%',
                      maxWidth: '220px',
                    }}
                  >
                    {/* Top Feature Card */}
                    <div
                      className={`relative rounded-2xl p-3 sm:p-3.5 transition-all duration-300 flex flex-col justify-between select-none ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-[0_16px_36px_rgba(0,0,0,0.4)] ring-2 ring-white scale-105 z-30'
                          : 'bg-white/10 backdrop-blur-md text-white/90 border border-white/15 hover:bg-white/20 hover:scale-102 z-10'
                      }`}
                      style={{ minHeight: '175px' }}
                    >
                      <div>
                        {/* Header: Badge & Icon */}
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-white shadow-xs"
                            style={{ backgroundColor: feat.accentColor }}
                          >
                            STOP {feat.number}
                          </span>

                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                              isActive ? 'bg-slate-100 text-slate-900' : 'bg-white/10 text-white'
                            }`}
                            style={{
                              color: isActive ? feat.accentColor : undefined,
                            }}
                          >
                            <feat.icon className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* Title */}
                        <h3
                          className={`font-black text-xs sm:text-sm font-anek-latin tracking-tight leading-tight line-clamp-1 ${
                            isActive ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          {feat.title}
                        </h3>

                        {/* Tagline */}
                        <p
                          className="font-bold text-[10px] sm:text-[11px] font-anek-latin mt-0.5 line-clamp-1"
                          style={{
                            color: isActive ? feat.accentColor : '#93c5fd',
                          }}
                        >
                          {feat.tagline}
                        </p>

                        {/* Description */}
                        <p
                          className={`text-[10px] mt-1 leading-snug font-anek-latin line-clamp-2 ${
                            isActive ? 'text-slate-600' : 'text-white/60'
                          }`}
                        >
                          {feat.description}
                        </p>
                      </div>

                      {/* Footer Badge */}
                      <div className="mt-2 pt-1.5 border-t border-slate-100/20 flex items-center justify-between">
                        <span
                          className={`text-[9px] font-semibold truncate ${
                            isActive ? 'text-slate-500' : 'text-white/50'
                          }`}
                        >
                          {feat.badge}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold ${
                            isActive ? 'text-slate-400' : 'text-white/40'
                          }`}
                        >
                          {feat.number} / 09
                        </span>
                      </div>

                      {/* Downward Pointer Triangle connecting to Thin Line */}
                      <div
                        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] transition-colors ${
                          isActive ? 'border-t-white' : 'border-t-white/30'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ---------------------------------------------------------------------
                B. CENTER THIN LINE WITH 9 MILESTONE NODES (NO CAR, NO ROAD)
            --------------------------------------------------------------------- */}
            <div className="relative w-full h-[32px] my-1 flex items-center select-none">
              {/* The Thin Horizontal Line */}
              <div className="w-full h-[2px] bg-gradient-to-r from-white/10 via-white/45 to-white/10 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />

              {/* 9 Numbered Milestone Nodes on the Line */}
              {FEATURES_DATA.map((feat, idx) => {
                const stopPct = getStopPercent(idx);
                const isActive = activeStop === idx;

                return (
                  <div
                    key={`node-${feat.number}`}
                    onClick={() => goToStop(idx)}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center cursor-pointer group z-20"
                    style={{ left: `${stopPct}%` }}
                  >
                    {/* Node Dot / Badge on the Line */}
                    <div
                      className={`rounded-full flex items-center justify-center font-mono font-bold transition-all duration-300 ${
                        isActive
                          ? 'w-7 h-7 bg-white text-slate-900 shadow-[0_0_18px_rgba(255,255,255,0.9)] ring-4 ring-white/40 scale-110'
                          : 'w-5 h-5 bg-slate-900 text-white/80 border border-white/40 group-hover:scale-110 group-hover:bg-white/20'
                      }`}
                      style={{
                        backgroundColor: isActive ? '#ffffff' : undefined,
                        color: isActive ? feat.accentColor : undefined,
                      }}
                    >
                      <span className={isActive ? 'text-[11px] font-black' : 'text-[9px]'}>
                        {feat.number}
                      </span>
                    </div>

                    {/* Active Pulse Ring */}
                    {isActive && (
                      <span
                        className="absolute w-8 h-8 rounded-full animate-ping pointer-events-none opacity-40"
                        style={{ backgroundColor: feat.accentColor }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* ---------------------------------------------------------------------
                C. BOTTOM ROW: EVEN STATIONS (02, 04, 06, 08)
            --------------------------------------------------------------------- */}
            <div className="relative w-full h-[190px] sm:h-[200px]">
              {FEATURES_DATA.map((feat, idx) => {
                const isEven = idx % 2 === 1; // idx 1 = Stop 2 (even)
                if (!isEven) return null;

                const stopPct = getStopPercent(idx);
                const isActive = activeStop === idx;

                return (
                  <div
                    key={`station-bot-${feat.number}`}
                    onClick={() => goToStop(idx)}
                    className="absolute top-2 -translate-x-1/2 cursor-pointer transition-all duration-300"
                    style={{
                      left: `${stopPct}%`,
                      width: '17.5%',
                      maxWidth: '220px',
                    }}
                  >
                    {/* Upward Pointer Triangle connecting to Thin Line */}
                    <div
                      className={`absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] transition-colors z-10 ${
                        isActive ? 'border-b-white' : 'border-b-white/30'
                      }`}
                    />

                    {/* Bottom Feature Card */}
                    <div
                      className={`relative rounded-2xl p-3 sm:p-3.5 transition-all duration-300 flex flex-col justify-between select-none ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-[0_16px_36px_rgba(0,0,0,0.4)] ring-2 ring-white scale-105 z-30'
                          : 'bg-white/10 backdrop-blur-md text-white/90 border border-white/15 hover:bg-white/20 hover:scale-102 z-10'
                      }`}
                      style={{ minHeight: '175px' }}
                    >
                      <div>
                        {/* Header: Badge & Icon */}
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-white shadow-xs"
                            style={{ backgroundColor: feat.accentColor }}
                          >
                            STOP {feat.number}
                          </span>

                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                              isActive ? 'bg-slate-100 text-slate-900' : 'bg-white/10 text-white'
                            }`}
                            style={{
                              color: isActive ? feat.accentColor : undefined,
                            }}
                          >
                            <feat.icon className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* Title */}
                        <h3
                          className={`font-black text-xs sm:text-sm font-anek-latin tracking-tight leading-tight line-clamp-1 ${
                            isActive ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          {feat.title}
                        </h3>

                        {/* Tagline */}
                        <p
                          className="font-bold text-[10px] sm:text-[11px] font-anek-latin mt-0.5 line-clamp-1"
                          style={{
                            color: isActive ? feat.accentColor : '#93c5fd',
                          }}
                        >
                          {feat.tagline}
                        </p>

                        {/* Description */}
                        <p
                          className={`text-[10px] mt-1 leading-snug font-anek-latin line-clamp-2 ${
                            isActive ? 'text-slate-600' : 'text-white/60'
                          }`}
                        >
                          {feat.description}
                        </p>
                      </div>

                      {/* Footer Badge */}
                      <div className="mt-2 pt-1.5 border-t border-slate-100/20 flex items-center justify-between">
                        <span
                          className={`text-[9px] font-semibold truncate ${
                            isActive ? 'text-slate-500' : 'text-white/50'
                          }`}
                        >
                          {feat.badge}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold ${
                            isActive ? 'text-slate-400' : 'text-white/40'
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
