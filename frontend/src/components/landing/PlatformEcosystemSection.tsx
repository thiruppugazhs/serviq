import React from 'react';
import { Link } from 'react-router-dom';
import {
  Monitor,
  Smartphone,
  Building2,
  Sliders,
  Truck,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Download,
  AlertTriangle,
  Camera,
  MapPin,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export const PlatformEcosystemSection: React.FC = () => {
  return (
    <section
      id="platform"
      className="relative z-30 bg-white text-slate-900 py-20 sm:py-28 overflow-hidden select-none border-t border-slate-100"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-50/60 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            1. SECTION HEADER (Matching Exact Phrasing & Hierarchy of Reference Image)
        ========================================================================= */}
        <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-slate-900 font-anek-latin tracking-tight leading-[1.15]"
            style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
          >
            One fleet workflow for every person responsible for the vehicle
          </h2>

          <p className="font-neue-haas-medium text-slate-500 text-sm sm:text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
            Each audience sees the part of the system they need, while the organization keeps the full
            accountability picture.
          </p>
        </div>

        {/* =========================================================================
            2. TWO-COLUMN LAYOUT:
               - LEFT: MONITOR SCREEN (Web App for Org Admin & Fleet Manager) + CARDS
               - RIGHT: MOBILE SCREEN (Mobile App for Drivers) + CARDS
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* =====================================================================
              LEFT COLUMN: MONITOR SCREEN (WEB CONSOLE) + MANAGEMENT ROLE CARDS
          ===================================================================== */}
          <div className="space-y-6">
            {/* Monitor Screen Frame */}
            <div className="rounded-[32px] border-4 border-slate-200/90 bg-white p-5 sm:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.06)] hover:shadow-xl transition-all">
              {/* Product Preview Pill & Top Bar */}
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                    Web Console Preview
                  </span>
                  <div className="hidden sm:flex items-center gap-1.5 ml-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  </div>
                </div>

                <div className="px-3 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[11px] truncate max-w-[160px] sm:max-w-none">
                  serviq.in/console
                </div>
              </div>

              {/* Monitor Screen Content */}
              <div className="space-y-4">
                {/* Console Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                      Management Console
                    </div>
                    <div className="text-base sm:text-lg font-black text-slate-900 font-anek-latin">
                      Live Fleet Operations
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[#2335f2] border border-blue-100 text-xs font-bold font-anek-latin">
                    <span className="w-2 h-2 rounded-full bg-[#2335f2] animate-pulse" />
                    Live Sync
                  </span>
                </div>

                {/* 3 Metric Stat Tiles */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100/80">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Units</div>
                    <div className="text-lg sm:text-xl font-black text-[#2335f2] mt-0.5">28 Trucks</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Due Service</div>
                    <div className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">3 Due</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Repairs Open</div>
                    <div className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">2 Jobs</div>
                  </div>
                </div>

                {/* Live Vehicle Roster Rows */}
                <div className="space-y-2">
                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2335f2] flex items-center justify-center font-bold shrink-0">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 font-mono">TN-09-CB-4820</div>
                        <div className="text-[11px] text-slate-500">Driver: Karthik M. · Eicher Pro</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      Roadworthy
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2335f2] flex items-center justify-center font-bold shrink-0">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 font-mono">KA-01-MJ-9912</div>
                        <div className="text-[11px] text-slate-500">Scheduled: 10,000 km Oil Service</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2335f2] border border-blue-200 text-[10px] font-bold">
                      Service Due
                    </span>
                  </div>
                </div>

                {/* Bottom Footer inside monitor */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Dual-Trigger Maintenance Engine Active</span>
                  <Link to="/login" className="text-[#2335f2] font-bold hover:underline inline-flex items-center gap-1">
                    Open Console <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Management Cards (2 Cards matching Reference Image Card Design) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: School Leadership Equivalent -> Organization Leadership */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2335f2] border border-blue-100 flex items-center justify-center">
                      <Building2 className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-600 font-anek-latin">
                      Admin dashboard and reports
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 font-anek-latin">
                    Organization leadership
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-anek-latin">
                    Review total operational expenses, compliance audits, fleet utilization metrics, and configured
                    vehicle data from the executive web dashboard.
                  </p>
                </div>
              </div>

              {/* Card 2: Transport Managers Equivalent -> Fleet Managers */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2335f2] border border-blue-100 flex items-center justify-center">
                      <Sliders className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-600 font-anek-latin">
                      Live fleet & maintenance visibility
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 font-anek-latin">
                    Fleet managers
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-anek-latin">
                    Track vehicles, odometer readings, service intervals, repair job cards, and workshop delays
                    without switching tools.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              RIGHT COLUMN: MOBILE SCREEN (DRIVER APP) + DRIVER ROLE CARDS
          ===================================================================== */}
          <div className="space-y-6">
            {/* Mobile Screen Frame (Exact Phone Bezel & Layout of Reference Image) */}
            <div className="rounded-[36px] border-4 border-slate-200/90 bg-white p-5 sm:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.06)] hover:shadow-xl transition-all max-w-md mx-auto lg:max-w-none">
              {/* Product Preview Pill & Top Notch */}
              <div className="flex items-center justify-between pb-2 mb-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                  Product preview
                </span>
                <div className="w-14 h-3 bg-slate-200 rounded-full" />
                <span className="text-[11px] font-mono text-slate-400">09:41 AM</span>
              </div>

              {/* Mobile Screen Inner Canvas */}
              <div className="space-y-4 pt-1">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                      Driver Console
                    </div>
                    <div className="text-base sm:text-lg font-black text-slate-900 font-anek-latin">
                      Morning Shift
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-anek-latin">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Tracking
                  </span>
                </div>

                {/* Assigned Vehicle Highlight Card (Matching Yellow Card in Reference Image) */}
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm font-mono">
                      Truck TN-09-CB-4820
                    </div>
                    <div className="text-[11px] text-slate-600">
                      ETA: 18 mins (Checkpoint: Chennai Bypass)
                    </div>
                  </div>
                </div>

                {/* Dotted Route Graphic (Matching Reference Image) */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-center relative overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-2">
                    <span>Depot Gate</span>
                    <span className="font-bold text-[#2335f2]">Live location active</span>
                    <span>Destination</span>
                  </div>

                  {/* SVG Dotted Curved Route with Moving Pin Marker */}
                  <div className="relative w-full h-8 flex items-center justify-center">
                    <svg className="w-full h-8" viewBox="0 0 300 32" fill="none">
                      <path
                        d="M 10 16 Q 80 4 150 16 T 290 16"
                        stroke="#cbd5e1"
                        strokeWidth="2.5"
                        strokeDasharray="4 4"
                      />
                    </svg>

                    {/* Active Location Marker at Midpoint */}
                    <div className="absolute left-[48%] -translate-x-1/2 w-6 h-6 rounded-full bg-[#2335f2] text-white flex items-center justify-center shadow-md">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Driver Controls Section (Matching Reference Image) */}
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                    Driver Controls
                  </div>

                  {/* Control Row 1 */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <Camera className="w-4 h-4 text-[#2335f2]" />
                      <span className="font-semibold text-slate-800">Report Breakdown (Photo & GPS)</span>
                    </div>
                    <div className="w-4 h-4 rounded-full border border-slate-300" />
                  </div>

                  {/* Control Row 2 */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#2335f2]" />
                      <span className="font-semibold text-slate-800">Log Daily Morning Odometer</span>
                    </div>
                    <div className="w-4 h-4 rounded-full border border-slate-300" />
                  </div>
                </div>

                {/* App Notifications Snippet (Matching Reference Image) */}
                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 space-y-1 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#2335f2] font-bold">··</span>
                    <span>Vehicle arrived at highway transit zone</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#2335f2] font-bold">··</span>
                    <span>Live odometer and trip sync refreshed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Field & Driver Cards (2 Cards matching Reference Image Card Design) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 3: Parents Equivalent -> Drivers */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2335f2] border border-blue-100 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-600 font-anek-latin">
                      Daily odometer & mobile access
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 font-anek-latin">
                    Drivers
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-anek-latin">
                    Follow assigned vehicles, log daily odometers, access digital vehicle permits, and stay connected
                    on highway routes.
                  </p>
                </div>
              </div>

              {/* Card 4: Drivers/SOS Equivalent -> Emergency & Breakdown Support */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2335f2] border border-blue-100 flex items-center justify-center">
                      <Truck className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-600 font-anek-latin">
                      SOS breakdown workflow
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 font-anek-latin">
                    Breakdown & SOS response
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-anek-latin">
                    Run emergency workflows, report vehicle defects with photo & GPS, update trip state, and trigger
                    SOS when roadside help is needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
