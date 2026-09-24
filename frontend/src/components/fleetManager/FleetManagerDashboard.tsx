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
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Operational Fleet Command
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit',sans-serif] tracking-tight">
            Fleet Manager Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Welcome back, {user?.name}. Monitor real-time fleet health, active repairs, and driver assignments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/manager/vehicles"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shadow-lg shadow-emerald-950/40"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle
          </Link>
          <Link
            to="/manager/drivers"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-xs transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
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
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
              Vehicles Requiring Attention
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Urgent maintenance, active breakdowns, and expiring compliance certificates
            </p>
          </div>
          <Link
            to="/manager/repairs"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.vehiclesRequiringAttention && stats.vehiclesRequiringAttention.length > 0 ? (
          <div className="divide-y divide-slate-800/80">
            {stats.vehiclesRequiringAttention.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-900/40 px-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-white uppercase">
                    {item.vehicleNumber.slice(0, 4)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white tracking-wide">
                      {item.vehicleNumber}
                    </div>
                    <div className="text-xs text-slate-400">{item.model}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    status={item.severity === 'critical' ? 'critical' : 'due_soon'}
                    size="sm"
                  />
                  <span className="text-xs font-medium text-slate-300">
                    {item.issue}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white">All Clear</p>
            <p className="text-xs text-slate-400 mt-0.5">
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
