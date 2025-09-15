import axiosClient from "@/utils/axiosClient";

export interface GoogleLoginParams {
  code: string;
}

export interface GoogleLoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      uname: string;
      uemail: string;
      ufulllname: string;
      uavatar: string;
      ubirthday: string;
      usex: string;
    };
    wallet: {
      umw_id: number;
      address: string;
      created_at: string;
    };
    isNewUser: boolean;
  };
  timestamp: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      uname: string;
      uemail: string;
      ufulllname: string;
      uavatar: string;
      ubirthday: string;
      usex: string;
    };
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

export const GoogleService = {
  // Google OAuth login
  loginWithGoogle: async (params: GoogleLoginParams): Promise<GoogleLoginResponse> => {
    const response = await axiosClient.post('/auth/login/google', {
      code: params.code
    });
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await axiosClient.get('/auth/logout');
    return response.data;
  }
};
