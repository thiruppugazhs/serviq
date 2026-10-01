import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutGrid,
  AlertTriangle,
  MapPin,
  BookOpen,
  ChevronDown,
  LogOut,
  Settings,
  Smartphone,
  ExternalLink,
  Bell,
  HelpCircle,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [profileOpen, setProfileOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(e.target as Node)) {
        setAlertsOpen(false);
      }
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setHelpOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdmin = user?.role === 'admin';
  const basePath = isAdmin ? '/admin' : '/manager';

  const roleLabels: Record<string, string> = {
    admin: 'Organization Admin',
    fleet_manager: 'Fleet Manager',
    driver: 'Commercial Driver',
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'T';

  const languages = [
    { label: 'English', flag: '🇬🇧' },
    { label: 'Español', flag: '🇪🇸' },
    { label: 'Français', flag: '🇫🇷' },
    { label: 'Deutsch', flag: '🇩🇪' },
    { label: 'தமிழ்', flag: '🇮🇳' },
  ];

  return (
    <header className="h-14 border-b border-slate-200/80 bg-white sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between shadow-2xs font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Left Section: "md" & "Dashboard" Tab */}
      <div className="flex items-center gap-3">
        {/* Subtle tag / indicator "md" */}
        <span className="text-xs font-bold text-slate-400 select-none tracking-tight">
          md
        </span>

        {/* Active Tab: Dashboard */}
        <Link
          to={`${basePath}/dashboard`}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-900 border border-slate-200/60 text-xs font-bold transition-all shadow-2xs"
        >
          <div className="w-4 h-4 grid grid-cols-2 gap-0.5 p-0.5 rounded bg-slate-900 text-white shrink-0">
            <div className="w-1 h-1 bg-white rounded-[0.5px]" />
            <div className="w-1 h-1 bg-white rounded-[0.5px]" />
            <div className="w-1 h-1 bg-white rounded-[0.5px]" />
            <div className="w-1 h-1 bg-white rounded-[0.5px]" />
          </div>
          <span className="leading-none">Dashboard</span>
        </Link>
      </div>

      {/* Right Section: Alert, Map, Help, Language, User Pill */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Alert Icon Button */}
        <div className="relative" ref={alertsRef}>
          <button
            onClick={() => setAlertsOpen(!alertsOpen)}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-colors"
            title="System & Fleet Alerts"
          >
            <AlertTriangle className="w-4 h-4 text-slate-900 stroke-[2.2]" />
          </button>

          {alertsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-bold text-slate-900">Fleet Alerts</span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  All Systems Clear
                </span>
              </div>
              <p className="text-xs text-slate-500 py-3 text-center">
                No active critical breakdowns or overdue compliance warnings.
              </p>
              <Link
                to={`${basePath}/repairs`}
                onClick={() => setAlertsOpen(false)}
                className="block text-center text-xs font-semibold text-blue-600 hover:text-blue-700 pt-1"
              >
                View Issue Tickets →
              </Link>
            </div>
          )}
        </div>

        {/* Map / Location Pin Icon Button */}
        <Link
          to={`${basePath}/vehicles`}
          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-colors"
          title="Vehicle Map & Fleet Location"
        >
          <MapPin className="w-4 h-4 text-slate-900 stroke-[2.2]" />
        </Link>

        {/* Help / Docs Icon Button */}
        <div className="relative" ref={helpRef}>
          <button
            onClick={() => setHelpOpen(!helpOpen)}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-colors"
            title="Help & Knowledge Base"
          >
            <BookOpen className="w-4 h-4 text-slate-900 stroke-[2.2]" />
          </button>

          {helpOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1 text-xs font-bold text-slate-900">Quick Help</div>
              <div className="divide-y divide-slate-100 text-xs">
                <Link
                  to="/admin/settings"
                  onClick={() => setHelpOpen(false)}
                  className="block px-2 py-2 text-slate-600 hover:text-blue-600"
                >
                  Setup Guide & Configuration
                </Link>
                <Link
                  to="/download"
                  onClick={() => setHelpOpen(false)}
                  className="block px-2 py-2 text-slate-600 hover:text-blue-600"
                >
                  Download Driver & Desktop App
                </Link>
                <a
                  href="mailto:support@serviq.in"
                  className="block px-2 py-2 text-slate-600 hover:text-blue-600"
                >
                  Contact Support
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Language Selector Pill */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="h-8 px-2.5 sm:px-3 rounded-full bg-slate-100 hover:bg-slate-200/90 flex items-center gap-1.5 text-xs font-semibold text-slate-800 transition-colors border border-transparent shadow-2xs"
          >
            <span className="text-sm">🇬🇧</span>
            <span className="hidden sm:inline">{selectedLang}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {langOpen && (
            <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              {languages.map((lang) => (
                <button
                  key={lang.label}
                  onClick={() => {
                    setSelectedLang(lang.label);
                    setLangOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                    selectedLang === lang.label
                      ? 'text-blue-600 font-bold bg-blue-50/60'
                      : 'text-slate-700'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="h-8 pl-1 pr-2.5 sm:pr-3.5 rounded-full bg-slate-100 hover:bg-slate-200/90 flex items-center gap-2 text-xs font-semibold text-slate-800 transition-colors border border-transparent shadow-2xs cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
              {initial}
            </div>
            <span className="max-w-[100px] sm:max-w-[130px] truncate font-semibold text-slate-900">
              {user?.name || 'Thiruppugazh Srinivasan'}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {user?.name}
                </div>
                <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                <div className="mt-1 inline-flex items-center text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  {roleLabels[user?.role || ''] || user?.role}
                </div>
              </div>

              {user?.role !== 'driver' && (
                <Link
                  to="/driver/home"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium"
                >
                  <Smartphone className="w-4 h-4 text-slate-500" />
                  <span>Driver Mobile View</span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Company Settings</span>
                </Link>
              )}

              <button
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium mt-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
