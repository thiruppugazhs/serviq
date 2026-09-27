import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Truck,
  Wrench,
  AlertTriangle,
  UserCheck,
  Receipt,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Gauge,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const ABOUT_PARAGRAPHS = [
  {
    step: '01',
    label: 'The Challenge',
    headline: 'Hundreds of moving parts',
    text: "Managing a fleet means keeping track of hundreds of moving parts — vehicles, drivers, maintenance, repairs, documents, expenses, and daily operations.",
    meta: '6 Core Fleet Streams',
  },
  {
    step: '02',
    label: 'The Solution',
    headline: 'Brought together in one platform',
    text: "SERVIQ brings them together in one connected platform.",
    meta: 'Unified Operations Bus',
  },
  {
    step: '03',
    label: 'The Visibility',
    headline: 'Clear view of every mile & service',
    text: "From the moment a vehicle joins your fleet to every service, repair, and mile that follows, SERVIQ gives your team a clear view of what is happening and what needs attention.",
    meta: 'Complete Lifecycle Tracking',
  },
  {
    step: '04',
    label: 'The Collaboration',
    headline: 'Built for every role on your team',
    text: "Whether you're an organization admin, fleet manager, or driver, SERVIQ provides the right tools for the job — helping teams stay organized, respond faster, and keep vehicles ready for the road.",
    meta: 'Admin • Manager • Driver',
  },
];

export const ABOUT_HIGHLIGHT = "One platform. Every vehicle. Complete visibility.";

interface SatelliteNode {
  id: string;
  name: string;
  sub: string;
  icon: React.ElementType;
  angle: number;
  color: string;
  bg: string;
  activeBg: string;
  detail: string;
  metric: string;
}

const SATELLITE_NODES: SatelliteNode[] = [
  {
    id: 'vehicles',
    name: 'Vehicles',
    sub: '48 Active Units',
    icon: Truck,
    angle: -90,
    color: '#2335f2',
    bg: 'bg-blue-50 text-[#2335f2] border-blue-200',
    activeBg: 'bg-[#2335f2] text-white border-[#2335f2] shadow-blue-500/40',
    detail: 'Odometer, service intervals & vehicle profiles up to date',
    metric: '48 / 48 Ready',
  },
  {
    id: 'drivers',
    name: 'Drivers',
    sub: '24 Assigned',
    icon: UserCheck,
    angle: -30,
    color: '#059669',
    bg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    activeBg: 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/40',
    detail: 'Licenses verified, shift rosters & assigned trucks active',
    metric: '100% On-Duty Sync',
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    sub: '3 Upcoming',
    icon: Wrench,
    angle: 30,
    color: '#d97706',
    bg: 'bg-amber-50 text-amber-600 border-amber-200',
    activeBg: 'bg-amber-500 text-white border-amber-500 shadow-amber-500/40',
    detail: 'Routine inspections scheduled — zero missed service windows',
    metric: '3 Due This Week',
  },
  {
    id: 'repairs',
    name: 'Repairs',
    sub: '1 In Progress',
    icon: AlertTriangle,
    angle: 90,
    color: '#e11d48',
    bg: 'bg-rose-50 text-rose-600 border-rose-200',
    activeBg: 'bg-rose-500 text-white border-rose-500 shadow-rose-500/40',
    detail: 'Driver reported brake check ticket resolved with real-time status',
    metric: '1 Open Ticket',
  },
  {
    id: 'documents',
    name: 'Documents',
    sub: '100% Compliant',
    icon: FileText,
    angle: 150,
    color: '#0284c7',
    bg: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    activeBg: 'bg-cyan-600 text-white border-cyan-600 shadow-cyan-500/40',
    detail: 'Registrations, insurance policies & road permits organized',
    metric: '0 Expired',
  },
  {
    id: 'expenses',
    name: 'Expenses',
    sub: 'Tracked & Logged',
    icon: Receipt,
    angle: 210,
    color: '#7c3aed',
    bg: 'bg-purple-50 text-purple-600 border-purple-200',
    activeBg: 'bg-purple-600 text-white border-purple-600 shadow-purple-500/40',
    detail: 'Operational cost per mile organized with attached receipts',
    metric: 'Live Cost Index',
  },
];

