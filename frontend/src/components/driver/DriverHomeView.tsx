import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { driverService, DriverProfile, MaintenanceItem } from '../../services/driverService';
import {
  Sun,
  Moon,
  CloudSun,
  Bell,
  ChevronDown,
  ChevronUp,
  Gauge,
  Wrench,
  Cog,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const DriverHomeView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState<DriverProfile>(driverService.getProfile());
  const [odometer, setOdometer] = useState<number>(driverService.getOdometer());
  const [maintenanceList, setMaintenanceList] = useState<MaintenanceItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(driverService.getUnreadCount());
  const [isProfileExpanded, setIsProfileExpanded] = useState<boolean>(false);

  const driverName = user?.name || profile.name;

  useEffect(() => {
    setProfile(driverService.getProfile());
    setOdometer(driverService.getOdometer());
    setMaintenanceList(driverService.getMaintenance('current'));
    setUnreadCount(driverService.getUnreadCount());
  }, []);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return { text: 'Good Morning,', icon: Sun, iconColor: 'text-amber-500' };
    } else if (hour < 17) {
      return { text: 'Good Afternoon,', icon: CloudSun, iconColor: 'text-amber-500' };
    } else {
      return { text: 'Good Evening,', icon: Moon, iconColor: 'text-indigo-400' };
    }
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <div className="p-4 sm:p-5 space-y-4">
      {/* Top Header: Greeting & Notifications */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <GreetingIcon className={`w-6 h-6 ${greeting.iconColor} shrink-0`} />
          <div>
            <span className="text-xs text-slate-500 font-medium block leading-none">{greeting.text}</span>
            <h1 className="text-lg font-bold text-slate-900 leading-tight mt-0.5">{driverName}</h1>
          </div>
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-full hover:bg-slate-100 transition text-slate-700"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-slate-700" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Driver Profile Collapsible Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-xs transition-all">
        <div
          onClick={() => setIsProfileExpanded(!isProfileExpanded)}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <img
              src={profile.photoUrl}
              alt={profile.name}
              className="w-11 h-11 rounded-full object-cover border border-slate-100 shadow-2xs"
            />
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">{driverName}</h2>
              <span className="text-xs text-slate-400 font-medium">{profile.role}</span>
            </div>
          </div>

          <button
            type="button"
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition"
            aria-label={isProfileExpanded ? 'Collapse Profile' : 'Expand Profile'}
          >
            {isProfileExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {/* Expanded Profile Details */}
        {isProfileExpanded && (
          <div className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <span className="text-[11px] text-slate-400 block">Driver ID</span>
                <span className="font-semibold text-slate-800">{profile.driverId}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">License No</span>
                <span className="font-semibold text-slate-800">{profile.licenseNumber}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Phone</span>
                <span className="font-semibold text-slate-800">{profile.phone}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Team</span>
                <span className="font-semibold text-slate-800">{profile.team}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/settings/driver')}
                className="w-full flex items-center justify-between py-2 text-xs font-semibold text-[#1b72e8] hover:underline"
              >
                <span>View Full Profile</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Current Odometer Card */}
      <div className="bg-[#eff6ff] rounded-2xl border border-blue-100/80 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b72e8]/10 flex items-center justify-center text-[#1b72e8]">
              <Gauge className="w-6 h-6 stroke-[2.2px]" />
            </div>
            <div>
              <span className="text-xs text-slate-600 font-medium block">Current Odometer</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  {odometer.toLocaleString()}
                </span>
                <span className="text-xs text-slate-600 font-semibold">km</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/odometer/update')}
            className="px-3 py-1.5 bg-[#1b72e8] hover:bg-[#1558b0] active:scale-95 text-white text-xs font-semibold rounded-lg shadow-xs transition"
          >
            Update Odometer
          </button>
        </div>
      </div>

      {/* Summary Cards: Current Service & Current Maintenance */}
      <div className="grid grid-cols-2 gap-3">
        {/* Current Service */}
        <div
          onClick={() => navigate('/service')}
          className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs cursor-pointer hover:border-blue-200 transition"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1b72e8] flex items-center justify-center mb-2">
            <Wrench className="w-4 h-4 stroke-[2.2px]" />
          </div>
          <span className="text-[11px] text-slate-500 font-medium block">Current Service</span>
          <span className="text-2xl font-black text-slate-900 block mt-0.5">2</span>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">In Progress</span>
        </div>

        {/* Current Maintenance */}
        <div
          onClick={() => navigate('/maintenance')}
          className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs cursor-pointer hover:border-emerald-200 transition"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <Cog className="w-4 h-4 stroke-[2.2px]" />
          </div>
          <span className="text-[11px] text-slate-500 font-medium block">Current Maintenance</span>
          <span className="text-2xl font-black text-slate-900 block mt-0.5">1</span>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Scheduled</span>
        </div>
      </div>

      {/* Current Maintenance List Section */}
      <div className="pt-1">
        <h3 className="text-sm font-bold text-slate-900 mb-2.5">Current Maintenance</h3>

        <div className="space-y-2.5">
          {maintenanceList.slice(0, 2).map((item, idx) => {
            const isGreen = idx % 2 === 0;
            return (
              <div
                key={item.id}
                onClick={() => navigate('/maintenance')}
                className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-xs flex items-center justify-between cursor-pointer hover:border-blue-100 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isGreen ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {isGreen ? (
                      <Wrench className="w-4 h-4 stroke-[2.2px]" />
                    ) : (
                      <Clock className="w-4 h-4 stroke-[2.2px]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{item.title}</h4>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Due {item.dueDate}</span>
                    <span className="text-[10px] text-slate-400 block">Service Due {item.dueDate}</span>
                  </div>
                </div>

                <div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      item.status === 'In Progress'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
