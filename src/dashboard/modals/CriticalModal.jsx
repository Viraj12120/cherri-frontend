import React from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { CRITICAL_ITEMS } from '../data/mockData';
import { Modal } from '../components/ModalBase';

const CriticalModal = ({ onClose }) => (
  <Modal onClose={onClose}>
    <div className="bg-gradient-to-r from-danger/20 to-transparent border-b border-danger/20 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <ShieldAlert size={18} className="text-danger" />
        <span className="font-bold text-sm text-white">3 Critical Items Require Action</span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-danger/20 text-danger border border-danger/30 animate-pulse">URGENT</span>
      </div>
      <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"><X size={16} /></button>
    </div>
    <div className="divide-y divide-white/5 max-h-[65vh] overflow-y-auto">
      {CRITICAL_ITEMS.map((item, i) => (
        <div key={i} className="p-6 hover:bg-white/[0.02] transition-colors">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="font-bold text-white text-sm">{item.name}</p>
              <p className="text-[11px] text-white/30 font-mono mt-0.5">{item.sku} · {item.category} · {item.supplier}</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-danger/10 text-danger border border-danger/30 shrink-0">CRITICAL</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Current Stock', val: `${item.stock} units`, danger: true },
              { label: 'Min Threshold', val: `${item.min} units`, danger: false },
              { label: 'Days Remaining', val: `~${item.daysLeft} days`, danger: true },
              { label: 'Expiry', val: item.expiry, danger: false },
            ].map((s, si) => (
              <div key={si} className="bg-white/5 border border-white/5 rounded-lg p-3">
                <p className="text-[9px] text-white/30 uppercase font-bold tracking-widest mb-1">{s.label}</p>
                <p className={`text-sm font-bold ${s.danger ? 'text-danger' : 'text-white/70'}`}>{s.val}</p>
              </div>
            ))}
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-[10px] text-white/30 mb-1">
              <span>Stock level vs minimum</span>
              <span className="text-danger font-bold">{Math.round((item.stock / item.min) * 100)}% of minimum</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-danger rounded-full" style={{ width: `${Math.min(100, (item.stock / item.min) * 100)}%` }} />
            </div>
          </div>
          <p className="text-[11px] text-danger/70 mb-4 leading-relaxed">⚠ {item.risk}</p>
          <div className="flex gap-2">
            <button className="flex-1 h-8 bg-danger/10 hover:bg-danger text-danger hover:text-white rounded-lg text-xs font-bold transition-all border border-danger/30">
              Reorder {item.suggestedOrder.toLocaleString()} units
            </button>
            <button className="h-8 px-4 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg text-xs font-bold transition-all border border-white/10">
              Batch: {item.batch}
            </button>
          </div>
        </div>
      ))}
    </div>
    <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
      <p className="text-[11px] text-white/30">Last scanned by Inventory Monitor · 2 min ago</p>
      <button onClick={onClose} className="text-xs font-bold text-white/50 hover:text-white transition-colors">Dismiss</button>
    </div>
  </Modal>
);

export default CriticalModal;
