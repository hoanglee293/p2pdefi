'use client'; 

import { Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ModalSignin from '@/components/ModalSignin';
import { Header } from './components/Header';
import { MainView } from './components/main-view';

export default function Home() {
  const { isAuthenticated, logout } = useAuth();
  console.log("isAuthenticated", isAuthenticated)
  const handleLogout = async () => {
    await logout();
  }
  return (
    <Suspense fallback={<div className='h-screen w-screen bg-black'></div>}>
      <Header />
      <MainView />
      <ModalSignin isOpen={!isAuthenticated} onClose={() => {}} />
    </Suspense>
  );
}
