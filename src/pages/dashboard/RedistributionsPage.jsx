import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Check, X, Clock, Truck, Package, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../../lib/axios';
import { useUiStore } from '../../stores/uiStore';
import Skeleton from '../../components/ui/Skeleton';
import StatusBadge from '../../components/ui/StatusBadge';
import RedistributionModal from '../../components/modals/RedistributionModal';

const statusPipeline = ['PENDING', 'APPROVED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED'];

const reasonLabels = {
  expiry_risk: { label: 'Expiry Risk', color: 'text-danger bg-danger/10 border-danger/20' },
  overstock: { label: 'Overstock', color: 'text-warn bg-warn/10 border-warn/20' },
  emergency_transfer: { label: 'Emergency', color: 'text-coral bg-coral/10 border-coral/20' },
};

const RedistributionsPage = () => {
  const addToast = useUiStore((s) => s.addToast);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/redistributions/?limit=100');
      setRequests(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to load redistribution requests.' });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/redistributions/${id}`, { status: newStatus });
      addToast({ type: 'success', message: `Request ${newStatus}.` });
      fetchRequests();
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.detail || 'Failed to update status.' });
    }
  };

  const filtered = activeFilter === 'All'
    ? requests
    : requests.filter(r => (r.status || '').toUpperCase() === activeFilter);

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <ArrowRightLeft className="text-acid" size={24} />
            <h1 className="text-2xl font-bold text-white tracking-tight">Redistributions</h1>
          </div>
          <p className="text-white/40 text-sm">Inter-branch stock redistribution requests — manual and AI-generated.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-acid text-void text-xs font-bold px-4 py-2 rounded-lg hover:brightness-110 transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={14} /> New Request
        </button>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusPipeline.map((s, i) => {
          const count = requests.filter(r => (r.status || '').toUpperCase() === s).length;
          return (
            <div
              key={i}
              className={`bg-[#161618] border rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] ${activeFilter === s ? 'border-acid/30 bg-acid/5' : 'border-white/5 hover:border-white/10'}`}
              onClick={() => setActiveFilter(activeFilter === s ? 'All' : s)}
            >
              <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">{s.replace(/_/g, ' ')}</p>
              <div className="text-2xl font-bold text-white">
                {isLoading ? <Skeleton w="30px" h="32px" /> : count}
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-[#161618] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h4 className="font-bold text-sm uppercase tracking-wider text-white/60">Request Queue</h4>
          <div className="flex gap-2">
            <button onClick={() => setActiveFilter('All')} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'All' ? 'bg-acid/20 text-acid border border-acid/30' : 'bg-white/5 text-white/40 hover:text-white'}`}>All</button>
            <button onClick={() => setActiveFilter('PENDING')} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'PENDING' ? 'bg-warn/20 text-warn border border-warn/30' : 'bg-white/5 text-white/40 hover:text-white'}`}>Pending</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[800px]">
            <thead className="text-white/30 uppercase tracking-wider border-b border-white/5 bg-[#1a1a1c]">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium border-l border-white/5">Reason</th>
                <th className="px-6 py-4 font-medium border-l border-white/5 text-right">Qty</th>
                <th className="px-6 py-4 font-medium border-l border-white/5">Destination</th>
                <th className="px-6 py-4 font-medium border-l border-white/5">Triggered By</th>
                <th className="px-6 py-4 font-medium border-l border-white/5">Created</th>
                <th className="px-6 py-4 font-medium border-l border-white/5">Status</th>
                <th className="px-6 py-4 font-medium border-l border-white/5 text-right min-w-[140px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-6 py-4"><Skeleton h="40px" className="w-full" /></td></tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((r) => {
                  const status = (r.status || 'pending').toUpperCase();
                  const reasonCfg = reasonLabels[r.reason] || { label: r.reason, color: 'text-white/40 bg-white/5 border-white/10' };
                  return (
                    <tr key={r.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-3 font-mono text-white/40 text-[10px]">{r.id?.slice(0, 8)}...</td>
                      <td className="px-6 py-3 border-l border-white/5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${reasonCfg.color}`}>{reasonCfg.label}</span>
                      </td>
                      <td className="px-6 py-3 text-white/80 border-l border-white/5 text-right font-bold">{r.quantity}</td>
                      <td className="px-6 py-3 text-white/60 border-l border-white/5">{r.destination_notes || '—'}</td>
                      <td className="px-6 py-3 border-l border-white/5">
                        {r.triggered_by === 'agent' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-acid/10 text-acid border border-acid/20">AI Agent</span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-white/40 border border-white/10">Manual</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-white/40 border-l border-white/5">
                        {r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-3 border-l border-white/5">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-6 py-3 border-l border-white/5">
                        <div className="flex items-center justify-end gap-2">
                          {status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => updateStatus(r.id, 'approved')}
                                className="h-7 px-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-void rounded font-bold transition-all flex items-center gap-1"
                              >
                                <Check size={12} /> Approve
                              </button>
                              <button
                                onClick={() => updateStatus(r.id, 'cancelled')}
                                className="h-7 px-3 bg-white/5 hover:bg-danger/20 text-white/40 hover:text-danger rounded font-bold transition-all flex items-center gap-1"
                              >
                                <X size={12} /> Reject
                              </button>
                            </>
                          )}
                          {status === 'APPROVED' && (
                            <button
                              onClick={() => updateStatus(r.id, 'in_transit')}
                              className="h-7 px-3 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded font-bold transition-all flex items-center gap-1"
                            >
                              <Truck size={12} /> Ship
                            </button>
                          )}
                          {status === 'IN_TRANSIT' && (
                            <button
                              onClick={() => updateStatus(r.id, 'completed')}
                              className="h-7 px-3 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded font-bold transition-all flex items-center gap-1"
                            >
                              <CheckCircle size={12} /> Complete
                            </button>
                          )}
                          {(status === 'COMPLETED' || status === 'CANCELLED') && (
                            <span className="text-white/20 text-[10px]">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-white/30">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <ArrowRightLeft size={32} className="opacity-20" />
                      <p>No redistribution requests found.</p>
                      <button onClick={() => setIsModalOpen(true)} className="text-acid hover:underline mt-2">Create your first request</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RedistributionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => { setIsModalOpen(false); fetchRequests(); }}
      />
    </div>
  );
};

export default RedistributionsPage;
