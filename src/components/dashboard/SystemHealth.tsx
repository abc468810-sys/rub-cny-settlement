'use client';

import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Zap, Server } from 'lucide-react';

export default function SystemHealth() {
  const nodes = [
    { name: 'BJN-NODE-01', status: 'Optimal', latency: '12ms', color: 'bg-green-500', load: '14%' },
    { name: 'MSK-NODE-03', status: 'Optimal', latency: '14ms', color: 'bg-green-500', load: '28%' },
    { name: 'CIPS-BRIDGE', status: 'Active', latency: '8ms', color: 'bg-blue-500', load: '100%' },
  ];

  return (
    <section className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm flex flex-col justify-between h-full group">
      <header className="flex justify-between items-start mb-10">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Network Grid</h3>
          <p className="text-2xl font-black text-gray-900 leading-none italic uppercase">System Health</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-[1.5rem] text-blue-600 shadow-inner group-hover:bg-black group-hover:text-white transition-all duration-500">
          <Activity size={20} className="animate-pulse" />
        </div>
      </header>

      <div className="space-y-10">
        {nodes.map((node, i) => (
          <div key={i} className="space-y-3 group/item cursor-default">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${node.color} shadow-[0_0_10px_rgba(0,0,0,0.1)] group-hover/item:scale-125 transition-transform`}></div>
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover/item:text-black transition-colors">{node.name}</span>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black text-gray-900 italic leading-none">{node.status}</p>
                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter mt-1">{node.latency}</p>
              </div>
            </div>
            {/* Minimalist load bar */}
            <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 whileInView={{ width: node.load }}
                 viewport={{ once: true }}
                 transition={{ duration: 2, delay: i * 0.2, ease: "circOut" }}
                 className={`h-full ${node.color} opacity-30`}
               />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-10 mt-10 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-green-600 bg-green-50 px-4 py-2 rounded-2xl border border-green-100 shadow-sm">
           <ShieldCheck size={12} strokeWidth={3} />
           <span className="text-[9px] font-black uppercase tracking-widest leading-none">Node Sync: 100%</span>
        </div>
        <div className="flex items-center space-x-2 opacity-20">
           <Server size={14} className="text-gray-400" />
           <span className="text-[8px] font-black uppercase">v2.4.0-Stable</span>
        </div>
      </div>
    </section>
  );
}
