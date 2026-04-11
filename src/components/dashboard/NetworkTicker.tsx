'use client';

import { motion } from 'framer-motion';

interface Props {
  items?: string[];
}

const DEFAULT_ITEMS = [
  "RUB-CNY Liquidity Corridor update: Node synchronization 100% complete",
  "CIPS-SPFS Interoperability Expanded: 14 new correspondent nodes added",
  "Central Bank Release: RUB settlement buffer expanded by 500M",
  "Network Health: Optimal (12ms Latency) across MSK-BJN bridge",
  "Regulatory Advisory: New Export Customs protocols Moscow enforced",
];

export default function NetworkTicker({ items = DEFAULT_ITEMS }: Props) {
  const displayItems = items.length > 0 ? items : DEFAULT_ITEMS;

  return (
    <div className="w-full overflow-hidden bg-gray-50 border-b border-gray-100 py-3 no-print">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          duration: 40,
          ease: "linear",
        }}
        className="flex whitespace-nowrap space-x-20"
      >
        {[...displayItems, ...displayItems].map((item, i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
              {item}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
