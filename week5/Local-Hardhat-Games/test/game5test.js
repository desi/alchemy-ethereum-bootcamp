const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert, expect } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();
    const signer = ethers.provider.getSigner(0);


    return { game, signer };
  }

  it('should be a winner', async function () {
    const { game, signer } = await loadFixture(deployContractAndSetVariables);

    await game.giveMeAllowance(10000);
    await game.mint(10000);
    
    expect(await game.win()).to.emit(signer.getAddress());
  });
});
