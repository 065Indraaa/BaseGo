'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'viem/chains';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { coinbaseWallet, injected } from 'wagmi/connectors';
import { type ReactNode, useState } from 'react';
import { AuthProvider } from './lib/authContext';

// Pastikan membuat file .env.local berisi NEXT_PUBLIC_ONCHAINKIT_API_KEY=...
const ONCHAINKIT_API_KEY = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || '';

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'BaseGo Merchant',
      preference: 'all', // Allow both smart wallet and regular wallet
    }),
    injected({
      target: 'metaMask',
    }),
    injected(), // Generic injected connector for other wallets
  ],
  transports: { [base.id]: http() },
});

export function RootProvider({ children }: { children: ReactNode }) {
  // Fix: Gunakan useState untuk QueryClient agar tidak re-init saat re-render
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {ONCHAINKIT_API_KEY ? (
          <OnchainKitProvider
            apiKey={ONCHAINKIT_API_KEY}
            chain={base}
          >
            <AuthProvider>
              {children}
            </AuthProvider>
          </OnchainKitProvider>
        ) : (
          <AuthProvider>
            {children}
          </AuthProvider>
        )}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
