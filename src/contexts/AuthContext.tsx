'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/services/api/TelegramWalletService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (params: { telegram_id: string; code: string }) => Promise<{ success: boolean; isNewUser?: boolean; error?: string }>;
  loginWithTelegram: (params: { telegram_id: string; code: string }) => Promise<{ success: boolean; isNewUser?: boolean; error?: string }>;
  loginWithGoogle: (params: { code: string }) => Promise<{ success: boolean; isNewUser?: boolean; error?: string }>;
  getProfile: () => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  refetch: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
