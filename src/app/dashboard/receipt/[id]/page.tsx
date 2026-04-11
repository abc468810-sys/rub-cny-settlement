import { getTransaction } from '@/lib/actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Globe } from 'lucide-react';
import DigitalStamp from '@/components/ui/DigitalStamp';
import ReceiptActions from '@/components/ui/ReceiptActions';
import BlockchainQR from '@/components/ui/BlockchainQR';

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tx = await getTransaction(id);

  if (!tx) {
    notFound();
  }

  const getCurrencySymbol = (ccy: string) => ccy === 'CNY' ? '¥' : '₽';

  return (
    <div className="min-h-screen bg-white text-black py-20 px-4 selection:bg-blue-100">
      <div className="max-w-4xl mx-auto">
        <div className="mb-20 flex justify-between items-center no-print">
          <Link href="/dashboard" className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all group">
            <div className="p-2 border border-gray-100 rounded-xl group-hover:border-black transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span>Return to Portfolio</span>
          </Link>
          <ReceiptActions />
        </div>

        <div className="relative border-[1.5rem] border-gray-50 p-20 rounded-[4rem] overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] rotate-[-15deg] select-none pointer-events-none whitespace-nowrap">
            <p className="text-[15rem] font-black tracking-tighter">CERTIFIED</p>
          </div>

          <header className="relative z-10 flex justify-between items-start mb-32">
            <div>
              <div className="flex items-center space-x-2 text-blue-600 mb-6">
                <Globe size={24} strokeWidth={3} />
                <span className="text-xl font-black tracking-tighter uppercase">{tx.fromCurrency}-{tx.toCurrency} Bridge</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase leading-none italic">Institutional<br />Receipt</h1>
              <p className="text-xs text-gray-400 font-black uppercase tracking-[0.4em] mono">Ref: {tx.id.toUpperCase()}</p>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="inline-flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100 text-green-600 mb-8 shadow-sm">
                <ShieldCheck size={18} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-widest">Gateway Verified</span>
              </div>
              
              <DigitalStamp />
              
              <div className="mt-8">
                <BlockchainQR />
              </div>
              
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed mt-8">
                Auth Date: {new Date(tx.createdAt).toLocaleDateString()}<br />
                {new Date(tx.createdAt).toLocaleTimeString()} (NODE_SYNC)
              </p>
            </div>
          </header>

          <div className="relative z-10 space-y-24">
            <section className="grid grid-cols-2 gap-24">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-4 mb-6 leading-none">Entity Identity</p>
                <div>
                  <p className="text-xl font-black text-gray-900 leading-none mb-1 uppercase tracking-tighter">{tx.user.name || tx.user.email.split('@')[0]}</p>
                  <p className="text-sm font-bold text-gray-400 mono italic tracking-tight">{tx.user.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-4 mb-6 leading-none">Target Proceeds</p>
                <div>
                  <p className="text-xl font-black text-gray-900 leading-none mb-2 mono tracking-tight">{tx.bankAccount}</p>
                  <p className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] underline decoration-blue-100 italic">Institutional Correspondent Route</p>
                </div>
              </div>
            </section>

            <section className="bg-gray-900 text-white p-16 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              {/* ... content ... */}
            </section>

            <section className="flex flex-col md:flex-row justify-between items-end gap-12 pt-12 border-t border-gray-50">
              <div className="flex-1 space-y-4 text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 leading-none mb-4">Verification Matrix</p>
                <p className="text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-widest italic opacity-50">
                  Instruction authorized through SPFS centralized node. Scanned for AML/Sanction compliance. 
                  Digital ledger signatures are embedded in the platform core. For multi-node verification, contact Beijing Gateway.
                </p>
              </div>
              <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center border-4 border-gray-100 shrink-0">
                 <Globe size={40} className="text-gray-200" />
              </div>
            </section>
          </div>

          <footer className="mt-24 pt-12 border-t border-gray-100 text-center relative z-10">
            <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.4em]">
              © 2026 GLOBAL SETTLEMENT NODE · BJN-MSK CORRIDOR
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
