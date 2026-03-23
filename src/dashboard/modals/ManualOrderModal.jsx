import React, { useState } from 'react';
import { Plus, ChevronDown, CheckCircle, Loader2 } from 'lucide-react';
import { Modal, ModalHeader } from '../components/ModalBase';
import { SUPPLIERS } from '../data/mockData';

const ManualOrderModal = ({ onClose }) => {
  const [form, setForm] = useState({ medicine: '', supplier: '', qty: '', priority: 'NORMAL', notes: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1600);
  };

  return (
    <Modal onClose={onClose} maxW="max-w-lg">
      <ModalHeader icon={Plus} title="Create Manual Order" subtitle="Place a purchase order to your supplier" onClose={onClose} accent="text-acid" />

      {done ? (
        <div className="p-12 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle size={32} className="text-success" />
          </div>
          <p className="text-white font-bold text-lg">Order Placed!</p>
          <p className="text-white/40 text-xs">Purchase order for <span className="text-white font-bold">{form.medicine}</span> has been created and is pending approval.</p>
          <button onClick={onClose} className="mt-4 px-6 py-2 bg-acid text-void font-bold text-xs rounded-lg hover:brightness-110 transition-all">Done</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Medicine Name *</label>
                <input required value={form.medicine} onChange={e => set('medicine', e.target.value)}
                  placeholder="e.g. Metformin 500mg"
                  className="bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-acid/40 transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Supplier *</label>
                <div className="relative">
                  <select required value={form.supplier} onChange={e => set('supplier', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-acid/40 transition-all appearance-none">
                    <option value="" className="bg-[#0f0f11]">Select supplier</option>
                    {SUPPLIERS.map(s => <option key={s} value={s} className="bg-[#0f0f11]">{s}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Quantity *</label>
                <input required type="number" min="1" value={form.qty} onChange={e => set('qty', e.target.value)}
                  placeholder="e.g. 1200"
                  className="bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-acid/40 transition-all" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Priority</label>
              <div className="flex gap-2">
                {[
                  { id: 'URGENT', color: 'text-danger border-danger/40 bg-danger/10', hover: 'hover:bg-danger/20' },
                  { id: 'HIGH', color: 'text-warn border-warn/40 bg-warn/10', hover: 'hover:bg-warn/20' },
                  { id: 'NORMAL', color: 'text-acid border-acid/40 bg-acid/10', hover: 'hover:bg-acid/20' },
                ].map(p => (
                  <button type="button" key={p.id} onClick={() => set('priority', p.id)}
                    className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${form.priority === p.id ? p.color : 'text-white/30 border-white/10 bg-white/5 hover:bg-white/10'}`}>
                    {p.id}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Notes (optional)</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2}
                placeholder="Special instructions, delivery window, etc."
                className="bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-acid/40 transition-all resize-none" />
            </div>

            {form.medicine && form.qty && (
              <div className="bg-acid/5 border border-acid/20 rounded-lg p-3 flex items-center justify-between">
                <span className="text-[11px] text-white/60">Estimated cost at avg. ₹4.50/unit</span>
                <span className="text-xs font-bold text-acid">≈ ₹{(parseFloat(form.qty) * 4.5).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between gap-3">
            <button type="button" onClick={onClose} className="text-xs font-bold text-white/40 hover:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 bg-acid text-void px-5 py-2 rounded-lg text-xs font-bold hover:brightness-110 transition-all disabled:opacity-60">
              {loading ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ManualOrderModal;
