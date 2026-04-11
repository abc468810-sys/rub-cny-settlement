'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldAlert, Activity, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function StressTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<null | 'OPTIMAL' | 'THROTTLED'>(null);
  const [load, setLoad] = useState(0);

  const startTest = () => {
    setIsRunning(true);
    setResult(null);
    setLoad(0);
    
    const progressInterval = setInterval(() => {
      setLoad(prev => Math.min(prev + 1, 100));
    }, 30);

    // Simulated stress test steps
    setTimeout(() => {
      clearInterval(progressInterval);
      const outcome = Math.random() > 0.3 ? 'OPTIMAL' : 'THROTTLED';
      setIsRunning(false);
      setResult(outcome);
    }, 3500);
  };

  return (
    <section className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] -rotate-12">
        <Zap size={200} strokeWidth={4} />
      </div>

      <header className="relative z-10 flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 text-gray-400 mb-4">
            <Activity size={14} />
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Node Resilience</h3>
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-gray-900 leading-none italic">Stress Simulator</h2>
        </div>
        {isRunning && (
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl border border-red-100 flex items-center space-x-2 animate-pulse">
            <AlertTriangle size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Testing Load</span>
          </div>
        )}
      </header>

      <div className="space-y-8 relative z-10">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed max-w-sm">
          Execute a high-load synthetic burst to verify node auto-scaling, failover latency, and regional buffer stability.
        </p>

        <div className="space-y-6">
          {isRunning && (
            <div className="space-y-3">
              <div className="flex justify-between text-[8px] font-black uppercase text-gray-400">
                <span>Synthetic Pressure</span>
                <span>{load}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                <motion.div 
                  className="h-full bg-red-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${load}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-6">
            <button 
              onClick={startTest}
              disabled={isRunning}
              className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center space-x-3 shadow-xl shadow-black/5 ${
                isRunning ? 'bg-gray-100 text-gray-400' : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isRunning ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
              <span>{isRunning ? 'Load Active...' : 'Synthetic Burst'}</span>
            </button>

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl border ${
                    result === 'OPTIMAL' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-orange-50 border-orange-100 text-orange-600'
                  }`}
                >
                  {result === 'OPTIMAL' ? <CheckCircle2 size={12} /> : <ShieldAlert size={12} />}
                  <span className="text-[9px] font-black uppercase tracking-widest">Node {result}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-50 relative z-10">
        <div className="space-y-1 text-left">
          <p className="text-[8px] font-black uppercase text-gray-300">Failover Latency</p>
          <p className={`text-xl font-black mono ${isRunning ? 'text-gray-200' : 'text-gray-900'}`}>14ms</p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-[8px] font-black uppercase text-gray-300">Peak RPS (Synthetic)</p>
          <p className={`text-xl font-black mono ${isRunning ? 'text-blue-500' : 'text-gray-900'}`}>{isRunning ? '4,250' : '4,250'}</p>
        </div>
      </div>
    </section>
  );
}
