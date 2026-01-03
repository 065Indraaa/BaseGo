'use client';

import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

export default function Page() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show LandingPage on server and while hydrating to avoid mismatch
  if (!mounted) {
    return <LandingPage />;
  }

  // Kalau connect -> Dashboard
  if (isConnected) {
    return <Dashboard />;
  }

  // Kalau belum connect -> LandingPage
  return <LandingPage />;
}