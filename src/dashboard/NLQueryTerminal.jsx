import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Loader2, Cpu, ChevronRight, X, Zap } from 'lucide-react';

const EXAMPLE_QUERIES = [
  'Which medicines are critically low right now?',
  'What orders are pending approval?',
  'Show me medicines expiring this month.',
  'What did the replenishment agent do today?',
  'How many units of Metformin do we have?',
];

const MOCK_RESPONSES = {
  default: {
    answer: "Based on the current inventory data, I found the following information:\n\n**Critical Stock Items:**\n• Metformin 500mg (12 units) — minimum threshold: 200 units\n• Cetirizine 10mg (8 units) — minimum threshold: 120 units\n\mBoth require immediate reordering to prevent stockout.",
    confidence: 0.87,
    latency_ms: 1243,
    doc_count: 3,
    sources: [
      { doc_id: 'inv_met500', medicine_name: 'Metformin 500mg', content: 'Batch B-2024-01. Quantity: 12. Expiry: 2025-03-15.', relevance_score: 0.92 },
      { doc_id: 'inv_cet010', medicine_name: 'Cetirizine 10mg', content: 'Batch B-2024-07. Quantity: 8. Expiry: 2025-12-01.', relevance_score: 0.88 },
    ],
  },
};

const getResponse = (query) => {
  const q = query.toLowerCase();
  if (q.includes('expir')) return {
    answer: "Medicines expiring within 30 days:\n\n• **Metformin 500mg** — Batch B-2024-01 expires 2025-03-15 (12 units at risk)\n• **Atorvastatin 10mg** — Batch B-2024-04 expires 2025-03-28 (89 units)\n\nRecommendation: Prioritize consumption of these batches and initiate redistribution if possible.",
    confidence: 0.91, latency_ms: 987, doc_count: 2,
    sources: [
      { doc_id: 'inv_met500', medicine_name: 'Metformin 500mg', content: 'Expiry: 2025-03-15. Quantity: 12.', relevance_score: 0.94 },
    ],
  };
  if (q.includes('order')) return {
    answer: "Current pending orders awaiting approval:\n\n• **PO-4821** — Insulin Glargine, 480 units, ₹8,640 (AI Agent, HIGH priority)\n• **PO-4826** — Cetirizine 10mg, 600 units, ₹720 (AI Agent, MEDIUM priority)\n\nBoth orders were suggested by the Replenishment Agent based on critically low stock levels.",
    confidence: 0.89, latency_ms: 1102, doc_count: 2,
    sources: [
      { doc_id: 'ord_4821', medicine_name: 'Insulin Glargine', content: 'PO-4821. Qty: 480. Status: PENDING.', relevance_score: 0.91 },
    ],
  };
  if (q.includes('metformin')) return {
    answer: "Current Metformin 500mg stock status:\n\n• **Available units:** 12\n• **Minimum threshold:** 200 units\n• **Days of stock remaining:** ~3 days at current consumption rate\n• **Batch:** B-2024-01, expires 2025-03-15\n\n⚠️ CRITICAL — Immediate reorder required. Suggested quantity: 2,400 units.",
    confidence: 0.95, latency_ms: 854, doc_count: 1,
    sources: [
      { doc_id: 'inv_met500', medicine_name: 'Metformin 500mg', content: 'Quantity: 12. Batch: B-2024-01. Low stock threshold: 200.', relevance_score: 0.97 },
    ],
  };
  return MOCK_RESPONSES.default;
};

const NLQueryTerminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const submit = async (q = input) => {
    if (!q.trim() || loading) return;
    const query = q.trim();
    setInput('');
    setLoading(true);
    setHistory(h => [...h, { type: 'query', text: query, id: Date.now() }]);

    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
    const resp = getResponse(query);
    setHistory(h => [...h, { type: 'response', ...resp, id: Date.now() + 1 }]);
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isExpanded ? 'w-[600px] h-[520px]' : 'w-auto h-auto'}`}>
      {!isExpanded ? (
        <button
          onClick={() => { setIsExpanded(true); setTimeout(() => inputRef.current?.focus(), 100); }}
          className="flex items-center gap-2 bg-void border border-acid/30 text-acid px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-acid/10 transition-all shadow-2xl shadow-acid/10 group"
        >
          <Terminal size={16} />
          <span>Ask Cherri</span>
          <div className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse" />
        </button>
      ) : (
        <div className="w-full h-full bg-[#0e0e10] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#141416] border-b border-white/5">
            <div className="flex gap-1.5">
              <button onClick={() => setIsExpanded(false)} className="w-3 h-3 rounded-full bg-danger/80 hover:bg-danger transition-colors" />
              <div className="w-3 h-3 rounded-full bg-warn/80" />
              <div className="w-3 h-3 rounded-full bg-success/80" />
            </div>
            <div className="flex items-center gap-2 ml-2">
              <Terminal size={12} className="text-acid" />
              <span className="text-[11px] font-mono text-white/40">pharmaagent — nl-query</span>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] text-success font-bold">AI ONLINE</span>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 font-mono text-xs" style={{ scrollbarWidth: 'thin', scrollbarColor: '#222 transparent' }}>
            {history.length === 0 && (
              <div className="space-y-3">
                <p className="text-white/20">
                  <span className="text-acid">PharmaAgent</span> NL Query v1.0 — Powered by Ollama Mistral + ChromaDB RAG
                </p>
                <p className="text-white/20">Type your question below or try an example:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {EXAMPLE_QUERIES.map((q, i) => (
                    <button key={i} onClick={() => submit(q)}
                      className="text-[10px] px-2.5 py-1 rounded-md bg-white/5 text-acid/70 hover:bg-acid/10 hover:text-acid border border-white/10 hover:border-acid/30 transition-all text-left">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {history.map((item) => (
              <div key={item.id}>
                {item.type === 'query' && (
                  <div className="flex items-start gap-2">
                    <span className="text-acid shrink-0">❯</span>
                    <span className="text-white/80">{item.text}</span>
                  </div>
                )}
                {item.type === 'response' && (
                  <div className="ml-4 space-y-2">
                    <div className="flex items-center gap-3 text-[10px] text-white/30">
                      <span className="flex items-center gap-1"><Cpu size={10} className="text-acid" /> confidence: <span className="text-acid">{(item.confidence * 100).toFixed(0)}%</span></span>
                      <span>latency: <span className="text-white/50">{item.latency_ms}ms</span></span>
                      <span>docs: <span className="text-white/50">{item.doc_count}</span></span>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3 text-white/70 leading-relaxed whitespace-pre-wrap">
                      {item.answer}
                    </div>
                    {item.sources && item.sources.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[9px] text-white/20 uppercase tracking-widest">Sources</p>
                        {item.sources.map((s, si) => (
                          <div key={si} className="flex items-start gap-2 text-[10px] text-white/30">
                            <ChevronRight size={10} className="mt-0.5 text-acid/40 shrink-0" />
                            <span className="text-acid/60">[{s.doc_id}]</span>
                            <span>{s.content}</span>
                            <span className="ml-auto shrink-0 text-white/20">score: {s.relevance_score}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 ml-4 text-white/30">
                <Loader2 size={12} className="animate-spin text-acid" />
                <span>Querying ChromaDB → Ollama Mistral...</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Bar */}
          <div className="px-4 py-3 bg-[#141416] border-t border-white/5">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus-within:border-acid/30 transition-all">
              <span className="text-acid text-xs font-mono shrink-0">❯</span>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything about your inventory..."
                className="flex-1 bg-transparent text-xs text-white/80 font-mono focus:outline-none placeholder-white/20"
              />
              <button
                onClick={() => submit()}
                disabled={!input.trim() || loading}
                className="shrink-0 p-1 text-acid/50 hover:text-acid disabled:opacity-30 transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
            <p className="text-[9px] text-white/15 mt-1.5 text-center font-mono">POST /api/v1/ai/query · RAG · Ollama Mistral · ChromaDB</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NLQueryTerminal;
