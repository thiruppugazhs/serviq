import React, { useEffect, useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Driver } from '../../types';

export const TeamCollaboration: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await api.get('/drivers');
        if (res.data?.success) {
          setDrivers(res.data.drivers || []);
        }
      } catch (err) {
        console.warn('Failed to load dashboard crew members:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-slate-900 font-['Anek_Latin',sans-serif]">
          Active Crew & Driver Assignments
        </h2>
        <Link
          to="../drivers"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Member</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-slate-400">Loading crew members...</div>
      ) : drivers.length === 0 ? (
        <div className="py-8 px-4 text-center rounded-xl bg-slate-50/60 border border-dashed border-slate-200">
          <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No crew members or drivers added yet</p>
          <p className="text-xs text-slate-400 mt-0.5 mb-3">Add drivers and assign them to vehicles under Drivers module.</p>
          <Link
            to="../drivers"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2335f2] text-xs font-medium text-white hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Driver</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {drivers.slice(0, 4).map((d) => {
            const userName = typeof d.user === 'object' ? d.user?.name : 'Driver';
            const initials = userName
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);
            const assignedVeh = typeof d.assignedVehicle === 'object' ? d.assignedVehicle : null;

            return (
              <div
                key={d._id}
                className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-full ring-2 ring-[#2335f2]/20 group-hover:ring-[#2335f2]/40 bg-blue-50 text-[#2335f2] font-bold text-xs flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                  {initials || d.driverId}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{userName}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    Assigned:{' '}
                    <span className="font-medium text-slate-700">
                      {assignedVeh ? `${assignedVeh.vehicleNumber} (${assignedVeh.manufacturer})` : 'Unassigned'}
                    </span>
                  </p>
                </div>

                <span
                  className={`text-[11px] px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${
                    d.status === 'on_duty'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                      : d.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      : 'bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  {d.status === 'on_duty' ? 'On Duty' : d.status === 'active' ? 'Active' : 'Standby'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
