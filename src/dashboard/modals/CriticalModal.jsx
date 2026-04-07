import React from 'react';
import { ShieldAlert, X, Truck } from 'lucide-react';
import { Modal } from '../components/ModalBase';

const CriticalModal = ({ items = [], onClose, onReorder }) => {
  const criticalItems = items.slice(0, 10);

  return (
    <Modal onClose={onClose}>
      <div className="bg-gradient-to-r from-danger/20 to-transparent border-b border-danger/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert size={18} className="text-danger" />
          <span className="font-bold text-sm text-white">{criticalItems.length} Critical Item{criticalItems.length !== 1 ? 's' : ''} Require Action</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-danger/20 text-danger border border-danger/30 animate-pulse">URGENT</span>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"><X size={16} /></button>
      </div>
      <div className="divide-y divide-white/5 max-h-[65vh] overflow-y-auto">
        {criticalItems.length === 0 ? (
          <div className="p-10 text-center text-white/30 text-sm">No critical items at this time.</div>
        ) : criticalItems.map((item, i) => {
          const qty = item.quantity ?? 0;
          const threshold = item.medicine?.low_stock_threshold ?? 10;
          const medicineName = item.medicine?.name || 'Unknown';
          const batchNumber = item.batch_number || '-';
          const expiryDate = item.expiry_date
            ? new Date(item.expiry_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            : '-';
          const costPrice = parseFloat(item.cost_price) || 0;
          const supplierName = item.supplier?.name || '-';
          const sku = item.medicine?.sku || '-';
          const stockPct = threshold > 0 ? Math.round((qty / threshold) * 100) : 0;

          // Estimate days left from quantity (rough: assume ~10 units/day consumption)
          const daysLeft = qty > 0 ? Math.max(1, Math.ceil(qty / Math.max(1, threshold / 30))) : 0;

          return (
            <div key={item.id || i} className="p-6 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-bold text-white text-sm">{medicineName}</p>
                  <p className="text-[11px] text-white/30 font-mono mt-0.5">{sku} · {supplierName}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-danger/10 text-danger border border-danger/30 shrink-0">CRITICAL</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Current Stock', val: `${qty} units`, danger: true },
                  { label: 'Min Threshold', val: `${threshold} units`, danger: false },
                  { label: 'Days Remaining', val: `~${daysLeft} days`, danger: true },
                  { label: 'Expiry', val: expiryDate, danger: false },
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
                  <span className="text-danger font-bold">{stockPct}% of minimum</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-danger rounded-full" style={{ width: `${Math.min(100, stockPct)}%` }} />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onReorder?.(item)}
                  className="flex-1 h-8 bg-danger/10 hover:bg-danger text-danger hover:text-white rounded-lg text-xs font-bold transition-all border border-danger/30 flex items-center justify-center gap-1"
                >
                  <Truck size={12} /> Reorder Now
                </button>
                <button className="h-8 px-4 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg text-xs font-bold transition-all border border-white/10">
                  Batch: {batchNumber}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
        <p className="text-[11px] text-white/30">Showing {criticalItems.length} critical items from live inventory</p>
        <button onClick={onClose} className="text-xs font-bold text-white/50 hover:text-white transition-colors">Dismiss</button>
      </div>
    </Modal>
  );
};

export default CriticalModal;
