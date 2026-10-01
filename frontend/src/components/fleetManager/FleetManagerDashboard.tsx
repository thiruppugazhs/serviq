import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { DashboardStats } from '../../types';
import { Truck, UserCheck, Wrench, AlertTriangle, Plus, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FleetManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/dashboard-stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to load fleet metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-slate-900">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/90 bg-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#2335f2] border border-blue-200 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Operational Fleet Command
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif] tracking-tight">
            Fleet Manager Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, {user?.name}. Monitor real-time fleet health, active repairs, and driver assignments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/manager/vehicles"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2335f2] hover:bg-[#1a29cc] text-white font-medium text-xs transition-colors shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle
          </Link>
          <Link
            to="/manager/drivers"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-xs transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4 text-[#2335f2]" />
            Add Driver
          </Link>
        </div>
      </div>

      {/* KPI Counters: Vehicles, Drivers, Maintenance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Vehicles"
          value={stats?.vehicles.total ?? 0}
          subtitle={`${stats?.vehicles.available ?? 0} available`}
          icon={Truck}
          color="emerald"
        />
        <StatCard
          title="Drivers"
          value={stats?.drivers.total ?? 0}
          subtitle={`${stats?.drivers.active ?? 0} active`}
          icon={UserCheck}
          color="indigo"
        />
        <StatCard
          title="Maintenance Due"
          value={stats?.maintenance.dueOrOverdue ?? 0}
          subtitle="Scheduled servicing pending"
          icon={Wrench}
          color={stats?.maintenance.dueOrOverdue ? 'amber' : 'emerald'}
        />
        <StatCard
          title="Active Repairs"
          value={stats?.repairs.active ?? 0}
          subtitle="Breakdown tickets open"
          icon={AlertTriangle}
          color={stats?.repairs.active ? 'rose' : 'emerald'}
        />
      </div>

      {/* Vehicles Requiring Attention */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200/90 bg-white shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
              Vehicles Requiring Attention
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Urgent maintenance, active breakdowns, and expiring compliance certificates
            </p>
          </div>
          <Link
            to="/manager/repairs"
            className="text-xs text-[#2335f2] hover:text-[#1a29cc] font-semibold flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.vehiclesRequiringAttention && stats.vehiclesRequiringAttention.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {stats.vehiclesRequiringAttention.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#2335f2] flex items-center justify-center font-bold text-xs uppercase">
                    {item.vehicleNumber.slice(0, 4)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 tracking-wide">
                      {item.vehicleNumber}
                    </div>
                    <div className="text-xs text-slate-500">{item.model}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    status={item.severity === 'critical' ? 'critical' : 'due_soon'}
                    size="sm"
                  />
                  <span className="text-xs font-medium text-slate-600">
                    {item.issue}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-900">All Clear</p>
            <p className="text-xs text-slate-500 mt-0.5">
              No vehicles currently have urgent maintenance or breakdown flags.
            </p>
          </div>
        )}
      </div>

      {stats?.vehicles.total === 0 && (
        <EmptyState
          icon={Truck}
          title="Fleet Assets Ready for Entry"
          description="Register your fleet assets to start tracking maintenance and assigning drivers."
          actionText="Add Vehicle"
          onAction={() => (window.location.href = '/manager/vehicles')}
        />
      )}
    </div>
  );
};
