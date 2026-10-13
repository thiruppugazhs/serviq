import React, { useEffect, useState } from 'react';
import { Plus, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Vehicle } from '../../types';

export const ProjectList: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await api.get('/vehicles');
        if (res.data?.success) {
          setVehicles(res.data.vehicles || []);
        }
      } catch (err) {
        console.warn('Failed to load dashboard vehicle highlights:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const getVehicleColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500'];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
            Active Fleet Registry Highlights
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Key commercial haulers and upcoming fitness milestones
          </p>
        </div>

        <Link
          to="../vehicles"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>View All Vehicles</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-slate-400">Loading fleet registry highlights...</div>
      ) : vehicles.length === 0 ? (
        <div className="py-8 px-4 text-center rounded-xl bg-slate-50/60 border border-dashed border-slate-200">
          <Truck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No vehicles registered yet</p>
          <p className="text-xs text-slate-400 mt-0.5 mb-3">Add commercial vehicles under Vehicles to see real-time fleet highlights.</p>
          <Link
            to="../vehicles"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2335f2] text-xs font-medium text-white hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Vehicle</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {vehicles.slice(0, 5).map((asset, idx) => (
            <div
              key={asset._id}
              className="flex flex-col justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-200 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`${getVehicleColor(idx)} w-9 h-9 rounded-lg flex items-center justify-center text-lg shadow-xs text-white shrink-0 group-hover:scale-105 transition-transform`}
                >
                  🚚
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200/80 shadow-2xs">
                  {asset.vehicleNumber}
                </span>
              </div>

              <div>
                <p className="font-semibold text-slate-900 text-xs truncate">
                  {asset.manufacturer} {asset.model}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-1">
                  {asset.fcExpiryDate || asset.fitnessExpiry
                    ? `FC: ${new Date(asset.fcExpiryDate || asset.fitnessExpiry || '').toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}`
                    : `${asset.odometer.toLocaleString()} km`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
