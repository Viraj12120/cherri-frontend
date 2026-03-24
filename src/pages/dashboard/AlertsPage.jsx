import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, CheckCircle, Clock, TrendingDown, Package, X, Check } from 'lucide-react';
import api from '../../lib/axios';
import { useUiStore } from '../../stores/uiStore';
import Skeleton from '../../components/ui/Skeleton';

const severityConfig = {
  critical: { color: 'text-danger', bg: 'bg-danger/10 border-danger/20', dot: 'bg-danger', icon: AlertTriangle },
  warning: { color: 'text-warn', bg: 'bg-warn/10 border-warn/20', dot: 'bg-warn', icon: TrendingDown },
  info: { color: 'text-acid', bg: 'bg-acid/10 border-acid/20', dot: 'bg-acid', icon: Bell },
};

const AlertsPage = () => {
  const addToast = useUiStore((s) => s.addToast);
  
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/alerts');
      const items = Array.isArray(data) ? data : (data.items || data.data || []);
      setAlerts(items);
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to load system alerts.' });
    } finally {
      setIsLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await api.put(`/alerts/${id}/read`);
      setAlerts(alerts.map(a => a.id === id ? { ...a, is_read: true } : a));
    } catch (err) {
      addToast({ type: 'error', message: 'Could not mark alert as read.' });
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/alerts/read-all');
      setAlerts(alerts.map(a => ({ ...a, is_read: true })));
      addToast({ type: 'success', message: 'All alerts marked as read.' });
    } catch (err) {
      addToast({ type: 'error', message: 'Could not mark all alerts as read.' });
    }
  };

  const dismiss = async (id) => {
    try {
      await api.delete(`/alerts/${id}`);
      setAlerts(alerts.filter(a => a.id !== id));
    } catch (err) {
      addToast({ type: 'error', message: 'Could not dismiss alert.' });
    }
  };

  const unreadCount = alerts.filter(a => !a.is_read).length;

  const filtered = filter === 'All' 
    ? alerts 
    : filter === 'Unread' 
      ? alerts.filter(a => !a.is_read) 
      : alerts.filter(a => (a.severity || 'info').toLowerCase() === filter.toLowerCase());

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
          <button 
            onClick={markAllRead} 
            disabled={unreadCount === 0 || isLoading}
            className="bg-white/5 border border-white/10 text-xs font-bold px-4 py-2 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle size={14} /> Mark All Read
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Alerts', val: alerts.length, icon: Bell, color: 'text-white/60' },
          { label: 'Critical', val: alerts.filter(a => (a.severity || '').toLowerCase() === 'critical').length, icon: AlertTriangle, color: 'text-danger' },
          { label: 'Warnings', val: alerts.filter(a => (a.severity || '').toLowerCase() === 'warning').length, icon: Clock, color: 'text-warn' },
          { label: 'Unread', val: unreadCount, icon: Package, color: 'text-acid' },
        ].map((s, i) => (
          <div key={i} className="bg-[#161618] border border-white/5 p-4 rounded-xl flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-white/5 ${s.color}`}><s.icon size={18} /></div>
            <div>
              <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{s.label}</p>
              <div className="text-xl font-bold text-white">
                {isLoading ? <Skeleton w="24px" h="28px" /> : s.val}
              </div>
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
        {isLoading ? (
           Array.from({ length: 4 }).map((_, i) => (
             <Skeleton key={i} h="80px" className="w-full rounded-xl" />
           ))
        ) : filtered.length > 0 ? (
          filtered.map(alert => {
            const severity = (alert.severity || 'info').toLowerCase();
            const cfg = severityConfig[severity] || severityConfig.info;
            const Icon = cfg.icon;
            const alertId = alert.id;
            const isRead = alert.is_read || alert.read || false;

            return (
              <div key={alertId} className={`border rounded-xl p-4 flex items-start gap-4 transition-all ${isRead ? 'bg-[#1a1a1c] border-white/5 opacity-70' : `${cfg.bg}`}`}>
                <div className={`mt-0.5 p-2 rounded-lg bg-white/5 ${cfg.color} shrink-0`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {!isRead && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />}
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.color}`}>{alert.alert_type ? alert.alert_type.replace(/_/g, ' ') : 'SYSTEM MESSAGE'}</span>
                    {alert.medicine_name && <span className="text-[10px] text-white/30">· {alert.medicine_name}</span>}
                    <span className="text-[10px] text-white/20 ml-auto">
                      {alert.created_at ? new Date(alert.created_at).toLocaleString() : 'Just now'}
                    </span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">{alert.message}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0 z-10">
                  {!isRead && (
                    <button onClick={() => markRead(alertId)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-colors" title="Mark read">
                      <Check size={14} />
                    </button>
                  )}
                  <button onClick={() => dismiss(alertId)} className="p-1.5 rounded-lg hover:bg-danger/10 text-white/20 hover:text-danger transition-colors" title="Dismiss">
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 text-white/20 text-sm flex flex-col items-center gap-3">
            <CheckCircle size={32} className="text-emerald-500/40" />
            <p>All clear — no alerts in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
