import React, { useState } from 'react';
import { AlertTriangle, Bell, CheckCircle, Clock, TrendingDown, Package, X, Check, MoreHorizontal } from 'lucide-react';

const alerts = [
  { id: 1, type: 'CRITICAL_STOCK', medicine: 'Metformin 500mg', message: 'Stock critically low: 12 units remaining, minimum threshold is 200.', time: '2 min ago', severity: 'critical', read: false },
  { id: 2, type: 'CRITICAL_STOCK', medicine: 'Cetirizine 10mg', message: 'Stock critically low: 8 units remaining, minimum threshold is 120.', time: '15 min ago', severity: 'critical', read: false },
  { id: 3, type: 'LOW_STOCK', medicine: 'Insulin Glargine', message: 'Stock below threshold: 45 units remaining, minimum is 100. Consider reordering.', time: '1 hr ago', severity: 'warning', read: false },
  { id: 4, type: 'EXPIRY_ALERT', medicine: 'Atorvastatin 10mg', message: 'Batch B-2024-04 expires on 2025-03-28. 89 units affected.', time: '3 hrs ago', severity: 'warning', read: true },
  { id: 5, type: 'ORDER_APPROVED', medicine: 'Metformin 500mg', message: 'AI Agent auto-approved PO-4822 for 1200 units from MediSource India.', time: '5 hrs ago', severity: 'info', read: true },
  { id: 6, type: 'EXPIRY_ALERT', medicine: 'Atorvastatin 10mg', message: 'Batch B-2023-11 expired on 2025-03-15. 12 units should be quarantined.', time: '1 day ago', severity: 'critical', read: true },
  { id: 7, type: 'LOW_STOCK', medicine: 'Atorvastatin 10mg', message: 'Stock dropped below minimum threshold. Current stock: 89, minimum: 100.', time: '1 day ago', severity: 'warning', read: true },
  { id: 8, type: 'SYSTEM', medicine: null, message: 'Inventory Monitor Agent completed scheduled scan. 7 alerts generated.', time: '2 days ago', severity: 'info', read: true },
];

const severityConfig = {
  critical: { color: 'text-danger', bg: 'bg-danger/10 border-danger/20', dot: 'bg-danger', icon: AlertTriangle },
  warning: { color: 'text-warn', bg: 'bg-warn/10 border-warn/20', dot: 'bg-warn', icon: TrendingDown },
  info: { color: 'text-acid', bg: 'bg-acid/10 border-acid/20', dot: 'bg-acid', icon: Bell },
};

const AlertsView = () => {
  const [filter, setFilter] = useState('All');
  const [items, setItems] = useState(alerts);

  const filtered = filter === 'All' ? items : filter === 'Unread' ? items.filter(a => !a.read) : items.filter(a => a.severity === filter.toLowerCase());

  const markAllRead = () => setItems(items.map(a => ({ ...a, read: true })));
  const markRead = (id) => setItems(items.map(a => a.id === id ? { ...a, read: true } : a));
  const dismiss = (id) => setItems(items.filter(a => a.id !== id));

  const unreadCount = items.filter(a => !a.read).length;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Alerts</h1>
          <p className="text-white/40 text-sm">
            System-generated alerts from the AI Inventory Monitor.{' '}
            {unreadCount > 0 && <span className="text-danger font-bold">{unreadCount} unread</span>}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={markAllRead} className="bg-white/5 border border-white/10 text-xs font-bold px-4 py-2 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2">
            <CheckCircle size={14} /> Mark All Read
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Alerts', val: items.length, icon: Bell, color: 'text-white/60' },
          { label: 'Critical', val: items.filter(a => a.severity === 'critical').length, icon: AlertTriangle, color: 'text-danger' },
          { label: 'Warnings', val: items.filter(a => a.severity === 'warning').length, icon: Clock, color: 'text-warn' },
          { label: 'Unread', val: unreadCount, icon: Package, color: 'text-acid' },
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

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-4">
        {['All', 'Unread', 'Critical', 'Warning', 'Info'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-[11px] font-bold px-4 py-1.5 rounded-lg transition-all ${filter === f ? 'bg-acid/20 text-acid border border-acid/30' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filtered.map(alert => {
          const cfg = severityConfig[alert.severity];
          const Icon = cfg.icon;
          return (
            <div key={alert.id} className={`border rounded-xl p-4 flex items-start gap-4 transition-all ${alert.read ? 'bg-navy border-white/5 opacity-70' : `${cfg.bg}`}`}>
              <div className={`mt-0.5 p-2 rounded-lg bg-white/5 ${cfg.color} shrink-0`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {!alert.read && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />}
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.color}`}>{alert.type.replace(/_/g, ' ')}</span>
                  {alert.medicine && <span className="text-[10px] text-white/30">· {alert.medicine}</span>}
                  <span className="text-[10px] text-white/20 ml-auto">{alert.time}</span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">{alert.message}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!alert.read && (
                  <button onClick={() => markRead(alert.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-success transition-colors" title="Mark read">
                    <Check size={14} />
                  </button>
                )}
                <button onClick={() => dismiss(alert.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-white/20 hover:text-danger transition-colors" title="Dismiss">
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/20 text-sm flex flex-col items-center gap-3">
            <CheckCircle size={32} className="text-success/40" />
            All clear — no alerts in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsView;
