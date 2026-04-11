'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ShieldCheck, Activity, Globe, Zap } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const ACTIVITY_TEMPLATES = [
  { msg: "Consensus reached on MSK-NODE-03", type: "SUCCESS", node: "GLOBAL" },
  { msg: "Instruction payload encrypted (AES-256)", type: "INFO", node: "BJN-01" },
  { msg: "Sanction screening result: 100% CLEAR", type: "COMPLY", node: "VET-02" },
  { msg: "CIPS-SPFS bridge handshake successful", type: "SYNC", node: "BRIDGE" },
  { msg: "Merchant liquidity reserve synchronized", type: "INFO", node: "LEDGER" },
];

export default function AdminLiveActivity() {
  const [logs, setLogs] = useState<{ id: string; time: string; msg: string; type: string; node: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const template = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
      const newLog = {
        id: Math.random().toString(36).substr(2, 9),
        time: new Date().toLocaleTimeString([], { hour12: false }),
        ...template
      };
      setLogs(prev => [...prev.slice(-12), newLog]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <section className="bg-gray-900 text-white p-12 rounded-[4rem] border border-gray-800 shadow-2xl flex flex-col h-[500px] relative overflow-hidden group">
      {/* Decorative pulse background */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
        <Activity size={300} strokeWidth={4} />
      </div>

      <header className="flex justify-between items-center mb-10 relative z-10">
        <div className="flex items-center space-x-3">
          <Terminal size={16} className="text-blue-500" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">Live Network Stream</h3>
        </div>
        <div className="flex items-center space-x-3 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20">
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
           <span className="text-[9px] font-black uppercase tracking-widest text-green-500 leading-none">Syncing</span>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 space-y-4 font-mono text-[10px] overflow-y-auto no-scrollbar relative z-10"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start space-x-4 border-b border-white/5 pb-3 group/item"
            >
              <span className="text-gray-600 shrink-0 tabular-nums">[{log.time}]</span>
              <span className="text-[8px] font-black text-blue-500 uppercase bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10 shrink-0">
                {log.node}
              </span>
              <span className={`flex-1 ${
                log.type === 'SUCCESS' ? 'text-green-400' : 
                log.type === 'COMPLY' ? 'text-blue-400' : 
                log.type === 'SYNC' ? 'text-purple-400' : 'text-gray-400'
              }`}>
                {log.msg}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center space-y-4 text-gray-700">
             <Zap size={24} className="animate-pulse" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting node handshake...</p>
          </div>
        )}
      </div>

      <footer className="pt-8 border-t border-white/5 flex justify-between items-center relative z-10">
         <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest italic">Encrypted via SPFS-Bridge Protocol v2.4</p>
         <div className="flex items-center space-x-4 opacity-30">
            <Globe size={12} />
            <ShieldCheck size={12} />
         </div>
      </footer>
    </section>
  );
}
