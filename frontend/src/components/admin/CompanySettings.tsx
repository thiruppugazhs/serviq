import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, Mail, Phone, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

export const CompanySettings: React.FC = () => {
  const { user } = useAuth();
  const org = typeof user?.organization === 'object' ? user.organization : null;

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-white font-['Outfit',sans-serif]">
          Company & Organization Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          View registered organization identity and subscription details.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-emerald-950/50">
            {org?.name?.charAt(0).toUpperCase() || 'C'}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Registered Organization
            </div>
            <h2 className="text-xl font-bold text-white font-['Outfit',sans-serif]">
              {org?.name}
            </h2>
            <p className="text-xs text-slate-400">{org?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Company Name</span>
            <div className="font-semibold text-white text-sm">{org?.name}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Official Contact Email</span>
            <div className="font-semibold text-white text-sm">{org?.email}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Phone Number</span>
            <div className="font-semibold text-white text-sm">{org?.phone || 'Not provided'}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Registration / Tax Number</span>
            <div className="font-semibold text-white font-mono text-sm">
              {org?.registrationNumber || 'Not specified'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
          <span className="text-slate-400 font-medium">Headquarters / Fleet Depot Address</span>
          <div className="font-semibold text-white">{org?.address || 'No address specified'}</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-emerald-300">
            Organization account active under Enterprise fleet tier with role-based access control.
          </span>
        </div>
      </div>
    </div>
  );
};
