import React from 'react';
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
}

export const FEATURES_DATA: FeatureItem[] = [
  {
    number: '01',
    title: 'Vehicle Management',
    tagline: 'Know every vehicle, inside and out.',
    description:
      'Manage vehicle profiles, assignments, status, odometer readings, and service history from one place.',
    icon: Truck,
    badge: 'Asset Directory',
    highlights: ['Digital RC & Docs', 'Odometer Sync', 'Service Log'],
  },
  {
    number: '02',
    title: 'Driver Management',
    tagline: 'Keep your drivers connected.',
    description:
      'Create driver profiles, manage assignments, track licenses, and give drivers instant mobile access.',
    icon: UserCheck,
    badge: 'Driver Roster',
    highlights: ['Driver Profiles', 'Assignments', 'Mobile App'],
  },
  {
    number: '03',
    title: 'Maintenance',
    tagline: 'Stay ahead of what’s due.',
    description:
      'Schedule maintenance, track service history, monitor upcoming work, and prevent roadside breakdowns.',
    icon: Wrench,
    badge: 'Dual-Trigger Engine',
    highlights: ['Preventive Plan', 'Interval Alerts', 'Service History'],
  },
  {
    number: '04',
    title: 'Repair Tracking',
    tagline: 'From reported to resolved.',
    description:
      'Drivers report defect issues while fleet managers track job cards and repair status end-to-end.',
    icon: AlertTriangle,
    badge: 'Real-time Resolution',
    highlights: ['Defect Reports', 'Job Cards', 'Live Status'],
  },
  {
    number: '05',
    title: 'Expense Management',
    tagline: 'Know where fleet spending goes.',
    description:
      'Keep parts and maintenance expenses organized so your team has a clearer picture of vehicle costs.',
    icon: Receipt,
    badge: 'TCO & Parts Audit',
    highlights: ['Parts & Labor', 'Receipts', 'Spend Audit'],
  },
  {
    number: '06',
    title: 'Documents',
    tagline: 'Important docs within reach.',
    description:
      'Store registration, insurance, fitness certificates, and permits in one organized digital place.',
    icon: FileText,
    badge: 'Compliance Vault',
    highlights: ['RC & Insurance', 'Permits', 'Expiry Alerts'],
  },
  {
    number: '07',
    title: 'Vehicle Health',
    tagline: 'Keep fleet in peak condition.',
    description:
      'Monitor vehicle readiness, track ongoing issues, and make sure every vehicle is fit for the road.',
    icon: ShieldCheck,
    badge: 'Health Intelligence',
    highlights: ['Fleet Readiness', 'Issue Tracking', 'Roadworthy'],
  },
  {
    number: '08',
    title: 'Notifications & Reminders',
    tagline: 'Never miss what needs attention.',
    description:
      'Get timely alerts for upcoming maintenance, pending repairs, expiring documents, and fleet updates.',
    icon: Bell,
    badge: 'Automated Reminders',
    highlights: ['Due Reminders', 'Expiry Notices', 'Push Alerts'],
  },
  {
    number: '09',
    title: 'Fleet Insights',
    tagline: 'See the big picture of your fleet.',
    description:
      'View fleet activity, monitor vehicle status, track service records, and make informed operational decisions.',
    icon: BarChart3,
    badge: 'Operational Visibility',
    highlights: ['Activity Analytics', 'Maintenance Trends', 'Transparency'],
  },
];

export const RoadFeaturesSection: React.FC = () => {
  // Triple the list to ensure perfectly smooth, seamless infinite scrolling
  const carouselItems = [...FEATURES_DATA, ...FEATURES_DATA, ...FEATURES_DATA];

  return (
    <section
      id="features"
      className="relative w-full bg-studio-blue text-white py-16 sm:py-24 overflow-hidden select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Edge Gradient Overlays for Smooth Fading into the Screen */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#3236eb] to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#2f34e8] to-transparent z-20 pointer-events-none" />

      <div className="w-full flex flex-col items-center">
        {/* =========================================================================
            1. SECTION HEADER
        ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 px-4 z-20">
          <h2
            className="text-2xl sm:text-3xl md:text-5xl font-black text-white font-anek-latin tracking-tight leading-tight drop-shadow-sm"
            style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
          >
            Everything You Need to Keep Moving.
          </h2>

          <p className="font-neue-haas-medium text-white/85 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-2.5 leading-relaxed">
            All 9 core operational capabilities designed to keep every vehicle, driver, and milestone moving efficiently.
          </p>
        </div>

        {/* =========================================================================
            2. CONTINUOUS RIGHT-TO-LEFT MOVING CARDS (NEXT TO NEXT)
        ========================================================================= */}
        <div className="w-full overflow-hidden py-4 cursor-grab active:cursor-grabbing">
          {/* Infinite Marquee Track: Smoothly moves from right to left */}
          <div className="animate-marquee-scroll flex gap-6 sm:gap-8 items-stretch px-4">
            {carouselItems.map((feat, idx) => (
              <div
                key={`${feat.number}-${idx}`}
                className="w-[300px] sm:w-[340px] shrink-0 bg-white text-slate-900 rounded-[24px] p-6 sm:p-7 shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:shadow-2xl hover:-translate-y-2 border border-slate-100/90 transition-all duration-300 flex flex-col justify-between select-none group"
                style={{ minHeight: '300px' }}
              >
                <div>
                  {/* Card Header: Number Badge & Category Icon in Serviq Brand Blue */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-white bg-[#2335f2] shadow-xs">
                      {feat.number}
                    </span>

                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2335f2] border border-blue-100/70 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                      <feat.icon className="w-4 h-4 stroke-[2.2]" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-black text-xl sm:text-2xl text-slate-900 font-anek-latin tracking-tight leading-snug">
                    {feat.title}
                  </h3>

                  {/* Tagline in Serviq Blue */}
                  <p className="font-bold text-xs sm:text-sm font-anek-latin text-[#2335f2] mt-1.5">
                    {feat.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed font-anek-latin">
                    {feat.description}
                  </p>
                </div>

                <div>
                  {/* Highlights Pills in Clean Serviq Palette */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {feat.highlights.map((h, hIdx) => (
                      <span
                        key={hIdx}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200/80 font-anek-latin"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2335f2]" />
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Footer Row: Badge Pill and Serviq Indicator Dot (NO '01 / 09' counter) */}
                  <div className="pt-3.5 mt-1 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 font-anek-latin truncate">
                      {feat.badge}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#2335f2]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
