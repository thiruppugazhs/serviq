import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  QrCode,
  Smartphone,
  Download,
  ArrowRight,
  ShieldCheck,
  Truck,
  Building2,
  ExternalLink,
  Lock,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setDownloadModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'fleet_manager') return '/manager/dashboard';
    if (user.role === 'driver') return '/driver/home';
    return '/login';
  };

  const currentHost = typeof window !== 'undefined' ? window.location.origin : '';
  const driverPortalUrl = `${currentHost}/driver/home`;

  return (
    <div className="min-h-screen w-full bg-[#4143fa] text-white font-['Plus_Jakarta_Sans',sans-serif] selection:bg-white selection:text-[#4143fa] overflow-hidden flex flex-col justify-center items-center relative select-none">

      {/* =========================================================================
          HERO STAGE: Exact Match to Uploaded 3D Render
      ========================================================================= */}
      <main className="relative w-full max-w-[1440px] aspect-[1024/457] flex items-center justify-center overflow-hidden shadow-2xl">
        {/* The Exact 3D Visual Mockup */}
        <img
          src="/landing-exact.jpg"
          alt="Serviq Vehicle & Fleet Maintenance Management Platform"
          className="w-full h-full object-contain pointer-events-none select-none"
          draggable={false}
        />

        {/* =====================================================================
            INTERACTIVE HOT-ZONES (Positioned proportionally with pixel precision)
        ===================================================================== */}

        {/* 1. Top-Left Logo Hot-Zone */}
        <Link
          to="/"
          title="SERVIQ Home"
          className="absolute top-[4.5%] left-[7.5%] w-[16%] h-[11%] rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer group transition-all"
        >
          <span className="sr-only">SERVIQ Home</span>
          <span className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none" />
        </Link>

        {/* 2. Top-Right Hamburger Menu Hot-Zone */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          title="Open Navigation Menu"
          aria-label="Open Navigation Menu"
          className="absolute top-[4.5%] right-[6.8%] w-[6.5%] h-[11%] flex items-center justify-center rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer group transition-all"
        >
          <span className="sr-only">Open Navigation Menu</span>
          <span className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/15 active:scale-95 transition-all pointer-events-none" />
        </button>

        {/* 3. Center "Download Now / QR Code" Glass Button Hot-Zone */}
        <button
          type="button"
          onClick={() => setDownloadModalOpen(true)}
          title="Download SERVIQ Mobile App or Scan QR"
          className="absolute top-[64.2%] left-[39.5%] w-[21%] h-[20.8%] rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer group transition-all"
        >
          <span className="sr-only">Download SERVIQ Driver Mobile App</span>
          {/* Subtle ambient glass glow on hover */}
          <span className="absolute -inset-1 rounded-2xl bg-white/0 group-hover:bg-white/20 blur-sm transition-all pointer-events-none" />
          <span className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/30 transition-all pointer-events-none" />
        </button>
      </main>

      {/* Mobile Quick Action Strip (visible on small portrait screens for easy access) */}
      <div className="sm:hidden w-full px-6 py-4 flex flex-col gap-2 z-10 bg-[#3537e8]/80 backdrop-blur-md border-t border-white/10">
        <button
          type="button"
          onClick={() => setDownloadModalOpen(true)}
          className="w-full py-2.5 rounded-xl bg-white text-[#4143fa] font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
        >
          <QrCode className="w-4 h-4" />
          <span>Scan / Download Mobile App</span>
        </button>
        <div className="flex gap-2">
          <Link
            to="/login"
            className="flex-1 py-2 rounded-xl bg-white/15 text-white font-semibold text-xs text-center border border-white/20 hover:bg-white/25"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="flex-1 py-2 rounded-xl bg-white/15 text-white font-semibold text-xs text-center border border-white/20 hover:bg-white/25"
          >
            Register
          </Link>
        </div>
      </div>

      {/* =========================================================================
          SLIDE-OUT NAVIGATION MENU DRAWER (Triggered by Hamburger '≡')
      ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Backdrop dismiss */}
          <div
            className="flex-1"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="w-full max-w-sm h-full bg-[#1e23a8] border-l border-white/20 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-right duration-300">
            {/* Top Bar */}
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-black text-xl text-white border border-white/20 shadow-md">
                    S
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-white font-['Outfit',sans-serif]">
                      Serviq
                    </h2>
                    <p className="text-[11px] text-white/70 font-medium">Fleet Management Console</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="mt-8 space-y-2 text-sm font-semibold">
                {user ? (
                  <div className="p-4 rounded-2xl bg-white/10 border border-white/20 mb-4 space-y-2">
                    <div className="text-[11px] uppercase tracking-wider text-white/70">Logged in as</div>
                    <div className="font-bold text-white text-base">{user.name}</div>
                    <div className="text-xs text-white/80 font-mono capitalize">{user.role?.replace('_', ' ')}</div>
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setMobileMenuOpen(false)}
                      className="mt-3 w-full py-2.5 rounded-xl bg-white text-[#4143fa] font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/95 transition-all shadow-lg"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Lock className="w-4 h-4 text-white/80 group-hover:text-white" />
                        <span>Portal Sign In</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/60 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-white text-[#4143fa] hover:bg-white/95 font-bold transition-all group shadow-lg shadow-black/20"
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-[#4143fa]" />
                        <span>Register Company</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#4143fa] group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </>
                )}

                <div className="pt-4 border-t border-white/15 space-y-1">
                  <div className="text-[11px] uppercase tracking-wider text-white/60 px-3 py-1 font-bold">
                    Platform Quick Access
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setDownloadModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-white/90 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <QrCode className="w-4 h-4 text-white/70" />
                      <span>Mobile Driver App QR</span>
                    </div>
                    <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-md font-mono">App</span>
                  </button>

                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-white/90 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-white/70" />
                      <span>Admin Command Center</span>
                    </div>
                  </Link>

                  <Link
                    to="/manager/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-white/90 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-4 h-4 text-white/70" />
                      <span>Fleet Operations</span>
                    </div>
                  </Link>

                  <Link
                    to="/driver/home"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-white/90 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-white/70" />
                      <span>Driver Mobile Web Portal</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Footer Details */}
            <div className="pt-6 border-t border-white/15 text-xs text-white/60 space-y-2">
              <div className="flex items-center justify-between">
                <span>SERVIQ Fleet Core</span>
                <span className="font-mono text-white/80">v1.0.0</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Enterprise vehicle maintenance, telematics, and transport dispatch command center.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DOWNLOAD NOW / DRIVER APP QR MODAL
      ========================================================================= */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#181ca8] border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden text-center animate-in zoom-in-95 duration-200">
            {/* Ambient Corner Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setDownloadModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-white mb-2">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Driver Mobile Experience</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit',sans-serif]">
                Get the SERVIQ Driver App
              </h3>
              <p className="text-xs text-white/70 max-w-xs mx-auto">
                Scan the QR code with your smartphone camera to access vehicle inspections, assignments, and expense tracking.
              </p>
            </div>

            {/* Crisp High-Res QR Display */}
            <div className="p-5 rounded-2xl bg-white shadow-xl max-w-[210px] mx-auto border-4 border-white/30 flex flex-col items-center justify-center">
              {/* SVG QR Code Representation */}
              <svg
                viewBox="0 0 100 100"
                className="w-40 h-40"
                fill="#181ca8"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer Finder Patterns */}
                <rect x="5" y="5" width="28" height="28" rx="4" fill="#181ca8" />
                <rect x="9" y="9" width="20" height="20" rx="2" fill="#ffffff" />
                <rect x="13" y="13" width="12" height="12" rx="1" fill="#181ca8" />

                <rect x="67" y="5" width="28" height="28" rx="4" fill="#181ca8" />
                <rect x="71" y="9" width="20" height="20" rx="2" fill="#ffffff" />
                <rect x="75" y="13" width="12" height="12" rx="1" fill="#181ca8" />

                <rect x="5" y="67" width="28" height="28" rx="4" fill="#181ca8" />
                <rect x="9" y="71" width="20" height="20" rx="2" fill="#ffffff" />
                <rect x="13" y="75" width="12" height="12" rx="1" fill="#181ca8" />

                {/* Data Grid Bits */}
                <rect x="38" y="8" width="6" height="6" />
                <rect x="48" y="12" width="6" height="6" />
                <rect x="58" y="8" width="5" height="6" />
                <rect x="38" y="22" width="6" height="6" />
                <rect x="48" y="26" width="6" height="6" />

                <rect x="8" y="38" width="6" height="6" />
                <rect x="22" y="38" width="6" height="6" />
                <rect x="8" y="48" width="6" height="6" />
                <rect x="22" y="52" width="6" height="6" />

                <rect x="38" y="38" width="8" height="8" rx="2" />
                <rect x="54" y="38" width="8" height="8" rx="2" />
                <rect x="38" y="54" width="8" height="8" rx="2" />
                <rect x="54" y="54" width="8" height="8" rx="2" />

                <rect x="68" y="38" width="6" height="6" />
                <rect x="82" y="42" width="8" height="6" />
                <rect x="72" y="52" width="6" height="6" />
                <rect x="86" y="52" width="6" height="6" />

                <rect x="38" y="72" width="6" height="6" />
                <rect x="48" y="68" width="6" height="6" />
                <rect x="56" y="76" width="6" height="6" />
                <rect x="42" y="84" width="6" height="6" />
                <rect x="54" y="86" width="6" height="6" />

                <rect x="68" y="72" width="8" height="6" />
                <rect x="82" y="68" width="6" height="6" />
                <rect x="74" y="82" width="6" height="6" />
                <rect x="84" y="82" width="8" height="8" rx="1" />
              </svg>
              <span className="text-[10px] text-[#181ca8] font-bold tracking-wider mt-2">
                SCAN WITH PHONE
              </span>
            </div>

            {/* Direct Action Options */}
            <div className="space-y-2.5 pt-2">
              <Link
                to="/driver/home"
                onClick={() => setDownloadModalOpen(false)}
                className="w-full py-3 rounded-xl bg-white text-[#181ca8] font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/95 transition-all shadow-lg active:scale-98"
              >
                <Smartphone className="w-4 h-4" />
                <span>Open Driver Mobile Web App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <div className="flex gap-2">
                <Link
                  to="/register"
                  onClick={() => setDownloadModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs text-center transition-colors"
                >
                  Register Company
                </Link>
                <Link
                  to="/login"
                  onClick={() => setDownloadModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs text-center transition-colors"
                >
                  Portal Login
                </Link>
              </div>
            </div>

            <p className="text-[11px] text-white/50">
              Compatible with iOS Safari, Chrome for Android, and PWA Mobile installations.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
