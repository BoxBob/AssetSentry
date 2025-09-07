
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Whitelist
 * @dev This contract is managed by an owner who can add or remove addresses
 * from a whitelist. This is used by the SecurityToken to enforce compliance.
 */
contract Whitelist is Ownable {
    // Mapping to store the whitelist status of an address
    mapping(address => bool) private _isWhitelisted;

    event AddressWhitelisted(address indexed account);
    event AddressRemovedFromWhitelist(address indexed account);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyWhitelisted(address account) {
        require(_isWhitelisted[account], "Address is not whitelisted");
        _;
    }

    /**
     * @dev Returns true if the account is whitelisted, false otherwise.
     */
    function isWhitelisted(address account) public view returns (bool) {
        return _isWhitelisted[account];
    }

    /**
     * @dev Adds an address to the whitelist. Can only be called by the owner.
     */
    function addAddress(address account) public onlyOwner {
        require(!_isWhitelisted[account], "Address already whitelisted");
        _isWhitelisted[account] = true;
        emit AddressWhitelisted(account);
    }

    /**
     * @dev Removes an address from the whitelist. Can only be called by the owner.
     */
    function removeAddress(address account) public onlyOwner {
        require(_isWhitelisted[account], "Address is not whitelisted");
        _isWhitelisted[account] = false;
        emit AddressRemovedFromWhitelist(account);
    }
}
