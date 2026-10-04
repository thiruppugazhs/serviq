import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Wrench, ShieldCheck, Cpu } from 'lucide-react';

interface StageData {
  id: number;
  badge: string;
  badgeIcon?: React.ReactNode;
  badgeColor: string;
  badgeBg: string;
  title: string;
  description: string;
  ctaText: string;
  ctaColor: string;
  imageSrc: string;
  tabLabel: string;
}

const STAGES: StageData[] = [
  {
    id: 1,
    badge: 'MAINTENANCE',
    badgeColor: 'text-emerald-700',
    badgeBg: 'bg-emerald-50 border-emerald-200/80',
    title: 'Keep work moving from due to done',
    description:
      'Gain the visibility and control to keep service on schedule, repairs on track and costs in check, whether work happens in-house, outsourced or both.',
    ctaText: 'Learn more',
    ctaColor: 'text-emerald-700 hover:text-emerald-800',
    imageSrc: '/vehicle-showcase/truck-stage-1.png',
    tabLabel: 'Maintenance & Service',
  },
  {
    id: 2,
    badge: 'AI Service Advisor',
    badgeIcon: <Sparkles className="w-3.5 h-3.5 fill-current text-[#2335f2]" />,
    badgeColor: 'text-[#2335f2]',
    badgeBg: 'bg-blue-50 border-blue-200/80',
    title: 'Fleet intelligence built into the work',
    description:
      'Combine your maintenance history, operational data and own expertise to help your team understand issues, prioritize next steps and move routine work forward.',
    ctaText: 'Learn more',
    ctaColor: 'text-[#2335f2] hover:text-blue-800',
    imageSrc: '/vehicle-showcase/truck-stage-2.png',
    tabLabel: 'AI Service Advisor',
  },
  {
    id: 3,
    badge: 'FLEET ECOSYSTEM',
    badgeColor: 'text-emerald-700',
    badgeBg: 'bg-emerald-50 border-emerald-200/80',
    title: "Your fleet's new pit crew",
    description:
      'With nearly 15 years of fleet expertise, 200+ integrations and 130K+ repair shops, get the tools, telematics and support you need to run your fleet your way.',
    ctaText: 'Learn more',
    ctaColor: 'text-emerald-700 hover:text-emerald-800',
    imageSrc: '/vehicle-showcase/truck-stage-3.png',
    tabLabel: 'Fleet Ecosystem',
  },
];

