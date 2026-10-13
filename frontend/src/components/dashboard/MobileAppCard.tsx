import React from 'react';
import { Smartphone, Apple } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MobileAppCard: React.FC = () => {
  return (
    <div className="bg-slate-950 text-white p-5 sm:p-6 rounded-xl transition-all duration-300 hover:shadow-xl overflow-hidden relative group flex flex-col justify-between">
      {/* Wave bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none">
        <svg
          className="absolute bottom-0 w-full"
          viewBox="0 0 200 60"
          preserveAspectRatio="none"
          style={{ height: '90px' }}
        >
          <path
            d="M0,30 Q25,15 50,30 T100,30 T150,30 T200,30 L200,60 L0,60 Z"
            fill="#2335f2"
            opacity="0.3"
          />
          <path
            d="M0,40 Q25,25 50,40 T100,40 T150,40 T200,40 L200,60 L0,60 Z"
            fill="#2335f2"
            opacity="0.75"
          />
        </svg>
      </div>

      <div className="relative z-10">
        <Smartphone className="w-6 h-6 mb-3 text-blue-400" />
        <h2 className="text-xl font-bold mb-1 font-['Outfit',sans-serif] text-white">
          SERVIQ Driver App
        </h2>
        <p className="text-xs text-slate-300 mb-5">
          Driver pre-trip check, digital logs & trip manifest
        </p>

        <div className="flex flex-col gap-2.5">
          <Link
            to="/download-app"
            className="w-full h-10 bg-white text-slate-900 hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-[0.99] rounded-lg flex items-center justify-start gap-2.5 px-3.5 shadow-sm"
          >
            <Apple className="w-5 h-5 shrink-0" />
            <div className="flex flex-col items-start text-left">
              <span className="text-[10px] leading-none text-slate-500">Download on the</span>
              <span className="text-xs font-bold leading-none mt-0.5">App Store</span>
            </div>
          </Link>

          <Link
            to="/download-app"
            className="w-full h-10 bg-white text-slate-900 hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-[0.99] rounded-lg flex items-center justify-start gap-2.5 px-3.5 shadow-sm"
          >
            <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            <div className="flex flex-col items-start text-left">
              <span className="text-[10px] leading-none text-slate-500">Get it on</span>
              <span className="text-xs font-bold leading-none mt-0.5">Google Play</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
