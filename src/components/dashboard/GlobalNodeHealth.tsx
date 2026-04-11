'use client';

import { motion } from 'framer-motion';
import { Globe, Activity, ShieldCheck, Zap } from 'lucide-react';

const NODES = [
  { id: 'BJN-NODE-01', region: 'Beijing', status: 'Optimal', latency: '12ms' },
  { id: 'MSK-NODE-03', region: 'Moscow', status: 'Optimal', latency: '14ms' },
  { id: 'SHG-NODE-02', region: 'Shanghai', status: 'Optimal', latency: '18ms' },
  { id: 'HKG-NODE-01', region: 'Hong Kong', status: 'Optimal', latency: '22ms' },
];

export default function GlobalNodeHealth() {
  return (
    <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10 relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-0 right-0 p-10 opacity-[0.02] -rotate-12 pointer-events-none">
        <Globe size={240} strokeWidth={4} />
      </div>

      <header className="flex justify-between items-center relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-gray-400 mb-2">
            <Activity size={14} className="text-blue-500" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Network Grid</h3>
          </div>
          <p className="text-xl font-black text-gray-900 leading-none">Institutional Node Health</p>
        </div>
        <div className="flex items-center space-x-2 text-green-500 bg-green-50 px-3 py-1 rounded-full border border-green-100">
           <ShieldCheck size={12} strokeWidth={3} />
           <span className="text-[10px] font-black uppercase tracking-widest leading-none">Synchronized</span>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-6 relative z-10 flex-1">
        {NODES.map((node, i) => (
          <motion.div 
            key={node.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-gray-50 rounded-[2rem] border border-gray-50 group hover:border-black transition-all cursor-default"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 group-hover:text-blue-500 transition-colors">{node.region}</span>
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
              </div>
            </div>
            <p className="text-xs font-black text-gray-900 mono">{node.id}</p>
            <div className="flex justify-between items-center mt-2 border-t border-gray-100 pt-2 opacity-50">
              <span className="text-[7px] font-bold text-gray-400 uppercase">Ping</span>
              <span className="text-[8px] font-black text-gray-500 mono">{node.latency}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-8 border-t border-gray-50 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
           <Zap size={10} strokeWidth={3} />
           <span className="text-[8px] font-black uppercase tracking-widest">CIPS Bridge: Active</span>
        </div>
        <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] italic tabular-nums">
          Node_Heartbeat: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </section>
  );
}
