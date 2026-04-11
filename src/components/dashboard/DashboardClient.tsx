'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, ExternalLink, Bell, TrendingUp, ArrowRight, ShieldCheck, Lock, Activity, Landmark, Globe, Building, Download, Code, Fingerprint, Zap, Anchor, Info } from 'lucide-react';
import Link from 'next/link';
import { TrendChart } from './TrendChart';
import { KycBanner } from './KycBanner';
import { MarketBulletins } from './MarketBulletins';
import { SystemAudit } from './SystemAudit';
import MonthlyVolumeAnalytics from './MonthlyVolumeAnalytics';
import GlobalNodeHealth from './GlobalNodeHealth';
import SecurityActivity from './SecurityActivity';
import NetworkMap from './NetworkMap';
import NodeTelemetry from './NodeTelemetry';
import AlertHistory from './AlertHistory';
import RegionalDistribution from './RegionalDistribution';
import SystemHealth from './SystemHealth';
import MetadataInspector from '../ui/MetadataInspector';
import { useNotify } from '../ui/NotificationProvider';
import { useLanguage } from '../ui/LanguageProvider';

const Sparkline = () => (
  <svg viewBox="0 0 100 30" className="w-16 h-8 text-blue-500 opacity-50">
    <path
      d="M0 25 L10 22 L20 25 L30 18 L40 20 L50 12 L60 15 L70 8 L80 12 L90 5 L100 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export type Settlement = {
  id: string;
  type: 'Deposit' | 'Settlement';
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  fee: number;
  netAmount: number;
  targetAmount: number;
  rate: number;
  bankAccount: string;
  status: string;
  date: string;
};

interface Props {
  cnyBalance: number;
  rubBalance: number;
  settlements: Settlement[];
  currentRate: number; // CNY to RUB
  userName: string;
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  systemConfig: {
    fee: number;
    routingPath: string;
    isMaintenance: boolean;
    brandName: string;
    accentColor: string;
    advisoryText: string;
  };
}

