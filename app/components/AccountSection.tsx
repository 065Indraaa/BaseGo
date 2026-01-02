import { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Building, User, Phone, 
  Save, Edit3, Rocket, CreditCard, Bell, HelpCircle, 
  LogOut, ChevronRight, Copy, QrCode, Camera, X, Download, Share2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';

interface AccountSectionProps {
  merchantProfile: { name: string; owner: string; phone: string; address: string; };
  setMerchantProfile: (profile: any) => void;
  kycStatus: string;
  setIsKYCModalOpen: (isOpen: boolean) => void;
  savedBank?: { bank: string; number: string; name: string } | null;
  setSavedBank: (bank: any) => void;
}

export default function AccountSection({ 
  merchantProfile, setMerchantProfile, kycStatus, setIsKYCModalOpen, savedBank, setSavedBank
}: AccountSectionProps) {
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(merchantProfile);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isQrStoreOpen, setIsQrStoreOpen] = useState(false);
  
  const merchantId = "MID-" + Math.random().toString(36).substr(2, 8).toUpperCase();
  const walletAddress = "0x71C...9A23"; 

  useEffect(() => {
    if (!merchantProfile.name) setIsOnboardingOpen(true);
  }, [merchantProfile]);

  const handleSaveProfile = () => { setMerchantProfile(tempProfile); setIsEditing(false); };
  const [onboardingData, setOnboardingData] = useState({ name: '', owner: '', phone: '', address: '' });

  const handleFinishOnboarding = () => {
    if(!onboardingData.name || !onboardingData.owner) return;
    setMerchantProfile(onboardingData); setTempProfile(onboardingData); setIsOnboardingOpen(false);
  };

  const copyToClipboard = (text: string) => { navigator.clipboard.writeText(text); alert('Disalin!'); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl mx-auto pb-32 relative">
      
      {/* ONBOARDING MODAL */}
      <AnimatePresence>
        {isOnboardingOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600"><Rocket size={32} /></div>
                        <h2 className="text-2xl font-black text-slate-800">Setup Toko</h2>
                        <p className="text-sm text-slate-500 mt-1">Lengkapi identitas usaha Anda.</p>
                    </div>
                    <div className="space-y-3">
                        <input type="text" placeholder="Nama Usaha" className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-200"
                                value={onboardingData.name} onChange={(e) => setOnboardingData({...onboardingData, name: e.target.value})} />
                        <input type="text" placeholder="Nama Pemilik" className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-200"
                                value={onboardingData.owner} onChange={(e) => setOnboardingData({...onboardingData, owner: e.target.value})} />
                    </div>
                    <button onClick={handleFinishOnboarding} disabled={!onboardingData.name || !onboardingData.owner} className="w-full mt-6 bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all">Simpan & Mulai</button>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* QR STORE MODAL */}
      <AnimatePresence>
        {isQrStoreOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] w-full max-w-sm p-6 shadow-2xl relative">
                    <button onClick={() => setIsQrStoreOpen(false)} className="absolute top-4 right-4 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200"><X size={16}/></button>
                    <div className="text-center mt-2 mb-6">
                        <h3 className="text-lg font-black text-slate-800">QR Toko Statis</h3>
                    </div>
                    <div className="bg-gradient-to-b from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col items-center">
                        <div className="bg-white p-3 rounded-2xl shadow-lg mb-4"><QRCode value={`ethereum:${walletAddress}`} size={160} /></div>
                        <div className="flex items-center gap-2 text-[10px] font-mono opacity-80 bg-black/20 px-3 py-1 rounded-lg cursor-pointer" onClick={() => copyToClipboard(walletAddress)}>
                            {walletAddress} <Copy size={10} />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-200"><Share2 size={16}/> Share</button>
                        <button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2"><Download size={16}/> Save</button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* BUSINESS CARD */}
      <div className="relative overflow-hidden rounded-[32px] p-[1px] bg-gradient-to-br from-white/60 to-white/10 shadow-xl backdrop-blur-sm">
        <div className="relative bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#3730A3] p-7 rounded-[31px] text-white overflow-hidden min-h-[260px] flex flex-col">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
            
            <div className="relative z-10 flex justify-between items-start mb-6">
                 <div className="flex items-center gap-2 bg-indigo-900/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-indigo-400/30 shadow-inner cursor-pointer" onClick={() => copyToClipboard(merchantId)}>
                    <span className="text-[10px] text-indigo-200 font-bold uppercase">ID</span>
                    <span className="text-[10px] font-mono font-bold text-white tracking-widest">{merchantId}</span>
                    <Copy size={10} className="text-indigo-300"/>
                 </div>
                 <button onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 ${isEditing ? 'bg-emerald-500 text-white' : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'}`}>
                    {isEditing ? <><Save size={14}/> Simpan</> : <><Edit3 size={14}/> Edit</>}
                 </button>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left flex-1">
                <div className="relative group">
                    <div className="w-24 h-24 bg-white rounded-[24px] flex items-center justify-center text-[#4338CA] text-4xl font-black shadow-xl transform group-hover:scale-105 transition-transform border-4 border-white/10">
                        {merchantProfile.name ? merchantProfile.name.charAt(0).toUpperCase() : 'B'}
                    </div>
                    <div className={`absolute -bottom-2 -right-2 p-1.5 rounded-full border-4 border-[#3730A3] shadow-sm ${kycStatus === 'verified' ? 'bg-emerald-500' : 'bg-amber-500'} text-white`}>
                        {kycStatus === 'verified' ? <ShieldCheck size={14}/> : <ShieldAlert size={14}/>}
                    </div>
                </div>
                
                <div className="flex-1 w-full flex flex-col justify-center">
                    {isEditing ? (
                        <div className="space-y-2 w-full">
                            <input value={tempProfile.name} onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})} placeholder="Nama Toko" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-lg font-bold text-white placeholder-white/40 outline-none" />
                            <input value={tempProfile.owner} onChange={(e) => setTempProfile({...tempProfile, owner: e.target.value})} placeholder="Pemilik" className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 outline-none" />
                            <input value={tempProfile.address} onChange={(e) => setTempProfile({...tempProfile, address: e.target.value})} placeholder="Alamat" className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 outline-none" />
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-2xl font-black tracking-tight leading-tight mb-2">{merchantProfile.name || 'Nama Toko'}</h2>
                            <p className="text-sm font-medium text-indigo-100/80 mb-4">{merchantProfile.address || 'Alamat belum diatur'}</p>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <div className="flex items-center gap-1.5 bg-indigo-900/30 px-3 py-1.5 rounded-lg border border-indigo-400/20"><User size={12} className="text-indigo-200"/><span className="text-xs font-bold text-white">{merchantProfile.owner || '-'}</span></div>
                                <div className="flex items-center gap-1.5 bg-indigo-900/30 px-3 py-1.5 rounded-lg border border-indigo-400/20"><Phone size={12} className="text-indigo-200"/><span className="text-xs font-bold text-white">{merchantProfile.phone || '-'}</span></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* STATUS & BANK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={() => setIsKYCModalOpen(true)} className={`p-5 rounded-[28px] border relative overflow-hidden text-left transition-all active:scale-98 group ${kycStatus === 'verified' ? 'bg-white/80 border-emerald-100 shadow-sm' : 'bg-white/80 border-amber-100 shadow-sm'}`}>
             <div className="flex justify-between items-start mb-3">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${kycStatus === 'verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                     {kycStatus === 'verified' ? <ShieldCheck size={24}/> : <ShieldAlert size={24}/>}
                 </div>
                 {kycStatus !== 'verified' && <div className="bg-amber-100 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-full">Action Needed</div>}
             </div>
             <h3 className="font-bold text-slate-800 text-sm">Status KYC</h3>
             <p className="text-xs mt-1 text-slate-500 font-medium">{kycStatus === 'verified' ? 'Terverifikasi (Tier 2)' : 'Lengkapi dokumen'}</p>
          </button>

          <div className="bg-white/80 p-5 rounded-[28px] border border-white shadow-sm relative overflow-hidden">
             <div className="flex justify-between items-start mb-3">
                 <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><Building size={24}/></div>
                 <button onClick={() => setSavedBank(savedBank ? null : {bank: 'BCA', number: '8273645192', name: merchantProfile.owner})} className="text-slate-300 hover:text-indigo-600 transition bg-slate-50 p-2 rounded-xl"><Edit3 size={14}/></button>
             </div>
             <h3 className="font-bold text-slate-800 text-sm">Rekening</h3>
             {savedBank ? (
                <div className="mt-1">
                    <p className="text-sm font-black text-slate-700 font-mono">{savedBank.bank} •• {savedBank.number.slice(-4)}</p>
                    <p className="text-[10px] text-slate-400 uppercase truncate font-bold mt-0.5">{savedBank.name}</p>
                </div>
             ) : (
                <p className="text-xs italic text-slate-400 mt-1">Belum ada rekening</p>
             )}
          </div>
      </div>

      {/* MENU LIST */}
      <div className="bg-white/60 backdrop-blur-md rounded-[32px] border border-white shadow-sm overflow-hidden">
        <div className="divide-y divide-white/50">
            {[
                { icon: Bell, label: 'Notifikasi', desc: 'Email & Push', action: () => alert('Coming Soon') },
                { icon: QrCode, label: 'QR Standee', desc: 'Cetak untuk kasir', action: () => setIsQrStoreOpen(true) },
                { icon: CreditCard, label: 'Metode Pembayaran', desc: 'Wallet & Bank', action: () => {} },
                { icon: HelpCircle, label: 'Pusat Bantuan', desc: 'FAQ & CS', action: () => window.open('https://help.basego.id', '_blank') },
            ].map((item, idx) => (
                <button key={idx} onClick={item.action} className="w-full flex items-center gap-4 p-5 hover:bg-white/60 transition-colors text-left group">
                    <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all flex items-center justify-center border border-white">
                        <item.icon size={18}/>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">{item.label}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all"/>
                </button>
            ))}
        </div>
      </div>

      <button className="w-full py-4 rounded-2xl text-rose-500 font-bold text-sm hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 flex items-center justify-center gap-2">
          <LogOut size={18}/> Keluar
      </button>

      <div className="text-center pt-2"><p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">v1.2.0</p></div>
    </motion.div>
  );
}