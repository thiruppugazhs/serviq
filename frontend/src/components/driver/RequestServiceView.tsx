import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverService } from '../../services/driverService';
import { ArrowLeft, Camera, FileText, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

export const RequestServiceView: React.FC = () => {
  const navigate = useNavigate();

  const [serviceReason, setServiceReason] = useState('');
  const [details, setDetails] = useState('');
  const [proofFile, setProofFile] = useState<string | null>(null);
  const [proofFileName, setProofFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setProofFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProof = () => {
    setProofFile(null);
    setProofFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!serviceReason) {
      setError('Please select a service reason');
      return;
    }
    if (!details.trim()) {
      setError('Please provide details about the service');
      return;
    }

    setSubmitting(true);
    driverService.requestService({
      serviceReason,
      details,
      proofUrl: proofFile || undefined,
      proofName: proofFileName || undefined,
    });

    setTimeout(() => {
      navigate('/service', { replace: true });
    }, 400);
  };

  return (
    <div className="p-4 sm:p-5 space-y-4">
      {/* Hidden file pickers */}
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
          onClick={() => navigate('/service')}
          className="p-1 -ml-1 text-slate-700 hover:text-slate-900 transition"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2px]" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Request Service</h1>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service Reason */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Service Reason <span className="text-red-500">*</span>
          </label>
          <select
            value={serviceReason}
            onChange={(e) => setServiceReason(e.target.value)}
            required
            className="w-full px-3.5 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b72e8]/30 focus:border-[#1b72e8] transition"
          >
            <option value="">Select reason</option>
            <option value="Regular Scheduled Service">Regular Scheduled Service</option>
            <option value="Oil Change Service">Oil Change Service</option>
            <option value="Brake Service">Brake Service</option>
            <option value="Tire Service & Alignment">Tire Service & Alignment</option>
            <option value="Emergency Breakdown">Emergency Breakdown</option>
            <option value="Performance Issue">Performance Issue</option>
            <option value="Pre-Trip Inspection">Pre-Trip Inspection</option>
            <option value="Fluid Top-Up">Fluid Top-Up</option>
            <option value="Other Service">Other Service</option>
          </select>
        </div>

        {/* Details */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Details <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Provide details about the service..."
            required
            className="w-full px-3.5 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b72e8]/30 focus:border-[#1b72e8] transition resize-none"
          />
        </div>

        {/* Add Proof (optional) */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Add Proof (optional)
          </label>

          {/* 3 Action Cards matching reference: Take Photo, Upload Document, Choose from Gallery */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition active:scale-95"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1b72e8] flex items-center justify-center mb-1.5">
                <Camera className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-700">Take Photo</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition active:scale-95"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1b72e8] flex items-center justify-center mb-1.5">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-700">Upload Document</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition active:scale-95"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1b72e8] flex items-center justify-center mb-1.5">
                <ImageIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-700 text-center leading-tight">Choose from Gallery</span>
            </button>
          </div>

          {/* Preview */}
          {proofFileName && (
            <div className="mt-3 p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                {proofFile ? (
                  <img src={proofFile} alt="Proof" className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                  <FileText className="w-5 h-5 text-[#1b72e8]" />
                )}
                <span className="text-xs font-medium text-slate-800 truncate">{proofFileName}</span>
              </div>
              <button
                type="button"
                onClick={handleRemoveProof}
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
          {submitting ? 'Submitting Service...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};
