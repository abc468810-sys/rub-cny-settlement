'use client';

import { useState } from 'react';
import { depositCurrency } from '@/lib/actions';

interface Props {
  currency: 'CNY' | 'RUB';
}

export default function WalletClientActions({ currency }: Props) {
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);

  const handleDeposit = async () => {
    const amt = Number(depositAmount);
    if (amt <= 0) return;
    
    setIsDepositing(true);
    try {
      await depositCurrency(amt, currency);
      setDepositAmount('');
      const symbol = currency === 'CNY' ? '¥' : '₽';
      alert(`${symbol}${amt.toLocaleString()} has been added to your ${currency} wallet.`);
    } catch (e) {
      alert('Error: ' + (e as Error).message);
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <input 
        type="number"
        value={depositAmount}
        onChange={(e) => setDepositAmount(e.target.value)}
        placeholder="Amount"
        className="w-32 text-right border-b border-gray-100 focus:border-black outline-none py-2 text-sm bg-transparent font-mono"
      />
      <button 
        onClick={handleDeposit}
        disabled={isDepositing || !depositAmount}
        className="bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:opacity-90 disabled:opacity-10 transition-opacity whitespace-nowrap"
      >
        {isDepositing ? 'Updating...' : `Deposit ${currency}`}
      </button>
    </div>
  );
}
