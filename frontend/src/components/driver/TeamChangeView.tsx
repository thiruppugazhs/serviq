import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverService } from '../../services/driverService';
import { ArrowLeft, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

export const TeamChangeView: React.FC = () => {
  const navigate = useNavigate();
  const profile = driverService.getProfile();

  const [currentTeam] = useState(profile.team);
  const [targetTeam, setTargetTeam] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!targetTeam) {
      setError('Please select a target team to request transfer');
      return;
    }
    if (targetTeam === currentTeam) {
      setError('Target team must be different from your current team');
      return;
    }

    setSubmitting(true);
    const res = driverService.requestTeamChange(targetTeam, reason);

    if (!res.success) {
      setError(res.message);
      setSubmitting(false);
      return;
    }

    setSuccess(res.message);
    setTimeout(() => {
      navigate('/settings', { replace: true });
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-5 space-y-4">
      {/* Top Header */}
      <div className="flex items-center gap-2 pb-1">
        <button
          onClick={() => navigate('/settings')}
          className="p-1 -ml-1 text-slate-700 hover:text-slate-900 transition"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2px]" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Team Change</h1>
      </div>

      {/* Current Team Info Card */}
      <div className="bg-[#eff6ff] rounded-2xl border border-blue-100 p-4 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-full bg-[#1b72e8]/10 text-[#1b72e8] flex items-center justify-center shrink-0">
          <Users className="w-5 h-5 stroke-[2.2px]" />
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium block">Current Assigned Team</span>
          <span className="text-base font-bold text-slate-900 block mt-0.5">{currentTeam}</span>
        </div>
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Select Target Team <span className="text-red-500">*</span>
          </label>
          <select
            value={targetTeam}
            onChange={(e) => setTargetTeam(e.target.value)}
            required
            className="w-full px-3.5 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b72e8]/30 focus:border-[#1b72e8] transition"
          >
            <option value="">Select new team</option>
            <option value="Logistics & Dispatch">Logistics & Dispatch</option>
            <option value="Express Courier Delivery">Express Courier Delivery</option>
            <option value="Heavy Freight Haulage">Heavy Freight Haulage</option>
            <option value="City Transit Operations">City Transit Operations</option>
            <option value="Special Services & Transport">Special Services & Transport</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Reason for Transfer Request
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why you are requesting this team transfer..."
            className="w-full px-3.5 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b72e8]/30 focus:border-[#1b72e8] transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 px-4 bg-[#1b72e8] hover:bg-[#1558b0] active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition shadow-md shadow-[#1b72e8]/20 disabled:opacity-50 mt-4"
        >
          {submitting ? 'Submitting Request...' : 'Submit Transfer Request'}
        </button>
      </form>
    </div>
  );
};
