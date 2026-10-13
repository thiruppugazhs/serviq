import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../../api/client';

export const ProjectAnalytics: React.FC = () => {
  const [data, setData] = useState([
    { day: 'Sun', value: 0, label: 'Sunday' },
    { day: 'Mon', value: 0, label: 'Monday' },
    { day: 'Tue', value: 0, label: 'Tuesday' },
    { day: 'Wed', value: 0, label: 'Wednesday' },
    { day: 'Thu', value: 0, label: 'Thursday' },
    { day: 'Fri', value: 0, label: 'Friday' },
    { day: 'Sat', value: 0, label: 'Saturday' },
  ]);
  const [hasActivity, setHasActivity] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await api.get('/reports/dashboard-stats');
        if (res.data?.success && res.data.stats?.trips?.completed) {
          // If real activity is present
          setHasActivity(true);
        }
      } catch (err) {
        console.warn('Analytics warning:', err);
      }
    };
    fetchActivity();
  }, []);

  const maxValue = Math.max(...data.map((d) => d.value));
  const average = Math.round(data.reduce((acc, d) => acc + d.value, 0) / data.length);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-lg">
          <p className="font-bold">{payload[0].value}%</p>
          <p className="text-[10px] opacity-80">{payload[0].payload.label}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-slate-900 font-['Anek_Latin',sans-serif]">
          Fleet Operational Activity
        </h2>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <div className="w-2 h-2 rounded-full bg-[#2335f2]"></div>
          <span>Weekly Utilization</span>
        </div>
      </div>

      <div className="h-60 mb-3 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fleetBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2335f2" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar
              dataKey="value"
              fill="url(#fleetBarGradient)"
              radius={[10, 10, 10, 10]}
              maxBarSize={52}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
        <div>
          <span className="text-slate-400 font-medium block">Average Utilization</span>
          <span className="text-base font-bold text-slate-800 font-['Anek_Latin',sans-serif]">
            {average}%
          </span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 font-medium block">Peak Dispatch Day</span>
          <span className="text-base font-bold text-slate-700 font-['Anek_Latin',sans-serif]">
            {maxValue > 0 ? `Peak (${maxValue}%)` : 'No dispatches recorded'}
          </span>
        </div>
      </div>
    </div>
  );
};
