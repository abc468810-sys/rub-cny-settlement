'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FileText, Download, Calendar, ChevronRight, Check, PieChart, ShieldAlert, TrendingUp, BarChart3, Globe } from 'lucide-react';
import ExportOverlay from '../ui/ExportOverlay';
import { useNotify } from '../ui/NotificationProvider';
import { useLanguage } from '../ui/LanguageProvider';

export default function ReportsClient() {
  const { notify } = useNotify();
  const { dict } = useLanguage();
  const [isExporting, setIsExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  const triggerExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setSuccess(true);
      notify('SUCCESS', 'Institutional statement generated.');
      setTimeout(() => setSuccess(false), 3000);
    }, 3000);
  };

  const summaries = [
    { label: 'Total RUB Inflow', value: '₽ 45,200,000', change: '+12.4%', icon: <TrendingUp size={14} /> },
    { label: 'Total CNY Outflow', value: '¥ 3,456,780', change: '+11.8%', icon: <BarChart3 size={14} /> },
    { label: 'Avg Node Latency', value: '14.2ms', change: '-2ms', icon: <Activity size={14} /> },
  ];

  return (
    <div className="space-y-24">
      <ExportOverlay isOpen={isExporting} onComplete={() => {}} title="Compiling Q1 Ledger" />
      
      <header className="flex justify-between items-end px-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Institutional Accounting</p>
          <h1 className="text-5xl font-black tracking-tighter text-gray-900 italic uppercase">Trade Reports</h1>
        </div>
        <button 
          onClick={triggerExport}
          disabled={isExporting}
          className={`flex items-center space-x-3 px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all ${
            success ? 'bg-green-600 text-white' : 'bg-black text-white hover:opacity-90'
          }`}
        >
          {success ? <Check size={18} /> : <FileText size={18} />}
          <span>{success ? 'Generated' : 'Generate Q1 Statement'}</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {summaries.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-8 group hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{s.label}</p>
              <div className="p-2 bg-gray-50 rounded-lg text-gray-300 group-hover:text-blue-500 transition-colors">{s.icon}</div>
            </div>
            <div className="flex justify-between items-end">
              <p className="text-3xl font-light tracking-tighter italic mono">{s.value}</p>
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{s.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
        {/* Monthly Tax Liability Simulation */}
        <section className="bg-gray-900 text-white p-16 rounded-[4.5rem] shadow-2xl space-y-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] -rotate-12 group-hover:scale-110 transition-transform duration-1000">
            <PieChart size={300} strokeWidth={4} />
          </div>
          <header className="flex justify-between items-start relative z-10">
            <div>
              <div className="flex items-center space-x-3 text-blue-400 mb-6">
                <ShieldAlert size={20} />
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em]">Tax Compliance</h3>
              </div>
              <h2 className="text-4xl font-black tracking-tighter leading-none italic uppercase">Monthly Liability</h2>
            </div>
          </header>
          
          <div className="space-y-10 relative z-10">
            <div className="flex justify-between items-end border-b border-white/5 pb-8">
               <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Estimated VAT (CNY)</span>
               <span className="text-5xl font-black italic tracking-tighter mono">¥ 1,240.89</span>
            </div>
            <div className="grid grid-cols-2 gap-8 pt-4">
               <div>
                 <p className="text-[8px] font-black uppercase text-gray-600 mb-1">Calculation Base</p>
                 <p className="text-xs font-bold mono">RUB 45.2M</p>
               </div>
               <div className="text-right">
                 <p className="text-[8px] font-black uppercase text-gray-600 mb-1">Node Jurisdiction</p>
                 <p className="text-xs font-bold uppercase italic">Beijing Hub</p>
               </div>
            </div>
            <p className="text-[9px] text-gray-500 font-medium leading-relaxed uppercase tracking-widest italic opacity-60">
              Computed in real-time based on cross-border trade throughput and corridor-specific regulatory frameworks.
            </p>
          </div>
        </section>

        <section className="bg-white p-16 rounded-[4.5rem] border border-gray-100 shadow-sm space-y-16">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-900 italic">Historical Archive</h3>
          <div className="space-y-6">
            {[
              { month: 'February 2026', volume: '₽ 12,400,000', status: 'Finalized', node: 'MSK-03' },
              { month: 'January 2026', volume: '₽ 10,800,000', status: 'Finalized', node: 'BJN-01' },
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={triggerExport}
                className="flex items-center justify-between p-10 bg-gray-50 rounded-[3rem] border border-gray-50 group hover:border-black transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-8">
                  <div className="p-5 bg-white rounded-2xl shadow-sm text-gray-400 group-hover:text-black transition-colors">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-lg font-black uppercase text-gray-900 italic">{item.month}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.volume}</p>
                      <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                      <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Node: {item.node}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] bg-white px-4 py-2 rounded-full border border-gray-100 group-hover:border-black transition-colors">{item.status}</span>
                  <ChevronRight size={24} className="text-gray-200 group-hover:translate-x-2 group-hover:text-black transition-all" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const Activity = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);
