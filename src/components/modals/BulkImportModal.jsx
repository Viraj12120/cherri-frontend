import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X, Upload, FileText, Download, CheckCircle2, AlertCircle,
  Loader2, ArrowLeft, MoreHorizontal, Sparkles, FileImage, ShieldCheck
} from 'lucide-react';
import api from '../../lib/axios';
import { getErrorMessage } from '../../lib/utils';
import { useUiStore } from '../../stores/uiStore';

const STEPS = {
  UPLOAD: 'upload',
  PROCESSING: 'processing',
  PREVIEW: 'preview',
  RESULT: 'result'
};

const BulkImportModal = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const addToast = useUiStore((s) => s.addToast);
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(STEPS.UPLOAD);
  const isUniversal = true;
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [autoCreateMedicines, setAutoCreateMedicines] = useState(true);

  if (!isOpen) return null;

  const reset = () => {
    setStep(STEPS.UPLOAD);
    setFile(null);
    setResult(null);
    setPreviewData(null);
    setIsUploading(false);
    setIsConfirming(false);
    setAutoCreateMedicines(true);
  };


  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Allow valid AI extract types
    const validTypes = ['text/csv', 'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/png', 'image/jpeg', 'image/webp'];
    if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx')) {
      setFile(selectedFile);
    } else {
      addToast({ type: 'error', message: 'Please select a valid file (CSV, Excel, PDF, or Image).' });
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
      const { data } = await api.post('/imports/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPreviewData(data);
      setStep(STEPS.PREVIEW);
    } catch (err) {
      addToast({ type: 'error', message: getErrorMessage(err, 'Failed to process the import.') });
      setStep(STEPS.UPLOAD);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!previewData?.job_id) return;

    setIsConfirming(true);
    try {
      const { data } = await api.post(
        `/imports/bulk-upload/${previewData.job_id}/confirm`,
        { auto_create_medicines: autoCreateMedicines }
      );

      setResult({
        success: data.status === 'completed' || data.status === 'success',
        imported: data.inventory_items_created,
        medicines_created: data.medicines_created,
        ...data
      });
      setStep(STEPS.RESULT);

      if (data.inventory_items_created > 0 || data.medicines_created > 0) {
        addToast({ type: 'success', message: `Successfully imported data.` });
      }
    } catch (err) {
      addToast({ type: 'error', message: getErrorMessage(err, 'Failed to confirm the import.') });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-void/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      <div className={`relative bg-[#161618] border border-white/10 rounded-2xl w-full ${step === STEPS.PREVIEW ? 'max-w-4xl' : 'max-w-lg'} overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 transition-all`}>

        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-void/30">
          <div className="flex items-center gap-3">
            {step !== STEPS.SELECT_TYPE && step !== STEPS.PROCESSING && step !== STEPS.RESULT && (
              <button
                onClick={() => setStep(step === STEPS.PREVIEW ? STEPS.UPLOAD : STEPS.SELECT_TYPE)}
                className="p-1 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"
                disabled={isUploading || isConfirming}
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <h3 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
              {step === STEPS.RESULT && 'Import Result'}
              {step === STEPS.UPLOAD && <><Sparkles size={16} className="text-purple-400" /> AI File Extraction</>}
              {step === STEPS.PREVIEW && 'Review Extracted Data'}
              {step === STEPS.PROCESSING && 'Processing...'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"
            disabled={isUploading || isConfirming}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 md:p-8 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">

          {/* Step 2: Upload */}
          {step === STEPS.UPLOAD && (
            <div className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-5 transition-all cursor-pointer bg-white/[0.02] ${file ? (isUniversal ? 'border-purple-500/40 bg-purple-500/5' : 'border-acid/40 bg-acid/5') : 'border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept={isUniversal ? ".csv,.xlsx,.xls,.pdf,image/png,image/jpeg,image/webp" : ".csv"}
                  className="hidden"
                />

                <div className={`p-4 rounded-full ${file ? (isUniversal ? 'bg-purple-500/20 text-purple-400' : 'bg-acid/20 text-acid') : 'bg-white/5 text-white/20'}`}>
                  {file ? <CheckCircle2 size={36} /> : (isUniversal ? <FileImage size={36} /> : <Upload size={36} />)}
                </div>

                <div className="text-center">
                  <p className="text-base font-bold text-white">
                    {file ? file.name : (isUniversal ? 'Drop any invoice, Excel, or PDF here' : 'Click to select CSV file')}
                  </p>
                  <p className="text-xs text-white/40 mt-1.5">
                    {file
                      ? `${(file.size / 1024).toFixed(1)} KB`
                      : (isUniversal ? 'Supports PDF, Excel, CSV, PNG, JPG (Max 20MB)' : 'Only STRICT CSV format supported (Max 5MB)')}
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

              {!isUniversal && (
                <div className="bg-acid/5 border border-acid/10 rounded-xl p-4 flex gap-3 text-acid">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold mb-1">Strict formatting required</p>
                    <p className="text-white/60">Your CSV must exactly match our template structure. Any deviation will cause the upload to fail.</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  disabled={!file}
                  onClick={handleUpload}
                  className={`w-full font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 ${isUniversal
                      ? 'bg-purple-500 hover:bg-purple-400 text-white disabled:bg-white/5 disabled:text-white/20 shadow-[0_0_20px_rgba(168,85,247,0.2)] disabled:shadow-none'
                      : 'bg-acid text-void hover:brightness-110 disabled:opacity-50 disabled:grayscale'
                    }`}
                >
                  {isUniversal ? (
                    <><Sparkles size={18} /> Extract Data with AI</>
                  ) : (
                    <><Upload size={18} /> Upload & Validate</>
                  )}
                </button>

                {!isUniversal && (
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center justify-center gap-2 text-xs font-bold text-white/40 hover:text-white transition-colors py-2"
                  >
                    <Download size={14} /> Download {importType} Template
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Processing */}
          {step === STEPS.PROCESSING && (
            <div className="py-16 flex flex-col items-center justify-center text-center gap-6">
              <div className="relative">
                {isUniversal ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse"></div>
                    <Loader2 size={56} className="text-purple-400 animate-spin relative z-10" />
                  </div>
                ) : (
                  <Loader2 size={48} className="text-acid animate-spin" />
                )}
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">
                  {isUniversal ? 'Analyzing Document with AI...' : 'Processing CSV...'}
                </h4>
                <p className="text-sm text-white/40 max-w-[320px] mx-auto leading-relaxed">
                  {isUniversal
                    ? "We're extracting items, matching medicines, and standardizing data formats. This magical process takes about 10-20 seconds."
                    : "We're validating your CSV structures."}
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Preview (AI Flow Only) */}
          {step === STEPS.PREVIEW && previewData && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl">
                <div>
                  <h4 className="text-white font-bold text-lg flex items-center gap-2">
                    <Sparkles size={18} className="text-purple-400" /> Extracted successfully
                  </h4>
                  <p className="text-sm text-purple-200 mt-1">
                    Found <span className="font-bold text-white bg-white/10 px-1.5 py-0.5 rounded">{previewData.row_count || 0}</span> items from your file. Please review before finalizing.
                  </p>
                </div>
                {previewData.processing_note && (
                  <div className="text-[10px] bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg max-w-[200px] text-white/40 truncate">
                    {previewData.processing_note}
                  </div>
                )}
              </div>

              {/* Data Table */}
              <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-white/5 text-white/40 text-[10px] uppercase font-bold tracking-widest border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3">Medicine</th>
                        <th className="px-4 py-3">SKU</th>
                        <th className="px-4 py-3">Qty</th>
                        <th className="px-4 py-3">Cost Price</th>
                        <th className="px-4 py-3">Selling Price</th>
                        <th className="px-4 py-3">Batch/Expiry</th>
                        <th className="px-4 py-3">Matched</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {previewData.extracted_items?.length > 0 ? (
                        previewData.extracted_items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="px-4 py-3">
                              <div className="font-bold text-white max-w-[150px] truncate" title={item.medicine_name}>
                                {item.medicine_name}
                              </div>
                              {item.manufacturer && <div className="text-[10px] text-white/40 truncate max-w-[150px]">{item.manufacturer}</div>}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-white/60">{item.medicine_sku || '-'}</td>
                            <td className="px-4 py-3 text-white font-bold">{item.quantity || 0}</td>
                            <td className="px-4 py-3 text-white/80">{item.cost_price !== null && item.cost_price !== undefined ? item.cost_price : '-'}</td>
                            <td className="px-4 py-3 text-white/80">{item.selling_price !== null && item.selling_price !== undefined ? item.selling_price : '-'}</td>
                            <td className="px-4 py-3">
                              <div className="text-xs text-white/80">{item.batch_number || 'No batch'}</div>
                              <div className="text-[10px] text-white/40">{item.expiry_date || '-'}</div>
                            </td>
                            <td className="px-4 py-3">
                              {item.medicine_matched ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-lg border border-emerald-400/20">
                                  <ShieldCheck size={12} /> Yes
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] text-coral bg-coral/10 px-2 py-0.5 rounded-lg border border-coral/20">
                                  New
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-4 py-8 text-center text-white/40 italic">
                            No valid items extracted.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl cursor-pointer" onClick={() => setAutoCreateMedicines(!autoCreateMedicines)}>
                <input
                  type="checkbox"
                  checked={autoCreateMedicines}
                  onChange={() => setAutoCreateMedicines(!autoCreateMedicines)}
                  className="w-4 h-4 bg-black border-white/20 rounded accent-purple-500"
                />
                <div className="text-sm text-white/80">
                  <span className="font-bold text-white mr-1">Auto-create medicines:</span>
                  If an extracted medicine doesn't exist in your database, we'll cleanly create it instead of ignoring it.
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleClose}
                  disabled={isConfirming}
                  className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white/60 font-bold transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmImport}
                  disabled={isConfirming || previewData.extracted_items?.length === 0}
                  className="flex-1 bg-purple-500 hover:bg-purple-400 text-white font-bold py-3 rounded-xl shadow-[0_4px_15px_rgba(168,85,247,0.3)] hover:shadow-[0_4px_20px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
                >
                  {isConfirming ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={18} /> Confirm Import to Database</>}
                </button>
              </div>

            </div>
          )}

          {/* Step 5: Result (Shared for all) */}
          {step === STEPS.RESULT && result && (
            <div className="space-y-6">
              <div className={`p-5 rounded-2xl flex items-start gap-4 ${!result.success && result.errors?.length > 0
                  ? 'bg-danger/10 border border-danger/20'
                  : 'bg-emerald-500/10 border border-emerald-500/20'
                }`}>
                <div className={`p-3 rounded-xl mt-0.5 ${!result.success && result.errors?.length > 0 ? 'bg-danger/20 text-danger' : 'bg-emerald-500/20 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}>
                  {!result.success && result.errors?.length > 0 ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
                </div>
                <div>
                  <h4 className={`text-xl font-bold mb-1 ${!result.success && result.errors?.length > 0 ? 'text-danger' : 'text-emerald-500'}`}>
                    {result.errors?.length > 0
                      ? (result.success ? 'Import completed with warnings' : 'Import failed')
                      : 'Import successfully complete'}
                  </h4>

                  {isUniversal ? (
                    <div className="flex flex-col gap-1 mt-2 text-sm">
                      <p className="text-white/60">New medicines created: <span className="font-bold text-white">{result.medicines_created || 0}</span></p>
                      <p className="text-white/60">Inventory batches added: <span className="font-bold text-white">{result.inventory_items_created || result.imported || 0}</span></p>
                    </div>
                  ) : (
                    <p className="text-sm text-white/60 mt-1">
                      Imported <span className="font-bold text-white">{result.imported !== undefined ? result.imported : (result.records_imported || result.success_count || result.count || 0)}</span> records successfully.
                    </p>
                  )}
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
                onClick={
                  () => {
                    const count = isUniversal ? (result.inventory_items_created || result.medicines_created) : (result.imported || result.records_imported || result.success_count || result.count || 0);
                    if (count > 0) {
                      onSuccess?.();
                    } else {
                      handleClose();
                    }
                  }
                }
                className={`w-full font-bold py-3.5 rounded-xl transition-all ${(!result.success && result.errors?.length > 0)
                    ? 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'
                    : (isUniversal ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-emerald-500 hover:bg-emerald-400 text-white')
                  }`}
              >
                {(!result.success && result.errors?.length > 0) ? 'Close' : 'View Updated Inventory'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BulkImportModal;
