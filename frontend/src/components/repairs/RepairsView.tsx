import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Repair, Vehicle } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { Header } from '../common/Header';
import {
  AlertTriangle,
  Plus,
  CheckCircle,
  Clock,
  ShieldAlert,
  Truck,
  User,
  Image as ImageIcon,
  Check,
  X,
  Wrench,
} from 'lucide-react';

export const RepairsView: React.FC = () => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'completed'>('all');

  // Modals & state
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const [approvalData, setApprovalData] = useState({
    assignedWorkshop: '',
    approvalNotes: '',
  });

  const [updateStatus, setUpdateStatus] = useState({
    status: 'in_progress',
    assignedWorkshop: '',
    cost: '',
    notes: '',
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [repRes, vehRes] = await Promise.all([
        api.get('/repairs'),
        api.get('/vehicles'),
      ]);
      if (repRes.data?.success) setRepairs(repRes.data.repairs || []);
      if (vehRes.data?.success) setVehicles(vehRes.data.vehicles || []);
    } catch (err: any) {
      console.error('Failed to load repairs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepair) return;
    setSubmitLoading(true);
    setError(null);

    try {
      await api.patch(`/repairs/${selectedRepair._id}/approve`, approvalData);
      setIsApproveModalOpen(false);
      setActionSuccess(`Repair approved for ${selectedRepair.vehicle?.vehicleNumber || 'Vehicle'}. Driver notified.`);
      setTimeout(() => setActionSuccess(null), 3500);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve repair');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Please specify rejection reason for this repair request:', 'Invalid breakdown report');
    if (!reason) return;

    try {
      await api.patch(`/repairs/${id}/reject`, { rejectionReason: reason });
      setActionSuccess('Repair request rejected.');
      setTimeout(() => setActionSuccess(null), 3500);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reject repair');
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

  const pendingCount = repairs.filter((r) => r.status === 'pending_approval' || r.status === 'reported').length;

  const filteredRepairs = repairs.filter((r) => {
    if (activeTab === 'pending') return r.status === 'pending_approval' || r.status === 'reported';
    if (activeTab === 'approved') return r.status === 'approved' || r.status === 'in_progress';
    if (activeTab === 'completed') return r.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-4 md:space-y-5 animate-in fade-in duration-200">
      <Header
        title="Repairs & Breakdown Approvals"
        description="Inspect driver-submitted breakdown reports with photo evidence and authorize workshop repairs."
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
          All Tickets ({repairs.length})
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
          Approved & In Shop
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-[#2335f2] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Resolved / Completed
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading Repair Tickets...</div>
      ) : filteredRepairs.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No Repair Tickets Found"
          description={
            activeTab === 'pending'
              ? 'No driver repair requests currently pending approval.'
              : 'When drivers encounter breakdowns or vehicle damage, they submit photo proof for Fleet Manager approval.'
          }
        />
      ) : (
        <div className="space-y-3.5">
          {filteredRepairs.map((repair) => {
            const veh = repair.vehicle;
            const reporter = repair.reportedBy;
            const isPending = repair.status === 'pending_approval' || repair.status === 'reported';

            return (
              <div
                key={repair._id}
                className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                  isPending
                    ? 'border-amber-200 bg-amber-50/25 shadow-xs'
                    : 'border-slate-200 bg-white shadow-2xs'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {veh ? veh.vehicleNumber : 'Vehicle Asset'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                      {repair.repairWhat || repair.issueType || 'General Repair'}
                    </span>
                    <Badge status={repair.status} size="sm" />
                    {repair.priority && <Badge status={repair.priority} size="sm" />}
                  </div>

                  {/* Why repair happened & details */}
                  <div className="space-y-1 text-xs">
                    {repair.reasonWhy && (
                      <p className="text-slate-800">
                        <strong className="text-slate-600 font-semibold">Why it happened:</strong> {repair.reasonWhy}
                      </p>
                    )}
                    <p className="text-slate-700">
                      <strong className="text-slate-600 font-semibold">Details:</strong> {repair.description}
                    </p>
                  </div>

                  {/* Proof photos preview */}
                  {repair.photos && repair.photos.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1.5 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-[#2335f2]" />
                        <span>Driver Photo Proof ({repair.photos.length}):</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {repair.photos.map((photoUrl, idx) => (
                          <img
                            key={idx}
                            src={photoUrl}
                            alt={`Proof ${idx + 1}`}
                            onClick={() => setPreviewPhoto(photoUrl)}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 hover:scale-105 transition-transform cursor-pointer shadow-2xs"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      Submitted by Driver: <strong className="text-slate-700">{reporter?.name || 'Driver'}</strong>
                    </span>
                    {repair.odometerAtIncident ? (
                      <span>Odometer: <strong className="font-mono text-slate-700">{repair.odometerAtIncident.toLocaleString()} km</strong></span>
                    ) : null}
                    {repair.assignedWorkshop && (
                      <span>Workshop: <strong className="text-slate-700">{repair.assignedWorkshop}</strong></span>
                    )}
                    {repair.cost ? (
                      <span className="text-slate-900 font-mono font-bold">Cost: ₹{repair.cost.toLocaleString()}</span>
                    ) : null}
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex flex-col sm:flex-row md:flex-col items-end gap-2 shrink-0 pt-2 md:pt-0">
                  {isPending ? (
                    <div className="flex items-center gap-2 w-full">
                      <button
                        onClick={() => {
                          setSelectedRepair(repair);
                          setApprovalData({
                            assignedWorkshop: '',
                            approvalNotes: '',
                          });
                          setIsApproveModalOpen(true);
                        }}
                        className="py-1.5 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Repair</span>
                      </button>
                      <button
                        onClick={() => handleReject(repair._id)}
                        className="py-1.5 px-3 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  ) : repair.status === 'completed' ? (
                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
                      Repairs Resolved
                    </span>
                  ) : (
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
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Update Workshop / Cost
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Approve Repair Modal */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title={`Approve Repair: ${selectedRepair?.vehicle?.vehicleNumber || ''}`}
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleApproveSubmit} className="space-y-4 text-xs">
          <p className="text-slate-600">
            Approving authorizes the driver to proceed with repairs for{' '}
            <strong>{selectedRepair?.repairWhat || selectedRepair?.issueType}</strong>.
          </p>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Authorized Workshop / Service Center <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={approvalData.assignedWorkshop}
              onChange={(e) => setApprovalData({ ...approvalData, assignedWorkshop: e.target.value })}
              placeholder="e.g. SRM Central Heavy Workshop, Ambattur"
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Approval Notes / Repair Limits
            </label>
            <textarea
              rows={2}
              value={approvalData.approvalNotes}
              onChange={(e) => setApprovalData({ ...approvalData, approvalNotes: e.target.value })}
              placeholder="e.g. Authorized replacement of brake pads and rotor polishing up to ₹15,000"
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsApproveModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors shadow-sm cursor-pointer"
            >
              {submitLoading ? 'Authorizing...' : 'Authorize & Approve'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Update Repair Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Update Repair Progress"
      >
        <form onSubmit={handleStatusUpdate} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Progress Status
            </label>
            <select
              value={updateStatus.status}
              onChange={(e) => setUpdateStatus({ ...updateStatus, status: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            >
              <option value="in_progress">In Shop / Repairing</option>
              <option value="completed">Completed & Verified</option>
              <option value="rejected">Rejected / Cancelled</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Workshop / Garage
              </label>
              <input
                type="text"
                value={updateStatus.assignedWorkshop}
                onChange={(e) => setUpdateStatus({ ...updateStatus, assignedWorkshop: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Actual Repair Cost (₹)
              </label>
              <input
                type="number"
                value={updateStatus.cost}
                onChange={(e) => setUpdateStatus({ ...updateStatus, cost: e.target.value })}
                placeholder="0"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsUpdateModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-4 py-2 rounded-xl bg-[#2335f2] hover:bg-blue-700 text-white font-medium transition-colors shadow-sm cursor-pointer"
            >
              {submitLoading ? 'Updating...' : 'Save Updates'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <div
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewPhoto} alt="Full Proof" className="w-full max-h-[80vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
};
