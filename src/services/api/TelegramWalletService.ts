import axiosClient from "@/utils/axiosClient";

export interface TelegramLoginParams {
  telegram_id: string;
  code: string;
}

export interface User {
  uid: number;
  uname: string;
  uemail: string | null;
  ufulllname: string;
  uavatar: string | null;
  ustatus: string;
}

export interface TelegramLoginResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data?: {
    user: User;
    isNewUser: boolean;
  };
}

export interface LogoutResponse {
  status: string;
  successType: string;
  message: string;
  data: {
    success: boolean;
    message: string;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
  httpStatus: number;
}

export const TelegramWalletService = {
  // Xác thực Telegram login
  verifyTelegramLogin: async (params: TelegramLoginParams): Promise<TelegramLoginResponse> => {
    const response = await axiosClient.post('/auth/telegram/verify', {
        telegram_id: params.telegram_id,
        code: params.code
      });
    return response.data;
  },

  // Logout
  logout: async (): Promise<LogoutResponse> => {
    const response = await axiosClient.get('/auth/logout');
    return response.data;
  }
};