import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Vehicle, Driver } from '../../types';
import {
  Home,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  MoreVertical,
  X,
  ShieldAlert,
  Gauge,
  User,
  Calendar,
} from 'lucide-react';

export const VehiclesView: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOdoModalOpen, setIsOdoModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [newOdometerInput, setNewOdometerInput] = useState<number | string>('');
  const [activeMenuVehicleId, setActiveMenuVehicleId] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add Vehicle Form state (matches required fields)
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'Van',
    fuelType: 'Diesel',
    manufacturer: '',
    model: '',
    year: new Date().getFullYear(),
    odometer: 0,
    assignedDriverId: '',
    fcBook: '',
    fcExpiryDate: '',
    status: 'available',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vehRes, drvRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/drivers'),
      ]);
      if (vehRes.data?.success) setVehicles(vehRes.data.vehicles || []);
      if (drvRes.data?.success) setDrivers(drvRes.data.drivers || []);
    } catch (err: any) {
      console.error('Failed to load fleet assets:', err);
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

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.vehicleNumber.trim() || !formData.manufacturer.trim() || !formData.model.trim()) {
      setError('Vehicle plate number, manufacturer, and model are required.');
      return;
    }

    setSubmitLoading(true);

    try {
      await api.post('/vehicles', {
        vehicleNumber: formData.vehicleNumber.trim().toUpperCase(),
        vehicleType: formData.vehicleType,
        fuelType: formData.fuelType,
        manufacturer: formData.manufacturer.trim(),
        model: formData.model.trim(),
        year: Number(formData.year),
        odometer: Number(formData.odometer) || 0,
        assignedDriverId: formData.assignedDriverId || null,
        assignedDriver: formData.assignedDriverId || null,
        fcBook: formData.fcBook.trim(),
        fcExpiryDate: formData.fcExpiryDate || null,
        status: formData.status,
      });

      setIsAddModalOpen(false);
      setFormData({
        vehicleNumber: '',
        vehicleType: 'Van',
        fuelType: 'Diesel',
        manufacturer: '',
        model: '',
        year: new Date().getFullYear(),
        odometer: 0,
        assignedDriverId: '',
        fcBook: '',
        fcExpiryDate: '',
        status: 'available',
      });
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUpdateOdometer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;
    setError(null);
    setSubmitLoading(true);

    try {
      await api.patch(`/vehicles/${selectedVehicle._id}/odometer`, {
        newOdometer: Number(newOdometerInput),
      });
      setIsOdoModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update odometer');
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const query = search.toLowerCase();
    return (
      v.vehicleNumber.toLowerCase().includes(query) ||
      v.manufacturer.toLowerCase().includes(query) ||
      v.model.toLowerCase().includes(query) ||
      v.vehicleType.toLowerCase().includes(query)
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
        <span className="text-slate-900 font-semibold">Vehicles</span>
      </div>

      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Anek_Latin',sans-serif] tracking-tight">
            Vehicle Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your fleet, maintenance logs, and GPS status.
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 h-10 px-5 bg-[#f59e0b] hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Search Bar Row */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vehicles..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 text-slate-800 outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all"
            />
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading vehicles...</div>
        ) : filteredVehicles.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-800">No vehicles registered</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {search ? 'No vehicles matched your search query.' : 'Add your first commercial fleet vehicle to monitor health, status, and FC.'}
            </p>
            {!search && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 px-4 py-2 bg-[#f59e0b] hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                + Add Vehicle
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-800 tracking-wider">
                  <th className="py-3.5 px-6">Vehicle ID</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Health</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredVehicles.map((vehicle, index) => {
                  const isMenuOpen = activeMenuVehicleId === vehicle._id;
                  const isHealthy = vehicle.status !== 'in_shop' && vehicle.status !== 'out_of_service';

                  return (
                    <tr
                      key={vehicle._id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Vehicle ID (Index + Registration Number underneath) */}
                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-900 block text-sm">
                          {index + 1}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mt-0.5">
                          {vehicle.vehicleNumber}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {vehicle.vehicleType}
                      </td>

                      {/* Health */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                          {isHealthy ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              <span>Healthy</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                              <span className="text-amber-600">In Shop</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Status (Soft green pill matching Operational) */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            vehicle.status === 'in_shop'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : vehicle.status === 'out_of_service'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                          }`}
                        >
                          {vehicle.status === 'available' || vehicle.status === 'on_trip'
                            ? 'Operational'
                            : vehicle.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Actions ⋮ */}
                      <td className="py-4 px-6 text-right relative">
                        <button
                          onClick={() =>
                            setActiveMenuVehicleId(isMenuOpen ? null : vehicle._id)
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Actions Dropdown */}
                        {isMenuOpen && (
                          <div
                            onMouseLeave={() => setActiveMenuVehicleId(null)}
                            className="absolute right-6 top-10 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1.5 text-xs text-left animate-in fade-in zoom-in-95"
                          >
                            <button
                              onClick={() => {
                                setSelectedVehicle(vehicle);
                                setNewOdometerInput(vehicle.odometer);
                                setActiveMenuVehicleId(null);
                                setIsOdoModalOpen(true);
                              }}
                              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Gauge className="w-3.5 h-3.5 text-slate-400" />
                              <span>Update Odometer</span>
                            </button>
                            <div className="px-3 py-1 text-[10px] text-slate-400 border-t border-slate-100">
                              Odo: {vehicle.odometer.toLocaleString()} km
                              {vehicle.fcBook ? ` • FC: ${vehicle.fcBook}` : ''}
                            </div>
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

      {/* New Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-7 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 my-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-['Anek_Latin',sans-serif]">
                  New Vehicle
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add a commercial vehicle to your fleet registry.
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
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

            <form onSubmit={handleAddVehicle} className="space-y-4 text-xs">
              {/* Vehicle Plate Number * */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Vehicle Plate Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="vehicleNumber"
                  required
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  placeholder="e.g. TN 12 P 3048"
                  className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-mono uppercase transition-all"
                />
              </div>

              {/* Vehicle Type & Fuel Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Vehicle Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  >
                    <option value="Van">Van</option>
                    <option value="Bus">Bus</option>
                    <option value="Truck">Truck</option>
                    <option value="Hauler">Hauler</option>
                    <option value="Sedan">Sedan</option>
                    <option value="EV">EV</option>
                    <option value="SUV">SUV</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Fuel Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              {/* Manufacturer & Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Manufacturer <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="manufacturer"
                    required
                    value={formData.manufacturer}
                    onChange={handleChange}
                    placeholder="e.g. Ashok Leyland / Force / Tata"
                    className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Model <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="model"
                    required
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g. Urbania / Boss 1616"
                    className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  />
                </div>
              </div>

              {/* Year & Current Odometer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Year <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="year"
                    required
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Current Odometer (km)
                  </label>
                  <input
                    type="number"
                    name="odometer"
                    value={formData.odometer}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-mono transition-all"
                  />
                </div>
              </div>

              {/* Driver Assignment */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Driver Assignment
                </label>
                <select
                  name="assignedDriverId"
                  value={formData.assignedDriverId}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white transition-all font-mono"
                >
                  <option value="">-- No Driver Assigned --</option>
                  {drivers.map((d) => {
                    const u = typeof d.user === 'object' ? d.user : null;
                    return (
                      <option key={d._id} value={d._id}>
                        {u ? u.name : d.driverId} ({d.driverId})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Vehicle FC Book & FC Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Vehicle FC Book <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fcBook"
                    required
                    value={formData.fcBook}
                    onChange={handleChange}
                    placeholder="e.g. FC-BK-99214"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Vehicle FC Expiry Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="fcExpiryDate"
                    required
                    value={formData.fcExpiryDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white transition-all font-mono"
                  />
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  {submitLoading ? 'Registering...' : 'Create Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Odometer Modal */}
      {isOdoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Update Odometer: {selectedVehicle?.vehicleNumber}
              </h3>
              <button
                onClick={() => setIsOdoModalOpen(false)}
                className="w-7 h-7 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleUpdateOdometer} className="space-y-4 text-xs pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Current Mileage (km)
                </label>
                <input
                  type="number"
                  required
                  value={newOdometerInput}
                  onChange={(e) => setNewOdometerInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs font-mono outline-none focus:border-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOdoModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-5 py-2 rounded-xl bg-[#f59e0b] hover:bg-amber-500 text-slate-950 font-bold shadow-xs"
                >
                  Save Odometer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
