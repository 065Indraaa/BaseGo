'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { type ReactNode, useState } from 'react';
import { base } from 'wagmi/chains';

// Pastikan membuat file .env.local berisi NEXT_PUBLIC_ONCHAINKIT_API_KEY=...
const ONCHAINKIT_API_KEY = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || '';

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'BaseGo Merchant',
    }),
  ],
  transports: {
    [base.id]: http(), 
  }, // <--- INI YANG KURANG TADI (Penutup object transports)
});

export function RootProvider({ children }: { children: ReactNode }) {
  // Menggunakan useState agar QueryClient stabil antar render
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