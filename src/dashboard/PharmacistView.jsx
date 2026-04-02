import React, { useState } from 'react';
import {
  Plus, Search, Filter, ArrowUpRight, ArrowDownRight,
  MoreVertical, CheckCircle, AlertCircle, ShoppingCart,
  Trash2, Edit3, Download, RefreshCw, BarChart2, Cpu,
  ShieldAlert, ChevronRight, X, Cpu
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CRITICAL_ITEMS } from './data/mockData';

// Modals
import CriticalModal from './modals/CriticalModal';
import ReorderModal from './modals/ReorderModal';
import ExportModal from './modals/ExportModal';
import StockDetailDrawer from './components/StockDetailDrawer';
import { STOCK_TABLE } from './data/mockData';

const STOCKS = [
  { id: 1, name: 'Metformin 500mg', cat: 'Antidiabetic', stock: 12, min: 200, status: 'CRIT', color: 'border-danger/30 text-danger bg-danger/5' },
  { id: 2, name: 'Atorvastatin 10mg', cat: 'Statin', stock: 89, min: 150, status: 'LOW', color: 'border-warn/30 text-warn bg-warn/5' },
  { id: 3, name: 'Amoxicillin 500mg', cat: 'Antibiotic', stock: 1540, min: 400, status: 'OK', color: 'border-success/30 text-success bg-success/5' },
  { id: 4, name: 'Cetirizine 10mg', cat: 'Antihistamine', stock: 8, min: 120, status: 'CRIT', color: 'border-danger/30 text-danger bg-danger/5' },
  { id: 5, name: 'Paracetamol 650mg', cat: 'Analgesic', stock: 4200, min: 1000, status: 'OK', color: 'border-success/30 text-success bg-success/5' },
];

