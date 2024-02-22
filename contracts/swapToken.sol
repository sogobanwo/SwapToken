// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenSwap {
    // TSTATE VARIABLES
    IERC20 tokenA;
    IERC20 tokenB;
    uint exchangeRateFromTokenAtoTokenB;

    // Events
    event SwapSuccessfulFromAtoB (uint256 amountA, uint256 amountB);
    event SwapSuccessfulFromBtoA (uint256 amountB, uint256 amountA);

    // Constructor to set the ERC-20 tokens being swapped
    constructor(address _tokenA, address _tokenB, uint _rate) {

        tokenA = IERC20(_tokenA);

        tokenB = IERC20(_tokenB);

        exchangeRateFromTokenAtoTokenB = _rate;

    }

    // Function to swap tokens A for tokens B
    function swapTokenAtoB(uint256 _amountA) external {
        require(msg.sender != address(0), "address zero detected");

        require(_amountA > 0 , "Can't exchange zero amount");

        require(tokenA.balanceOf(msg.sender) >= _amountA, "Insufficient Balance");

        uint _amountB = calculateSwapAmountAtoB(_amountA);
        

        require(tokenB.balanceOf(address(this)) >= _amountB, "Not enough tokenB");

        require(tokenA.transferFrom(msg.sender, address(this), _amountA), "Transfer Not Approved");

        require(tokenB.transfer(msg.sender , _amountB), "Failed to transfer tokenB");

        emit SwapSuccessfulFromAtoB(_amountA , _amountB);

    }

    // Function to calculate the equivalent amount of tokens B based on the current exchange rate
    function calculateSwapAmountAtoB(uint256 _amountA) private view returns (uint256) {

        return _amountA * exchangeRateFromTokenAtoTokenB;

    }

    // Function to swap tokens A for tokens B
    function swapTokenBtoA(uint256 _amountB) external {

        require(msg.sender != address(0), "address zero detected");

        require(_amountB > 0 , "Can't exchange zero amount");

        require(tokenB.balanceOf(msg.sender) > _amountB, "Insufficient Balance");

        uint _amountA = calculateSwapAmountBtoA(_amountB);

        require(tokenA.balanceOf(address(this)) > _amountA , "Not enough tokenA");

        require(tokenB.transferFrom(msg.sender, address(this), _amountB), "Failed to transfer");

        require(tokenA.transfer( msg.sender , _amountA), "Failed to transfer tokenA");

        emit SwapSuccessfulFromBtoA(_amountB , _amountA);
    }

    // Function to calculate the equivalent amount of tokens A based on the current exchange rate
    function calculateSwapAmountBtoA(uint256 _amountB) private view returns (uint256) {

        return _amountB / exchangeRateFromTokenAtoTokenB;

    }

    function changeExchangeRate (uint256 _newExchangeRate) external {
        exchangeRateFromTokenAtoTokenB = _newExchangeRate;
    }
}