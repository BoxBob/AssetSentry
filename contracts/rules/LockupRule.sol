// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/ITransferRule.sol";

/**
 * @title LockupRule
 * @dev Implements ITransferRule to block transfers before a set lockup timestamp.
 */
contract LockupRule is ITransferRule, Ownable {
    uint256 public lockupEndDate; // Unix timestamp

    bytes32 constant internal REASON_SUCCESS = 0x00;
    bytes32 constant internal REASON_IN_LOCKUP_PERIOD = 0x03;

    constructor(uint256 _endDate) Ownable(msg.sender) {
        lockupEndDate = _endDate;
    }

    function setLockupEndDate(uint256 _newEndDate) public onlyOwner {
        lockupEndDate = _newEndDate;
    }

    /**
     * @dev The required function from ITransferRule.
     */
    function canTransfer(
        address from,
        address to,
        uint256 amount
    ) external view override returns (bool success, bytes32 reason) {
        // Minting (from address 0) is ALWAYS allowed, even during lockup
        // This is how the issuer distributes tokens.
        if (from == address(0)) {
            return (true, REASON_SUCCESS);
        }

        // If the current time is BEFORE the end date, block the transfer.
        if (block.timestamp < lockupEndDate) {
            return (false, REASON_IN_LOCKUP_PERIOD);
        }

        // Lockup has expired, allow transfer.
        return (true, REASON_SUCCESS);
    }
}
