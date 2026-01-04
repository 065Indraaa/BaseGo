/**
 * Utility fungsi blockchain untuk BaseGo.
 * Menggunakan viem untuk akses RPC Base dan memanggil OnChainKit untuk mendapatkan
 * kurs dan quote swap. Fallback ke nilai simulasi 16.000 jika tidak ada API key.
 */

import {
  createPublicClient,
  parseUnits,
  formatUnits,
  http,
  type Address,
  type WalletClient,
  type Hex,
} from 'viem';
import { base } from 'viem/chains';
import { ERC20_ABI, MERCHANT_ROUTER_ABI } from './contractABIs';
import {
  TOKEN_ADDRESSES,
  TOKEN_DECIMALS,
  BASE_RPC_URL,
  MERCHANT_ROUTER_ADDRESS,
} from './contracts';

/** Inisialisasi public client satu kali */
const publicClient = createPublicClient({
  chain: base,
  transport: http(BASE_RPC_URL),
});

/**
 * Ambil saldo ERC-20 milik `userAddress`.
 * Bila token address adalah placeholder, fungsi mengembalikan '0'.
 */
export async function getTokenBalance(
  userAddress: Address,
  tokenAddress: Address
): Promise<string> {
  if (tokenAddress === '0x0000000000000000000000000000000000000000') {
    console.warn('Token address is placeholder, skipping balance fetch');
    return '0';
  }
  try {
    const balance = (await publicClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [userAddress],
    })) as bigint;
    const decimals = TOKEN_DECIMALS[(tokenAddress as string).toLowerCase()] ?? 18;
    return formatUnits(balance, decimals);
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return '0';
  }
}

/** Ambil saldo IDRX untuk merchant */
export async function getMerchantIDRXBalance(
  merchantAddress: Address
): Promise<string> {
  return getTokenBalance(merchantAddress, TOKEN_ADDRESSES.IDRX as Address);
}

/**
 * Berikan izin (approve) ke router untuk membelanjakan token `tokenAddress`
 * sebanyak `amount` atas nama `account`.
 */
export async function approveToken(
  tokenAddress: Address,
  spenderAddress: Address,
  amount: string,
  account: Address,
  walletClient: WalletClient
): Promise<string> {
  const decimals = TOKEN_DECIMALS[(tokenAddress as string).toLowerCase()] ?? 18;
  const amountInUnits = parseUnits(amount, decimals);
  const hash = await walletClient.writeContract({
    chain: base,
    account: account,
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [spenderAddress, amountInUnits],
  });
  return hash as string;
}

/**
 * Jalankan swap USDT/USDC ke IDRX via MerchantRouter.
 * `merchantAddress` adalah akun yang menandatangani transaksi dan menerima IDRX.
 */
export async function executeSwapToIDRX(
  merchantAddress: Address,
  tokenAddress: Address,
  amount: string,
  walletClient: WalletClient,
  minIDRXAmount?: string
): Promise<string> {
  const decimals = TOKEN_DECIMALS[(tokenAddress as string).toLowerCase()] ?? 18;
  const amountInUnits = parseUnits(amount, decimals);
  const idrxDecimals =
    TOKEN_DECIMALS[TOKEN_ADDRESSES.IDRX.toLowerCase()] ?? 18;
  const minAmount = minIDRXAmount
    ? parseUnits(minIDRXAmount, idrxDecimals)
    : parseUnits('0', idrxDecimals);

  // Approve router untuk tokenIn
  await approveToken(
    tokenAddress,
    MERCHANT_ROUTER_ADDRESS as Address,
    amount,
    merchantAddress,
    walletClient
  );

  // Tunggu sekitar 1 detik agar approval terproses (untuk produksi sebaiknya gunakan receipt)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Lakukan swap
  const hash = await walletClient.writeContract({
    chain: base,
    account: merchantAddress,
    address: MERCHANT_ROUTER_ADDRESS as Address,
    abi: MERCHANT_ROUTER_ABI,
    functionName: 'swapToIDRX',
    args: [tokenAddress, amountInUnits, minAmount],
  });
  return hash as string;
}

/**
 * Ambil riwayat transaksi merchant dari kontrak.
 * Mereturn array objek { txHash, tokenIn, amountIn, amountOut, timestamp, fee }.
 */
export async function getMerchantTransactionHistory(
  merchantAddress: Address,
  pageSize: number = 10
): Promise<
  {
    txHash: string;
    tokenIn: string;
    amountIn: string;
    amountOut: string;
    timestamp: Date;
    fee: string;
  }[]
> {
  if (
    !MERCHANT_ROUTER_ADDRESS ||
    MERCHANT_ROUTER_ADDRESS ===
      '0x0000000000000000000000000000000000000000'
  ) {
    console.warn(
      'MerchantRouter address is placeholder, skipping transaction history fetch'
    );
    return [];
  }
  try {
    const history = (await publicClient.readContract({
      address: MERCHANT_ROUTER_ADDRESS as Address,
      abi: MERCHANT_ROUTER_ABI,
      functionName: 'getTransactionHistory',
      args: [merchantAddress, BigInt(pageSize)],
    })) as Array<{
      txHash: string;
      tokenIn: string;
      amountIn: bigint;
      amountOut: bigint;
      timestamp: bigint;
      fee: bigint;
    }>;
    return history.map((tx) => ({
      txHash: tx.txHash,
      tokenIn: tx.tokenIn,
      amountIn: formatUnits(
        tx.amountIn as bigint,
        TOKEN_DECIMALS[(tx.tokenIn as string).toLowerCase()] ?? 18
      ),
      amountOut: formatUnits(
        tx.amountOut as bigint,
        TOKEN_DECIMALS[TOKEN_ADDRESSES.IDRX.toLowerCase()] ?? 18
      ),
      timestamp: new Date(Number(tx.timestamp) * 1000),
      fee: formatUnits(
        tx.fee as bigint,
        TOKEN_DECIMALS[TOKEN_ADDRESSES.IDRX.toLowerCase()] ?? 18
      ),
    }));
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return [];
  }
}

