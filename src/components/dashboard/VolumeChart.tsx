'use client';

import { motion } from 'framer-motion';

interface Props {
  data: number[];
  labels: string[];
}

export default function VolumeChart({ data, labels }: Props) {
  const max = Math.max(...data, 1);
  
  return (
    <section className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm space-y-12 h-full flex flex-col justify-between group">
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Institutional Analytics</h3>
          <p className="text-3xl font-black text-gray-900 italic uppercase leading-none">Trade Throughput</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-blue-600 italic">+14.2% Quarter Peak</p>
          <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-1">Ref: MSK-BJN-FLOW</p>
        </div>
      </header>

      <div className="h-56 flex items-end justify-between gap-4 px-2 pt-10">
        {data.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center group/bar relative h-full justify-end">
            {/* Tooltip */}
            <div className="absolute -top-12 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 bg-black text-white px-4 py-2 rounded-xl text-[10px] font-mono whitespace-nowrap z-10 shadow-2xl scale-95 group-hover/bar:scale-100">
              ₽ {val.toLocaleString()}
            </div>
            
            <motion.div 
              className="w-full bg-gray-50 rounded-t-[1.5rem] group-hover/bar:bg-black transition-all relative overflow-hidden cursor-crosshair border border-transparent group-hover/bar:border-black"
              initial={{ height: 0 }}
              animate={{ height: `${(val / max) * 100}%` }}
              transition={{ duration: 1.5, delay: i * 0.1, ease: [0.33, 1, 0.68, 1] }}
            >
               {i === data.length - 1 && (
                 <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
               )}
               {/* Internal stripe pattern for extra detail */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 1px, transparent 1px, transparent 10px)' }}></div>
            </motion.div>
            <p className="text-[9px] font-black mt-6 text-gray-300 uppercase tracking-[0.2em] group-hover/bar:text-black transition-colors">{labels[i]}</p>
          </div>
        ))}
      </div>
      
      <footer className="pt-8 border-t border-gray-50 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-300">
        <div className="flex items-center space-x-3">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
           <span className="italic">CIPS-Sync: Active</span>
        </div>
        <span className="opacity-50">Aggregate Node Data v2.4</span>
      </footer>
    </section>
  );
}
