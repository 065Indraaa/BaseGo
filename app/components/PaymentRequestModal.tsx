'use client';

import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import {
  Send,
  Copy,
  Check,
  AlertCircle,
  Loader,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOKEN_ADDRESSES, TOKEN_NAMES, SWAP_FEE_PERCENTAGE } from '@/app/lib/contracts';
import { getOnchainKitQuote } from '@/app/lib/blockchain';

interface PaymentRequestModalProps {
  onClose: () => void;
  merchantAddress: string;
  exchangeRates: Record<string, number>;
}

export default function PaymentRequestModal({
  onClose,
  merchantAddress,
  exchangeRates,
}: PaymentRequestModalProps) {
  const [selectedToken, setSelectedToken] = useState(TOKEN_ADDRESSES.USDT);
  // `amount` is the desired IDRX the merchant wants to receive
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrPayload, setQrPayload] = useState<string | null>(null); // New state for QR payload

  const rate = exchangeRates[selectedToken] || 16000;
  const feeFraction = SWAP_FEE_PERCENTAGE / 100;
  const desiredIDRX = amount ? parseFloat(amount) : 0;
  const requiredIDRXGross = desiredIDRX > 0 ? desiredIDRX / (1 - feeFraction) : 0;
  const requiredTokenAmount = requiredIDRXGross > 0 ? requiredIDRXGross / rate : 0;
  const tokenAmountDisplay = requiredTokenAmount ? requiredTokenAmount.toFixed(6) : '0.000000';

  const copyPaymentDetails = () => {
    const details = `Kirim ${tokenAmountDisplay} ${TOKEN_NAMES[selectedToken]} ke ${merchantAddress} (merchant menerima ${desiredIDRX.toFixed(2)} IDRX)`;
    navigator.clipboard.writeText(details);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!amount || isNaN(parseFloat(amount))) return;

    setIsProcessing(true);
    try {
      // Fetch quote / swap path from OnChainKit (or fallback)
      const quote = await getOnchainKitQuote(selectedToken as `0x${string}`, desiredIDRX);

      const payload = {
        type: 'basego-pay',
        merchant: merchantAddress,
        token: selectedToken,
        amountToken: quote.amountIn,
        desiredIDRX: desiredIDRX.toFixed(2),
        feePercent: SWAP_FEE_PERCENTAGE,
        swapPath: quote.swapPath,
        minOut: quote.minOut,
        network: 'base',
      };
      setQrPayload(JSON.stringify(payload)); // Set payload for QR code

      // show QR for payer dApp to scan and execute payment
      setShowQR(true);
    } catch (error) {
      console.error("Error creating payment request:", error);
      // Optionally, show an error message to the user
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Send size={24} className="text-indigo-400" />
              Request Pembayaran
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Token Selection */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-300 mb-3">
              Pilih Token
            </label>
            <div className="flex gap-3">
              {[TOKEN_ADDRESSES.USDT, TOKEN_ADDRESSES.USDC].map((token) => (
                <button
                  key={token}
                  onClick={() => setSelectedToken(token)}
                  className={`flex-1 py-3 rounded-lg font-bold transition ${
                    selectedToken === token
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/5 border border-white/20 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {TOKEN_NAMES[token]}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input (desired IDRX) */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Jumlah yang ingin diterima (IDRX)
            </label>
            <input
              type="number"
              placeholder="Masukkan jumlah IDRX yang diinginkan..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Summary & QR */}
          {amount && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-6"
            >
              <p className="text-sm text-slate-300 mb-1">Ringkasan Permintaan</p>
              <p className="text-2xl font-bold text-emerald-300">
                Merchant ingin menerima: {desiredIDRX.toFixed(2)} IDRX
              </p>
              <p className="text-sm text-slate-200 mt-2">Biaya swap: {SWAP_FEE_PERCENTAGE}% (ditanggung pembayar)</p>
              <p className="text-xs text-slate-400 mt-1">
                Pembayar harus mengirim ≈ {tokenAmountDisplay} {TOKEN_NAMES[selectedToken]} (termasuk fee)
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Kurs: {new Intl.NumberFormat('id-ID').format(rate)} IDRX per {TOKEN_NAMES[selectedToken]}
              </p>
            </motion.div>
          )}

          {showQR && qrPayload && (
            <div className="bg-white p-6 rounded-2xl border border-white/10 inline-block mb-6 shadow-xl">
              <QRCode
                value={qrPayload}
                size={200}
                className="rounded-xl"
              />
            </div>
          )}

          {/* Merchant Address */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Alamat Penerima
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={merchantAddress}
                readOnly
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-slate-300 font-mono text-xs"
              />
              <button
                onClick={copyPaymentDetails}
                className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="flex gap-2 mb-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <AlertCircle size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300">
              Link pembayaran akan otomatis swap ke IDRX setelah diterima
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={!amount || isProcessing}
              className="flex-1 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Memproses...
                </>
              ) : (
                'Buat Request'
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 font-bold transition"
            >
              Batal
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
