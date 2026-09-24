import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Truck,
  Wrench,
  AlertTriangle,
  UserCheck,
  Receipt,
  FileText,
  Bell,
  BarChart3,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Gauge,
  Calendar,
  Lock,
  Download,
  Clock,
  QrCode,
  Layers,
  ChevronDown,
} from 'lucide-react';

import { HelpFeedbackModal } from '../support/HelpFeedbackModal';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [headerTheme, setHeaderTheme] = useState<'transparent' | 'blue' | 'white'>('transparent');

  useEffect(() => {
    const handleScroll = () => {
      // First page / hero top: it should be like there is no header
      if (window.scrollY < 40) {
        setHeaderTheme('transparent');
        return;
      }

      // Check which section is passing underneath the fixed header (y ≈ 50)
      const sections = document.querySelectorAll('section, footer');
      let currentSectionBg: 'blue' | 'white' = 'blue';

      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        // If the section covers the header area (top <= 50 and bottom > 50)
        if (rect.top <= 50 && rect.bottom > 50) {
          if (sec.classList.contains('bg-white') || sec.getAttribute('data-bg') === 'white') {
            currentSectionBg = 'white';
          } else {
            currentSectionBg = 'blue';
          }
        }
      });

      setHeaderTheme(currentSectionBg);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'fleet_manager') return '/manager/dashboard';
    if (user.role === 'driver') return '/driver/home';
    return '/login';
  };

  return (
    <div className="min-h-screen bg-studio-blue text-white font-['Plus_Jakarta_Sans',sans-serif] selection:bg-white selection:text-[#393df0] overflow-x-hidden relative">

      {/* Ambient background glow orbs */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="fixed bottom-20 right-10 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* =========================================================================
          1. NAVIGATION — DYNAMIC GLASS HEADER
             - On first page: like there is no header (bg-transparent, no line, no blur)
             - On scroll over blue sections: blue glass, white logo, white name logo, white hamburger
             - On scroll over white sections: white glass, blue/white logo, black name logo, black hamburger
             - NO thin line at bottom
      ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full px-6 sm:px-12 transition-all duration-300 flex items-center justify-between border-none ${
          headerTheme === 'transparent'
            ? 'py-4 sm:py-5 bg-transparent backdrop-blur-none shadow-none'
            : headerTheme === 'blue'
            ? 'py-3.5 bg-[#1826d0]/80 backdrop-blur-xl shadow-lg shadow-blue-950/20'
            : 'py-3.5 bg-white/80 backdrop-blur-xl shadow-sm shadow-slate-900/5'
        }`}
      >
        {/* Left: Logo & Wordmark matching section background */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <img
            src={headerTheme === 'white' ? '/logo-blue.png' : '/logo-white.png'}
            alt="Serviq"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow"
          />
          <img
            src="/serviq-name-logo.png"
            alt="Serviq"
            className={`h-5 sm:h-6 md:h-7 w-auto object-contain transition-all group-hover:opacity-90 ${
              headerTheme === 'white' ? 'filter brightness-0' : 'drop-shadow-sm'
            }`}
          />
        </Link>

        {/* Right: Hamburger icon (White on blue/transparent, Black on white) */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="w-10 h-10 flex flex-col justify-center items-end gap-1.5 p-2 focus:outline-none cursor-pointer group"
          aria-label="Navigation Menu"
        >
          <span
            className={`w-6 h-[2px] rounded-full transition-all group-hover:w-7 ${
              headerTheme === 'white' ? 'bg-slate-900' : 'bg-white'
            }`}
          ></span>
          <span
            className={`w-6 h-[2px] rounded-full transition-all group-hover:w-7 ${
              headerTheme === 'white' ? 'bg-slate-900' : 'bg-white'
            }`}
          ></span>
        </button>
      </header>

      {/* =========================================================================
          FULL-PAGE DROP-DOWN MENU (MATCHING REFERENCE IMAGE)
          Slides smoothly down from the top on open, and slides back up on close
      ========================================================================= */}
      <div
        className={`fixed inset-0 z-[100] bg-studio-blue text-white flex flex-col overflow-y-auto transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileMenuOpen ? 'translate-y-0 pointer-events-auto' : '-translate-y-full pointer-events-none'
        }`}
      >
        {/* Ambient background glow orbs inside the menu */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[160px] pointer-events-none" />

        {/* Top Bar: Serviq Logo (White) + Rounded Close 'X' Button */}
        <div className="relative z-10 w-full px-6 sm:px-12 md:px-16 py-5 sm:py-6 flex items-center justify-between border-b border-white/10">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 sm:gap-3 group"
          >
            <img
              src="/logo-white.png"
              alt="Serviq"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow"
            />
            <img
              src="/serviq-name-logo.png"
              alt="Serviq"
              className="h-5 sm:h-6 md:h-7 w-auto object-contain drop-shadow-sm group-hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* Close 'X' button in rounded translucent square matching screenshot */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-10 h-10 sm:w-11 sm:h-11 bg-white/20 hover:bg-white/30 active:scale-95 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm"
            aria-label="Close Menu"
          >
            <X className="w-6 h-6 text-white stroke-[2.5]" />
          </button>
        </div>

        {/* Content Area: 2 Columns matching screenshot */}
        <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 py-10 md:py-16 flex flex-col md:flex-row justify-between items-start gap-12 md:gap-16">
          
          {/* Left Column: Reach out & Support + Action Buttons */}
          <div className="md:w-5/12 lg:w-4/12 flex flex-col justify-start pt-2 sm:pt-4">
            <p className="text-white text-base sm:text-lg">
              Reach out to us via{' '}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setHelpModalOpen(true);
                }}
                className="underline underline-offset-4 decoration-2 font-medium hover:text-white/80 transition-colors cursor-pointer text-left inline"
              >
                Help & Feedback
              </button>
            </p>
            <p className="text-white/80 text-xs sm:text-sm mt-3 leading-relaxed max-w-sm">
              Need assistance with your fleet or account? Connect with our dedicated support team in Chennai.
            </p>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {user ? (
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-6 py-3 bg-white text-[#2335f2] font-bold rounded-xl shadow-lg hover:bg-white/95 text-center transition-all"
                >
                  Open Console →
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl text-center transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-6 py-3 bg-white text-[#2335f2] font-bold rounded-xl shadow-lg hover:bg-white/95 text-center transition-all"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Large Bold Nav Links matching screenshot */}
          <div className="md:w-7/12 lg:w-8/12 flex flex-col space-y-1 sm:space-y-2 md:space-y-3">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-white/70 hover:text-white leading-[1.12] tracking-tight block transition-colors select-none"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-white/70 hover:text-white leading-[1.12] tracking-tight block transition-colors select-none"
            >
              About Us
            </a>
            <Link
              to="/download"
              onClick={() => setMobileMenuOpen(false)}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-white/70 hover:text-white leading-[1.12] tracking-tight block transition-colors select-none"
            >
              Download App
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setHelpModalOpen(true);
              }}
              className="text-left text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-white/70 hover:text-white leading-[1.12] tracking-tight block transition-colors select-none cursor-pointer"
            >
              Help & Feedback
            </button>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-white/70 hover:text-white leading-[1.12] tracking-tight block transition-colors select-none"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-white/70 hover:text-white leading-[1.12] tracking-tight block transition-colors select-none"
            >
              How It Works
            </a>
            <a
              href="#roles"
              onClick={() => setMobileMenuOpen(false)}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-white/70 hover:text-white leading-[1.12] tracking-tight block transition-colors select-none"
            >
              Fleet Solutions
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-white/70 hover:text-white leading-[1.12] tracking-tight block transition-colors select-none"
            >
              Contact Us
            </a>
          </div>

        </div>
      </div>

      {/* =========================================================================
          HERO SECTION — EXACT MATCH OF UPLOADED DESIGN (FULL VIEWPORT)
      ========================================================================= */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-studio-blue pt-20 sm:pt-24"
      >
        {/* Center Typography & QR Code */}
        <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center my-auto text-center px-4 py-8 animate-in fade-in zoom-in-95 duration-300">
          {/* Kicker: Smarter Fleet. Smarter Maintenance */}
          <p className="font-neue-haas-medium text-white/95 text-base sm:text-lg md:text-xl tracking-normal mb-1 sm:mb-2">
            Smarter Fleet. Smarter Maintenance
          </p>

          {/* Main Headline: Serviq (Anek Latin font) */}
          <h1 className="font-anek-latin font-bold text-white text-7xl sm:text-8xl md:text-[112px] lg:text-[132px] leading-none my-1 tracking-tight select-none drop-shadow-md">
            Serviq
          </h1>

          {/* Sub-headline in Neue Haas Medium */}
          <p className="font-neue-haas-medium text-white/90 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed mt-2 sm:mt-3 px-4">
            Everything your fleet needs to stay organized, maintained, and ready for the road.
          </p>

          {/* Translucent QR Pill Card */}
          <div className="mt-8 sm:mt-10 inline-flex items-center gap-4.5 px-6 py-3.5 rounded-2xl bg-white/20 hover:bg-white/25 backdrop-blur-xl border border-white/30 shadow-2xl shadow-blue-950/40 transition-all cursor-pointer group hover:scale-[1.02]">
            <div className="w-14 h-14 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-md group-hover:rotate-2 transition-transform">
              <QrCode className="w-full h-full text-[#2335f2]" />
            </div>
            <div className="text-left font-neue-haas-medium text-white leading-tight">
              <div className="text-sm sm:text-base font-medium tracking-wide">Download</div>
              <div className="text-sm sm:text-base font-medium tracking-wide">Now</div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3D ELEMENTS (Matching Reference Image: Spacing, Placement, Size & Soft Shadows)
        ========================================================================= */}

        {/* 1. 3D Gear (Top-Left / Mid-Left) - Moved a little bit down */}
        <div className="absolute -left-12 sm:-left-16 md:-left-20 lg:-left-24 top-[18%] sm:top-[19%] md:top-[20%] w-28 sm:w-36 md:w-44 lg:w-52 pointer-events-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] z-10 select-none">
          <img
            src="/gear.png"
            alt="3D Fleet Gear"
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>

        {/* 2. 3D Cube (Lower-Left Foreground) - Slightly bigger, touches the bottom of the screen */}
        <div className="absolute left-3 sm:left-6 md:left-10 lg:left-14 bottom-0 w-26 sm:w-32 md:w-38 lg:w-46 pointer-events-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] z-20 select-none">
          <img
            src="/cube.png"
            alt="3D Angled Cube"
            className="w-full h-auto object-contain object-bottom block"
            draggable={false}
          />
        </div>

        {/* 3. 3D Spanner / Wrench (Top-Right) - Moved slightly down */}
        <div className="absolute -right-8 sm:-right-12 md:-right-16 lg:-right-20 top-[13%] sm:top-[14%] md:top-[15%] w-32 sm:w-44 md:w-52 lg:w-64 pointer-events-none filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.14)] z-10 select-none">
          <img
            src="/spanner.png"
            alt="3D Spanner Wrench"
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>

        {/* 4. 3D Car with headlights (Bottom-Right) - Sits on bottom of screen with ground shadow */}
        <div className="absolute -right-2 sm:right-2 md:right-6 lg:right-10 bottom-0 w-44 sm:w-60 md:w-72 lg:w-[350px] pointer-events-none z-20 select-none">
          {/* Ground Contact Shadow Under the Car */}
          <div className="absolute -bottom-1.5 left-[4%] right-[2%] h-4 sm:h-5 md:h-6 bg-[#0c1445]/60 rounded-[100%] blur-[8px] pointer-events-none" />
          <div className="absolute -bottom-1 left-[10%] right-[8%] h-3 sm:h-4 bg-black/40 rounded-[100%] blur-[5px] pointer-events-none" />

          {/* Soft Headlight Glow */}
          <div className="absolute left-[8%] bottom-[32%] w-14 h-10 bg-white/15 rounded-full blur-lg pointer-events-none" />
          <div className="absolute left-[30%] bottom-[32%] w-18 h-12 bg-white/15 rounded-full blur-lg pointer-events-none" />
          <img
            src="/car.png"
            alt="3D Fleet Vehicle"
            className="w-full h-auto object-contain object-bottom block filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)]"
            draggable={false}
          />
        </div>
      </section>

      {/* =========================================================================
          PAGE 2 (EVEN): ABOUT US — COMPREHENSIVE OVERVIEW OF SERVIQ APP
      ========================================================================= */}
      <section id="about" className="py-24 sm:py-32 bg-white text-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Kicker */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2335f2] animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2335f2]">
              About SERVIQ By Orcescale
            </span>
          </div>

          {/* Headline & Mission Statement */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
            <div className="lg:col-span-7">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 font-['Outfit',sans-serif] tracking-tight leading-[1.08]">
                The Operating System for Modern Fleet Maintenance.
              </h2>
            </div>
            <div className="lg:col-span-5 space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                Commercial vehicles on highway corridors shouldn't be managed with paper notebooks and guess-work. <span className="font-semibold text-slate-900">SERVIQ</span> transforms fleet maintenance into an automated, synchronized digital operation.
              </p>
              <p>
                From single-vehicle owner-operators to enterprise logistics fleets across India, SERVIQ connects drivers on the road with fleet managers in the control room and verified service workshops in real time.
              </p>
            </div>
          </div>

          {/* Three Feature Pillars: What the App Does */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#2335f2] flex items-center justify-center font-bold">
                <Gauge className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                Dual-Trigger Service Engine
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tracks both daily odometer increments and calendar intervals. Serviq automatically warns managers and drivers before critical oil, brake pad, or tire wear leads to unexpected engine failure.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#2335f2] flex items-center justify-center font-bold">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                Highway Driver Companion
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                When breakdowns happen, drivers log photo reports in under 60 seconds with GPS geotagging. Offline access to vehicle RC, national permits, and digital insurance cards keeps drivers compliant.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#2335f2] flex items-center justify-center font-bold">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                Workshop & TCO Control
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every rupee spent on spare parts, mechanics, and lubricants is tracked. Transparent digital job cards prevent workshop billing fraud and reduce lifetime fleet maintenance costs by up to 42%.
              </p>
            </div>
          </div>

          {/* 4 Square Capability Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-8 flex flex-col justify-between square-card-white group">
              <div className="w-12 h-12 bg-studio-blue/10 text-[#393df0] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#393df0] transition-colors">
                  Fleet Management
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Know where your vehicles stand. Complete status and assignment oversight.
                </p>
              </div>
            </div>

            <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-8 flex flex-col justify-between square-card-white group">
              <div className="w-12 h-12 bg-studio-blue/10 text-[#393df0] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#393df0] transition-colors">
                  Maintenance Tracking
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Never lose track of scheduled service. Calendar and odometer dual-triggers.
                </p>
              </div>
            </div>

            <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-8 flex flex-col justify-between square-card-white group">
              <div className="w-12 h-12 bg-studio-blue/10 text-[#393df0] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#393df0] transition-colors">
                  Repair Management
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Track issues from report to resolution. Real-time roadside breakdown logs.
                </p>
              </div>
            </div>

            <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-8 flex flex-col justify-between square-card-white group">
              <div className="w-12 h-12 bg-studio-blue/10 text-[#393df0] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#393df0] transition-colors">
                  Driver Management
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Keep driver and vehicle information organized. License compliance alerts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VFX TRANSITION 2: Flowing Wave Curve with Shimmer Line (White to Blue)
      ========================================================================= */}
      <div className="relative w-full overflow-hidden leading-none bg-white">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 sm:h-24 text-[#393df0] fill-current animate-wave-flow">
          <path d="M0,0 C300,90 800,90 1200,0 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      {/* =========================================================================
          PAGE 3 (ODD): PROBLEM SECTION — BLUE BACKGROUND
      ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left bg-studio-blue relative">
        <div className="max-w-3xl mb-14">
          <h2 className="text-3xl sm:text-5xl font-black text-white font-['Outfit',sans-serif] leading-tight">
            Fleet management shouldn't be this complicated.
          </h2>
          <p className="text-sm sm:text-base text-white/80 mt-4 leading-relaxed">
            Managing vehicles through spreadsheets, paper records, phone calls, and scattered messages makes it difficult to know what needs attention.
          </p>
        </div>

        {/* Square Cards with Hover Glow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <div className="aspect-square bg-white/10 border-2 border-white/20 p-6 flex flex-col justify-between square-card-blue">
            <Clock className="w-8 h-8 text-white" />
            <div>
              <h3 className="font-bold text-base text-white font-['Outfit',sans-serif]">Missed maintenance schedules</h3>
              <p className="text-xs text-white/70 mt-2 leading-relaxed">
                Important servicing can easily be overlooked.
              </p>
            </div>
          </div>

          <div className="aspect-square bg-white/10 border-2 border-white/20 p-6 flex flex-col justify-between square-card-blue">
            <FileText className="w-8 h-8 text-white" />
            <div>
              <h3 className="font-bold text-base text-white font-['Outfit',sans-serif]">Scattered vehicle records</h3>
              <p className="text-xs text-white/70 mt-2 leading-relaxed">
                Vehicle information is spread across multiple systems.
              </p>
            </div>
          </div>

          <div className="aspect-square bg-white/10 border-2 border-white/20 p-6 flex flex-col justify-between square-card-blue">
            <AlertTriangle className="w-8 h-8 text-white" />
            <div>
              <h3 className="font-bold text-base text-white font-['Outfit',sans-serif]">Untracked repairs</h3>
              <p className="text-xs text-white/70 mt-2 leading-relaxed">
                Issues can remain unresolved without proper tracking.
              </p>
            </div>
          </div>

          <div className="aspect-square bg-white/10 border-2 border-white/20 p-6 flex flex-col justify-between square-card-blue">
            <Receipt className="w-8 h-8 text-white" />
            <div>
              <h3 className="font-bold text-base text-white font-['Outfit',sans-serif]">Rising maintenance costs</h3>
              <p className="text-xs text-white/70 mt-2 leading-relaxed">
                Without centralized records, understanding expenses becomes difficult.
              </p>
            </div>
          </div>

          <div className="aspect-square bg-white/10 border-2 border-white/20 p-6 flex flex-col justify-between square-card-blue">
            <ShieldCheck className="w-8 h-8 text-white" />
            <div>
              <h3 className="font-bold text-base text-white font-['Outfit',sans-serif]">Expired documents</h3>
              <p className="text-xs text-white/70 mt-2 leading-relaxed">
                Important vehicle and driver documents can be missed.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-left">
          <p className="text-lg font-extrabold text-white font-['Outfit',sans-serif]">
            SERVIQ brings everything together.
          </p>
        </div>
      </section>

      {/* =========================================================================
          VFX TRANSITION 3: Stepped Geometric Tooth Divider (Blue to White)
      ========================================================================= */}
      <div className="relative w-full overflow-hidden leading-none bg-studio-blue">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="relative block w-full h-12 sm:h-16 text-white fill-current">
          <path d="M0,0 L480,0 L520,60 L680,60 L720,0 L1200,0 L1200,60 L0,60 Z"></path>
        </svg>
      </div>

      {/* =========================================================================
          PAGE 4 (EVEN): FEATURES SECTION — WHITE BACKGROUND
      ========================================================================= */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left bg-white text-slate-900">
        <div className="max-w-3xl mb-14">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Everything you need to manage your fleet.
          </h2>
        </div>

        {/* 8 Square Cards in White Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-7 flex flex-col justify-between square-card-white group">
            <div className="text-3xl group-hover:scale-110 transition-transform">🚗</div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#393df0] transition-colors">
                Vehicle Management
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Maintain complete vehicle profiles, assignments, status, odometer readings, and service history.
              </p>
            </div>
          </div>

          <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-7 flex flex-col justify-between square-card-white group">
            <div className="text-3xl group-hover:scale-110 transition-transform">👨✈️</div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#393df0] transition-colors">
                Driver Management
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Manage driver profiles, assignments, documents, and individual details from one place.
              </p>
            </div>
          </div>

          <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-7 flex flex-col justify-between square-card-white group">
            <div className="text-3xl group-hover:scale-110 transition-transform">🔧</div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#393df0] transition-colors">
                Maintenance Management
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Create maintenance schedules, track services, and stay ahead of upcoming maintenance.
              </p>
            </div>
          </div>

          <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-7 flex flex-col justify-between square-card-white group">
            <div className="text-3xl group-hover:scale-110 transition-transform">🛠️</div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#393df0] transition-colors">
                Repair Tracking
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Report vehicle issues and follow repairs from the initial report to completion.
              </p>
            </div>
          </div>

          <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-7 flex flex-col justify-between square-card-white group">
            <div className="text-3xl group-hover:scale-110 transition-transform">💰</div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#393df0] transition-colors">
                Expense Management
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Record and monitor maintenance and repair expenses for better cost visibility.
              </p>
            </div>
          </div>

          <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-7 flex flex-col justify-between square-card-white group">
            <div className="text-3xl group-hover:scale-110 transition-transform">📄</div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#393df0] transition-colors">
                Document Management
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Keep vehicle and driver documents organized and monitor expiry dates.
              </p>
            </div>
          </div>

          <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-7 flex flex-col justify-between square-card-white group">
            <div className="text-3xl group-hover:scale-110 transition-transform">🔔</div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#393df0] transition-colors">
                Notifications & Reminders
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Stay informed about maintenance, repairs, documents, and important fleet activities.
              </p>
            </div>
          </div>

          <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-7 flex flex-col justify-between square-card-white group">
            <div className="text-3xl group-hover:scale-110 transition-transform">📊</div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#393df0] transition-colors">
                Reports & Analytics
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Get a clearer view of fleet activity, maintenance, expenses, and vehicle performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VFX TRANSITION 4: Asymmetric Triangle Peak with Drop Shadow (White to Blue)
      ========================================================================= */}
      <div className="relative w-full overflow-hidden leading-none bg-white">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 sm:h-24 text-[#393df0] fill-current">
          <path d="M0,0 L600,120 L1200,0 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      {/* =========================================================================
          PAGE 5 (ODD): DASHBOARD SECTION — BLUE BACKGROUND
      ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left bg-studio-blue">
        <div className="bg-white/10 border-2 border-white/20 p-8 sm:p-14 flex flex-col lg:flex-row items-center justify-between gap-12 square-card-blue">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-5xl font-black text-white font-['Outfit',sans-serif] leading-tight">
              Your entire fleet at a glance.
            </h2>
            <p className="text-sm sm:text-base text-white/80 mt-4 leading-relaxed">
              Give your team a centralized view of everything happening across your fleet.
            </p>

            {/* Square Highlight Modules */}
            <div className="grid grid-cols-2 gap-3 mt-8 text-xs font-semibold text-white">
              <div className="p-3 bg-white/10 border border-white/15 flex items-center gap-2 hover:bg-white/20 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Total vehicles</span>
              </div>
              <div className="p-3 bg-white/10 border border-white/15 flex items-center gap-2 hover:bg-white/20 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Active drivers</span>
              </div>
              <div className="p-3 bg-white/10 border border-white/15 flex items-center gap-2 hover:bg-white/20 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Upcoming maintenance</span>
              </div>
              <div className="p-3 bg-white/10 border border-white/15 flex items-center gap-2 hover:bg-white/20 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Vehicles under repair</span>
              </div>
              <div className="p-3 bg-white/10 border border-white/15 flex items-center gap-2 hover:bg-white/20 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Maintenance expenses</span>
              </div>
              <div className="p-3 bg-white/10 border border-white/15 flex items-center gap-2 hover:bg-white/20 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Vehicle availability</span>
              </div>
              <div className="p-3 bg-white/10 border border-white/15 flex items-center gap-2 hover:bg-white/20 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Expiring documents</span>
              </div>
              <div className="p-3 bg-white/10 border border-white/15 flex items-center gap-2 hover:bg-white/20 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>Recent activities</span>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to={user ? getDashboardLink() : '/register'}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#393df0] font-bold text-sm shadow-xl hover:bg-white/90 transition-all hover:scale-105"
              >
                <span>Manage Your Fleet →</span>
              </Link>
            </div>
          </div>

          {/* Square Live Status Board with pulsing telemetry dot */}
          <div className="w-full lg:w-1/2 aspect-square max-w-md bg-white/10 border-2 border-white/25 p-8 flex flex-col justify-between font-mono text-xs shadow-2xl backdrop-blur-sm">
            <div className="flex justify-between items-center pb-4 border-b border-white/20 text-white font-sans font-bold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-sm">Attention Required</span>
              </div>
              <span className="text-white/70">Live Status</span>
            </div>
            <div className="space-y-3 my-auto">
              <div className="p-4 bg-white/10 border border-white/15 flex justify-between items-center text-white hover:bg-white/20 transition-colors">
                <span className="font-bold text-sm">TN 01 AB 1234</span>
                <span className="text-white/80">Maintenance Due</span>
              </div>
              <div className="p-4 bg-white/10 border border-white/15 flex justify-between items-center text-white hover:bg-white/20 transition-colors">
                <span className="font-bold text-sm">TN 02 CD 4567</span>
                <span className="text-white/80">Repair In Progress</span>
              </div>
              <div className="p-4 bg-white/10 border border-white/15 flex justify-between items-center text-white hover:bg-white/20 transition-colors">
                <span className="font-bold text-sm">TN 03 EF 7890</span>
                <span className="text-white/80">Document Expiring</span>
              </div>
            </div>
            <div className="text-[11px] text-white/60 font-sans text-center">
              Direct connection to fleet telemetry & database
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VFX TRANSITION 5: Sharp Inverted Chevron (Blue to White)
      ========================================================================= */}
      <div className="relative w-full overflow-hidden leading-none bg-studio-blue">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="relative block w-full h-12 sm:h-16 text-white fill-current">
          <path d="M0,0 L600,60 L1200,0 L1200,60 L0,60 Z"></path>
        </svg>
      </div>

      {/* =========================================================================
          PAGE 6 (EVEN): HOW IT WORKS — WHITE BACKGROUND
      ========================================================================= */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left bg-white text-slate-900">
        <div className="max-w-3xl mb-14">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Get your fleet up and running in a few simple steps.
          </h2>
        </div>

        {/* 5 Square Steps with Step Number VFX */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-6 flex flex-col justify-between square-card-white group">
            <span className="font-mono font-black text-3xl text-[#393df0] group-hover:scale-110 transition-transform">01</span>
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#393df0] transition-colors">
                Register Your Company
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Create your SERVIQ organization and set up your administrator account.
              </p>
            </div>
          </div>

          <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-6 flex flex-col justify-between square-card-white group">
            <span className="font-mono font-black text-3xl text-[#393df0] group-hover:scale-110 transition-transform">02</span>
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#393df0] transition-colors">
                Build Your Fleet
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Add vehicles, fleet managers, and drivers to your organization.
              </p>
            </div>
          </div>

          <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-6 flex flex-col justify-between square-card-white group">
            <span className="font-mono font-black text-3xl text-[#393df0] group-hover:scale-110 transition-transform">03</span>
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#393df0] transition-colors">
                Assign & Manage
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Assign vehicles to drivers and manage day-to-day fleet operations.
              </p>
            </div>
          </div>

          <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-6 flex flex-col justify-between square-card-white group">
            <span className="font-mono font-black text-3xl text-[#393df0] group-hover:scale-110 transition-transform">04</span>
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#393df0] transition-colors">
                Track Everything
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Monitor maintenance, repairs, expenses, documents, and vehicle health from one platform.
              </p>
            </div>
          </div>

          <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-6 flex flex-col justify-between square-card-white group">
            <span className="font-mono font-black text-3xl text-[#393df0] group-hover:scale-110 transition-transform">05</span>
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#393df0] transition-colors">
                Stay Ahead
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Receive reminders and notifications so your team can act before small issues become bigger problems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VFX TRANSITION 6: Convex Geometric Arch (White to Blue)
      ========================================================================= */}
      <div className="relative w-full overflow-hidden leading-none bg-white">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 sm:h-24 text-[#393df0] fill-current">
          <path d="M0,0 Q600,120 1200,0 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      {/* =========================================================================
          PAGE 7 (ODD): BUILT FOR EVERY ROLE — BLUE BACKGROUND
      ========================================================================= */}
      <section id="roles" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left bg-studio-blue">
        <div className="max-w-3xl mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">One platform. Different experiences.</p>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-['Outfit',sans-serif] mt-1">
            Built for Every Role
          </h2>
        </div>

        {/* 3 Square Sturdy Role Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 border-2 border-white/20 p-8 sm:p-10 flex flex-col justify-between square-card-blue">
            <div>
              <h3 className="text-2xl font-black text-white font-['Outfit',sans-serif]">Organization Admin</h3>
              <p className="text-xs text-white/80 mt-1 font-semibold">Complete control over your organization.</p>
              <ul className="mt-6 space-y-2.5 text-xs text-white/90">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Manage company information</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Add and manage fleet managers</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Manage drivers</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Manage vehicles</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Monitor maintenance and repairs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Track expenses</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> View reports</li>
              </ul>
            </div>
            <Link
              to="/login"
              className="mt-8 block text-center py-3 px-4 bg-white text-[#393df0] font-bold text-xs shadow-md hover:bg-white/90 transition-all hover:scale-105"
            >
              Manage Organization →
            </Link>
          </div>

          <div className="bg-white/10 border-2 border-white/20 p-8 sm:p-10 flex flex-col justify-between square-card-blue">
            <div>
              <h3 className="text-2xl font-black text-white font-['Outfit',sans-serif]">Fleet & Maintenance Manager</h3>
              <p className="text-xs text-white/80 mt-1 font-semibold">Everything you need for daily fleet operations.</p>
              <ul className="mt-6 space-y-2.5 text-xs text-white/90">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Manage vehicles</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Manage drivers</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Assign vehicles</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Schedule maintenance</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Track repairs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Monitor vehicle health</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Manage service records</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> View fleet reports</li>
              </ul>
            </div>
            <Link
              to="/login"
              className="mt-8 block text-center py-3 px-4 bg-white text-[#393df0] font-bold text-xs shadow-md hover:bg-white/90 transition-all hover:scale-105"
            >
              Manage Fleet →
            </Link>
          </div>

          <div className="bg-white/10 border-2 border-white/20 p-8 sm:p-10 flex flex-col justify-between square-card-blue">
            <div>
              <h3 className="text-2xl font-black text-white font-['Outfit',sans-serif]">Driver</h3>
              <p className="text-xs text-white/80 mt-1 font-semibold">Your vehicle information, right at your fingertips.</p>
              <ul className="mt-6 space-y-2.5 text-xs text-white/90">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> View assigned vehicle</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Check vehicle health</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Update odometer</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> View maintenance</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Report vehicle issues</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Track repair status</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Access documents</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Receive notifications</li>
              </ul>
            </div>
            <Link
              to="/driver/home"
              className="mt-8 block text-center py-3 px-4 bg-white text-[#393df0] font-bold text-xs shadow-md hover:bg-white/90 transition-all hover:scale-105"
            >
              Download Driver App →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VFX TRANSITION 7: Reversed Diagonal Cut (Blue to White)
      ========================================================================= */}
      <div className="relative w-full overflow-hidden leading-none bg-studio-blue">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 sm:h-24 text-white fill-current">
          <path d="M0 0L1200 120V120H0V0Z"></path>
        </svg>
      </div>

      {/* =========================================================================
          PAGE 8 (EVEN): DRIVER APP SECTION — WHITE BACKGROUND
      ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left bg-white text-slate-900">
        <div className="bg-slate-50 border-2 border-slate-200 p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-12 square-card-white">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-['Outfit',sans-serif]">
              Your fleet doesn't stop at the office.
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Drivers can access SERVIQ through the mobile app to stay connected with their assigned vehicle.
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
              <span className="bg-studio-blue/10 text-[#393df0] px-3 py-1.5">Check your vehicle.</span>
              <span className="bg-studio-blue/10 text-[#393df0] px-3 py-1.5">Report an issue.</span>
              <span className="bg-studio-blue/10 text-[#393df0] px-3 py-1.5">Track a repair.</span>
              <span className="bg-studio-blue/10 text-[#393df0] px-3 py-1.5">Stay updated.</span>
            </div>

            {/* Square Feature Checkboxes */}
            <div className="mt-6 text-xs text-slate-700 grid grid-cols-2 gap-2.5">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#393df0]" /> Assigned vehicle</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#393df0]" /> Vehicle health</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#393df0]" /> Odometer</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#393df0]" /> Maintenance schedule</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#393df0]" /> Issue reporting</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#393df0]" /> Photo-based issue reporting</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#393df0]" /> Repair status</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#393df0]" /> Notifications</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#393df0]" /> Documents</div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/driver/home"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-studio-blue text-white font-bold text-xs shadow-xl hover:bg-[#2d27c7] transition-all hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Download Driver App</span>
              </Link>
              <span className="text-xs text-slate-500 font-medium">Available for Android</span>
            </div>
          </div>

          {/* Square Device Representation */}
          <div className="w-64 aspect-square bg-studio-blue p-6 text-white flex flex-col justify-between shadow-2xl animate-float-slow">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-white/20">
              <span className="font-bold">DRIVER APP</span>
              <img src="/logo-white.png" alt="" className="w-5 h-5 object-contain" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-white/70 uppercase font-bold">Assigned Asset</span>
              <div className="font-mono font-bold text-white text-lg">TN 01 AB 1234</div>
              <div className="text-xs text-white/80">Odometer: 45,280 km</div>
            </div>
            <div className="p-3 bg-white text-[#393df0] font-bold text-center text-xs">
              Roadside Breakdown Reported
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VFX TRANSITION 8: Multi-Layer Wave Flow (White to Blue)
      ========================================================================= */}
      <div className="relative w-full overflow-hidden leading-none bg-white">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 sm:h-24 text-[#393df0] fill-current animate-wave-flow">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C69.24,40 148.67,69.5 229,74.5A490,490,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* =========================================================================
          PAGE 9 (ODD): MAINTENANCE SECTION — BLUE BACKGROUND
      ========================================================================= */}
      <section id="maintenance-overview" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left bg-studio-blue">
        <div className="max-w-3xl mb-14">
          <h2 className="text-3xl sm:text-5xl font-black text-white font-['Outfit',sans-serif]">
            Stay ahead of maintenance.
          </h2>
          <p className="text-sm sm:text-base text-white/80 mt-3 leading-relaxed">
            Keep every vehicle's service history and upcoming maintenance in one place.
          </p>
        </div>

        {/* 6 Square Tracking Cards with Hover Effects */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          <div className="aspect-square bg-white/10 border-2 border-white/20 p-5 flex flex-col justify-between square-card-blue">
            <Calendar className="w-7 h-7 text-white" />
            <h4 className="font-bold text-xs sm:text-sm text-white">Scheduled services</h4>
          </div>
          <div className="aspect-square bg-white/10 border-2 border-white/20 p-5 flex flex-col justify-between square-card-blue">
            <Clock className="w-7 h-7 text-white" />
            <h4 className="font-bold text-xs sm:text-sm text-white">Service history</h4>
          </div>
          <div className="aspect-square bg-white/10 border-2 border-white/20 p-5 flex flex-col justify-between square-card-blue">
            <CheckCircle2 className="w-7 h-7 text-white" />
            <h4 className="font-bold text-xs sm:text-sm text-white">Maintenance status</h4>
          </div>
          <div className="aspect-square bg-white/10 border-2 border-white/20 p-5 flex flex-col justify-between square-card-blue">
            <Gauge className="w-7 h-7 text-white" />
            <h4 className="font-bold text-xs sm:text-sm text-white">Odometer readings</h4>
          </div>
          <div className="aspect-square bg-white/10 border-2 border-white/20 p-5 flex flex-col justify-between square-card-blue">
            <Wrench className="w-7 h-7 text-white" />
            <h4 className="font-bold text-xs sm:text-sm text-white">Service centers</h4>
          </div>
          <div className="aspect-square bg-white/10 border-2 border-white/20 p-5 flex flex-col justify-between square-card-blue">
            <Receipt className="w-7 h-7 text-white" />
            <h4 className="font-bold text-xs sm:text-sm text-white">Maintenance costs</h4>
          </div>
        </div>

        <div className="mt-10 p-6 bg-white/10 border-2 border-white/20 text-center text-sm font-bold text-white">
          Result: Fewer missed services. Better records. Less unexpected downtime.
        </div>
      </section>

      {/* =========================================================================
          VFX TRANSITION: Wave Flow (Blue to White)
      ========================================================================= */}
      <div className="relative w-full overflow-hidden leading-none bg-studio-blue">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 sm:h-24 text-white fill-current animate-wave-flow">
          <path d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      {/* =========================================================================
          PAGE 14 (EVEN): FOOTER — WHITE BACKGROUND (Matching Images 2 & 3)
      ========================================================================= */}
      <footer id="contact" className="bg-white text-slate-800 border-t-2 border-slate-100 pt-20 pb-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-left">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Logo and Tagline matching Image 2 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-12 border-b border-slate-100 gap-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo-blue.png"
                alt="SERVIQ Logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-slate-900 font-['Outfit',sans-serif] block leading-none">
                  serviq.
                </span>
                <span className="text-[11px] text-slate-500 font-semibold tracking-wider block mt-0.5">
                  by Fleet Innovations
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-500 max-w-sm sm:text-right font-medium">
              Simplify Fleet Maintenance. Reduce Downtime. Keep Vehicles Ready.
            </div>
          </div>

          {/* 4-Column Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-14 border-b border-slate-100 text-xs">
            {/* Col 1: Company */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 font-['Outfit',sans-serif]">Company</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#about" className="hover:text-[#393df0] transition-colors">About us</a></li>
                <li><a href="#about" className="hover:text-[#393df0] transition-colors">Enterprise FAQ</a></li>
              </ul>
            </div>

            {/* Col 2: Legal & Compliance */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 font-['Outfit',sans-serif]">Legal & Compliance</h4>
              <ul className="space-y-2 text-slate-600">
                <li><Link to="/terms-of-use" className="hover:text-[#393df0] transition-colors">Terms of use</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-[#393df0] transition-colors">Privacy Policy</Link></li>
                <li><Link to="/grievance-policy" className="hover:text-[#393df0] transition-colors">Grievance Policy</Link></li>
                <li><Link to="/merchant-terms" className="hover:text-[#393df0] transition-colors">Merchant Terms</Link></li>
                <li><Link to="/data-protection-standards" className="hover:text-[#393df0] transition-colors">Data Protection Standards</Link></li>
              </ul>
            </div>

            {/* Col 3: Download App */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 font-['Outfit',sans-serif]">Download App</h4>
              <ul className="space-y-2 text-slate-600">
                <li><Link to="/download" className="hover:text-[#393df0] transition-colors">Download App</Link></li>
              </ul>
            </div>

            {/* Col 4: Support */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 font-['Outfit',sans-serif]">Support</h4>
              <p className="text-slate-700 font-medium leading-relaxed">
                Get Answers and Assistance Right Where You Need It
              </p>
              <ol className="space-y-2 text-slate-600 leading-relaxed list-decimal list-inside">
                <li>Click the menu</li>
                <li>
                  Go to the{' '}
                  <button
                    onClick={() => setHelpModalOpen(true)}
                    className="font-semibold text-slate-800 underline hover:text-[#2335f2] cursor-pointer inline"
                  >
                    Help & Feedback
                  </button>{' '}
                  option.
                </li>
                <li>Select the <span className="font-semibold text-slate-800">relevant category</span> matching your issue to start a live chat instantly.</li>
              </ol>
            </div>
          </div>

          {/* Bottom Copyright & Address Row */}
          <div className="py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-slate-500">
            <div>
              Copyright © 2026 SERVIQ . All rights reserved.
            </div>

            <div className="md:text-right space-y-0.5 leading-relaxed text-xs text-slate-500">
              <div className="font-semibold text-slate-700">SERVIQ By Orcescale</div>
              <div>Location - Chennai, Tamil Nadu, India.</div>
            </div>
          </div>

          {/* Huge Faint Watermark Text at Bottom */}
          <div className="pt-6 text-center select-none pointer-events-none opacity-40">
            <span className="font-black text-6xl sm:text-9xl lg:text-[140px] text-slate-200 tracking-tight leading-none block font-['Outfit',sans-serif]">
              Let's Begin Serviq
            </span>
          </div>
        </div>
      </footer>

      {/* Support / Help & Feedback Modal */}
      <HelpFeedbackModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
    </div>
  );
};

export default LandingPage;
