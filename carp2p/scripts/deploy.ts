import { createPublicClient, http, createWalletClient, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { hardhat } from 'viem/chains';

// Import contract factories when using hardhat-viem
import { vehicleNFTDeployment, vehicleNFT } from '../artifacts/contracts/VehicleNFT.sol';
import { escrowNFTDeployment, escrowNFT } from '../artifacts/contracts/EscrowNFT.sol';

async function main() {
  console.log("Deploying contracts with Viem...");

  // You can use environment variables for private keys in production
  const privateKey = process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Default Hardhat account
  const account = privateKeyToAccount(privateKey);

  // Create a client instance to deploy the contracts
  const client = createWalletClient({
    account,
    chain: hardhat,
    transport: http()
  });

  // Deploy VehicleNFT
  console.log("Deploying VehicleNFT...");
  const vehicleNFTHash = await client.deployContract({
    ...vehicleNFTDeployment,
    args: []
  });
  
  console.log(`VehicleNFT deployed to: ${vehicleNFTHash}`);

  // Deploy EscrowNFT (assumes it takes a VehicleNFT address as a parameter)
  console.log("Deploying EscrowNFT...");
  const escrowNFTHash = await client.deployContract({
    ...escrowNFTDeployment,
    args: [vehicleNFTHash]
  });
  
  console.log(`EscrowNFT deployed to: ${escrowNFTHash}`);

  console.log("Deployment completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 