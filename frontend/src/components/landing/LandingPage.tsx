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

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'fleet_manager') return '/manager/dashboard';
    if (user.role === 'driver') return '/driver/home';
    return '/login';
  };

  return (
    <div className="min-h-screen bg-[#3831eb] text-white font-['Plus_Jakarta_Sans',sans-serif] selection:bg-white selection:text-[#3831eb] overflow-x-hidden relative">

      {/* Ambient background glow orbs */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="fixed bottom-20 right-10 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* =========================================================================
          1. NAVIGATION (Fixed on Electric Blue with White Logo)
      ========================================================================= */}
      <nav className="sticky top-0 z-50 bg-[#3831eb]/90 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo using uploaded Image 2 (White emblem on blue) */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/logo-white.png"
                alt="SERVIQ Logo"
                className="w-10 h-10 object-contain drop-shadow group-hover:scale-105 transition-transform"
              />
              <span className="absolute -inset-1 rounded-full bg-white/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-2xl tracking-tight text-white font-['Outfit',sans-serif] block leading-none">
                serviq.
              </span>
              <span className="text-[10px] text-white/70 font-semibold tracking-wider block mt-0.5">
                fleet management
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/80">
            <a href="#hero" className="hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-white after:absolute after:bottom-0 after:left-0 after:transition-all">Home</a>
            <a href="#features" className="hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-white after:absolute after:bottom-0 after:left-0 after:transition-all">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-white after:absolute after:bottom-0 after:left-0 after:transition-all">How It Works</a>
            <a href="#roles" className="hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-white after:absolute after:bottom-0 after:left-0 after:transition-all">Solutions</a>
            <a href="#about" className="hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-white after:absolute after:bottom-0 after:left-0 after:transition-all">About</a>
            <a href="#contact" className="hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-white after:absolute after:bottom-0 after:left-0 after:transition-all">Contact</a>
          </div>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <Link
                to={getDashboardLink()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#3831eb] font-bold text-sm shadow-lg hover:bg-white/95 transition-all hover:scale-105 active:scale-95"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-white/90 hover:text-white px-4 py-2 transition-colors hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#3831eb] font-bold text-sm shadow-lg hover:bg-white/95 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#2d27c7] border-b border-white/15 px-6 py-6 space-y-4 text-white">
            <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold">Home</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold">How It Works</a>
            <a href="#roles" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold">Solutions</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold">About</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold">Contact</a>
            <div className="pt-4 border-t border-white/15 flex flex-col gap-3">
              <Link to="/login" className="w-full py-2.5 text-center text-sm font-semibold text-white bg-white/10">
                Login
              </Link>
              <Link to="/register" className="w-full py-2.5 text-center text-sm font-bold text-[#3831eb] bg-white shadow-lg">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* =========================================================================
          PAGE 1 (ODD): HERO SECTION — BLUE BACKGROUND
      ========================================================================= */}
      <section id="hero" className="relative pt-16 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Floating animated 3D emblems & geometric shapes with VFX */}
        <div className="hidden lg:block absolute left-8 top-16 w-28 h-28 opacity-30 pointer-events-none animate-float-slow">
          <img src="/logo-white.png" alt="" className="w-full h-full object-contain filter drop-shadow-xl animate-spin-very-slow" />
        </div>
        <div className="hidden lg:block absolute right-8 top-20 w-36 h-36 opacity-25 pointer-events-none animate-float-reverse">
          <img src="/logo-white.png" alt="" className="w-full h-full object-contain filter drop-shadow-xl animate-spin-reverse-slow" />
        </div>

        {/* Floating luminous 3D cube */}
        <div className="hidden md:block absolute left-24 bottom-10 w-16 h-16 bg-white/10 border border-white/30 backdrop-blur-md rotate-45 pointer-events-none animate-float-delayed shadow-2xl" />
        <div className="hidden md:block absolute right-24 bottom-12 w-12 h-12 bg-white/15 border border-white/30 backdrop-blur-md rotate-12 pointer-events-none animate-float-slow shadow-2xl" />

        <p className="text-sm sm:text-base font-semibold text-white/90 tracking-wide mb-3">
          Unlock the power of
        </p>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight font-['Outfit',sans-serif] leading-tight max-w-5xl mx-auto drop-shadow-sm">
          serviqFLEET
        </h1>

        <p className="text-lg sm:text-xl font-semibold text-white/95 mt-3 font-['Outfit',sans-serif]">
          Keep Your Fleet Ready. Keep Your Business Moving.
        </p>

        <p className="mt-5 text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
          SERVIQ brings vehicles, drivers, maintenance, repairs, expenses, and fleet operations together in one centralized platform. Manage your fleet smarter, stay ahead of maintenance, and reduce unnecessary downtime.
        </p>

        {/* QR Download Card with interactive VFX */}
        <div className="mt-10 inline-flex items-center justify-center">
          <div className="bg-white/15 backdrop-blur-xl border border-white/30 p-4 sm:p-5 shadow-2xl flex items-center gap-5 hover:bg-white/20 transition-all text-left hover:scale-[1.02] hover:shadow-black/30 group">
            <div className="w-16 h-16 sm:w-18 sm:h-18 bg-white p-2 flex items-center justify-center shadow-md group-hover:rotate-3 transition-transform">
              <QrCode className="w-12 h-12 text-[#3831eb]" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-extrabold text-white font-['Outfit',sans-serif] leading-tight">
                Download Driver App
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                Available for Android APK
              </p>
              <div className="mt-2.5 flex items-center gap-3">
                <Link
                  to="/register"
                  className="px-4 py-1.5 bg-white text-[#3831eb] font-bold text-xs shadow-md hover:bg-white/95 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/driver/home"
                  className="text-xs font-semibold text-white underline hover:text-white/80"
                >
                  Mobile View →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-white/60">
          One platform. One fleet. Complete control.
        </p>
      </section>

      {/* =========================================================================
          VFX TRANSITION 1: Slanted Diagonal Cut with Floating Gear Seal (Blue to White)
      ========================================================================= */}
      <div className="relative w-full overflow-hidden leading-none bg-[#3831eb]">
        {/* Floating animated transition seal */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-20 w-12 h-12 bg-white rounded-full shadow-2xl p-2.5 flex items-center justify-center animate-spin-very-slow border-2 border-[#3831eb]">
          <img src="/logo-blue.png" alt="" className="w-full h-full object-contain" />
        </div>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 sm:h-24 text-white fill-current">
          <path d="M1200 0L0 120V120H1200V0Z"></path>
        </svg>
      </div>

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
