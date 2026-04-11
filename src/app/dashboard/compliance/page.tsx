'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useState } from 'react';
import { submitKyc } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Building, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CompliancePage() {
  const [license, setLicense] = useState('');
  const [directorId, setDirectorId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitKyc({ businessLicense: license, directorId });
      router.push('/dashboard');
    } catch (e) {
      alert('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <header className="mb-20">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Institutional Onboarding</p>
        <h1 className="text-4xl font-black tracking-tighter text-gray-900">Compliance Verification</h1>
        <p className="text-sm text-gray-500 mt-4 max-w-xl font-medium leading-relaxed italic">
          To comply with Russo-Chinese anti-money laundering (AML) regulations, we require your institutional credentials for verification.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center space-x-2">
              <Building size={12} />
              <span>Business License Number</span>
            </label>
            <input 
              type="text" 
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              className="w-full text-xl font-bold border-b border-gray-100 focus:border-black outline-none py-4 transition-all bg-transparent uppercase tracking-widest"
              placeholder="e.g. 91310000XXXXXXXX"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center space-x-2">
              <UserCheck size={12} />
              <span>Legal Representative ID</span>
            </label>
            <input 
              type="text" 
              value={directorId}
              onChange={(e) => setDirectorId(e.target.value)}
              className="w-full text-xl font-bold border-b border-gray-100 focus:border-black outline-none py-4 transition-all bg-transparent uppercase tracking-widest"
              placeholder="Passport or ID Number"
              required
            />
          </div>

          <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-50 flex items-start space-x-4">
             <ShieldCheck className="text-blue-500 mt-1" size={20} />
             <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Encrypted Storage</p>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                 Documents are stored on secure, air-gapped servers and only accessible by authorized compliance officers.
               </p>
             </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-6 rounded-3xl text-xs font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all flex justify-center items-center space-x-3 shadow-xl shadow-black/10"
          >
            {loading ? 'Submitting Credentials...' : (
              <>
                <span>Submit for Verification</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <aside className="space-y-12">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Verification Checklist</h3>
          <div className="space-y-8">
            {[
              { label: 'Business Identity', desc: 'Valid Unified Social Credit Code' },
              { label: 'Beneficial Ownership', desc: 'Verified director identity documents' },
              { label: 'Sanction Screening', desc: 'Verification against global trade blacklists' },
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 font-black text-xs">
                  {i + 1}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-900">{item.label}</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