/**
 * Dapatkan kurs USDT/USDC ke IDRX dari Coinbase/OnChainKit.
 * Jika API key tidak tersedia, mengembalikan kurs simulasi.
 */
export async function getExchangeRate(
  tokenAddress: Address
): Promise<{ rate: number; lastUpdate: Date }> {
  const lower = (tokenAddress as string).toLowerCase();
  const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
  const apiUrl =
    process.env.NEXT_PUBLIC_ONCHAINKIT_API_URL ||
    'https://api.onchainkit.coinbase.com';
  // Jika API tersedia, hitung kurs berdasarkan quote 1 IDRX
  if (apiKey) {
    try {
      // 1 IDRX = 10^18 satuan
      const toAmount = '1000000000000000000';
      const resp = await fetch(`${apiUrl}/swap/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: tokenAddress,
          to: TOKEN_ADDRESSES.IDRX,
          toAmount,
          network: 'base',
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        // fromAmount: jumlah tokenIn (dalam satuan minimal) yang diperlukan untuk 1 IDRX
        const fromAmount = BigInt(data.fromAmount);
        const decimals = TOKEN_DECIMALS[lower] ?? 18;
        const tokenUnits =
          Number(fromAmount) / Math.pow(10, decimals);
        const rate = tokenUnits > 0 ? 1 / tokenUnits : 0;
        return { rate, lastUpdate: new Date() };
      }
    } catch (err) {
      console.error('OnChainKit rate error', err);
    }
  }
  // Fallback lokal
  const fallback: Record<string, number> = {
    [TOKEN_ADDRESSES.USDT.toLowerCase()]: 16000,
    [TOKEN_ADDRESSES.USDC.toLowerCase()]: 16000,
  };
  return { rate: fallback[lower] || 0, lastUpdate: new Date() };
}

/**
 * Dapatkan quote lengkap dari OnChainKit untuk membayar `desiredIDRX`.
 * Mengembalikan { amountIn, swapPath, minOut }.
 */
export async function getOnchainKitQuote(
  tokenIn: Address,
  desiredIDRX: number
): Promise<{ amountIn: string; swapPath: string; minOut: string }> {
  const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
  const apiUrl =
    process.env.NEXT_PUBLIC_ONCHAINKIT_API_URL ||
    'https://api.onchainkit.coinbase.com';
  // Konversi desiredIDRX ke satuan minimal (IDRX 18 desimal)
  const idrxDecimals =
    TOKEN_DECIMALS[TOKEN_ADDRESSES.IDRX.toLowerCase()] ?? 18;
  const toAmount = BigInt(
    Math.round(desiredIDRX * Math.pow(10, idrxDecimals))
  ).toString();

  if (!apiKey) {
    // Fallback – gunakan getExchangeRate
    const { rate } = await getExchangeRate(tokenIn);
    const requiredToken = rate > 0 ? desiredIDRX / rate : 0;
    return {
      amountIn: requiredToken.toFixed(6),
      swapPath: '0x',
      minOut: desiredIDRX.toFixed(6),
    };
  }

  try {
    const resp = await fetch(`${apiUrl}/swap/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: tokenIn,
        to: TOKEN_ADDRESSES.IDRX,
        toAmount,
        network: 'base',
      }),
    });
    if (!resp.ok) throw new Error('Quote API error');
    const data = await resp.json();
    return {
      amountIn: data.fromAmount,
      swapPath: data.encodedPath || '0x',
      minOut: data.minToAmount || desiredIDRX.toString(),
    };
  } catch (err) {
    console.error('OnChainKit quote error', err);
    const { rate } = await getExchangeRate(tokenIn);
    const requiredToken = rate > 0 ? desiredIDRX / rate : 0;
    return {
      amountIn: requiredToken.toFixed(6),
      swapPath: '0x',
      minOut: desiredIDRX.toFixed(6),
    };
  }
}

/**
 * Payer mengeksekusi payAndSwapToMerchant dengan encoded swapPath.
 */
export async function executePayAndSwap(
  payerAddress: Address,
  tokenIn: Address,
  amountToken: string,
  merchantAddress: Address,
  swapPathHex: string,
  minIDRXOut: string,
  walletClient: WalletClient
): Promise<string> {
  if (!MERCHANT_ROUTER_ADDRESS) {
    throw new Error('MerchantRouter address not configured');
  }
  const decimals = TOKEN_DECIMALS[(tokenIn as string).toLowerCase()] ?? 18;
  const idrxDecimals =
    TOKEN_DECIMALS[TOKEN_ADDRESSES.IDRX.toLowerCase()] ?? 18;
  const amountInUnits = parseUnits(amountToken, decimals);
  const minOutUnits = parseUnits(minIDRXOut, idrxDecimals);

  // Approve
  await approveToken(tokenIn, MERCHANT_ROUTER_ADDRESS as Address, amountToken, payerAddress, walletClient);
  await new Promise((r) => setTimeout(r, 1000));

  const txHash = await walletClient.writeContract({
    chain: base,
    account: payerAddress,
    address: MERCHANT_ROUTER_ADDRESS as Address,
    abi: MERCHANT_ROUTER_ABI,
    functionName: 'payAndSwapToMerchant',
    args: [tokenIn, amountInUnits, merchantAddress, swapPathHex as Hex, minOutUnits],
  });
  return txHash as string;
}
