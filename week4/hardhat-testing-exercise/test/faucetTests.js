const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');
const { providers } = require('ethers');
const { ethers } = require('hardhat');

describe('Faucet', function () {
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory('Faucet');
    const faucet = await Faucet.deploy( {value: ethers.utils.parseUnits("1", "ether") });

    const [owner, addr1] = await ethers.getSigners();

    console.log('Signer 1 address: ', owner.address);
    return { faucet, owner, addr1 };
  }

  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });

  it('should not allow more than .1 eth on withdrawal', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);
    await expect(faucet.withdraw(ethers.utils.parseUnits("2", "ether"))).to.be.reverted;
  });

  it('should allow withdrawal of less that .1 ether', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);
    await expect(faucet.withdraw(ethers.utils.parseUnits(".1", "ether"))).not.be.reverted;
  });

  it('should not allow selfdestruct by anyone other than owner', async function () {
    const { faucet, owner, addr1 } = await loadFixture(deployContractAndSetVariables);
    await expect(faucet.connect(addr1).destroyFaucet()).to.be.reverted
  });

  it('should not allow withdrawAll by anyone other than owner', async function () {
    const { faucet, owner, addr1 } = await loadFixture(deployContractAndSetVariables);
    await expect(faucet.connect(addr1).withdrawAll()).to.be.reverted
  });

  it('should destroy the contract when destroyFaucet is called by owner', async function () {
    const { faucet, owner, addr1 } = await loadFixture(deployContractAndSetVariables);
    await faucet.destroyFaucet();
    let result = await ethers.provider.getCode(faucet.address);
    expect(result).to.equal("0x")
  });

  it('should send all of the ether to the caller on withdrawAll', async function () {
    const { faucet, owner, addr1 } = await loadFixture(deployContractAndSetVariables);
    let contractBalanceBefore = await ethers.provider.getBalance(faucet.address);
    let ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
    expect(contractBalanceBefore).not.to.be.eq(0);
    await faucet.withdrawAll();
    let contractBalanceAfter = await ethers.provider.getBalance(faucet.address);
    let ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
    expect(ownerBalanceAfter).to.be.gt(ownerBalanceBefore);
    expect(contractBalanceAfter).to.be.eq(0);
  });
});