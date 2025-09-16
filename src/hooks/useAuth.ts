import { useState, useEffect, useCallback } from 'react';
import { TelegramWalletService, User, TelegramLoginParams } from '@/services/api/TelegramWalletService';
import { GoogleService, GoogleLoginParams } from '@/services/api/GoogleService';
import { authService } from '@/services/api/AuthService';

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
    } catch {
      setAuthState(prev => ({
        ...prev,
        error: 'Failed to check authentication status',
        isLoading: false
      }));
    }
  }, []);

  // Login với Telegram
  const loginWithTelegram = useCallback(async (params: TelegramLoginParams) => {
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
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || 
                          (error as { message?: string })?.message || 'Login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Login với Google
  const loginWithGoogle = useCallback(async (params: GoogleLoginParams) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await GoogleService.loginWithGoogle(params);
      
      if (response.success && response.data) {
        const user: User = {
          uname: response.data.user.uname,
          uemail: response.data.user.uemail,
          ufulllname: response.data.user.ufulllname,
          uavatar: response.data.user.uavatar,
          ubirthday: response.data.user.ubirthday,
          usex: response.data.user.usex,
          ustatus: 'active'
        };
        
        // Lưu user data vào localStorage
        localStorage.setItem('user_data', JSON.stringify(user));
        localStorage.setItem('auth_token', 'google_token'); // API sẽ set cookie
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        return { 
          success: true, 
          isNewUser: response.data.isNewUser,
          user 
        };
      } else {
        throw new Error(response.message || 'Google login failed');
      }
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || 
                          (error as { message?: string })?.message || 'Google login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Generic login method (backward compatibility)
  const login = useCallback(async (params: TelegramLoginParams) => {
    return loginWithTelegram(params);
  }, [loginWithTelegram]);

  // Logout
  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await authService.logout();
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
      
      // Trigger refetch after successful logout to refresh UI state
      setTimeout(() => {
        // Call checkAuthStatus directly since user is now logged out
        checkAuthStatus();
      }, 100);
    }
  }, [checkAuthStatus]);

  // Get user profile from API with auto-refresh token
  const getProfile = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.getProfileWithRetry();
      if (response.success && response.data) {
        const user: User = {
          uid: response.data.user.uid,
          uname: response.data.user.uname,
          uemail: response.data.user.uemail,
          ufulllname: response.data.user.ufulllname,
          uavatar: response.data.user.uavatar,
          ubirthday: response.data.user.ubirthday,
          usex: response.data.user.usex,
          ustatus: 'active'
        };
        
        // Update user data in localStorage
        authService.updateUserData(user);
        
        setAuthState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        }));
        
        return { success: true, user, wallet: response.data.mainWallet, importWallets: response.data.importWallets };
      } else {
        throw new Error(response.message || 'Failed to get profile');
      }
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || 
                          (error as { message?: string })?.message || 'Failed to get profile';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Refetch user data
  const refetch = useCallback(() => {
    if (authService.isAuthenticated()) {
      getProfile();
    } else {
      checkAuthStatus();
    }
  }, [checkAuthStatus, getProfile]);

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
    loginWithTelegram,
    loginWithGoogle,
    getProfile,
    logout,
    refetch,
    clearError
  };
};
