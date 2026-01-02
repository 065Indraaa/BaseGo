export const IDRX_TOKEN_ADDRESS = '0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22'; 

// Menggunakan Zero Address sebagai placeholder aman untuk mencegah crash Wagmi
export const IDRX_STAKING_ADDRESS = '0x0000000000000000000000000000000000000000'; 

export const STAKING_ABI = [
  { inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }], name: "stake", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }], name: "withdraw", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "getReward", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address", name: "account", type: "address" }], name: "earned", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "account", type: "address" }], name: "balanceOf", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" }
] as const;

export const ERC20_ABI = [
  { inputs: [{ internalType: "address", name: "spender", type: "address" }, { internalType: "uint256", name: "amount", type: "uint256" }], name: "approve", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address", name: "owner", type: "address" }, { internalType: "address", name: "spender", type: "address" }], name: "allowance", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "account", type: "address" }], name: "balanceOf", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" }
] as const;