import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Wrench, Settings, FileText, Sliders } from 'lucide-react';

export const DriverLayout: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { label: 'Home', path: '/home', icon: Home, active: pathname === '/home' || pathname.startsWith('/odometer') || pathname.startsWith('/notifications') },
    { label: 'Service', path: '/service', icon: Wrench, active: pathname.startsWith('/service') },
    { label: 'Maintenance', path: '/maintenance', icon: Settings, active: pathname.startsWith('/maintenance') },
    { label: 'Expense', path: '/expense', icon: FileText, active: pathname.startsWith('/expense') },
    { label: 'Settings', path: '/settings', icon: Sliders, active: pathname.startsWith('/settings') },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-850 flex flex-col font-sans select-none">
      {/* Mobile-first centered container */}
      <div className="w-full max-w-md mx-auto min-h-screen bg-[#f8fafc] flex flex-col relative pb-20 shadow-md border-x border-slate-100/80">
        
        {/* Main Content Area */}
        <main className="flex-1 w-full overflow-y-auto">
          <Outlet />
        </main>

        {/* Fixed 5-Item Bottom Navigation Bar matching reference */}
        <nav
          aria-label="Bottom Navigation"
          className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200/80 px-2 py-2 flex items-center justify-around z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]"
          style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-colors relative ${
                  isActive ? 'text-[#1b72e8]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4px]' : 'stroke-[1.8px]'}`} />
                </div>
                <span
                  className={`text-[11px] mt-1 font-medium tracking-tight ${
                    isActive ? 'text-[#1b72e8] font-bold' : 'text-slate-500'
                  }`}
                >
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
