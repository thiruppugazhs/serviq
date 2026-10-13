import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const fleetAssets = [
  { name: 'Tata Prima 5530.S', reg: 'MH-12-Q-4521', date: 'Next FC: Nov 28, 2026', color: 'bg-blue-500', icon: '🚛' },
  { name: 'BharatBenz 3523R', reg: 'KA-04-E-1092', date: 'Next FC: Dec 05, 2026', color: 'bg-emerald-500', icon: '🚚' },
  { name: 'Ashok Leyland Oyster', reg: 'DL-01-A-8832', date: 'Next FC: Dec 12, 2026', color: 'bg-purple-500', icon: '🚌' },
  { name: 'Eicher Pro 3019', reg: 'TN-09-B-7740', date: 'Next FC: Dec 20, 2026', color: 'bg-amber-500', icon: '🚛' },
  { name: 'Force Urbania Express', reg: 'GJ-06-M-3301', date: 'Next FC: Jan 04, 2027', color: 'bg-rose-500', icon: '🚐' },
];

export const ProjectList: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
            Active Fleet Registry Highlights
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Key commercial haulers and upcoming fitness milestones
          </p>
        </div>

        <Link
          to="../vehicles"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>View All Vehicles</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {fleetAssets.map((asset) => (
          <div
            key={asset.reg}
            className="flex flex-col justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-200 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`${asset.color} w-9 h-9 rounded-lg flex items-center justify-center text-lg shadow-xs text-white shrink-0 group-hover:scale-105 transition-transform`}
              >
                {asset.icon}
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200/80 shadow-2xs">
                {asset.reg}
              </span>
            </div>

            <div>
              <p className="font-semibold text-slate-900 text-xs truncate">
                {asset.name}
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-1">
                {asset.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
