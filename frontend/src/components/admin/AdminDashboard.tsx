import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { DashboardStats } from '../../types';
import { Header } from '../common/Header';
import { StatsCards } from '../dashboard/StatsCards';
import { ProjectAnalytics } from '../dashboard/ProjectAnalytics';
import { TeamCollaboration } from '../dashboard/TeamCollaboration';
import { Reminders } from '../dashboard/Reminders';
import { ProjectProgress } from '../dashboard/ProjectProgress';
import { ProjectList } from '../dashboard/ProjectList';
import { Download } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/dashboard-stats');
      if (res.data?.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.warn('Dashboard stats fallback applied:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExport = () => {
    const reportData = JSON.stringify(stats || { status: 'operational' }, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `serviq-fleet-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 md:space-y-5 animate-in fade-in duration-200">
      <Header
        title="Fleet Operations Dashboard"
        description="Plan, execute, and monitor commercial vehicle fleet operations with data-driven insights."
        actions={
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Report</span>
          </button>
        }
      />

      <div className="space-y-4">
        {/* Row 1: 4 Stats Cards */}
        <StatsCards stats={stats} />

        {/* Row 2: 2 cols on left, 1 col on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <ProjectAnalytics />
            <TeamCollaboration />
          </div>

          <div className="space-y-4">
            <Reminders />
            <ProjectProgress />
          </div>
        </div>

        {/* Row 3: Active Fleet Registry Highlights */}
        <ProjectList />
      </div>
    </div>
  );
};
