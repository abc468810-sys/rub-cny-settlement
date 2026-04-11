import { getDashboardData, getSystemConfig } from '@/lib/actions';
import { redirect } from 'next/navigation';
import { DashboardClient, Settlement } from '@/components/dashboard/DashboardClient';

export default async function DashboardPage() {
  const data = await getDashboardData();
  const config = await getSystemConfig();
  
  if (!data) {
    redirect('/login');
  }

  const { cnyBalance, rubBalance, transactions, currentRate, user } = data;
  
  const settlements: Settlement[] = transactions.map(t => ({
    id: t.id,
    type: t.type === 'DEPOSIT' ? 'Deposit' : 'Settlement',
    fromCurrency: t.fromCurrency,
    toCurrency: t.toCurrency,
    amount: t.amount,
    fee: t.fee,
    netAmount: t.netAmount,
    targetAmount: t.targetAmount,
    rate: t.rate,
    bankAccount: t.bankAccount || 'Internal',
    status: t.status === 'PROCESSING' ? 'Pending' : t.status === 'COMPLETED' ? 'Completed' : 'Rejected',
    date: new Date(t.createdAt).toLocaleDateString()
  }));

  return (
    <DashboardClient 
      cnyBalance={cnyBalance}
      rubBalance={rubBalance}
      settlements={settlements}
      currentRate={currentRate}
      userName={user.name || user.email}
      kycStatus={user.kycStatus as any}
      systemConfig={config}
    />
  );
}
