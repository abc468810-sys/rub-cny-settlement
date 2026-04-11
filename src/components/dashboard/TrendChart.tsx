'use client';

import { motion } from 'framer-motion';

interface Props {
  data: number[];
  label: string;
  accentColor?: string;
}

export function TrendChart({ data, label, accentColor = '#3b82f6' }: Props) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  const padding = range * 0.1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - (min - padding)) / (range + padding * 2)) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-48 relative group">
      <div className="absolute top-0 left-0">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">{label}</p>
        <p className="text-sm font-black text-gray-900 mono">{data[data.length - 1].toFixed(4)}</p>
      </div>
      
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full mt-4 overflow-visible">
        {/* Grid Lines */}
        <line x1="0" y1="0" x2="100" y2="0" stroke="#f3f4f6" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#f3f4f6" strokeWidth="0.5" />
        <line x1="0" y1="100" x2="100" y2="100" stroke="#f3f4f6" strokeWidth="0.5" />

        {/* The Path */}
        <motion.polyline
          fill="none"
          stroke={accentColor}
          strokeWidth="1.5"
          points={points}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Gradient Fill */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.1" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={`M 0,100 L ${points} L 100,100 Z`}
          fill="url(#gradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />

        {/* Data Points on Hover */}
        {data.map((val, i) => {
           const x = (i / (data.length - 1)) * 100;
           const y = 100 - ((val - (min - padding)) / (range + padding * 2)) * 100;
           return (
             <circle 
               key={i} 
               cx={x} 
               cy={y} 
               r="1" 
               className="opacity-0 group-hover:opacity-100 transition-opacity" 
               style={{ fill: accentColor }}
             />
           );
        })}
      </svg>
      
      <div className="flex justify-between mt-4 border-t border-gray-50 pt-2 text-[8px] font-black uppercase tracking-widest text-gray-300">
        <span>T-7 Days</span>
        <span>Real-time Buffer</span>
      </div>
    </div>
  );
}
