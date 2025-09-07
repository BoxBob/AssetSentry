// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ITransferRule.sol";

/**
 * @title ComplianceRegistry
 * @dev Holds a list of all active rule modules. The Security Token queries this
 * contract to validate every transfer.
 */
contract ComplianceRegistry is Ownable {
    // Array of all active rule contracts
    ITransferRule[] public allRules;

    event RuleAdded(address indexed ruleContract);
    event RuleRemoved(address indexed ruleContract);

    constructor() Ownable(msg.sender) {}

    function addRule(address ruleAddress) public onlyOwner {
        allRules.push(ITransferRule(ruleAddress));
        emit RuleAdded(ruleAddress);
    }

    // Note: Removing rules from an array in Solidity is complex.
    // For a production system, you'd add a more robust removal function.

    /**
     * @dev This is the main check function called by the Token.
     * It loops through EVERY registered rule. If ANY rule fails, the transfer is rejected.
     */
    function checkRules(
        address from,
        address to,
        uint256 amount
    ) public view returns (bool success, bytes32 reason) {
        for (uint i = 0; i < allRules.length; i++) {
            (bool ruleSuccess, bytes32 ruleReason) = allRules[i].canTransfer(
                from,
                to,
                amount
            );

            if (!ruleSuccess) {
                // As soon as one rule fails, stop and return the failure reason.
                return (false, ruleReason);
            }
        }
        
        // If the loop finishes, all rules passed.
        return (true, 0x00);
    }
}
