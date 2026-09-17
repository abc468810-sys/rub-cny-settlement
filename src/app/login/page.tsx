'use client';

import { useState } from 'react';
import { login } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, ShieldCheck, Anchor, Server, Lock, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/components/ui/LanguageProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { dict } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-12 relative z-10"
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-8">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="p-6 bg-black rounded-[2.5rem] text-white shadow-2xl relative"
            >
              <Anchor size={48} />
              <motion.div 
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-4 border-white"
              ></motion.div>
            </motion.div>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic leading-none">Trade Gateway</h1>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">{dict.trade_remittance || 'RUB-CNY Specialized Remittance'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-12 rounded-[4rem] border border-gray-100 shadow-[0_40px_80px_rgba(0,0,0,0.08)]">
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center space-x-2">
                <Server size={12} />
                <span>Authorized Entity Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-lg font-bold border-b border-gray-100 focus:border-black outline-none py-4 transition-all bg-transparent placeholder:opacity-20"
                placeholder="compliance@company.co"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center space-x-2">
                <Lock size={12} />
                <span>Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-lg font-bold border-b border-gray-100 focus:border-black outline-none py-4 transition-all bg-transparent placeholder:opacity-20"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="p-5 bg-orange-50 border border-orange-100 rounded-2xl">
               <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest leading-relaxed">
                 {dict.exclusive_notice || 'Notice: This terminal is strictly for trade-related RUB to CNY remittance. All non-trade instructions will be auto-blocked.'}
               </p>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-7 rounded-3xl text-xs font-black uppercase tracking-[0.3em] hover:opacity-90 transition-all flex justify-center items-center space-x-4 shadow-2xl shadow-black/10"
          >
            {loading ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <>
                <span>Access Secure Node</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="text-center space-y-6">
          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em] leading-relaxed italic opacity-60">
            Strictly Trade-Only Compliance Node. <br />
            No secondary services or crypto-exchanges supported.
          </p>
          
          <div className="flex items-center justify-center space-x-6 opacity-20 grayscale">
             <ShieldCheck size={16} />
             <Lock size={16} />
             <Globe size={16} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
