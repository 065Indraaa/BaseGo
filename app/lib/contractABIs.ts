/**
 * ABI untuk ERC20 Token Standard
 */
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
] as const;

/**
 * ABI untuk Uniswap V3 Router
 */
export const UNISWAP_V3_ROUTER_ABI = [
  {
    inputs: [
      {
        components: [
          { name: 'tokenIn', type: 'address' },
          { name: 'tokenOut', type: 'address' },
          { name: 'fee', type: 'uint24' },
          { name: 'recipient', type: 'address' },
          { name: 'deadline', type: 'uint256' },
          { name: 'amountIn', type: 'uint256' },
          { name: 'amountOutMinimum', type: 'uint256' },
          { name: 'sqrtPriceLimitX96', type: 'uint160' },
        ],
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'exactInputSingle',
    outputs: [{ name: 'amountOut', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

/**
 * Simple Swap Contract ABI - untuk contract yang handle swap USDT/USDC -> IDRX
 */
export const MERCHANT_ROUTER_ABI = [
  {
    inputs: [
      { name: '_tokenIn', type: 'address' },
      { name: '_amount', type: 'uint256' },
      { name: '_minIDRX', type: 'uint256' },
    ],
    name: 'swapToIDRX',
    outputs: [{ name: 'idrxAmount', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: '_tokenIn', type: 'address' },
      { name: '_amountIn', type: 'uint256' },
      { name: '_merchant', type: 'address' },
      { name: '_swapPath', type: 'bytes' },
      { name: '_minIDRXOut', type: 'uint256' },
    ],
    name: 'payAndSwapToMerchant',
    outputs: [{ name: 'merchantReceived', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_user', type: 'address' }],
    name: 'getMerchantBalance',
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: '_merchant', type: 'address' },
      { name: '_pageSize', type: 'uint256' },
    ],
    name: 'getTransactionHistory',
    outputs: [
      {
        components: [
          { name: 'txHash', type: 'bytes32' },
          { name: 'tokenIn', type: 'address' },
          { name: 'amountIn', type: 'uint256' },
          { name: 'amountOut', type: 'uint256' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'fee', type: 'uint256' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'merchant', type: 'address' },
      { indexed: false, name: 'tokenIn', type: 'address' },
      { indexed: false, name: 'amountIn', type: 'uint256' },
      { indexed: false, name: 'amountOut', type: 'uint256' },
      { indexed: false, name: 'timestamp', type: 'uint256' },
    ],
    name: 'SwapExecuted',
    type: 'event',
  },
] as const;
