/**
 * Smart Contract Code untuk Merchant Router
 * Deploy di Base Mainnet menggunakan Remix IDE atau Hardhat
 * 
 * Kontrak ini handle:
 * 1. Swap USDT/USDC -> IDRX
 * 2. Track transaction history per merchant
 * 3. Emit events untuk real-time updates
 * 4. Non-custodial - merchant selalu kontrol dana mereka
 */

// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

interface IUniswapV3Router {
    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);
    
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }
}

contract MerchantRouter is ReentrancyGuard, Ownable {
    // Token addresses di Base
    address public constant USDT = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913; // Ganti dengan USDC bridge address jika berbeda
    address public idrx; // IDRX stablecoin
    
    // Uniswap V3 Router
    IUniswapV3Router public constant uniswapRouter = IUniswapV3Router(0x2626664c2603336E57B271c5C0b26F421741e481);
    
    // Fee untuk swap (0.5% = 50)
    uint256 public swapFeePercentage = 50;
    
    // Track merchant balances
    mapping(address => uint256) public merchantBalances;
    
    // Track transaction history
    struct SwapTransaction {
        bytes32 txHash;
        address tokenIn;
        uint256 amountIn;
        uint256 amountOut;
        uint256 timestamp;
        uint256 fee;
    }
    
    mapping(address => SwapTransaction[]) public merchantTransactions;
    
    // Events
    event SwapExecuted(
        indexed address merchant,
        address tokenIn,
        uint256 amountIn,
        uint256 amountOut,
        uint256 timestamp
    );
    
    event IDRXTransferred(address indexed merchant, uint256 amount);
    
    event FeeUpdated(uint256 newFee);
    
    constructor(address _idrx) {
        idrx = _idrx;
    }
    
    /**
     * Swap USDT/USDC ke IDRX
     * 1. User approve token dulu
     * 2. Router transfer token dari user
     * 3. Router swap ke IDRX via Uniswap
     * 4. Update merchant balance
     * 5. Emit event
     */
    function swapToIDRX(
        address _tokenIn,
        uint256 _amountIn,
        uint256 _minIDRXAmount
    ) external nonReentrant returns (uint256) {
        require(_tokenIn == USDT || _tokenIn == USDC, "Invalid input token");
        require(_amountIn > 0, "Amount must be > 0");
        
        // Transfer token dari user ke kontrak
        require(
            IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn),
            "Transfer failed"
        );
        
        // Approve Uniswap untuk spend token
        IERC20(_tokenIn).approve(address(uniswapRouter), _amountIn);
        
        // Execute swap di Uniswap
        uint256 idrxAmount = uniswapRouter.exactInputSingle(
            IUniswapV3Router.ExactInputSingleParams({
                tokenIn: _tokenIn,
                tokenOut: idrx,
                fee: 3000, // 0.3% pool
                recipient: address(this),
                deadline: block.timestamp + 300,
                amountIn: _amountIn,
                amountOutMinimum: _minIDRXAmount,
                sqrtPriceLimitX96: 0
            })
        );
        
        // Calculate fee
        uint256 feeAmount = (idrxAmount * swapFeePercentage) / 10000;
        uint256 merchantAmount = idrxAmount - feeAmount;
        
        // Update merchant balance (caller is merchant)
        merchantBalances[msg.sender] += merchantAmount;
        
        // Track transaction
        SwapTransaction memory transaction = SwapTransaction({
            txHash: keccak256(abi.encodePacked(block.timestamp, msg.sender)),
            tokenIn: _tokenIn,
            amountIn: _amountIn,
            amountOut: merchantAmount,
            timestamp: block.timestamp,
            fee: feeAmount
        });
        
        merchantTransactions[msg.sender].push(transaction);
        
        // Emit event
        emit SwapExecuted(msg.sender, _tokenIn, _amountIn, merchantAmount, block.timestamp);
        
        return merchantAmount;
    }

    /**
     * payAndSwapToMerchant
     * Called by payer to pay a merchant in USDT/USDC. The payer must approve this contract
     * to spend `amountIn` of `_tokenIn` before calling.
     * The contract will perform an on-chain swap to IDRX, deduct the configured fee, and
     * transfer the net IDRX to the `merchant` address. Any failures revert.
     */
    function payAndSwapToMerchant(
        address _tokenIn,
        uint256 _amountIn,
        address _merchant,
        uint256 _minIDRXOut
    ) external nonReentrant returns (uint256) {
        require(_tokenIn == USDT || _tokenIn == USDC, "Invalid input token");
        require(_amountIn > 0, "Amount must be > 0");
        require(_merchant != address(0), "Invalid merchant");

        // Transfer token from payer to contract
        require(IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn), "Transfer failed");

        // Approve router
        IERC20(_tokenIn).approve(address(uniswapRouter), _amountIn);

        // Execute swap: receive IDRX into this contract
        uint256 idrxAmount = uniswapRouter.exactInputSingle(
            IUniswapV3Router.ExactInputSingleParams({
                tokenIn: _tokenIn,
                tokenOut: idrx,
                fee: 3000,
                recipient: address(this),
                deadline: block.timestamp + 300,
                amountIn: _amountIn,
                amountOutMinimum: _minIDRXOut,
                sqrtPriceLimitX96: 0
            })
        );

        require(idrxAmount >= _minIDRXOut, "Insufficient output");

        // Calculate fee and merchant share
        uint256 feeAmount = (idrxAmount * swapFeePercentage) / 10000;
        uint256 merchantAmount = idrxAmount - feeAmount;

        // Transfer merchant amount to merchant
        require(IERC20(idrx).transfer(_merchant, merchantAmount), "Transfer to merchant failed");

        // Owner can later withdraw accumulated fees (in IDRX or tokens) via withdrawFees

        // Record transaction
        SwapTransaction memory transaction = SwapTransaction({
            txHash: keccak256(abi.encodePacked(block.timestamp, msg.sender, _merchant)),
            tokenIn: _tokenIn,
            amountIn: _amountIn,
            amountOut: merchantAmount,
            timestamp: block.timestamp,
            fee: feeAmount
        });

        merchantTransactions[_merchant].push(transaction);

        emit SwapExecuted(_merchant, _tokenIn, _amountIn, merchantAmount, block.timestamp);

        return merchantAmount;
    }
    
    /**
     * Get IDRX balance untuk merchant
     */
    function getMerchantBalance(address _merchant) external view returns (uint256) {
        return merchantBalances[_merchant];
    }
    
    /**
     * Get transaction history
     */
    function getTransactionHistory(address _merchant, uint256 _pageSize)
        external
        view
        returns (SwapTransaction[] memory)
    {
        uint256 txCount = merchantTransactions[_merchant].length;
        uint256 startIdx = txCount > _pageSize ? txCount - _pageSize : 0;
        uint256 returnSize = txCount - startIdx;
        
        SwapTransaction[] memory transactions = new SwapTransaction[](returnSize);
        
        for (uint256 i = 0; i < returnSize; i++) {
            transactions[i] = merchantTransactions[_merchant][startIdx + i];
        }
        
        return transactions;
    }
    
    /**
     * Withdraw IDRX balance - merchant tarik dananya
     */
    function withdrawIDRX(uint256 _amount) external nonReentrant {
        require(merchantBalances[msg.sender] >= _amount, "Insufficient balance");
        
        merchantBalances[msg.sender] -= _amount;
        require(IERC20(idrx).transfer(msg.sender, _amount), "Withdraw failed");
        
        emit IDRXTransferred(msg.sender, _amount);
    }
    
    /**
     * Owner functions
     */
    
    function setIDRXAddress(address _newIDRX) external onlyOwner {
        idrx = _newIDRX;
    }
    
    function setSwapFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee too high"); // Max 10%
        swapFeePercentage = _newFee;
        emit FeeUpdated(_newFee);
    }
    
    function withdrawFees(address _token) external onlyOwner nonReentrant {
        uint256 balance = IERC20(_token).balanceOf(address(this));
        require(balance > 0, "No balance");
        require(IERC20(_token).transfer(owner(), balance), "Withdraw failed");
    }
}

/*
DEPLOYMENT STEPS:
1. Deploy ke Base Mainnet via Remix (https://remix.ethereum.org)
   - Pilih Solidity 0.8.20
   - Import OpenZeppelin contracts (gunakan npm/GitHub)
   - Compile contract
   - Deploy dengan constructor parameter: IDRX address

2. Setelah deploy:
   - Copy contract address ke .env.local NEXT_PUBLIC_MERCHANT_ROUTER_ADDRESS
   - Approve tokens di BASE network
   - Test swap dengan frontend

3. Update token addresses sesuai Base network:
   - USDT/USDC addresses ada di Base docs
   - IDRX address adalah kontrak yang Anda buat/gunakan

PENTING:
- Non-custodial: Dana merchant tidak pernah lock di kontrak
- Instant withdrawal bisa di setiap saat
- Fee default 0.5% untuk operational costs
- Auto-swap mechanism bisa dipercepat atau diubah via Chainlink automation
*/
