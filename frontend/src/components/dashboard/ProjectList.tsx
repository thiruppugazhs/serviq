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
        <h2 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
          Active Fleet Assets
        </h2>
        <Link
          to="../vehicles"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </Link>
      </div>

      <div className="space-y-3">
        {fleetAssets.map((asset) => (
          <div
            key={asset.reg}
            className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
          >
            <div
              className={`${asset.color} w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 text-white shrink-0`}
            >
              {asset.icon}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 text-sm truncate">
                {asset.name}
              </p>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                <span className="font-mono font-medium text-slate-700">{asset.reg}</span> • {asset.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
