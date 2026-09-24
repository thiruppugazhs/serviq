import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/client';
import { Driver, Vehicle } from '../../types';
import { Badge } from '../common/Badge';
import { ArrowLeft, Phone, Mail, FileText, Truck, Calendar, ShieldCheck, Edit3 } from 'lucide-react';

export const DriverProfileView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/manager';

  const [driver, setDriver] = useState<Driver | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      const [driverRes, vehiclesRes] = await Promise.all([
        api.get(`/drivers/${id}`),
        api.get('/vehicles'),
      ]);
      if (driverRes.data.success) {
        setDriver(driverRes.data.driver);
        setSelectedVehicle(
          typeof driverRes.data.driver.assignedVehicle === 'object' && driverRes.data.driver.assignedVehicle
            ? driverRes.data.driver.assignedVehicle._id
            : ''
        );
      }
      if (vehiclesRes.data.success) {
        setVehicles(vehiclesRes.data.vehicles);
      }
    } catch (err: any) {
      console.error('Failed to load driver profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDriverData();
  }, [id]);

  const handleAssignVehicle = async () => {
    try {
      await api.put(`/drivers/${id}`, {
        assignedVehicleId: selectedVehicle || null,
      });
      setIsEditing(false);
      fetchDriverData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update vehicle assignment');
    }
  };

  const handleToggleStatus = async () => {
    try {
      await api.patch(`/drivers/${id}/toggle-status`);
      fetchDriverData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading Driver Profile...</div>;
  }

  if (!driver) {
    return (
      <div className="p-12 text-center text-rose-400">
        Driver profile not found.
      </div>
    );
  }

  const user = typeof driver.user === 'object' ? driver.user : null;
  const assignedVeh = typeof driver.assignedVehicle === 'object' ? driver.assignedVehicle : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <button
        onClick={() => navigate(`${basePath}/drivers`)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Drivers List
      </button>

      {/* Driver Profile Card */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-emerald-950/50">
              {user?.name?.charAt(0).toUpperCase() || 'D'}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Driver Profile
              </div>
              <h1 className="text-2xl font-extrabold text-white font-['Outfit',sans-serif]">
                {user?.name || 'Driver'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-xs text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {driver.driverId}
                </span>
                <span className="text-xs text-slate-400 capitalize">
                  {driver.employmentStatus.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge status={driver.status} size="md" />
            <button
              onClick={handleToggleStatus}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-colors ${
                driver.status === 'active'
                  ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10'
                  : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              {driver.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="py-6 space-y-4 text-sm divide-y divide-slate-800/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-xs text-slate-400 font-medium block">Driver ID</span>
              <span className="font-mono font-bold text-white text-base">{driver.driverId}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Phone</span>
              <span className="font-medium text-white">{user?.phone || 'Not provided'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div>
              <span className="text-xs text-slate-400 font-medium block">Email Address</span>
              <span className="font-medium text-white">{user?.email}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Address</span>
              <span className="font-medium text-white">{user?.address || 'Not specified'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div>
              <span className="text-xs text-slate-400 font-medium block">Licence Number</span>
              <span className="font-mono font-bold text-emerald-400">{driver.drivingLicenceNumber}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Licence Expiry</span>
              <span className="font-medium text-white">
                {driver.licenceExpiry ? new Date(driver.licenceExpiry).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          {/* Assigned Vehicle Highlight */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium block">Assigned Vehicle</span>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditing ? 'Cancel Reassign' : 'Change Assignment'}
              </button>
            </div>

            {isEditing ? (
              <div className="flex items-center gap-3 mt-2">
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none flex-1 font-mono"
                >
                  <option value="">-- No Vehicle Assigned --</option>
                  {vehicles.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.vehicleNumber} ({v.manufacturer} {v.model})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssignVehicle}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                    <Truck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-white text-base">
                      {assignedVeh ? assignedVeh.vehicleNumber : 'No Vehicle Assigned'}
                    </div>
                    <div className="text-xs text-slate-400">
                      {assignedVeh ? `${assignedVeh.manufacturer} ${assignedVeh.model} (${assignedVeh.year})` : 'Allocate a fleet asset to this driver'}
                    </div>
                  </div>
                </div>

                {assignedVeh && (
                  <Badge status={assignedVeh.status} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
