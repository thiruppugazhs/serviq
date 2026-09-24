import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Vehicle, Repair } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Truck,
  Gauge,
  AlertTriangle,
  Plus,
  ShieldCheck,
  CheckCircle2,
  FileText,
  User,
  LogOut,
  Camera,
  PhoneCall,
  Clock,
  Sparkles,
} from 'lucide-react';

export const DriverHome: React.FC = () => {
  const { user, logout } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [myRepairs, setMyRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'vehicle' | 'report' | 'repairs' | 'profile'>('home');

  // Modals
  const [isOdoModalOpen, setIsOdoModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [newOdometer, setNewOdometer] = useState<string | number>('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Issue report form
  const [reportData, setReportData] = useState({
    issueType: 'Engine',
    description: '',
    priority: 'medium',
    odometerAtIncident: '',
  });

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      const [vehRes, repRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/repairs'),
      ]);

      if (vehRes.data.success && vehRes.data.vehicles.length > 0) {
        setVehicle(vehRes.data.vehicles[0]);
        setNewOdometer(vehRes.data.vehicles[0].odometer);
      }
      if (repRes.data.success) {
        setMyRepairs(repRes.data.repairs);
      }
    } catch (err) {
      console.error('Failed to load driver assigned data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverData();
  }, []);

  const handleUpdateOdometer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;
    setError(null);
    setSubmitLoading(true);

    try {
      await api.patch(`/vehicles/${vehicle._id}/odometer`, {
        newOdometer: Number(newOdometer),
      });
      setIsOdoModalOpen(false);
      setSuccessMessage('Odometer updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchDriverData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update odometer');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;
    setError(null);
    setSubmitLoading(true);

    try {
      await api.post('/repairs', {
        vehicleId: vehicle._id,
        issueType: reportData.issueType,
        description: reportData.description,
        priority: reportData.priority,
        odometerAtIncident: reportData.odometerAtIncident || vehicle.odometer,
      });

      setIsReportModalOpen(false);
      setReportData({
        issueType: 'Engine',
        description: '',
        priority: 'medium',
        odometerAtIncident: '',
      });
      setSuccessMessage('Issue reported to Fleet Manager!');
      setTimeout(() => setSuccessMessage(null), 4000);
      fetchDriverData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20 max-w-md mx-auto relative border-x border-slate-900 shadow-2xl flex flex-col justify-between">
      {/* Mobile Top Header */}
      <div className="bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/logo-blue.png" alt="SERVIQ" className="w-8 h-8 object-contain" />
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit',sans-serif]">
              SERVIQ DRIVER
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold">
              Commercial Driver Portal
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-5 flex-1">
        {successMessage && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Driver Greeting Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-lg">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Driver on Duty
              </span>
              <h2 className="text-xl font-extrabold text-white font-['Outfit',sans-serif] mt-0.5">
                Hi, {user?.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Vehicle road-readiness and active trip log.
              </p>
            </div>

            {/* Assigned Vehicle Card */}
            {vehicle ? (
              <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      My Assigned Asset
                    </span>
                    <h3 className="text-2xl font-extrabold font-mono text-white tracking-wider mt-0.5">
                      {vehicle.vehicleNumber}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">
                      {vehicle.manufacturer} {vehicle.model} ({vehicle.year})
                    </p>
                  </div>
                  <Badge status={vehicle.status} size="sm" />
                </div>

                {/* Odometer readout */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-400">Current Odo:</span>
                  </div>
                  <span className="font-mono font-bold text-base text-white">
                    {vehicle.odometer.toLocaleString()} km
                  </span>
                </div>

                {/* Quick Touch Actions */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => {
                      setNewOdometer(vehicle.odometer);
                      setError(null);
                      setIsOdoModalOpen(true);
                    }}
                    className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors flex flex-col justify-between"
                  >
                    <Gauge className="w-5 h-5 text-emerald-400 mb-2" />
                    <div>
                      <div className="text-xs font-bold text-white">Log Odometer</div>
                      <div className="text-[10px] text-slate-400">Update mileage</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setError(null);
                      setIsReportModalOpen(true);
                    }}
                    className="p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-left transition-colors flex flex-col justify-between"
                  >
                    <AlertTriangle className="w-5 h-5 text-rose-400 mb-2" />
                    <div>
                      <div className="text-xs font-bold text-rose-300">Report Issue</div>
                      <div className="text-[10px] text-rose-400/80">Roadside breakdown</div>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-center">
                <Truck className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <h3 className="font-bold text-sm text-white">No Vehicle Assigned</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Contact your Fleet Manager or Organization Admin to link your commercial asset.
                </p>
              </div>
            )}

            {/* Recent breakdown tickets filed by driver */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Recent Ticket History
                </h4>
                <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                  {myRepairs.length} filed
                </span>
              </div>

              {myRepairs.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-500">
                  No breakdown reports filed yet. All systems road-ready!
                </div>
              ) : (
                myRepairs.slice(0, 3).map((r) => (
                  <div
                    key={r._id}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{r.issueType}</span>
                        <Badge status={r.status} size="sm" />
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-[200px] mt-0.5">
                        {r.description}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                      {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: MY VEHICLE */}
        {activeTab === 'vehicle' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
              Vehicle Health & Specs
            </h2>
            {vehicle ? (
              <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
                <div className="text-center py-4 border-b border-slate-800">
                  <div className="font-mono text-2xl font-black text-white tracking-widest">
                    {vehicle.vehicleNumber}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {vehicle.manufacturer} {vehicle.model} • {vehicle.fuelType}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900">
                    <span className="text-slate-400 block text-[10px]">Type</span>
                    <span className="font-semibold text-white">{vehicle.vehicleType}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900">
                    <span className="text-slate-400 block text-[10px]">Year</span>
                    <span className="font-semibold text-white">{vehicle.year}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900">
                    <span className="text-slate-400 block text-[10px]">Fuel Type</span>
                    <span className="font-semibold text-white">{vehicle.fuelType}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900">
                    <span className="text-slate-400 block text-[10px]">Odometer</span>
                    <span className="font-semibold text-white font-mono">{vehicle.odometer.toLocaleString()} km</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">No vehicle assigned</div>
            )}
          </div>
        )}

        {/* Tab 3: PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
              Driver Profile
            </h2>
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 text-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{user?.name}</h3>
                  <p className="text-slate-400">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Phone</span>
                  <span className="text-white font-medium">{user?.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Role</span>
                  <span className="text-emerald-400 font-semibold uppercase">Commercial Driver</span>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full mt-4 py-2.5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/30 font-semibold rounded-xl transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Touch-First Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-6 py-2 flex items-center justify-between z-40">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'home' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('vehicle')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'vehicle' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Gauge className="w-5 h-5" />
          <span>Vehicle</span>
        </button>

        {/* Central Floating "Report Issue" Button */}
        <button
          onClick={() => {
            setError(null);
            setIsReportModalOpen(true);
          }}
          className="w-12 h-12 -mt-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-950/60 transition-transform active:scale-95"
          title="Report Breakdown"
        >
          <AlertTriangle className="w-6 h-6" />
        </button>

        <button
          onClick={() => {
            if (vehicle) {
              setNewOdometer(vehicle.odometer);
              setIsOdoModalOpen(true);
            }
          }}
          className="flex flex-col items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-slate-300 transition-colors"
        >
          <Clock className="w-5 h-5" />
          <span>Log Odo</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'profile' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </div>

      {/* Log Odometer Modal */}
      <Modal
        isOpen={isOdoModalOpen}
        onClose={() => setIsOdoModalOpen(false)}
        title="Update Trip Odometer"
        maxWidth="sm"
      >
        {error && (
          <div className="mb-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
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
              min={vehicle?.odometer || 0}
              value={newOdometer}
              onChange={(e) => setNewOdometer(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-3 text-white font-mono text-base outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Last saved: {vehicle?.odometer.toLocaleString()} km
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsOdoModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold"
            >
              {submitLoading ? 'Saving...' : 'Submit'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Report Vehicle Issue Modal (Exact wireframe match) */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report Vehicle Issue"
      >
        {error && (
          <div className="mb-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
          </div>
        )}
        <form onSubmit={handleReportIssue} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-400 mb-1">Vehicle</label>
            <div className="p-2.5 rounded-xl bg-slate-800 font-mono font-bold text-white text-sm">
              {vehicle ? vehicle.vehicleNumber : 'No vehicle assigned'}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Issue Type
            </label>
            <select
              value={reportData.issueType}
              onChange={(e) => setReportData({ ...reportData, issueType: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none"
            >
              <option value="Engine">Engine</option>
              <option value="Brakes">Brakes</option>
              <option value="Transmission">Transmission</option>
              <option value="Electrical">Electrical</option>
              <option value="Tire">Tire</option>
              <option value="Body">Body</option>
              <option value="Suspension">Suspension</option>
              <option value="Air Conditioning">Air Conditioning</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              required
              value={reportData.description}
              onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
              placeholder="e.g. Engine making unusual noise, knocking sound under acceleration"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white outline-none resize-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Add Photo (Optional)
            </label>
            <div className="border border-dashed border-slate-700 rounded-2xl p-4 text-center cursor-pointer hover:border-slate-500">
              <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <span className="text-[11px] text-slate-400">+ Attach roadside snapshot</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitLoading || !vehicle}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-rose-950/50"
            >
              {submitLoading ? 'Transmitting to Fleet Manager...' : 'SUBMIT'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
