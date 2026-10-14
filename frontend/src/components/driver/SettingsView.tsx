import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { driverService, OrganizationInfo, FleetManagerContact, AdminContact } from '../../services/driverService';
import {
  ArrowLeft,
  Truck,
  User,
  Camera,
  Phone,
  Shield,
  Users,
  LogOut,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [org] = useState<OrganizationInfo>(driverService.getOrganization());
  const [manager] = useState<FleetManagerContact>(driverService.getFleetManagerContact());
  const [admin] = useState<AdminContact>(driverService.getAdminContact());
  const profile = driverService.getProfile();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="p-4 sm:p-5 space-y-4">
      {/* Top Header */}
      <div className="flex items-center gap-2 pb-1">
        <button
          onClick={() => navigate('/home')}
          className="p-1 -ml-1 text-slate-700 hover:text-slate-900 transition"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2px]" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Settings</h1>
      </div>

      {/* Organization Card at Top */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1b72e8] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Truck className="w-6 h-6 stroke-[2.2px]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">{org.name}</h2>
            <span className="text-xs text-slate-400 font-medium block mt-0.5">{org.subtitle}</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300" />
      </div>

      {/* Settings Options List */}
      <div className="space-y-3 pt-1">
        {/* Edit Driver Details */}
        <div
          onClick={() => navigate('/settings/driver')}
          className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs flex items-center justify-between cursor-pointer hover:border-blue-100 transition"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1b72e8] flex items-center justify-center shrink-0">
              <User className="w-5 h-5 stroke-[2.2px]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Edit Driver Details</h3>
              <span className="text-[11px] text-slate-400 block mt-0.5">Update personal details & license</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>

        {/* Name & Profile Photo */}
        <div
          onClick={() => navigate('/settings/profile')}
          className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs flex items-center justify-between cursor-pointer hover:border-blue-100 transition"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1b72e8] flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5 stroke-[2.2px]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Name & Profile Photo</h3>
              <span className="text-[11px] text-slate-400 block mt-0.5">Change your display name & photo</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>

        {/* Contact Fleet Manager */}
        <a
          href={`tel:${manager.phone.replace(/\s+/g, '')}`}
          className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs flex items-center justify-between cursor-pointer hover:border-blue-100 transition block"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1b72e8] flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 stroke-[2.2px]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Contact Fleet Manager</h3>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5">{manager.phone}</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </a>

        {/* Admin Details */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1b72e8] flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 stroke-[2.2px]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Admin Details</h3>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                admin Team: {admin.team}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>

        {/* Team Change */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1b72e8] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 stroke-[2.2px]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Team Change</h3>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                Current Team: {profile.team}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/settings/team')}
            className="px-3 py-1.5 bg-[#1b72e8] hover:bg-[#1558b0] active:scale-95 text-white text-xs font-semibold rounded-lg shadow-xs transition shrink-0"
          >
            Change Team
          </button>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full bg-white rounded-2xl border border-red-100 p-4 shadow-2xs flex items-center justify-between text-left hover:bg-red-50/30 transition group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <LogOut className="w-5 h-5 stroke-[2.2px]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-red-600">Log Out</h3>
              <span className="text-[11px] text-slate-400 block mt-0.5">Sign out of driver session</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-red-300" />
        </button>
      </div>
    </div>
  );
};
