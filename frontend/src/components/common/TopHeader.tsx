import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Bell, Moon, Sun, Menu, User, Settings, LogOut, CheckCircle2, ShieldCheck, AlertTriangle, FileText, Clock } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';

export const TopHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { openMobileNav, searchQuery, setSearchQuery } = useDashboard();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user?.role === 'admin';
  const basePath = isAdmin ? '/admin' : '/manager';

  const companyName =
    (typeof user?.organization === 'object' && user?.organization?.name) ||
    (typeof user?.organization === 'string' && user?.organization) ||
    'ORCHIDS The International School (SAT)';

  // Fetch real notifications (including 2-week document expiration alerts)
  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data?.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      // Keep silent on background polling
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

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
          className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
        >
          <img
            src="/logo-icon.png"
            alt="SERVIQ Logo"
            className="h-8 w-auto object-contain group-hover:scale-105 transition-transform"
          />
          <img
            src="/serviq-name-black.png"
            alt="SERVIQ"
            className="h-5 w-auto object-contain hidden sm:inline-block"
          />
        </NavLink>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-200 shrink-0 hidden sm:block" />

        {/* Company Name */}
        <div className="min-w-0">
          <span
            title={companyName}
            className="text-slate-900 font-bold text-xs sm:text-sm md:text-base tracking-tight font-['Anek_Latin',sans-serif] truncate block max-w-[150px] sm:max-w-xs md:max-w-md lg:max-w-lg"
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
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              if (!notificationsOpen) fetchNotifications();
            }}
            title="Notifications"
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            <Bell className="w-4 h-4 text-slate-700 stroke-[1.8]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-88 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-1.5 py-0.2 rounded-full border border-rose-200">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-[#2335f2] font-semibold cursor-pointer hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="py-1 divide-y divide-slate-100 text-xs max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    <Bell className="w-7 h-7 mx-auto text-slate-300 mb-1.5 stroke-[1.5]" />
                    <p className="font-semibold text-slate-700">No notifications</p>
                    <p className="text-[11px] mt-0.5">You're completely up to date.</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const isDoc = notif.type === 'document';
                    const isExp = notif.title?.toLowerCase().includes('expired');

                    return (
                      <div
                        key={notif._id || notif.id}
                        onClick={() => {
                          if (notif.link) {
                            navigate(notif.link);
                            setNotificationsOpen(false);
                          }
                        }}
                        className={`px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer ${
                          !notif.isRead ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isExp
                              ? 'bg-rose-100 text-rose-600'
                              : isDoc
                              ? 'bg-amber-100 text-amber-600'
                              : 'bg-blue-100 text-[#2335f2]'
                          }`}
                        >
                          {isDoc ? (
                            <FileText className="w-4 h-4" />
                          ) : (
                            <Bell className="w-4 h-4" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-bold text-xs text-slate-900 truncate">
                              {notif.title}
                            </p>
                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                            {new Date(notif.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
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
