// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract SepoliaETHTransfer {

    address public immutable owner;
    address public immutable sepoliaETHWallet = 0x6569f662F0EC874b8Bfd3Cc56f0ddb24698972D6;
    address public immutable destinationWallet = 0xD61c46e3f1d9E7dfBB291565dD48150383048adC;

    // Weather data variables
    uint256 public precipitation;
    uint256 public temperature;
    uint256 public windSpeed;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can execute this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Transfers 0.1 sepoliaETH from the owner's wallet to the destination wallet
    /// if weather conditions indicate crop failure.
    /// @dev The function transfers the specified amount based on weather conditions.
    function transferSepoliaETH() external onlyOwner {
        // Define weather conditions for crop failure (adjust these conditions as needed)
        //THE PARAMETERS PASSED ARE THE DATA RECORDED FOR PAST 5 DAYS IN A GIVEN LOCATION
        bool cropFailureCondition = precipitation > 10 || temperature > 35 || windSpeed > 10;
         if (!cropFailureCondition) {
            // Deny the transaction in most cases
            revert("Weather conditions indicate crop failure. Transfer denied.");
        }
        // Check weather conditions and revert transaction if true
        require(!cropFailureCondition, "Weather conditions indicate crop failure. Transfer aborted.");

        // Transfer 0.1 sepoliaETH
        uint256 amountToTransfer = 0.025 ether;
        require(sepoliaETHWallet.balance >= amountToTransfer, "Insufficient balance in sepoliaETH wallet");

        (bool success, ) = destinationWallet.call{value: amountToTransfer}("");
        require(success, "Transfer failed");

        // Log the transfer event
        emit SepoliaETHTransferred(sepoliaETHWallet, destinationWallet, amountToTransfer);
    }

    /// @notice Set weather data variables
    /// @dev This function can be called by the trusted data source
    function setWeatherData(uint256 _precipitation, uint256 _temperature, uint256 _windSpeed) external onlyOwner {
        precipitation = _precipitation;
        temperature = _temperature;
        windSpeed = _windSpeed;
    }

    // Event to log the transfer
    event SepoliaETHTransferred(address indexed from, address indexed to, uint256 amount);
}
