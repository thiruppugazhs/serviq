import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Maintenance, Vehicle } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { Header } from '../common/Header';
import {
  Wrench,
  Plus,
  CheckCircle,
  XCircle,
  ShieldAlert,
  Calendar,
  Gauge,
  Clock,
  User,
  MapPin,
  Check,
} from 'lucide-react';

export const MaintenanceView: React.FC = () => {
  const [maintenanceList, setMaintenanceList] = useState<Maintenance[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'completed'>('all');

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Maintenance | null>(null);

  // Form states
  const [scheduleData, setScheduleData] = useState({
    vehicleId: '',
    serviceType: '',
    scheduledStartDate: '',
    scheduledEndDate: '',
    serviceCenter: '',
    notes: '',
  });

  const [requestData, setRequestData] = useState({
    vehicleId: '',
    serviceType: '',
    currentOdometer: '',
    runningKmInterval: '10000',
    serviceCenter: '',
    notes: '',
  });

  const [completeData, setCompleteData] = useState({
    completedOdometer: '',
    cost: '',
    serviceCenter: '',
    notes: '',
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [maintRes, vehRes] = await Promise.all([
        api.get('/maintenance'),
        api.get('/vehicles'),
      ]);
      if (maintRes.data?.success) setMaintenanceList(maintRes.data.maintenance || []);
      if (vehRes.data?.success) setVehicles(vehRes.data.vehicles || []);
    } catch (err: any) {
      console.error('Failed to load maintenance records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await api.patch(`/maintenance/${id}/approve`, {
        approvalNotes: 'Approved by Fleet Manager',
      });
      if (res.data?.success) {
        setActionSuccess('Maintenance request approved successfully!');
        setTimeout(() => setActionSuccess(null), 3500);
        fetchData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to approve maintenance');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Please provide a reason for rejection:', 'Service deferred');
    if (!reason) return;

    try {
      const res = await api.patch(`/maintenance/${id}/reject`, {
        rejectionReason: reason,
      });
      if (res.data?.success) {
        setActionSuccess('Maintenance request rejected.');
        setTimeout(() => setActionSuccess(null), 3500);
        fetchData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reject maintenance');
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitLoading(true);

    try {
      await api.post('/maintenance/schedule', scheduleData);
      setIsScheduleModalOpen(false);
      setScheduleData({
        vehicleId: '',
        serviceType: '',
        scheduledStartDate: '',
        scheduledEndDate: '',
        serviceCenter: '',
        notes: '',
      });
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to schedule maintenance');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitLoading(true);

    try {
      await api.post('/maintenance/request', requestData);
      setIsRequestModalOpen(false);
      setRequestData({
        vehicleId: '',
        serviceType: '',
        currentOdometer: '',
        runningKmInterval: '10000',
        serviceCenter: '',
        notes: '',
      });
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit maintenance request');
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

  const pendingCount = maintenanceList.filter((m) => m.status === 'pending_approval').length;

  const filteredList = maintenanceList.filter((item) => {
    if (activeTab === 'pending') return item.status === 'pending_approval';
    if (activeTab === 'approved') return ['approved', 'scheduled', 'in_progress', 'good', 'due_soon'].includes(item.status);
    if (activeTab === 'completed') return item.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-4 md:space-y-5 animate-in fade-in duration-200">
      <Header
        title="Maintenance Requests"
        description="Driver maintenance approval queue and periodic workshop scheduling."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setError(null);
                setIsRequestModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Apply Request</span>
            </button>
            <button
              onClick={() => {
                setError(null);
                setIsScheduleModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 h-9 px-4 bg-[#2335f2] hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Maintenance</span>
            </button>
          </div>
        }
      />

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#2335f2] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Requests ({maintenanceList.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-[#2335f2] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Pending Approvals</span>
          {pendingCount > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'approved'
              ? 'bg-[#2335f2] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Approved / Scheduled
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-[#2335f2] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Completed
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading Maintenance Requests...</div>
      ) : filteredList.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No Maintenance Requests Found"
          description={
            activeTab === 'pending'
              ? 'No pending driver maintenance requests awaiting approval.'
              : 'Drivers can apply for maintenance from their app, or Fleet Managers can schedule maintenance periods directly.'
          }
          actionText="Schedule Maintenance"
          onAction={() => setIsScheduleModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((item) => {
            const veh = item.vehicle;
            const isPending = item.status === 'pending_approval';
            const isApproved = ['approved', 'scheduled'].includes(item.status);

            return (
              <div
                key={item._id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isPending
                    ? 'border-amber-200 bg-amber-50/20 shadow-xs'
                    : 'border-slate-200 bg-white shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono font-bold text-sm text-slate-900 tracking-wider">
                        {veh ? veh.vehicleNumber : 'Vehicle Asset'}
                      </span>
                      <h3 className="font-semibold text-xs text-[#2335f2] mt-0.5">
                        {item.serviceType}
                      </h3>
                    </div>
                    <Badge status={item.status} />
                  </div>

                  {/* Submission Details */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    {item.requestedBy && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1 text-slate-500">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          Requested by:
                        </span>
                        <span className="font-semibold text-slate-900">
                          {typeof item.requestedBy === 'object' ? item.requestedBy.name : 'Driver'}
                        </span>
                      </div>
                    )}

                    {(item.currentOdometer || item.lastServiceOdometer) ? (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Gauge className="w-3.5 h-3.5 text-slate-400" />
                          Odometer at Request:
                        </span>
                        <span className="font-mono font-semibold text-slate-900">
                          {(item.currentOdometer || item.lastServiceOdometer || 0).toLocaleString()} km
                        </span>
                      </div>
                    ) : null}

                    {item.runningKmInterval ? (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Gauge className="w-3.5 h-3.5 text-slate-400" />
                          Running Km Interval:
                        </span>
                        <span className="font-mono font-semibold text-slate-900">
                          {item.runningKmInterval.toLocaleString()} km
                        </span>
                      </div>
                    ) : null}

                    {item.scheduledStartDate && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Scheduled Period:
                        </span>
                        <span className="font-medium text-slate-800">
                          {new Date(item.scheduledStartDate).toLocaleDateString()}
                          {item.scheduledEndDate ? ` - ${new Date(item.scheduledEndDate).toLocaleDateString()}` : ''}
                        </span>
                      </div>
                    )}

                    {item.serviceCenter && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          Target Center:
                        </span>
                        <span className="font-medium text-slate-800 truncate max-w-[150px]">
                          {item.serviceCenter}
                        </span>
                      </div>
                    )}

                    {item.notes && (
                      <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 italic">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(item._id)}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Request</span>
                      </button>
                      <button
                        onClick={() => handleReject(item._id)}
                        className="py-1.5 px-3 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-medium text-xs transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  ) : item.status === 'completed' ? (
                    <div className="flex items-center justify-between text-xs text-emerald-600 font-semibold">
                      <span>Service Completed</span>
                      {item.cost ? <span className="font-mono">₹{item.cost.toLocaleString()}</span> : null}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                        Approved • Ready to Service
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
                        className="inline-flex items-center gap-1.5 text-xs text-[#2335f2] hover:text-blue-800 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Log Completed</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Maintenance Modal (Fleet Manager / Admin) */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule Maintenance Period"
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Fleet Vehicle <span className="text-rose-500">*</span>
            </label>
            <select
              name="vehicleId"
              required
              value={scheduleData.vehicleId}
              onChange={(e) => setScheduleData({ ...scheduleData, vehicleId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none font-mono"
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
            <label className="block font-semibold text-slate-700 mb-1">
              Type of Maintenance <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={scheduleData.serviceType}
              onChange={(e) => setScheduleData({ ...scheduleData, serviceType: e.target.value })}
              placeholder="e.g. Major Transmission & Brake Overhaul"
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Start Date / Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={scheduleData.scheduledStartDate}
                onChange={(e) => setScheduleData({ ...scheduleData, scheduledStartDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                End Date / Target Completion
              </label>
              <input
                type="date"
                value={scheduleData.scheduledEndDate}
                onChange={(e) => setScheduleData({ ...scheduleData, scheduledEndDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Designated Service Center / Workshop
            </label>
            <input
              type="text"
              value={scheduleData.serviceCenter}
              onChange={(e) => setScheduleData({ ...scheduleData, serviceCenter: e.target.value })}
              placeholder="e.g. Authorized Tata Service Center, Ambattur"
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Scheduling Notes
            </label>
            <textarea
              rows={2}
              value={scheduleData.notes}
              onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })}
              placeholder="Instructions for the workshop or driver..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-4 py-2 rounded-xl bg-[#2335f2] hover:bg-blue-700 disabled:opacity-50 text-white font-medium transition-colors shadow-sm cursor-pointer"
            >
              {submitLoading ? 'Scheduling...' : 'Confirm Schedule'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Apply / Request Maintenance Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Apply for Maintenance Request"
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRequestSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Vehicle Plate Number <span className="text-rose-500">*</span>
            </label>
            <select
              name="vehicleId"
              required
              value={requestData.vehicleId}
              onChange={(e) => setRequestData({ ...requestData, vehicleId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none font-mono"
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
            <label className="block font-semibold text-slate-700 mb-1">
              Service Type (What type of service) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={requestData.serviceType}
              onChange={(e) => setRequestData({ ...requestData, serviceType: e.target.value })}
              placeholder="e.g. Engine Oil, Brake Pad Replacement, General Inspection"
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Current Odometer (km) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={requestData.currentOdometer}
                onChange={(e) => setRequestData({ ...requestData, currentOdometer: e.target.value })}
                placeholder="e.g. 45200"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Running Kilometer Interval <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={requestData.runningKmInterval}
                onChange={(e) => setRequestData({ ...requestData, runningKmInterval: e.target.value })}
                placeholder="e.g. 10000"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Service Center (Where will service take place) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={requestData.serviceCenter}
              onChange={(e) => setRequestData({ ...requestData, serviceCenter: e.target.value })}
              placeholder="e.g. Ashok Leyland Hub, Guindy"
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={requestData.notes}
              onChange={(e) => setRequestData({ ...requestData, notes: e.target.value })}
              placeholder="Reason for requesting maintenance..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsRequestModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-4 py-2 rounded-xl bg-[#2335f2] hover:bg-blue-700 disabled:opacity-50 text-white font-medium transition-colors shadow-sm cursor-pointer"
            >
              {submitLoading ? 'Submitting...' : 'Submit Request for Approval'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Log Completed Service Modal */}
      <Modal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        title="Log Completed Maintenance"
      >
        <form onSubmit={handleCompleteService} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Completed Odometer (km)
              </label>
              <input
                type="number"
                value={completeData.completedOdometer}
                onChange={(e) => setCompleteData({ ...completeData, completedOdometer: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Service Cost (₹)
              </label>
              <input
                type="number"
                value={completeData.cost}
                onChange={(e) => setCompleteData({ ...completeData, cost: e.target.value })}
                placeholder="0"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Service Center / Workshop
            </label>
            <input
              type="text"
              value={completeData.serviceCenter}
              onChange={(e) => setCompleteData({ ...completeData, serviceCenter: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCompleteModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-4 py-2 rounded-xl bg-[#2335f2] hover:bg-blue-700 text-white font-medium transition-colors shadow-sm cursor-pointer"
            >
              {submitLoading ? 'Saving...' : 'Mark Completed'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
