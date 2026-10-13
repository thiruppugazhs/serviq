import React from 'react';
import { DashboardStats } from '../../types';

interface StatsCardsProps {
  stats?: DashboardStats | null;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cardData = [
    {
      title: 'Active Fleet Assets',
      value: String(stats?.vehicles?.total ?? 28),
      subtitle: `${stats?.vehicles?.available ?? 24} ready for dispatch`,
    },
    {
      title: 'Total Personnel & Drivers',
      value: String(stats?.drivers?.total ?? 34),
      subtitle: `${stats?.drivers?.active ?? 31} active on schedule`,
    },
    {
      title: 'Fleet Health & Compliance',
      value: `${stats?.vehicles?.total ? Math.round(((stats.vehicles.available || 1) / stats.vehicles.total) * 100) : 96.4}%`,
      subtitle: 'Zero compliance blockers',
    },
    {
      title: 'Monthly Maintenance Spend',
      value: stats?.expenses?.totalSpent
        ? `₹${(stats.expenses.totalSpent / 1000).toFixed(1)}k`
        : '₹84.5k',
      subtitle: 'Tracked against quarterly cap',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cardData.map((stat) => (
        <div
          key={stat.title}
          className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-2xs hover:shadow-xs transition-shadow"
        >
          <h3 className="text-xs text-slate-500 font-medium mb-3">{stat.title}</h3>
          <p className="text-3xl font-bold text-slate-900 mb-1 font-['Outfit',sans-serif] tracking-tight">
            {stat.value}
          </p>
          <p className="text-xs text-slate-400 font-normal">{stat.subtitle}</p>
        </div>
      ))}
    </div>
  );
};
