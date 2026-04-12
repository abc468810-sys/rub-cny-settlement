'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Globe } from 'lucide-react';

const SECURITY_EVENTS = [
  { id: 1, event: 'Secure Login from Moscow Node', time: '14:20', type: 'AUTH' },
  { id: 2, event: 'Session Key Rotated', time: '12:05', type: 'ENCRYPT' },
  { id: 3, event: 'KYC Document Hash Verified', time: 'Yesterday', type: 'COMPLY' },
  { id: 4, event: 'Multi-Sig Consensus Handshake', time: 'Yesterday', type: 'AUTH' },
];

export default function SecurityActivity() {
  return (
    <section className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col justify-between h-full group">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Access Shield</h3>
          <p className="text-xl font-black text-gray-900 leading-none italic uppercase">Security Feed</p>
        </div>
        <div className="p-3 bg-white rounded-2xl text-gray-400 shadow-sm border border-gray-100 group-hover:text-blue-500 transition-colors">
          <Shield size={18} />
        </div>
      </header>

      <div className="space-y-6">
        {SECURITY_EVENTS.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex justify-between items-center group/item cursor-default"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg border border-gray-100 text-gray-300 group-hover/item:text-blue-500 transition-colors">
                {item.type === 'AUTH' ? <Lock size={12} /> : item.type === 'ENCRYPT' ? <Shield size={12} /> : <Globe size={12} />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover/item:text-black transition-colors">{item.event}</span>
            </div>
            <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter tabular-nums">{item.time}</span>
          </motion.div>
        ))}
      </div>

      <div className="pt-8 mt-8 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-[8px] font-black text-gray-300 uppercase tracking-[0.2em]">
           <Shield size={10} className="text-blue-500" />
           <span>AES-256 SESSION PROTECTION ACTIVE</span>
        </div>
      </div>
    </section>
  );
}
