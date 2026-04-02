import React, { useState, useEffect } from 'react';
import { X, Plus, Edit3, Building2, Loader2 } from 'lucide-react';
import api from '../../lib/axios';
import { useUiStore } from '../../stores/uiStore';

const SupplierModal = ({ isOpen, onClose, onSuccess, supplier = null }) => {
  const addToast = useUiStore((s) => s.addToast);
  const isEdit = !!supplier;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone_number: '',
    address: '',
    minimum_order_value: 0,
  });

  useEffect(() => {
    if (supplier) {
      setForm({
        name: supplier.name || '',
        contact_person: supplier.contact_person || '',
        email: supplier.email || '',
        phone_number: supplier.phone_number || '',
        address: supplier.address || '',
        minimum_order_value: supplier.minimum_order_value || 0,
      });
    } else {
      setForm({ name: '', contact_person: '', email: '', phone_number: '', address: '', minimum_order_value: 0 });
    }
  }, [supplier, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await api.put(`/suppliers/${supplier.id}`, {
          name: form.name,
          contact_person: form.contact_person || undefined,
          email: form.email || undefined,
          phone_number: form.phone_number || undefined,
          address: form.address || undefined,
        });
        addToast({ type: 'success', message: 'Supplier updated successfully' });
      } else {
        await api.post('/suppliers/', {
          ...form,
          minimum_order_value: Number(form.minimum_order_value),
        });
        addToast({ type: 'success', message: 'Supplier created successfully' });
      }
      onSuccess?.();
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.detail || `Failed to ${isEdit ? 'update' : 'create'} supplier.` });
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
            <Building2 size={16} className="text-acid" /> {isEdit ? 'Edit Supplier' : 'Add Supplier'}
          </h3>
          <button onClick={onClose} className="p-1 text-white/40 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Supplier Name *</label>
            <input
              required value={form.name} onChange={e => update('name', e.target.value)}
              className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors"
              placeholder="e.g. MediSource India"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Contact Person</label>
            <input
              value={form.contact_person} onChange={e => update('contact_person', e.target.value)}
              className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors"
              placeholder="John Doe"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Email</label>
              <input
                type="email" value={form.email} onChange={e => update('email', e.target.value)}
                className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors"
                placeholder="supplier@email.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Phone</label>
              <input
                value={form.phone_number} onChange={e => update('phone_number', e.target.value)}
                className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Address</label>
            <textarea
              value={form.address} onChange={e => update('address', e.target.value)} rows={2}
              className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors resize-none"
              placeholder="Full address..."
            />
          </div>
          {!isEdit && (
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Min. Order Value (₹)</label>
              <input
                type="number" min="0" step="0.01" value={form.minimum_order_value}
                onChange={e => update('minimum_order_value', e.target.value)}
                className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors"
              />
            </div>
          )}
          <div className="pt-4 flex justify-end gap-2 border-t border-white/5">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-bold text-white/40 hover:bg-white/5 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="px-4 py-2 bg-acid text-void rounded-lg text-xs font-bold hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50">
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : isEdit ? <Edit3 size={14} /> : <Plus size={14} />}
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Supplier' : 'Create Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierModal;
