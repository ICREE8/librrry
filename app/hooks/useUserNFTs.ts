import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { readContract } from '@wagmi/core';

// Define interfaces
interface NFT {
  id: string;
  tokenId: string;
  title: string;
  image: string;
  status: string;
  placa: string;
  price?: string;
}

// For debugging - toggle to true to see mock data
const USE_MOCK_DATA = true;

// Contract Address from VehicleNFT_V2
const CONTRACT_ADDRESS = '0x1C4cc777E309c6403Ce82e2332887470773A8a74';

// Simplified ABI with only the functions we need
const NFT_ABI = [
  {
    inputs: [],
    name: 'totalMinted',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'tokenId', type: 'uint256' }
    ],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'tokenId', type: 'uint256' }
    ],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  }
];

// Generate mock NFT data for testing
function getMockNFTs(address: string): NFT[] {
  return [
    {
      id: '1',
      tokenId: '1',
      title: 'Toyota Corolla 2022',
      image: 'https://images.unsplash.com/photo-1638618164682-12b986ec2a75?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      status: 'Owned',
      placa: 'ABC123',
    },
    {
      id: '2',
      tokenId: '2',
      title: 'Chevrolet Camaro 2020',
      image: 'https://gateway.pinata.cloud/ipfs/QmZ4vLGb5KWQeqC3qJxQgjuV8GV1YBDwgdU4AJth3HVdEz',
      status: 'Listed for Sale',
      placa: 'XYZ789',
      price: '2.8',
    }
  ];
}

