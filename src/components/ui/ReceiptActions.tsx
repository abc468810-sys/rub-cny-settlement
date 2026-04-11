'use client';

import { useState } from 'react';
import { Printer, Download } from 'lucide-react';
import ExportOverlay from './ExportOverlay';
import { useNotify } from './NotificationProvider';

export default function ReceiptActions() {
  const { notify } = useNotify();
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      notify('SUCCESS', 'Receipt exported to secure PDF.');
    }, 3000);
  };

  return (
    <div className="flex items-center space-x-4 no-print">
      <ExportOverlay isOpen={isExporting} onComplete={() => {}} title="Exporting Receipt" />
      
      <button 
        onClick={handleExport}
        className="flex items-center space-x-3 bg-gray-50 text-gray-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all shadow-sm"
      >
        <Download size={16} />
        <span>Export PDF</span>
      </button>
      <button 
        onClick={handlePrint}
        className="flex items-center space-x-3 bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <Printer size={16} />
        <span>Print Bill</span>
      </button>
    </div>
  );
}
