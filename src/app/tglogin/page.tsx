'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Alert, AlertDescription } from '@/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
const TelegramLoginPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, isLoading, error, isAuthenticated, user } = useAuth();
  
  const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isNewUser, setIsNewUser] = useState(false);

  const handleTelegramLogin = useCallback(async (telegramId: string, code: string) => {
    try {
      const result = await login({ telegram_id: telegramId, code });
      
      if (result.success) {
        setLoginStatus('success');
        setIsNewUser(result.isNewUser || false);
        
        // Redirect sau 2 giây
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setLoginStatus('error');
      }
    } catch (err) {
      setLoginStatus('error');
    }
  }, [login, router]);

  useEffect(() => {
    const telegramId = searchParams.get('telegram_id');
    const code = searchParams.get('code');

    if (telegramId && code) {
      handleTelegramLogin(telegramId, code);
    } else {
      setLoginStatus('error');
    }
  }, [searchParams, handleTelegramLogin]);

  const handleRetry = () => {
    const telegramId = searchParams.get('telegram_id');
    const code = searchParams.get('code');
    
    if (telegramId && code) {
      handleTelegramLogin(telegramId, code);
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (isLoading || loginStatus === 'idle') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-lg font-medium">Đang xác thực Telegram...</p>
              <p className="text-sm text-gray-500">Vui lòng chờ trong giây lát</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loginStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Đăng nhập thành công!</CardTitle>
            <CardDescription>
              {isNewUser ? 'Chào mừng bạn đến với P2P DeFi!' : 'Chào mừng bạn quay trở lại!'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Tên người dùng:</p>
                <p className="font-medium">{user.ufulllname}</p>
                <p className="text-sm text-gray-600">Username:</p>
                <p className="font-medium">@{user.uname}</p>
              </div>
            )}
            <p className="text-sm text-gray-500 text-center">
              Bạn sẽ được chuyển hướng về trang chủ trong vài giây...
            </p>
            <Button onClick={handleGoHome} className="w-full">
              Về trang chủ ngay
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Đăng nhập thất bại</CardTitle>
          <CardDescription>
            Không thể xác thực thông tin Telegram của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Button onClick={handleRetry} className="w-full">
              Thử lại
            </Button>
            <Button onClick={handleGoHome} variant="outline" className="w-full">
              Về trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramLoginPage;