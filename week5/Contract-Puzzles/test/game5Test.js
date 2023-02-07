const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { ethers } = require('hardhat');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();
    const signer = ethers.provider.getSigner(0);


    return { game, signer };
  }
  it('should be a winner', async function () {
    const { game, signer } = await loadFixture(deployContractAndSetVariables);
    let wallet = ethers.Wallet.createRandom();
    let threshold = 0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf;
    
    while((await wallet.getAddress()) >= threshold) {
      wallet = ethers.Wallet.createRandom();
    }
    
    let newWallet = await wallet.connect(ethers.provider);
    await signer.sendTransaction({
      to: newWallet.getAddress(), 
      value: ethers.utils.parseUnits("2", "ether")
    } );

    await game.connect(newWallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
