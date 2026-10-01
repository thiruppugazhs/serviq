import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { DashboardStats } from '../../types';
import {
  Settings2,
  Calendar,
  ChevronDown,
  ClipboardList,
  Check,
  HelpCircle,
  MessageSquare,
  Clock,
  UserCheck,
  FileEdit,
  XCircle,
  CreditCard,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'Today' | 'Yesterday' | 'This Week' | 'This Month' | 'All Time'>('Today');
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/dashboard-stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const todayLabel = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  });

  const tripStatusItems = [
    { label: 'New', count: 0 },
    { label: 'Confirmed', count: 0 },
    { label: 'Ready', count: 0 },
    { label: 'Dispatched', count: 0 },
    { label: 'Live', count: 0 },
    { label: 'Completed', count: 0 },
    { label: 'Cancelled', count: 0 },
    { label: 'Rejected', count: 0 },
    { label: 'Error', count: 0 },
    { label: 'Invoiced', count: 0 },
    { label: 'Settled', count: 0 },
  ];

  const incompleteSetupItems = [
    'Users',
    'Work Shifts',
    'Clients',
    'Suppliers',
    'Vehicles',
    'Drivers',
    'Garages',
    'Rates',
    'Stoppages',
    'Seat Rates',
  ];

  const revenueCategories = [
    { label: 'Outstation', color: 'bg-blue-500' },
    { label: 'Rental', color: 'bg-teal-500' },
    { label: 'Local', color: 'bg-purple-500' },
    { label: 'Self Drive', color: 'bg-indigo-500' },
    { label: 'Transfer', color: 'bg-amber-500' },
    { label: 'Shuttle', color: 'bg-cyan-500' },
    { label: 'Route', color: 'bg-emerald-500' },
    { label: 'Bus', color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-5 text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Action Bar (Customize + Date Filter) */}
      <div className="flex items-center justify-end gap-2.5">
        <button
          onClick={() => setShowCustomizeModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 text-xs font-medium transition-colors shadow-2xs"
        >
          <Settings2 className="w-3.5 h-3.5 text-slate-600" />
          <span>Customize</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 text-xs font-medium transition-colors shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{selectedPeriod}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {periodDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
              {(['Today', 'Yesterday', 'This Week', 'This Month', 'All Time'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setPeriodDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Setup Center Card */}
      <div className="bg-white rounded-2xl border border-amber-200/50 p-5 sm:p-6 shadow-2xs relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center shrink-0">
              <ClipboardList className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Setup Center
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete the essential setup to get your account ready.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-end md:self-auto">
            <div className="text-right">
              <div className="text-sm font-bold text-slate-900">
                <span className="text-amber-600 font-extrabold">2</span>
                <span className="text-slate-600"> / 12 completed</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-500">17%</div>
            </div>

            <Link
              to="/admin/settings"
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs tracking-wide transition-colors shadow-2xs"
            >
              Continue Setup
            </Link>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 mb-4">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: '17%' }}
            />
          </div>
        </div>

        {/* Completed Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 mr-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Completed
          </span>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <Check className="w-3 h-3 text-emerald-600" />
            Companies
          </span>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <Check className="w-3 h-3 text-emerald-600" />
            Offices
          </span>
        </div>

        {/* Incomplete Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 mr-1">
            <span className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">
              ?
            </span>
            Incomplete
          </span>

          {incompleteSetupItems.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-50/70 text-amber-900 border border-amber-200/70"
            >
              <span className="text-amber-700 font-bold text-[11px]">?</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Operational 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Row 1, Card 1: Dispatch Center */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3.5">
            Dispatch Center
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between min-h-[92px] relative overflow-hidden">
              <span className="text-xs font-medium text-slate-500">Enquiry</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">0</span>
              <MessageSquare className="w-5 h-5 text-slate-200 absolute right-3 bottom-3 stroke-[1.5]" />
            </div>

            <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between min-h-[92px] relative overflow-hidden">
              <span className="text-xs font-medium text-slate-500 leading-tight">
                Pending Confirmation
              </span>
              <span className="text-2xl font-bold text-slate-900 font-mono">0</span>
              <Clock className="w-5 h-5 text-slate-200 absolute right-3 bottom-3 stroke-[1.5]" />
            </div>

            <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between min-h-[92px] relative overflow-hidden">
              <span className="text-xs font-medium text-slate-500 leading-tight">
                Pending Allocation
              </span>
              <span className="text-2xl font-bold text-slate-900 font-mono">0</span>
              <UserCheck className="w-5 h-5 text-slate-200 absolute right-3 bottom-3 stroke-[1.5]" />
            </div>
          </div>
        </div>

        {/* Row 1, Card 2: Finance Center */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3.5">
            Finance Center
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between min-h-[92px] relative overflow-hidden">
              <span className="text-xs font-medium text-slate-500 leading-tight">
                Pending Invoicing
              </span>
              <span className="text-2xl font-bold text-slate-900 font-mono">0</span>
              <FileEdit className="w-5 h-5 text-slate-200 absolute right-3 bottom-3 stroke-[1.5]" />
            </div>

            <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between min-h-[92px] relative overflow-hidden">
              <span className="text-xs font-medium text-slate-500 leading-tight">
                Cancelled Booking
              </span>
              <span className="text-2xl font-bold text-slate-900 font-mono">0</span>
              <XCircle className="w-5 h-5 text-slate-200 absolute right-3 bottom-3 stroke-[1.5]" />
            </div>

            <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between min-h-[92px] relative overflow-hidden">
              <span className="text-xs font-medium text-slate-500 leading-tight">
                Pending Payment
              </span>
              <span className="text-2xl font-bold text-slate-900 font-mono">0</span>
              <CreditCard className="w-5 h-5 text-slate-200 absolute right-3 bottom-3 stroke-[1.5]" />
            </div>
          </div>
        </div>

        {/* Row 2, Card 3: Billing Stats */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3.5">
            Billing Stats
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between min-h-[92px]">
              <span className="text-xs font-medium text-slate-500">Un-Invoiced</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">0</span>
            </div>

            <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between min-h-[92px]">
              <span className="text-xs font-medium text-slate-500">Completed</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">0</span>
            </div>

            <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between min-h-[92px]">
              <span className="text-xs font-medium text-slate-500">Error</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">0</span>
            </div>
          </div>
        </div>

        {/* Row 2, Card 4: Client Payment */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3.5">
            Client Payment
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between min-h-[92px]">
              <span className="text-xs font-medium text-slate-500">Total Invoice</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">0</span>
            </div>

            <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between min-h-[92px]">
              <div>
                <span className="text-xs font-medium text-slate-500 block">Due Payment</span>
                <span className="text-[10px] text-slate-400 block -mt-0.5 leading-tight">
                  Included overdue payment
                </span>
              </div>
              <span className="text-2xl font-bold text-slate-900 font-mono">0</span>
            </div>

            <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between min-h-[92px]">
              <span className="text-xs font-medium text-slate-500">Overdue Payment</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">0</span>
            </div>
          </div>
        </div>

        {/* Row 3, Card 5: Vehicle Stats (Own) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Vehicle Stats (Own)
            </h3>
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
              ALL TIME
            </span>
          </div>
          <div className="flex flex-col items-center justify-center py-4">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {stats?.vehicles.total ?? 0}
            </span>
            <span className="text-xs text-slate-500 mt-1 font-medium">
              Total Vehicles
            </span>
          </div>
        </div>

        {/* Row 3, Card 6: Vehicle Reminders */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Vehicle Reminders
            </h3>
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
              ALL TIME
            </span>
          </div>
          <div className="flex items-center justify-center py-7">
            <span className="text-xs sm:text-sm text-slate-400 font-normal">
              No reminder statistics found
            </span>
          </div>
        </div>

        {/* Row 4, Card 7: Employee Reminders */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Employee Reminders
            </h3>
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
              ALL TIME
            </span>
          </div>
          <div className="flex items-center justify-center py-7">
            <span className="text-xs sm:text-sm text-slate-400 font-normal">
              No reminder statistics found
            </span>
          </div>
        </div>

        {/* Row 4, Card 8: Trip Reminders */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Trip Reminders
            </h3>
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
              ALL TIME
            </span>
          </div>
          <div className="flex items-center justify-center py-7">
            <span className="text-xs sm:text-sm text-slate-400 font-normal">
              No reminder statistics found
            </span>
          </div>
        </div>

        {/* Row 5, Card 9: Trip Payments */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3.5">
            Trip Payments
          </h3>
          <div className="space-y-2.5">
            <div className="bg-slate-50/80 rounded-xl px-4 py-2.5 flex items-center gap-2.5 border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
              <div className="text-xs text-slate-600">
                <span className="font-bold text-blue-700">USD 0</span> Received for{' '}
                <span className="font-bold text-blue-700">0</span> Trips
              </div>
            </div>

            <div className="bg-slate-50/80 rounded-xl px-4 py-2.5 flex items-center gap-2.5 border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              <div className="text-xs text-slate-600">
                <span className="font-bold text-rose-700">USD 0</span> Pending for{' '}
                <span className="font-bold text-rose-700">0</span> Trips
              </div>
            </div>
          </div>
        </div>

        {/* Row 5, Card 10: Invoice Amount */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3.5">
            Invoice Amount
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-50/80 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <div className="text-xs text-slate-700">
                <span className="font-bold text-slate-900">0</span> Received
              </div>
            </div>

            <div className="bg-slate-50/80 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <div className="text-xs text-slate-700">
                <span className="font-bold text-slate-900">0</span> Outstanding
              </div>
            </div>

            <div className="bg-slate-50/80 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <div className="text-xs text-slate-700">
                <span className="font-bold text-slate-900">0</span> Invoices
              </div>
            </div>

            <div className="bg-slate-50/80 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              <div className="text-xs text-slate-700">
                <span className="font-bold text-slate-900">0</span> Invoices
              </div>
            </div>
          </div>
        </div>

        {/* Row 6, Card 11: Trips Statistics */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3.5">
            Trips Statistics
          </h3>
          <div className="space-y-1.5">
            {tripStatusItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-xs py-1"
              >
                <span className="w-24 text-slate-600 font-medium">{item.label}</span>
                <div className="h-[1.5px] bg-slate-200/70 flex-1 mx-3 rounded-full" />
                <span className="font-bold text-slate-900 font-mono w-4 text-right">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column Stack for Gender Report and Pickup Report */}
        <div className="space-y-5 flex flex-col">
          {/* Row 6, Card 12: Gender Report */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex-1 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Gender Report
            </h3>
            <div className="flex items-center justify-center py-10">
              <span className="text-xs sm:text-sm text-slate-400 font-normal">
                No gender data available
              </span>
            </div>
          </div>

          {/* Row 6, Card 13: Pickup Report */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Pickup Report
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Pickup status overview
              </p>
            </div>
            <div className="flex items-center justify-center py-10">
              <span className="text-xs sm:text-sm text-slate-400 font-normal">
                No pickup data available
              </span>
            </div>
          </div>
        </div>

        {/* Row 7, Card 14: Departure Performance */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs min-h-[160px] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Departure Performance
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Departure status overview
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <span className="text-xs sm:text-sm text-slate-400 font-normal">
              No departure data available
            </span>
          </div>
        </div>

        {/* Row 7, Card 15: Arrival Performance */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs min-h-[160px] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Arrival Performance
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Arrival status overview
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <span className="text-xs sm:text-sm text-slate-400 font-normal">
              No arrival data available
            </span>
          </div>
        </div>

        {/* Row 8, Card 16: Revenue Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Revenue <span className="font-extrabold ml-1">0</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">Today</span>
            </div>

            {/* Category Color Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3.5">
              {revenueCategories.map((cat) => (
                <div key={cat.label} className="inline-flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                  <span className="text-[11px] text-slate-500 font-medium">
                    {cat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Clean minimal chart axis */}
          <div className="mt-8 pt-2">
            <div className="relative h-44 w-full flex flex-col justify-between text-[11px] text-slate-400 font-mono pl-6">
              {[1, 0.8, 0.6, 0.4, 0.2, 0].map((val) => (
                <div key={val} className="relative flex items-center w-full">
                  <span className="absolute -left-6 text-[10px] text-slate-400">
                    {val}
                  </span>
                  <div className="w-full border-b border-slate-100" />
                </div>
              ))}
            </div>
            <div className="text-[11px] text-slate-500 font-medium pl-6 pt-1">
              {todayLabel}
            </div>
          </div>
        </div>

        {/* Row 8, Card 17: Vendor Performance */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs min-h-[220px] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Vendor Performance
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Supplier split</p>
          </div>
          <div className="flex items-center justify-center py-20">
            <span className="text-xs sm:text-sm text-slate-400 font-normal">
              No vendor data available
            </span>
          </div>
        </div>
      </div>

      {/* Customize Modal */}
      {showCustomizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Customize Dashboard
              </h3>
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Toggle operational widgets and re-arrange metric sections on your overview console.
            </p>
            <div className="space-y-2 text-xs">
              {[
                'Setup Center',
                'Dispatch Center',
                'Finance Center',
                'Billing & Payment Stats',
                'Vehicle & Trip Reminders',
                'Performance & Revenue Analytics',
              ].map((item) => (
                <label
                  key={item}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer"
                >
                  <span className="font-medium text-slate-700">{item}</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                </label>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
