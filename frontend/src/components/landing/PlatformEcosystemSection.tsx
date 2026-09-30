import React, { useState } from 'react';
import {
  Building2,
  GitBranch,
  Smartphone,
  Wrench,
  Truck,
  AlertTriangle,
  Clock,
  Gauge,
  CheckCircle2,
  FileText,
  ShieldCheck,
  MapPin,
  Camera,
  ChevronRight,
} from 'lucide-react';

interface AudienceRole {
  id: 'admin' | 'manager' | 'driver' | 'workshop';
  title: string;
  pill: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  preview: {
    consoleTitle: string;
    statusBadge: string;
    vehiclePlate: string;
    vehicleDetails: string;
    routeText: string;
    controlHeader: string;
    controls: { label: string; active?: boolean }[];
    notifications: string[];
  };
}

const AUDIENCES: AudienceRole[] = [
  {
    id: 'admin',
    title: 'Organization leadership',
    pill: 'Admin dashboard and reports',
    description:
      'Review fleet expenditure, vehicle health indexes, branch operations, and overall compliance from the central executive dashboard.',
    icon: Building2,
    preview: {
      consoleTitle: 'ORGANIZATION CONSOLE',
      statusBadge: 'All Branches Active',
      vehiclePlate: 'Fleet Health Index: 98.4%',
      vehicleDetails: '28 / 28 vehicles compliant · 0 overdue audits',
      routeText: 'Organization-wide live asset tracking',
      controlHeader: 'GOVERNANCE CONTROLS',
      controls: [
        { label: 'Expenditure & TCO Audits', active: true },
        { label: 'Compliance & Insurance Vault', active: false },
      ],
      notifications: [
        'Monthly fuel & maintenance spend reconciled',
        '2 vehicles scheduled for fitness certificate renewal',
      ],
    },
  },
  {
    id: 'manager',
    title: 'Fleet managers',
    pill: 'Live vehicle and service tracking',
    description:
      'Track routes, vehicles, odometer sync, scheduled maintenance due dates, driver assignments, and repair job cards without switching tools.',
    icon: GitBranch,
    preview: {
      consoleTitle: 'FLEET MANAGER CONSOLE',
      statusBadge: 'Live Operations',
      vehiclePlate: 'Truck TN-09-CB-4820',
      vehicleDetails: 'Route: Chennai → Salem · Eicher Pro 3019',
      routeText: 'Live GPS & odometer sync active',
      controlHeader: 'DISPATCH & SERVICE CONTROLS',
      controls: [
        { label: 'Dual-Trigger Maintenance Due (1,150 km)', active: true },
        { label: 'Assign Workshop & Issue Job Card', active: false },
      ],
      notifications: [
        'Driver Karthik M. logged morning odometer (42,850 km)',
        'Oil service interval reached milestone threshold',
      ],
    },
  },
  {
    id: 'driver',
    title: 'Drivers',
    pill: 'Mobile app for on-road tasks',
    description:
      'Submit daily odometer readings, access digital vehicle RC and insurance documents, and report roadside breakdowns in seconds.',
    icon: Smartphone,
    preview: {
      consoleTitle: 'DRIVER COMPANION',
      statusBadge: 'Live Tracking',
      vehiclePlate: 'Truck TN-09-CB-4820',
      vehicleDetails: 'Assigned: Eicher Pro 3019 (Stop 2: Salem Highway)',
      routeText: 'Live location & trip logging active',
      controlHeader: 'DRIVER CONTROLS',
      controls: [
        { label: 'Report Breakdown (Photo & GPS)', active: true },
        { label: 'Daily Odometer Sync', active: false },
      ],
      notifications: [
        'Morning inspection checklist submitted',
        'Digital RC and Insurance available offline',
      ],
    },
  },
  {
    id: 'workshop',
    title: 'Workshops & Technicians',
    pill: 'Rapid response workflow',
    description:
      'Receive roadside breakdown alerts with photos & GPS coordinates, update live repair milestones, and certify vehicle roadworthiness.',
    icon: Wrench,
    preview: {
      consoleTitle: 'WORKSHOP WORK ORDER',
      statusBadge: 'Job Card #SR-1048',
      vehiclePlate: 'Truck TN-09-CB-4820',
      vehicleDetails: 'Defect: Alternator belt wear · Stage: In Progress',
      routeText: 'Roadside mobile mechanic dispatched',
      controlHeader: 'WORKSHOP ACTIONS',
      controls: [
        { label: 'Upload Replacement Parts Bill', active: true },
        { label: 'Mark Roadworthy & Close Job', active: false },
      ],
      notifications: [
        'Defect geotag verified within 4.2 km of workshop',
        'Fleet manager approved estimate of ₹4,800',
      ],
    },
  },
];

