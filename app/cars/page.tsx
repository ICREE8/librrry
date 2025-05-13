'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import NFTImageCard from '@/app/components/NFTImageCard';
import { useUserNFTs } from '@/app/hooks/useUserNFTs';

// Define a proper interface for car objects
interface Car {
  id: string;
  title: string;
  image: string;
  status: string;
  tokenId: string;
  placa: string;
  price?: string;
}

export default function CarsPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { userNFTs, isLoading, error } = useUserNFTs();
  
  const handleCardClick = (id: string) => {
    router.push(`/cars/${id}`);
  };
  
  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">My Cars</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl mb-4 text-gray-700 dark:text-gray-300">Connect your wallet to view your cars</h2>
          <div className="flex justify-center">
            <ConnectWallet />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Cars</h1>
        <div className="flex space-x-3">
          <Link
            href="/cars/tokenize"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Tokenize New Car
          </Link>
          <Link
            href="/cars/mint"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Simple Mint
          </Link>
        </div>
      </div>
      
      {isLoading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h3 className="text-lg text-red-500 mb-4">Error loading NFTs</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
        </div>
      ) : userNFTs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h3 className="text-lg text-gray-600 dark:text-gray-400 mb-4">You don&apos;t have any cars yet</h3>
          <p className="text-gray-500 dark:text-gray-500 mb-6">
            Tokenize your car to get started with CarP2P.
          </p>
          <Link
            href="/cars/tokenize"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Tokenize Your First Car
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userNFTs.map(car => (
            <NFTImageCard
              key={car.id}
              imageUri={car.image}
              title={car.title}
              tokenId={car.tokenId}
              status={car.status}
              placa={car.placa}
              price={car.price}
              onClick={() => handleCardClick(car.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}