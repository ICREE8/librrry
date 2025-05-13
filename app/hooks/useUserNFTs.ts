import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';

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
      if (!isConnected || !address || !totalSupply) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Create batch requests to check ownership for all token IDs
        const totalMinted = Number(totalSupply);
        
        // Array to collect NFTs
        const nftsFound: NFT[] = [];
        
        // We'll check each token ID individually to avoid the complexity of batch calls
        for (let tokenId = 1; tokenId <= totalMinted; tokenId++) {
          try {
            // Check if the current user owns this token
            const ownerAddress = await fetchOwnerOf(tokenId);
            
            if (ownerAddress && ownerAddress.toLowerCase() === address.toLowerCase()) {
              // Fetch token URI
              const uri = await fetchTokenURI(tokenId);
              
              if (uri) {
                // Process the token metadata
                const nft = await processNFTMetadata(tokenId, uri);
                nftsFound.push(nft);
              }
            }
          } catch (err) {
            console.error(`Error checking token ${tokenId}:`, err);
            // Continue with next token
          }
        }
        
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
      const result = await fetch(`https://sepolia.base.org/v1/address/${CONTRACT_ADDRESS}/ownerOf?args=["${tokenId}"]`);
      const data = await result.json();
      return data.result;
    } catch (err) {
      console.error('Error fetching owner:', err);
      return null;
    }
  }

  // Helper function to fetch token URI
  async function fetchTokenURI(tokenId: number): Promise<string | null> {
    try {
      const result = await fetch(`https://sepolia.base.org/v1/address/${CONTRACT_ADDRESS}/tokenURI?args=["${tokenId}"]`);
      const data = await result.json();
      return data.result;
    } catch (err) {
      console.error('Error fetching token URI:', err);
      return null;
    }
  }

  // Process NFT metadata from URI
  async function processNFTMetadata(tokenId: number, uri: string): Promise<NFT> {
    try {
      // Convert IPFS URI if needed
      const httpUri = uri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
      
      // Fetch metadata
      const response = await fetch(httpUri);
      const metadata = await response.json();
      
      // Convert image IPFS URI if present
      let imageUrl = metadata.image || '';
      if (imageUrl.startsWith('ipfs://')) {
        imageUrl = imageUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
      }
      
      return {
        id: tokenId.toString(),
        tokenId: tokenId.toString(),
        title: metadata.name || `Car #${tokenId}`,
        image: imageUrl,
        status: 'Owned',
        placa: metadata.placa || ''
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