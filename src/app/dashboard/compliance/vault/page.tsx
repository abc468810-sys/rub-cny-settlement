'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ShieldCheck, Download, Search, Lock } from 'lucide-react';

const MOCK_CERTIFICATES = [
  { id: 'CERT-891022', ref: 'RUS-CN-891022', date: '2026-04-08', status: 'VERIFIED', node: 'BJN-01' },
  { id: 'CERT-921104', ref: 'RUS-CN-921104', date: '2026-04-07', status: 'VERIFIED', node: 'MSK-03' },
  { id: 'CERT-773412', ref: 'RUS-CN-773412', date: '2026-04-05', status: 'VERIFIED', node: 'BJN-01' },
];

export default function ComplianceVaultPage() {
  const [searchTerm, setSearchInput] = useState('');

  return (
    <div className="space-y-24">
      <header className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Institutional Security</p>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900">Compliance Vault</h1>
        </div>
        <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
          <Lock size={14} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-widest">Encrypted Storage</span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12">
        <section className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm space-y-12">
          <header className="flex flex-col md:flex-row justify-between lg:items-center gap-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">Security Certificates</h3>
            <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 focus-within:border-black transition-all">
              <Search size={14} className="text-gray-300" />
              <input 
                type="text" 
                placeholder="Reference ID..." 
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none w-48 placeholder:text-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </header>

          <div className="space-y-4">
            {MOCK_CERTIFICATES.filter(c => c.ref.includes(searchTerm.toUpperCase())).map((cert, i) => (
              <motion.div 
                key={cert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-8 bg-gray-50 rounded-[2.5rem] border border-gray-50 group hover:border-black transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-6">
                  <div className="p-4 bg-white rounded-2xl shadow-sm text-gray-400 group-hover:text-blue-600 transition-colors">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase text-gray-900">{cert.id}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Transaction Ref: {cert.ref}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-12">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-gray-900">{cert.date}</p>
                    <p className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">Node: {cert.node}</p>
                  </div>
                  <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-300 hover:text-black transition-all shadow-sm">
                    <Download size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