export function useUserNFTs() {
  const { address, isConnected } = useAccount();
  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the total supply of NFTs
  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: NFT_ABI,
    functionName: 'totalMinted',
  });

  useEffect(() => {
    async function fetchNFTs() {
      if (!isConnected || !address) {
        setIsLoading(false);
        return;
      }

      // For debugging, use mock data if enabled
      if (USE_MOCK_DATA) {
        console.log('Using mock NFT data for debugging');
        setUserNFTs(getMockNFTs(address));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      console.log('Fetching NFTs for wallet:', address);

      try {
        // Log total minted tokens if available
        if (totalSupply) {
          console.log('Total minted NFTs:', totalSupply.toString());
        } else {
          console.log('Total supply not available yet');
        }
        
        // Create batch requests to check ownership for all token IDs
        const totalMinted = totalSupply ? Number(totalSupply) : 10; // Check up to 10 tokens if totalSupply is not available
        console.log(`Checking ownership for tokens 1 to ${totalMinted}`);
        
        // Array to collect NFTs
        const nftsFound: NFT[] = [];
        
        // We'll check each token ID individually to avoid the complexity of batch calls
        for (let tokenId = 1; tokenId <= totalMinted; tokenId++) {
          try {
            // Check if the current user owns this token - try multiple methods
            let ownerAddress = null;
            
            try {
              // Method 1: Call the RPC endpoint
              ownerAddress = await fetchOwnerOf(tokenId);
              console.log(`Token ${tokenId} owner (Method 1):`, ownerAddress);
            } catch (err) {
              console.warn(`Failed to fetch owner using Method 1 for token ${tokenId}:`, err);
              
              try {
                // Method 2: Use wagmi core readContract
                const result = await readContract({
                  address: CONTRACT_ADDRESS as `0x${string}`,
                  abi: NFT_ABI,
                  functionName: 'ownerOf',
                  args: [BigInt(tokenId)],
                });
                ownerAddress = result as string;
                console.log(`Token ${tokenId} owner (Method 2):`, ownerAddress);
              } catch (err2) {
                console.warn(`Failed to fetch owner using Method 2 for token ${tokenId}:`, err2);
              }
            }
            
            if (ownerAddress && ownerAddress.toLowerCase() === address.toLowerCase()) {
              console.log(`Token ${tokenId} is owned by the current wallet`);
              
              // Fetch token URI - try multiple methods
              let uri = null;
              
              try {
                // Method 1: Call the RPC endpoint
                uri = await fetchTokenURI(tokenId);
                console.log(`Token ${tokenId} URI (Method 1):`, uri);
              } catch (err) {
                console.warn(`Failed to fetch URI using Method 1 for token ${tokenId}:`, err);
                
                try {
                  // Method 2: Use wagmi core readContract
                  const result = await readContract({
                    address: CONTRACT_ADDRESS as `0x${string}`,
                    abi: NFT_ABI,
                    functionName: 'tokenURI',
                    args: [BigInt(tokenId)],
                  });
                  uri = result as string;
                  console.log(`Token ${tokenId} URI (Method 2):`, uri);
                } catch (err2) {
                  console.warn(`Failed to fetch URI using Method 2 for token ${tokenId}:`, err2);
                }
              }
              
              if (uri) {
                // Process the token metadata
                console.log(`Processing metadata for token ${tokenId}`);
                const nft = await processNFTMetadata(tokenId, uri);
                nftsFound.push(nft);
              }
            }
          } catch (err) {
            console.error(`Error checking token ${tokenId}:`, err);
            // Continue with next token
          }
        }
        
        console.log(`Found ${nftsFound.length} NFTs owned by wallet ${address}`);
        setUserNFTs(nftsFound);
      } catch (error) {
        console.error('Error fetching user NFTs:', error);
        setError('Failed to fetch your NFTs. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchNFTs();
  }, [address, isConnected, totalSupply]);

  // Helper function to fetch owner of a token
  async function fetchOwnerOf(tokenId: number): Promise<string | null> {
    try {
      // Try both Base Sepolia RPC formats
      const endpoints = [
        `https://sepolia.base.org/v1/address/${CONTRACT_ADDRESS}/ownerOf?args=["${tokenId}"]`,
        `https://api.sepolia.base.org/v1/address/${CONTRACT_ADDRESS}/ownerOf?args=[${tokenId}]`
      ];
      
      for (const endpoint of endpoints) {
        try {
          const result = await fetch(endpoint);
          const data = await result.json();
          if (data.result) {
            return data.result;
          }
        } catch (err) {
          console.warn(`Failed endpoint ${endpoint}:`, err);
        }
      }
      
      return null;
    } catch (err) {
      console.error('Error in fetchOwnerOf:', err);
      return null;
    }
  }

  // Helper function to fetch token URI
  async function fetchTokenURI(tokenId: number): Promise<string | null> {
    try {
      // Try both Base Sepolia RPC formats
      const endpoints = [
        `https://sepolia.base.org/v1/address/${CONTRACT_ADDRESS}/tokenURI?args=["${tokenId}"]`,
        `https://api.sepolia.base.org/v1/address/${CONTRACT_ADDRESS}/tokenURI?args=[${tokenId}]`
      ];
      
      for (const endpoint of endpoints) {
        try {
          const result = await fetch(endpoint);
          const data = await result.json();
          if (data.result) {
            return data.result;
          }
        } catch (err) {
          console.warn(`Failed endpoint ${endpoint}:`, err);
        }
      }
      
      return null;
    } catch (err) {
      console.error('Error in fetchTokenURI:', err);
      return null;
    }
  }

  // Process NFT metadata from URI
  async function processNFTMetadata(tokenId: number, uri: string): Promise<NFT> {
    try {
      // Convert IPFS URI if needed
      let httpUri = uri;
      if (uri.startsWith('ipfs://')) {
        // Try multiple gateways
        httpUri = uri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
      }
      
      console.log(`Fetching metadata from: ${httpUri}`);
      
      // Fetch metadata
      const response = await fetch(httpUri);
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.status} ${response.statusText}`);
      }
      
      const metadata = await response.json();
      console.log(`Metadata for token ${tokenId}:`, metadata);
      
      // Convert image IPFS URI if present
      let imageUrl = metadata.image || '';
      if (imageUrl.startsWith('ipfs://')) {
        imageUrl = imageUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
      }
      
      // For NFTs without an image, use the default
      if (!imageUrl) {
        imageUrl = 'https://gateway.pinata.cloud/ipfs/QmZ4vLGb5KWQeqC3qJxQgjuV8GV1YBDwgdU4AJth3HVdEz';
      }
      
      return {
        id: tokenId.toString(),
        tokenId: tokenId.toString(),
        title: metadata.name || `Car #${tokenId}`,
        image: imageUrl,
        status: 'Owned',
        placa: metadata.placa || metadata.licensePlate || metadata.attributes?.find((attr: any) => attr.trait_type === 'Placa')?.value || ''
      };
    } catch (error) {
      console.error(`Error fetching metadata for token ${tokenId}:`, error);
      
      // Return a basic NFT object if metadata fetch fails
      return {
        id: tokenId.toString(),
        tokenId: tokenId.toString(),
        title: `Car #${tokenId}`,
        image: 'https://gateway.pinata.cloud/ipfs/QmZ4vLGb5KWQeqC3qJxQgjuV8GV1YBDwgdU4AJth3HVdEz',
        status: 'Owned',
        placa: ''
      };
    }
  }

  return { userNFTs, isLoading, error };
} 