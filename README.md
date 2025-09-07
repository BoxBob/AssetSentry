# AssetSentry: Modular Security Token Platform

## Overview
AssetSentry is a full-stack blockchain application for managing compliant security tokens. It features modular smart contracts for compliance, a React DApp frontend, and Hardhat for development and deployment.

## Features
- **Modular Compliance:** Add or remove compliance rules (KYC, lockup, etc.) without changing the token contract.
- **Admin Portal:** Whitelist investors, mint tokens, and manage lockup periods.
- **Investor Portal:** Check balance, whitelist status, and transfer tokens (if compliant).
- **Modern Stack:** Solidity, Hardhat, Ethers.js, React.

## Directory Structure
```
AssetSentry/
├── contracts/
│   ├── interfaces/
│   │   └── ITransferRule.sol
│   ├── rules/
│   │   ├── KycRule.sol
│   │   └── LockupRule.sol
│   ├── ComplianceRegistry.sol
│   └── AdvancedSecurityToken.sol
├── scripts/
│   ├── deploy.js
│   └── deploy-advanced.js
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── artifacts/
│       ├── components/
│       │   └── WalletConnect.js
│       ├── pages/
│       │   ├── AdminPage.js
│       │   └── InvestorPage.js
│       └── App.js
└── README.md
```

## Smart Contracts
- **ITransferRule.sol:** Interface for compliance rule modules.
- **KycRule.sol:** KYC/AML compliance (whitelisting).
- **LockupRule.sol:** Time-based lockup compliance.
- **ComplianceRegistry.sol:** Orchestrates all rules, checks compliance for transfers.
- **AdvancedSecurityToken.sol:** ERC20 token that delegates compliance checks to the registry.

## Deployment
1. **Install dependencies:**
   - `npm install @openzeppelin/contracts`
   - `npm install --save-dev hardhat`
2. **Compile contracts:**
   - `npx hardhat compile`
3. **Deploy contracts:**
   - Basic: `npx hardhat run scripts/deploy.js`
   - Advanced: `npx hardhat run scripts/deploy-advanced.js`
4. **Copy ABIs:**
   - Copy all contract JSON files from `artifacts/` to `frontend/src/artifacts/`
5. **Update frontend addresses:**
   - Edit `frontend/src/App.js` with deployed contract addresses.

## Frontend (React DApp)
- **WalletConnect.js:** Connects MetaMask wallet.
- **App.js:** Holds contract addresses, manages state, routes pages.
- **AdminPage.js:** Admin actions (whitelist, mint, lockup management).
- **InvestorPage.js:** Investor actions (check status, transfer tokens).

### Running the Frontend
1. `cd frontend`
2. `npm install`
3. `npm start`

## Usage
- **Admin:**
  - Connect wallet, whitelist addresses, mint tokens, set lockup date.
- **Investor:**
  - Connect wallet, check KYC status, transfer tokens if compliant.

## Extending Compliance
- Add new rule contracts in `contracts/rules/` implementing `ITransferRule`.
- Register new rules in `ComplianceRegistry` via the admin portal or deployment script.

## License
MIT

## Authors
- BoxBob
- GitHub Copilot
