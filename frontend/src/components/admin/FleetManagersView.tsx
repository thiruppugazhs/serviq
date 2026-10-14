import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { User } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { Header } from '../common/Header';
import { Users2, Plus, Mail, Phone, MapPin, ShieldAlert, KeyRound, Building2, Trash2, FileSpreadsheet, Camera, Upload, X } from 'lucide-react';
import { BulkImportModal } from '../common/BulkImportModal';

export const FleetManagersView: React.FC = () => {
  const [managers, setManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state according to exact requirements:
  // First Name, Last Name, Email, Employee ID, Phone Number, Password (defaults to Employee ID), Station Address
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    phone: '',
    stationAddress: '',
  });
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/fleet-managers');
      if (res.data?.success) {
        setManagers(res.data.fleetManagers || []);
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

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhotoFile(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.employeeId.trim()) {
      setError('Employee ID is required.');
      return;
    }

    if (!formData.phone.trim()) {
      setError('Mobile / Phone number is required (it serves as their initial login password).');
      return;
    }

    setSubmitLoading(true);

    try {
      const data = new FormData();
      data.append('firstName', formData.firstName.trim());
      data.append('lastName', formData.lastName.trim());
      data.append('name', `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim());
      data.append('email', formData.email.trim());
      data.append('employeeId', formData.employeeId.trim());
      data.append('phone', formData.phone.trim());
      data.append('stationAddress', formData.stationAddress.trim());
      data.append('address', formData.stationAddress.trim());
      data.append('password', formData.phone.trim());
      if (profilePhotoFile) {
        data.append('profilePhoto', profilePhotoFile);
      }

      await api.post('/fleet-managers', data);

      setIsModalOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        employeeId: '',
        phone: '',
        stationAddress: '',
      });
      setProfilePhotoFile(null);
      setPhotoPreview(null);
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

  const handleDeleteManager = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete Fleet Manager "${name}"?`)) {
      return;
    }
    try {
      const res = await api.delete(`/fleet-managers/${id}`);
      if (res.data?.success) {
        setManagers((prev) => prev.filter((m) => (m._id || m.id) !== id));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete Fleet Manager');
    }
  };

  return (
    <div className="space-y-4 md:space-y-5 animate-in fade-in duration-200">
      <Header
        title="Fleet Managers"
        description="Authorize and manage station fleet managers with automated employee credentials."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#2335f2]" />
              <span>Bulk Import</span>
            </button>
            <button
              onClick={() => {
                setError(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 h-9 px-4 bg-[#2335f2] hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Fleet Manager</span>
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading Fleet Managers...</div>
      ) : managers.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="No Fleet Managers Assigned Yet"
          description="Register station fleet managers to oversee vehicle assignments, approve driver maintenance requests, and track expenses."
          actionText="Add Fleet Manager"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {managers.map((mgr) => (
            <div key={mgr._id || mgr.id} className="glass-card p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-[#2335f2] overflow-hidden shrink-0 shadow-2xs">
                      {mgr.profilePhoto ? (
                        <img
                          src={mgr.profilePhoto}
                          alt={mgr.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        (mgr.name || 'F').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{mgr.name}</h3>
                      <p className="text-[11px] font-mono text-[#2335f2] font-semibold">
                        {mgr.employeeId ? `Employee ID: ${mgr.employeeId}` : 'Fleet Manager'}
                      </p>
                    </div>
                  </div>
                  <Badge status={mgr.status} />
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{mgr.email}</span>
                  </div>
                  {mgr.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{mgr.phone}</span>
                    </div>
                  )}
                  {(mgr.stationAddress || mgr.address) && (
                    <div className="flex items-start gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="truncate">Station: {mgr.stationAddress || mgr.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteManager(mgr._id || mgr.id, mgr.name || 'Manager')}
                  className="text-xs px-2.5 py-1 rounded-lg font-medium transition-colors border border-rose-200 text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => handleToggleStatus(mgr._id || mgr.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors border cursor-pointer ${
                    mgr.status === 'active'
                      ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                      : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
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
        title="Add Fleet Manager"
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Profile Photo Upload */}
          <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="relative w-16 h-16 rounded-full bg-white border border-slate-300 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Users2 className="w-7 h-7 text-slate-400" />
              )}
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Profile Photo (Optional)
              </label>
              <div className="flex items-center gap-2">
                <label className="px-3 py-1.5 bg-white border border-slate-300 hover:border-[#2335f2] text-slate-700 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1.5 transition-colors shadow-2xs">
                  <Camera className="w-3.5 h-3.5 text-slate-500" />
                  <span>{photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />
                </label>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">JPG, JPEG, PNG, or WebP</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="e.g. Ramesh"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="e.g. Babu"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="manager@serviq.com"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Employee ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="employeeId"
                required
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="e.g. FM-104"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Station Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="stationAddress"
                required
                value={formData.stationAddress}
                onChange={handleChange}
                placeholder="e.g. North Terminal Hub, Chennai"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-5 py-2 bg-[#2335f2] hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
            >
              {submitLoading ? 'Registering...' : 'Create Fleet Manager'}
            </button>
          </div>
        </form>
      </Modal>
      {/* Bulk Import Fleet Managers Modal */}
      <BulkImportModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSuccess={fetchManagers}
        entityName="Fleet Managers"
        apiEndpoint="/fleet-managers/bulk-import"
        payloadKey="managers"
        sampleFileName="serviq_fleet_managers_sample.csv"
        requiredColumns={['name', 'email', 'phone', 'employeeId', 'stationAddress']}
        sampleCsv={`name,email,phone,employeeId,stationAddress\nKavitha Raman,kavitha@domain.com,+91 98401 23456,EMP-FM-01,Central Chennai Depot\nArunachalam S,arun@domain.com,+91 97890 12345,EMP-FM-02,Coimbatore Logistics Park\nPraveen Kumar,praveen@domain.com,+91 94432 78901,EMP-FM-03,Madurai Transit Station`}
      />
    </div>
  );
};
