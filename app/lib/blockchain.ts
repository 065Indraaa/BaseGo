/**
 * Utility fungsi blockchain untuk BaseGo.
 *
 * Menggunakan viem untuk membuat public client (mengakses RPC Base) dan menerima
 * objek walletClient sebagai parameter. Fungsinya meliputi: membaca saldo,
 * approval token, swap, pay-and-swap, serta membaca riwayat transaksi.
 */

import {
  createPublicClient,
  http,
  type Abi,
  type WalletClient,
  type Hex,
} from 'viem';
import { base } from 'viem/chains';
import { erc20Abi } from 'viem';
import routerAbiJson from './contractABIs/merchantRouterAbi.json';
import {
  BASE_RPC_URL,
  TOKENS,
  TOKEN_DECIMALS,
  TOKEN_NAMES,
  MERCHANT_ROUTER_ADDRESS,
} from './contracts';

/** Cast JSON ABI ke tipe Abi untuk memenuhi TypeScript */
const MERCHANT_ROUTER_ABI = routerAbiJson as Abi;

/** Inisialisasi public client satu kali */
const publicClient = createPublicClient({
  chain: base,
  transport: http(BASE_RPC_URL),
});

/** Format bigint menjadi string berdasarkan desimal token */
function formatTokenAmount(amount: bigint, tokenAddress: string): string {
  const decimals = TOKEN_DECIMALS[tokenAddress.toLowerCase()] ?? 18;
  const divisor = BigInt(10) ** BigInt(decimals);
  const integer = amount / divisor;
  const fraction = amount % divisor;
  const fractionStr = fraction.toString().padStart(decimals, '0').replace(/0+$/, '');
  return fractionStr ? `${integer}.${fractionStr}` : integer.toString();
}

/** Tunggu receipt transaksi; lempar error jika gagal */
async function waitForTx(hash: Hex) {
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (receipt.status !== 'success') {
    throw new Error(`Transaksi ${hash} gagal dengan status ${receipt.status}`);
  }
}

/** Approve router untuk membelanjakan token caller */
async function approveToken(
  walletClient: WalletClient,
  tokenAddress: Hex,
  amount: bigint,
): Promise<Hex> {
  if (!MERCHANT_ROUTER_ADDRESS) {
    throw new Error('Merchant router belum dikonfigurasi');
  }
  const txHash = await walletClient.writeContract({
    chain: base,
    account: walletClient.account, // alamat penandatangan otomatis dari walletClient
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'approve',
    args: [MERCHANT_ROUTER_ADDRESS as Hex, amount],
  });
  return txHash;
}

/** Ambil saldo ERC‑20 untuk owner */
export async function getTokenBalance(
  owner: Hex,
  tokenAddress: Hex,
): Promise<string> {
  const balance: bigint = await publicClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [owner],
  });
  return formatTokenAmount(balance, tokenAddress);
}

/** Riwayat transaksi merchant dari kontrak router */
export async function getMerchantTransactionHistory(
  merchant: Hex,
): Promise<
  {
    txHash: Hex;
    token: string;
    amount: string;
    timestamp: bigint;
  }[]
> {
  if (!MERCHANT_ROUTER_ADDRESS) {
    return [];
  }
  // Hasil readContract ditandai unknown oleh TS → cast ke any[]
  const raw = (await publicClient.readContract({
    address: MERCHANT_ROUTER_ADDRESS as Hex,
    abi: MERCHANT_ROUTER_ABI,
    functionName: 'getTransactionHistory',
    args: [merchant],
  })) as unknown as any[];

  return raw.map((entry) => {
    const [tokenAddr, amountBn, timestampBn, txHash] = entry;
    const tokenName = TOKEN_NAMES[(tokenAddr as string).toLowerCase()] ?? 'UNKNOWN';
    const amountStr = formatTokenAmount(amountBn as bigint, tokenAddr as string);
    return {
      txHash: txHash as Hex,
      token: tokenName,
      amount: amountStr,
      timestamp: timestampBn as bigint,
    };
  });
}

/** Swap USDT/USDC ke IDRX via router */
export async function executeSwapToIDRX(
  walletClient: WalletClient,
  tokenSymbol: keyof typeof TOKENS,
  amount: string,
): Promise<Hex> {
  if (!MERCHANT_ROUTER_ADDRESS) {
    throw new Error('Merchant router belum dikonfigurasi');
  }
  const tokenAddress = TOKENS[tokenSymbol] as Hex;
  const decimals = TOKEN_DECIMALS[tokenAddress.toLowerCase()] ?? 18;
  const [integerPart, fractionPart = ''] = amount.split('.');
  const paddedFraction = (fractionPart + '0'.repeat(decimals)).slice(0, decimals);
  const value =
    BigInt(integerPart) * BigInt(10) ** BigInt(decimals) + BigInt(paddedFraction);

  // Approve token
  const approveHash = await approveToken(walletClient, tokenAddress, value);
  await waitForTx(approveHash);

  // Swap
  const txHash = await walletClient.writeContract({
    chain: base,
    account: walletClient.account,
    address: MERCHANT_ROUTER_ADDRESS as Hex,
    abi: MERCHANT_ROUTER_ABI,
    functionName: 'swapToIDRX',
    args: [tokenAddress, value],
  });
  await waitForTx(txHash);
  return txHash;
}

/** Pay merchant dan auto-swap dalam satu call */
export async function executePayAndSwap(
  walletClient: WalletClient,
  tokenSymbol: keyof typeof TOKENS,
  amount: string,
  merchant: Hex,
): Promise<Hex> {
  if (!MERCHANT_ROUTER_ADDRESS) {
    throw new Error('Merchant router belum dikonfigurasi');
  }
  const tokenAddress = TOKENS[tokenSymbol] as Hex;
  const decimals = TOKEN_DECIMALS[tokenAddress.toLowerCase()] ?? 18;
  const [integerPart, fractionPart = ''] = amount.split('.');
  const paddedFraction = (fractionPart + '0'.repeat(decimals)).slice(0, decimals);
  const value =
    BigInt(integerPart) * BigInt(10) ** BigInt(decimals) + BigInt(paddedFraction);

  // Approve token
  const approveHash = await approveToken(walletClient, tokenAddress, value);
  await waitForTx(approveHash);

  // Pay & swap
  const txHash = await walletClient.writeContract({
    chain: base,
    account: walletClient.account,
    address: MERCHANT_ROUTER_ADDRESS as Hex,
    abi: MERCHANT_ROUTER_ABI,
    functionName: 'payAndSwapToMerchant',
    args: [tokenAddress, value, merchant],
  });
  await waitForTx(txHash);
  return txHash;
}

/** Nilai tukar sederhana; ganti dengan oracle/aggregator jika diperlukan */
export async function getExchangeRate(
  tokenSymbol: keyof typeof TOKENS,
): Promise<number> {
  if (tokenSymbol === 'IDRX') {
    return 1;
  }
  return 16000; // simulasi: 1 USDT/USDC = 16.000 IDRX
}
