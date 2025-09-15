'use client'; 

import { Suspense } from 'react';

export default function Home() {
  const handleGoogleSignIn = async () => {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile&access_type=offline`
    console.log("handleGoogleSignIn")
  }
  return (
    <Suspense fallback={<div></div>}>
      Hello
      <button onClick={handleGoogleSignIn} className='bg-blue-500 text-white p-2 rounded-md max-w-md mx-auto'>
        Connect Google
      </button>
    </Suspense>
  );
}
