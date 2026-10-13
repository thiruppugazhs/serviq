import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/client';
import { Driver, Vehicle } from '../../types';
import {
  Home,
  Plus,
  Search,
  Phone,
  MoreVertical,
  X,
  ShieldAlert,
  Bus,
} from 'lucide-react';

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
  const [activeMenuDriverId, setActiveMenuDriverId] = useState<string | null>(null);

  // Modal Form State matching exact design
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    licenseNo: '',
    assignedVehicleId: '',
    dob: '',
    gender: '',
  });

  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [driversRes, vehiclesRes] = await Promise.all([
        api.get('/drivers'),
        api.get('/vehicles'),
      ]);
      if (driversRes.data?.success) setDrivers(driversRes.data.drivers || []);
      if (vehiclesRes.data?.success) setVehicles(vehiclesRes.data.vehicles || []);
    } catch (err: any) {
      console.error('Failed to load drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName.trim() || !formData.mobile.trim() || !formData.email.trim()) {
      setError('Please fill in all required fields (Full name, Mobile, Email).');
      return;
    }

    setSubmitLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.fullName.trim());
      formPayload.append('mobile', formData.mobile.trim());
      formPayload.append('phone', formData.mobile.trim());
      formPayload.append('email', formData.email.trim());
      formPayload.append('drivingLicenceNumber', formData.licenseNo.trim() || 'N/A');
      formPayload.append('assignedVehicleId', formData.assignedVehicleId || '');
      formPayload.append('dob', formData.dob || '');
      formPayload.append('dateOfBirth', formData.dob || '');
      formPayload.append('gender', formData.gender || '');

      if (selectedPhoto) {
        formPayload.append('profilePhoto', selectedPhoto);
      }

      await api.post('/drivers', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setIsModalOpen(false);
      setFormData({
        fullName: '',
        mobile: '',
        email: '',
        licenseNo: '',
        assignedVehicleId: '',
        dob: '',
        gender: '',
      });
      setSelectedPhoto(null);
      setPhotoPreview(null);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create driver');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await api.patch(`/drivers/${id}/toggle-status`);
      setActiveMenuDriverId(null);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredDrivers = drivers.filter((d) => {
    const userName = typeof d.user === 'object' ? d.user.name : '';
    const email = typeof d.user === 'object' ? d.user.email : '';
    const phone = typeof d.user === 'object' ? d.user.phone : '';
    const license = d.drivingLicenceNumber || '';
    const query = search.toLowerCase();
    return (
      userName.toLowerCase().includes(query) ||
      (phone && phone.toLowerCase().includes(query)) ||
      (license && license.toLowerCase().includes(query)) ||
      email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4 md:space-y-5 animate-in fade-in duration-200">
      {/* Top Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-300">&gt;</span>
        <span className="hover:text-slate-700 cursor-pointer">Dashboard</span>
        <span className="text-slate-300">&gt;</span>
        <span className="text-slate-900 font-semibold">Drivers</span>
      </div>

      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Anek_Latin',sans-serif] tracking-tight">
            Driver Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage driver profiles, licenses, and assignments.
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 h-10 px-5 bg-[#f59e0b] hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Driver</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Search bar row */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drivers..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 text-slate-800 outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all"
            />
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading driver profiles...</div>
        ) : filteredDrivers.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-800">No driver profiles found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {search
                ? 'No drivers matched your search criteria.'
                : 'Add your first commercial driver profile with licenses and vehicle assignment.'}
            </p>
            {!search && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-4 py-2 bg-[#f59e0b] hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                + Add Driver
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-800 tracking-wider">
                  <th className="py-3.5 px-6">Driver Details</th>
                  <th className="py-3.5 px-6">License No.</th>
                  <th className="py-3.5 px-6">Assigned Vehicle</th>
                  <th className="py-3.5 px-6">DOB</th>
                  <th className="py-3.5 px-6 text-right w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredDrivers.map((driver) => {
                  const userObj = typeof driver.user === 'object' ? driver.user : null;
                  const driverName = userObj?.name || 'Driver';
                  const driverPhone = userObj?.phone || '';
                  const assignedVeh =
                    typeof driver.assignedVehicle === 'object' ? driver.assignedVehicle : null;
                  const isMenuOpen = activeMenuDriverId === driver._id;

                  return (
                    <tr
                      key={driver._id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Driver Details */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {/* Driver Icon/Avatar */}
                          <div className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden text-slate-700">
                            {driver.profilePhoto ? (
                              <img
                                src={driver.profilePhoto}
                                alt={driverName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <svg
                                className="w-5 h-5 text-slate-700"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="7" r="4" />
                                <path d="M5.5 21a7 7 0 0 1 13 0" />
                                <path d="M8 3h8l1 3H7z" />
                              </svg>
                            )}
                          </div>

                          <div>
                            <span className="font-bold text-slate-900 block text-xs">
                              {driverName}
                            </span>
                            {driverPhone && (
                              <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {driverPhone}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* License No. */}
                      <td className="py-4 px-6 font-mono text-slate-600">
                        {driver.drivingLicenceNumber && driver.drivingLicenceNumber !== 'N/A'
                          ? driver.drivingLicenceNumber
                          : 'N/A'}
                      </td>

                      {/* Assigned Vehicle */}
                      <td className="py-4 px-6">
                        {assignedVeh ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs font-semibold shadow-2xs font-mono">
                            <Bus className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span>{assignedVeh.vehicleNumber}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Unassigned</span>
                        )}
                      </td>

                      {/* DOB */}
                      <td className="py-4 px-6 text-slate-700 font-mono">
                        {driver.dateOfBirth
                          ? new Date(driver.dateOfBirth).toISOString().split('T')[0]
                          : 'N/A'}
                      </td>

                      {/* Actions ⋮ */}
                      <td className="py-4 px-6 text-right relative">
                        <button
                          onClick={() =>
                            setActiveMenuDriverId(isMenuOpen ? null : driver._id)
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Actions Dropdown Menu */}
                        {isMenuOpen && (
                          <div
                            onMouseLeave={() => setActiveMenuDriverId(null)}
                            className="absolute right-6 top-10 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1.5 text-xs text-left animate-in fade-in zoom-in-95"
                          >
                            <button
                              onClick={() => {
                                setActiveMenuDriverId(null);
                                navigate(`${basePath}/drivers/${driver._id}`);
                              }}
                              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 cursor-pointer"
                            >
                              View Profile
                            </button>
                            <button
                              onClick={() => handleToggleStatus(driver._id)}
                              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 cursor-pointer"
                            >
                              {driver.status === 'active' ? 'Mark Standby' : 'Set Active'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Driver Modal matching exact screenshots */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-7 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 my-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-['Anek_Latin',sans-serif]">
                  New Driver
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add a driver profile to the school.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddDriver} className="space-y-4 text-xs">
              {/* Full name * */}
              <div>
                <label className="block text-xs font-medium text-slate-800 mb-1.5">
                  Full name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder=""
                  className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                />
              </div>

              {/* Mobile * */}
              <div>
                <label className="block text-xs font-medium text-slate-800 mb-1.5">
                  Mobile <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder=""
                  className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                />
              </div>

              {/* Email * */}
              <div>
                <label className="block text-xs font-medium text-slate-800 mb-1.5">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=""
                  className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                />
              </div>

              {/* License No. & Assigned Vehicle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-800 mb-1.5">
                    License No.
                  </label>
                  <input
                    type="text"
                    name="licenseNo"
                    value={formData.licenseNo}
                    onChange={handleChange}
                    placeholder=""
                    className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-800 mb-1.5">
                    Assigned Vehicle
                  </label>
                  <select
                    name="assignedVehicleId"
                    value={formData.assignedVehicleId}
                    onChange={handleChange}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all font-mono"
                  >
                    <option value="">Select a vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.vehicleNumber} ({v.manufacturer} {v.model})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DOB & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-800 mb-1.5">
                    DOB
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    placeholder="dd-mm-yyyy"
                    className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-800 mb-1.5">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Driver Photo Drag and Drop area */}
              <div>
                <label className="block text-xs font-medium text-slate-800 mb-1.5">
                  Driver photo
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-white group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />

                  {photoPreview ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={photoPreview}
                        alt="Driver Preview"
                        className="w-16 h-16 rounded-xl object-cover mb-2 border border-slate-200"
                      />
                      <p className="text-xs font-semibold text-emerald-600">
                        Photo selected ({selectedPhoto?.name})
                      </p>
                      <span className="text-[10px] text-slate-400">Click to change</span>
                    </div>
                  ) : (
                    <div>
                      <div className="w-11 h-11 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                        <svg
                          className="w-5 h-5 text-amber-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                          <path d="M16 5v6" />
                          <path d="M13 8h6" />
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-slate-800">
                        Drop an image here or click to select
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        JPG, PNG, or WebP · max 5 MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom buttons matching screenshot */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  {submitLoading ? 'Creating...' : 'Create Driver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
