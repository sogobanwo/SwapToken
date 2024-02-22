import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SwapToken", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployedSwapToken() {


    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const TokenA = await ethers.getContractFactory("TokenA")
    const tokenA = await TokenA.deploy(100000)

    const TokenB = await ethers.getContractFactory("TokenB")
    const tokenB = await TokenB.deploy(100000)

    const SwapToken = await ethers.getContractFactory("TokenSwap");
    const swapToken = await SwapToken.deploy(tokenA.target, tokenB.target, 10);

    return { swapToken, tokenB, tokenA, owner, otherAccount };
  }
 
  describe("SwapTokenAtoB", function() {
    it("check if the amount to be swapped is greaterThan 0", async function () {

      const { swapToken, tokenB, tokenA, owner, otherAccount } = await loadFixture(deployedSwapToken);

      await expect(swapToken.swapTokenAtoB(0)).to.be.revertedWith("Can't exchange zero amount")

    }) 

    it("check if the balance of owner is greater than the amount to be swapped", async function () {

      const { swapToken, tokenB, tokenA, owner, otherAccount } = await loadFixture(deployedSwapToken);

      await tokenA.transfer(otherAccount, 25) 

      await expect(swapToken.connect(otherAccount).swapTokenAtoB(30)).to.be.revertedWith("Insufficient Balance")
    }) 

    it ("check if the balance of contract is sufficient", async function (){

      const { swapToken, tokenB, tokenA, owner, otherAccount } = await loadFixture(deployedSwapToken);

      await tokenA.transfer(otherAccount, 25) 

      await expect(swapToken.connect(otherAccount).swapTokenAtoB(20)).to.be.revertedWith("Not enough tokenB")
    })

    it("check if Contract is approved and transfer to contract is successful", async function (){

      const { swapToken, tokenB, tokenA, owner, otherAccount } = await loadFixture(deployedSwapToken);
          
      (await tokenA.approve(swapToken.target, 2000)).wait();

      (await tokenB.transfer(swapToken.target , 50000)).wait();

      const contractBalanceOfTokenABeforeTx = await tokenA.balanceOf(swapToken.target);
      
      const contractBalanceOfTokenBBeforeTx = await tokenB.balanceOf(swapToken.target);

      (await swapToken.swapTokenAtoB(2000)).wait();

      const contractBalanceOfTokenAAfterTx = await tokenA.balanceOf(swapToken.target);

      const contractBalanceOfTokenBAfterTx = await tokenA.balanceOf(swapToken.target);

      expect(contractBalanceOfTokenAAfterTx).to.greaterThan(contractBalanceOfTokenABeforeTx);

      expect(contractBalanceOfTokenBBeforeTx).to.be.greaterThan(contractBalanceOfTokenBAfterTx);

    })
  })


  describe("SwapTokenBtoA", function() {
    it("check if the amount to be swapped is greaterThan 0", async function () {

      const { swapToken, tokenB, tokenA, owner, otherAccount } = await loadFixture(deployedSwapToken);

      await expect(swapToken.swapTokenBtoA(0)).to.be.revertedWith("Can't exchange zero amount")

    })

    it("check if the balance of owner is greater than the amount to be swapped", async function () {

      const { swapToken, tokenB, tokenA, owner, otherAccount } = await loadFixture(deployedSwapToken);

      await tokenB.transfer(otherAccount, 25) 

      await expect(swapToken.connect(otherAccount).swapTokenBtoA(30)).to.be.revertedWith("Insufficient Balance")
    }) 

    it ("check if the balance of contract is sufficient", async function (){

      const { swapToken, tokenB, tokenA, owner, otherAccount } = await loadFixture(deployedSwapToken);

      await tokenB.transfer(otherAccount, 25) 

      await expect(swapToken.connect(otherAccount).swapTokenBtoA(20)).to.be.revertedWith("Not enough tokenA")
    })

    it("check if Contract is approved and transfer to contract is successful", async function (){

      const { swapToken, tokenB, tokenA, owner, otherAccount } = await loadFixture(deployedSwapToken);
          
      (await tokenB.approve(swapToken.target, 2000)).wait();

      (await tokenA.transfer(swapToken.target , 50000)).wait();

      const contractBalanceOfTokenABeforeTx = await tokenA.balanceOf(swapToken.target);
      
      const contractBalanceOfTokenBBeforeTx = await tokenB.balanceOf(swapToken.target);

      (await swapToken.swapTokenBtoA(2000)).wait();

      const contractBalanceOfTokenAAfterTx = await tokenA.balanceOf(swapToken.target);

      const contractBalanceOfTokenBAfterTx = await tokenA.balanceOf(swapToken.target);

      expect(contractBalanceOfTokenAAfterTx).to.lessThan(contractBalanceOfTokenABeforeTx);

      expect(contractBalanceOfTokenBBeforeTx).to.be.lessThan(contractBalanceOfTokenBAfterTx);

    })
    
  })

  // describe("SwapTokenAtoB", function() {
  //   it("check if the amount to be swapped is greaterThan 0", async function () {

  //     const { swapToken, tokenB, tokenA, owner, otherAccount } = await loadFixture(deployedSwapToken);

  //     const newExchangeRate = await expect(swapToken.changeExchangeRate(2))
  //   })
    
  // })
});
