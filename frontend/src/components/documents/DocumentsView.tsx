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

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitLoading(true);

    try {
      await api.post('/documents', formData);
      setIsModalOpen(false);
      setFormData({
        vehicleId: selectedVehicleId || '',
        documentType: 'Registration (RC)',
        documentNumber: '',
        issueDate: '',
        expiryDate: '',
        notes: '',
      });
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

                          <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-slate-400">
                              SERVIQ Verified
                            </span>
                            {doc.fileUrl ? (
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-[#2335f2] hover:underline font-semibold flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>View File</span>
                              </a>
                            ) : (
                              <span className="text-[11px] text-slate-400">Record Only</span>
                            )}
                          </div>
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
    </div>
  );
};
