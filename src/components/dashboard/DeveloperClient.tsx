'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Code, Key, Copy, RefreshCw, Terminal, Shield, Zap, Check, BarChart } from 'lucide-react';

export default function DeveloperClient() {
  const [apiKey, setApiKey] = useState('sk_live_node_77a1x902bc3d4e5f');
  const [isRotating, setIsRotating] = useState(false);
  const [copied, setCopied] = useState(false);

  const rotateKey = () => {
    setIsRotating(true);
    setTimeout(() => {
      setApiKey(`sk_live_node_${Math.random().toString(16).substr(2, 16)}`);
      setIsRotating(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-24">
      <header>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Institutional API</p>
        <h1 className="text-4xl font-black tracking-tighter text-gray-900">Developer Console</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <section className="lg:col-span-2 space-y-12">
          <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm space-y-12">
            <header className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Key size={16} className="text-blue-500" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-900">Live Secret Key</h3>
              </div>
              <span className="text-[8px] font-black uppercase bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100">Production Active</span>
            </header>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 w-full bg-gray-50 p-6 rounded-2xl font-mono text-xs text-gray-900 break-all border border-gray-100">
                {apiKey}
              </div>
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <button 
                  onClick={copyToClipboard}
                  className="flex-1 md:flex-none p-4 bg-white border border-gray-100 rounded-2xl hover:border-black transition-all group"
                >
                  {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-400 group-hover:text-black" />}
                </button>
                <button 
                  onClick={rotateKey}
                  disabled={isRotating}
                  className="flex-1 md:flex-none p-4 bg-white border border-gray-100 rounded-2xl hover:border-black transition-all group"
                >
                  <RefreshCw size={18} className={`text-gray-400 group-hover:text-black ${isRotating ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-50 flex items-start space-x-4">
              <Shield size={16} className="text-gray-300 mt-1" />
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic uppercase tracking-widest">
                This key grants access to high-value RUB-CNY settlement corridors. Store it securely. Never expose it in client-side code.
              </p>
            </div>
          </div>

          {/* Usage Analytics Simulation */}
          <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm space-y-10">
             <header className="flex justify-between items-center">
                <div className="flex items-center space-x-3 text-gray-400">
                   <BarChart size={16} />
                   <h3 className="text-[10px] font-black uppercase tracking-widest">API Throughput</h3>
                </div>
                <span className="text-[8px] font-black uppercase text-blue-600">Last 24 Hours</span>
             </header>
             <div className="h-32 flex items-end gap-2 px-4">
                {[40, 70, 45, 90, 65, 30, 85, 50].map((h, i) => (
                  <motion.div 
                    key={i}
                    className="flex-1 bg-gray-50 rounded-t-lg group hover:bg-black transition-colors"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05 }}
                  />
                ))}
             </div>
          </div>

          <div className="bg-gray-900 rounded-[4rem] p-12 space-y-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
              <Terminal size={300} strokeWidth={4} />
            </div>
            
            <header className="flex justify-between items-center relative z-10">
              <div className="flex items-center space-x-3">
                <Code size={16} className="text-blue-400" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">API Handshake</h3>
              </div>
            </header>

            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">POST /v2/instructions/settle</p>
                <div className="bg-black/50 p-8 rounded-3xl font-mono text-[9px] text-green-500 leading-loose overflow-x-auto">
                  <pre>
{`curl -X POST https://api.rub-cny.node/v2/settle \\
  -H "Authorization: Bearer sk_live_node_..." \\
  -d '{
    "amount": 1000000,
    "source_ccy": "RUB",
    "target_ccy": "CNY",
    "beneficiary": "407028..."
  }'`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-12">
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Documentation</h3>
            <div className="space-y-6">
              {[
                { label: 'Core Integration', desc: 'RUB to CNY REST API' },
                { label: 'Webhooks', desc: 'Real-time settlement alerts' },
                { label: 'Security Node', desc: 'IP Whitelisting & MTLS' },
              ].map((item, i) => (
                <div key={i} className="group cursor-pointer space-y-1">
                  <p className="text-xs font-black uppercase text-gray-900 group-hover:text-blue-600 transition-colors">{item.label}</p>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase opacity-60">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-10 rounded-[3rem] space-y-6">
            <div className="flex items-center space-x-3 text-blue-600">
              <Zap size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Sandbox Mode</span>
            </div>
            <p className="text-[10px] text-blue-600 font-bold leading-relaxed uppercase tracking-widest opacity-70 italic">
              Use the 'sk_test_...' key to simulate settlements without affecting your live RUB reserves.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
