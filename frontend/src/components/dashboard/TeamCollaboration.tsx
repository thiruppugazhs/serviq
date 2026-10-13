import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Member {
  name: string;
  task: string;
  status: string;
  statusColor: string;
  avatar: string;
}

const defaultMembers: Member[] = [
  {
    name: 'Rajesh Kumar',
    task: 'Vehicle MH-12-Q-4521 (Heavy Hauler)',
    status: 'Completed',
    statusColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    avatar: 'RK',
  },
  {
    name: 'Suresh Patel',
    task: 'Vehicle DL-01-A-8832 (Transit Bus)',
    status: 'In Progress',
    statusColor: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    avatar: 'SP',
  },
  {
    name: 'Arun Varma',
    task: 'Vehicle KA-04-E-1092 (Delivery Van)',
    status: 'Scheduled',
    statusColor: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    avatar: 'AV',
  },
  {
    name: 'Manoj Sharma',
    task: 'Vehicle TN-09-B-7740 (Tanker)',
    status: 'In Progress',
    statusColor: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    avatar: 'MS',
  },
];

export const TeamCollaboration: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
          Active Crew & Driver Assignments
        </h2>
        <Link
          to="../drivers"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Member</span>
        </Link>
      </div>

      <div className="space-y-3.5">
        {defaultMembers.map((member) => (
          <div
            key={member.name}
            className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full ring-2 ring-[#2335f2]/20 group-hover:ring-[#2335f2]/40 bg-blue-50 text-[#2335f2] font-bold text-xs flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              {member.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 text-sm">{member.name}</p>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                Assigned: <span className="font-medium text-slate-700">{member.task}</span>
              </p>
            </div>

            <span
              className={`${member.statusColor} text-[11px] px-2.5 py-1 rounded-full font-medium whitespace-nowrap`}
            >
              {member.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
