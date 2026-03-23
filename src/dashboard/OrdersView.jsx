import React, { useState } from 'react';
import { ClipboardList, Check, X, Clock, Truck, PackageCheck, Plus, Filter } from 'lucide-react';

const statusPipeline = ['PENDING', 'APPROVED', 'ORDERED', 'IN TRANSIT', 'RECEIVED'];

const statusStyle = {
  PENDING: 'text-warn bg-warn/10 border-warn/30',
  APPROVED: 'text-acid bg-acid/10 border-acid/30',
  ORDERED: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  'IN TRANSIT': 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  RECEIVED: 'text-success bg-success/10 border-success/30',
};

const orders = [
  { id: '#PO-4821', medicine: 'Insulin Glargine', supplier: 'PharmaCorp', qty: 480, amount: '₹8,640', created: '2025-03-20', status: 'PENDING', agent: true },
  { id: '#PO-4822', medicine: 'Metformin 500mg', supplier: 'MediSource India', qty: 1200, amount: '₹3,000', created: '2025-03-19', status: 'APPROVED', agent: true },
  { id: '#PO-4823', medicine: 'Amoxicillin 500mg', supplier: 'BioPharm Ltd', qty: 320, amount: '₹1,024', created: '2025-03-18', status: 'ORDERED', agent: false },
  { id: '#PO-4824', medicine: 'Paracetamol 500mg', supplier: 'GenericMed', qty: 2400, amount: '₹1,200', created: '2025-03-17', status: 'IN TRANSIT', agent: false },
  { id: '#PO-4825', medicine: 'Insulin 100IU', supplier: 'PharmaCorp', qty: 960, amount: '₹17,280', created: '2025-03-16', status: 'RECEIVED', agent: true },
  { id: '#PO-4820', medicine: 'Cetirizine 10mg', supplier: 'MediSource India', qty: 600, amount: '₹720', created: '2025-03-15', status: 'PENDING', agent: true },
];

const OrdersView = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All' ? orders : orders.filter(o => o.status === activeFilter);

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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusPipeline.map((s, i) => {
          const count = orders.filter(o => o.status === s).length;
          return (
            <div key={i} className={`bg-navy border rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] ${activeFilter === s ? 'border-acid/30 bg-acid/5' : 'border-white/5 hover:border-white/10'}`} onClick={() => setActiveFilter(activeFilter === s ? 'All' : s)}>
              <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">{s}</p>
              <p className="text-2xl font-bold text-white">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-navy border border-white/5 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h4 className="font-bold text-sm uppercase tracking-wider text-white/60">Order Queue</h4>
          <div className="flex gap-2">
            <button onClick={() => setActiveFilter('All')} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'All' ? 'bg-acid/20 text-acid border border-acid/30' : 'bg-white/5 text-white/40 hover:text-white'}`}>All</button>
            <button onClick={() => setActiveFilter('PENDING')} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'PENDING' ? 'bg-warn/20 text-warn border border-warn/30' : 'bg-white/5 text-white/40 hover:text-white'}`}>Pending</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-white/30 uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Medicine</th>
                <th className="px-6 py-4 font-medium">Supplier</th>
                <th className="px-6 py-4 font-medium">Qty</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((o, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                  <td className="px-6 py-4 font-mono text-white/40">{o.id}</td>
                  <td className="px-6 py-4 font-bold text-white/90">{o.medicine}</td>
                  <td className="px-6 py-4 text-white/50">{o.supplier}</td>
                  <td className="px-6 py-4 text-white/80">{o.qty.toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-acid">{o.amount}</td>
                  <td className="px-6 py-4 text-white/40">{o.created}</td>
                  <td className="px-6 py-4">
                    {o.agent ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-acid/10 text-acid border border-acid/20">AI Agent</span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-white/40 border border-white/10">Manual</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusStyle[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {o.status === 'PENDING' && (
                        <>
                          <button className="h-7 px-3 bg-success/10 hover:bg-success text-success hover:text-void rounded font-bold transition-all flex items-center gap-1">
                            <Check size={12} /> Approve
                          </button>
                          <button className="h-7 px-3 bg-white/5 hover:bg-danger/20 text-white/40 hover:text-danger rounded font-bold transition-all flex items-center gap-1">
                            <X size={12} /> Reject
                          </button>
                        </>
                      )}
                      {o.status === 'APPROVED' && (
                        <button className="h-7 px-3 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded font-bold transition-all flex items-center gap-1">
                          <Truck size={12} /> Mark Ordered
                        </button>
                      )}
                      {o.status === 'ORDERED' && (
                        <button className="h-7 px-3 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded font-bold transition-all flex items-center gap-1">
                          <PackageCheck size={12} /> Receive
                        </button>
                      )}
                      {(o.status === 'IN TRANSIT' || o.status === 'RECEIVED') && (
                        <span className="text-white/20 text-[10px]">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersView;
