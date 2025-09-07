
import React, { useState } from 'react';
import { ethers } from 'ethers';

// Import the contract ABIs (Application Binary Interface)
import WhitelistABI from './artifacts/contracts/Whitelist.sol/Whitelist.json';
import SecurityTokenABI from './artifacts/contracts/SecurityToken.sol/SecurityToken.json';

// Import our components
import WalletConnect from './components/WalletConnect';
import AdminPage from './pages/AdminPage';
import InvestorPage from './pages/InvestorPage';

// --- !!! UPDATE THESE ADDRESSES AFTER YOU DEPLOY !!! ---
const WHITELIST_CONTRACT_ADDRESS = "0x...YOUR_WHITELIST_ADDRESS";
const TOKEN_CONTRACT_ADDRESS = "0x...YOUR_TOKEN_ADDRESS";

function App() {
  // Blockchain connection state
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
    
  // Contract instances
  const [whitelistContract, setWhitelistContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);

  // This function sets up the contract instances once the signer is available
  const setupContracts = (currentSigner) => {
    if (!currentSigner) return;

    const wlContract = new ethers.Contract(WHITELIST_CONTRACT_ADDRESS, WhitelistABI.abi, currentSigner);
    const tkContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, SecurityTokenABI.abi, currentSigner);

    setWhitelistContract(wlContract);
    setTokenContract(tkContract);
  };

  // We pass 'setSigner' to WalletConnect, and when it changes, we trigger setupContracts
  const handleSetSigner = (newSigner) => {
    setSigner(newSigner);
    setupContracts(newSigner);
  };

  return (
    <div className="App">
      <h1>Security Token (TokenF Clone) Portal</h1>
      <WalletConnect 
        setProvider={setProvider} 
        setSigner={handleSetSigner} 
        setAccount={setAccount} 
      />
      <hr />
            
      {/* We only render the pages if contracts are loaded */}
      {whitelistContract && tokenContract ? (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <AdminPage 
            whitelistContract={whitelistContract} 
            tokenContract={tokenContract} 
          />
          <InvestorPage 
            tokenContract={tokenContract} 
            whitelistContract={whitelistContract} 
            currentUser={account} 
          />
        </div>
      ) : (
        <p>Please connect your wallet to interact with the application.</p>
      )}
    </div>
  );
}

export default App;
