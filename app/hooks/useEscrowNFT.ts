// File: app/hooks/useEscrowNFT.ts  
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';  
import EscrowNFTJson from '@/app/src/contracts/EscrowNFT.json';  
  
// Replace with your actual deployed address  
const CONTRACT_ADDRESS = '0xYourEscrowContractAddress';  
  
export function useEscrowNFT() {  
  const contractConfig = {  
    address: CONTRACT_ADDRESS as `0x${string}`,  
    abi: EscrowNFTJson.abi,  
  };  
  
  const { address } = useAccount();  
  const { writeContract, data: hash, isPending, error } = useWriteContract();  
    
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({  
    hash,  
  });  
  
  const isLoading = isPending || isConfirming;  
  
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
        args: [buyer, nftAddress, BigInt(tokenId), paymentToken, BigInt(price)]  
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
        args: [BigInt(escrowId)]  
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
        value: value ? BigInt(value) : undefined  
      });  
    } catch (err) {  
      console.error('Error depositing payment:', err);  
      throw err;  
    }  
  };  
  
  return {  
    createEscrow,  
    depositNFT,  
    depositPayment,  
    isLoading,  
    isSuccess,  
    error,  
    transactionHash: hash  
  };  
}