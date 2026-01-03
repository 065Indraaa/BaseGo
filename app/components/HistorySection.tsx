'use client';

import { useState, useMemo } from 'react';
import { ArrowDownLeft, ArrowUpRight, Calendar, FileText, Search, CheckCircle2, Clock, XCircle, Share2, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRANSACTION_HISTORY, formatIDRX } from '../lib/data';

type TimeFilter = 'Hari Ini' | '7 Hari' | '1 Bulan' | '1 Tahun' | 'Semua';
type TabType = 'income' | 'withdraw';

export default function HistorySection() {
  const [activeTab, setActiveTab] = useState<TabType>('income');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('Semua');
  const [showReportModal, setShowReportModal] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const filteredData = useMemo(() => {
    return TRANSACTION_HISTORY.filter(item => {
      const isIncome = activeTab === 'income';
      const itemTypeMatch = isIncome ? item.type === 'Payment' : item.type === 'Withdraw';
      let timeMatch = true; 
      if (timeFilter === 'Hari Ini') timeMatch = item.time.includes(':'); 
      return itemTypeMatch && timeMatch;
    });
  }, [activeTab, timeFilter]);

  const totalAmount = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredData]);

  const handleDownload = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => { setIsGeneratingPdf(false); setShowReportModal(false); alert('Laporan berhasil disimpan!'); }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-32 max-w-2xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Riwayat</h2>
          <p className="text-xs text-slate-500 font-medium">Arus kas keluar & masuk</p>
        </div>
        <button onClick={() => setShowReportModal(true)} className="bg-white/80 backdrop-blur-md border border-white shadow-sm text-slate-700 hover:bg-white hover:shadow-md px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95">
          <FileText size={16} /> Laporan
        </button>
      </div>

      {/* SUMMARY CARD - Modern Glass */}
      <div className={`relative overflow-hidden rounded-[32px] p-6 text-white shadow-2xl transition-all duration-500 ${activeTab === 'income' ? 'bg-emerald-600 shadow-emerald-900/20' : 'bg-rose-500 shadow-rose-900/20'}`}>
         <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
         <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
         
         <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-1.5 bg-black/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold mb-2 border border-white/10">
               <Calendar size={12}/> {timeFilter}
            </div>
            <p className="text-white/90 text-sm font-medium">Total {activeTab === 'income' ? 'Pendapatan' : 'Pencairan'}</p>
            <motion.h3 key={totalAmount} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-4xl font-black tracking-tight mt-1 mb-4 drop-shadow-sm">
              Rp {formatIDRX(totalAmount)}
            </motion.h3>
            <div className="flex gap-2 w-full">
               <div className="bg-white/10 rounded-2xl flex-1 p-2 backdrop-blur-md border border-white/10">
                  <p className="text-[10px] text-white/70">Volume</p>
                  <p className="font-bold">{filteredData.length} Tx</p>
               </div>
               <div className="bg-white/10 rounded-2xl flex-1 p-2 backdrop-blur-md border border-white/10">
                  <p className="text-[10px] text-white/70">Rata-rata</p>
                  <p className="font-bold">{filteredData.length > 0 ? formatIDRX(Math.round(totalAmount / filteredData.length)).slice(0, 4) + '...' : 0}</p>
               </div>
            </div>
         </div>
      </div>

      {/* FILTER TABS */}
      <div className="sticky top-20 z-30 space-y-3">
        <div className="bg-white/70 backdrop-blur-xl p-1.5 rounded-2xl shadow-lg shadow-slate-200/50 border border-white/60 flex relative">
           <motion.div className={`absolute top-1.5 bottom-1.5 rounded-xl shadow-sm z-0 ${activeTab === 'income' ? 'bg-white' : 'bg-white'}`}
              layoutId="tabBackground" initial={false}
              animate={{ x: activeTab === 'income' ? 0 : '100%', width: '50%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
           />
           <button onClick={() => setActiveTab('income')} className={`flex-1 py-3 text-sm font-bold relative z-10 flex items-center justify-center gap-2 transition-colors ${activeTab === 'income' ? 'text-emerald-600' : 'text-slate-400'}`}>
             <ArrowDownLeft size={18} /> Masuk
           </button>
           <button onClick={() => setActiveTab('withdraw')} className={`flex-1 py-3 text-sm font-bold relative z-10 flex items-center justify-center gap-2 transition-colors ${activeTab === 'withdraw' ? 'text-rose-600' : 'text-slate-400'}`}>
             <ArrowUpRight size={18} /> Keluar
           </button>
        </div>

        <div className="overflow-x-auto hide-scrollbar pb-2">
            <div className="flex gap-2 min-w-max px-1">
                {['Hari Ini', '7 Hari', '1 Bulan', 'Semua'].map((filter) => (
                    <button key={filter} onClick={() => setTimeFilter(filter as TimeFilter)}
                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${timeFilter === filter ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white/60 text-slate-500 border-transparent hover:bg-white'}`}>
                        {filter}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-3">
         <AnimatePresence mode="popLayout">
            {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                        className="bg-white/80 backdrop-blur-sm p-4 rounded-[20px] border border-white shadow-sm flex items-center justify-between hover:shadow-md hover:scale-[1.01] transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center shadow-inner ${activeTab === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {activeTab === 'income' ? <ArrowDownLeft size={20}/> : <ArrowUpRight size={20}/>}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">{activeTab === 'income' ? 'Pembayaran' : 'Penarikan'}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{item.token}</span>
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10}/> {item.time}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`font-black text-sm ${activeTab === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {activeTab === 'income' ? '+' : '-'} {formatIDRX(item.amount)}
                            </p>
                            <div className={`inline-flex items-center gap-1 text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${item.status === 'Success' ? 'bg-green-100/50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                {item.status}
                            </div>
                        </div>
                    </motion.div>
                ))
            ) : (
                <div className="text-center py-12 bg-white/40 rounded-[32px] border border-dashed border-slate-300">
                    <p className="text-slate-400 font-bold text-sm">Tidak ada transaksi</p>
                </div>
            )}
         </AnimatePresence>
      </div>
      
      {/* Modal Report (Keep existing logic, updated styling only if needed) */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} 
                className="bg-white rounded-[32px] w-full max-w-md p-6 shadow-2xl overflow-hidden relative">
                {/* Simplified Content for brevity */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800">Pratinjau PDF</h3>
                    <button onClick={() => setShowReportModal(false)}><X size={20} className="text-slate-400"/></button>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 text-center mb-6">
                    <h2 className="font-black text-2xl text-slate-900 mb-2">Rp {formatIDRX(totalAmount)}</h2>
                    <p className="text-xs text-slate-500">Total {timeFilter} • {activeTab}</p>
                </div>
                <button onClick={handleDownload} disabled={isGeneratingPdf} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex justify-center gap-2">
                    {isGeneratingPdf ? 'Memproses...' : <><Download size={18}/> Unduh PDF</>}
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