const PharmacistView = () => {
  const { t } = useTranslation();
  const [selectedStock, setSelectedStock] = useState(null);
  const [suggestion, setSuggestion] = useState({ status: 'pending' });

  // Modal states
  const [showCritical, setShowCritical] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showReorder, setShowReorder] = useState(null);

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Good morning, Priya.</h1>
          <p className="text-muted text-sm">Here's a live overview of your store's inventory health.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowExport(true)}
            className="bg-navy border border-dark text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-dark transition-all flex items-center gap-2 shadow-sm text-white"
          >
            <Download size={16} /> {t('common.export')}
          </button>
          <button className="bg-acid text-void text-xs font-bold px-5 py-2.5 rounded-lg hover:brightness-110 transition-all shadow-lg shadow-acid/20 active:scale-95">
            + {t('common.new_entry')}
          </button>
        </div>
      </div>

      {/* Critical Alert Banner - BELOW GREETINGS */}
      {CRITICAL_ITEMS.length > 0 && (
        <div
          onClick={() => setShowCritical(true)}
          className="bg-danger/10 border border-danger/20 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-danger/[0.15] transition-all anim-slide-up"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-danger/20 flex items-center justify-center text-danger shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">System Alert: {CRITICAL_ITEMS.length} items reached critical threshold</p>
              <p className="text-[11px] text-danger/80 font-medium">Immediate reordering recommended for {CRITICAL_ITEMS[0].name} and others.</p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-danger text-white rounded-lg text-xs font-bold shadow-lg shadow-danger/20 transition-all group-hover:scale-105 active:scale-95">
            Resolve Now <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Critical Items', val: CRITICAL_ITEMS.length.toString(), sub: 'Action required', color: 'text-danger' },
          { label: 'Low Stock Items', val: '48', sub: 'Monitoring', color: 'text-warn' },
          { label: 'Pending Orders', val: '₹84,200', sub: '8 active POs', color: 'text-acid' },
          { label: 'Est. Stockout', val: '4 days', sub: 'Metformin', color: 'text-danger' }
        ].map((stat, i) => (
          <div
            key={i}
            onClick={() => stat.label === 'Critical Items' && setShowCritical(true)}
            className={`bg-void border border-dark p-6 rounded-xl relative overflow-hidden group shadow-sm hover:border-acid/30 transition-all ${stat.label === 'Critical Items' ? 'cursor-pointer' : ''}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-navy rounded-lg border border-dark">
                <BarChart2 size={18} className="text-acid" />
              </div>
              <span className="text-[10px] font-mono text-muted/50 uppercase tracking-widest">{stat.label}</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.val}</h3>
            <p className="text-xs text-muted">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Table & Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* Inventory List */}
        <div className="bg-void border border-dark rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-dark flex items-center justify-between bg-navy/30">
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted font-black tracking-widest">Stock Monitor</h4>
            <div className="flex gap-2 text-muted">
              <Filter size={16} className="cursor-pointer hover:text-acid" />
              <Search size={16} className="cursor-pointer hover:text-acid" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark text-[11px] uppercase tracking-widest text-muted font-black">
                  <th className="px-6 py-4">Medicine</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Current Stock</th>
                  <th className="px-6 py-4">Threshold</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {STOCKS.map((row) => {
                  const fullItem = STOCK_TABLE.find(s => s.name === row.name);
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedStock(fullItem || row)}
                      className="hover:bg-navy transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4 font-bold text-white/90">{row.name}</td>
                      <td className="px-6 py-4 text-muted">{row.cat}</td>
                      <td className={`px-6 py-4 font-bold ${row.status === 'CRIT' ? 'text-danger' : row.status === 'LOW' ? 'text-warn' : 'text-white/80'}`}>{row.stock}</td>
                      <td className="px-6 py-4 text-muted">{row.min}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${row.color}`}>{row.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Suggestion Panel */}
        <div className="space-y-6">
          <div className="bg-void border border-dark rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-8 border-b border-dark pb-6">
              <div className="p-2 rounded-lg bg-navy shadow-inner">
                <Cpu size={18} className="text-acid" />
              </div>
              <h5 className="text-[11px] font-black text-muted uppercase tracking-widest">Cherri+ Intelligence</h5>
            </div>

            {suggestion.status === 'pending' ? (
              <div className="bg-navy border border-dark p-6 rounded-2xl relative overflow-hidden group shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold font-mono text-acid tracking-wide uppercase font-black tracking-widest leading-none">AI Suggestion</span>
                  <span className="ml-auto text-[10px] text-muted/60">2 min ago</span>
                </div>
                <h5 className="text-white font-bold text-sm mb-2">Reorder Metformin 500mg</h5>
                <p className="text-[11px] text-muted leading-relaxed mb-6">
                  Recommended: <span className="text-white font-bold">2,400 units</span>. Current stock covers 3 days. Demand spike (+34%) expected next week.
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Estimated Cost</span>
                    <span className="text-sm font-black text-white">₹14,280</span>
                  </div>
                  <div className="w-full h-1 bg-dark rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-acid" />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setSuggestion({ status: 'approved', qty: 2400, supplier: 'Sun Pharma' })}
                    className="flex-1 h-10 bg-acid text-void font-bold text-xs rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-acid/20 uppercase tracking-widest"
                  >
                    Quick Approve
                  </button>
                  <button className="h-10 px-4 bg-navy border border-dark text-white hover:bg-dark rounded-xl transition-all">
                    <Edit3 size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-success/5 border border-success/20 p-6 rounded-2xl flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-success/10 shadow-inner">
                  <CheckCircle size={32} className="text-success" />
                </div>
                <p className="font-bold text-sm text-white">Order Approved</p>
                <p className="text-[11px] text-muted font-bold leading-relaxed">{suggestion.qty?.toLocaleString()} units of Metformin 500mg from {suggestion.supplier}. PO queued for processing.</p>
                <button onClick={() => setSuggestion({ status: 'pending' })} className="text-[11px] font-bold text-acid hover:underline mt-2">View next suggestion →</button>
              </div>
            )}
          </div>

          <div className="bg-navy/30 border border-dark rounded-2xl p-6 group cursor-pointer hover:bg-navy/50 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-void flex items-center justify-center border border-dark shadow-sm">
                <Plus size={18} className="text-muted group-hover:text-acid transition-colors" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">New Reorder Logic</p>
                <p className="text-[10px] text-muted">Create a rule for this item.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCritical && <CriticalModal onClose={() => setShowCritical(false)} />}
      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
      {showReorder && (
        <ReorderModal
          item={showReorder}
          onClose={() => setShowReorder(null)}
        />
      )}
      {selectedStock && (
        <StockDetailDrawer
          item={selectedStock}
          onClose={() => setSelectedStock(null)}
          onReorder={(item) => setShowReorder(item)}
        />
      )}
    </div>
  );
};

export default PharmacistView;
