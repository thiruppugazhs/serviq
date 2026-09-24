import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users2,
  UserCheck,
  Truck,
  Wrench,
  AlertTriangle,
  Receipt,
  FileText,
  BarChart3,
  Settings,
  Download,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const basePath = isAdmin ? '/admin' : '/manager';

  const navItems = [
    {
      name: 'Dashboard',
      path: `${basePath}/dashboard`,
      icon: LayoutDashboard,
      roles: ['admin', 'fleet_manager'],
    },
    {
      name: 'Fleet Managers',
      path: '/admin/fleet-managers',
      icon: Users2,
      roles: ['admin'], // Strictly Admin only!
    },
    {
      name: 'Drivers',
      path: `${basePath}/drivers`,
      icon: UserCheck,
      roles: ['admin', 'fleet_manager'],
    },
    {
      name: 'Vehicles',
      path: `${basePath}/vehicles`,
      icon: Truck,
      roles: ['admin', 'fleet_manager'],
    },
    {
      name: 'Maintenance',
      path: `${basePath}/maintenance`,
      icon: Wrench,
      roles: ['admin', 'fleet_manager'],
    },
    {
      name: 'Repairs & Issues',
      path: `${basePath}/repairs`,
      icon: AlertTriangle,
      roles: ['admin', 'fleet_manager'],
    },
    {
      name: 'Expenses',
      path: `${basePath}/expenses`,
      icon: Receipt,
      roles: ['admin', 'fleet_manager'],
    },
    {
      name: 'Documents',
      path: `${basePath}/documents`,
      icon: FileText,
      roles: ['admin', 'fleet_manager'],
    },
    {
      name: 'Reports & Analytics',
      path: `${basePath}/reports`,
      icon: BarChart3,
      roles: ['admin', 'fleet_manager'],
    },
    {
      name: 'Company Settings',
      path: '/admin/settings',
      icon: Settings,
      roles: ['admin'], // Strictly Admin only!
    },
  ];

  const visibleItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/50 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Driver APK Download Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 text-left">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
          <Download className="w-3.5 h-3.5" />
          Driver Android APK
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
          Standalone driver app for mobile devices.
        </p>
        <a
          href="/driver/home"
          className="mt-2.5 block text-center py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
        >
          Open Driver View
        </a>
      </div>
    </aside>
  );
};
