import React, { useState } from 'react';
import { ClipboardList, Download, CheckCircle } from 'lucide-react';
import api from '../../lib/axios';
import { useUiStore } from '../../stores/uiStore';

const AuditLogPage = () => {
  const addToast = useUiStore((s) => s.addToast);
  const [downloading, setDownloading] = useState(false);

  const downloadBlob = (data, filename, contentType) => {
    const blob = new Blob([data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleExport = async () => {
    setDownloading(true);
    try {
      const response = await api.get('/audit-log/export', { responseType: 'blob' });
      downloadBlob(response.data, 'audit_log.csv', response.headers['content-type'] || 'text/csv');
      addToast({ type: 'success', message: 'Audit log downloaded successfully.' });
    } catch (err) {
      console.error('Export failed:', err);
      addToast({ type: 'error', message: 'Failed to download audit log.' });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 pb-24">
      <div className="bg-[#161618] border border-white/5 rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl">
        <div className="w-16 h-16 bg-acid/10 text-acid rounded-2xl flex items-center justify-center mb-6">
          <ClipboardList size={32} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Audit Logs</h1>
        <p className="text-white/50 text-sm max-w-md mx-auto mb-8 leading-relaxed">
          The system maintains a comprehensive audit trail of all activities for compliance and security monitoring. Audit logs are available as a downloadable CSV report.
        </p>

        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 w-full max-w-sm">
          <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-4">Export Full Log</p>
          <button 
            onClick={handleExport}
            disabled={downloading}
            className="w-full bg-acid text-void font-bold rounded-xl py-3 px-6 flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-70"
          >
            {downloading ? (
              <span className="flex items-center gap-2"><CheckCircle size={18} className="animate-spin" /> Exporting...</span>
            ) : (
              <><Download size={18} /> Download CSV</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogPage;
