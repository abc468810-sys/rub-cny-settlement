'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Globe, ArrowRight, ShieldCheck, Zap, Anchor, Activity } from 'lucide-react';
import { useLanguage } from '@/components/ui/LanguageProvider';

export default function LandingPage() {
  const router = useRouter();
  const { dict } = useLanguage();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-black selection:bg-blue-100 relative overflow-hidden">
      {/* Visual background decoration */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/30 rounded-full blur-3xl -mr-96 -mt-96 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gray-50 rounded-full blur-3xl -ml-72 -mb-72 pointer-events-none"></div>

      <nav className="p-10 flex justify-between items-center max-w-7xl mx-auto w-full relative z-10">
        <div className="flex items-center space-x-3 text-2xl font-black tracking-tighter">
          <div className="w-3 h-3 rounded-full bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
          <span className="italic uppercase">TradeBridge</span>
        </div>
        <button 
          onClick={() => router.push('/login')}
          className="text-[11px] font-black uppercase tracking-[0.2em] border border-gray-100 bg-white px-10 py-4 rounded-2xl hover:border-black hover:shadow-xl transition-all"
        >
          Node Access
        </button>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-12 lg:p-24 text-center max-w-6xl mx-auto space-y-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          <div className="inline-flex items-center space-x-3 bg-blue-50 px-6 py-2.5 rounded-full border border-blue-100 text-blue-600 mb-4 shadow-sm">
            <Anchor size={16} strokeWidth={3} />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] leading-none">
              {dict.trade_remittance || 'Exclusive RUB-CNY Trade Corridor'}
            </span>
          </div>
          
          <h1 className="text-7xl lg:text-[10rem] font-black tracking-tighter leading-none uppercase italic text-gray-900">
            Institutional<br />Trade Node
          </h1>
          
          <p className="text-sm lg:text-xl text-gray-400 font-medium max-w-3xl mx-auto leading-relaxed italic uppercase tracking-widest opacity-80">
            {dict.exclusive_notice || 'Specialized high-fidelity gateway for Russo-Chinese trade liquidity. No secondary services or speculative exchange.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full flex justify-center"
        >
          <button 
            onClick={() => router.push('/login')}
            className="group flex items-center space-x-6 bg-black text-white px-16 py-8 rounded-[3rem] text-sm font-black uppercase tracking-[0.4em] shadow-[0_30px_60px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 transition-all"
          >
            <span>Merchant Hub</span>
            <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform duration-500" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-16 w-full pt-24 border-t border-gray-50"
        >
          {[
            { label: 'Network', value: 'CIPS-SPFS Bridge', icon: <Globe size={20} /> },
            { label: 'Compliance', value: 'Matrix Multi-Sig', icon: <ShieldCheck size={20} /> },
            { label: 'Health', value: '12ms Response', icon: <Activity size={20} /> },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center space-y-6 group">
              <div className="p-6 bg-gray-50 rounded-[2rem] text-gray-300 border border-gray-100 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-500 shadow-sm">
                {stat.icon}
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">{stat.label}</p>
                <p className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </main>

      <footer className="p-12 border-t border-gray-50 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.6em] text-gray-300 relative z-10">
        <p>© 2026 GLOBAL SETTLEMENT AUTHORITY</p>
        <p className="italic">BJN-MSK Node v4.0.2-Stable</p>
      </footer>
    </div>
  );
}
