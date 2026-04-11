'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { logout } from '@/lib/actions';
import { useLanguage } from '../ui/LanguageProvider';
import { Anchor, LayoutDashboard, Zap, Wallet, FileBarChart, ShieldCheck, Code, LogOut, Settings } from 'lucide-react';

interface Props {
  brandName?: string;
  accentColor?: string;
}

export function Sidebar({ brandName = 'TradeBridge', accentColor = '#3b82f6' }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang, dict } = useLanguage();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const menuItems = [
    { label: dict.portfolio, href: '/dashboard', icon: LayoutDashboard },
    { label: dict.settlement, href: '/dashboard/settlements', icon: Zap },
    { label: dict.wallets, href: '/dashboard/wallets', icon: Wallet },
    { label: dict.reports || 'Reports', href: '/dashboard/reports', icon: FileBarChart },
    { label: dict.developer || 'Developer', href: '/dashboard/developer', icon: Code },
    { label: dict.matrix_audit || 'Matrix Audit', href: '/dashboard/matrix', icon: ShieldCheck },
  ];

  return (
    <div className="w-64 border-r border-gray-100 h-screen flex flex-col bg-white shrink-0 z-20 shadow-sm">
      <div className="p-10 text-xl font-black tracking-tighter text-black flex items-center space-x-2">
        <div 
          className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-colors duration-500"
          style={{ backgroundColor: accentColor }}
        ></div>
        <span className="uppercase italic tracking-tighter">{brandName}</span>
      </div>
      
      <nav className="flex-1 px-6 space-y-1 overflow-y-auto no-scrollbar">
        <p className="px-6 pb-2 text-[8px] font-black uppercase tracking-[0.4em] text-gray-300">Terminal</p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center space-x-4 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all relative overflow-hidden ${
                isActive 
                  ? 'text-white shadow-xl shadow-black/5' 
                  : 'text-gray-400 hover:text-black hover:bg-gray-50'
              }`}
              style={isActive ? { backgroundColor: '#000' } : {}}
            >
              <item.icon size={14} className="relative z-10" />
              <span className="relative z-10">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute inset-0"
                  style={{ backgroundColor: '#000' }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-10 border-t border-gray-50 flex flex-col space-y-8">
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-2">
           <div className="flex items-center space-x-2 text-blue-600 mb-1">
              <Anchor size={10} />
              <p className="text-[7px] font-black uppercase tracking-widest">Trade Exclusive</p>
           </div>
           <p className="text-[7px] font-medium text-gray-400 leading-relaxed">
             Authorized for RUB to CNY trade remittance only.
           </p>
        </div>

        <div className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-gray-300">
           {(['zh', 'ru', 'en'] as const).map(l => (
             <button 
               key={l} 
               onClick={() => setLang(l)}
               className={`transition-colors uppercase ${lang === l ? 'text-black' : 'hover:text-black'}`}
             >
               {l}
             </button>
           ))}
        </div>

        <div className="space-y-4">
          <Link 
            href="/admin" 
            className="text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-70 transition-colors flex items-center space-x-2"
            style={{ color: accentColor }}
          >
            <Settings size={14} />
            <span>Admin Portal</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-red-500 transition-colors flex items-center space-x-2 w-full text-left"
          >
            <LogOut size={14} />
            <span>End Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}
