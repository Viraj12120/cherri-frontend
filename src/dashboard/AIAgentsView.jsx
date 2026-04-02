import React, { useState } from 'react';
import { Cpu, Activity, CheckCircle, XCircle, Clock, Play, RefreshCw, ChevronRight } from 'lucide-react';

const agentActions = [
  { id: 'inv-001', agent: 'Inventory Monitor', action: 'CRITICAL_ALERT', detail: 'Generated alert for Metformin 500mg (12 units remaining)', time: '2 min ago', status: 'completed' },
  { id: 'inv-002', agent: 'Inventory Monitor', action: 'LOW_STOCK_ALERT', detail: 'Generated alert for Insulin Glargine (45 units)', time: '16 min ago', status: 'completed' },
  { id: 'rep-001', agent: 'Replenishment Agent', action: 'ORDER_CREATED', detail: 'Created PO-4821 for 480 × Insulin Glargine (₹8,640)', time: '1 hr ago', status: 'completed' },
  { id: 'rep-002', agent: 'Replenishment Agent', action: 'ORDER_PENDING_APPROVAL', detail: 'Awaiting pharmacist approval for PO-4822 (Metformin, 1200 units)', time: '1 hr ago', status: 'pending' },
  { id: 'inv-003', agent: 'Inventory Monitor', action: 'EXPIRY_ALERT', detail: 'Atorvastatin Batch B-2024-04 expires in 5 days', time: '3 hrs ago', status: 'completed' },
  { id: 'rep-003', agent: 'Replenishment Agent', action: 'TRIGGER_FAILED', detail: 'Failed to suggest order for Cetirizine 10mg — no supplier linked', time: '4 hrs ago', status: 'failed' },
];

const agents = [
  {
    id: 'inventory_monitor',
    name: 'Inventory Monitor Agent',
    description: 'Continuously scans inventory levels, detects critical stock and expiry events, and generates alerts.',
    status: 'running',
    lastRun: '2 min ago',
    nextRun: 'in 8 min',
    actionsToday: 14,
    schedule: 'Every 10 minutes',
  },
  {
    id: 'replenishment',
    name: 'Replenishment Agent',
    description: 'Analyzes low-stock alerts and creates or suggests purchase orders to prevent stockouts.',
    status: 'running',
    lastRun: '1 hr ago',
    nextRun: 'in 29 min',
    actionsToday: 3,
    schedule: 'Every 30 minutes',
  },
  {
    id: 'nl_query',
    name: 'NL Query Agent',
    description: 'RAG-powered agent that answers natural language questions about inventory using ChromaDB + Ollama Mistral.',
    status: 'idle',
    lastRun: '5 min ago',
    nextRun: 'On demand',
    actionsToday: 12,
    schedule: 'On demand',
  },
];

const statusConfig = {
  running: { color: 'text-success', bg: 'bg-success/10 border-success/20', dot: 'bg-success animate-pulse', label: 'Running' },
  idle: { color: 'text-acid', bg: 'bg-acid/10 border-acid/20', dot: 'bg-acid', label: 'Idle' },
  error: { color: 'text-danger', bg: 'bg-danger/10 border-danger/20', dot: 'bg-danger animate-pulse', label: 'Error' },
};

const actionStatus = {
  completed: { color: 'text-success', icon: CheckCircle },
  pending: { color: 'text-warn', icon: Clock },
  failed: { color: 'text-danger', icon: XCircle },
};

const AIAgentsView = () => {
  const [triggerLoading, setTriggerLoading] = useState({});

  const triggerAgent = (id) => {
    setTriggerLoading(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setTriggerLoading(prev => ({ ...prev, [id]: false })), 2000);
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">AI Agents</h1>
        <p className="text-white/40 text-sm">Status and action log of all autonomous agents in Cherri+.</p>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {agents.map(agent => {
          const cfg = statusConfig[agent.status];
          return (
            <div key={agent.id} className={`bg-navy border rounded-xl p-6 relative overflow-hidden group transition-all hover:scale-[1.01] ${cfg.bg}`}>
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl bg-acid/5 group-hover:bg-acid/10 transition-all" />
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg bg-white/5 ${cfg.color}`}>
                  <Cpu size={20} />
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${cfg.bg} border`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  <span className={`text-[10px] font-bold uppercase ${cfg.color}`}>{cfg.label}</span>
                </div>
              </div>

              <h3 className="font-bold text-white text-sm mb-1">{agent.name}</h3>
              <p className="text-[11px] text-white/40 leading-relaxed mb-6">{agent.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: 'Last Run', val: agent.lastRun },
                  { label: 'Next Run', val: agent.nextRun },
                  { label: 'Schedule', val: agent.schedule },
                  { label: 'Actions Today', val: agent.actionsToday },
                ].map((m, i) => (
                  <div key={i}>
                    <p className="text-[9px] text-white/20 uppercase font-bold tracking-widest mb-0.5">{m.label}</p>
                    <p className="text-xs font-bold text-white/70">{m.val}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => triggerAgent(agent.id)}
                disabled={triggerLoading[agent.id]}
                className="w-full h-9 rounded-lg bg-white/5 hover:bg-acid/10 hover:text-acid text-white/40 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-acid/30 disabled:opacity-50"
              >
                {triggerLoading[agent.id] ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} />}
                {triggerLoading[agent.id] ? 'Triggering...' : 'Trigger Manually'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Action Log */}
      <div className="bg-navy border border-white/5 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center gap-3">
          <Activity size={16} className="text-acid" />
          <h4 className="font-bold text-sm uppercase tracking-wider text-white/60">Recent Agent Actions</h4>
        </div>
        <div className="divide-y divide-white/5">
          {agentActions.map(a => {
            const s = actionStatus[a.status];
            return (
              <div key={a.id} className="px-6 py-4 flex items-start gap-4 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                <s.icon size={14} className={`mt-0.5 ${s.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wide">{a.agent}</span>
                    <ChevronRight size={10} className="text-white/20" />
                    <span className="text-[10px] font-bold text-acid/80">{a.action.replace(/_/g,' ')}</span>
                  </div>
                  <p className="text-xs text-white/60">{a.detail}</p>
                </div>
                <span className="text-[10px] text-white/20 shrink-0">{a.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AIAgentsView;
