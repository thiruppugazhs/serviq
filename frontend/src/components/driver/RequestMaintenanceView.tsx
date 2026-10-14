import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverService } from '../../services/driverService';
import { ArrowLeft, Camera, Image as ImageIcon, FileText, X, AlertCircle } from 'lucide-react';

export const RequestMaintenanceView: React.FC = () => {
  const navigate = useNavigate();

  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Normal' | 'High' | 'Urgent'>('Normal');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto(null);
    setSelectedFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!type) {
      setError('Please select a type of maintenance');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a description of the issue');
      return;
    }

    setSubmitting(true);
    driverService.requestMaintenance({
      title: `${type}`,
      type,
      description,
      priority,
      photoUrl: selectedPhoto || undefined,
    });

    setTimeout(() => {
      navigate('/maintenance', { replace: true });
    }, 400);
  };

  return (
    <div className="p-4 sm:p-5 space-y-4">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,.pdf,.doc,.docx"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Header */}
      <div className="flex items-center gap-2 pb-1">
        <button
          onClick={() => navigate('/maintenance')}
          className="p-1 -ml-1 text-slate-700 hover:text-slate-900 transition"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2px]" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Request Maintenance</h1>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type of Maintenance */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Type of Maintenance <span className="text-red-500">*</span>
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="w-full px-3.5 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b72e8]/30 focus:border-[#1b72e8] transition"
          >
            <option value="">Select type</option>
            <option value="Engine Oil Service">Engine Oil Service</option>
            <option value="Brake Inspection">Brake Inspection</option>
            <option value="Tire Rotation">Tire Rotation</option>
            <option value="Air Filter Replacement">Air Filter Replacement</option>
            <option value="Transmission Service">Transmission Service</option>
            <option value="Battery Replacement">Battery Replacement</option>
            <option value="Suspension Service">Suspension Service</option>
            <option value="Coolant Flush">Coolant Flush</option>
            <option value="Other">Other Maintenance</option>
          </select>
        </div>

        {/* Description / Issue */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Description / Issue <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter details about the maintenance required..."
            required
            className="w-full px-3.5 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b72e8]/30 focus:border-[#1b72e8] transition resize-none"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="w-full px-3.5 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b72e8]/30 focus:border-[#1b72e8] transition"
          >
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        {/* Upload Photo (optional) */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Upload Photo (optional)
          </label>

          {/* 3 Upload Action Cards matching reference */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition active:scale-95"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1b72e8] flex items-center justify-center mb-1.5">
                <Camera className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-700">Camera</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition active:scale-95"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1b72e8] flex items-center justify-center mb-1.5">
                <ImageIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-700">Gallery</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition active:scale-95"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1b72e8] flex items-center justify-center mb-1.5">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-700">Document</span>
            </button>
          </div>

          {/* Preview of chosen attachment */}
          {selectedFileName && (
            <div className="mt-3 p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                {selectedPhoto ? (
                  <img src={selectedPhoto} alt="Preview" className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                  <FileText className="w-5 h-5 text-[#1b72e8]" />
                )}
                <span className="text-xs font-medium text-slate-800 truncate">{selectedFileName}</span>
              </div>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="p-1 text-slate-400 hover:text-red-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 px-4 bg-[#1b72e8] hover:bg-[#1558b0] active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition shadow-md shadow-[#1b72e8]/20 disabled:opacity-50 mt-4"
        >
          {submitting ? 'Submitting Request...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};
