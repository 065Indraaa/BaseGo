'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Gift, TrendingUp } from 'lucide-react';

const PROMOS = [
  {
    id: 1,
    title: "Bebas Gas Fee!",
    desc: "Subsidi onchain 100% untuk merchant BaseGo.",
    icon: <Zap className="text-yellow-400" size={24} />,
    bg: "bg-gradient-to-r from-blue-600 to-indigo-600",
    text: "text-white"
  },
  {
    id: 2,
    title: "Yield IDRX 4.5%",
    desc: "Auto-stake saldo mengendap, cair kapan saja.",
    icon: <TrendingUp className="text-emerald-400" size={24} />,
    bg: "bg-gradient-to-r from-slate-900 to-slate-800",
    text: "text-emerald-50"
  },
  {
    id: 3,
    title: "Gratis NFT Struk",
    desc: "Loyalty program otomatis untuk pelanggan.",
    icon: <Gift className="text-purple-200" size={24} />,
    bg: "bg-gradient-to-r from-purple-600 to-pink-600",
    text: "text-white"
  }
];

export default function PromoCarousel() {
  return (
    <div className="w-full overflow-x-auto pb-4 pt-2 px-1 hide-scrollbar">
      <div className="flex gap-4 w-max">
        {PROMOS.map((promo, index) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={`relative w-72 h-32 rounded-3xl p-5 flex flex-col justify-between shadow-lg ${promo.bg} shrink-0 cursor-pointer overflow-hidden`}
          >
            {/* Dekorasi Background */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl"></div>
            
            <div className="flex justify-between items-start z-10">
              <div>
                <h3 className={`font-bold text-lg ${promo.text}`}>{promo.title}</h3>
                <p className={`text-xs opacity-80 ${promo.text} max-w-[170px] mt-1 leading-relaxed`}>{promo.desc}</p>
              </div>
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md shadow-inner">
                {promo.icon}
              </div>
            </div>
            
            <div className="z-10 self-start mt-auto">
              <span className="text-[10px] font-bold bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-md text-white flex items-center gap-1">
                Aktifkan Sekarang →
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}