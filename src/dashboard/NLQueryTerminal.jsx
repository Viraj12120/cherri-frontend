import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Loader2, Cpu, ChevronRight, X, Zap, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../lib/axios';


const EXAMPLE_QUERIES = [
  'Which medicines are critically low right now?',
  'What orders are pending approval?',
  'Show me medicines expiring this month.',
  'What did the replenishment agent do today?',
  'How many units of Metformin do we have?',
];


const NLQueryTerminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
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

    try {
      const { data } = await api.post('/ai/query', { query });
      setHistory(h => [...h, { type: 'response', ...data, id: Date.now() + 1 }]);
    } catch (err) {
      setHistory(h => [...h, {
        type: 'response',
        answer: err.response?.data?.detail || "Sorry, I couldn't reach the backend API right now.",
        confidence: 0,
        latency_ms: 0,
        doc_count: 0,
        id: Date.now() + 1
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  // Draggable constraint calculations
  const [bounds, setBounds] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  useEffect(() => {
    setBounds({
      left: -window.innerWidth + 100,
      right: 100,
      top: -window.innerHeight + 100,
      bottom: 100
    });
  }, []);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={bounds}
      className={`fixed z-[9999] transition-all duration-500 ease-in-out ${!isExpanded
          ? 'bottom-6 right-6 w-auto h-auto'
          : isMaximized
            ? 'top-4 left-4 right-4 bottom-4 w-[calc(100vw-32px)] h-[calc(100vh-32px)]'
            : 'bottom-6 right-6 w-[600px] h-[520px]'
        }`}
      style={{ touchAction: 'none' }}
    >
      {!isExpanded ? (
        <button
          onClick={() => { setIsExpanded(true); setTimeout(() => inputRef.current?.focus(), 100); }}
          className="flex items-center gap-2 bg-void border border-acid/30 text-acid px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-acid/10 transition-all shadow-2xl shadow-acid/10 group cursor-pointer"
        >
          <Terminal size={16} />
          <span>Ask Cherri</span>
          <div className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse" />
        </button>
      ) : (
        <div className="w-full h-full bg-[#0e0e10] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#141416] border-b border-white/5 cursor-grab active:cursor-grabbing">
            <div className="flex gap-1.5 cursor-pointer">
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); setIsExpanded(false); setIsMaximized(false); }}
                className="w-3 h-3 rounded-full bg-danger/80 hover:bg-danger transition-colors flex items-center justify-center group/btn"
                title="Close"
              >
                <X size={8} className="opacity-0 group-hover/btn:opacity-100 text-void" />
              </button>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); setIsMaximized(false); }}
                className="w-3 h-3 rounded-full bg-warn/80 hover:bg-warn transition-colors flex items-center justify-center group/btn"
                title="Restore"
              >
                <div className="w-1 h-[1px] bg-void opacity-0 group-hover/btn:opacity-100" />
              </button>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); setIsMaximized(true); }}
                className="w-3 h-3 rounded-full bg-success/80 hover:bg-success transition-colors flex items-center justify-center group/btn text-void"
                title="Maximize"
              >
                <Plus size={8} className="opacity-0 group-hover/btn:opacity-100" />
              </button>
            </div>
            <div className="flex items-center gap-2 ml-2 pointer-events-none">
              <Terminal size={12} className="text-acid" />
              <span className="text-[11px] font-mono text-white/40">Cherri+ — nl-query</span>
            </div>
            <div className="ml-auto flex items-center gap-1.5 pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] text-success font-bold">AI ONLINE</span>
            </div>
          </div>

          {/* Terminal Body */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 font-mono text-xs cursor-text"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#222 transparent' }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {history.length === 0 && (
              <div className="space-y-3">
                <p className="text-white/20">
                  <span className="text-acid">Cherri+</span> NL Query v1.0 — Powered by Ollama Mistral + ChromaDB RAG
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
          <div
            className="px-4 py-3 bg-[#141416] border-t border-white/5"
            onPointerDown={(e) => e.stopPropagation()}
          >
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
    </motion.div>
  );
};

export default NLQueryTerminal;
