'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Loader2, Sparkles, ShieldCheck, Zap, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const INVESTMENT_PLANS = [
  {
    id: 'basic',
    name: 'Vault Stabil',
    type: 'Single Staking',
    desc: 'Simpan IDRX. Bunga cair tiap detik.',
    apy: '5.2%',
    risk: 'Rendah',
    icon: ShieldCheck,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    recommend: true
  },
  {
    id: 'pro',
    name: 'Liquidity Pool',
    type: 'IDRX-USDC LP',
    desc: 'Supply likuiditas pasar. Yield tinggi.',
    apy: '14.8%',
    risk: 'Menengah',
    icon: Zap,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    recommend: false
  }
];

export default function InvestSection() {
  const [activeTab, setActiveTab] = useState<'stake' | 'withdraw'>('stake');
  const [selectedPlanId, setSelectedPlanId] = useState('basic');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSimulate = () => {
      if(!amount) return;
      setIsLoading(true);
      setTimeout(() => { setIsLoading(false); setIsSuccess(true); setAmount(''); setTimeout(() => setIsSuccess(false), 3000); }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-32">
      {/* Portfolio Card - Matching POS Style */}
      <div className="relative overflow-hidden rounded-[32px] p-[1px] bg-gradient-to-br from-white/40 to-white/10 shadow-xl">
         <div className="relative bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#3730A3] p-7 rounded-[31px] text-white">
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                    <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm"><Sparkles size={16} className="text-amber-300"/></div>
                    <span className="text-xs font-bold text-indigo-100 tracking-wide">Aset Investasi</span>
                </div>
                <h2 className="text-4xl font-black tracking-tight mb-6">Rp 5.240.000</h2>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/20 rounded-2xl p-3 backdrop-blur-md border border-white/5">
                        <p className="text-[10px] opacity-70 mb-1">Total Profit</p>
                        <p className="font-bold text-emerald-300">+Rp 45.200</p>
                    </div>
                    <div className="bg-black/20 rounded-2xl p-3 backdrop-blur-md border border-white/5">
                        <p className="text-[10px] opacity-70 mb-1">APY Avg.</p>
                        <p className="font-bold text-amber-300">5.8%</p>
                    </div>
                </div>
             </div>
         </div>
      </div>

      {/* Action Tabs */}
      <div className="bg-white/60 backdrop-blur-xl p-1 rounded-2xl flex border border-white/60 shadow-sm">
         <button onClick={() => setActiveTab('stake')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'stake' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}>Nabung</button>
         <button onClick={() => setActiveTab('withdraw')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'withdraw' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}>Tarik</button>
      </div>

      {/* Plan Selection */}
      {activeTab === 'stake' && (
        <div className="grid grid-cols-2 gap-4">
            {INVESTMENT_PLANS.map((plan) => (
                <div key={plan.id} onClick={() => setSelectedPlanId(plan.id)}
                    className={`relative p-5 rounded-[24px] border-2 cursor-pointer transition-all ${selectedPlanId === plan.id ? `bg-white border-${plan.color.split('-')[1]}-500 shadow-lg` : 'bg-white/60 border-transparent hover:bg-white'}`}>
                    {plan.recommend && <span className="absolute -top-3 left-4 bg-amber-400 text-white text-[9px] font-black px-2 py-1 rounded-full shadow-sm">BEST VALUE</span>}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${plan.bg} ${plan.color}`}>
                        <plan.icon size={20}/>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1">{plan.name}</h3>
                    <p className="text-2xl font-black text-slate-900">{plan.apy}</p>
                    <p className="text-[10px] text-slate-400 mt-2 leading-tight">{plan.desc}</p>
                    {selectedPlanId === plan.id && <div className={`absolute inset-0 border-2 rounded-[24px] border-${plan.color.split('-')[1]}-500 opacity-10 pointer-events-none`}></div>}
                </div>
            ))}
        </div>
      )}

      {/* Input Form */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[32px] border border-white shadow-lg shadow-slate-200/50">
          <label className="text-xs font-bold text-slate-500 ml-1 mb-2 block">Nominal (IDRX)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-xl font-bold focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"/>
          
          <button disabled={!amount || isLoading} onClick={handleSimulate}
            className="w-full mt-4 bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-900/20 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all active:scale-98 flex items-center justify-center gap-2">
            {isLoading ? <Loader2 className="animate-spin" size={20}/> : (activeTab === 'stake' ? 'Setor Dana' : 'Cairkan Dana')}
          </button>

          {isSuccess && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-emerald-50 text-emerald-600 p-3 rounded-xl text-xs font-bold text-center border border-emerald-100">
                Berhasil diproses!
            </motion.div>
          )}

          <div className="mt-4 flex gap-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
             <Info size={16} className="text-blue-500 shrink-0"/>
             <p className="text-[10px] text-blue-600/80 leading-relaxed">Bunga dihitung secara real-time dan dapat ditarik kapan saja tanpa penalty (untuk paket Basic).</p>
          </div>
      </div>
    </motion.div>
  );
}