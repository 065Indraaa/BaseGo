'use client';

import React from 'react';
import { ArrowRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { TOKEN_NAMES } from '@/app/lib/contracts';

interface Transaction {
  txHash: string;
  tokenIn: string;
  amountIn: string;
  amountOut: string;
  timestamp: Date;
  fee: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export default function TransactionHistory({
  transactions,
  isLoading,
}: TransactionHistoryProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin text-indigo-400" size={32} />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
        <p className="text-slate-400 text-lg">Belum ada transaksi</p>
        <p className="text-slate-500 text-sm mt-2">
          Mulai menerima pembayaran untuk melihat riwayat transaksi di sini
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx, index) => (
        <motion.div
          key={tx.txHash}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                  <ArrowRight size={18} className="text-emerald-400 rotate-90" />
                </div>
                <div>
                  <p className="font-bold">
                    {tx.amountIn} {TOKEN_NAMES[tx.tokenIn]} → {tx.amountOut} IDRX
                  </p>
                  <p className="text-xs text-slate-400">
                    {tx.timestamp.toLocaleDateString('id-ID')}{' '}
                    {tx.timestamp.toLocaleTimeString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <p>
                  Hash:{' '}
                  <code className="font-mono text-slate-400">
                    {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                  </code>
                </p>
                {parseFloat(tx.fee) > 0 && (
                  <p>
                    Fee: <span className="text-amber-300">{tx.fee} IDRX</span>
                  </p>
                )}
              </div>
            </div>

            <a
              href={`https://basescan.org/tx/${tx.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 text-sm font-bold whitespace-nowrap ml-4"
            >
              View ↗
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
