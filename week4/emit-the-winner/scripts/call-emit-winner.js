const ethers = require('ethers');

const EMITWINNER_CONTRACT_ADDY = "0x99893D056b6A4f56c20A906fEE7da97bb2821327";
const AU_INTERACTING_CONTRACT_ADDY = "0xcF469d3BEB3Fc24cEe979eFf83BE33ed50988502";

async function main() {
  const emitWinner = await hre.ethers.getContractAt("EmitWinner", EMITWINNER_CONTRACT_ADDY );

  const tx = await emitWinner.emitWinner(AU_INTERACTING_CONTRACT_ADDY);
  console.log(tx);
  await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});