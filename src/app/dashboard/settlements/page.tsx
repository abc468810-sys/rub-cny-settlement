import { getDashboardData, getBeneficiaries, getSystemConfig } from '@/lib/actions';
import SettlementClientForm from '@/components/ui/SettlementClientForm';
import { redirect } from 'next/navigation';

export default async function SettlementsPage() {
  const data = await getDashboardData();
  const beneficiaries = await getBeneficiaries();
  const config = await getSystemConfig();
  
  if (!data) {
    redirect('/login');
  }

  if (data.user.kycStatus !== 'APPROVED') {
    redirect('/dashboard/compliance');
  }

  const { cnyBalance, rubBalance, currentRate } = data;

  return (
    <>
      <header className="mb-20">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Institutional Payout</p>
        <h1 className="text-4xl font-black tracking-tighter text-gray-900">New Settlement</h1>
      </header>

      <SettlementClientForm 
        cnyBalance={cnyBalance} 
        rubBalance={rubBalance} 
        initialRate={currentRate} 
        beneficiaries={beneficiaries}
        accentColor={config.accentColor}
      />
    </>
  );
}
