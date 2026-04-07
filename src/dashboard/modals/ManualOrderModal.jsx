import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, CheckCircle, Loader2, Search } from 'lucide-react';
import { Modal, ModalHeader } from '../components/ModalBase';
import api from '../../lib/axios';
import { useUiStore } from '../../stores/uiStore';

const ManualOrderModal = ({ onClose, onSuccess }) => {
  const addToast = useUiStore((s) => s.addToast);
  const [form, setForm] = useState({ medicine_id: '', medicine_name: '', supplier_id: '', qty: '', price_per_unit: '', priority: 'NORMAL', notes: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Real data
  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [medSearch, setMedSearch] = useState('');
  const [showMedDropdown, setShowMedDropdown] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);

  useEffect(() => {
    api.get('/suppliers/?limit=100')
      .then(res => setSuppliers(Array.isArray(res.data) ? res.data : []))
      .catch(() => setSuppliers([]))
      .finally(() => setLoadingSuppliers(false));
  }, []);

  // Debounced medicine search
  useEffect(() => {
    if (medSearch.length < 2) { setMedicines([]); return; }
    const timer = setTimeout(() => {
      api.get(`/medicines/?search=${encodeURIComponent(medSearch)}&limit=10`)
        .then(res => {
          const items = Array.isArray(res.data) ? res.data : (res.data.items || res.data.data || []);
          setMedicines(items);
          setShowMedDropdown(true);
        })
        .catch(() => setMedicines([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [medSearch]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const selectMedicine = (med) => {
    set('medicine_id', med.id);
    set('medicine_name', med.name);
    setMedSearch(med.name);
    setShowMedDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.supplier_id) {
      addToast({ type: 'error', message: 'Please select a supplier.' });
      return;
    }
    if (!form.medicine_id) {
      addToast({ type: 'error', message: 'Please select a medicine from the search results.' });
      return;
    }
    setLoading(true);
    try {
      const qty = Number(form.qty);
      const pricePerUnit = Number(form.price_per_unit) || 0;
      const payload = {
        supplier_id: form.supplier_id,
        total_amount: qty * pricePerUnit,
        notes: form.notes || undefined,
        items: [{
          medicine_id: form.medicine_id,
          quantity: qty,
          price_per_unit: pricePerUnit,
        }]
      };
      await api.post('/orders/', payload);
      setDone(true);
      addToast({ type: 'success', message: 'Order placed successfully!' });
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.detail || 'Failed to place order.' });
    } finally {
      setLoading(false);
    }
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
          <p className="text-white/40 text-xs">Purchase order for <span className="text-white font-bold">{form.medicine_name}</span> has been created and is pending approval.</p>
          <button onClick={() => { onSuccess?.(); onClose(); }} className="mt-4 px-6 py-2 bg-acid text-void font-bold text-xs rounded-lg hover:brightness-110 transition-all">Done</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Medicine Search */}
              <div className="col-span-2 flex flex-col gap-1.5 relative">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Medicine Name *</label>
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    required
                    value={medSearch}
                    onChange={e => { setMedSearch(e.target.value); set('medicine_id', ''); set('medicine_name', e.target.value); }}
                    onFocus={() => medicines.length > 0 && setShowMedDropdown(true)}
                    placeholder="Type to search medicines..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-acid/40 transition-all"
                  />
                </div>
                {showMedDropdown && medicines.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#0f0f11] border border-white/10 rounded-lg shadow-xl z-20 max-h-40 overflow-y-auto">
                    {medicines.map(med => (
                      <button
                        key={med.id}
                        type="button"
                        onClick={() => selectMedicine(med)}
                        className="w-full text-left px-4 py-2 text-xs text-white hover:bg-white/5 transition-colors flex justify-between"
                      >
                        <span className="font-bold">{med.name}</span>
                        {med.sku && <span className="text-white/30 font-mono">{med.sku}</span>}
                      </button>
                    ))}
                  </div>
                )}
                {form.medicine_id && (
                  <span className="text-[10px] text-acid">✓ Selected: {form.medicine_name}</span>
                )}
              </div>
              {/* Supplier */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Supplier *</label>
                <div className="relative">
                  <select required value={form.supplier_id} onChange={e => set('supplier_id', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-acid/40 transition-all appearance-none">
                    <option value="" className="bg-[#0f0f11]">Select supplier</option>
                    {suppliers.map(s => <option key={s.id} value={s.id} className="bg-[#0f0f11]">{s.name}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                </div>
                {loadingSuppliers && <span className="text-[10px] text-white/30">Loading suppliers...</span>}
              </div>
              {/* Quantity */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Quantity *</label>
                <input required type="number" min="1" value={form.qty} onChange={e => set('qty', e.target.value)}
                  placeholder="e.g. 1200"
                  className="bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-acid/40 transition-all" />
              </div>
            </div>

            {/* Price per unit */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Price per unit (₹)</label>
              <input type="number" min="0" step="0.01" value={form.price_per_unit} onChange={e => set('price_per_unit', e.target.value)}
                placeholder="e.g. 4.50"
                className="bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-acid/40 transition-all" />
            </div>

            {/* Priority */}
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

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Notes (optional)</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2}
                placeholder="Special instructions, delivery window, etc."
                className="bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-acid/40 transition-all resize-none" />
            </div>

            {/* Cost preview */}
            {form.qty && form.price_per_unit && (
              <div className="bg-acid/5 border border-acid/20 rounded-lg p-3 flex items-center justify-between">
                <span className="text-[11px] text-white/60">Estimated total cost</span>
                <span className="text-xs font-bold text-acid">≈ ₹{(parseFloat(form.qty) * parseFloat(form.price_per_unit)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
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
