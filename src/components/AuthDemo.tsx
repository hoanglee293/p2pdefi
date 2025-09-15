'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Alert, AlertDescription } from '@/ui/alert';
import { LogOut, User, Shield } from 'lucide-react';

const AuthDemo: React.FC = () => {
  const { user, isAuthenticated, isLoading, error, logout, clearError } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Authentication Status
          </CardTitle>
          <CardDescription>
            You are not logged in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Please login via Telegram to access the application.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          User Profile
        </CardTitle>
        <CardDescription>
          Welcome back!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
            <Button 
              onClick={clearError} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Clear Error
            </Button>
          </Alert>
        )}
        
        {user && (
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Full Name:</p>
              <p className="font-medium">{user.ufulllname}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Username:</p>
              <p className="font-medium">@{user.uname}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">User ID:</p>
              <p className="font-medium">{user.uid}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status:</p>
              <p className="font-medium capitalize">{user.ustatus}</p>
            </div>
          </div>
        )}
        
        <Button 
          onClick={handleLogout} 
          variant="destructive" 
          className="w-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthDemo;
