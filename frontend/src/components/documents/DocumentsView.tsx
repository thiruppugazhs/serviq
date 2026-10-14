import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { DocumentRecord, Vehicle } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { Header } from '../common/Header';
import {
  FileText,
  Plus,
  Calendar,
  ShieldAlert,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  ExternalLink,
  Camera,
  Image as ImageIcon,
  X,
} from 'lucide-react';

const DOCUMENT_TYPES = [
  'Registration (RC)',
  'RC Book',
  'Fitness Certificate (FC)',
  'Commercial Permit',
  'Interstate Permit',
  'Inter-district Permit',
  'Insurance',
  'PUC Certificate',
  'Road Fitness',
  'Tax Receipt',
  'Other',
];

export const DocumentsView: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const [previewModalTitle, setPreviewModalTitle] = useState<string>('');

  const [formData, setFormData] = useState({
    vehicleId: '',
    documentType: 'Registration (RC)',
    documentNumber: '',
    issueDate: '',
    expiryDate: '',
    notes: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docRes, vehRes] = await Promise.all([
        api.get('/documents'),
        api.get('/vehicles'),
      ]);
      if (docRes.data?.success) setDocuments(docRes.data.documents || []);
      if (vehRes.data?.success) {
        const vList = vehRes.data.vehicles || [];
        setVehicles(vList);
        if (vList.length > 0 && !selectedVehicleId) {
          setSelectedVehicleId(vList[0]._id);
        }
      }
    } catch (err: any) {
      console.error('Failed to load documents:', err);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append('vehicleId', formData.vehicleId || selectedVehicleId || '');
      formPayload.append('documentType', formData.documentType);
      formPayload.append('documentNumber', formData.documentNumber);
      formPayload.append('issueDate', formData.issueDate);
      formPayload.append('expiryDate', formData.expiryDate);
      formPayload.append('notes', formData.notes);

      if (selectedFile) {
        formPayload.append('document', selectedFile);
      }

      await api.post('/documents', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setIsModalOpen(false);
      setFormData({
        vehicleId: selectedVehicleId || '',
        documentType: 'Registration (RC)',
        documentNumber: '',
        issueDate: '',
        expiryDate: '',
        notes: '',
      });
      setSelectedFile(null);
      setFilePreview(null);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add document');
    } finally {
      setSubmitLoading(false);
    }
  };

  const activeVehicle = vehicles.find((v) => v._id === selectedVehicleId) || null;

  // Filter documents for currently selected vehicle
  const displayedDocuments = selectedVehicleId
    ? documents.filter((d) => {
        const vId = typeof d.vehicle === 'object' ? d.vehicle?._id : d.vehicle;
        return vId === selectedVehicleId;
      })
    : documents;

  const getVehicleDocCount = (vId: string) => {
    return documents.filter((d) => {
      const id = typeof d.vehicle === 'object' ? d.vehicle?._id : d.vehicle;
      return id === vId;
    }).length;
  };

  return (
    <div className="space-y-4 md:space-y-5 animate-in fade-in duration-200">
      <Header
        title="Vehicle Documents & Compliance Vault"
        description="Select any commercial vehicle to inspect its full document dossier: RC, RC Book, FC, Interstate & Inter-district Permits, Insurance, and PUC."
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
            <span>+ Upload Document</span>
          </button>
        }
      />

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading Vehicle Documents...</div>
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Vehicles Registered"
          description="Add vehicles first under Fleet Vehicles to manage vehicle-specific document vaults and compliance permits."
        />
      ) : (
        <div className="space-y-4">
          {/* Vehicle Selector Carousel / Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Vehicle Asset ({vehicles.length})
              </span>
              <span className="text-xs text-slate-400">Click a vehicle to inspect its compliance documents</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {vehicles.map((v) => {
                const isSelected = v._id === selectedVehicleId;
                const docCount = getVehicleDocCount(v._id);

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
                        <span className="text-slate-400">Files:</span>
                        <span className={`font-mono font-bold ${docCount > 0 ? 'text-[#2335f2]' : 'text-slate-400'}`}>
                          {docCount} docs
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Vehicle Document Vault */}
          {activeVehicle && (
            <div className="glass-card rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold text-[#2335f2] bg-blue-50 px-2 py-0.5 rounded-md">
                      Document Vault
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {activeVehicle.manufacturer} {activeVehicle.model} ({activeVehicle.year})
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold font-mono text-slate-900 tracking-wider mt-1">
                    {activeVehicle.vehicleNumber}
                  </h3>
                </div>

                {/* FC Quick Summary if on vehicle */}
                {(activeVehicle.fcBook || activeVehicle.fcExpiryDate || activeVehicle.fitnessExpiry) && (
                  <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-400 text-[10px] font-semibold block uppercase">FC Book Registered</span>
                    <span className="font-mono font-bold text-slate-800">
                      {activeVehicle.fcBook || 'Verified'}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Expires: {new Date(activeVehicle.fcExpiryDate || activeVehicle.fitnessExpiry || '').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>

              {/* Document Cards */}
              {displayedDocuments.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No documents registered for {activeVehicle.vehicleNumber}</p>
                  <p className="mt-0.5 mb-3">Add RC, RC Book, FC, Insurance, PUC, Interstate Permit or Inter-district Permit.</p>
                  <button
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, vehicleId: activeVehicle._id }));
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2335f2] hover:bg-blue-700 text-white rounded-lg text-xs font-medium cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Document for {activeVehicle.vehicleNumber}</span>
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Compliance Dossier ({displayedDocuments.length} documents)
                    </h4>
                    <button
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, vehicleId: activeVehicle._id }));
                        setIsModalOpen(true);
                      }}
                      className="text-xs text-[#2335f2] hover:underline font-semibold cursor-pointer"
                    >
                      + Add another document
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {displayedDocuments.map((doc) => {
                      const isExpired = doc.status === 'expired';
                      const isExpiringSoon = doc.status === 'expiring_soon';

                      return (
                        <div
                          key={doc._id}
                          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span className="font-bold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                                {doc.documentType}
                              </span>
                              <Badge status={doc.status} size="sm" />
                            </div>

                            {doc.documentNumber && (
                              <p className="font-mono text-xs text-slate-700 mt-2 font-semibold">
                                Doc No: <span className="text-slate-900">{doc.documentNumber}</span>
                              </p>
                            )}

                            <div className="mt-2.5 space-y-1.5 text-xs text-slate-500">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                  Expiry Date:
                                </span>
                                <span className={`font-semibold font-mono ${isExpired ? 'text-rose-600' : isExpiringSoon ? 'text-amber-600' : 'text-slate-900'}`}>
                                  {new Date(doc.expiryDate).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>

                              {doc.notes && (
                                <p className="text-[11px] text-slate-500 pt-1 italic">
                                  "{doc.notes}"
                                </p>
                              )}
                            </div>
                          </div>

                          {doc.fileUrl && (
                            <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-end text-xs">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPreviewModalUrl(doc.fileUrl || null);
                                    setPreviewModalTitle(`${doc.documentType} - ${doc.documentNumber || 'Photo'}`);
                                  }}
                                  className="text-xs text-[#2335f2] hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer bg-blue-50 px-2 py-1 rounded-md border border-blue-200/60"
                                >
                                  <Camera className="w-3.5 h-3.5" />
                                  <span>View Photo</span>
                                </button>
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-slate-400 hover:text-slate-600 p-1"
                                  title="Open in new tab"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Upload Document Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Compliance Document"
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAddDocument} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Fleet Vehicle <span className="text-rose-500">*</span>
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

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Document Type <span className="text-rose-500">*</span>
            </label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            >
              {DOCUMENT_TYPES.map((dt) => (
                <option key={dt} value={dt}>
                  {dt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Document Number / Registration ID
            </label>
            <input
              type="text"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleChange}
              placeholder="e.g. TN-01-RC-2024-9876 or Permit No."
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none font-mono uppercase"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Expiry Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="expiryDate"
                required
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Notes / RTO Authority Details
            </label>
            <textarea
              rows={2}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. 5-Year National Interstate commercial goods carrier permit"
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Document Photography / Scan (RC, FC, Insurance, Permit)
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-200 hover:border-[#2335f2] rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 group"
              onClick={() => document.getElementById('doc-file-input')?.click()}
            >
              <input
                id="doc-file-input"
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              {selectedFile ? (
                <div className="flex flex-col items-center">
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="Document photography preview"
                      className="max-h-36 rounded-lg object-contain border border-slate-200 mb-2 shadow-xs"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2335f2] flex items-center justify-center mb-2">
                      <FileText className="w-6 h-6" />
                    </div>
                  )}
                  <p className="text-xs font-semibold text-slate-800 truncate max-w-xs">
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB · Click to change
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelectedFile();
                    }}
                    className="mt-2 text-rose-500 hover:text-rose-600 text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" /> Remove photo
                  </button>
                </div>
              ) : (
                <div className="py-2">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2335f2] flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                    <Camera className="w-5 h-5 text-[#2335f2]" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    Take a photo or upload document copy
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supports camera photos, JPG, PNG, WebP or PDF · max 10MB
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
              {submitLoading ? 'Registering...' : 'Save Document'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Photography Preview Lightbox Modal */}
      {previewModalUrl && (
        <Modal
          isOpen={!!previewModalUrl}
          onClose={() => setPreviewModalUrl(null)}
          title={previewModalTitle || 'Document Photography'}
        >
          <div className="flex flex-col items-center justify-center p-2">
            {previewModalUrl.toLowerCase().endsWith('.pdf') ? (
              <div className="w-full text-center py-8">
                <FileText className="w-16 h-16 text-[#2335f2] mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-800 mb-3">PDF Document File</p>
                <a
                  href={previewModalUrl}
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
                  src={previewModalUrl}
                  alt={previewModalTitle}
                  className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain border border-slate-200 shadow-md"
                />
                <div className="mt-3 flex items-center justify-between w-full pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-mono">Original Document Photograph</span>
                  <a
                    href={previewModalUrl}
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
