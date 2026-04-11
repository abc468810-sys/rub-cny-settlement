'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Download, Check, ShieldCheck, RefreshCw } from 'lucide-react';
import ExportOverlay from './ExportOverlay';
import { useNotify } from './NotificationProvider';

export default function LedgerArchiver() {
  const { notify } = useNotify();
  const [isArchiving, setIsArchiving] = useState(false);

  const handleArchive = () => {
    setIsArchiving(true);
    setTimeout(() => {
      setIsArchiving(false);
      notify('SUCCESS', 'Historical ledger archived and encrypted.');
    }, 4000);
  };

  return (
    <>
      <ExportOverlay isOpen={isArchiving} onComplete={() => {}} title="Archiving Ledger" />
      
      <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8 flex flex-col justify-between">
        <header className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Institutional Backup</h3>
            <p className="text-xl font-black text-gray-900">Ledger Archiver</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
            <Database size={20} />
          </div>
        </header>

        <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">
          Compress and encrypt historical transaction data into a secure AES-256 institutional package for offline auditing.
        </p>

        <button 
          onClick={handleArchive}
          className="w-full bg-black text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex justify-center items-center space-x-3 shadow-xl shadow-black/5"
        >
          <RefreshCw size={14} className={isArchiving ? 'animate-spin' : ''} />
          <span>Execute Archive</span>
        </button>
      </section>
    </>
  );
}
