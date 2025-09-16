import axiosClient from "@/utils/axiosClient";

export interface User {
  uid?: number;
  uname: string;
  uemail: string | null;
  ufulllname: string;
  uavatar: string | null;
  ustatus?: string;
  ubirthday?: string;
  usex?: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    mainWallet: {
      umw_id: number;
      address: string;
      created_at: string;
    };
    importWallets: Array<{
      uic_id: number;
      uic_name: string;
      address: string;
      created_at: string;
    }>;
  };
  timestamp: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
  timestamp: string;
}

class AuthService {
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: string | null) => void;
    reject: (error: Error) => void;
  }> = [];

  // Process failed requests queue
  private processQueue(error: Error | null, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  // Refresh token function
  private async refreshToken(): Promise<string | null> {
    if (this.isRefreshing) {
      // If already refreshing, wait for the current refresh to complete
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const response = await axiosClient.post('/auth/refresh');
      const data: RefreshTokenResponse = response.data;
      
      if (data.success && data.data) {
        // Update cookies will be handled by the server
        this.processQueue(null, data.data.accessToken);
        return data.data.accessToken;
      } else {
        throw new Error(data.message || 'Token refresh failed');
      }
    } catch (error) {
      this.processQueue(error instanceof Error ? error : new Error(String(error)), null);
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Get user profile with auto-refresh token
  async getProfile(): Promise<ProfileResponse> {
    try {
      const response = await axiosClient.get('/auth/me');
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 'status' in error.response && 
          error.response.status === 401) {
        try {
          // Try to refresh token
          await this.refreshToken();
          // Retry the original request
          const response = await axiosClient.get('/auth/me');
          return response.data;
        } catch (refreshError) {
          // If refresh fails, clear auth data and redirect to login
          localStorage.removeItem('user_data');
          localStorage.removeItem('auth_token');
          
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/tglogin')) {
            window.location.href = "/";
          }
          
          throw refreshError;
        }
      }
      throw error;
    }
  }

  // Get user profile with retry mechanism
  async getProfileWithRetry(maxRetries: number = 3): Promise<ProfileResponse> {
    let lastError: Error = new Error('Unknown error');
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.getProfile();
      } catch (error: unknown) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (error && typeof error === 'object' && 'response' in error && 
            error.response && typeof error.response === 'object' && 'status' in error.response && 
            error.response.status === 401 && attempt < maxRetries) {
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        
        if (attempt === maxRetries) {
          break;
        }
      }
    }
    
    throw lastError;
  }

  // Logout
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosClient.get('/auth/logout');
      return response.data;
    } catch (error) {
      // Even if logout fails on server, clear local data
      localStorage.removeItem('user_data');
      localStorage.removeItem('auth_token');
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const userData = localStorage.getItem('user_data');
    const authToken = localStorage.getItem('auth_token');
    return !!(userData && authToken);
  }

  // Get user data from localStorage
  getUserData(): User | null {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  // Update user data in localStorage
  updateUserData(user: User): void {
    localStorage.setItem('user_data', JSON.stringify(user));
  }
}

export const authService = new AuthService();
export default authService;
