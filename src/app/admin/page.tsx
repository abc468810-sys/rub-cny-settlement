import { getAdminPending, getAdminUsers, getSystemConfig, getAdminStats } from '@/lib/actions';
import Link from 'next/link';
import AdminActionList from '@/components/ui/AdminActionList';
import AdminUserList from '@/components/ui/AdminUserList';
import AdminSettings from '@/components/ui/AdminSettings';
import AdminLiveActivity from '@/components/ui/AdminLiveActivity';
import StressTest from '@/components/ui/StressTest';
import AdminBroadcast from '@/components/ui/AdminBroadcast';
import { redirect } from 'next/navigation';
import { ShieldCheck, UserCheck, ArrowLeft, BarChart3, Globe, Coins, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

function formatCompact(value: number) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export default async function AdminPage() {
  let pending;
  let users;
  let config;
  let adminStats;
  try {
    pending = await getAdminPending();
    users = await getAdminUsers();
    config = await getSystemConfig();
    adminStats = await getAdminStats();
  } catch (e) {
    redirect('/login');
  }

  const stats = [
    { label: 'Daily Flow (RUB)', value: `₽ ${formatCompact(adminStats.dailyFlowRub)}`, trend: 'Today', icon: <BarChart3 size={16} /> },
    { label: 'CNY Liquidity', value: `¥ ${formatCompact(adminStats.cnyLiquidity)}`, trend: 'Live', icon: <Coins size={16} /> },
    { label: 'Active Users', value: `${adminStats.activeUsers}`, trend: 'Merchants', icon: <Zap size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-white p-12 lg:p-24 font-sans text-black selection:bg-blue-100">
      <div className="max-w-7xl mx-auto space-y-40">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-gray-50 pb-12">
          <div>
            <div className="flex items-center space-x-2 text-blue-600 mb-6">
               <ShieldCheck size={20} strokeWidth={3} />
               <span className="text-sm font-black tracking-tighter uppercase">Internal Operations</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none mb-4 italic">Approval<br />Terminal</h1>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">Sino-Russian Node Control Center</p>
          </div>
          <Link href="/dashboard" className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all group">
            <div className="p-3 border border-gray-100 rounded-2xl group-hover:border-black transition-colors">
               <ArrowLeft size={16} />
            </div>
            <span>Portfolio View</span>
          </Link>
        </header>

        {/* Institutional Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8 group hover:border-black transition-all">
              <div className="flex justify-between items-center">
                <div className="p-4 bg-white rounded-2xl border border-gray-100 text-gray-400 group-hover:text-blue-500 transition-colors">
                  {stat.icon}
                </div>
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">{stat.trend}</span>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-4xl font-black italic mono tracking-tighter">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 items-start">
          <section className="lg:col-span-2 space-y-24">
            <header className="flex justify-between items-end border-b border-gray-100 pb-8">
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900">
                  Instruction Buffer ({pending.length})
                </h2>
              </div>
            </header>

            <AdminActionList pending={pending.map(p => ({
              ...p,
              date: p.createdAt.toLocaleString(),
              targetAmount: p.targetAmount
            }))} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
               <AdminLiveActivity />
               <StressTest />
            </div>
            
            <AdminBroadcast />
            <AdminSettings initialConfig={config} />
          </section>

          <aside className="space-y-16 bg-gray-50 p-12 rounded-[4rem] border border-gray-100 shadow-sm shadow-gray-200/50 sticky top-24">
            <header className="flex justify-between items-end border-b border-gray-100 pb-8">
              <div className="flex items-center space-x-3 text-gray-400">
                <UserCheck size={18} strokeWidth={3} />
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">Compliance Register</h2>
              </div>
            </header>
            
            <AdminUserList users={users.map(u => ({
               id: u.id,
               email: u.email,
               name: u.name,
               status: u.kycStatus as any,
               date: new Date(u.createdAt).toLocaleDateString()
            }))} />
          </aside>
        </div>

        <footer className="pt-20 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center text-[9px] font-black uppercase tracking-[0.5em] text-gray-300">
          <p>© 2026 GLOBAL SETTLEMENT NODE · INTERNAL ACCESS ONLY</p>
          <p>Protocol Layer: RUB-CNY-V2.4</p>
        </footer>
      </div>
    </div>
  );
}
