'use client';

import { useState, useEffect } from 'react';
import { X, ShieldCheck, CreditCard, Camera, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface KycModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function KycModal({ isOpen, onClose, onSuccess }: KycModalProps) {
  const [step, setStep] = useState(1);

  useEffect(() => { if (isOpen) setStep(1); }, [isOpen]);

  const handleSubmit = () => {
    setStep(3);
    setTimeout(() => { onClose(); onSuccess(); }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}/>
        
        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} 
            className="bg-white/90 backdrop-blur-xl rounded-[32px] w-full max-w-lg relative z-10 overflow-hidden shadow-2xl border border-white/50">
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-800">Verifikasi</h2>
                    <button onClick={onClose} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition"><X size={20}/></button>
                </div>

                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex gap-3">
                            <ShieldCheck className="text-blue-600 shrink-0" size={24}/>
                            <p className="text-xs text-blue-800 leading-relaxed font-medium">Sesuai regulasi, kami perlu memverifikasi identitas Anda untuk mengaktifkan fitur penarikan (Withdraw).</p>
                        </div>
                        <div className="space-y-3">
                            <button onClick={() => setStep(2)} className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors"><CreditCard size={20} className="text-slate-500 group-hover:text-blue-700"/></div>
                                    <div className="text-left"><p className="font-bold text-slate-800 text-sm">E-KTP</p><p className="text-[10px] text-slate-400">WNI</p></div>
                                </div>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500"/>
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right-8">
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 cursor-pointer transition-colors">
                                <Camera className="mx-auto text-slate-400 mb-2" size={32}/>
                                <p className="text-xs font-bold text-slate-600">Upload Foto KTP</p>
                            </div>
                            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 cursor-pointer transition-colors">
                                <Camera className="mx-auto text-slate-400 mb-2" size={32}/>
                                <p className="text-xs font-bold text-slate-600">Ambil Selfie</p>
                            </div>
                        </div>
                        <button onClick={handleSubmit} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all">Kirim Data</button>
                    </div>
                )}

                {step === 3 && (
                    <div className="py-8 text-center flex flex-col items-center">
                        <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
                        <h3 className="text-lg font-bold text-slate-800">Mengenkripsi Data...</h3>
                        <p className="text-slate-500 mt-2 text-xs">Mohon tunggu sebentar.</p>
                    </div>
                )}
            </div>
            {/* Progress Bar */}
            <div className="h-1.5 bg-slate-100 w-full">
                <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${step * 33.3}%` }}></div>
            </div>
        </motion.div>
    </div>
  );
}
