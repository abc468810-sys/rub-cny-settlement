'use client';

import { motion } from 'framer-motion';

export default function RegionalDistribution({ accentColor }: { accentColor?: string }) {
  const data = [
    { label: 'Moscow Hub', value: 60, color: '#000000' },
    { label: 'Beijing Node', value: 25, color: accentColor || '#3b82f6' },
    { label: 'Shanghai Bridge', value: 15, color: '#94a3b8' },
  ];

  let cumulativePercent = 0;

  function getCoordinatesForPercent(percent: number) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  }

  return (
    <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10 flex flex-col justify-between group">
      <header>
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Reserve Insights</h3>
        <p className="text-xl font-black text-gray-900 leading-none italic uppercase">Regional Allocation</p>
      </header>

      <div className="flex items-center justify-center py-4 relative">
        <div className="relative w-48 h-48">
          <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full overflow-visible">
            {data.map((slice, i) => {
              const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
              cumulativePercent += slice.value / 100;
              const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
              const largeArcFlag = slice.value / 100 > 0.5 ? 1 : 0;
              const pathData = `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;

              return (
                <motion.path
                  key={i}
                  d={pathData}
                  fill={slice.color}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-default transition-all"
                />
              );
            })}
            <circle r="0.6" cx="0" cy="0" fill="white" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Network</p>
            <p className="text-lg font-black text-gray-900">100%</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between group/item">
            <div className="flex items-center space-x-3">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover/item:text-black transition-colors">{item.label}</span>
            </div>
            <span className="text-[10px] font-bold text-gray-900 mono italic">{item.value}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}
