/**
 * SETUP GUIDE - BaseGo Merchant Platform
 * Crypto Payment Gateway di Base Network
 */

# ========================================
# 1. ENVIRONMENT SETUP
# ========================================

File: .env.local

```
NEXT_PUBLIC_BASE_RPC=https://mainnet.base.org
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_key_from_coinbase
NEXT_PUBLIC_MERCHANT_ROUTER_ADDRESS=0x...deploy_address
NEXT_PUBLIC_IDRX_ADDRESS=0x...idrx_token_address
```

# ========================================
# 2. DEPLOY SMART CONTRACT
# ========================================

A. Buka Remix IDE (https://remix.ethereum.org)

B. Create file: MerchantRouter.sol
   - Copy isi dari app/lib/MerchantRouter.sol
   - Compile dengan Solidity 0.8.20

C. Deploy:
   1. Select "Injected Provider" network
   2. Pilih Base Mainnet di Metamask
   3. Constructor parameter: IDRX address
   4. Click Deploy
   5. Copy contract address

D. Update .env.local:
   NEXT_PUBLIC_MERCHANT_ROUTER_ADDRESS=0x...

# ========================================
# 3. TOKEN SETUP DI BASE
# ========================================

Token Addresses di Base Mainnet:
- USDT: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
- USDC: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
- IDRX: Deploy/setup sendiri atau bridge dari blockchain lain

Baca: https://docs.base.org/

# ========================================
# 4. FLOW APLIKASI
# ========================================

Landing Page Flow:
1. User buka aplikasi
2. Click "Connect Wallet" 
3. Select Coinbase Wallet atau MetaMask
4. Connected ke Base Network
5. Daftar sebagai Merchant
6. Redirect ke Dashboard

Dashboard Features:
- [Ringkasan] Tampilkan saldo IDRX, total transaksi
- [Request Payment] User generate payment link untuk customer
- [Riwayat] Lihat semua transaksi on-chain dengan detail
- [Pengaturan] Manage merchant profile & wallet

Payment Flow:
1. Merchant generate payment request (USDT atau USDC amount)
2. Customer scan QR atau klik link
3. Customer approve & send USDT/USDC
4. Auto-swap ke IDRX via Uniswap V3
5. Merchant dapat IDRX instantly
6. Transaksi tercatat di blockchain & database

# ========================================
# 5. RUN APLIKASI
# ========================================

Development:
```bash
npm install
npm run dev
```

Production:
```bash
npm run build
npm start
```

# ========================================
# 6. KEY FEATURES IMPLEMENTED
# ========================================

✓ Wallet Connect - OnChainKit dari Coinbase
✓ Non-Custodial - Merchant kontrol sendiri dana
✓ Auto-Swap - USDT/USDC → IDRX otomatis
✓ Live On-Chain - Semua transaksi di blockchain
✓ Transaction History - Recorded di smart contract
✓ Real-time Updates - Event listeners untuk new swaps
✓ Zero Gas Fees - Base L2 murah (transaction ≈ $0.001)
✓ Instant Settlement - ≈15 detik per transaksi

# ========================================
# 7. TESTING
# ========================================

Test Flow:
1. Use Metamask + Sepolia testnet terlebih dahulu
2. Get testnet ETH dari faucet
3. Bridge ke Base testnet
4. Deploy contract di Base testnet
5. Test swap flow
6. Deploy ke Base mainnet

Test USDT/USDC:
- Get testnet tokens dari faucet
- Atau buang custom ERC20 untuk testing

# ========================================
# 8. SECURITY NOTES
# ========================================

✓ Non-Custodial: Kontrak tidak lock dana merchant
✓ Reentrancy Guard: Proteksi dari reentrancy attacks
✓ OpenZeppelin: Use trusted library
✓ Access Control: Only owner bisa ubah settings
✓ Fee Capped: Max 10% fee protection

TODO:
- Implement price oracle (Chainlink) untuk better rates
- Add withdrawal cooldown jika perlu
- Implement referral/commission system
- Add KYC jika regulated

# ========================================
# 9. API ENDPOINTS
# ========================================

Frontend doesn't need backend! Semua on-chain:

1. Read Balance: getMerchantBalance(address)
2. Get History: getTransactionHistory(address, pageSize)
3. Execute Swap: swapToIDRX(tokenIn, amount, minOut)
4. Watch Events: Listen ke SwapExecuted event

Gunakan viem/wagmi untuk semua interactions.

# ========================================
# 10. NEXT STEPS
# ========================================

1. ✓ Deploy MerchantRouter smart contract
2. ✓ Setup token addresses di .env
3. Setup IDRX token (bridge atau mint)
4. Update exchange rates (integrate Chainlink)
5. Add withdrawal function ke dashboard
6. Implement email notifications
7. Add analytics dashboard
8. Mobile app dengan WalletConnect

# ========================================

Questions? Refer to:
- Base docs: https://docs.base.org/
- OnChainKit: https://docs.base.org/onchainkit/
- Uniswap V3: https://docs.uniswap.org/
- Viem: https://viem.sh/
- OpenZeppelin: https://docs.openzeppelin.com/
