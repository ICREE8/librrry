
# 🚗 VehicleNFT + Escrow Smart Contract Project

Este repositorio contiene un proyecto basado en **Hardhat + TypeScript** que permite:

- Mintear NFTs representando vehículos con metadatos personalizados.
- Intercambiarlos mediante un contrato Escrow entre vendedor y comprador a cambio de tokens ERC-20.
- Ideal para marketplaces descentralizados de activos físicos (autos, motos, etc).

---

## 📦 Estructura del proyecto

```
escrow-nft-base/
├── contracts/             # Contratos Solidity
│   ├── EscrowNFT.sol      # Escrow para intercambio NFT ↔ ERC20
│   └── VehicleNFT.sol     # Contrato ERC721 para representar vehículos
├── scripts/               # Scripts de despliegue
├── test/                  # Tests automatizados (Mocha + Chai)
├── hardhat.config.ts      # Configuración de Hardhat
└── README.md
```

---

## 🚀 Uso rápido

### 🔨 Compilar contratos

```bash
npx hardhat compile
```

### 🧪 Ejecutar tests

```bash
npx hardhat test
```

### 🧠 Desplegar a red local o testnet

```bash
npx hardhat run scripts/deploy.ts --network goerli
```

*Configura tus redes en `hardhat.config.ts` usando `.env` si es necesario.*

---

## 🎯 Contratos incluidos

### `VehicleNFT.sol`

Contrato ERC721 que permite:

- Mintear NFTs de vehículos con `tokenURI`.
- Cada NFT representa un vehículo con metadatos externos (ej: en IPFS).

### `EscrowNFT.sol`

Contrato de intercambio seguro que:

- Permite al vendedor depositar un NFT.
- El comprador deposita tokens ERC20.
- El contrato libera automáticamente el NFT y los tokens cuando ambas partes cumplen.

---

## 🧪 Herramientas utilizadas

- [Hardhat](https://hardhat.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Remix IDE](https://remix.ethereum.org/) (opcional para pruebas rápidas)
- [ethers.js](https://docs.ethers.org/)

---

## ✍️ Autor

Creado por [Asymmetric Frequency](https://github.com/AsymmetricFrequency)/ Ethereum cali  – soluciones blockchain para activos reales.

---

## 📄 Licencia

[MIT](LICENSE)
