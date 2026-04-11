'use client';

import { motion } from 'framer-motion';
import { Newspaper, ArrowUpRight } from 'lucide-react';

const BULLETINS = [
  { id: 1, title: 'CIPS-SPFS Interoperability Expanded', category: 'Compliance', date: '2h ago' },
  { id: 2, title: 'CNY-RUB Liquidity Corridor update', category: 'Market', date: '5h ago' },
  { id: 3, title: 'New Export Customs protocols Moscow', category: 'Regulatory', date: '1d ago' },
];

export function MarketBulletins() {
  return (
    <section className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm flex flex-col h-full">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <Newspaper size={14} className="text-gray-400" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900">Institutional Feed</h3>
        </div>
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
      </header>

      <div className="flex-1 space-y-8">
        {BULLETINS.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="group cursor-pointer border-b border-gray-50 pb-6 last:border-0"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[8px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">
                {item.category}
              </span>
              <span className="text-[8px] font-bold text-gray-300 uppercase">{item.date}</span>
            </div>
            <p className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
              <span>{item.title}</span>
              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
