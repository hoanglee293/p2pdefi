'use client'; 

import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense fallback={<div></div>}>
      Hello
    </Suspense>
  );
}
