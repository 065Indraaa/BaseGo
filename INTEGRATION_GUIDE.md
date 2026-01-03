/**
 * Complete Integration Guide
 * BaseGo Merchant - Blockchain Payment Gateway
 */

# USER FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                      LANDING PAGE                            │
│  - Connect Wallet (OnChainKit)                               │
│  - Login dengan Base Identity                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                    ✓ Connected
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                MERCHANT REGISTRATION                         │
│  - Input Merchant Name                                       │
│  - Linked ke Wallet Address                                  │
│  - Stored di localStorage                                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                   ✓ Registered
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      DASHBOARD                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Saldo IDRX                                              │ │
│  │ ┌─────────────────────────────────────────────────────┐ │ │
│  │ │ Ringkasan    │ Riwayat    │ Pengaturan             │ │ │
│  │ └─────────────────────────────────────────────────────┘ │ │
│  │                                                         │ │
│  │ [Request Payment] [Refresh]                             │ │
│  │ Total Diterima | Metode Pembayaran | Network Info      │ │
│  └─────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
    [Request]      [View History]  [Settings]
    Payment
         │
         ▼
    Payment Modal
    - Pilih Token (USDT/USDC)
    - Masukkan Jumlah
    - Copy Payment Address
    - Customer kirim TX
         │
         ▼
    Auto-Swap via Uniswap
    - Transfer token ke Router
    - Swap USDT/USDC → IDRX
    - Update Merchant Balance
    - Emit SwapExecuted event
         │
         ▼
    Transaction Recorded
    - Hash, Amount, Timestamp
    - Fee calculation
    - Stored in contract
```

# BLOCKCHAIN INTERACTION

## Smart Contract Methods

### 1. swapToIDRX(tokenIn, amount, minIDRXAmount)
Input: 
- tokenIn (USDT/USDC address)
- amount (amount in wei)
- minIDRXAmount (slippage protection)

Output:
- idrxAmount (IDRX received)

Events:
- SwapExecuted(merchant, tokenIn, amountIn, amountOut, timestamp)

Implementation:
```typescript
const hash = await executeSwapToIDRX(
  userAddress,
  TOKEN_ADDRESSES.USDT,
  "100", // 100 USDT
  walletClient,
  "1500000" // min 1500000 IDRX (with slippage)
);
```

### 2. getMerchantBalance(merchant)
Returns: uint256 IDRX balance

Implementation:
```typescript
const balance = await getMerchantIDRXBalance(address);
// Returns "100.50" (formatted)
```

### 3. getTransactionHistory(merchant, pageSize)
Returns: Array of SwapTransaction

Implementation:
```typescript
const transactions = await getMerchantTransactionHistory(address, 10);
// Returns last 10 transactions
```

### 4. withdrawIDRX(amount)
Prerequisite: 
- Merchant must approve IDRX token first
- Or just transfer IDRX directly (kontrak non-custodial)

Note: 
- Merchant bisa withdraw kapan saja
- Balance instantly updated
- No lockup period

## Event Listening

Listen for SwapExecuted events:
```typescript
const unwatch = watchSwapEvents(merchantAddress, (event) => {
  console.log('New payment received!', event);
  // Update UI
  loadData();
});

// Cleanup
unwatch();
```

# FRONTEND ARCHITECTURE

## Components Structure

```
app/
├── page.tsx                          # Main entry point
├── layout.tsx                        # RootLayout + providers
├── rootProvider.tsx                  # Wagmi + OnChainKit setup
├── globals.css                       # Tailwind styles
└── components/
    ├── LandingPage.tsx              # Homepage + login
    ├── Dashboard.tsx                # Merchant dashboard
    ├── PaymentRequestModal.tsx      # Generate payment
    ├── TransactionHistory.tsx       # View transactions
    └── (other existing components)
└── lib/
    ├── authContext.tsx              # Auth state management
    ├── contracts.ts                 # Contract addresses & constants
    ├── contractABIs.ts              # Contract ABIs
    ├── blockchain.ts                # Blockchain interactions (viem)
    ├── MerchantRouter.sol           # Smart contract code
    └── data.ts                      # Mock data (existing)
```

## State Management

Use:
- useState: Local component state
- wagmi hooks: Wallet connection (useAccount, useDisconnect)
- React Context: Auth state (useAuth from authContext)
- React Query: Caching (optional, not needed for read-only)

Example:
```typescript
const { address, isConnected } = useAccount();
const { merchantName, isMerchant } = useAuth();
const [idrxBalance, setIDRXBalance] = useState('0.00');
const [transactions, setTransactions] = useState<any[]>([]);
```

## Data Flow

1. **Load Data**
   - Call smart contract read methods
   - Get IDRX balance
   - Get transaction history
   - Get exchange rates

2. **Update Data**
   - Listen to contract events
   - Refetch data when event received
   - Update UI in real-time

3. **User Action**
   - Request payment (generate form)
   - Customer sends USDT/USDC
   - Smart contract automatically swaps
   - Event emitted
   - UI updated

# ENVIRONMENT CONFIGURATION

Required .env.local:
```
NEXT_PUBLIC_ONCHAINKIT_API_KEY=<your_api_key>
NEXT_PUBLIC_BASE_RPC=https://mainnet.base.org
NEXT_PUBLIC_MERCHANT_ROUTER_ADDRESS=0x<deployed_contract>
NEXT_PUBLIC_IDRX_ADDRESS=0x<idrx_token>
```

Get API key: https://coinbase.com/onchainkit

# TESTING CHECKLIST

- [ ] Wallet connect/disconnect
- [ ] Merchant registration
- [ ] View balance
- [ ] Generate payment request
- [ ] Approve USDT/USDC
- [ ] Execute swap
- [ ] View transaction in history
- [ ] Copy payment address
- [ ] Withdraw IDRX
- [ ] Event listeners work
- [ ] Balance updates in real-time

# PRODUCTION DEPLOYMENT

1. Get OnChainKit API key from Coinbase
2. Deploy smart contract to Base mainnet
3. Update contract addresses in .env.local
4. Set up IDRX token if not existing
5. Test with real transactions
6. Deploy to production (Vercel, etc.)

# SECURITY CONSIDERATIONS

✓ Non-custodial: Merchant always owns their funds
✓ Reentrancy Guard: Smart contract protected
✓ Approval Model: User must approve each transaction
✓ No Private Keys: OnChainKit handles securely
✓ Open-source: Can be audited

# GAS FEES (Base Network)

- Connect wallet: ~$0
- Approve token: ~$0.01-0.05
- Swap (Uniswap): ~$0.05-0.10
- Total per transaction: ~$0.06-0.15 (very cheap!)

Compare to Ethereum:
- Same operations: $5-50 per transaction

Base advantage: 100x cheaper transactions!

# FUTURE ENHANCEMENTS

1. Chainlink price feed for real-time rates
2. Automated recurring payments
3. Referral system
4. Analytics dashboard
5. Mobile app
6. Multi-chain support
7. Escrow for disputes
8. KYC integration
9. Tax reporting
10. Merchant API for integrations
