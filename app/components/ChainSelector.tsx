'use client';

import { useState, useEffect } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

export default function ChainSelector() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  // Check if user is on Base Sepolia
  useEffect(() => {
    if (isConnected) {
      setIsWrongNetwork(chainId !== baseSepolia.id);
    }
  }, [chainId, isConnected]);

  // Handle network switch
  const handleSwitchToBaseSepolia = () => {
    if (isConnected) {
      switchChain({ chainId: baseSepolia.id });
    }
  };

  if (!isConnected || !isWrongNetwork) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg shadow-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
          <div>
            <p className="font-bold">Wrong Network</p>
            <p className="text-sm">Please connect to Base Sepolia for this application</p>
          </div>
        </div>
        <button 
          onClick={handleSwitchToBaseSepolia}
          className="mt-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
        >
          <span>Switch to Base Sepolia</span>
        </button>
      </div>
    </div>
  );
} 