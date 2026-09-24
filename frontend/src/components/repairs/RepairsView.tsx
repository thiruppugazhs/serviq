import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Repair, Vehicle } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { AlertTriangle, Plus, CheckCircle, Clock, ShieldAlert, Truck, User } from 'lucide-react';

export const RepairsView: React.FC = () => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [updateStatus, setUpdateStatus] = useState({
    status: 'in_progress',
    assignedWorkshop: '',
    cost: '',
    notes: '',
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Report issue form state
  const [formData, setFormData] = useState({
    vehicleId: '',
    issueType: 'Engine',
    description: '',
    priority: 'medium',
    odometerAtIncident: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [repRes, vehRes] = await Promise.all([
        api.get('/repairs'),
        api.get('/vehicles'),
      ]);
      if (repRes.data.success) setRepairs(repRes.data.repairs);
      if (vehRes.data.success) setVehicles(vehRes.data.vehicles);
    } catch (err: any) {
      console.error('Failed to load repairs:', err);
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

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitLoading(true);

    try {
      await api.post('/repairs', formData);
      setIsReportModalOpen(false);
      setFormData({
        vehicleId: '',
        issueType: 'Engine',
        description: '',
        priority: 'medium',
        odometerAtIncident: '',
      });
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to file breakdown ticket');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepair) return;
    setError(null);
    setSubmitLoading(true);

    try {
      await api.patch(`/repairs/${selectedRepair._id}/status`, updateStatus);
      setIsUpdateModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update repair status');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Outfit',sans-serif]">
            Repairs & Breakdown Tickets
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time incident reports from drivers and workshop repair progress.
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setIsReportModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs rounded-xl transition-colors shadow-lg shadow-rose-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>Report Breakdown</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading Tickets...</div>
      ) : repairs.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No Active Repair Tickets"
          description="Drivers can report issues from their mobile app, or you can record roadside breakdowns manually."
          actionText="File Breakdown Ticket"
          onAction={() => setIsReportModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {repairs.map((repair) => {
            const veh = repair.vehicle;
            const reporter = repair.reportedBy;

            return (
              <div
                key={repair._id}
                className="glass-card p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono font-bold text-sm text-white">
                      {veh ? veh.vehicleNumber : 'Vehicle'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {repair.issueType}
                    </span>
                    <Badge status={repair.priority} size="sm" />
                    <Badge status={repair.status} size="sm" />
                  </div>

                  <p className="text-xs text-slate-300 font-medium">{repair.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Reported by: {reporter?.name || 'Driver'}
                    </span>
                    {repair.assignedWorkshop && (
                      <span>Workshop: {repair.assignedWorkshop}</span>
                    )}
                    {repair.cost ? (
                      <span className="text-slate-300 font-mono">Cost: ₹{repair.cost.toLocaleString()}</span>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedRepair(repair);
                      setUpdateStatus({
                        status: repair.status,
                        assignedWorkshop: repair.assignedWorkshop || '',
                        cost: repair.cost ? String(repair.cost) : '',
                        notes: repair.notes || '',
                      });
                      setIsUpdateModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                  >
                    Manage Ticket
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Report Breakdown Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report Vehicle Breakdown / Issue"
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleReportIssue} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Vehicle <span className="text-rose-400">*</span>
            </label>
            <select
              name="vehicleId"
              required
              value={formData.vehicleId}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white outline-none font-mono"
            >
              <option value="">-- Choose vehicle --</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.vehicleNumber} ({v.manufacturer} {v.model})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Issue Category <span className="text-rose-400">*</span>
              </label>
              <select
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white outline-none"
              >
                <option value="Engine">Engine</option>
                <option value="Brakes">Brakes</option>
                <option value="Transmission">Transmission</option>
                <option value="Electrical">Electrical</option>
                <option value="Tire">Tire</option>
                <option value="Body">Body</option>
                <option value="Suspension">Suspension</option>
                <option value="Air Conditioning">Air Conditioning</option>
                <option value="Oil / Fluids">Oil / Fluids</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical (Roadside Breakdown)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Issue Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe symptoms, warning lights, sounds, or damage..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium"
            >
              {submitLoading ? 'Submitting...' : 'Dispatch Ticket'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Update Repair Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Update Repair Status"
      >
        <form onSubmit={handleStatusUpdate} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Ticket Status
            </label>
            <select
              value={updateStatus.status}
              onChange={(e) => setUpdateStatus({ ...updateStatus, status: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white outline-none"
            >
              <option value="reported">Reported (Pending Inspection)</option>
              <option value="in_progress">In Progress (At Workshop)</option>
              <option value="completed">Completed & Verified</option>
              <option value="rejected">Rejected / False Alarm</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Assigned Workshop
              </label>
              <input
                type="text"
                value={updateStatus.assignedWorkshop}
                onChange={(e) => setUpdateStatus({ ...updateStatus, assignedWorkshop: e.target.value })}
                placeholder="Workshop Name"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Repair Cost (₹)
              </label>
              <input
                type="number"
                value={updateStatus.cost}
                onChange={(e) => setUpdateStatus({ ...updateStatus, cost: e.target.value })}
                placeholder="0"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Technician Notes
            </label>
            <textarea
              rows={2}
              value={updateStatus.notes}
              onChange={(e) => setUpdateStatus({ ...updateStatus, notes: e.target.value })}
              placeholder="Parts replaced, labor details, or workshop remarks..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsUpdateModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            >
              {submitLoading ? 'Saving...' : 'Update Status'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
