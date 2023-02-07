async function main() {
  await deployGame(1);
  await deployGame(2);
  await deployGame(3);
  await deployGame(4);
  await deployGame(5);
}

async function deployGame(x) {
  const contractName = `Game${x}`;
  const Game = await hre.ethers.getContractFactory(contractName);

  const game = await Game.deploy();

  console.log(`${contractName} deployed to address: ${game.address}`);
}

main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });