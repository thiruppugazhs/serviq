import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { DashboardStats } from '../../types';
import { StatCard } from '../common/StatCard';
import { BarChart3, Truck, Wrench, AlertTriangle, Receipt, Download, FileSpreadsheet } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await api.get('/reports/dashboard-stats');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleExportCSV = () => {
    const data = [
      ['Metric', 'Value'],
      ['Total Vehicles', stats?.vehicles.total || 0],
      ['Available Vehicles', stats?.vehicles.available || 0],
      ['In Shop Vehicles', stats?.vehicles.inShop || 0],
      ['Total Drivers', stats?.drivers.total || 0],
      ['Active Drivers', stats?.drivers.active || 0],
      ['Maintenance Due', stats?.maintenance.dueOrOverdue || 0],
      ['Active Repairs', stats?.repairs.active || 0],
      ['Total Expenses (INR)', stats?.expenses.totalSpent || 0],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + data.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `serviq-fleet-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Outfit',sans-serif]">
            Reports & Fleet Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated audit logs, compliance posture, and operating expenditure summaries.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-xs rounded-xl transition-colors"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Summary CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Fleet Utilization"
          value={
            stats?.vehicles.total
              ? `${Math.round(((stats.vehicles.available) / stats.vehicles.total) * 100)}%`
              : '100%'
          }
          subtitle="Available road-ready assets"
          icon={Truck}
          color="emerald"
        />
        <StatCard
          title="Driver Allocation"
          value={stats?.drivers.total || 0}
          subtitle={`${stats?.drivers.active || 0} active drivers`}
          icon={BarChart3}
          color="sky"
        />
        <StatCard
          title="Servicing Due"
          value={stats?.maintenance.dueOrOverdue || 0}
          subtitle="Milestones reached"
          icon={Wrench}
          color={stats?.maintenance.dueOrOverdue ? 'amber' : 'emerald'}
        />
        <StatCard
          title="Operating Spend"
          value={`₹${(stats?.expenses.totalSpent || 0).toLocaleString()}`}
          subtitle="Cumulative logged costs"
          icon={Receipt}
          color="indigo"
        />
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h2 className="text-base font-bold text-white font-['Outfit',sans-serif] mb-2">
          Fleet Health Overview
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Real-time snapshot across all vehicles in this organization.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block mb-1">Vehicles in Workshop</span>
            <span className="text-xl font-bold font-mono text-rose-400">
              {stats?.vehicles.inShop || 0}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block mb-1">Compliance Certificates Expiring</span>
            <span className="text-xl font-bold font-mono text-amber-400">
              {stats?.documents.expiringOrExpired || 0}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block mb-1">Breakdown Incident Tickets</span>
            <span className="text-xl font-bold font-mono text-emerald-400">
              {stats?.repairs.active || 0} active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
