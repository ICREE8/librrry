# 🚗 CarP2P - Vehicle NFT Marketplace Smart Contracts

This project contains Solidity smart contracts for a decentralized marketplace for trading vehicles as NFTs:

- Mint NFTs representing vehicles with custom metadata
- Exchange NFTs via an Escrow contract for ERC-20 tokens
- Perfect foundation for decentralized marketplaces of physical assets (cars, motorcycles, etc.)

## 📦 Project Structure

```
carp2p/
├── contracts/             # Solidity smart contracts
│   ├── EscrowNFT.sol      # Escrow contract for NFT ↔ ERC20 exchange
│   └── VehicleNFT.sol     # ERC721 contract for vehicle representation
├── scripts/               # Deployment scripts
│   └── deploy.ts          # Script to deploy contracts
├── test/                  # Automated tests (Mocha + Chai)
│   └── Lock.ts            # Test examples
├── hardhat.config.ts      # Hardhat configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites

```bash
# Install dependencies
npm install
# or
pnpm install
```

### Environment Setup

Create a `.env` file based on the example below:

```
# Deployment
PRIVATE_KEY=your_private_key_here_without_0x_prefix

# Network URLs 
GOERLI_URL=https://eth-goerli.g.alchemy.com/v2/your-api-key
SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key

# API Keys for services
ETHERSCAN_API_KEY=your_etherscan_api_key
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key

# Gas reporting
REPORT_GAS=true
```

### 🔨 Compile Contracts

```bash
npm run compile
# or
npx hardhat compile
```

### 🧪 Run Tests

```bash
npm test
# or
npx hardhat test
```

### 🚀 Deploy to Local Network

```bash
# Start a local node
npm run node
# In a separate terminal
npm run deploy:local
```

### 🌐 Deploy to Testnet

```bash
npm run deploy:testnet
# or specify another network
npx hardhat run scripts/deploy.ts --network sepolia
```

## 🎯 Smart Contracts

### `VehicleNFT.sol`

An ERC721 contract that:
- Mints NFTs for vehicles with tokenURI
- Each NFT represents a vehicle with metadata (can be stored on IPFS)
- Includes owner-only functions for minting

### `EscrowNFT.sol`

A secure exchange contract that:
- Allows sellers to deposit NFTs
- Allows buyers to deposit ERC20 tokens
- Automatically releases assets when both parties fulfill their obligations

## 🧪 Tools & Libraries

- [Hardhat](https://hardhat.org/) - Ethereum development environment
- [Viem](https://viem.sh/) - TypeScript library for Ethereum interaction
- [OpenZeppelin](https://docs.openzeppelin.com/contracts/) - Secure smart contract libraries
- [TypeScript](https://www.typescriptlang.org/) - For type-safe development

## 📄 License

[MIT](LICENSE)
