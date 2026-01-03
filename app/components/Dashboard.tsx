'use client';

import { useState, useEffect } from 'react';
import { Store, History, PieChart, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useAuth } from '@/app/lib/authContext';
import {
  getMerchantIDRXBalance,
  getMerchantTransactionHistory,
  getExchangeRate,
} from '@/app/lib/blockchain';
import { TOKEN_ADDRESSES } from '@/app/lib/contracts';

// Import Components
import PosSection from './PosSection';
import HistorySection from './HistorySection';
import InvestSection from './InvestSection';
import AccountSection from './AccountSection';
import WithdrawModal from './WithdrawModal';
import KycModal from './KycModal';

export default function Dashboard() {
  const { address } = useAccount();
  const { merchantName } = useAuth();
  
  const [activeTab, setActiveTab] = useState('pos');
  const [kycStatus, setKycStatus] = useState('unverified'); 
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Real data from blockchain
  const [idrxBalance, setIDRXBalance] = useState('0.00');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});

  // Data Dummy Profil (from localStorage or default)
  const [merchantProfile, setMerchantProfile] = useState({
      name: merchantName || 'BaseGo Coffee',
      owner: 'Budi Santoso',
      phone: '0812-3456-7890',
      address: 'Jl. Sudirman No. 45, Jakarta Selatan'
  });

  const [savedBank, setSavedBank] = useState<null | { bank: string; number: string; name: string }>(null);

  // Load data from blockchain
  useEffect(() => {
    if (!address) {
      setIsLoading(false);
      return;
    }

    const loadBlockchainData = async () => {
      try {
        setIsLoading(true);

        // Get IDRX balance
        const balance = await getMerchantIDRXBalance(address);
        setIDRXBalance(balance);

        // Get transaction history (last 10)
        const history = await getMerchantTransactionHistory(address, 10);
        setTransactions(history || []);

        // Get exchange rates for USDT and USDC
        const rates: Record<string, number> = {};
        try {
          const usdtRate = await getExchangeRate(TOKEN_ADDRESSES.USDT as `0x${string}`);
          rates[TOKEN_ADDRESSES.USDT] = usdtRate.rate;
        } catch (e) {
          console.log('Could not fetch USDT rate:', e);
          rates[TOKEN_ADDRESSES.USDT] = 0;
        }
        try {
          const usdcRate = await getExchangeRate(TOKEN_ADDRESSES.USDC as `0x${string}`);
          rates[TOKEN_ADDRESSES.USDC] = usdcRate.rate;
        } catch (e) {
          console.log('Could not fetch USDC rate:', e);
          rates[TOKEN_ADDRESSES.USDC] = 0;
        }
        setExchangeRates(rates);
      } catch (error) {
        console.error('Error loading blockchain data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBlockchainData();
  }, [address]);

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
                {activeTab === 'pos' && <PosSection kycStatus={kycStatus} onOpenWithdraw={() => setIsWithdrawOpen(true)} setActiveTab={setActiveTab} idrxBalance={idrxBalance} isLoading={isLoading} />}
                {activeTab === 'history' && <HistorySection transactions={transactions} isLoading={isLoading} />}
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