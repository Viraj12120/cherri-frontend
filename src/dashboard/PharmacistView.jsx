import React, { useState } from 'react';
import { Package, AlertCircle, Clock, CheckCircle, TrendingUp, Check, X, Edit, ArrowRight, Cpu, Download, Plus, Search } from 'lucide-react';

// Extracted Components
import StockDetailDrawer from './components/StockDetailDrawer';
import CriticalModal from './modals/CriticalModal';
import ExportModal from './modals/ExportModal';
import ManualOrderModal from './modals/ManualOrderModal';
import ReorderModal from './modals/ReorderModal';
import EditSuggestionModal from './modals/EditSuggestionModal';

// Mock Data
import { STOCK_TABLE } from './data/mockData';

const PharmacistView = () => {
  const [showCritical, setShowCritical] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showManualOrder, setShowManualOrder] = useState(false);
  const [reorderItem, setReorderItem] = useState(null);
  const [showEditSuggestion, setShowEditSuggestion] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const [suggestion, setSuggestion] = useState({ status: 'pending' }); // pending | approved | rejected
  const [suggestionToast, setSuggestionToast] = useState('');

  const approveSuggestion = (qty = 2400, supplier = 'MediSource India') => {
    setSuggestion({ status: 'approved', qty, supplier });
    setSuggestionToast(`✓ Order for ${qty.toLocaleString()} units approved and queued.`);
    setTimeout(() => setSuggestionToast(''), 4000);
  };

  const rejectSuggestion = () => {
    setSuggestion({ status: 'rejected' });
    setSuggestionToast('✕ Suggestion dismissed.');
    setTimeout(() => setSuggestionToast(''), 3000);
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20 relative">
      {/* Modals */}
      {showCritical && <CriticalModal onClose={() => setShowCritical(false)} />}
      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
      {showManualOrder && <ManualOrderModal onClose={() => setShowManualOrder(false)} />}
      {reorderItem && <ReorderModal item={reorderItem} onClose={() => setReorderItem(null)} />}
      {showEditSuggestion && <EditSuggestionModal onClose={() => setShowEditSuggestion(false)} onApprove={approveSuggestion} />}
      {selectedStock && (
        <StockDetailDrawer
          item={selectedStock}
          onClose={() => setSelectedStock(null)}
          onReorder={(item) => { setSelectedStock(null); setReorderItem(item); }}
        />
      )}

      {/* Toast */}
      {suggestionToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-void border border-white/10 px-5 py-3 rounded-xl text-xs font-bold text-white shadow-2xl flex items-center gap-2">
          {suggestionToast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Good morning, Priya.</h1>
          <p className="text-white/40 text-sm">Here's a live overview of your store's inventory health.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowExport(true)} className="bg-white/5 border border-white/10 text-xs font-bold px-4 py-2 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2">
            <Download size={14} /> Export Report
          </button>
          <button onClick={() => setShowManualOrder(true)} className="bg-acid text-void text-xs font-bold px-4 py-2 rounded-lg hover:brightness-110 transition-all flex items-center gap-2">
            <Plus size={14} /> Manual Order
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-gradient-to-r from-danger/20 to-transparent border-l-4 border-danger p-4 rounded-r-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-danger" size={20} />
          <span className="text-sm font-bold">3 CRITICAL ITEMS REQUIRE ACTION</span>
          <span className="h-4 w-px bg-white/10"></span>
          <span className="text-xs text-white/60">Metformin, Insulin Glargine, Cetirizine</span>
        </div>
        <button onClick={() => setShowCritical(true)} className="text-xs font-bold text-danger hover:underline">View All →</button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'TOTAL STOCK', val: '847 SKUs', sub: '▲ 12 added today', icon: Package, color: 'text-acid' },
          { label: 'CRITICAL', val: '3', sub: 'Immediate action needed', icon: AlertCircle, color: 'text-danger' },
          { label: 'LOW STOCK', val: '2', sub: 'Order soon', icon: TrendingUp, color: 'text-warn' },
          { label: 'EXPIRING', val: '7', sub: 'Within 30 days', icon: Clock, color: 'text-coral' }
        ].map((stat, i) => (
          <div key={i} className="bg-navy border border-white/5 p-6 rounded-xl hover:border-white/15 transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-all ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{stat.label}</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.val}</h3>
            <p className="text-xs text-white/40">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Stock Table */}
        <div className="bg-navy border border-white/5 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h4 className="font-bold text-sm uppercase tracking-wider text-white/60">Stock Health Table</h4>
            <div className="flex items-center gap-2 text-white/30">
              <Search size={13} />
              <span className="text-[11px]">5 items</span>
            </div>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="text-white/30 uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Drug Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Min</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {STOCK_TABLE.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => setSelectedStock(row)}
                  className="hover:bg-white/[0.04] transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4 font-bold text-white/90">{row.name}</td>
                  <td className="px-6 py-4 text-white/40">{row.cat}</td>
                  <td className={`px-6 py-4 font-bold ${row.status === 'CRIT' ? 'text-danger' : row.status === 'LOW' ? 'text-warn' : 'text-white/80'}`}>{row.stock}</td>
                  <td className="px-6 py-4 text-white/40">{row.min}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${row.color}`}>{row.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {row.status !== 'OK' ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); setReorderItem(row); }}
                        className="bg-acid/10 hover:bg-acid text-acid hover:!text-black px-3 py-1 rounded font-bold transition-all"
                      >
                        Reorder
                      </button>
                    ) : (
                      <span className="text-white/20 text-[10px]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* AI Suggestion Card */}
          {suggestion.status === 'pending' && (
            <div className="bg-navy border-2 border-acid/20 rounded-xl p-6 relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-acid/5 rounded-full blur-2xl group-hover:bg-acid/10 transition-all"></div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-5 h-5 rounded-full bg-acid flex items-center justify-center text-void">
                  <Cpu size={12} strokeWidth={3} />
                </div>
                <span className="text-xs font-bold font-mono text-acid tracking-wide uppercase">Cherri's Suggestion</span>
                <span className="ml-auto text-[10px] text-white/30">2 min ago</span>
              </div>
              <h5 className="text-white font-bold text-sm mb-2">Reorder Metformin 500mg</h5>
              <p className="text-[11px] text-white/60 leading-relaxed mb-6">
                Recommended: <span className="text-white font-bold">2,400 units</span>. Current stock covers 3 days. Demand spike (+34%) expected next week.
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Confidence</span>
                  <span className="text-xs font-bold text-acid">87%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-acid w-[87%] rounded-full shadow-[0_0_10px_rgba(232,245,50,0.5)]"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => approveSuggestion()} className="flex-1 bg-acid text-void h-8 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:brightness-110 active:scale-95 transition-all">
                  <Check size={14} /> Approve
                </button>
                <button onClick={() => setShowEditSuggestion(true)} className="w-16 h-8 border border-white/10 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-all" title="Edit suggestion">
                  <Edit size={14} />
                </button>
                <button onClick={rejectSuggestion} className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-danger transition-all" title="Reject">
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {suggestion.status === 'approved' && (
            <div className="bg-success/5 border-2 border-success/20 rounded-xl p-6 flex flex-col items-center gap-3 text-center">
              <CheckCircle size={28} className="text-success" />
              <p className="font-bold text-sm text-white">Order Approved</p>
              <p className="text-[11px] text-white/40">{suggestion.qty?.toLocaleString()} units of Metformin 500mg from {suggestion.supplier}. PO queued for processing.</p>
              <button onClick={() => setSuggestion({ status: 'pending' })} className="text-[11px] font-bold text-white/30 hover:text-white mt-2">View next suggestion →</button>
            </div>
          )}

          {suggestion.status === 'rejected' && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center gap-3 text-center">
              <X size={24} className="text-white/30" />
              <p className="text-xs text-white/40">Suggestion dismissed.</p>
              <button onClick={() => setSuggestion({ status: 'pending' })} className="text-[11px] font-bold text-acid hover:underline">Restore suggestion</button>
            </div>
          )}

          {/* Expiry Alerts */}
          <div className="bg-navy border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h5 className="text-xs font-bold text-white/40 uppercase tracking-widest">Expiry Alerts</h5>
              <Clock size={16} className="text-coral" />
            </div>
            <div className="space-y-6">
              {[
                { name: 'Atorvastatin 10mg', exp: '15 Mar 2025', units: 67, risk: 'high' },
                { name: 'Metoprolol 50mg', exp: '28 Mar 2025', units: 120, risk: 'med' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-2 relative pl-4 border-l border-white/10 hover:border-acid/30 transition-all cursor-pointer">
                  <div className="text-[11px] font-bold text-white/90">{item.name}</div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-white/40">Exp: {item.exp}</span>
                    <span className="text-white/40 font-mono">{item.units} units</span>
                  </div>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map(dot => (
                      <div key={dot} className={`w-1.5 h-1.5 rounded-full ${dot <= (item.risk === 'high' ? 4 : 2) ? 'bg-acid' : 'bg-white/5'}`}></div>
                    ))}
                  </div>
                </div>
              ))}
              <button className="w-full h-9 border border-white/10 rounded-lg text-[11px] font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 group">
                Redistribute <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacistView;
