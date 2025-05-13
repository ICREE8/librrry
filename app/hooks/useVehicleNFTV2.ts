import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';

// Define a type for the mint function parameters
type MintParams = {
  tokenMetadata: {
    uri: string;
  };
};

// Updated ABI with the new publicMintVehicleNFT function
const VehicleNFT_V2 = {
  abi: [
    {
      inputs: [
        { name: 'tokenURI', type: 'string' }
      ],
      name: 'publicMintVehicleNFT',
      outputs: [{ name: '', type: 'uint256' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'tokenURI', type: 'string' }
      ],
      name: 'mintVehicleNFT',
      outputs: [{ name: '', type: 'uint256' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { name: 'minter', type: 'address' }
      ],
      name: 'authorizeMinter',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { name: 'minter', type: 'address' }
      ],
      name: 'isMinterAuthorized',
      outputs: [{ name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'to', type: 'address' },
        { indexed: false, name: 'tokenId', type: 'uint256' },
        { indexed: false, name: 'tokenURI', type: 'string' }
      ],
      name: 'VehicleNFTMinted',
      type: 'event',
    },
  ],
  contractName: 'VehicleNFT_V2',
};

// Contract Information
const CONTRACT_ADDRESS = '0x1C4cc777E309c6403Ce82e2332887470773A8a74';
const CONTRACT_OWNER = '0x3f9b734394FC1E96afe9523c69d30D227dF4ffca';

export function useVehicleNFTV2() {
  const contractConfig = {
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: VehicleNFT_V2.abi,
  };

  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const isLoading = isPending || isConfirming;
  
  // Check if the connected wallet is the contract owner
  const isContractOwner = (): boolean => {
    if (!address) return false;
    return address.toLowerCase() === CONTRACT_OWNER.toLowerCase();
  };

  // Smart mint function that tries both methods
  const smartMintVehicleNFT = async (params: MintParams) => {
    if (!address) throw new Error('Wallet not connected');
    
    try {
      // Log all relevant information for debugging
      console.log('Smart minting with:', {
        contractAddress: CONTRACT_ADDRESS,
        walletAddress: address,
        isOwner: isContractOwner(),
        tokenURI: params.tokenMetadata.uri
      });
      
      // If the connected wallet is the contract owner, use the owner function
      if (isContractOwner()) {
        console.log('Using owner minting method...');
        return writeContract({
          ...contractConfig,
          functionName: 'mintVehicleNFT',
          args: [address, params.tokenMetadata.uri]
        });
      }
      
      // Otherwise, try the public mint function
      console.log('Using public minting method...');
      return writeContract({
        ...contractConfig,
        functionName: 'publicMintVehicleNFT',
        args: [params.tokenMetadata.uri]
      });
    } catch (err) {
      console.error('Error during smart minting:', err);
      throw err;
    }
  };

  // Public mint function that doesn't require owner privileges
  const publicMintVehicleNFT = async (params: MintParams) => {
    if (!address) throw new Error('Wallet not connected');
    
    try {
      console.log('Public minting with:', {
        contractAddress: CONTRACT_ADDRESS,
        walletAddress: address,
        tokenURI: params.tokenMetadata.uri
      });
      
      return writeContract({
        ...contractConfig,
        functionName: 'publicMintVehicleNFT',
        args: [params.tokenMetadata.uri]
      });
    } catch (err) {
      console.error('Error during public minting:', err);
      throw err;
    }
  };

  // Original mint function (owner only)
  const mintVehicleNFT = async (params: MintParams) => {
    if (!address) throw new Error('Wallet not connected');
    if (!isContractOwner()) {
      console.warn('Non-owner wallet attempting to use owner-only minting function');
    }
    
    try {
      console.log('Owner minting with:', {
        contractAddress: CONTRACT_ADDRESS,
        walletAddress: address,
        recipientAddress: address,
        isOwner: isContractOwner(),
        tokenURI: params.tokenMetadata.uri
      });
      
      return writeContract({
        ...contractConfig,
        functionName: 'mintVehicleNFT',
        args: [address, params.tokenMetadata.uri]
      });
    } catch (err) {
      console.error('Error during owner minting:', err);
      throw err;
    }
  };

  // Function to authorize a minter (owner only)
  const authorizeMinter = async (minterAddress: `0x${string}`) => {
    if (!address) throw new Error('Wallet not connected');
    if (!isContractOwner()) throw new Error('Only the contract owner can authorize minters');
    
    try {
      console.log(`Authorizing minter address: ${minterAddress}`);
      return writeContract({
        ...contractConfig,
        functionName: 'authorizeMinter',
        args: [minterAddress]
      });
    } catch (err) {
      console.error('Error authorizing minter:', err);
      throw err;
    }
  };

  // Get the transaction URL based on network
  const getTransactionUrl = () => {
    if (!hash) return null;
    // We're using Base Sepolia testnet
    return `https://sepolia.basescan.org/tx/${hash}`;
  };

  return { 
    mintVehicleNFT,
    publicMintVehicleNFT,
    smartMintVehicleNFT,
    authorizeMinter,
    isContractOwner,
    isLoading, 
    isSuccess, 
    error,
    transactionHash: hash,
    transactionUrl: getTransactionUrl(),
    contractAddress: CONTRACT_ADDRESS,
    ownerAddress: CONTRACT_OWNER
  };
} 