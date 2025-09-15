'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Alert, AlertDescription } from '@/ui/alert';
import { Loader2, CheckCircle, XCircle, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const EmailLoginContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginWithGoogle, isLoading, error, user } = useAuth();
  
  const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isNewUser, setIsNewUser] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGoogleLogin = useCallback(async (code: string) => {
    setIsProcessing(true);
    try {
      const result = await loginWithGoogle({ code });
      
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
    } finally {
      setIsProcessing(false);
    }
  }, [loginWithGoogle, router]);

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setLoginStatus('error');
      setIsProcessing(false);
    } else if (code) {
      handleGoogleLogin(code);
    }
  }, [searchParams, handleGoogleLogin]);

  const handleRetry = () => {
    // Redirect to Google OAuth
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/login-email`;
    const scope = 'openid email profile';
    const responseType = 'code';
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=${responseType}&access_type=offline&prompt=consent`;
    
    window.location.href = googleAuthUrl;
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (isProcessing || loginStatus === 'idle') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-lg font-medium">Đang xác thực Google...</p>
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
                <p className="text-sm text-gray-600">Email:</p>
                <p className="font-medium">{user.uemail}</p>
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
            Không thể xác thực thông tin Google của bạn
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
              <Mail className="mr-2 h-4 w-4" />
              Thử lại với Google
            </Button>
            <Button onClick={handleGoHome} variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Về trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const EmailLoginPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <EmailLoginContent />
    </Suspense>
  );
};

export default EmailLoginPage;