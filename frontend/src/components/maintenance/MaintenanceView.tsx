import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Maintenance, Vehicle } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { Wrench, Plus, CheckCircle, ShieldAlert, Calendar, Gauge } from 'lucide-react';

export const MaintenanceView: React.FC = () => {
  const [maintenanceList, setMaintenanceList] = useState<Maintenance[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Maintenance | null>(null);
  const [completeData, setCompleteData] = useState({
    completedOdometer: '',
    cost: '',
    serviceCenter: '',
    notes: '',
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    vehicleId: '',
    serviceType: 'Periodic Preventive Maintenance',
    intervalMonths: 6,
    intervalKm: 10000,
    serviceCenter: '',
    notes: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [maintRes, vehRes] = await Promise.all([
        api.get('/maintenance'),
        api.get('/vehicles'),
      ]);
      if (maintRes.data.success) setMaintenanceList(maintRes.data.maintenance);
      if (vehRes.data.success) setVehicles(vehRes.data.vehicles);
    } catch (err: any) {
      console.error('Failed to load maintenance records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitLoading(true);

    try {
      await api.post('/maintenance', formData);
      setIsAddModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create schedule');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCompleteService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    setError(null);
    setSubmitLoading(true);

    try {
      await api.patch(`/maintenance/${selectedRecord._id}/complete`, completeData);
      setIsCompleteModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete service');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Outfit',sans-serif]">
            Preventive Maintenance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dual-trigger servicing reminders tracking both elapsed calendar time and odometer milestones.
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl transition-colors shadow-lg shadow-emerald-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>New Service Schedule</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading Maintenance Schedules...</div>
      ) : maintenanceList.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No Maintenance Schedules Configured"
          description="Create recurring maintenance rules (e.g. 10,000 km oil change, 6-month general inspection) to prevent roadside breakdowns."
          actionText="Schedule First Service"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {maintenanceList.map((item) => {
            const veh = item.vehicle;
            return (
              <div key={item._id} className="glass-card p-5 rounded-2xl border flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono font-bold text-sm text-white tracking-wider">
                        {veh ? veh.vehicleNumber : 'Vehicle'}
                      </span>
                      <h3 className="font-semibold text-xs text-emerald-400 mt-0.5">
                        {item.serviceType}
                      </h3>
                    </div>
                    <Badge status={item.status} />
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        Next Due Date:
                      </span>
                      <span className="font-semibold text-white">
                        {item.nextDueDate ? new Date(item.nextDueDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5 text-slate-500" />
                        Next Due Odo:
                      </span>
                      <span className="font-mono font-semibold text-white">
                        {item.nextDueOdometer ? `${item.nextDueOdometer.toLocaleString()} km` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {item.serviceCenter && (
                    <p className="mt-3 text-xs text-slate-400">
                      Center: <span className="text-slate-200">{item.serviceCenter}</span>
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Cycle: {item.intervalKm.toLocaleString()} km / {item.intervalMonths} mo
                  </span>
                  <button
                    onClick={() => {
                      setSelectedRecord(item);
                      setCompleteData({
                        completedOdometer: veh ? String(veh.odometer) : '',
                        cost: '',
                        serviceCenter: item.serviceCenter || '',
                        notes: '',
                      });
                      setIsCompleteModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-white px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-600 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Log Service
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Schedule Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Maintenance Schedule"
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAddSchedule} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Select Fleet Vehicle <span className="text-rose-400">*</span>
            </label>
            <select
              name="vehicleId"
              required
              value={formData.vehicleId}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none font-mono"
            >
              <option value="">-- Choose vehicle --</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.vehicleNumber} ({v.manufacturer} {v.model})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Service Type <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="serviceType"
              required
              value={formData.serviceType}
              onChange={handleChange}
              placeholder="e.g. Full Synthetic Oil & Filter Replacement"
              className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Interval (Kilometers)
              </label>
              <input
                type="number"
                name="intervalKm"
                value={formData.intervalKm}
                onChange={handleChange}
                placeholder="10000"
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Interval (Months)
              </label>
              <input
                type="number"
                name="intervalMonths"
                value={formData.intervalMonths}
                onChange={handleChange}
                placeholder="6"
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Service Center / Workshop
            </label>
            <input
              type="text"
              name="serviceCenter"
              value={formData.serviceCenter}
              onChange={handleChange}
              placeholder="e.g. Authorized Dealership Workshop"
              className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            >
              {submitLoading ? 'Saving...' : 'Set Schedule'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Complete Service Modal */}
      <Modal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        title="Record Completed Service"
      >
        <form onSubmit={handleCompleteService} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Odometer Reading at Service (km)
            </label>
            <input
              type="number"
              required
              value={completeData.completedOdometer}
              onChange={(e) => setCompleteData({ ...completeData, completedOdometer: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Total Service Cost (₹)
              </label>
              <input
                type="number"
                value={completeData.cost}
                onChange={(e) => setCompleteData({ ...completeData, cost: e.target.value })}
                placeholder="0"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Workshop / Vendor
              </label>
              <input
                type="text"
                value={completeData.serviceCenter}
                onChange={(e) => setCompleteData({ ...completeData, serviceCenter: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsCompleteModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            >
              {submitLoading ? 'Updating...' : 'Log & Recalculate Next Schedule'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
