'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, FileText, Shield } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onComplete: () => void;
  title?: string;
}

export default function ExportOverlay({ isOpen, onComplete, title = "Preparing Ledger" }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-white/95 backdrop-blur-xl flex items-center justify-center p-6"
        >
          <div className="max-w-sm w-full text-center space-y-8">
            <div className="relative w-20 h-20 mx-auto">
              <motion.div 
                className="absolute inset-0 border-4 border-gray-100 rounded-full"
              />
              <motion.div 
                className="absolute inset-0 border-4 border-t-black rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText size={24} className="text-gray-200" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-black tracking-tighter uppercase">{title}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] leading-relaxed italic">
                Encrypting institutional data stream. Generating AES-256 compliant audit document...
              </p>
            </div>

            <div className="pt-8 flex items-center justify-center space-x-3 opacity-30">
               <Shield size={14} />
               <span className="text-[8px] font-black uppercase tracking-widest">Node Verified</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
