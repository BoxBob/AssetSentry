

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function AdminPage({ kycContract, tokenContract, lockupContract }) {
  const [wlAddress, setWlAddress] = useState("");
  const [mintAddress, setMintAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [lockupDate, setLockupDate] = useState("");
  const [currentLockup, setCurrentLockup] = useState("");
  const [status, setStatus] = useState("Admin Actions");

  // Fetch the current lockup date on load
  useEffect(() => {
    const fetchLockup = async () => {
      if (lockupContract) {
        const timestamp = await lockupContract.lockupEndDate();
        const date = new Date(Number(timestamp) * 1000);
        setCurrentLockup(date.toLocaleString());
      }
    };
    fetchLockup();
  }, [lockupContract]);

  // Whitelist Action - talks to the KYC Contract
  const handleAddKyc = async () => {
    setStatus("Processing KYC Tx...");
    try {
      const tx = await kycContract.addKycAddress(wlAddress);
      await tx.wait();
      setStatus(`Success: ${wlAddress} added to KYC list.`);
    } catch (err) {
      setStatus(`Error: ${err.reason || err.message}`);
    }
  };

  // Minting Action - talks to the Token Contract
  const handleMint = async () => {
     setStatus("Processing Mint Tx...");
    try {
      const formattedAmount = ethers.parseUnits(mintAmount, 18);
      const tx = await tokenContract.mint(mintAddress, formattedAmount);
      await tx.wait();
      setStatus(`Success: Minted ${mintAmount} tokens to ${mintAddress}`);
    } catch (err) {
      setStatus(`Error: ${err.reason || err.message}`);
    }
  };

  // New Action - talks to the Lockup Contract
  const handleSetLockup = async () => {
    setStatus("Updating Lockup Date...");
    try {
      // Convert user-friendly date string to Unix timestamp
      const newTimestamp = Math.floor(new Date(lockupDate).getTime() / 1000);
      if (isNaN(newTimestamp)) {
        setStatus("Error: Invalid date format");
        return;
      }

      const tx = await lockupContract.setLockupEndDate(newTimestamp);
      await tx.wait();
      setStatus(`Success: Lockup date updated.`);
      // Refresh the display
      const timestamp = await lockupContract.lockupEndDate();
      const date = new Date(Number(timestamp) * 1000);
      setCurrentLockup(date.toLocaleString());
    } catch (err) {
      setStatus(`Error: ${err.reason || err.message}`);
    }
  };

  return (
    <div style={{ border: '1px solid blue', padding: '10px', width: '45%' }}>
      <h2>Modular Admin Panel</h2>
      <p style={{ background: '#f0f0f0', padding: '5px' }}>Status: {status}</p>

      <div>
        <h4>1. Add to KYC (KycRule Contract)</h4>
        <input 
          type="text" 
          placeholder="Address to verify (0x...)"
          value={wlAddress}
          onChange={(e) => setWlAddress(e.target.value)}
        />
        <button onClick={handleAddKyc}>Add KYC</button>
      </div>
      <hr />
      <div>
        <h4>2. Mint Tokens (Token Contract)</h4>
        {/* Minting Inputs */}
        <input type="text" placeholder="Recipient Address" value={mintAddress} onChange={(e) => setMintAddress(e.target.value)} />
        <input type="text" placeholder="Amount" value={mintAmount} onChange={(e) => setMintAmount(e.target.value)} />
        <button onClick={handleMint}>Mint Tokens</button>
      </div>
      <hr />
      <div>
        <h4>3. Manage Lockup (LockupRule Contract)</h4>
        <p>Current Lockup Ends: <strong>{currentLockup}</strong></p>
        <input 
          type="datetime-local" 
          value={lockupDate}
          onChange={(e) => setLockupDate(e.target.value)}
        />
        <button onClick={handleSetLockup}>Update Lockup</button>
      </div>
    </div>
  );
}

export default AdminPage;
