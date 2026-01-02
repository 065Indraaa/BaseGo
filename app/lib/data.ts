export const formatIDRX = (number: number) => {
  return new Intl.NumberFormat('id-ID').format(number);
};

export const TOKENS = [
  { id: 'idrx', name: 'IDR X', symbol: 'IDRX', price: 1, logo: '🇮🇩', color: 'bg-red-50 text-red-600 border-red-200' },
  { id: 'usdc', name: 'USDC', symbol: 'USDC', price: 15500, logo: '💵', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 45000000, logo: '⟠', color: 'bg-gray-50 text-gray-600 border-gray-200' },
];

export const TRANSACTION_HISTORY = [
  { id: 1, type: 'Payment', amount: 150000, token: 'IDRX', status: 'Success', time: '10:30', sender: '0x123...abc' },
  { id: 2, type: 'Payment', amount: 75000, token: 'IDRX', status: 'Processing', time: '10:15', sender: '0x456...def' },
  { id: 3, type: 'Withdraw', amount: 500000, token: 'IDRX', status: 'Success', time: 'Kemarin', sender: 'Merchant' },
];