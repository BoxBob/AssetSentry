

import React, { useState } from 'react';
import { ethers } from 'ethers';

// Import ALL FOUR ABIs
import TokenABI from './artifacts/contracts/AdvancedSecurityToken.sol/AdvancedSecurityToken.json';
import RegistryABI from './artifacts/contracts/ComplianceRegistry.sol/ComplianceRegistry.json';
import KycRuleABI from './artifacts/contracts/rules/KycRule.sol/KycRule.json';
import LockupRuleABI from './artifacts/contracts/rules/LockupRule.sol/LockupRule.json';

import WalletConnect from './components/WalletConnect';
import AdminPage from './pages/AdminPage';
import InvestorPage from './pages/InvestorPage';

// --- !!! UPDATE ALL ADDRESSES AFTER DEPLOYMENT !!! ---
const TOKEN_ADDRESS = "0x...YOUR_TOKEN_ADDRESS";
const REGISTRY_ADDRESS = "0x...YOUR_REGISTRY_ADDRESS";
const KYC_RULE_ADDRESS = "0x...YOUR_KYC_RULE_ADDRESS";
const LOCKUP_RULE_ADDRESS = "0x...YOUR_LOCKUP_RULE_ADDRESS";

function App() {
  // Blockchain connection state
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
    
  // Contract instances - We need all four!
  const [tokenContract, setTokenContract] = useState(null);
  const [registryContract, setRegistryContract] = useState(null);
  const [kycContract, setKycContract] = useState(null);
  const [lockupContract, setLockupContract] = useState(null);

  const setupContracts = (currentSigner) => {
    if (!currentSigner) return;

    setTokenContract(new ethers.Contract(TOKEN_ADDRESS, TokenABI.abi, currentSigner));
    setRegistryContract(new ethers.Contract(REGISTRY_ADDRESS, RegistryABI.abi, currentSigner));
    setKycContract(new ethers.Contract(KYC_RULE_ADDRESS, KycRuleABI.abi, currentSigner));
    setLockupContract(new ethers.Contract(LOCKUP_RULE_ADDRESS, LockupRuleABI.abi, currentSigner));
  };

  const handleSetSigner = (newSigner) => {
    setSigner(newSigner);
    setAccount(newSigner.address); // Assuming signer has address (use provider to get it if not)
    setupContracts(newSigner);
  };

  // This logic snippet assumes you get the signer address correctly into 'account'
  // Simplified WalletConnect may need tweaking to pass the address back up.

  return (
    <div className="App">
      <h1>Advanced Security Token Portal (Modular)</h1>
      <WalletConnect setSigner={handleSetSigner} setAccount={setAccount} /> {/* Simplified props */}
      <hr />
            
      {tokenContract && kycContract && lockupContract ? (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <AdminPage 
            kycContract={kycContract} 
            tokenContract={tokenContract} 
            lockupContract={lockupContract}
          />
          <InvestorPage 
            tokenContract={tokenContract} 
            kycContract={kycContract} // Pass the KYC contract for status check
            currentUser={account} 
          />
        </div>
      ) : (
        <p>Please connect your wallet.</p>
      )}
    </div>
  );
}

export default App;
