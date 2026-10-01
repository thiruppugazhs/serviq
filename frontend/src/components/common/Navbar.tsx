import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User as UserIcon, Shield, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const orgName = typeof user?.organization === 'object' ? user.organization.name : 'SERVIQ Enterprise';

  const roleLabels: Record<string, string> = {
    admin: 'Organization Admin',
    fleet_manager: 'Fleet Manager',
    driver: 'Commercial Driver',
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo-blue.png" alt="SERVIQ" className="w-8 h-8 object-contain drop-shadow-xs" />
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 font-['Outfit',sans-serif]">
              SERVIQ
            </span>
            <span className="text-[10px] text-[#2335f2] font-semibold uppercase tracking-wider block -mt-1">
              Fleet Command
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center h-5 border-l border-slate-200 pl-4">
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
            🏢 {orgName}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user?.role !== 'driver' && (
          <Link
            to="/driver/home"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            title="Preview Driver Mobile Experience"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#2335f2]" />
            Driver App View
          </Link>
        )}

        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2335f2] text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4" />}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-tight">{user?.name}</div>
            <div className="text-[11px] text-[#2335f2] font-medium leading-tight">
              {roleLabels[user?.role || ''] || user?.role}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
