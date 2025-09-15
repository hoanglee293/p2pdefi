'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Alert, AlertDescription } from '@/ui/alert';
import { Loader2, LogOut, User, Mail, MessageCircle } from 'lucide-react';
import GoogleLoginButton from './GoogleLoginButton';
import Link from 'next/link';

const LoginDemo: React.FC = () => {
  const { user, isAuthenticated, isLoading, error, logout, getProfile } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleGetProfile = async () => {
    await getProfile();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <User className="h-16 w-16 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Đã đăng nhập</CardTitle>
          <CardDescription>Chào mừng bạn đến với P2P DeFi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Tên đầy đủ:</p>
            <p className="font-medium">{user.ufulllname}</p>
            <p className="text-sm text-gray-600">Username:</p>
            <p className="font-medium">@{user.uname}</p>
            {user.uemail && (
              <>
                <p className="text-sm text-gray-600">Email:</p>
                <p className="font-medium">{user.uemail}</p>
              </>
            )}
            {user.uavatar && (
              <div className="mt-2">
                <img 
                  src={user.uavatar} 
                  alt="Avatar" 
                  className="w-16 h-16 rounded-full mx-auto"
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Button onClick={handleGetProfile} variant="outline" className="w-full">
              <User className="mr-2 h-4 w-4" />
              Làm mới thông tin
            </Button>
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Đăng nhập</CardTitle>
        <CardDescription>Chọn phương thức đăng nhập của bạn</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-3">
          <GoogleLoginButton className="w-full">
            <Mail className="mr-2 h-4 w-4" />
            Đăng nhập với Google
          </GoogleLoginButton>
          
          <Link href="/tglogin" className="block">
            <Button variant="outline" className="w-full">
              <MessageCircle className="mr-2 h-4 w-4" />
              Đăng nhập với Telegram
            </Button>
          </Link>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Hoặc truy cập trực tiếp:</p>
          <div className="mt-2 space-x-2">
            <Link href="/login-email" className="text-blue-600 hover:underline">
              /login-email
            </Link>
            <span>•</span>
            <Link href="/tglogin" className="text-blue-600 hover:underline">
              /tglogin
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginDemo;
