'use client';

import { useState } from 'react';
import { addBeneficiary } from '@/lib/actions';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, Building2, X } from 'lucide-react';

interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
}

export default function BeneficiaryManager({ initialData = [] }: { initialData: Beneficiary[] }) {
  const [beneficiaries, setBeneficiaries] = useState(initialData);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addBeneficiary(name, account);
    setBeneficiaries([{ id: Math.random().toString(), name, accountNumber: account }, ...beneficiaries]);
    setName('');
    setAccount('');
    setIsAdding(false);
  };

  return (
    <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Whitelisted Targets</h3>
          <p className="text-xl font-black text-gray-900 leading-none">Beneficiaries</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="p-3 bg-black text-white rounded-2xl hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
        </button>
      </header>

      <div className="space-y-4">
        {beneficiaries.map((b) => (
          <div key={b.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-50 group hover:border-black transition-all">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white rounded-xl border border-gray-100 text-gray-400 group-hover:text-blue-500 transition-colors">
                <User size={16} />
              </div>
              <div>
                <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{b.name}</p>
                <p className="text-[9px] text-gray-400 font-mono tracking-widest">{b.accountNumber}</p>
              </div>
            </div>
            <span className="text-[8px] font-black uppercase bg-green-50 text-green-600 px-2 py-1 rounded-md">Verified</span>
          </div>
        ))}
        {beneficiaries.length === 0 && !isAdding && (
          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest text-center py-10 italic">No beneficiaries saved.</p>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/5 backdrop-blur-md">
            <motion.form 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleAdd}
              className="w-full max-w-md bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-100 space-y-10 relative"
            >
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="absolute top-10 right-10 p-2 text-gray-300 hover:text-black transition-colors"
              >
                <X size={24} />
              </button>
              
              <header className="space-y-2">
                <h3 className="text-3xl font-black tracking-tighter">New Target</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">White-list a CNY account</p>
              </header>

              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Account Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-lg font-bold border-b border-gray-100 focus:border-black outline-none py-2 bg-transparent"
                    placeholder="e.g. Export Partner Shanghai"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Account Number</label>
                  <input 
                    type="text" 
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    className="w-full text-lg font-bold border-b border-gray-100 focus:border-black outline-none py-2 bg-transparent mono"
                    placeholder="CNY Target A/C"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-black text-white py-6 rounded-3xl text-xs font-black uppercase tracking-widest shadow-xl hover:opacity-90 transition-opacity"
              >
                Save to White-list
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
