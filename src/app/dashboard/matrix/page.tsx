'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Database, Globe, Lock, Activity, Server, Cpu, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MatrixAuditPage() {
  const [blocks, setBlocks] = useState<{ id: string; hash: string; status: string; node: string }[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const nodes = ['NODE_BJN', 'NODE_MSK', 'AUDIT_VTR', 'BRIDGE_X1'];
    const interval = setInterval(() => {
      const newBlock = {
        id: `BLOCK_${Math.floor(Math.random() * 1000000)}`,
        hash: `0x${Math.random().toString(16).substr(2, 12)}...`,
        status: 'COMMITTED',
        node: nodes[Math.floor(Math.random() * nodes.length)]
      };
      setBlocks(prev => [newBlock, ...prev.slice(0, 5)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-24">
      <header className="mb-20 px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-2">Institutional Transparency</p>
        <h1 className="text-5xl font-black tracking-tighter text-gray-900 italic uppercase">Security Matrix</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-4">
        <section className="lg:col-span-2 space-y-12">
          <div className="bg-gray-50 rounded-[5rem] p-16 border border-gray-100 flex items-center justify-center min-h-[650px] relative overflow-hidden group shadow-inner">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            
            <svg viewBox="0 0 400 400" className="w-full h-full max-w-xl overflow-visible relative z-10">
              {/* Central Core */}
              <motion.circle 
                cx="200" cy="200" r="50" 
                fill="black" 
                animate={{ scale: hoveredNode ? 1.02 : [1, 1.03, 1], filter: hoveredNode ? 'blur(4px)' : 'blur(0px)' }} 
                transition={{ duration: 4, repeat: Infinity }}
              />
              <text x="200" y="270" textAnchor="middle" className="text-[10px] font-black uppercase tracking-widest fill-gray-400 italic">Core_Ledger</text>
              
              {/* Satellite Nodes with Tiered Logic */}
              {[
                { x: 70, y: 70, label: 'Node_BJN', trust: 99.9, color: '#3b82f6' },
                { x: 330, y: 70, label: 'Node_MSK', trust: 99.8, color: '#3b82f6' },
                { x: 70, y: 330, label: 'Audit_VTR', trust: 100, color: '#10b981' },
                { x: 330, y: 330, label: 'Bridge_X1', trust: 99.5, color: '#8b5cf6' }
              ].map((node, i) => (
                <g 
                  key={i} 
                  className="group/node cursor-pointer"
                  onMouseEnter={() => setHoveredNode(node.label)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <motion.path 
                    d={`M 200 200 L ${node.x} ${node.y}`} 
                    stroke={node.color} 
                    strokeWidth="2" 
                    strokeDasharray="4,4"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    className="opacity-20"
                  />
                  
                  <motion.circle 
                    cx={node.x} cy={node.y} r="24" 
                    fill={hoveredNode === node.label ? "#000" : node.color} 
                    whileHover={{ scale: 1.25 }}
                    className="shadow-2xl transition-colors duration-300"
                  />
                  <text x={node.x} y={node.y + 45} textAnchor="middle" className="text-[8px] font-black uppercase tracking-widest fill-gray-400 group-hover/node:fill-black transition-colors">{node.label}</text>
                  
                  <g className="opacity-0 group-hover/node:opacity-100 transition-opacity pointer-events-none">
                    <rect x={node.x - 40} y={node.y - 65} width="80" height="30" rx="10" fill="black" />
                    <text x={node.x} y={node.y - 45} textAnchor="middle" fill="white" className="text-[7px] font-black uppercase tracking-tighter">TRUST: {node.trust}%</text>
                  </g>
                </g>
              ))}
            </svg>

            <div className="absolute top-12 right-12 space-y-6">
              <div className="flex items-center space-x-4 bg-white px-6 py-3 rounded-3xl border border-gray-100 shadow-xl">
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-xs font-black uppercase tracking-widest text-gray-900">Sync: 100.0%</span>
              </div>
              <div className="flex items-center space-x-4 bg-white px-6 py-3 rounded-3xl border border-gray-100 shadow-xl">
                 <Activity size={16} className="text-blue-500" />
                 <span className="text-xs font-black uppercase tracking-widest text-gray-900">4.2 TH/s</span>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-12">
          <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm space-y-12">
            <header className="flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Block Explorer</h3>
              <Database size={18} className="text-gray-200" />
            </header>
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {blocks.map((block) => (
                  <motion.div 
                    key={block.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-4 group hover:border-black transition-all cursor-crosshair shadow-sm hover:shadow-xl"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-[11px] font-black text-gray-900 italic">{block.id}</p>
                      <span className="text-[8px] font-black uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">{block.node}</span>
                    </div>
                    <p className="text-[10px] font-mono text-gray-400 break-all leading-relaxed group-hover:text-gray-900 transition-colors">{block.hash}</p>
                    <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
                       <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                       <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Verified & Committed</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-black text-white p-12 rounded-[4.5rem] shadow-2xl space-y-10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-12 opacity-[0.05] -rotate-12 group-hover:scale-110 transition-transform duration-1000">
                <Database size={200} strokeWidth={4} />
             </div>
             <div className="flex items-center space-x-4 text-blue-500 relative z-10">
                <Lock size={24} strokeWidth={3} />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] leading-none">Security Matrix</span>
             </div>
             <p className="text-[13px] font-medium leading-relaxed italic opacity-60 relative z-10">
               All institutional instructions are hashed and synchronized across the node pool, ensuring tamper-proof cross-border auditability via the SPFS-CIPS bridge.
             </p>
             <div className="pt-8 relative z-10 border-t border-white/10">
                <button className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-all flex items-center space-x-3 group/btn">
                  <span>Verify Node Reputation</span>
                  <Globe size={14} className="group-hover/btn:rotate-180 transition-transform duration-1000" />
                </button>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
