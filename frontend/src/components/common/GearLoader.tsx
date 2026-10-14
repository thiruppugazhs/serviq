import React from 'react';
import { Cog } from 'lucide-react';

interface GearLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  text?: string;
  fullScreen?: boolean;
  theme?: 'dark' | 'light' | 'transparent';
  className?: string;
}

export const GearIcon: React.FC<{ className?: string; size?: number | string }> = ({
  className = 'w-10 h-10 text-emerald-500',
}) => {
  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Primary Mechanical Rotating Gear */}
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`animate-spin ${className}`}
        style={{ animationDuration: '2.5s' }}
        aria-hidden="true"
      >
        <path d="M12 15.5C10.07 15.5 8.5 13.93 8.5 12C8.5 10.07 10.07 8.5 12 8.5C13.93 8.5 15.5 10.07 15.5 12C15.5 13.93 13.93 15.5 12 15.5ZM19.43 12.98C19.47 12.66 19.5 12.33 19.5 12C19.5 11.67 19.47 11.34 19.43 11.02L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.97 19.05 5.05L16.56 6.05C16.04 5.65 15.48 5.32 14.87 5.07L14.49 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.51 2.42L9.13 5.07C8.52 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.73 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.21 8.95 2.27 9.22 2.46 9.37L4.57 11.02C4.53 11.34 4.5 11.67 4.5 12C4.5 12.33 4.53 12.66 4.57 12.98L2.46 14.63C2.27 14.78 2.21 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.03 4.95 18.95L7.44 17.95C7.96 18.35 8.52 18.68 9.13 18.93L9.51 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.49 21.58L14.87 18.93C15.48 18.68 16.04 18.34 16.56 17.95L19.05 18.95C19.27 19.04 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.98Z" />
      </svg>
    </div>
  );
};

export const DualGearLoader: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}> = ({ size = 'md', color = 'text-emerald-500', className = '' }) => {
  const sizeMap = {
    sm: { main: 'w-6 h-6', sub: 'w-4 h-4', offset: '-right-2 -bottom-1' },
    md: { main: 'w-10 h-10', sub: 'w-6 h-6', offset: '-right-3 -bottom-1.5' },
    lg: { main: 'w-14 h-14', sub: 'w-8 h-8', offset: '-right-4 -bottom-2' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Primary Gear (Clockwise) */}
      <GearIcon className={`${currentSize.main} ${color}`} />

      {/* Secondary Interlocking Gear (Counter-Clockwise) */}
      <div
        className={`absolute ${currentSize.offset} animate-spin`}
        style={{ animationDirection: 'reverse', animationDuration: '2s' }}
      >
        <Cog className={`${currentSize.sub} opacity-70 ${color}`} />
      </div>
    </div>
  );
};

export const GearLoader: React.FC<GearLoaderProps> = ({
  size = 'md',
  color = 'text-emerald-500',
  text,
  fullScreen = false,
  theme = 'dark',
  className = '',
}) => {
  const sizeClass = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16',
  }[size];

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3.5 ${className}`}>
      <DualGearLoader size={size === 'xl' ? 'lg' : size} color={color} />
      {text && (
        <p
          className={`text-xs sm:text-sm font-medium tracking-tight animate-pulse ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    const bgClass =
      theme === 'dark'
        ? 'bg-slate-950 text-white'
        : theme === 'light'
        ? 'bg-[#f8fafc] text-slate-900'
        : 'bg-transparent';

    return (
      <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 ${bgClass}`}>
        {content}
      </div>
    );
  }

  return content;
};
