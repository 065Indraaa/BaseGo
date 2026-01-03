# BaseGo - Pre-Launch Checklist

## 🔧 Local Development Setup

- [ ] Node.js 18+ installed
- [ ] npm/yarn installed
- [ ] Clone repository
- [ ] `npm install` - all dependencies installed
- [ ] `npm run dev` - starts without errors
- [ ] App opens at http://localhost:3000

## 🔐 Wallet Setup

- [ ] Metamask installed (or Coinbase Wallet)
- [ ] Added Base Mainnet to wallet
- [ ] Have Base account with some ETH for gas
- [ ] Can connect to OnChainKit widget

## 🪙 Token Setup

- [ ] USDT address on Base: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- [ ] USDC address on Base: verify correct address
- [ ] IDRX token created or identified
  - [ ] Have contract address
  - [ ] Verified on Basescan
- [ ] Test tokens acquired for testing

## 🤖 Smart Contract Deployment

### Preparation
- [ ] Remix IDE open: https://remix.ethereum.org
- [ ] Copy MerchantRouter.sol from `app/lib/`
- [ ] Solidity compiler set to 0.8.20
- [ ] OpenZeppelin contracts imported

### Deployment
- [ ] Compile contract - no errors
- [ ] Deploy to Base Mainnet (not testnet)
- [ ] Constructor parameter: IDRX token address
- [ ] Deployment successful
- [ ] Copy contract address

### Verification (Optional but recommended)
- [ ] Verify contract on Basescan
  - [ ] Upload source code
  - [ ] Compiler version match
  - [ ] Optimization enabled/disabled match

## 📝 Environment Configuration

### Create .env.local file with:

```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=___
NEXT_PUBLIC_BASE_RPC=https://mainnet.base.org
NEXT_PUBLIC_MERCHANT_ROUTER_ADDRESS=0x___
NEXT_PUBLIC_IDRX_ADDRESS=0x___
NEXT_PUBLIC_UNISWAP_V3_ROUTER=0x2626664c2603336E57B271c5C0b26F421741e481
NEXT_PUBLIC_SWAP_FEE_PERCENTAGE=0.5
```

Steps to get values:
- [ ] OnChainKit API Key: https://coinbase.com/onchainkit
- [ ] MERCHANT_ROUTER_ADDRESS: dari Remix deployment
- [ ] IDRX_ADDRESS: dari token setup
- [ ] BASE_RPC: use provided default
- [ ] UNISWAP_V3_ROUTER: Base mainnet router (provided)

## 🧪 Testing - Frontend

### Landing Page
- [ ] Page loads
- [ ] Hero section visible
- [ ] "Connect Wallet" button visible
- [ ] Feature cards displayed

### Wallet Connection
- [ ] Click "Connect Wallet"
- [ ] OnChainKit modal appears
- [ ] Can select Metamask or Coinbase Wallet
- [ ] Wallet connects successfully
- [ ] Page shows merchant registration form

### Merchant Registration
- [ ] Input field for merchant name
- [ ] "Daftar" button enabled when text entered
- [ ] Click daftar redirects to dashboard
- [ ] Merchant name shows in navbar
- [ ] Address shows correctly

### Dashboard
- [ ] Dashboard loads after registration
- [ ] Shows merchant name
- [ ] Shows wallet address (truncated)
- [ ] Tabs visible: Overview, History, Settings
- [ ] Overview tab shows:
  - [ ] Balance display (IDRX)
  - [ ] Total received stats
  - [ ] Payment methods info
  - [ ] Network info badge

## 🧪 Testing - Blockchain Interactions

### Read Operations
- [ ] Get balance works (shows 0 or correct value)
- [ ] Get transaction history works (empty or with data)
- [ ] Get exchange rates works
- [ ] No RPC errors in console

### Write Operations (if testnet set up)
- [ ] Request Payment modal opens
- [ ] Token selection works
- [ ] Amount input works
- [ ] Estimated IDRX calculates
- [ ] Copy address button works
- [ ] Approval transaction can be signed
- [ ] Swap transaction can be signed

### Events
- [ ] SwapExecuted event triggers after TX
- [ ] Dashboard updates after event
- [ ] Transaction appears in history

## 📱 Testing - User Flows

