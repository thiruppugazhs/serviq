import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Vehicle, Driver } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { Truck, Plus, Search, Gauge, User, ShieldAlert, Calendar, Fuel } from 'lucide-react';

export const VehiclesView: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOdoModalOpen, setIsOdoModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [newOdometerInput, setNewOdometerInput] = useState<number | string>('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add Vehicle Form state
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'Truck',
    manufacturer: '',
    model: '',
    year: new Date().getFullYear(),
    fuelType: 'Diesel',
    odometer: 0,
    assignedDriverId: '',
    status: 'available',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vehRes, drvRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/drivers'),
      ]);
      if (vehRes.data.success) setVehicles(vehRes.data.vehicles);
      if (drvRes.data.success) setDrivers(drvRes.data.drivers);
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
    setSubmitLoading(true);

    try {
      await api.post('/vehicles', formData);
      setIsAddModalOpen(false);
      setFormData({
        vehicleNumber: '',
        vehicleType: 'Truck',
        manufacturer: '',
        model: '',
        year: new Date().getFullYear(),
        fuelType: 'Diesel',
        odometer: 0,
        assignedDriverId: '',
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
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Outfit',sans-serif]">
            Vehicle Fleet Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Registered commercial haulers, buses, trucks, and driver assignments.
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
          <span>Add Fleet Asset</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by license plate (e.g. TN 01 AB 1234), model, or type..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading Vehicles...</div>
      ) : filteredVehicles.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No Vehicles Registered Yet"
          description="Build your fleet registry. Enter registration plate numbers, specifications, and allocate drivers."
          actionText="Add First Vehicle"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((vehicle) => {
            const driver = typeof vehicle.assignedDriver === 'object' ? vehicle.assignedDriver : null;
            const driverUser = driver && typeof driver.user === 'object' ? driver.user : null;

            return (
              <div
                key={vehicle._id}
                className="glass-card p-5 rounded-2xl border flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                        {vehicle.vehicleType} • {vehicle.fuelType}
                      </div>
                      <h3 className="font-extrabold text-base text-white font-mono tracking-wider mt-0.5">
                        {vehicle.vehicleNumber}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {vehicle.manufacturer} {vehicle.model} ({vehicle.year})
                      </p>
                    </div>
                    <Badge status={vehicle.status} />
                  </div>

                  {/* Odometer readout */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-slate-400">Odometer:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white font-mono">
                        {vehicle.odometer.toLocaleString()} km
                      </span>
                      <button
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setNewOdometerInput(vehicle.odometer);
                          setError(null);
                          setIsOdoModalOpen(true);
                        }}
                        className="text-[10px] text-emerald-400 hover:text-white px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20"
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  {/* Assigned Driver */}
                  <div className="mt-3 flex items-center gap-2.5 text-xs text-slate-300">
                    <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>Driver:</span>
                    <span className="font-semibold text-white">
                      {driverUser ? `${driverUser.name} (${driver?.driverId})` : 'Unassigned'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>SERVIQ Fleet Asset</span>
                  <span className="text-slate-400">Status: {vehicle.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Fleet Vehicle"
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAddVehicle} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Vehicle Plate Number <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="vehicleNumber"
              required
              value={formData.vehicleNumber}
              onChange={handleChange}
              placeholder="e.g. TN 01 AB 1234"
              className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none font-mono uppercase"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Vehicle Type
              </label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
              >
                <option value="Truck">Truck</option>
                <option value="Bus">Bus</option>
                <option value="Hauler">Hauler</option>
                <option value="Van">Van</option>
                <option value="Sedan">Sedan</option>
                <option value="EV">EV</option>
                <option value="SUV">SUV</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Fuel Type
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
              >
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block font-semibold text-slate-300 mb-1">
                Manufacturer <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="manufacturer"
                required
                value={formData.manufacturer}
                onChange={handleChange}
                placeholder="e.g. Ashok Leyland"
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block font-semibold text-slate-300 mb-1">
                Model <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="model"
                required
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. Boss 1616"
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block font-semibold text-slate-300 mb-1">
                Year <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                name="year"
                required
                value={formData.year}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Current Odometer (km)
              </label>
              <input
                type="number"
                name="odometer"
                value={formData.odometer}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Assign Driver
              </label>
              <select
                name="assignedDriverId"
                value={formData.assignedDriverId}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
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
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium"
            >
              {submitLoading ? 'Registering Asset...' : 'Save Vehicle'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Update Odometer Modal */}
      <Modal
        isOpen={isOdoModalOpen}
        onClose={() => setIsOdoModalOpen(false)}
        title={`Update Odometer: ${selectedVehicle?.vehicleNumber}`}
        maxWidth="sm"
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleUpdateOdometer} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              New Odometer (km)
            </label>
            <input
              type="number"
              required
              min={selectedVehicle?.odometer || 0}
              value={newOdometerInput}
              onChange={(e) => setNewOdometerInput(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white outline-none font-mono text-sm"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Current reading: {selectedVehicle?.odometer.toLocaleString()} km
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOdoModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            >
              {submitLoading ? 'Updating...' : 'Save Reading'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
