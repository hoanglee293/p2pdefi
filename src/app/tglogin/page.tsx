'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Alert, AlertDescription } from '@/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const TelegramLoginContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, isLoading, error, user } = useAuth();
  
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
    } catch {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo với animation pulse */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-200 animate-ping opacity-75"></div>
            <div className="relative bg-white rounded-full p-4 shadow-lg">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-16 h-16 animate-pulse" 
              />
            </div>
          </div>
          
          {/* Spinner loading */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          
          {/* Text loading */}
          <div className="text-center space-y-2">
            <p className="text-xl font-semibold text-gray-800">Đang xác thực Telegram...</p>
            <p className="text-sm text-gray-600">Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      </div>
    );
  }

  if (loginStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo với animation success */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-75"></div>
            <div className="relative bg-white rounded-full p-4 shadow-lg">
              <img 
                src="/logo.png" 
                alt="Success" 
                className="w-16 h-16" 
              />
            </div>
            {/* Checkmark overlay */}
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {/* Success message */}
          <div className="text-center space-y-2">
            <p className="text-2xl font-bold text-green-600">Đăng nhập thành công!</p>
            <p className="text-sm text-gray-600">
              {isNewUser ? 'Chào mừng bạn đến với P2P DeFi!' : 'Chào mừng bạn quay trở lại!'}
            </p>
            <p className="text-xs text-gray-500">Đang chuyển hướng...</p>
          </div>
        </div>
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

const TelegramLoginPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo với animation loading */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-yellow-200 animate-ping opacity-75"></div>
            <div className="relative bg-white rounded-full p-4 shadow-lg">
              <img 
                src="/logo.png" 
                alt="Loading" 
                className="w-16 h-16 animate-spin" 
              />
            </div>
          </div>
          
          {/* Loading text */}
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800">Đang tải...</p>
          </div>
        </div>
      </div>
    }>
      <TelegramLoginContent />
    </Suspense>
  );
};

export default TelegramLoginPage;