export function DashboardClient({ cnyBalance, rubBalance, settlements, currentRate, userName, kycStatus, systemConfig }: Props) {
  const { notify } = useNotify();
  const { dict } = useLanguage();
  const [selectedTx, setSelectedTx] = useState<Settlement | null>(null);
  const [showMetadata, setShowMetadata] = useState(false);
  const [inspectTx, setInspectTx] = useState<Settlement | null>(null);
  const [activeNode, setActiveNode] = useState('BJN-01');
  const [showVault, setShowVault] = useState<Settlement | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const isKycApproved = kycStatus === 'APPROVED';
  const rubToCnyRate = 1 / currentRate;

  const rateHistory = [
    rubToCnyRate * 0.985, 
    rubToCnyRate * 0.992, 
    rubToCnyRate * 0.998, 
    rubToCnyRate * 1.005, 
    rubToCnyRate * 0.996, 
    rubToCnyRate * 1.012, 
    rubToCnyRate
  ];

  const stats = [
    { label: dict.wallets || 'RUB Trade Assets', value: `₽ ${rubBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: 'text-gray-900' },
    { label: dict.payout_proceeds || 'CNY Proceeds', value: `¥ ${cnyBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: 'text-gray-400' },
    { label: 'Trade Rate', value: rubToCnyRate.toFixed(4), trend: <Sparkline />, color: 'text-blue-600' },
  ];

  const getCurrencySymbol = (ccy: string) => ccy === 'CNY' ? '¥' : '₽';

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ['ID', 'Type', 'From', 'To', 'Amount', 'Target Amount', 'Rate', 'Status', 'Date'];
      const rows = settlements.map(s => [
        s.id, s.type, s.fromCurrency, s.toCurrency, s.amount, s.targetAmount, s.rate, s.status, s.date
      ]);
      const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `trade_ledger_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
      notify('SUCCESS', 'Trade ledger exported successfully.');
    }, 2500);
  };

  return (
    <>
      <AnimatePresence>
        {isExporting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center space-y-8"
          >
            <div className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black tracking-tighter uppercase">Preparing Ledger</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Encrypting institutional data stream...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MetadataInspector 
        isOpen={!!inspectTx} 
        onClose={() => setInspectTx(null)} 
        txId={inspectTx?.id || ''} 
        payload={inspectTx ? {
          instruction_id: inspectTx.id,
          status: inspectTx.status,
          source: inspectTx.fromCurrency,
          target: inspectTx.toCurrency,
          trade_type: 'EXPORT_REMITTANCE',
          network: 'SPFS-CIPS-BRIDGE',
          encryption: 'AES-256-GCM',
          node_sync: true
        } : {}}
      />

      <AnimatePresence>
        {showVault && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/5 backdrop-blur-2xl no-print">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="max-w-2xl w-full p-12 bg-white rounded-[4rem] shadow-2xl space-y-12 border-[1.5rem] border-gray-50 relative overflow-hidden"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] rotate-[-15deg] pointer-events-none">
                <ShieldCheck size={400} />
              </div>

              <header className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Compliance Vault</p>
                  <h3 className="text-3xl font-black tracking-tighter text-gray-900 leading-none italic uppercase">Trade Certificate</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Ref: {showVault.id}</p>
                </div>
                <button onClick={() => setShowVault(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X size={24} className="text-gray-300 hover:text-black" />
                </button>
              </header>

              <div className="space-y-8 relative z-10">
                <div className="bg-gray-50 p-8 rounded-3xl space-y-6 border border-gray-100">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200/50">
                    <span className="text-[10px] font-black uppercase text-gray-400">Scan Status</span>
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-[8px] font-black uppercase rounded-full border border-green-100 shadow-sm">Trade Background Verified</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200/50">
                    <span className="text-[10px] font-black uppercase text-gray-400">Node Signature</span>
                    <span className="text-[10px] font-mono font-bold text-gray-900">0x77a1...902b</span>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-blue-600">
                    <Anchor size={20} />
                  </div>
                  <p className="text-[10px] text-blue-600 font-bold leading-relaxed italic opacity-80 uppercase tracking-widest">
                    This transaction was analyzed for trade-legitimacy and released via the secure Russo-Chinese corridor.
                  </p>
                </div>
              </div>

              <div className="pt-4 relative z-10">
                <button 
                  onClick={() => notify('SUCCESS', 'Audit certificate downloaded.')}
                  className="w-full bg-black text-white py-6 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:opacity-90 transition-all flex justify-center items-center space-x-3"
                >
                  <Download size={16} />
                  <span>Download Audit PDF</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {systemConfig.isMaintenance && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-orange-500 text-white px-12 py-3 text-center no-print relative z-[1000] overflow-hidden shadow-lg shadow-orange-500/20"
          >
            <p className="text-[9px] font-black uppercase tracking-[0.4em]">
              Node Advisory: {systemConfig.advisoryText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-blue-600 text-white px-12 py-3 text-center no-print relative z-[1000] overflow-hidden shadow-lg shadow-blue-500/20">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] flex items-center justify-center space-x-3">
          <Anchor size={12} strokeWidth={3} />
          <span>{dict.trade_remittance || 'Exclusive Channel: Russo-Chinese Trade Remittance Only (RUB to CNY)'}</span>
        </p>
      </div>

      <KycBanner status={kycStatus} />

      <header className="mb-12 flex justify-between items-center px-4 mt-12">
        <div className="space-y-1">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-black tracking-tight text-gray-900 italic uppercase"
          >
            {dict.portfolio || 'Trade Dashboard'}
          </motion.h1>
          <div className="flex items-center space-x-3">
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">{userName}</p>
             {isKycApproved && (
               <div className="flex items-center space-x-1.5 bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100">
                  <ShieldCheck size={10} strokeWidth={3} />
                  <span className="text-[8px] font-black uppercase tracking-widest">Verified Entity</span>
               </div>
             )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
           <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100 flex items-center space-x-4 shadow-sm">
              <div 
                className="w-10 h-10 rounded-xl shadow-sm flex items-center justify-center text-white font-black text-xs"
                style={{ backgroundColor: systemConfig.accentColor }}
              >
                98
              </div>
              <div className="pr-2">
                  <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Compliance Score</p>
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none" style={{ color: systemConfig.accentColor }}>Institutional Ready</p>
              </div>
           </div>
           <AlertHistory />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-6 group-hover:text-blue-500 transition-colors">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className={`text-5xl font-light tracking-tighter ${stat.color} mono italic`}>{stat.value}</p>
              {stat.trend}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch px-4">
        <div className="lg:col-span-2">
           <NetworkMap 
             routingPath={systemConfig.routingPath} 
             onNodeClick={(node) => setActiveNode(node.id)}
             accentColor={systemConfig.accentColor}
           />
        </div>
        <NodeTelemetry activeNode={activeNode} accentColor={systemConfig.accentColor} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch px-4">
        <div className="lg:col-span-2">
           <MonthlyVolumeAnalytics />
        </div>
        <RegionalDistribution accentColor={systemConfig.accentColor} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch px-4">
        <div className="lg:col-span-2">
          <section className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm h-full flex flex-col justify-between overflow-hidden relative">
             <TrendChart 
               data={rateHistory} 
               label="Trade Performance (RUB/CNY)" 
               accentColor={systemConfig.accentColor}
             />
          </section>
        </div>
        <SystemHealth />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 px-4">
        <div className="lg:col-span-1">
          <MarketBulletins />
        </div>
        <div className="lg:col-span-1">
          <SystemAudit />
        </div>
        <div className="lg:col-span-1">
          <SecurityActivity />
        </div>
      </div>

      <section className="bg-white p-12 lg:p-16 rounded-[4.5rem] border border-gray-100 shadow-sm mb-12 mx-4 overflow-hidden relative">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Trade Instruction Stream</h2>
            <p className="text-2xl font-black text-gray-900 italic uppercase">Recent Clearings</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleExport}
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black flex items-center space-x-2 px-6 py-3 rounded-2xl border border-gray-100 hover:border-black transition-all shadow-sm"
            >
              <Download size={14} />
              <span>Export Ledger</span>
            </button>
            {isKycApproved && (
              <Link 
                href="/dashboard/settlements" 
                className="text-[10px] font-black uppercase tracking-widest text-white px-8 py-4 rounded-2xl transition-all shadow-2xl shadow-blue-500/20 flex items-center space-x-2"
                style={{ backgroundColor: systemConfig.accentColor }}
              >
                <span>+ New Trade</span>
              </Link>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          {settlements.map((s, idx) => (
            <motion.div 
              key={s.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              onClick={() => setSelectedTx(s)}
              className="group flex items-center justify-between py-8 border-b border-gray-50 hover:bg-gray-50 transition-all px-8 -mx-8 rounded-[3.5rem] cursor-pointer"
            >
              <div className="flex items-center space-x-8">
                <div className={`p-4 rounded-2xl transition-all ${s.type === 'Deposit' ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-400 group-hover:bg-black group-hover:text-white'}`}>
                  {s.type === 'Deposit' ? <ArrowDownRight size={24} /> : <Anchor size={24} />}
                </div>
                <div>
                  <p className="font-black text-lg tracking-tight text-gray-900 uppercase italic">
                    {s.type === 'Deposit' ? `Liquidity Deposit (${s.fromCurrency})` : `Trade Remittance ${s.fromCurrency}/${s.toCurrency}`}
                  </p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-[10px] text-gray-300 font-mono tracking-tighter uppercase">{s.id.substr(0, 12)}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{s.date} · {s.bankAccount}</p>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-1 flex items-center space-x-12">
                <div className="text-right space-y-2">
                  <p className={`font-black text-2xl mono italic ${s.type === 'Deposit' ? 'text-green-600' : 'text-gray-900'}`}>
                    {s.type === 'Deposit' ? '+' : '-'} {getCurrencySymbol(s.fromCurrency)} {s.amount.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-end space-x-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      s.status === 'Completed' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 
                      s.status === 'Rejected' ? 'bg-red-500' : 'bg-blue-500 animate-pulse'
                    }`}></span>
                    <span className={`text-[9px] uppercase font-black tracking-[0.2em] ${
                      s.status === 'Completed' ? 'text-green-600' : 
                      s.status === 'Rejected' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setInspectTx(s); }}
                    className="p-3 bg-white border border-gray-100 rounded-xl text-gray-300 hover:text-black hover:border-black transition-all shadow-sm"
                    title="Audit Metadata"
                  >
                    <Code size={18} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowVault(s); }}
                    className="p-3 bg-white border border-gray-100 rounded-xl text-gray-300 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                    title="Trade Certificate"
                  >
                    <ShieldCheck size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Enhanced Transaction Drawer */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedTx(null); setShowMetadata(false); }}
              className="absolute inset-0 bg-black/5 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-[500px] h-full bg-white shadow-[-40px_0_80px_rgba(0,0,0,0.05)] p-12 lg:p-16 flex flex-col overflow-y-auto no-scrollbar"
            >
              <header className="flex justify-between items-start mb-20">
                <div className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-black mono tracking-widest uppercase">
                  Receipt {selectedTx.id}
                </div>
                <button onClick={() => { setSelectedTx(null); setShowMetadata(false); }} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X size={24} className="text-gray-300 hover:text-black" />
                </button>
              </header>

              <div className="space-y-16">
                <section>
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      selectedTx.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {selectedTx.status}
                    </span>
                    <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest underline decoration-gray-200">Institutional Ledger Verified</span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed italic">
                    Instruction processed via {selectedTx.fromCurrency}-{selectedTx.toCurrency} gateway. Routing confirmed by node controllers.
                  </p>
                </section>

                <section className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100/50 space-y-6">
                  <header className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-blue-600">
                      <ShieldCheck size={14} strokeWidth={3} />
                      <h4 className="text-[10px] font-black uppercase tracking-widest">Trade Profile</h4>
                    </div>
                    <span className="text-[10px] font-black text-blue-600 uppercase">99.8% Safe</span>
                  </header>
                  <div className="space-y-4">
                    {[
                      { label: 'Sanction Screening', status: 'CLEARED' },
                      { label: 'Trade Background', status: 'VERIFIED' },
                      { label: 'Beneficiary Audit', status: 'AUTHENTIC' },
                    ].map((v, i) => (
                      <div key={i} className="flex justify-between items-center text-[9px] font-bold">
                        <span className="text-gray-400 uppercase tracking-tighter">{v.label}</span>
                        <span className="text-blue-600 uppercase tracking-widest">{v.status}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-8">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Clearing Lifecycle</p>
                  <div className="space-y-10 border-l border-gray-100 ml-2 pl-8 relative">
                    {[
                      { time: '14:23:05', label: 'Instruction Received', color: 'bg-green-500' },
                      { time: '14:23:45', label: 'Compliance Handshake', color: 'bg-blue-500' },
                      { time: '14:24:10', label: 'Consensus Signatures (2/3)', color: 'bg-blue-500' },
                      { time: selectedTx.status === 'Completed' ? '14:25:32' : 'Pending', label: 'Proceed Release', color: selectedTx.status === 'Completed' ? 'bg-green-500' : 'bg-gray-200' },
                    ].map((step, i) => (
                      <div key={i} className="relative">
                        <div className={`absolute -left-[37px] top-1 w-2.5 h-2.5 rounded-full ${step.color} border-4 border-white shadow-sm`}></div>
                        <p className="text-[8px] font-black uppercase text-gray-300 mb-1">{step.time}</p>
                        <p className="text-[11px] font-bold text-gray-900">{step.label}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-8">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Routing Path</p>
                  <div className="flex justify-between items-center relative px-2">
                    <div className="absolute top-1/2 left-0 w-full h-px border-t border-dashed border-gray-100 -z-10"></div>
                    <div className="flex flex-col items-center space-y-2 bg-white px-2">
                      <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-gray-400"><Landmark size={14} /></div>
                      <span className="text-[8px] font-black uppercase text-gray-300">MSK_HUB</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2 bg-white px-2">
                      <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-gray-400"><Globe size={14} /></div>
                      <span className="text-[8px] font-black uppercase text-gray-300">SPFS_CIPS</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2 bg-white px-2">
                      <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-blue-500 shadow-sm"><Building size={14} /></div>
                      <span className="text-[8px] font-black uppercase text-blue-500">BJN_GATE</span>
                    </div>
                  </div>
                </section>

                <div className="bg-gray-50 p-10 rounded-[2.5rem] space-y-8">
                  <div className="flex justify-between items-center pb-8 border-b border-gray-200">
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">Gross {selectedTx.fromCurrency}</span>
                    <span className="text-2xl font-black text-gray-900">{getCurrencySymbol(selectedTx.fromCurrency)} {selectedTx.amount.toLocaleString()}</span>
                  </div>
                  
                  {selectedTx.type === 'Settlement' && (
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-medium">Platform Fee (1.5%)</span>
                        <span className="text-gray-400 mono">- {getCurrencySymbol(selectedTx.fromCurrency)} {selectedTx.fee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-8 border-t border-gray-200">
                        <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">Final {selectedTx.toCurrency} Payout</span>
                        <span className="text-5xl font-black text-green-600 tracking-tighter mono leading-none italic">
                          {getCurrencySymbol(selectedTx.toCurrency)} {selectedTx.targetAmount.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-blue-500 pt-4 uppercase tracking-tighter">
                        <span>Locked Rate</span>
                        <span className="font-mono">{selectedTx.rate.toFixed(4)} {selectedTx.toCurrency}/{selectedTx.fromCurrency}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-8 border-t border-gray-50">
                  <button 
                    onClick={() => setShowMetadata(!showMetadata)}
                    className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors px-4 py-2 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center space-x-2">
                      <Code size={14} />
                      <span>Technical Metadata</span>
                    </div>
                    <motion.div animate={{ rotate: showMetadata ? 180 : 0 }}>
                      <ArrowDownRight size={14} />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {showMetadata && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 bg-gray-900 rounded-2xl font-mono text-[9px] text-green-500 leading-loose overflow-x-auto">
                          {JSON.stringify({
                            instruction_id: selectedTx.id,
                            status: selectedTx.status,
                            from: selectedTx.fromCurrency,
                            to: selectedTx.toCurrency,
                            rate: selectedTx.rate,
                            network: 'SPFS-CIPS-BRIDGE',
                            encryption: 'AES-256-GCM',
                            hash: `0x${Math.random().toString(16).substr(2, 12)}...`,
                            nodes: ['MSK-NODE-03', 'BJN-NODE-01']
                          }, null, 2)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link 
                  href={`/dashboard/receipt/${selectedTx.id}`}
                  className="w-full bg-black text-white py-6 rounded-3xl text-xs font-black uppercase tracking-[0.2em] hover:opacity-90 transition-opacity flex justify-center items-center space-x-3 shadow-xl shadow-black/10"
                >
                  <ExternalLink size={18} />
                  <span>View Official Bill</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
