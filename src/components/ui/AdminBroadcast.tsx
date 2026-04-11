'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X, AlertTriangle, Send, Check } from 'lucide-react';

import { useNotify } from './NotificationProvider';

export default function AdminBroadcast() {
  const { notify } = useNotify();
  const [msg, setMsg] = useState('Moscow Node Link Maintenance scheduled for 02:00 MSK.');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBroadcast = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setSuccess(true);
      notify('WARNING', 'Institutional Advisory broadcasted to all nodes.');
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <section className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] -rotate-12">
        <Megaphone size={200} strokeWidth={4} />
      </div>

      <header className="relative z-10">
        <div className="flex items-center space-x-3 text-gray-400 mb-4">
          <Megaphone size={14} />
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Emergency Broadcast</h3>
        </div>
        <h2 className="text-3xl font-black tracking-tighter text-gray-900 leading-none">Global Advisory</h2>
      </header>

      <div className="space-y-8 relative z-10">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Merchant Alert Message</label>
          <textarea 
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="w-full h-24 bg-gray-50 rounded-2xl border border-gray-50 focus:border-black outline-none p-6 text-[11px] font-medium leading-relaxed italic transition-all resize-none"
          />
        </div>

        <button 
          onClick={handleBroadcast}
          disabled={isBroadcasting}
          className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 shadow-xl shadow-black/5 ${
            success ? 'bg-green-600 text-white' : 'bg-black text-white hover:opacity-90'
          }`}
        >
          {isBroadcasting ? <span className="animate-spin text-lg">◌</span> : (
            <>
              {success ? <Check size={14} /> : <Send size={14} />}
              <span>{success ? 'Broadcasted' : 'Execute Broadcast'}</span>
            </>
          )}
        </button>
      </div>

      <div className="pt-8 border-t border-gray-50 flex items-center space-x-3 opacity-30">
         <AlertTriangle size={12} className="text-orange-500" />
         <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Push notification will be sent to 452 active merchant nodes.</p>
      </div>
    </section>
  );
}
