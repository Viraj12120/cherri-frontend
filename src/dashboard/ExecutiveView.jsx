import React from 'react';
import { Target, TrendingDown, Users, DollarSign, Globe2, Activity, Zap, FileSpreadsheet, MoreVertical } from 'lucide-react';

const ExecutiveView = () => {
  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Executive Command Center</h1>
          <p className="text-white/40 text-sm">Real-time network health and financial performance auditor.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white/5 border border-white/10 text-xs font-bold px-4 py-2 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2">
              <FileSpreadsheet size={16} /> Reports
           </button>
           <button className="bg-acid text-void text-xs font-bold px-4 py-2 rounded-lg hover:brightness-110 transition-all">Audit Trail</button>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Network Health', val: '87/100', sub: '● GOOD STATUS', icon: Activity, color: 'text-success' },
          { label: 'Stock Availability', val: '98.3%', sub: '▲ +2.1% vs LM', icon: Target, color: 'text-acid' },
          { label: 'Expiry Risk', val: '₹4.2L', sub: 'Hub 1 & Branch 4', icon: TrendingDown, color: 'text-danger' },
          { label: 'Total Savings', val: '₹18.7L', sub: '▲ +14% vs LM', icon: DollarSign, color: 'text-acid' }
        ].map((stat, i) => (
          <div key={i} className="bg-navy border border-white/5 p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
               <stat.icon size={48} />
            </div>
            <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-4">{stat.label}</p>
            <h3 className="text-2xl font-bold text-white mb-2">{stat.val}</h3>
            <div className="flex items-center gap-2">
               <span className={`text-[10px] font-bold ${stat.color}`}>{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
        {/* Network Map / Graph Visualization */}
        <div className="bg-navy border border-white/5 rounded-xl p-8 flex flex-col min-h-[500px] relative overflow-hidden">
           <div className="flex items-center justify-between mb-8 relative z-10">
              <h4 className="font-bold text-sm uppercase tracking-wider text-white/60 flex items-center gap-2">
                 <Globe2 size={18} className="text-acid" /> Global Supply Chain Node-Link
              </h4>
              <div className="flex gap-4">
                 {['Health', 'Volume', 'Redistribution'].map(v => (
                   <button key={v} className={`text-[10px] font-bold transition-all ${v === 'Health' ? 'text-acid underline underline-offset-4' : 'text-white/30 hover:text-white'}`}>{v}</button>
                 ))}
              </div>
           </div>

           <div className="flex-1 relative flex items-center justify-center">
              {/* Fake Network Graph */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,245,50,0.05)_0%,transparent_70%)]"></div>
              
              <div className="relative w-full h-full max-w-lg">
                 {/* Central Hubs */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 rounded-full bg-acid/20 border-2 border-acid flex items-center justify-center relative shadow-[0_0_30px_rgba(232,245,50,0.3)]">
                       <span className="text-[10px] font-bold text-acid">HUB1</span>
                       <div className="absolute -inset-4 border border-acid/10 rounded-full animate-ping"></div>
                    </div>
                 </div>

                 {/* Nodes */}
                 {[
                   { t: '10%', l: '20%', s: 'w-6 h-6', c: 'bg-success', label: 'B2' },
                   { t: '20%', l: '70%', s: 'w-8 h-8', c: 'bg-warn', label: 'B4' },
                   { t: '75%', l: '15%', s: 'w-7 h-7', c: 'bg-success', label: 'B7' },
                   { t: '80%', l: '80%', s: 'w-6 h-6', c: 'bg-danger', label: 'B12' },
                   { t: '30%', l: '40%', s: 'w-9 h-9', c: 'bg-acid/20 border border-acid', label: 'W1' },
                 ].map((node, i) => (
                   <div key={i} className={`absolute ${node.t} ${node.l} ${node.s} rounded-full flex items-center justify-center ${node.c}`}>
                      <span className="text-[8px] font-bold text-white/80">{node.label}</span>
                      {/* Connection Lines (fake) */}
                      <div className="absolute w-[100px] h-[1px] bg-white/5 origin-left" style={{ rotate: `${i * 72}deg` }}></div>
                   </div>
                 ))}
              </div>

              <div className="absolute bottom-4 left-4 grid grid-cols-3 gap-6 bg-void/40 backdrop-blur-md p-4 rounded-xl border border-white/5">
                 <div>
                    <div className="text-[10px] text-white/30 mb-1">Operational</div>
                    <div className="text-sm font-bold">96 Hubs</div>
                 </div>
                 <div>
                    <div className="text-[10px] text-white/30 mb-1">Stock Level</div>
                    <div className="text-sm font-bold text-success text-acid">Optimal</div>
                 </div>
                 <div>
                    <div className="text-[10px] text-white/30 mb-1">Forecast Match</div>
                    <div className="text-sm font-bold">94%</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Predictive Alerts Panel */}
        <div className="space-y-6">
           <div className="bg-navy border border-white/5 rounded-xl p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-8">
                 <div className="w-5 h-5 rounded-full bg-acid flex items-center justify-center text-void">
                    <Zap size={12} strokeWidth={3} />
                 </div>
                 <h5 className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Predictive Intelligence</h5>
              </div>

              <div className="flex-1 space-y-4">
                 <p className="text-[10px] text-white/30 uppercase tracking-widest mb-4">PREDICTED ISSUES — NEXT 14 DAYS</p>
                 
                 {[
                   { day: 4, issue: 'Insulin shortage at 3 branches', conf: 91, color: 'text-danger bg-danger/10 border-danger/20' },
                   { day: 7, issue: 'Metformin demand surge (+40%)', conf: 86, color: 'text-warn bg-warn/10 border-warn/20' },
                   { day: 11, issue: 'Expiry batch at Nashik WH', conf: 94, color: 'text-danger bg-danger/10 border-danger/20' }
                 ].map((item, i) => (
                   <div key={i} className="bg-white/4 border border-white/8 p-4 rounded-xl space-y-3 group hover:border-acid/20 transition-all cursor-pointer">
                      <div className="flex justify-between items-center">
                         <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${item.color}`}>DAY {item.day}</span>
                         <span className="text-[10px] font-bold text-acid">{item.conf}% CONFIDENCE</span>
                      </div>
                      <p className="text-xs font-bold text-white/90">{item.issue}</p>
                      <div className="flex items-center justify-between text-[10px] pt-1">
                         <button className="text-white/40 hover:text-acid transition-colors">View Agent Plan →</button>
                         <button className="text-acid/60 hover:text-acid font-bold transition-colors">Approve Action</button>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                       <p className="text-[10px] text-white/30 mb-2">AUTO-APPROVED</p>
                       <p className="text-xl font-bold">1,248</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                       <p className="text-[10px] text-white/30 mb-2">SAVINGS ROI</p>
                       <p className="text-xl font-bold text-acid">₹6.4L</p>
                    </div>
                 </div>
                 <button className="w-full h-10 mt-4 bg-acid/10 hover:bg-acid text-acid hover:text-void font-bold text-xs rounded-xl transition-all">Review All Agent Actions</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveView;
