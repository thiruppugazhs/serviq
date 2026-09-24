import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  QrCode,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowLeft,
  X,
  ChevronDown,
  Wrench,
  Camera,
  FileText,
  MapPin,
  Clock,
} from 'lucide-react';
import { HelpFeedbackModal } from '../support/HelpFeedbackModal';

export const DownloadAppPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [headerTheme, setHeaderTheme] = useState<'transparent' | 'blue' | 'white'>('transparent');
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 40) {
        setHeaderTheme('transparent');
        return;
      }
      const contentEl = document.getElementById('download-features');
      if (contentEl) {
        const rect = contentEl.getBoundingClientRect();
        if (rect.top <= 50) {
          setHeaderTheme('white');
          return;
        }
      }
      setHeaderTheme('blue');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleApkDownload = () => {
    setDownloadStarted(true);
    // Create simulated direct APK download blob for smooth user experience
    const dummyBlob = new Blob(['SERVIQ Fleet Android APK Package v2.4.1'], {
      type: 'application/vnd.android.package-archive',
    });
    const url = window.URL.createObjectURL(dummyBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'serviq-fleet-v2.4.1.apk';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    setTimeout(() => {
      setDownloadStarted(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-studio-blue text-white font-['Plus_Jakarta_Sans',sans-serif] selection:bg-white selection:text-[#393df0] overflow-x-hidden relative">

      {/* Ambient background glow orbs */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="fixed bottom-20 right-10 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* Dynamic Glass Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full px-6 sm:px-12 transition-all duration-300 flex items-center justify-between border-none ${
          headerTheme === 'transparent'
            ? 'py-4 sm:py-5 bg-transparent backdrop-blur-none shadow-none'
            : headerTheme === 'blue'
            ? 'py-3.5 bg-[#1826d0]/80 backdrop-blur-xl shadow-lg shadow-blue-950/20'
            : 'py-3.5 bg-white/80 backdrop-blur-xl shadow-sm shadow-slate-900/5'
        }`}
      >
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

        {/* Right: Back Link + Hamburger Menu */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/"
            className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
              headerTheme === 'white'
                ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                : 'border-white/20 text-white/90 hover:bg-white/10'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

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
        </div>
      </header>

      {/* Full-Page Drop-Down Menu */}
      <div
        className={`fixed inset-0 z-[100] bg-studio-blue text-white flex flex-col overflow-y-auto transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileMenuOpen ? 'translate-y-0 pointer-events-auto' : '-translate-y-full pointer-events-none'
        }`}
      >
        <div className="relative z-10 w-full px-6 sm:px-12 md:px-16 py-5 sm:py-6 flex items-center justify-between border-b border-white/10">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 sm:gap-3 group">
            <img src="/logo-white.png" alt="Serviq" className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow" />
            <img src="/serviq-name-logo.png" alt="Serviq" className="h-5 sm:h-6 md:h-7 w-auto object-contain drop-shadow-sm" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-10 h-10 sm:w-11 sm:h-11 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-6 h-6 text-white stroke-[2.5]" />
          </button>
        </div>

        <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 py-10 md:py-16 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="md:w-5/12 flex flex-col justify-start">
            <p className="text-white text-base sm:text-lg">
              Reach out to us via{' '}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setHelpModalOpen(true);
                }}
                className="underline underline-offset-4 decoration-2 font-medium hover:text-white/80 transition-colors cursor-pointer text-left"
              >
                Help & Feedback
              </button>
            </p>
            <p className="text-white/80 text-xs sm:text-sm mt-3 leading-relaxed max-w-sm">
              Need assistance with your fleet or account? Connect with our dedicated support team in Chennai.
            </p>
            <div className="mt-8 flex gap-3">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl text-center">
                Log In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 bg-white text-[#2335f2] font-bold rounded-xl shadow-lg hover:bg-white/95 text-center">
                Get Started
              </Link>
            </div>
          </div>

          <div className="md:w-7/12 flex flex-col space-y-2 md:space-y-3">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-4xl sm:text-5xl md:text-6xl font-bold text-white/70 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/download" onClick={() => setMobileMenuOpen(false)} className="text-4xl sm:text-5xl md:text-6xl font-bold text-white transition-colors">
              Download App
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setHelpModalOpen(true);
              }}
              className="text-left text-4xl sm:text-5xl md:text-6xl font-bold text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              Help & Feedback
            </button>
            <Link to="/terms-of-use" onClick={() => setMobileMenuOpen(false)} className="text-2xl sm:text-3xl font-semibold text-white/60 hover:text-white transition-colors pt-4">
              Terms of Use
            </Link>
            <Link to="/privacy-policy" onClick={() => setMobileMenuOpen(false)} className="text-2xl sm:text-3xl font-semibold text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PAGE 1 (FULL VIEWPORT): BIG BOLD TITLE & DIRECT DOWNLOAD OPTIONS
      ========================================================================= */}
      <section className="min-h-screen relative flex flex-col justify-between items-center text-center px-4 sm:px-6 pt-24 pb-12 overflow-hidden bg-studio-blue">
        
        {/* Subtle pill kicker */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-white/90 animate-in fade-in duration-300">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>Driver & Fleet Mobile Companion</span>
        </div>

        {/* Center: Big bold title and download cards */}
        <div className="max-w-4xl mx-auto my-auto py-6">
          <h1 className="font-anek-latin font-bold text-white text-6xl sm:text-7xl md:text-8xl lg:text-[108px] leading-tight tracking-tight select-none drop-shadow-md animate-in zoom-in-95 duration-300">
            Download Serviq
          </h1>

          <p className="font-neue-haas-medium text-white/90 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mt-3 sm:mt-4 px-4">
            Everything your drivers and managers need on the road. Log daily odometer, report roadside breakdowns, and track live maintenance work orders.
          </p>

          {/* Download Action Cards */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            
            {/* Primary Direct APK Download Button */}
            <button
              onClick={handleApkDownload}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-[#2335f2] font-bold text-base sm:text-lg shadow-2xl hover:bg-white/95 transition-all hover:scale-105 cursor-pointer active:scale-95 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#2335f2] group-hover:scale-110 transition-transform">
                <Download className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Direct Download</div>
                <div className="text-slate-900 font-bold">Android APK (v2.4.1)</div>
              </div>
            </button>

            {/* QR Code Card */}
            <div className="inline-flex items-center gap-4 px-6 py-3.5 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/25 shadow-xl hover:bg-white/20 transition-all">
              <div className="w-12 h-12 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-md">
                <QrCode className="w-full h-full text-[#2335f2]" />
              </div>
              <div className="text-left font-neue-haas-medium text-white leading-tight">
                <div className="text-xs text-white/70">Scan on Phone</div>
                <div className="text-sm font-bold">Instant Install</div>
              </div>
            </div>

          </div>

          {/* Download feedback indicator */}
          {downloadStarted && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-200 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Download started! Check your browser's download folder.</span>
            </div>
          )}

          {/* Quick Specs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-white/75 font-medium">
            <span>• Android 8.0 & Above</span>
            <span>• iOS 14.0+ (Coming Soon)</span>
            <span>• Size: 28.4 MB</span>
            <span>• Works Offline</span>
          </div>
        </div>

        {/* Animated Scroll Down Indicator */}
        <div className="flex flex-col items-center gap-2 text-white/80 animate-bounce select-none">
          <span className="text-xs uppercase tracking-widest font-semibold">Scroll down for features</span>
          <ChevronDown className="w-5 h-5 text-white" />
        </div>
      </section>

      {/* =========================================================================
          PAGE 2: MOBILE APP HIGHLIGHTS & SCREENSHOTS (APPEARS ON SCROLL)
      ========================================================================= */}
      <section id="download-features" className="py-20 sm:py-24 bg-white text-slate-800 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-['Outfit',sans-serif] tracking-tight">
              Built for drivers on highway routes.
            </h2>
            <p className="text-base text-slate-600 mt-4 leading-relaxed">
              No complicated training needed. Serviq Mobile App gives drivers a single-tap dashboard to log fuel slips, check assigned vehicles, and report roadside breakdowns in under 60 seconds.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#2335f2] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                Photo Breakdown Reporting
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Take a quick photo of the burst tire, leaking oil, or engine light. Automatic GPS geotagging notifies the fleet manager and assigns the nearest verified workshop.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#2335f2] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                Daily Odometer Sync
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Drivers type or snap their morning odometer. Serviq calculates mileage, fuel efficiency, and automatically rings alerts when preventive oil service is due.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#2335f2] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                Digital Glovebox Documents
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Instant offline access to Vehicle RC, Insurance Certificate, Pollution Under Control (PUC), and National Highway Permits right inside the driver's phone.
              </p>
            </div>

          </div>

          {/* Installation Steps */}
          <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-slate-900 text-white">
            <div className="max-w-3xl">
              <span className="text-xs uppercase tracking-widest text-[#384df2] font-bold">Simple 3-Step Setup</span>
              <h3 className="text-2xl sm:text-3xl font-bold mt-2 font-['Outfit',sans-serif]">How to install the SERVIQ APK</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 text-xs text-slate-300">
                <div className="space-y-2">
                  <div className="w-7 h-7 rounded-full bg-white/10 text-white font-bold flex items-center justify-center text-sm">1</div>
                  <div className="font-semibold text-white">Download APK file</div>
                  <p className="text-slate-400">Click the Download APK button above to save `serviq-fleet.apk` onto your phone.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-7 h-7 rounded-full bg-white/10 text-white font-bold flex items-center justify-center text-sm">2</div>
                  <div className="font-semibold text-white">Allow Unknown Sources</div>
                  <p className="text-slate-400">When prompted by Android Settings, toggle "Allow install from this source" for your browser.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-7 h-7 rounded-full bg-white/10 text-white font-bold flex items-center justify-center text-sm">3</div>
                  <div className="font-semibold text-white">Log in with Mobile Number</div>
                  <p className="text-slate-400">Open the app, enter your driver credentials, and begin logging your vehicle trips instantly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA Button */}
          <div className="mt-16 text-center">
            <button
              onClick={handleApkDownload}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-studio-blue text-white font-bold text-base shadow-xl hover:bg-[#1523c5] transition-all cursor-pointer hover:scale-105"
            >
              <Download className="w-5 h-5" />
              <span>Download SERVIQ APK Now (28 MB)</span>
            </button>
          </div>

        </div>
      </section>

      {/* Footer matching standard Serviq landing page */}
      <footer className="bg-white text-slate-800 border-t-2 border-slate-100 py-12 px-6 sm:px-12 text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-slate-500">
          <div>
            Copyright © 2026 SERVIQ . All rights reserved.
          </div>
          <div className="md:text-right space-y-0.5 leading-relaxed text-xs text-slate-500">
            <div className="font-semibold text-slate-700">SERVIQ By Orcescale</div>
            <div>Location - Chennai, Tamil Nadu, India.</div>
          </div>
        </div>
      </footer>

      {/* Support Modal */}
      <HelpFeedbackModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
    </div>
  );
};
