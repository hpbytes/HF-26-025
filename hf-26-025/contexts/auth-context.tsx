import React, { createContext, useContext, useState, useEffect } from 'react';
import { setApiWallet, fetchDemoWallets } from '@/services/api';

export type UserRole = 'manufacturer' | 'distributor' | 'patient';

interface AuthContextType {
  role: UserRole | null;
  wallet: string | null;
  isLoading: boolean;
  selectRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  wallet: null,
  isLoading: true,
  selectRole: () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const [walletMap, setWalletMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Ensure we never stay on splash screen forever
      setIsLoading(false);
    }, 5000);

    fetchDemoWallets()
      .then((w) => {
        const map: Record<string, string> = {};
        if (w.manufacturer) map.manufacturer = w.manufacturer;
        if (w.distributor) map.distributor = w.distributor;
        if (w.patient) map.patient = w.patient;
        setWalletMap(map);
      })
      .catch(() => {
        // Backend not reachable — app still works with empty wallets
        console.warn('Could not fetch demo wallets from backend');
      })
      .finally(() => {
        clearTimeout(timeout);
        setIsLoading(false);
      });
  }, []);

  const selectRole = (r: UserRole) => {
    const w = walletMap[r] || null;
    setRole(r);
    setWallet(w);
    setApiWallet(w);
  };

  const logout = () => {
    setRole(null);
    setWallet(null);
    setApiWallet(null);
  };

  return (
    <AuthContext.Provider value={{ role, wallet, isLoading, selectRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
