import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, CheckCircle, Clock, TrendingDown, Package, X, Check, MoreHorizontal } from 'lucide-react';
import api from '../lib/axios';
import { useUiStore } from '../stores/uiStore';

const severityConfig = {
  critical: { color: 'text-danger', bg: 'bg-danger/10 border-danger/20', dot: 'bg-danger', icon: AlertTriangle },
  warning: { color: 'text-warn', bg: 'bg-warn/10 border-warn/20', dot: 'bg-warn', icon: TrendingDown },
  info: { color: 'text-acid', bg: 'bg-acid/10 border-acid/20', dot: 'bg-acid', icon: Bell },
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs} hr${diffHrs > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

const AlertsView = () => {
  const [filter, setFilter] = useState('All');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const setUnreadAlertsCount = useUiStore((s) => s.setUnreadAlertsCount);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/alerts/?limit=100');
      setItems(res.data.filter(a => a.status !== 'ARCHIVED'));
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'All' 
    ? items 
    : filter === 'Unread' 
      ? items.filter(a => a.status === 'UNREAD') 
      : items.filter(a => a.severity === filter.toLowerCase());

  const markAllRead = async () => {
    try {
      await api.post('/alerts/mark-all-read');
      setItems(items.map(a => a.status === 'UNREAD' ? { ...a, status: 'READ' } : a));
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const markRead = async (id) => {
    try {
      await api.put(`/alerts/${id}`, { status: 'READ' });
      setItems(items.map(a => a.id === id ? { ...a, status: 'READ' } : a));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const dismiss = async (id) => {
    try {
      await api.put(`/alerts/${id}`, { status: 'ARCHIVED' });
      setItems(items.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to dismiss alert:', err);
    }
  };

  const unreadCount = items.filter(a => a.status === 'UNREAD').length;

  useEffect(() => {
    setUnreadAlertsCount(unreadCount);
  }, [unreadCount, setUnreadAlertsCount]);

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
        {loading ? (
          <div className="text-center py-16 text-white/40 text-sm">Loading alerts...</div>
        ) : filtered.length > 0 ? (
          filtered.map(alert => {
            const isUnread = alert.status === 'UNREAD';
            const cfg = severityConfig[alert.severity] || severityConfig.info;
            const Icon = cfg.icon;
            return (
              <div key={alert.id} className={`border rounded-xl p-4 flex items-start gap-4 transition-all ${!isUnread ? 'bg-navy border-white/5 opacity-70' : `${cfg.bg}`}`}>
                <div className={`mt-0.5 p-2 rounded-lg bg-white/5 ${cfg.color} shrink-0`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {isUnread && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />}
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.color}`}>{alert.type?.replace(/_/g, ' ')}</span>
                    {alert.medicine && <span className="text-[10px] text-white/30">· {alert.medicine}</span>}
                    <span className="text-[10px] text-white/20 ml-auto">{formatTime(alert.created_at)}</span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">{alert.message}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {isUnread && (
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
          })
        ) : (
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
