import React, { useEffect, useState } from 'react';
import api from '../../api/client';

export const ProjectProgress: React.FC = () => {
  const [counts, setCounts] = useState({ total: 0, available: 0, inShop: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await api.get('/vehicles');
        if (res.data?.success) {
          const list = res.data.vehicles || [];
          const total = list.length;
          const available = list.filter((v: any) => v.status === 'available').length;
          const inShop = list.filter((v: any) => v.status === 'in_shop').length;
          setCounts({ total, available, inShop });
        }
      } catch (err) {
        console.warn('ProjectProgress fetch warning:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const progress = counts.total > 0
    ? Math.round((counts.available / counts.total) * 100)
    : 100;

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all overflow-hidden">
      <h2 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif] mb-4">
        Fleet Service Compliance
      </h2>

      <div className="flex flex-col items-center">
        <div className="relative w-44 h-44 mb-4">
          <div
            className="absolute inset-0 rounded-full opacity-10"
            style={{
              background:
                'repeating-linear-gradient(45deg, transparent, transparent 6px, #2335f2 6px, #2335f2 12px)',
            }}
          />

          <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#e2e8f0"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#2335f2"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
              {counts.total === 0 ? '100' : progress}%
            </span>
            <span className="text-xs text-slate-400 font-medium mt-0.5">
              {counts.total === 0 ? 'Fleet Ready' : `${counts.available} of ${counts.total} Ready`}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3.5 text-xs pt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2335f2] shrink-0" />
            <span className="text-slate-600 font-medium whitespace-nowrap">Available ({counts.available})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 shrink-0" />
            <span className="text-slate-600 font-medium whitespace-nowrap">In Service ({counts.inShop})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
            <span className="text-slate-600 font-medium whitespace-nowrap">Total Assets ({counts.total})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
