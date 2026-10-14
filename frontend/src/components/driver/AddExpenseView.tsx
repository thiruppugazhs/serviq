import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { driverService, ExpenseItem } from '../../services/driverService';
import { ArrowLeft, Wrench, Calendar, AlertCircle } from 'lucide-react';

export const AddExpenseView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [item, setItem] = useState<ExpenseItem | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const found = driverService.getExpenseItem(id);
      if (found) {
        setItem(found);
      } else {
        navigate('/expense', { replace: true });
      }
    }
  }, [id, navigate]);

  if (!item) return null;

  const currentTotal = item.totalAmount;
  const enteredAmount = parseFloat(amount) || 0;
  const projectedTotal = currentTotal + enteredAmount;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!amount || isNaN(enteredAmount) || enteredAmount <= 0) {
      setError('Please enter a valid expense amount');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a description for the expense');
      return;
    }

    setSaving(true);

    const formattedDate = date
      ? new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const res = driverService.addExpenseLog(item.id, {
      date: formattedDate,
      amount: enteredAmount,
      description: description.trim(),
    });

    if (!res.success) {
      setError(res.error || 'Failed to save expense');
      setSaving(false);
      return;
    }

    setTimeout(() => {
      navigate(`/expense/item/${item.id}`, { replace: true });
    }, 400);
  };

  return (
    <div className="p-4 sm:p-5 space-y-4">
      {/* Top Header */}
      <div className="flex items-center gap-2 pb-1">
        <button
          onClick={() => navigate(`/expense/item/${item.id}`)}
          className="p-1 -ml-1 text-slate-700 hover:text-slate-900 transition"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2px]" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Add Expense</h1>
      </div>

      {/* Item Header Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-full bg-[#1b72e8] text-white flex items-center justify-center shrink-0 shadow-xs">
          <Wrench className="w-5 h-5 stroke-[2.2px]" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 leading-tight">{item.title}</h2>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-[#1b72e8] border border-blue-200/50">
            {item.category === 'Services' ? 'Service' : item.category}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-4">
        {/* Date Field */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b72e8]/30 focus:border-[#1b72e8] transition"
            />
          </div>
        </div>

        {/* Amount Field */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-3.5 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b72e8]/30 focus:border-[#1b72e8] transition font-semibold"
            />
          </div>
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter expense details (e.g. Oil Change + Filter)"
            className="w-full px-3.5 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b72e8]/30 focus:border-[#1b72e8] transition resize-none"
          />
        </div>

        {/* Total for this Service Box */}
        <div className="bg-[#eff6ff] rounded-2xl border border-blue-100 p-4">
          <span className="text-xs text-slate-500 font-medium block">Total for this Service</span>
          <span className="text-2xl font-black text-slate-900 block mt-1 tracking-tight">
            $ {projectedTotal.toLocaleString()}
          </span>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 px-4 bg-[#1b72e8] hover:bg-[#1558b0] active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition shadow-md shadow-[#1b72e8]/20 disabled:opacity-50 mt-2"
        >
          {saving ? 'Saving Expense...' : 'Save'}
        </button>
      </form>
    </div>
  );
};
