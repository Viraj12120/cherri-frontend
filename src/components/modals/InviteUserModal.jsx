import React, { useState } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';
import api from '../../lib/axios';
import { useUiStore } from '../../stores/uiStore';

const InviteUserModal = ({ isOpen, onClose, onSuccess }) => {
  const addToast = useUiStore((s) => s.addToast);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/users/', form);
      addToast({ type: 'success', message: `Invited ${form.email} successfully` });
      setForm({ email: '', password: '', first_name: '', last_name: '' });
      onSuccess?.();
    } catch (err) {
      const detail = err.response?.data?.detail;
      addToast({ type: 'error', message: typeof detail === 'string' ? detail : 'Failed to invite user.' });
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
            <UserPlus size={16} className="text-acid" /> Invite Team Member
          </h3>
          <button onClick={onClose} className="p-1 text-white/40 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">First Name</label>
              <input
                value={form.first_name} onChange={e => update('first_name', e.target.value)}
                className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Last Name</label>
              <input
                value={form.last_name} onChange={e => update('last_name', e.target.value)}
                className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Email *</label>
            <input
              required type="email" value={form.email} onChange={e => update('email', e.target.value)}
              className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors"
              placeholder="john@company.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Password *</label>
            <input
              required type="password" minLength={6} value={form.password} onChange={e => update('password', e.target.value)}
              className="w-full bg-void border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-acid/50 transition-colors"
              placeholder="Min 6 characters"
            />
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-white/5">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-bold text-white/40 hover:bg-white/5 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="px-4 py-2 bg-acid text-void rounded-lg text-xs font-bold hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50">
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
              {isSubmitting ? 'Inviting...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUserModal;
