import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Expense, Vehicle } from '../../types';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { Header } from '../common/Header';
import {
  Receipt,
  Plus,
  ShieldAlert,
  Fuel,
  Wrench,
  IndianRupee,
  Truck,
  Calendar,
  Gauge,
  User,
  Image as ImageIcon,
  CheckCircle,
  Camera,
  X,
  ExternalLink,
} from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedReceipt, setSelectedReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [previewBillUrl, setPreviewBillUrl] = useState<string | null>(null);
  const [previewBillTitle, setPreviewBillTitle] = useState<string>('');

  const [formData, setFormData] = useState({
    vehicleId: '',
    category: 'Fuel',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    odometer: '',
    fuelLiters: '',
    notes: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expRes, vehRes] = await Promise.all([
        api.get('/expenses'),
        api.get('/vehicles'),
      ]);
      if (expRes.data?.success) {
        setExpenses(expRes.data.expenses || []);
      }
      if (vehRes.data?.success) {
        const vList = vehRes.data.vehicles || [];
        setVehicles(vList);
        if (vList.length > 0 && !selectedVehicleId) {
          setSelectedVehicleId(vList[0]._id);
        }
      }
    } catch (err: any) {
      console.error('Failed to load expenses:', err);
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

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedReceipt(file);
      if (file.type.startsWith('image/')) {
        setReceiptPreview(URL.createObjectURL(file));
      } else {
        setReceiptPreview(null);
      }
    }
  };

  const handleReceiptDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedReceipt(file);
      if (file.type.startsWith('image/')) {
        setReceiptPreview(URL.createObjectURL(file));
      } else {
        setReceiptPreview(null);
      }
    }
  };

  const removeSelectedReceipt = () => {
    setSelectedReceipt(null);
    setReceiptPreview(null);
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append('vehicleId', formData.vehicleId || selectedVehicleId || '');
      formPayload.append('category', formData.category);
      formPayload.append('amount', formData.amount);
      formPayload.append('date', formData.date);
      if (formData.odometer) formPayload.append('odometer', formData.odometer);
      if (formData.fuelLiters) formPayload.append('fuelLiters', formData.fuelLiters);
      if (formData.notes) formPayload.append('notes', formData.notes);

      if (selectedReceipt) {
        formPayload.append('receipt', selectedReceipt);
      }

      await api.post('/expenses', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setIsModalOpen(false);
      setFormData({
        vehicleId: selectedVehicleId || '',
        category: 'Fuel',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        odometer: '',
        fuelLiters: '',
        notes: '',
      });
      setSelectedReceipt(null);
      setReceiptPreview(null);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to record expense');
    } finally {
      setSubmitLoading(false);
    }
  };

  const activeVehicle = vehicles.find((v) => v._id === selectedVehicleId) || null;

  // Filter expenses by selected vehicle
  const displayedExpenses = selectedVehicleId
    ? expenses.filter((e) => {
        const vId = typeof e.vehicle === 'object' ? e.vehicle?._id : e.vehicle;
        return vId === selectedVehicleId;
      })
    : expenses;

  const vehicleTotalSpent = displayedExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // Group stats per vehicle
  const getVehicleExpenseTotal = (vId: string) => {
    return expenses
      .filter((e) => {
        const id = typeof e.vehicle === 'object' ? e.vehicle?._id : e.vehicle;
        return id === vId;
      })
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  };

  return (
    <div className="space-y-4 md:space-y-5 animate-in fade-in duration-200">
      <Header
        title="Vehicle Expenses & Receipts"
        description="Select any vehicle to inspect its maintenance invoices, fuel fills, and driver expense logs."
        actions={
          <button
            onClick={() => {
              setError(null);
              setFormData((prev) => ({ ...prev, vehicleId: selectedVehicleId || (vehicles[0]?._id ?? '') }));
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 h-9 px-4 bg-[#2335f2] hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Expense</span>
          </button>
        }
      />

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading Fleet Expenses...</div>
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No Vehicles Registered"
          description="Register vehicles first to begin tracking vehicle-specific expense logs and receipts."
        />
      ) : (
        <div className="space-y-4">
          {/* Vehicle Selector Carousel / Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Vehicle Asset ({vehicles.length})
              </span>
              <span className="text-xs text-slate-400">Click a vehicle to view its expense log</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {vehicles.map((v) => {
                const isSelected = v._id === selectedVehicleId;
                const vSpent = getVehicleExpenseTotal(v._id);

                return (
                  <button
                    key={v._id}
                    onClick={() => setSelectedVehicleId(v._id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#2335f2] bg-blue-50/60 shadow-xs ring-2 ring-[#2335f2]/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Truck className={`w-4 h-4 ${isSelected ? 'text-[#2335f2]' : 'text-slate-400'}`} />
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                        {v.vehicleType}
                      </span>
                    </div>

                    <div>
                      <p className="font-mono font-bold text-xs text-slate-900 truncate">
                        {v.vehicleNumber}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {v.manufacturer} {v.model}
                      </p>
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Spent:</span>
                        <span className={`font-mono font-bold ${vSpent > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                          ₹{vSpent.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Vehicle Expense Log Display */}
          {activeVehicle && (
            <div className="glass-card rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
              {/* Header Banner for Selected Vehicle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold text-[#2335f2] bg-blue-50 px-2 py-0.5 rounded-md">
                      Selected Vehicle
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {activeVehicle.manufacturer} {activeVehicle.model} ({activeVehicle.year})
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold font-mono text-slate-900 tracking-wider mt-1">
                    {activeVehicle.vehicleNumber}
                  </h3>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Vehicle Spend</span>
                    <span className="text-lg font-bold font-mono text-slate-900">
                      ₹{vehicleTotalSpent.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-l border-slate-200 pl-4">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Odometer</span>
                    <span className="text-sm font-bold font-mono text-slate-700">
                      {activeVehicle.odometer.toLocaleString()} km
                    </span>
                  </div>
                </div>
              </div>

              {/* Expense Records List */}
              {displayedExpenses.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No expense records logged for {activeVehicle.vehicleNumber}</p>
                  <p className="mt-0.5">Drivers and managers can record fuel, repair costs, and tolls for this vehicle.</p>
                  <button
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, vehicleId: activeVehicle._id }));
                      setIsModalOpen(true);
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2335f2] hover:bg-blue-700 text-white rounded-lg text-xs font-medium cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Expense for {activeVehicle.vehicleNumber}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Expenses Log ({displayedExpenses.length} entries)
                  </h4>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                    {displayedExpenses.map((exp) => (
                      <div
                        key={exp._id}
                        className="p-4 bg-white hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                              {exp.category}
                            </span>
                            <span className="text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(exp.date).toLocaleDateString()}
                            </span>
                          </div>

                          {exp.notes && (
                            <p className="text-slate-600 font-medium">{exp.notes}</p>
                          )}

                          <div className="flex items-center gap-3 text-[11px] text-slate-400">
                            {exp.odometer ? (
                              <span className="flex items-center gap-1 font-mono">
                                <Gauge className="w-3 h-3" /> {exp.odometer.toLocaleString()} km
                              </span>
                            ) : null}
                            {exp.fuelLiters ? (
                              <span>{exp.fuelLiters} Liters</span>
                            ) : null}
                            {exp.loggedBy && (
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {typeof exp.loggedBy === 'object' ? exp.loggedBy.name : 'Logged by staff'}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:text-right">
                          {exp.receiptUrl && (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewBillUrl(exp.receiptUrl || null);
                                  setPreviewBillTitle(`${exp.category} Expense Bill - ₹${exp.amount.toLocaleString()}`);
                                }}
                                className="text-xs text-[#2335f2] hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60 font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                              >
                                <Camera className="w-3.5 h-3.5" />
                                <span>View Bill</span>
                              </button>
                              <a
                                href={exp.receiptUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-400 hover:text-slate-600 p-1"
                                title="Open original in new tab"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          )}
                          <span className="font-mono text-base font-bold text-slate-900">
                            ₹{exp.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Record Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Vehicle Operating Expense"
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Vehicle <span className="text-rose-500">*</span>
            </label>
            <select
              name="vehicleId"
              required
              value={formData.vehicleId}
              onChange={handleChange}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Expense Category <span className="text-rose-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
              >
                <option value="Fuel">Fuel</option>
                <option value="Maintenance">Maintenance / Workshop</option>
                <option value="Toll">Toll Fee</option>
                <option value="Insurance">Insurance Premium</option>
                <option value="Fine">RTO Fine / Challan</option>
                <option value="Parking">Parking Charges</option>
                <option value="Other">Other Expenses</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                required
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g. 4500"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Date of Expense <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Current Odometer (km)
              </label>
              <input
                type="number"
                name="odometer"
                value={formData.odometer}
                onChange={handleChange}
                placeholder="e.g. 52100"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Description / Memo
            </label>
            <textarea
              rows={2}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. Full tank diesel fill-up at Shell Depot"
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Photo of Bill / Fuel Slip / Invoice
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleReceiptDrop}
              className="border-2 border-dashed border-slate-200 hover:border-[#2335f2] rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 group"
              onClick={() => document.getElementById('expense-receipt-input')?.click()}
            >
              <input
                id="expense-receipt-input"
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleReceiptChange}
              />

              {selectedReceipt ? (
                <div className="flex flex-col items-center">
                  {receiptPreview ? (
                    <img
                      src={receiptPreview}
                      alt="Bill receipt preview"
                      className="max-h-36 rounded-lg object-contain border border-slate-200 mb-2 shadow-xs"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2335f2] flex items-center justify-center mb-2">
                      <Receipt className="w-6 h-6" />
                    </div>
                  )}
                  <p className="text-xs font-semibold text-slate-800 truncate max-w-xs">
                    {selectedReceipt.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {(selectedReceipt.size / 1024).toFixed(1)} KB · Click to change
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelectedReceipt();
                    }}
                    className="mt-2 text-rose-500 hover:text-rose-600 text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" /> Remove bill photo
                  </button>
                </div>
              ) : (
                <div className="py-2">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2335f2] flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                    <Camera className="w-5 h-5 text-[#2335f2]" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    Take photo of bill or upload receipt
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supports camera capture, JPG, PNG, WebP or PDF · max 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-4 py-2 rounded-xl bg-[#2335f2] hover:bg-blue-700 disabled:opacity-50 text-white font-medium transition-colors shadow-sm cursor-pointer"
            >
              {submitLoading ? 'Saving...' : 'Record Expense'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Bill Photo Preview Lightbox Modal */}
      {previewBillUrl && (
        <Modal
          isOpen={!!previewBillUrl}
          onClose={() => setPreviewBillUrl(null)}
          title={previewBillTitle || 'Expense Bill Photography'}
        >
          <div className="flex flex-col items-center justify-center p-2">
            {previewBillUrl.toLowerCase().endsWith('.pdf') ? (
              <div className="w-full text-center py-8">
                <Receipt className="w-16 h-16 text-[#2335f2] mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-800 mb-3">PDF Receipt Document</p>
                <a
                  href={previewBillUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2335f2] hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open PDF in Browser</span>
                </a>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                <img
                  src={previewBillUrl}
                  alt={previewBillTitle}
                  className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain border border-slate-200 shadow-md"
                />
                <div className="mt-3 flex items-center justify-between w-full pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-mono">Original Bill Receipt</span>
                  <a
                    href={previewBillUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#2335f2] hover:underline font-semibold flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open full resolution</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
