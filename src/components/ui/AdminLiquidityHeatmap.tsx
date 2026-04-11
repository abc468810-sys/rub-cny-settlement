'use client';

import { motion } from 'framer-motion';

const NODES = [
  { id: 'BJN-01', saturation: '89%', color: 'bg-blue-600', val: 89 },
  { id: 'SHG-02', saturation: '72%', color: 'bg-blue-500', val: 72 },
  { id: 'HKG-01', saturation: '45%', color: 'bg-blue-400', val: 45 },
  { id: 'MSK-01', saturation: '94%', color: 'bg-blue-700', val: 94 },
  { id: 'NSK-03', saturation: '21%', color: 'bg-blue-300', val: 21 },
  { id: 'VLV-01', saturation: '12%', color: 'bg-blue-200', val: 12 },
  { id: 'KZN-02', saturation: '55%', color: 'bg-blue-500', val: 55 },
  { id: 'STP-01', saturation: '68%', color: 'bg-blue-600', val: 68 },
];

export default function AdminLiquidityHeatmap() {
  return (
    <section className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Global Network</h3>
          <p className="text-2xl font-black text-gray-900 leading-none italic uppercase">Liquidity Saturation</p>
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
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-[7px] font-black uppercase opacity-60 group-hover:opacity-100 relative z-10">{node.id}</span>
            <span className="text-[10px] font-black mono relative z-10">{node.saturation}</span>
          </motion.div>
        ))}
      </div>

      <div className="pt-8 border-t border-gray-50 flex justify-between items-center">
        <p className="text-[9px] text-gray-400 font-medium italic">Saturation indicates node-level reserve availability for RUB-CNY settlement corridors.</p>
        <div className="flex items-center space-x-2">
           <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
           <span className="text-[8px] font-black uppercase text-gray-300">Sync: Active</span>
        </div>
      </div>
    </section>
  );
}
