import { useWriteContract } from 'wagmi';
import addresses from '../src/contracts/addresses.json';

// Define proper types for the function arguments
type VehicleAttributes = {
  brand: string;
  model: string;
  year: number;
};

type TokenMetadata = {
  uri: string;
};

// Define a type for the mint function parameters
type MintParams = {
  vehicleData: VehicleAttributes;
  tokenMetadata: TokenMetadata;
};

// Define the transaction result type
type TransactionResult = {
  hash: `0x${string}`;
  [key: string]: any;
};

const VehicleNFT = {
  abi: [
    {
      inputs: [
        { name: 'vehicleData', type: 'tuple', components: [
          { name: 'brand', type: 'string' },
          { name: 'model', type: 'string' },
          { name: 'year', type: 'uint256' }
          // Add other components that match your contract
        ]},
        { name: 'tokenURI', type: 'string' }
      ],
      name: 'mintVehicleNFT',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
  _format: '...',
  contractName: 'VehicleNFT',
  sourceName: '...',
};

export function useVehicleNFT() {
  const contractConfig = {
    address: addresses.VehicleNFT as `0x${string}`,
    abi: VehicleNFT.abi,
  };

  const { writeContract, isSuccess, error, status } = useWriteContract();

  const isLoading = status === 'pending';

  const mintVehicleNFT = async (params: MintParams) => {
    try {
      // Simply return the result without any type assertions
      return writeContract({
        ...contractConfig,
        functionName: 'mintVehicleNFT',
        args: [params.vehicleData, params.tokenMetadata.uri]
      });
    } catch (err) {
      console.error('Error minting NFT:', err);
      throw err;
    }
  };

  return { mintVehicleNFT, isLoading, isSuccess, error };
}