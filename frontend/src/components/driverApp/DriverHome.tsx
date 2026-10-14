import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Vehicle, Repair, Maintenance } from '../../types';
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
  Wrench,
  Receipt,
  Upload,
  Check,
  MapPin,
  Calendar,
  Bell,
  X,
} from 'lucide-react';

export const DriverHome: React.FC = () => {
  const { user, logout } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [myRepairs, setMyRepairs] = useState<Repair[]>([]);
  const [myMaintenance, setMyMaintenance] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'activity' | 'vehicle' | 'profile'>('home');

  // Notifications
  const [driverNotifications, setDriverNotifications] = useState<any[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  // Modals
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isOdoModalOpen, setIsOdoModalOpen] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Odometer State
  const [newOdometer, setNewOdometer] = useState<string | number>('');

  // Maintenance Request Form State
  const [maintData, setMaintData] = useState({
    vehicleId: '',
    serviceType: '',
    currentOdometer: '',
    runningKmInterval: '10000',
    serviceCenter: '',
    notes: '',
  });

  // Repair Request Form State (with photo proof)
  const [repairData, setRepairData] = useState({
    vehicleId: '',
    repairWhat: '',
    reasonWhy: '',
    description: '',
    odometerAtIncident: '',
  });
  const [repairPhotoFile, setRepairPhotoFile] = useState<File | null>(null);

  // Expense Form State (with receipt)
  const [expenseData, setExpenseData] = useState({
    vehicleId: '',
    category: 'Maintenance',
    amount: '',
    odometer: '',
    notes: '',
  });
  const [expenseReceiptFile, setExpenseReceiptFile] = useState<File | null>(null);

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      const [vehRes, repRes, maintRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/repairs'),
        api.get('/maintenance'),
      ]);

      if (vehRes.data?.success && vehRes.data.vehicles.length > 0) {
        setVehicles(vehRes.data.vehicles);
        const assigned = vehRes.data.vehicles[0];
        setVehicle(assigned);
        setNewOdometer(assigned.odometer);
        setMaintData((prev) => ({
          ...prev,
          vehicleId: assigned._id,
          currentOdometer: String(assigned.odometer),
        }));
        setRepairData((prev) => ({
          ...prev,
          vehicleId: assigned._id,
          odometerAtIncident: String(assigned.odometer),
        }));
        setExpenseData((prev) => ({
          ...prev,
          vehicleId: assigned._id,
          odometer: String(assigned.odometer),
        }));
      }
      if (repRes.data?.success) {
        setMyRepairs(repRes.data.repairs || []);
      }
      if (maintRes.data?.success) {
        setMyMaintenance(maintRes.data.maintenance || []);
      }

      // Fetch notifications targeted specifically to this driver (e.g. assigned vehicle documents)
      try {
        const notifRes = await api.get('/notifications');
        if (notifRes.data?.success) {
          setDriverNotifications(notifRes.data.notifications || []);
          setUnreadNotifCount(notifRes.data.unreadCount || 0);
        }
      } catch (err) {
        // silent fallback
      }
    } catch (err) {
      console.error('Failed to load driver assigned data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllDriverNotifRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setUnreadNotifCount(0);
      setDriverNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDriverData();
    const interval = setInterval(fetchDriverData, 60000);
    return () => clearInterval(interval);
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
      setSuccessMessage('Vehicle odometer updated successfully');
      setTimeout(() => setSuccessMessage(null), 3500);
      fetchDriverData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update odometer');
    } finally {
      setSubmitLoading(false);
    }
  };

  // 1. Submit Maintenance Request
  const handleMaintenanceRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitLoading(true);

    try {
      await api.post('/maintenance/request', maintData);
      setIsMaintenanceModalOpen(false);
      setSuccessMessage('Maintenance request submitted! Awaiting Fleet Manager / Admin approval.');
      setTimeout(() => setSuccessMessage(null), 4500);
      setMaintData({
        vehicleId: vehicle?._id || '',
        serviceType: '',
        currentOdometer: vehicle ? String(vehicle.odometer) : '',
        runningKmInterval: '10000',
        serviceCenter: '',
        notes: '',
      });
      fetchDriverData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit maintenance request');
    } finally {
      setSubmitLoading(false);
    }
  };

  // 2. Submit Repair Request with Photo Proof
  const handleRepairRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitLoading(true);

    try {
      const form = new FormData();
      form.append('vehicleId', repairData.vehicleId || (vehicle?._id ?? ''));
      form.append('repairWhat', repairData.repairWhat);
      form.append('reasonWhy', repairData.reasonWhy);
      form.append('description', repairData.description || `${repairData.repairWhat} - ${repairData.reasonWhy}`);
      form.append('odometerAtIncident', String(repairData.odometerAtIncident || vehicle?.odometer || 0));

      if (repairPhotoFile) {
        form.append('photos', repairPhotoFile);
      }

      await api.post('/repairs', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setIsRepairModalOpen(false);
      setRepairPhotoFile(null);
      setSuccessMessage('Breakdown & repair report submitted with photo proof! Fleet manager will review.');
      setTimeout(() => setSuccessMessage(null), 4500);
      setRepairData({
        vehicleId: vehicle?._id || '',
        repairWhat: '',
        reasonWhy: '',
        description: '',
        odometerAtIncident: vehicle ? String(vehicle.odometer) : '',
      });
      fetchDriverData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit repair request');
    } finally {
      setSubmitLoading(false);
    }
  };

  // 3. Log Expense during Service / Repair
  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitLoading(true);

    try {
      const form = new FormData();
      form.append('vehicleId', expenseData.vehicleId || (vehicle?._id ?? ''));
      form.append('category', expenseData.category);
      form.append('amount', expenseData.amount);
      form.append('odometer', String(expenseData.odometer || vehicle?.odometer || 0));
      form.append('notes', expenseData.notes);
      if (expenseReceiptFile) {
        form.append('receipt', expenseReceiptFile);
      }

      await api.post('/expenses', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setIsExpenseModalOpen(false);
      setExpenseReceiptFile(null);
      setSuccessMessage('Expense logged! Updated in Fleet Manager and Admin dashboard.');
      setTimeout(() => setSuccessMessage(null), 4000);
      setExpenseData({
        vehicleId: vehicle?._id || '',
        category: 'Maintenance',
        amount: '',
        odometer: vehicle ? String(vehicle.odometer) : '',
        notes: '',
      });
      fetchDriverData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to record expense');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20 max-w-md mx-auto relative border-x border-slate-900 shadow-2xl flex flex-col justify-between">
      {/* Mobile Top Header */}
      <div className="bg-slate-900/95 backdrop-blur-md sticky top-0 z-30 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/logo-blue.png" alt="SERVIQ" className="w-8 h-8 object-contain" />
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider font-['Anek_Latin',sans-serif]">
              SERVIQ DRIVER
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold">
              Commercial Driver Portal
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Driver Notification Bell */}
          <button
            onClick={() => setIsNotifModalOpen(true)}
            className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Assigned Car Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900" />
            )}
          </button>

          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4 flex-1">
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Driver Greeting Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 shadow-lg">
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                Driver on Duty
              </span>
              <h2 className="text-xl font-extrabold text-white font-['Anek_Latin',sans-serif] mt-0.5">
                Hi, {user?.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Apply for maintenance or report vehicle repairs with proof.
              </p>
            </div>

            {/* Document Expiration Warning for Assigned Car */}
            {driverNotifications.filter((n) => n.type === 'document').length > 0 && (
              <div className="space-y-2">
                {driverNotifications
                  .filter((n) => n.type === 'document')
                  .slice(0, 2)
                  .map((notif) => {
                    const isExp = notif.title?.toLowerCase().includes('expired');
                    return (
                      <div
                        key={notif._id || notif.id}
                        onClick={() => setIsNotifModalOpen(true)}
                        className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                          isExp
                            ? 'bg-rose-500/15 border-rose-500/30 text-rose-200'
                            : 'bg-amber-500/15 border-amber-500/30 text-amber-200'
                        }`}
                      >
                        <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${isExp ? 'text-rose-400' : 'text-amber-400'}`} />
                        <div>
                          <p className="font-bold text-white text-[11px]">{notif.title}</p>
                          <p className="text-[10px] opacity-90 mt-0.5">{notif.message}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Assigned Vehicle Card */}
            {vehicle ? (
              <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Assigned Vehicle
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
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-400">Current Odometer:</span>
                  </div>
                  <span className="font-mono font-bold text-base text-white">
                    {vehicle.odometer.toLocaleString()} km
                  </span>
                </div>

                {/* 4 Quick Touch Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {/* Button 1: Apply for Maintenance */}
                  <button
                    onClick={() => {
                      setError(null);
                      setMaintData((prev) => ({
                        ...prev,
                        vehicleId: vehicle._id,
                        currentOdometer: String(vehicle.odometer),
                      }));
                      setIsMaintenanceModalOpen(true);
                    }}
                    className="p-3 rounded-2xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-left transition-colors flex flex-col justify-between cursor-pointer"
                  >
                    <Wrench className="w-5 h-5 text-blue-400 mb-2" />
                    <div>
                      <div className="text-xs font-bold text-white">Apply Maintenance</div>
                      <div className="text-[10px] text-blue-300/80">Request service</div>
                    </div>
                  </button>

                  {/* Button 2: Report Breakdown / Repair */}
                  <button
                    onClick={() => {
                      setError(null);
                      setRepairData((prev) => ({
                        ...prev,
                        vehicleId: vehicle._id,
                        odometerAtIncident: String(vehicle.odometer),
                      }));
                      setIsRepairModalOpen(true);
                    }}
                    className="p-3 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-left transition-colors flex flex-col justify-between cursor-pointer"
                  >
                    <AlertTriangle className="w-5 h-5 text-rose-400 mb-2" />
                    <div>
                      <div className="text-xs font-bold text-rose-200">Report Repair</div>
                      <div className="text-[10px] text-rose-400/80">Submit with proof</div>
                    </div>
                  </button>

                  {/* Button 3: Log Expense */}
                  <button
                    onClick={() => {
                      setError(null);
                      setExpenseData((prev) => ({
                        ...prev,
                        vehicleId: vehicle._id,
                        odometer: String(vehicle.odometer),
                      }));
                      setIsExpenseModalOpen(true);
                    }}
                    className="p-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-left transition-colors flex flex-col justify-between cursor-pointer"
                  >
                    <Receipt className="w-5 h-5 text-amber-400 mb-2" />
                    <div>
                      <div className="text-xs font-bold text-white">Log Expense</div>
                      <div className="text-[10px] text-amber-300/80">Fuel, parts, tolls</div>
                    </div>
                  </button>

                  {/* Button 4: Log Odometer */}
                  <button
                    onClick={() => {
                      setNewOdometer(vehicle.odometer);
                      setError(null);
                      setIsOdoModalOpen(true);
                    }}
                    className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors flex flex-col justify-between cursor-pointer"
                  >
                    <Gauge className="w-5 h-5 text-emerald-400 mb-2" />
                    <div>
                      <div className="text-xs font-bold text-white">Log Mileage</div>
                      <div className="text-[10px] text-slate-400">Update odometer</div>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-center">
                <Truck className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <h3 className="font-bold text-sm text-white">No Vehicle Assigned</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Contact your Fleet Manager to assign your commercial vehicle plate.
                </p>
              </div>
            )}

            {/* Approval Status Feed (Pending / Approved) */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  My Requests & Approvals
                </h4>
                <span className="text-[10px] text-blue-400 font-semibold font-mono">
                  {myRepairs.length + myMaintenance.length} requests
                </span>
              </div>

              {myRepairs.length === 0 && myMaintenance.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-500">
                  No maintenance requests or repairs filed yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Maintenance Requests */}
                  {myMaintenance.slice(0, 2).map((m) => (
                    <div
                      key={m._id}
                      className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-blue-400 font-semibold flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5" />
                          <span>{m.serviceType}</span>
                        </span>
                        <Badge status={m.status} size="sm" />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Center: {m.serviceCenter || 'Depot'} • Interval: {m.runningKmInterval || 10000} km
                      </p>
                      {m.status === 'approved' && (
                        <p className="text-[11px] text-emerald-400 font-semibold">
                          ✓ Approved by Manager! Proceed with maintenance.
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Repair Requests */}
                  {myRepairs.slice(0, 2).map((r) => (
                    <div
                      key={r._id}
                      className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{r.repairWhat || r.issueType}</span>
                        </span>
                        <Badge status={r.status} size="sm" />
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        Reason: {r.reasonWhy || r.description}
                      </p>
                      {r.status === 'approved' && (
                        <p className="text-[11px] text-emerald-400 font-semibold">
                          ✓ Approved! Assigned workshop: {r.assignedWorkshop || 'Authorized Center'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: ACTIVITY HISTORY */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white font-['Anek_Latin',sans-serif]">
              Request & Service History
            </h2>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Maintenance Requests ({myMaintenance.length})
              </h3>
              {myMaintenance.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-500">
                  No maintenance requests submitted.
                </div>
              ) : (
                myMaintenance.map((m) => (
                  <div key={m._id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{m.serviceType}</span>
                      <Badge status={m.status} size="sm" />
                    </div>
                    <p className="text-slate-400 text-[11px]">Center: {m.serviceCenter || 'Unspecified'}</p>
                    <p className="text-slate-500 text-[10px] font-mono">
                      Logged Odometer: {m.currentOdometer || m.lastServiceOdometer || 0} km
                    </p>
                  </div>
                ))
              )}

              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">
                Repairs & Breakdowns ({myRepairs.length})
              </h3>
              {myRepairs.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-500">
                  No repair reports submitted.
                </div>
              ) : (
                myRepairs.map((r) => (
                  <div key={r._id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{r.repairWhat || r.issueType}</span>
                      <Badge status={r.status} size="sm" />
                    </div>
                    {r.reasonWhy && <p className="text-slate-400 text-[11px]">Why: {r.reasonWhy}</p>}
                    <p className="text-slate-300 text-[11px]">{r.description}</p>
                    {r.photos && r.photos.length > 0 && (
                      <span className="text-[10px] text-blue-400 font-semibold block pt-1">
                        📷 {r.photos.length} Photo Proof(s) Attached
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: VEHICLE DETAILS */}
        {activeTab === 'vehicle' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white font-['Anek_Latin',sans-serif]">
              Vehicle Specifications & FC
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

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Vehicle Type:</span>
                    <span className="font-bold text-white">{vehicle.vehicleType}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Current Odometer:</span>
                    <span className="font-bold text-white font-mono">{vehicle.odometer.toLocaleString()} km</span>
                  </div>
                  {(vehicle.fcBook || vehicle.fcExpiryDate || vehicle.fitnessExpiry) && (
                    <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">FC Book / Expiry:</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {vehicle.fcBook ? `${vehicle.fcBook} • ` : ''}
                        {new Date(vehicle.fcExpiryDate || vehicle.fitnessExpiry || '').toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400">Operating Status:</span>
                    <Badge status={vehicle.status} size="sm" />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-xs">No vehicle assigned.</p>
            )}
          </div>
        )}

        {/* Tab 4: PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white font-['Anek_Latin',sans-serif]">
              Driver Profile
            </h2>
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-lg text-blue-400">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{user?.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span className="text-white font-semibold">{user?.phone || 'Not recorded'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Role:</span>
                  <span className="text-emerald-400 font-semibold uppercase">Commercial Driver</span>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Sign Out from Driver App
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tab Navigation */}
      <div className="bg-slate-900/95 backdrop-blur-md sticky bottom-0 z-30 border-t border-slate-800 flex items-center justify-around py-2.5 px-3">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors cursor-pointer ${
            activeTab === 'home' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors cursor-pointer ${
            activeTab === 'activity' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span>Requests</span>
        </button>
        <button
          onClick={() => setActiveTab('vehicle')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors cursor-pointer ${
            activeTab === 'vehicle' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gauge className="w-5 h-5" />
          <span>Vehicle</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </div>

      {/* MODAL 1: Apply for Maintenance */}
      <Modal
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        title="Apply for Maintenance"
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleMaintenanceRequest} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Current Vehicle Number <span className="text-rose-500">*</span>
            </label>
            <select
              value={maintData.vehicleId}
              required
              onChange={(e) => setMaintData({ ...maintData, vehicleId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none font-mono"
            >
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
              value={maintData.serviceType}
              onChange={(e) => setMaintData({ ...maintData, serviceType: e.target.value })}
              placeholder="e.g. Engine Oil, Brake Inspection, Clutch Servicing"
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Current Odometer (km) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={maintData.currentOdometer}
                onChange={(e) => setMaintData({ ...maintData, currentOdometer: e.target.value })}
                placeholder="Kilometers"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Running Km Interval <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={maintData.runningKmInterval}
                onChange={(e) => setMaintData({ ...maintData, runningKmInterval: e.target.value })}
                placeholder="10000"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none font-mono"
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
              value={maintData.serviceCenter}
              onChange={(e) => setMaintData({ ...maintData, serviceCenter: e.target.value })}
              placeholder="e.g. Authorized Ashok Leyland Hub, Chennai"
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Additional Notes / Observations
            </label>
            <textarea
              rows={2}
              value={maintData.notes}
              onChange={(e) => setMaintData({ ...maintData, notes: e.target.value })}
              placeholder="Any specific noise, vibration, or parts needed..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsMaintenanceModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-5 py-2 bg-[#2335f2] hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {submitLoading ? 'Submitting...' : 'Request Maintenance'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Report Repair / Breakdown with Photo Proof */}
      <Modal
        isOpen={isRepairModalOpen}
        onClose={() => setIsRepairModalOpen(false)}
        title="Report Breakdown / Repair"
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRepairRequest} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Vehicle Number <span className="text-rose-500">*</span>
            </label>
            <select
              value={repairData.vehicleId}
              required
              onChange={(e) => setRepairData({ ...repairData, vehicleId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none font-mono"
            >
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.vehicleNumber} ({v.manufacturer} {v.model})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              What the Repair is <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={repairData.repairWhat}
              onChange={(e) => setRepairData({ ...repairData, repairWhat: e.target.value })}
              placeholder="e.g. Front Right Tire Puncture / Radiator Overheat"
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Why the Repair Happened <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={repairData.reasonWhy}
              onChange={(e) => setRepairData({ ...repairData, reasonWhy: e.target.value })}
              placeholder="e.g. Sharp iron object on highway / Coolant hose leak"
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Upload Photo Proof (Take photo / file) <span className="text-rose-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setRepairPhotoFile(e.target.files ? e.target.files[0] : null)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            />
            {repairPhotoFile && (
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                ✓ Photo selected: {repairPhotoFile.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Odometer at Breakdown
              </label>
              <input
                type="number"
                value={repairData.odometerAtIncident}
                onChange={(e) => setRepairData({ ...repairData, odometerAtIncident: e.target.value })}
                placeholder="Current km"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Additional Description
            </label>
            <textarea
              rows={2}
              value={repairData.description}
              onChange={(e) => setRepairData({ ...repairData, description: e.target.value })}
              placeholder="Immediate vehicle location and roadside condition..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRepairModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {submitLoading ? 'Submitting...' : 'Submit with Proof'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: Log Expense during Service / Repair */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title="Log Service / Repair Expense"
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleExpenseSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Vehicle Number <span className="text-rose-500">*</span>
            </label>
            <select
              value={expenseData.vehicleId}
              required
              onChange={(e) => setExpenseData({ ...expenseData, vehicleId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none font-mono"
            >
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.vehicleNumber} ({v.manufacturer} {v.model})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={expenseData.category}
                onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
              >
                <option value="Maintenance">Maintenance</option>
                <option value="Fuel">Fuel</option>
                <option value="Toll">Toll Fee</option>
                <option value="Parking">Parking</option>
                <option value="Other">Other Parts</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={expenseData.amount}
                onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                placeholder="e.g. 1500"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Receipt / Bill Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setExpenseReceiptFile(e.target.files ? e.target.files[0] : null)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Expense Description / Notes
            </label>
            <textarea
              rows={2}
              value={expenseData.notes}
              onChange={(e) => setExpenseData({ ...expenseData, notes: e.target.value })}
              placeholder="e.g. Emergency spare clamp purchase during roadside repair"
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsExpenseModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {submitLoading ? 'Recording...' : 'Save Expense'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 4: Update Odometer */}
      <Modal
        isOpen={isOdoModalOpen}
        onClose={() => setIsOdoModalOpen(false)}
        title="Update Odometer Mileage"
      >
        <form onSubmit={handleUpdateOdometer} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              New Odometer Value (km) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              value={newOdometer}
              onChange={(e) => setNewOdometer(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none font-mono"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsOdoModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-5 py-2 bg-[#2335f2] hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm cursor-pointer"
            >
              Update Mileage
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 5: Driver Notifications (Assigned Car & Document Alerts) */}
      <Modal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        title="Vehicle & Document Alerts"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs text-slate-500">
              Alerts for your assigned vehicle ({vehicle?.vehicleNumber || 'Assigned Car'})
            </span>
            {unreadNotifCount > 0 && (
              <button
                onClick={handleMarkAllDriverNotifRead}
                className="text-[11px] text-[#2335f2] font-semibold hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {driverNotifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No active alerts</p>
                <p className="text-[11px] mt-0.5">All documents for your assigned car are valid.</p>
              </div>
            ) : (
              driverNotifications.map((notif) => {
                const isExp = notif.title?.toLowerCase().includes('expired');
                return (
                  <div
                    key={notif._id || notif.id}
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      isExp
                        ? 'bg-rose-50 border-rose-200 text-rose-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className={`w-3.5 h-3.5 ${isExp ? 'text-rose-500' : 'text-amber-500'}`} />
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(notif.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed">{notif.message}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
