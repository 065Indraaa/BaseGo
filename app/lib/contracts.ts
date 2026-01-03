/**
 * Smart Contract Constants untuk Base Network (Mainnet)
 * Semua address adalah kontrak resmi di Base Mainnet
 */

// Token Contracts di Base
export const TOKEN_ADDRESSES = {
  // USDT (Tether) di Base Mainnet
  USDT: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  
  // USDC (USD Coin) di Base Mainnet  
  USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  
  // IDRX (Stablecoin IDR) - Placeholder, ganti dengan kontrak yang sebenarnya
  IDRX: '0x0000000000000000000000000000000000000000', // TODO: Ganti dengan address kontrak IDRX Anda
};

// Merchant Payment Router - Smart Contract untuk handle swaps & payments
export const MERCHANT_ROUTER_ADDRESS = '0x0000000000000000000000000000000000000000'; // TODO: Deploy kontrak router Anda

// Uniswap V3 Router (untuk swap di Base)
export const UNISWAP_V3_ROUTER = '0x2626664c2603336E57B271c5C0b26F421741e481';

// Base Network RPC
export const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC || 'https://mainnet.base.org';

// Decimals untuk token
export const TOKEN_DECIMALS = {
  USDT: 6,
  USDC: 6,
  IDRX: 18,
};

// Nama display
export const TOKEN_NAMES: Record<string, string> = {
  [TOKEN_ADDRESSES.USDT]: 'USDT',
  [TOKEN_ADDRESSES.USDC]: 'USDC',
  [TOKEN_ADDRESSES.IDRX]: 'IDRX',
};

// Fee configuration
export const SWAP_FEE_PERCENTAGE = 0.5; // 0.5% fee untuk transaksi
