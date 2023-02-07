const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert, expect } = require('chai');

describe('Game4', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game4');
    const game = await Game.deploy();
    const signer = ethers.provider.getSigner(0);


    return { game, signer };
  }

  it('should be a winner', async function () {
    const { game, signer } = await loadFixture(deployContractAndSetVariables);
    
    expect(await game.win(56)).to.emit(signer.getAddress());
  });
});
