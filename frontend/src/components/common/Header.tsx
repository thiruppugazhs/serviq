import React from 'react';

interface HeaderProps {
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, description, actions }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-5">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 font-['Anek_Latin',sans-serif] tracking-tight">
          {title}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};
