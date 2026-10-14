import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverService, DriverProfile } from '../../services/driverService';
import { ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';

export const EditDriverDetailsView: React.FC = () => {
  const navigate = useNavigate();
  const profile = driverService.getProfile();

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [licenseNumber, setLicenseNumber] = useState(profile.licenseNumber);
  const [licenseExpiry, setLicenseExpiry] = useState(profile.licenseExpiry);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    driverService.updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      licenseNumber: licenseNumber.trim(),
      licenseExpiry: licenseExpiry.trim(),
    });

    setSuccess(true);
    setSaving(false);
    setTimeout(() => {
      navigate('/settings', { replace: true });
    }, 600);
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
        <h1 className="text-lg font-bold text-slate-900">Edit Driver Details</h1>
      </div>

      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-700 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Driver details updated successfully!</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b72e8]/30 focus:border-[#1b72e8] transition"
          />
        </div>

        {/* Email Address - Strictly Read-Only */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-800">Email Address</label>
            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              <Lock className="w-3 h-3 text-slate-400" /> Read-Only
            </span>
          </div>
          <div className="relative">
            <input
              type="email"
              readOnly
              disabled
              value={profile.email}
              className="w-full px-3.5 py-3 text-sm bg-slate-100/80 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed select-none"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Registered fleet login email cannot be modified by the driver.
          </p>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">Phone Number</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b72e8]/30 focus:border-[#1b72e8] transition"
          />
        </div>

        {/* License Number */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">Driver License Number</label>
          <input
            type="text"
            required
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            className="w-full px-3.5 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b72e8]/30 focus:border-[#1b72e8] transition"
          />
        </div>

        {/* License Expiry */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">License Expiry Date</label>
          <input
            type="text"
            value={licenseExpiry}
            onChange={(e) => setLicenseExpiry(e.target.value)}
            placeholder="e.g. 15 May 2028"
            className="w-full px-3.5 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b72e8]/30 focus:border-[#1b72e8] transition"
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 px-4 bg-[#1b72e8] hover:bg-[#1558b0] active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition shadow-md shadow-[#1b72e8]/20 disabled:opacity-50 mt-4"
        >
          {saving ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};
