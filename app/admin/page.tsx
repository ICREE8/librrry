'use client';

import { useAccount } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import Link from 'next/link';
import AuthorizeMinter from '../components/AuthorizeMinter';

export default function AdminPage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">NFT Contract Admin</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl mb-4 text-gray-700 dark:text-gray-300">Conecta tu wallet para administrar los contratos</h2>
          <div className="flex justify-center">
            <ConnectWallet />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4 text-blue-600 dark:text-blue-400 hover:underline">
          ← Volver al Inicio
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">NFT Contract Admin</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Contract Information</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-medium">Contract Address:</span>{" "}
            <a 
              href="https://sepolia.basescan.org/address/0x1C4cc777E309c6403Ce82e2332887470773A8a74" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline break-all"
            >
              0x1C4cc777E309c6403Ce82e2332887470773A8a74
            </a>
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">Network:</span> Base Sepolia Testnet
          </p>
        </div>

        <AuthorizeMinter />
      </div>
    </div>
  );
} 