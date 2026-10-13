import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Bell, Moon, Sun, Menu, User, Settings, LogOut, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';

export const TopHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { openMobileNav, searchQuery, setSearchQuery } = useDashboard();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user?.role === 'admin';
  const basePath = isAdmin ? '/admin' : '/manager';

  const companyName =
    (typeof user?.organization === 'object' && user?.organization?.name) ||
    (typeof user?.organization === 'string' && user?.organization) ||
    'ORCHIDS The International School (SAT)';

  // Keyboard shortcut ⌘K / Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener for dropdowns
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
    : 'AD';

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200/90 z-40 flex items-center justify-between px-3 sm:px-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] select-none">
      {/* LEFT: Logo Serviq + Company Name */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {/* Mobile menu hamburger */}
        <button
          onClick={openMobileNav}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo Serviq */}
        <NavLink
          to={`${basePath}/dashboard`}
          className="flex items-center gap-2 shrink-0 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#2335f2] text-white flex items-center justify-center font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="text-base font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif] hidden sm:inline-block">
            SERVIQ
          </span>
        </NavLink>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-200 shrink-0 hidden sm:block" />

        {/* Company Name */}
        <div className="min-w-0">
          <span
            title={companyName}
            className="text-slate-900 font-bold text-xs sm:text-sm md:text-base tracking-tight font-['Outfit',sans-serif] truncate block max-w-[150px] sm:max-w-xs md:max-w-md lg:max-w-lg"
          >
            {companyName}
          </span>
        </div>
      </div>

      {/* RIGHT: Common Search Bar + Moon Theme Toggle + Notification + Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Common Search Bar */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="pl-9 pr-11 h-9 sm:h-10 w-28 sm:w-48 md:w-64 lg:w-72 rounded-full border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all shadow-2xs"
          />
          <kbd className="absolute right-3 hidden md:inline-flex items-center text-[10px] font-mono font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/90 pointer-events-none">
            ⌘K
          </kbd>
        </div>

        {/* Theme Toggle (Moon Icon) */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          title="Toggle theme"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-2xs cursor-pointer shrink-0"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 stroke-[1.8]" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            title="Notifications"
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            <Bell className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline"
                >
                  Mark all read
                </span>
              </div>
              <div className="py-2 divide-y divide-slate-50 text-xs max-h-72 overflow-y-auto">
                <div className="px-4 py-2.5 hover:bg-slate-50 flex items-start gap-2.5 cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">Fleet Operations Active</p>
                    <p className="text-[11px] text-slate-500">Live vehicles and driver rosters synced.</p>
                  </div>
                </div>
                <div className="px-4 py-2.5 hover:bg-slate-50 flex items-start gap-2.5 cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">Account Health: Normal</p>
                    <p className="text-[11px] text-slate-500">All registered assets compliant with road fitness.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="border border-slate-200 bg-white hover:bg-slate-50 rounded-full py-1 pl-1 pr-3 sm:pr-4 flex items-center gap-2 sm:gap-2.5 shadow-2xs transition-all cursor-pointer text-left"
          >
            {/* Circular Avatar with Amber Border */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-amber-400 bg-amber-50 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-2xs">
              {initials}
            </div>

            {/* User Name & Company Name Stack */}
            <div className="hidden sm:block min-w-0">
              <p className="font-bold text-xs text-slate-900 leading-tight truncate">
                {user?.name || (isAdmin ? 'Admin' : 'Fleet Manager')}
              </p>
              <p className="text-[10px] text-slate-500 leading-tight truncate max-w-[100px] sm:max-w-[140px] md:max-w-[170px]">
                {companyName}
              </p>
            </div>
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.name || 'Administrator'}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700">
                  {user?.role?.replace('_', ' ') || 'Admin'}
                </span>
              </div>

              <div className="py-1 text-xs">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate(`${basePath}/profile`);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
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
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Company Settings</span>
                  </button>
                )}

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
