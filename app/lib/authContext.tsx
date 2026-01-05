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

  // Function to refresh merchant data
  const refreshMerchantData = () => {
    if (address && isConnected) {
      const savedMerchant = localStorage.getItem(`merchant_${address}`);
      if (savedMerchant) {
        try {
          const merchantData = JSON.parse(savedMerchant);
          setMerchantName(merchantData.name);
        } catch (e) {
          console.error('Error parsing merchant data:', e);
          setMerchantName(null);
        }
      } else {
        setMerchantName(null);
      }
    } else {
      setMerchantName(null);
    }
  };

  // Check localStorage untuk merchant data
  useEffect(() => {
    refreshMerchantData();
  }, [address, isConnected]);

  // Listen to storage changes (for when merchant registers)
  useEffect(() => {
    const handleStorageChange = () => {
      refreshMerchantData();
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen to custom event for same-tab updates
    window.addEventListener('merchantRegistered', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('merchantRegistered', handleStorageChange);
    };
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
