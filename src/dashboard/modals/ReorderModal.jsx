import React, { useState, useEffect } from 'react';
import { Package, Check, CheckCircle, Loader2 } from 'lucide-react';
import { Modal, ModalHeader } from '../components/ModalBase';
import api from '../../lib/axios';
import { useUiStore } from '../../stores/uiStore';

const ReorderModal = ({ item, onClose, onSuccess }) => {
  const addToast = useUiStore((s) => s.addToast);

  // Map real inventory batch fields
  const medicineName = item.medicine?.name || 'Unknown';
  const supplierName = item.supplier?.name || '-';
  const supplierId = item.supplier_id || item.supplier?.id;
  const medicineId = item.medicine_id || item.medicine?.id;
  const currentStock = item.quantity ?? 0;
  const threshold = item.medicine?.low_stock_threshold ?? 10;
  const costPrice = parseFloat(item.cost_price) || 0;

  const [qty, setQty] = useState(Math.max(threshold - currentStock, threshold));
  const [suggestedQty, setSuggestedQty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [fetchingSuggestion, setFetchingSuggestion] = useState(false);

  // Fetch AI suggestion on mount
  useEffect(() => {
    if (!medicineId) return;
    setFetchingSuggestion(true);
    api.get(`/inventory/${medicineId}/suggested-order`)
      .then(res => {
        const sq = res.data?.suggested_order_quantity;
        if (sq && sq > 0) {
          setSuggestedQty(sq);
        }
      })
      .catch(() => { /* AI suggestion unavailable — no-op */ })
      .finally(() => setFetchingSuggestion(false));
  }, [medicineId]);

  const handleConfirm = async () => {
    if (!medicineId) {
      addToast({ type: 'error', message: 'Medicine ID missing — cannot create order.' });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        supplier_id: supplierId,
        total_amount: qty * costPrice,
        notes: `Reorder for ${medicineName}`,
        items: [{
          medicine_id: medicineId,
          quantity: qty,
          price_per_unit: costPrice,
        }]
      };
      await api.post('/orders/', payload);
      setDone(true);
      addToast({ type: 'success', message: `Order created for ${qty.toLocaleString()} units of ${medicineName}` });
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.detail || 'Failed to create reorder.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} maxW="max-w-md">
      <ModalHeader icon={Package} title={`Reorder ${medicineName}`} subtitle={`Supplier: ${supplierName}`} onClose={onClose} accent="text-acid" />
      {done ? (
        <div className="p-10 flex flex-col items-center gap-3 text-center">
          <CheckCircle size={36} className="text-success" />
          <p className="font-bold text-white">Order Created</p>
          <p className="text-xs text-white/40">PO for <b className="text-white">{qty.toLocaleString()} units</b> of {medicineName} submitted for approval.</p>
          <button onClick={() => { onSuccess?.(); onClose(); }} className="mt-3 px-6 py-2 bg-acid text-void font-bold text-xs rounded-lg">Done</button>
        </div>
      ) : (
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Current Stock', val: `${currentStock}`, danger: currentStock === 0 || currentStock <= threshold },
              { label: 'Min Threshold', val: `${threshold}`, danger: false },
              { label: 'Unit Cost', val: `₹${costPrice.toFixed(2)}`, danger: false },
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
              {fetchingSuggestion ? (
                <span className="text-[10px] text-white/30 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Loading AI suggestion...</span>
              ) : suggestedQty && suggestedQty > 0 ? (
                <button onClick={() => setQty(suggestedQty)} className="text-[10px] text-acid hover:underline font-bold">Use AI suggestion ({suggestedQty.toLocaleString()})</button>
              ) : null}
            </div>
            <input type="number" min="1" value={qty} onChange={e => setQty(Number(e.target.value))}
              className="bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white font-bold focus:outline-none focus:border-acid/40 transition-all text-center" />
          </div>
          <div className="bg-acid/5 border border-acid/20 rounded-lg p-3 flex items-center justify-between">
            <span className="text-[11px] text-white/50">Total Estimated Cost</span>
            <span className="text-sm font-bold text-acid">₹{(qty * costPrice).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
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
