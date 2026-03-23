import React from 'react';
import { Truck, MapPin, ArrowRightLeft, ShieldAlert, BarChart, ChevronRight, Search } from 'lucide-react';

const DistributorView = () => {
  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Network Distribution</h1>
          <p className="text-white/40 text-sm">Managing 14 warehouses and 82 branches across the region.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white/5 border border-white/10 text-xs font-bold px-4 py-2 rounded-lg hover:bg-white/10 transition-all">Route Planner</button>
           <button className="bg-acid text-void text-xs font-bold px-4 py-2 rounded-lg hover:brightness-110 transition-all">Emergency Dispatch</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-navy border border-white/5 p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-acid/10 flex items-center justify-center text-acid">
               <Truck size={24} />
            </div>
            <div>
               <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Active Deliveries</p>
               <h3 className="text-xl font-bold">147 <span className="text-xs text-white/30 font-normal ml-2">Currently in transit</span></h3>
            </div>
         </div>
         <div className="bg-navy border border-white/5 p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-coral/10 flex items-center justify-center text-coral">
               <ArrowRightLeft size={24} />
            </div>
            <div>
               <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Pending Redistribution</p>
               <h3 className="text-xl font-bold">23 <span className="text-xs text-white/30 font-normal ml-2">AI-optimized moves</span></h3>
            </div>
         </div>
         <div className="bg-navy border border-white/5 p-5 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-warn/10 flex items-center justify-center text-warn">
               <ShieldAlert size={24} />
            </div>
            <div>
               <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Network Risk</p>
               <h3 className="text-xl font-bold text-warn">MEDIUM <span className="text-xs text-white/30 font-normal ml-2">3 hubs at 40% stock</span></h3>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* Order Queue */}
        <div className="bg-navy border border-white/5 rounded-xl flex flex-col min-h-[500px]">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
             <h4 className="font-bold text-sm uppercase tracking-wider text-white/60">Global Order Queue</h4>
             <div className="flex gap-2">
                {['All', 'Urgent', 'High', 'Normal'].map(f => (
                  <button key={f} className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${f === 'Urgent' ? 'bg-danger/20 text-danger' : 'bg-white/5 text-white/40 hover:text-white'}`}>{f}</button>
                ))}
             </div>
          </div>
          <div className="flex-1 overflow-auto">
             <table className="w-full text-left text-xs">
                <thead className="text-white/20 uppercase tracking-widest border-b border-white/5 sticky top-0 bg-navy z-10">
                   <tr>
                      <th className="px-6 py-4 font-medium">Order ID</th>
                      <th className="px-6 py-4 font-medium">Branch</th>
                      <th className="px-6 py-4 font-medium">Priority</th>
                      <th className="px-6 py-4 font-medium">Drug</th>
                      <th className="px-6 py-4 font-medium">Qty</th>
                      <th className="px-6 py-4 font-medium text-right">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {[
                     { id: '#PO-4821', branch: 'Branch 4, Pune', prio: 'URGENT', color: 'text-danger bg-danger/10', drug: 'Insulin Glargine', qty: '480', status: 'Pending' },
                     { id: '#PO-4822', branch: 'Branch 7, Nashik', prio: 'HIGH', color: 'text-warn bg-warn/10', drug: 'Metformin 500mg', qty: '1,200', status: 'In Transit' },
                     { id: '#PO-4823', branch: 'Branch 12, Mumbai', prio: 'NORMAL', color: 'text-white/40 bg-white/5', drug: 'Amoxicillin 500', qty: '320', status: 'Ordered' },
                     { id: '#PO-4824', branch: 'Branch 2, Thane', prio: 'NORMAL', color: 'text-white/40 bg-white/5', drug: 'Paracetamol', qty: '2,400', status: 'Delivered' },
                     { id: '#PO-4825', branch: 'Hub 1, Mumbai', prio: 'HIGH', color: 'text-warn bg-warn/10', drug: 'Insulin 100IU', qty: '960', status: 'Pending' },
                   ].map((row, i) => (
                     <tr key={i} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                        <td className="px-6 py-4 font-mono text-white/40">{row.id}</td>
                        <td className="px-6 py-4 font-bold text-white/80">{row.branch}</td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${row.color}`}>{row.prio}</span>
                        </td>
                        <td className="px-6 py-4 text-white/80">{row.drug}</td>
                        <td className="px-6 py-4 text-white/40">{row.qty}</td>
                        <td className="px-6 py-4 text-right">
                           <span className="text-white/60">{row.status}</span>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>

        {/* Redistribution Planner Sidebar */}
        <div className="bg-navy border border-white/5 rounded-xl p-6 flex flex-col">
           <div className="flex items-center gap-2 mb-8">
              <div className="w-5 h-5 rounded-full bg-acid flex items-center justify-center text-void">
                 <ArrowRightLeft size={12} strokeWidth={3} />
              </div>
              <h5 className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Redistribution Planner</h5>
           </div>

           <div className="flex-1 space-y-6">
              {[
                { source: 'Nashik WH', dest: 'Branch 4, Pune', drug: 'Insulin 100IU', qty: 480, savings: '₹38,400', riskAverted: true },
                { source: 'Mumbai Hub', dest: 'Navi Mumbai', drug: 'Metformin', qty: 1200, savings: '₹24,000', riskAverted: true }
              ].map((op, i) => (
                <div key={i} className="bg-white/4 border border-white/8 p-5 rounded-xl space-y-4 hover:border-acid/30 transition-all group">
                   <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">Opportunity #{i+1}</div>
                      <div className="flex items-center gap-1 text-success text-[10px] font-bold">
                         <ShieldAlert size={10} /> Risk Averted
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-3">
                      <div className="flex-1">
                         <div className="text-[10px] text-white/30 mb-1">Source</div>
                         <div className="text-xs font-bold">{op.source}</div>
                      </div>
                      <div className="text-white/20"><ChevronRight size={16} /></div>
                      <div className="flex-1 text-right">
                         <div className="text-[10px] text-white/30 mb-1">Destination</div>
                         <div className="text-xs font-bold">{op.dest}</div>
                      </div>
                   </div>

                   <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <div>
                         <div className="text-sm font-bold">{op.drug}</div>
                         <div className="text-[10px] text-white/40">{op.qty} units</div>
                      </div>
                      <div className="text-right">
                         <div className="text-sm font-bold text-acid">{op.savings}</div>
                         <div className="text-[10px] text-white/40">Est. Savings</div>
                      </div>
                   </div>

                   <button className="w-full h-8 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition-all">Execute Transfer</button>
                </div>
              ))}
           </div>
           
           <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex justify-between items-center mb-4">
                 <h6 className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Network Map</h6>
                 <button className="text-[10px] font-bold text-acid hover:underline">Full View</button>
              </div>
              <div className="w-full h-32 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center">
                 {/* Fake Map Graphic */}
                 <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy-dark.png')]"></div>
                 <div className="relative w-full h-full p-4">
                    <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-success animate-pulse"></div>
                    <div className="absolute top-1/3 left-2/3 w-2 h-2 rounded-full bg-danger animate-pulse"></div>
                    <div className="absolute top-2/3 left-1/2 w-2 h-2 rounded-full bg-warn animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/4 w-10 h-0.5 bg-acid/30 origin-left rotate-[-30deg]"></div>
                    <div className="absolute top-1/2 left-1/4 w-12 h-0.5 bg-acid/30 origin-left rotate-[40deg]"></div>
                 </div>
                 <span className="text-[10px] text-white/30 absolute bottom-3 right-4 font-mono">Live Nodes: 96</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorView;
