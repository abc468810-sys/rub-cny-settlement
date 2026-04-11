'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, ShieldAlert, CheckCircle2, Zap } from 'lucide-react';
import { useState } from 'react';

const ALERTS = [
  { id: 1, title: 'Node MSK-03 Restored', time: '14:10', type: 'SUCCESS', desc: 'Primary corridor link back to optimal status.' },
  { id: 2, title: 'Latency Spike: 140ms', time: '13:45', type: 'WARNING', desc: 'Congestion detected in HKG-BJN bridge.' },
  { id: 3, title: 'Compliance Matrix v2.4', time: 'Yesterday', type: 'INFO', desc: 'New institutional vetting logic deployed.' },
];

export default function AlertHistory() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all relative group"
      >
        <Bell size={20} className="text-gray-400 group-hover:text-black transition-colors" />
        <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-80 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-8 z-50 overflow-hidden"
          >
            <header className="flex justify-between items-center mb-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Alert History</h4>
              <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-black">
                <X size={16} />
              </button>
            </header>

            <div className="space-y-8">
              {ALERTS.map((alert) => (
                <div key={alert.id} className="group cursor-default space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        alert.type === 'SUCCESS' ? 'bg-green-500' :
                        alert.type === 'WARNING' ? 'bg-orange-500' : 'bg-blue-500'
                      }`}></div>
                      <p className="text-[11px] font-bold text-gray-900 uppercase tracking-tight">{alert.title}</p>
                    </div>
                    <span className="text-[8px] font-black text-gray-300 uppercase">{alert.time}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-medium pl-4 border-l border-gray-50">
                    {alert.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-gray-50 text-center">
               <button className="text-[9px] font-black uppercase tracking-widest text-blue-500 hover:underline">Clear Notification Hub</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
