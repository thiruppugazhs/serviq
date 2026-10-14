import React, { useState, useRef } from 'react';
import api from '../../api/client';
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  X,
  Cog,
  Table,
} from 'lucide-react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  entityName: string;
  apiEndpoint: string;
  payloadKey: string;
  sampleCsv: string;
  sampleFileName: string;
  requiredColumns: string[];
  columnDescriptions?: Record<string, string>;
}

// Lightweight robust CSV line parser handling commas inside quotes
function parseCsv(text: string): Record<string, string>[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) return [];

  // Parse header
  const headers = parseCsvLine(lines[0]).map((h) => h.trim());

  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    if (values.length === 0 || (values.length === 1 && !values[0])) continue;

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] !== undefined ? values[idx].trim() : '';
    });
    rows.push(row);
  }

  return rows;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      if (inQuotes && line[i + 1] === char) {
        current += char;
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  entityName,
  apiEndpoint,
  payloadKey,
  sampleCsv,
  sampleFileName,
  requiredColumns,
  columnDescriptions,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleDownloadSample = () => {
    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', sampleFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = async (file: File) => {
    setSelectedFile(file);
    setError(null);
    setResultMsg(null);

    try {
      const text = await file.text();
      let rows: Record<string, string>[] = [];

      if (file.name.endsWith('.json')) {
        const json = JSON.parse(text);
        rows = Array.isArray(json) ? json : json[payloadKey] || [];
      } else {
        rows = parseCsv(text);
      }

      if (rows.length === 0) {
        setError('No records could be parsed from the selected file.');
        setParsedRows([]);
        return;
      }

      setParsedRows(rows);
    } catch (err: any) {
      setError(`Failed to read file: ${err.message || 'Invalid format'}`);
      setParsedRows([]);
    }
  };

  const handlePasteChange = (val: string) => {
    setPastedText(val);
    setError(null);
    setResultMsg(null);

    const trimmed = val.trim();
    if (!trimmed) {
      setParsedRows([]);
      return;
    }

    try {
      let rows: Record<string, string>[] = [];
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        const json = JSON.parse(trimmed);
        rows = Array.isArray(json) ? json : json[payloadKey] || [];
      } else {
        rows = parseCsv(trimmed);
      }
      setParsedRows(rows);
    } catch {
      // Allow partial typing in paste box
    }
  };

  const handleSubmitImport = async () => {
    if (parsedRows.length === 0) {
      setError('Please upload or paste at least one record to import.');
      return;
    }

    setLoading(true);
    setError(null);
    setResultMsg(null);

    try {
      const res = await api.post(apiEndpoint, {
        [payloadKey]: parsedRows,
      });

      if (res.data?.success) {
        setResultMsg(res.data.message || `Successfully imported ${res.data.importedCount || parsedRows.length} ${entityName}!`);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to bulk import ${entityName}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-7 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 my-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/80 text-[#2335f2] flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Anek_Latin',sans-serif]">
                Bulk Import {entityName}
              </h2>
              <p className="text-xs text-slate-500">
                Import multiple records in a single click via CSV or JSON.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Download Banner */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-slate-800 block">Need the exact CSV format?</span>
            <span className="text-slate-500 text-[11px]">
              Required columns: {requiredColumns.join(', ')}
            </span>
          </div>
          <button
            type="button"
            onClick={handleDownloadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors shrink-0 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Download Sample CSV</span>
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="mt-4 flex items-center gap-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'upload'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upload CSV / JSON File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'paste'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Paste Raw CSV
          </button>
        </div>

        {/* Tab 1: File Dropzone */}
        {activeTab === 'upload' && (
          <div className="mt-4 space-y-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/30"
            >
              <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-800">
                Click to browse or drag & drop CSV / JSON file
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Supports .csv and .json</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json,text/csv,application/json"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileChange(f);
              }}
              className="hidden"
            />
            {selectedFile && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs">
                <span className="font-medium text-slate-800 truncate">
                  📄 {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </span>
                <span className="font-bold text-blue-700 font-mono">
                  {parsedRows.length} rows parsed
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Paste Raw CSV */}
        {activeTab === 'paste' && (
          <div className="mt-4 space-y-2">
            <textarea
              rows={6}
              value={pastedText}
              onChange={(e) => handlePasteChange(e.target.value)}
              placeholder={`Paste CSV content here with headers:\n${requiredColumns.join(',')}\n...`}
              className="w-full p-3 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 resize-y"
            />
            {parsedRows.length > 0 && (
              <p className="text-[11px] font-bold text-emerald-600 font-mono">
                ✓ {parsedRows.length} record(s) detected
              </p>
            )}
          </div>
        )}

        {/* Preview of Parsed Rows */}
        {parsedRows.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5 text-slate-500" />
                Parsed Records Preview ({parsedRows.length})
              </span>
              <span className="text-[11px] text-slate-400">Showing up to first 5 rows</span>
            </div>
            <div className="overflow-x-auto max-h-48 border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0">
                  <tr>
                    <th className="py-2 px-3">#</th>
                    {Object.keys(parsedRows[0] || {}).map((col) => (
                      <th key={col} className="py-2 px-3 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {parsedRows.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-1.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                      {Object.values(row).map((val, vIdx) => (
                        <td key={vIdx} className="py-1.5 px-3 truncate max-w-[140px]">
                          {val || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {resultMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{resultMsg}</span>
          </div>
        )}

        {/* Actions Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading || parsedRows.length === 0}
            onClick={handleSubmitImport}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#2335f2] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            {loading ? (
              <>
                <Cog className="w-4 h-4 animate-spin" />
                <span>Importing...</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4" />
                <span>Import {parsedRows.length > 0 ? `${parsedRows.length} ` : ''}Records</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
