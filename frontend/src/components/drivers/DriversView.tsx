import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/client';
import { Driver, Vehicle } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { UserCheck, Plus, Search, Phone, Mail, Truck, ShieldAlert, FileText, ChevronRight } from 'lucide-react';

export const DriversView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/manager';

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add Driver Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    driverId: '',
    drivingLicenceNumber: '',
    licenceExpiry: '',
    employmentStatus: 'full_time',
    assignedVehicleId: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [driversRes, vehiclesRes] = await Promise.all([
        api.get('/drivers'),
        api.get('/vehicles'),
      ]);
      if (driversRes.data.success) setDrivers(driversRes.data.drivers);
      if (vehiclesRes.data.success) setVehicles(vehiclesRes.data.vehicles);
    } catch (err: any) {
      console.error('Failed to load drivers:', err);
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

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitLoading(true);

    try {
      await api.post('/drivers', formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        driverId: '',
        drivingLicenceNumber: '',
        licenceExpiry: '',
        employmentStatus: 'full_time',
        assignedVehicleId: '',
      });
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add driver');
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredDrivers = drivers.filter((d) => {
    const userName = typeof d.user === 'object' ? d.user.name : '';
    const email = typeof d.user === 'object' ? d.user.email : '';
    const query = search.toLowerCase();
    return (
      userName.toLowerCase().includes(query) ||
      d.driverId.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query) ||
      d.drivingLicenceNumber.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Outfit',sans-serif]">
            Driver Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Registered commercial drivers, licences, emergency contacts, and vehicle assignments.
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
          <span>Add New Driver</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by driver name, Driver ID (e.g. DRV-001), or licence number..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading Drivers...</div>
      ) : filteredDrivers.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No Drivers Registered Yet"
          description="Register company drivers to allocate vehicles, receive roadside breakdown tickets, and monitor licence validity."
          actionText="Add First Driver"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDrivers.map((driver) => {
            const userName = typeof driver.user === 'object' ? driver.user.name : 'Driver';
            const userEmail = typeof driver.user === 'object' ? driver.user.email : '';
            const userPhone = typeof driver.user === 'object' ? driver.user.phone : '';
            const assignedVeh = typeof driver.assignedVehicle === 'object' ? driver.assignedVehicle : null;

            return (
              <div
                key={driver._id}
                onClick={() => navigate(`${basePath}/drivers/${driver._id}`)}
                className="glass-card p-5 rounded-2xl border hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                            {userName}
                          </h3>
                        </div>
                        <p className="text-[11px] font-mono text-emerald-400 font-semibold">
                          {driver.driverId}
                        </p>
                      </div>
                    </div>
                    <Badge status={driver.status} />
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{userEmail}</span>
                    </div>
                    {userPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{userPhone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Licence: {driver.drivingLicenceNumber}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Truck className="w-3.5 h-3.5 text-slate-500" />
                      <span>Assigned Vehicle:</span>
                    </div>
                    <span className="font-bold font-mono text-white">
                      {assignedVeh ? assignedVeh.vehicleNumber : 'Unassigned'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>View Full Profile</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Driver Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Commercial Driver"
        maxWidth="xl"
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAddDriver} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Driver Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Kumar"
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Driver ID <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="driverId"
                required
                value={formData.driverId}
                onChange={handleChange}
                placeholder="e.g. DRV-001"
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none uppercase font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Login Email Address <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@company.com"
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                App Password <span className="text-rose-400">*</span>
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
                Employment Type
              </label>
              <select
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
              >
                <option value="full_time">Full Time</option>
                <option value="contract">Contract</option>
                <option value="probation">Probation</option>
                <option value="part_time">Part Time</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Driving Licence Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="drivingLicenceNumber"
                required
                value={formData.drivingLicenceNumber}
                onChange={handleChange}
                placeholder="e.g. DL-0420110012345"
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none uppercase font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Licence Expiry Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                name="licenceExpiry"
                required
                value={formData.licenceExpiry}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Assign Initial Vehicle (Optional)
            </label>
            <select
              name="assignedVehicleId"
              value={formData.assignedVehicleId}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none font-mono"
            >
              <option value="">-- No vehicle assigned initially --</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.vehicleNumber} ({v.manufacturer} {v.model})
                </option>
              ))}
            </select>
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
              {submitLoading ? 'Registering...' : 'Save Driver'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