export const VehicleShowcaseSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable <= 0) return;

      // Progress goes from 0 (top entering viewport) to 1 (scrolled through container)
      const currentScroll = -rect.top;
      const rawProgress = currentScroll / totalScrollable;
      const clamped = Math.max(0, Math.min(1, rawProgress));

      setScrollProgress(clamped);

      // Determine active stage based on thresholds
      if (clamped < 0.33) {
        setActiveStage(0);
      } else if (clamped < 0.67) {
        setActiveStage(1);
      } else {
        setActiveStage(2);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Jump smoothly to a specific stage
  const jumpToStage = (index: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const containerTop = rect.top + scrollTop;
    const totalScrollable = rect.height - window.innerHeight;

    const targetProgress = index === 0 ? 0.05 : index === 1 ? 0.5 : 0.95;
    const targetScrollY = containerTop + targetProgress * totalScrollable;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  };

  // Continuous micro-turn calculation based on scroll progress
  // Stage 1 (0 to 0.33): slight rotation from -6deg to 0deg
  // Stage 2 (0.33 to 0.66): facing forward, slight dynamic angle
  // Stage 3 (0.66 to 1.0): turning towards other side up to +6deg
  const rotationAngle = (scrollProgress - 0.5) * 12; // -6deg to +6deg continuous tilt

  // Opacities for smooth cross-fading
  const op1 = Math.max(0, Math.min(1, 1 - (scrollProgress - 0.15) / 0.25));
  const op2 =
    scrollProgress <= 0.5
      ? Math.max(0, Math.min(1, (scrollProgress - 0.15) / 0.25))
      : Math.max(0, Math.min(1, 1 - (scrollProgress - 0.55) / 0.25));
  const op3 = Math.max(0, Math.min(1, (scrollProgress - 0.55) / 0.25));

  const current = STAGES[activeStage];

  return (
    <section
      ref={containerRef}
      id="vehicle-showcase"
      className="relative w-full bg-white text-slate-900 select-none"
      style={{ height: '280vh' }}
    >
      {/* Sticky Viewport Stage */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between items-center overflow-hidden bg-white px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* =====================================================================
            1. TOP NAVIGATION / STAGE SELECTOR TABS
        ===================================================================== */}
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between z-20 pt-2 sm:pt-4">
          <div className="flex items-center gap-1.5 sm:gap-2.5 bg-slate-100/90 p-1 rounded-full border border-slate-200/80 shadow-xs mx-auto">
            {STAGES.map((s, idx) => {
              const isActive = activeStage === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => jumpToStage(idx)}
                  className={`px-3.5 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm scale-[1.02]'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      isActive ? 'bg-[#2335f2]' : 'bg-slate-300'
                    }`}
                  />
                  <span>{s.tabLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            2. CENTER: 3D TURNING CAR & FLOATING FEATURES DISPLAY
        ===================================================================== */}
        <div className="relative w-full max-w-5xl mx-auto flex-1 flex items-center justify-center my-2 sm:my-4">
          {/* Subtle Ambient Floor Shadow / Light */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-16 bg-slate-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* Container with dynamic 3D perspective tilt reacting smoothly to scroll */}
          <div
            className="relative w-full max-w-[920px] aspect-[1024/465] transition-transform duration-150 ease-out"
            style={{
              transform: `perspective(1000px) rotateY(${rotationAngle}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Stage 1: Sideways (facing left) */}
            <div
              className="absolute inset-0 transition-opacity duration-300 pointer-events-none flex items-center justify-center"
              style={{ opacity: op1 }}
            >
              <img
                src="/vehicle-showcase/truck-stage-1.png"
                alt="SERVIQ Maintenance & Repair Intelligence"
                className="w-full h-full object-contain drop-shadow-md select-none"
                draggable={false}
              />
            </div>

            {/* Stage 2: Turned forward to the front */}
            <div
              className="absolute inset-0 transition-opacity duration-300 pointer-events-none flex items-center justify-center"
              style={{ opacity: op2 }}
            >
              <img
                src="/vehicle-showcase/truck-stage-2.png"
                alt="SERVIQ AI Service Advisor"
                className="w-full h-full object-contain drop-shadow-md select-none"
                draggable={false}
              />
            </div>

            {/* Stage 3: Turned to the other side */}
            <div
              className="absolute inset-0 transition-opacity duration-300 pointer-events-none flex items-center justify-center"
              style={{ opacity: op3 }}
            >
              <img
                src="/vehicle-showcase/truck-stage-3.png"
                alt="SERVIQ Fleet Ecosystem"
                className="w-full h-full object-contain drop-shadow-md select-none"
                draggable={false}
              />
            </div>
          </div>

          {/* Quick Nav Arrows on sides for mobile/accessibility */}
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
            <button
              onClick={() => jumpToStage(Math.max(0, activeStage - 1))}
              disabled={activeStage === 0}
              className={`p-2 rounded-full bg-white/90 shadow-md border border-slate-200 text-slate-700 pointer-events-auto transition-all ${
                activeStage === 0 ? 'opacity-0 pointer-events-none' : 'hover:scale-110 active:scale-95'
              }`}
              aria-label="Previous Feature"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
            <button
              onClick={() => jumpToStage(Math.min(2, activeStage + 1))}
              disabled={activeStage === 2}
              className={`p-2 rounded-full bg-white/90 shadow-md border border-slate-200 text-slate-700 pointer-events-auto transition-all ${
                activeStage === 2 ? 'opacity-0 pointer-events-none' : 'hover:scale-110 active:scale-95'
              }`}
              aria-label="Next Feature"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =====================================================================
            3. BOTTOM: DYNAMIC FEATURE CONTENT
        ===================================================================== */}
        <div className="w-full max-w-3xl mx-auto text-center z-20 pb-4 sm:pb-6">
          {/* Eyebrow Category Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest border transition-all duration-300 mb-2.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${current.badgeBg} ${current.badgeColor}`}
            >
              {current.badgeIcon}
              {current.badge}
            </span>
          </div>

          {/* Feature Main Headline */}
          <h2
            key={current.title}
            className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 font-anek-latin tracking-tight leading-tight transition-all duration-300 animate-fadeIn"
            style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
          >
            {current.title}
          </h2>

          {/* Feature Description */}
          <p
            key={current.description}
            className="text-slate-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-2 sm:mt-3 leading-relaxed font-anek-latin transition-all duration-300 animate-fadeIn"
            style={{ fontFamily: "'Anek Latin', 'AnekLatin', sans-serif" }}
          >
            {current.description}
          </p>

          {/* Learn More Action Button */}
          <div className="mt-3.5 sm:mt-4 flex items-center justify-center">
            <a
              href="#register"
              className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-all group ${current.ctaColor}`}
            >
              <span>{current.ctaText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Scroll Progress Bar at the bottom of the section */}
          <div className="w-48 sm:w-64 h-1 bg-slate-100 rounded-full mx-auto mt-4 overflow-hidden">
            <div
              className="h-full bg-[#2335f2] rounded-full transition-all duration-100"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
        </div>

      </div>
    </section>
  );
};
