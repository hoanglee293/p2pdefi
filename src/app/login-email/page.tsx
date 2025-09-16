'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Alert, AlertDescription } from '@/ui/alert';
import { CheckCircle, XCircle, Mail, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

const EmailLoginContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginWithGoogle, error, user } = useAuth();
  
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
        
        // // Redirect sau 2 giây
        // setTimeout(() => {
        //   router.push('/');
        // }, 2000);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo với animation pulse */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-200 animate-ping opacity-75"></div>
            <div className="relative bg-white rounded-full p-4 shadow-lg">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={64}
                height={64}
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
            <p className="text-xl font-semibold text-gray-800">Đang xác thực Google...</p>
            <p className="text-sm text-gray-600">Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      </div>
    );
  }

  if (loginStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="flex flex-col items-center space-y-6 w-full max-w-md">
          {/* Logo với animation success */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-75"></div>
            <div className="relative bg-white rounded-full p-4 shadow-lg">
              <Image 
                src="/logo.png" 
                alt="Success" 
                width={64}
                height={64}
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
          </div>

          {/* User info card */}
          {user && (
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg w-full border border-green-200">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tên người dùng</p>
                    <p className="font-semibold text-gray-800">{user.ufulllname}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-800">{user.uemail}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Username</p>
                    <p className="font-semibold text-gray-800">@{user.uname}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Redirect message */}
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-500">
              Bạn sẽ được chuyển hướng về trang chủ trong vài giây...
            </p>
            <Button onClick={handleGoHome} className="w-full bg-green-600 hover:bg-green-700">
              Về trang chủ ngay
            </Button>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo với animation loading */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-yellow-200 animate-ping opacity-75"></div>
            <div className="relative bg-white rounded-full p-4 shadow-lg">
              <Image 
                src="/logo.png" 
                alt="Loading"
                width={64}
                height={64}
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
      <EmailLoginContent />
    </Suspense>
  );
};

export default EmailLoginPage;