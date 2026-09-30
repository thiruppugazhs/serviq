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
} from 'lucide-react';

export interface FeatureItem {
  number: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
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
            1. SECTION HEADER (Header pill removed as requested)
        ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 z-20">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-anek-latin tracking-tight leading-tight drop-shadow-sm"
            style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
          >
            Everything You Need to Keep Moving.
          </h2>

          <p className="font-neue-haas-medium text-white/80 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-2 leading-relaxed">
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
                A. TOP ROW: ODD STATIONS (01, 03, 05, 07, 09) - ALL WHITE SERVIQ CARDS
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
                    {/* Top Feature Card: Crisp White with Serviq Brand Colors */}
                    <div
                      className={`relative rounded-2xl p-3 sm:p-3.5 transition-all duration-300 flex flex-col justify-between select-none bg-white text-slate-900 border border-slate-100 shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.18)] hover:scale-102 ${
                        isActive
                          ? 'ring-2 ring-white shadow-[0_18px_40px_rgba(0,0,0,0.3)] scale-105 z-30'
                          : 'opacity-95 hover:opacity-100 z-10'
                      }`}
                      style={{ minHeight: '175px' }}
                    >
                      <div>
                        {/* Header: Number Badge in Serviq Blue & Category Icon in Serviq Blue */}
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-white bg-[#2335f2] shadow-xs">
                            {feat.number}
                          </span>

                          <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2335f2] border border-blue-100/60 flex items-center justify-center font-bold">
                            <feat.icon className="w-3.5 h-3.5 stroke-[2.2]" />
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-black text-xs sm:text-sm text-slate-900 font-anek-latin tracking-tight leading-tight line-clamp-1">
                          {feat.title}
                        </h3>

                        {/* Tagline in Serviq Blue */}
                        <p className="font-bold text-[10px] sm:text-[11px] font-anek-latin text-[#2335f2] mt-0.5 line-clamp-1">
                          {feat.tagline}
                        </p>

                        {/* Description */}
                        <p className="text-[10px] text-slate-600 mt-1 leading-snug font-anek-latin line-clamp-2">
                          {feat.description}
                        </p>
                      </div>

                      {/* Clean Footer in Serviq Styling (No '01 / 09' counter) */}
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-500 font-anek-latin truncate">
                          {feat.badge}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2335f2]" />
                      </div>

                      {/* Downward Pointer Triangle connecting to Thin Line */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white drop-shadow-xs" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ---------------------------------------------------------------------
                B. CENTER THIN LINE WITH 9 MILESTONE NODES (SERVIQ BLUE PALETTE)
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
                    {/* Node Dot / Badge on the Line in Serviq Blue */}
                    <div
                      className={`rounded-full flex items-center justify-center font-mono font-bold transition-all duration-300 ${
                        isActive
                          ? 'w-7 h-7 bg-white text-[#2335f2] shadow-[0_0_18px_rgba(255,255,255,0.9)] ring-4 ring-white/50 scale-110'
                          : 'w-5 h-5 bg-[#0f172a] text-white/80 border border-white/40 group-hover:scale-110 group-hover:bg-[#2335f2] group-hover:text-white'
                      }`}
                    >
                      <span className={isActive ? 'text-[11px] font-black' : 'text-[9px]'}>
                        {feat.number}
                      </span>
                    </div>

                    {/* Active Pulse Ring */}
                    {isActive && (
                      <span className="absolute w-8 h-8 rounded-full bg-white animate-ping pointer-events-none opacity-40" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* ---------------------------------------------------------------------
                C. BOTTOM ROW: EVEN STATIONS (02, 04, 06, 08) - ALL WHITE SERVIQ CARDS
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
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-white drop-shadow-xs z-10" />

                    {/* Bottom Feature Card: Crisp White with Serviq Brand Colors */}
                    <div
                      className={`relative rounded-2xl p-3 sm:p-3.5 transition-all duration-300 flex flex-col justify-between select-none bg-white text-slate-900 border border-slate-100 shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.18)] hover:scale-102 ${
                        isActive
                          ? 'ring-2 ring-white shadow-[0_18px_40px_rgba(0,0,0,0.3)] scale-105 z-30'
                          : 'opacity-95 hover:opacity-100 z-10'
                      }`}
                      style={{ minHeight: '175px' }}
                    >
                      <div>
                        {/* Header: Number Badge in Serviq Blue & Category Icon in Serviq Blue */}
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-white bg-[#2335f2] shadow-xs">
                            {feat.number}
                          </span>

                          <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2335f2] border border-blue-100/60 flex items-center justify-center font-bold">
                            <feat.icon className="w-3.5 h-3.5 stroke-[2.2]" />
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-black text-xs sm:text-sm text-slate-900 font-anek-latin tracking-tight leading-tight line-clamp-1">
                          {feat.title}
                        </h3>

                        {/* Tagline in Serviq Blue */}
                        <p className="font-bold text-[10px] sm:text-[11px] font-anek-latin text-[#2335f2] mt-0.5 line-clamp-1">
                          {feat.tagline}
                        </p>

                        {/* Description */}
                        <p className="text-[10px] text-slate-600 mt-1 leading-snug font-anek-latin line-clamp-2">
                          {feat.description}
                        </p>
                      </div>

                      {/* Clean Footer in Serviq Styling (No '01 / 09' counter) */}
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-500 font-anek-latin truncate">
                          {feat.badge}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2335f2]" />
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
