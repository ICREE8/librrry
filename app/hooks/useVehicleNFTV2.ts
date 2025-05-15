import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import EscrowNFTJson from '@/app/src/contracts/EscrowNFT.json';
import VehicleNFT_V2 from '@/app/src/contracts/addresses.json';

// Contract address from addresses.json (assuming it contains the address)
const CONTRACT_ADDRESS = '0x1C4cc777E309c6403Ce82e2332887470773A8a74'; // Adjust based on your addresses.json structure

export function useVehicleNFTV2() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const isLoading = isPending || isConfirming;

  const contractConfig = {
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: EscrowNFTJson.abi,
  };

  // Function to check if the user is the contract owner
  const isContractOwner = () => {
    const CONTRACT_OWNER = '0x3f9b734394FC1E96afe9523c69d30D227dF4ffca'; // Replace with actual owner address
    if (!address) return false;
    return address.toLowerCase() === CONTRACT_OWNER.toLowerCase();
  };

  // Function to create escrow
  const createEscrow = async (
    buyer: string,
    nftAddress: string,
    tokenId: number,
    paymentToken: string,
    price: string
  ) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      return writeContract({
        ...contractConfig,
        functionName: 'createEscrow',
        args: [buyer, nftAddress, BigInt(tokenId), paymentToken, ethers.utils.parseEther(price)],
      });
    } catch (err) {
      console.error('Error creating escrow:', err);
      throw err;
    }
  };

  // Function to deposit NFT
  const depositNFT = async (escrowId: number) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      return writeContract({
        ...contractConfig,
        functionName: 'depositNFT',
        args: [BigInt(escrowId)],
      });
    } catch (err) {
      console.error('Error depositing NFT:', err);
      throw err;
    }
  };

  // Function to deposit payment
  const depositPayment = async (escrowId: number, value?: string) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      return writeContract({
        ...contractConfig,
        functionName: 'depositPayment',
        args: [BigInt(escrowId)],
        value: value ? ethers.utils.parseEther(value) : undefined,
      });
    } catch (err) {
      console.error('Error depositing payment:', err);
      throw err;
    }
  };

  // Get the transaction URL based on network (Base Sepolia)
  const getTransactionUrl = () => {
    if (!hash) return null;
    return `https://sepolia.basescan.org/tx/${hash}`;
  };

  return {
    createEscrow,
    depositNFT,
    depositPayment,
    isLoading,
    isSuccess,
    error,
    transactionHash: hash,
    transactionUrl: getTransactionUrl(),
    isContractOwner, // Exported for Navbar usage
  };
}