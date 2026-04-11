'use client';

import { approveKyc } from '@/lib/actions';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Check, Building2, User, Eye, X, FileText, Fingerprint, Globe, Lock } from 'lucide-react';
import { useNotify } from './NotificationProvider';

interface UserItem {
  id: string;
  email: string;
  name: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
}

export default function AdminUserList({ users }: { users: UserItem[] }) {
  const { notify } = useNotify();
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const handleApprove = async (id: string) => {
    setLoading(id);
    try {
      await approveKyc(id);
      notify('SUCCESS', 'KYC Approved & Entity Certified.');
      if (selectedUser?.id === id) {
        setSelectedUser({ ...selectedUser, status: 'APPROVED' });
      }
    } catch (e) {
      notify('ERROR', 'Approval failed.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-12">
      {users.map((u, idx) => (
        <motion.div 
          key={u.id} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: idx * 0.05 }}
          className="group flex flex-col space-y-4 pb-12 border-b border-gray-100 last:border-0 last:pb-0"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
               <div className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 group-hover:border-black transition-colors">
                  <User size={16} />
               </div>
               <div>
                 <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{u.name || u.email.split('@')[0]}</p>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic opacity-70 truncate max-w-[120px]">{u.email}</p>
               </div>
            </div>
            <div className="text-right">
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                u.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {u.status}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
             <button 
               onClick={() => setSelectedUser(u)}
               className="flex items-center space-x-2 text-[8px] font-black text-gray-300 uppercase tracking-widest hover:text-black transition-colors"
             >
                <Eye size={10} />
                <span>Inspect Dossier</span>
             </button>
             {u.status !== 'APPROVED' && (
                <button 
                  onClick={() => handleApprove(u.id)}
                  disabled={!!loading}
                  className="bg-black text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-green-600 transition-all disabled:opacity-20 shadow-xl shadow-black/5 flex items-center space-x-2"
                >
                  {loading === u.id ? <span className="animate-spin text-sm leading-none">◌</span> : (
                    <>
                      <ShieldCheck size={12} />
                      <span>Approve KYC</span>
                    </>
                  )}
                </button>
             )}
          </div>
        </motion.div>
      ))}

      {/* KYC Inspection Modal Refinement */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 lg:p-24 no-print">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl bg-white rounded-[4rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row h-[85vh] border-[1rem] border-gray-50"
            >
              <div className="flex-1 bg-gray-50 p-12 flex flex-col items-center justify-center border-r border-gray-100 relative group overflow-y-auto no-scrollbar">
                <div className="absolute top-8 left-8 flex items-center space-x-2">
                   <Lock size={16} className="text-gray-400" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Institutional Vault Access</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-20 pb-20">
                  {/* Document 1: License */}
                  <motion.div 
                    initial={{ opacity: 0, rotate: -5 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    className="w-72 h-96 bg-white border border-gray-200 rounded-xl shadow-lg p-8 flex flex-col space-y-6 hover:scale-105 transition-all relative"
                  >
                    <div className="absolute top-6 right-6 text-green-500 opacity-30"><ShieldCheck size={24} /></div>
                    <div className="w-12 h-12 rounded-full bg-blue-50"></div>
                    <div className="space-y-3">
                      <div className="h-2.5 w-3/4 bg-gray-100 rounded"></div>
                      <div className="h-2.5 w-1/2 bg-gray-100 rounded"></div>
                    </div>
                    <div className="flex-1 border-2 border-dashed border-gray-50 rounded-xl flex items-center justify-center">
                      <Building2 size={60} className="text-gray-50" />
                    </div>
                    <div className="pt-6 border-t border-gray-50 space-y-2">
                      <p className="text-[8px] font-black uppercase text-gray-300">Entity Registry Proof</p>
                      <p className="text-[10px] font-mono text-gray-400">HASH: 77A1...902B</p>
                    </div>
                  </motion.div>

                  {/* Document 2: Director ID */}
                  <motion.div 
                    initial={{ opacity: 0, rotate: 5 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-72 h-96 bg-white border border-gray-200 rounded-xl shadow-lg p-8 flex flex-col space-y-6 hover:scale-105 transition-all relative"
                  >
                    <div className="absolute top-6 right-6 text-blue-500 opacity-30"><User size={24} /></div>
                    <div className="w-12 h-12 rounded-lg bg-gray-50"></div>
                    <div className="space-y-3">
                      <div className="h-2.5 w-full bg-gray-100 rounded"></div>
                      <div className="h-2.5 w-2/3 bg-gray-100 rounded"></div>
                    </div>
                    <div className="flex-1 border border-gray-50 rounded-xl overflow-hidden bg-gray-50/50 flex items-center justify-center">
                       <Fingerprint size={64} className="text-gray-100" />
                    </div>
                    <div className="pt-6 border-t border-gray-50 space-y-2">
                      <p className="text-[8px] font-black uppercase text-gray-300">Authorized Official ID</p>
                      <p className="text-[10px] font-mono text-gray-400">BIOMETRIC_VERIFIED</p>
                    </div>
                  </motion.div>
                </div>
                
                <div className="mt-4 flex items-center space-x-10">
                   <button className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 hover:underline">Cross-Check CIPS Registry</button>
                   <button className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black">Download Bundle</button>
                </div>
              </div>

              <div className="w-full lg:w-[500px] p-16 flex flex-col justify-between bg-white relative">
                <header className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-black tracking-tighter text-gray-900 leading-none italic uppercase">Trade Audit</h3>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.4em] italic">{selectedUser.email}</p>
                  </div>
                  <button onClick={() => setSelectedUser(null)} className="p-3 hover:bg-gray-50 rounded-2xl transition-all">
                    <X size={28} className="text-gray-300 hover:text-black" />
                  </button>
                </header>

                <div className="space-y-16">
                   <div className="bg-gray-50 p-12 rounded-[3.5rem] space-y-12 border border-gray-100 shadow-inner">
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4 text-blue-600">
                           <Globe size={20} strokeWidth={3} />
                           <span className="text-[11px] font-black uppercase tracking-[0.2em] leading-none">Global Compliance Matrix</span>
                        </div>
                        <p className="text-[13px] font-medium leading-relaxed text-gray-500 italic">
                          Entity cross-referenced against international trade blacklists and Russo-Chinese regulatory databases. <span className="text-green-600 font-bold">100% CLEARANCE</span>.
                        </p>
                      </div>

                      <div className="space-y-6 pt-10 border-t border-gray-200">
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em]">
                           <span className="text-gray-400">Institutional Readiness</span>
                           <span className={selectedUser.status === 'APPROVED' ? 'text-green-600' : 'text-blue-600'}>
                             {selectedUser.status === 'APPROVED' ? '99.9% SCORE' : 'Vetting Score: 85%'}
                           </span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                           <motion.div 
                             className={`h-full ${selectedUser.status === 'APPROVED' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`}
                             initial={{ width: 0 }}
                             animate={{ width: selectedUser.status === 'APPROVED' ? '100%' : '85%' }}
                             transition={{ duration: 2, ease: [0.34, 1.56, 0.64, 1] }}
                           />
                        </div>
                      </div>
                   </div>
                </div>

                <footer className="space-y-6">
                   {selectedUser.status !== 'APPROVED' ? (
                      <button 
                        onClick={() => handleApprove(selectedUser.id)}
                        disabled={!!loading}
                        className="w-full bg-black text-white py-8 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-green-600 transition-all flex justify-center items-center space-x-4 shadow-2xl shadow-black/10"
                      >
                         {loading === selectedUser.id ? (
                           <div className="flex items-center space-x-3">
                             <RefreshCw size={20} className="animate-spin" />
                             <span>Authorizing Node...</span>
                           </div>
                         ) : (
                           <>
                             <ShieldCheck size={24} />
                             <span>Certify Entity</span>
                           </>
                         )}
                      </button>
                   ) : (
                      <div className="w-full bg-green-50 text-green-600 py-8 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] text-center flex justify-center items-center space-x-4 border-2 border-green-100 shadow-xl shadow-green-500/5">
                         <Check size={24} strokeWidth={3} />
                         <span>Onboarding Certified</span>
                      </div>
                   )}
                   <p className="text-center text-[8px] text-gray-300 font-black uppercase tracking-[0.5em]">Auth Node: BJN-MSK-GATE-01</p>
                </footer>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {users.length === 0 && (
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest text-center italic py-20">No merchant users found in SPFS register.</p>
      )}
    </div>
  );
}

const RefreshCw = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
);
