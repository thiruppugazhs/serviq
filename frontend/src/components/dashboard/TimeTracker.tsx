import React, { useState, useEffect } from 'react';
import { Pause, Play, Square } from 'lucide-react';

export const TimeTracker: React.FC = () => {
  const [seconds, setSeconds] = useState(8 * 3600 + 42 * 60 + 15);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const formatTime = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="bg-slate-950 text-white p-5 sm:p-6 rounded-xl transition-all duration-300 hover:shadow-xl overflow-hidden relative group flex flex-col justify-between">
      {/* Background wave grid lines */}
      <div className="absolute top-0 right-0 w-48 h-full opacity-15 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <svg
            key={i}
            className="absolute"
            style={{
              top: `${i * 45}px`,
              right: `-${i * 8}px`,
              width: '150px',
              height: '70px',
            }}
            viewBox="0 0 100 50"
            preserveAspectRatio="none"
          >
            <path
              d="M0,25 Q12.5,10 25,25 T50,25 T75,25 T100,25"
              fill="none"
              stroke="#2335f2"
              strokeWidth="2"
            />
          </svg>
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
            Fleet Shift Timer
          </h2>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <p className="text-xs text-slate-400 mb-4">Central Dispatch Active Window</p>

        <div className="text-4xl sm:text-5xl font-mono font-bold mb-5 tracking-tight text-white drop-shadow-sm">
          {formatTime(hours)}:{formatTime(minutes)}:{formatTime(secs)}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-10 h-10 rounded-full bg-white text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-md cursor-pointer"
            title={isRunning ? 'Pause Timer' : 'Resume Timer'}
          >
            {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => {
              setSeconds(0);
              setIsRunning(false);
            }}
            className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-md cursor-pointer"
            title="Reset Timer"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
