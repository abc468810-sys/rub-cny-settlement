'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Info } from 'lucide-react';

interface SettlementFormProps {
  currentRate: number;
}

export function SettlementForm({ currentRate }: SettlementFormProps) {
  const [amount, setAmount] = useState<number>(0);
  const [bankAccount, setBankAccount] = useState('');
  const [swift, setSwift] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fee = amount * 0.005;
  const netAmount = amount - fee;
  const estimatedRub = netAmount * currentRate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // In a real app, this would call our API route
    console.log({ amount, bankAccount, swift, currentRate, estimatedRub });
    setTimeout(() => {
      alert('Settlement request submitted successfully!');
      setIsSubmitting(false);
      setAmount(0);
      setBankAccount('');
      setSwift('');
    }, 1000);
  };

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm max-w-2xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
        <span>Request CNY to RUB Settlement</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (CNY)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
            <span className="absolute left-3 top-3.5 text-gray-400">¥</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div>
            <span className="text-xs text-gray-500 block">Service Fee (1.5%)</span>
            <span className="font-semibold text-gray-900">¥ {fee.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Current Rate</span>
            <span className="font-semibold text-blue-600">1 CNY = {currentRate} RUB</span>
          </div>
          <div className="col-span-2 pt-2 border-t border-gray-200 mt-2">
            <span className="text-xs text-gray-500 block">Estimated RUB to Receive</span>
            <span className="text-xl font-bold text-green-600 font-mono">
              ₽ {estimatedRub.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Bank Account (RUB)
          </label>
          <input
            type="text"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            placeholder="Account number or IBAN"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SWIFT / BIC (Optional)
          </label>
          <input
            type="text"
            value={swift}
            onChange={(e) => setSwift(e.target.value)}
            placeholder="BANKRU..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex space-x-3">
          <Info className="text-blue-500 shrink-0" size={20} />
          <p className="text-xs text-blue-700 leading-relaxed">
            Settlement requests are processed within 1-2 business days. Exchange rate is locked at the time of approval by the administrator.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || amount <= 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <span>{isSubmitting ? 'Processing...' : 'Submit Request'}</span>
          {!isSubmitting && <ArrowRight size={20} />}
        </button>
      </form>
    </div>
  );
}
