/**
 * Utility functions untuk blockchain interactions
 * Using viem untuk Base network
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  parseUnits,
  formatUnits,
  type Address,
  type PublicClient,
  type WalletClient,
} from 'viem';
import { base } from 'viem/chains';
import {
  TOKEN_ADDRESSES,
  TOKEN_DECIMALS,
  BASE_RPC_URL,
  MERCHANT_ROUTER_ADDRESS,
} from './contracts';
import { ERC20_ABI, MERCHANT_ROUTER_ABI } from './contractABIs';

// Initialize clients
const publicClient = createPublicClient({
  chain: base,
  transport: http(BASE_RPC_URL),
});

/**
 * Get token balance untuk user
 */
export async function getTokenBalance(
  userAddress: Address,
  tokenAddress: Address
): Promise<string> {
  const balance = await publicClient.readContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [userAddress],
  });

  const decimals = TOKEN_DECIMALS[tokenAddress as keyof typeof TOKEN_DECIMALS] || 18;
  return formatUnits(balance as bigint, decimals);
}

/**
 * Get merchant IDRX balance
 */
export async function getMerchantIDRXBalance(merchantAddress: Address): Promise<string> {
  return getTokenBalance(merchantAddress, TOKEN_ADDRESSES.IDRX as Address);
}

/**
 * Approve token untuk spending
 */
export async function approveToken(
  tokenAddress: Address,
  spenderAddress: Address,
  amount: string,
  account: Address,
  walletClient: WalletClient
): Promise<string> {
  const decimals = TOKEN_DECIMALS[tokenAddress as keyof typeof TOKEN_DECIMALS] || 18;
  const amountInUnits = parseUnits(amount, decimals);

  const hash = await walletClient.writeContract({
    chain: base,
    account: account,
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [spenderAddress, amountInUnits],
  });

  return hash;
}

/**
 * Execute swap USDT/USDC -> IDRX
 */
export async function executeSwapToIDRX(
  merchantAddress: Address,
  tokenAddress: Address,
  amount: string,
  walletClient: WalletClient,
  minIDRXAmount?: string
): Promise<string> {
  const decimals = TOKEN_DECIMALS[tokenAddress as keyof typeof TOKEN_DECIMALS] || 18;
  const amountInUnits = parseUnits(amount, decimals);
  const minAmount = minIDRXAmount
    ? parseUnits(minIDRXAmount, TOKEN_DECIMALS.IDRX)
    : parseUnits('0', TOKEN_DECIMALS.IDRX);

  // Approve dulu sebelum swap
  await approveToken(
    tokenAddress,
    MERCHANT_ROUTER_ADDRESS as Address,
    amount,
    merchantAddress,
    walletClient
  );

  // Tunggu approval tercatat
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Execute swap
  const hash = await walletClient.writeContract({
    chain: base,
    account: merchantAddress,
    address: MERCHANT_ROUTER_ADDRESS as Address,
    abi: MERCHANT_ROUTER_ABI,
    functionName: 'swapToIDRX',
    args: [tokenAddress, amountInUnits, minAmount],
  });

  return hash;
}

/**
 * Get transaction history dari merchant
 */
export async function getMerchantTransactionHistory(
  merchantAddress: Address,
  pageSize: number = 10
): Promise<any[]> {
  const history = await publicClient.readContract({
    address: MERCHANT_ROUTER_ADDRESS as Address,
    abi: MERCHANT_ROUTER_ABI,
    functionName: 'getTransactionHistory',
    args: [merchantAddress, BigInt(pageSize)],
  });

  return (history as any[]).map((tx) => ({
    txHash: tx.txHash,
    tokenIn: tx.tokenIn,
    amountIn: formatUnits(
      tx.amountIn as bigint,
      TOKEN_DECIMALS[tx.tokenIn as keyof typeof TOKEN_DECIMALS] || 18
    ),
    amountOut: formatUnits(tx.amountOut as bigint, TOKEN_DECIMALS.IDRX),
    timestamp: new Date(Number(tx.timestamp) * 1000),
    fee: formatUnits(tx.fee as bigint, TOKEN_DECIMALS.IDRX),
  }));
}

/**
 * Observe token swap events untuk real-time updates
 */
export function watchSwapEvents(
  merchantAddress: Address,
  callback: (event: any) => void
) {
  return publicClient.watchContractEvent({
    address: MERCHANT_ROUTER_ADDRESS as Address,
    abi: MERCHANT_ROUTER_ABI,
    eventName: 'SwapExecuted',
    onLogs: (logs) => {
      logs.forEach((log) => {
        if (log.args.merchant?.toLowerCase() === merchantAddress.toLowerCase()) {
          callback({
            merchant: log.args.merchant,
            tokenIn: log.args.tokenIn,
            amountIn: formatUnits(
              log.args.amountIn as bigint,
              TOKEN_DECIMALS[log.args.tokenIn as keyof typeof TOKEN_DECIMALS] || 18
            ),
            amountOut: formatUnits(log.args.amountOut as bigint, TOKEN_DECIMALS.IDRX),
            timestamp: new Date(Number(log.args.timestamp) * 1000),
          });
        }
      });
    },
  });
}

/**
 * Get current exchange rate USDT/USDC -> IDRX
 * (Simulasi - ganti dengan actual price feed)
 */
export async function getExchangeRate(
  tokenAddress: Address
): Promise<{ rate: number; lastUpdate: Date }> {
  // TODO: Integrasi dengan Chainlink price feed atau DEX aggregator
  // Ini adalah simulasi
  const rates: Record<string, number> = {
    [TOKEN_ADDRESSES.USDT]: 16000, // 1 USDT = 16000 IDRX (simulasi)
    [TOKEN_ADDRESSES.USDC]: 16000, // 1 USDC = 16000 IDRX (simulasi)
  };

  return {
    rate: rates[tokenAddress] || 0,
    lastUpdate: new Date(),
  };
}

/**
 * Get transaction receipt & status
 */
export async function getTransactionStatus(txHash: string) {
  const receipt = await publicClient.getTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  return {
    hash: receipt.transactionHash,
    status: receipt.status === 'success' ? 'success' : 'failed',
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
  };
}
