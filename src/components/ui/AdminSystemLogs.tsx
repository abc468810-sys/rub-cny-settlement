'use client';

import { motion } from 'framer-motion';
import { Terminal, ShieldCheck, Activity } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const LOG_TEMPLATES = [
  "CIPS-Node BJN-01 heartbeat acknowledged.",
  "SPFS-Gateway Handshake synchronized.",
  "Institutional AML Matrix scan initiated.",
  "Ledger signature 0x77a1...902b verified.",
  "Moscow corridor liquidity buffer optimized.",
  "Beijing clearing node handshake established.",
  "Anti-sanction vector scan 100% passed.",
  "Merchant settlement buffer initialized."
];

export default function AdminSystemLogs() {
  const [logs, setLogs] = useState<{ id: string; time: string; msg: string; type: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = {
        id: Math.random().toString(36).substr(2, 9),
        time: new Date().toLocaleTimeString(),
        msg: LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)],
        type: Math.random() > 0.8 ? 'SYSTEM' : 'INFO'
      };
      setLogs(prev => [...prev.slice(-15), newLog]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <section className="bg-gray-900 text-white p-12 rounded-[4rem] border border-gray-800 shadow-2xl flex flex-col h-[500px] relative overflow-hidden">
      {/* Visual background indicator */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 select-none pointer-events-none">
        <Activity size={300} strokeWidth={4} />
      </div>

      <header className="flex justify-between items-center mb-10 relative z-10">
        <div className="flex items-center space-x-3">
          <Terminal size={16} className="text-blue-500" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Live System Stream</h3>
        </div>
        <div className="flex items-center space-x-2 text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
           <ShieldCheck size={12} strokeWidth={3} />
           <span className="text-[10px] font-black uppercase tracking-widest leading-none">Syncing</span>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 space-y-4 font-mono text-[10px] overflow-y-auto no-scrollbar relative z-10"
      >
        {logs.map((log) => (
          <motion.div 
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start space-x-4 border-b border-white/5 pb-2"
          >
            <span className="text-gray-600 shrink-0">[{log.time}]</span>
            <span className={log.type === 'SYSTEM' ? 'text-blue-400 font-bold' : 'text-gray-400'}>
              {log.msg}
            </span>
          </motion.div>
        ))}
        {logs.length === 0 && (
          <div className="text-gray-700 animate-pulse uppercase tracking-widest">Awaiting node activity...</div>
        )}
      </div>
    </section>
  );
}
