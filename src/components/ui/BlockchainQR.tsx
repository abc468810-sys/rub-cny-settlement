'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { QrCode, X, Search, Database, ShieldCheck } from 'lucide-react';

export default function BlockchainQR() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="no-print">
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-700 transition-colors py-2 px-4 bg-blue-50 rounded-xl border border-blue-100 shadow-sm"
      >
        <QrCode size={14} />
        <span>Verify Ledger</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-white/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="max-w-sm w-full text-center space-y-10">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-10 right-10 p-2 text-gray-300 hover:text-black transition-colors"
              >
                <X size={24} />
              </button>

              <div className="w-48 h-48 bg-gray-100 rounded-[3rem] mx-auto flex items-center justify-center border-4 border-white shadow-2xl relative overflow-hidden group">
                <div className="grid grid-cols-4 gap-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  {new Array(16).fill(0).map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-black"></div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <QrCode size={80} className="text-black" strokeWidth={1.5} />
                </div>
                <motion.div 
                  className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-black tracking-tighter uppercase italic">Institutional Verification</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-relaxed italic">
                  Instruction verified on decentralized node pool. Scan to view immutable block details and tiered signatures.
                </p>
              </div>

              <div className="pt-6 flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                  <Database size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Hash: 0x77a1...902b</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-black text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:opacity-90 transition-opacity"
                >
                  Close Explorer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
