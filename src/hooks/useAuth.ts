import { useState, useEffect, useCallback } from 'react';
import { TelegramWalletService, User, TelegramLoginParams } from '@/services/api/TelegramWalletService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Kiểm tra authentication status từ localStorage hoặc cookies
  const checkAuthStatus = useCallback(() => {
    try {
      const userData = localStorage.getItem('user_data');
      const authToken = localStorage.getItem('auth_token');
      
      if (userData && authToken) {
        const user = JSON.parse(userData);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: false,
          isLoading: false
        }));
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: 'Failed to check authentication status',
        isLoading: false
      }));
    }
  }, []);

  // Login với Telegram
  const login = useCallback(async (params: TelegramLoginParams) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await TelegramWalletService.verifyTelegramLogin(params);
      
      if (response.success) {
        // Tạo user object từ response hoặc từ params nếu không có data
        const user: User = response.data?.user || {
          uid: parseInt(params.telegram_id),
          uname: `telegram_${params.telegram_id}`,
          uemail: null,
          ufulllname: `Telegram User ${params.telegram_id}`,
          uavatar: null,
          ustatus: 'active'
        };
        
        // Lưu user data vào localStorage
        localStorage.setItem('user_data', JSON.stringify(user));
        localStorage.setItem('auth_token', 'telegram_token'); // API sẽ set cookie
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        return { 
          success: true, 
          isNewUser: response.data?.isNewUser || false,
          user 
        };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await TelegramWalletService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Xóa dữ liệu khỏi localStorage
      localStorage.removeItem('user_data');
      localStorage.removeItem('auth_token');
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  }, []);

  // Refetch user data
  const refetch = useCallback(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Clear error
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    ...authState,
    login,
    logout,
    refetch,
    clearError
  };
};
