// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SepoliaETHTransfer {

    address public owner;
    address public sepoliaETHWallet = 0xaF440A508c70406DdDc9c66B1163b1b7aF60D720;
    address public destinationWallet = 0xEB964401eDC52c2d51141FF09E64586B5d5697a9;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can execute this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Transfers 0.1 sepoliaETH from the owner's wallet to the destination wallet.
    /// @dev The function transfers the specified amount.
    function transferSepoliaETH() external onlyOwner {
        // Transfer 0.1 sepoliaETH
        uint amountToTransfer = 1 ether;
        require(sepoliaETHWallet.balance >= amountToTransfer, "Insufficient balance in sepoliaETH wallet");

        (bool success, ) = destinationWallet.call{value: amountToTransfer}("");
        require(success, "Transfer failed");

        // Log the transfer event
        emit SepoliaETHTransferred(sepoliaETHWallet, destinationWallet, amountToTransfer);
    }

    // Event to log the transfer
    event SepoliaETHTransferred(address indexed from, address indexed to, uint amount);
}