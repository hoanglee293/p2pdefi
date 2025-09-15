'use client';

import React from 'react';
import { Button } from '@/ui/button';
import { Mail } from 'lucide-react';

interface GoogleLoginButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ 
  className = '', 
  children 
}) => {
  const handleGoogleLogin = () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/login-email`;
    const scope = 'openid email profile';
    const responseType = 'code';
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=${responseType}&access_type=offline&prompt=consent`;
    
    window.location.href = googleAuthUrl;
  };

  return (
    <Button 
      onClick={handleGoogleLogin}
      className={`bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 ${className}`}
    >
      <Mail className="mr-2 h-4 w-4" />
      {children || 'Đăng nhập với Google'}
    </Button>
  );
};

export default GoogleLoginButton;
