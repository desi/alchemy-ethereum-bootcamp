const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game4', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game4');
    const game = await Game.deploy();
    const signer = ethers.provider.getSigner(0);
    const signer2 = ethers.provider.getSigner(1);

    return { game, signer, signer2 };
  }
  it('should be a winner', async function () {
    const { game, signer, signer2 } = await loadFixture(deployContractAndSetVariables);

    // nested mappings are rough :}
    await game.write(signer.getAddress());
    await game.win(signer.getAddress());

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
