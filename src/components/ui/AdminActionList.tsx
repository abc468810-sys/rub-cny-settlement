'use client';

import { approveSettlement, rejectSettlement } from '@/lib/actions';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Check, X, Building2, Terminal, Info, Activity, Fingerprint } from 'lucide-react';

export default function AdminActionList({ pending }: { pending: any[] }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [approvingStep, setApprovingStep] = useState<null | 'VETTING' | 'CONSENSUS'>(null);
  const [signedNodes, setSignedNodes] = useState<string[]>([]);

  const handleApprove = async (id: string) => {
    setLoading(id);
    setApprovingStep('VETTING');
    setSignedNodes([]);
    
    // Step 1: Vetting
    setTimeout(() => {
      setApprovingStep('CONSENSUS');
      
      // Step 2: Multi-Sig Simulation
      setTimeout(() => setSignedNodes(prev => [...prev, 'BJN']), 800);
      setTimeout(() => setSignedNodes(prev => [...prev, 'MSK']), 1600);
      setTimeout(() => {
        setSignedNodes(prev => [...prev, 'GLOBAL']);
        setTimeout(async () => {
          try {
            await approveSettlement(id);
            setSuccessMsg('Settlement Authorized & Node Released');
            setTimeout(() => setSuccessMsg(null), 3000);
          } catch (e) {
            alert('Error approving');
          } finally {
            setLoading(null);
            setApprovingStep(null);
            setSignedNodes([]);
          }
        }, 800);
      }, 2400);
    }, 1500);
  };

  const handleReject = async (id: string) => {
    setLoading(id);
    try {
      await rejectSettlement(id);
      setSuccessMsg('Settlement Rejected & Funds Refunded');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e) {
      alert('Error rejecting');
    } finally {
      setLoading(null);
    }
  };

  const getCurrencySymbol = (ccy: string) => ccy === 'CNY' ? '¥' : '₽';

  return (
    <div className="space-y-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 bg-black text-white px-8 py-4 rounded-3xl shadow-2xl z-[1000] flex items-center space-x-3 text-xs font-black uppercase tracking-widest"
          >
            <Check className="text-green-500" size={16} />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {pending.map((s, idx) => (
        <motion.div 
          key={s.id} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between group hover:shadow-xl transition-shadow relative overflow-hidden"
        >
          {loading === s.id && approvingStep && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-12"
            >
              <div className="w-full max-w-sm space-y-8">
                <header className="text-center space-y-2">
                  <p className="text-[8px] font-black uppercase tracking-[0.5em] text-blue-600 animate-pulse">
                    {approvingStep === 'VETTING' ? 'Institutional Audit' : 'Consensus Protocol'}
                  </p>
                  <h4 className="text-sm font-black uppercase tracking-tight">
                    {approvingStep === 'VETTING' ? 'Vetting Instruction' : 'Multi-Signature Release'}
                  </h4>
                </header>

                <div className="space-y-3">
                  {[
                    { id: 'BJN', label: 'BJN_PRIMARY_NODE' },
                    { id: 'MSK', label: 'MSK_COMPLIANCE_LINK' },
                    { id: 'GLOBAL', label: 'GLOBAL_LEDGER_AUTH' }
                  ].map((node) => {
                    const isSigned = signedNodes.includes(node.id);
                    return (
                      <div key={node.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-500 ${
                        isSigned ? 'bg-green-50 border-green-100 opacity-100' : 'bg-gray-50 border-gray-100 opacity-30'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${isSigned ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="text-[9px] font-black uppercase tracking-widest">{node.label}</span>
                        </div>
                        <span className={`text-[7px] font-black uppercase tracking-widest ${isSigned ? 'text-green-600' : 'text-gray-400'}`}>
                          {isSigned ? 'Signed' : 'Awaiting'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <p className="text-[8px] text-center text-gray-400 font-bold uppercase tracking-widest italic">
                  Collecting node consensus (2/3 required for release)
                </p>
              </div>
            </motion.div>
          )}

          <div className="space-y-8 flex-1">
            <header className="flex items-center space-x-4">
              <span className="text-xs font-black tracking-tighter text-gray-900 mono">REF {s.id.substr(0, 10)}</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-tighter rounded-full">
                {s.fromCurrency} to {s.toCurrency} Route
              </span>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 flex items-center space-x-2">
                  <Building2 size={12} />
                  <span>Beneficiary Detail</span>
                </p>
                <p className="text-sm font-bold text-gray-900 mono tracking-widest">{s.bankAccount}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verified Format · {s.toCurrency} Target</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 flex items-center space-x-2">
                  <Terminal size={12} />
                  <span>Trade Background</span>
                </p>
                <p className="text-sm font-black text-gray-900 tracking-widest uppercase">{s.contractNo} / {s.commodityType || 'N/A'}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Cross-border Settlement</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 pt-6 border-t border-gray-50 opacity-50 text-[10px] font-black uppercase tracking-widest text-gray-400 font-mono italic">
              <span className="text-blue-500 underline">Rate: {s.rate.toFixed(4)} {s.toCurrency}/{s.fromCurrency}</span>
              <span>•</span>
              <span>Fee: {getCurrencySymbol(s.fromCurrency)} {s.fee.toFixed(2)}</span>
              <span>•</span>
              <span>{s.date}</span>
            </div>
          </div>

          <div className="flex items-center space-x-12 pl-12 border-l border-gray-100 h-full py-2">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-2">Total Remittance</p>
              <p className="text-4xl font-black text-gray-900 tracking-tighter mono">{getCurrencySymbol(s.fromCurrency)} {s.amount.toLocaleString()}</p>
              <p className="text-lg font-black text-green-600 tracking-tighter mono">{getCurrencySymbol(s.toCurrency)} {s.targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>

            <div className="flex flex-col space-y-3 w-40">
              <button 
                onClick={() => handleApprove(s.id)}
                disabled={!!loading}
                className="bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-green-600 transition-all rounded-3xl disabled:opacity-20 shadow-xl shadow-black/5 flex justify-center items-center space-x-2"
              >
                {loading === s.id ? <span className="animate-spin text-xl leading-none">◌</span> : (
                  <>
                    <ShieldCheck size={14} />
                    <span>Approve</span>
                  </>
                )}
              </button>
              <button 
                onClick={() => handleReject(s.id)}
                disabled={!!loading}
                className="bg-transparent text-gray-300 border border-gray-100 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:text-red-500 hover:border-red-100 transition-all rounded-2xl disabled:opacity-20 flex justify-center items-center space-x-2"
              >
                <X size={14} />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </motion.div>
      ))}

      {pending.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-40 text-center bg-white rounded-[4rem] border border-dashed border-gray-100 shadow-inner"
        >
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-gray-50 rounded-full text-gray-200">
              <Info size={40} />
            </div>
          </div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-300">Queue Cleared</p>
          <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest italic opacity-50">No pending instructions in the clearing buffer.</p>
        </motion.div>
      )}
    </div>
  );
}
