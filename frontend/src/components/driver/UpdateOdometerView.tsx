import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverService } from '../../services/driverService';
import { ArrowLeft, Gauge, AlertCircle, CheckCircle2 } from 'lucide-react';

export const UpdateOdometerView: React.FC = () => {
  const navigate = useNavigate();
  const currentOdometer = driverService.getOdometer();

  const [newReading, setNewReading] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const km = parseFloat(newReading.replace(/,/g, '').trim());
    if (isNaN(km)) {
      setError('Please enter a valid numeric odometer reading');
      return;
    }

    setSaving(true);
    const res = driverService.updateOdometer(km);

    if (!res.success) {
      setError(res.error || 'Failed to update odometer');
      setSaving(false);
      return;
    }

    setSuccess(`Odometer updated to ${km.toLocaleString()} km successfully!`);
    setTimeout(() => {
      navigate('/home', { replace: true });
    }, 800);
  };

  return (
    <div className="p-4 sm:p-5 space-y-4">
      {/* Top Header */}
      <div className="flex items-center gap-2 pb-1">
        <button
          onClick={() => navigate(-1)}
          className="p-1 -ml-1 text-slate-700 hover:text-slate-900 transition"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2px]" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Update Odometer</h1>
      </div>

      {/* Current Reading Card */}
      <div className="bg-[#eff6ff] rounded-2xl border border-blue-100 p-5 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-[#1b72e8]/10 text-[#1b72e8] flex items-center justify-center mb-2">
          <Gauge className="w-7 h-7 stroke-[2.2px]" />
        </div>
        <span className="text-xs font-medium text-slate-500">Current Reading</span>
        <div className="flex items-baseline justify-center gap-1.5 mt-1">
          <span className="text-3xl font-black text-slate-900 tracking-tight">
            {currentOdometer.toLocaleString()}
          </span>
          <span className="text-sm font-semibold text-slate-600">km</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            New Odometer Reading
          </label>
          <input
            type="number"
            step="1"
            min={currentOdometer}
            value={newReading}
            onChange={(e) => {
              setNewReading(e.target.value);
              setError(null);
            }}
            placeholder="Enter odometer reading (km)"
            className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b72e8]/30 focus:border-[#1b72e8] transition font-medium"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Must be equal to or greater than {currentOdometer.toLocaleString()} km
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-700 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={saving || !newReading}
          className="w-full py-3.5 px-4 bg-[#1b72e8] hover:bg-[#1558b0] active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition shadow-md shadow-[#1b72e8]/20 disabled:opacity-50"
        >
          {saving ? 'Saving Reading...' : 'Save'}
        </button>
      </form>
    </div>
  );
};
