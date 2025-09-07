
import React, { useState } from 'react';
import { ethers } from 'ethers';

function AdminPage({ whitelistContract, tokenContract }) {
  const [wlAddress, setWlAddress] = useState("");
  const [mintAddress, setMintAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [status, setStatus] = useState("Admin Actions");

  // Whitelist Action
  const handleWhitelist = async () => {
    if (!ethers.isAddress(wlAddress)) {
      setStatus("Error: Invalid address for whitelist");
      return;
    }
    try {
      setStatus("Processing Whitelist Tx...");
      const tx = await whitelistContract.addAddress(wlAddress);
      await tx.wait(); // Wait for the transaction to be mined
      setStatus(`Success: ${wlAddress} has been whitelisted!`);
      setWlAddress("");
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.reason || err.message}`);
    }
  };

  // Minting Action
  const handleMint = async () => {
     if (!ethers.isAddress(mintAddress)) {
      setStatus("Error: Invalid address for minting");
      return;
    }
    try {
      setStatus("Processing Mint Tx...");
      // We must convert the token amount to the correct decimal format (18 decimals for ERC20)
      const formattedAmount = ethers.parseUnits(mintAmount, 18);

      const tx = await tokenContract.mint(mintAddress, formattedAmount);
      await tx.wait();
      setStatus(`Success: Minted ${mintAmount} tokens to ${mintAddress}`);
      setMintAddress("");
      setMintAmount("");
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.reason || err.message}`);
    }
  };

  return (
    <div style={{ border: '1px solid blue', padding: '10px', width: '45%' }}>
      <h2>Admin Panel (Owner Only)</h2>
      <p style={{ background: '#f0f0f0', padding: '5px' }}>Status: {status}</p>

      <div>
        <h4>1. Whitelist Address</h4>
        <input 
          type="text" 
          placeholder="Address to whitelist (0x...)"
          value={wlAddress}
          onChange={(e) => setWlAddress(e.target.value)}
        />
        <button onClick={handleWhitelist}>Whitelist</button>
      </div>
      <hr />
      <div>
        <h4>2. Mint New Tokens</h4>
        <input 
          type="text" 
          placeholder="Address to receive tokens (0x...)"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Amount (e.g., 100)"
          value={mintAmount}
          onChange={(e) => setMintAmount(e.target.value)}
        />
        <button onClick={handleMint}>Mint Tokens</button>
      </div>
    </div>
  );
}

export default AdminPage;
