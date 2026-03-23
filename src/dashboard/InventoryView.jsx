import React, { useState } from 'react';
import { Package, Search, Filter, AlertCircle, Clock, TrendingDown, Plus, Download, Eye, Edit, Trash2 } from 'lucide-react';

const InventoryView = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const items = [
    { name: 'Metformin 500mg', sku: 'MET-500', category: 'Diabetes', qty: 12, min: 200, batch: 'B-2024-01', expiry: '2025-03-15', cost: '₹2.50', status: 'CRITICAL' },
    { name: 'Insulin Glargine', sku: 'INS-GLR', category: 'Diabetes', qty: 45, min: 100, batch: 'B-2024-02', expiry: '2025-06-30', cost: '₹18.00', status: 'LOW' },
    { name: 'Amoxicillin 500mg', sku: 'AMX-500', category: 'Antibiotic', qty: 320, min: 50, batch: 'B-2024-03', expiry: '2026-01-20', cost: '₹3.20', status: 'OK' },
    { name: 'Atorvastatin 10mg', sku: 'ATV-010', category: 'Cholesterol', qty: 89, min: 100, batch: 'B-2024-04', expiry: '2025-03-28', cost: '₹4.10', status: 'LOW' },
    { name: 'Metoprolol 50mg', sku: 'MTP-050', category: 'Hypertension', qty: 156, min: 50, batch: 'B-2024-05', expiry: '2026-05-10', cost: '₹1.80', status: 'OK' },
    { name: 'Pantoprazole 40mg', sku: 'PAN-040', category: 'Gastro', qty: 430, min: 80, batch: 'B-2024-06', expiry: '2026-08-15', cost: '₹2.90', status: 'OK' },
    { name: 'Cetirizine 10mg', sku: 'CET-010', category: 'Allergy', qty: 8, min: 120, batch: 'B-2024-07', expiry: '2025-12-01', cost: '₹1.20', status: 'CRITICAL' },
    { name: 'Amlodipine 5mg', sku: 'AML-005', category: 'Hypertension', qty: 190, min: 60, batch: 'B-2024-08', expiry: '2026-09-20', cost: '₹2.10', status: 'OK' },
  ];

  const statusColors = {
    CRITICAL: 'text-danger bg-danger/10 border-danger/30',
    LOW: 'text-warn bg-warn/10 border-warn/30',
    OK: 'text-success bg-success/10 border-success/30',
  };

  const filtered = items.filter(i => {
    const matchFilter = filter === 'All' || i.status === filter;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Inventory</h1>
          <p className="text-white/40 text-sm">All medications, batch numbers, expiry dates and stock levels.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/5 border border-white/10 text-xs font-bold px-4 py-2 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2">
            <Download size={14} /> Export CSV
          </button>
          <button className="bg-acid text-void text-xs font-bold px-4 py-2 rounded-lg hover:brightness-110 transition-all flex items-center gap-2">
            <Plus size={14} /> Add Item
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total SKUs', val: '847', icon: Package, color: 'text-acid' },
          { label: 'Critical', val: '2', icon: AlertCircle, color: 'text-danger' },
          { label: 'Low Stock', val: '2', icon: TrendingDown, color: 'text-warn' },
          { label: 'Expiring Soon', val: '3', icon: Clock, color: 'text-coral' },
        ].map((s, i) => (
          <div key={i} className="bg-navy border border-white/5 p-4 rounded-xl flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-white/5 ${s.color}`}><s.icon size={18} /></div>
            <div>
              <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{s.label}</p>
              <p className="text-xl font-bold text-white">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-navy border border-white/5 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            {['All', 'CRITICAL', 'LOW', 'OK'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                  filter === f
                    ? f === 'CRITICAL' ? 'bg-danger/20 text-danger border border-danger/30'
                    : f === 'LOW' ? 'bg-warn/20 text-warn border border-warn/30'
                    : f === 'OK' ? 'bg-success/20 text-success border border-success/30'
                    : 'bg-acid/20 text-acid border border-acid/30'
                    : 'bg-white/5 text-white/40 hover:text-white border border-transparent'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search SKU or name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-acid/30 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-white/30 uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Medicine</th>
                <th className="px-6 py-4 font-medium">SKU</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Qty</th>
                <th className="px-6 py-4 font-medium">Min</th>
                <th className="px-6 py-4 font-medium">Batch</th>
                <th className="px-6 py-4 font-medium">Expiry</th>
                <th className="px-6 py-4 font-medium">Cost/Unit</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                  <td className="px-6 py-4 font-bold text-white/90">{row.name}</td>
                  <td className="px-6 py-4 font-mono text-white/40 text-[11px]">{row.sku}</td>
                  <td className="px-6 py-4 text-white/40">{row.category}</td>
                  <td className="px-6 py-4 text-white/80 font-bold">{row.qty}</td>
                  <td className="px-6 py-4 text-white/30">{row.min}</td>
                  <td className="px-6 py-4 font-mono text-white/40 text-[10px]">{row.batch}</td>
                  <td className={`px-6 py-4 text-[11px] font-bold ${new Date(row.expiry) < new Date(Date.now() + 30 * 86400000) ? 'text-coral' : 'text-white/40'}`}>{row.expiry}</td>
                  <td className="px-6 py-4 text-white/60">{row.cost}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusColors[row.status]}`}>{row.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"><Eye size={13} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-acid transition-colors"><Edit size={13} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-danger/10 text-white/40 hover:text-danger transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-white/20 text-sm">No items match your filter.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryView;
