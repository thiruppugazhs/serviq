import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Expense, Vehicle } from '../../types';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { Receipt, Plus, ShieldAlert, Fuel, Wrench, IndianRupee } from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      if (expRes.data.success) {
        setExpenses(expRes.data.expenses);
        setTotalAmount(expRes.data.totalAmount);
      }
      if (vehRes.data.success) setVehicles(vehRes.data.vehicles);
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

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitLoading(true);

    try {
      await api.post('/expenses', formData);
      setIsModalOpen(false);
      setFormData({
        vehicleId: '',
        category: 'Fuel',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        odometer: '',
        fuelLiters: '',
        notes: '',
      });
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to record expense');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Outfit',sans-serif]">
            Fleet Operating Expenses
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Fuel logs, toll receipts, periodic servicing invoices, and operating expenditure.
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
          <span>Record Expense</span>
        </button>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border">
          <p className="text-xs text-slate-400 uppercase font-semibold">Total Expenditure</p>
          <h3 className="text-2xl font-bold text-white font-mono mt-1">
            ₹{totalAmount.toLocaleString()}
          </h3>
        </div>
        <div className="glass-card p-5 rounded-2xl border">
          <p className="text-xs text-slate-400 uppercase font-semibold">Fuel Spent</p>
          <h3 className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            ₹{expenses.filter(e => e.category === 'Fuel').reduce((s, e) => s + e.amount, 0).toLocaleString()}
          </h3>
        </div>
        <div className="glass-card p-5 rounded-2xl border">
          <p className="text-xs text-slate-400 uppercase font-semibold">Repairs & Workshop</p>
          <h3 className="text-2xl font-bold text-amber-400 font-mono mt-1">
            ₹{expenses.filter(e => e.category === 'Maintenance').reduce((s, e) => s + e.amount, 0).toLocaleString()}
          </h3>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading Expenses...</div>
      ) : expenses.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No Expenses Logged Yet"
          description="Track every rupee spent on fuel, tolls, insurance renewals, and servicing."
          actionText="Log First Expense"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3">Vehicle</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Odometer</th>
                  <th className="px-5 py-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {expenses.map((exp) => (
                  <tr key={exp._id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-white">
                      {exp.vehicle?.vehicleNumber || 'Fleet Vehicle'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-emerald-400">
                      ₹{exp.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono">
                      {exp.odometer ? `${exp.odometer.toLocaleString()} km` : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 truncate max-w-xs">
                      {exp.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Fleet Expense"
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Select Fleet Vehicle <span className="text-rose-400">*</span>
            </label>
            <select
              name="vehicleId"
              required
              value={formData.vehicleId}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white outline-none font-mono"
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
              <label className="block font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white outline-none"
              >
                <option value="Fuel">Fuel</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Toll">Toll</option>
                <option value="Insurance">Insurance</option>
                <option value="Fine">Fine / Penalty</option>
                <option value="Parking">Parking</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Amount (₹) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                name="amount"
                required
                value={formData.amount}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Expense Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Odometer at Fuel / Event (km)
              </label>
              <input
                type="number"
                name="odometer"
                value={formData.odometer}
                onChange={handleChange}
                placeholder="Current reading"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Notes / Vendor Remarks
            </label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. HPCL bunk, 50L diesel"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            >
              {submitLoading ? 'Saving...' : 'Record Expense'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
