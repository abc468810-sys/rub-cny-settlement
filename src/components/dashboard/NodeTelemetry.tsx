'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

interface Props {
  activeNode?: string;
  accentColor?: string;
}

export default function NodeTelemetry({ activeNode = 'BJN-01', accentColor = '#3b82f6' }: Props) {
  const [data, setData] = useState<number[]>(new Array(20).fill(20));

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const next = [...prev.slice(1), Math.floor(Math.random() * 30) + 10];
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const max = Math.max(...data, 40);
  const min = 0;
  const range = max - min;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <section className="bg-black text-white p-10 rounded-[3rem] shadow-2xl flex flex-col justify-between relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform">
        <Activity size={120} />
      </div>
      
      <header className="relative z-10 flex justify-between items-center mb-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">Node Telemetry</h3>
          <p className="text-xl font-bold tracking-tight">Active Link</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black mono text-blue-500 tracking-tighter">{data[data.length-1]}ms</p>
          <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Latency</p>
        </div>
      </header>

      <div className="flex-1 relative h-20 mb-6">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <motion.polyline
            fill="none"
            stroke={accentColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </svg>
      </div>

      <div className="pt-6 border-t border-white/5 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <div 
            className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            style={{ backgroundColor: accentColor }}
          ></div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Node {activeNode} Ready</span>
        </div>
        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600">Buffer: 100%</span>
      </div>
    </section>
  );
}
