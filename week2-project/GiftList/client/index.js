const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';
const firstArg = process.argv[2];

let cliName = '';

if (firstArg === '--help' || process.argv[2] === undefined) {
  console.log('This script is for testing is someone should receive a gift or  not');
  console.log('The command is `node client/index.js <NAME TO SEARCH>`');
  process.exit;
} else {
  cliName = process.argv[2];
}

async function main() {
  const merkleTree = new MerkleTree(niceList);
  const root = merkleTree.getRoot();
  const index = niceList.findIndex(n => n === cliName);
  const proof = merkleTree.getProof(index);

  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    proof: proof,
    name: cliName
  });

  console.log({ gift });
}

main();