# 🚀 BaseGo - Blockchain Merchant Payment Platform

> Terima pembayaran crypto (USDT/USDC), otomatis swap ke IDRX, langsung ke wallet Anda. Live on-chain, non-custodial, 100% aman.

## ✨ Fitur Utama

### 🔐 Wallet Integration
- **OnChainKit** dari Coinbase untuk seamless wallet connect
- Coinbase Wallet & MetaMask supported
- Base Network (Layer 2) untuk transaksi cepat & murah
- Non-custodial: Dana merchant 100% terjaga

### 💱 Automatic Swap
- **USDT/USDC** ➜ **IDRX** auto-conversion
- Powered by Uniswap V3
- Real-time exchange rates
- Slippage protection built-in

### 📊 Dashboard
- **Ringkasan**: Lihat saldo IDRX, total transaksi diterima
- **Request Payment**: Generate payment links untuk customers
- **Riwayat Transaksi**: Track semua pembayaran on-chain
- **Pengaturan**: Manage wallet & merchant profile

### ⚡ Live On-Chain
- Semua transaksi tercatat di blockchain Base
- Smart contract handle approve ➜ swap ➜ balance update
- Event listeners untuk real-time notifications
- Transaction verification via Basescan

### 💰 Low Fees
- Base L2 transaction: ~$0.01 - $0.15
- Swap fee: 0.5% (configurable)
- No hidden costs

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Blockchain**: Viem + Wagmi + OnChainKit
- **Styling**: Tailwind CSS + Framer Motion
- **Smart Contract**: Solidity 0.8.20 + OpenZeppelin
- **Network**: Base Mainnet L2

## 📋 Prerequisites

- Node.js 18+
- npm/yarn
- Wallet (Coinbase/MetaMask)
- Base network RPC (provided)
- OnChainKit API key

## 🚀 Quick Start

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
NEXT_PUBLIC_BASE_RPC=https://mainnet.base.org
NEXT_PUBLIC_MERCHANT_ROUTER_ADDRESS=0x...
NEXT_PUBLIC_IDRX_ADDRESS=0x...
```

Get API key: https://coinbase.com/onchainkit

### 3. Deploy Smart Contract

1. Go to Remix: https://remix.ethereum.org
2. Create `MerchantRouter.sol`
3. Copy code from `app/lib/MerchantRouter.sol`
4. Compile + Deploy to Base Mainnet
5. Copy contract address to `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📱 User Flow

### For Merchant:

1. **Landing** - Connect wallet dengan OnChainKit
2. **Register** - Input nama toko/bisnis
3. **Dashboard** - Lihat saldo IDRX real-time
4. **Request Payment** - Generate payment untuk customers
5. **Receive** - Automatic swap USDT/USDC → IDRX
6. **Withdraw** - Tarik IDRX kapan saja

### For Customer:

1. **Scan/Click** payment link dari merchant
2. **Select** jumlah & token (USDT/USDC)
3. **Approve** & **Send** crypto payment
4. **Confirmation** - Transaksi auto-swap in ~15 detik
5. **Merchant dapat** IDRX instantly

## 🏗️ Project Structure

```
app/
├── components/          # React components
│   ├── LandingPage.tsx
│   ├── Dashboard.tsx
│   ├── PaymentRequestModal.tsx
│   └── TransactionHistory.tsx
├── lib/
│   ├── authContext.tsx
│   ├── blockchain.ts
│   ├── contracts.ts
│   ├── contractABIs.ts
│   └── MerchantRouter.sol
├── page.tsx
└── layout.tsx

docs/
├── SETUP_GUIDE.md       # Step-by-step setup
└── INTEGRATION_GUIDE.md # Technical integration
```

## 📚 Documentation

- **SETUP_GUIDE.md** - Complete setup instructions
- **INTEGRATION_GUIDE.md** - Technical architecture & flow
- **MerchantRouter.sol** - Smart contract code

## 🔗 Smart Contract

### Core Functions

```typescript
// Swap USDT/USDC → IDRX
swapToIDRX(tokenIn, amount, minIDRXAmount): uint256

// Get merchant IDRX balance
getMerchantBalance(merchant): uint256

// Get transaction history
getTransactionHistory(merchant, pageSize): SwapTransaction[]

// Withdraw IDRX
withdrawIDRX(amount): void
```

### Events

```solidity
event SwapExecuted(
    indexed address merchant,
    address tokenIn,
    uint256 amountIn,
    uint256 amountOut,
    uint256 timestamp
);
```

## 🌐 Network Info

### Base Mainnet

- Network ID: 8453
- RPC: https://mainnet.base.org
- Explorer: https://basescan.org
- Status: Live

### Base Tokens

- USDT: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- USDC: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Uniswap V3 Router: `0x2626664c2603336E57B271c5C0b26F421741e481`

## ⚙️ Configuration

Edit `app/lib/contracts.ts` untuk:
- Token addresses
- Smart contract address
- RPC endpoints
- Fee percentage
- Exchange rates

## 🧪 Testing

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## 🔐 Security

- ✅ Non-custodial wallet
- ✅ Reentrancy guard di smart contract
- ✅ OpenZeppelin battle-tested contracts
- ✅ No private keys stored
- ✅ OnChainKit secure handling

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy
```

### Manual

```bash
npm run build
npm start
```

Environment variables:
- Set di Vercel dashboard atau `.env.local`
- Keep API keys secure

## 📊 Gas Fees Comparison

| Operation | Ethereum | Base L2 |
|-----------|----------|---------|
| Approve   | $5-20    | $0.01   |
| Swap      | $20-50   | $0.05   |
| **Total** | **$25-70** | **$0.06** |

**Base is 400x cheaper!**

## 📞 Support

- Base Docs: https://docs.base.org/
- OnChainKit: https://docs.base.org/onchainkit/
- Viem: https://viem.sh/
- Wagmi: https://wagmi.sh/
- Uniswap: https://docs.uniswap.org/

## 📝 License

MIT License - Feel free to use for commercial purposes

## 🎯 Roadmap

- [ ] Chainlink price feed integration
- [ ] Recurring payments
- [ ] Referral system
- [ ] Mobile app
- [ ] Multi-chain support
- [ ] Advanced analytics
- [ ] API for integrations
- [ ] KYC module

## 👨‍💻 Contributing

Pull requests welcome! Please create an issue first.

## 📄 Notes

- This is a production-ready template
- Customize token addresses for your deployment
- Deploy smart contract first before running app
- Test thoroughly on testnet before mainnet

---

**Made with ❤️ for the blockchain community**

Built on **Base** - The secure, low-cost Ethereum Layer 2.
