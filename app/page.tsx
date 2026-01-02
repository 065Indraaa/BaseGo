'use client';

import { useAccount } from 'wagmi';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

export default function Page() {
  // Gunakan hook wagmi untuk cek status koneksi
  const { isConnected } = useAccount();

  // Jika Connected -> Tampilkan Dashboard
  if (isConnected) {
    return <Dashboard />;
  }

  // Jika Tidak Connected -> Tampilkan Landing Page
  return <Dashboard />;
}