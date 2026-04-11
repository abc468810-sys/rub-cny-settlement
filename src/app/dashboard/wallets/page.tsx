import { getDashboardData, getBeneficiaries } from '@/lib/actions';
import WalletClientActions from '@/components/ui/WalletClientActions';
import BeneficiaryManager from '@/components/dashboard/BeneficiaryManager';
import LiquidityHeatmap from '@/components/dashboard/LiquidityHeatmap';
import LedgerArchiver from '@/components/ui/LedgerArchiver';
import { redirect } from 'next/navigation';

export default async function WalletsPage() {
  const data = await getDashboardData();
  const beneficiaries = await getBeneficiaries();
  
  if (!data) {
    redirect('/login');
  }

  const { cnyBalance, rubBalance } = data;

  return (
    <>
      <header className="mb-20">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Portfolio Management</p>
        <h1 className="text-4xl font-black tracking-tighter text-gray-900 leading-none">Wallets</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-32">
          <LiquidityHeatmap />
          
          <section className="group max-w-2xl">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Distribution Target (RUB)</h2>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between pb-16 border-b border-gray-100 gap-12">
              <p className="text-8xl font-black tracking-tighter text-gray-900 leading-none mono italic">
                ₽ {rubBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <WalletClientActions currency="RUB" />
            </div>
          </section>

          <section className="max-w-2xl">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Settlement Pool (CNY)</h2>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between pb-16 border-b border-gray-100 gap-12">
              <p className="text-8xl font-black tracking-tighter text-gray-200 leading-none mono italic">
                ¥ {cnyBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <WalletClientActions currency="CNY" />
            </div>
          </section>
        </div>

        <div>
          <BeneficiaryManager initialData={beneficiaries} />
          <div className="mt-12">
            <LedgerArchiver />
          </div>
        </div>
      </div>
    </>
  );
}
