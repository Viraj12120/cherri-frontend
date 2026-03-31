import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Upload, FileText, Download, CheckCircle2, AlertCircle, Loader2, ArrowLeft, MoreHorizontal } from 'lucide-react';
import api from '../../lib/axios';
import { useUiStore } from '../../stores/uiStore';

const STEPS = {
  SELECT_TYPE: 'select',
  UPLOAD: 'upload',
  PROCESSING: 'processing',
  RESULT: 'result'
};

const BulkImportModal = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const addToast = useUiStore((s) => s.addToast);
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(STEPS.SELECT_TYPE);
  const [importType, setImportType] = useState(null); // 'medicines' or 'inventory'
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const reset = () => {
    setStep(STEPS.SELECT_TYPE);
    setImportType(null);
    setFile(null);
    setResult(null);
    setIsUploading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const selectType = (type) => {
    setImportType(type);
    setStep(STEPS.UPLOAD);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      addToast({ type: 'error', message: 'Please select a valid CSV file.' });
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await api.get(`/imports/template/${importType}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${importType}_template.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to download template.' });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setStep(STEPS.PROCESSING);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post(`/imports/${importType}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(data);
      setStep(STEPS.RESULT);
      if (data.success && data.imported > 0) {
        addToast({ type: 'success', message: `Successfully imported ${data.imported} items.` });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to process the import.';
      addToast({ type: 'error', message: errorMsg });
      setStep(STEPS.UPLOAD); // Go back to upload on failure
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-void/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#161618] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step !== STEPS.SELECT_TYPE && (
              <button 
                onClick={() => setStep(STEPS.SELECT_TYPE)}
                className="p-1 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"
                disabled={isUploading}
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              {step === STEPS.RESULT ? 'Import Result' : 'Bulk Import Data'}
            </h3>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-8">
          
          {/* Step 1: Select Type */}
          {step === STEPS.SELECT_TYPE && (
            <div className="space-y-4">
              <p className="text-sm text-white/60 mb-6 text-center">
                Select the type of data you want to import via CSV.
              </p>
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => selectType('medicines')}
                  className="group flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-acid/30 hover:bg-acid/5 transition-all text-left"
                >
                  <div className="p-3 rounded-lg bg-acid/10 text-acid group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-0.5">Medicines Master Data</h4>
                    <p className="text-xs text-white/40 line-clamp-1">Import new medicines with SKU, manufacturer, and thresholds.</p>
                  </div>
                </button>
                <button 
                  onClick={() => selectType('inventory')}
                  className="group flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-acid/30 hover:bg-acid/5 transition-all text-left"
                >
                  <div className="p-3 rounded-lg bg-coral/10 text-coral group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-0.5">Inventory Batches</h4>
                    <p className="text-xs text-white/40 line-clamp-1">Add stock batches for existing medicines with expiry and cost.</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Upload */}
          {step === STEPS.UPLOAD && (
            <div className="space-y-6">
              <div 
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer bg-white/[0.02] ${
                  file ? 'border-acid/40 bg-acid/5' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".csv" 
                  className="hidden" 
                />
                
                <div className={`p-4 rounded-full ${file ? 'bg-acid/20 text-acid' : 'bg-white/5 text-white/20'}`}>
                  {file ? <CheckCircle2 size={32} /> : <Upload size={32} />}
                </div>

                <div className="text-center">
                  <p className="text-sm font-bold text-white">
                    {file ? file.name : 'Click to select CSV file'}
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Only CSV files are supported (max 5MB)'}
                  </p>
                </div>

                {file && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="text-[10px] font-bold text-white/40 hover:text-danger transition-colors underline uppercase tracking-tighter"
                  >
                    Remove File
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  disabled={!file}
                  onClick={handleUpload}
                  className="w-full bg-acid text-void font-bold py-3 rounded-xl hover:brightness-110 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
                >
                  Confirm & Upload Data
                </button>
                
                <button 
                  onClick={downloadTemplate}
                  className="flex items-center justify-center gap-2 text-xs font-bold text-white/40 hover:text-white transition-colors py-2"
                >
                  <Download size={14} /> Download {importType} Template
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Processing */}
          {step === STEPS.PROCESSING && (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-6">
              <div className="relative">
                <Loader2 size={48} className="text-acid animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <MoreHorizontal size={24} className="text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Processing Data...</h4>
                <p className="text-sm text-white/40 max-w-[280px] mx-auto">
                  We're validating and importing your CSV records. This may take a few moments.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Result */}
          {step === STEPS.RESULT && result && (
            <div className="space-y-6">
              <div className={`p-4 rounded-xl flex items-center gap-4 ${result.errors?.length > 0 ? 'bg-danger/10 border border-danger/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
                <div className={`p-2 rounded-lg ${result.errors?.length > 0 ? 'bg-danger/20 text-danger' : 'bg-emerald-500/20 text-emerald-500'}`}>
                  {result.errors?.length > 0 ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                </div>
                <div>
                  <h4 className={`font-bold ${result.errors?.length > 0 ? 'text-danger' : 'text-emerald-500'}`}>
                    {result.errors?.length > 0 ? 'Import completed with warnings' : 'Import successful'}
                  </h4>
                  <p className="text-xs text-white/60">
                    Imported <span className="font-bold text-white">{result.imported || 0}</span> records successfully.
                  </p>
                </div>
              </div>

              {result.errors && result.errors.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Error Log ({result.errors.length})</p>
                  <div className="max-h-48 overflow-y-auto bg-black/40 rounded-xl border border-white/5 divide-y divide-white/5 custom-scrollbar">
                    {result.errors.map((err, idx) => (
                      <div key={idx} className="p-3 text-[11px] flex gap-3 items-start">
                        <span className="text-white/20 font-mono mt-0.5">#{idx + 1}</span>
                        <div>
                          <p className="text-white/80 font-bold">{err.row !== undefined ? `Row ${err.row}: ` : ''}{err.message || err.error || 'Validation error'}</p>
                          {err.details && <p className="text-white/40 mt-0.5 italic">{err.details}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={result.imported > 0 ? onSuccess : handleClose}
                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all"
              >
                {result.imported > 0 ? 'View Updated Inventory' : 'Close'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BulkImportModal;
