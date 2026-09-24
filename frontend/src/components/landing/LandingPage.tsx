import React, { useState } from 'react';
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

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'fleet_manager') return '/manager/dashboard';
    if (user.role === 'driver') return '/driver/home';
    return '/login';
  };

  return (
    <div className="min-h-screen bg-[#2435e5] text-white font-['Plus_Jakarta_Sans',sans-serif] selection:bg-white selection:text-[#2435e5] overflow-x-hidden relative">

      {/* =========================================================================
          PAGE 1: 3D HERO STAGE (INSPIRED BY UPLOADED ARTWORK: GEAR, SPANNER, CAR, CUBE)
      ========================================================================= */}
      <section id="hero" className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#2435e5]">
        
        {/* Full-bleed 3D Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <img
            src="/hero-bg.jpg"
            alt="SERVIQ 3D Fleet Management Scene"
            className="w-full h-full object-cover object-center filter saturate-[1.04] contrast-[1.02]"
          />
          {/* Subtle Ambient Radial Depth Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#2435e5]/40 pointer-events-none" />
        </div>

        {/* TOP BAR: Clean Minimalist Brand on Left, 3-Bar Hamburger Menu on Right */}
        <header className="relative z-30 w-full px-6 sm:px-10 lg:px-14 pt-6 sm:pt-8 flex items-center justify-between">
          {/* Brand Logo & Wordmark matching uploaded design */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white flex items-center justify-center p-2 shadow-xl group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <rect x="3" y="6" width="26" height="20" rx="4" fill="#2435e5"/>
                <path d="M12 6H8C6.34315 6 5 7.34315 5 9V13H15V6H12Z" fill="#1825b5"/>
                <circle cx="16" cy="16" r="3.5" fill="white"/>
                <path d="M16 10V12M16 20V22M10 16H12M20 16H22M11.8 11.8L13.2 13.2M18.8 18.8L20.2 20.2M11.8 20.2L13.2 18.8M18.8 13.2L20.2 11.8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-white font-['Outfit',sans-serif]">
              Serviq
            </span>
          </Link>

          {/* Right Hamburger Icon matching reference */}
          <div className="flex items-center gap-3">
            {user && (
              <Link
                to={getDashboardLink()}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 backdrop-blur-md text-white text-xs font-bold transition-all"
              >
                <span>Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 sm:p-3 rounded-2xl bg-white/10 hover:bg-white/25 border border-white/20 backdrop-blur-md text-white transition-all hover:scale-105 active:scale-95 shadow-xl group"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5] group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </header>

        {/* INTERACTIVE 3D OBJECT HOTSPOTS (Gear on Left, Spanner on Right, Car on Bottom-Right) */}
        
        {/* 1. 3D Gear Hotspot (Left) */}
        <div className="hidden lg:block absolute left-[2%] top-[22%] z-20">
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setActiveHotspot('gear')}
            onMouseLeave={() => setActiveHotspot(null)}
          >
            <div className="w-44 h-44 rounded-full border border-white/0 hover:border-white/40 hover:bg-white/10 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center">
              <span className={`w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_15px_#ffffff] transition-opacity duration-300 ${activeHotspot === 'gear' ? 'opacity-100 scale-125' : 'opacity-70 animate-ping'}`} />
            </div>

            {/* Floating Glass Tooltip */}
            <div className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 w-72 p-4 rounded-2xl bg-[#0d1633]/90 border border-white/25 backdrop-blur-xl shadow-2xl transition-all duration-300 pointer-events-none ${activeHotspot === 'gear' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'}`}>
              <div className="flex items-center gap-2 text-xs font-bold text-sky-300 uppercase tracking-wider">
                <Wrench className="w-4 h-4" />
                Preventive Maintenance
              </div>
              <p className="text-xs text-white/90 mt-1 font-medium leading-relaxed">
                Automated service schedules with calendar and odometer dual-triggers.
              </p>
            </div>
          </div>
        </div>

        {/* 2. 3D Spanner Hotspot (Right) */}
        <div className="hidden lg:block absolute right-[2%] top-[18%] z-20">
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setActiveHotspot('spanner')}
            onMouseLeave={() => setActiveHotspot(null)}
          >
            <div className="w-48 h-48 rounded-full border border-white/0 hover:border-white/40 hover:bg-white/10 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center">
              <span className={`w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_15px_#ffffff] transition-opacity duration-300 ${activeHotspot === 'spanner' ? 'opacity-100 scale-125' : 'opacity-70 animate-ping'}`} style={{ animationDelay: '1s' }} />
            </div>

            {/* Floating Glass Tooltip */}
            <div className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 w-72 p-4 rounded-2xl bg-[#0d1633]/90 border border-white/25 backdrop-blur-xl shadow-2xl transition-all duration-300 pointer-events-none ${activeHotspot === 'spanner' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3'}`}>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                Diagnostics & Repairs
              </div>
              <p className="text-xs text-white/90 mt-1 font-medium leading-relaxed">
                Roadside breakdown logs, mechanic work orders, and parts expense tracking.
              </p>
            </div>
          </div>
        </div>

        {/* 3. 3D Car Hotspot & Headlights Glow (Bottom-Right) */}
        <div className="hidden md:block absolute right-[6%] bottom-[4%] z-20">
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setActiveHotspot('car')}
            onMouseLeave={() => setActiveHotspot(null)}
          >
            {/* Glowing animated headlight beams */}
            <div className="absolute -left-20 bottom-8 w-40 h-20 bg-gradient-to-l from-white/35 via-sky-200/20 to-transparent blur-lg rounded-full pointer-events-none animate-pulse-glow" />

            <div className="w-80 h-44 rounded-3xl border border-white/0 hover:border-white/30 hover:bg-white/5 transition-all duration-300 flex items-center justify-center">
              <span className={`w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_15px_#ffffff] transition-opacity duration-300 ${activeHotspot === 'car' ? 'opacity-100 scale-125' : 'opacity-70 animate-ping'}`} style={{ animationDelay: '2s' }} />
            </div>

            {/* Floating Glass Tooltip */}
            <div className={`absolute bottom-full mb-3 right-1/2 translate-x-1/2 w-72 p-4 rounded-2xl bg-[#0d1633]/90 border border-white/25 backdrop-blur-xl shadow-2xl transition-all duration-300 pointer-events-none ${activeHotspot === 'car' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                <Truck className="w-4 h-4" />
                Fleet Telemetry & Tracking
              </div>
              <p className="text-xs text-white/90 mt-1 font-medium leading-relaxed">
                Live vehicle status, driver assignment, fuel metrics, and odometer logs.
              </p>
            </div>
          </div>
        </div>

        {/* 4. 3D Cube Hotspot (Bottom-Left) */}
        <div className="hidden lg:block absolute left-[3%] bottom-[3%] z-20">
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setActiveHotspot('cube')}
            onMouseLeave={() => setActiveHotspot(null)}
          >
            <div className="w-32 h-32 rounded-2xl border border-white/0 hover:border-white/30 hover:bg-white/5 transition-all" />
            
            {/* Floating Glass Tooltip */}
            <div className={`absolute bottom-full mb-3 left-0 w-64 p-3.5 rounded-2xl bg-[#0d1633]/90 border border-white/25 backdrop-blur-xl shadow-2xl transition-all duration-300 pointer-events-none ${activeHotspot === 'cube' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                Modular Fleet Engine
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Zero-mock architecture built for commercial transports & logistics.
              </p>
            </div>
          </div>
        </div>

        {/* CENTER STAGE: Typography & Frosted Glass Download Card */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 text-center my-auto pb-10 sm:pb-14">
          
          {/* Eyebrow Sub-heading */}
          <p className="text-sm sm:text-lg md:text-xl font-medium text-white tracking-wide mb-1 sm:mb-2 font-['Outfit',sans-serif] drop-shadow">
            Vehicle & Fleet Maintenance
          </p>

          {/* Massive Hero Wordmark */}
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-black text-white tracking-tight font-['Outfit',sans-serif] leading-none drop-shadow-[0_12px_30px_rgba(0,0,0,0.3)] select-none">
            Serviq
          </h1>

          {/* Sub-heading */}
          <p className="text-base sm:text-xl md:text-2xl font-medium text-white mt-1 sm:mt-2 tracking-wide font-['Outfit',sans-serif] drop-shadow">
            Management Platform
          </p>

          {/* Frosted Glass Download Card matching reference */}
          <button
            onClick={() => setShowDownloadModal(true)}
            className="mt-6 sm:mt-9 group relative inline-flex items-center gap-4 sm:gap-5 px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/35 hover:border-white/60 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 text-left"
          >
            {/* White QR box */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-md group-hover:rotate-3 transition-transform">
              <QrCode className="w-9 h-9 sm:w-11 sm:h-11 text-[#2435e5]" />
            </div>

            {/* Download Now label */}
            <div className="pr-2">
              <div className="text-base sm:text-xl font-bold text-white leading-tight font-['Outfit',sans-serif]">
                Download
              </div>
              <div className="text-base sm:text-xl font-bold text-white leading-tight font-['Outfit',sans-serif]">
                Now
              </div>
            </div>

            {/* Subtle glow border hover indicator */}
            <span className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </button>
        </div>

        {/* BOTTOM INVITATION BAR: Scroll Prompt to Explore Platform */}
        <div className="relative z-20 w-full pb-6 text-center">
          <a
            href="#features"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/80 hover:text-white transition-colors group"
          >
            <span>Explore Fleet Capabilities</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* =========================================================================
          SLIDE-OUT NAVIGATION DRAWER (TRIGGERED BY HAMBURGER MENU)
      ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          {/* Backdrop blur overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer panel */}
          <div className="relative w-full max-w-md bg-[#0a1124] border-l border-white/15 h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl z-10 text-white animate-in slide-in-from-right duration-300">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-md">
                    <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                      <rect x="3" y="6" width="26" height="20" rx="4" fill="#2435e5"/>
                      <circle cx="16" cy="16" r="3.5" fill="white"/>
                    </svg>
                  </div>
                  <span className="font-extrabold text-2xl tracking-tight text-white font-['Outfit',sans-serif]">
                    Serviq
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="py-6 space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Navigation
                </span>
                <a
                  href="#hero"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-semibold text-white/90 hover:text-white py-1 hover:translate-x-1 transition-all"
                >
                  Home
                </a>
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-semibold text-white/90 hover:text-white py-1 hover:translate-x-1 transition-all"
                >
                  Platform Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-semibold text-white/90 hover:text-white py-1 hover:translate-x-1 transition-all"
                >
                  How It Works
                </a>
                <a
                  href="#roles"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-semibold text-white/90 hover:text-white py-1 hover:translate-x-1 transition-all"
                >
                  Fleet Solutions
                </a>
                <a
                  href="#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-semibold text-white/90 hover:text-white py-1 hover:translate-x-1 transition-all"
                >
                  About SERVIQ
                </a>
              </div>

              {/* Role Portals */}
              <div className="py-4 border-t border-white/10 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Role Portals
                </span>
                <Link
                  to={user?.role === 'admin' ? '/admin/dashboard' : '/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-semibold"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Organization Admin Console</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                <Link
                  to={user?.role === 'fleet_manager' ? '/manager/dashboard' : '/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-semibold"
                >
                  <div className="flex items-center gap-2.5">
                    <Gauge className="w-4 h-4 text-sky-400" />
                    <span>Fleet Operations Manager</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                <Link
                  to="/driver/home"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-semibold"
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    <span>Driver Mobile Experience</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>

            {/* Drawer Action Footer */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              {user ? (
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-white text-[#2435e5] font-extrabold text-sm text-center flex items-center justify-center gap-2 shadow-xl hover:bg-white/90 transition-all"
                >
                  <span>Open Your Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 rounded-xl bg-white text-[#2435e5] font-extrabold text-sm text-center flex items-center justify-center gap-2 shadow-xl hover:bg-white/90 transition-all"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl border border-white/20 text-white font-semibold text-xs text-center block hover:bg-white/10 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DOWNLOAD DRIVER APP MODAL (TRIGGERED BY "DOWNLOAD NOW" QR CARD)
      ========================================================================= */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0e1628] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center overflow-hidden">
            {/* Top gradient glow */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400" />

            <div className="flex items-center justify-between pb-2">
              <div className="text-left">
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-widest block">
                  SERVIQ Driver Mobile Suite
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit',sans-serif]">
                  Download Companion App
                </h3>
              </div>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Code Presentation */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
              <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-2xl flex items-center justify-center">
                <QrCode className="w-40 h-40 text-[#2435e5]" />
              </div>
              <p className="text-xs text-slate-300 mt-4 max-w-xs leading-relaxed">
                Scan with your Android camera to immediately access your driver portal, inspection checklist, and roadside logs.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-1">
              <Link
                to="/driver/home"
                onClick={() => setShowDownloadModal(false)}
                className="w-full py-3 rounded-xl bg-white text-[#2435e5] font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-white/90 transition-all hover:scale-[1.02]"
              >
                <Smartphone className="w-4 h-4" />
                <span>Launch Driver Mobile Web App</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setShowDownloadModal(false)}
                className="w-full py-2.5 rounded-xl border border-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              >
                <span>Register Fleet Organization</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PAGE 2 (EVEN): TRUST / VALUE STRIP — WHITE BACKGROUND
      ========================================================================= */}
      <section className="py-20 bg-white text-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-xs font-extrabold uppercase tracking-widest text-[#3831eb] mb-12">
            Everything your fleet needs, in one place.
          </h2>

          {/* Square Cards with Hover VFX */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-8 flex flex-col justify-between square-card-white group">
              <div className="w-12 h-12 bg-[#3831eb]/10 text-[#3831eb] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#3831eb] transition-colors">
                  Fleet Management
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Know where your vehicles stand. Complete status and assignment oversight.
                </p>
              </div>
            </div>

            <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-8 flex flex-col justify-between square-card-white group">
              <div className="w-12 h-12 bg-[#3831eb]/10 text-[#3831eb] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#3831eb] transition-colors">
                  Maintenance Tracking
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Never lose track of scheduled service. Calendar and odometer dual-triggers.
                </p>
              </div>
            </div>

            <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-8 flex flex-col justify-between square-card-white group">
              <div className="w-12 h-12 bg-[#3831eb]/10 text-[#3831eb] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#3831eb] transition-colors">
                  Repair Management
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Track issues from report to resolution. Real-time roadside breakdown logs.
                </p>
              </div>
            </div>

            <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-8 flex flex-col justify-between square-card-white group">
              <div className="w-12 h-12 bg-[#3831eb]/10 text-[#3831eb] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#3831eb] transition-colors">
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
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 sm:h-24 text-[#3831eb] fill-current animate-wave-flow">
          <path d="M0,0 C300,90 800,90 1200,0 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      {/* =========================================================================
          PAGE 3 (ODD): PROBLEM SECTION — BLUE BACKGROUND
      ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left bg-[#3831eb] relative">
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
      <div className="relative w-full overflow-hidden leading-none bg-[#3831eb]">
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
              <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#3831eb] transition-colors">
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
              <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#3831eb] transition-colors">
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
              <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#3831eb] transition-colors">
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
              <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#3831eb] transition-colors">
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
              <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#3831eb] transition-colors">
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
              <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#3831eb] transition-colors">
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
              <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#3831eb] transition-colors">
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
              <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#3831eb] transition-colors">
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
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 sm:h-24 text-[#3831eb] fill-current">
          <path d="M0,0 L600,120 L1200,0 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      {/* =========================================================================
          PAGE 5 (ODD): DASHBOARD SECTION — BLUE BACKGROUND
      ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left bg-[#3831eb]">
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
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#3831eb] font-bold text-sm shadow-xl hover:bg-white/90 transition-all hover:scale-105"
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
      <div className="relative w-full overflow-hidden leading-none bg-[#3831eb]">
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
            <span className="font-mono font-black text-3xl text-[#3831eb] group-hover:scale-110 transition-transform">01</span>
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#3831eb] transition-colors">
                Register Your Company
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Create your SERVIQ organization and set up your administrator account.
              </p>
            </div>
          </div>

          <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-6 flex flex-col justify-between square-card-white group">
            <span className="font-mono font-black text-3xl text-[#3831eb] group-hover:scale-110 transition-transform">02</span>
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#3831eb] transition-colors">
                Build Your Fleet
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Add vehicles, fleet managers, and drivers to your organization.
              </p>
            </div>
          </div>

          <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-6 flex flex-col justify-between square-card-white group">
            <span className="font-mono font-black text-3xl text-[#3831eb] group-hover:scale-110 transition-transform">03</span>
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#3831eb] transition-colors">
                Assign & Manage
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Assign vehicles to drivers and manage day-to-day fleet operations.
              </p>
            </div>
          </div>

          <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-6 flex flex-col justify-between square-card-white group">
            <span className="font-mono font-black text-3xl text-[#3831eb] group-hover:scale-110 transition-transform">04</span>
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#3831eb] transition-colors">
                Track Everything
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Monitor maintenance, repairs, expenses, documents, and vehicle health from one platform.
              </p>
            </div>
          </div>

          <div className="aspect-square bg-slate-50 border-2 border-slate-100 p-6 flex flex-col justify-between square-card-white group">
            <span className="font-mono font-black text-3xl text-[#3831eb] group-hover:scale-110 transition-transform">05</span>
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif] group-hover:text-[#3831eb] transition-colors">
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
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 sm:h-24 text-[#3831eb] fill-current">
          <path d="M0,0 Q600,120 1200,0 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      {/* =========================================================================
          PAGE 7 (ODD): BUILT FOR EVERY ROLE — BLUE BACKGROUND
      ========================================================================= */}
      <section id="roles" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left bg-[#3831eb]">
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
              className="mt-8 block text-center py-3 px-4 bg-white text-[#3831eb] font-bold text-xs shadow-md hover:bg-white/90 transition-all hover:scale-105"
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
              className="mt-8 block text-center py-3 px-4 bg-white text-[#3831eb] font-bold text-xs shadow-md hover:bg-white/90 transition-all hover:scale-105"
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
              className="mt-8 block text-center py-3 px-4 bg-white text-[#3831eb] font-bold text-xs shadow-md hover:bg-white/90 transition-all hover:scale-105"
            >
              Download Driver App →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VFX TRANSITION 7: Reversed Diagonal Cut (Blue to White)
      ========================================================================= */}
      <div className="relative w-full overflow-hidden leading-none bg-[#3831eb]">
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
              <span className="bg-[#3831eb]/10 text-[#3831eb] px-3 py-1.5">Check your vehicle.</span>
              <span className="bg-[#3831eb]/10 text-[#3831eb] px-3 py-1.5">Report an issue.</span>
              <span className="bg-[#3831eb]/10 text-[#3831eb] px-3 py-1.5">Track a repair.</span>
              <span className="bg-[#3831eb]/10 text-[#3831eb] px-3 py-1.5">Stay updated.</span>
            </div>

            {/* Square Feature Checkboxes */}
            <div className="mt-6 text-xs text-slate-700 grid grid-cols-2 gap-2.5">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3831eb]" /> Assigned vehicle</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3831eb]" /> Vehicle health</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3831eb]" /> Odometer</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3831eb]" /> Maintenance schedule</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3831eb]" /> Issue reporting</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3831eb]" /> Photo-based issue reporting</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3831eb]" /> Repair status</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3831eb]" /> Notifications</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3831eb]" /> Documents</div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/driver/home"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#3831eb] text-white font-bold text-xs shadow-xl hover:bg-[#2d27c7] transition-all hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Download Driver App</span>
              </Link>
              <span className="text-xs text-slate-500 font-medium">Available for Android</span>
            </div>
          </div>

          {/* Square Device Representation */}
          <div className="w-64 aspect-square bg-[#3831eb] p-6 text-white flex flex-col justify-between shadow-2xl animate-float-slow">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-white/20">
              <span className="font-bold">DRIVER APP</span>
              <img src="/logo-white.png" alt="" className="w-5 h-5 object-contain" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-white/70 uppercase font-bold">Assigned Asset</span>
              <div className="font-mono font-bold text-white text-lg">TN 01 AB 1234</div>
              <div className="text-xs text-white/80">Odometer: 45,280 km</div>
            </div>
            <div className="p-3 bg-white text-[#3831eb] font-bold text-center text-xs">
              Roadside Breakdown Reported
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VFX TRANSITION 8: Multi-Layer Wave Flow (White to Blue)
      ========================================================================= */}
      <div className="relative w-full overflow-hidden leading-none bg-white">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 sm:h-24 text-[#3831eb] fill-current animate-wave-flow">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C69.24,40 148.67,69.5 229,74.5A490,490,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* =========================================================================
          PAGE 9 (ODD): MAINTENANCE SECTION — BLUE BACKGROUND
      ========================================================================= */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left bg-[#3831eb]">
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
      <div className="relative w-full overflow-hidden leading-none bg-[#3831eb]">
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

          {/* 5-Column Navigation matching Image 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-14 border-b border-slate-100 text-xs">
            {/* Col 1: Company */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 font-['Outfit',sans-serif]">Company</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#about" className="hover:text-[#3831eb] transition-colors">About us</a></li>
                <li><a href="#about" className="hover:text-[#3831eb] transition-colors">Newsroom</a></li>
                <li><a href="#about" className="hover:text-[#3831eb] transition-colors">Tech Blog</a></li>
                <li><a href="#about" className="hover:text-[#3831eb] transition-colors">Press Releases</a></li>
                <li><a href="#about" className="hover:text-[#3831eb] transition-colors">Corporate information</a></li>
                <li><a href="#about" className="hover:text-[#3831eb] transition-colors">Fleet Partners</a></li>
                <li><a href="#about" className="hover:text-[#3831eb] transition-colors">Workshop Partners</a></li>
                <li><a href="#about" className="hover:text-[#3831eb] transition-colors">Enterprise FAQ</a></li>
              </ul>
            </div>

            {/* Col 2: Legal & Compliance */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 font-['Outfit',sans-serif]">Legal & Compliance</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#contact" className="hover:text-[#3831eb] transition-colors">Terms of use</a></li>
                <li><a href="#contact" className="hover:text-[#3831eb] transition-colors">Privacy Policy</a></li>
                <li><a href="#contact" className="hover:text-[#3831eb] transition-colors">Grievance Policy</a></li>
                <li><a href="#contact" className="hover:text-[#3831eb] transition-colors">Merchant Terms</a></li>
                <li><a href="#contact" className="hover:text-[#3831eb] transition-colors">Commercial Fleet Terms</a></li>
                <li><a href="#contact" className="hover:text-[#3831eb] transition-colors">Data Protection Standards</a></li>
              </ul>
            </div>

            {/* Col 3: Offers & Campaigns */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 font-['Outfit',sans-serif]">Offers & Campaigns</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#features" className="hover:text-[#3831eb] transition-colors">Fleet Preventive Servicing Trial</a></li>
                <li><a href="#features" className="hover:text-[#3831eb] transition-colors">Annual Maintenance Plan</a></li>
                <li><a href="#features" className="hover:text-[#3831eb] transition-colors">Driver Onboarding Bonus</a></li>
              </ul>
            </div>

            {/* Col 4: Product */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 font-['Outfit',sans-serif]">Product</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#features" className="hover:text-[#3831eb] transition-colors">Our products</a></li>
                <li><a href="#features" className="hover:text-[#3831eb] transition-colors">Fleet Registry</a></li>
                <li><a href="#features" className="hover:text-[#3831eb] transition-colors">Maintenance Scheduler</a></li>
                <li><a href="#features" className="hover:text-[#3831eb] transition-colors">Breakdown Tickets</a></li>
                <li><Link to="/driver/home" className="hover:text-[#3831eb] transition-colors font-medium">Driver Mobile App</Link></li>
              </ul>
            </div>

            {/* Col 5: Support (Matching image 2 verbatim) */}
            <div className="space-y-3 lg:col-span-1">
              <h4 className="font-bold text-sm text-slate-900 font-['Outfit',sans-serif]">Support</h4>
              <p className="text-slate-600 leading-relaxed">
                Get Answers and Assistance Right Where You Need It
              </p>
              <ol className="space-y-2 text-slate-600 leading-relaxed list-decimal list-inside">
                <li>Tap the user profile icon on your <span className="font-semibold text-slate-800">serviq.fleet</span> app <span className="font-semibold text-slate-800">home screen</span>.</li>
                <li>Go to the <span className="font-semibold text-slate-800">Help & Feedback</span> menu option.</li>
                <li>Select the <span className="font-semibold text-slate-800">relevant category</span> matching your issue to start a live chat instantly.</li>
              </ol>
            </div>
          </div>

          {/* Bottom Copyright & Address Row (Matching Image 3, with NO social icons) */}
          <div className="py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-slate-500">
            <div>
              Copyright © 2026 SERVIQ Innovations Private Limited. All rights reserved.
            </div>

            <div className="md:text-right space-y-0.5 leading-relaxed text-[11px] text-slate-500">
              <div className="font-semibold text-slate-700">SERVIQ Innovations Private Limited</div>
              <div>Buildings Alyssa, Begonia & Clover, Embassy Tech Village</div>
              <div>Outer Ring Road, Devarabeesanahalli Village</div>
              <div>Bengaluru - Karnataka - 560103</div>
            </div>
          </div>

          {/* Huge Faint Watermark Text at Bottom matching Image 3 */}
          <div className="pt-6 text-center select-none pointer-events-none opacity-40">
            <span className="font-black text-6xl sm:text-9xl lg:text-[140px] text-slate-200 tracking-tight leading-none block font-['Outfit',sans-serif]">
              Let's be ready.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
