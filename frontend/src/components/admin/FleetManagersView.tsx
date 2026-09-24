import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { User } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { Users2, Plus, Mail, Phone, MapPin, BadgeCheck, ShieldAlert, KeyRound } from 'lucide-react';

export const FleetManagersView: React.FC = () => {
  const [managers, setManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    address: '',
    password: '',
  });

  const fetchManagers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/fleet-managers');
      if (res.data.success) {
        setManagers(res.data.fleetManagers);
      }
    } catch (err: any) {
      console.error('Failed to load fleet managers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitLoading(true);

    try {
      await api.post('/fleet-managers', formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        employeeId: '',
        address: '',
        password: '',
      });
      fetchManagers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create Fleet Manager');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await api.patch(`/fleet-managers/${id}/toggle-status`);
      fetchManagers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Outfit',sans-serif]">
            Fleet Managers
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authorize and manage operational fleet managers for your organization.
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl transition-colors shadow-lg shadow-emerald-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>Add Fleet Manager</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading Fleet Managers...</div>
      ) : managers.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="No Fleet Managers Assigned Yet"
          description="Only Organization Admins can create Fleet Managers. Assign managers to oversee drivers, inspect maintenance schedules, and monitor repairs."
          actionText="Add First Fleet Manager"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {managers.map((mgr) => (
            <div key={mgr._id || mgr.id} className="glass-card p-5 rounded-2xl border flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white">
                      {mgr.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{mgr.name}</h3>
                      <p className="text-[11px] text-slate-400">
                        {mgr.employeeId ? `Emp ID: ${mgr.employeeId}` : 'Fleet Manager'}
                      </p>
                    </div>
                  </div>
                  <Badge status={mgr.status} />
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{mgr.email}</span>
                  </div>
                  {mgr.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{mgr.phone}</span>
                    </div>
                  )}
                  {mgr.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{mgr.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Role: Organization Controller
                </span>
                <button
                  onClick={() => handleToggleStatus(mgr._id || mgr.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    mgr.status === 'active'
                      ? 'text-rose-400 hover:bg-rose-500/10'
                      : 'text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                >
                  {mgr.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Fleet Manager Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Fleet Manager Account"
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ramesh Babu"
              className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Official Email <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="manager@company.com"
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Employee ID
              </label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="e.g. FM-104"
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Login Password <span className="text-rose-400">*</span>
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Station / Address
            </label>
            <textarea
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              placeholder="Depot or Regional office address"
              className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium"
            >
              {submitLoading ? 'Creating Manager...' : 'Confirm Account Creation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
