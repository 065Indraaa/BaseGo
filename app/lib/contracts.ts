/*
 * Konfigurasi kontrak dan token untuk BaseGo.
 * Alamat default bisa ditimpa melalui variabel lingkungan (.env.local).
 */

export const TOKEN_ADDRESSES = {
  // USDT (Bridged) di Base – dapat ditimpa lewat NEXT_PUBLIC_USDT_TOKEN_ADDRESS
  USDT:
    (process.env.NEXT_PUBLIC_USDT_TOKEN_ADDRESS as string) ||
    '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
  // USDC (Native) di Base – dapat ditimpa lewat NEXT_PUBLIC_USDC_TOKEN_ADDRESS
  USDC:
    (process.env.NEXT_PUBLIC_USDC_TOKEN_ADDRESS as string) ||
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  // IDRX – alamat default; ganti via NEXT_PUBLIC_IDRX_TOKEN_ADDRESS jika perlu
  IDRX:
    (process.env.NEXT_PUBLIC_IDRX_TOKEN_ADDRESS as string) ||
    '0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22',
} as const;

/**
 * Alamat kontrak router merchant (swap & payment).
 * Harus diisi di .env: NEXT_PUBLIC_MERCHANT_ROUTER_ADDRESS=0x...
 */
export const MERCHANT_ROUTER_ADDRESS = process.env
  .NEXT_PUBLIC_MERCHANT_ROUTER_ADDRESS ||
  '0x0000000000000000000000000000000000000000';

/** URL RPC jaringan Base; default mainnet */
export const BASE_RPC_URL =
  process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org';

/**
 * Jumlah desimal per token berdasarkan alamat (lowercase).
 * Digunakan saat mengonversi nilai BigInt ke string angka.
 */
export const TOKEN_DECIMALS: Record<string, number> = {
  [TOKEN_ADDRESSES.USDT.toLowerCase()]: 6,
  [TOKEN_ADDRESSES.USDC.toLowerCase()]: 6,
  [TOKEN_ADDRESSES.IDRX.toLowerCase()]: 18,
};

/**
 * Nama token untuk tampilan UI.
 * Key menggunakan alamat utuh (case-sensitive) agar cocok dengan pemakaian di komponen React.
 */
export const TOKEN_NAMES: Record<string, string> = {
  [TOKEN_ADDRESSES.USDT]: 'USDT',
  [TOKEN_ADDRESSES.USDC]: 'USDC',
  [TOKEN_ADDRESSES.IDRX]: 'IDRX',
};

/** Persentase fee swap yang dibebankan ke pembayar (0.5% = 0.5) */
export const SWAP_FEE_PERCENTAGE = 0.5;

/**
 * Alias untuk TOKEN_ADDRESSES untuk kompatibilitas dengan komponen yang menggunakan TOKENS
 */
export const TOKENS = TOKEN_ADDRESSES;