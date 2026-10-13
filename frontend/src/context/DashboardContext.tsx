import React, { createContext, useContext, useState, useEffect } from 'react';

interface DashboardContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DashboardContext = createContext<DashboardContextType>({
  isCollapsed: false,
  toggleSidebar: () => {},
  isMobileOpen: false,
  openMobileNav: () => {},
  closeMobileNav: () => {},
  searchQuery: '',
  setSearchQuery: () => {},
});

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('serviq_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('serviq_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const openMobileNav = () => setIsMobileOpen(true);
  const closeMobileNav = () => setIsMobileOpen(false);

  // Close mobile nav on resize above lg
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        isCollapsed,
        toggleSidebar,
        isMobileOpen,
        openMobileNav,
        closeMobileNav,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
