import React, { useState, useEffect } from 'react';
import { ClipboardList, Check, X, Clock, Truck, PackageCheck, Plus, Package } from 'lucide-react';
import api from '../../lib/axios';
import { useUiStore } from '../../stores/uiStore';
import Skeleton, { TableRowSkeleton } from '../../components/ui/Skeleton';
import StatusBadge from '../../components/ui/StatusBadge';

const statusPipeline = ['PENDING', 'APPROVED', 'ORDERED', 'IN TRANSIT', 'RECEIVED'];

const OrdersPage = () => {
  const addToast = useUiStore((s) => s.addToast);
  
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/orders');
      const rows = Array.isArray(data) ? data : (data.items || data.data || []);
      setOrders(rows);
    } catch (err) {
      addToast({
        type: 'error',
        message: 'Failed to load purchase orders.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Typically /orders/:id/status or specific endpoints
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      addToast({ type: 'success', message: `Order marked as ${newStatus}` });
      fetchOrders(); // Refresh
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.detail || 'Failed to update order status.' });
    }
  };

  const filtered = activeFilter === 'All' 
    ? orders 
    : orders.filter(o => (o.status || 'PENDING').toUpperCase() === activeFilter);

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Orders</h1>
          <p className="text-white/40 text-sm">Purchase orders created manually and by the AI replenishment agent.</p>
        </div>
        <button className="bg-acid text-void text-xs font-bold px-4 py-2 rounded-lg hover:brightness-110 transition-all flex items-center gap-2 w-fit">
          <Plus size={14} /> New Order
        </button>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusPipeline.map((s, i) => {
          const count = orders.filter(o => (o.status || 'PENDING').toUpperCase() === s).length;
          return (
            <div 
              key={i} 
              className={`bg-[#161618] border rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] ${activeFilter === s ? 'border-acid/30 bg-acid/5' : 'border-white/5 hover:border-white/10'}`} 
              onClick={() => setActiveFilter(activeFilter === s ? 'All' : s)}
            >
              <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">{s}</p>
              <div className="text-2xl font-bold text-white">
                {isLoading ? <Skeleton w="30px" h="32px" /> : count}
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-[#161618] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h4 className="font-bold text-sm uppercase tracking-wider text-white/60">Order Queue</h4>
          <div className="flex gap-2 relative z-10">
            <button onClick={() => setActiveFilter('All')} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'All' ? 'bg-acid/20 text-acid border border-acid/30' : 'bg-white/5 text-white/40 hover:text-white'}`}>All</button>
            <button onClick={() => setActiveFilter('PENDING')} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'PENDING' ? 'bg-warn/20 text-warn border border-warn/30' : 'bg-white/5 text-white/40 hover:text-white'}`}>Pending</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead className="text-white/30 uppercase tracking-wider border-b border-white/5 bg-[#1a1a1c]">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium border-l border-white/5">Medicine</th>
                <th className="px-6 py-4 font-medium border-l border-white/5">Supplier</th>
                <th className="px-6 py-4 font-medium border-l border-white/5 text-right">Qty</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium border-l border-white/5">Created</th>
                <th className="px-6 py-4 font-medium border-l border-white/5">Source</th>
                <th className="px-6 py-4 font-medium border-l border-white/5">Status</th>
                <th className="px-6 py-4 font-medium border-l border-white/5 text-right min-w-[140px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={9} className="px-6">
                      <TableRowSkeleton columns={7} />
                    </td>
                  </tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((o, i) => {
                  const status = (o.status || 'PENDING').toUpperCase();
                  const isAgent = o.is_agent_generated || o.agent || false; 
                  const orderId = o.id || o.order_id || `#N/A`;

                  return (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                      <td className="px-6 py-3 font-mono text-white/40">{orderId}</td>
                      <td className="px-6 py-3 font-bold text-white/90 border-l border-white/5">{o.medicine_name || o.medicine || '-'}</td>
                      <td className="px-6 py-3 text-white/50 border-l border-white/5">{o.supplier_name || o.supplier || '-'}</td>
                      <td className="px-6 py-3 text-white/80 border-l border-white/5 text-right">{o.quantity || o.qty || 0}</td>
                      <td className="px-6 py-3 font-bold text-acid text-right">{o.total_amount || o.amount || '₹0'}</td>
                      <td className="px-6 py-3 text-white/40 border-l border-white/5">
                        {o.created_at ? new Date(o.created_at).toLocaleDateString() : (o.created || '-')}
                      </td>
                      <td className="px-6 py-3 border-l border-white/5">
                        {isAgent ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-acid/10 text-acid border border-acid/20">AI Agent</span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-white/40 border border-white/10">Manual</span>
                        )}
                      </td>
                      <td className="px-6 py-3 border-l border-white/5">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-6 py-3 border-l border-white/5">
                        <div className="flex items-center justify-end gap-2 relative z-10">
                          {status === 'PENDING' && (
                            <>
                              <button 
                                onClick={(e) => { e.stopPropagation(); updateOrderStatus(orderId, 'APPROVED'); }}
                                className="h-7 px-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-void rounded font-bold transition-all flex items-center gap-1"
                              >
                                <Check size={12} /> Approve
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); updateOrderStatus(orderId, 'CANCELLED'); }}
                                className="h-7 px-3 bg-white/5 hover:bg-danger/20 text-white/40 hover:text-danger rounded font-bold transition-all flex items-center gap-1"
                              >
                                <X size={12} /> Reject
                              </button>
                            </>
                          )}
                          {status === 'APPROVED' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateOrderStatus(orderId, 'ORDERED'); }}
                              className="h-7 px-3 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded font-bold transition-all flex items-center gap-1"
                            >
                              <Truck size={12} /> Mark Ordered
                            </button>
                          )}
                          {status === 'ORDERED' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateOrderStatus(orderId, 'RECEIVED'); }}
                              className="h-7 px-3 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded font-bold transition-all flex items-center gap-1"
                            >
                              <PackageCheck size={12} /> Receive
                            </button>
                          )}
                          {(status === 'IN TRANSIT' || status === 'RECEIVED' || status === 'CANCELLED') && (
                            <span className="text-white/20 text-[10px]">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-white/30">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <ClipboardList size={32} className="opacity-20" />
                      <p>No orders found.</p>
                      {activeFilter !== 'All' ? (
                        <button onClick={() => setActiveFilter('All')} className="text-acid hover:underline mt-2">Clear Filters</button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
