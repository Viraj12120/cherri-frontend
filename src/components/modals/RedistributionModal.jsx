import React, { useState } from 'react';
import { X, ArrowRightLeft, Loader2 } from 'lucide-react';
import api from '../../lib/axios';
import { useUiStore } from '../../stores/uiStore';

const REASONS = [
  { value: 'expiry_risk', label: 'Expiry Risk' },
  { value: 'overstock', label: 'Overstock' },
  { value: 'emergency_transfer', label: 'Emergency Transfer' },
];

const RedistributionModal = ({ isOpen, onClose, onSuccess }) => {
  const addToast = useUiStore((s) => s.addToast);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    medicine_id: '',
    source_inventory_id: '',
    quantity: 1,
    reason: 'overstock',
    destination_notes: '',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/redistributions/', {
        ...form,
        quantity: Number(form.quantity),
        triggered_by: 'manual',
      });
      addToast({ type: 'success', message: 'Redistribution request created' });
      setForm({ medicine_id: '', source_inventory_id: '', quantity: 1, reason: 'overstock', destination_notes: '', notes: '' });
      onSuccess?.();
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.detail || 'Failed to create redistribution request.' });
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
            <ArrowRightLeft size={16} className="text-acid" /> New Redistribution Request
          </h3>
          <button onClick={onClose} className="p-1 text-white/40 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Medicine ID *</label>
            <input
              required value={form.medicine_id} onChange={e => update('medicine_id', e.target.value)}
              className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors"
              placeholder="UUID of the medicine"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Source Inventory ID *</label>
            <input
              required value={form.source_inventory_id} onChange={e => update('source_inventory_id', e.target.value)}
              className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors"
              placeholder="UUID of the source inventory batch"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Quantity *</label>
              <input
                required type="number" min="1" value={form.quantity} onChange={e => update('quantity', e.target.value)}
                className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Reason *</label>
              <select
                required value={form.reason} onChange={e => update('reason', e.target.value)}
                className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors"
              >
                {REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Destination Notes *</label>
            <input
              required value={form.destination_notes} onChange={e => update('destination_notes', e.target.value)}
              className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors"
              placeholder="e.g. Branch 4, Pune"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Notes</label>
            <textarea
              value={form.notes} onChange={e => update('notes', e.target.value)} rows={2}
              className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors resize-none"
              placeholder="Optional additional notes..."
            />
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-white/5">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-bold text-white/40 hover:bg-white/5 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="px-4 py-2 bg-acid text-void rounded-lg text-xs font-bold hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50">
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <ArrowRightLeft size={14} />}
              {isSubmitting ? 'Creating...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RedistributionModal;
