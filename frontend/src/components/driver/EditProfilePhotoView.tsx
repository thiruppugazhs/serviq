import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverService } from '../../services/driverService';
import { ArrowLeft, Camera, CheckCircle2 } from 'lucide-react';

export const EditProfilePhotoView: React.FC = () => {
  const navigate = useNavigate();
  const profile = driverService.getProfile();

  const [name, setName] = useState(profile.name);
  const [photoUrl, setPhotoUrl] = useState(profile.photoUrl);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    driverService.updateProfile({
      name: name.trim(),
      photoUrl,
    });

    setSuccess(true);
    setSaving(false);
    setTimeout(() => {
      navigate('/settings', { replace: true });
    }, 600);
  };

  return (
    <div className="p-4 sm:p-5 space-y-4">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handlePhotoSelect}
        className="hidden"
      />

      {/* Top Header */}
      <div className="flex items-center gap-2 pb-1">
        <button
          onClick={() => navigate('/settings')}
          className="p-1 -ml-1 text-slate-700 hover:text-slate-900 transition"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2px]" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Name & Profile Photo</h1>
      </div>

      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-700 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Profile photo and display name updated successfully!</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-5 pt-2">
        {/* Photo Selection */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative group">
            <img
              src={photoUrl}
              alt={name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-[#1b72e8] text-white shadow-md hover:bg-[#1558b0] transition active:scale-95"
              aria-label="Change photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs text-slate-500 font-medium mt-2">
            Tap the camera icon to upload a photo
          </span>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">Display Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b72e8]/30 focus:border-[#1b72e8] transition"
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 px-4 bg-[#1b72e8] hover:bg-[#1558b0] active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition shadow-md shadow-[#1b72e8]/20 disabled:opacity-50 mt-4"
        >
          {saving ? 'Updating...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};