### Landing → Registration → Dashboard
- [ ] Complete flow without errors
- [ ] Data persists on refresh
- [ ] localStorage has merchant data

### Payment Request Generation
- [ ] Can generate multiple requests
- [ ] Different token selection works
- [ ] Different amounts work

### Transaction History
- [ ] Display transactions correctly
- [ ] Show correct amounts
- [ ] Show correct timestamps
- [ ] Basescan link works

### Settings Tab
- [ ] Wallet address visible
- [ ] Copy address works
- [ ] Merchant name shown
- [ ] Auto-swap info visible
- [ ] Logout button works
- [ ] After logout → back to landing

## 🔍 Code Quality

- [ ] No console errors
- [ ] No console warnings
- [ ] TypeScript compilation clean
- [ ] Lint check passes: `npm run lint`
- [ ] All imports valid

## 🚀 Production Build

- [ ] `npm run build` succeeds
- [ ] No build errors
- [ ] `npm start` works after build
- [ ] App functional from build

## 🌐 Network Verification

- [ ] RPC endpoint responding
- [ ] Can read from contracts
- [ ] Gas prices reasonable
- [ ] Block time ~2 seconds
- [ ] Basescan explorer working

## 📊 Monitoring Setup

- [ ] Error logging configured (optional)
- [ ] Analytics configured (optional)
- [ ] Sentry/monitoring set up (optional)

## 🚢 Deployment (Vercel/Hosting)

### Pre-Deployment
- [ ] All env variables ready
- [ ] Smart contract deployed & addresses added
- [ ] API keys obtained
- [ ] Domain name ready (if custom)

### Vercel Deployment
- [ ] Vercel account created
- [ ] Git repository ready
- [ ] Environment variables added to Vercel
- [ ] Connected to Git repository
- [ ] Deploy successful
- [ ] Production URL working
- [ ] Env vars working in production

### Final Checks
- [ ] Wallet connect works
- [ ] Dashboard loads
- [ ] All functions accessible
- [ ] No errors in browser console
- [ ] Mobile responsive
- [ ] Load time acceptable

## 📋 Documentation

- [ ] README.md complete
- [ ] SETUP_GUIDE.md complete
- [ ] INTEGRATION_GUIDE.md complete
- [ ] Comments added to code
- [ ] Error messages user-friendly

## 🔐 Security Review

- [ ] No private keys in code
- [ ] No hardcoded addresses in code
- [ ] Environment variables used correctly
- [ ] CORS configured if needed
- [ ] Rate limiting considered
- [ ] Input validation present

## 📊 Performance

- [ ] Page load < 3 seconds
- [ ] Dashboard load < 2 seconds
- [ ] TX approval < 1 second
- [ ] Responsive on mobile
- [ ] SEO basics covered

## 🎉 Launch Readiness

### Final Verification
- [ ] All tests passing
- [ ] All features working
- [ ] Documentation complete
- [ ] Team review done
- [ ] Backup created
- [ ] Monitoring active

### Go Live
- [ ] Schedule launch time
- [ ] Notify users
- [ ] Monitor first transactions
- [ ] Be ready for support
- [ ] Celebrate! 🎊

---

## 🆘 Troubleshooting

### If RPC not working
- [ ] Check .env.local has BASE_RPC
- [ ] Verify RPC endpoint is live
- [ ] Check internet connection
- [ ] Try fallback RPC: https://base.publicnode.com

### If contract call fails
- [ ] Verify contract address correct
- [ ] Verify contract deployed to correct network
- [ ] Check wallet is on Base network
- [ ] Try refreshing page

### If modal doesn't open
- [ ] Check OnChainKit API key valid
- [ ] Check network connection
- [ ] Clear browser cache
- [ ] Try incognito mode

### If wallet won't connect
- [ ] Check wallet installed
- [ ] Check Base network added to wallet
- [ ] Try different wallet
- [ ] Restart browser

---

## 📞 Support Contacts

- Base Support: https://discord.gg/buildbase
- OnChainKit Issues: https://github.com/coinbase/onchainkit
- Viem Issues: https://github.com/wagmi-dev/viem

---

**Last Updated**: 2026-01-03
**Status**: Ready for Production Setup
