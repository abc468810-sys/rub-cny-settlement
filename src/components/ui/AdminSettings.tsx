'use client';

import { updateSystemConfig } from '@/lib/actions';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Percent, Zap, Server, ShieldCheck, Save, Check, Shuffle, Megaphone, Palette, Type, Globe, Activity, ShieldAlert } from 'lucide-react';

interface Props {
  initialConfig: {
    fee: number;
    routingPath: string;
    isMaintenance: boolean;
    brandName: string;
    accentColor: string;
    advisoryText: string;
  };
}

const COLORS = [
  { label: 'Blue', hex: '#3b82f6' },
  { label: 'Green', hex: '#10b981' },
  { label: 'Red', hex: '#ef4444' },
  { label: 'Purple', hex: '#8b5cf6' },
  { label: 'Black', hex: '#000000' },
];

export default function AdminSettings({ initialConfig }: Props) {
  const [fee, setFee] = useState(initialConfig.fee.toString());
  const [routing, setRouting] = useState(initialConfig.routingPath);
  const [isMaint, setIsMaint] = useState(initialConfig.isMaintenance);
  const [brand, setBrand] = useState(initialConfig.brandName);
  const [accent, setAccent] = useState(initialConfig.accentColor);
  const [advisory, setAdvisory] = useState(initialConfig.advisoryText);
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSystemConfig({
        fee: parseFloat(fee),
        routingPath: routing,
        isMaintenance: isMaint,
        brandName: brand,
        accentColor: accent,
        advisoryText: advisory
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      alert('Error saving config');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white p-16 rounded-[4rem] border border-gray-100 shadow-sm space-y-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-20 opacity-[0.02] -rotate-12 select-none pointer-events-none">
        <Settings size={300} strokeWidth={4} />
      </div>

      <header className="flex justify-between items-end relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-gray-400 mb-4">
             <Settings size={14} />
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">System Configuration</h3>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-gray-900 leading-none uppercase italic">Global Policy</h2>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
        <div className="space-y-16">
          <div className="space-y-6">
             <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center space-x-2">
                <Percent size={12} />
                <span>Standard Settlement Fee</span>
             </label>
             <div className="flex items-end space-x-4">
                <input 
                  type="text" 
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  className="text-6xl font-black text-gray-900 mono tracking-tighter border-b border-gray-100 focus:border-black transition-all outline-none w-24 bg-transparent"
                />
                <span className="text-3xl font-black text-gray-300 mono pb-2">%</span>
             </div>
          </div>

          <div className="space-y-10 pt-10 border-t border-gray-50">
             <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center space-x-2">
                  <Type size={12} />
                  <span>Platform Identity</span>
                </label>
                <input 
                  type="text" 
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full text-2xl font-black border-b border-gray-100 focus:border-black outline-none py-2 bg-transparent mono tracking-tighter uppercase"
                />
             </div>

             <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center space-x-2">
                  <Palette size={12} />
                  <span>Accent Identity</span>
                </label>
                <div className="flex items-center space-x-4">
                  {COLORS.map((c) => (
                    <button 
                      key={c.hex}
                      onClick={() => setAccent(c.hex)}
                      className={`w-10 h-10 rounded-full border-4 transition-all relative ${
                        accent === c.hex ? 'border-gray-900 scale-110 shadow-lg' : 'border-white hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {accent === c.hex && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check size={14} className="text-white mix-blend-difference" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-12 border-l border-gray-50 pl-16">
           <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Network Routing</p>
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={() => setRouting('MOSCOW')}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                    routing === 'MOSCOW' ? 'bg-black text-white border-black shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-black hover:text-black'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Zap size={14} className={routing === 'MOSCOW' ? 'text-blue-400' : ''} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Primary MSK-BJN</span>
                  </div>
                  {routing === 'MOSCOW' && <Check size={12} />}
                </button>
                <button 
                  onClick={() => setRouting('SHANGHAI')}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                    routing === 'SHANGHAI' ? 'bg-black text-white border-black shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-black hover:text-black'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Shuffle size={14} className={routing === 'SHANGHAI' ? 'text-blue-400' : ''} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Failover SHG-BJN</span>
                  </div>
                  {routing === 'SHANGHAI' && <Check size={12} />}
                </button>
              </div>
           </div>
           
           <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Live Node Controls</p>
              <div className="grid grid-cols-2 gap-4">
                 <button className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-black transition-all">
                    <span className="text-[9px] font-black uppercase text-gray-400 group-hover:text-black">Node MSK-03</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                 </button>
                 <button className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-between group hover:border-red-500 transition-all">
                    <span className="text-[9px] font-black uppercase text-red-400 group-hover:text-red-600">Simulate Outage</span>
                    <ShieldAlert size={12} className="text-red-500" />
                 </button>
              </div>
           </div>

           <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">System Lifecycle</p>
              <div className="space-y-4">
                <button 
                  onClick={() => setIsMaint(!isMaint)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
                    isMaint ? 'bg-orange-500 text-white border-orange-500 shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-orange-500 hover:text-orange-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Megaphone size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Maintenance Mode</span>
                  </div>
                  {isMaint && <Check size={12} />}
                </button>
                
                <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase text-gray-400">Global Advisory Text</label>
                  <textarea 
                    value={advisory}
                    onChange={(e) => setAdvisory(e.target.value)}
                    className="w-full h-20 bg-gray-50 rounded-xl border border-gray-50 focus:border-black outline-none p-4 text-[10px] font-medium leading-relaxed italic resize-none transition-all"
                    placeholder="Broadcast message to all nodes..."
                  />
                </div>
              </div>
           </div>
        </div>
      </div>

      <footer className="pt-12 border-t border-gray-100 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-3">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 font-mono">Gateway: Synchronized</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center space-x-3 px-12 py-6 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-black/5 ${
            success ? 'bg-green-600 text-white' : 'bg-black text-white hover:opacity-90'
          }`}
        >
          {saving ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Settings size={16} /></motion.div> : (
             <>
               {success ? <Check size={16} /> : <Save size={16} />}
               <span>{success ? 'Policy Deployed' : 'Sync Gateway Policy'}</span>
             </>
          )}
        </button>
      </footer>
    </section>
  );
}
