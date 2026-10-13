import React from 'react';
import { DashboardStats } from '../../types';

interface StatsCardsProps {
  stats?: DashboardStats | null;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const totalVehicles = stats?.vehicles?.total ?? 0;
  const availableVehicles = stats?.vehicles?.available ?? 0;
  const totalDrivers = stats?.drivers?.total ?? 0;
  const activeDrivers = stats?.drivers?.active ?? 0;
  const totalSpent = stats?.expenses?.totalSpent ?? 0;

  const complianceRate = totalVehicles > 0
    ? Math.round((availableVehicles / totalVehicles) * 100)
    : 100;

  const cardData = [
    {
      title: 'Active Fleet Assets',
      value: String(totalVehicles),
      subtitle: `${availableVehicles} ready for dispatch`,
    },
    {
      title: 'Total Personnel & Drivers',
      value: String(totalDrivers),
      subtitle: `${activeDrivers} active on schedule`,
    },
    {
      title: 'Fleet Health & Compliance',
      value: `${complianceRate}%`,
      subtitle: totalVehicles === 0 ? 'No vehicles registered' : 'Compliance operational',
    },
    {
      title: 'Monthly Maintenance Spend',
      value: `₹${totalSpent.toLocaleString()}`,
      subtitle: 'Recorded fleet operating expenses',
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
