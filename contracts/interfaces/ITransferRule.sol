// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ITransferRule
 * @dev Interface that all modular compliance rules must implement.
 * This allows a central registry to check multiple rules.
 */
interface ITransferRule {
    /**
     * @dev Checks if a token transfer is valid according to this specific rule.
     * @return success True if the transfer is allowed.
     * @return reason A bytes32 code explaining the reason for failure (or success).
     */
    function canTransfer(
        address from,
        address to,
        uint256 amount
    ) external view returns (bool success, bytes32 reason);
}
