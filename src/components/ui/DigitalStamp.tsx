'use client';

import { motion } from 'framer-motion';

export default function DigitalStamp() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 3, rotate: -45 }}
      animate={{ opacity: 1, scale: 1, rotate: -15 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.5 
      }}
      className="w-48 h-48 border-8 border-green-600/20 rounded-full flex flex-col items-center justify-center text-green-600/30 font-black uppercase text-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-green-500/5 animate-pulse"></div>
      <span className="text-xl leading-none">Digitally</span>
      <span className="text-3xl leading-none">Signed</span>
      <div className="mt-2 text-[8px] tracking-[0.3em]">CIPS-SPFS-NODE-01</div>
    </motion.div>
  );
}
