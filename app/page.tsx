'use client';

import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import { useAuth } from './lib/authContext';

export default function Page() {
  const { isConnected } = useAccount();
  const { isMerchant } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show LandingPage on server and while hydrating to avoid mismatch
  if (!mounted) {
    return <LandingPage />;
  }

  // Kalau connect DAN sudah merchant -> Dashboard
  if (isConnected && isMerchant) {
    return <Dashboard />;
  }

  // Kalau belum connect atau belum merchant -> LandingPage
  return <LandingPage />;
}