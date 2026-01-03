'use client';

import { 
  ConnectWallet, 
  Wallet, 
  WalletDropdown, 
  WalletDropdownDisconnect, 
  WalletDropdownLink 
} from '@coinbase/onchainkit/wallet';
import { 
  Address, 
  Avatar, 
  Name, 
  Identity, 
  EthBalance 
} from '@coinbase/onchainkit/identity';
import { ArrowRight, Zap, ShieldCheck, TrendingUp, ChevronRight, Store, Globe, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/lib/authContext';
import Dashboard from './Dashboard';

export default function LandingPage() {
  const { address, isConnected } = useAccount();
  const { isMerchant } = useAuth();
  const [merchantName, setMerchantName] = useState('');
  const [showMerchantForm, setShowMerchantForm] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Register merchant
  const handleRegisterMerchant = () => {
    if (address && merchantName.trim()) {
      localStorage.setItem(
        `merchant_${address}`,
        JSON.stringify({ name: merchantName, registeredAt: new Date().toISOString() })
      );
      setShowDashboard(true);
      setShowMerchantForm(false);
    }
  };

  // Jika sudah login sebagai merchant, tampilkan dashboard
  if (mounted && isConnected && isMerchant && showDashboard) {
    return <Dashboard />;
  }
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-indigo-500 selection:text-white overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 px-6 pt-6">
        <div className="max-w-6xl mx-auto h-20 flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-8 shadow-2xl">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                    B
                </div>
                <span className="text-xl font-bold tracking-tight">BaseGo <span className="text-indigo-400">Merchant</span></span>
            </div>
            
            <div className="flex items-center gap-4">
               {/* Smart Wallet Connect Button */}
               <div className="bg-white/10 hover:bg-white/20 transition rounded-full p-1 pr-2 pl-2">
                 <Wallet>
                    <ConnectWallet className="bg-transparent hover:bg-transparent text-white font-bold text-sm px-4 py-2">
                      <Avatar className="h-6 w-6" />
                      <Name className="text-white" />
                    </ConnectWallet>
                    <WalletDropdown>
                      <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                        <Avatar />
                        <Name />
                        <Address />
                        <EthBalance />
                      </Identity>
                      <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com">
                        Wallet
                      </WalletDropdownLink>
                      <WalletDropdownDisconnect />
                    </WalletDropdown>
                 </Wallet>
               </div>
            </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-48 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                    The Future of Payments
                </span>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                    Terima Crypto <br/> Cairkan Rupiah.
                </h1>
                <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Solusi kasir (POS) modern untuk bisnis Anda. Terima pembayaran di jaringan Base L2 yang cepat, hemat, dan otomatis terkonversi ke Stablecoin IDR.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                   {!isConnected ? (
                     <div className="bg-white/10 hover:bg-white/20 transition rounded-full p-1 pr-4 pl-4">
                       <Wallet>
                         <ConnectWallet className="bg-transparent hover:bg-transparent text-white font-bold text-lg px-4 py-3">
                           <Avatar className="h-6 w-6" />
                           <Name className="text-white" />
                         </ConnectWallet>
                       </Wallet>
                     </div>
                   ) : !isMerchant && !showMerchantForm ? (
                     <button 
                       onClick={() => setShowMerchantForm(true)}
                       className="h-14 px-8 rounded-full bg-white text-slate-900 font-bold text-lg hover:bg-indigo-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2 group"
                     >
                       Daftar Sebagai Merchant <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                     </button>
                   ) : null}
                   <button className="h-14 px-8 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md flex items-center gap-2">
                      <Globe size={20}/> Pelajari Cara Kerja
                   </button>
                </div>

                {/* Merchant Registration Form */}
                {showMerchantForm && isConnected && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md mx-auto"
                  >
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Store size={24} className="text-indigo-400" />
                      Daftar Merchant Baru
                    </h3>
                    <p className="text-slate-400 text-sm mb-6">
                      Masukkan nama bisnis Anda untuk mulai menerima pembayaran crypto
                    </p>
                    <input
                      type="text"
                      placeholder="Nama Toko/Bisnis Anda"
                      value={merchantName}
                      onChange={(e) => setMerchantName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 mb-4 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={handleRegisterMerchant}
                      disabled={!merchantName.trim()}
                      className="w-full h-12 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all"
                    >
                      Mulai Sekarang
                    </button>
                    <button
                      onClick={() => {
                        setShowMerchantForm(false);
                        setMerchantName('');
                      }}
                      className="w-full h-12 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 text-white font-bold transition-all mt-2"
                    >
                      Batal
                    </button>
                  </motion.div>
                )}
            </motion.div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
              {[
                  { icon: Zap, title: "Transaksi Kilat", desc: "Settlement detik via Base L2.", color: "text-amber-400", bg: "from-amber-500/20 to-orange-600/10" },
                  { icon: ShieldCheck, title: "Non-Custodial", desc: "Dana 100% milik Anda di wallet.", color: "text-emerald-400", bg: "from-emerald-500/20 to-teal-600/10" },
                  { icon: TrendingUp, title: "Auto-IDRX", desc: "Anti fluktuasi, konversi otomatis.", color: "text-indigo-400", bg: "from-indigo-500/20 to-purple-600/10" }
              ].map((f, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className={`bg-gradient-to-br ${f.bg} p-[1px] rounded-[32px] hover:scale-[1.02] transition-transform duration-300`}
                  >
                      <div className="bg-[#0f172a]/90 backdrop-blur-xl p-8 rounded-[31px] h-full border border-white/5 hover:border-white/10 transition-colors">
                          <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${f.color}`}>
                              <f.icon size={24} strokeWidth={2.5}/>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                          <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                      </div>
                  </motion.div>
              ))}
          </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center border-t border-white/5 bg-[#0b1121]">
          <p className="text-slate-500 text-sm">
             Built on <span className="text-blue-500 font-bold">BASE</span> • Powered by <span className="text-indigo-500 font-bold">OnchainKit</span>
          </p>
          <p className="text-slate-700 text-[10px] mt-2">© 2024 BaseGo Merchant. All rights reserved.</p>
      </footer>
    </div>
  );
}