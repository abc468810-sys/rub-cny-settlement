import { create } from 'zustand';

export interface Settlement {
  id: string;
  date: string;
  amount: number;
  fee: number;
  netAmount: number;
  rubAmount: number;
  rate: number;
  bankAccount: string;
  type: 'Settlement' | 'Deposit';
  status: 'Processing' | 'Completed' | 'Rejected';
}

interface AppState {
  cnyBalance: number;
  rubBalance: number;
  settlements: Settlement[];
  addSettlement: (amount: number, rate: number, bankAccount: string) => boolean;
  depositCNY: (amount: number) => void;
  approveSettlement: (id: string) => void;
  rejectSettlement: (id: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  cnyBalance: 452310.89,
  rubBalance: 5820120.50,
  settlements: [
    { 
      id: 'REF-829103', 
      date: '2026-04-01 14:30', 
      amount: 5000, 
      fee: 75, 
      netAmount: 4925,
      rubAmount: 63384.75, 
      rate: 12.87,
      bankAccount: '40702810****1234',
      type: 'Settlement',
      status: 'Completed' 
    }
  ],
  depositCNY: (amount) => set((state) => ({
    cnyBalance: state.cnyBalance + amount,
    settlements: [
      {
        id: `DEP-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleString(),
        amount,
        fee: 0,
        netAmount: amount,
        rubAmount: 0,
        rate: 0,
        bankAccount: 'System Deposit',
        type: 'Deposit',
        status: 'Completed'
      },
      ...state.settlements
    ]
  })),
  addSettlement: (amount, rate, bankAccount) => {
    const { cnyBalance } = get();
    if (amount > cnyBalance) return false;

    const fee = amount * 0.015;
    const netAmount = amount - fee;
    const rubAmount = netAmount * rate;
    
    const newSettlement: Settlement = {
      id: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleString(),
      amount,
      fee,
      netAmount,
      rubAmount,
      rate,
      bankAccount: bankAccount.replace(/.(?=.{4})/g, '*'), 
      type: 'Settlement',
      status: 'Processing'
    };

    set((state) => ({
      cnyBalance: state.cnyBalance - amount,
      settlements: [newSettlement, ...state.settlements]
    }));
    return true;
  },
  approveSettlement: (id) => set((state) => ({
    settlements: state.settlements.map((s) => 
      s.id === id ? { ...s, status: 'Completed' } : s
    )
  })),
  rejectSettlement: (id) => set((state) => {
    const settlement = state.settlements.find(s => s.id === id);
    if (!settlement) return state;
    return {
      cnyBalance: state.cnyBalance + settlement.amount, // Refund to merchant
      settlements: state.settlements.map((s) => 
        s.id === id ? { ...s, status: 'Rejected' } : s
      )
    };
  }),
}));
