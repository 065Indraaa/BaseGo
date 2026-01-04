'use client';

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
// PERBAIKAN: Menambahkan 'Landmark' ke dalam import
import { Wallet, Lock, ArrowUpRight, Check, ChevronDown, X, Share2, Printer, AlertCircle, Delete, ScanLine, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOKENS } from '../lib/data';
import { TOKENS as CONTRACT_TOKENS } from '@/app/lib/contracts';

interface PosSectionProps {
    kycStatus: string;
    onOpenWithdraw: () => void;
    setActiveTab: (tab: string) => void;
    idrxBalance?: string;
    isLoading?: boolean;
    merchantAddress?: string;
    exchangeRates?: Record<string, number>;
}

export default function PosSection({ kycStatus, onOpenWithdraw, setActiveTab, idrxBalance = '0.00', isLoading = false, merchantAddress = '', exchangeRates = {} }: PosSectionProps) {
    // Build tokens list from contract addresses and exchangeRates
    const tokenList = [
        {
            address: CONTRACT_TOKENS.IDRX,
            id: 'idrx',
            name: 'IDR X',
            symbol: 'IDRX',
            price: exchangeRates?.[CONTRACT_TOKENS.IDRX.toLowerCase()] || 1,
            logo: '🇮🇩',
            isNative: true,
        },
        {
            address: CONTRACT_TOKENS.USDT,
            id: 'usdt',
            name: 'Tether',
            symbol: 'USDT',
            price: exchangeRates?.[CONTRACT_TOKENS.USDT.toLowerCase()] || 0,
            logo: '💵',
            isNative: false,
        },
        {
            address: CONTRACT_TOKENS.USDC,
            id: 'usdc',
            name: 'USD Coin',
            symbol: 'USDC',
            price: exchangeRates?.[CONTRACT_TOKENS.USDC.toLowerCase()] || 0,
            logo: '💵',
            isNative: false,
        },
    ];

    const defaultToken = tokenList[0];
    const [amountIDR, setAmountIDR] = useState('');
    const [selectedToken, setSelectedToken] = useState<any>(defaultToken);
  const [showQR, setShowQR] = useState(false);
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (amountIDR) {
        setBump(true);
        const timeout = setTimeout(() => setBump(false), 150);
        return () => clearTimeout(timeout);
    }
  }, [amountIDR]);

  // Removed: if (!TOKENS || TOKENS.length === 0) return null; // This check was for the dummy TOKENS array and is no longer relevant.

  const getCryptoAmount = () => {
    if (!amountIDR) return '0';
    const val = parseFloat(amountIDR);
    if (isNaN(val)) return '0';
    const cryptoVal = val / selectedToken.price;
    return selectedToken.id === 'idrx' 
      ? Math.floor(cryptoVal).toString() 
      : cryptoVal.toLocaleString('en-US', { maximumFractionDigits: 6 });
  };

  const handleNumpad = (num: string) => {
    if (num === 'C') setAmountIDR('');
    else if (num === 'DEL') setAmountIDR(prev => prev.slice(0, -1));
    else if (num === '000') {
        if (amountIDR === '' || amountIDR === '0') return;
        setAmountIDR(prev => prev + '000');
    }
    else {
        if (amountIDR.length >= 14) return;
        if (amountIDR === '0' && num === '0') return;
        if (amountIDR === '0' && num !== '0') setAmountIDR(num);
        else setAmountIDR(prev => prev + num);
    }
  };

  const getFontSize = (len: number) => {
    if (len > 12) return 'text-3xl';
    if (len > 9) return 'text-4xl';
    if (len > 6) return 'text-5xl';
    return 'text-6xl';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-24">
      
      {/* BALANCE CARD - Premium Gradient */}
      <div className="relative group">
         <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[32px] rotate-1 opacity-60 blur-lg group-hover:rotate-0 transition-all duration-500"></div>
         <div className="relative overflow-hidden rounded-[32px] p-[1px] bg-gradient-to-br from-white/40 to-white/5 backdrop-blur-2xl">
            <div className="relative bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#3730A3] p-7 rounded-[31px] text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-2 bg-indigo-950/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-inner">
                            <Wallet size={14} className="text-indigo-200"/> 
                            <span className="text-xs font-semibold tracking-wide text-indigo-100">Smart Wallet</span>
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold backdrop-blur-md border shadow-lg ${kycStatus === 'verified' ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-100' : 'bg-amber-500/20 border-amber-400/30 text-amber-100'}`}>
                            {kycStatus === 'verified' ? <Check size={12}/> : <Lock size={12}/>}
                            {kycStatus === 'verified' ? 'VERIFIED' : 'KYC REQUIRED'}
                        </div>
                    </div>
                    
                    <div className="mb-8">
                        <p className="text-indigo-200 text-sm font-medium mb-1 tracking-wide">Saldo Tersedia</p>
                        {isLoading ? (
                            <div className="h-12 bg-indigo-950/30 rounded-lg animate-pulse"></div>
                        ) : (
                            <>
                                <h2 className="text-4xl font-black tracking-tight drop-shadow-lg">Rp {new Intl.NumberFormat('id-ID').format(parseFloat(idrxBalance) * 16000)}</h2>
                                <p className="text-indigo-300 text-xs mt-1">{idrxBalance} IDRX</p>
                            </>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={onOpenWithdraw} className="bg-white text-indigo-700 font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_0_rgb(209,213,219)] hover:shadow-[0_2px_0_rgb(209,213,219)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all">
                            <ArrowUpRight size={20} strokeWidth={2.5}/> Tarik
                        </button>
                        <button onClick={() => setActiveTab('invest')} className="bg-indigo-500/40 hover:bg-indigo-500/50 border border-indigo-400/50 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 backdrop-blur-md transition-all active:scale-95 shadow-inner">
                            <Landmark size={20}/> Tabung
                        </button>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* POS INTERFACE */}
      <AnimatePresence mode='wait'>
        {!showQR ? (
          <motion.div 
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/60 backdrop-blur-xl rounded-[36px] shadow-2xl shadow-slate-200/50 border border-white/60 relative overflow-visible z-10"
          >
             {/* Header */}
             <div className="px-7 pt-7 pb-2 flex justify-between items-start">
                <div>
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tagihan Baru</span>
                </div>
                <div className="relative">
                   <button 
                      onClick={() => setIsTokenSelectorOpen(!isTokenSelectorOpen)} 
                      className={`flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-2xl border transition-all active:scale-95 shadow-sm hover:shadow-md bg-white border-slate-200`}
                   >
                      <span className="text-xl">{selectedToken.logo}</span>
                      <span className="text-xs font-black text-slate-700">{selectedToken.symbol}</span>
                      <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isTokenSelectorOpen ? 'rotate-180' : ''}`}/>
                   </button>
                   <AnimatePresence>
                     {isTokenSelectorOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute top-full right-0 mt-3 bg-white rounded-3xl shadow-xl border border-slate-100 p-2 z-50 w-56 origin-top-right"
                        >
                            {TOKENS.map((token) => (
                                <button key={token.id} onClick={() => { setSelectedToken(token); setIsTokenSelectorOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all mb-1 last:mb-0 hover:bg-slate-50`}>
                                    <span className="text-2xl">{token.logo}</span>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-800">{token.name}</p>
                                        <p className="text-[10px] font-medium text-slate-400">{token.symbol}</p>
                                    </div>
                                    {selectedToken.id === token.id && <div className="ml-auto w-2 h-2 rounded-full bg-blue-500"></div>}
                                </button>
                            ))}
                        </motion.div>
                     )}
                   </AnimatePresence>
                </div>
             </div>

             {/* Display */}
             <div className="px-7 py-2 text-right mb-4">
                <motion.div 
                   className="font-black tracking-tighter leading-none text-slate-800"
                   animate={{ scale: bump ? 1.05 : 1 }}
                >
                   <span className="text-3xl font-bold text-slate-300 mr-2 align-top inline-block mt-2">Rp</span>
                   <span className={`${getFontSize(amountIDR.length)} bg-clip-text text-transparent bg-gradient-to-b from-slate-700 to-slate-900`}>
                      {amountIDR ? formatIDRX(parseInt(amountIDR)) : '0'}
                   </span>
                </motion.div>
                <div className="mt-2 flex justify-end">
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        ≈ {getCryptoAmount()} {selectedToken.symbol}
                    </span>
                </div>
             </div>

             {/* Numpad */}
             <div className="bg-white/50 p-5 rounded-t-[40px] shadow-[inset_0_2px_20px_rgba(0,0,0,0.02)] border-t border-white/50 backdrop-blur-md">
                <div className="grid grid-cols-3 gap-3 mb-4">
                   {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                       <motion.button key={num} whileTap={{ scale: 0.9 }} onClick={() => handleNumpad(num.toString())} 
                           className="h-16 rounded-[24px] bg-white text-2xl font-bold text-slate-700 shadow-[0_4px_0_#e2e8f0] border border-slate-100 active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center hover:bg-slate-50">
                           {num}
                       </motion.button>
                   ))}
                   <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleNumpad('000')} className="h-16 rounded-[24px] bg-white text-lg font-bold text-slate-500 shadow-[0_4px_0_#e2e8f0] border border-slate-100 active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center">000</motion.button>
                   <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleNumpad('0')} className="h-16 rounded-[24px] bg-white text-2xl font-bold text-slate-700 shadow-[0_4px_0_#e2e8f0] border border-slate-100 active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center">0</motion.button>
                   <motion.button whileTap={{ scale: 0.9 }} onClick={() => amountIDR ? handleNumpad('DEL') : handleNumpad('C')} 
                      className="h-16 rounded-[24px] bg-rose-50 text-rose-500 shadow-[0_4px_0_#ffe4e6] border border-rose-100 active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center">
                       {amountIDR ? <Delete size={24}/> : <span className="font-bold text-lg">C</span>}
                   </motion.button>
                </div>
                <motion.button whileTap={{ scale: 0.98 }} onClick={() => amountIDR && setShowQR(true)} disabled={!amountIDR || parseInt(amountIDR) === 0}
                  className="w-full bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black py-5 rounded-[24px] text-lg shadow-xl shadow-slate-900/20 disabled:shadow-none transition-all flex items-center justify-center gap-3 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <ScanLine size={24} className={!amountIDR ? 'opacity-50' : 'animate-pulse'}/>
                  <span className="relative z-10">BUAT TAGIHAN</span>
                </motion.button>
             </div>
          </motion.div>
        ) : (
          <motion.div key="qr" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/80 backdrop-blur-xl rounded-[40px] p-8 text-center shadow-2xl border border-white relative">
              <div className="flex justify-between items-center mb-8">
                  <button onClick={() => setShowQR(false)} className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition text-slate-600"><X size={24}/></button>
                  <span className="font-black text-slate-800 text-sm tracking-wide uppercase">Scan to Pay</span>
                  <div className="w-12 h-12"></div>
              </div>
              <div className="bg-white p-6 rounded-[32px] border-2 border-slate-100 inline-block mb-6 shadow-xl shadow-slate-200/50">
                  {/* QR encodes a simple payment URI containing merchant address, token contract, network and amount */}
                  <QRCode value={`basego:pay?merchant=${merchantAddress}&token=${selectedToken.address || selectedToken.id}&amount=${getCryptoAmount()}&network=base`} size={200} className="rounded-xl" />
              </div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{getCryptoAmount()} <span className="text-2xl text-slate-400">{selectedToken.symbol}</span></h3>
              <p className="text-slate-500 font-bold text-sm mb-8 bg-slate-100 px-4 py-2 rounded-full inline-block">≈ Rp {formatIDRX(parseInt(amountIDR))}</p>
              <div className="flex gap-4">
                  <button className="flex-1 py-4 rounded-2xl bg-white border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2"><Share2 size={18}/> Share</button>
                  <button className="flex-1 py-4 rounded-2xl bg-white border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2"><Printer size={18}/> Print</button>
              </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MINI HISTORY WIDGET */}
      <div className="bg-white/40 backdrop-blur-md rounded-[28px] p-5 border border-white/40 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Transaksi Terakhir</h3>
                <button onClick={() => setActiveTab('history')} className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-full transition-colors bg-white/50 border border-white/50">LIHAT SEMUA</button>
            </div>
            {TRANSACTION_HISTORY.slice(0, 1).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-white/80 rounded-2xl border border-white shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50/50">
                            <Check size={18} strokeWidth={3}/>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Pembayaran Diterima</p>
                            <p className="text-[10px] text-slate-400 font-medium">{tx.time} • via {tx.token}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-black text-emerald-600">+ {formatIDRX(tx.amount)}</p>
                    </div>
                </div>
            ))}
      </div>
    </motion.div>
  );
}
