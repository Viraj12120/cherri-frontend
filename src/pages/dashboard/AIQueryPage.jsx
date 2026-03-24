import React from 'react';
import NLQueryTerminal from '../../dashboard/NLQueryTerminal';
import { Sparkles, HelpCircle } from 'lucide-react';

const AIQueryPage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 ">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={20} className="text-acid" />
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Insights Terminal</h1>
          </div>
          <p className="text-white/40 text-sm">Ask natural language questions about your inventory, sales, and supply chain.</p>
        </div>
        
        <div className="flex items-center gap-4 text-white/40 text-[10px] uppercase font-bold tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5">
           <HelpCircle size={14} className="text-acid/60" />
           <span>Ask about low stock, revenue, or trends</span>
        </div>
      </div>

      <div className="min-h-[600px] flex flex-col">
        <NLQueryTerminal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 pb-20">
         {[
           { title: "Inventory Analysis", desc: "Which medicines are below critical stock levels right now?" },
           { title: "Supplier Inquiry", desc: "Which supplier has the fastest delivery time for Insulin?" },
           { title: "Financial Overview", desc: "What was the total order value for the last 30 days?" }
         ].map((card, i) => (
           <div key={i} className="p-5 rounded-2xl bg-[#161618] border border-white/5 hover:border-acid/20 transition-all cursor-pointer group">
              <h4 className="text-xs font-bold text-white mb-2 group-hover:text-acid transition-colors">{card.title}</h4>
              <p className="text-[11px] text-white/40 italic leading-relaxed">"{card.desc}"</p>
           </div>
         ))}
      </div>
    </div>
  );
};

export default AIQueryPage;
