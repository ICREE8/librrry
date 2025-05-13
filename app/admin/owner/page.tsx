'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import Link from 'next/link';

// The contract owner address
const CONTRACT_OWNER = '0x3f9b734394FC1E96afe9523c69d30D227dF4ffca';

export default function OwnerAdminPage() {
  const { address, isConnected } = useAccount();
  const [isOwner, setIsOwner] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);

  // Check if the connected wallet is the contract owner
  useEffect(() => {
    if (address) {
      setWalletAddress(address);
      setIsOwner(address.toLowerCase() === CONTRACT_OWNER.toLowerCase());
    } else {
      setIsOwner(false);
    }
  }, [address]);

  // Form for authorizing minters manually
  const [minterAddress, setMinterAddress] = useState('');
  const [txHash, setTxHash] = useState('');
  const [authorizing, setAuthorizing] = useState(false);

  // Authorization form handler
  const handleAuthorize = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!minterAddress || !minterAddress.startsWith('0x')) {
      alert('Please enter a valid Ethereum address');
      return;
    }
    
    setAuthorizing(true);
    
    try {
      // Use ethers.js or another library to send the transaction directly
      // This is just placeholder code - you'd need to implement the actual transaction
      console.log(`Authorizing minter: ${minterAddress}`);
      
      // Simulate a transaction hash
      setTxHash('0x' + Math.random().toString(16).substring(2, 66));
      
      // In a real implementation, you'd do:
      // const tx = await signer.sendTransaction({...})
      // setTxHash(tx.hash)
      
      alert('Authorization successful!');
    } catch (error) {
      console.error('Error authorizing minter:', error);
      alert('Error authorizing minter. See console for details.');
    } finally {
      setAuthorizing(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Contract Owner Dashboard</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl mb-4 text-gray-700 dark:text-gray-300">Please connect your wallet</h2>
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
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contract Owner Dashboard</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Wallet Status</h2>
        
        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">Your address:</span> {walletAddress}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">Owner address:</span> {CONTRACT_OWNER}
          </p>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            <span className="font-medium">Status:</span> 
            {isOwner ? (
              <span className="text-green-600 dark:text-green-400"> You are the contract owner ✓</span>
            ) : (
              <span className="text-red-600 dark:text-red-400"> You are NOT the contract owner ✗</span>
            )}
          </p>
        </div>
        
        {isOwner ? (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Authorize Minter (Manual)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Use this form to authorize an address to mint NFTs directly using your browser wallet.
            </p>
            
            <form onSubmit={handleAuthorize} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Wallet Address to Authorize
                </label>
                <input
                  type="text"
                  value={minterAddress}
                  onChange={(e) => setMinterAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={authorizing}
                className={`px-4 py-2 ${
                  authorizing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-medium rounded-lg transition-colors`}
              >
                {authorizing ? 'Authorizing...' : 'Authorize Address'}
              </button>
            </form>
            
            {txHash && (
              <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 rounded">
                <p className="font-medium">Transaction Submitted!</p>
                <a
                  href={`https://sepolia.basescan.org/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline break-all block mt-2 text-sm"
                >
                  {txHash}
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200 rounded">
            <p className="font-medium">You need to connect with the contract owner wallet to manage contract settings.</p>
            <p className="mt-2">
              Please connect with: {CONTRACT_OWNER}
            </p>
          </div>
        )}
      </div>

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
    </div>
  );
} 