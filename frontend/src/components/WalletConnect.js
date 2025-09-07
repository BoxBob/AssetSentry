
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// This component manages the wallet connection state
function WalletConnect({ setProvider, setSigner, setAccount }) {
  const [status, setStatus] = useState("Not Connected");
  const [connectedAddress, setConnectedAddress] = useState("");

  const connectWallet = async () => {
    if (window.ethereum == null) {
      setStatus("MetaMask not installed");
      return;
    }

    try {
      // Get the provider and request accounts.
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
            
      // Get the signer (the user account)
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Update state in the main App
      setProvider(provider);
      setSigner(signer);
      setAccount(address);

      // Update local state for display
      setConnectedAddress(address);
      setStatus("Connected");

    } catch (err) {
      console.error(err);
      setStatus("Connection failed");
    }
  };

  return (
    <div style={{ padding: '10px', background: '#eee' }}>
      <strong>Connection Status: {status}</strong>
      {connectedAddress ? (
        <p>Your Address: {connectedAddress}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

export default WalletConnect;
