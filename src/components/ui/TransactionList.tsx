'use client';

import { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function TransactionList({ transactions }: { transactions: any[] }) {
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  return (
    <>
      <div className="space-y-0 border-t border-gray-50">
        {transactions.map((s) => (
          <div 
            key={s.id} 
            onClick={() => setSelectedTx(s)}
            className="group flex items-center justify-between py-6 border-b border-gray-50 hover:bg-gray-50 transition-colors px-4 -mx-4 rounded-xl cursor-pointer"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                {s.type === 'Deposit' ? (
                  <ArrowDownRight size={14} className="text-green-500" />
                ) : (
                  <ArrowUpRight size={14} className="text-gray-400" />
                )}
                <p className="font-bold text-sm tracking-tight text-gray-900">
                  {s.type === 'Deposit' ? 'CNY Deposit' : 'CNY to RUB Settlement'}
                  <span className="ml-3 text-[10px] text-gray-300 font-mono tracking-tighter">{s.id.substr(0, 8)}</span>
                </p>
              </div>
              <p className="text-xs text-gray-400 font-medium">{s.date} · {s.bankAccount}</p>
            </div>
            <div className="text-right space-y-1">
              <p className={`font-bold text-sm ${s.type === 'Deposit' ? 'text-green-600' : 'text-gray-900'}`}>
                {s.type === 'Deposit' ? '+' : '-'} ¥ {s.amount.toLocaleString()}
              </p>
              <div className="flex items-center justify-end space-x-2">
                {s.type === 'Settlement' && (
                  <span className="text-[10px] text-gray-400 font-mono tracking-tighter">RUB {s.rubAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                )}
                <span className={`h-1 w-1 rounded-full ${s.status === 'Completed' ? 'bg-green-500' : s.status === 'Rejected' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                <span className={`text-[10px] uppercase font-black tracking-widest ${s.status === 'Completed' ? 'text-green-600' : s.status === 'Rejected' ? 'text-red-600' : 'text-blue-600'}`}>
                  {s.status}
                </span>
              </div>
            </div>
          </div>
        ))}
        {transactions.length === 0 && (
          <p className="text-sm text-gray-400 italic py-12 text-center">No transactions yet.</p>
        )}
      </div>

      {selectedTx && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-5">
          <div className="w-[450px] h-full bg-white shadow-2xl p-12 overflow-y-auto">
            <header className="flex justify-between items-start mb-16">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Transaction Ref</h3>
                <p className="text-lg font-bold mono">{selectedTx.id}</p>
              </div>
              <button onClick={() => setSelectedTx(null)} className="text-gray-300 hover:text-black transition-colors">
                <X size={24} />
              </button>
            </header>
            <div className="space-y-12">
              <section className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Status</p>
                <div className="flex items-center space-x-2">
                  <span className={`h-2 w-2 rounded-full ${selectedTx.status === 'Completed' ? 'bg-green-500' : selectedTx.status === 'Rejected' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                  <span className="text-sm font-bold uppercase tracking-widest">{selectedTx.status}</span>
                </div>
              </section>
              <section className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Financials</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gross</span>
                    <span className="font-bold">¥ {selectedTx.amount.toLocaleString()}</span>
                  </div>
                  {selectedTx.type === 'Settlement' && (
                    <>
                      <div className="flex justify-between text-gray-500">
                        <span>Fee (1.5%)</span>
                        <span>- ¥ {selectedTx.fee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-50 pt-3">
                        <span className="font-bold">Final RUB</span>
                        <span className="text-xl font-black text-green-600 tracking-tighter">₽ {selectedTx.rubAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {selectedTx.type === 'Settlement' && (
                <div className="space-y-4 pt-8">
                  <Link 
                    href={`/dashboard/receipt/${selectedTx.id}`}
                    className="w-full border-2 border-black py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all flex justify-center items-center space-x-2"
                  >
                    <ExternalLink size={14} />
                    <span>View Official Receipt</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
