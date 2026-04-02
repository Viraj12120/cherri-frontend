import React, { useState, useEffect } from 'react';
import { ClipboardList, Search, Filter, Download, User, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import api from '../../lib/axios';
import Skeleton from '../../components/ui/Skeleton';

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/audit-logs');
      setLogs(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
      // Demo mock data
      setLogs([
        { id: 1, event: 'USER_LOGIN', user: 'viraj@Cherri+.local', detail: 'Successful login from IP 192.168.1.1', severity: 'INFO', time: '5 min ago' },
        { id: 2, event: 'ORDER_APPROVED', user: 'john@pharma.com', detail: 'Approved PO-8421 for 500 units of Metformin', severity: 'SUCCESS', time: '1 hr ago' },
        { id: 3, event: 'STOCK_CRITICAL', user: 'System', detail: 'Atorvastatin dropped below 10 units', severity: 'WARNING', time: '3 hrs ago' },
        { id: 4, event: 'USER_INVITED', user: 'viraj@Cherri+.local', detail: 'Sent invitation to sarah@pharma.com', severity: 'INFO', time: 'Yesterday' },
        { id: 5, event: 'AUTH_FAILED', user: 'unknown', detail: '3 failed login attempts for admin@Cherri+.com', severity: 'ERROR', time: '2 days ago' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (sev) => {
    switch (sev) {
      case 'ERROR': return 'text-danger bg-danger/10 border-danger/20';
      case 'WARNING': return 'text-warn bg-warn/10 border-warn/20';
      case 'SUCCESS': return 'text-success bg-success/10 border-success/20';
      default: return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  const getEventIcon = (sev) => {
    switch (sev) {
      case 'ERROR': return <AlertTriangle size={14} />;
      case 'WARNING': return <Info size={14} />;
      case 'SUCCESS': return <CheckCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <ClipboardList className="text-acid" size={24} />
            <h1 className="text-2xl font-bold text-white tracking-tight">Audit Logs</h1>
          </div>
          <p className="text-white/40 text-sm">System-wide activity log for security, debugging, and compliance.</p>
        </div>

        <button className="bg-white/5 border border-white/10 text-white/60 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-white/10 transition-all">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-[#161618] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input
              type="text"
              placeholder="Search logs..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2 text-sm text-white focus:outline-none focus:border-acid/40 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-white/40 border border-white/5 hover:text-white transition-all flex items-center gap-2">
              <Filter size={14} /> Severity
            </button>
            <button className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-white/40 border border-white/5 hover:text-white transition-all">
              System
            </button>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-6"><Skeleton h="20px" className="w-full" /></div>
            ))
          ) : logs.length === 0 ? (
            <div className="p-20 text-center text-white/20">No audit records found.</div>
          ) : logs.map((log) => (
            <div key={log.id} className="p-6 flex items-start gap-4 hover:bg-white/[0.01] transition-colors group">
              <div className={`p-2 rounded-lg border shrink-0 ${getSeverityColor(log.severity)}`}>
                {getEventIcon(log.severity)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-bold text-acid uppercase tracking-widest">{log.event}</span>
                  <span className="w-1 h-1 rounded-full bg-white/10" />
                  <span className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                    <User size={12} className="text-white/20" /> {log.user}
                  </span>
                </div>
                <p className="text-sm text-white/50 leading-relaxed font-medium">{log.detail}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/20 font-mono uppercase tracking-tighter">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditLogPage;
