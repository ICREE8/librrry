'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';

export default function Navbar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-500 font-bold' : 'text-gray-700 dark:text-gray-300';
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            CarP2P
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex space-x-6">
            <Link href="/profile" className={`${isActive('/profile')} hover:text-blue-600 transition-colors`}>
              Profile
            </Link>
            <Link href="/cars" className={`${isActive('/cars')} hover:text-blue-600 transition-colors`}>
              My Cars
            </Link>
            <Link href="/trading" className={`${isActive('/trading')} hover:text-blue-600 transition-colors`}>
              CarP2P Trading
            </Link>
            <Link href="/collateralize" className={`${isActive('/collateralize')} hover:text-blue-600 transition-colors`}>
              Get Loans
            </Link>
            <Link href="/marketplace" className={`${isActive('/marketplace')} hover:text-blue-600 transition-colors`}>
              Marketplace
            </Link>
          </div>
          
          <div className="mt-4 md:mt-0">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </nav>
  );
} 