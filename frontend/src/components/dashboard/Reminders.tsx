import React, { useEffect, useState } from 'react';
import { Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Maintenance } from '../../types';

export const Reminders: React.FC = () => {
  const [upcoming, setUpcoming] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const res = await api.get('/maintenance');
        if (res.data?.success) {
          const list: Maintenance[] = res.data.maintenance || [];
          setUpcoming(list.slice(0, 2));
        }
      } catch (err) {
        console.warn('Failed to load maintenance reminders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaintenance();
  }, []);

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all">
      <h2 className="text-lg font-bold text-slate-900 font-['Anek_Latin',sans-serif] mb-4">
        Upcoming Service Audits
      </h2>

      {loading ? (
        <div className="py-6 text-center text-xs text-slate-400">Checking scheduled services...</div>
      ) : upcoming.length === 0 ? (
        <div className="p-4 rounded-xl bg-slate-50/70 border border-dashed border-slate-200 text-center">
          <ShieldCheck className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
          <p className="text-xs font-semibold text-slate-700">No Pending Audits or Overdue Services</p>
          <p className="text-[11px] text-slate-400 mt-0.5 mb-3">All registered vehicles are compliant or awaiting new requests.</p>
          <Link
            to="../maintenance"
            className="inline-flex items-center gap-1.5 text-xs text-[#2335f2] font-semibold hover:underline"
          >
            <span>Open Maintenance Requests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {upcoming.map((item) => {
            const veh = typeof item.vehicle === 'object' ? item.vehicle : null;
            return (
              <div
                key={item._id}
                className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 transition-all hover:border-blue-300 hover:bg-white hover:shadow-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2335f2] bg-blue-50 px-2 py-0.5 rounded-md">
                    {item.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {item.nextDueDate ? new Date(item.nextDueDate).toLocaleDateString() : 'Scheduled'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-1">
                  {item.serviceType}
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Vehicle: <span className="font-semibold text-slate-700 font-mono">{veh ? veh.vehicleNumber : 'Asset'}</span>
                  {item.serviceCenter ? ` • ${item.serviceCenter}` : ''}
                </p>

                <Link
                  to="../maintenance"
                  className="w-full bg-[#2335f2] hover:bg-blue-700 text-white font-medium text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Review Request Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
