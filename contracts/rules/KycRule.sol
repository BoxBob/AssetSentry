// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/ITransferRule.sol";

/**
 * @title KycRule
 * @dev Implements ITransferRule to check if both sender and receiver are KYC-approved.
 */
contract KycRule is ITransferRule, Ownable {
    // KYC-Approved addresses
    mapping(address => bool) private _isVerified;

    // Standard ERC-1400 reason codes (as an example)
    bytes32 constant internal REASON_SUCCESS = 0x00; // Success
    bytes32 constant internal REASON_SENDER_NOT_VERIFIED = 0x01;
    bytes32 constant internal REASON_RECEIVER_NOT_VERIFIED = 0x02;

    constructor() Ownable(msg.sender) {}

    function isVerified(address account) public view returns (bool) {
        return _isVerified[account];
    }

    function addKycAddress(address account) public onlyOwner {
        require(!_isVerified[account], "Address already verified");
        _isVerified[account] = true;
    }

    /**
     * @dev The required function from ITransferRule.
     * Checks compliance for a transfer.
     */
    function canTransfer(
        address from,
        address to,
        uint256 amount
    ) external view override returns (bool success, bytes32 reason) {
        // Allow minting (from address 0) and burning (to address 0)
        // We only check compliance for wallet-to-wallet transfers.
        
        if (from == address(0) || to == address(0)) {
            return (true, REASON_SUCCESS);
        }

        if (!_isVerified[from]) {
            return (false, REASON_SENDER_NOT_VERIFIED);
        }

        if (!_isVerified[to]) {
            return (false, REASON_RECEIVER_NOT_VERIFIED);
        }

        return (true, REASON_SUCCESS);
    }
}
