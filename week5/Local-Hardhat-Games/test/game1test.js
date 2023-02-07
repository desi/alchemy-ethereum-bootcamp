const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert, expect } = require('chai');

describe('Game1', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game1');
    const game = await Game.deploy();
    const signer = ethers.provider.getSigner(0);


    return { game, signer };
  }

  it('should be a winner', async function () {
    const { game, signer } = await loadFixture(deployContractAndSetVariables);
    
    expect(await game.win()).to.emit(signer.getAddress());
  });
});
