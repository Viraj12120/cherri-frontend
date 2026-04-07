import React, { useState, useEffect } from 'react';
import { Edit, Cpu, ChevronDown, Check, Loader2 } from 'lucide-react';
import { Modal, ModalHeader } from '../components/ModalBase';
import api from '../../lib/axios';

const EditSuggestionModal = ({ onClose, onApprove, medicine, medicineName, suggestedQty: initialQty, suppliers: propSuppliers, supplierName: initialSupplier }) => {
  const [qty, setQty] = useState(initialQty || 500);
  const [supplier, setSupplier] = useState(initialSupplier || '');
  const [notes, setNotes] = useState('');
  const [suppliers, setSuppliers] = useState(propSuppliers || []);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

  // Fetch suppliers if not passed as prop
  useEffect(() => {
    if (!propSuppliers || propSuppliers.length === 0) {
      setLoadingSuppliers(true);
      api.get('/suppliers/?limit=100')
        .then(res => {
          const items = Array.isArray(res.data) ? res.data : [];
          setSuppliers(items);
          if (!supplier && items.length > 0) setSupplier(items[0].name);
        })
        .catch(() => {})
        .finally(() => setLoadingSuppliers(false));
    }
  }, []);

  const displayName = medicineName || medicine?.medicine?.name || medicine?.name || 'Unknown Medicine';

  return (
    <Modal onClose={onClose} maxW="max-w-md">
      <ModalHeader icon={Edit} title="Edit AI Suggestion" subtitle="Modify before approving the reorder" onClose={onClose} accent="text-acid" />
      <div className="p-6 space-y-4">
        <div className="bg-acid/5 border border-acid/10 rounded-lg p-3 text-[11px] text-white/50 flex items-start gap-2">
          <Cpu size={13} className="text-acid mt-0.5 shrink-0" />
          <span>AI suggested <b className="text-white">{(initialQty || 0).toLocaleString()} units</b> of {displayName}. Adjust quantity and supplier as needed.</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Quantity</label>
          <input type="number" min="1" value={qty} onChange={e => setQty(Number(e.target.value))}
            className="bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white font-bold focus:outline-none focus:border-acid/40 transition-all text-center" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Supplier</label>
          <div className="relative">
            {loadingSuppliers ? (
              <div className="flex items-center gap-2 text-xs text-white/30 py-2">
                <Loader2 size={13} className="animate-spin" /> Loading suppliers...
              </div>
            ) : (
              <>
                <select value={supplier} onChange={e => setSupplier(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-acid/40 transition-all appearance-none">
                  {suppliers.map(s => <option key={s.id || s.name} value={s.name} className="bg-[#0f0f11]">{s.name}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Override reason</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
            placeholder="Why are you adjusting the AI suggestion?"
            className="bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-acid/40 transition-all resize-none" />
        </div>
      </div>
      <div className="px-6 py-4 border-t border-white/5 flex gap-2">
        <button onClick={onClose} className="flex-1 h-9 rounded-lg border border-white/10 text-xs font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
        <button onClick={() => { onApprove(qty, supplier); }}
          className="flex-1 h-9 rounded-lg bg-acid text-void text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1">
          <Check size={13} /> Approve Modified
        </button>
      </div>
    </Modal>
  );
};

export default EditSuggestionModal;
