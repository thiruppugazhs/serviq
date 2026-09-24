import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  QrCode,
  Download,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  Truck,
  Wrench,
  CheckCircle2,
  ExternalLink,
  LogIn,
  UserPlus,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'fleet_manager') return '/manager/dashboard';
    if (user.role === 'driver') return '/driver/home';
    return '/login';
  };

  return (
    <div className="relative w-screen h-screen max-h-screen overflow-hidden bg-[#4143fa] select-none flex flex-col justify-center items-center font-['Outfit',sans-serif]">
      {/* Visual Canvas Matching Exact Mockup */}
      <div className="relative w-full h-full max-w-[1920px] max-h-screen flex items-center justify-center overflow-hidden">
        
        {/* Exact 3D Render Image */}
        <img
          src="/landing-exact.jpg"
          alt="Serviq Vehicle & Fleet Maintenance Management Platform"
          className="w-full h-full object-contain pointer-events-none select-none max-h-screen"
        />

        {/* =========================================================================
            Interactive Overlay Hotspots (Mapped precisely to the composition)
        ========================================================================= */}

        {/* 1. Top-Left Logo Click Target */}
        <Link
          to="/"
          title="SERVIQ Home"
          className="absolute top-[3%] left-[4.5%] w-[16%] h-[12%] rounded-xl transition-all duration-200 hover:bg-white/5 active:scale-95 z-20 cursor-pointer flex items-center"
        >
          <span className="sr-only">SERVIQ Home</span>
        </Link>

        {/* 2. Top-Right Hamburger Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          title="Open Menu"
          aria-label="Open Navigation Menu"
          className="absolute top-[3.5%] right-[5%] w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all duration-200 z-20 cursor-pointer group"
        >
          <Menu className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform stroke-[2.5]" />
        </button>

        {/* 3. Center "Download Now / QR Code" Interactive Glass Button */}
        <button
          type="button"
          onClick={() => setDownloadModalOpen(true)}
          title="Scan QR or Download Mobile App"
          aria-label="Download SERVIQ Mobile App"
          className="absolute top-[61.5%] left-[39.5%] w-[21%] h-[18%] rounded-2xl md:rounded-3xl border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/15 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 z-20 cursor-pointer group flex items-center justify-center"
        >
          {/* Subtle pulsating focus ring on hover */}
          <span className="absolute -inset-1 rounded-3xl bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <span className="sr-only">Download SERVIQ Mobile App</span>
        </button>

        {/* Floating Bottom Quick Action Pill */}
        <div className="absolute bottom-4 sm:bottom-6 z-20 flex items-center gap-3 px-4 py-2 rounded-full bg-[#1b2382]/60 hover:bg-[#1b2382]/85 backdrop-blur-md border border-white/15 shadow-2xl transition-all">
          {user ? (
            <Link
              to={getDashboardLink()}
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white hover:text-emerald-300 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Go to Fleet Command ({user.role})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs sm:text-sm font-semibold text-white/90 hover:text-white px-3 py-1 rounded-full hover:bg-white/10 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
              <div className="w-1 h-1 rounded-full bg-white/30" />
              <Link
                to="/register"
                className="text-xs sm:text-sm font-bold text-[#4143fa] bg-white hover:bg-white/90 px-4 py-1.5 rounded-full shadow-md transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register Company</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* =========================================================================
          Slide-Over Navigation Drawer (Triggered by Hamburger Button)
      ========================================================================= */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-[#0a1128]/95 backdrop-blur-2xl border-l border-white/15 h-full p-6 sm:p-8 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-white to-blue-200 flex items-center justify-center shadow-lg">
                    <Truck className="w-5 h-5 text-[#4143fa]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-wide">
                      SERVIQ
                    </h2>
                    <p className="text-[10px] text-blue-200 font-semibold uppercase tracking-widest">
                      Fleet Operations
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="py-6 space-y-2">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all"
                >
                  <span>Home Showcase</span>
                  <ArrowRight className="w-4 h-4 text-white/50" />
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-blue-600/40 to-indigo-600/40 hover:from-blue-600/60 hover:to-indigo-600/60 border border-blue-400/30 text-white font-bold text-sm transition-all shadow-lg"
                >
                  <div className="flex items-center gap-2.5">
                    <UserPlus className="w-4 h-4 text-blue-300" />
                    <span>Create Organization Account</span>
                  </div>
                  <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold uppercase">
                    Setup
                  </span>
                </Link>

                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <LogIn className="w-4 h-4 text-white/70" />
                    <span>Sign In to Fleet Command</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/50" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setDownloadModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Download Mobile Driver App</span>
                  </div>
                  <QrCode className="w-4 h-4 text-emerald-400" />
                </button>

                <Link
                  to="/driver/home"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Wrench className="w-4 h-4 text-amber-400" />
                    <span>Driver Inspection Portal</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/50" />
                </Link>
              </div>

              {/* Platform Highlights */}
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 space-y-2.5 text-xs text-blue-200">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Enterprise Fleet Ecosystem
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Automated service & repair telemetry</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Role-based access (Admin, Manager, Driver)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Live Brevo OTP authentication</span>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              {user ? (
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-[#4143fa] font-bold text-sm shadow-xl hover:bg-white/90 transition-all"
                >
                  <span>Open Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-xl bg-white text-[#4143fa] font-bold text-xs shadow-lg hover:bg-white/90 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}
              <p className="text-[11px] text-center text-white/40">
                © {new Date().getFullYear()} SERVIQ Systems. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          Download & QR Code Modal
      ========================================================================= */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-sm sm:max-w-md bg-[#0a1128] border border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative text-center">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setDownloadModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Title */}
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-2">
                <Smartphone className="w-3.5 h-3.5" />
                SERVIQ Mobile Driver APK
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Download SERVIQ App
              </h3>
              <p className="text-xs text-blue-200/80 mt-1">
                Scan the QR code with your mobile camera or download directly.
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-4 bg-white rounded-2xl inline-block shadow-2xl shadow-blue-950/80 mx-auto">
              <svg
                viewBox="0 0 100 100"
                className="w-44 h-44 text-[#0a1128]"
                fill="currentColor"
              >
                {/* Clean stylized QR code matrix */}
                <rect x="5" y="5" width="28" height="28" rx="4" fill="#0a1128" />
                <rect x="9" y="9" width="20" height="20" rx="2" fill="#ffffff" />
                <rect x="13" y="13" width="12" height="12" rx="1" fill="#0a1128" />

                <rect x="67" y="5" width="28" height="28" rx="4" fill="#0a1128" />
                <rect x="71" y="9" width="20" height="20" rx="2" fill="#ffffff" />
                <rect x="75" y="13" width="12" height="12" rx="1" fill="#0a1128" />

                <rect x="5" y="67" width="28" height="28" rx="4" fill="#0a1128" />
                <rect x="9" y="71" width="20" height="20" rx="2" fill="#ffffff" />
                <rect x="13" y="75" width="12" height="12" rx="1" fill="#0a1128" />

                {/* Pattern Data points */}
                <rect x="38" y="8" width="6" height="6" fill="#0a1128" />
                <rect x="48" y="8" width="6" height="6" fill="#0a1128" />
                <rect x="58" y="8" width="6" height="6" fill="#0a1128" />
                <rect x="38" y="18" width="6" height="6" fill="#0a1128" />
                <rect x="48" y="24" width="8" height="8" rx="1" fill="#4143fa" />
                <rect x="38" y="38" width="24" height="24" rx="3" fill="#4143fa" />

                <rect x="8" y="38" width="6" height="6" fill="#0a1128" />
                <rect x="18" y="48" width="6" height="6" fill="#0a1128" />
                <rect x="28" y="38" width="6" height="6" fill="#0a1128" />

                <rect x="68" y="38" width="6" height="6" fill="#0a1128" />
                <rect x="78" y="48" width="6" height="6" fill="#0a1128" />
                <rect x="88" y="38" width="6" height="6" fill="#0a1128" />

                <rect x="38" y="68" width="6" height="6" fill="#0a1128" />
                <rect x="48" y="78" width="6" height="6" fill="#0a1128" />
                <rect x="58" y="88" width="6" height="6" fill="#0a1128" />
                <rect x="68" y="68" width="6" height="6" fill="#0a1128" />
                <rect x="78" y="78" width="6" height="6" fill="#0a1128" />
                <rect x="88" y="88" width="6" height="6" fill="#0a1128" />
              </svg>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <a
                href="/driver/home"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-[#4143fa] font-bold text-sm shadow-xl hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-98"
              >
                <Smartphone className="w-4 h-4" />
                <span>Launch Mobile Driver Experience</span>
              </a>

              <a
                href="#download-apk"
                onClick={(e) => {
                  e.preventDefault();
                  alert('SERVIQ Driver APK download initiated. Compatible with Android 8.0+');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Android APK (Direct)</span>
              </a>
            </div>

            <p className="text-[11px] text-white/50">
              Compatible with Android, iOS, tablets, and modern desktop browsers.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
