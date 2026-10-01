import React from 'react';
import { LucideIcon, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="glass-card rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center my-6 bg-white shadow-2xs">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#2335f2] mb-4 shadow-inner">
        <Icon className="w-8 h-8 text-[#2335f2]" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 font-['Outfit',sans-serif]">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mt-1.5 mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2335f2] hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
};
