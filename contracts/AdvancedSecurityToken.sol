// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ComplianceRegistry.sol"; // Import the REGISTRY, not any specific rule

/**
 * @title AdvancedSecurityToken
 * @dev This token only knows about ONE contract: the ComplianceRegistry.
 * It outsources all compliance checks to that registry.
 */
contract AdvancedSecurityToken is ERC20, Ownable {
    
    ComplianceRegistry public immutable registry;

    constructor(
        address registryAddress
    ) ERC20("Advanced Security Token", "AST") Ownable(msg.sender) {
        registry = ComplianceRegistry(registryAddress);
    }

    /**
     * @dev This hook is the heart of the compliance logic.
     * It calls the registry to validate the transfer.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);

        // Don't check rules for pure mint/burn operations
        if (from == address(0) || to == address(0)) {
            return;
        }

        // Ask the Registry to check all its rules
        (bool success, bytes32 reason) = registry.checkRules(from, to, amount);
        
        // Use a generic error message, appending the reason code.
        // In a full ERC-1400 setup, this reason code would be standardized.
        require(success, string(abi.encodePacked("Compliance failure: ", reason)));
    }

    /**
     * @dev Creates (mints) new tokens. Only callable by the owner.
     * Note: Minting (from=0) bypasses the compliance check in _beforeTokenTransfer.
     * However, the RECIPIENT's KYC status is checked by the KycRule itself
     * during their *next* transfer (when they become the 'from' address).
     *
     * A more robust system might even check registry.checkRules(address(0), to, amount)
     * inside the mint function itself, if the rules are designed to handle it.
     * Our current KycRule allows this, as it passes transfers from address(0).
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
