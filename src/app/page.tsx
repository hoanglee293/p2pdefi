'use client'; 

import { Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ModalSignin from '@/components/ModalSignin';

export default function Home() {
  const { isAuthenticated, logout } = useAuth();
  console.log("isAuthenticated", isAuthenticated)
  const handleLogout = async () => {
    await logout();
  }
  return (
    <Suspense fallback={<div className='h-screen w-screen bg-black'></div>}>
      {isAuthenticated && <button className='bg-blue-500 text-white p-2 rounded-md max-w-md mx-auto mt-10' onClick={handleLogout}>Logout</button>}
      <ModalSignin isOpen={!isAuthenticated} onClose={() => {}} />
    </Suspense>
  );
}
