import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { DocumentRecord, Vehicle } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { FileText, Plus, Calendar, ShieldAlert, Truck } from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    vehicleId: '',
    documentType: 'Insurance',
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
      if (docRes.data.success) setDocuments(docRes.data.documents);
      if (vehRes.data.success) setVehicles(vehRes.data.vehicles);
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
        vehicleId: '',
        documentType: 'Insurance',
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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-['Outfit',sans-serif]">
            Compliance & Document Vault
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Proactive expiry tracking for Insurance, PUC, Road Fitness, and Commercial Permits.
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2335f2] hover:bg-blue-700 text-white font-medium text-xs rounded-xl transition-colors shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading Documents...</div>
      ) : documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Compliance Documents Registered"
          description="Register vehicle Insurance, PUC, and fitness certificates to receive automated expiry warnings before fines occur."
          actionText="Add Document Record"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => {
            const veh = doc.vehicle;
            return (
              <div key={doc._id} className="glass-card p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono font-bold text-sm text-slate-900">
                        {veh ? veh.vehicleNumber : 'Fleet Asset'}
                      </span>
                      <h3 className="font-semibold text-xs text-[#2335f2] mt-0.5">
                        {doc.documentType}
                      </h3>
                    </div>
                    <Badge status={doc.status} />
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    {doc.documentNumber && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Doc Number:</span>
                        <span className="font-mono text-slate-900 font-semibold">{doc.documentNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Expires On:</span>
                      <span className="font-semibold text-slate-900">
                        {new Date(doc.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Audit Compliant</span>
                  <span className="text-slate-600 font-medium capitalize">{doc.status.replace('_', ' ')}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Document Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Compliance Document"
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
              Select Vehicle <span className="text-rose-500">*</span>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <option value="Insurance">Insurance Policy</option>
                <option value="PUC Certificate">PUC Certificate</option>
                <option value="Registration (RC)">Registration (RC)</option>
                <option value="Road Fitness">Road Fitness</option>
                <option value="Commercial Permit">Commercial Permit</option>
                <option value="Tax Receipt">Tax Receipt</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Document / Policy Number
              </label>
              <input
                type="text"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleChange}
                placeholder="e.g. POL-897321"
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#2335f2] rounded-xl px-3.5 py-2 text-slate-900 outline-none font-mono uppercase"
              />
            </div>
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

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-4 py-2 rounded-xl bg-[#2335f2] hover:bg-blue-700 text-white font-medium transition-colors shadow-md shadow-blue-500/20"
            >
              {submitLoading ? 'Saving...' : 'Register Document'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
