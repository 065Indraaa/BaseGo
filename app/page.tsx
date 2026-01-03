'use client';

import { useAccount } from 'wagmi';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

export default function Page() {
  const { isConnected } = useAccount();

  // Kalau connect -> Dashboard
  if (isConnected) {
    return <Dashboard />;
  }

  // Kalau belum connect -> LandingPage (TADI LU SALAH DISINI)
  return <LandingPage />;
}