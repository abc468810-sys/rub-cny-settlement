'use client';

import { motion } from 'framer-motion';

const NODES = [
  { id: 'BJN-01', latency: '12ms', status: 'OPTIMAL', color: 'bg-green-500' },
  { id: 'MSK-03', latency: '14ms', status: 'OPTIMAL', color: 'bg-green-500' },
  { id: 'SHG-02', latency: '18ms', status: 'OPTIMAL', color: 'bg-green-400' },
  { id: 'HKG-01', latency: '22ms', status: 'STABLE', color: 'bg-green-300' },
  { id: 'VLV-01', latency: '28ms', status: 'STABLE', color: 'bg-blue-400' },
  { id: 'KZN-02', latency: '35ms', status: 'STABLE', color: 'bg-blue-300' },
  { id: 'STP-01', latency: '42ms', status: 'STABLE', color: 'bg-blue-200' },
  { id: 'NSK-03', latency: '110ms', status: 'CONGESTED', color: 'bg-orange-400' },
];

export default function RegionalLatencyHeatmap() {
  return (
    <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Network Grid</h3>
          <p className="text-xl font-black text-gray-900 leading-none italic">Regional Latency Heatmap</p>
        </div>
        <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
           <span className="text-[9px] font-black uppercase tracking-widest leading-none">Global Sync Active</span>
        </div>
      </header>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {NODES.map((node, i) => (
          <motion.div 
            key={node.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`aspect-square rounded-2xl ${node.color} flex flex-col items-center justify-center text-white space-y-1 shadow-sm hover:scale-110 transition-all cursor-default group relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
            <span className="text-[7px] font-black uppercase opacity-60 group-hover:opacity-100 relative z-10">{node.id}</span>
            <span className="text-[9px] font-black mono relative z-10">{node.latency}</span>
            
            {/* Tooltip Simulation */}
            <div className="absolute -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-2 py-1 rounded text-[6px] font-black uppercase tracking-widest z-20">
              {node.status}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-8 border-t border-gray-50 flex justify-between items-center">
        <p className="text-[9px] text-gray-400 font-medium italic uppercase tracking-widest">
          Color saturation reflects real-time response times across the Russo-Chinese corridor.
        </p>
        <div className="flex items-center space-x-2">
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
           <span className="text-[8px] font-black uppercase text-gray-300">Handshake: 100%</span>
        </div>
      </div>
    </section>
  );
}
