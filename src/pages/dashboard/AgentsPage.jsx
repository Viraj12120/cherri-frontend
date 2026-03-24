import React, { useState, useEffect } from 'react';
import { Cpu, Activity, CheckCircle, XCircle, Clock, Play, RefreshCw, ChevronRight, AlertCircle } from 'lucide-react';
import { useAgentStore } from '../../stores/agentStore';
import { useUiStore } from '../../stores/uiStore';
import Skeleton from '../../components/ui/Skeleton';

const statusConfig = {
  running: { color: 'text-success', bg: 'bg-success/10 border-success/20', dot: 'bg-success animate-pulse', label: 'Running' },
  idle: { color: 'text-acid', bg: 'bg-acid/10 border-acid/20', dot: 'bg-acid', label: 'Idle' },
  error: { color: 'text-danger', bg: 'bg-danger/10 border-danger/20', dot: 'bg-danger animate-pulse', label: 'Error' },
  unavailable: { color: 'text-white/20', bg: 'bg-white/5 border-white/5', dot: 'bg-white/20', label: 'Offline' }
};

const actionStatus = {
  completed: { color: 'text-success', icon: CheckCircle },
  pending: { color: 'text-warn', icon: Clock },
  failed: { color: 'text-danger', icon: XCircle },
};

const AgentsPage = () => {
  const { 
    aiStatus, 
    agentLogs, 
    fetchAiStatus, 
    fetchAgentLogs, 
    triggerReplenishment,
    runningAgents,
    getCooldownRemaining
  } = useAgentStore();
  const addToast = useUiStore(s => s.addToast);

  const [isLoading, setIsLoading] = useState(true);
  const [triggerLoading, setTriggerLoading] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      await Promise.allSettled([
        fetchAiStatus(),
        fetchAgentLogs()
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrigger = async (agentId) => {
    // Current backend only supports replenishment trigger via this action
    if (agentId !== 'replenishment') {
      addToast({ type: 'info', message: 'Manual trigger for this agent is currently handled automatically by the system.' });
      return;
    }

    try {
      setTriggerLoading(prev => ({ ...prev, [agentId]: true }));
      await triggerReplenishment('global'); // Using 'global' or logic-based ID
      addToast({ type: 'success', message: 'Replenishment agent triggered successfully!' });
      await fetchAgentLogs();
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to trigger agent.' });
    } finally {
      setTriggerLoading(prev => ({ ...prev, [agentId]: false }));
    }
  };

  const agents = [
    {
      id: 'inventory_monitor',
      name: 'Inventory Monitor Agent',
      description: 'Continuously scans inventory levels, detects critical stock and expiry events, and generates alerts.',
      status: aiStatus?.status === 'healthy' ? 'running' : 'unavailable',
      lastRun: '2 min ago',
      nextRun: 'in 8 min',
      actionsToday: aiStatus?.monitor_actions || 14,
      schedule: 'Every 10 minutes',
    },
    {
      id: 'replenishment',
      name: 'Replenishment Agent',
      description: 'Analyzes low-stock alerts and creates or suggests purchase orders to prevent stockouts.',
      status: runningAgents['global'] ? 'running' : 'idle',
      lastRun: '1 hr ago',
      nextRun: getCooldownRemaining('global') > 0 ? `in ${getCooldownRemaining('global')}s` : 'Ready',
      actionsToday: aiStatus?.replenishment_actions || 3,
      schedule: 'Every 30 minutes',
    },
    {
      id: 'nl_query',
      name: 'NL Query Agent',
      description: 'RAG-powered agent that answers natural language questions about inventory using ChromaDB + Ollama Mistral.',
      status: 'idle',
      lastRun: 'Just now',
      nextRun: 'On demand',
      actionsToday: aiStatus?.query_count || 12,
      schedule: 'On demand',
    },
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">AI Agents</h1>
        <p className="text-white/40 text-sm">Status and action log of all autonomous agents in PharmaAgent.</p>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {agents.map(agent => {
          const cfg = statusConfig[agent.status] || statusConfig.idle;
          const isPending = triggerLoading[agent.id] || runningAgents['global'];
          const cooldown = getCooldownRemaining('global');

          return (
            <div key={agent.id} className={`bg-[#161618] border rounded-xl p-6 relative overflow-hidden group transition-all hover:border-white/10 ${cfg.bg}`}>
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl bg-acid/5 group-hover:bg-acid/10 transition-all" />
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg bg-white/5 ${cfg.color}`}>
                  <Cpu size={20} />
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${cfg.bg} border border-white/5`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  <span className={`text-[10px] font-bold uppercase ${cfg.color}`}>{cfg.label}</span>
                </div>
              </div>

              <h3 className="font-bold text-white text-sm mb-1">{agent.name}</h3>
              <p className="text-[11px] text-white/40 leading-relaxed mb-6 h-12 overflow-hidden">{agent.description}</p>

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
                onClick={() => handleTrigger(agent.id)}
                disabled={isPending || (agent.id === 'replenishment' && cooldown > 0)}
                className="w-full h-10 rounded-xl bg-white/5 hover:bg-acid hover:text-black text-white/60 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/5 hover:border-acid active:scale-[0.98] disabled:opacity-50"
              >
                {isPending ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                {isPending ? 'Triggering...' : (cooldown > 0 && agent.id === 'replenishment' ? `Cooldown (${cooldown}s)` : 'Trigger Manually')}
              </button>
            </div>
          );
        })}
      </div>

      {/* Action Log */}
      <div className="bg-[#161618] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Activity size={18} className="text-acid" />
             <h4 className="font-bold text-sm uppercase tracking-wider text-white/80">Agent Log Activity</h4>
          </div>
          <button onClick={loadData} className="text-white/40 hover:text-acid transition-all p-1">
             <RefreshCw size={16} />
          </button>
        </div>
        
        <div className="divide-y divide-white/5">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4"><Skeleton h="40px" className="w-full" /></div>
            ))
          ) : agentLogs.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4 text-white/20">
                <AlertCircle size={24} />
              </div>
              <p className="text-white/30 text-sm font-medium">No autonomous actions recorded today.</p>
              <p className="text-white/20 text-[10px] mt-1 italic">Agents run background tasks every 10-30 minutes.</p>
            </div>
          ) : agentLogs.map((a, i) => {
            const status = a.status?.toLowerCase() || 'completed';
            const s = actionStatus[status] || actionStatus.completed;
            return (
              <div key={i} className="px-6 py-5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors group">
                <div className={`p-2 rounded-lg bg-white/5 ${s.color}`}>
                   <s.icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{a.agent_name || 'System Agent'}</span>
                    <ChevronRight size={10} className="text-white/20" />
                    <span className="text-[10px] font-bold text-acid uppercase tracking-widest">{a.action_type || 'Unknown Action'}</span>
                  </div>
                  <p className="text-xs text-white/70 font-medium leading-relaxed">{a.details || a.detail || 'No detailed log provided.'}</p>
                </div>
                <span className="text-[10px] text-white/20 font-mono shrink-0 pt-1 uppercase tracking-tighter">
                   {new Date(a.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;
