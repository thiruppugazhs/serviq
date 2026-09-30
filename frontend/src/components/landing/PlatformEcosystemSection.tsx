import React from 'react';
import { Link } from 'react-router-dom';
import {
  Monitor,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Download,
  Truck,
  Wrench,
  AlertTriangle,
  FileText,
  Users,
  Gauge,
  Camera,
  MapPin,
  Check,
} from 'lucide-react';

export const PlatformEcosystemSection: React.FC = () => {
  return (
    <section
      id="platform"
      className="relative z-30 bg-white text-slate-900 py-20 sm:py-28 overflow-hidden select-none border-t border-slate-100"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-50/70 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            1. SECTION HEADER
        ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2335f2] text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-[#2335f2]" />
            Purpose-Built Ecosystem
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 font-anek-latin tracking-tight leading-tight"
            style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
          >
            Web App for Management.{' '}
            <span className="text-[#2335f2] block sm:inline">Mobile App for Drivers.</span>
          </h2>

          <p className="font-neue-haas-medium text-slate-600 text-sm sm:text-base md:text-lg mt-4 leading-relaxed max-w-2xl mx-auto">
            SERVIQ connects headquarters to highway routes. Organization Admins and Fleet Managers get
            full desktop control, while drivers stay connected with a simple on-road mobile app.
          </p>
        </div>

        {/* =========================================================================
            2. TWO-COLUMN INTERFACE SHOWCASE
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {/* -------------------------------------------------------------------
              CARD 1: WEB APP (ORGANIZATION ADMIN & FLEET MANAGER)
          ------------------------------------------------------------------- */}
          <div className="rounded-[28px] bg-slate-50/90 border border-slate-200/80 p-6 sm:p-9 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div>
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-50 text-[#2335f2] border border-blue-100 text-xs font-bold uppercase tracking-wider font-mono">
                  <Monitor className="w-4 h-4" />
                  Web Application
                </span>

                <span className="px-3 py-1 rounded-xl bg-white text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs">
                  For Org Admin & Fleet Manager
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-anek-latin tracking-tight">
                Central Operations Console
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed font-anek-latin">
                Comprehensive web platform engineered for deep operational control, multi-vehicle monitoring,
                maintenance scheduling, and maintenance expenditure auditing.
              </p>

              {/* Web App Interactive Preview Card */}
              <div className="mt-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm p-4 sm:p-5 overflow-hidden">
                {/* Browser Top Bar */}
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  </div>
                  <div className="px-3 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[11px]">
                    serviq.in/console
                  </div>
                  <div className="w-10" />
                </div>

                {/* Dashboard Snapshot */}
                <div className="space-y-3">
                  {/* Top Stats Row */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100/70">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Active Fleet</div>
                      <div className="text-base sm:text-lg font-black text-[#2335f2] mt-0.5">28 Units</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Due Service</div>
                      <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">3 Due</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Open Repairs</div>
                      <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">2 Open</div>
                    </div>
                  </div>

                  {/* Sample Vehicle Row */}
                  <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#2335f2] flex items-center justify-center shrink-0">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">TN-09-CB-4820</div>
                        <div className="text-[11px] text-slate-500">Driver: Karthik M. · Eicher Pro</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      Roadworthy
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Features List */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-[#2335f2] shrink-0 mt-0.5 stroke-[3]" />
                  <span>
                    <strong>Fleet Directory & Assignment:</strong> Complete vehicle profiles, RC documents, and driver rosters.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-[#2335f2] shrink-0 mt-0.5 stroke-[3]" />
                  <span>
                    <strong>Dual-Trigger Maintenance Engine:</strong> Odometer mileage & calendar interval alert triggers.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-[#2335f2] shrink-0 mt-0.5 stroke-[3]" />
                  <span>
                    <strong>Job Cards & Cost Auditing:</strong> Review breakdown reports, issue work orders, and audit parts bills.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-[#2335f2] shrink-0 mt-0.5 stroke-[3]" />
                  <span>
                    <strong>Role-Based Permissions:</strong> Clear separation between executive Organization Admins and Fleet Managers.
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2335f2] text-white font-bold text-xs sm:text-sm hover:bg-[#1c2bc4] transition-colors shadow-xs group-hover:scale-[1.02]"
              >
                <span>Open Web Console</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs text-slate-500 font-medium">Desktop & Tablet Optimized</span>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              CARD 2: MOBILE APP (DEDICATED FOR DRIVERS)
          ------------------------------------------------------------------- */}
          <div className="rounded-[28px] bg-slate-50/90 border border-slate-200/80 p-6 sm:p-9 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div>
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-50 text-[#2335f2] border border-blue-100 text-xs font-bold uppercase tracking-wider font-mono">
                  <Smartphone className="w-4 h-4" />
                  Mobile Application
                </span>

                <span className="px-3 py-1 rounded-xl bg-white text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs">
                  Dedicated for Drivers
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-anek-latin tracking-tight">
                Highway Driver Companion
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed font-anek-latin">
                Fast, simple, and distraction-free mobile tool designed for drivers on highway trips.
                Zero training needed to log mileage and report roadside issues.
              </p>

              {/* Mobile App Interactive Preview Card */}
              <div className="mt-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm p-4 sm:p-5 overflow-hidden">
                {/* Phone Top Notch / Header */}
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 text-xs text-slate-400">
                  <span className="font-mono text-[11px] text-slate-500">09:41 AM</span>
                  <div className="w-16 h-3 rounded-full bg-slate-100" />
                  <span className="text-[11px] text-slate-500">4G LTE</span>
                </div>

                {/* Mobile UI Snippet */}
                <div className="space-y-3">
                  {/* Current Vehicle Banner */}
                  <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-blue-300 font-semibold uppercase">Assigned Truck</div>
                      <div className="text-sm font-bold font-mono">TN-09-CB-4820</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold">
                      Trip Active
                    </span>
                  </div>

                  {/* Driver Quick Action Tiles */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100/80 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-[#2335f2] shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">Report Issue</div>
                        <div className="text-[10px] text-slate-500">Photo & GPS</div>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-[#2335f2] shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">Odometer</div>
                        <div className="text-[10px] text-slate-500">1-Tap Sync</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Features List */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-[#2335f2] shrink-0 mt-0.5 stroke-[3]" />
                  <span>
                    <strong>1-Tap Breakdown Reporting:</strong> Snap a photo and submit; automatic GPS pinpoints vehicle location.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-[#2335f2] shrink-0 mt-0.5 stroke-[3]" />
                  <span>
                    <strong>Daily Odometer Sync:</strong> Quick mileage logging at the start and end of shifts.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-[#2335f2] shrink-0 mt-0.5 stroke-[3]" />
                  <span>
                    <strong>Digital Glovebox:</strong> Instant access to vehicle RC, insurance, and highway fitness permits.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-[#2335f2] shrink-0 mt-0.5 stroke-[3]" />
                  <span>
                    <strong>Offline Support:</strong> Works reliably in weak-signal areas with automatic cloud sync.
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/download"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2335f2] text-white font-bold text-xs sm:text-sm hover:bg-[#1c2bc4] transition-colors shadow-xs group-hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                <span>Download Driver APK</span>
              </Link>
              <span className="text-xs text-slate-500 font-medium">Android 8.0+ · 28 MB</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. REAL-TIME SYNERGY FOOTER BANNER
        ========================================================================= */}
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-[24px] bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#2335f2] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 font-anek-latin">
                Seamless Two-Way Real-Time Synchronization
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-anek-latin">
                When a driver logs daily kilometers or reports a defect on mobile, the Organization Admin and Fleet Manager
                immediately see updated maintenance alerts and job cards on the Web App.
              </p>
            </div>
          </div>

          <Link
            to="/register"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm font-bold hover:bg-slate-100 transition-colors"
          >
            <span>Get Started with SERVIQ</span>
            <ArrowRight className="w-4 h-4 text-[#2335f2]" />
          </Link>
        </div>
      </div>
    </section>
  );
};
