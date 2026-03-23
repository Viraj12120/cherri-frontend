import React from 'react';
import { X, Package, CalendarDays, Clock, Tag, Building2, BarChart2, Truck, Edit, Info } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const StockDetailDrawer = ({ item, onClose, onReorder }) => {
  const stockPct = Math.min(100, (item.stock / item.min) * 100);
  const barColor = item.status === 'CRIT' ? 'bg-danger' : item.status === 'LOW' ? 'bg-warn' : 'bg-success';
  const maxConsumption = Math.max(...item.consumption);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[420px] z-50 bg-[#0d0d0f] border-l border-white/10 flex flex-col shadow-2xl overflow-hidden animate-[slideInRight_0.25s_ease-out]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.color}`}>{item.status}</span>
              <span className="text-[10px] text-white/30 font-mono">{item.sku}</span>
            </div>
            <h2 className="text-lg font-bold text-white">{item.name}</h2>
            <p className="text-[11px] text-white/40 mt-0.5">{item.cat} · {item.supplier}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors mt-1">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Description */}
          <p className="text-[11px] text-white/50 leading-relaxed">{item.description}</p>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Current Stock', val: `${item.stock} units`, icon: Package, danger: item.status === 'CRIT' },
              { label: 'Min Threshold', val: `${item.min} units`, icon: Info },
              { label: 'Days Remaining', val: `~${item.daysLeft} days`, icon: CalendarDays, danger: item.daysLeft < 7 },
              { label: 'Expiry Date', val: item.expiry, icon: Clock, danger: item.daysLeft < 30 },
              { label: 'Batch No.', val: item.batch, icon: Tag },
              { label: 'Supplier', val: item.supplier, icon: Building2 },
              { label: 'Unit Cost', val: `₹${item.unitCost.toFixed(2)}`, icon: BarChart2 },
              { label: 'Selling Price', val: `₹${item.sellingPrice.toFixed(2)}`, icon: BarChart2 },
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 flex items-center gap-2.5">
                <s.icon size={14} className={s.danger ? 'text-danger' : 'text-white/30'} />
                <div className="min-w-0">
                  <p className="text-[9px] text-white/25 uppercase font-bold tracking-widest truncate">{s.label}</p>
                  <p className={`text-xs font-bold mt-0.5 truncate ${s.danger ? 'text-danger' : 'text-white/80'}`}>{s.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stock Level Bar */}
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-2">
              <span className="font-bold uppercase tracking-widest">Stock Level</span>
              <span className={item.status === 'CRIT' ? 'text-danger font-bold' : item.status === 'LOW' ? 'text-warn font-bold' : 'text-success font-bold'}>
                {stockPct.toFixed(0)}% of minimum
              </span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${stockPct}%` }} />
            </div>
            <div className="flex justify-between text-[9px] text-white/20 mt-1.5">
              <span>0</span>
              <span>Min: {item.min}</span>
            </div>
          </div>

          {/* Consumption Chart (7-day) */}
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">7-Day Consumption</p>
            <div className="flex items-end gap-1.5 h-16">
              {item.consumption.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-sm bg-acid/20 hover:bg-acid/40 transition-all"
                    style={{ height: `${(val / maxConsumption) * 100}%` }}
                    title={`${val} units`}
                  />
                  <span className="text-[8px] text-white/20">{DAYS[i]}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-white/25 mt-2 text-center">
              Avg: {(item.consumption.reduce((a, b) => a + b, 0) / item.consumption.length).toFixed(1)} units/day
            </p>
          </div>

          {/* Financials */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Financials</p>
            <div className="space-y-2">
              {[
                { label: 'Stock Value (cost)', val: `₹${(item.stock * item.unitCost).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` },
                { label: 'Stock Value (MRP)', val: `₹${(item.stock * item.sellingPrice).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` },
                { label: 'Margin per unit', val: `₹${(item.sellingPrice - item.unitCost).toFixed(2)} (${(((item.sellingPrice - item.unitCost) / item.unitCost) * 100).toFixed(0)}%)` },
              ].map((f, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[11px] text-white/40">{f.label}</span>
                  <span className="text-[11px] font-bold text-white/80">{f.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/5 flex gap-2 shrink-0">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-white/10 text-xs font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all">
            Close
          </button>
          {item.status !== 'OK' && (
            <button
              onClick={() => { onClose(); onReorder(item); }}
              className="flex-1 h-9 bg-acid text-void rounded-lg text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <Truck size={13} /> Reorder {item.suggestedQty.toLocaleString()} units
            </button>
          )}
          {item.status === 'OK' && (
            <button className="flex-1 h-9 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2">
              <Edit size={13} /> Edit Stock
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default StockDetailDrawer;
