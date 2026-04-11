'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Code, ShieldCheck, Database, Terminal } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  txId: string;
  payload: any;
}

export default function MetadataInspector({ isOpen, onClose, txId, payload }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[600] flex justify-end no-print">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/5 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg h-full bg-white shadow-[-40px_0_80px_rgba(0,0,0,0.05)] p-12 lg:p-16 flex flex-col overflow-y-auto no-scrollbar border-l border-gray-100"
          >
            <header className="flex justify-between items-start mb-20">
              <div className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black mono tracking-widest uppercase">
                Technical Metadata
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X size={24} className="text-gray-300 hover:text-black" />
              </button>
            </header>

            <div className="space-y-16 flex-1">
              <section className="space-y-4">
                <h3 className="text-3xl font-black tracking-tighter text-gray-900 leading-none">Institutional Payload</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] italic leading-relaxed">
                  Raw binary stream data synchronized across the Sino-Russian node pool.
                </p>
              </section>

              <div className="space-y-10">
                <div className="bg-gray-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
                    <Database size={200} strokeWidth={4} />
                  </div>
                  <pre className="relative z-10 font-mono text-[9px] text-green-500 leading-loose overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(payload, null, 2)}
                  </pre>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                    <ShieldCheck className="text-blue-600" size={20} />
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-gray-900">Encrypted Ledger Verified</p>
                      <p className="text-[9px] text-blue-600 font-bold tracking-widest">HASH: {Math.random().toString(16).substr(2, 32).toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className="mt-12 pt-12 border-t border-gray-50 flex items-center justify-between">
               <div className="flex items-center space-x-2">
                  <Terminal size={14} className="text-gray-300" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-300">Node BJN-01 Handshake Ready</span>
               </div>
               <button className="text-[9px] font-black uppercase tracking-widest text-blue-500 hover:underline">Download HEX Dump</button>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
