'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'viem/chains';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { type ReactNode, useState } from 'react';

// Pastikan membuat file .env.local berisi NEXT_PUBLIC_ONCHAINKIT_API_KEY=...
const ONCHAINKIT_API_KEY = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || '';

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'BaseGo Merchant',
    }),
  ],
  transports: { [base.id]: http() }, // Fix: Format transport array/map yang benar
});

export function RootProvider({ children }: { children: ReactNode }) {
  // Fix: Gunakan useState untuk QueryClient agar tidak re-init saat re-render
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={ONCHAINKIT_API_KEY}
          chain={base}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
