'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import Link from 'next/link';

interface Props {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export function KycBanner({ status }: Props) {
  if (status === 'APPROVED') return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-12 p-6 rounded-[2rem] border flex flex-col md:flex-row items-center justify-between gap-6 ${
        status === 'REJECTED' ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-2xl ${status === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
          {status === 'REJECTED' ? <ShieldAlert size={20} /> : <Clock size={20} />}
        </div>
        <div>
          <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">
            {status === 'REJECTED' ? 'KYC Verification Failed' : 'Institutional Onboarding Required'}
          </h4>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 opacity-70">
            {status === 'REJECTED' 
              ? 'Please re-upload your business credentials for verification.' 
              : 'Your account is currently in "Limited View" mode. Complete KYC to enable settlements.'}
          </p>
        </div>
      </div>

      <Link 
        href="/dashboard/compliance" 
        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-2 shadow-sm ${
          status === 'REJECTED' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        <span>Complete Onboarding</span>
        <ArrowRight size={14} />
      </Link>
    </motion.div>
  );
}
