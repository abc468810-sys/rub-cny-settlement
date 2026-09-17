'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSettlement } from '@/lib/actions';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, ArrowLeft, Building2, Terminal, ArrowRightLeft, ShieldAlert, KeyRound, AlertTriangle, Activity, FileText, Anchor, Zap } from 'lucide-react';
import { useNotify } from './NotificationProvider';

interface Props {
  cnyBalance: number;
  rubBalance: number;
  initialRate: number; // CNY to RUB
  beneficiaries?: { id: string; name: string; accountNumber: string }[];
  accentColor?: string;
}

type Step = 'input' | 'security_check' | 'risk_intercept' | 'review';

export default function SettlementClientForm({ cnyBalance, rubBalance, initialRate, beneficiaries = [], accentColor = '#3b82f6' }: Props) {
  const router = useRouter();
  const { notify } = useNotify();
  const [amount, setAmount] = useState<string>('');
  const [bankAccount, setBankAccount] = useState('');
  const [contractNo, setContractNo] = useState('');
  const [commodityCode, setCommodityCode] = useState('');
  const [isPriority, setIsPriority] = useState(false);
  const [step, setStep] = useState<Step>('input');
  const [loading, setLoading] = useState(false);
  const [isVetting, setIsVetting] = useState(false);
  const [vettingProgress, setVettingProgress] = useState(0);
  const [otp, setOtp] = useState('');
  
  const fromCurrency = 'RUB';
  const toCurrency = 'CNY';
  const fromSymbol = '₽';
  const toSymbol = '¥';
  
  const displayRate = 1 / initialRate;
  
  const numAmount = Number(amount || 0);
  const feeRate = isPriority ? 0.020 : 0.015;
  const fee = numAmount * feeRate;
  const netAmount = numAmount - fee;
  const targetAmount = netAmount * displayRate;
  
  const isInsufficient = numAmount > rubBalance;
  const isAccountValid = bankAccount.length >= 6; 
  const isHighValue = numAmount >= 1000000;
  const isCriticalValue = numAmount >= 5000000;
  const isFormValid = amount && numAmount > 0 && !isInsufficient && isAccountValid && contractNo && commodityCode;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    if (isCriticalValue) {
      setStep('risk_intercept');
    } else if (isHighValue) {
      setStep('security_check');
    } else {
      setStep('review');
    }
  };

  const handleSecurityVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') {
      setStep('review');
    } else {
      notify('ERROR', 'Invalid security token.');
    }
  };

  const handleConfirm = async () => {
    setIsVetting(true);
    setVettingProgress(0);
    
    const interval = setInterval(() => {
      setVettingProgress(prev => Math.min(prev + 2, 100));
    }, 50);

    setTimeout(async () => {
      setLoading(true);
      try {
        await createSettlement(numAmount, bankAccount, contractNo, `Code: ${commodityCode}`);
        notify('SUCCESS', 'Instruction released to the clearing node.');
        router.push('/dashboard');
      } catch (e) {
        notify('ERROR', (e as Error).message);
        setIsVetting(false);
      } finally {
        setLoading(false);
        clearInterval(interval);
      }
    }, 3000);
  };

  return (
    <div className="max-w-xl">
      <AnimatePresence mode="wait">
        {step === 'input' ? (
          <motion.div 
            key="input-form"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-16"
          >
            <div className="flex justify-start">
              <div className="flex items-center space-x-4 bg-gray-50 px-8 py-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="text-right">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Trade Source</p>
                  <p className="text-xs font-black">RUB</p>
                </div>
                <div className="p-2 bg-black text-white rounded-full">
                  <Anchor size={14} />
                </div>
                <div className="text-left">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Trade Target</p>
                  <p className="text-xs font-black">CNY</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleNext} className="space-y-16">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">RUB Instruction Amount</label>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isInsufficient ? 'text-red-500' : 'text-gray-300'}`}>
                    Limit: {fromSymbol}{rubBalance.toLocaleString()}
                  </span>
                </div>
                <div className="relative group">
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={`block w-full text-7xl font-light border-b border-gray-100 focus:border-black outline-none py-6 transition-all bg-transparent tracking-tighter ${
                      isInsufficient ? 'text-red-500' : 'text-gray-900'
                    }`}
                    placeholder="0.00"
                    required
                  />
                  <span className="absolute right-0 bottom-8 text-2xl font-black text-gray-300">{fromSymbol}</span>
                </div>
              </div>

              {/* Trade Background Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center space-x-2">
                    <Building2 size={12} />
                    <span>CNY Payout Account</span>
                  </label>
                  <input 
                    type="text" 
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className={`block w-full text-sm font-bold border-b py-3 outline-none transition-all font-mono bg-transparent tracking-widest ${
                      bankAccount.length > 0 && !isAccountValid ? 'border-red-500 text-red-500' : 'border-gray-100 focus:border-black'
                    }`}
                    placeholder="Target CNY Account"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center space-x-2">
                    <Terminal size={12} />
                    <span>Contract Number</span>
                  </label>
                  <input 
                    type="text" 
                    value={contractNo}
                    onChange={(e) => setContractNo(e.target.value)}
                    className="block w-full text-sm font-bold border-b border-gray-100 focus:border-black outline-none py-3 transition-all bg-transparent uppercase tracking-widest"
                    placeholder="CTR-2026-XXXX"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center space-x-2">
                    <FileText size={12} />
                    <span>HS / Commodity Code</span>
                  </label>
                  <input 
                    type="text" 
                    value={commodityCode}
                    onChange={(e) => setCommodityCode(e.target.value)}
                    className="block w-full text-sm font-bold border-b border-gray-100 focus:border-black outline-none py-3 transition-all bg-transparent uppercase tracking-widest"
                    placeholder="8-Digit Code"
                    required
                  />
                </div>
              </div>

              <div 
                onClick={() => setIsPriority(!isPriority)}
                className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer flex items-center justify-between group ${
                  isPriority ? 'bg-black border-black shadow-2xl' : 'bg-gray-50 border-gray-50 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-2xl transition-colors ${isPriority ? 'bg-white/10 text-blue-400' : 'bg-white text-gray-300'}`}>
                    <Zap size={18} className={isPriority ? 'fill-current' : ''} />
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isPriority ? 'text-white' : 'text-gray-900'}`}>Express Trade Lane</p>
                    <p className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${isPriority ? 'text-gray-500' : 'text-gray-400'}`}>
                      Priority Node Processing (2.0% fee)
                    </p>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${isPriority ? 'bg-blue-500' : 'bg-gray-200'}`}>
                  <motion.div animate={{ x: isPriority ? 20 : 0 }} className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-50 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fixed Trade Rate</p>
                  <p className="text-xl font-black text-blue-600 mono tracking-tighter italic">1 RUB = {displayRate.toFixed(4)} CNY</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total CNY Proceeds</p>
                  <p className="text-2xl font-black text-green-600 mono tracking-tighter">{toSymbol} {targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>

              <button 
                type="submit"
                disabled={!isFormValid}
                className="w-full bg-black text-white py-7 rounded-3xl text-xs font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all disabled:opacity-20 shadow-2xl shadow-black/10 flex justify-center items-center space-x-3"
                style={!isFormValid ? {} : { backgroundColor: accentColor }}
              >
                <span>Initiate Trade Audit</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>
        ) : step === 'risk_intercept' ? (
          <motion.div
            key="risk-intercept"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-12"
          >
            <div className="p-10 bg-red-50 border border-red-100 rounded-[2.5rem] space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-red-100 text-red-600 rounded-2xl">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Critical Value Interception</p>
                  <p className="text-xs font-bold text-red-400 mt-1">
                    This instruction exceeds {fromSymbol}5,000,000 and requires manual risk review before release.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-red-400">
                <AlertTriangle size={14} />
                <span>Instruction Amount: {fromSymbol}{numAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="flex-1 py-6 rounded-3xl text-xs font-black uppercase tracking-[0.2em] border border-gray-100 hover:border-black transition-all flex justify-center items-center space-x-3"
              >
                <ArrowLeft size={16} />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(isHighValue ? 'security_check' : 'review')}
                className="flex-1 bg-black text-white py-6 rounded-3xl text-xs font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all flex justify-center items-center space-x-3"
                style={{ backgroundColor: accentColor }}
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        ) : step === 'security_check' ? (
          <motion.div
            key="security-check"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-12"
          >
            <div className="flex items-center space-x-4 bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
              <div className="p-4 bg-white rounded-2xl border border-gray-100 text-blue-500">
                <KeyRound size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Security Verification Required</p>
                <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                  Instructions above {fromSymbol}1,000,000 require a one-time security token.
                </p>
              </div>
            </div>

            <form onSubmit={handleSecurityVerify} className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">One-Time Security Token</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="block w-full text-3xl font-light border-b border-gray-100 focus:border-black outline-none py-6 transition-all bg-transparent tracking-[0.3em] text-center"
                  placeholder="••••••"
                  maxLength={6}
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="flex-1 py-6 rounded-3xl text-xs font-black uppercase tracking-[0.2em] border border-gray-100 hover:border-black transition-all flex justify-center items-center space-x-3"
                >
                  <ArrowLeft size={16} />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-6 rounded-3xl text-xs font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all flex justify-center items-center space-x-3"
                  style={{ backgroundColor: accentColor }}
                >
                  <span>Verify</span>
                  <ShieldCheck size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        ) : isVetting ? (
          <motion.div
            key="vetting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-20 text-center space-y-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="inline-flex p-6 bg-gray-50 rounded-full border border-gray-100 text-gray-400"
            >
              <Activity size={28} />
            </motion.div>
            <p className="text-gray-300 uppercase font-black text-xs tracking-[0.3em]">Vetting Instruction...</p>
            <div className="max-w-xs mx-auto h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full"
                style={{ backgroundColor: accentColor, width: `${vettingProgress}%` }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-12"
          >
            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-50 space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Instruction Amount</p>
                <p className="text-sm font-black mono">{fromSymbol}{numAmount.toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fee ({(feeRate * 100).toFixed(1)}%)</p>
                <p className="text-sm font-black mono">{fromSymbol}{fee.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
              <div className="flex justify-between items-center border-t border-gray-100 pt-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">CNY Proceeds</p>
                <p className="text-xl font-black text-green-600 mono">{toSymbol}{targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="flex justify-between items-center border-t border-gray-100 pt-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Payout Account</p>
                <p className="text-sm font-bold font-mono">{bankAccount}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contract No.</p>
                <p className="text-sm font-bold font-mono">{contractNo}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Commodity Code</p>
                <p className="text-sm font-bold font-mono">{commodityCode}</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="flex-1 py-6 rounded-3xl text-xs font-black uppercase tracking-[0.2em] border border-gray-100 hover:border-black transition-all flex justify-center items-center space-x-3"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 bg-black text-white py-6 rounded-3xl text-xs font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all disabled:opacity-40 flex justify-center items-center space-x-3"
                style={{ backgroundColor: accentColor }}
              >
                <span>Confirm & Release</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
