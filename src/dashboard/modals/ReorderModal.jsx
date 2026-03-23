import React, { useState } from 'react';
import { Package, Check, CheckCircle, Loader2 } from 'lucide-react';
import { Modal, ModalHeader } from '../components/ModalBase';

const ReorderModal = ({ item, onClose }) => {
  const [qty, setQty] = useState(item.suggestedQty || 500);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1400);
  };

  return (
    <Modal onClose={onClose} maxW="max-w-md">
      <ModalHeader icon={Package} title={`Reorder ${item.name}`} subtitle={`Supplier: ${item.supplier}`} onClose={onClose} accent="text-acid" />
      {done ? (
        <div className="p-10 flex flex-col items-center gap-3 text-center">
          <CheckCircle size={36} className="text-success" />
          <p className="font-bold text-white">Order Created</p>
          <p className="text-xs text-white/40">PO for <b className="text-white">{qty.toLocaleString()} units</b> of {item.name} submitted for approval.</p>
          <button onClick={onClose} className="mt-3 px-6 py-2 bg-acid text-void font-bold text-xs rounded-lg">Done</button>
        </div>
      ) : (
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Current Stock', val: `${item.stock}`, danger: item.status === 'CRIT' },
              { label: 'Min Threshold', val: `${item.min}`, danger: false },
              { label: 'Unit Cost', val: `₹${item.unitCost}`, danger: false },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-lg p-3 text-center">
                <p className="text-[9px] text-white/30 uppercase font-bold tracking-widest mb-1">{s.label}</p>
                <p className={`text-sm font-bold ${s.danger ? 'text-danger' : 'text-white/80'}`}>{s.val}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Order Quantity</label>
              {item.suggestedQty > 0 && (
                <button onClick={() => setQty(item.suggestedQty)} className="text-[10px] text-acid hover:underline font-bold">Use AI suggestion ({item.suggestedQty.toLocaleString()})</button>
              )}
            </div>
            <input type="number" min="1" value={qty} onChange={e => setQty(Number(e.target.value))}
              className="bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white font-bold focus:outline-none focus:border-acid/40 transition-all text-center" />
          </div>
          <div className="bg-acid/5 border border-acid/20 rounded-lg p-3 flex items-center justify-between">
            <span className="text-[11px] text-white/50">Total Estimated Cost</span>
            <span className="text-sm font-bold text-acid">₹{(qty * item.unitCost).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 h-9 rounded-lg border border-white/10 text-xs font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
            <button onClick={handleConfirm} disabled={loading}
              className="flex-1 h-9 rounded-lg bg-acid text-void text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              {loading ? 'Creating...' : 'Confirm Order'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ReorderModal;
