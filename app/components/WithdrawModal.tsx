'use client';

import { useState, useEffect } from 'react';
import { Lock, X, Landmark, Loader2, Check } from 'lucide-react';
import { formatIDRX } from '../lib/data';
import { motion } from 'framer-motion';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  kycStatus: string;
  savedBank: { bank: string; number: string; name: string } | null;
  openKyc: () => void;
}

export default function WithdrawModal({ isOpen, onClose, kycStatus, savedBank, openKyc }: WithdrawModalProps) {
  const [step, setStep] = useState('input');
  const [withdrawData, setWithdrawData] = useState({ amount: '' });

  useEffect(() => { if (isOpen) { setStep('input'); setWithdrawData({ amount: '' }); } }, [isOpen]);

  const handleWithdrawSubmit = () => {
    setStep('processing');
    setTimeout(() => setStep('success'), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
         className="bg-white/95 backdrop-blur-xl rounded-[32px] w-full max-w-md relative z-10 overflow-hidden shadow-2xl border border-white/50">
        
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-black text-slate-800">Tarik Dana</h2>
                 <button onClick={onClose} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition"><X size={20}/></button>
            </div>

            {kycStatus !== 'verified' ? (
                <div className="text-center py-6">
                    <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><Lock size={32}/></div>
                    <h3 className="font-bold text-slate-800 mb-2">Akun Belum Terverifikasi</h3>
                    <p className="text-sm text-slate-500 mb-6">Lakukan KYC untuk membuka fitur penarikan.</p>
                    <button onClick={openKyc} className="w-full bg-amber-500 text-white font-bold py-3.5 rounded-xl hover:bg-amber-600 transition">Verifikasi Sekarang</button>
                </div>
            ) : (
                <>
                  {step === 'input' && (
                      <div className="space-y-6">
                          {savedBank ? (
                             <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600"><Landmark size={20}/></div>
                                <div><p className="font-bold text-slate-800 text-sm">{savedBank.bank}</p><p className="text-xs text-slate-500">{savedBank.number}</p></div>
                             </div>
                          ) : (
                             <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold text-center">Belum ada rekening tujuan</div>
                          )}

                          <div>
                              <label className="text-xs font-bold text-slate-500 ml-1">Nominal Penarikan</label>
                              <div className="relative mt-2">
                                  <input type="number" placeholder="0" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                      value={withdrawData.amount} onChange={(e) => setWithdrawData({ amount: e.target.value })} />
                                  <span className="absolute right-5 top-5 font-bold text-slate-400 text-sm">IDRX</span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-2 text-right">Saldo Tersedia: Rp 12.500.000</p>
                          </div>

                          <button onClick={handleWithdrawSubmit} disabled={!withdrawData.amount || !savedBank} 
                              className="w-full bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-95">
                              Konfirmasi Penarikan
                          </button>
                      </div>
                  )}

                  {step === 'processing' && (
                      <div className="py-12 text-center flex flex-col items-center">
                          <Loader2 size={56} className="text-blue-600 animate-spin mb-6" />
                          <h3 className="text-xl font-bold text-slate-800">Memproses...</h3>
                          <p className="text-slate-500 mt-2 text-sm">Dana sedang dikirim via jaringan Base.</p>
                      </div>
                  )}

                  {step === 'success' && (
                      <div className="py-8 text-center flex flex-col items-center">
                          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50"><Check size={40}/></div>
                          <h3 className="text-2xl font-black text-slate-900">Berhasil!</h3>
                          <p className="text-slate-500 mt-2 mb-8 max-w-[200px]">Dana sebesar <span className="font-bold text-slate-800">Rp {formatIDRX(parseInt(withdrawData.amount))}</span> berhasil ditarik.</p>
                          <button onClick={onClose} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-xl transition">Tutup</button>
                      </div>
                  )}
                </>
            )}
        </div>
      </motion.div>
    </div>
  );
}
