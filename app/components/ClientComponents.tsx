'use client';

import dynamic from 'next/dynamic';

// Dynamically import the ChainSelector component to avoid SSR issues
const ChainSelector = dynamic(() => import('./ChainSelector'), { ssr: false });

export function ClientComponents() {
  return (
    <>
      <ChainSelector />
    </>
  );
} 