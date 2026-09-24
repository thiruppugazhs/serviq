import React from 'react';

interface BadgeProps {
  status: string;
  variant?: 'solid' | 'subtle';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, variant = 'subtle', size = 'sm' }) => {
  const normalized = status?.toLowerCase() || '';

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';

  if (['active', 'available', 'good', 'completed', 'valid'].includes(normalized)) {
    colorClasses = variant === 'solid' 
      ? 'bg-emerald-600 text-white border-transparent' 
      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  } else if (['due_soon', 'in_progress', 'expiring_soon', 'medium', 'warning', 'on_trip'].includes(normalized)) {
    colorClasses = variant === 'solid'
      ? 'bg-amber-600 text-white border-transparent'
      : 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else if (['overdue', 'inactive', 'in_shop', 'out_of_service', 'critical', 'high', 'expired', 'rejected'].includes(normalized)) {
    colorClasses = variant === 'solid'
      ? 'bg-rose-600 text-white border-transparent'
      : 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  } else if (['reported', 'low', 'contract', 'probation'].includes(normalized)) {
    colorClasses = variant === 'solid'
      ? 'bg-sky-600 text-white border-transparent'
      : 'bg-sky-500/10 text-sky-400 border-sky-500/30';
  }

  const formatText = (text: string) => {
    return text.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${colorClasses} ${sizeClass}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80"></span>
      {formatText(status)}
    </span>
  );
};
