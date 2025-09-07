
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function InvestorPage({ tokenContract, whitelistContract, currentUser }) {
  const [balance, setBalance] = useState("0");
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [status, setStatus] = useState("Investor Actions");

  // Transfer form state
  const [transferAddr, setTransferAddr] = useState("");
  const [transferAmt, setTransferAmt] = useState("");

  // Function to fetch data about the current user
  const fetchData = async () => {
    if (!tokenContract || !whitelistContract || !currentUser) return;

    try {
      // Check whitelist status
      const wlStatus = await whitelistContract.isWhitelisted(currentUser);
      setIsWhitelisted(wlStatus);

      // Get token balance
      const bal = await tokenContract.balanceOf(currentUser);
      // Format balance from Wei (18 decimals) back to Ether (standard units)
      setBalance(ethers.formatUnits(bal, 18));

    } catch (err) {
      console.error(err);
      setStatus("Error fetching data");
    }
  };

  // Run fetchData when the user connects or contracts load
  useEffect(() => {
    fetchData();
  }, [currentUser, tokenContract, whitelistContract]);


  // Handle Transfer Action
  const handleTransfer = async () => {
    if (!ethers.isAddress(transferAddr)) {
      setStatus("Error: Invalid receiving address");
      return;
    }

    try {
      setStatus("Processing Transfer Tx...");
      const formattedAmount = ethers.parseUnits(transferAmt, 18);
      const tx = await tokenContract.transfer(transferAddr, formattedAmount);
      await tx.wait();

      setStatus(`Success! Transferred ${transferAmt} tokens.`);
      fetchData(); // Refresh balance after transfer
      setTransferAddr("");
      setTransferAmt("");
    } catch (err) {
      console.error(err);
      // This error will trigger if the 'to' or 'from' address is not whitelisted!
      setStatus(`Error: ${err.reason || err.message}`);
    }
  };

  return (
    <div style={{ border: '1px solid green', padding: '10px', width: '45%' }}>
      <h2>Investor Portal</h2>
      <p>Your Status: <strong>{isWhitelisted ? "Whitelisted" : "Not Whitelisted"}</strong></p>
      <p>Your Token Balance: <strong>{balance} STKN</strong></p>
      <button onClick={fetchData}>Refresh Data</button>
      <hr />

      {/* Only show the transfer form if the user is whitelisted */}
      {isWhitelisted ? (
        <div>
          <h4>Transfer Tokens</h4>
          <input 
            type="text" 
            placeholder="Recipient Address (0x...)"
            value={transferAddr}
            onChange={(e) => setTransferAddr(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Amount (e.g., 50)"
            value={transferAmt}
            onChange={(e) => setTransferAmt(e.target.value)}
          />
          <button onClick={handleTransfer}>Transfer</button>
          <p style={{ background: '#f0f0f0', padding: '5px' }}>Status: {status}</p>
        </div>
      ) : (
        <p>You must be whitelisted by the Admin to transfer or receive tokens.</p>
      )}
    </div>
  );
}

export default InvestorPage;
