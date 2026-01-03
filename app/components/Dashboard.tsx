'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowDownUp,
  LogOut,
  TrendingUp,
  Wallet,
  History,
  Send,
  Settings,
  Copy,
  Check,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAccount, useDisconnect } from 'wagmi';
import { useAuth } from '@/app/lib/authContext';
import {
  getMerchantIDRXBalance,
  getMerchantTransactionHistory,
  getExchangeRate,
  executeSwapToIDRX,
  watchSwapEvents,
} from '@/app/lib/blockchain';
import { TOKEN_ADDRESSES, TOKEN_NAMES } from '@/app/lib/contracts';
import PaymentRequestModal from './PaymentRequestModal';
import TransactionHistory from './TransactionHistory';

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { merchantName } = useAuth();
  const { disconnect } = useDisconnect();

  const [idrxBalance, setIDRXBalance] = useState('0.00');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'settings'>('overview');

  // Load data on mount
  useEffect(() => {
    if (address) {
      loadData();
      // Watch for new swap events
      const unwatch = watchSwapEvents(address, (event) => {
        console.log('New swap detected:', event);
        loadData();
      });
      return () => unwatch();
    }
  }, [address]);

  async function loadData() {
    try {
      setIsLoading(true);
      if (!address) return;

      // Get IDRX balance
      const balance = await getMerchantIDRXBalance(address);
      setIDRXBalance(balance);

      // Get transaction history
      const history = await getMerchantTransactionHistory(address, 10);
      setTransactions(history);

      // Get exchange rates
      const rates: Record<string, number> = {};
      for (const token of Object.values(TOKEN_ADDRESSES)) {
        if (token && token !== TOKEN_ADDRESSES.IDRX) {
          const rate = await getExchangeRate(token as `0x${string}`);
          rates[token] = rate.rate;
        }
      }
      setExchangeRates(rates);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = () => {
    if (address) {
      localStorage.removeItem(`merchant_${address}`);
    }
    disconnect();
    window.location.href = '/';
  };

  const calculateTotalReceived = () => {
    return transactions.reduce((sum, tx) => sum + parseFloat(tx.amountOut), 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 px-6 pt-6 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between bg-white/5 border border-white/10 rounded-full px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
              B
            </div>
            <div>
              <div className="text-lg font-bold">{merchantName}</div>
              <div className="text-xs text-slate-400">Merchant Dashboard</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={copyAddress}
              className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition"
            >
              <span className="text-sm font-mono text-slate-300">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-full px-4 py-2 transition text-red-300"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* BALANCE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-600/40 to-purple-600/40 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-8 mb-8 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-slate-300 text-sm uppercase tracking-widest mb-2">Saldo IDRX Anda</p>
              <h2 className="text-5xl md:text-6xl font-black mb-2">
                {isLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  <>
                    Rp{' '}
                    {new Intl.NumberFormat('id-ID').format(parseFloat(idrxBalance) * 16000)}
                  </>
                )}
              </h2>
              <p className="text-slate-400">
                {isLoading ? '...' : idrxBalance} IDRX
              </p>
            </div>

            <div className="mt-6 md:mt-0 flex gap-3">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl px-6 py-3 font-bold transition"
              >
                <Send size={20} /> Request Payment
              </button>
              <button
                onClick={loadData}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl px-6 py-3 font-bold transition"
              >
                <ArrowDownUp size={20} /> Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* TABS */}
        <div className="flex gap-4 mb-8">
          {(['overview', 'history', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-bold transition ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {tab === 'overview' && 'Ringkasan'}
              {tab === 'history' && 'Riwayat'}
              {tab === 'settings' && 'Pengaturan'}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Total Received */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Total Diterima</h3>
                <TrendingUp className="text-emerald-400" />
              </div>
              <p className="text-3xl font-black">
                {isLoading ? '...' : calculateTotalReceived()} IDRX
              </p>
              <p className="text-sm text-slate-400 mt-2">
                dari {transactions.length} transaksi
              </p>
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Metode Pembayaran</h3>
                <Wallet className="text-blue-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">USDT</span>
                  <span>
                    1 = {new Intl.NumberFormat('id-ID').format(exchangeRates[TOKEN_ADDRESSES.USDT] || 0)} IDRX
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">USDC</span>
                  <span>
                    1 = {new Intl.NumberFormat('id-ID').format(exchangeRates[TOKEN_ADDRESSES.USDC] || 0)} IDRX
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Network Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Network</h3>
                <AlertCircle className="text-amber-400" />
              </div>
              <p className="text-sm text-slate-400">Base Mainnet (Layer 2)</p>
              <p className="text-xs text-slate-500 mt-2">
                ⚡ Transaksi~15 detik
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 px-2 py-1 rounded">
                  Live On-Chain
                </span>
                <span className="text-xs bg-blue-500/20 border border-blue-500/30 text-blue-200 px-2 py-1 rounded">
                  Non-Custodial
                </span>
              </div>
            </motion.div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <TransactionHistory transactions={transactions} isLoading={isLoading} />
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-2xl"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Settings size={24} /> Pengaturan Merchant
            </h3>

            <div className="space-y-6">
              {/* Wallet Address */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Alamat Wallet
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={address}
                    readOnly
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-slate-300 font-mono text-sm"
                  />
                  <button
                    onClick={copyAddress}
                    className="px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
                  >
                    {copied ? <Check /> : <Copy />}
                  </button>
                </div>
              </div>

              {/* Merchant Name */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Nama Merchant
                </label>
                <input
                  type="text"
                  value={merchantName || ''}
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-slate-300"
                />
              </div>

              {/* Auto-Swap Settings */}
              <div className="p-4 bg-indigo-600/20 border border-indigo-500/30 rounded-lg">
                <p className="text-sm font-bold mb-2">✓ Auto-Swap Aktif</p>
                <p className="text-xs text-slate-300">
                  Semua pembayaran USDT/USDC otomatis ditukar ke IDRX sesuai harga pasar real-time
                </p>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 font-bold hover:bg-red-500/30 transition"
              >
                Keluar dari Akun
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* MODALS */}
      {showPaymentModal && (
        <PaymentRequestModal
          onClose={() => setShowPaymentModal(false)}
          merchantAddress={address || ''}
          exchangeRates={exchangeRates}
        />
      )}
    </div>
  );
}

  const navItems = [
      { id: 'pos', icon: Store, label: 'Kasir' },
      { id: 'history', icon: History, label: 'Riwayat' },
      { id: 'invest', icon: PieChart, label: 'Aset' },
      { id: 'account', icon: User, label: 'Akun' }
  ];

  return (
    <div className="min-h-screen pb-32 relative overflow-hidden font-sans">
      
      {/* HEADER - Glassmorphism */}
      <header className="fixed top-0 w-full z-40 px-4 pt-4 pb-2">
        <div className="max-w-md mx-auto h-16 flex items-center justify-between bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm rounded-full px-6">
            <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                BaseGo <span className="text-slate-800 font-medium">Merchant</span>
            </h1>
            <div className="w-9 h-9 bg-gradient-to-br from-slate-100 to-white rounded-full flex items-center justify-center text-xs font-bold text-slate-600 border border-white shadow-sm ring-1 ring-slate-100">
                {merchantProfile.name ? merchantProfile.name.charAt(0).toUpperCase() : '?'}
            </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="pt-28 px-4 max-w-md mx-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
            >
                {activeTab === 'pos' && <PosSection kycStatus={kycStatus} onOpenWithdraw={() => setIsWithdrawOpen(true)} setActiveTab={setActiveTab} />}
                {activeTab === 'history' && <HistorySection />}
                {activeTab === 'invest' && <InvestSection />}
                {activeTab === 'account' && (
                    <AccountSection 
                        merchantProfile={merchantProfile} 
                        setMerchantProfile={setMerchantProfile} 
                        kycStatus={kycStatus} 
                        setIsKYCModalOpen={setIsKYCModalOpen}
                        savedBank={savedBank}
                        setSavedBank={setSavedBank}
                    />
                )}
            </motion.div>
          </AnimatePresence>
      </main>

      {/* BOTTOM NAV - Floating Island Design */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-slate-900/20 px-2 py-2 flex justify-between items-center rounded-[2rem] gap-1 md:gap-4 transition-all max-w-md w-full">
            {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                    <button 
                        key={item.id} 
                        onClick={() => setActiveTab(item.id)} 
                        className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-[1.5rem] py-3 transition-all duration-300 relative ${
                            isActive ? 'bg-white/10 text-white shadow-inner' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                    >
                        <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''} />
                        <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>{item.label}</span>
                        {isActive && <motion.div layoutId="navIndicator" className="absolute -bottom-1 w-1 h-1 bg-blue-400 rounded-full" />}
                    </button>
                )
            })}
        </nav>
      </div>

      <WithdrawModal 
        isOpen={isWithdrawOpen} 
        onClose={() => setIsWithdrawOpen(false)} 
        kycStatus={kycStatus}
        savedBank={savedBank}
        openKyc={() => {
            setIsWithdrawOpen(false);
            setIsKYCModalOpen(true);
        }}
      />

      <KycModal 
        isOpen={isKYCModalOpen} 
        onClose={() => setIsKYCModalOpen(false)} 
        onSuccess={() => setKycStatus('verified')}
      />
    </div>
  );
}