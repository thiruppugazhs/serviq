import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Reminders: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all">
      <h2 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif] mb-4">
        Upcoming Service Audits
      </h2>

      <div className="space-y-3.5">
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 transition-all hover:border-blue-300 hover:bg-white hover:shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2335f2] bg-blue-50 px-2 py-0.5 rounded-md">
              RTO Compliance
            </span>
            <span className="text-xs text-slate-400 font-medium">Tomorrow</span>
          </div>

          <h3 className="font-bold text-slate-900 text-sm mb-1">
            Fleet Safety & Fitness Certification
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Time: 10:00 AM - 01:00 PM • Central Depot
          </p>

          <Link
            to="../maintenance"
            className="w-full bg-[#2335f2] hover:bg-blue-700 text-white font-medium text-xs py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Review Inspection Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
