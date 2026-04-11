'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Activity, Globe, Zap, ShieldCheck, Server, Cpu, Database, MapPin } from 'lucide-react';

interface Props {
  routingPath?: string;
  onNodeClick?: (node: { name: string; id: string; pool: string; region: string; latency: string }) => void;
  accentColor?: string;
}

export default function NetworkMap({ routingPath = 'MOSCOW', onNodeClick, accentColor = '#3b82f6' }: Props) {
  const [selectedNode, setSelectedNode] = useState<{ name: string; id: string; pool: string; region: string; latency: string } | null>(null);

  const nodes = [
    { name: 'Beijing', x: 100, y: 100, id: 'BJN-NODE-01', pool: '¥ 500M+ LIQUID', region: 'Asia-East', latency: '12ms' },
    { name: 'Moscow', x: 300, y: 60, id: 'MSK-NODE-03', pool: '₽ 5B+ LIQUID', region: 'Eurasia-West', latency: '14ms' },
    { name: 'Shanghai', x: 200, y: 150, id: 'SHG-NODE-02', pool: '¥ 200M+ LIQUID', region: 'Asia-East', latency: '18ms' },
  ];

  const handleNodeClick = (node: typeof nodes[0]) => {
    setSelectedNode(node);
    if (onNodeClick) onNodeClick(node);
  };

  const getPathD = () => {
    if (routingPath === 'SHANGHAI') {
      return "M 300 60 Q 250 100, 200 150 T 100 100";
    }
    return "M 300 60 Q 200 20, 100 100";
  };

  return (
    <section className="bg-gray-50 p-12 rounded-[4.5rem] border border-gray-100 relative overflow-hidden group min-h-[550px] flex flex-col shadow-inner">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

      <header className="mb-16 flex justify-between items-center relative z-10">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Global Corridors</h3>
          <p className="text-3xl font-black text-gray-900 italic uppercase leading-none">Node Connectivity</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center space-x-3 text-green-600 shadow-xl">
          <Activity size={20} className="animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">Node Link Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative z-10 flex-1">
        <div className="lg:col-span-2 relative flex items-center justify-center pt-10">
          <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
            {/* Connection Path */}
            <motion.path 
              d={getPathD()} 
              fill="none" 
              stroke={accentColor}
              strokeWidth="2.5" 
              strokeDasharray="6,6"
              animate={{ strokeDashoffset: [0, -30] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="opacity-20"
            />
            
            {nodes.map((node) => {
              const isActive = selectedNode?.id === node.id;
              const isWired = (routingPath === 'MOSCOW' && (node.name === 'Moscow' || node.name === 'Beijing')) || 
                              (routingPath === 'SHANGHAI' && (node.name === 'Moscow' || node.name === 'Shanghai' || node.name === 'Beijing'));
              
              return (
                <g 
                  key={node.name} 
                  onClick={() => handleNodeClick(node)}
                  className="cursor-pointer group/node"
                >
                  <motion.circle 
                    cx={node.x} cy={node.y} r={isActive ? 14 : 9} 
                    fill={isActive ? "#000" : isWired ? accentColor : "#e5e7eb"} 
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="shadow-2xl transition-colors duration-500"
                  />
                  <text 
                    x={node.x} y={node.y + 35} 
                    textAnchor="middle" 
                    className={`text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${
                      isActive ? 'fill-black' : 'fill-gray-400 group-hover/node:fill-gray-600'
                    }`}
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <aside className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div 
                key={selectedNode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <header className="space-y-3">
                  <div className="flex items-center space-x-2 text-blue-500">
                    <MapPin size={14} />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">{selectedNode.name} HUB</h3>
                  </div>
                  <p className="text-3xl font-black italic tracking-tighter uppercase">{selectedNode.id}</p>
                </header>

                <div className="space-y-8">
                  <div className="flex items-center space-x-5 group/item">
                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover/item:text-black transition-colors"><Server size={18} /></div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black uppercase text-gray-300">Region</p>
                      <p className="text-xs font-bold text-gray-900 uppercase tracking-tight">{selectedNode.region}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-5 group/item">
                    <div className="p-3 bg-gray-50 rounded-2xl text-green-500 group-hover/item:scale-110 transition-transform"><Zap size={18} fill="currentColor" /></div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black uppercase text-gray-300">Sync Status</p>
                      <p className="text-xs font-black text-green-600 uppercase tracking-tight">Optimal · {selectedNode.latency}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-5 group/item">
                    <div className="p-3 bg-gray-50 rounded-2xl text-blue-500 group-hover/item:rotate-12 transition-transform"><Database size={18} /></div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black uppercase text-gray-300">Available Reserve</p>
                      <p className="text-xs font-black text-gray-900 mono uppercase tracking-tight">{selectedNode.pool}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-50 space-y-4">
                   <div className="flex justify-between items-center text-[9px] font-black uppercase text-gray-400 tracking-widest">
                      <span>Corridor Health</span>
                      <span>99.9%</span>
                   </div>
                   <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: '99.9%' }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                      />
                   </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30 px-6">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center border-2 border-dashed border-gray-200">
                  <Globe size={40} className="text-gray-300" />
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 leading-relaxed">
                    Select a node to<br />audit local liquidity
                  </p>
                  <p className="text-[8px] font-bold text-gray-300 uppercase italic">Centralized node control enabled</p>
                </div>
              </div>
            )}
          </AnimatePresence>
          
          <div className="pt-10 border-t border-gray-50 flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3 text-blue-600">
               <ShieldCheck size={14} strokeWidth={3} />
               <span className="text-[9px] font-black uppercase tracking-widest">Protocol v2.4</span>
            </div>
            {selectedNode && (
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors"
              >
                Clear Audit
              </button>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
