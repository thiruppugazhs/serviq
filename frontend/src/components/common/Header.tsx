import React, { useState, useRef, useEffect } from 'react';
import { Search, Mail, Bell, Menu, User, Settings, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';
import { useNavigate } from 'react-router-dom';
import { HelpFeedbackModal } from '../support/HelpFeedbackModal';

interface HeaderProps {
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, description, actions }) => {
  const { user, logout } = useAuth();
  const { openMobileNav, searchQuery, setSearchQuery } = useDashboard();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'admin';
  const basePath = isAdmin ? '/admin' : '/manager';

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'SQ';

  return (
    <>
      <header className="space-y-4 mb-4 md:mb-5">
        {/* Top utility row */}
        <div className="flex items-center justify-between gap-3">
          {/* Mobile hamburger + Search input */}
          <div className="flex items-center gap-2 flex-1">
            <button
              onClick={openMobileNav}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              title="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 h-9 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2335f2] focus:border-[#2335f2] transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Right action icons & User Profile pill */}
          <div className="flex items-center gap-2">
            {/* Mail / Support icon button */}
            <button
              onClick={() => setSupportModalOpen(true)}
              className="h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
              title="Help & Support Desk"
            >
              <Mail className="w-4 h-4" />
            </button>

            {/* Bell Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full ring-2 ring-white" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">Mark read</span>
                  </div>
                  <div className="py-2 divide-y divide-slate-50 text-xs">
                    <div className="px-4 py-2 hover:bg-slate-50 flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-800">Fleet Operations Active</p>
                        <p className="text-[11px] text-slate-500">Live vehicles and driver rosters synced.</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-50 flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-800">Account Health: Normal</p>
                        <p className="text-[11px] text-slate-500">All systems operating normally.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Chip */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-2 ml-1 border-l border-slate-200 hover:opacity-90 transition-opacity text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#2335f2] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                  {initials}
                </div>
                <div className="text-xs hidden lg:block">
                  <p className="font-medium text-slate-900 leading-tight truncate max-w-[120px]">
                    {user?.name || 'Fleet Admin'}
                  </p>
                  <p className="text-slate-500 text-[10px] leading-tight truncate max-w-[120px]">
                    {user?.email || 'admin@serviq.in'}
                  </p>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700">
                      {user?.role?.replace('_', ' ')}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate(`${basePath}/profile`);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Profile</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate('/admin/settings');
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Company Settings</span>
                    </button>
                  )}

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Title & Subtitle + Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {description}
            </p>
          </div>

          {actions && (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {actions}
            </div>
          )}
        </div>
      </header>

      {/* Help & Support Modal */}
      {supportModalOpen && (
        <HelpFeedbackModal
          isOpen={supportModalOpen}
          onClose={() => setSupportModalOpen(false)}
        />
      )}
    </>
  );
};
