/*
 * Konfigurasi kontrak dan token untuk BaseGo.
 * USDC native: 0x833589...; USDT bridged: 0xfde4C9...; IDRX: alamat resmi.
 */

export const TOKENS = {
  USDT:
    (process.env.NEXT_PUBLIC_USDT_TOKEN_ADDRESS as string) ||
    '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
  USDC:
    (process.env.NEXT_PUBLIC_USDC_TOKEN_ADDRESS as string) ||
    '0x833589fCD6eDb6E08f4c7C32D4f71b54BDA02913',
  IDRX:
    (process.env.NEXT_PUBLIC_IDRX_TOKEN_ADDRESS as string) ||
    '0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22',
} as const;

/** Alamat kontrak router – harus diisi via .env */
export const MERCHANT_ROUTER_ADDRESS = process.env
  .NEXT_PUBLIC_MERCHANT_ROUTER_ADDRESS as string | undefined;

/** URL RPC Base (fallback ke mainnet) */
export const BASE_RPC_URL =
  process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org';

/** Desimal token berdasarkan alamat (lowercase) */
export const TOKEN_DECIMALS: Record<string, number> = {
  [TOKENS.USDT.toLowerCase()]: 6,
  [TOKENS.USDC.toLowerCase()]: 6,
  [TOKENS.IDRX.toLowerCase()]: 18,
};

/** Nama token untuk tampilan */
export const TOKEN_NAMES: Record<string, string> = {
  [TOKENS.USDT.toLowerCase()]: 'USDT',
  [TOKENS.USDC.toLowerCase()]: 'USDC',
  [TOKENS.IDRX.toLowerCase()]: 'IDRX',
};
