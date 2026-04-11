'use client';

import { motion } from 'framer-motion';
import { Terminal, ShieldCheck } from 'lucide-react';

const AUDIT_LOGS = [
  { id: 1, action: 'CNY-SWIFT-SPFS handshake verified', status: 'SUCCESS', timestamp: '14:23:45' },
  { id: 2, action: 'Anti-sanction check 100% passed', status: 'COMPLIANCE', timestamp: '14:24:02' },
  { id: 3, action: 'Russo-Chinese gateway routing active', status: 'READY', timestamp: '14:24:10' },
  { id: 4, action: 'Merchant ledger balance synchronized', status: 'SUCCESS', timestamp: '14:25:00' },
];

export function SystemAudit() {
  return (
    <section className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col h-full font-mono">
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center space-x-2 text-gray-400">
          <Terminal size={14} />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Node Audit Log</h3>
        </div>
        <div className="flex items-center space-x-2 text-green-500 bg-green-50 px-3 py-1 rounded-full border border-green-100">
           <ShieldCheck size={12} strokeWidth={3} />
           <span className="text-[10px] font-black uppercase tracking-widest leading-none">Healthy</span>
        </div>
      </header>

      <div className="flex-1 space-y-6">
        {AUDIT_LOGS.map((log, i) => (
          <motion.div 
            key={log.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="flex items-start space-x-4 border-b border-gray-100 pb-4 last:border-0"
          >
            <div className="text-[10px] text-gray-300 font-black tabular-nums">{log.timestamp}</div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter italic mb-1">{log.action}</p>
              <div className="flex items-center space-x-2">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  log.status === 'SUCCESS' ? 'bg-green-500' : 
                  log.status === 'COMPLIANCE' ? 'bg-blue-500' : 'bg-gray-400'
                }`}></div>
                <span className={`text-[8px] font-black uppercase tracking-widest ${
                   log.status === 'SUCCESS' ? 'text-green-600' : 
                   log.status === 'COMPLIANCE' ? 'text-blue-600' : 'text-gray-400'
                }`}>{log.status}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
