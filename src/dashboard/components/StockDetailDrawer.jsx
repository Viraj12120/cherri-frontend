import React from 'react';
import { X, Package, CalendarDays, Clock, Tag, Building2, BarChart2, Truck, Edit, Info } from 'lucide-react';

const StockDetailDrawer = ({ item, onClose, onReorder }) => {
  // Map real API fields (with fallbacks for safety)
  const qty = item.quantity ?? 0;
  const threshold = item.medicine?.low_stock_threshold ?? 10;
  const medicineName = item.medicine?.name || 'Unknown';
  const sku = item.medicine?.sku || '-';
  const manufacturer = item.medicine?.manufacturer || '-';
  const supplierName = item.supplier?.name || '-';
  const batchNumber = item.batch_number || '-';
  const costPrice = parseFloat(item.cost_price) || 0;
  const sellingPrice = parseFloat(item.selling_price) || 0;
  const expiryDate = item.expiry_date
    ? new Date(item.expiry_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '-';

  // Compute status & days left
  const now = new Date();
  const expiry = item.expiry_date ? new Date(item.expiry_date) : null;
  const isExpired = expiry && expiry < now;
  const daysLeft = expiry ? Math.ceil((expiry - now) / (1000 * 60 * 60 * 24)) : 999;

  let statusLabel = 'OK';
  let statusColor = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
  if (isExpired && qty === 0) {
    statusLabel = 'EXPIRED + NO STOCK';
    statusColor = 'bg-danger/10 text-danger border-danger/20';
  } else if (isExpired) {
    statusLabel = 'EXPIRED';
    statusColor = 'bg-orange-500/10 text-orange-400 border-orange-500/20';
  } else if (qty === 0) {
    statusLabel = 'NO STOCK';
    statusColor = 'bg-danger/10 text-danger border-danger/20';
  } else if (qty <= threshold) {
    statusLabel = 'LOW';
    statusColor = 'bg-warn/10 text-warn border-warn/20';
  }

  const stockPct = threshold > 0 ? Math.min(100, (qty / threshold) * 100) : (qty > 0 ? 100 : 0);
  const barColor = statusLabel.includes('NO STOCK') || statusLabel.includes('EXPIRED') ? 'bg-danger' : statusLabel === 'LOW' ? 'bg-warn' : 'bg-emerald-500';
  const needsReorder = statusLabel !== 'OK';

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
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusColor}`}>{statusLabel}</span>
              <span className="text-[10px] text-white/30 font-mono">{sku}</span>
            </div>
            <h2 className="text-lg font-bold text-white">{medicineName}</h2>
            <p className="text-[11px] text-white/40 mt-0.5">{manufacturer} · {supplierName}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors mt-1">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Current Stock', val: `${qty} units`, icon: Package, danger: qty === 0 },
              { label: 'Min Threshold', val: `${threshold} units`, icon: Info },
              { label: 'Days to Expiry', val: isExpired ? 'Expired' : `~${Math.max(0, daysLeft)} days`, icon: CalendarDays, danger: daysLeft < 7 },
              { label: 'Expiry Date', val: expiryDate, icon: Clock, danger: daysLeft < 30 },
              { label: 'Batch No.', val: batchNumber, icon: Tag },
              { label: 'Supplier', val: supplierName, icon: Building2 },
              { label: 'Unit Cost', val: `₹${costPrice.toFixed(2)}`, icon: BarChart2 },
              { label: 'Selling Price', val: `₹${sellingPrice.toFixed(2)}`, icon: BarChart2 },
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
              <span className={qty === 0 ? 'text-danger font-bold' : statusLabel === 'LOW' ? 'text-warn font-bold' : 'text-emerald-500 font-bold'}>
                {stockPct.toFixed(0)}% of minimum
              </span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${stockPct}%` }} />
            </div>
            <div className="flex justify-between text-[9px] text-white/20 mt-1.5">
              <span>0</span>
              <span>Min: {threshold}</span>
            </div>
          </div>

          {/* Financials */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Financials</p>
            <div className="space-y-2">
              {[
                { label: 'Stock Value (cost)', val: `₹${(qty * costPrice).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` },
                { label: 'Stock Value (MRP)', val: `₹${(qty * sellingPrice).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` },
                { label: 'Margin per unit', val: costPrice > 0 ? `₹${(sellingPrice - costPrice).toFixed(2)} (${(((sellingPrice - costPrice) / costPrice) * 100).toFixed(0)}%)` : '-' },
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
          {needsReorder ? (
            <button
              onClick={() => { onClose(); onReorder(item); }}
              className="flex-1 h-9 bg-acid text-void rounded-lg text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <Truck size={13} /> Reorder
            </button>
          ) : (
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
