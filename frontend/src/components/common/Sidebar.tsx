import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';
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
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isCollapsed, toggleSidebar, isMobileOpen, closeMobileNav } = useDashboard();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';
  const basePath = isAdmin ? '/admin' : '/manager';

  const workspaceItems = [
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
      roles: ['admin'],
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
  ];

  const generalItems = [
    ...(isAdmin
      ? [
          {
            name: 'Company Settings',
            path: '/admin/settings',
            icon: Settings,
          },
        ]
      : []),
    {
      name: 'My Profile',
      path: `${basePath}/profile`,
      icon: UserCheck,
    },
    {
      name: 'Driver App (APK)',
      path: '/download-app',
      icon: Download,
    },
  ];

  const visibleWorkspaceItems = workspaceItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  const sidebarContent = (collapsed: boolean, isMobile: boolean = false) => (
    <div className={`p-4 flex flex-col justify-between min-h-full ${collapsed ? 'px-2' : ''}`}>
      <div>
        {/* Header brand + collapse toggle */}
        <div className={`mb-6 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <NavLink to={`${basePath}/dashboard`} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[#2335f2] text-white flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
                S
              </div>
              <span className="text-base font-bold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
                SERVIQ
              </span>
            </NavLink>
          )}

          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-[#2335f2] text-white flex items-center justify-center font-black text-sm shadow-sm">
              S
            </div>
          )}

          {isMobile ? (
            <button
              onClick={closeMobileNav}
              className="h-7 w-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={toggleSidebar}
              className={`h-7 w-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors ${
                collapsed ? 'mx-auto mt-2' : ''
              }`}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronLeft className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="space-y-5">
          {/* Workspace */}
          <div>
            {!collapsed && (
              <p className="text-[10px] font-semibold text-slate-400 mb-2 uppercase tracking-wide px-2">
                WORKSPACE
              </p>
            )}
            <nav className="space-y-0.5">
              {visibleWorkspaceItems.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => isMobile && closeMobileNav()}
                    title={collapsed ? item.name : undefined}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-[#2335f2]/10 text-[#2335f2] font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-normal'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${collapsed ? 'w-5 h-5' : ''}`} />
                    {!collapsed && (
                      <span className="text-sm truncate">{item.name}</span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* General */}
          <div>
            {!collapsed && (
              <p className="text-[10px] font-semibold text-slate-400 mb-2 uppercase tracking-wide px-2">
                GENERAL
              </p>
            )}
            <nav className="space-y-0.5">
              {generalItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => isMobile && closeMobileNav()}
                    title={collapsed ? item.name : undefined}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-[#2335f2]/10 text-[#2335f2] font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-normal'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${collapsed ? 'w-5 h-5' : ''}`} />
                    {!collapsed && <span className="text-sm truncate">{item.name}</span>}
                  </NavLink>
                );
              })}

              {/* Logout Button */}
              <button
                onClick={() => {
                  if (isMobile) closeMobileNav();
                  logout();
                }}
                title={collapsed ? 'Logout' : undefined}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors text-rose-600 hover:bg-rose-50 font-normal ${
                  collapsed ? 'justify-center' : ''
                }`}
              >
                <LogOut className={`w-4 h-4 shrink-0 ${collapsed ? 'w-5 h-5' : ''}`} />
                {!collapsed && <span className="text-sm truncate">Logout</span>}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Fixed Sidebar */}
      <aside
        className={`hidden lg:block fixed top-0 left-0 bg-white border-r border-slate-200 h-screen overflow-y-auto transition-all duration-300 ease-in-out z-30 ${
          isCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent(isCollapsed, false)}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={closeMobileNav}
          />
          <aside className="fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-200 overflow-y-auto shadow-xl z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent(false, true)}
          </aside>
        </div>
      )}
    </>
  );
};
