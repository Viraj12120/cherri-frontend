import React, { useState, useEffect } from 'react';
import { X, Plus, Box, Loader2 } from 'lucide-react';
import api from '../../lib/axios';
import { useUiStore } from '../../stores/uiStore';

const NewOrderModal = ({ isOpen, onClose, onSuccess }) => {
  const addToast = useUiStore((s) => s.addToast);
  const [suppliers, setSuppliers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    supplier_id: '',
    medicine_name: '',
    quantity: 1,
    total_amount: 0,
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      api.get('/suppliers/?limit=100')
        .then(res => setSuppliers(Array.isArray(res.data) ? res.data : []))
        .catch(() => setSuppliers([]));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.supplier_id) {
      addToast({ type: 'error', message: 'Please select a supplier.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        supplier_id: form.supplier_id,
        total_amount: Number(form.total_amount),
        notes: form.notes || undefined,
        items: [
          {
            medicine_id: form.supplier_id, // placeholder — backend may need real medicine_id
            quantity: Number(form.quantity),
            price_per_unit: Number(form.total_amount) / Math.max(Number(form.quantity), 1),
          }
        ]
      };
      await api.post('/orders/', payload);
      addToast({ type: 'success', message: 'Order created successfully' });
      setForm({ supplier_id: '', medicine_name: '', quantity: 1, total_amount: 0, notes: '' });
      onSuccess?.();
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.detail || 'Failed to create order.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#161618] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl max-h-[calc(100vh-80px)] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#1a1a1c] shrink-0">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Box size={16} className="text-acid" /> Create Manual Order
          </h3>
          <button onClick={onClose} className="p-1 text-white/40 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Supplier</label>
            <select
              required
              value={form.supplier_id}
              onChange={e => update('supplier_id', e.target.value)}
              className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors"
            >
              <option value="">Select a supplier...</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {suppliers.length === 0 && (
              <p className="text-[10px] text-white/30 mt-1">No suppliers found. Create one in the Suppliers page first.</p>
            )}
          </div>
          <div>
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Medicine / Item Name</label>
            <input
              required
              value={form.medicine_name}
              onChange={e => update('medicine_name', e.target.value)}
              className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors"
              placeholder="e.g. Metformin 500mg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Quantity</label>
              <input
                required type="number" min="1"
                value={form.quantity}
                onChange={e => update('quantity', e.target.value)}
                className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Total Amount (₹)</label>
              <input
                required type="number" min="0" step="0.01"
                value={form.total_amount}
                onChange={e => update('total_amount', e.target.value)}
                className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
              rows={2}
              className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors resize-none"
              placeholder="Any additional notes..."
            />
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-white/5">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-bold text-white/40 hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-acid text-void rounded-lg text-xs font-bold hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              {isSubmitting ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOrderModal;