export const FleetCommandNexus: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-progress through the 4 steps unless paused
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % ABOUT_PARAGRAPHS.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  // Center & radius in a 400x400 SVG coordinate system
  const cx = 200;
  const cy = 200;
  const radius = 135;

  const nodePositions = useMemo(() => {
    return SATELLITE_NODES.map((node) => {
      const rad = (node.angle * Math.PI) / 180;
      return {
        x: cx + radius * Math.cos(rad),
        y: cy + radius * Math.sin(rad),
      };
    });
  }, [cx, cy, radius]);

  const activeNodeInfo = hoveredNode !== null ? SATELLITE_NODES[hoveredNode] : null;

  return (
    <div className="relative bg-gradient-to-b from-white via-slate-50/60 to-white py-20 sm:py-28 overflow-hidden select-none">
      {/* Background Ambience & Precise Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#2335f2_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.035] pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading Badge & Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-[#2335f2]/20 mb-4 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#2335f2] animate-pulse" />
            <span
              className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#2335f2] font-anek-latin"
              style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
            >
              About SERVIQ
            </span>
          </div>

          <h2
            className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 font-anek-latin tracking-tight leading-[1.12]"
            style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
          >
            Everything Your Fleet Needs. In One Place.
          </h2>
        </div>

        {/* 2-Column Split: Interactive Narrative Steps + Synced Visual Nexus */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* =================================================================
              LEFT COLUMN: Interactive Narrative Steps (Strictly Anek Latin)
          ================================================================== */}
          <div className="lg:col-span-5 flex flex-col space-y-3.5 sm:space-y-4">
            {ABOUT_PARAGRAPHS.map((item, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={item.step}
                  onClick={() => {
                    setActiveStep(idx);
                    setIsPaused(true);
                  }}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 cursor-pointer transition-all duration-300 relative text-left group ${
                    isActive
                      ? 'bg-white border-[#2335f2] shadow-[0_16px_36px_-12px_rgba(35,53,242,0.18)] scale-[1.015]'
                      : 'bg-white/80 border-slate-200/80 hover:border-slate-300 hover:bg-white shadow-sm'
                  }`}
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-mono font-black px-2 py-0.5 rounded-md transition-colors ${
                          isActive
                            ? 'bg-[#2335f2] text-white'
                            : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                        }`}
                      >
                        {item.step}
                      </span>
                      <span
                        className={`text-xs uppercase tracking-wider font-black font-anek-latin transition-colors ${
                          isActive ? 'text-[#2335f2]' : 'text-slate-400'
                        }`}
                        style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                      >
                        {item.label}
                      </span>
                    </div>

                    <span
                      className="text-[11px] font-bold text-slate-400 font-anek-latin"
                      style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                    >
                      {item.meta}
                    </span>
                  </div>

                  {/* Exact Paragraph Body */}
                  <p
                    className={`font-anek-latin text-sm sm:text-base leading-relaxed transition-colors ${
                      isActive ? 'text-slate-900 font-bold' : 'text-slate-600 font-medium'
                    }`}
                    style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                  >
                    {item.text}
                  </p>

                  {/* Active Progress Bar Timer */}
                  {isActive && !isPaused && (
                    <div className="absolute bottom-0 left-6 right-6 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2335f2] animate-[progress_6s_linear_infinite]" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Small Highlight Badge */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-2xl bg-blue-50 border-2 border-[#2335f2]/25 shadow-sm w-full justify-center sm:justify-start">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2335f2] animate-pulse" />
                <span
                  className="font-anek-latin font-black text-xs sm:text-sm text-[#2335f2] tracking-wider uppercase"
                  style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                >
                  {ABOUT_HIGHLIGHT}
                </span>
              </div>
            </div>
          </div>

          {/* =================================================================
              RIGHT COLUMN: The Interactive Fleet Command Nexus Hub
          ================================================================== */}
          <div
            className="lg:col-span-7 flex flex-col items-center justify-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false);
              setHoveredNode(null);
            }}
          >
            <div className="relative w-full max-w-[540px] aspect-square rounded-3xl bg-white border-2 border-slate-200/90 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.08)] p-5 sm:p-7 flex flex-col justify-between overflow-hidden">
              
              {/* Dynamic Radar Background */}
              <div className="absolute inset-0 bg-[radial-gradient(#2335f2_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.035] pointer-events-none" />

              {/* Hub Top Bar with Telemetry Status */}
              <div className="relative z-20 flex items-center justify-between text-xs font-anek-latin border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span
                    className="font-black text-slate-800 uppercase tracking-wider font-anek-latin"
                    style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                  >
                    Fleet Command Nexus
                  </span>
                </div>
                <div className="font-mono text-[11px] font-black text-[#2335f2] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60">
                  {activeStep === 0 && '6 MOVING PARTS ACTIVE'}
                  {activeStep === 1 && 'CONNECTED PLATFORM'}
                  {activeStep === 2 && 'LIFECYCLE TELEMETRY'}
                  {activeStep === 3 && 'UNIFIED TEAM ROLES'}
                </div>
              </div>

              {/* Circular Hub Arena: SVG Beams + Central Core + Satellite Nodes */}
              <div className="relative flex-1 flex items-center justify-center my-3">
                <svg
                  viewBox="0 0 400 400"
                  className="w-full h-full max-w-[400px] max-h-[400px] overflow-visible"
                >
                  <defs>
                    <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2335f2" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
                    </linearGradient>
                    <filter id="laserGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Concentric Coordinate Rings */}
                  <circle
                    cx="200"
                    cy="200"
                    r="135"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                    className="opacity-75"
                  />
                  <circle
                    cx="200"
                    cy="200"
                    r="85"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    className="opacity-40"
                  />

                  {/* Dynamic Laser Beams Connecting Satellites to SERVIQ Core */}
                  {nodePositions.map((pos, i) => {
                    const isNodeActive =
                      activeStep === 1 ||
                      hoveredNode === i ||
                      (activeStep === 0 && (i === 0 || i === 2)) ||
                      (activeStep === 2 && (i === 0 || i === 3)) ||
                      (activeStep === 3 && (i === 1 || i === 4));

                    return (
                      <g key={i}>
                        {/* Static Base Line */}
                        <line
                          x1="200"
                          y1="200"
                          x2={pos.x}
                          y2={pos.y}
                          stroke={isNodeActive ? '#2335f2' : '#cbd5e1'}
                          strokeWidth={isNodeActive ? '2.5' : '1.5'}
                          strokeDasharray={isNodeActive ? 'none' : '4 4'}
                          className="transition-all duration-300"
                        />

                        {/* Animated Laser Pulse along Active Beam */}
                        {isNodeActive && (
                          <line
                            x1="200"
                            y1="200"
                            x2={pos.x}
                            y2={pos.y}
                            stroke="url(#laserBeamGrad)"
                            strokeWidth="3.5"
                            filter="url(#laserGlow)"
                            strokeDasharray="16 32"
                            className="animate-pulse"
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* Central Animated Pulse Radar */}
                  <circle
                    cx="200"
                    cy="200"
                    r="54"
                    fill="#2335f2"
                    fillOpacity="0.08"
                    className="animate-ping"
                    style={{ transformOrigin: '200px 200px', animationDuration: '3.2s' }}
                  />
                </svg>

                {/* Central SERVIQ Core Hub Node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#2335f2] via-[#1d2ce0] to-[#121da6] text-white flex flex-col items-center justify-center p-2 shadow-[0_12px_36px_rgba(35,53,242,0.45)] border-4 border-white cursor-pointer select-none group transition-transform duration-300 hover:scale-105 z-20">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mb-1 animate-pulse" />
                  <span
                    className="font-black text-sm sm:text-base tracking-wider font-anek-latin leading-tight"
                    style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                  >
                    SERVIQ
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-blue-200 font-bold">
                    HUB CORE
                  </span>
                  <span className="text-[9px] font-bold text-white/80 bg-white/20 px-2 py-0.5 rounded-full mt-1">
                    ONLINE
                  </span>
                </div>

                {/* 6 Satellite Nodes (HTML Overlay for responsive interactions) */}
                {SATELLITE_NODES.map((node, i) => {
                  const pos = nodePositions[i];
                  const leftPercent = (pos.x / 400) * 100;
                  const topPercent = (pos.y / 400) * 100;
                  const isHovered = hoveredNode === i;
                  const isHighlighted =
                    isHovered ||
                    activeStep === 1 ||
                    (activeStep === 0 && (i === 0 || i === 2)) ||
                    (activeStep === 2 && (i === 0 || i === 3)) ||
                    (activeStep === 3 && (i === 1 || i === 4));

                  const IconComp = node.icon;

                  return (
                    <div
                      key={node.id}
                      onMouseEnter={() => setHoveredNode(i)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => setHoveredNode(isHovered ? null : i)}
                      style={{
                        left: `${leftPercent}%`,
                        top: `${topPercent}%`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                    >
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-300 shadow-md ${
                          isHighlighted ? node.activeBg : node.bg
                        } ${isHovered ? 'scale-125 z-30 shadow-xl' : 'hover:scale-110'}`}
                      >
                        <IconComp className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>

                      {/* Node Label Pill */}
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-bold font-anek-latin border transition-all duration-200 pointer-events-none shadow-sm ${
                          isHighlighted
                            ? 'bg-slate-900 text-white border-slate-900 opacity-100 scale-105'
                            : 'bg-white/95 text-slate-700 border-slate-200 opacity-90'
                        }`}
                        style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                      >
                        {node.name}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Bottom Status Card / Tooltip HUD */}
              <div className="relative z-20 mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 transition-all duration-300">
                {activeNodeInfo ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#2335f2] shadow-sm">
                        <activeNodeInfo.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4
                          className="font-black text-xs sm:text-sm text-slate-900 font-anek-latin"
                          style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                        >
                          {activeNodeInfo.name} • {activeNodeInfo.sub}
                        </h4>
                        <p
                          className="text-[11px] sm:text-xs text-slate-500 font-anek-latin leading-tight"
                          style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                        >
                          {activeNodeInfo.detail}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#2335f2] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                      {activeNodeInfo.metric}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <span
                        className="font-black text-xs text-slate-900 font-anek-latin flex items-center gap-1.5"
                        style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                      >
                        <span className="w-2 h-2 rounded-full bg-[#2335f2] animate-pulse" />
                        {activeStep === 0 && 'Telemetry: All 6 Moving Parts Synchronized'}
                        {activeStep === 1 && 'Connected Core: Complete Platform Integration'}
                        {activeStep === 2 && 'Lifecycle: Vehicle Tracking & Health Logged'}
                        {activeStep === 3 && 'Multi-Role: Org Admin • Fleet Manager • Drivers'}
                      </span>
                      <p
                        className="text-[11px] text-slate-500 font-anek-latin mt-0.5"
                        style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
                      >
                        Hover or tap any node to inspect real-time fleet streams.
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 ml-2">
                      {ABOUT_PARAGRAPHS.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setActiveStep(i);
                            setIsPaused(true);
                          }}
                          className={`h-2 rounded-full transition-all ${
                            activeStep === i ? 'w-5 bg-[#2335f2]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                          }`}
                          aria-label={`Go to step ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
