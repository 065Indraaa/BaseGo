/**
 * Auth/Session context untuk track user login state
 */
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface AuthContextType {
  isAuthenticated: boolean;
  userAddress: string | null;
  merchantName: string | null;
  isMerchant: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const [merchantName, setMerchantName] = useState<string | null>(null);

  // Check localStorage untuk merchant data
  useEffect(() => {
    if (address && isConnected) {
      const savedMerchant = localStorage.getItem(`merchant_${address}`);
      if (savedMerchant) {
        setMerchantName(JSON.parse(savedMerchant).name);
      }
    }
  }, [address, isConnected]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isConnected && !!address,
        userAddress: address || null,
        merchantName,
        isMerchant: !!merchantName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
