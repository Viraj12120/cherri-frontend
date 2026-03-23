import React, { useState } from 'react';
import { Download, FileText, Table2, Check, CheckCircle, Loader2 } from 'lucide-react';
import { Modal, ModalHeader } from '../components/ModalBase';

const ExportModal = ({ onClose }) => {
  const [format, setFormat] = useState('csv');
  const [range, setRange] = useState('7d');
  const [sections, setSections] = useState({ inventory: true, orders: true, alerts: true, expiry: false });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1800);
  };

  const toggle = (key) => setSections(s => ({ ...s, [key]: !s[key] }));

  return (
    <Modal onClose={onClose} maxW="max-w-lg">
      <ModalHeader icon={Download} title="Export Report" subtitle="Download inventory data as CSV or PDF" onClose={onClose} accent="text-acid" />
      <div className="p-6 space-y-5">
        {/* Format */}
        <div>
          <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2">Format</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'csv', icon: Table2, label: 'CSV Spreadsheet', desc: 'Import into Excel / Sheets' },
              { id: 'pdf', icon: FileText, label: 'PDF Report', desc: 'Formatted summary report' },
            ].map(f => (
              <button key={f.id} onClick={() => setFormat(f.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${format === f.id ? 'border-acid/40 bg-acid/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}>
                <f.icon size={18} className={format === f.id ? 'text-acid' : 'text-white/40'} />
                <div>
                  <p className={`text-xs font-bold ${format === f.id ? 'text-acid' : 'text-white/70'}`}>{f.label}</p>
                  <p className="text-[10px] text-white/30">{f.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2">Date Range</p>
          <div className="flex gap-2 flex-wrap">
            {[['7d', 'Last 7 days'], ['30d', 'Last 30 days'], ['90d', 'Last 90 days'], ['all', 'All time']].map(([id, label]) => (
              <button key={id} onClick={() => setRange(id)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all ${range === id ? 'bg-acid/20 text-acid border border-acid/30' : 'text-white/40 hover:text-white bg-white/5 border border-transparent'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div>
          <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2">Include Sections</p>
          <div className="space-y-2">
            {[
              { key: 'inventory', label: 'Full Inventory List' },
              { key: 'orders', label: 'Purchase Orders' },
              { key: 'alerts', label: 'Active Alerts' },
              { key: 'expiry', label: 'Expiry Report' },
            ].map(s => (
              <label key={s.key} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 cursor-pointer hover:border-white/10 transition-all">
                <div onClick={() => toggle(s.key)} className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${sections[s.key] ? 'bg-acid border-acid' : 'border-white/20'}`}>
                  {sections[s.key] && <Check size={10} className="text-void" />}
                </div>
                <span className="text-xs font-medium text-white/80">{s.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between gap-3">
        <button onClick={onClose} className="text-xs font-bold text-white/40 hover:text-white transition-colors">Cancel</button>
        {done ? (
          <div className="flex items-center gap-2 text-success text-xs font-bold">
            <CheckCircle size={15} /> Report downloaded!
          </div>
        ) : (
          <button onClick={handleExport} disabled={loading}
            className="flex items-center gap-2 bg-acid text-void px-5 py-2 rounded-lg text-xs font-bold hover:brightness-110 transition-all disabled:opacity-60">
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            {loading ? 'Exporting...' : `Export as ${format.toUpperCase()}`}
          </button>
        )}
      </div>
    </Modal>
  );
};

export default ExportModal;
