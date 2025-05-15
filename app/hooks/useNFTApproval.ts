// app/hooks/useNFTApproval.ts  
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';  
import VehicleNFTJson from '@/app/src/contracts/VehicleNFT.json';  
  
// Use the correct NFT contract address from your codebase  
const CONTRACT_ADDRESS = '0x1C4cc777E309c6403Ce82e2332887470773A8a74';  
  
export function useNFTApproval() {  
  const contractConfig = {  
    address: CONTRACT_ADDRESS as `0x${string}`,  
    abi: VehicleNFTJson.abi,  
  };  
  
  const { address } = useAccount();  
  const { writeContract, data: hash, isPending, error } = useWriteContract();  
    
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({  
    hash,  
  });  
  
  const isLoading = isPending || isConfirming;  
  
  // Function to approve an address to transfer a specific NFT  
  const approveNFT = async (  
    spender: string,  
    tokenId: number  
  ) => {  
    if (!address) throw new Error('Wallet not connected');  
      
    try {  
      return writeContract({  
        ...contractConfig,  
        functionName: 'approve',  
        args: [spender, BigInt(tokenId)]  
      });  
    } catch (err) {  
      console.error('Error approving NFT transfer:', err);  
      throw err;  
    }  
  };  
  
  return {  
    approveNFT,  
    isLoading,  
    isSuccess,  
    error,  
    transactionHash: hash  
  };  
}