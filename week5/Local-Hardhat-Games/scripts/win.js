// add the game address here and update the contract name if necessary
const gameAddr1 = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const gameAddr2 = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const gameAddr3 = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const gameAddr4 = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const gameAddr5 = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

async function main() {
  const tx1 = await winGame1("Game1", gameAddr1); 
  const tx2 = await winGame2("Game2", gameAddr2);
  const tx3 = await winGame3("Game3", gameAddr3);
  const tx4 = await winGame4("Game4", gameAddr4);
  const tx5 = await winGame5("Game5", gameAddr5);
}

async function winGame1(contractName, gameAddr) {
  console.log("in game 1");
  const game = await hre.ethers.getContractAt(contractName, gameAddr);

  const tx = await game.win();
  console.log("waiting on tx");
  const receipt = await tx.wait();
  console.log(receipt); 
}

async function winGame2(contractName, gameAddr) {
  const game = await hre.ethers.getContractAt(contractName, gameAddr);
  await game.setX(25);
  await game.setY(25);
  const tx = await game.win();

  const receipt = await tx.wait();
  console.log(receipt); 
}

async function winGame3(contractName, gameAddr) {
  const game = await hre.ethers.getContractAt(contractName, gameAddr);

  const tx = await game.win(45);

  const receipt = await tx.wait();
  console.log(receipt); 
}

async function winGame4(contractName, gameAddr) {
  const game = await hre.ethers.getContractAt(contractName, gameAddr);

  const tx = await game.win(56);

  const receipt = await tx.wait();
  console.log(receipt); 
}

async function winGame5(contractName, gameAddr) {
  const game = await hre.ethers.getContractAt(contractName, gameAddr);
  await game.giveMeAllowance(10000);
  await game.mint(10000);

  const tx = await game.win();

  const receipt = await tx.wait();
  console.log(receipt); 
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