export const PlatformEcosystemSection: React.FC = () => {
  // Default to 'driver' to exactly match the reference layout screenshot
  const [selectedRole, setSelectedRole] = useState<AudienceRole['id']>('driver');

  const currentRole = AUDIENCES.find((a) => a.id === selectedRole) || AUDIENCES[2];

  return (
    <section
      id="platform"
      className="relative z-30 bg-white text-slate-900 py-20 sm:py-28 overflow-hidden select-none border-t border-slate-100"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50/50 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            1. SECTION HEADER (MATCHING REFERENCE IMAGE)
        ========================================================================= */}
        <div className="text-center max-w-4xl mx-auto mb-14 sm:mb-18">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 font-anek-latin tracking-tight leading-tight"
            style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
          >
            One fleet workflow for every person responsible
            <span className="block mt-1 sm:mt-1.5">for the vehicle</span>
          </h2>

          <p className="font-neue-haas-medium text-slate-500 text-sm sm:text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
            Each audience sees the part of the system they need, while your organization keeps the full
            accountability picture.
          </p>
        </div>

        {/* =========================================================================
            2. INTERACTIVE DEVICE MOCKUP (LEFT) & 4 ROLE CARDS (RIGHT)
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* -------------------------------------------------------------------
              LEFT: REALISTIC DEVICE FRAME MOCKUP (Exact Match of Screenshot)
          ------------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[370px] sm:max-w-[400px] rounded-[42px] border-[3px] border-slate-300/80 bg-white p-4 shadow-[0_22px_60px_rgba(0,0,0,0.08)] relative">
              {/* Product preview top pill */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="inline-block text-[11px] font-semibold text-slate-500 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/80">
                  Product preview
                </span>

                {/* Subtle speaker / camera notch bar */}
                <div className="w-20 h-3.5 bg-slate-800 rounded-full mx-auto" />

                <div className="w-16" />
              </div>

              {/* Inner Screen Content Container */}
              <div className="rounded-[30px] bg-[#fbfcfe] border border-slate-100 p-4 sm:p-5 space-y-4">
                {/* Console Header & Live Tracking Pill */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                      {currentRole.preview.consoleTitle}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-slate-900 font-anek-latin leading-tight">
                      {currentRole.title}
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/90 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {currentRole.preview.statusBadge}
                  </span>
                </div>

                {/* Main Vehicle Status Card (Soft Yellow/Blue Tint matching reference) */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center shrink-0 shadow-xs">
                    <Truck className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {currentRole.preview.vehiclePlate}
                    </div>
                    <div className="text-[11px] text-slate-600 truncate mt-0.5">
                      {currentRole.preview.vehicleDetails}
                    </div>
                  </div>
                </div>

                {/* Curved Dotted Route Progress Box (Exact match to reference design) */}
                <div className="p-4 rounded-2xl bg-white border border-slate-100 text-center shadow-xs">
                  {/* SVG Route Wave Path with Vehicle Position */}
                  <div className="relative w-full h-12 flex items-center justify-center">
                    <svg
                      className="w-full h-10 overflow-visible text-slate-300"
                      viewBox="0 0 280 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M 10 32 Q 70 8, 140 24 T 270 16"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeDasharray="4 4"
                      />
                    </svg>

                    {/* Vehicle Marker Pin in the Center of Route */}
                    <div className="absolute left-[45%] top-[10%] w-7 h-7 rounded-full bg-amber-400 text-slate-900 border-2 border-white shadow-md flex items-center justify-center -translate-x-1/2">
                      <Truck className="w-3.5 h-3.5 stroke-[2.2]" />
                    </div>
                  </div>

                  <div className="text-[11px] font-medium text-slate-500 mt-1">
                    {currentRole.preview.routeText}
                  </div>
                </div>

                {/* Control Toggles / Actions Box */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                    {currentRole.preview.controlHeader}
                  </div>

                  <div className="space-y-2">
                    {currentRole.preview.controls.map((ctrl, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-3 rounded-xl bg-white border border-slate-200/70 flex items-center justify-between text-xs text-slate-800 shadow-2xs"
                      >
                        <span className="font-semibold">{ctrl.label}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            ctrl.active
                              ? 'border-[#2335f2] bg-blue-50'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {ctrl.active && (
                            <span className="w-2 h-2 rounded-full bg-[#2335f2]" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* App Notifications Snippet */}
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    APP NOTIFICATIONS
                  </div>
                  {currentRole.preview.notifications.map((note, nIdx) => (
                    <div key={nIdx} className="truncate text-slate-500">
                      ·· {note}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              RIGHT: 2x2 GRID OF 4 ROLE CARDS (Exact match to reference layout)
          ------------------------------------------------------------------- */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {AUDIENCES.map((aud) => {
              const Icon = aud.icon;
              const isSelected = selectedRole === aud.id;

              return (
                <div
                  key={aud.id}
                  onClick={() => setSelectedRole(aud.id)}
                  className={`rounded-2xl p-6 sm:p-7 border transition-all duration-200 cursor-pointer text-left flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50/30 border-[#2335f2] shadow-lg shadow-blue-500/5 ring-1 ring-[#2335f2]/20'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-md'
                  }`}
                  style={{ minHeight: '210px' }}
                >
                  <div>
                    {/* Top Row: Icon + Right Pill Badge */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-blue-100 text-[#2335f2]'
                            : 'bg-amber-50 text-amber-600 border border-amber-100/70'
                        }`}
                      >
                        <Icon className="w-5 h-5 stroke-[2]" />
                      </div>

                      <span className="text-[11px] px-3 py-1 rounded-full bg-slate-100/90 text-slate-600 border border-slate-200/60 font-medium truncate">
                        {aud.pill}
                      </span>
                    </div>

                    {/* Card Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-anek-latin tracking-tight leading-snug">
                      {aud.title}
                    </h3>

                    {/* Card Description */}
                    <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed font-anek-latin">
                      {aud.description}
                    </p>
                  </div>

                  {/* Active Indicator Bar at bottom */}
                  <div className="pt-3 mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#2335f2]">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Viewing on preview
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 group-hover:text-slate-600">
                        Click to preview
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
