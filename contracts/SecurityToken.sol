
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Whitelist.sol";

/**
 * @title SecurityToken
 * @dev ERC20 token that enforces compliance via an external Whitelist contract.
 * Only whitelisted addresses can participate in transfers.
 */
contract SecurityToken is ERC20, Ownable {
    Whitelist public _whitelistContract;

    /**
     * @dev Sets the initial state, including the address of the Whitelist contract.
     */
    constructor(address whitelistAddress) ERC20("SecurityToken", "STKN") Ownable(msg.sender) {
        _whitelistContract = Whitelist(whitelistAddress);
    }

    /**
     * @dev Hook that is called before any token transfer, including mint and burn.
     * This is where we enforce our compliance rules.
     *
     * Requirements:
     * - The sender (from) must be whitelisted (unless it's the 0 address during minting).
     * - The receiver (to) must be whitelisted (unless it's the 0 address during burning).
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);

        // Allow minting (from == address(0))
        if (from == address(0)) {
            require(_whitelistContract.isWhitelisted(to), "ERC20: receiver not whitelisted");
        }
        // Allow burning (to == address(0))
        else if (to == address(0)) {
            require(_whitelistContract.isWhitelisted(from), "ERC20: sender not whitelisted");
        }
        // Both parties must be whitelisted for a standard transfer
        else {
            require(_whitelistContract.isWhitelisted(from), "ERC20: sender not whitelisted");
            require(_whitelistContract.isWhitelisted(to), "ERC20: receiver not whitelisted");
        }
    }

    /**
     * @dev Creates (mints) new tokens and assigns them to an account.
     * Can only be called by the owner.
     * The _beforeTokenTransfer hook ensures the receiver is whitelisted.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
