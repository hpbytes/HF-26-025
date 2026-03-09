import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'manufacturer' | 'distributor' | 'patient';

interface AuthContextType {
  role: UserRole | null;
  isLoading: boolean;
  selectRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  isLoading: true,
  selectRole: () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const selectRole = (r: UserRole) => {
    setRole(r);
  };

  const logout = () => {
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ role, isLoading, selectRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
