import React, { useState, useEffect } from 'react';
import { Building2, Search, Plus, Edit3, Trash2, Phone, Mail, MapPin, Star, AlertCircle } from 'lucide-react';
import api from '../../lib/axios';
import { useUiStore } from '../../stores/uiStore';
import Skeleton from '../../components/ui/Skeleton';
import SupplierModal from '../../components/modals/SupplierModal';

const SuppliersPage = () => {
  const addToast = useUiStore((s) => s.addToast);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/suppliers/?limit=100');
      setSuppliers(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to load suppliers.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (deletingId) return;
    setDeletingId(id);
    try {
      await api.delete(`/suppliers/${id}`);
      addToast({ type: 'success', message: 'Supplier deleted.' });
      setSuppliers(suppliers.filter(s => s.id !== id));
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.detail || 'Failed to delete supplier.' });
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const filtered = suppliers.filter(s =>
    `${s.name} ${s.contact_person || ''} ${s.email || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Building2 className="text-acid" size={24} />
            <h1 className="text-2xl font-bold text-white tracking-tight">Suppliers</h1>
          </div>
          <p className="text-white/40 text-sm">Manage your supplier network, contacts, and reliability metrics.</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-acid text-void text-xs font-bold px-4 py-2 rounded-lg hover:brightness-110 transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={14} /> Add Supplier
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Suppliers', val: isLoading ? <Skeleton w="40px" h="28px" /> : suppliers.length, color: 'text-acid' },
          { label: 'Active', val: isLoading ? <Skeleton w="40px" h="28px" /> : suppliers.filter(s => !s.blacklisted).length, color: 'text-success' },
          { label: 'Blacklisted', val: isLoading ? <Skeleton w="40px" h="28px" /> : suppliers.filter(s => s.blacklisted).length, color: 'text-danger' },
          { label: 'Avg. Reliability', val: isLoading ? <Skeleton w="40px" h="28px" /> : (() => {
            const withOrders = suppliers.filter(s => s.total_orders_placed > 0);
            if (withOrders.length === 0) return '—';
            const avg = withOrders.reduce((sum, s) => sum + ((s.total_orders_ontime || 0) / (s.total_orders_placed || 1)) * 100, 0) / withOrders.length;
            return `${avg.toFixed(0)}%`;
          })(), color: 'text-warn' },
        ].map((s, i) => (
          <div key={i} className="bg-[#161618] border border-white/5 p-4 rounded-xl flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-white/5 ${s.color}`}><Building2 size={18} /></div>
            <div>
              <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{s.label}</p>
              <div className="text-xl font-bold text-white mt-1">{s.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#161618] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <h4 className="font-bold text-sm uppercase tracking-wider text-white/60">Supplier Directory</h4>
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text" placeholder="Search suppliers..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-acid/30 transition-all text-white placeholder-white/30"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[800px]">
            <thead className="text-white/30 uppercase tracking-wider border-b border-white/5 bg-[#1a1a1c]">
              <tr>
                <th className="px-6 py-4 font-medium">Supplier</th>
                <th className="px-6 py-4 font-medium border-l border-white/5">Contact</th>
                <th className="px-6 py-4 font-medium border-l border-white/5">Email / Phone</th>
                <th className="px-6 py-4 font-medium border-l border-white/5 text-right">Min. Order</th>
                <th className="px-6 py-4 font-medium border-l border-white/5">Reliability</th>
                <th className="px-6 py-4 font-medium border-l border-white/5">Status</th>
                <th className="px-6 py-4 font-medium border-l border-white/5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-6 py-4"><Skeleton h="40px" className="w-full" /></td></tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((s) => {
                  const reliability = s.total_orders_placed > 0
                    ? ((s.total_orders_ontime || 0) / s.total_orders_placed * 100).toFixed(0)
                    : null;
                  return (
                    <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-acid/10 flex items-center justify-center text-acid font-bold text-xs border border-acid/20">
                            {s.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="font-bold text-white/90 text-sm">{s.name}</p>
                            {s.address && <p className="text-[10px] text-white/30 flex items-center gap-1 mt-0.5"><MapPin size={8} />{s.address}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-white/60 border-l border-white/5">{s.contact_person || '—'}</td>
                      <td className="px-6 py-3 border-l border-white/5">
                        <div className="space-y-1">
                          {s.email && <p className="text-[10px] text-white/40 flex items-center gap-1"><Mail size={9} />{s.email}</p>}
                          {s.phone_number && <p className="text-[10px] text-white/40 flex items-center gap-1"><Phone size={9} />{s.phone_number}</p>}
                          {!s.email && !s.phone_number && <span className="text-white/20">—</span>}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-white/70 border-l border-white/5 text-right font-bold">
                        ₹{(s.minimum_order_value || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 border-l border-white/5">
                        {reliability !== null ? (
                          <div className="flex items-center gap-1.5">
                            <Star size={12} className={Number(reliability) >= 80 ? 'text-success' : Number(reliability) >= 50 ? 'text-warn' : 'text-danger'} />
                            <span className="text-xs font-bold text-white/70">{reliability}%</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-white/20">No data</span>
                        )}
                      </td>
                      <td className="px-6 py-3 border-l border-white/5">
                        {s.blacklisted ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-danger/10 text-danger border border-danger/20">Blacklisted</span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-success/10 text-success border border-success/20">Active</span>
                        )}
                      </td>
                      <td className="px-6 py-3 border-l border-white/5">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-acid transition-colors"><Edit3 size={13} /></button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            disabled={deletingId === s.id}
                            className="p-1.5 rounded-lg hover:bg-danger/10 text-white/40 hover:text-danger transition-colors disabled:opacity-30"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-white/30">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Building2 size={32} className="opacity-20" />
                      <p>No suppliers found.</p>
                      <button onClick={openCreate} className="text-acid hover:underline mt-2">Add your first supplier</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingSupplier(null); }}
        onSuccess={() => { setIsModalOpen(false); setEditingSupplier(null); fetchSuppliers(); }}
        supplier={editingSupplier}
      />
    </div>
  );
};

export default SuppliersPage;
